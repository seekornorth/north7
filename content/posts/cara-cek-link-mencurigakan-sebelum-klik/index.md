---
title: "Sering Dapat Link Mencurigakan? Begini Cara Cek Biar Nggak Salah Klik"
slug: "cara-cek-link-mencurigakan-sebelum-klik"
summary: "Dapat kiriman link aneh di WhatsApp atau email? Jangan asal klik. Berikut beberapa cara mudah untuk mengecek keamanan URL sebelum dibuka."
description: "Dapat kiriman link aneh di WhatsApp atau email? Jangan asal klik. Berikut beberapa cara mudah untuk mengecek keamanan URL sebelum dibuka."
categories: ["Teknologi"]
tags: ["keamanan-siber", "phishing", "malware", "url-scanner", "virustotal", "tips-teknologi"]
keywords: ["cara cek keamanan link"]
authors: ["tri-wulandari"]
date: 2026-10-03T14:49:00+07:00
draft: false
featured: true
---

Pernah dapat pesan di WhatsApp, SMS, atau email yang isinya sebuah link, tapi rasanya agak ragu untuk membukanya?

Saya cukup sering menemukan pesan seperti ini. Kadang isinya mengaku dari layanan tertentu, kadang menawarkan hadiah, dan ada juga yang cuma mengirim link pendek tanpa penjelasan apa-apa.

Awalnya saya pikir, selama nama situsnya terlihat familiar, seharusnya aman-aman saja.

Ternyata tidak sesederhana itu.

Ada beberapa cara yang bisa dilakukan untuk melihat tujuan sebuah link sebelum benar-benar membukanya. Caranya juga tidak harus rumit atau membutuhkan kemampuan teknis khusus.

## Lihat Alamat Link Sebelum Membukanya

Cara paling sederhana sebenarnya justru memperhatikan alamat link-nya.

Kalau sedang menggunakan laptop atau komputer, arahkan kursor ke link tanpa mengkliknya. Biasanya browser akan menampilkan alamat tujuan di bagian bawah jendela.

Dari sini kita bisa melihat apakah alamatnya memang menuju situs yang dimaksud atau malah membawa ke domain yang aneh.

Misalnya ada pesan yang mengaku berasal dari sebuah layanan tertentu, tetapi ketika diperiksa alamatnya justru menggunakan domain yang tidak berhubungan.

Kalau ada yang terasa janggal, tidak perlu diteruskan dengan membuka link tersebut.

Di HP, kita bisa menekan dan menahan link untuk melihat URL atau opsi pratinjau yang tersedia. Tampilan menunya bisa berbeda tergantung aplikasi dan browser yang digunakan.

## Hati-Hati dengan Nama Situs yang Mirip

Bagian ini menurut saya cukup menarik.

Ternyata membuat alamat situs palsu yang terlihat seperti situs asli tidak selalu membutuhkan trik yang terlalu rumit.

Ada teknik yang dikenal sebagai *typosquatting*. Pelakunya membuat domain yang mirip dengan domain asli, tetapi sengaja mengubah sedikit bagian namanya.

Misalnya ada satu huruf yang ditukar, ditambah, atau dihilangkan.

Kalau sedang terburu-buru, perubahan kecil seperti ini memang mudah terlewat.

Ada juga teknik yang disebut *homograph attack*. Dalam kasus tertentu, karakter dari alfabet lain bisa digunakan sehingga tampilannya terlihat mirip dengan huruf yang biasa kita kenal.

Jadi, sekadar melihat bentuk nama situs saja belum tentu cukup. Kalau sedang membuka layanan penting, lebih baik periksa alamat domainnya dengan teliti.

## Bagaimana dengan Link Pendek?

Nah, kalau ketemu link seperti `bit.ly`, `tinyurl`, atau layanan pemendek URL lainnya, saya biasanya justru jadi lebih penasaran.

Bukan berarti semua link pendek berbahaya. Layanan seperti ini memang dibuat untuk membuat URL yang panjang menjadi lebih pendek.

Masalahnya, alamat pendek tersebut tidak langsung memperlihatkan tujuan akhirnya.

