/* gerado por scripts/juntar-covers.py a partir de assets/js/covers/*.js — não edite aqui */
/* ---- candidatus.js ---- */
/* cover: candidatus. Script clássico; só registra a função.
   Vagas entram → filtros duros cortam → pesos enchem → ranking reordena (MMR) → explicação. */
(function () {
  'use strict';
  window.SiteCovers = window.SiteCovers || {};
  window.SiteCovers['candidatus'] = function (el, gsap) {
    var q = function (s) { return el.querySelector(s); };
    var qa = function (s) { return [].slice.call(el.querySelectorAll(s)); };
    var EO = 'expo.out', IO = 'power2.inOut';

    // estágios: a marca desliza de um para o outro (medida contra o último)
    var steps = qa('.cd-stages li'), mark = q('.cd-mark');
    var last = steps[steps.length - 1];
    var at = steps.map(function (s) {
      return { x: s.offsetLeft - last.offsetLeft, scaleX: s.offsetWidth / last.offsetWidth };
    });
    var T = [0.25, 1.25, 1.95, 3.45, 4.45]; // início de cada estágio

    // ranking: ordem antes do MMR = por nota pura (92, 90, 86, 81)
    var rows = qa('.cd-rank li');
    var step = rows[2].offsetTop - rows[1].offsetTop;
    var before = [0, 2, 3, 1]; // posição de cada linha (ordem final do DOM) antes do MMR
    var pcts = qa('.cd-rank strong');

    var tl = gsap.timeline({ defaults: { ease: EO, duration: 0.48 } });
    tl.from(q('.cd-win'), { y: 16, opacity: 0, duration: 0.9 }, 0)
      .set(mark, at[0], 0);
    steps.forEach(function (s, i) {
      if (i) tl.to(mark, { x: at[i].x, scaleX: at[i].scaleX, duration: 0.6, ease: IO }, T[i]);
      tl.from(s, { opacity: 0.38, duration: 0.3 }, T[i]);
    });
    var lastB = steps[steps.length - 1].querySelector('b');
    tl.fromTo(lastB, { backgroundColor: 'rgba(0,0,0,0)' }, { backgroundColor: getComputedStyle(lastB).backgroundColor, duration: 0.3 }, T[4])

      // 1 · vagas chegam e os filtros duros cortam
      .from(qa('.cd-jobs li'), { y: -14, opacity: 0, duration: 0.6, stagger: 0.09 }, 0.3)
      .from(qa('.is-out'), { borderStyle: 'solid', duration: 0.01 }, 1.25)
      .from(qa('.is-out>i, .is-out span'), { opacity: 1, duration: 0.4, ease: IO }, 1.3)
      .from(qa('.is-out b'), { '--k': 0, duration: 0.4, ease: IO, stagger: 0.08 }, 1.3)
      .from(qa('.cd-jobs em'), { x: -6, opacity: 0, duration: 0.4, stagger: 0.08 }, 1.4)

      // 2–3 · similaridades entram na soma ponderada
      .from(q('.cd-w'), { opacity: 0.4, duration: 0.4 }, 1.9)
      .from(qa('.cd-bars li'), { '--f': 0, duration: 0.9, stagger: 0.08 }, 2.0)
      .from(qa('.cd-bars b'), { opacity: 0, duration: 0.3, stagger: 0.08 }, 2.1)
      .from(q('.cd-note'), { opacity: 0, y: 4 }, 2.6)
      .from(qa('.cd-foot b'), { opacity: 0, duration: 0.3, stagger: 0.6 }, 1.5)

      // ranking por nota pura, depois o MMR reordena
      .fromTo(rows, { y: function (i) { return (before[i] - i) * step; } }, { y: 0, duration: 0.9, ease: IO }, 3.5)
      .fromTo(rows, { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.07 }, 2.55)
      .from(qa('.cd-n'), { opacity: 0, duration: 0.3 }, 4.1)
      .from(q('.is-dup'), { borderStyle: 'solid', duration: 0.01 }, 3.6)
      .from(qa('.is-dup>*'), { opacity: 1, duration: 0.5, ease: IO }, 3.6)
      .fromTo(q('.cd-swap span'), { opacity: 1 }, { opacity: 0, duration: 0.3 }, 3.7)
      .fromTo(q('.cd-swap span+span'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 3.8)
      // 5 · explicação
      .fromTo(q('.cd-skel'), { opacity: 0.8 }, { opacity: 0, duration: 0.3 }, 4.55)
      .fromTo(q('.cd-why'), { clipPath: 'inset(0 100% 0 0 round 99px)', opacity: 0 },
        { clipPath: 'inset(0 0% 0 0 round 99px)', opacity: 1, duration: 0.7 }, 4.5)
      .from(q('.cd-sumup'), { opacity: 0, y: 6 }, 4.6)
      .from(qa('.cd-stack i'), { scaleX: 0, duration: 0.6, stagger: 0.08 }, 4.7);

    // as notas contam até o valor
    pcts.forEach(function (p, i) {
      var o = { v: 0 }, v = +p.dataset.v;
      p.textContent = '0%';
      tl.to(o, { v: v, duration: 0.8, ease: IO, onUpdate: function () { p.textContent = Math.round(o.v) + '%'; } }, 2.6 + i * 0.07);
    });
    return tl;
  };
})();

/* ---- consultores.js ---- */
/* cover: plataforma para consultores. Script clássico; só registra a função.
   Pedido → tool → confirmação → escrita auditada → painel atualiza. */
(function () {
  'use strict';
  window.SiteCovers = window.SiteCovers || {};
  window.SiteCovers['consultores'] = function (el, gsap) {
    var q = function (s) { return el.querySelector(s); };
    var EO = 'expo.out', IO = 'power2.inOut';

    // palavras do pedido em spans (uma vez só)
    var msg = q('.cc-msg');
    if (!msg.dataset.split) {
      var words = msg.textContent.trim().split(/ +/);
      msg.textContent = '';
      words.forEach(function (w, i) {
        var s = document.createElement('span');
        s.className = 'cc-w'; s.textContent = w;
        msg.appendChild(s);
        if (i < words.length - 1) msg.appendChild(document.createTextNode(' '));
      });
      msg.dataset.split = '1';
    }

    var num = q('.cc-num'), gnum = q('.cc-gnum');
    var money = { v: +num.dataset.from }, score = { v: +gnum.dataset.from };
    var to = { m: 186800, g: 74 };
    var fmt = function (v) { return 'R$ ' + (Math.round(v / 100) * 100).toLocaleString('pt-BR'); };
    num.textContent = fmt(money.v); gnum.textContent = score.v;

    // anel do pedido de confirmação cresce o mesmo tanto nos dois eixos
    var card = q('.cc-confirm'), pad = 7;
    var sx = 1 + 2 * pad / (card.offsetWidth || 200), sy = 1 + 2 * pad / (card.offsetHeight || 60);

    var rows = el.querySelectorAll('.cc-feed li');
    var step = rows.length > 1 ? rows[1].offsetTop - rows[0].offsetTop : 0;

    // o painel cresce para cima a cada passo, como um chat de verdade:
    // recorta o topo (clip-path) e desce o conteúdo na mesma medida
    var panel = q('.cc-panel'), inner = q('.cc-in'), tool = q('.cc-tool');
    // offsets (não getBoundingClientRect): imune a escala no contêiner
    var pb = panel.clientHeight - parseFloat(getComputedStyle(inner).paddingBottom);
    var D = [q('.cc-head'), msg, tool, card].map(function (n) { return Math.max(0, pb - n.offsetTop - n.offsetHeight); });
    var r = getComputedStyle(panel).borderTopLeftRadius, g = { d: D[0] };
    var paint = function () {
      inner.style.transform = g.d ? 'translateY(' + g.d + 'px)' : '';
      panel.style.clipPath = g.d ? 'inset(' + g.d + 'px 0 0 0 round ' + r + ')' : '';
    };
    paint();
    var grow = function (d) { return { d: d, duration: 0.6, ease: EO, onUpdate: paint }; };

    var tl = gsap.timeline({ defaults: { ease: EO, duration: 0.48 } });
    tl.from(q('.cc-app'), { y: 16, opacity: 0, duration: 0.9 }, 0)
      .from(q('.cc-chat'), { xPercent: 16, opacity: 0, duration: 0.9 }, 0.2)
      .to(g, grow(D[1]), 0.75)
      .to(g, grow(D[2]), 1.5)
      .to(g, grow(D[3]), 2.35)
      .to(g, grow(0), 4.1)
      .from(msg, { y: 10, scale: 0.94, opacity: 0, transformOrigin: '100% 100%' }, 0.75)
      .from(msg.querySelectorAll('.cc-w'), { y: 4, opacity: 0, duration: 0.3, stagger: 0.045 }, 0.8)
      .from(tool, { y: 10, opacity: 0 }, 1.5)
      .fromTo(q('.cc-st-wait'), { opacity: 1 }, { opacity: 0, duration: 0.24 }, 4.05)
      .fromTo(q('.cc-st-ok'), { opacity: 0 }, { opacity: 1, duration: 0.24 }, 4.1)
      .fromTo(q('.cc-prog'), { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.7, ease: IO }, 1.6)
      .to(q('.cc-prog'), { opacity: 0, duration: 0.24 }, 2.3)
      .from(card, { y: 10, opacity: 0 }, 2.35)
      .fromTo(q('.cc-ring'), { opacity: 0.9, scaleX: 1, scaleY: 1 },
        { opacity: 0, scaleX: sx, scaleY: sy, duration: 0.9, ease: 'power2.out', repeat: 1, repeatDelay: 0.1 }, 2.75)
      .to(q('.cc-btn.is-pri'), { scale: 0.93, duration: 0.12, ease: 'power2.out' }, 3.85)
      .to(q('.cc-btn.is-pri'), { scale: 1, duration: 0.24 }, 3.97)
      .from(q('.cc-done'), { y: 8, opacity: 0 }, 4.1)
      // painel reage à escrita
      .to(money, { v: to.m, duration: 1.1, ease: IO, onUpdate: function () { num.textContent = fmt(money.v); } }, 4.35)
      .to(score, { v: to.g, duration: 1.1, ease: IO, onUpdate: function () { gnum.textContent = Math.round(score.v); } }, 4.35)
      .fromTo(q('.cc-g-fill'), { attr: { 'stroke-dasharray': '70 100' } }, { attr: { 'stroke-dasharray': '74 100' }, duration: 1.1, ease: IO }, 4.35)
      .from(q('.cc-sp-new'), { scale: 0, svgOrigin: '84 11', duration: 0.9, ease: IO }, 4.4)
      .fromTo(q('.cc-hl'), { opacity: 0 }, { opacity: 1, duration: 0.24, yoyo: true, repeat: 1, repeatDelay: 0.8 }, 4.35)
      .from(q('.cc-delta'), { y: 5, opacity: 0 }, 4.6)
      .from(rows[0], { opacity: 0, x: -8, duration: 0.6 }, 4.55)
      .from([].slice.call(rows, 1), { y: -step, duration: 0.9 }, 4.4);
    return tl;
  };
})();

/* ---- maquina-1porcento.js ---- */
/* Cover — A máquina do 1%. Script clássico; só registra, não roda nada sozinho.
   Um token sai do Reel e percorre o trilho por baixo das cartas; a cada
   etapa a carta acende e o contador gira +1. */
(function () {
'use strict';
window.SiteCovers = window.SiteCovers || {};

window.SiteCovers['maquina-1porcento'] = function (el, gsap) {
  const $ = (s, r) => (r || el).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || el).querySelectorAll(s));
  const D = { tap: 0.12, quick: 0.24, base: 0.48, slow: 0.9 };

  if (el._coverTl) el._coverTl.kill();

  const cards = $$('.mq-card');
  const tok = $('.mq-tok');
  const seg = [$('.mq-s1 i'), $('.mq-s2 i'), $('.mq-s3 i')];
  // cada trecho: token de borda a borda (em % da cover: largura 100cqi, altura 75cqi)
  // e o preenchimento do segmento no mesmo vão (fração do segmento)
  const LEG = [
    { a: [31, 25.33], b: [37, 25.33], s: 0, p: 'scaleX', f: [0.203, 0.297] },
    { a: [63, 25.33], b: [69, 25.33], s: 0, p: 'scaleX', f: [0.703, 0.797] },
    { a: [82, 41.33], b: [82, 56], s: 1, p: 'scaleY', f: [0.343, 0.657] },
    { a: [69, 72], b: [63, 72], s: 2, p: 'scaleX', f: [0.203, 0.297] },
    { a: [37, 72], b: [31, 72], s: 2, p: 'scaleX', f: [0.703, 0.797] },
  ];

  const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: D.base } });
  el._coverTl = tl;

  // estado inicial
  tl.set(seg[0], { scaleX: 0 }, 0)
    .set(seg[1], { scaleY: 0 }, 0)
    .set(seg[2], { scaleX: 0 }, 0)
    .set(tok, { autoAlpha: 0, x: 0, y: 0 }, 0)
    .set($$('.mq-lbl'), { opacity: 0.35 }, 0)
    .set($$('.mq-st'), { scale: 1, opacity: 0.22 }, 0)
    .set($$('.mq-ring'), { opacity: 0 }, 0)
    .set($$('.mq-n i:first-child'), { opacity: 1, yPercent: 0 }, 0)
    .set($$('.mq-n i:last-child'), { opacity: 0, yPercent: 100 }, 0)
    .set([$('.mq-chip'), $('.mq-plus'), $('.mq-ok')], { autoAlpha: 0, scale: 0.85 }, 0)
    .set($('.mq-field em'), { scale: 1 }, 0)
    .set($('.mq-rcpt'), { yPercent: 100 }, 0)
    .set($('.mq-shackle'), { y: 0 }, 0);

  tl.fromTo(cards, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.05, duration: D.slow }, 0);

  const light = (i, t) => {
    const c = cards[i];
    tl.to($('.mq-ring', c), { opacity: 1, duration: D.quick, ease: 'power2.out' }, t)
      .to($('.mq-st', c), { opacity: 1, duration: D.quick }, t)
      .fromTo($('.mq-st', c), { scale: 2.2 }, { scale: 1, duration: D.base, immediateRender: false }, t)
      .to($('.mq-n i:first-child', c), { yPercent: -100, opacity: 0 }, t + 0.05)
      .to($('.mq-n i:last-child', c), { yPercent: 0, opacity: 1 }, t + 0.05);
    if (i < 5) tl.to($('.mq-ring', c), { opacity: 0, duration: D.slow, ease: 'power2.inOut' }, t + 0.55);
  };
  const travel = (i, t) => {
    const l = LEG[i];
    const dur = 0.5;
    tl.set(tok, { xPercent: l.a[0], yPercent: l.a[1] }, t)
      .to(tok, { autoAlpha: 1, duration: D.tap }, t)
      .to(tok, { xPercent: l.b[0], yPercent: l.b[1], duration: dur, ease: 'power1.inOut' }, t)
      .to(tok, { autoAlpha: 0, duration: D.tap }, t + dur - 0.06)
      .fromTo(seg[l.s], { [l.p]: l.f[0] }, { [l.p]: l.f[1], duration: dur, ease: 'power1.inOut', immediateRender: false }, t)
      .to($$('.mq-lbl')[i], { opacity: 1, duration: D.quick }, t);
  };

  const T = [0.55, 1.6, 2.65, 3.7, 4.75, 5.8];
  T.forEach((t, i) => {
    light(i, t);
    if (i < 5) travel(i, t + 0.5);
  });

  // o detalhe de cada etapa
  tl.to($('.mq-chip'), { autoAlpha: 1, scale: 1, ease: 'back.out(2)' }, T[0] + 0.05)
    .to($('.mq-field em'), { scale: 0.92, duration: D.tap, ease: 'power2.inOut', yoyo: true, repeat: 1 }, T[1])
    .to($('.mq-plus'), { autoAlpha: 1, scale: 1, ease: 'back.out(2)' }, T[2] + 0.1)
    .to($('.mq-ok'), { autoAlpha: 1, scale: 1, ease: 'back.out(2)' }, T[3] + 0.05)
    .to($('.mq-rcpt'), { yPercent: 0, duration: D.slow }, T[4])
    .to($('.mq-shackle'), { y: -2.4, duration: D.base, ease: 'back.out(2.5)' }, T[5] + 0.05)
    .set(seg, { scale: 1 }, T[5] + 0.2);

  return tl;
};
})();

