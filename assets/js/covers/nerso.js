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
