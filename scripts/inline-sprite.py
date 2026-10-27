#!/usr/bin/env python3
"""
Copia assets/img/sprite.svg (logos e ícones) para dentro de cada página,
entre <!-- SPRITE:inicio ... --> e <!-- SPRITE:fim -->.

O sprite fica embutido no HTML porque <use href="arquivo.svg#id"> não funciona
abrindo o site direto do Finder (file://). Rode depois de mexer no sprite:

  python3 scripts/inline-sprite.py
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
IGNORAR = {"revisao", "scripts", "node_modules"}

svg = (ROOT / "assets" / "img" / "sprite.svg").read_text(encoding="utf-8").strip()
svg = re.sub(r"<\?xml[^>]*>\s*", "", svg)
svg = re.sub(r"^<svg\b[^>]*>", '<svg xmlns="http://www.w3.org/2000/svg" class="sprite" aria-hidden="true">', svg, count=1)
BLOCO = re.compile(r"(<!-- SPRITE:inicio[^>]*-->)\n.*?(<!-- SPRITE:fim -->)", re.S)

for f in sorted(ROOT.rglob("*.html")):
    if IGNORAR & set(f.relative_to(ROOT).parts):
        continue
    html = f.read_text(encoding="utf-8")
    novo, n = BLOCO.subn(lambda m: m.group(1) + "\n" + svg + "\n" + m.group(2), html)
    if n:
        f.write_text(novo, encoding="utf-8")
        print("sprite atualizado:", f.relative_to(ROOT))
