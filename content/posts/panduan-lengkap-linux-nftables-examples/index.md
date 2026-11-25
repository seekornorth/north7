---
title: "Panduan Lengkap Linux Nftables Examples"
slug: "panduan-lengkap-linux-nftables-examples"
summary: "Kumpulan Linux nftables examples praktis untuk konfigurasi firewall server modern, mulai dari stateful filter, port set, proteksi brute force, hingga NAT forwarding."
description: "Kumpulan Linux nftables examples praktis untuk konfigurasi firewall server modern, mulai dari stateful filter, port set, proteksi brute force, hingga NAT forwarding."
categories: ["Networking"]
tags: ["networking", "nftables", "firewall", "linux", "sysadmin", "server", "keamanan-jaringan"]
keywords: ["linux nftables examples"]
authors: ["mifthakhul-huda"]
schema: "tech"
date: 2026-10-30T18:03:22+07:00
draft: false
about:
  - "@type": "SoftwareApplication"
    name: "nftables"
    applicationCategory: "Networking Software"
    operatingSystem: "Linux"
  - "@type": "Thing"
    name: "Linux"
---

Bagi rekan-rekan sysadmin atau pegiat homelab yang sudah terbiasa dengan sintaks iptables selama bertahun-tahun, berpindah ke nftables sering kali menimbulkan sedikit rasa canggung. Banyak dokumentasi daring hanya menjelaskan konsep teoritis tanpa menyajikan resep konfigurasi konkret yang bisa langsung disalin, disesuaikan, lalu dijalankan pada lingkungan server produksi.

Linux nftables examples menyediakan kumpulan sintaks aturan praktis untuk mengelola lalu lintas jaringan modern di Linux, mulai dari pemfilteran stateful dasar, manajemen port set ringkas, proteksi rate limiting koneksi SSH, hingga NAT masquerade dan port forwarding dual-stack IPv4 serta IPv6 dalam satu berkas konfigurasi terpusat yang efisien.

Perbedaan paling mendasar antara arsitektur lama dan baru ini terletak pada fleksibilitasnya. Nftables tidak lagi memaksakan keberadaan tabel bawaan seperti filter, nat, atau mangle di dalam kernel secara otomatis. Semuanya didefinisikan secara eksplisit oleh administrator melalui format hierarki tabel, rantai (chains), dan aturan (rules) yang jauh lebih terstruktur dan hemat penggunaan CPU.

## Memahami Alur Paket dan Hook Netfilter

Sebelum menerapkan berbagai resep aturan, penting bagi kita untuk memahami bagaimana paket melintasi subsistem Netfilter di kernel Linux. Nftables bekerja langsung pada hook jaringan kernel dengan dukungan keluarga alamat inet yang memungkinkan satu aturan berlaku sekaligus untuk protokol IPv4 dan IPv6 tanpa perlu memisahkan berkas konfigurasi secara terpisah.

