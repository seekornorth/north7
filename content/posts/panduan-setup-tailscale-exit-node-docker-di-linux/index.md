---
title: "Panduan Setup Tailscale Exit Node Docker di Linux"
slug: "panduan-setup-tailscale-exit-node-docker-di-linux"
date: 2026-11-08T18:09:27+07:00
summary: "Panduan teknis konfigurasi Tailscale exit node di dalam Docker Linux menggunakan Docker Compose, aktivasi IP forwarding, perutean kernel tun, dan verifikasi trafik."
description: "Pelajari cara setup tailscale exit node docker di Linux. Amankan koneksi internet publik dengan enkripsi WireGuard deklaratif, efisien, dan terisolasi."
categories: ["Networking"]
tags: ["tailscale", "docker", "docker-compose", "vpn", "networking", "linux", "wireguard"]
keywords: ["tailscale exit node docker"]
authors: ["mifthakhul-huda"]
schema: "howto"
steps:
  - name: "Konfigurasi IP Forwarding pada Host Linux"
    text: "Aktifkan packet forwarding IPv4 dan IPv6 pada kernel host agar lalu lintas internet klien dapat diteruskan melewati kontainer."
  - name: "Siapkan Direktori Kerja dan Auth Key Tailscale"
    text: "Buat direktori penyimpanan persisten dan generate Auth Key melalui Tailscale Admin Console untuk otentikasi kontainer."
  - name: "Susun File docker-compose.yml"
    text: "Konfigurasikan image resmi tailscale dengan akses device tun, kapabilitas NET_ADMIN, network mode host, dan parameter advertise exit node."
  - name: "Jalankan Kontainer dan Setujui Exit Node di Admin Console"
    text: "Eksekusi kontainer dengan docker compose up lalu lakukan approve rute exit node melalui menu Machines di Tailscale Admin Console."
  - name: "Hubungkan Klien dan Verifikasi Rute Lalu Lintas Internet"
    text: "Konfigurasikan perangkat klien untuk menggunakan exit node Tailscale dan uji perubahan alamat IP publik menggunakan curl."
---

Mengamankan seluruh lalu lintas data saat tersambung ke jaringan nirkabel publik seperti kafe, bandara, atau hotel merupakan kebutuhan mendesak bagi praktisi teknologi. Secara default, Tailscale beroperasi sebagai jaringan overlay mesh tertutup yang hanya menghubungkan komunikasi antar node internal tailnet tanpa membelokkan rute lalu lintas internet umum. Fitur exit node hadir untuk mengubah sebuah mesin di dalam tailnet menjadi gateway terenkripsi penuh (default route `0.0.0.0/0` dan `::/0`), mirip dengan cara kerja VPN komersial konvensional namun dibangun di atas protokol modern WireGuard.

Menjalankan implementasi **tailscale exit node docker** di lingkungan Linux memberikan keuntungan arsitektural yang signifikan dibandingkan instalasi bare-metal melalui manajer paket distro. Pendekatan kontainerisasi memisahkan dependensi daemon jaringan dari sistem operasi host, menyediakan konfigurasi infrastruktur deklaratif via Docker Compose, menyederhanakan pencadangan identitas node, serta memudahkan migrasi ke VPS atau server lain tanpa perlu mengkonfigurasi ulang paket dari awal.

Panduan ini menyajikan langkah demi langkah perancangan Tailscale exit node berbasis Docker di Linux, mulai dari modifikasi parameter kernel sistem operasi host, penyusunan berkas konfigurasi Compose, proses persetujuan rute pada panel kendali Tailscale, hingga teknik verifikasi dan mitigasi kendala firewall.

## Prasyarat Sistem

Sebelum menyusun kontainer, pastikan server atau VPS Anda memenuhi kriteria operasional berikut:

