# DESIGN TOKENS — Shangbao Indonesia Reconstruction

> Diukur dari reference-shots/ dan original-homepage-snapshot.html.  
> Viewport acuan: 1920×1080 (screenshot tersedia). Acuan kedua: 1366×768.

---

## Warna

| Token              | Hex       | Digunakan di                                    |
|--------------------|-----------|-------------------------------------------------|
| `--red`            | `#cd1713` | Nav primary BG, ticker label, sidebar heading, category heading, home icon, garis bawah menu aktif |
| `--red-dark`       | `#a81210` | Hover state tombol merah                        |
| `--yellow-lang`    | `#fbc836` | Kotak SELECT LANGUAGE di nav secondary          |
| `--blue-search`    | `#4285f4` | Tombol search + link sidebar                    |
| `--orange-num`     | `#fe8917` | Nomor urut artikel popular sidebar              |
| `--outer-bg`       | `#0c0c0c` | Latar luar halaman (hampir hitam)               |
| `--container-bg`   | `#ffffff` | Kontainer utama putih                           |
| `--nav-secondary`  | `#f5f5f5` | BG baris nav kedua                              |
| `--ink`            | `#252525` | Teks utama                                      |
| `--muted`          | `#777777` | Metadata, teks sekunder                         |
| `--line`           | `#dddddd` | Border/garis pemisah                            |
| `--paper`          | `#ffffff` | BG kartu/widget                                 |
| `--link`           | `#4285f4` | Warna link sidebar (sama dengan blue-search)    |

---

## Tipografi

| Token              | Nilai                                           | Digunakan di                     |
|--------------------|-------------------------------------------------|----------------------------------|
| `--font-sans`      | `Arial, "Microsoft YaHei", "PingFang SC", sans-serif` | Semua teks                 |
| Nav primary font   | `14px`, letter-spacing `1.5px`, uppercase/normal | Menu item baris atas            |
| Nav secondary font | `13px`, letter-spacing `0.5px`                  | Menu baris bawah + tools        |
| Lang box font      | `12px`, bold                                    | "SELECT LANGUAGE"                |
| Masthead slogan    | `clamp(20px, 2.4vw, 38px)`, serif, bold         | 加强全民团结促经济繁荣           |
| Brand mark         | `clamp(40px, 5vw, 70px)`, serif, bold, #cd1713  | 商报 logo teks                   |
| Ticker font        | `15px`, letter-spacing `1px`                    | Isi ticker                       |
| Ticker label       | `16px`, bold, letter-spacing `2px`              | 热點新聞                          |
| Widget title       | `15px`, bold, letter-spacing `2px`              | Judul widget sidebar             |
| Popular num        | `26px`, bold, `#fe8917`                         | Nomor artikel popular            |
| Popular link       | `14px`, `#4285f4`, letter-spacing `1px`         | Judul artikel popular            |
| Category heading   | `18-20px`, bold                                 | Judul kategori                   |

---

## Dimensi Layout

| Elemen                  | Nilai                                       |
|-------------------------|---------------------------------------------|
| Container max-width     | `1510px`                                    |
| Container width %       | `~86%` viewport di 1920px → gunakan max-width |
| Nav primary height      | `36–38px`                                   |
| Nav secondary height    | `36–38px`                                   |
| Masthead height         | `95–105px`                                  |
| Ticker height           | `40–44px`                                   |
| Ad banner height        | `70–80px` (placeholder)                     |
| Kolom utama (carousel)  | `~75%` dari kontainer isi                   |
| Sidebar width           | `~25%` dari kontainer isi, min `260px`      |
| Carousel aspect ratio   | `1.76` (landscape lebar)                    |
| Thumbnail berita utama  | `1.38`                                      |
| Thumbnail kecil         | `1.35`                                      |
| Thumbnail sorotan       | `1.25`                                      |
| Sidebar popular number  | `38px` wide                                 |

---

## Spacing

| Elemen                         | Nilai         |
|--------------------------------|---------------|
| Padding kontainer horizontal   | `0` (shell full-width) |
| Padding main content           | `20px 20px 30px` |
| Jarak nav item horizontal      | `padding: 0 10–14px` |
| Gap antara top-grid elements   | `20px`        |
| Gap antara category sections   | `20px`        |
| Widget margin-bottom           | `16px`        |
| Popular list item padding      | `10–12px 0`   |

---

## Elemen Khusus

### Nav Primary (baris 1 — merah)
- BG: `#cd1713`
- Teks item: putih `#fff`
- Home icon: kotak putih 36px × 36px dengan ikon rumah merah — atau kotak merah-gelap saja
- Item hover: BG sedikit lebih gelap `#a81210`
- Garis bawah aktif: tidak ada (full BG sudah merah)

### Nav Secondary (baris 2 — abu/putih)
- BG: `#f5f5f5` atau `#fff` dengan border-bottom `2px solid #cd1713`
- Teks: `#444`
- Kanan: kotak kuning "SELECT LANGUAGE ▼" + tombol biru dengan ikon search
- Language box: `padding: 6px 10px`, border-radius ringan, font-weight bold
- Search button: `background: #4285f4`, warna putih

### Ticker Label
- BG: `#cd1713`
- Teks putih, bold
- Panah/chevron ke kanan via CSS clip-path atau border trick

### Sidebar Widget Title
- Dua tab: "热文推荐" (aktif, BG merah teks putih) + "最多阅读者" (tidak aktif, BG abu)
- Border-bottom 2px merah di tab aktif

### Body Background Texture
- BG: `#0c0c0c`
- Ornamen CSS: `radial-gradient` atau `repeating-linear-gradient` subtle di sisi kiri/kanan
- Sisi tengah tetap putih (kontainer)

---

## Breakpoints

| Breakpoint | Target                                  |
|------------|-----------------------------------------|
| `> 1120px` | Desktop penuh — acuan utama             |
| `≤ 1120px` | Tablet landscape — compress masthead    |
| `≤ 850px`  | Tablet portrait — stack masthead        |
| `≤ 580px`  | Mobile — hamburger menu, single column  |
| `390px`    | iPhone — no horizontal scroll required  |
