---
title: "Ray-Ban Meta Sempat Merekam Suara Pengguna Tanpa Izin"
slug: "ray-ban-meta-rekam-suara-tanpa-izin"
summary: "Pengguna Ray-Ban Meta melaporkan kacamata mereka merekam obrolan tanpa aba-aba suara. Meta mengklaim bug ini sudah beres, tapi celah privasi tetap bikin waswas."
description: "Pengguna Ray-Ban Meta melaporkan kacamata mereka merekam obrolan tanpa aba-aba suara. Meta mengklaim bug ini sudah beres, tapi celah privasi tetap bikin waswas."
categories: ["Teknologi"]
tags: ["ray-ban-meta", "meta", "smart-glasses", "privasi", "gadget", "wearable-ai"]
keywords: ["Ray-Ban Meta rekam suara tanpa izin"]
authors: ["tri-wulandari"]
schema: "news"
date: 2026-10-17T18:00:00+07:00
draft: false
---

Isu privasi seputar kacamata pintar biasanya berpusat pada kamera tersembunyi yang bisa mengambil foto atau video orang lain di ruang publik. Namun, sebuah laporan yang ramai diperbincangkan pekan ini justru mengungkap masalah dari arah yang sama sekali berbeda, yaitu mikrofon internal yang merekam obrolan pemiliknya sendiri tanpa pernah diminta.

Sejumlah pemilik Ray-Ban Meta mendapati kacamata mereka secara otomatis merekam percakapan sehari-hari dan menyimpannya ke dalam riwayat obrolan aplikasi Meta AI. Perekaman ini terjadi tanpa adanya kata pemicu suara, bahkan ketika setelan respons otomatis sudah dimatikan.

## Obrolan Pribadi yang Tiba-tiba Masuk Riwayat Transkrip

Awalnya saya mengira kabar ini hanya keluhan terisolasi dari salah satu pengguna yang lupa mematikan fitur asisten suara. Namun, setelah membaca laporan aslinya di komunitas Reddit, kronologi yang dibagikan oleh pengguna bernama akun Kindly-Audience-137 terasa jauh lebih mengkhawatirkan.

Pengguna tersebut menemukan bahwa percakapan biasa bersama orang lain, obrolan lewat telepon, hingga proses mendikte pesan di ponsel tiba-tiba tersimpan rapi di dalam aplikasi Meta AI. Tidak hanya berupa transkrip teks, aplikasi tersebut juga menyimpan rekaman audio utuh dari obrolan yang berlangsung.

Padahal, pengguna tersebut menegaskan bahwa dirinya sama sekali tidak mengucapkan kata kunci "Hey Meta" sebelum obrolan dimulai. Ia juga sudah menonaktifkan setelan "Respond without Hey Meta", fitur yang semestinya mencegah kacamata menangkap perintah secara spontan tanpa kata pembuka.

Yang membuat penasaran justru pembuktian lanjutannya. Khawatir masalah ini hanya cacat pada satu perangkat, ia menguji perilaku tersebut pada tiga pasang kacamata Ray-Ban Meta yang berbeda dari generasi berbeda. Hasilnya ternyata sama persis pada ketiga unit tersebut. Lampu indikator putih di bagian dalam bingkai kerap menyala sendiri saat obrolan berlangsung, menandakan bahwa modul mikrofon sedang aktif mengirimkan audio ke sistem.

## Celah Bermula dari Pembaruan Firmware

Dari diskusi yang bergulir di r/RaybanMeta dan r/MetaGlasses, beberapa pemilik perangkat lain turut mengonfirmasi kejadian serupa. Sebagian pengguna mengaku baru menyadari kejanggalan ini setelah kacamata mereka menerima pembaruan firmware berkala beberapa hari sebelumnya.

Dalam skenario penggunaan kacamata pintar, sistem audio biasanya mengandalkan algoritma Voice Activity Detection (VAD) berdaya rendah untuk mendeteksi apakah ada suara manusia yang ditujukan kepada perangkat. Bila kata kunci terdeteksi, modul pemrosesan utama baru terbangun untuk menangkap perintah suara.

Pada kasus ini, dugaan sementara mengarah pada kesalahan logika pemrosesan pada firmware baru yang membuat algoritma deteksi suara salah mengenali obrolan biasa sebagai perintah aktif. Alhasil, kacamata langsung mengalirkan rekaman suara ke peladen Meta AI tanpa melewati verifikasi kata kunci.

Beberapa pemilik yang menyadari masalah ini langsung mengambil langkah defensif. Ada yang memilih mematikan izin mikrofon dan kamera lewat ponsel, dan ada pula yang mematikan fitur aktivasi suara sepenuhnya agar kacamata tidak terus menguping di latar belakang.

