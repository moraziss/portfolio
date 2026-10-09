"""Build assets/og-image.png (1200x630) from the hero screenshot.

The social preview is a crop of docs/screenshots/hero-light.png, so it never
drifts from the real page: re-run scripts/screenshots.ps1 and then this script
after changing the hero.

    pip install pillow
    python scripts/og-image.py
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "docs" / "screenshots" / "hero-light.png"
DST = ROOT / "assets" / "og-image.png"

OG_W, OG_H = 1200, 630
# Crop box in source pixels (2160x1350 screenshot): badge, name, diagram and
# buttons, without the top nav pill or the half-visible stats strip.
# Width/height keep the 1200:630 aspect ratio.
CROP = (137, 200, 2023, 1190)


def main() -> None:
    with Image.open(SRC) as im:
        card = im.convert("RGB").crop(CROP).resize((OG_W, OG_H), Image.LANCZOS)
    card.save(DST, optimize=True)
    print(f"wrote {DST.relative_to(ROOT)} ({OG_W}x{OG_H}, {DST.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
