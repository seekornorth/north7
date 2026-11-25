---
title: "Parrot OS 7.4 Rilis, Bawa AnonSurf 6, ISO x86-64-v3, dan Log Update yang Nggak Langsung Hilang"
slug: "parrot-os-7-4-rilis-fitur-baru"
metaTitle: "Parrot OS 7.4 Rilis, Bawa AnonSurf 6 dan ISO x86-64-v3"
summary: "Parrot OS 7.4 resmi dirilis dengan AnonSurf 6, ISO x86-64-v3, pembaruan tool security, dan Parrot Updater 2.2.0."
description: "Parrot OS 7.4 resmi dirilis dengan AnonSurf 6, ISO x86-64-v3, pembaruan tool security, dan Parrot Updater 2.2.0."
categories: ["Linux"]
tags: ["parrot-os", "linux", "distro-linux", "penetration-testing", "debian", "open-source", "sysadmin"]
keywords: ["Parrot OS 7.4"]
authors: ["mifthakhul-huda"]
schema: "news"
date: 2026-10-05
draft: false
---

ParrotSec baru saja merilis Parrot OS 7.4 sebagai pembaruan terbaru dari seri Parrot 7.

Kalau melihat nomor versinya, memang kelihatan seperti update biasa. Tapi setelah ane lihat daftar perubahannya, ada beberapa bagian yang cukup menarik. Salah satunya adalah munculnya ISO yang dioptimalkan untuk CPU dengan arsitektur **x86-64-v3**, kemudian AnonSurf yang naik ke versi 6, sampai perubahan kecil di Parrot Updater yang menurut ane justru cukup berguna sehari-hari.

Parrot OS 7.4 sendiri masih menggunakan basis Debian Trixie dan membawa berbagai pembaruan paket serta tool keamanan.

## Parrot OS 7.4 Masih Berbasis Debian Trixie

Parrot OS 7.4 tetap dibangun di atas basis Debian Trixie. Rilis ini membawa sinkronisasi pembaruan dari repositori Debian sekaligus pembaruan paket yang digunakan Parrot.

Untuk desktop, Parrot masih melanjutkan penggunaan **KDE Plasma** sebagai lingkungan desktop utamanya. Sementara itu, pengguna yang lebih suka desktop ringan tetap bisa memilih varian seperti MATE, LXQt, dan Enlightenment.

Jadi dari sisi konsep, Parrot OS 7.4 bukan perubahan besar dari Parrot 7 sebelumnya. Ini lebih ke pembaruan sistem sekaligus penyegaran berbagai komponen di dalamnya.

## Parrot OS 7.4 Punya ISO x86-64-v3 untuk CPU Modern

Bagian yang menurut ane paling menarik justru ada di image instalasinya.

Parrot OS 7.4 sekarang menyediakan ISO yang dioptimalkan untuk **x86-64-v3**. Ada juga build yang ditujukan untuk perangkat ARM64 dengan optimasi ARMv8.2.

x86-64-v3 sendiri merupakan level fitur CPU yang membutuhkan sejumlah instruksi tambahan dibanding baseline x86-64 lama. Di dalamnya termasuk dukungan instruksi seperti AVX dan AVX2.

Artinya, image tersebut memang ditujukan untuk perangkat yang relatif modern.

Jadi kalau ente punya PC atau laptop lama, jangan asal mengambil ISO x86-64-v3 hanya karena versinya terlihat lebih baru. Build seperti ini memang dibuat dengan asumsi CPU sudah mendukung fitur instruksi yang dibutuhkan.

Menariknya, pendekatan seperti ini menunjukkan bahwa distro Linux mulai punya ruang untuk menyediakan build yang lebih spesifik daripada sekadar mempertahankan kompatibilitas dengan hardware lawas selama mungkin.

## AnonSurf 6 Hadir di Parrot OS 7.4

Parrot juga memperbarui **AnonSurf**, tool yang menjadi salah satu bagian dari fitur privasi di distro ini.

Di Parrot OS 7.4, AnonSurf sudah masuk versi **6.0.1**, bersama pembaruan modul Rocket 2.0.

Selain AnonSurf, beberapa tool yang biasa digunakan untuk kebutuhan security dan penetration testing juga mendapatkan pembaruan versi.

