---
title: "Cara Setting Firewall UFW di Ubuntu Server Lengkap"
slug: "cara-setting-firewall-ufw-ubuntu-server"
summary: "Panduan lengkap setting firewall UFW di Ubuntu Server, mulai dari aturan default, port SSH dan web, pembatasan subnet IP, verifikasi aturan, sampai troubleshooting."
description: "Panduan lengkap setting firewall UFW di Ubuntu Server, mulai dari aturan default, port SSH dan web, pembatasan subnet IP, verifikasi aturan, sampai troubleshooting."
categories: ["Networking"]
tags: ["ubuntu-server", "ufw", "firewall", "networking", "tutorial-linux", "server", "keamanan-jaringan"]
keywords: ["cara setting firewall ufw di ubuntu server"]
authors: ["mifthakhul-huda"]
schema: "tech"
date: 2026-10-19
draft: false
about:
  - "@type": "Thing"
    name: "Ubuntu Server"
  - "@type": "SoftwareApplication"
    name: "Uncomplicated Firewall"
    applicationCategory: "Networking Software"
    operatingSystem: "Linux"
---

Punya server atau VPS baru yang sudah diset alamat IP static rasanya memang plong. Layanan yang kita pasang tidak bakal hilang arah setiap kali mesin restart, dan konfigurasi jaringan terasa jauh lebih teratur. Tapi membiarkan server Linux langsung berhadapan dengan jaringan publik tanpa pengaman itu ibarat meninggalkan pintu rumah dalam keadaan terbuka lebar.

Bot scanner di internet tidak pernah tidur. Setiap port yang terbuka, mulai dari port database MySQL, Redis, sampai port SSH standar, bakal dihujani paket probe dalam hitungan menit setelah server aktif. Kalau kita tidak pasang filter di pintu masuk, tinggal tunggu waktu sampai ada celah yang jebol.

Di ekosistem Ubuntu Server, alat pengatur lalu lintas jaringan bawaan yang paling praktis dipakai adalah UFW (Uncomplicated Firewall). UFW dirancang sebagai frontend yang ramah manusia di atas iptables dan nftables. Alih-alih pusing merangkai rantai tabel paket yang sintaksnya rumit dan mudah bikin pusing kepala, UFW menyederhanakannya jadi baris perintah singkat yang gampang dipahami.

Berikut rangkuman panduan lengkap setting firewall UFW di Ubuntu Server, mulai dari kebijakan dasar sampai antisipasi kendala yang sering bikin pusing sysadmin pemula.

## Mengapa Server Butuh Firewall?

Firewall berbasis host seperti UFW bertugas menyaring setiap paket data yang keluar masuk antarmuka jaringan server. Tanpa firewall, setiap aplikasi yang berjalan dan melakukan bind ke alamat `0.0.0.0` akan langsung bisa diakses oleh siapa pun yang mengetahui alamat IP server ente.

Sebagai gambaran sederhana, skenario keamanan minimal sebuah server idealnya seperti ini:

| Komponen | Perilaku Default | Tindakan Firewall |
|---|---|---|
| Koneksi Masuk (Incoming) | Berpotensi bahaya dari luar | Tolak semua kecuali port yang diizinkan |
| Koneksi Keluar (Outgoing) | Server butuh update dan DNS | Izinkan semua paket keluar |
| Akses Administrasi (SSH) | Sangat penting untuk remote | Izinkan dari IP tertentu atau pasang limit |
| Database dan Service Internal | Hanya untuk aplikasi lokal | Blokir total dari akses internet luar |

Dengan pendekatan whitelist ini, server hanya membuka pintu yang benar-benar dibutuhkan untuk melayani pengunjung. Sisanya tertutup rapat dan mengabaikan kiriman paket asing.

## Prasyarat dan Aturan Main Sebelum Mulai

Sebelum menyentuh satu pun perintah UFW, ada satu aturan emas yang wajib diingat: jangan pernah menyalakan UFW sebelum memastikan aturan port SSH sudah terpasang. Kalau ente mengaktifkan UFW dalam kondisi default deny tanpa membuka port SSH terlebih dahulu, koneksi terminal ente akan langsung terputus dan ente terkunci dari server sendiri.

Pastikan beberapa hal ini sudah siap di server ente:

1. Server menjalankan Ubuntu Server 20.04 LTS, 22.04 LTS, 24.04 LTS, atau versi yang lebih baru.
2. Ente punya akses `sudo` atau akun root.
3. Ente tahu port SSH yang sedang dipakai (apakah port default 22 atau sudah diganti ke custom port).

## Cek Status Awal dan Konfigurasi IPv6

