---
title: "Cara Setting Pihole DNS di Android untuk Blokir Iklan"
slug: "panduan-lengkap-pihole-dns-android"
summary: "Panduan lengkap setting Pihole DNS di Android lewat Wi-Fi lokal dan WireGuard split tunnel agar bebas iklan serta hemat kuota."
description: "Panduan lengkap setting Pihole DNS di Android lewat Wi-Fi lokal dan WireGuard split tunnel agar bebas iklan serta hemat kuota."
categories: ["Networking"]
tags: ["pihole", "dns", "android", "wireguard", "adblock", "homelab"]
keywords: ["pihole dns android"]
authors: ["mifthakhul-huda"]
schema: "howto"
steps:
  - name: "Menyiapkan Alamat IP Statis Server Pi-hole"
    text: "Pastikan service Pi-hole FTL aktif di server Linux dan mendengarkan port 53 dengan IP statis lokal yang tidak berubah."
  - name: "Mengatur DNS Statis pada Wi-Fi Android"
    text: "Buka pengaturan jaringan Wi-Fi Android, ubah konfigurasi IP ke Static, lalu tetapkan IP lokal server Pi-hole pada kolom DNS 1."
  - name: "Menyiapkan Peer WireGuard Khusus Android di Server"
    text: "Buat kunci kriptografi WireGuard untuk perangkat Android dan tambahkan konfigurasi peer ke server Pi-hole."
  - name: "Membuat Profil Split Tunnel dan Impor QR Code"
    text: "Susun file profil Android dengan AllowedIPs khusus IP DNS internal server, lalu pindai kode QR lewat aplikasi WireGuard Android."
date: 2026-10-23T18:08:00+07:00
draft: false
---

Pernahkah ente merasa kesal saat membuka aplikasi favorit di smartphone Android, tapi layarnya justru dipenuhi banner promosi dan iklan video yang menghabiskan kuota? Bagi pegiat homelab atau pengguna Linux rumahan, Pi-hole selalu jadi andalan utama untuk menyingkirkan konten pengganggu tersebut di level jaringan. Namun, tantangan terbesarnya muncul saat kita ingin menerapkan pihole dns android di luar rumah.

Banyak rekan yang bertanya ke ane bagaimana cara menghubungkan smartphone Android ke server Pi-hole secara konsisten. Masalahnya, Android sejak versi 9 memperkenalkan fitur Private DNS yang berbasis DNS over TLS (DoT) pada port 853, sementara instalasi Pi-hole standar hanya melayani query DNS tradisional tanpa enkripsi di port 53. Kalau ente memaksakan memasukkan alamat IP Pi-hole ke kolom Private DNS Android, sistem akan menolak karena fitur tersebut mewajibkan nama domain dengan sertifikat TLS valid.

