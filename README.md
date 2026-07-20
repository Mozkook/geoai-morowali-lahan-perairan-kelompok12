# GeoAI Morowali — Deteksi Perubahan Lahan Tambang dan Perairan Pesisir (2024–2025)

Proyek deteksi ekspansi tambang nikel dan dampaknya terhadap perairan pesisir di Kecamatan Bahodopi, Morowali (2024–2025), didokumentasikan lengkap di repositori ini — mencakup kode pemrosesan Sentinel-2, model klasifikasi Random Forest, data ground truth, hasil evaluasi, hingga tautan WebGIS interaktif untuk eksplorasi hasil secara visual.

**Kelompok 12**
**Mata Kuliah:** Kapita Selekta & Maha Data
**Dosen:** Zakiul Fahmi Jailani, S.Kom, MSc
**Program Studi:** Sistem Informasi, Universitas Bakrie

## Ringkasan Proyek
Kecamatan Bahodopi merupakan kawasan operasional Indonesia Morowali Industrial Park (IMIP), pusat pengolahan nikel terbesar di Indonesia yang menjadi bagian rantai pasok baterai kendaraan listrik (EV) global. Ekspansi tambang terbuka di kawasan ini diduga berasosiasi dengan perubahan kualitas perairan pesisir di sekitarnya. Proyek ini menjawab tiga pertanyaan: apakah kedua objek bertambah/menyusut antara 2024–2025, di mana perubahan terbesar terjadi, dan seberapa dapat dipercaya hasil klasifikasinya — menggunakan citra Sentinel-2 dan Random Forest untuk kedua objek sekaligus.

## Deskripsi Proyek
Proyek ini mendeteksi perubahan dua objek permukaan bumi di Kecamatan Bahodopi, Kabupaten Morowali, Sulawesi Tengah, antara tahun 2024–2025 menggunakan citra Sentinel-2 dan klasifikasi Random Forest:
- **Lahan Terbuka** — indikator langsung ekspansi tambang nikel
- **Perairan** — indikator tidak langsung dampak sedimentasi/kekeruhan pesisir

## Anggota Kelompok
| Nama | NIM | Peran |
|---|---|---|
| Naira Nafisah | 1242002064 | Data Engineer |
| Abdul Hafiz Atallah | 1232002036 | ML Specialist – Lahan Terbuka |
| Abshina Atta Kaur | 1232002056 | ML Specialist – Perairan |
| Daffa Gusti Yanza | 1242002037 | GIS Analyst & Web Developer |
| Mia Ramadhani | 1232002012 | Repository Manager & Technical Writer |

## Struktur Folder
- `data/` → AOI, feature stack, ground truth kedua objek
- `notebooks/` → kode preprocessing & modeling (.ipynb)
- `results/`
  - `lahan_terbuka/` → model, klasifikasi, evaluasi, GeoJSON
  - `perairan/` → model, klasifikasi, evaluasi, GeoJSON
- `webgis/` → WebGIS interaktif (deploy via Vercel)
- `report/` → laporan akhir & slide presentasi

## Ringkasan Metodologi
Kedua objek diproses dari sumber citra dan periode yang sama demi menjaga kesetaraan perbandingan antartahun, namun ditangani dengan pendekatan fitur dan tuning yang berbeda sesuai karakter spektral masing-masing.
- **Citra**: Sentinel-2 SR Harmonized (`COPERNICUS/S2_SR_HARMONIZED`), komposit Juni–September 2024 & 2025, cloud masking via SCL, di-clip ke batas Kecamatan Bahodopi
- **Fitur**: 6 band mentah (B2, B3, B4, B8, B11, B12) untuk Lahan Terbuka (indeks dihitung tapi tidak dipakai sebagai fitur agar menghindari data leakage); 11 fitur (6 band + NDVI, NDWI, NDBI, BSI, NDTI) untuk Perairan, karena kekeruhan air lebih sulit dibedakan hanya dari band mentah
- **Model**: Random Forest (100 trees), satu model yang sama diterapkan untuk klasifikasi 2024 dan 2025 pada masing-masing objek — Lahan Terbuka dioptimalkan lewat GridSearchCV, Perairan lewat threshold tuning
- **Split data**: 70:30, `random_state=42`, seluruh data dua tahun digabung sebelum split agar satu model merepresentasikan kedua tahun

## Performa Model
| Objek | Accuracy | Precision | Recall | F1-score |
|---|---|---|---|---|
| Lahan Terbuka | 95,8% | 98,2% | 93,1% | 95,6% |
| Perairan | 78,9% | 77,3% | 83,2% | 80,2% (80,8% setelah threshold tuning ke 0,46) |

Model Lahan Terbuka menunjukkan performa sangat tinggi dengan risiko *false positive* yang minim. Model Perairan tergolong moderat, dengan kecenderungan sedikit *over-prediction* — hasil perubahannya lebih tepat dibaca sebagai indikasi tren daripada estimasi luas yang presisi piksel-demi-piksel.

## Hasil Deteksi Perubahan
| Objek | Luas 2024 | Luas 2025 | Net Change | % Perubahan |
|---|---|---|---|---|
| Lahan Terbuka | 21.062,33 Ha (18,87%) | 19.885,27 Ha (17,82%) | −1.177,06 Ha | Menyusut |
| Perairan (Kekeruhan) | 14.408,40 Ha (12,91%) | 15.712,16 Ha (14,08%) | +1.303,76 Ha | Meluas |

Kedua objek menunjukkan arah perubahan berlawanan: Lahan Terbuka menyusut sementara Perairan meluas pada periode yang sama. Analisis klaster spasial menemukan sebagian titik *gain* Perairan berdekatan (<1 km) dengan titik *loss* Lahan Terbuka, mengindikasikan sedimentasi lokal dari aktivitas pembukaan lahan tambang ke badan air terdekat.

## Cara Menjalankan Kode
1. Buka notebook di `notebooks/` menggunakan Google Colab atau Jupyter
2. Pastikan file dari `data/` sudah tersedia di path yang sesuai (`data/feature_stack_2024.tif`, dll.)
3. Jalankan seluruh cell secara berurutan dari atas ke bawah

## Tautan
**Repository:** 🔗 https://github.com/Mozkook/geoai-morowali-lahan-perairan-kelompok12.git
**GitHub WebGIS:** 🔗 https://github.com/daffpa/WebGis_Rencana_Proyek_GeoAI_Morowali.git
**WebGIS:** 🔗 https://web-gis-rencana-proyek-geo-ai-morow.vercel.app/
**Drive Untuk File Besar:** 🔗 https://drive.google.com/drive/folders/1UBYuutqmkTz8vIl9y4UmflA4tesoxpOs?usp=sharing

## Laporan
📄 Laporan akhir tersedia di folder `report/`