/* ---- nerso.js ---- */
/* Cover — Nerso. Script clássico; só registra, não roda nada sozinho.
   A conversa rola de baixo para cima como um chat de verdade: cada passo
   desloca a lista até o item novo encostar no compositor. */
(function () {
'use strict';
window.SiteCovers = window.SiteCovers || {};

window.SiteCovers['nerso'] = function (el, gsap) {
  const $ = (s) => el.querySelector(s);
  const $$ = (s) => Array.prototype.slice.call(el.querySelectorAll(s));
  const D = { tap: 0.12, quick: 0.24, base: 0.48, slow: 0.9 };

  if (el._coverTl) el._coverTl.kill();
  const list = $('.nr-list');
  gsap.set(list, { clearProps: 'transform' });

  // quanto a lista precisa descer para que `item` fique no fim da conversa (em % da altura)
  const last = $('.nr-reply');
  const lr = list.getBoundingClientRect();
  const bottom = (n) => n.getBoundingClientRect().bottom;
  const shift = (n) => ((bottom(last) - bottom(n)) / lr.height) * 100;

  const user = $('.nr-out');
  const tool = $('.nr-tool');
  const hook = $('.nr-hook');
  const ask = $('.nr-ask');
  const kbd = $('.nr-kbd');
  const reply = last;
  const typing = $('.nr-typing');
  const dots = $$('.nr-typing i');
  const fill = $('.nr-fill');
  const val = $('.nr-val b');
  const pos = { user: shift(user), tool: shift(tool), hook: shift(hook), kbd: shift(kbd) };

  const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: D.base } });
  el._coverTl = tl;

  const pop = (n, at, from) => tl.fromTo(n,
    Object.assign({ autoAlpha: 0, y: 10, scale: 0.94 }, from),
    { autoAlpha: 1, x: 0, y: 0, scale: 1 }, at);
  const scroll = (to, at) => tl.to(list, { yPercent: to, duration: D.slow, ease: 'power2.inOut' }, at);

  // estado inicial: só o "hoje" e o cabeçalho
  tl.set(list, { yPercent: pos.user + 6 }, 0)
    .set([tool, hook, ask, kbd, reply], { autoAlpha: 0 }, 0)
    .set($('.nr-tick2'), { opacity: 0 }, 0)
    .set(fill, { clipPath: 'inset(0 100% 0 0)' }, 0)
    .set($('.nr-fillbar'), { scaleX: 0.75 }, 0)
    .set($('.nr-plus'), { autoAlpha: 0, scale: 0.6 }, 0)
    .set($('.nr-foot'), { autoAlpha: 0, y: 4 }, 0)
    .set([$('.nr-val s'), $('.nr-val svg')], { autoAlpha: 0, x: 6 }, 0);
  val.textContent = '0,6';

  // 1. a mensagem do usuário chega
  scroll(pos.user, 0.1);
  pop(user, 0.15, { x: 8 });
  tl.to($('.nr-tick2'), { opacity: 1, duration: D.quick }, 0.85);

  // 2. digitando…
  scroll(pos.tool, 0.95);
  tl.fromTo(typing, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: D.quick, transformOrigin: '0% 100%' }, 1.05)
    .fromTo(dots, { y: 0 }, { y: -3, duration: 0.28, ease: 'power2.inOut', stagger: 0.12, repeat: 3, yoyo: true }, 1.1)
    .to(typing, { autoAlpha: 0, duration: D.tap }, 2.0);

  // 3. ferramenta: consultando → consultado
  tl.fromTo(tool, { autoAlpha: 0, x: -6 }, { autoAlpha: 1, x: 0 }, 2.05)
    .set([$('.nr-busy'), $('.nr-spin')], { opacity: 1 }, 2.05)
    .set([$('.nr-done'), $('.nr-ok')], { opacity: 0 }, 2.05)
    .fromTo($('.nr-spin'), { rotation: 0 }, { rotation: 540, duration: 0.85, ease: 'none', transformOrigin: '50% 50%' }, 2.05)
    .to([$('.nr-busy'), $('.nr-spin')], { opacity: 0, duration: D.quick }, 2.85)
    .fromTo([$('.nr-done'), $('.nr-ok')], { opacity: 0 }, { opacity: 1, duration: D.quick }, 2.85);

  // 4. hook: a escrita para e pede confirmação
  scroll(pos.hook, 2.95);
  tl.fromTo(hook, { autoAlpha: 0, x: -6, scale: 0.96 }, { autoAlpha: 1, x: 0, scale: 1, transformOrigin: '0% 50%' }, 3.05);

  // 5. pergunta + botões; o dono toca em "Sim"
  scroll(pos.kbd, 3.45);
  pop(ask, 3.55);
  tl.fromTo(kbd, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0 }, 3.7)
    .to($('.nr-yes'), { scale: 0.94, duration: D.tap, ease: 'power2.inOut', yoyo: true, repeat: 1 }, 4.35)
    .to(fill, { clipPath: 'inset(0 0% 0 0)', duration: D.quick + 0.1, ease: 'power2.inOut' }, 4.4);

  // 6. resposta
  scroll(0, 4.7);
  pop(reply, 4.8);

  // 7. memória: mais uma ocorrência, a confiança sobe
  const c = { v: 0.6 };
  tl.to($('.nr-foot'), { autoAlpha: 1, y: 0, duration: D.base }, 5.0)
    .to($('.nr-plus'), { autoAlpha: 1, scale: 1, duration: D.base, ease: 'back.out(2)' }, 5.1)
    .to([$('.nr-val s'), $('.nr-val svg')], { autoAlpha: 1, x: 0, stagger: 0.05 }, 5.15)
    .to($('.nr-fillbar'), { scaleX: 1, duration: D.slow, ease: 'power2.inOut' }, 5.2)
    .to(c, {
      v: 0.8, duration: D.slow, ease: 'power2.inOut',
      onUpdate: () => { val.textContent = c.v.toFixed(1).replace('.', ','); },
    }, 5.2);

  return tl;
};
})();