Secara bawaan di instalasi baru Ubuntu Server, paket UFW sudah terpasang tetapi statusnya nonaktif (inactive).

Buka terminal dan periksa statusnya lewat perintah:

```bash
sudo ufw status verbose
```

Outputnya akan menampilkan pesan:

```text
Status: inactive
```

Kalau kebetulan paketnya belum ada di sistem minimal ente, pasang dulu lewat APT:

```bash
sudo apt update && sudo apt install ufw -y
```

Hal penting kedua yang perlu dicek adalah dukungan IPv6. Kalau server ente punya alamat IPv4 dan IPv6 publik, aturan firewall harus berlaku untuk keduanya agar tidak ada pintu belakang yang bocor. Buka file konfigurasi utama UFW:

```bash
sudo nano /etc/default/ufw
```

Pastikan baris `IPV6` bernilai `yes`:

```text
IPV6=yes
```

Simpan file lalu keluar dari editor. Dengan pengaturan ini, setiap kali kita menambah aturan port, UFW otomatis membuatkan aturan untuk IPv4 sekaligus IPv6.

## Aturan Default UFW yang Wajib Dipasang Dulu

Langkah paling bijak dalam mengonfigurasi firewall adalah memasang kebijakan default (default policy). Prinsip yang kita gunakan adalah memblokir seluruh koneksi masuk dan mengizinkan seluruh koneksi keluar.

Jalankan dua perintah ini berurutan:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

Koneksi incoming ditolak agar semua port asing tidak bisa diakses dari luar. Sementara koneksi outgoing tetap diizinkan supaya server tetap bisa mengunduh pembaruan paket lewat `apt`, menyinkronkan waktu via NTP, dan melakukan query DNS ke luar tanpa kendala.

## Amankan Akses SSH Sebelum Menyalakan UFW

Sekali lagi, jangan nyalakan firewall sekarang. Kita harus memberi izin akses untuk port administrasi SSH terlebih dahulu.

Jika server ente masih menggunakan port SSH standar (port 22), jalankan:

```bash
sudo ufw allow 22/tcp
```

Atau bisa juga menggunakan nama layanannya langsung:

```bash
sudo ufw allow ssh
```

Kalau ente sudah mengganti port SSH ke port khusus demi keamanan, misalnya port 2222, sesuaikan nomor portnya:

```bash
sudo ufw allow 2222/tcp
```

### Pasang Rate Limiting untuk Meredam Brute Force

Kalau port SSH dibuka untuk umum ke seluruh internet, bot otomatis akan terus-menerus mencoba menebak password atau kunci SSH ente. UFW punya fitur bawaan yang sangat berguna bernama `limit`.

Perintahnya seperti ini:

```bash
sudo ufw limit ssh
```

Fitur limit ini bekerja dengan cara menolak koneksi dari alamat IP yang mencoba melakukan sambungan 6 kali atau lebih dalam rentang waktu 30 detik. Ini trik sederhana tapi manjur untuk menghentikan serangan brute-force login tanpa perlu instalasi aplikasi tambahan seperti Fail2ban di tahap awal.

## Cara Mengaktifkan dan Cek Status UFW

Setelah aturan SSH dipastikan masuk, barulah kita aman untuk mengaktifkan firewall.

Jalankan perintah berikut:

```bash
sudo ufw enable
```

Sistem akan memberikan peringatan keamanan lewat pesan konfirmasi:

```text
Command may disrupt existing ssh connections. Proceed with operation (y|n)?
```

Ketik `y` lalu tekan Enter. Jika langkah sebelumnya sudah benar, sesi SSH ente tidak akan terputus.

Sekarang periksa kembali status firewall yang sedang aktif:

```bash
sudo ufw status verbose
```

Outputnya akan memperlihatkan ringkasan kebijakan dan daftar port yang terbuka:

```text
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp (v6)                LIMIT IN    Anywhere (v6)
22/tcp                     LIMIT IN    Anywhere
```

## Membuka Port Layanan Web dan Aplikasi

Setelah gerbang utama aman, kita bisa mulai membuka port untuk layanan yang memang ditujukan untuk publik.

### Port Web Server HTTP dan HTTPS

Kalau server menjalankan Nginx, Apache, atau Caddy untuk hosting website, kita perlu membuka port 80 (HTTP) dan port 443 (HTTPS):

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

UFW juga mendukung profil aplikasi bawaan. Ente bisa melihat daftar aplikasi yang terdaftar di sistem dengan perintah:

```bash
sudo ufw app list
```

