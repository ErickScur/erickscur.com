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
