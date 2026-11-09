# Rekap Buzzer

Alat edukasi deteksi akun buzzer sosmed dari sinyal perilaku publiknya — oleh [nyawit.dev](https://nyawit.dev).

Cek umur akun, rasio following/followers, ritme posting, dan komentar berulang, lalu dapat skor buzzer 0–100 lengkap dengan rincian tiap sinyal. Semua dihitung di browser, tanpa login dan tanpa backend.

> Skor bersifat heuristik edukasi, bukan vonis final. Data contoh di repo ini fiktif.

## Fitur

- **Detektor** — form cek akun + analisis teks komentar (link, pengulangan, kata promosi), hasil bisa disalin jadi laporan
- **Rekap** — daftar akun contoh dengan filter platform/verdict, pencarian, dan export CSV
- **Cara deteksi** — panduan langkah + checklist + tautan pelaporan resmi X, Instagram, TikTok

## Tech stack

- SvelteKit 2 + Svelte 5 + Tailwind CSS 4
- `@sveltejs/adapter-static` → GitHub Pages (statis penuh, `prerender: true`)

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output: `build/`. Untuk GitHub Pages project site, build CI memakai `BASE_PATH=/rekap-buzzer`.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) → GitHub Pages:
https://nyawit-dev.github.io/rekap-buzzer/

## License

MIT
