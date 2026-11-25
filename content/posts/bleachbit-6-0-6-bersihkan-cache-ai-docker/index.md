---
title: "BleachBit 6.0.6 Rilis, Bersihkan Cache AI dan Docker"
slug: "bleachbit-6-0-6-bersihkan-cache-ai-docker"
summary: "BleachBit 6.0.6 resmi meluncur dengan dukungan Ubuntu 26.10, perbaikan permission sudo, dan pembersih cache untuk Docker hingga Claude Code."
description: "BleachBit 6.0.6 resmi meluncur dengan dukungan Ubuntu 26.10, perbaikan permission sudo, dan pembersih cache untuk Docker hingga Claude Code."
categories: ["Linux"]
tags: ["bleachbit", "open-source", "linux", "ubuntu", "docker"]
keywords: ["BleachBit 6.0.6", "pembersih sistem linux", "optimasi linux"]
authors: ["mifthakhul-huda"]
schema: "news"
date: 2026-10-20T08:00:00+07:00
draft: false
---

Menjaga kapasitas penyimpanan di Linux sering kali dianggap sepele sampai partisi root atau direktori home mulai menipis karena tumpukan berkas sampah. Di kalangan pengguna distro open source, BleachBit sudah lama menjadi perkakas andalan untuk membersihkan sisa berkas sementara, cache peramban, hingga log sistem yang usang. Andrew Ziem bersama para kontributor komunitas resmi merilis BleachBit 6.0.6. Rilis pemeliharaan (*maintenance release*) ini membawa puluhan pembaruan penting, mulai dari paket instalasi untuk distribusi rilis terbaru hingga modul pembersih yang menyasar perkakas modern seperti Docker dan asisten pemrograman AI.

Kalau ente perhatikan alur pengembangan software saat ini, ruang penyimpanan di laptop maupun server dev kita makin cepat terkuras oleh cache dependensi, kontainer, dan artifak model lokal. Pembaruan 6.0.6 ini datang tepat waktu untuk merapikan ekosistem tersebut tanpa mengorbankan kestabilan sistem.

## Apa Saja yang Baru di BleachBit 6.0.6

Melihat catatan log di repositori resminya, versi 6.0.6 melibatkan kontribusi dari 37 pengembang dengan total 327 commit yang menyentuh 305 berkas kode. Kontributor XhmikosR tercatat menyumbang 135 commit untuk membenahi performa aplikasi, penataan alur integrasi berkelanjutan (CI), serta pembersihan kode lama agar lebih efisien.

Bagi pengguna distro Debian dan turunannya, rilis ini secara resmi menghadirkan paket installer `.deb` untuk Ubuntu 26.10 yang baru saja meluncur pekan lalu. Selain keluarga Ubuntu, pengguna openSUSE juga dimanjakan dengan ketersediaan paket `.rpm` untuk rilis openSUSE Leap 16.1. Tampilan visualnya pun tidak luput dari perhatian, karena BleachBit kini menyertakan ikon SVG skalabel khusus untuk Linux dan BSD. Hal ini memastikan ikon aplikasi tetap terlihat tajam di layar resolusi tinggi atau pengaturan HiDPI tanpa efek buram.

## Pembersih Khusus Docker dan Alat Coding AI

Satu hal yang paling menarik dari rilis ini adalah penyesuaian target pembersihan dengan kebutuhan pengembang masa kini. Tumpukan sampah berkas di sistem kita sekarang bukan cuma sekadar riwayat peramban web atau cache thumbnail gambar.

Pada BleachBit 6.0.6, pengembang menambahkan modul pembersih khusus untuk Helium browser dan Docker Desktop di Linux, Windows, serta macOS. Khusus Docker, modul ini tidak cuma membersihkan berkas sementara kontainer biasa, tetapi juga mampu mendeteksi dan menghapus residu data yang ditinggalkan oleh fitur asisten AI bawaan Docker.

Tidak ketinggalan, BleachBit juga memperluas dukungan pembersihan untuk Claude Code di seluruh platform. Berkas sesi terminal dan cache sementara yang kerap menumpuk di latar belakang saat ente mengulik kode kini bisa dibersihkan secara aman. Pembersihan cache GPU dan berkas status jaringan persisten (*Network Persistent State*) pada editor berbasis VS Code serta jajaran peramban berbasis Chromium juga diperluas.