Beberapa di antaranya adalah:

- Metasploit Framework 6.5.4
- Ligolo-ng 0.9.1
- Certipy 5.1.0
- airgeddon 12.02
- bettercap 2.41.7
- Kismet 2025.09.R1
- dnsx 1.3.0
- hakrawler 2.1
- jadx 1.5.5

Ada juga pembaruan pada **mcpwn**, server MCP yang digunakan Parrot untuk menjalankan berbagai tool keamanan. Pengembang menambahkan beberapa pengaturan baru seperti batas output preview, timeout per-tool, dan konfigurasi exit code.

## Parrot Updater 2.2.0 Bikin Log Update Tetap Terlihat

Nah, ini mungkin bukan fitur yang terdengar besar, tapi justru cukup masuk akal buat pengguna sehari-hari.

Parrot OS 7.4 membawa **Parrot Updater 2.2.0**. Salah satu perubahan yang dibawa versi ini adalah output log terminal tidak langsung menghilang setelah proses update selesai.

Sebelumnya, jendela updater bisa langsung tertutup setelah proses selesai. Kalau ada pesan tertentu selama proses update, pengguna harus mencari lagi informasi tersebut dari log sistem.

Sekarang output-nya tetap terbuka dan bisa di-scroll.

Buat yang pernah menjalankan update lalu tiba-tiba bertanya, "Tadi ada error atau nggak ya?", perubahan kecil seperti ini lumayan membantu. Kita bisa langsung melihat kembali apa saja yang terjadi selama proses upgrade.

## Parrot OS 7.4 Juga Memperbarui Aplikasi dan Image Instalasi

Selain komponen utama tadi, Parrot juga memperbarui beberapa bagian lain dari sistem.

Aplikasi **Discovery** kini ikut disertakan langsung dalam ISO builder untuk membantu pengguna baru saat pertama kali menyiapkan sistem.

Untuk pengguna Mac dengan Apple Silicon yang menjalankan Parrot melalui virtual machine, tersedia juga image VM yang secara khusus menargetkan arsitektur AArch64 melalui hypervisor UTM.

Parrot juga menyediakan berbagai image lain, termasuk versi live, container Docker, virtual machine, WSL, Raspberry Pi, hingga RISC-V.

## Cara Update Parrot OS ke Versi 7.4

Kalau ente sudah menggunakan Parrot OS, nggak perlu install ulang hanya untuk mendapatkan pembaruan ini.

Cukup buka terminal dan jalankan:

```bash
sudo apt update && sudo apt full-upgrade
```

Setelah proses selesai, sebaiknya perhatikan output yang muncul. Terutama kalau ada paket yang membutuhkan konfigurasi tambahan atau proses reboot.

Sementara kalau ente ingin memasang Parrot OS dari awal, ISO Parrot OS 7.4 tersedia dalam edisi **Security** dan **Home**, dengan beberapa image yang disesuaikan untuk kebutuhan perangkat berbeda.

## Parrot OS 7.4 Cocok Buat Siapa?

Kalau melihat perubahan yang dibawa, Parrot OS 7.4 masih mempertahankan identitasnya sebagai distro yang banyak digunakan untuk kebutuhan security, privacy, dan penetration testing.

Yang menarik justru bukan adanya perubahan besar pada tampilan atau konsep distro, tetapi beberapa keputusan teknis di balik rilis ini.

ISO x86-64-v3 misalnya, menunjukkan bahwa Parrot mulai menyediakan image yang lebih spesifik untuk hardware modern. Sementara pembaruan AnonSurf dan berbagai security tools memang lebih dekat dengan kebutuhan utama pengguna Parrot.

Dan buat pengguna lama, perubahan di Parrot Updater mungkin malah terasa lebih berguna daripada fitur yang terdengar lebih besar.

Menurut ane, Parrot OS 7.4 memang bukan rilis yang mengubah semuanya. Tapi ada cukup banyak perubahan kecil yang membuat update kali ini tetap menarik untuk diperhatikan.

Sumber: [ParrotSec Release Announcement](https://parrotsec.org/blog/2026-10-03-parrot-7.4-release-notes/)
