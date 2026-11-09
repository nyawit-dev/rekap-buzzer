<script lang="ts">
  import { base } from '$app/paths';
  let { children } = $props();
</script>

<div class="min-h-dvh flex flex-col">
  <header class="border-b border-white/10 bg-[#17081f]/90 sticky top-0 z-50 backdrop-blur">
    <div class="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
      <a href="{base}/" class="flex items-center gap-3">
        <span class="w-10 h-10 rounded-xl bg-[#be185d] grid place-items-center font-display font-bold text-white text-lg">RB</span>
        <span>
          <span class="block font-display font-bold text-lg leading-none">Rekap Buzzer</span>
          <span class="block text-xs text-[#ff8ac2] mt-1">oleh nyawit.dev</span>
        </span>
      </a>
      <nav class="flex gap-5 text-sm font-medium text-[#e9d5ff]">
        <a class="hover:text-[#ff4fa3]" href="{base}/">Beranda</a>
        <a class="hover:text-[#ff4fa3]" href="{base}/detektor/">Detektor</a>
        <a class="hover:text-[#ff4fa3]" href="{base}/rekap/">Rekap</a>
        <a class="hover:text-[#ff4fa3]" href="{base}/cara/">Cara Deteksi</a>
      </nav>
    </div>
  </header>
  <main class="flex-1 w-full max-w-6xl mx-auto px-5 py-10">
    {@render children()}
  </main>
  <footer class="border-t border-white/10 mt-10">
    <div class="max-w-6xl mx-auto px-5 py-8 flex flex-wrap justify-between gap-4 text-sm text-[#e9d5ff]/80">
      <p><strong class="text-white">Rekap Buzzer</strong> — alat edukasi deteksi buzzer sosmed. Skor bersifat heuristik, bukan vonis.</p>
      <p>Dibuat oleh <a class="text-[#ff4fa3] underline" href="https://nyawit-dev.github.io/" target="_blank" rel="noreferrer">nyawit-dev.github.io</a> · Data contoh bersifat fiktif</p>
    </div>
  </footer>
</div>
