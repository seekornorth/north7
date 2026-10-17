---
title: "Intel Rilis LLM-Scaler 1.5, vLLM di GPU Arc Makin Kencang"
slug: "intel-llm-scaler-1-5-vllm-gpu-arc"
summary: "Intel merilis LLM-Scaler vLLM 1.5 dengan basis vLLM 0.26 dan PyTorch 2.12. Stack Docker ini bawa kuantisasi FP8 dan percepat inferensi AI di GPU Intel Arc."
description: "Intel merilis LLM-Scaler vLLM 1.5 dengan basis vLLM 0.26 dan PyTorch 2.12. Stack Docker ini bawa kuantisasi FP8 dan percepat inferensi AI di GPU Intel Arc."
categories: ["Teknologi"]
tags: ["intel", "intel-arc", "vllm", "llm-scaler", "ai", "docker", "gpu", "hardware"]
keywords: ["Intel LLM-Scaler 1.5", "vLLM Intel Arc", "inferensi AI Intel Arc"]
authors: ["mifthakhul-huda"]
schema: "news"
date: 2026-10-17T22:00:00+07:00
draft: false
---

Kalau ente punya kartu grafis Intel Arc di PC Linux dan pernah mencoba menjalankan model bahasa besar (LLM) secara lokal, ente pasti tahu tantangannya. Mengonfigurasi dependensi seperti Intel oneAPI, runtime compute Level Zero, hingga mengompilasi PyTorch XPU secara manual sering kali bikin pusing kepala sebelum satu baris prompt pun sempat dieksekusi.

Untuk menjembatani celah tersebut, tim pengembang perangkat lunak Intel menyediakan proyek open source bernama LLM-Scaler. Proyek yang berakar dari inisiatif Project Battlematrix ini membungkus seluruh dependensi inferensi AI ke dalam satu kontainer Docker siap pakai.

Kabar terbarunya, Intel resmi meluncurkan pembaruan besar berkode LLM-Scaler-vLLM PV release 1.5. Pembaruan ini membawa lompatan arsitektur yang cukup signifikan, mulai dari pembaruan basis engine vLLM, dukungan kuantisasi FP8, hingga peningkatan kecepatan inferensi pada lini GPU Intel Arc.

## Lompatan Basis vLLM dan PyTorch Terbaru

Hal paling mencolok dari rilis 1.5 ini ada pada pembaruan komponen dasarnya. Intel melompati beberapa iterasi sekaligus dengan menaikkan basis engine vLLM dari versi 0.14.0 langsung ke versi 0.26.0 yang sudah ditambal khusus dengan patch Intel XPU.

Lompatan ini penting karena arsitektur internal vLLM berkembang pesat dalam beberapa bulan terakhir. Selain itu, tumpukan library pendukung di dalam kontainer berbasis Ubuntu 24.04.4 LTS ini juga disegarkan ke versi yang jauh lebih segar:

| Komponen | Versi di Rilis 1.5 |
|---|---|
| Sistem Dasar Kontainer | Ubuntu 24.04.4 LTS |
| Basis Mesin Inferensi | vLLM 0.26.0 (dengan patch Intel XPU) |
| Framework AI | PyTorch 2.12.0+xpu |
| Library Model | Transformers 5.8.0 |
| Kompiler Kernel GPU | Triton XPU 3.7.1 |
| Driver Compute Host | Intel Level Zero (libze-intel-gpu1 26.14) |
| Toolchain Kompilasi | Intel oneAPI DPC++/C++ 2025.3.3 |

Naiknya versi PyTorch ke 2.12.0+xpu bersama Triton XPU 3.7.1 membuat eksekusi kernel kustom di chip grafis Arc terasa jauh lebih stabil. Ane melihat langkah ini sebagai upaya Intel mengejar ketertinggalan ekosistem perangkat lunak mereka dari kubu hijau, terutama menjelang ekspansi perangkat keras seri GPU D berbasis Crescent Island.

