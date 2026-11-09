import { describe, expect, it } from 'vitest';
import { analyze, analyzeText, verdictFromScore, type DetectorInput, type Platform } from './detector';
import accounts from './data/accounts.json';

const base: DetectorInput = {
  username: 'uji',
  platform: 'X',
  accountAgeDays: 365,
  followers: 1000,
  following: 100,
  postsPerDay: 1,
  repeatPercent: 10,
  commentText: ''
};

describe('skor accounts.json cocok dengan analyze() (tanpa teks komentar)', () => {
  it('ada 12 akun contoh', () => {
    expect(accounts).toHaveLength(12);
  });

  it.each(accounts)('$username: score di JSON sama dengan analyze()', (account) => {
    const result = analyze({
      username: account.username,
      platform: account.platform as Platform,
      accountAgeDays: account.ageDays,
      followers: account.followers,
      following: account.following,
      postsPerDay: account.postsPerDay,
      repeatPercent: account.repeatPercent,
      commentText: ''
    });
    expect(result.score).toBe(account.score);
  });
});

describe('clamping input numerik', () => {
  it('nilai negatif dijepit menjadi 0', () => {
    const clamped = analyze({ ...base, accountAgeDays: -100, followers: -5, following: -5, postsPerDay: -3, repeatPercent: -20 });
    const zeroed = analyze({ ...base, accountAgeDays: 0, followers: 0, following: 0, postsPerDay: 0, repeatPercent: 0 });
    expect(clamped.score).toBe(zeroed.score);
    expect(clamped.signals).toEqual(zeroed.signals);
  });

  it('repeatPercent di atas 100 dijepit menjadi 100', () => {
    const clamped = analyze({ ...base, repeatPercent: 150 });
    const capped = analyze({ ...base, repeatPercent: 100 });
    expect(clamped.score).toBe(capped.score);
    expect(clamped.signals).toEqual(capped.signals);
  });

  it('NaN dijepit menjadi 0', () => {
    const nan = analyze({ ...base, accountAgeDays: Number.NaN, followers: Number.NaN, following: Number.NaN, postsPerDay: Number.NaN, repeatPercent: Number.NaN });
    const zeroed = analyze({ ...base, accountAgeDays: 0, followers: 0, following: 0, postsPerDay: 0, repeatPercent: 0 });
    expect(nan.score).toBe(zeroed.score);
  });
});

describe('ambang verdict', () => {
  it('verdictFromScore pada batas 30/60/80', () => {
    expect(verdictFromScore(0)).toBe('Risiko rendah');
    expect(verdictFromScore(29)).toBe('Risiko rendah');
    expect(verdictFromScore(30)).toBe('Waspada');
    expect(verdictFromScore(59)).toBe('Waspada');
    expect(verdictFromScore(60)).toBe('Dugaan buzzer');
    expect(verdictFromScore(79)).toBe('Dugaan buzzer');
    expect(verdictFromScore(80)).toBe('Buzzer sangat mungkin');
    expect(verdictFromScore(100)).toBe('Buzzer sangat mungkin');
  });

  it('verdict analyze() konsisten dengan rentang skornya', () => {
    const rendah = analyze(base);
    expect(rendah.score).toBeLessThan(30);
    expect(rendah.verdict).toBe('Risiko rendah');

    const waspada = analyze({ ...base, accountAgeDays: 10, followers: 1000, following: 1500 });
    expect(waspada.score).toBeGreaterThanOrEqual(30);
    expect(waspada.score).toBeLessThan(60);
    expect(waspada.verdict).toContain('Waspada');

    const dugaan = analyze({ ...base, accountAgeDays: 10, following: 1500, postsPerDay: 6, repeatPercent: 55 });
    expect(dugaan.score).toBe(60);
    expect(dugaan.verdict).toContain('Dugaan buzzer');

    const buzzer = analyze({ ...base, accountAgeDays: 10, followers: 100, following: 1000, postsPerDay: 20, repeatPercent: 90 });
    expect(buzzer.score).toBe(90);
    expect(buzzer.verdict).toContain('Buzzer sangat mungkin');
  });
});

describe('analyzeText', () => {
  it('teks kosong menghasilkan semua nol', () => {
    expect(analyzeText('')).toEqual({ linkCount: 0, capsRatio: 0, promoHits: 0, repeatedLines: 0 });
    expect(analyzeText('   ')).toEqual({ linkCount: 0, capsRatio: 0, promoHits: 0, repeatedLines: 0 });
  });

  it('menghitung link, kata promosi, rasio kapital, dan baris berulang', () => {
    const text = 'BELI DISKON GRATIS https://a.com\nBELI DISKON GRATIS https://a.com\nBELI DISKON GRATIS https://a.com';
    const result = analyzeText(text);
    expect(result.linkCount).toBeGreaterThanOrEqual(3);
    expect(result.repeatedLines).toBe(3);
    expect(result.capsRatio).toBeGreaterThan(0.6);
    expect(result.promoHits).toBeGreaterThanOrEqual(3);
  });

  it('teks komentar bersih tidak menambah sinyal teks', () => {
    const result = analyzeText('Komentar yang santai dan bervariasi, terima kasih sudah berbagi.');
    expect(result.linkCount).toBe(0);
    expect(result.repeatedLines).toBe(0);
    expect(result.promoHits).toBe(0);
  });
});
