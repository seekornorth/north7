---
title: "Cara Konfigurasi Nftables Linux Mint"
slug: "cara-konfigurasi-nftables-linux-mint"
summary: "Panduan praktis cara konfigurasi nftables di Linux Mint sebagai pengganti UFW modern, lengkap dengan aturan stateful, proteksi port, dan optimasi performa."
description: "Tutorial langkah demi langkah cara konfigurasi nftables Linux Mint. Pelajari migrasi dari UFW, penulisan ruleset inet, serta verifikasi keamanan jaringan desktop."
categories: ["Networking"]
tags: ["networking", "nftables", "firewall", "linux-mint", "sysadmin", "keamanan-jaringan", "netfilter"]
keywords: ["nftables linux mint"]
authors: ["mifthakhul-huda"]
schema: "howto"
steps:
  - name: "Nonaktifkan UFW dan Pasang Paket Nftables"
    text: "Matikan firewall bawaan UFW dan pasang paket nftables resmi agar kernel Linux Mint siap mengelola ruleset Netfilter modern tanpa konflik."
  - name: "Pahami Arsitektur Hook Netfilter pada Linux Mint"
    text: "Pelajari titik pemrosesan paket data mulai dari hook ingress, prerouting, input, forward, hingga output untuk menyusun arsitektur firewall yang tepat."
  - name: "Susun File Konfigurasi Stateful Firewall Dasar"
    text: "Tulis berkas konfigurasi dengan deklarasi tabel inet, izin lalu lintas loopback, pelacakan koneksi conntrack established dan related, serta pembuangan paket invalid."
  - name: "Atur Pengecualian Port Layanan Workstation dan LAN"
    text: "Buka port komunikasi krusial seperti SSH, mDNS untuk penemuan perangkat lokal, dan transfer file jaringan menggunakan set port terpusat."
  - name: "Validasi Integritas Sintaks dan Terapkan Konfigurasi"
    text: "Uji berkas konfigurasi menggunakan opsi pengecekan sintaks nftables sebelum mengaktifkan unit startup agar aturan dimuat otomatis saat booting."
  - name: "Pantau Lalu Lintas Paket dan Verifikasi Ketahanan Aturan"
    text: "Periksa ruleset aktif di dalam kernel menggunakan perintah inspeksi nft serta pantau hit counter paket data secara real-time."
date: 2026-10-31T18:06:30+07:00
draft: false
about:
  - "@type": "SoftwareApplication"
    name: "nftables"
    applicationCategory: "Networking Software"
    operatingSystem: "Linux Mint"
  - "@type": "OperatingSystem"
    name: "Linux Mint"
---

Secara bawaan, Linux Mint mengandalkan UFW (Uncomplicated Firewall) beserta front-end grafis Gufw untuk mengelola filter lalu lintas jaringan. Pendekatan ini memang ramah bagi pengguna baru yang hanya butuh tombol on dan off untuk mengamankan laptop dari jaringan publik. Namun, begitu ente mulai memanfaatkan Linux Mint sebagai workstation teknis, laboratorium homelab, media server rumahan, atau mesin pengembangan lokal yang mengelola multi-interface (Wi-Fi, Ethernet fisik, bridge mesin virtual KVM, hingga tunnel VPN WireGuard atau Tailscale), UFW mulai memperlihatkan keterbatasannya.

Keterbatasan utama UFW terletak pada ketergantungannya terhadap abstraksi layer iptables lawas. Aturan IPv4 dan IPv6 harus dikelola secara terpisah, sintaks ekspresinya bersifat prosedural linier yang kurang efisien untuk puluhan aturan rumit, dan fleksibilitas manipulasi paket sangat terbatas.

Di balik layar distribusi modern berbasis Ubuntu dan Debian seperti Linux Mint 21 maupun Linux Mint 22, subsistem Netfilter di kernel Linux sesungguhnya telah menjadikan nftables sebagai mesin pemrosesan paket generasi baru. Nftables menyatukan aturan IPv4 dan IPv6 ke dalam satu keluarga tabel `inet`, mengeksekusi pencocokan paket dalam bytecode virtual machine yang cepat dengan performa O(1) berbasis set atau dictionary, dan mengadopsi sintaks deklaratif yang rapi.

Panduan ini akan mengupas tuntas cara konfigurasi nftables di Linux Mint secara bertahap, mulai dari proses transisi pembersihan UFW, penyusunan file konfigurasi stateful firewall yang aman bagi workstation desktop, hingga teknik verifikasi dan pemecahan masalah.

## Prasyarat Sistem

