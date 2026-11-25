---
title: "Cara Setup WireGuard VPN Server Sendiri di Ubuntu"
slug: "cara-setup-wireguard-vpn-server-sendiri-di-ubuntu"
summary: "Panduan praktis setup WireGuard VPN server mandiri di Ubuntu, mulai konfigurasi kunci, routing NAT iptables, sampai koneksi client."
description: "Panduan praktis setup WireGuard VPN server mandiri di Ubuntu, mulai konfigurasi kunci, routing NAT iptables, sampai koneksi client."
categories: ["Networking"]
tags: ["networking", "wireguard", "vpn", "ubuntu-server", "linux", "keamanan-jaringan", "sysadmin"]
keywords: ["cara setup wireguard vpn di ubuntu"]
authors: ["mifthakhul-huda"]
schema: "tech"
date: 2026-10-20
draft: false
about:
  - "@type": "SoftwareApplication"
    name: "WireGuard"
    applicationCategory: "Networking Software"
    operatingSystem: "Linux"
---

Pernahkah ente merasa waswas saat harus membuka laptop atau HP di jaringan WiFi umum seperti kafe atau bandara? Atau mungkin ente punya homelab dan server di rumah yang ingin diakses dari luar kantor, tapi malas membuka sembarang port ke internet publik karena risiko keamanan? Solusi paling masuk akal untuk skenario ini adalah membangun server VPN pribadi.

Kalau bicara soal VPN di ekosistem Linux modern, WireGuard sudah jadi standar praktis yang paling disukai sysadmin dan pegiat *self-hosted*. Berbeda dengan OpenVPN atau IPsec yang membawa tumpukan protokol rumit dan ratusan ribu baris kode warisan, WireGuard hadir sangat ramping dengan sekitar 4.000 baris kode saja. WireGuard berjalan langsung di dalam *kernel space* Linux (tersedia bawaan sejak kernel 5.6), sehingga latensinya sangat rendah, proses *handshake* berlangsung instan, dan konsumsi baterai perangkat mobile jauh lebih hemat.

Di artikel ini, ane ajak ente membedah langkah demi langkah setup WireGuard VPN server mandiri di Ubuntu Server (bisa diterapkan di Ubuntu 22.04 LTS maupun 24.04 LTS), mulai dari modul kernel, manajemen pasangan kunci kriptografi, routing NAT iptables, sampai ekspor profil client lewat kode QR.

## Prasyarat Server dan Jaringan

Sebelum mulai mengetik perintah di terminal, pastikan beberapa hal berikut sudah siap di sisi server:

1. Satu unit server atau VPS dengan OS Ubuntu 22.04 LTS atau 24.04 LTS yang memiliki IP publik statis.
2. Akses pengguna dengan hak `sudo` atau root.
3. Akses port UDP nomor `51820` terbuka di firewall server maupun *security group* penyedia cloud (seperti AWS, GCP, Linode, atau Oracle Cloud).
4. Nama interface jaringan utama server yang menghadap ke internet publik, misalnya `eth0`, `ens3`, atau `enp1s0`. Ente bisa mengeceknya dengan perintah `ip -br a`.

## 1. Aktifkan IP Forwarding di Kernel Linux

WireGuard server bertindak sebagai gerbang (*gateway*) yang meneruskan paket data dari perangkat client menuju internet atau jaringan lokal server. Supaya kernel Linux mengizinkan penerusan paket ini, fitur penerusan paket (*packet forwarding*) wajib diaktifkan.

Buat berkas konfigurasi sysctl khusus di `/etc/sysctl.d/99-wireguard.conf`:

```bash
sudo nano /etc/sysctl.d/99-wireguard.conf
```

Tambahkan baris berikut ke dalam berkas:

```ini
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
```

Simpan berkas, lalu terapkan perubahan konfigurasi kernel tanpa perlu mulai ulang sistem:

```bash
sudo sysctl -p /etc/sysctl.d/99-wireguard.conf
```

Jika terminal memunculkan `net.ipv4.ip_forward = 1`, artinya kernel Linux sudah siap meneruskan lalu lintas jaringan.

## 2. Pasang Paket WireGuard dan Tools Pendukung

Karena modul WireGuard sudah terintegrasi di kernel Ubuntu, kita hanya perlu memasang utilitas ruang pengguna (`wireguard-tools`), paket `iptables` untuk manipulasi aturan NAT, serta `qrencode` agar kita bisa menghubungkan ponsel Android atau iPhone lewat pemindaian barcode terminal.

