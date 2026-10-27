#!/usr/bin/env python3
"""
Lista todos os marcadores <!-- DADO: nome --> do site, com arquivo e linha.

  python3 scripts/listar-dados.py            → tabela no terminal
  python3 scripts/listar-dados.py --readme   → regrava a tabela no README.md

O valor fica logo depois do marcador, no próprio HTML. Para atualizar um dado,
procure pelo nome (ex.: "DADO: seguidores-instagram") em todos os arquivos e
troque o texto que vem em seguida. O mesmo dado pode aparecer em mais de um lugar.
"""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT
IGNORAR = {"revisao", "scripts", "node_modules"}
MARK = re.compile(r"<!-- DADO: ([a-z0-9-]+) -->([^<\n]{0,60})")


def coletar():
    linhas = []
    for f in sorted(SITE.rglob("*.html")):
        if IGNORAR & set(f.relative_to(ROOT).parts):
            continue
        for n, linha in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
            for m in MARK.finditer(linha):
                valor = m.group(2).strip().rstrip(",.")
                linhas.append((m.group(1), f.relative_to(ROOT).as_posix(), n, valor))
    return sorted(linhas)


def tabela(linhas):
    out = ["| dado | arquivo | linha | valor atual |", "|---|---|---|---|"]
    out += [f"| `{d}` | `{f}` | {n} | {v} |" for d, f, n, v in linhas]
    return "\n".join(out)


def main():
    linhas = coletar()
    if "--readme" in sys.argv:
        readme = ROOT / "README.md"
        txt = readme.read_text(encoding="utf-8")
        bloco = "<!-- DADOS:inicio -->\n" + tabela(linhas) + "\n<!-- DADOS:fim -->"
        novo, k = re.subn(r"<!-- DADOS:inicio -->.*?<!-- DADOS:fim -->", bloco, txt, flags=re.S)
        if k != 1:
            raise SystemExit("marcadores DADOS não encontrados no README.md")
        readme.write_text(novo, encoding="utf-8")
        print(f"README atualizado com {len(linhas)} ocorrências")
    else:
        print(tabela(linhas))


if __name__ == "__main__":
    main()
