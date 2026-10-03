---
title: "Debian 13 “Trixie” Dapat Update Kernel, Tutup 1.313 CVE"
slug: "debian-13-update-kernel-1300-cve"
summary: "Debian 13 Trixie mendapat update kernel Linux 6.12.111-1 dengan 1.313 CVE yang ditutup. Angkanya memang besar, tapi bukan berarti semuanya celah kritis."
description: "Debian 13 Trixie mendapat update kernel Linux 6.12.111-1 dengan 1.313 CVE yang ditutup. Angkanya memang besar, tapi bukan berarti semuanya celah kritis."
categories: ["Linux"]
tags: ["linux", "debian", "security-update", "kernel-linux", "cve", "server"]
keywords: ["Update kernel Debian 13", "CVE Linux", "Debian Trixie"]
authors: ["mifthakhul-huda"]
schema: "news"
date: 2026-10-03T13:19:00+07:00
draft: false
---

Debian 13 “Trixie” baru saja mendapatkan update keamanan untuk kernel Linux 6.12 LTS. Update yang dirilis pada 29 September 2026 ini membawa kernel versi 6.12.111-1.

Yang bikin ane berhenti sebentar justru daftar CVE-nya.

Ada **1.313 CVE** yang ikut ditutup dalam update tersebut.

Kalau cuma melihat angkanya, memang kelihatan cukup bikin kaget. Tapi jangan langsung menganggap Debian tiba-tiba punya 1.313 celah kritis yang bisa dipakai buat membobol komputer.

Masalahnya memang sedikit lebih rumit dari sekadar menghitung jumlah CVE.

## Kenapa Bisa Sampai 1.313 CVE?

Salah satu alasannya ada pada cara proyek kernel Linux menangani CVE.

Dokumentasi kernel menjelaskan bahwa bugfix yang dianggap berpotensi punya dampak keamanan bisa mendapatkan nomor CVE, bahkan ketika belum ada jalur eksploit yang diketahui atau dampaknya tergolong kecil.

Jadi, satu CVE tidak otomatis berarti ada celah kritis yang bisa langsung dimanfaatkan penyerang.

Kernel Linux sendiri juga sangat besar dan punya banyak subsistem. Ada driver, filesystem, networking, arsitektur CPU, virtualisasi, sampai berbagai fitur lain yang belum tentu digunakan oleh setiap komputer.

Artinya, kalau ada masalah keamanan pada subsistem tertentu, belum tentu masalah tersebut relevan dengan mesin yang sedang ente pakai.

Ini salah satu alasan kenapa angka CVE di kernel Linux bisa kelihatan sangat besar.

## Debian Mengemas Banyak Perbaikan Sekaligus

Ada hal lain yang ikut membuat daftar CVE dalam update Debian kali ini terlihat panjang.

Debian Stable tidak selalu membuat satu advisory terpisah untuk setiap perubahan kecil yang datang dari upstream kernel. Berbagai perbaikan bisa masuk bersama ketika paket kernel Debian diperbarui.

Akibatnya, ketika ada update kernel yang membawa banyak perbaikan, daftar CVE yang ikut tertutup juga bisa langsung Panjang kalau ente penasaran bisa cek CVE apa saya yang di fix di update ini di [security advisory Debian](https://lists.debian.org/debian-security-announce/2026/maillist.html).

Jadi angka 1.313 tadi jangan dibaca sebagai “1.313 celah baru ditemukan di Debian pada hari yang sama”.

Lebih tepatnya, update tersebut membawa berbagai perbaikan keamanan kernel yang kemudian tercatat dalam advisory Debian.

## Tetap Ada Masalah Keamanan yang Perlu Diperbaiki

Walaupun angka 1.313 tadi tidak berarti semuanya kritis, bukan berarti update ini boleh dilewatkan begitu saja.

Dalam advisory-nya, Debian menyebut beberapa masalah yang dapat menyebabkan **privilege escalation**, **denial of service**, sampai **information leaks**.

Untuk Debian 13 “Trixie”, masalah-masalah tersebut diperbaiki melalui paket kernel **6.12.111-1**.

Jadi kalau ente masih menjalankan kernel Debian 13 yang lebih lama, ya sekalian saja update.

## Cara Update Kernel Debian 13

Caranya standar seperti update paket Debian pada umumnya.

Buka terminal, lalu jalankan:

`sudo apt update && sudo apt full-upgrade`

Tunggu sampai semua paket selesai diperbarui.

Kalau paket kernel baru ikut terpasang, jangan lupa **reboot**. Ini penting karena kernel yang sedang berjalan tidak akan otomatis berganti hanya karena paket kernel baru sudah terinstal.

Setelah masuk kembali ke sistem, ente bisa mengecek kernel yang sedang aktif dengan:

`uname -r`

Kalau sudah menunjukkan `6.12.111-1`, berarti kernel baru sudah digunakan.

## Jadi, Perlu Panik Melihat 1.313 CVE?

Menurut ane, nggak perlu panik cuma karena melihat angka 1.313.

Jumlah CVE memang kelihatan besar, tapi angka tersebut tidak memberi tahu kita secara langsung berapa banyak masalah yang kritis, berapa yang bisa dieksploitasi pada mesin tertentu, atau berapa yang benar-benar relevan dengan konfigurasi yang sedang digunakan.

Yang lebih penting justru jangan malas melakukan patch.

Kalau update keamanan sudah tersedia, ya pasang. Apalagi kalau Debian ente dipakai sebagai server yang menjalankan layanan penting dan terus terhubung ke jaringan.

Jadi daripada pusing melihat angka ribuannya, mending update dulu.

Setelah itu baru kalau penasaran, kita bisa ngulik CVE mana saja yang sebenarnya relevan dengan sistem yang sedang dipakai.

*Sumber: [lwn.net](https://lwn.net/Articles/1097401/), [Debian security-announce](https://lists.debian.org/debian-security-announce/2026/msg00441.html)*
