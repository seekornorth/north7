---
title: "Cara Install Arch Linux Mudah Pakai Archinstall"
slug: "install-arch-linux-pakai-archinstall"
summary: "Panduan lengkap cara install Arch Linux menggunakan Archinstall, mulai dari menyiapkan installer hingga sistem Arch Linux siap digunakan."
description: "Panduan lengkap cara install Arch Linux menggunakan Archinstall, mulai dari menyiapkan installer hingga sistem Arch Linux siap digunakan."
categories: ["Linux"]
tags: ["arch-linux", "archinstall", "linux", "distro-linux", "tutorial-linux", "pacman", "open-source"]
keywords: ["Arch Linux", "Archinstall"]
authors: ["mifthakhul-huda"]
schema: "tech"
date: 2026-10-06
draft: false
about:
  - "@type": "Thing"
    name: "Arch Linux"
  - "@type": "SoftwareApplication"
    name: "Archinstall"
    applicationCategory: "System Software"
    operatingSystem: "Linux"
---

Arch Linux memang terkenal dengan proses instalasinya yang agak beda dibanding distro Linux lain. Kalau biasanya tinggal klik installer lalu lanjut sampai selesai, Arch dari dulu lebih identik dengan terminal dan konfigurasi manual.

Tapi sekarang ada cara yang lebih gampang.

Arch Linux menyediakan `archinstall`, yaitu installer berbasis menu yang bisa membantu kita melewati berbagai tahap instalasi tanpa harus mengerjakan semuanya secara manual dari terminal. Tool ini sudah tersedia di ISO resmi Arch Linux dan bisa langsung dijalankan dengan perintah `archinstall`.

Buat ente yang pengin mencoba Arch Linux tapi masih ragu karena instalasinya kelihatan ribet, `archinstall` bisa jadi jalan tengah yang cukup menarik.

Di artikel ini ane bakal bahas cara install Arch Linux menggunakan `archinstall` dari awal sampai sistem siap dipakai.

## Sebelum Install Arch Linux

Sebelum masuk ke proses instalasi, siapkan dulu beberapa hal.

Pertama tentu saja ISO Arch Linux. Saat artikel ini ditulis, versi ISO terbaru yang tersedia adalah **Arch Linux 2026.10.01**, menggunakan kernel Linux 7.2.7 dan berukuran sekitar 1,5 GB.

Download ISO-nya dari situs resmi Arch Linux, kemudian buat USB bootable menggunakan aplikasi seperti Rufus, Ventoy, atau tool sejenis.

Kalau memungkinkan, verifikasi checksum atau tanda tangan ISO sebelum digunakan. Arch Linux sendiri merekomendasikan verifikasi signature untuk memastikan image yang digunakan memang berasal dari sumber yang benar.

Setelah itu boot komputer dari USB tersebut.

## Pastikan Terhubung ke Internet

Arch Linux mengambil paket dari repository selama proses instalasi, jadi koneksi internet perlu disiapkan terlebih dahulu.

Kalau menggunakan kabel LAN, biasanya bagian ini lebih simpel.

Untuk Wi-Fi, kita perlu menghubungkannya dari lingkungan live ISO terlebih dahulu. Archinstall sendiri tidak bertugas mengonfigurasi Wi-Fi sebelum proses instalasi dimulai, jadi koneksi jaringan harus sudah tersedia ketika installer dijalankan.

Setelah masuk ke live environment, kita bisa mengecek koneksi dengan:

```bash
ping archlinux.org
```

Kalau mendapatkan balasan, berarti koneksi sudah jalan.

## Jalankan Archinstall

Nah, sekarang bagian yang ditunggu-tunggu.

Di terminal live ISO, jalankan:

```bash
archinstall
```

Karena Guided Installer merupakan installer bawaan yang dijalankan secara default, perintah tersebut akan membawa kita ke proses instalasi berbasis menu.

Tampilan yang muncul memang masih berupa terminal, tapi bukan berarti kita harus mengetik semua konfigurasi satu per satu.

Kita tinggal memilih opsi yang tersedia.

