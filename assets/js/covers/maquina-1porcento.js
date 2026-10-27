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