/* ---- reels-pipeline.js ---- */
/* Cover — Reels Pipeline. Script clássico; só registra, não roda nada sozinho.
   A marcação acende, o fio leva ao Reel, o split se monta e a legenda entra
   palavra a palavra no ritmo do cursor da EDL. */
(function () {
'use strict';
window.SiteCovers = window.SiteCovers || {};

window.SiteCovers['reels-pipeline'] = function (el, gsap) {
  const $ = (s) => el.querySelector(s);
  const $$ = (s) => Array.prototype.slice.call(el.querySelectorAll(s));
  const D = { tap: 0.12, quick: 0.24, base: 0.48, slow: 0.9 };

  if (el._coverTl) el._coverTl.kill();

  const words = $$('.rp-w');
  const marks = $$('.rp-word');
  const lit = $$('.rp-w b');
  const cuts = $$('.rp-cut');
  const head = $('.rp-ph');
  const END = 72;                      // posição final do cursor (%)
  const T0 = 2.3, RUN = 3.0;           // o cursor anda de T0 a T0 + RUN
  const at = (p) => T0 + RUN * (p / END);
  const pct = (n) => parseFloat(n.style.getPropertyValue('--a'));

  const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: D.base } });
  el._coverTl = tl;

  // estado inicial
  tl.set($('.rp-hl'), { scaleX: 0, autoAlpha: 0 }, 0)
    .set($('.rp-wire'), { clipPath: 'inset(0 49% 0 51%)' }, 0)
    .set([$('.rp-dot-a'), $('.rp-dot-b')], { scale: 0, autoAlpha: 0 }, 0)
    .set($('.rp-scr'), { yPercent: -101 }, 0)
    .set($('.rp-bot > svg'), { yPercent: 101 }, 0)
    .set($('.rp-seam'), { scaleX: 0 }, 0)
    .set([$('.rp-badge'), $('.rp-fmt')], { autoAlpha: 0, scale: 0.8 }, 0)
    .set(words, { autoAlpha: 0, scale: 0.6 }, 0)
    .set(lit, { opacity: 0 }, 0)
    .set($('.rp-win'), { scale: 1 }, 0)
    .set($('.rp-rim'), { autoAlpha: 0 }, 0)
    .set($('.rp-out'), { autoAlpha: 0 }, 0)
    .set(head, { x: 0, xPercent: 0 }, 0)
    .set(cuts, { opacity: 0.3 }, 0)
    .set(marks, { opacity: 0.35 }, 0)
    .set($('.rp-key em'), { autoAlpha: 0, y: 3 }, 0);

  // 1. o roteiro aparece e a marcação acende
  tl.fromTo($$('.rp-lines li'), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, stagger: 0.05 }, 0.05)
    .to($('.rp-hl'), { scaleX: 1, autoAlpha: 1, duration: D.slow }, 0.6);

  // 2. o fio leva a marcação até o Reel
  tl.to($('.rp-dot-a'), { scale: 1, autoAlpha: 1, duration: D.quick, ease: 'back.out(2)' }, 1.0)
    .to($('.rp-wire'), { clipPath: 'inset(0 41.5% 0 51%)', duration: 0.5, ease: 'power2.inOut' }, 1.05)
    .to($('.rp-dot-b'), { scale: 1, autoAlpha: 1, duration: D.quick, ease: 'back.out(2)' }, 1.5)
    .set($('.rp-wire'), { clearProps: 'clipPath' }, 1.6);

  // 3. o split se monta
  tl.to($('.rp-scr'), { yPercent: 0, duration: D.slow }, 1.6)
    .to($('.rp-bot > svg'), { yPercent: 0, duration: D.slow }, 1.7)
    .to($('.rp-rim'), { autoAlpha: 0.5, duration: D.slow }, 2.2)
    .to($('.rp-seam'), { scaleX: 1, duration: D.base, ease: 'power2.inOut' }, 1.9)
    .to([$('.rp-fmt'), $('.rp-badge')], { autoAlpha: 1, scale: 1, stagger: 0.08, ease: 'back.out(2)' }, 2.05);

  // 4. o cursor da EDL anda; cortes piscam quando ele passa
  const clock = $('.rp-edl .rp-meta');
  const tc = { s: 0 };
  const fmt = (v) => '00:0' + v.toFixed(1) + ' / 00:10.0';
  clock.textContent = fmt(0);
  tl.fromTo($('.rp-prog i'), { scaleX: 0 }, { scaleX: END / 100, duration: RUN, ease: 'none', immediateRender: false }, T0)
    .set($('.rp-prog i'), { scaleX: 0 }, 0);
  tl.to(head, { xPercent: END, duration: RUN, ease: 'none' }, T0)
    .to(tc, { s: 7.2, duration: RUN, ease: 'none', onUpdate: () => { clock.textContent = fmt(tc.s); } }, T0);
  cuts.forEach((c) => {
    tl.to(c, { opacity: 1, duration: D.tap }, at(pct(c)))
      .fromTo(c, { scaleY: 1.8 }, { scaleY: 1, duration: D.base, immediateRender: false }, at(pct(c)));
  });
  tl.to($('.rp-out'), { autoAlpha: 1, duration: D.quick }, at(48));

  // 5. legenda no ritmo da fala: a palavra da vez fica na cor da vida
  words.forEach((w, i) => {
    const t = at(pct(marks[i]));
    tl.to(w, { autoAlpha: 1, scale: 1, duration: D.quick + 0.1, ease: 'back.out(3)' }, t)
      .to(lit[i], { opacity: 1, duration: D.tap }, t)
      .to(marks[i], { opacity: 1, duration: D.tap }, t);
    if (i > 0) tl.to(lit[i - 1], { opacity: 0, duration: D.quick }, t);
  });

  // 6. zoom@"limpa"
  tl.to($('.rp-win'), { scale: 1.12, duration: D.slow }, at(END))
    .to($('.rp-key em'), { autoAlpha: 1, y: 0, duration: D.base }, at(END));

  return tl;
};
})();
