# GAP REPORT — Shangbao Indonesia Reconstruction

Dokumen ini memuat laporan perbandingan komparatif prototipe antarmuka statis Shangbao Indonesia hasil rekonstruksi akhir (*Final Layout Refinement*) terhadap situs acuan (`https://shangbaoindonesia.com/` & `reference-shots/`), inventaris 12 kategori *Featured Lead* vs 8 kategori *Compact*, arsitektur kolom samping (sidebar), kontrol pengulangan gambar tanpa placeholder, serta hasil pengujian lintas viewport.

---

## 1. Ringkasan Pengukuran Posisi Kuantitatif (Viewport 1920×1080)

Kriteria selesai mensyaratkan posisi elemen utama berada dalam batas toleransi **±8px** dari acuan di 1920px.

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

> **Catatan Selisih 3px:** Selisih konstan 3px pada sisi horizontal berasal dari perbedaan lebar scrollbar default browser Windows (17px) vs engine headless rendering pada resolusi 1920px penuh. Selisih ini berada jauh di bawah toleransi maksimum (±8px).

---

## 2. Diferensiasi Tata Letak 20 Kategori Editorial

Untuk mengatasi repetisi visual berulang dari 20 foto besar berturut-turut, struktur editorial feed dipecah menjadi **12 Kategori Featured Lead** dan **8 Kategori Compact**:

### A. 12 Kategori Featured Lead (Pilar Berita Utama)
Setiap kategori memuat:
1. Satu berita utama (*lead article*) dengan foto lanskap besar (rasio 1.38).
2. Judul berita berbobot tebal (`font-weight: 700`, 17px).
3. Tanggal dan jam publikasi dengan ikon jam (`⏱`).
4. Ringkasan berita jurnalistik (*excerpt*).
5. Tautan membaca lanjutan `查看更多 »`.
6. Kisi 2×2 berisi hingga 4 artikel pendukung dengan thumbnail rasio 1.2–1.35.

| # | Kategori (中文) | Target / Tema | ID Berita Utama | Foto Utama | Alasan Pemilihan Featured |
|---|----------------|---------------|-----------------|------------|---------------------------|
| 1 | **热点新闻** | Hot Headlines | `economy-1793073564` | `Gas station.jpg` | Berita terhangat terkurasi, tajuk pembuka halaman |
| 2 | **政治** | Politics | `politics-1793023446` | `Mrs. puji.jpg` | Berita kebijakan nasional, parlemen, & kepala negara |
| 3 | **法律** | Law / Hukum | `hukum-1792767922` | `BEM Ui Dukuh atas.jpg` | Penegakan hukum KPK, kepolisian, & regulasi |
| 4 | **首都动态** | Metropolitan | `metropolitan-1793024041` | `Cleaning service machine.jpg` | Dinamika perkotaan Jakarta, LRT, & tata kota |
| 5 | **国外新闻** | International | `berita-luar-negeri-1793020357` | `England country.jpg` | Dinamika geopolitik global & diplomasi internasional |
| 6 | **教育与文化** | Education & Culture | `pendidikan-kebudayaan-1792159968` | `PKD.jpg` | Forum APEKSI, warisan kebudayaan nasional |
| 7 | **华社** | Chinese Community | `chinese-community-1792942692` | `Images-2.jpg` | Identitas inti koran Shangbao Indonesia |
| 8 | **社论** | Editorial | `editorial-1793022053` | `Sir purbaya.jpg` | Pandangan resmi dewan redaksi & analisis perbankan |
| 9 | **社会** | Society | `society-1793022678` | `Plane.jpg` | Penanggulangan bencana, C-130 Hercules, & humaniora |
| 10 | **特别** | Special Features | `special-news-1789913890` | `Speech.jpg` | Liputan khusus kamar dagang & investasi bilateral |
| 11 | **财经** | Economy | `economy-1793073564` | `Gas station.jpg` | Pilar ekonomi riil, komoditas, migas, & industri |
| 12 | **金融** | Financial | `financial-1793069962` | `Corporate human.jpg` | Pilar perbankan, pasar modal IDX, kurs Rupiah, & BI |

---

### B. 8 Kategori Compact (Tata Letak Ringkas)
Kategori pendukung/sekunder tidak dihapus, melainkan disajikan dalam tata letak kompak berkisi 2-kolom:
- Judul kategori tetap lengkap dengan garis merah dan tautan `查看更多 »`.
- Kartu berita ringkas (`.compact-story`) dengan thumbnail proporsional (88px), judul berita, dan tanggal jam.
- Menghilangkan foto lanskap raksasa dan paragraf deskripsi panjang untuk menjaga ritme vertikal halaman yang seimbang.

| # | Kategori (中文) | Target / Tema | Jumlah Artikel | Foto yang Digunakan | Alasan Pemilihan Compact |
|---|----------------|---------------|----------------|---------------------|--------------------------|
| 1 | **科学与技术** | Science & Tech | 5 | Infrastruktur, Police-2, PKD, Corporate, National | Berita sains/teknologi sekunder, lebih rapi dalam kisi ringkas |
| 2 | **评论** | Opinion | 2 | Images - 3, England country | Hanya memiliki 2 artikel asli dari snapshot, sangat pas ringkas |
| 3 | **健康知识** | Health | 5 | Mrs. puji, Corporate, Cleaning, Bolts, BEM UI | Rubrik gaya hidup & kesehatan, efisien dibaca dalam kisi ringkas |
| 4 | **体育** | Sports | 5 | Meet up, President moment, Air plane, Road, Train | Kilas hasil olahraga, turnamen, & kompetisi |
| 5 | **娱乐** | Entertainment | 5 | Images-2, Images - 3, President, Police-4, Teamwork | Berita seni, bioskop, & musik |
| 6 | **人民福利** | Kesra | 5 | Bolts, Moneyfestation, Export textile, Cleaning, Infra | Bantuan sosial & kesejahteraan masyarakat |
| 7 | **宗教** | Religion | 4 | Suhut, England country, Speech-2, Community | Memiliki 4 artikel asli dari snapshot, rapi tanpa card kosong |
| 8 | **东盟动态** | ASEAN | 5 | Plane, Forek Hulu Migas, Speech, Community, Bank of China | Buletin kawasan regional Asia Tenggara |

