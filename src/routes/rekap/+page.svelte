<script lang="ts">
  import accounts from '$lib/data/accounts.json';
  import { verdictFromScore } from '$lib/detector';

  let query = $state('');
  let platform = $state('Semua');
  let verdict = $state('Semua');

  const platforms = ['Semua', ...new Set(accounts.map((a) => a.platform))];
  const verdicts = ['Semua', 'Risiko rendah', 'Waspada', 'Dugaan buzzer', 'Buzzer sangat mungkin'];

  let filtered = $derived(accounts.filter((a) =>
    (platform === 'Semua' || a.platform === platform) &&
    (verdict === 'Semua' || verdictFromScore(a.score) === verdict) &&
    a.username.toLowerCase().includes(query.toLowerCase())
  ));

  function exportCsv() {
    const rows = [['username','platform','followers','following','ageDays','postsPerDay','repeatPercent','score','verdict','lastChecked']];
    for (const a of filtered) rows.push([a.username, a.platform, String(a.followers), String(a.following), String(a.ageDays), String(a.postsPerDay), String(a.repeatPercent), String(a.score), verdictFromScore(a.score), a.lastChecked]);
    const csv = rows.map((r) => r.map((c) => `"${c.replaceAll('"','""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'rekap-buzzer.csv'; link.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head>
  <title>Rekap Akun Buzzer (Contoh) — Rekap Buzzer</title>
  <meta name="description" content="Rekap contoh akun buzzer dengan filter platform dan verdict, pencarian username, dan export CSV. Semua data fiktif untuk edukasi." />
  <meta property="og:title" content="Rekap Akun Buzzer (Contoh) — Rekap Buzzer" />
  <meta property="og:description" content="Daftar akun contoh hasil pengecekan dengan skor dan verdict — filter, cari, dan export CSV. Data fiktif, bukan akun asli." />
  <meta property="og:type" content="website" />
</svelte:head>

<h1 class="font-display font-bold text-4xl md:text-5xl">Rekap akun buzzer</h1>
<p class="mt-3 max-w-2xl text-[#e9d5ff]/85">Daftar contoh fiktif hasil pengecekan. Semua username di sini <strong>bukan akun asli</strong> — dibuat untuk menunjukkan format rekap dan cara membaca polanya.</p>

<div class="mt-8 grid md:grid-cols-4 gap-4">
  <input class="md:col-span-2 rounded-2xl bg-[#24102e] border border-white/15 px-4 py-3" placeholder="Cari username…" bind:value={query} />
  <select class="rounded-2xl bg-[#24102e] border border-white/15 px-4 py-3" bind:value={platform}>
    {#each platforms as p}<option value={p}>{p}</option>{/each}
  </select>
  <select class="rounded-2xl bg-[#24102e] border border-white/15 px-4 py-3" bind:value={verdict}>
    {#each verdicts as v}<option value={v}>{v}</option>{/each}
  </select>
</div>

<div class="mt-5 flex justify-between items-center flex-wrap gap-3">
  <p class="text-sm text-[#e9d5ff]/80">Menampilkan {filtered.length} dari {accounts.length} akun contoh</p>
  <button onclick={exportCsv} class="rounded-full bg-[#be185d] text-white font-bold px-5 py-2.5 hover:bg-[#9d174d]">Export CSV</button>
</div>

<div class="mt-5 grid gap-4">
  {#each filtered as a}
    <article class="bg-white text-[#2a0a38] rounded-3xl p-5 grid md:grid-cols-[1fr_auto] gap-4">
      <div>
        <p class="font-display font-bold text-xl">@{a.username} <span class="text-sm font-semibold text-[#7e22ce]">· {a.platform}</span></p>
        <p class="text-sm text-[#6b3a7d] mt-1">{a.followers.toLocaleString('id')} followers · {a.following.toLocaleString('id')} following · umur {a.ageDays} hari · {a.postsPerDay} post/hari · {a.repeatPercent}% berulang</p>
        <p class="text-sm mt-2">{a.note}</p>
        <p class="text-xs text-[#6b3a7d] mt-2">Terakhir dicek: {a.lastChecked}</p>
      </div>
      <div class="text-right">
        <p class="font-display font-bold text-4xl text-[#be185d]">{a.score}</p>
        <p class="text-sm font-semibold">{verdictFromScore(a.score)}</p>
      </div>
    </article>
  {/each}
  {#if filtered.length === 0}
    <p class="bg-[#24102e] rounded-3xl p-6 text-[#e9d5ff]/80">Tidak ada akun yang cocok dengan filter. Coba ubah kata kunci atau filter.</p>
  {/if}
</div>
