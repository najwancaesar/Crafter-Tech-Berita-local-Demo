# take_screenshots.py
import os
import sys
from playwright.sync_api import sync_playwright

os.environ['PYTHONIOENCODING'] = 'utf-8'

URL = 'http://localhost/shangbao-reconstruction/'
OUT = 'screenshots'
os.makedirs(OUT, exist_ok=True)

viewports = [
    {'name': '1920x1080', 'width': 1920, 'height': 1080},
    {'name': '1366x768',  'width': 1366, 'height': 768},
    {'name': '390x844',   'width': 390,  'height': 844},
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel='msedge')
    for vp in viewports:
        context = browser.new_context(viewport={'width': vp['width'], 'height': vp['height']})
        page = context.new_page()
        page.goto(URL, wait_until='networkidle')
        page.wait_for_timeout(1500)
        out_path = os.path.join(OUT, f"prototype-{vp['name']}.png")
        page.screenshot(path=out_path, full_page=False)
        print(f"Saved: {out_path}")
        context.close()
    browser.close()
print("All screenshots captured.")
