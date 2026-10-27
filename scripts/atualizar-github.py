#!/usr/bin/env python3
"""
Opcional: atualiza no HTML os números que vêm do GitHub, usando o `gh` já logado.
Não roda no site: é uma ferramenta sua. O navegador nunca chama a API.

  python3 scripts/atualizar-github.py          → mostra o que mudaria
  python3 scripts/atualizar-github.py --gravar → grava nos arquivos

Para acrescentar um número: marque no HTML com <!-- DADO: nome --> antes do
valor e inclua o nome em FONTES abaixo.
"""
from pathlib import Path
import json
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT
IGNORAR = {"revisao", "scripts", "node_modules"}

# dado → (repositório, métrica). Só repositórios públicos aparecem com link no site.
FONTES = {
    "github-clean-node-api-commits": ("ErickScur/clean-node-api", "commits"),
}


def gh(*args):
    r = subprocess.run(["gh", *args], capture_output=True, text=True, check=True)
    return r.stdout


def commits(repo):
    # uma página de 1 commit; o cabeçalho Link diz quantas páginas existem
    saida = gh("api", "-i", f"repos/{repo}/commits?per_page=1")
    m = re.search(r'page=(\d+)>; rel="last"', saida)
    return int(m.group(1)) if m else len(json.loads(saida.split("\r\n\r\n", 1)[-1] or "[]"))


def main():
    gravar = "--gravar" in sys.argv
    valores = {}
    for dado, (repo, metrica) in FONTES.items():
        if metrica == "commits":
            valores[dado] = str(commits(repo))
        print(f"{dado}: {valores[dado]}  ({repo})")

    for f in SITE.rglob("*.html"):
        if IGNORAR & set(f.relative_to(ROOT).parts):
            continue
        txt = f.read_text(encoding="utf-8")
        novo = txt
        for dado, valor in valores.items():
            novo = re.sub(rf"(<!-- DADO: {dado} -->)\d[\d.,]*", rf"\g<1>{valor}", novo)
        if novo != txt:
            print(f"  {'gravado' if gravar else 'mudaria'}: {f.relative_to(ROOT)}")
            if gravar:
                f.write_text(novo, encoding="utf-8")


if __name__ == "__main__":
    main()