![Skema Packet Flow dan Netfilter Hooks Linux](2.png)
*Sumber: [Netfilter Project](https://wiki.nftables.org/wiki-nftables/index.php/Netfilter_hooks)*

Titik masuk paket dimulai dari hook ingress dan prerouting, kemudian diarahkan ke hook input apabila ditujukan untuk proses lokal mesin, atau dilewatkan ke hook forward apabila mesin difungsikan sebagai router atau gateway. Setelah proses lokal menghasilkan respons, paket keluar melewati hook output dan akhirnya diselesaikan pada hook postrouting.

## Contoh Konfigurasi Stateful Firewall Dasar

Kebutuhan paling universal pada sebuah server Linux adalah firewall berbasis status koneksi (stateful inspection). Aturan ini mengizinkan lalu lintas internal loopback, menerima paket balasan dari koneksi yang sah, serta membuang paket invalid yang berpotensi merusak integritas sistem.

Berikut contoh konfigurasi dasar yang bersih untuk berkas `/etc/nftables.conf`:

```nftables
#!/usr/sbin/nft -f

flush ruleset

table inet filter {
    chain input {
        type filter hook input priority filter; policy drop;

        # Izinkan paket pada antarmuka loopback
        iifname "lo" accept

        # Pertahankan koneksi aktif dan koneksi terkait
        ct state established,related accept

        # Buang paket dengan status invalid
        ct state invalid drop

        # Izinkan protokol ICMP penting untuk diagnostik jaringan
        ip protocol icmp accept
        ip6 nexthdr ipv6-icmp accept

        # Buka port SSH agar akses remote tidak terputus
        tcp dport 22 accept
    }

    chain forward {
        type filter hook forward priority filter; policy drop;
    }

    chain output {
        type filter hook output priority filter; policy accept;
    }
}
```

Baris `flush ruleset` pada bagian awal memastikan bahwa setiap kali konfigurasi dimuat ulang, seluruh aturan lama dibersihkan secara atomik di dalam memori kernel tanpa memutus sesi TCP yang sedang berjalan.

## Contoh Pengelompokan Port Menggunakan Named Set

Pada iptables tradisional, membuka lima port berbeda berarti kita harus menulis lima baris aturan terpisah. Jika ada ribuan port atau alamat IP, kernel dipaksa memeriksa aturan tersebut baris demi baris secara linier yang dapat membebani siklus kerja prosesor.

Nftables mengatasi masalah tersebut dengan fitur set. Kita bisa menggabungkan sekumpulan port ke dalam satu wadah dan mengevaluasinya dalam satu operasi pencarian instan:

```nftables
table inet filter {
    # Deklarasi himpunan port TCP publik
    set web_ports {
        type inet_service
        elements = { 80, 443, 8080, 8443 }
    }

    chain input {
        type filter hook input priority filter; policy drop;

        iifname "lo" accept
        ct state established,related accept
        ct state invalid drop

        # Akses SSH tetap dibuka terpisah
        tcp dport 22 accept

        # Buka seluruh port web sekaligus dalam satu baris efisien
        tcp dport @web_ports accept
    }
}
```

Jika di kemudian hari ente ingin menambahkan port baru ke dalam set tersebut tanpa menyentuh struktur rantai utama, cukup jalankan perintah dinamis dari terminal:

```bash
nft add element inet filter web_ports { 9000 }
```

## Contoh Proteksi Brute Force SSH dan Rate Limiting

Server yang terekspos langsung ke alamat IP publik sering menjadi sasaran pemindaian bot otomatis pada port SSH. Nftables menyediakan kapabilitas penghitung dinamis (meter) bawaan yang mampu melacak alamat IP pengirim dan membatasi frekuensi percobaan koneksi baru tanpa memerlukan modul tambahan untuk skala ringan.

Berikut contoh penerapan batasan maksimal 4 upaya koneksi baru per menit per alamat IP pengirim:

```nftables
table inet filter {
    # Set dinamis dengan batas waktu kadaluarsa otomatis
    set ssh_meter {
        type ipv4_addr
        size 65535
        flags dynamic,timeout
        timeout 1m
    }

    chain input {
        type filter hook input priority filter; policy drop;

        iifname "lo" accept
        ct state established,related accept
        ct state invalid drop

        # Tangkal serangan brute force port 22
        tcp dport 22 ct state new meter ssh_meter { ip saddr limit rate over 4/minute } drop
        tcp dport 22 ct state new accept
    }
}
```

Ketika ada alamat IP penyerang yang mencoba melakukan inisiasi koneksi TCP SYN lebih dari 4 kali dalam kurun waktu satu menit, paket berikutnya akan langsung dijatuhkan oleh kernel pada lapisan paling awal sebelum menyentuh daemon SSH.

## Contoh Konfigurasi Port Forwarding dan NAT Masquerade

Bagi yang mengelola server homelab, gateway virtual machine, atau container, kebutuhan Network Address Translation (NAT) dan pengalihan port (port forwarding) adalah menu sehari-hari.

Sebelum mengaktifkan aturan penerusan paket, pastikan fitur forwarding pada kernel Linux sudah diaktifkan di berkas konfigurasi sysctl dengan baris `net.ipv4.ip_forward=1`.

Selanjutnya, susun tabel NAT dan filter forward pada berkas konfigurasi nftables:

```nftables
table inet nat {
    chain prerouting {
        type nat hook prerouting priority dstnat; policy accept;

        # Pengalihan port 8088 publik ke server internal 192.168.10.50 pada port 80
        iifname "eth0" tcp dport 8088 dnat to 192.168.10.50:80
    }

    chain postrouting {
        type nat hook postrouting priority srcnat; policy accept;

        # Masquerade lalu lintas keluar dari jaringan privat ke antarmuka internet publik
        oifname "eth0" masquerade
    }
}

table inet filter {
    chain forward {
        type filter hook forward priority filter; policy drop;

        # Izinkan paket yang sudah terhubung
        ct state established,related accept
        ct state invalid drop

        # Izinkan penerusan paket menuju layanan web internal
        ip daddr 192.168.10.50 tcp dport 80 ct state new accept

        # Izinkan subnet lokal mengakses jaringan luar
        iifname "eth1" oifname "eth0" accept
    }
}
```

Dalam skenario di atas, antarmuka `eth0` bertindak sebagai jalur internet publik, sedangkan `eth1` terhubung ke jaringan lokal privat. Paket yang datang ke port 8088 secara transparan diterjemahkan menuju alamat internal tanpa mengekspos topologi server di baliknya.

## Contoh Manajemen Paket ICMP dan Filter Ping Flood

Memblokir seluruh paket ICMP secara membabi buta adalah praktik keliru yang sering menyebabkan masalah Path MTU Discovery, sehingga koneksi web tertentu kerap mengalami timeout secara misterius. Pendekatan yang benar adalah mengizinkan tipe pesan diagnostik yang esensial sembari membatasi laju respons echo request (ping).

Berikut contoh filter paket ICMP yang aman dan teruji:

```nftables
table inet filter {
    chain input {
        type filter hook input priority filter; policy drop;

        iifname "lo" accept
        ct state established,related accept
        ct state invalid drop

        # Batasi respons echo-request maksimal 5 paket per detik untuk mencegah ping flood
        icmp type echo-request limit rate 5/second accept
        icmpv6 type echo-request limit rate 5/second accept

        # Izinkan pesan kontrol kritis yang dibutuhkan protokol jaringan
        icmp type { destination-unreachable, time-exceeded, parameter-problem } accept
        icmpv6 type { destination-unreachable, packet-too-big, time-exceeded, parameter-problem } accept

        # Izinkan paket Neighbor Discovery untuk jaringan IPv6
        icmpv6 type { nd-router-solicit, nd-router-advert, nd-neighbor-solicit, nd-neighbor-advert } accept
    }
}
```

Dengan konfigurasi di atas, server tetap responsif saat diuji menggunakan utilitas ping, namun aman dari upaya banjir lalu lintas ICMP yang bertujuan menghabiskan alokasi bandwidth atau siklus CPU.

## Teknik Validasi Sintaks dan Atomic Reload Konfigurasi

Salah satu keunggulan terbesar nftables dibandingkan perangkat lunak pengelola firewall generasi lama adalah fitur verifikasi berkas luring. Administrator dapat memeriksa keabsahan tata bahasa konfigurasi sebelum menerapkannya ke dalam kernel, sehingga risiko terkunci di luar server akibat kesalahan ketik dapat dihindari sepenuhnya.

Untuk memvalidasi berkas konfigurasi tanpa mengeksekusinya, jalankan opsi cek sintaks berikut:

```bash
nft -c -f /etc/nftables.conf
```

Apabila perintah di atas selesai tanpa memunculkan pesan error, artinya berkas konfigurasi sudah valid. Ente bisa langsung memuat aturan baru tersebut secara atomik:

```bash
nft -f /etc/nftables.conf
```

Proses pemuatan ini berlangsung dalam satu transaksi atomik. Apabila ada satu baris saja yang gagal diproses, seluruh perubahan akan dibatalkan secara otomatis dan konfigurasi lama tetap aktif tanpa merusak status jaringan.

## Cara Verifikasi dan Monitoring Ruleset yang Sedang Aktif

Setelah konfigurasi diterapkan, langkah berikutnya adalah memverifikasi susunan rantai yang sedang berjalan langsung di memori kernel.

Gunakan perintah inspeksi berikut untuk menampilkan keseluruhan aturan aktif:

```bash
nft list ruleset
```

Apabila ente hanya ingin melihat rantai tertentu beserta nomor pengenal internal (handle) guna menghapus atau menyisipkan aturan baru di posisi spesifik, gunakan argumen `-a`:

```bash
nft -a list chain inet filter input
```

Output perintah tersebut akan memperlihatkan angka handle di ujung setiap baris. Untuk menghapus aturan tertentu tanpa mengganggu aturan lain, jalankan perintah penghapusan berbasis handle:

```bash
nft delete rule inet filter input handle 7
```

Untuk memantau aktivitas pemfilteran paket secara langsung, nftables menyediakan utilitas pelacak event real-time yang sangat membantu saat proses penelaahan masalah:

```bash
nft monitor
```

## Solusi Kendala Umum dan Troubleshooting Nftables

Kendala pertama yang paling sering ditemui adalah konflik antara paket nftables dengan utilitas wrapper firewall lain seperti UFW atau firewalld. Karena semuanya beroperasi di atas subsistem Netfilter, menjalankan dua pengelola aturan sekaligus dapat memicu tumpang tindih ruleset yang membingungkan. Pastikan utilitas wrapper dinonaktifkan agar pengelolaan aturan terpusat murni pada nftables.

Kendala kedua berkaitan dengan aturan forwarding yang tidak bekerja meski sintaks sudah benar. Masalah ini hampir selalu disebabkan oleh nilai `ip_forward` yang masih bernilai nol di level sistem operasi, atau antarmuka jaringan yang salah didefinisikan pada klausa `iifname` dan `oifname`. Selalu periksa nama antarmuka aktual menggunakan perintah `ip link show`.

Kendala ketiga adalah peletakan aturan `ct state established,related accept` yang tertukar atau diletakkan setelah aturan penolakan. Pastikan aturan pelacakan status koneksi selalu berada di posisi paling atas dalam rantai input maupun forward agar paket balasan tidak terbuang secara sia-sia.

## Catatan Akhir dan Pemeliharaan Ruleset

Beralih ke sintaks modern nftables memberikan kendali penuh terhadap efisiensi pemrosesan paket di server Linux. Dengan memanfaatkan struktur tabel keluarga inet, himpunan set dinamis, serta mekanisme validasi atomik, pemeliharaan keamanan infrastruktur jaringan menjadi jauh lebih rapi dan terukur untuk jangka panjang.

Sumber: [Netfilter nftables Documentation](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page)
