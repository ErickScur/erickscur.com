# Design v2 — erickscur.com.br

Briefing do dono após a v1: "só branco, enjoativo; seções muito iguais; sem imagem, ícone, SVG; animações sem graça; foto só no fim; linha do tempo fraca; tire os 'fig.' e a 'cabeça de leitura'". Quer um portfólio que impressione em 3 segundos, para CTO, marca e cliente.

## Restrições que continuam valendo
- HTML/CSS/JS puros, sem framework, sem build. **Sem `type="module"`**: o site precisa funcionar abrindo `index.html` direto do Finder (file://) e no cPanel. JS = scripts clássicos com `defer`.
- Bibliotecas locais em `assets/vendor/` (GSAP 3.15.0 e plugins, Lenis 1.3.26).
- Proibido: gradiente roxo/azul, texto com gradiente, blobs desfocados, glassmorphism, emoji como ícone, Inter/Poppins/Montserrat, barras de skill, cursor custom, partículas, typing effect, estética terminal verde/Matrix.
- Privacidade: nada interno da Nestlé; Juntos360 e Candidatus com nome, link e identidade (autorizado em 2026-10-25), sem print real; Pedro só pelo primeiro nome; sem conteúdo pessoal do vault do Nerso; nenhum dado real de pessoas.
- Animar só `transform`, `opacity` (e `clip-path`/atributos SVG pontuais). `prefers-reduced-motion: reduce` → nada se move, tudo visível e bonito.
- Contraste AA para texto.

## Tokens (em `assets/css/site.css`, camada `tokens`)
Tipo: `--font-sans: "Archivo"` (variável, `font-stretch` 100–125%, peso 300–850) e `--font-mono: "Martian Mono"` (use `font-stretch: 87.5%`).

Cores base (tema claro → escuro trocam sozinhas):
| token | claro | uso |
|---|---|---|
| `--paper` / `--paper-2` | #F3EFE7 / #E9E4D9 | fundo / superfície |
| `--ink` / `--ink-2` / `--ink-3` | #121110 / #45423A / #625E53 | texto |
| `--rule` | #D3CDBF | fios |
| `--night` / `--night-2` / `--night-3` | #0F0E0C / #1B1A16 / #2A2823 | seções e "telas" escuras (iguais nos dois temas) |
| `--on-night` / `--on-night-2` / `--on-night-3` | #F2EEE6 / #BDB8AC / #8E897D | texto sobre night |

As três vidas (cor = categoria, sempre com o mesmo significado):
| vida | token | cor | texto sobre papel | texto sobre a cor |
|---|---|---|---|---|
| engenharia | `--eng` | #FF5A36 | `--eng-ink` #C2320D | `--ink` |
| conteúdo | `--cont` | #FFC21A | `--cont-ink` #8A5F00 | `--ink` |
| software house | `--sh` | #3552EC | `--sh-ink` #2E4BDB | #FFFFFF |

Sobre `--night`, use `--sh-bright` (#8EA4FF) para texto ou linha fina azul; `--eng` e `--cont` já passam sobre night.

Componentes que recebem `--lane` (ex.: `style="--lane: var(--sh)"`) usam essa variável para o acento.

Raio: `--radius-s: 6px; --radius-m: 14px; --radius-l: 24px`. Sombra só em "telas" flutuantes: `--shadow-screen: 0 30px 60px -20px rgb(0 0 0 / .45), 0 0 0 1px rgb(255 255 255 / .06) inset`.

Motion: `--ease-publish: cubic-bezier(.16,1,.3,1)`, `--ease-commit: cubic-bezier(.65,0,.35,1)`, durações 120/240/480/900/1400ms. Em JS: `window.SiteMotion.DUR/EASE`.

## Ícones e logos
- Sprite inline em cada página (`<svg class="sprite" hidden>` com `<symbol>`), usado com `<svg class="ico"><use href="#logo-nodedotjs"/></svg>`. Inline porque `<use>` externo não funciona em file://.
- `logo-*` = marcas (tecnologia e empresas), monocromáticas, `fill="currentColor"`.
- `i-*` = ícones próprios do site: grade 24, traço 1.5, pontas redondas, `stroke="currentColor"`.

## Ilustrações de projeto ("covers")
Cada projeto tem uma ilustração animada em HTML/CSS/SVG, como uma "tela" escura (`--night`) com acento na cor da vida do projeto. É ilustração, não print: conteúdo genérico de exemplo, nada real.
- Marcação: `<div class="cover cover--<slug>" style="--lane: var(--eng)">…</div>`, `aspect-ratio: 4 / 3`, ocupa 100% da largura do contêiner (380–720px), funciona em 320px.
- CSS em `assets/css/covers/<slug>.css`, com seletores sempre prefixados por `.cover--<slug>`.
- JS opcional em `assets/js/covers/<slug>.js`: registra `window.SiteCovers = window.SiteCovers || {}; window.SiteCovers['<slug>'] = function (el, gsap) { return timeline; }`. O `main.js` chama quando a cover entra na tela, e só se não houver movimento reduzido. Loops de CSS ficam desligados em `prefers-reduced-motion`.
- O estado sem JS precisa ser bonito e completo (o estado final da animação).

## Estrutura da home v2
1. **Hero:** nome gigante, tagline, foto recortada grande sobre bloco de cor, três "vidas" como pílulas com ícone, faixa marquee de logos da stack.
2. **Três vidas:** cartões grandes empilhados no scroll (sticky), um por cor, com números e logos.
3. **Projetos:** galeria pinada com scroll horizontal no desktop (vertical no mobile), uma cover por projeto.
4. **Como eu trabalho com IA:** seção escura, ícones desenhados no scroll.
5. **Carreira:** linha do tempo vertical com o ano gigante fixo que rola como odômetro, a linha se desenhando, logos das empresas e cor por vida.
6. **Contato:** bloco de cor, foto, e-mail grande, redes com logos.