## Jawaban Singkat Meta dan Pertanyaan yang Menggantung

Setelah laporan ini diangkat oleh media teknologi, Meta akhirnya memberikan pernyataan resmi singkat yang mengonfirmasi keberadaan masalah tersebut. Perusahaan menyatakan bahwa gangguan ini telah diselesaikan dan pengguna dapat mengelola serta menghapus rekaman suara mereka kapan saja melalui menu pengaturan.

Pernyataan dua kalimat tersebut memang memastikan bahwa bug sudah ditangani di sisi sistem. Namun, jika diperhatikan lebih teliti, tanggapan itu meninggalkan banyak tanda tanya penting yang belum terjawab:

* Meta tidak menjelaskan apa penyebab utama yang membuat kacamata merekam tanpa perintah suara.
* Perusahaan tidak membeberkan berapa banyak unit dan pengguna di seluruh dunia yang sempat terdampak oleh celah ini.
* Tidak ada penjelasan mengenai nasib data rekaman suara pribadi yang sudah telanjur terunggah ke peladen komputasi awan mereka sebelum perbaikan digulirkan.

Bagi pengguna gadget yang peduli privasi, ketiadaan audit teknis yang transparan tentu membuat rasa waswas sulit hilang begitu saja.

## Perbedaan Aturan Simpan Suara yang Cukup Signifikan

Setelah membaca lebih jauh ke dalam dokumen kebijakan resmi Meta AI Glasses Voice Privacy Notice, ternyata ada fakta lain yang tidak kalah mengejutkan mengenai cara Meta memperlakukan data suara pengguna.

Kebijakan privasi Meta ternyata menerapkan standar yang berbeda bergantung pada wilayah hukum tempat perangkat digunakan. Di wilayah Amerika Serikat, seluruh transkrip teks dan rekaman audio dari interaksi suara disimpan secara bawaan (default) oleh Meta untuk melatih model kecerdasan buatan mereka. Pengguna di wilayah ini bahkan tidak diberi tombol untuk menonaktifkan penyimpanan rekaman jika ingin tetap memakai asisten suara. Satu-satunya pilihan adalah menghapus riwayat secara manual setelah rekaman telanjur tersimpan.

Sebaliknya, pengguna di wilayah Uni Eropa dan Inggris yang dilindungi oleh regulasi GDPR memiliki tombol khusus untuk mematikan penyimpanan rekaman suara tanpa kehilangan akses ke asisten Meta AI.

Lebih jauh lagi, klausul privasi Meta di AS secara gamblang menyebutkan bahwa rekaman audio tetap disimpan meskipun sistem mengalami aktivasi yang tidak disengaja (unintentional activation). Bila sistem menandai rekaman tersebut sebagai pemicu palsu (false wake), berkas audio tetap disimpan hingga 90 hari sebelum dihapus. Bila tidak terdeteksi sebagai kesalahan, rekaman obrolan tersebut bisa bertahan di peladen hingga satu tahun penuh, bahkan berpotensi ditinjau oleh kurator manusia (trained reviewers) dengan modulasi nada suara.

Klausul inilah yang membuat bug perekaman liar kemarin menjadi sangat berisiko. Setiap obrolan sensitif yang tertangkap kacamata secara tidak sengaja berpotensi tersimpan di sistem cloud selama berminggu-minggu tanpa disadari oleh pemiliknya.

## Dilema Privasi Perangkat Sandang Cerdas

Perangkat sandang berbasis kecerdasan buatan seperti kacamata pintar memang menawarkan kepraktisan yang memikat. Kita bisa bertanya apa saja, mengambil foto instan, atau mendengarkan musik tanpa perlu meraba saku untuk mengeluarkan ponsel.

Namun, kejadian ini menjadi pengingat nyata bahwa kacamata pintar menuntut rasa percaya yang sangat besar dari penggunanya. Selama ini perhatian publik lebih banyak tersedot pada lampu LED kamera luar, sampai-sampai Meta merilis pembaruan perangkat lunak untuk mencegah kamera bekerja jika lampu indikator ditutup stiker.

Nyatanya, celah paling sunyi justru berada pada mikrofon yang menempel di pelipis telinga. Ketika sebuah pembaruan perangkat lunak bisa membuat kacamata menguping obrolan di meja makan atau panggilan telepon pribadi, batas antara asisten digital yang membantu dan alat penyadap tanpa izin menjadi sangat tipis.

Bagi siapa pun yang mengenakan Ray-Ban Meta untuk aktivitas harian, memeriksa menu riwayat suara di aplikasi Meta AI secara berkala kini bukan lagi sekadar anjuran tambahan, melainkan langkah pencegahan yang wajib dilakukan.

Sumber: [Meta](https://www.meta.com/legal/ai-glasses/voice-controls-privacy-notice/)