1. **Sistem Operasi Linux**: Distribusi Linux modern 64-bit seperti Ubuntu Server 22.04/24.04 LTS, Debian 12, Fedora Server, atau AlmaLinux.
2. **Akses Hak Akses Administratif**: Akses akun dengan hak istimewa sudo untuk memodifikasi parameter sysctl kernel dan aturan firewall.
3. **Docker Engine dan Docker Compose v2**: Daemon Docker telah aktif dan plugin Compose siap digunakan.
4. **Modul Kernel TUN/TAP**: Antarmuka virtual network tun tersedia di sistem host.
5. **Akun Tailscale Aktif**: Akun terdaftar pada Tailscale untuk mengakses Admin Console.

Lakukan pengujian keberadaan antarmuka `/dev/net/tun` pada host melalui terminal:

```bash
ls -l /dev/net/tun
```

Jika muncul pesan kesalahan bahwa file tidak ditemukan, aktifkan modul kernel yang bersangkutan dengan perintah berikut:

```bash
sudo modprobe tun
```

## Langkah 1: Konfigurasi IP Forwarding pada Host Linux

Karena fungsi exit node bertindak sebagai gateway perantara yang menerima paket dari klien Tailscale lalu memforward paket tersebut ke internet publik, kernel Linux pada mesin host wajib diinstruksikan untuk mengizinkan penerusan paket (packet forwarding).

Buat berkas konfigurasi sysctl khusus untuk Tailscale di dalam direktori `/etc/sysctl.d/`:

```bash
sudo nano /etc/sysctl.d/99-tailscale.conf
```

Tambahkan dua baris parameter berikut ke dalam berkas:

```ini
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
```

Simpan berkas, kemudian muat ulang konfigurasi sysctl agar perubahan langsung diterapkan oleh kernel tanpa perlu menyalakan ulang server:

```bash
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf
```

Pastikan nilai output menampilkan angka 1 untuk kedua variabel tersebut guna memastikan kernel host siap meneruskan aliran paket data.

## Langkah 2: Persiapan Direktori Kerja dan Auth Key Tailscale

Otentikasi otomatis kontainer Tailscale membutuhkan kunci otentikasi (Auth Key). Hal ini mencegah kontainer terhenti menunggu interaksi tautan login manual di browser.

1. Buka Tailscale Admin Console pada peramban web di bagian Keys.
2. Masuk ke menu Settings lalu pilih Keys.
3. Klik tombol Generate auth key.
4. Aktifkan opsi Reusable jika Anda berencana menggunakan kunci ini berulang kali saat pengujian, atau biarkan non-reusable untuk satu mesin.
5. Bila Anda menerapkan Access Control List (ACL) berbasis tag, tambahkan tag yang relevan seperti tag:server.
6. Klik Generate key dan salin token yang diawali dengan tskey-auth ke tempat yang aman.

Selanjutnya di mesin Linux, buat folder kerja terisolasi beserta direktori data untuk menyimpan identitas node secara persisten:

```bash
mkdir -p ~/tailscale-docker/data
cd ~/tailscale-docker
```

Direktori data akan dimount ke dalam kontainer di `/var/lib/tailscale`. Langkah ini sangat penting agar setiap kali kontainer diperbarui atau dihidupkan ulang, mesin tidak membuat identitas baru (duplikasi node) di dashboard Tailscale.

## Langkah 3: Susun File docker-compose.yml

Buat berkas `docker-compose.yml` di dalam folder kerja:

```bash
nano docker-compose.yml
```

Masukkan konfigurasi deklaratif berikut:

```yaml
services:
  tailscale:
    image: tailscale/tailscale:latest
    container_name: tailscale-exit-node
    hostname: docker-exit-node
    network_mode: host
    cap_add:
      - NET_ADMIN
      - NET_RAW
    devices:
      - /dev/net/tun:/dev/net/tun
    volumes:
      - ./data:/var/lib/tailscale
      - /dev/net/tun:/dev/net/tun
    environment:
      - TS_AUTHKEY=tskey-auth-kxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      - TS_EXTRA_ARGS=--advertise-exit-node --reset
      - TS_STATE_DIR=/var/lib/tailscale
      - TS_USERSPACE=false
      - TS_ACCEPT_DNS=true
    restart: unless-stopped
```

