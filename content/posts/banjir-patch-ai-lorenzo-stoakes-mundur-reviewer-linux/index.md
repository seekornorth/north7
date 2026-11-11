---
title: "Banjir Patch AI, Lorenzo Stoakes Mundur Jadi Reviewer Linux"
slug: "banjir-patch-ai-lorenzo-stoakes-mundur-reviewer-linux"
summary: "Lorenzo Stoakes memutuskan mundur dari kursi reviewer memori dan Rust di kernel Linux akibat derasnya kiriman patch hasil buatan model kecerdasan buatan."
description: "Lorenzo Stoakes memutuskan mundur dari kursi reviewer memori dan Rust di kernel Linux akibat derasnya kiriman patch hasil buatan model kecerdasan buatan."
categories: ["Linux"]
tags: ["linux", "kernel", "ai", "lorenzo-stoakes", "open-source", "lkml"]
keywords: ["Lorenzo Stoakes mundur reviewer Linux", "banjir patch AI kernel Linux", "patch LLM Linux kernel", "MAINTAINERS kernel Linux AI", "Lorenzo Stoakes Arm Linux"]
authors: ["mifthakhul-huda"]
schema: "news"
date: 2026-11-11T08:09:08+07:00
draft: false
---

Pengembang senior kernel Linux sekaligus insinyur Arm, Lorenzo Stoakes, resmi mengundurkan diri dari perannya sebagai peninjau kode atau reviewer di sejumlah subsistem inti kernel Linux. Keputusan ini dipicu oleh lonjakan drastis kiriman patch otomatis berbasis kecerdasan buatan yang membanjiri kotak masuk surel pengembang hingga menguras kapasitas waktu tinjauan manusia.

Kalau ente rutin memantau dinamika dapur pacu kernel Linux, nama Lorenzo Stoakes tentu bukan sosok asing. Beliau adalah salah satu arsitek di balik berbagai penyempurnaan manajemen memori virtual, penulis buku referensi *The Linux Memory Manager*, serta sosok yang belum lama ini menyumbangkan [optimasi kompilasi Kbuild di Linux 7.4](/kbuild-linux-7-4-percepat-kompilasi-kernel/) yang memangkas waktu build hingga puluhan persen. Namun, dedikasi tinggi tersebut kini membentur dinding kelelahan akibat fenomena baru yang kian meresahkan komunitas sumber terbuka.

Lewat sebuah utas resmi di milis Linux Kernel Mailing List (LKML), Lorenzo mengajukan empat rangkaian patch berkas `MAINTAINERS` untuk mencabut namanya dari status *reviewer* di beberapa area penting. Alasan yang diungkapkannya pun sangat jujur dan menohok realitas dunia pengembangan modern saat ini.

## Kelelahan Peninjau Kode di Tengah Ledakan Patch Otomatis

Dalam pesannya yang dikirimkan ke milis pengembang, Lorenzo menegaskan bahwa kapasitas energinya sudah tidak lagi mencukupi untuk menyaring volume patch yang masuk setiap hari. Kehadiran berbagai perkakas Large Language Model (LLM) dan agen kecerdasan buatan memudahkan siapa saja membuat pull request maupun kiriman patch serial secara massal hanya dengan satu kali klik.

"Melihat beban throughput di kernel saat ini yang diakibatkan oleh rangkaian patch buatan AI, sayangnya ane kekurangan bandwidth untuk bisa terus menawarkan peninjauan kode, kecuali untuk area yang memang ane rawat secara langsung," tulis Lorenzo dalam pesannya. Beliau menambahkan permohonan maaf kepada rekan-rekannya, sembari berharap langkah ini dapat membuat kotak masuk surel miliknya kembali manusiawi untuk dikelola sehari-hari.

Fenomena ini sejatinya sudah mulai dikeluhkan banyak pemelihara proyek sumber terbuka sepanjang setahun terakhir. Menggunakan model AI untuk mencari bug seolah menjadi tren baru, sebagaimana yang baru-baru ini kita lihat pada laporan [temuan ratusan celah kernel Linux oleh AI](/openai-temukan-948-celah-lpe-kernel-linux/). Bedanya, ketika ribuan orang di seluruh dunia memanfaatkan perkakas serupa lalu mengirimkan ribuan patch perbaikan otomatis tanpa pemahaman mendalam, beban verifikasi justru dibebankan sepenuhnya ke pundak segelintir insinyur manusia.

## Daftar Subsistem yang Dilepas dan Pembagian Beban Kerja

