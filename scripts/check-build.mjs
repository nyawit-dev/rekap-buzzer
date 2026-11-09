// Guard: pastikan build benar-benar menghasilkan CSS bergaya.
// Jalankan SETELAH `npm run build`. Gagal (exit 1) kalau build tanpa stylesheet.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const buildDir = 'build';
const fail = (msg) => { console.error('CHECK-BUILD GAGAL:', msg); process.exit(1); };

if (!existsSync(join(buildDir, 'index.html'))) fail('build/index.html tidak ada — build belum jalan?');

const html = readFileSync(join(buildDir, 'index.html'), 'utf8');
if (!/\.css/.test(html)) fail('build/index.html tidak memuat file .css sama sekali (app.css tidak ter-import?)');

// cari file css di build
function findCss(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...findCss(p));
    else if (e.name.endsWith('.css')) out.push(p);
  }
  return out;
}
const cssFiles = findCss(buildDir);
if (cssFiles.length === 0) fail('tidak ada file .css di folder build/');
const largest = cssFiles.map((f) => ({ f, size: statSync(f).size })).sort((a, b) => b.size - a.size)[0];
if (largest.size < 5000) fail(`file css terlalu kecil (${largest.size} byte) — Tailwind kemungkinan tidak jalan`);
const css = readFileSync(largest.f, 'utf8');
if (!css.includes('--plum') && !css.includes('17081f')) fail('css tidak mengandung style kustom app.css (--plum)');
if (!/\.bg-/.test(css)) fail('css tidak mengandung utility Tailwind (.bg-*)');

console.log(`CHECK-BUILD OK: ${cssFiles.length} file css, terbesar ${largest.f} (${largest.size} byte)`);