## Pilih Bahasa Installer

Pada bagian awal, archinstall akan meminta beberapa konfigurasi dasar.

Untuk bahasa installer, pilih bahasa yang paling nyaman digunakan.

Kalau pilihan Indonesia tidak tersedia atau ente lebih nyaman mengikuti dokumentasi Arch Linux dalam bahasa Inggris, pilih **English** saja.

Bahasa installer ini tidak menentukan bahasa sistem secara keseluruhan, jadi jangan terlalu dipikirkan di bagian ini.

## Pilih Keyboard Layout

Berikutnya ada konfigurasi keyboard.

Untuk keyboard standar Indonesia yang menggunakan layout QWERTY, pilihan **US** biasanya sudah cukup.

Kalau keyboard ente menggunakan layout berbeda, pilih sesuai perangkat yang digunakan.

Bagian ini kelihatannya sepele, tapi lumayan bikin pusing kalau salah pilih. Apalagi nanti ketika harus mengetik password.

## Pilih Mirror Region

Arch Linux menggunakan mirror untuk mengambil paket selama proses instalasi.

Pilih region yang lokasinya relatif dekat dengan tempat ente berada.

Untuk pengguna Indonesia, mirror Indonesia bisa dipilih jika tersedia. Kalau tidak, pilih negara terdekat yang memiliki mirror dengan koneksi bagus.

Tujuannya sederhana: proses download paket bisa lebih cepat dan stabil.

## Bagian Paling Penting: Disk Configuration

Nah, di sini jangan asal pencet Enter.

Archinstall menyediakan beberapa metode konfigurasi disk. Salah satunya adalah **Best Effort**, yang akan membuat layout partisi secara otomatis berdasarkan pilihan yang diberikan. Tapi opsi ini dapat menghapus data pada disk yang dipilih.

Jadi kalau komputer ente masih punya data penting, berhenti sebentar dan pastikan disk yang dipilih memang benar.

Untuk komputer yang memang disiapkan khusus buat Arch Linux, konfigurasi otomatis bisa lebih praktis.

Tapi kalau di dalam komputer terdapat Windows, Linux lain, atau data pribadi, sebaiknya jangan asal memilih konfigurasi otomatis.

Archinstall juga menyediakan **Manual Partitioning** kalau ente ingin mengatur partisi sendiri. Mode ini memang lebih rumit, tapi memberikan kontrol yang jauh lebih besar terhadap layout disk.

Kalau masih pemula, ane lebih menyarankan belajar dulu struktur disk dan partisi sebelum menggunakan mode manual.

Kesalahan di bagian ini bisa berujung data hilang.

## Pilih Filesystem

Setelah konfigurasi disk, biasanya kita akan berhadapan dengan pilihan filesystem.

Beberapa pilihan yang umum digunakan adalah:

- ext4
- btrfs
- xfs
- f2fs

Kalau tujuan ente cuma ingin memasang Arch Linux untuk belajar atau dipakai sehari-hari tanpa kebutuhan khusus, **ext4** merupakan pilihan yang sederhana.

Btrfs juga menarik kalau ente memang membutuhkan fitur seperti subvolume, snapshot, atau compression. Tapi konfigurasi Btrfs bisa lebih kompleks dibanding ext4.

Jadi nggak perlu ikut-ikutan memilih filesystem yang kelihatannya paling canggih.

Pilih yang memang sesuai kebutuhan.

## Pilih Bootloader

Berikutnya adalah bootloader.

Archinstall akan memberikan pilihan bootloader yang tersedia pada versi installer yang digunakan.

Untuk instalasi UEFI modern, **systemd-boot** merupakan salah satu pilihan yang bisa digunakan.

Kalau ente sedang memasang Arch di komputer yang sudah memiliki sistem operasi lain, bagian bootloader ini perlu diperhatikan lebih serius karena berkaitan dengan proses boot komputer.

## Buat User Account

Selanjutnya kita perlu membuat pengguna.

Masukkan username yang ingin digunakan, kemudian buat password.

