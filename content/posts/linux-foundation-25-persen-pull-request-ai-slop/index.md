---
title: "Riset Linux Foundation, 25 Persen Pull Request Jadi AI Slop"
slug: "linux-foundation-25-persen-pull-request-ai-slop"
summary: "Survei terbaru Linux Foundation mengungkap produktivitas koding naik hingga 50 persen, namun 25 persen pull request baru di open source kini berupa AI slop."
description: "Survei terbaru Linux Foundation mengungkap produktivitas koding naik hingga 50 persen, namun 25 persen pull request baru di open source kini berupa AI slop."
categories: ["Linux"]
tags: ["linux-foundation", "open-source", "pull-request", "ai", "software-engineering"]
keywords: ["Linux Foundation AI slop", "pull request AI", "open source AI slop"]
authors: ["mifthakhul-huda"]
schema: "news"
date: 2026-10-21T08:00:00+07:00
draft: false
---

Kehadiran asisten kecerdasan buatan untuk menulis kode pemrograman memang terasa memanjakan kita semua. Mengetik prompt singkat, lalu potongan fungsi langsung tersaji rapi di terminal atau editor kode. Namun, di balik kemudahan tersebut, ekosistem open source global kini mulai merasakan efek samping yang cukup bikin pening para pengelola proyek. Dalam laporan riset terbarunya yang dipaparkan pada ajang All Things Open 2026 di North Carolina, Linux Foundation mengungkap temuan menarik seputar pergeseran budaya berkontribusi di dunia software bebas.

Riset bertajuk Navigating Open Source Software Development in the Generative AI Era ini menunjukkan bahwa alat bantu generatif sanggup memangkas waktu penulisan kode hingga separuh jalan. Sayangnya, kemudahan ini datang bersamaan dengan lonjakan kiriman kode mentah tanpa kurasi matang. Linux Foundation memperkirakan sekitar 25 persen dari total pull request yang masuk ke berbagai repositori open source saat ini tergolong sebagai AI slop alias kode sampah berkualitas rendah yang membebani alur kerja kurasi.

## Lonjakan Kontribusi dan Beban Kurasi Maintainer

Kalau ane perhatikan dinamika di GitHub atau GitLab beberapa bulan terakhir, keluhan para maintainer proyek open source memang makin seragam. Volume notifikasi pull request meroket, tetapi proporsi kode yang layak di-merge justru tidak sebanding dengan waktu review yang dihabiskan.

Data survei Linux Foundation mengonfirmasi fenomena tersebut secara gamblang. Sebanyak 59 persen maintainer proyek open source melaporkan peningkatan drastis pada volume kiriman kontribusi sejak perkakas generative AI marak dipakai. Angka ini bahkan melonjak hingga 69 persen pada repositori proyek skala besar yang punya basis pengguna luas. Masalahnya, sekitar seperempat dari seluruh pull request tersebut dinilai sebagai kode instan minim pemahaman teknis. Di repositori proyek besar, proporsi kode AI slop ini bahkan menyentuh angka 31 persen.

Situasi ini menempatkan para pengelola proyek sukarela dalam posisi terjepit. Memeriksa pull request bukan sekadar melihat apakah tes integrasi lolos di pipeline otomatis, melainkan memastikan struktur arsitektur, keamanan logika, dan kesesuaian gaya kode jangka panjang. Ketika seperempat kiriman kode ternyata hasil salin tempel mentah dari generator AI tanpa pengujian mendalam dari pengirimnya, waktu luang maintainer habis hanya untuk menyortir dan menolak kontribusi yang tidak matang.

## Waktu Koding Terpangkas Setengah tapi Buntu di Tugas Rumit

Survei yang didukung oleh Red Hat, Futurewei, OpenSSF, dan LF AI & Data ini tidak semata-mata menyoroti sisi buruk AI. Di sisi produktivitas murni, percepatan yang dihasilkan memang sangat nyata dirasakan oleh para developer maupun maintainer itu sendiri.

Secara rata-rata di enam aktivitas pengembangan software yang diukur, penggunaan perkakas AI sanggup memangkas waktu kerja hingga 50 persen. Efisiensi paling tinggi tercatat pada proses penulisan kode awal atau code authoring, dengan penghematan waktu mencapai 52 persen. Sementara itu, diskusi teknis dan perumusan proposal fitur mengalami percepatan waktu sekitar 19 persen.

Menariknya, efisiensi waktu yang didapat ini tidak membuat developer berpangku tangan. Mayoritas responden menginvestasikan kembali waktu luang mereka untuk membenahi kesehatan proyek software, seperti:

- Melunasi utang teknis atau technical debt (disebutkan oleh 66 persen responden).
- Membangun dan merancang modul fitur baru (63 persen responden).
- Belajar teknologi anyar dan meningkatkan keahlian koding (58 persen responden).

Namun, ada batas tegas yang perlu kita garis bawahi, om. Kemampuan generator AI ini sangat jomplang saat dihadapkan pada persoalan kompleks. Sebanyak 21 persen responden justru mengaku menghabiskan waktu lebih lama ketika memaksakan memakai bantuan AI pada tugas tingkat rumit. Alih-alih cepat selesai, pengembang sering kali terjebak dalam lingkaran debugging kode halusinasi dan merapikan abstraksi logika yang kacau.

## Jurang Tata Kelola dan Ancaman Kepercayaan Komunitas

Salah satu poin paling krusial yang diangkat Linux Foundation adalah ketimpangan antara cepatnya adopsi teknologi dengan lambatnya pembuatan aturan main di komunitas. Banyak proyek terlanjur kebanjiran pull request AI sebelum sempat mendefinisikan batasan yang jelas.

| Aspek Pengelolaan Proyek | Persentase Responden | Keterangan Temuan Survei |
|---|---|---|
| Punya Aturan Tertulis AI | 35% | Repositori memiliki pedoman resmi penggunaan AI |
| Belum Punya Kebijakan AI | 32% | Tidak punya aturan dan belum berencana membuat |
| Percaya AI Tingkatkan Trust | 47% | 53% maintainer merasa AI belum membangun rasa percaya |
| Hambatan Berkontribusi Turun | 71% | Setuju AI mempermudah pemula mengirim kode |
| Jalankan Pengujian Mandiri | 61% | Kontributor mengaku menguji fungsi sebelum kirim PR |

Tabel di atas memperlihatkan paradoks yang nyata. Meskipun 71 persen maintainer sepakat bahwa AI meruntuhkan tembok penghalang bagi pemula untuk mulai berkontribusi ke open source, sebanyak 53 persen maintainer tidak setuju jika kehadiran alat ini dianggap meningkatkan rasa saling percaya di lingkungan komunitas.

Ketidakpercayaan ini wajar muncul karena transparansi yang masih sangat minim. Walau 61 persen kontributor mengklaim telah menguji kode buatan AI secara mandiri sebelum mengirimkan pull request, fakta di lapangan menunjukkan bahwa keterbukaan atau deklarasi bantuan AI masih sangat acak-acakan. Tanpa adanya aturan tertulis di 65 persen proyek yang belum memiliki pedoman matang, maintainer sering kali merasa seperti sedang dibohongi oleh kontributor yang pura-pura menguasai basis kode proyek.

## Pentingnya Standar Verifikasi dan Mentorship Manusia

Menghadapi kenyataan ini, Linux Foundation menegaskan bahwa langkah mundur atau memusuhi teknologi AI bukanlah solusi yang bijak. Solusi utamanya terletak pada pembenahan tata kelola, penyediaan perkakas kurasi yang lebih pintar bagi maintainer, serta penegasan tanggung jawab pada pundak si pembuat pull request.

Hilary Carter selaku Senior Vice President of Research di Linux Foundation mengingatkan bahwa proyek open source harus merancang sistem alur kontribusi yang siap menyambut kiriman berbasis AI, bukan sekadar panik bereaksi ketika repositori dibanjiri kode sampah. Tanggung jawab pengujian fungsional dan pelaporan penggunaan AI harus diwajibkan secara tegas kepada kontributor sebelum tombol submit ditekan.

Selain tata kelola dokumen, peran bimbingan langsung dari manusia atau human mentorship ternyata justru makin dirindukan. Sebanyak 46 persen maintainer menegaskan bahwa kehadiran AI membuat kebutuhan bimbingan bagi kontributor pemula melonjak tinggi, jauh lebih besar ketimbang 32 persen yang merasa kebutuhan mentoring menurun. 

Kalau menurut ane pribadi, AI memang perkakas yang sangat bertenaga untuk mempercepat eksekusi ide teknis. Tapi koding di ranah open source bukan cuma soal siapa yang paling cepat menghasilkan baris kode, melainkan soal tanggung jawab memelihara software yang dipakai jutaan orang di seluruh dunia. Kalau ente berencana mengirim pull request ke repositori orang lain, luangkan waktu untuk benar-benar memahami kode yang dihasilkan, jalankan unit test lokal sampai tuntas, dan berikan transparansi penuh kepada maintainer yang meluangkan waktu berharganya untuk me-review kode ente.

Sumber: [The Linux Foundation](https://www.linuxfoundation.org/press/new-lf-research-survey-shows-generative-ai-cuts-open-source-coding-time-in-half-but-25-of-incoming-pull-requests-are-considered-ai-slop)
