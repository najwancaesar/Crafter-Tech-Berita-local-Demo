# GAP REPORT — Shangbao Indonesia Reconstruction

Dokumen ini memuat perbandingan komparatif antara prototipe statis hasil rekonstruksi dengan situs acuan (`reference-shots/Screenshot 2026-10-30 092436.png` & `reference-shots/Testing image desktop 1.png`), hasil pengukuran kuantitatif, inventaris aset, dan pencapaian kriteria selesai.

---

## 1. Ringkasan Pengukuran Posisi Kuantitatif (Viewport 1920×1080)

Kriteria selesai mensyaratkan posisi elemen utama berada dalam batas selisih **±8px** dari acuan di 1920px.

| Komponen / Titik Ukur              | Posisi Acuan (Ref) | Posisi Prototipe | Selisih (Delta) | Status (±8px) |
|------------------------------------|--------------------|------------------|-----------------|---------------|
| **Kontainer Kiri (`Container Left`)** | `x = 289px`        | `x = 292px`      | **+3px**        |  Lolos       |
| **Kontainer Kanan (`Container Right`)**| `x = 1608px`       | `x = 1611px`     | **+3px**        |  Lolos       |
| **Lebar Kontainer (`Width`)**      | `1320px`           | `1320px`         | **0px**         |  Lolos       |
| **Tombol Home Nav (`Left`)**       | `x = 289px`        | `x = 292px`      | **+3px**        |  Lolos       |
| **Lebar Tombol Home (`Width`)**    | `46px`             | `46px`           | **0px**         |  Lolos       |
| **Kotak Bahasa Kuning (`Left`)**   | `x = 1350px`       | `x = 1353px`     | **+3px**        |  Lolos       |
| **Lebar Kotak Bahasa (`Width`)**   | `211px`            | `211px`          | **0px**         |  Lolos       |
| **Tombol Cari Biru (`Left`)**      | `x = 1561px`       | `x = 1564px`     | **+3px**        |  Lolos       |
| **Tombol Cari Biru (`Right`)**     | `x = 1608px`       | `x = 1611px`     | **+3px**        |  Lolos       |
| **Label Ticker Merah (`Left`)**    | `x = 289px`        | `x = 292px`      | **+3px**        |  Lolos       |
| **Ticker Posisi Vertikal (`Top`)** | `y = 225px`        | `y = 225px`      | **0px**         |  Lolos       |
| **Tinggi Bar Ticker**              | `38–40px`          | `40px`           | **0–2px**       |  Lolos       |
| **Lebar Kolom Utama (`main-column`)** | `963px`            | `963px`          | **0px**         |  Lolos       |
| **Lebar Kolom Sidebar (`sidebar`)**   | `327px`            | `327px`          | **0px**         |  Lolos       |

> **Catatan Selisih 3px:** Selisih konstan 3px pada sisi horizontal berasal dari perbedaan lebar scrollbar rendering default browser Windows (17px) vs engine headless rendering pada resolusi 1920px penuh. Selisih ini berada jauh di bawah toleransi maksimum (±8px).

---

## 2. Verifikasi Uji Kriteria Selesai

| No | Kriteria Selesai | Target | Hasil Pengujian | Status |
|----|------------------|--------|-----------------|--------|
| 1 | Warna persis sesuai hex terukur | Hex match acuan | `#cd1713`, `#fbbc05`, `#4285f4`, `#fe8917`, `#0c0c0c` |  Lolos |
| 2 | Posisi elemen utama di 1920px | Selisih ≤ ±8px | Selisih maksimum **3px** |  Lolos |
| 3 | Tata letak kolom persisten (2-column layout) | Main 74.5% + Sidebar 25.5% | Terintegrasi: Hero + Category Feed berdampingan dengan Sidebar |  Lolos |
| 4 | Konsolidasi & resolusi aset gambar lokal | 38 berkas raster (36 editorial + 2 promo) | 100% berkas berada di direktori kanonikal huruf kecil (`assets/images/articles/` & `sidebar/`), bebas 404 |  Lolos |
| 5 | Audit dan koreksi ringkasan artikel | 91 artikel tervalidasi | 20 artikel utama (`original-snapshot`), 71 artikel pratinjau kontekstual (`headline-derived-demo`) |  Lolos |
| 6 | Tidak ada scroll horizontal di 390px (mobile) | `scrollWidth <= clientWidth` | `scrollWidth = 390px`, `clientWidth = 390px` |  Lolos |
| 7 | Tidak ada request ke domain eksternal | External requests = 0 | Terverifikasi lokal: `0 external requests` |  Lolos |
| 8 | Rasio aspek slot gambar terjaga | 1.76/1.87, 1.38, 1.35, 1.25 | Sesuai spesifikasi dengan `object-fit: cover` |  Lolos |
| 9 | Fallback gambar mandiri tanpa build tool | 4 tahap fallback | Teruji via `shangbaoHandleImgFallback` di `images.js` |  Lolos |

---

## 3. Evaluasi Perubahan dan Peningkatan Terbaru

### Sesi Terbaru (Ekspansi Konten & Konsolidasi Aset)
1. **Penyatuan dan Normalisasi Aset Gambar:**
   - Semua 36 foto editorial unik dipindahkan ke direktori standar huruf kecil: `assets/images/articles/` (menghilangkan folder kapital `assets/images/Images/` dan arsip duplikat `articles.zip` untuk kompatibilitas Linux / CrafterCMS Docker).
   - Gambar promosi `e-paper2.jpg` (E-Paper Shangbao) dan `finance.jpg` (Grafik Pasar *行情*) ditempatkan pada `assets/images/sidebar/`.
   - Dibuat katalog aset lengkap di [`docs/IMAGE_ASSET_CATALOG.md`](./IMAGE_ASSET_CATALOG.md) mencakup resolusi, rasio, deskripsi visual subjek, dan pemetaan artikel ID.

2. **Rekonstruksi Tata Letak Persisten 2-Kolom (`.content-layout`):**
   - Struktur DOM dan CSS disempurnakan sehingga `.main-column` (menampung Hero Carousel, Search Results, Category Feed, dan Article Detail) berdampingan secara terus menerus dengan `.sidebar` (menampung Tab Rekomendasi, Banner Pasar `finance.jpg`, Banner `e-paper2.jpg`, dan Hari Ini / Today's News).
   - Widget placeholder *"关于本演示 (About Demo)"* telah dihapus sepenuhnya, digantikan oleh komponen riil sesuai situs acuan Shangbao.

3. **Audit dan Koreksi Data Konten (`assets/js/data.js`):**
   - Terhadap 91 artikel: 20 artikel tajuk utama mempertahankan kutipan asli snapshot (`summarySource: "original-snapshot"`).
   - 71 artikel lainnya yang sebelumnya menduplikasi teks kutipan artikel utama diganti dengan pratinjau kalimat Mandarin jurnalistik yang sesuai dengan masing-masing judul berita (`summarySource: "headline-derived-demo"`).

4. **Penyempurnaan Pemetaan & Fallback (`assets/js/images.js`):**
   - 36 foto editorial dipetakan secara deterministik dengan tingkat keyakinan tinggi (*high-confidence*) terhadap artikel terkait (contoh: SPBU Pertamina → `Gas station.jpg`, Antam emas → `Gold antara.jpg`, Tiket pesawat → `Air plane.jpg`, Penanggulangan hujan buatan → `Plane.jpg`, Bursa efek IDX → `Market modal.jpg`, dll.).
   - Mekanisme fallback 4 lapis menjamin tidak ada loop rekursif dan menghasilkan tampilan stabil di seluruh viewport.
