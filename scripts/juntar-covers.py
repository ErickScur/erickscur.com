#!/usr/bin/env python3
"""
Junta as ilustrações dos projetos num arquivo só de CSS e um de JS
(menos requisições no servidor). Fonte: assets/css/covers/*.css e
assets/js/covers/*.js. Rode depois de editar qualquer uma delas:

  python3 scripts/juntar-covers.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
for kind, ext in (("css", "css"), ("js", "js")):
    src = sorted((ROOT / "assets" / kind / "covers").glob(f"*.{ext}"))
    out = ROOT / "assets" / kind / f"covers.{ext}"
    head = f"/* gerado por scripts/juntar-covers.py a partir de assets/{kind}/covers/*.{ext} — não edite aqui */\n"
    out.write_text(head + "\n".join(f"/* ---- {p.name} ---- */\n" + p.read_text(encoding="utf-8") for p in src), encoding="utf-8")
    print(out.relative_to(ROOT), len(src), "arquivos")
