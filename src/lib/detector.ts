export type Platform = 'X' | 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook';

export interface DetectorInput {
  username: string;
  platform: Platform;
  accountAgeDays: number;
  followers: number;
  following: number;
  postsPerDay: number;
  repeatPercent: number;
  commentText: string;
}

export interface Signal {
  label: string;
  points: number;
  detail: string;
  level: 'high' | 'medium' | 'low' | 'ok';
}

export interface DetectorResult {
  score: number;
  verdict: string;
  verdictClass: string;
  signals: Signal[];
  summary: string;
}

const PROMO_WORDS = ['promo', 'diskon', 'beli', 'klik', 'link', 'daftar', 'gratis', 'murah', 'wa', 'hubungi', 'order', 'checkout'];

export function analyzeText(text: string) {
  const t = (text || '').trim();
  if (!t) return { linkCount: 0, capsRatio: 0, promoHits: 0, repeatedLines: 0 };
  const lines = t.split('\n').map((l) => l.trim().toLowerCase()).filter(Boolean);
  const counts = new Map<string, number>();
  for (const l of lines) counts.set(l, (counts.get(l) || 0) + 1);
  let repeatedLines = 0;
  for (const c of counts.values()) if (c > 1) repeatedLines += c;
  const letters = t.replace(/[^A-Za-z]/g, '');
  const upper = letters.replace(/[^A-Z]/g, '').length;
  const linkCount = (t.match(/https?:\/\/|www\.|\.com|\.id|\.xyz|\.top/gi) || []).length;
  const lower = t.toLowerCase();
  const promoHits = PROMO_WORDS.filter((w) => lower.includes(w)).length;
  return { linkCount, capsRatio: letters.length ? upper / letters.length : 0, promoHits, repeatedLines };
}

function clampNonNegative(value: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function clampPercent(value: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

export function analyze(input: DetectorInput): DetectorResult {
  // Jepit semua input numerik agar skor tidak bisa dimanipulasi nilai negatif/NaN.
  const accountAgeDays = clampNonNegative(input.accountAgeDays);
  const followers = clampNonNegative(input.followers);
  const following = clampNonNegative(input.following);
  const postsPerDay = clampNonNegative(input.postsPerDay);
  const repeatPercent = clampPercent(input.repeatPercent);
  const commentText = input.commentText ?? '';
  const signals: Signal[] = [];
  let score = 0;
  const add = (label: string, points: number, detail: string, level: Signal['level']) => {
    score += points;
    signals.push({ label, points, detail, level });
  };

  // Umur akun
  if (accountAgeDays < 30) add('Umur akun sangat baru', 25, `${accountAgeDays} hari — akun baru yang langsung aktif ngegas itu pola umum buzzer/bot.`, 'high');
  else if (accountAgeDays < 90) add('Umur akun baru', 15, `${accountAgeDays} hari — masih di zona rawan, cek sinyal lain.`, 'medium');
  else if (accountAgeDays < 180) add('Umur akun cukup baru', 5, `${accountAgeDays} hari.`, 'low');
  else add('Umur akun aman', 0, `${accountAgeDays} hari — akun lama, sinyal ini tidak mencurigakan.`, 'ok');

  // Rasio following/followers
  const ratio = followers > 0 ? following / followers : following > 0 ? 99 : 0;
  if (ratio > 2) add('Rasio following/followers janggal', 20, `Following ${following.toLocaleString('id')} vs followers ${followers.toLocaleString('id')} (rasio ${ratio.toFixed(1)}×) — khas akun follow massal.`, 'high');
  else if (ratio > 1) add('Following lebih besar dari followers', 10, `Rasio ${ratio.toFixed(1)}× — tidak normal untuk akun organik.`, 'medium');
  else add('Rasio following/followers normal', 0, `Rasio ${ratio.toFixed(2)}×.`, 'ok');

  // Frekuensi posting
  if (postsPerDay > 10) add('Posting sangat intens', 20, `${postsPerDay} post/hari — di luar ritme manusia normal.`, 'high');
  else if (postsPerDay > 5) add('Posting intens', 10, `${postsPerDay} post/hari.`, 'medium');
  else add('Frekuensi posting wajar', 0, `${postsPerDay} post/hari.`, 'ok');

  // Pengulangan
  if (repeatPercent > 70) add('Konten sangat berulang', 25, `${repeatPercent}% komentar/posting mirip — template buzzer.`, 'high');
  else if (repeatPercent > 40) add('Ada pengulangan konten', 15, `${repeatPercent}% mirip.`, 'medium');
  else add('Konten bervariasi', 0, `${repeatPercent}% mirip — terdengar seperti manusia beneran.`, 'ok');

  // Analisis teks
  const txt = analyzeText(commentText);
  if (txt.linkCount >= 3) add('Banyak link di teks', 12, `${txt.linkCount} link terdeteksi — spam promosi.`, 'high');
  else if (txt.linkCount >= 1) add('Ada link di teks', 5, `${txt.linkCount} link terdeteksi.`, 'low');
  if (txt.repeatedLines >= 3) add('Baris teks berulang persis', 10, `${txt.repeatedLines} baris sama persis — copy-paste massal.`, 'high');
  if (txt.capsRatio > 0.6 && txt.linkCount > 0) add('Teriakan caps + link', 8, `${Math.round(txt.capsRatio * 100)}% huruf kapital — gaya spam.`, 'medium');
  if (txt.promoHits >= 3) add('Kata promosi menumpuk', 8, `${txt.promoHits} kata promosi (${PROMO_WORDS.filter((w) => commentText.toLowerCase().includes(w)).join(', ')}).`, 'medium');
  if (txt.linkCount === 0 && txt.repeatedLines === 0 && txt.promoHits === 0 && commentText.trim()) add('Teks bersih', 0, 'Tidak ada link, pengulangan, atau kata promosi mencurigakan.', 'ok');

  score = Math.min(100, Math.round(score));
  let verdict = 'Risiko rendah';
  let verdictClass = 'bg-emerald-400 text-emerald-950';
  if (score >= 80) { verdict = 'Buzzer sangat mungkin — verifikasi manual wajib'; verdictClass = 'bg-[#ff4fa3] text-white'; }
  else if (score >= 60) { verdict = 'Dugaan buzzer — perlu bukti tambahan'; verdictClass = 'bg-orange-400 text-orange-950'; }
  else if (score >= 30) { verdict = 'Waspada — ada sinyal janggal'; verdictClass = 'bg-yellow-300 text-yellow-950'; }

  const summary = `Akun @${input.username || 'tanpa-nama'} (${input.platform}) mendapat skor buzzer ${score}/100: ${verdict}. Skor ini heuristik edukasi dari sinyal perilaku, bukan vonis final.`;
  return { score, verdict, verdictClass, signals, summary };
}

export function verdictFromScore(score: number) {
  if (score >= 80) return 'Buzzer sangat mungkin';
  if (score >= 60) return 'Dugaan buzzer';
  if (score >= 30) return 'Waspada';
  return 'Risiko rendah';
}
