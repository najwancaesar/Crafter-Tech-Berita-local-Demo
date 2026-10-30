#!/usr/bin/env python3
"""Pasangkan artikel di data.js dengan foto dari folder '..._files' (hasil Save Page > Complete).

Pakai:  python3 tools/map_images.py "/path/ke/首页 - Shangbao Indonesia_files"
Hasil:  assets/img/<id-artikel>.jpg  +  assets/js/images.js
Artikel tanpa foto otomatis tetap memakai placeholder.
"""
import json
import pathlib
import re
import shutil
import sys
from urllib.parse import unquote

ROOT = pathlib.Path(__file__).resolve().parent.parent
if len(sys.argv) < 2:
    sys.exit(__doc__)
src = pathlib.Path(sys.argv[1]).expanduser()
if not src.is_dir():
    sys.exit(f"Folder tidak ditemukan: {src}")

snap = (ROOT / "reference/original-homepage-snapshot.html").read_text(encoding="utf-8")
js = (ROOT / "assets/js/data.js").read_text(encoding="utf-8")
articles = json.loads(js[js.index("{"):js.rindex("}") + 1])["articles"]
by_url = {a["sourceUrl"]: a["id"] for a in articles}

imgs = [(m.start(), m.group(1)) for m in re.finditer(r'<img[^>]*?src="([^"]+)"', snap)]
hrefs = [(m.start(), m.group(1)) for m in re.finditer(r'href="(https://shangbaoindonesia\.com/read/[^"]+)"', snap)]
SKIP = ("sb_logo", "google_play", "app_store", "cleardot")

out = ROOT / "assets/img"
out.mkdir(parents=True, exist_ok=True)
mapping, missing = {}, []
for pos, s in imgs:
    name = unquote(s.split("/")[-1])
    if name.startswith(SKIP) or not re.search(r"\.(jpe?g|png|webp)$", name, re.I):
        continue
    near = [h for p, h in hrefs if p < pos and pos - p < 700] or \
           [h for p, h in hrefs if p > pos and p - pos < 700][:1]
    aid = by_url.get(near[-1]) if near else None
    if not aid or aid in mapping:
        continue
    f = src / name
    if f.is_file():
        dest = out / f"{aid}{f.suffix.lower()}"
        shutil.copyfile(f, dest)
        mapping[aid] = f"assets/img/{dest.name}"
    else:
        missing.append(name)

(ROOT / "assets/js/images.js").write_text(
    "window.SHANGBAO_IMAGES = " + json.dumps(mapping, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
print(f"Artikel total      : {len(articles)}")
print(f"Foto berhasil dipasang: {len(mapping)}")
print(f"Foto tidak ada di folder: {len(missing)}")
if missing:
    print("Contoh yang hilang:", missing[:5])
