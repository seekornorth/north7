---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
# URL artikel otomatis: /{slug}/ di root (diatur via [permalinks] di hugo.toml).
# Jangan pakai slug yang tabrakan dengan halaman lain (posts, categories, tags, contact-us, ...).
categories: ["Linux"]
tags: []
# Penulis: ["mifthakhul-huda"] (Linux/Networking) atau ["tri-wulandari"] (Teknologi)
authors: ["mifthakhul-huda"]
summary: ""
description: ""
# Tampilkan di hero slider homepage: featured: true (maksimal 3, terbaru duluan)
# featured: true
# Schema artikel berita (NewsArticle): schema: "news". Default: BlogPosting.
# schema: "news"
# Schema artikel teknologi (TechArticle + about): schema: "tech".
# schema: "tech"
# about:
#   - "@type": "Thing"
#     name: "Contoh Topik"
---

