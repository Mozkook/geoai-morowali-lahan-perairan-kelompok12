# TEMPLATE KERANGKA LAPORAN AKHIR
## Kapita Selekta Sistem Informasi — GeoAI

---

## BAB I — PENDAHULUAN

**1.1 Latar Belakang**
- Jelaskan wilayah/kota yang dipilih dan alasan pemilihannya (batas administratif jelas, cakupan Sentinel-2 memadai, isu lingkungan/relevansi yang kuat)
- Sebutkan objek target dan konteks permasalahannya
- Tidak perlu tabel di sini, cukup paragraf naratif

**1.2 Rumusan Masalah**
- 3 pertanyaan inti (format baku sesuai soal UAS):
  a. Apakah objek target bertambah/menyusut antara 2024–2025?
  b. Di lokasi mana perubahan terbesar terjadi?
  c. Seberapa dapat dipercaya hasil klasifikasinya?

**1.3 Objek Target dan Manfaat Analisis**
- Definisikan kelas 1 (target) dan kelas 0 (non-target)
- Sebutkan calon pengguna/pemanfaat hasil analisis (pemda, instansi terkait, peneliti, dll.)

---

## BAB II — DATA DAN PRA-PEMROSESAN CITRA

**2.1 Sumber Data**
- Koleksi citra yang dipakai (biasanya COPERNICUS/S2_SR_HARMONIZED)
- Sumber batas administrasi (BIG/GADM/aset kustom)

**2.2 Parameter Pra-pemrosesan**
- **Wajib ada Tabel 1: Parameter Preprocessing** — kolom minimal:
  - Koleksi citra
  - Rentang tanggal (2024 vs 2025)
  - Filter awan (metadata)
  - Metode cloud masking piksel
  - Metode komposit
  - Batas wilayah (clip)
  - Resolusi analisis
- Paragraf penjelasan singkat di bawah tabel (kenapa rentang tanggal itu dipilih, metode cloud masking apa dan kenapa)

---

## BAB III — METODOLOGI

**3.1 Feature Stack**
- Band mentah yang dipakai (biasanya B2, B3, B4, B8, B11, B12)
- Indeks turunan sesuai objek (NDVI untuk vegetasi, NDWI/MNDWI untuk perairan, NDBI/BSI untuk lahan terbuka/area terbangun)
- Jelaskan apakah indeks diikutkan sebagai fitur training atau tidak (dan alasannya)

**3.2 Ground Truth**
- Jumlah titik yang dikumpulkan vs jumlah valid setelah cleaning
- **Tabel rekap ground truth** (jumlah per kelas per tahun)
- Metode pembuatan (interpretasi visual + referensi resolusi tinggi)

**3.3 Pembagian Data Training dan Testing**
- Rasio split (wajib 70:30) + seed yang dipakai
- **Tabel jumlah training/testing**
- Jelaskan strategi split (per kombinasi tahun×kelas, lalu digabung)

**3.4 Model Random Forest**
- **Tabel konfigurasi model** — kolom minimal:
  - Jumlah trees (min. 100)
  - Parameter lain (max_depth, class_weight, dll jika ada tuning)
  - Fitur input
  - Metode tuning (kalau ada)
  - Model digunakan untuk (harus 1 model untuk kedua tahun — ini poin wajib di rubrik!)

**3.5 Feature Importance** *(opsional tapi menambah nilai)*
- Ranking fitur paling berpengaruh + interpretasi singkat

---

## BAB IV — HASIL DAN EVALUASI

**4.1 Evaluasi Model**
- **Tabel Confusion Matrix** (data testing saja)
- **Tabel metrik APRF** (Accuracy, Precision, Recall, F1 — dibaca untuk kelas target=1)
- Interpretasi pola kesalahan (FP vs FN, kemungkinan penyebabnya, kelayakan model untuk change detection)

**4.2 Hasil Klasifikasi**
- **Tabel luas objek per tahun** + persentase terhadap luas total wilayah kajian

**4.3 Analisis Perubahan (Change Detection)**
- **Tabel 4 kategori transisi** (tetap non-target, tetap target, gain, loss)
- **Tabel ringkasan luas gain/loss/net change/persentase perubahan**

**4.4 Interpretasi Spasial**
- Lokasi konsentrasi perubahan terbesar (perlu lihat peta/GeoJSON, bukan cuma angka)
- Kaitkan dengan konteks wilayah (dekat kawasan tertentu, pola aliran, dll.)
- Sertakan catatan keterbatasan interpretasi (asosiatif, bukan kausal terverifikasi)

---

## BAB V — PENUTUP

*(Bebas dibagi jadi beberapa sub-bab sesuai gaya kelompok masing-masing, tapi minimal mencakup 3 hal ini:)*

- **Ringkasan temuan** — jawab ulang 3 rumusan masalah di Bab I secara singkat, dengan angka kunci
- **Keterbatasan & rekomendasi** — apa yang membatasi hasil, dan apa yang bisa diperbaiki ke depan
- **Akses proyek** — tautan repository GitHub dan WebGIS

---

## LAMPIRAN

- **Tabel kontribusi anggota** (nama, NIM, peran, tugas utama)
- Screenshot pendukung (opsional): komposit RGB, visualisasi indeks, sebaran ground truth, output console evaluasi, peta hasil klasifikasi, peta perubahan