Ganti nilai `TS_AUTHKEY` dengan token rahasia yang Anda buat pada langkah sebelumnya.

Mari bedah parameter krusial pada konfigurasi di atas:

- `network_mode: host`: Memberikan kontainer akses langsung ke antarmuka fisik dan tabel routing host. Mode ini sangat disarankan untuk skenario gateway exit node guna menghindari performa terdegradasi dan komplikasi Network Address Translation (NAT) ganda pada bridge Docker default.
- `cap_add: [NET_ADMIN, NET_RAW]`: Memberikan kapabilitas tingkat kernel kepada kontainer untuk mengatur tabel routing dan memanipulasi paket jaringan mentah.
- `devices: [/dev/net/tun:/dev/net/tun]`: Memberikan jalur akses fisik ke perangkat virtual TUN Linux untuk enkripsi terowongan WireGuard.
- `TS_USERSPACE=false`: Memaksa Tailscale menggunakan stack jaringan kernel Linux bawaan alih-alih netstack userspace. Mode kernel memberikan throughput transmisi data yang jauh lebih tinggi dan latensi lebih rendah.
- `TS_EXTRA_ARGS=--advertise-exit-node --reset`: Argumen CLI otomatis yang memerintahkan kontainer untuk mengiklankan dirinya sebagai exit node ke seluruh tailnet.
- `TS_STATE_DIR=/var/lib/tailscale`: Mengarahkan lokasi penyimpanan kredensial node ke volume yang telah dimount secara persisten.

