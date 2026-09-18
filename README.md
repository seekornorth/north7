# North7 — Blog Hobi (Hugo + Blowfish)

Blog hobi berbahasa Indonesia yang menulis tentang **games, Linux, networking, dan anime**:
hero slider, seksi per niche, tab Games per platform, sidebar (Terpopuler, Iklan,
Kategori, Topik), tema Catppuccin Mocha (dark), dan SEO dasar (sitemap, JSON-LD,
OG/Twitter cards, canonical).

> Theme Blowfish dipasang sebagai **submodule** di `themes/blowfish/`.
> Jangan edit file di dalam `themes/` — semua kustomisasi ada di `layouts/`, `assets/`, `config/`, `content/`.

---

## 1. Syarat & Menjalankan Lokal

- **Hugo extended** (dipakai: `v0.166.0`). Cek: `hugo version` (harus ada tulisan `+extended`).
- **Git** (untuk submodule theme).

```bash
# Pertama kali clone (agar folder themes/blowfish ikut terisi):
git clone --recurse-submodules <url-repo>
# atau kalau sudah clone:
git submodule update --init --recursive

# Mode development (live reload). Opsi --poll menjaga reload tetap jalan:
hugo server -D --poll 700ms
# Buka http://localhost:1313/
```

> Catatan: `localhost:1313` selalu dipakai mode dev — URL produksi berasal dari `baseURL`
> dan **wajib** diganti domain asli di `config/_default/hugo.toml` (saat ini masih placeholder).

## 2. Build Produksi

```bash
hugo --minify
```

Hasilnya di folder `public/` (jangan di-commit — sudah di-`.gitignore`, dibangun ulang oleh CI).
Kalau tampilan terasa basi setelah edit, bersihkan dulu lalu build ulang:

```bash
Remove-Item public -Recurse -Force   # Windows PowerShell
hugo --minify
# + hard refresh browser (Ctrl+Shift+R), atau restart hugo server
```

## 3. Menulis Artikel Baru

```bash
hugo new posts/judul-artikel/index.md
```

File `content/posts/judul-artikel/index.md` akan terisi template (`archetypes/default.md`).
Lengkapi frontmatter-nya:

```yaml
---
title: "Judul Artikel yang Menarik dan Mengandung Keyword"
summary: "1-2 kalimat (≈150 karakter) untuk cuplikan kartu + meta description Google."
description: "Boleh sama dengan summary, dipakai untuk schema JSON-LD."
categories: ["Gaming"]   # lihat daftar kategori di bawah. Urutan PERTAMA = kategori utama
tags: ["witcher-4", "cd-projekt"]   # topik bebas, huruf kecil, tanda hubung
date: 2026-09-20
draft: false              # true = tidak tampil di situs
---
Isi artikel (Markdown) di sini...
```

Aturan main:

- **URL otomatis**: judul `Review X` → `/{review-x}/` di root (diatur `[permalinks]` di `hugo.toml`).
  Jangan pakai judul yang slug-nya tabrakan dengan halaman lain
  (`posts`, `kategori`, `topik`, `contact-us`, `privacy-policy`, `terms`, ...).
- **Sampul/cover**: taruh SATU gambar di folder artikel dengan nama mengandung
  `cover` / `feature` / `thumbnail`, mis. `content/posts/judul-artikel/cover.jpg`.
  Disarankan JPG/WebP lebar ±1600px dan < 500KB — saat build otomatis dibuatkan
  varian WebP (hero 1600px, kartu 800px, thumbnail 200px) + lazy-load.
- **Draft**: `draft: true` disembunyikan; tampilkan dengan `hugo server -D`.
- **Embed video YouTube** (ringan, facad — tidak memuat YouTube sebelum diklik):

  ```md
  {{< youtubeLite id="VIDEO_ID" label="Judul video" >}}
  ```

  Ambil `VIDEO_ID` dari URL (`youtube.com/watch?v=VIDEO_ID`). JS/CSS-nya otomatis
  dimuat hanya di halaman yang memakai shortcode ini.

## 4. Kategori & Tag

### Kategori (`categories:`) — kosakata terkontrol, huruf persis seperti ini:

