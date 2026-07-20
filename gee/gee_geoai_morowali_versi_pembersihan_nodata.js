// ============================================
// 1. LOAD AOI
// ============================================
var aoi = ee.FeatureCollection('users/nairanafisah/aoi_bahodopi_shp');
Map.centerObject(aoi, 11);
Map.addLayer(aoi, {color: 'red'}, 'AOI Bahodopi', true, 0.3);

// ============================================
// 2. FUNGSI CLOUD MASKING (Sentinel-2 SR Harmonized, pakai band SCL)
// ============================================
function maskS2clouds(image) {
  var scl = image.select('SCL');
  var mask = scl.neq(3).and(scl.neq(7)).and(scl.neq(8))
                .and(scl.neq(9)).and(scl.neq(10)).and(scl.neq(11));
  var maskBuffered = mask.focal_min({radius: 30, units: 'meters'});
  return image.updateMask(maskBuffered).divide(10000)
              .copyProperties(image, ['system:time_start']);
}

// ============================================
// 3. FUNGSI HITUNG INDEKS SPEKTRAL
// ============================================
function addIndices(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  var ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI');
  var ndbi = image.normalizedDifference(['B11', 'B8']).rename('NDBI');
  var bsi = image.expression(
    '((SWIR + RED) - (NIR + BLUE)) / ((SWIR + RED) + (NIR + BLUE))', {
      'SWIR': image.select('B11'),
      'RED': image.select('B4'),
      'NIR': image.select('B8'),
      'BLUE': image.select('B2')
    }).rename('BSI');
  var ndti = image.normalizedDifference(['B4', 'B3']).rename('NDTI');
  return image.addBands([ndvi, ndwi, ndbi, bsi, ndti]);
}

// ============================================
// 4. FUNGSI BUAT FEATURE STACK PER TAHUN (dengan fallback anti-NODATA)
// ============================================
function buildFeatureStack(coreStart, coreEnd, year) {
  var coreCollection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(aoi)
    .filterDate(coreStart, coreEnd)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 70))
    .map(maskS2clouds);

  print('Jumlah citra core (' + coreStart + ' - ' + coreEnd + '):', coreCollection.size());

  var compositeCore = coreCollection.median();

  var fallbackCollection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(aoi)
    .filterDate(year + '-01-01', year + '-12-31')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 70))
    .map(maskS2clouds);

  print('Jumlah citra fallback (' + year + ' full year):', fallbackCollection.size());

  var compositeFallback = fallbackCollection.median();

  var composite = compositeCore.unmask(compositeFallback).clip(aoi);
  var stack = addIndices(composite);

  var bands = ['B2','B3','B4','B8','B11','B12','NDVI','NDWI','NDBI','BSI','NDTI'];
  return stack.select(bands);
}

// ============================================
// 5. BUAT FEATURE STACK 2024 & 2025
// ============================================
var stack2024 = buildFeatureStack('2024-06-01', '2024-09-30', '2024');
var stack2025 = buildFeatureStack('2025-06-01', '2025-09-30', '2025');

// ============================================
// 6. VISUALISASI DI PETA
// ============================================
var visRGB = {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3};
var visNDVI = {bands: ['NDVI'], min: -1, max: 1, palette: ['red', 'white', 'green']};
var visNDBI = {bands: ['NDBI'], min: -1, max: 1, palette: ['blue', 'white', 'brown']};
var visNDTI = {bands: ['NDTI'], min: -1, max: 1, palette: ['blue', 'white', 'orange']};
// TAMBAHAN: definisi visualisasi NDWI (biru tua = air, putih/coklat = daratan)
var visNDWI = {bands: ['NDWI'], min: -1, max: 1, palette: ['brown', 'white', 'blue']};

