---
title: "Linus Torvalds Pakai Claude Code Buat Garap Kernel Linux"
slug: "linus-torvalds-claude-code-kernel-linux"
summary: "Linus Torvalds rilis eksperimen kernel dibantu Claude Code. Throughput baca file 8-thread melonjak dari 10 juta jadi 33 juta ops per detik."
description: "Linus Torvalds rilis eksperimen kernel dibantu Claude Code. Throughput baca file 8-thread melonjak dari 10 juta jadi 33 juta ops per detik."
categories: ["Linux"]
tags: ["linux", "kernel", "linus-torvalds", "claude-code", "ai", "open-source"]
keywords: ["Linus Torvalds Claude Code", "Kernel Linux AI", "optimasi kernel linux"]
authors: ["mifthakhul-huda"]
schema: "news"
date: 2026-10-16
draft: false
---

Linus Torvalds baru saja mengunggah branch eksperimen baru di repositori kernel pribadinya untuk mengoptimasi pembacaan page cache. Eksperimen optimasi kernel ini digarap bareng asisten AI, spesifiknya Claude Code buatan Anthropic.

Branch tersebut memuat rangkaian delapan patch di atas Linux 7.3-rc6. Pesan commit di dalamnya panjang, padat teknis, dan sangat terbuka. Linus secara gamblang menuliskan bahwa Claude Code membantu menyusun draf pesan commit, menulis potongan kode, membuat program pengujian, sampai menyisir daftar potensi masalah.

Linus sendiri yang menjalankan benchmark di laptop pribadinya, sementara draf awal dan eksplorasi kodenya digodok bersama AI di bawah arahannya langsung.

Ini sebenarnya bukan kali pertama Linus menyentuh AI untuk urusan kernel. Agustus lalu, ia sempat memakai bantuan LLM untuk melacak bug pada driver grafis Intel Xe. Bedanya, kali ini wujudnya berupa branch fitur utuh dengan atribusi yang sangat jelas.

## Masalah di Balik Page Cache

Masalah yang coba diselesaikan Linus tergolong klasik di sistem operasi, yaitu kontensi page cache ketika banyak thread membaca file yang sama secara bersamaan.

Di Linux saat ini, setiap operasi baca (read) bakal mengambil referensi data yang ada di cache lalu melepaskannya begitu selesai. Masalahnya, setiap thread harus memperbarui counter yang sama. Di sistem multi-core dengan thread padat, counter ini jadi rebutan atau istilah teknisnya cache line bouncing. Thread-thread itu saling menunggu hanya demi mencatat referensi memori. Catatan soal bottleneck ini sebetulnya sudah diangkat Matthew Wilcox sejak 2024 silam dari keluhan beban kerja riil pengguna.

Solusi yang diracik Linus bersama Claude Code adalah menghilangkan langkah ambil dan lepas referensi tersebut. Pembaca dibiarkan menyalin data langsung dari cache tanpa perlu mengunci atau mengupdate counter referensi.

Agar memorinya tidak mendadak ditimpa proses lain, halaman memori yang keluar dari cache ditahan sejenak lewat jeda aman (grace period) sebelum boleh dialokasikan ulang.

Kelihatannya sederhana, om, tapi komprominya ada. Memori RAM bakal sedikit lebih banyak menganggur sesaat sebelum bisa dipakai kembali. Namun imbalan performanya bukan main.

| Kondisi Pengujian (8 Thread Baca 1 File) | Throughput Baca |
| :--- | :--- |
| Kernel Standar (Baseline) | ~10 juta pembacaan per detik |
| Patch Eksperimen Linus | 30 sampai 33 juta pembacaan per detik |
| Peningkatan | Melonjak sekitar 3x lipat |

Pengujian ini dijalankan Linus di laptop pribadinya dengan beberapa mitigasi keamanan dinonaktifkan demi melihat potensi murni jalurnya. Angka di server produksi mungkin bervariasi, tapi lonjakan tiga kali lipat pada hot path sistem berkas jelas bukan angka yang bisa diabaikan.