| Nilai | Tampil di | URL |
|---|---|---|
| `Games` | Tab Games | `/kategori/games/` |
| `PlayStation`, `Xbox-PC`, `Nintendo`, `Gacha`, `Hardware` | Tab Games + dropdown menu | `/kategori/<slug>/` |
| `Linux` | Seksi Linux + menu | `/kategori/linux/` |
| `Networking` | Seksi Networking + menu | `/kategori/networking/` |
| `Anime` | Seksi Anime + menu | `/kategori/anime/` |
| `Ulasan` | Seksi Ulasan + menu | `/kategori/ulasan/` |
| `Fitur` | Menu | `/kategori/fitur/` |

- Kategori **pertama** = kategori utama artikel.
- Tambah kategori baru? Bisa langsung dipakai di frontmatter — halaman
  `/kategori/<slug>/`, kartu sidebar, dan breadcrumb ikut otomatis.
  (Tab Gaming homepage hanya untuk 5 platform di atas; kategori lain muncul di News.)
- URL dasar taksonomi: `/kategori/...` untuk kategori, `/topik/...` untuk tag
  (diatur `[permalinks.taxonomy]` + `[permalinks.term]` di `hugo.toml`).
  Jangan ubah tanpa memperbarui link di `layouts/` dan `menus.id.toml`.

### Tag (`tags:`) — bebas (folksonomi)

Ditampilkan di breadcrumb artikel (`wolverine / review / ...`) dan widget
**Topik Populer** (`#tag`) di sidebar. Pakai huruf kecil + tanda hubung.

## 5. Hero Slider (bagian atas homepage)

- **Manual**: tambah `featured: true` di frontmatter artikel pilihan (maksimal 3,
  yang terbaru duluan). Contoh sudah dipasang di `review-wolverine`.
- **Otomatis**: slot kosong (atau tanpa flag sama sekali) dilengkapi artikel terbaru.
- Badge slide = 2 kategori pertama artikel; judul panjang otomatis dipotong 3 baris;
  tinggi hero fix (tidak berubah-ubah).
- Navigasi: geser/swipe (HP + drag mouse), titik-titik di bawah, auto-slide 6 detik.

## 6. Struktur Homepage

Urutan section (di `layouts/index.html`):

1. Hero slider (maksimal 3 `featured`, sisanya terbaru) — full width
2. **Berita Terbaru** (6 terbaru) + sidebar kanan
3. **Games** — tab otomatis berisi 5 kategori dengan artikel terbanyak
   (di luar "Games" itu sendiri; 4 artikel per tab)
4. **Ulasan** (4) → Linux (4) → Networking (4) → Anime (4)
5. Footer site-wide (Brand, Bantuan)

Sidebar (di `layouts/partials/nrt-sidebar.html`, dipakai homepage + halaman list/kategori):

- **Terpopuler** (5 terbaru, otomatis) — **Iklan** (ganti kotak `Ruang Iklan`
  dengan script iklanmu) — **Kategori** (otomatis + jumlah artikel) —
  **Topik Populer** (otomatis dari tags).

> Prinsip anti-duplikasi: search hanya di menu atas, sosmed hanya di footer,
> newsletter tidak dipakai. Jangan tambah widget yang sudah ada di tempat lain.

## 7. Menu, Footer & Halaman Statis

- **Menu atas**: `config/_default/menus.id.toml` (`name`, `url`, `weight`, `parent` untuk dropdown).
- **Footer**: `layouts/partials/footer.html` (Brand, Jelajah, Bantuan).
- **Halaman statis** Contact / Privacy / Terms: `content/*.md` dengan `layout: info`
  (tampil minimalis: judul + isi rata tengah, tanpa sidebar/TOC/related).
- **Sosmed placeholder**: link `#` masih tersebar di
  `layouts/partials/footer.html`, `content/contact-us.md`,
  `config/_default/languages.id.toml` (author links), `data/authors/north7.json`.
  Ganti `#` dengan URL Facebook/YouTube asli North7.
- **Favicon**: `layouts/partials/favicons.html` — SVG inline (huruf N di kotak mauve).
  Untuk ganti: edit huruf/warna di data-URI itu, atau taruh `favicon.png` /
  `apple-touch-icon.png` di folder `static/` lalu sesuaikan isi partial.