Jika server memasang Nginx, profil seperti `Nginx HTTP`, `Nginx HTTPS`, atau `Nginx Full` akan muncul. Mengizinkan `Nginx Full` otomatis membuka port 80 dan 443 sekaligus:

```bash
sudo ufw allow 'Nginx Full'
```

### Port Aplikasi Kustom dan Rentang Port

Kalau ente menjalankan aplikasi Node.js, bot, atau dashboard web internal di port tertentu, formatnya tetap konsisten:

```bash
sudo ufw allow 8080/tcp
sudo ufw allow 3000/tcp
```

Untuk layanan yang membutuhkan banyak port sekaligus, misalnya FTP pasif atau audio streaming, gunakan format rentang port (range) dengan menyebutkan protokolnya secara spesifik:

```bash
sudo ufw allow 60000:61000/udp
sudo ufw allow 40000:40050/tcp
```

Menyebutkan protokol (`/tcp` atau `/udp`) itu wajib saat mendefinisikan rentang port, kalau tidak UFW akan menolak aturan tersebut.

## Mengunci Akses Berdasarkan Alamat IP dan Subnet Jaringan

Tidak semua layanan boleh dibuka ke seluruh penjuru dunia. Port sensitif seperti database (PostgreSQL di port 5432 atau MySQL di port 3306), Redis, dan panel manajemen sebaiknya hanya bisa dihubungi oleh IP terpercaya.

### Mengizinkan Satu Alamat IP Khusus

Misalnya ente hanya ingin mengizinkan laptop kantor dengan IP statis `192.168.1.50` untuk mengakses database MySQL:

```bash
sudo ufw allow from 192.168.1.50 to any port 3306 proto tcp
```

Kalau IP tersebut adalah server aplikasi utama yang butuh akses penuh ke semua port tanpa batasan, perintahnya lebih sederhana:

```bash
sudo ufw allow from 192.168.1.50
```

### Mengizinkan Satu Blok Subnet Jaringan

Jika ente mengelola jaringan lokal kantor atau segmen homelab, lebih praktis mengizinkan satu subnet menggunakan notasi CIDR:

```bash
sudo ufw allow from 192.168.1.0/24 to any port 22 proto tcp
```

Perintah di atas memastikan hanya perangkat di rentang IP `192.168.1.1` sampai `192.168.1.254` yang bisa melakukan remote SSH ke server. Siapa pun dari luar subnet tersebut akan langsung ditolak mentah-mentah.

### Mengikat Aturan ke Antarmuka Jaringan Tertentu

Server sering kali memiliki lebih dari satu kartu jaringan (NIC), misalnya satu kartu fisik menghadap internet publik (`enp0s3`) dan satu kartu virtual menghadap tunnel VPN seperti WireGuard (`wg0`).

Kita bisa mengizinkan seluruh trafik yang datang lewat antarmuka VPN tanpa membuka port tersebut ke internet:

```bash
sudo ufw allow in on wg0
```

Dengan begitu, seluruh komunikasi di dalam jaringan VPN terenkripsi berjalan lancar tanpa mengekspos port ke kartu jaringan publik.

## Cara Menghapus Aturan Pakai Nomor Baris

Salah ketik port atau ingin mematikan port service lama itu hal yang lumrah terjadi. Menghapus aturan di UFW paling aman dilakukan menggunakan nomor baris (numbered list).

Pertama, tampilkan seluruh aturan beserta nomor urutnya:

```bash
sudo ufw status numbered
```

Outputnya akan menampilkan nomor di dalam kurung siku di sisi kiri:

```text
     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     LIMIT IN    Anywhere
[ 2] 80/tcp                     ALLOW IN    Anywhere
[ 3] 443/tcp                    ALLOW IN    Anywhere
[ 4] 3000/tcp                   ALLOW IN    Anywhere
```

Misalnya kita ingin menghapus aturan untuk port 3000 yang ada di baris nomor 4:

```bash
sudo ufw delete 4
```

Sistem akan meminta konfirmasi penghapusan. Ketik `y` dan Enter.

Perlu dicatat, setelah nomor 4 dihapus, nomor urut baris di bawahnya akan bergeser naik. Jadi kalau ente berencana menghapus beberapa aturan sekaligus, biasakan menghapus dari nomor yang paling besar terlebih dahulu atau jalankan `sudo ufw status numbered` ulang setelah setiap penghapusan.

Kalau ente ragu efek penghapusan aturan, gunakan opsi uji coba tanpa eksekusi langsung lewat parameter `--dry-run`:

```bash
sudo ufw --dry-run delete 2
```

## Verifikasi Aturan dan Cara Membaca Log UFW

