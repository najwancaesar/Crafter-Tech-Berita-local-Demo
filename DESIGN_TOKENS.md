# DESIGN TOKENS — Shangbao Indonesia Reconstruction

> Diukur secara langsung dari `reference-shots/Screenshot 2026-10-30 092436.png` (viewport 1920×1080) dan `reference/original-homepage-snapshot.html`.  
> Semua nilai di bawah telah diverifikasi secara kuantitatif melalui pixel inspection.

---

## 1. Palet Warna (Color Palette)

| Token             | Nilai Hex  | Elemen & Penggunaan                                                    |
|-------------------|------------|------------------------------------------------------------------------|
| `--red`           | `#cd1713`  | Tombol Home nav baris 1, garis bawah nav baris 2, badge "熱點新聞", tab aktif sidebar "热文推荐", teks judul kategori & garis bawahnya, teks nama kota cuaca "雅 加 达" |
| `--red-dark`      | `#a81210`  | State hover untuk tombol Home dan tautan navigasi                      |
| `--yellow-lang`   | `#fbbc05`  | Latar belakang kotak "SELECT LANGUAGE" pada baris navigasi kedua       |
| `--blue-search`   | `#4285f4`  | Tombol pencarian (Search button) dan panel submit                      |
| `--blue-link`     | `#4285f4`  | Tautan artikel pada widget sidebar ("热文推荐")                         |
| `--blue-brand`    | `#2262cc`  | Tulisan kaligrafi kecil "印度尼西亚" di atas logo "商报"                |
| `--orange-num`    | `#fe8917`  | Nomor urut peringkat (01, 02, ...) pada daftar berita populer sidebar   |
| `--outer-bg`      | `#0c0c0c`  | Latar belakang luar kontainer (hampir hitam dengan efek vignette halus)|
| `--paper`         | `#ffffff`  | Kontainer putih utama, latar belakang kartu berita, dan area masthead  |
| `--nav-bg`        | `#fafafb`  | Latar belakang baris navigasi (Row 1 dan Row 2)                         |
| `--ink`           | `#252525`  | Teks artikel utama dan heading hitam                                   |
| `--muted`         | `#777777`  | Teks meta (tanggal/jam) dan kutipan ringkasan berita                   |
| `--line`          | `#dddddd`  | Garis batas widget dan pemisah horizontal antar blok                   |
| `--footer-bg`     | `#252525`  | Latar belakang footer gelap                                            |

---

## 2. Tipografi (Typography)

| Elemen                          | Ukuran Font | Font Family                                          | Berat / Spasi                             |
|---------------------------------|-------------|------------------------------------------------------|-------------------------------------------|
| Nav Links (Row 1 & Row 2)       | `14px`      | Arial, "Microsoft YaHei", "PingFang SC", sans-serif  | Regular, `letter-spacing: 0.5px`, #444    |
| Language Box Text               | `11px`      | sans-serif                                           | Bold, `letter-spacing: 1px`, uppercase    |
| Brand Mark ("商报")             | `54px`      | "SimSun", "STSong", serif                            | Extra-Bold, `#cd1713`, `line-height: 0.95`|
| Brand Sub ("印度尼西亚")         | `15px`      | "Kaiti", "STKaiti", serif                            | Italic, `#2262cc`, `letter-spacing: 2px`  |
| Brand Copy / Slogan             | `30px`      | "SimSun", "STSong", serif                            | Bold, `#171717`, `letter-spacing: 2px`    |
| Ticker Label ("熱點新聞")       | `15px`      | sans-serif                                           | Bold, `#ffffff`, `letter-spacing: 2px`    |
| Ticker Items                    | `14.5px`    | sans-serif                                           | Regular, `#333333`, `letter-spacing: 0.5px`|
| Weather Temp                    | `44px`      | sans-serif                                           | Light (`font-weight: 300`), `#252525`     |
| Weather Unit (°C)               | `15px`      | sans-serif                                           | Light, vertical-align super               |
| Weather City ("雅 加 达")       | `13px`      | sans-serif                                           | Bold, `#cd1713`, `letter-spacing: 6px`    |
| Hero Title (Carousel)           | `24–26px`   | sans-serif                                           | Bold, `#ffffff`, `line-height: 1.35`      |
| Sidebar Tab ("热文推荐")        | `15px`      | sans-serif                                           | Bold, `#ffffff`                           |
| Sidebar Tab ("最多阅读者")      | `13.5px`    | sans-serif                                           | Regular, `#666666`                        |
| Sidebar Numbers (01, 02, ...)   | `22px`      | sans-serif                                           | Bold, `#fe8917`, `line-height: 1.2`       |
| Sidebar Article Links           | `14px`      | sans-serif                                           | Regular, `#4285f4`, `line-height: 1.45`   |
| Category Headings ("热点新闻")   | `20px`      | sans-serif                                           | Bold, `#cd1713`, `letter-spacing: 1px`    |
| Lead Story Title                | `18px`      | sans-serif                                           | Semi-bold, `#252525`, `line-height: 1.35` |
| Small Story Title               | `13.5px`    | sans-serif                                           | Semi-bold, `#252525`, `line-height: 1.4`  |

