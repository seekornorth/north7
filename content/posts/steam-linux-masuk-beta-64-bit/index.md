---
title: "Steam Linux Masuk Beta 64-bit dan Berjalan di Container"
slug: "steam-linux-masuk-beta-64-bit"
summary: "Valve merilis pembaruan Steam Client Beta di Linux dengan binary 64-bit murni dan berjalan di dalam container runtime steamrt3c. Ini detail teknisnya."
description: "Valve merilis pembaruan Steam Client Beta di Linux dengan binary 64-bit murni dan berjalan di dalam container runtime steamrt3c. Ini detail teknisnya."
categories: ["Linux"]
tags: ["steam", "linux", "gaming-linux", "valve", "container"]
keywords: ["Steam Linux 64-bit", "Steam Client Beta Linux", "steamrt3c container"]
authors: ["mifthakhul-huda"]
schema: "news"
date: 2026-10-17
draft: false
---

Kalau ente sudah lama main game di Linux, ente pasti tahu kalau aplikasi Steam client punya satu keunikan yang bertahan belasan tahun. Meskipun sistem operasi dan prosesor kita sudah 64-bit murni, aplikasi Steam-nya sendiri masih merupakan aplikasi 32-bit lawas.

Kondisi ini sering kali bikin repot saat proses instalasi awal. Kita terpaksa memasang tumpukan library multiarch 32-bit di distro seperti Debian, Ubuntu, atau Arch hanya supaya aplikasi Steam bisa terbuka.

Kabar baiknya, Valve akhirnya mulai mengambil langkah besar untuk memodernisasi fondasi aplikasi mereka. Pada pembaruan Steam Client Beta terbaru, Valve resmi mengalihkan client Steam di Linux ke binary 64-bit dan menjalankannya langsung di dalam container runtime.

## Kenapa Harus Masuk Container

Selama ini, Steam di Linux berjalan dengan metode yang agak rumit. Valve memakai mekanisme tumpukan library bernama Steam Runtime yang ditempelkan di atas library sistem milik distro.

Masalahnya, pendekatan menumpuk library seperti itu punya kelemahan teknis. Skema tersebut hanya bekerja mulus kalau library sistem operasi host versinya lebih baru daripada Steam Runtime. Begitu ada distro yang memakai kombinasi paket berbeda atau library yang bentrok, aplikasi Steam rawan mengalami gangguan tampilan atau gagal booting.

Di versi beta terbaru ini, Valve mengubah total alurnya. Client Steam sekarang berjalan di dalam container khusus bernama steamrt3c, yang merupakan varian dari Sniper Runtime.

Container ini dibangun dengan perkakas internal Valve bernama pressure-vessel. Kalau ente sering main game Windows lewat Proton di Steam, teknologi ini sebenarnya persis dengan container yang selama ini dipakai untuk mengisolasi game. Bedanya, sekarang giliran aplikasi Steam-nya sendiri yang dimasukkan ke dalam bilik isolasi tersebut.

Dengan berjalan di dalam container independen, Steam membawa set library sendiri yang seragam di semua distro. Mau dipasang di Fedora yang serba mutakhir, Debian yang stabil, atau Arch yang rolling release, lingkungan kerja Steam bakal terasa jauh lebih konsisten tanpa pusing memikirkan konflik library host.

## Apakah Library 32-bit Sudah Benar Ditinggalkan

Nah, ini bagian penting yang jangan sampai bikin salah paham.

Meskipun binary aplikasi Steam-nya sudah 64-bit, Valve menegaskan bahwa sistem Linux ente tetap membutuhkan driver grafis dan library kompatibilitas 32-bit. Sistem operasi yang 64-bit murni tanpa dukungan multiarch masih masuk kategori belum didukung (unsupported).

Kenapa masih butuh 32-bit? Jawabannya ada pada ribuan game di katalog Steam itu sendiri.

Banyak game klasik zaman dulu, termasuk judul-judul game Windows lawas yang berjalan lewat Proton, dikompilasi pada era 32-bit. Supaya game-game tersebut tetap bisa bersuara, merender grafis, dan menerima input stik kontroler, container runtime Steam masih menyediakan paket i386 di dalamnya dan tetap meminjam driver grafis 32-bit dari host.

Jadi tujuannya bukan langsung mematikan kompatibilitas game lama, melainkan memodernisasi aplikasi client-nya terlebih dahulu agar tidak terus-menerus membebani sistem utama.

## Perbaikan Bug Updater dan Fitur Tambahan

Selain perombakan arsitektur besar tadi, pembaruan beta ini juga membereskan beberapa keluhan yang belakangan sering muncul.

Salah satunya adalah bug jendela updater yang kadang macet atau tidak mau muncul saat Steam sedang mengunduh pembaruan di latar belakang. Valve juga menyematkan fitur baru bernama Achievement Sets untuk merapikan tampilan daftar pencapaian di halaman profil game.

## Cara Mencoba Versi Beta

Buat ente yang penasaran mencicipi Steam 64-bit ini di distro Linux harian, caranya cukup mudah dan tidak perlu mengunduh installer terpisah:

1. Buka aplikasi Steam di desktop Linux ente.
2. Klik menu Steam di pojok kiri atas, lalu buka Settings.
3. Masuk ke tab Interface, lalu cari bagian Client Beta Participation.
4. Ubah pengaturannya menjadi Steam Beta Update.
5. Klik Restart Now saat Steam meminta untuk memuat ulang aplikasi.

Setelah restart, Steam bakal mengunduh komponen container steamrt3c dan beralih ke binary baru. Kalau di tengah jalan ente menemukan keanehan atau bug grafis, Valve membuka kanal laporan bug resmi di halaman Interface tersebut.

Langkah Valve membawa Steam client ke arsitektur 64-bit berbasis container ini jelas angin segar buat masa depan gaming di Linux, apalagi ekosistem desktop Linux sekarang makin banyak diadopsi untuk perangkat handheld dan PC mini.

Sumber: [Steam Community](https://steamcommunity.com/groups/SteamClientBeta/announcements/detail/703282384630448403)
