from PIL import Image
import os

MEDIA = os.path.join(os.path.dirname(__file__), "..", "public", "media")
MAX_SIDE = 1600
QUALITY = 82

files = [
    "Wenssexpress__1.50.1.jpg",
    "Wenssexpress__1.95.1.jpg",
    "Wenssexpress__1.23.1.jpg",
    "Wenssexpress__1.33.1.jpg",
    "Wenssexpress__1.120.1.jpg",
    "MRTN1539.jpg",
    "MRTN1636.jpg",
    "MRTN1887.jpg",
    "MRTN1513.jpg",
    "pexels-6021574.jpeg",
]

for f in files:
    src = os.path.join(MEDIA, f)
    if not os.path.exists(src):
        print("skip missing", f)
        continue
    base = os.path.splitext(f)[0]
    dst = os.path.join(MEDIA, base + ".webp")
    img = Image.open(src)
    img = img.convert("RGB")
    w, h = img.size
    scale = min(1.0, MAX_SIDE / max(w, h))
    if scale < 1.0:
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    img.save(dst, "WEBP", quality=QUALITY, method=6)
    before = os.path.getsize(src) / 1024
    after = os.path.getsize(dst) / 1024
    print(f"{f}: {before:.0f}KB -> {base}.webp {after:.0f}KB")
