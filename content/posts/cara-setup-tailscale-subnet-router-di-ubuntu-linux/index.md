---
title: "Cara Setup Tailscale Subnet Router di Ubuntu Linux"
slug: "cara-setup-tailscale-subnet-router-di-ubuntu-linux"
summary: "Panduan praktis setup Tailscale subnet router di Ubuntu Linux untuk mengakses seluruh perangkat LAN rumah tanpa repot port forwarding."
description: "Panduan praktis setup Tailscale subnet router di Ubuntu Linux untuk mengakses seluruh perangkat LAN rumah tanpa repot port forwarding."
categories: ["Networking"]
tags: ["networking", "tailscale", "vpn", "ubuntu-server", "linux", "homelab", "sysadmin"]
keywords: ["cara setup tailscale subnet router di ubuntu"]
authors: ["mifthakhul-huda"]
schema: "tech"
date: 2026-10-22T19:17:17+07:00
draft: false
about:
  - "@type": "SoftwareApplication"
    name: "Tailscale"
    applicationCategory: "Networking Software"
    operatingSystem: "Linux"
---

Pernahkah ente sedang berada di luar rumah atau kantor, lalu tiba-tiba butuh membuka dashboard Proxmox, mengambil berkas dari NAS lokal, mencetak dokumen ke printer jaringan, atau mengecek rekaman IP camera CCTV?

Bagi yang pernah mencoba membangun VPN konvensional seperti OpenVPN atau WireGuard murni, kendalanya langsung terasa nyata di lapangan, om. Sebagian besar koneksi internet rumahan saat ini berada di balik CGNAT (Carrier-Grade NAT) milik ISP. Kita tidak mendapatkan IP publik statis yang bisa diakses langsung dari luar, dan modem ISP kerap mengunci fitur port forwarding. Selain itu, memasang aplikasi klien VPN di setiap perangkat lokal jelas tidak memungkinkan, terutama pada printer jaringan, smart switch, mikrokontroler IoT, atau kamera CCTV dengan firmware tertutup.

Solusi paling elegan untuk memecahkan dilema ini adalah memanfaatkan fitur **Subnet Router** dari Tailscale. Tailscale bekerja di atas fondasi protokol WireGuard modern yang dipadukan dengan teknik NAT traversal otomatis (DERP relay dan STUN). Artinya, koneksi peer-to-peer antar perangkat bisa terhubung langsung meski berada di balik firewall berlapis. Dengan menyulap satu perangkat Ubuntu yang menyala di rumah (bisa mini PC, Raspberry Pi, server bekas, atau virtual machine) menjadi subnet router, seluruh perangkat lain di jaringan lokal LAN bisa langsung ente akses dari mana saja tanpa perlu memasang aplikasi Tailscale pada masing-masing perangkat tersebut.

Di panduan ini, ane ajak ente mengonfigurasi Tailscale subnet router di Ubuntu Server secara terstruktur, mulai dari instalasi paket, pengaturan kernel sysctl, iklan rute lokal, persetujuan di admin console, hingga trik troubleshooting jaringan.

## Prasyarat Sistem dan Jaringan

Sebelum mulai mengeksekusi baris perintah di terminal, pastikan beberapa kebutuhan awal berikut sudah siap:

1. Satu unit server atau mini PC dengan OS Ubuntu 22.04 LTS atau Ubuntu 24.04 LTS yang terhubung stabil ke jaringan LAN lokal.
2. Akun Tailscale aktif (paket gratis personal sudah mencakup hingga 100 perangkat).
3. Akses pengguna dengan hak `sudo` pada mesin Ubuntu tersebut.
4. Informasi blok subnet LAN rumah atau kantor ente, misalnya `192.168.1.0/24`, `192.168.100.0/24`, atau `10.0.0.0/24`. Ente bisa memeriksa blok IP ini lewat perintah `ip route show` di terminal.

## 1. Pasang Tailscale di Ubuntu Server

Langkah awal adalah memasang daemon Tailscale pada mesin Ubuntu. Cara paling bersih dan resmi adalah memakai berkas instalasi resmi yang disediakan tim pengembang Tailscale. Berkas ini secara otomatis mendeteksi arsitektur CPU dan menambahkan repositori APT resmi beserta kunci verifikasi GPG yang valid.

Unduh dan jalankan skrip instalasi resmi:

```bash
curl -fsSL https://tailscale.com/install.sh -o install-tailscale.sh
sh install-tailscale.sh
```

