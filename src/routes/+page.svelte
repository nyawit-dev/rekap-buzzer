<script lang="ts">
  import { base } from '$app/paths';
  import DetectorForm from '$lib/components/DetectorForm.svelte';
  import accounts from '$lib/data/accounts.json';
  import { verdictFromScore } from '$lib/detector';

  const total = accounts.length;
  const risky = accounts.filter((a) => a.score >= 60).length;
  const safe = accounts.filter((a) => a.score < 30).length;
  const avg = Math.round(accounts.reduce((s, a) => s + a.score, 0) / total);
</script>

<svelte:head>
  <title>Rekap Buzzer — Bongkar Pola Akun Buzzer dari Sinyal Perilakunya</title>
  <meta name="description" content="Rekap Buzzer: deteksi akun buzzer sosmed dari umur akun, rasio following, ritme posting, dan komentar berulang. Gratis, langsung di browser, tanpa login." />
  <meta property="og:title" content="Rekap Buzzer — Bongkar Pola Akun Buzzer dari Sinyal Perilakunya" />
  <meta property="og:description" content="Cek umur akun, rasio following, ritme posting, dan komentar berulang — jadi satu skor buzzer 0–100 yang mudah dibaca." />
  <meta property="og:type" content="website" />
</svelte:head>

<section class="py-8 md:py-14">
  <p class="text-[#ff8ac2] font-semibold">Deteksi akun buzzer sosmed — dari sinyal perilakunya</p>
  <h1 class="font-display font-bold text-5xl md:text-7xl leading-[0.95] mt-4 max-w-3xl">Rekap Buzzer,<br />bongkar polanya.</h1>
  <p class="mt-5 max-w-2xl text-lg text-[#e9d5ff]/90 leading-relaxed">Cek umur akun, rasio following, ritme posting, dan komentar berulang — semua jadi satu skor yang mudah dibaca. Gratis, jalan langsung di browser, tanpa login.</p>
  <div class="mt-7 flex gap-3 flex-wrap">
    <a href="{base}/detektor/" class="rounded-full bg-[#be185d] text-white font-bold px-6 py-3 hover:bg-[#9d174d]">Mulai deteksi</a>
    <a href="{base}/rekap/" class="rounded-full border border-white/25 px-6 py-3 font-semibold hover:bg-white/10">Lihat rekap contoh</a>
  </div>
</section>

<section class="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
  <div class="bg-[#24102e] rounded-3xl p-5 border border-white/10"><p class="font-display font-bold text-4xl text-[#ff4fa3]">{total}</p><p class="text-sm text-[#e9d5ff]/80 mt-1">akun contoh direkap</p></div>
  <div class="bg-[#24102e] rounded-3xl p-5 border border-white/10"><p class="font-display font-bold text-4xl text-[#ff4fa3]">{risky}</p><p class="text-sm text-[#e9d5ff]/80 mt-1">skor ≥ 60 (dugaan buzzer)</p></div>
  <div class="bg-[#24102e] rounded-3xl p-5 border border-white/10"><p class="font-display font-bold text-4xl text-[#ff4fa3]">{safe}</p><p class="text-sm text-[#e9d5ff]/80 mt-1">skor &lt; 30 (risiko rendah)</p></div>
  <div class="bg-[#24102e] rounded-3xl p-5 border border-white/10"><p class="font-display font-bold text-4xl text-[#ff4fa3]">{avg}</p><p class="text-sm text-[#e9d5ff]/80 mt-1">rata-rata skor contoh</p></div>
</section>

<section class="py-10">
  <h2 class="font-display font-bold text-3xl md:text-4xl">Coba detektornya langsung</h2>
  <p class="text-[#e9d5ff]/80 mt-2 max-w-2xl">Contoh ini pakai data buatan. Akun buzzer asli terlihat dari kombinasi sinyal — bukan satu tanda saja.</p>
  <div class="mt-6"><DetectorForm /></div>
</section>

<section class="py-10">
  <h2 class="font-display font-bold text-3xl md:text-4xl">Sinyal yang dicek</h2>
  <div class="grid md:grid-cols-3 gap-4 mt-6">
    <article class="bg-white text-[#2a0a38] rounded-3xl p-6"><p class="font-display font-bold text-xl text-[#be185d]">Umur akun</p><p class="mt-2 text-[#6b3a7d]">Akun berumur hitungan hari yang langsung aktif — pola rekrutmen buzzer dan bot.</p></article>
    <article class="bg-white text-[#2a0a38] rounded-3xl p-6"><p class="font-display font-bold text-xl text-[#7e22ce]">Rasio & ritme</p><p class="mt-2 text-[#6b3a7d]">Following jauh lebih besar dari followers, posting belasan kali sehari.</p></article>
    <article class="bg-white text-[#2a0a38] rounded-3xl p-6"><p class="font-display font-bold text-xl text-[#be185d]">Komentar berulang</p><p class="mt-2 text-[#6b3a7d]">Teks sama persis berulang, link promo, caps lock — template spam.</p></article>
  </div>
  <p class="mt-5 text-sm text-[#e9d5ff]/70">Data di halaman ini contoh fiktif untuk edukasi. Skor: {verdictFromScore(90)} untuk pola terburuk, {verdictFromScore(5)} untuk pola organik.</p>
</section>
