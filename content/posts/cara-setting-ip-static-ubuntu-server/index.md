---
title: "Cara Setting IP Static Ubuntu Server dengan Netplan"
slug: "cara-setting-ip-static-ubuntu-server"
summary: "Tutorial setting IP static Ubuntu Server pakai Netplan, lengkap dengan contoh konfigurasi YAML, cara verifikasi hasilnya, dan solusi buat masalah yang sering muncul."
description: "Tutorial setting IP static Ubuntu Server pakai Netplan, lengkap dengan contoh konfigurasi YAML, cara verifikasi hasilnya, dan solusi buat masalah yang sering muncul."
categories: ["Networking"]
tags: ["ubuntu-server", "ubuntu", "netplan", "networking", "tutorial-linux", "server", "linux"]
keywords: ["cara setting ip static ubuntu server"]
authors: ["mifthakhul-huda"]
schema: "tech"
date: 2026-10-10
draft: false
about:
  - "@type": "Thing"
    name: "Ubuntu Server"
  - "@type": "SoftwareApplication"
    name: "Netplan"
    applicationCategory: "Networking Software"
    operatingSystem: "Linux"
---

Server dengan alamat yang pindah-pindah itu sering jadi sumber masalah sendiri. Web server yang tadi tinggal di 192.168.1.10 tiba-tiba menghilang setelah restart, port forwarding di router mengarah ke alamat lama, dan client bingung kenapa koneksinya gagal terus.

Solusinya biasanya cuma satu yaitu ganti ke IP static.

Sejak Ubuntu Server 18.04, urusan konfigurasi jaringan ditangani Netplan. Kalau ente pernah nemu tutorial lama yang menyuruh edit `/etc/network/interfaces`, itu sudah tidak berlaku. Caranya sekarang lewat satu file YAML di `/etc/netplan/` - dan menurut ane pendekatan ini justru lebih rapi karena konfigurasinya gampang dicopy ke server lain.

Artikel ini mencatat cara setting IP static Ubuntu Server dari awal sampai verifikasi, termasuk beberapa jebakan yang sering bikin konfigurasi gagal di tengah jalan.

## Apa Itu IP Static Ubuntu Server?

IP static Ubuntu Server adalah alamat jaringan yang ditetapkan permanen lewat file Netplan, lengkap dengan subnet mask, gateway, dan DNS. Alamat ini tidak berubah meski server di-restart, sehingga layanan seperti web server, database, atau NAS selalu bisa dihubungi di tempat yang sama.

Kebalikannya adalah DHCP: alamat yang dibagikan otomatis oleh router dan bisa ganti tiap masa sewa. Buat laptop dan PC client, DHCP itu praktis. Tapi buat server, alamat yang muter-muter justru jadi sumber masalah baru.

## IP Static atau DHCP?

Perbandingannya kira-kira begini:

| Aspek | IP Static | DHCP |
|---|---|---|
| Alamat | Tetap | Bisa berubah tiap masa sewa |
| Konfigurasi | Manual di file Netplan | Otomatis dari router |
| Cocok untuk | Server, NAS, printer, CCTV | Laptop, PC client |
| Risiko | Salah konfigurasi bisa memutus akses | Alamat sulit diprediksi |

Kalau jaringannya di rumah, satu hal yang perlu diperhatikan: pilih alamat di luar rentang DHCP router, misalnya di atas 192.168.1.200. Bentrok sama perangkat lain itu lebih susah dideteksi daripada kelihatannya.

Ada juga jalur ketiga bernama DHCP reservation - satu MAC address diikat router ke satu alamat tertentu. Cara ini jalan, tapi konfigurasi static langsung di server tetap lebih andal karena nggak tergantung router.

## Cek Nama Interface Dulu

Langkah pertama yang paling sering dilewati orang: mencatat nama interface.

Buka terminal dan jalankan:

```bash
ip link show
```

Outputnya kira-kira begini:

```text
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 ...
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 ...
3: enp0s8: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 ...
```

Yang perlu dicatat adalah nama interface yang dipakai server ke jaringan utama, misalnya `enp0s3`. Nama seperti `eth0` sudah jarang dipakai di Ubuntu modern, jadi jangan asal copas tutorial lama.

Kalau servernya virtual (VMware, VirtualBox, Proxmox), nama interfacenya bisa beda lagi - biasanya masih `ens` atau `enp` diikuti angka.

## Struktur File Konfigurasi Netplan

Semua konfigurasi Netplan ada di folder:

```text
/etc/netplan/
```

