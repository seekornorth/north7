---
title: "VirtIO-FS Uji Antrean Sinkron, Kompilasi di VM Makin Kencang"
slug: "virtio-fs-antrean-sinkron-performa-vm"
summary: "Uji coba antrean sinkron di VirtIO-FS pangkas waktu kompilasi sampai 28 persen dan kurangi latensi I/O. Ini ulasan arsitektur dan hasil pengujiannya."
description: "Uji coba antrean sinkron di VirtIO-FS pangkas waktu kompilasi sampai 28 persen dan kurangi latensi I/O. Ini ulasan arsitektur dan hasil pengujiannya."
categories: ["Linux"]
tags: ["virtio-fs", "virtualisasi", "kvm", "libkrun", "microvm", "kernel", "linux"]
keywords: ["VirtIO-FS antrean sinkron", "performa VirtIO-FS", "libkrun virtio-fs", "virtualisasi Linux"]
authors: ["mifthakhul-huda"]
schema: "news"
date: 2026-10-18T08:00:00+07:00
draft: false
---

Kalau ente sering berkutat dengan virtualisasi di Linux, baik saat menjalankan MicroVM ringan buat isolasi container atau memakai mesin virtual biasa, urusan berbagi folder (shared filesystem) antara host dan guest hampir selalu menjadi titik kemacetan utama. Menjalankan sistem operasi di dalam VM memang sudah sangat kencang berkat akselerasi hardware KVM, tetapi begitu guest membaca atau menulis ribuan file yang disimpan di direktori host, performanya langsung terasa drop.

Selama ini protokol VirtIO-FS menjadi standar andalan untuk urusan shared folder modern karena kecepatannya jauh mengungguli protokol 9PFS lawas. Kendati demikian, kalau ente pakai VirtIO-FS untuk beban kerja berat seperti mengompilasi kode program (software build) yang sarat operasi metadata file, jeda waktunya masih terasa lambat dibanding kompilasi langsung di sistem host.

Kabar baiknya, Sergio López, pengembang yang aktif menggarap proyek libkrun dan virtualisasi Linux, baru saja merilis proposal eksperimental untuk mengatasi penyakit bawaan tersebut. Lewat penambahan antrean sinkron (synchronous queues) dengan bendera fitur `VIRTIO_FS_F_SYNC`, waktu kompilasi di dalam virtual machine berhasil dipangkas hingga 27,9 persen, sekaligus memangkas beban CPU sistem host secara drastis.

## Masalah Antrean Asinkron dan Operasi File yang Memblokir

Untuk memahami letak masalahnya, kita perlu melihat bagaimana arsitektur standar VirtIO bekerja. Secara desain awal, seluruh perangkat VirtIO dirancang dengan mekanisme asinkron. Mesin virtual guest mengirimkan permintaan I/O ke dalam antrean memori bersama (virtqueue), lalu menendang sinyal notifikasi (kick) ke hypervisor host.

Di sisi host, hypervisor atau Virtual Machine Monitor (VMM) tidak langsung memproses permintaan itu sendiri. VMM bakal menyerahkan tugas tersebut ke thread pekerja (filesystem worker thread) yang terpisah. Sementara pekerja memproses operasi file di host, vCPU guest dipersilakan kembali menjalankan instruksi lain. Begitu thread pekerja selesai, host mengirimkan sinyal interupsi penyelesaian (completion interrupt) kembali ke guest agar hasil operasi bisa diambil.

Mekanisme asinkron seperti ini sangat ideal untuk tugas yang bisa berjalan simultan di latar belakang. Akan tetapi, kalau ane perhatikan, alur eksekusi sistem berkas pada kenyataannya jarang bersifat asinkron murni. Ketika sebuah aplikasi di dalam guest melakukan pemanggilan sistem (syscall) seperti `read()`, `write()`, `stat()`, atau `unlinkat()`, aplikasi tersebut umumnya berada dalam posisi memblokir (blocking I/O). Program harus berhenti dan menunggu jawaban dari filesystem sebelum bisa melanjutkan baris kode berikutnya.

Jika guest tidak memiliki tugas lain yang siap dieksekusi, vCPU virtual bakal masuk ke kondisi menganggur (idle). Di saat yang sama, proses operan tugas antar-thread dari vCPU ke thread pekerja di host memicu perpindahan konteks (context switch). Ditambah lagi dengan latensi untuk membangunkan core CPU host yang sedang tertidur di mode hemat daya (idle C-states) serta ongkos interupsi penyelesaian, jalur eksekusi yang berbelit-belit ini membebani sistem secara signifikan hanya untuk sebuah operasi file kecil.

## Arsitektur Eksekusi Langsung di Thread vCPU

Eksperimen yang digagas Sergio López mencoba memotong seluruh birokrasi antar-thread tersebut. Konsep dasarnya sederhana tetapi cerdas, yaitu membiarkan thread host yang sedang menjalankan vCPU untuk menyelesaikan operasi filesystem itu sendiri sebelum kembali mengeksekusi instruksi guest.