Setelah semua port selesai dikonfigurasi, lakukan pengujian dari perangkat lain di luar server.

Dari komputer client, kita bisa mengetes keterbukaan port menggunakan Netcat tanpa perlu menginstal aplikasi berat:

```bash
nc -zv 192.168.1.10 22
nc -zv 192.168.1.10 80
```

Jika port terbuka, Netcat akan menampilkan status `succeeded!`. Jika port tertutup atau diblokir firewall, terminal akan mengalami jeda (timeout) atau menampilkan pesan `Connection refused`.

### Memantau Log Aktivitas Firewall

Secara default, UFW mencatat aktivitas paket yang dibuang ke berkas log sistem. Ente bisa melihat paket apa saja yang sedang diblokir secara real-time lewat perintah:

```bash
sudo tail -f /var/log/ufw.log
```

Baris log UFW memuat informasi detail seperti IP asal (SRC), IP tujuan (DST), port asal (SPT), dan port tujuan (DPT):

```text
[UFW BLOCK] IN=enp0s3 OUT= MAC=... SRC=203.0.113.45 DST=192.168.1.10 PROTO=TCP SPT=48210 DPT=23
```

Contoh di atas memperlihatkan ada IP asing yang mencoba memindai port Telnet (port 23) dan berhasil diblokir oleh UFW.

Tingkat rincian log bisa diatur sesuai kebutuhan:

```bash
sudo ufw logging low
sudo ufw logging medium
sudo ufw logging off
```

Level `low` sudah sangat cukup untuk server produksi agar ukuran berkas log tidak membengkak dan memenuhi ruang penyimpanan disk.

## Kendala yang Sering Muncul dan Solusinya

Berikut rangkuman kendala umum yang sering dihadapi saat mengatur UFW beserta langkah penyelesaiannya di lapangan:

| Masalah | Penyebab Umum | Solusi Praktis |
|---|---|---|
| Terkunci dari sesi SSH | Lupa allow SSH sebelum `ufw enable` | Buka web console di dashboard VPS, jalankan `sudo ufw disable` |
| Aturan tidak mempan pada Docker | Docker mem-bypass chain filter UFW | Bind port Docker ke localhost atau atur chain `ufw-user-forward` |
| Port allow jalan di IPv4 tapi gagal di IPv6 | Pengaturan IPv6 di config UFW nonaktif | Cek file konfigurasi ufw, pastikan `IPV6=yes`, lalu `sudo ufw reload` |
| Service aktif tapi tidak bisa diakses | Aplikasi hanya bind ke `127.0.0.1` | Periksa `ss -tulpn`, ubah bind address aplikasi ke `0.0.0.0` |
| Port ditolak padahal sudah di-allow | Urutan aturan bentrok dengan subnet deny | Gunakan `sudo ufw insert 1 ...` untuk menaikkan prioritas aturan |

### Waspadai Perilaku Bawaan Docker

Satu hal krusial yang sering mengecoh pengguna Ubuntu adalah perilaku Docker. Secara default, daemon Docker memanipulasi rantai iptables langsung di tingkat kernel untuk mengarahkan trafik (NAT).

Akibatnya, jika ente menjalankan kontainer Docker dengan parameter expose publik seperti `-p 8080:8080`, port tersebut bisa diakses oleh dunia luar meskipun di UFW port 8080 belum diizinkan atau bahkan sudah ditolak.

Cara paling aman mencegah Docker membocorkan port adalah dengan mengikat publikasi port kontainer secara eksplisit ke loopback lokal:

```bash
docker run -d -p 127.0.0.1:8080:8080 my-app
```

Dengan trik ini, hanya aplikasi lokal seperti reverse proxy Caddy atau Nginx yang bisa mengakses kontainer tersebut, dan akses dari luar tetap tunduk sepenuhnya pada aturan UFW yang ente tetapkan.

## Mengendalikan Lalu Lintas Jaringan dengan Tenang

Mengamankan server sebenarnya tidak perlu rumit sampai harus menghafal puluhan parameter iptables yang panjang. Dengan UFW, prinsip dasar keamanan jaringan bisa diterapkan hanya dengan beberapa baris instruksi: kunci pintu default, buka port yang relevan, batasi alamat IP sensitif, dan aktifkan rate limiting pada akses administrasi.

Begitu konfigurasi firewall terpasang rapi dan diverifikasi lewat log, server ente sudah punya lapisan proteksi pertama yang kokoh untuk menghadapi kerasnya lalu lintas internet.

Sumber: [Dokumentasi Ubuntu Server Firewall](https://ubuntu.com/server/docs/how-to/security/firewalls/)