Untuk pengguna Ubuntu yang mengandalkan kemasan Snap, BleachBit 6.0.6 kini lebih pintar menyisir revisi paket Snap lama yang sudah tidak aktif tanpa memicu duplikasi data di jendela pratinjau. Kalau ente sering memasang paket Snap berukuran jumbo, fitur ini sangat membantu mengembalikan beberapa gigabyte ruang kosong yang tersandera oleh cadangan revisi lama. Pembersihan untuk peramban privasi LibreWolf juga makin komplet, mencakup versi paket `.deb` tradisional maupun kemasan Flatpak.

## Peningkatan Kecepatan Wiping dan Startup Aplikasi

Bukan cuma menambah daftar modul pembersih, efisiensi eksekusi di balik layar juga dirombak cukup drastis. Andrew dan tim pengembang menerapkan strategi pemuatan lambat (*lazy import*) pada sejumlah modul Python bawaan aplikasi.

Pustaka seperti `psutil`, `minidom`, `urllib.request`, dan modul kriptografi `secrets` sekarang hanya diimpor ke memori saat fungsinya benar-benar dipanggil oleh pengguna, bukan diborong sekaligus ketika aplikasi pertama kali dibuka. Inisialisasi kotak dialog pengaturan (Preferences) juga ditunda hingga menu tersebut diklik, dan menu utama aplikasi kini hanya dimuat satu kali. Pemindaian berkas penghapusan yang tertinggal (*orphaned wipe files*) dialihkan keluar dari alur utama (off the main thread) agar antarmuka grafis tidak mengalami freeze saat startup.

Peningkatan performa yang paling signifikan terasa pada fitur penghapusan aman (*secure file wiping*). Pada versi sebelumnya, BleachBit menulis data acak menggunakan blok berukuran 4 KiB. Pada versi 6.0.6, ukuran blok dinaikkan menjadi 512 KiB. Lonjakan ukuran blok ini membuat proses penimpaan data berkas berjalan jauh lebih cepat, terutama pada media penyimpanan SSD NVMe modern yang memang dirancang optimal untuk menangani transfer blok berukuran besar. Proses pemindaian direktori saat deep scan juga dipercepat dengan memangkas pengecekan tipe path yang berulang.

## Solusi Masalah Izin Root dan pkexec di Linux

Bagi ente yang sering menjalankan BleachBit dengan hak akses administrator (*BleachBit as Administrator*) untuk membersihkan direktori sistem, rilis ini menghadirkan perbaikan penting terkait kepemilikan berkas konfigurasi.

Pada rilis versi 6.0.1 sampai 6.0.5 lalu, terdapat masalah di mana penggunaan `sudo` bisa merusak kepemilikan folder konfigurasi di direktori home pengguna biasa. Akibatnya, preferensi pengguna kerap gagal tersimpan atau memicu pesan galat akses saat aplikasi dibuka kembali tanpa hak root. BleachBit 6.0.6 kini memastikan hak kepemilikan berkas konfigurasi dan daftar kuki yang disimpan tetap berada di bawah nama akun pengguna asli.

Kalau sistem ente sempat mengalami masalah izin tersebut pada versi sebelumnya, pengembang menyarankan untuk menjalankan perintah pemulihan sederhana ini di terminal:

```bash
sudo chown -R "$USER" ~/.config/bleachbit
```

Selain perbaikan izin di atas, peluncur mode administrator di distro berbasis Red Hat seperti Fedora, AlmaLinux, dan CentOS Stream kini bermigrasi menggunakan `pkexec` (PolicyKit) untuk menggantikan utilitas lama `consolehelper` yang sudah kedaluwarsa. Tim pengembang juga merekomendasikan `pkexec` sebagai standar peluncur administrator untuk paket `.deb` di Ubuntu agar proses eskalasi privilese berjalan lebih mulus dan sesuai standar keamanan desktop modern.

Pengembang juga menyematkan imbauan keamanan penting dalam rilis kali ini. Belakangan tercatat sekitar seratus upaya penipuan di GitHub, grup Telegram, dan domain tiruan yang mencoba menyamar sebagai BleachBit untuk menyebarkan malware. Pastikan ente selalu mengunduh berkas biner langsung dari situs resmi proyek atau repositori resmi distribusi yang ente pakai, serta luangkan waktu untuk mencocokkan nilai checksum SHA256 sebelum memasangnya ke sistem.

Sumber: [BleachBit](https://www.bleachbit.org/news/bleachbit-606)