![Diagram alur transmisi jaringan melalui Tailscale exit node](2.png)
*Sumber: [Tailscale Official Documentation](https://tailscale.com/kb/1103/exit-nodes)*

## Langkah 4: Jalankan Kontainer dan Setujui Exit Node di Admin Console

Jalankan kontainer Tailscale di latar belakang menggunakan perintah Docker Compose:

```bash
docker compose up -d
```

Pantau catatan log kontainer untuk memastikan otentikasi berhasil dan antarmuka tunneling aktif:

```bash
docker compose logs -f tailscale
```

Jika log menampilkan status boot bahwa tailscale telah up and running, kontainer telah berhasil tersambung ke tailnet Anda.

Demi alasan keamanan siber, Tailscale tidak secara otomatis mengizinkan sebuah node untuk merutekan seluruh lalu lintas internet tailnet sebelum disetujui secara manual oleh administrator. Lakukan langkah otorisasi berikut:

1. Buka Tailscale Admin Console pada bagian Machines.
2. Cari node dengan nama `docker-exit-node`. Anda akan melihat lencana penanda bertuliskan Exit Node di samping nama mesin.
3. Klik tombol menu titik tiga di sisi kanan baris node tersebut.
4. Pilih opsi Edit route settings.
5. Berikan tanda centang pada opsi Use as exit node.
6. Klik Save.

Status node kini resmi disetujui sebagai gerbang keluar lalu lintas internet tailnet Anda.

## Langkah 5: Hubungkan Klien dan Verifikasi Rute Lalu Lintas

Setelah exit node aktif dan disetujui, Anda dapat mengarahkan perangkat klien untuk menggunakan rute keluar server Docker tersebut.

### Konfigurasi dari Klien Linux

Pada perangkat klien Linux yang sudah terpasang Tailscale, aktifkan exit node melalui perintah CLI:

```bash
sudo tailscale set --exit-node=docker-exit-node
```

Jika Anda ingin tetap mempertahankan koneksi langsung ke printer atau perangkat lain di jaringan lokal LAN tempat klien berada, sertakan flag tambahan berikut:

```bash
sudo tailscale set --exit-node=docker-exit-node --exit-node-allow-lan-access=true
```

Untuk menghentikan pengalihan lalu lintas melalui exit node di kemudian hari, kosongkan parameter target:

```bash
sudo tailscale set --exit-node=
```

### Konfigurasi dari Klien Windows, macOS, Android, dan iOS

1. Buka aplikasi Tailscale pada perangkat Anda.
2. Buka menu Exit Node pada panel kontrol aplikasi.
3. Pilih perangkat `docker-exit-node` dari daftar yang tersedia.
4. Aktifkan toggle Allow Local Network Access apabila Anda membutuhkan akses ke subnet lokal tempat perangkat Anda terhubung.

### Verifikasi Keberhasilan Routing

Jalankan perintah pengujian identitas IP publik dari terminal klien:

```bash
curl https://ipinfo.io/json
```

Perhatikan output JSON yang dikembalikan. Nilai `ip`, `city`, dan `org` harus menunjukkan identitas server VPS atau mesin host Docker Anda, bukan identitas penyedia internet lokal tempat klien Anda sedang terhubung.

Lakukan pengujian resolusi DNS untuk memastikan tidak terjadi kebocoran DNS:

```bash
nslookup whoami.akamai.net
```

Respons alamat IP resolver yang muncul harus merupakan IP publik milik server exit node atau upstream DNS yang ditentukan pada konfigurasi MagicDNS tailnet Anda.

## Solusi Kendala Umum (Troubleshooting)

### 1. Klien Kehilangan Koneksi Internet Saat Exit Node Aktif

Klien berhasil terhubung ke exit node tetapi halaman situs web tidak dapat dimuat atau mengalami connection timeout. Masalah ini umumnya disebabkan oleh firewall host (seperti UFW atau iptables) yang memblokir paket forwarding atau belum menerapkan Network Address Translation (NAT Masquerade).

Jika server Anda menggunakan UFW, periksa berkas konfigurasi default forward di `/etc/default/ufw` dan pastikan kebijakan forward bernilai ACCEPT:

```ini
DEFAULT_FORWARD_POLICY="ACCEPT"
```

Bila lalu lintas keluar antarmuka fisik belum di-masquerade secara otomatis oleh Docker, pasang aturan iptables pada antarmuka publik host Anda (misalnya antarmuka `eth0`):

```bash
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

Muat ulang firewall UFW dengan `sudo ufw reload` agar aturan baru segera aktif.

### 2. Kesalahan Device TUN Tidak Ditemukan di Lingkungan VPS

Pada beberapa VPS minimalis berbasis kontainer OpenVZ atau LXC, perangkat `/dev/net/tun` tidak dibuat secara default. Kontainer Tailscale akan mencatat error terkait file device tun yang tidak ditemukan.

Solusinya, buat node device tersebut secara manual di host:

```bash
sudo mkdir -p /dev/net
sudo mknod /dev/net/tun c 10 200
```

Setelah itu, jalankan ulang kontainer Docker Anda untuk memuat antarmuka baru.

### 3. Node Duplikat di Dashboard Setiap Kontainer Dihidupkan Ulang

Kondisi ini terjadi jika direktori `./data` tidak memiliki hak akses tulis yang tepat atau variabel `TS_STATE_DIR` tidak mengarah ke volume persisten, sehingga daemon menganggap kontainer adalah perangkat baru pada setiap boot.

Pastikan direktori lokal `./data` memiliki izin akses yang tepat dan dapat dibaca serta ditulis oleh kontainer.

Pastikan pula baris `TS_STATE_DIR=/var/lib/tailscale` tercantum di dalam berkas `docker-compose.yml` dan direktori `./data` terpasang secara tepat ke `/var/lib/tailscale`.

Sumber: [Tailscale Official Documentation](https://tailscale.com/kb/1103/exit-nodes)