## Kuantisasi FP8 dan Efisiensi VRAM Lewat KV Cache

Bagi praktisi self-hosted AI yang mengandalkan GPU kelas konsumer atau workstation dengan kapasitas memori terbatas, VRAM selalu menjadi komoditas paling berharga. Menjalankan model berparameter puluhan miliar sering kali mentok pada batas VRAM begitu panjang context window mulai membengkak.

Pada rilis 1.5 ini, Intel menyematkan dukungan kuantisasi online FP8 serta kuantisasi INT4 simetris. Format checkpoint block-FP8 kini juga sudah bisa dilahap langsung oleh mesin vLLM tanpa perlu konversi manual yang merepotkan.

Fitur yang menurut ane paling berdampak adalah hadirnya FP8 KV cache. Dalam pemrosesan token teks yang panjang, alokasi memori untuk menyimpan key dan value (KV cache) biasanya memakan ruang yang sangat masif jika dibiarkan dalam format 16-bit standar (FP16/BF16). Dengan mengompresi KV cache ke format FP8, kebutuhan memori per token bisa dipangkas hampir separuhnya tanpa degradasi kualitas output yang kentara.

Efek langsungnya terasa pada dua hal, yaitu kita bisa memasukkan context teks yang jauh lebih panjang, atau melayani lebih banyak permintaan (concurrent batching) secara bersamaan di kartu grafis yang sama.

## Dukungan Model Anyar dan Akselerasi Decoding MTP

Daftar model yang sudah divalidasi resmi di rilis ini juga diperluas. Pengguna kartu grafis Arc kini bisa menjalankan varian keluarga model terbaru dengan lancar, antara lain:

- Varian model Qwen generasi baru (Qwen3.6-27B, Qwen3.8-27B, dan arsitektur MoE Qwen3.6-35B-A3B).
- Model Gemma dari Google (gemma-4-26B-A4B-it dan gemma-4-31B-it).
- Model multimodal Muse-Glimmer-30B.

Selain memperbanyak varian model, Intel juga membenahi performa metrik Time to First Token (TTFT) agar respon awal model terasa lebih responsif saat pertama kali menerima prompt.

Untuk kecepatan generasi token lanjutan, fitur Multi-Token Prediction (MTP) dan DFlash decoding kini didukung penuh pada seri Qwen dan Gemma. Tim pengembang Intel juga memperbaiki bug kritis pada rilis sebelumnya, seperti korupsi data pada output block-FP8 ketika melayani inferensi multi-user bersamaan, serta anomali akurasi pada kuantisasi INT4.

## Menjalankan Image Docker di Linux

Bagi ente yang ingin langsung menguji performa inferensi ini di sistem Linux, image kontainer resminya sudah tersedia di Docker Hub dengan tag `intel/llm-scaler-vllm:1.5`.

Pastikan mesin Linux host ente sudah memasang driver kernel i915 atau Xe yang mendukung perangkat Arc, serta runtime Docker dengan akses ke perangkat `/dev/dri`. Ente cukup menarik image kontainer tersebut lewat terminal:

```bash
docker pull intel/llm-scaler-vllm:1.5
```

Setelah image terunduh, server vLLM dapat dijalankan dengan memetakan folder checkpoint model lokal dan memberikan akses render node ke dalam kontainer.

Kehadiran rilis 1.5 ini membuktikan bahwa Intel masih terus mematangkan tumpukan perangkat lunak AI mereka di Linux. Walaupun versi upstream vLLM saat ini sudah menyentuh versi 0.31, paket kontainer yang matang dan siap pakai seperti ini jelas sangat membantu komunitas opreker Linux yang ingin memaksimalkan potensi komputasi GPU Arc tanpa harus terjebak masalah kompilasi dependensi.

Sumber: [GitHub intel/llm-scaler](https://github.com/intel/llm-scaler/releases/tag/vllm-1.5)
