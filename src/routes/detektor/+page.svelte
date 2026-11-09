<script lang="ts">
  import DetectorForm from '$lib/components/DetectorForm.svelte';
</script>

<h1 class="font-display font-bold text-4xl md:text-5xl">Detektor akun buzzer</h1>
<p class="mt-3 max-w-2xl text-[#e9d5ff]/85">Masukkan data profil publik dan contoh komentarnya. Skor 0–100 dihitung dari lima sinyal perilaku. Hasilnya bisa kamu salin sebagai laporan.</p>
<div class="mt-8"><DetectorForm /></div>

<section class="mt-12 bg-[#24102e] rounded-3xl p-6 border border-white/10">
  <h2 class="font-display font-bold text-2xl">Cara membaca skor</h2>
  <div class="grid md:grid-cols-4 gap-4 mt-4 text-sm">
    <div class="bg-[#17081f] rounded-2xl p-4"><strong class="text-emerald-300">0–29 · Risiko rendah</strong><p class="mt-1 text-[#e9d5ff]/80">Sinyal organik. Tetap waspada kalau ada bukti lain.</p></div>
    <div class="bg-[#17081f] rounded-2xl p-4"><strong class="text-yellow-300">30–59 · Waspada</strong><p class="mt-1 text-[#e9d5ff]/80">Ada satu-dua sinyal janggal. Cek manual lebih dalam.</p></div>
    <div class="bg-[#17081f] rounded-2xl p-4"><strong class="text-orange-300">60–79 · Dugaan buzzer</strong><p class="mt-1 text-[#e9d5ff]/80">Kombinasi sinyal kuat. Kumpulkan bukti sebelum menyimpulkan.</p></div>
    <div class="bg-[#17081f] rounded-2xl p-4"><strong class="text-[#ff8ac2]">80–100 · Sangat mungkin</strong><p class="mt-1 text-[#e9d5ff]/80">Hampir semua sinyal kena. Verifikasi manual wajib.</p></div>
  </div>
</section>