Begitu proses instalasi paket selesai, aktifkan layanan background sistem agar Tailscale otomatis menyala setiap kali server dinyalakan ulang:

```bash
sudo systemctl enable --now tailscaled
```

Ente bisa memverifikasi status layanan dengan perintah `systemctl status tailscaled` untuk memastikan statusnya sudah `active (running)` di sistem.

## 2. Aktifkan Penerusan Paket IP di Kernel Linux

Secara standar, kernel Linux dirancang untuk menolak meneruskan paket data yang alamat tujuannya bukan milik interface mesin itu sendiri. Karena server ini akan bertindak sebagai jembatan router antara jaringan virtual Tailscale (tailnet) dan interface fisik LAN, fitur *IP forwarding* di tingkat kernel wajib diaktifkan.

Buka atau buat berkas konfigurasi sysctl khusus di `/etc/sysctl.d/99-tailscale.conf`:

```bash
sudo nano /etc/sysctl.d/99-tailscale.conf
```

Masukkan dua baris parameter kernel berikut ke dalam berkas:

```text
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
```

Simpan berkas, lalu terapkan pengaturan tersebut langsung ke kernel yang sedang berjalan tanpa perlu melakukan reboot:

```bash
sudo sysctl --load=/etc/sysctl.d/99-tailscale.conf
```

Jika terminal menampilkan output `net.ipv4.ip_forward = 1` dan `net.ipv6.conf.all.forwarding = 1`, berarti kernel Linux ente sudah siap menjalankan tugas penerusan rute.

## 3. Hubungkan Mesin dan Iklankan Rute Subnet Lokal

Langkah berikutnya adalah menghubungkan mesin Ubuntu ke akun Tailscale sambil mengiklankan rute subnet lokal LAN. Ganti subnet `192.168.1.0/24` pada contoh di bawah dengan blok subnet jaringan lokal yang ingin ente buka aksesnya:

```bash
sudo tailscale up --advertise-routes=192.168.1.0/24
```

Jika jaringan rumah ente juga memiliki subnet tambahan atau memakai blok `10.0.0.0/24`, ente bisa memisahkan beberapa subnet menggunakan tanda koma, contohnya `--advertise-routes=192.168.1.0/24,10.0.0.0/24`.

Bagi mesin yang baru pertama kali menjalankan Tailscale, terminal akan menampilkan tautan otentikasi login. Buka URL tersebut di peramban web HP atau laptop, lalu lakukan login menggunakan akun Tailscale ente. Setelah otentikasi berhasil, perangkat Ubuntu resmi terdaftar di tailnet.

## 4. Setujui Rute Subnet di Admin Console Tailscale

Demi alasan keamanan jaringan, rute yang diiklankan dari terminal tidak akan langsung aktif sebelum pemilik akun menyetujuinya secara manual lewat konsol manajemen Tailscale.

Lakukan langkah persetujuan rute berikut ini:

1. Buka peramban dan masuk ke dashboard manajemen di alamat `login.tailscale.com/admin/machines`.
2. Cari nama mesin Ubuntu yang baru saja didaftarkan sebagai subnet router. Di samping nama mesin, ente akan melihat badge kecil berwarna biru bertuliskan *Subnets*.
3. Klik tombol ikon tiga titik horizontal di sisi paling kanan baris perangkat tersebut, lalu pilih opsi **Edit route settings**.
4. Pada panel pop-up yang muncul, centang kotak di samping subnet yang ente iklankan tadi (misalnya `192.168.1.0/24`).
5. Klik **Save** untuk menyimpan pengaturan.

Mulai momen ini, server koordinator Tailscale akan menyebarkan informasi rute subnet tersebut ke seluruh perangkat lain yang terhubung di tailnet ente.

## 5. Penyesuaian Kebijakan Firewall UFW di Server

Banyak pengguna pemula mengalami kendala di tahap ini, om. Rute sudah disetujui di admin console, tapi ping ke perangkat lokal tetap timeout. Masalah ini umumnya disebabkan oleh firewall UFW (Uncomplicated Firewall) di Ubuntu yang secara bawaan menolak lalu lintas penerusan paket (*forwarding traffic*).

Buka berkas konfigurasi default UFW di `/etc/default/ufw`:

```bash
sudo nano /etc/default/ufw
```

Cari baris `DEFAULT_FORWARD_POLICY` dan ubah nilainya dari `DROP` menjadi `ACCEPT`:

```text
DEFAULT_FORWARD_POLICY="ACCEPT"
```