Dalam rancangan fitur `VIRTIO_FS_F_SYNC`, perangkat VirtIO-FS menyediakan antrean sinkron khusus untuk setiap vCPU yang dialokasikan (per-vCPU queue), berdampingan dengan antrean asinkron normal yang sudah ada. Ketika driver guest yang kompatibel mengirimkan permintaan ke antrean sinkron, sinyal VM exit langsung membawa thread host vCPU masuk ke fungsi penanganan VirtIO-FS.

Thread yang sama tersebut langsung menjalankan syscall filesystem ke kernel host, menulis balasan ke dalam virtqueue, dan baru melanjutkan eksekusi guest. Begitu kembali ke lingkungan guest, proses langsung menemukan hasil operasi tanpa perlu menunggu interupsi sama sekali.

Skema ini tentu memiliki konsekuensi teknis. Selama thread vCPU di host melayani operasi file, vCPU tersebut tidak dapat menjalankan tugas guest lainnya. Namun untuk operasi berdurasi singkat yang memang sedang ditunggu oleh aplikasi pemanggil, meniadakan perpindahan thread pekerja dan interupsi penyelesaian terbukti jauh lebih menghemat siklus prosesor.

Implementasi ini juga dirancang matang agar tidak saling mengunci antar-core. Handler antrean sinkron dijalankan setelah melepas bus device lock, sehingga operasi file pada vCPU berbeda dapat berjalan bersamaan (konkuren). Khusus pada backend KVM, sinyal kick sengaja melewati pendaftaran `ioeventfd` guna memastikan notifikasi mendarat langsung pada thread vCPU yang sedang aktif.

## Bukti Uji Coba Kompilasi dan Latensi I/O

Untuk mengukur dampak nyata dari arsitektur antrean sinkron ini, pengujian dilakukan dengan skenario pengembangan perangkat lunak sehari-hari, yaitu mengompilasi paket `libkrunfw 5.6.2` di dalam virtual machine dengan 8 vCPU pada laptop berprosesor Apple M3 Pro menggunakan perintah `make -j8`.

Hasil pencatatannya memperlihatkan perbedaan performa yang sangat kentara:

- Waktu kompilasi total (elapsed time) menyusut dari 7 menit 43,8 detik pada antrean asinkron menjadi 5 menit 34,3 detik pada antrean sinkron. Ada penghematan waktu sekitar 2 menit 9 detik, atau peningkatan throughput build sebesar 38,7 persen.
- Penggunaan System CPU di mesin host anjlok dari 25 menit 2,7 detik menjadi 11 menit 3,6 detik. Pengurangan waktu CPU sistem lebih dari separuh ini mengonfirmasi bahwa penghapusan interupsi dan operan thread benar-benar memangkas beban overhead hypervisor.
- Pada pengujian random read dan write menggunakan perkakas fio (ukuran blok 4 KiB, mesin pvsync, dan direct I/O), konfigurasi satu job mencatat lonjakan bandwidth baca sebesar 32,4 persen (dari 41,7 MiB/s ke 55,2 MiB/s) dan bandwidth tulis sebesar 32,1 persen.
- Pada pengujian metadata dengan membuat 50.000 file lalu menghapusnya secara berurutan menggunakan `unlinkat`, latensi rata-rata penghapusan file berkurang hingga 36,1 persen, dari 161,4 mikrodetik menjadi 103,2 mikrodetik.

Kelihatannya sederhana, om, tetapi angka-angka ini membuktikan bahwa hambatan terbesar VirtIO-FS selama ini memang terletak pada overhead komunikasi antar-thread ketika menangani operasi I/O kecil yang sifatnya blocking.

## Potensi Penerapan di Ekosistem Linux Mendatang

Saat ini dukungan antrean sinkron VirtIO-FS masih berstatus eksperimental dan diajukan melalui Pull Request nomor 933 di repositori GitHub `libkrun`. Agar fitur ini bisa aktif, baik hypervisor di sisi host maupun driver virtio-fs di dalam kernel Linux guest harus sama-sama mendukung dan menegosiasikan opsi `VIRTIO_FS_F_SYNC`.

Menurut ane, kalau proposal ini nantinya disepakati dan masuk ke dalam spesifikasi resmi VirtIO, pendekatan serupa berpeluang besar untuk diterapkan ke perangkat virtualisasi lain. Salah satu kandidat paling potensial adalah operasi baca pada driver blok `virtio-blk`, di mana aplikasi pemanggil hampir selalu harus menunggu data selesai dibaca dari disk sebelum bisa melanjutkan eksekusi.

Bagi pengembang yang kerap menjalankan pengujian kode di dalam MicroVM atau sysadmin yang mengelola container berbasis mesin virtual seperti Kata Containers, kehadiran optimasi antrean sinkron ini tentu menjadi perkembangan yang sangat dinantikan untuk mendongkrak performa shared storage agar makin mendekati performa native.

Sumber: [Blog Sergio López](https://sinrega.org/2026-10-16-synchronous-queues-virtio-fs/)
