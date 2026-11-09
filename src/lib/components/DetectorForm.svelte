<script lang="ts">
  import { analyze, type DetectorInput, type DetectorResult, type Platform } from '$lib/detector';

  let username = $state('');
  let platform = $state<Platform>('X');
  let accountAgeDays = $state(0);
  let followers = $state(0);
  let following = $state(0);
  let postsPerDay = $state(0);
  let repeatPercent = $state(0);
  let commentText = $state('');
  let result = $state<DetectorResult | null>(null);
  let copied = $state(false);
  let usernameError = $state('');

  function run() {
    if (!username.trim()) {
      usernameError = 'Username wajib diisi.';
      result = null;
      return;
    }
    usernameError = '';
    const input: DetectorInput = { username: username.trim(), platform, accountAgeDays, followers, following, postsPerDay, repeatPercent, commentText };
    result = analyze(input);
    copied = false;
  }

  async function copyReport() {
    if (!result) return;
    const text = `${result.summary}\n\nSinyal:\n${result.signals.map((s) => `- ${s.label} (+${s.points}): ${s.detail}`).join('\n')}\n\nDibuat dengan Rekap Buzzer (nyawit.dev)`;
    try { await navigator.clipboard.writeText(text); copied = true; } catch { copied = false; }
  }

  function reset() { username = ''; usernameError = ''; accountAgeDays = 0; followers = 0; following = 0; postsPerDay = 0; repeatPercent = 0; commentText = ''; result = null; copied = false; }
</script>

<div class="grid lg:grid-cols-2 gap-8 items-start">
  <form novalidate class="bg-[#24102e] rounded-3xl p-6 grid gap-4 border border-white/10" onsubmit={(e) => { e.preventDefault(); run(); }}>
    <h2 class="font-display font-bold text-2xl">Cek akun sekarang</h2>
    <p class="text-sm text-[#e9d5ff]/80">Isi data dari profil publik akun yang mau dicek. Semua dihitung di browser, tidak ada data yang dikirim ke server.</p>

    <label class="grid gap-1 text-sm font-medium">Username
      <input required aria-required="true" aria-invalid={usernameError ? 'true' : undefined} aria-describedby={usernameError ? 'username-error' : undefined} class="rounded-xl bg-[#17081f] border border-white/15 px-4 py-3 text-white" placeholder="contoh: akun123" bind:value={username} oninput={() => { if (usernameError) usernameError = ''; }} />
    </label>
    {#if usernameError}
      <p id="username-error" role="alert" class="text-sm text-red-300">{usernameError}</p>
    {/if}

    <label class="grid gap-1 text-sm font-medium">Platform
      <select class="rounded-xl bg-[#17081f] border border-white/15 px-4 py-3 text-white" bind:value={platform}>
        <option>X</option><option>Instagram</option><option>TikTok</option><option>YouTube</option><option>Facebook</option>
      </select>
    </label>

    <div class="grid grid-cols-2 gap-4">
      <label class="grid gap-1 text-sm font-medium">Umur akun (hari)
        <input type="number" min="0" required placeholder="cth: 30" class="rounded-xl bg-[#17081f] border border-white/15 px-4 py-3 text-white" bind:value={accountAgeDays} />
      </label>
      <label class="grid gap-1 text-sm font-medium">Post per hari
        <input type="number" min="0" required placeholder="cth: 5" class="rounded-xl bg-[#17081f] border border-white/15 px-4 py-3 text-white" bind:value={postsPerDay} />
      </label>
      <label class="grid gap-1 text-sm font-medium">Followers
        <input type="number" min="0" required placeholder="cth: 500" class="rounded-xl bg-[#17081f] border border-white/15 px-4 py-3 text-white" bind:value={followers} />
      </label>
      <label class="grid gap-1 text-sm font-medium">Following
        <input type="number" min="0" required placeholder="cth: 1000" class="rounded-xl bg-[#17081f] border border-white/15 px-4 py-3 text-white" bind:value={following} />
      </label>
    </div>

    <label class="grid gap-2 text-sm font-medium">Persentase komentar/posting berulang: <strong>{repeatPercent}%</strong>
      <input type="range" min="0" max="100" required class="accent-[#ff4fa3]" bind:value={repeatPercent} />
    </label>

    <label class="grid gap-1 text-sm font-medium">Tempel contoh komentar (opsional)
      <textarea rows="4" class="rounded-xl bg-[#17081f] border border-white/15 px-4 py-3 text-white" placeholder="Tempel beberapa komentar akun tersebut di sini — satu per baris." bind:value={commentText}></textarea>
    </label>

    <div class="flex gap-3 flex-wrap">
      <button type="submit" class="rounded-full bg-[#ff4fa3] hover:bg-[#ff6fb5] text-white font-bold px-6 py-3">Deteksi sekarang</button>
      <button type="button" onclick={reset} class="rounded-full border border-white/20 px-6 py-3 font-semibold hover:bg-white/10">Reset</button>
    </div>
  </form>

  <section class="bg-white text-[#2a0a38] rounded-3xl p-6 lg:sticky lg:top-24" aria-live="polite">
    {#if !result}
      <h3 class="font-display font-bold text-2xl">Hasil deteksi</h3>
      <p class="mt-3 text-[#6b3a7d]">Isi form di sebelah, lalu klik <strong>Deteksi sekarang</strong>. Hasilnya muncul di sini lengkap dengan rincian tiap sinyal.</p>
      <div class="mt-6 rounded-2xl bg-[#fdf2f8] p-5 text-sm text-[#6b3a7d]">
        <strong>Ingat:</strong> skor tinggi = sinyal buzzer kuat, bukan bukti pasti. Selalu verifikasi manual sebelum menyimpulkan atau melapor.
      </div>
    {:else}
      <div class="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p class="text-xs font-bold uppercase tracking-wide text-[#a855f7]">Skor buzzer</p>
          <p class="font-display font-bold text-6xl leading-none mt-1">{result.score}<span class="text-2xl text-[#a855f7]">/100</span></p>
        </div>
        <span class="rounded-full px-4 py-2 text-sm font-bold {result.verdictClass}">{result.verdict}</span>
      </div>
      <div class="mt-4 h-4 rounded-full bg-[#f3e8ff] overflow-hidden"><div class="h-full bg-[#ff4fa3]" style="width: {result.score}%"></div></div>
      <p class="mt-4 text-sm leading-relaxed">{result.summary}</p>
      <ul class="mt-5 grid gap-3">
        {#each result.signals as s}
          <li class="rounded-2xl bg-[#fdf2f8] p-4">
            <div class="flex justify-between gap-3 font-semibold text-sm"><span>{s.label}</span><span class="text-[#ff4fa3]">+{s.points}</span></div>
            <p class="text-sm text-[#6b3a7d] mt-1">{s.detail}</p>
          </li>
        {/each}
      </ul>
      <div class="mt-5 flex gap-3 flex-wrap">
        <button onclick={copyReport} class="rounded-full bg-[#a855f7] text-white font-bold px-5 py-3 hover:bg-[#9333ea]">{copied ? 'Tersalin!' : 'Salin laporan'}</button>
      </div>
      <p class="mt-4 text-xs text-[#6b3a7d]">Ini alat bantu edukasi. Jangan jadikan satu-satunya dasar tuduhan ke orang. Laporkan hanya jika yakin, lewat fitur Report resmi platform.</p>
    {/if}
  </section>
</div>