Untuk memeriksanya, kita bisa menggunakan layanan *URL expander* seperti CheckShortURL. Layanan ini dapat membantu melihat alamat tujuan dari berbagai layanan short link sebelum kita membukanya.

Jadi kita bisa mengetahui URL tujuan terlebih dahulu dan melihat apakah domain akhirnya masuk akal atau justru mencurigakan.

Tetap perlu diingat, melihat tujuan URL bukan berarti situs tersebut otomatis aman. Ini hanya salah satu langkah pemeriksaan.

## Coba Periksa Link di VirusTotal

Kalau masih ragu, ada cara lain yang cukup praktis yaitu menggunakan VirusTotal.

Caranya sederhana. Salin URL yang ingin diperiksa, kemudian masukkan ke VirusTotal.

VirusTotal dapat menganalisis URL menggunakan berbagai mesin antivirus, layanan pemblokiran URL, dan sumber keamanan lainnya. Dokumentasi resminya menyebut layanan tersebut menggabungkan hasil dari lebih dari 70 pemindai antivirus dan layanan *URL/domain blocklisting*.

Hasilnya bisa memberikan gambaran apakah URL tersebut pernah terdeteksi sebagai phishing, malware, atau aktivitas mencurigakan lainnya.

Tapi ada satu hal yang menurut saya penting.

Kalau hasil pemeriksaan tidak menemukan masalah, **jangan langsung menganggap link tersebut 100 persen aman**.

Scanner bekerja berdasarkan data dan indikator yang mereka miliki. Situs berbahaya yang masih sangat baru atau belum masuk ke database bisa saja belum terdeteksi.

Sebaliknya, kalau ada beberapa layanan yang memberikan peringatan, itu sudah cukup menjadi alasan untuk berhenti dan memeriksa lagi sebelum membuka link tersebut.

## DNS Juga Bisa Membantu

Selain memeriksa link secara manual, perlindungan bisa ditambahkan dari sisi DNS.

Salah satu contohnya adalah Quad9 dengan alamat `9.9.9.9`.

Quad9 menyediakan DNS yang memiliki fitur pemblokiran domain berbahaya. Ketika perangkat mencoba mengakses sebuah domain, Quad9 akan memeriksanya terhadap daftar ancaman dari berbagai mitra *threat intelligence*. Jika domain tersebut masuk daftar berbahaya, permintaan DNS dapat diblokir sehingga perangkat tidak melanjutkan koneksi ke domain tersebut.

Untuk layanan Quad9 yang memiliki fitur *threat blocking*, alamat IPv4 yang digunakan antara lain `9.9.9.9` dan `149.112.112.112`.

Cara seperti ini memang tidak menggantikan kebiasaan berhati-hati. Tapi setidaknya ada lapisan perlindungan tambahan ketika kita tidak sengaja mencoba membuka domain yang sudah dikenal berbahaya.

## Jadi, Apa yang Sebaiknya Dilakukan?

Kalau mendapat link yang terasa mencurigakan, sebenarnya tidak perlu langsung panik.

Cukup biasakan beberapa langkah sederhana:

1. **Jangan langsung klik.**
2. **Periksa alamat URL terlebih dahulu.**
3. **Perhatikan nama domain**, terutama kalau ada ejaan yang terasa aneh.
4. Kalau berupa short link, **periksa tujuan akhirnya** menggunakan layanan URL expander.
5. Kalau masih ragu, **cek URL tersebut di VirusTotal**.
6. Gunakan DNS dengan fitur pemblokiran ancaman sebagai **lapisan perlindungan tambahan**.

Yang paling penting, jangan merasa harus membuka sebuah link hanya karena pesan yang mengirimkannya terlihat meyakinkan.

Kadang kita memang cuma butuh beberapa detik untuk berhenti dan memeriksa alamatnya.

Daripada penasaran setelah terlanjur klik, rasanya lebih enak mengecek dulu sebelum membuka.

Sumber: VirusTotal Documentation, Quad9 Documentation, CheckShortURL
