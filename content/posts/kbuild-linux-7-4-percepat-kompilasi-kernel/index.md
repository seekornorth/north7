---
title: "Kbuild Linux 7.4 Pangkas Waktu Kompilasi Kernel 36 Persen"
slug: "kbuild-linux-7-4-percepat-kompilasi-kernel"
summary: "Linux 7.4 resmi menerima rombakan Kbuild dari Lorenzo Stoakes, mempercepat kompilasi kernel hingga 36 persen dan build inkremental 70 persen."
description: "Linux 7.4 resmi menerima rombakan Kbuild dari Lorenzo Stoakes, mempercepat kompilasi kernel hingga 36 persen dan build inkremental 70 persen."
categories: ["Linux"]
tags: ["linux", "kernel", "kbuild", "kompilasi", "open-source"]
keywords: ["Kbuild Linux 7.4", "kompilasi kernel Linux", "waktu build kernel"]
authors: ["mifthakhul-huda"]
schema: "news"
date: 2026-10-22T08:00:00+07:00
draft: false
---

Kalau ente pernah mengompilasi kernel Linux dari kode sumber, pasti akrab dengan ritual menunggu proses `make` sampai selesai. Kipas pendingin laptop langsung berputar kencang, utilitas CPU melonjak seratus persen di semua core, dan kita biasanya melipir sejenak untuk bikin kopi. Di atas kertas, prosesor modern dengan puluhan core dan memori super kencang mestinya sanggup melahap baris kode C dalam sekejap. Namun pada kenyataannya, proses kompilasi kernel sering kali tersendat di beberapa tahapan ganjil yang hanya memanfaatkan satu core prosesor saja.

Kabar baik datang bagi siapa saja yang rutin berkutat dengan dapur pacu sistem operasi ini. Linus Torvalds baru saja menggabungkan rangkaian patch Kbuild untuk rilis kernel Linux 7.4. Rombakan yang diajukan oleh Nathan Chancellor dan sebagian besar dirancang oleh engineer Arm, Lorenzo Stoakes, ini berfokus membenahi berbagai hambatan single-threaded yang sudah bertahun-tahun mengendap di sistem build kernel. Hasil pengujian menunjukkan waktu kompilasi bersih terpangkas hingga 36 persen, sementara kompilasi inkremental melonjak jauh lebih gesit hingga 70 persen.

## Sumbatan Single Thread yang Selama Ini Mengintai

Bagi pengembang yang sehari-hari mengubah satu atau dua baris kode di driver lalu menjalankan kompilasi ulang, jeda waktu beberapa menit terasa sangat menyiksa. Selama bertahun-tahun, kita terbiasa menambahkan argumen `-j$(nproc)` dengan harapan semua core CPU bekerja maksimal dari awal sampai akhir.

Masalahnya, proses kompilasi kernel bukan cuma urusan memanggil compiler GCC atau Clang untuk mengubah file `.c` menjadi file objek `.o`. Di balik layar, ada alur pipa panjang bernama Kbuild yang bertugas menyatukan simbol, memeriksa kompatibilitas flag toolchain, mengurutkan tabel data, hingga memadatkan berkas biner final menjadi `vmlinux` atau `bzImage`.

Di titik-titik persimpangan inilah Kbuild kerap kehilangan tenaga paralelnya. Ada bagian skrip yang ditulis memakai bahasa shell dan awk puluhan tahun lalu, ada proses penyortiran simbol yang sebenarnya tidak diperlukan, serta pengecekan kemampuan compiler yang dijalankan berulang-ulang setiap kali Make masuk ke subdirektori baru. Ketika satu thread sedang sibuk memproses baris teks secara serial, puluhan core prosesor lainnya hanya bisa menganggur menunggu giliran.

## Rincian Perubahan Kunci di Kbuild Linux 7.4

Rangkaian patch yang masuk ke pohon kode utama Linux 7.4 ini tidak mengubah arsitektur fundamental kernel saat berjalan di mesin ente, melainkan merapikan alur kerja perkakas pembangunnya. Kalau kita bedah daftar perubahannya di milis LKML, ada sebelas patch penting yang disumbangkan Lorenzo Stoakes dengan pendekatan yang sangat jitu.

Berikut rincian optimalisasi teknis yang diterapkan pada Kbuild versi anyar ini:

- **Reimplementasi mksysmap ke Bahasa C:** Skrip legendaris `scripts/mksysmap` yang selama puluhan tahun mengandalkan bash dan awk kini resmi dipensiunkan. Penggantinya adalah berkas biner C bernama `scripts/kallsyms-sysmap.c`. Langkah ini melenyapkan overhead pemanggilan subproses shell yang lambat saat membedah tabel simbol kernel.
- **Optimasi Tabel Simbol kallsyms:** Penanganan `kallsyms` kini mengindeks simbol berdasarkan token demi mempercepat kompresi. Selain itu, datanya langsung ditulis ke disk dalam format biner dan dipanggil oleh assembler menggunakan direktif `.incbin`, alih-alih dicetak menjadi teks assembly berukuran raksasa.
- **Peniadaan Alokasi Modinfo:** Bagian `.modinfo` kini tidak lagi dialokasikan secara boros di dalam memori berkas inti `vmlinux`. Hal ini memangkas jejak data perantara dan meringankan beban linker.
- **Penghapusan Sortir Simbol yang Mubazir:** Proses pemanggilan `nm` tidak lagi dipaksa melakukan pengurutan teks pada tahapan yang urutan datanya sama sekali tidak berpengaruh pada hasil akhir.
- **Relokasi Selektif pada Tahap Akhir:** Penanganan relokasi biner kini hanya dijalankan pada proses linking final `vmlinux`, bukan di setiap tahapan penghubung perantara.
- **Penyimpanan Cache Opsi Compiler:** Pengecekan argumen compiler dan linker (`cc-option` serta `ld-option`) yang sebelumnya dieksekusi berulang kali oleh Make kini dipindahkan ke tahap konfigurasi awal Kconfig melalui `scripts/Kconfig.toolchain`. Hasil dukungannya langsung disimpan dalam variabel konfigurasi sehingga Make tidak perlu menguji ulang flag yang sama di setiap folder.
- **Dukungan Kompresi Paralel pigz:** Jika sistem host memiliki utilitas `pigz` (Parallel Implementation of GZip), Kbuild secara otomatis memanfaatkannya untuk memadatkan image kernel menggunakan seluruh thread CPU yang tersedia, menggantikan `gzip` standar yang bekerja secara single thread.

## Lompatan Efisiensi di Atas Meja Uji

Kombinasi dari pemangkasan skrip serial dan pemanfaatan instruksi biner C ini memberikan dampak yang sangat terasa di dunia nyata. Lorenzo Stoakes dan komunitas pengembang kernel mencatatkan perbaikan waktu yang cukup konsisten di berbagai konfigurasi mesin, baik pada sistem berbasis arsitektur x86_64 maupun AArch64.

| Skenario Pengujian Build | Sebelum Patch Kbuild | Setelah Patch Kbuild 7.4 | Peningkatan Efisiensi |
|---|---|---|---|
| Kompilasi Penuh (Clean Build) | Baseline standar Make | Terpangkas ~36 persen | Lebih hemat sepertiga waktu |
| Kompilasi Ulang Inkremental | Membaca ulang simbol serial | Terpangkas ~70 persen | Siklus iterasi koding instan |
| Pemrosesan Simbol kallsyms | Skrip awk dan teks raksasa | Biner C dan direktif incbin | Overhead I/O turun drastis |
| Kompresi Image Kernel | Gzip tunggal satu core | Kompresi multi-core pigz | Selesai dalam hitungan detik |

Angka di atas menunjukkan bahwa waktu siklus kompilasi bersih bisa berkurang sekitar sepertiga dari durasi biasanya. Namun bagi ane pribadi, lompatan terbesar yang paling berdampak adalah pada kompilasi inkremental. Penurunan durasi hingga 70 persen saat menguji perubahan kecil membuat alur kerja pengembang terasa seperti mengompilasi program aplikasi biasa, bukan sistem operasi berukuran jutaan baris kode.

Bahkan dalam pengujian di mesin server berdaya komputasi tinggi seperti AMD EPYC dengan puluhan core fisik, durasi kompilasi kernel kini sudah sangat mendekati ambang batas sepuluh detik. Hambatan yang selama ini membuat prosesor kelas monster harus mengantre di satu core akhirnya berhasil disingkirkan.

## Dampak Nyata untuk Sysadmin dan Komunitas

Lalu apa untungnya rombakan ini bagi kita yang mungkin tidak setiap hari mengedit kode sumber kernel Linux? Dampaknya ternyata jauh lebih luas dari sekadar kenyamanan segelintir pengembang inti.

Pertama, para pengguna distribusi Linux dengan model perakitan paket lokal seperti Gentoo atau pegiat kernel kustom di Arch Linux dan Fedora akan langsung merasakan penghematan waktu tunggu yang signifikan saat memperbarui sistem. Waktu CPU yang terbuang percuma kini bisa ditekan, konsumsi listrik saat mesin bekerja penuh berkurang, dan temperatur perangkat keras tetap lebih terjaga.

Kedua, infrastruktur integrasi berkelanjutan (CI/CD) yang menguji ribuan patch kernel setiap hari akan menikmati penghematan sumber daya komputasi yang masif. Di tingkat korporasi penyedia layanan cloud, memangkas waktu build hingga puluhan persen berarti menghemat ribuan jam komputasi server virtual setiap bulannya.

Ketiga, modul pihak ketiga yang mengandalkan DKMS (Dynamic Kernel Module Support), seperti driver grafis NVIDIA atau modul sistem berkas ZFS, bakal terpasang lebih cepat saat sistem operasi melakukan pembaruan kernel rutin di latar belakang. Proses instalasi paket update di terminal tidak lagi terasa membeku lama saat tahapan kompilasi modul berlangsung.

Langkah pengembang kernel membenahi sumbatan teknis di tingkat pipa pembangun ini menjadi bukti bahwa optimalisasi performa tidak melulu soal menambahkan fitur baru yang terdengar mentereng. Menyingkirkan skrip lama yang boros resource dan memaksimalkan setiap siklus prosesor modern sering kali memberikan manfaat yang jauh lebih nyata bagi rutinitas harian kita di depan layar terminal.

Sumber: [Kernel.org LKML](https://lore.kernel.org/lkml/20261018035817.GA2365306@ax162/)