---

## 3. Dimensi dan Layout Komponen (Measured Dimensions)

| Elemen                          | Dimensi Terukur             | Keterangan & Verifikasi                                    |
|---------------------------------|-----------------------------|------------------------------------------------------------|
| Kontainer Utama (`.site-shell`) | `1320px`                    | Terpusat di 1920px (left: ~290px dengan scrollbar 17px)    |
| Nav Row 1 (`.nav-primary-wrap`) | Tinggi `42px`               | Background `#fafafb`, border-bottom `1px solid #eaeaea`    |
| Home Button (`.nav-link.home`)  | Lebar `46px`, Tinggi `42px` | Background `#cd1713`, icon SVG putih                       |
| Nav Row 2 (`.nav-secondary-wrap`)| Tinggi `42px`              | Background `#fafafb`, border-bottom `2px solid #cd1713`    |
| Select Language Box (`.lang-box`)| Lebar `211px`, Tinggi `42px`| Background `#fbbc05`, teks uppercase + divider + down arrow|
| Search Button (`.search-btn`)   | Lebar `48px`, Tinggi `42px` | Background `#4285f4`, icon search putih                    |
| Masthead (`.masthead`)          | Tinggi `140px`              | Padding `18px 24px`, logo kiri, badge tengah, cuaca kanan  |
| App Store Badges                | Tinggi `52px`, Lebar `156px`| Lencana aplikasi pill hitam netral                         |
| Ticker Bar (`.ticker`)          | Tinggi `40px`               | Label `熱點新聞` dengan chevron panah kanan                |
| Kolom Utama (Kiri)              | Lebar `963px` (~74.5%)      | Menampung hero carousel dan category feed                  |
| Kolom Sidebar (Kanan)           | Lebar `327px` (~25.5%)      | Menampung widget "热文推荐" dan sorotan                     |
| Gap Antar Kolom                 | `20px`                      | Jarak horizontal kolom utama dan sidebar                   |
| Slot Rasio Carousel             | `1.87` (atau `1.76`)        | `object-fit: cover`                                        |
| Slot Rasio Berita Utama (Lead)  | `1.38`                      | `object-fit: cover`                                        |
| Slot Rasio Berita Kecil (Grid)  | `1.35`                      | `object-fit: cover`                                        |
| Slot Rasio Sorotan Sidebar      | `1.25`                      | `object-fit: cover`                                        |

---

## 4. Breakpoints Responsif

| Breakpoint     | Target Device       | Perilaku                                                                        |
|----------------|---------------------|---------------------------------------------------------------------------------|
| `> 1120px`     | Desktop Penuh (1920 / 1366) | Layout 2 baris navigasi, kolom utama + sidebar berdampingan, lebar 1320px       |
| `≤ 1120px`     | Tablet Landscape    | Kontainer melebar hingga 96%, masthead mengompres ukuran font dan padding       |
| `≤ 850px`      | Tablet Portrait     | Masthead bertumpuk (stacked), sidebar turun ke bawah konten utama               |
| `≤ 580px`      | Mobile (390px)      | Menu hamburger muncul, navigasi bertumpuk, single-column, tidak ada scroll horizontal |