Nama filenya bisa beda-beda tiap instalasi, misalnya `01-netcfg.yaml`, `50-cloud-init.yaml`, atau `00-installer-config.yaml`. Yang penting cuma satu: file YAML di folder itu yang aktif, dan konfigurasi dibaca berdasarkan urutan nama.

Isinya kira-kira begini:

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: true
```

Buat setting IP static, bagian `dhcp4: true` itulah yang bakal diganti.

## Contoh Konfigurasi IP Static Ubuntu Server

Misalnya target konfigurasinya seperti ini:

```text
Alamat IP   : 192.168.1.10
Subnet      : /24 (255.255.255.0)
Gateway     : 192.168.1.1
DNS         : 1.1.1.1 dan 8.8.8.8
Interface   : enp0s3
```

Maka file Netplan-nya ditulis begini:

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: false
      addresses:
        - 192.168.1.10/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses: [1.1.1.1, 8.8.8.8]
```

Beberapa hal yang perlu diperhatikan dari contoh di atas:

- `dhcp4: false` mematikan DHCP supaya alamat tidak ditimpa otomatis.
- `addresses` memakai format CIDR (`/24`), bukan subnet mask terpisah.
- Gateway ditulis lewat `routes` dengan `to: default`. Format `gateway4` yang sering muncul di tutorial lama sudah deprecated.
- Indentasi harus konsisten memakai spasi, bukan tab.

## Cara Apply Konfigurasi Netplan

Setelah file disimpan, jalankan:

```bash
sudo netplan try
```

Perintah ini menerapkan konfigurasi sementara selama 120 detik. Kalau koneksinya putus (misalnya ente salah nulis gateway dan SSH-nya terputus), konfigurasi otomatis di-rollback ke kondisi sebelumnya.

Kalau `netplan try` sukses dan tekan Enter buat konfirmasi, baru konfigurasi jadi permanen dengan:

```bash
sudo netplan apply
```

Urutan `try` dulu baru `apply` ini yang paling aman, apalagi kalau ente ngoprek servernya lewat SSH.

## Verifikasi Hasil Konfigurasi

Cek alamat IP yang aktif:

```bash
ip a show enp0s3
```

Pastikan baris `inet 192.168.1.10/24` muncul di bawah interface tersebut.

Cek routing table:

```bash
ip route show
```

Harus ada baris `default via 192.168.1.1`.

Tes koneksi keluar:

```bash
ping -c 3 8.8.8.8
ping -c 3 google.com
```

Kalau IP publik bisa diping tapi domain gagal, masalahnya hampir pasti di bagian `nameservers`.

## Masalah yang Sering Muncul

| Gejala | Kemungkinan Penyebab | Solusi |
|---|---|---|
| YAML error saat apply | Indentasi campur tab dan spasi | Rapikan indentasi, semua spasi |
| SSH putus setelah apply | IP/gateway salah subnet | Pakai `netplan try`, cek ulang alamat |
| Nggak bisa diakses dari luar | IP bentrok / di luar subnet gateway | Pilih IP unik, satu subnet dengan gateway |
| Ping IP jalan, ping domain gagal | DNS salah / resolved belum ke-load | Cek `nameservers`, ulangi `netplan apply` |
| Konfigurasi nggak berpengaruh | Nama interface salah | Cocokkan dengan `ip link show` |

Khusus cloud-init di VPS: buat file `/etc/cloud/cloud.cfg.d/99-disable-network-config.cfg` berisi `network: {config: disabled}` supaya dia berhenti menimpa konfigurasi tiap boot. Kasus ini lumayan sering ditemuin di VPS, dan solusinya resmi tercantum di dokumentasi Ubuntu.

## Setelah IP Static Ubuntu Server Aktif

Kalau dipandang sekilas, cara setting IP static Ubuntu Server cuma soal lima perintah: `ip link`, edit file YAML, `netplan try`, `netplan apply`, dan `ip a`. Sisanya cuma soal teliti - terutama nama interface dan indentasi YAML.

Jadi kalau nanti servernya restart dan alamatnya tetap di tempat, berarti pekerjaan ente selesai. Sisanya bisa lanjut ke urusan yang nggak kalah penting: hardening SSH dan firewall, biar server yang sekarang alamatnya konsisten ini juga siap ngadep internet dengan aman.

Sumber: [Dokumentasi Ubuntu Server](https://ubuntu.com/server/docs), [contoh konfigurasi Netplan](https://github.com/canonical/netplan/tree/main/examples)