Keputusan mundur ini bukan berarti Lorenzo angkat kaki sepenuhnya dari ekosistem kernel Linux. Beliau hanya melepaskan tanggung jawab peninjauan umum pada empat pilar besar, yaitu subsistem Memory Management (MM), Core kernel, kategori Misc, serta ekosistem Rust for Linux.

Untuk memastikan kontinuitas proyek, Lorenzo membagi patch penghapusan dirinya ke dalam beberapa cabang yang langsung diserahkan kepada para pemelihara subsistem terkait. Area manajemen memori diteruskan kepada David Hildenbrand dan Andrew Morton, sementara subsistem Rust diserahkan kepada Alice Ryhl dan Danilo Krummrich.

![Maskot resmi Tux pada dokumentasi pengembang Kernel Linux](2.png)
*Sumber: [The Linux Kernel Organization](https://docs.kernel.org/_static/logo.svg)*

Di sisi lain, Lorenzo tetap memegang peran penuh sebagai *maintainer* untuk area spesifik yang menjadi keahlian utamanya, seperti subsistem Virtual Memory Area (VMA) dan Transparent Huge Pages (THP). Kontribusi besar beliau pada THP bahkan secara resmi dicatatkan ke dalam berkas `CREDITS` kernel Linux sebagai bentuk apresiasi komunitas atas kerja kerasnya selama lebih dari satu dekade.

## Tantangan Asimetri Tinjauan Manusia Menghadapi Mesin

Kalau kita cermati lebih dalam, apa yang dialami Lorenzo mencerminkan persoalan mendasar berupa asimetri waktu dan tenaga antara pembuat kode berbasis AI dan peninjau manusia. Membuat puluhan berkas patch menggunakan LLM hanya membutuhkan waktu beberapa detik dan daya komputasi murah. Pengirim sering kali tidak perlu membaca tuntas kode sumber kernel atau menguji dampaknya secara mendalam di laboratorium perangkat keras.

Sebaliknya, proses *code review* di tingkat kernel menuntut konsentrasi tingkat tinggi. Seorang *reviewer* harus meneliti baris demi baris logika dalam bahasa C atau Rust, menganalisis potensi *race condition*, memeriksa alokasi memori agar tidak timbul kebocoran memori, hingga memastikan tidak ada regresi performa pada berbagai varian arsitektur prosesor. Satu patch kecil buatan AI yang tampak meyakinkan di permukaan bisa memakan waktu tinjauan hingga satu jam hanya untuk membuktikan bahwa logika di dalamnya keliru.

Ketika kotak masuk seorang pengembang dibanjiri ratusan patch semacam itu setiap pekan, energi untuk merancang arsitektur baru dan meninjau kontribusi bermutu dari sesama pengembang manusia menjadi terkuras habis. Situasi ini memicu kelelahan mental atau *maintainer burnout* yang sangat berbahaya bagi keberlanjutan infrastruktur perangkat lunak global.

## Arah Kebijakan Komunitas Kernel Linux ke Depan

Langkah Lorenzo Stoakes menjadi sinyal peringatan keras bagi para pengambil kebijakan di ekosistem kernel Linux, termasuk Linus Torvalds. Selama puluhan tahun, milis LKML mengandalkan prinsip keterbukaan di mana siapa pun bebas mengirimkan kontribusi kode untuk dinilai secara meritokratis berdasarkan kualitas teknisnya.

Namun, keterbukaan tanpa filter tersebut kini menghadapi tantangan skalabilitas terbesar sepanjang sejarahnya. Di ruang diskusi pengembang, kini kian santer diperbincangkan perlunya aturan main yang lebih ketat terhadap penggunaan AI dalam kontribusi kode hulu. Wacana yang mengemuka mencakup kewajiban deklarasi penggunaan model AI, penerapan sistem reputasi kontributor yang lebih terverifikasi, hingga mekanisme pertahanan otomatis untuk menekan lalu lintas spam di server milis publik.

Bagi komunitas Linux, menjaga kewarasan para pemelihara kode seperti Lorenzo jauh lebih berharga daripada membiarkan tumpukan patch otomatis masuk tanpa kendali. Bagaimanapun juga, keandalan sistem operasi yang menopang server dunia, superkomputer, hingga perangkat di saku kita tetap bertumpu pada ketajaman intuisi dan tanggung jawab moral insinyur manusia.

> **Baca Juga:**
> - [Kbuild Linux 7.4 Percepat Kompilasi Kernel](/kbuild-linux-7-4-percepat-kompilasi-kernel/)
> - [OpenAI Temukan 948 Celah LPE di Kernel Linux](/openai-temukan-948-celah-lpe-kernel-linux/)

Sumber: [Linux Kernel Mailing List](https://lore.kernel.org/lkml/avMRk95T26rsq4JK@gremlin/)