- **Halaman penulis**: `data/authors/north7.json` (nama, foto `img/avatar.png`,
  bio, sosmed) → tampil di `/authors/north7/` lengkap dengan daftar artikelnya.
  Penulis baru: duplikat JSON (nama file huruf kecil semua) + isi `authors: ["id-baru"]`
  di artikelnya. Foto profil diganti lewat field `image` (file di `assets/img/`).

## 8. Warna (Catppuccin Mocha, dark dikunci)

- Skema Blowfish: `assets/css/schemes/catppuccin.css`
  (diaktifkan via `colorScheme = "catppuccin"` di `params.toml`).
- Aksen & komponen custom: variabel di `assets/css/custom.css`
  (`--nrt-red` = Mauve `#CBA6F7`, `--nrt-ink` = teks di atas aksen, dll).
- Mode terang dimatikan (toggle disembunyikan + `assets/js/appearance.js` mengunci dark),
  karena satu ramp warna tidak bisa melayani terang + gelap sekaligus.
- Favicon: huruf N di `layouts/partials/favicons.html` (SVG data-URI, tanpa file).

> Jangan pakai class Tailwind **baru** di file override `layouts/` — class yang tidak ada
> di source theme tidak ikut terkompilasi ke CSS (contoh kasus: `min-h-[84px]`).
> Untuk styling baru pakai `assets/css/custom.css` atau inline `style=""`.

## 9. SEO

Sudah aktif: `robots.txt`, `sitemap.xml`, canonical, meta description (dari `summary`),
JSON-LD (WebSite, Article, BreadcrumbList), OG/Twitter cards (gambar dari cover artikel,
fallback `defaultSocialImage`), H1 tunggal per halaman, `lang="id"`, RSS.

Yang wajib diganti sebelum go-live:

1. `baseURL` di `config/_default/hugo.toml` → domain asli (masih `https://example.com/`).
2. Ganti `cover.png` contoh (±4–5MB!) dengan gambar asli yang sudah ramping.

## 10. Deploy ke GitHub Pages

Workflow sudah siap: `.github/workflows/pages.yml`
(Hugo 0.166.0 extended, trigger `main`/`master`, URL produksi otomatis dari setting Pages).

```bash
git add -A
git commit -m "North7 site"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

Lalu di GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Setiap push berikutnya otomatis build + live.

## 11. Struktur File Kustom (cheatsheet)

```text
layouts/index.html              → homepage (hero, seksi, tab Gaming)
layouts/_default/list.html      → halaman /posts/
layouts/_default/term.html      → halaman /kategori/<x>/, /topik/<y>/
layouts/_default/terms.html     → indeks /kategori/, /topik/
layouts/_default/info.html      → halaman statis (layout: info)
layouts/partials/nrt-card.html   → kartu artikel (+nrt-img.html = gambar optimasi)
layouts/partials/nrt-sidebar.html→ sidebar
layouts/partials/footer.html    → footer site-wide
layouts/partials/breadcrumbs.html → breadcrumb artikel = tags
layouts/partials/search.html    → modal pencarian (Catppuccin)
layouts/partials/header/fixed-fill.html   → spacer header 80px (inline style!)
layouts/partials/header/components/desktop-menu.html → menu tengah + search kanan
assets/css/custom.css           → SEMUA styling custom (acuan utama: baca ini dulu)
assets/css/schemes/catppuccin.css → ramp warna Blowfish
assets/js/appearance.js         → pengunci dark mode
```

## 12. Troubleshooting

| Gejala | Penyebab & solusi |
|---|---|
| Edit tidak tampil | `hugo server` basi → restart server; browser → `Ctrl+Shift+R`; build → hapus `public/` dulu |
| Class Tailwind baru tidak berefek | Hanya class di source theme yang terkompilasi — tulis di `custom.css` |
| Gambar berat / LCP merah | Kecilkan source ke ±1600px JPG/WebP; optimasi WebP otomatis hanya mengecilkan, bukan keajaiban |
| Menu taksonomi 404 | Cek slug URL (`/kategori/`, `/topik/`) vs `url` di `menus.id.toml` |
| Tanggal Inggris | Pastikan bahasa `id` (`defaultContentLanguage`) + format `:date_long` |
| Search tidak menemukan artikel | Tunggu `index.json` ke-build; query diteruskan ke modal pencarian bawaan |