Jalankan perintah instalasi berikut:

```bash
sudo apt update
sudo apt install -y wireguard qrencode iptables
```

## 3. Buat Pasangan Kunci Kriptografi Server

WireGuard menggunakan arsitektur kriptografi kunci publik asimetris berbasis Curve25519. Setiap titik (*endpoint*), baik server maupun client, memiliki sepasang kunci: *private key* yang harus dirahasiakan dan *public key* yang dibagikan ke lawan bicaranya.

Buat direktori kerja `/etc/wireguard` dan batasi izin aksesnya supaya hanya bisa dibaca oleh root:

```bash
sudo mkdir -p /etc/wireguard
cd /etc/wireguard
sudo umask 077
```

Selanjutnya, buat pasangan kunci untuk server:

```bash
sudo wg genkey > server_private.key
sudo chmod 600 server_private.key
sudo wg pubkey < server_private.key > server_public.key
```

Dua berkas kunci kini sudah terbentuk di direktori kerja, yaitu `server_private.key` dan `server_public.key`.

## 4. Konfigurasi Antarmuka Server wg0.conf

Sekarang kita racik berkas konfigurasi utama server di `/etc/wireguard/wg0.conf`. Berkas ini mendefinisikan alamat IP internal VPN, port dengar, kunci privat server, serta aturan perutean saat tunnel dinaikkan atau diturunkan.

Sebelum menyusun berkas, cari tahu nama antarmuka internet server:

```bash
ip route show default | awk '{print $5}'
```

Misalkan output antarmuka adalah `eth0`. Buka editor teks:

```bash
sudo nano /etc/wireguard/wg0.conf
```

Isi konfigurasi dengan format berikut (ganti `<ISI_SERVER_PRIVATE_KEY>` dengan teks isi berkas `server_private.key` dan pastikan nama interface sesuai):

```ini
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = <ISI_SERVER_PRIVATE_KEY>
SaveConfig = false

# Aturan routing NAT saat interface VPN aktif (PostUp) dan mati (PostDown)
PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE; iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -m state --state RELATED,ESTABLISHED -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -m state --state RELATED,ESTABLISHED -j ACCEPT
```

Perintah `PostUp` berfungsi memerintahkan iptables melakukan penyamaran (*masquerade*) pada antarmuka `eth0`. Dengan begitu, paket dari IP client VPN (`10.0.0.2`, dan seterusnya) bisa menjelajah internet menggunakan IP publik server.

## 5. Buat Profil Klien Pertama

Agar server bisa terhubung, kita butuh satu profil client, misalnya untuk laptop atau ponsel ente. Buat folder khusus untuk menyimpan konfigurasi client:

```bash
sudo mkdir -p /etc/wireguard/clients
cd /etc/wireguard/clients
sudo umask 077
```

Buat kunci untuk client:

```bash
sudo wg genkey > client1_private.key
sudo chmod 600 client1_private.key
sudo wg pubkey < client1_private.key > client1_public.key
```

Ambil isi `client1_public.key` untuk didaftarkan ke server, dan ambil isi `server_public.key` untuk dimasukkan ke profil client.

Buat berkas konfigurasi client di `/etc/wireguard/clients/client1.conf`:

```bash
sudo nano /etc/wireguard/clients/client1.conf
```

Tuliskan konfigurasi berikut:

```ini
[Interface]
PrivateKey = <ISI_CLIENT1_PRIVATE_KEY>
Address = 10.0.0.2/24
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = <ISI_SERVER_PUBLIC_KEY>
Endpoint = <IP_PUBLIK_SERVER>:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
```

Parameter `AllowedIPs = 0.0.0.0/0, ::/0` menandakan seluruh lalu lintas data perangkat client akan dialihkan lewat jalur terowongan (*full-tunnel*). Sementara `PersistentKeepalive = 25` sangat penting jika client berada di balik router NAT rumah atau jaringan seluler, karena paket kecil dikirim berkala setiap 25 detik agar koneksi tidak diputus oleh ISP.

## 6. Daftarkan Klien ke Konfigurasi Server

Buka kembali berkas `/etc/wireguard/wg0.conf` di server:

```bash
sudo nano /etc/wireguard/wg0.conf
```

Tambahkan blok `[Peer]` untuk client1 di baris paling bawah:

```ini
# Peer Client 1 (Laptop atau Ponsel)
[Peer]
PublicKey = <ISI_CLIENT1_PUBLIC_KEY>
AllowedIPs = 10.0.0.2/32
```