Simpan berkas tersebut, lalu muat ulang aturan UFW agar perubahannya segera berlaku:

```bash
sudo ufw reload
```

Dengan setelan ini, UFW tidak akan memotong paket data yang dialihkan dari interface virtual Tailscale (`tailscale0`) menuju interface jaringan fisik server (`eth0` atau `enp3s0`).

## 6. Konfigurasi di Sisi Perangkat Klien

Setelah subnet router aktif, bagaimana cara perangkat lain mengakses rute LAN tersebut?

1. **Perangkat Android, iOS, Windows, dan macOS:** Klien resmi Tailscale pada sistem operasi ini secara otomatis mendeteksi dan mengaktifkan rute subnet baru tanpa perlu campur tangan manual. Begitu aplikasi terkoneksi, ente bisa langsung mengakses IP LAN target.
2. **Perangkat Klien Linux:** Khusus pada mesin klien yang memakai Linux (misalnya laptop harian ente yang menjalankan Fedora, Arch, atau Ubuntu), Tailscale secara default sengaja tidak langsung menimpa tabel routing lokal demi menghindari konflik IP. Agar klien Linux menerima rute subnet yang diiklankan, jalankan perintah ini di laptop klien:

```bash
sudo tailscale set --accept-routes=true
```

Atau jika baru pertama kali menyambungkan klien Linux:

```bash
sudo tailscale up --accept-routes
```

## 7. Verifikasi dan Pengujian Koneksi Jarak Jauh

Untuk memastikan seluruh konfigurasi berfungsi sempurna, lakukan pengujian dari luar jaringan rumah:

1. Putuskan sambungan laptop atau HP dari WiFi rumah, lalu hubungkan ke koneksi seluler (hotspot HP atau paket data 4G/5G).
2. Pastikan status aplikasi Tailscale di laptop atau HP menunjukkan indikator terhubung (*Connected*).
3. Buka terminal atau Command Prompt di perangkat klien, lalu lakukan tes ping ke salah satu alamat IP perangkat lokal yang tidak terpasang Tailscale, misalnya router utama rumah:

```bash
ping 192.168.1.1
```

4. Buka peramban web di laptop klien, lalu akses dashboard web perangkat internal LAN yang biasa ente buka di rumah, misalnya web UI router di `http://192.168.1.1` atau web console Proxmox VE di `https://192.168.1.100:8006`.

Jika halaman antarmuka perangkat terbuka lancar dan paket ping merespons stabil, berarti konfigurasi subnet router ente sudah berhasil 100 persen.

## 8. Solusi Masalah Umum dan Rekomendasi Praktis

Selama mengulik konfigurasi subnet router di Linux, ada beberapa tips praktis yang sangat berguna untuk mencegah kendala di kemudian hari:

1. **Nonaktifkan Kedaluwarsa Kunci Otentikasi (Key Expiry):** Secara bawaan, Tailscale menerapkan masa berlaku kunci mesin selama 180 hari untuk alasan keamanan. Pada perangkat server yang bertindak sebagai infrastruktur router mandiri, kedaluwarsa kunci bisa membuat koneksi putus tiba-tiba tanpa disadari. Masuk ke Admin Console Tailscale, klik ikon tiga titik pada mesin subnet router, lalu pilih **Disable key expiry**.
2. **Antisipasi Bentrok Subnet Sama (Subnet Overlap):** Jika subnet rumah ente memakai rentang pasaran `192.168.1.0/24` dan saat bepergian ente terhubung ke WiFi kafe atau hotel yang kebetulan juga membagikan IP `192.168.1.0/24`, sistem operasi klien akan bingung menentukan arah paket data. Ane sangat menyarankan untuk mengganti blok IP LAN di router rumah ente ke rentang yang lebih unik, seperti `192.168.88.0/24` atau `10.50.0.0/24`.
3. **Cek Status Rute Real-Time:** Jika suatu saat koneksi terasa terganggu, jalankan perintah `tailscale status` di server untuk melihat apakah node masih terhubung ke jaringan koordinasi, serta gunakan perintah `ip route show` untuk memeriksa apakah rute kernel tetap utuh.

Melalui pendekatan subnet router ini, ente bisa mengontrol seluruh infrastruktur jaringan lokal secara fleksibel dari mana saja tanpa bergantung pada IP publik ISP dan tanpa membuka celah keamanan port forwarding ke internet bebas.

Sumber: [Tailscale Documentation](https://tailscale.com/docs/features/subnet-routers)
