"""Copia las fotos reales y el logo de gama-studio (solo lectura) y genera WebP optimizados.

Uso: python -I tools/optimizar_assets.py
- Fuente original: gama-studio/public/images (NUNCA se modifica; solo se lee).
- Copias crudas:   assets/originales/<categoria>/...
- WebP:            assets/web/fotos/<categoria>/*.webp  (máx. 1400 px por lado)
                   assets/web/equipos/*.webp            (máx. 900 px, conserva alfa)
                   assets/web/logo/logo-gama.webp
"""
from pathlib import Path
import shutil

from PIL import Image, ImageDraw, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = Path(r"C:\Users\brand\OneDrive\Desktop\Proyectos trabajo\Proyectos paginas wb\gama-studio\public\images")
CATEGORIAS = ["casual", "cumpleanos", "evento-social", "marketing-producto", "root", "yo"]
EQUIPOS = RAIZ / "assets" / "productos" / "servicios"
WEB = RAIZ / "assets" / "web"


def a_webp(src: Path, dst: Path, lado: int, calidad: int, alfa: bool) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    im = ImageOps.exif_transpose(Image.open(src))
    im = im.convert("RGBA" if alfa else "RGB")
    im.thumbnail((lado, lado), Image.LANCZOS)
    im.save(dst, "WEBP", quality=calidad, method=6, alpha_quality=90 if alfa else 100)


def main() -> None:
    total = 0
    for cat in CATEGORIAS:
        for src in sorted((ORIGEN / cat).glob("*")):
            if src.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
                continue
            copia = RAIZ / "assets" / "originales" / cat / src.name
            copia.parent.mkdir(parents=True, exist_ok=True)
            if not copia.exists():
                shutil.copy2(src, copia)
            a_webp(copia, WEB / "fotos" / cat / f"{src.stem}.webp", 1400, 80, False)
            total += 1

    logo = RAIZ / "assets" / "originales" / "logo" / "logo-gama.png"
    logo.parent.mkdir(parents=True, exist_ok=True)
    if not logo.exists():
        shutil.copy2(ORIGEN / "logo" / "logo-gama.png", logo)
    a_webp(logo, WEB / "logo" / "logo-gama.webp", 600, 85, False)

    # Recorte circular de la placa del logo (centro ~450,454; radio ~382 en el original 900x900).
    placa = Image.open(logo).convert("RGB").crop((450 - 372, 454 - 372, 450 + 372, 454 + 372))
    mascara = Image.new("L", (744 * 4, 744 * 4), 0)
    ImageDraw.Draw(mascara).ellipse((0, 0, 744 * 4 - 1, 744 * 4 - 1), fill=255)
    placa.putalpha(mascara.resize(placa.size, Image.LANCZOS))
    placa.thumbnail((320, 320), Image.LANCZOS)
    placa.save(WEB / "logo" / "logo-circulo.webp", "WEBP", quality=88, method=6)

    credito = RAIZ / "assets" / "originales" / "logo" / "ingenix-hub.png"
    if not credito.exists():
        shutil.copy2(ORIGEN / "logo" / "ingenix-hub.png", credito)
    a_webp(credito, WEB / "logo" / "ingenix-hub.webp", 400, 88, True)

    for src in sorted(EQUIPOS.glob("*.png")):
        a_webp(src, WEB / "equipos" / f"{src.stem}.webp", 900, 82, True)
        total += 1

    peso = sum(f.stat().st_size for f in WEB.rglob("*.webp")) / 1e6
    print(f"{total + 1} imágenes -> assets/web ({peso:.1f} MB)")


if __name__ == "__main__":
    main()