Perhatikan bahwa di sisi server, nilai `AllowedIPs` menggunakan subnet `/32` (spesifik satu alamat IP client), bukan `/24`.

## 7. Buka Port Firewall dan Jalankan Layanan WireGuard

Jika server memakai firewall UFW (Uncomplicated Firewall), buka port UDP 51820:

```bash
sudo ufw allow 51820/udp comment 'WireGuard VPN'
sudo ufw reload
```

Kini aktifkan dan jalankan antarmuka WireGuard menggunakan systemd lewat modul `wg-quick`:

```bash
sudo systemctl enable --now wg-quick@wg0
```

Cek status layanan untuk memastikan tidak ada pesan kesalahan:

```bash
sudo systemctl status wg-quick@wg0
```

## 8. Hubungkan Perangkat Klien

Ada dua cara mudah untuk membawa profil konfigurasi `client1.conf` ke perangkat client:

### Cara Pertama, Scan Kode QR di Ponsel Pintar

Jika ente memasang aplikasi resmi WireGuard di Android atau iPhone, cara tercepat adalah menampilkan kode QR langsung di terminal server:

```bash
sudo qrencode -t ansiutf8 < /etc/wireguard/clients/client1.conf
```

Buka aplikasi WireGuard di ponsel, pilih tombol tambah (+), pilih *Scan from QR code*, lalu arahkan kamera ke layar terminal. Begitu tombol aktivasi ditekan, tunnel langsung aktif seketika.

### Cara Kedua, Salin Berkas Konfigurasi ke Laptop

Untuk pengguna laptop Linux, macOS, atau Windows, salin teks isi berkas `/etc/wireguard/clients/client1.conf` ke aplikasi WireGuard desktop atau simpan di `/etc/wireguard/wg0.conf` pada laptop Linux ente, lalu jalankan `sudo wg-quick up wg0`.

## 9. Verifikasi Koneksi dan Uji Jaringan

Setelah client terhubung, masuk kembali ke server dan jalankan perintah verifikasi utama:

```bash
sudo wg show
```

Output terminal yang menandakan tunnel berhasil terhubung akan terlihat seperti ini:

```text
interface: wg0
  public key: 4xKl90qM...8Yv9Q=
  private key: (hidden)
  listening port: 51820

peer: aB82m3pK...D91kY=
  endpoint: 203.0.113.45:51820
  allowed ips: 10.0.0.2/32
  latest handshake: 28 seconds ago
  transfer: 2.14 MiB received, 18.73 MiB sent
```

Kunci keberhasilan ada pada baris `latest handshake` dan `transfer`. Jika ada catatan waktu handshake (misalnya `28 seconds ago`) dan angka transfer data terus bertambah, artinya paket data sudah sukses mengalir lewat enkripsi WireGuard.

Terakhir, buka browser di perangkat client lalu kunjungi situs pengecek IP atau ketik `curl https://ifconfig.me` di terminal client. Alamat IP yang tampil harus sudah berubah menjadi IP publik server Ubuntu ente.

## Solusi Kendala Umum (Troubleshooting)

Dalam praktiknya, kadang kita menemui kendala teknis saat pertama kali menghubungkan WireGuard. Berikut beberapa kendala umum beserta solusinya:

- **Handshake tidak pernah terjadi (latest handshake kosong):** Masalah ini sebagian besar disebabkan port UDP 51820 tertutup. Ingat bahwa WireGuard murni memakai protokol UDP. Periksa aturan *Security Group* atau *Firewall Ingress* di dasbor penyedia VPS (misalnya Oracle Cloud atau AWS) dan pastikan protokol UDP diizinkan masuk.
- **Client terhubung tapi tidak bisa membuka website (internet macet):** Biasanya karena nama interface publik di aturan `PostUp`/`PostDown` salah ketik. Pastikan nama interface di iptables cocok persis dengan interface internet server (cek dengan `ip route show default`). Selain itu, periksa apakah baris `DNS = 1.1.1.1` di berkas client sudah aktif.
- **Koneksi sering freeze atau putus setelah beberapa menit di HP:** Pastikan baris `PersistentKeepalive = 25` ada di konfigurasi client. Tanpa parameter ini, tabel state firewall pada operator seluler atau router WiFi akan menutup sesi UDP yang dianggap menganggur (*idle*).

Membangun server VPN sendiri memberikan kendali privasi penuh tanpa perlu khawatir log aktivitas kita diintip atau dijual oleh pihak lain.

Sumber: [WireGuard Quick Start](https://wireguard.com/quickstart)