![Alur Penyaringan Query DNS Pi-hole](2.png)
*Sumber: [Dokumentasi Resmi Pi-hole](https://docs.pi-hole.net)*

Untungnya, ada dua metode resmi dan paling stabil untuk menghubungkan Android ke Pi-hole. Pertama, metode jaringan lokal via pengaturan Wi-Fi statis saat ente berada di rumah. Kedua, metode WireGuard split tunnel yang memungkinkan smartphone menikmati proteksi pemblokiran iklan di mana saja, baik saat memakai koneksi seluler 4G/5G maupun Wi-Fi publik, tanpa menguras baterai dan tanpa memperlambat bandwidth internet.

## Prasyarat Sebelum Konfigurasi

Sebelum kita mulai utak-atik konfigurasi, pastikan beberapa kebutuhan teknis berikut sudah siap di homelab ente:

1. Server Pi-hole yang sudah berjalan normal di Raspberry Pi, mini PC, atau VPS berbasis Ubuntu Server atau Debian.
2. Alamat IP lokal statis untuk mesin Pi-hole (misalnya `192.168.1.50`).
3. Akses terminal SSH dengan hak akses sudo ke server.
4. Smartphone Android yang terhubung ke jaringan lokal yang sama.
5. Aplikasi WireGuard resmi yang terpasang dari Google Play Store atau F-Droid jika ente ingin proteksi aktif di luar rumah.
6. Paket utilitas `qrencode` di server Linux untuk mempermudah transfer konfigurasi.

## Langkah Konfigurasi Pi-hole DNS untuk Android

Berikut adalah tahapan praktis yang bisa ente ikuti, mulai dari penyesuaian dasar di jaringan lokal hingga pembangunan jalur terowongan VPN hemat daya.

### 1. Menyiapkan Alamat IP Statis Server Pi-hole

Langkah awal adalah memastikan bahwa layanan Pi-hole FTL berjalan sempurna dan mendengarkan permintaan query di port 53. Masuk ke terminal server Linux ente dan jalankan perintah verifikasi berikut:

```bash
sudo pihole status
```

Pastikan output menampilkan status aktif untuk blocking dan FTL. Selanjutnya, periksa apakah port DNS terbuka dan siap melayani permintaan dari subnet jaringan lokal:

```bash
sudo ss -tulnp | grep :53
```

Jika server ente dilindungi oleh firewall UFW, buka port 53 untuk protokol UDP dan TCP agar permintaan dari Android tidak diblokir:

```bash
sudo ufw allow 53/tcp comment 'Pi-hole DNS TCP'
sudo ufw allow 53/udp comment 'Pi-hole DNS UDP'
```

### 2. Mengatur DNS Statis pada Wi-Fi Android

Jika kebutuhan ente hanya untuk penggunaan di dalam rumah, pengaturan langsung di smartphone Android adalah opsi tercepat tanpa perlu memasang aplikasi tambahan.

1. Buka menu **Settings** atau **Pengaturan** di Android, lalu pilih **Network & internet** atau **Koneksi**.
2. Masuk ke menu **Wi-Fi**, lalu tekan ikon roda gigi (pengaturan) pada SSID jaringan rumah yang sedang terhubung.
3. Pilih opsi **Advanced** atau ketuk ikon pensil (Edit), lalu cari pengaturan **IP settings**.
4. Ubah mode dari **DHCP** menjadi **Static**.
5. Biarkan alamat **IP address** dan **Gateway** sesuai subnet router ente (misalnya Gateway `192.168.1.1` dan IP perangkat `192.168.1.120`).
6. Pada kolom **DNS 1**, masukkan alamat IP lokal server Pi-hole ente, contohnya `192.168.1.50`.
7. Kolom **DNS 2** bisa dikosongkan atau diisi kembali dengan IP Pi-hole agar sistem Android tidak memakai DNS publik cadangan yang berpotensi meloloskan iklan.
8. Simpan pengaturan, lalu matikan dan nyalakan kembali Wi-Fi smartphone.

### 3. Membangun WireGuard Split Tunnel untuk Proteksi Seluler

Metode Wi-Fi lokal sangat praktis, namun proteksinya langsung hilang seketika saat smartphone beralih ke paket data seluler di luar rumah. Dokumentasi resmi Pi-hole sangat merekomendasikan integrasi bersama WireGuard dengan skema split tunnel.

Skema ini hanya membelokkan paket data query DNS (port 53) ke server Pi-hole, sedangkan trafik browsing web, streaming YouTube, unduhan file, dan aplikasi perbankan tetap berjalan langsung lewat koneksi seluler operator. Hasilnya, koneksi internet tetap kencang, kuota server homelab tidak tersedot, dan baterai smartphone tetap awet.

Pertama, pasang WireGuard dan alat pembuat kode QR di server:

```bash
sudo apt update
sudo apt install -y wireguard qrencode
```

Buat kunci privat dan kunci publik khusus untuk klien Android:

```bash
sudo -i
cd /etc/wireguard
umask 077
name="android-huda"

wg genkey > "${name}.key"
wg pubkey < "${name}.key" > "${name}.pub"
wg genpsk > "${name}.psk"
```

Buka file konfigurasi WireGuard server di file `/etc/wireguard/wg0.conf` dan daftarkan peer baru untuk Android di bagian bawah file:

```ini
[Peer]
PublicKey = <isi file android-huda.pub>
PresharedKey = <isi file android-huda.psk>
AllowedIPs = 10.100.0.2/32
```

Terapkan perubahan konfigurasi server tanpa memutus koneksi peer lain yang sedang berjalan:

```bash
wg syncconf wg0 <(wg-quick strip wg0)
```

### 4. Menghubungkan Smartphone Android Melalui Kode QR

Sekarang kita buat file konfigurasi profil klien Android bernama `android-huda.conf` di dalam direktori `/etc/wireguard/`:

```ini
[Interface]
Address = 10.100.0.2/32
DNS = 10.100.0.1
PrivateKey = <isi file android-huda.key>

[Peer]
PublicKey = <isi file server.pub>
PresharedKey = <isi file android-huda.psk>
Endpoint = vpn.domain-atau-ip-publik-ente.com:51820
AllowedIPs = 10.100.0.1/32
PersistentKeepalive = 25
```

Perhatikan baris `AllowedIPs = 10.100.0.1/32` di atas. Angka subnet `/32` ke IP internal server inilah yang menjadi kunci arsitektur split tunnel. Smartphone Android hanya akan mengirim paket yang ditujukan ke server DNS internal Pi-hole melalui WireGuard, sedangkan semua lalu lintas data internet lainnya tetap menggunakan rute default operator seluler.

Tampilkan kode QR langsung di layar terminal server:

```bash
qrencode -t ansiutf8 < /etc/wireguard/android-huda.conf
```

Buka aplikasi **WireGuard** di smartphone Android ente, ketuk ikon tanda tambah (+) di sudut kanan bawah, pilih **Scan from QR code**, lalu arahkan kamera ponsel ke layar terminal. Beri nama profil koneksi, misalnya `Pi-hole Home`, kemudian aktifkan toggle koneksi tersebut.

## Cara Menguji dan Memverifikasi Query DNS Android

Setelah Android terhubung, saatnya memverifikasi apakah seluruh permintaan domain sudah diproses dan disaring oleh Pi-hole secara akurat.

Pertama, buka terminal server dan jalankan pemantauan log query secara langsung:

```bash
sudo pihole -t
```

Buka peramban di ponsel Android dan kunjungi situs web berita atau halaman pengujian adblocker di `https://d3ward.github.io/toolz/adblock.html`. Di terminal server, ente akan langsung melihat baris query yang masuk dari alamat IP Android (`10.100.0.2` jika lewat WireGuard, atau IP subnet lokal jika via Wi-Fi).

Domain pelacak dan iklan, seperti domain analitik Google atau jaringan promosi pihak ketiga, akan ditandai dengan tulisan `GRAVITY (blocked)`. Ini membuktikan bahwa mekanisme sinkhole telah bekerja sempurna sebelum konten iklan sempat diunduh oleh smartphone.

Kedua, lakukan uji kebocoran DNS lewat situs `https://www.dnsleaktest.com`. Klik tombol **Standard test**. Jika pengaturan sudah benar, resolver DNS yang terdeteksi hanya berasal dari upstream provider yang ente tentukan di pengaturan Pi-hole (misalnya Cloudflare atau Unbound lokal), bukan dari DNS bawaan operator seluler.

## Troubleshooting Kendala Umum Jaringan

Saat mengimplementasikan konfigurasi ini di berbagai versi Android, ada beberapa hambatan teknis yang sering ditemui di lapangan.

### Kendala Private DNS Android Menolak Terhubung

Bila Android memunculkan notifikasi kesalahan bertuliskan "Private DNS server cannot be accessed" atau internet mendadak mati, periksa setelan Private DNS bawaan ponsel. Masuk ke **Settings > Network & internet > Private DNS**, lalu ubah modenya ke **Off**. Jika dibiarkan dalam kondisi Automatic, sistem Android akan mencoba menegosiasikan TLS port 853 yang tidak disediakan oleh Pi-hole lokal, sehingga koneksi internet diblokir oleh sistem operasi.

### Kendala Pi-hole Tidak Merespons Interface WireGuard

Secara default, Pi-hole FTL hanya mendengarkan permintaan dari interface jaringan fisik lokal (`eth0` atau `wlan0`). Ketika paket query datang melalui interface virtual WireGuard (`wg0`), server kerap mengabaikannya.

Untuk memperbaikinya, buka dashboard admin Pi-hole di peramban web, masuk ke menu **Settings > DNS**, lalu periksa bagian **Interface settings**. Ubah opsi ke **Respond only on interface wg0 and eth0** atau pilih **Permit all origins** jika server berada di balik router dengan firewall yang ketat. Ente juga bisa memuat ulang DNS dengan perintah:

```bash
sudo pihole restartdns
```

### Kendala Trafik Data Tidak Berjalan Saat Tunnel Aktif

Jika smartphone tidak bisa membuka internet sama sekali setelah toggle WireGuard diaktifkan, pastikan fitur IP packet forwarding di kernel Linux server sudah aktif. Periksa dengan perintah:

```bash
sysctl net.ipv4.ip_forward
```

Jika nilainya masih 0, aktifkan secara permanen dengan menambahkan baris `net.ipv4.ip_forward = 1` ke dalam file `/etc/sysctl.d/99-sysctl.conf`, lalu muat ulang pengaturannya:

```bash
sudo sysctl -p
```

Pengaturan ini memastikan kernel Linux di server mampu meneruskan paket data dari interface virtual WireGuard ke interface jaringan utama tanpa hambatan.

Sumber: [Dokumentasi Resmi Pi-hole](https://docs.pi-hole.net/guides/vpn/wireguard/client/)
