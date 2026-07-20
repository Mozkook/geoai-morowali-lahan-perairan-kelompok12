GeoAI Morowali — Deteksi Perubahan Lahan Tambang dan Perairan Pesisir (2024–2025)

Kelompok 12 — Kapita Selekta Sistem Informasi, Universitas Bakrie Dosen: Zakiul Fahmi Jailani, S.Kom, MSc

Deskripsi Proyek

Proyek ini mendeteksi perubahan dua objek permukaan bumi di Kecamatan Bahodopi, Kabupaten Morowali, Sulawesi Tengah, antara tahun 2024–2025 menggunakan citra Sentinel-2 dan klasifikasi Random Forest:

Lahan Terbuka — indikator langsung ekspansi tambang nikel
Perairan — indikator tidak langsung dampak sedimentasi/kekeruhan pesisir
Anggota Kelompok
Nama	NIM	Peran
Naira Nafisah	1242002064	Data Engineer
Abdul Hafiz Atallah	1232002036	ML Specialist – Lahan Terbuka
Abshina Atta Kaur	1232002056	ML Specialist – Perairan
Daffa Gusti Yanza	1242002037	GIS Analyst & Web Developer
Mia Ramadhani	1232002012	Repository Manager & Technical Writer
Struktur Folder
├── data/           → AOI, feature stack, ground truth kedua objek
├── notebooks/       → kode preprocessing & modeling (.ipynb)
├── results/
│   ├── lahan_terbuka/  → model, klasifikasi, evaluasi, GeoJSON
│   └── perairan/       → model, klasifikasi, evaluasi, GeoJSON
├── webgis/          → WebGIS interaktif (deploy via Vercel)
└── report/          → laporan akhir & slide presentasi
Ringkasan Metodologi
Citra: Sentinel-2 SR Harmonized (COPERNICUS/S2_SR_HARMONIZED), Juni–September 2024 & 2025
Fitur: 6 band mentah (B2, B3, B4, B8, B11, B12) untuk Lahan Terbuka; 11 fitur (band + NDVI/NDWI/NDBI/BSI/NDTI) untuk Perairan
Model: Random Forest (100 trees), satu model yang sama diterapkan untuk klasifikasi 2024 dan 2025
Split data: 70:30, random_state=42
Hasil Utama
Objek	Accuracy	F1-score
Lahan Terbuka	95,8%	95,6%
Perairan	78,9%	80,2% (80,8% setelah threshold tuning)
Cara Menjalankan Kode
Buka notebook di notebooks/ menggunakan Google Colab atau Jupyter
Pastikan file dari data/ sudah tersedia di path yang sesuai (data/feature_stack_2024.tif, dll.)
Jalankan seluruh cell secara berurutan dari atas ke bawah
WebGIS

🔗 [Link WebGIS] — (menunggu deployment Vercel)

Laporan

📄 Laporan akhir tersedia di folder report/
