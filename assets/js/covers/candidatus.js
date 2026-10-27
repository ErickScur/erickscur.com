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