## Perubahan Sikap Sang Kreator Linux

Bukan cuma patch-nya yang menarik perhatian, tapi pengakuan Linus di hadapan publik. Di panggung Open Source Summit Europe di Praha akhir pekan kemarin, Linus duduk santai ngobrol bareng kawan lamanya, Dirk Hohndel dari Ericsson.

Dalam sesi tersebut, Linus melontarkan kalimat yang bikin banyak orang tersenyum:

> *"I actually really like using AI."*

Pernyataan ini kontras dengan omongannya dua tahun lalu, saat ia sempat menyebut industri AI berisi sembilan puluh persen pemasaran dan sepuluh persen kenyataan. Kini pandangannya jauh lebih pragmatis. AI sangat berguna selama kita memposisikannya murni sebagai alat bantu, bukan pengganti nalar.

Linus mencontohkan proyek pedal gitarnya tempo hari. Antarmukanya ditulis pakai C biasa dan terlihat kuno. Karena merasa desain antarmuka bukan keahliannya, ia meminta AI memoles tampilannya. *"I use AI to do the things that I'm bad at,"* tuturnya. Ia bahkan membela tren vibe coding sebagai cara yang menyenangkan bagi pemula untuk menemukan keasyikan menulis program.

Meski begitu, Linus tetap realistis. Ia mengingatkan bahwa gelombang kode buatan AI mulai membebani para maintainer proyek open source. Menghasilkan kode lewat prompt itu cepat, tapi memverifikasi keamanannya tetap menyita energi manusia.

## Aturan Tag Assisted-by Bakal Dihapus

Perkembangan ini berjalan beriringan dengan dinamika internal pengembang kernel. Selama ini ada aturan kebijakan agar kontributor menambahkan penanda `Assisted-by:` jika patch yang diajukan memanfaatkan bantuan AI.

Pada Linux Maintainers Summit di Praha pekan lalu, para maintainer inti mencapai konsensus untuk menghapus kewajiban tag tersebut. Draf patch pencabutan dokumentasinya pun sudah beredar di milis resmi (LKML). Alasan di baliknya masuk akal, yaitu penggunaan LLM sudah merata di mana-mana sehingga mewajibkan label khusus malah jadi birokrasi yang sulit dipantau validitasnya.

Tentu ada segelintir pengembang yang menyayangkan langkah ini karena ingin tetap tahu riwayat keterlibatan AI pada sebuah kode. Namun arah angin komunitas Linux sudah mantap, di mana kualitas kode dan lolosnya uji coba jauh lebih penting daripada mempersoalkan siapa atau apa yang mengetik kodenya pertama kali.

## Catatan Ngulik Soal AI Buat Coding

Kalau ane lihat polanya, kunci sukses eksperimen Linus terletak pada kendali penuh yang tidak pernah ia lepas.

Pertama, ente tetap yang jadi arsitek. Linus yang memahami betul anatomi page cache, menentukan mekanisme grace period, dan menimbang risiko alokasi memori.

Kedua, AI cuma mengerjakan beban repetitif. Claude Code dimanfaatkan untuk merapikan boilerplate, menulis draf skrip pengujian beban, menyusun dokumentasi awal, dan menyisir celah kasus tepi.

Ketiga, validasi tetap mandiri. Eksekusi pengujian, pembacaan logika akhir, dan tanggung jawab penuh tetap berada di tangan programmer manusia.

Melihat Linus Torvalds, sosok yang terkenal tanpa kompromi soal kualitas kode C tingkat rendah, memanfaatkan perkakas semacam Claude Code membuktikan satu hal. Alat bantu berbasis AI sudah memasuki fase matang untuk diajak ngulik beban kerja sistem yang serius.

Sumber: [Git Kernel](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git)