Kalau Arch Linux ini digunakan untuk desktop sehari-hari, sebaiknya gunakan akun user biasa dan berikan akses sudo ketika dibutuhkan.

Jangan terlalu terburu-buru di bagian password. Pastikan layout keyboard yang dipilih sebelumnya memang benar.

## Atur Root Password

Archinstall juga dapat meminta root password.

Kalau root password dikosongkan, akun root bisa dinonaktifkan dan akses administratif dilakukan melalui sudo. ArchWiki sendiri memberikan catatan bahwa konfigurasi ini perlu diperhatikan supaya pengguna tidak malah kehilangan akses administratif ke sistem.

Untuk pemula, lebih gampang kalau ente memahami dulu perbedaan root dan sudo sebelum memutuskan konfigurasi mana yang digunakan.

## Pilih Profile

Ini salah satu bagian yang bikin instalasi Arch menggunakan archinstall terasa lebih gampang.

Archinstall menyediakan beberapa **profile**, termasuk profile untuk desktop environment dan konfigurasi tertentu.

Kalau tujuan ente memasang Arch sebagai desktop, pilih profile desktop yang memang ingin digunakan.

Misalnya ingin menggunakan GNOME, KDE Plasma, atau desktop environment lain yang tersedia pada installer.

Tapi kalau ingin sistem minimal dan nantinya mau mengatur semuanya sendiri, jangan memilih profile desktop yang tidak dibutuhkan.

Archinstall memang menyediakan profile siap pakai, tetapi profile tersebut merupakan konfigurasi khusus archinstall dan pengguna tetap disarankan memahami apa saja yang dipasang oleh profile tersebut.

## Pilih Network Configuration

Selanjutnya kita akan masuk ke konfigurasi jaringan.

Untuk penggunaan desktop biasa, konfigurasi jaringan yang sederhana sudah cukup.

Yang penting, setelah Arch selesai dipasang, sistem tetap memiliki cara untuk mendapatkan koneksi internet.

Kalau sebelumnya menggunakan Wi-Fi dari live ISO, perhatikan konfigurasi jaringan yang dipilih supaya koneksi tersebut tetap bisa digunakan setelah reboot.

## Pilih Audio

Kalau Arch ini digunakan sebagai komputer desktop atau laptop harian, pilih konfigurasi audio yang sesuai kebutuhan.

Untuk kebanyakan pengguna desktop, PipeWire merupakan pilihan yang umum digunakan pada sistem Linux modern.

Kalau komputer tersebut hanya akan digunakan sebagai server tanpa kebutuhan audio, bagian ini tentu tidak terlalu penting.

## Tambahkan Paket Tambahan

Archinstall juga menyediakan opsi untuk memasukkan paket tambahan sebelum instalasi dimulai.

Misalnya:

```text
git
vim
htop
wget
curl
```

Ente bisa memasukkan paket yang memang sudah tahu bakal digunakan.

Tapi jangan memasukkan puluhan paket hanya karena kelihatannya berguna.

Arch Linux enaknya justru kita bisa memasang software sesuai kebutuhan setelah sistem selesai dipasang.

## Atur Timezone

Pilih timezone sesuai lokasi ente.

Untuk Indonesia bagian WIB, timezone yang umum digunakan adalah:

```text
Asia/Jakarta
```

Kalau berada di WITA:

```text
Asia/Makassar
```

Sedangkan untuk WIT:

```text
Asia/Jayapura
```

Archinstall juga menyediakan konfigurasi NTP untuk membantu sinkronisasi waktu selama proses instalasi.

## Cek Lagi Semua Konfigurasi

Sebelum instalasi benar-benar dimulai, archinstall akan menampilkan konfigurasi yang sudah dipilih.

**Jangan langsung Enter.**

Cek lagi terutama bagian:

- Disk yang akan digunakan
- Filesystem
- Bootloader
- Username
- Network
- Profile
- Timezone
- Paket tambahan

Bagian disk adalah yang paling penting.

Kalau ada satu saja yang terasa aneh, lebih baik kembali dan perbaiki daripada baru sadar setelah proses instalasi selesai.