Map.addLayer(stack2024, visRGB, 'RGB 2024');
Map.addLayer(stack2025, visRGB, 'RGB 2025');
Map.addLayer(stack2024.select('NDVI'), visNDVI, 'NDVI 2024', false);
Map.addLayer(stack2024.select('NDBI'), visNDBI, 'NDBI 2024 (Lahan Terbuka)', false);
Map.addLayer(stack2024.select('NDTI'), visNDTI, 'NDTI 2024 (Kekeruhan Air)', false);
Map.addLayer(stack2025.select('NDVI'), visNDVI, 'NDVI 2025', false);
Map.addLayer(stack2025.select('NDBI'), visNDBI, 'NDBI 2025 (Lahan Terbuka)', false);
Map.addLayer(stack2025.select('NDTI'), visNDTI, 'NDTI 2025 (Kekeruhan Air)', false);
// TAMBAHAN: tampilkan NDWI 2024 & 2025 di canvas
Map.addLayer(stack2024.select('NDWI'), visNDWI, 'NDWI 2024 (Badan Air)', false);
Map.addLayer(stack2025.select('NDWI'), visNDWI, 'NDWI 2025 (Badan Air)', false);
Map.addLayer(stack2024.select('B4').mask(), {min: 0, max: 1}, 'Mask Check 2024', false);
Map.addLayer(stack2025.select('B4').mask(), {min: 0, max: 1}, 'Mask Check 2025', false);

// ============================================
// 6b. CEK ANGKA MENTAH: rata-rata indeks per tahun
// ============================================
var statsIndeks2024 = stack2024.select(['NDVI','NDBI','NDTI','NDWI']).reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: aoi.geometry(),
  scale: 30,
  maxPixels: 1e13
});
var statsIndeks2025 = stack2025.select(['NDVI','NDBI','NDTI','NDWI']).reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: aoi.geometry(),
  scale: 30,
  maxPixels: 1e13
});
print('Rata-rata indeks 2024:', statsIndeks2024);
print('Rata-rata indeks 2025:', statsIndeks2025);

// ============================================
// 6c. PETA SELISIH (2025 - 2024) — lebih tajam dari 2 peta terpisah
// ============================================
var diffNDVI = stack2025.select('NDVI').subtract(stack2024.select('NDVI')).rename('diff_NDVI');
var diffNDBI = stack2025.select('NDBI').subtract(stack2024.select('NDBI')).rename('diff_NDBI');
var diffNDTI = stack2025.select('NDTI').subtract(stack2024.select('NDTI')).rename('diff_NDTI');
// TAMBAHAN: selisih NDWI juga, buat konsistensi objek Perairan
var diffNDWI = stack2025.select('NDWI').subtract(stack2024.select('NDWI')).rename('diff_NDWI');

Map.addLayer(diffNDVI, {min: -0.3, max: 0.3, palette: ['red','white','green']}, 'Selisih NDVI (2025-2024)', false);
Map.addLayer(diffNDBI, {min: -0.3, max: 0.3, palette: ['blue','white','red']}, 'Selisih NDBI (2025-2024)', false);
Map.addLayer(diffNDTI, {min: -0.3, max: 0.3, palette: ['blue','white','orange']}, 'Selisih NDTI (2025-2024)', false);
Map.addLayer(diffNDWI, {min: -0.3, max: 0.3, palette: ['brown','white','blue']}, 'Selisih NDWI (2025-2024)', false);

// ============================================
// 7. EXPORT KE GOOGLE DRIVE (.tif)
// ============================================
Export.image.toDrive({
  image: stack2024,
  description: 'feature_stack_2024',
  folder: 'GeoAI_Morowali',
  fileNamePrefix: 'feature_stack_2024',
  region: aoi.geometry(),
  scale: 10,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});

Export.image.toDrive({
  image: stack2025,
  description: 'feature_stack_2025',
  folder: 'GeoAI_Morowali',
  fileNamePrefix: 'feature_stack_2025',
  region: aoi.geometry(),
  scale: 10,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});

// ============================================
// 7b. EXPORT PETA SELISIH JUGA (opsional, buat lampiran laporan)
// ============================================
Export.image.toDrive({
  image: diffNDVI.addBands(diffNDBI).addBands(diffNDTI).addBands(diffNDWI),
  description: 'diff_indeks_2025_2024',
  folder: 'GeoAI_Morowali',
  fileNamePrefix: 'diff_indeks_2025_2024',
  region: aoi.geometry(),
  scale: 10,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});
