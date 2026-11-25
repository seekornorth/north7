# North7 — Aturan Rumah (berlaku untuk semua author)

Dokumen ini dipakai bersama oleh `north7-wulan` dan `north7-huda`. Kalau ada aturan di sini yang bentrok dengan gaya personal author, aturan rumah menang.

## Front matter

```yaml
---
title: ""
slug: ""
summary: ""
description: ""
categories: [""]
tags: []
keywords: []
authors: [""]
schema: "news"
date: 2026-01-01T00:00:00+07:00
draft: false
---
```

Field wajib: `title, slug, summary, description, categories, tags, keywords, authors, schema, date`. `summary` dan `description` boleh sama isinya, tapi tetap diisi keduanya.

- `schema: news` untuk kabar/rilis/perubahan layanan.
- `schema: tech` untuk artikel penjelasan, tutorial, atau cara kerja sesuatu. Bisa ditambah `about:` berisi `@type: Thing` + `name`.
- `featured: true` maksimal 3 artikel, hanya kalau diminta.

## Kategori

Hanya satu dari: **Teknologi**, **Linux**, **Networking**. Tidak ada kategori baru.

Kalau topik bisa masuk dua, pilih yang paling dekat dengan niat pencari:
- Cara pakai aplikasi di HP, gadget, berita produk → Teknologi
- Distro, server, terminal, systemd, package manager → Linux
- IP, DNS, firewall, VPN, routing, WiFi, tunnel → Networking

## Tag

- Pakai tag yang sudah ada di repo. Cek dulu: `ls content/posts/*/index.md | xargs grep -h "^tags:"`.
- Tag baru hanya kalau topiknya memang akan berulang, bukan sekali pakai.
- 3–5 tag per artikel. Tag pertama ikut muncul di breadcrumb, jadi taruh yang paling mewakili topik di depan.

## Tautan internal

- 1–2 tautan inline per artikel, di dalam paragraf, ke artikel North7 yang benar-benar relevan.
- Anchor berupa frasa alami, bukan "baca di sini" atau "klik di sini".
- Jangan menambah blok `> **Baca Juga:**` manual. Related content sudah otomatis dari tema (`relatedContentLimit = 3`).

## Breadcrumb

`Beranda / Kategori / Tag pertama` — jangan diubah, jangan ditambah level.

## FAQ

Setiap artikel wajib punya 5 pertanyaan di akhir dengan heading:

```markdown
## Pertanyaan yang sering muncul
```

- Pertanyaan diambil dari yang benar-benar ditanyakan orang (query Search Console, keluhan di forum, pertanyaan lanjutan yang wajar setelah membaca).
- Jawaban 2–4 kalimat. Menjawab, bukan mengulang paragraf di atas.
- Ini prasyarat `FAQPage` schema (issue #17).

## Panjang

Mengikuti materi. 700 kata padat lebih baik daripada 1.500 kata yang dipanjangkan. Jangan menambah bagian hanya untuk mencapai jumlah kata.

## Gambar

- Gambar utama ada di `content/posts/<slug>/featured.*` atau sesuai pola repo. Jangan menambah gambar stok tanpa alasan.
- Alt text menjelaskan isi gambar, bukan keyword.

## Yang tidak boleh

- Mengarang pengalaman ("sudah saya coba", "sudah saya pasang") kalau memang belum.
- Mengarang kutipan, angka, atau nama orang.
- Menyalin kalimat atau paragraf dari sumber.
- Menambah kategori atau tag baru hanya untuk SEO.
- Menulis tanggal rilis produk yang tidak ada di sumber.
- Memakai kata "ane/ente/om" di artikel Wulan, atau bahasa marketing di artikel siapa pun.