Sebelum menyentuh konfigurasi jaringan, pastikan workstation atau server mini Linux Mint ente telah memenuhi kriteria berikut:

1. Sistem operasi Linux Mint (edisi Cinnamon, MATE, maupun Xfce) versi 21 LTS atau 22 LTS yang terpasang pembaruan paket terbaru.
2. Akun pengguna dengan hak akses administratif (`sudo`).
3. Akses terminal fisik atau sesi SSH lokal. Jika ente mengonfigurasi mesin secara remote via SSH, pastikan koneksi cadangan siap digunakan agar tidak terkunci saat ruleset pertama kali dimuat.
4. Pemahaman dasar mengenai alamat IP lokal, antarmuka jaringan (misalnya `eth0`, `enp3s0`, atau `wlan0`), dan nomor port standar.

## Langkah 1: Nonaktifkan UFW dan Pasang Paket Nftables

Langkah awal yang wajib dilakukan adalah memastikan tidak ada dua pengelola firewall yang saling berebut kontrol atas subsistem Netfilter. Berjalan berdampingan antara UFW dan nftables secara native berpotensi menimbulkan kondisi balapan (*race condition*) atau aturan ganda yang membingungkan alur paket.

Buka terminal Linux Mint ente, lalu nonaktifkan UFW bawaan:

```bash
sudo ufw disable
```

Langkah tersebut memastikan UFW tidak lagi memanipulasi aturan filter paket di latar belakang.

Selanjutnya, pasang paket `nftables` resmi dari repositori Linux Mint:

```bash
sudo apt update
sudo apt install nftables iptables-persistent-
```

Setelah instalasi selesai, bersihkan sisa-sisa aturan iptables warisan yang mungkin masih tertinggal di dalam memori kernel agar kanvas Netfilter benar-benar bersih:

```bash
sudo iptables -F
sudo ip6tables -F
sudo iptables -X
sudo ip6tables -X
sudo iptables -t nat -F
sudo iptables -t nat -X
sudo iptables -t mangle -F
sudo iptables -t mangle -X
```

Kini kernel Linux Mint siap menerima konfigurasi nftables murni.

## Langkah 2: Pahami Arsitektur Hook Netfilter pada Linux Mint

Sebelum menulis aturan baris demi baris, ente perlu memahami bagaimana paket data mengalir di dalam tumpukan jaringan Linux (*Linux network stack*). Berbeda dengan iptables yang memaksakan tabel dan rantai bawaan (seperti filter, nat, INPUT, dan OUTPUT) sejak awal, nftables tidak menyediakan tabel maupun rantai secara default. Ente memiliki kebebasan penuh merancang struktur tabel sendiri.

Di dalam kernel Linux, paket data melewati serangkaian titik kait (*hooks*) tertentu:

![Diagram Alur Pemrosesan Paket Data Netfilter](2.png)
*Sumber: [Netfilter Project](https://wiki.nftables.org/wiki-nftables/index.php/Netfilter_hooks)*

1. **Ingress**: Titik paling awal tempat paket diterima dari kartu jaringan (NIC), ideal untuk membuang serangan DDoS volume tinggi sebelum alokasi memori paket lebih dalam.
2. **Prerouting**: Titik evaluasi paket sebelum keputusan perutean (*routing decision*) diambil, tempat umum untuk Destination NAT (Port Forwarding).
3. **Input**: Titik evaluasi untuk paket yang alamat tujuannya adalah mesin lokal Linux Mint ente sendiri.
4. **Forward**: Titik pemrosesan untuk paket yang hanya menumpang lewat menuju perangkat lain (misalnya jika Linux Mint difungsikan sebagai router atau gateway VM).
5. **Output**: Titik awal ketika proses atau aplikasi di dalam Linux Mint mengirimkan paket ke luar jaringan.
6. **Postrouting**: Titik terakhir sebelum paket meninggalkan interface fisik, tempat umum untuk Source NAT (Masquerade).

Untuk kebutuhan firewall komputer workstation atau desktop, rantai utama yang paling krusial adalah rantai **input** dan **output**.

## Langkah 3: Susun File Konfigurasi Stateful Firewall Dasar

Di Linux Mint, konfigurasi nftables persisten disimpan pada berkas `/etc/nftables.conf`. Berkas ini dibaca oleh interpreter `nft` saat unit layanan startup dijalankan saat proses booting.

Cadangkan berkas bawaan terlebih dahulu ke direktori home sebagai langkah antisipasi:

```bash
sudo cp /etc/nftables.conf ~/nftables.conf.bak
```

Buka berkas `/etc/nftables.conf` menggunakan editor teks nano:

```bash
sudo nano /etc/nftables.conf
```

Ganti seluruh isinya dengan struktur konfigurasi stateful berikut:

```nft
#!/usr/sbin/nft -f

# Bersihkan seluruh ruleset sebelumnya di memori
flush ruleset

# Definisikan tabel filter keluarga inet (mencakup IPv4 dan IPv6)
table inet filter {

    # Rantai input: menolak paket asing secara default
    chain input {
        type filter hook input priority filter; policy drop;

        # Izinkan semua lalu lintas pada antarmuka loopback
        iifname "lo" accept

        # Pelacakan koneksi conntrack: terima paket yang sudah terjalin
        ct state established,related accept

        # Buang paket dengan status invalid tanpa ampun
        ct state invalid drop

        # Izinkan paket ICMP dan ICMPv6 penting untuk stabilitas jaringan
        ip protocol icmp icmp type { echo-request, echo-reply, destination-unreachable, time-exceeded } accept
        ip6 nexthdr icmpv6 icmpv6 type { echo-request, echo-reply, destination-unreachable, packet-too-big, time-exceeded, parameter-problem, nd-router-solicit, nd-router-advert, nd-neighbor-solicit, nd-neighbor-advert } accept

        # Lompat ke rantai layanan workstation lokal
        jump workstation_in
    }

    # Rantai perantara untuk mengelola port layanan lokal
    chain workstation_in {
        # Port layanan yang diizinkan akan dideklarasikan di sini
    }

    # Rantai forward: matikan perutean paket jika bukan router
    chain forward {
        type filter hook forward priority filter; policy drop;
    }

    # Rantai output: izinkan semua koneksi keluar dari aplikasi lokal
    chain output {
        type filter hook output priority filter; policy accept;
    }
}
```

Perhatikan baris `ct state established,related accept`. Ini adalah jantung dari *stateful firewall*. Begitu peramban web ente membuka koneksi ke internet, paket jawaban dari server tujuan akan otomatis diizinkan masuk karena status koneksinya sudah tercatat di tabel conntrack kernel.

## Langkah 4: Atur Pengecualian Port Layanan Workstation dan Jaringan Lokal

Sebagai komputer desktop Linux Mint, sistem ente kemungkinan membutuhkan akses untuk berbagai fitur jaringan lokal, seperti:

- Penemuan printer dan scanner jaringan melalui protokol mDNS (port UDP 5353).
- Berbagi file antarmesin lokal menggunakan Warpinator (fitur khas Linux Mint pada port TCP 42000).
- Akses remote administrasi via OpenSSH (port TCP 22).
- Akses media server lokal seperti Plex atau Jellyfin (port TCP 8096) jika difungsikan sebagai server mini.

Dalam nftables, ente tidak perlu menulis satu baris aturan terpisah untuk setiap nomor port layaknya iptables. Ente dapat memanfaatkan fitur *Set* atau daftar port ringkas di dalam rantai `workstation_in`.

Tambahkan aturan berikut ke dalam rantai `workstation_in` pada berkas `/etc/nftables.conf`:

```nft
    chain workstation_in {
        # Izinkan SSH dengan pembatasan percobaan koneksi (rate limiting brute force)
        tcp dport 22 ct state new limit rate 10/minute accept

        # Buka port Warpinator Linux Mint untuk transfer file LAN
        tcp dport 42000 accept
        udp dport 42000 accept

        # Izinkan mDNS (Avahi/Bonjour) untuk deteksi printer dan hostname .local di LAN
        udp dport 5353 ip daddr 224.0.0.251 accept
        udp dport 5353 ip6 daddr ff02::fb accept

        # Izinkan DHCP Client untuk pembaruan alamat IP dari router
        udp sport 67 udp dport 68 accept
        udp sport 547 udp dport 546 accept

        # Catat paket lain yang dicurigai (opsional, dibatasi agar tidak membanjiri log)
        limit rate 3/minute log prefix "NFT_INPUT_REJECT: " level warning
    }
```

Penerapan `limit rate 10/minute` pada port 22 secara otomatis meredam upaya brute force SSH dari botnet pemindai jaringan tanpa memerlukan perkakas pihak ketiga tambahan seperti fail2ban untuk kebutuhan skala kecil.

Simpan perubahan berkas dengan menekan `Ctrl + O`, lalu keluar dengan `Ctrl + X`.

## Langkah 5: Validasi Integritas Sintaks dan Terapkan Konfigurasi

Keunggulan luar biasa dari nftables adalah dukungannya terhadap verifikasi aturan secara aman sebelum diterapkan ke kernel aktif. Fitur ini menyelamatkan ente dari insiden koneksi terputus akibat salah ketik tanda kurung atau titik koma.

Jalankan perintah pengujian sintaks berkas:

```bash
sudo nft -c -f /etc/nftables.conf
```

Jika terminal tidak mengembalikan pesan galat apapun, artinya sintaks konfigurasi ente sudah valid.

Sekarang, terapkan aturan tersebut ke kernel secara atomik:

```bash
sudo nft -f /etc/nftables.conf
```

Operasi pemuatan ini berjalan dalam satu transaksi atomik. Artinya, kernel tidak akan membiarkan kondisi firewall berada di antara aturan lama dan baru; semua aturan diterapkan seketika tanpa jeda kebocoran paket.

Agar konfigurasi ini otomatis dimuat setiap kali komputer Linux Mint dinyalakan, pastikan unit layanan firewall diaktifkan pada sistem:

```bash
sudo systemctl enable nftables
```

## Langkah 6: Pantau Lalu Lintas Paket dan Verifikasi Ketahanan Aturan

Setelah firewall beroperasi penuh, saatnya memverifikasi apakah aturan benar-benar bekerja sesuai skenario yang dirancang.

### 1. Menampilkan Ruleset Aktif

Untuk melihat susunan aturan yang saat ini diterapkan di dalam memori kernel:

```bash
sudo nft list ruleset
```

Jika ente ingin melihat penanda nomor unik (*handle*) untuk setiap baris aturan (berguna saat ingin menghapus aturan spesifik secara dinamis), tambahkan opsi `-a`:

```bash
sudo nft -a list ruleset
```

### 2. Memantau Hit Counter Paket Secara Real-Time

Ente dapat memperoleh statistik dengan mengamati pergerakan angka penghitung menggunakan alat bantu `watch`:

```bash
watch -n 1 'sudo nft list chain inet filter workstation_in'
```

### 3. Pengujian dari Perangkat Lain

Lakukan pengujian pemindaian port dari perangkat lain yang berada dalam satu jaringan lokal menggunakan utility `nmap`:

```bash
nmap -Pn -p 22,80,42000,5353 <IP_LINUX_MINT_ENTE>
```

Hasil pemindaian harus menunjukkan port 22 dan 42000 dalam status `open`, sedangkan port yang tidak dideklarasikan (seperti port 80) akan berstatus `filtered` karena paket dibuang senyap oleh kebijakan default `policy drop`.

## Solusi Kendala Umum (Troubleshooting)

Saat mengimplementasikan nftables di desktop Linux Mint, beberapa kendala umum berikut mungkin muncul:

### 1. Perangkat Printer Jaringan atau Samba Share Tidak Terdeteksi
Jika komputer Linux Mint ente gagal mendeteksi printer jaringan atau komputer Windows di lingkungan LAN, penyebab paling umum adalah terblokirnya paket NetBIOS dan LLMNR. Tambahkan rentang port Samba dan penemuan nama lokal ke rantai `workstation_in`:

```nft
udp dport { 137, 138 } accept
tcp dport { 139, 445 } accept
udp dport 5355 accept
```

### 2. Integrasi dengan Kontainer Docker
Docker secara default memanipulasi aturan iptables secara otomatis. Jika ente menjalankan Docker di Linux Mint, Docker Daemon akan menyisipkan rantai `DOCKER` di tabel Netfilter. Pastikan ente tidak menghapus tabel bawaan Docker saat menjalankan perintah manual `sudo nft flush ruleset` di terminal interaktif. Solusi terbaik adalah membiarkan tabel `inet filter` milik ente mengelola keamanan host lokal, sementara Docker mengelola tabel `ip filter` miliknya sendiri tanpa tumpang tindih.

### 3. Kesalahan Eksekusi Skrip nftables Saat Booting
Jika service nftables gagal aktif saat sistem booting, periksa catatan jurnal sistem dan pastikan penggunaan klausa pencocokan interface menggunakan `iifname` (pencocokan nama dinamis string), bukan `iif` (pencocokan indeks integer kartu jaringan).

Dengan mengadopsi nftables di Linux Mint, sistem workstation ente kini memiliki fondasi keamanan jaringan yang kokoh, berkinerja tinggi, efisien dalam konsumsi sumber daya CPU, dan siap mendukung skenario jaringan modern.

Sumber: [Netfilter nftables Documentation](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page)