---

## 3. Rekonstruksi Kolom Samping (Sidebar Architecture)

Kolom samping (`.sidebar`, lebar ~25.5% / ~327px) ditata ulang secara berurutan sesuai rekomendasi struktural resmi:

1. **A. Tab Berita Populer (`.widget`):**
   - **Tab 1 (热文推荐):** Menampilkan 5 artikel terpopuler terkurasi dengan nomor urut oranye `01`–`05`.
   - **Tab 2 (最多阅读者):** Menampilkan 5 artikel paling banyak dibaca secara interaktif tanpa reload halaman.
2. **B. Widget Pasar / Keuangan (`finance.jpg`):**
   - Papan grafik pergerakan valuta asing & IHSG harian (rasio 1.76) dengan tautan menuju `#category/财经`.
3. **C. Widget Promosi Shangbao E-Paper (`e-paper2.jpg`):**
   - Spanduk langganan surat kabar digital interaktif dengan tautan menuju `#epaper`.
4. **D. Kilas Berita Terpilih / Highlights (`#sideHighlights`):**
   - Menampilkan 4 entri berita pendek terkurasi dengan thumbnail foto, judul, dan waktu publikasi.
   - Menggunakan 4 foto yang sepenuhnya berbeda (`President moment.jpg`, `Train.jpg`, `Speech.jpg`, `Sir purbaya.jpg`) untuk menghindari repetisi foto berurutan.
5. **E. Slot Iklan Samping (`.widget-ad-slot`):**
   - Slot banner komersial yang didukung snapshot referensi (`assets/images/banners/head-ad-banner.svg`).

> **Catatan Aliran Kolom (Sidebar Scrolling):** Sesuai instruksi pengujian snapshot acuan, sifat `position: sticky` dan `overflow-y: auto` pada sidebar telah ditiadakan sehingga sidebar mengalir secara alami berdampingan dengan kolom utama tanpa scrollbar internal yang mengganggu.

---

## 4. Kontrol Pengulangan Gambar & Eliminasi Placeholder

- **Jumlah Aset Raster Lokal:** 36 foto editorial + 2 grafis promosi (`finance.jpg`, `e-paper2.jpg`).
- **Status Placeholder pada Homepage:** **0 Placeholder Aktif** (`news-placeholder.svg: 0`, `hero-placeholder.svg: 0`). Seluruh slot berita terisi 100% foto lokal riil.
- **Keunikan Internal Kategori:** **100% Unik**. Di dalam tiap kategori dari ke-20 kategori berita, tidak ada dua artikel yang memakai foto yang sama.
- **Keunikan Hero Carousel:** **100% Unik**. Ke-10 slide tayangan utama menggunakan 10 foto lokal yang berbeda.
- **Frekuensi Penggunaan Ulang Foto:** Rata-rata 2–3 artikel per foto di seluruh 91 artikel database (frekuensi tertinggi hanya 4 kali pada kategori yang berjauhan).

---

## 5. Matriks Verifikasi Uji Kriteria Selesai

| No | Kriteria Selesai | Target | Hasil Pengujian Aktual | Status |
|----|------------------|--------|------------------------|--------|
| 1 | Rasio 12 Lead vs 8 Compact | Tepat 12 Lead & 8 Compact | 12 kategori `.category-featured` & 8 kategori `.category-compact` |  Lolos |
| 2 | Ketersediaan 20 Kategori | Seluruh 20 kategori dapat diakses | 20 nama kategori tampil di feed & navigasi dua baris |  Lolos |
| 3 | Eliminasi Placeholder Gambar | 0 placeholder di homepage | `news-placeholder: 0`, `hero-placeholder: 0` |  Lolos |
| 4 | Pengulangan Foto Berdekatan | Tidak ada foto sama berdampingan | 0 duplikat internal per kategori, 0 duplikat di carousel |  Lolos |
| 5 | Struktur Sidebar Mandiri | 5 blok (Popular, Finance, EPaper, 4 Highlights, Ad) | Lengkap, interaktif, dan proporsional |  Lolos |
| 6 | Interaktivitas Tab Sidebar | Tab 1 & Tab 2 berfungsi | Berpindah instan antara 5 berita Populer & 5 Paling Banyak Dibaca |  Lolos |
| 7 | Aliran Kolom Sidebar | Natural column flow (non-sticky) | `position: static/natural`, tidak ada scroll internal |  Lolos |
| 8 | Header & Footer Tidak Berubah | Desain disetujui dipertahankan | Utuh: Logo, Navigasi 2 baris, Cuaca, Jam, Ticker, Footer |  Lolos |
| 9 | Pengujian Responsif (Mobile 390px) | `scrollWidth <= clientWidth` | `scrollWidth = 390px`, `clientWidth = 390px` (bebas overflow) |  Lolos |
| 10 | Bukti Tangkapan Layar | Resolusi standar tersimpan | `screenshots/` (Desktop 1920, Laptop 1366, Mobile 390, Full Feed) |  Lolos |