## Mulai Instalasi Arch Linux

Kalau semua konfigurasi sudah benar, lanjutkan proses instalasi.

Archinstall kemudian akan mulai membuat partisi jika diperlukan, memformat filesystem, memasang paket, mengatur bootloader, membuat user, dan menerapkan konfigurasi yang sudah dipilih.

Lamanya proses tergantung kecepatan internet, storage, dan hardware yang digunakan.

Selama proses berjalan, jangan mematikan komputer.

Archinstall juga menyimpan log instalasi di:

```text
/var/log/archinstall
```

Log ini berguna kalau terjadi masalah dan kita perlu mencari tahu apa yang sebenarnya terjadi selama instalasi.

## Setelah Instalasi Selesai

Kalau semuanya berjalan normal, archinstall akan memberikan informasi bahwa instalasi sudah selesai dan sistem aman untuk direboot.

Reboot komputer:

```bash
reboot
```

Jangan lupa cabut USB installer ketika komputer mulai melakukan restart.

Kalau bootloader dan konfigurasi disk sudah benar, komputer akan masuk ke Arch Linux yang baru saja dipasang.

Login menggunakan username dan password yang sebelumnya dibuat.

## Setelah Masuk ke Arch Linux

Jangan langsung buru-buru install banyak software.

Hal pertama yang sebaiknya dilakukan adalah memperbarui sistem:

```bash
sudo pacman -Syu
```

Setelah itu baru pasang software yang memang diperlukan.

Misalnya:

```bash
sudo pacman -S git curl wget vim
```

Nama paket bisa disesuaikan dengan kebutuhan.

Kalau tadi ente memilih profile desktop, cek juga apakah desktop environment dan layanan jaringan sudah berjalan dengan normal.

## Apakah Archinstall Berarti Arch Linux Jadi Mudah?

Menurut ane, **iya, tapi tidak berarti Arch Linux berubah menjadi distro yang sepenuhnya ramah pemula.**

`archinstall` memang memangkas banyak pekerjaan manual ketika instalasi. Kita tidak harus membuat semua partisi, memasang paket dasar, membuat user, dan mengatur berbagai hal dari nol lewat command line.

Tapi setelah instalasi selesai, Arch Linux tetap Arch Linux.

Pengelolaan paket menggunakan pacman, konfigurasi sistem tetap perlu dipahami, dan ketika ada masalah, kita kemungkinan besar tetap harus membaca dokumentasi atau ArchWiki.

Jadi `archinstall` lebih tepat dianggap sebagai **alat bantu instalasi**, bukan tombol ajaib yang membuat semua bagian Arch menjadi otomatis.

Buat ane, ini justru enak.

Kalau ingin belajar Arch Linux tanpa harus langsung berhadapan dengan instalasi manual yang panjang, `archinstall` bisa menjadi titik awal yang masuk akal.

Nanti setelah sudah lebih paham, baru coba instalasi manual. Dari situ kita bakal lebih ngerti sebenarnya apa saja yang dikerjakan installer di balik layar.

## Kesimpulan

Install Arch Linux sekarang nggak harus selalu dimulai dari membuat partisi dan mengetik puluhan command secara manual.

Dengan `archinstall`, proses instalasi bisa dilakukan lewat menu interaktif mulai dari konfigurasi disk, filesystem, bootloader, user, jaringan, profile desktop, sampai paket tambahan.

Tapi tetap ada satu bagian yang nggak boleh dianggap sepele: **konfigurasi disk**.

Kalau ente salah memilih disk atau layout yang menggunakan metode penghapusan data, akibatnya bisa fatal. Jadi sebelum menekan tombol konfirmasi, cek lagi semua konfigurasi yang sudah dipilih.

Kalau sudah yakin, tinggal lanjutkan instalasi dan biarkan archinstall mengerjakan sisanya.

Dan kalau setelah berhasil install ente malah penasaran, "sebenarnya Arch tadi ngapain aja sih?", nah... itu justru saat yang pas buat mulai belajar instalasi Arch Linux secara manual.
