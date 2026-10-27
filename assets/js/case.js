/* Estudos de caso: revelações, diagramas que se desenham, números que contam,
   pesos que crescem. Script clássico com defer, depois de main.js (que registra
   os plugins do GSAP e decide se há movimento). Sem JS ou com movimento
   reduzido, nada daqui roda e a página fica completa e estática. */
(function () {
  'use strict';
  var root = document.documentElement;
  var gsap = window.gsap, ST = window.ScrollTrigger, M = window.SiteMotion;
  if (!root.classList.contains('motion') || !gsap || !ST || !M) return;

  var q = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var vh = window.innerHeight;
  var below = function (el) { return el.getBoundingClientRect().top > vh * 0.92; };
  var once = function (el, start) { return { trigger: el, start: start || 'top 85%', once: true }; };

  /* ------------------------------------------------------- revelações */
  var rv = q('[data-rv]').filter(below);
  if (rv.length) {
    gsap.set(rv, { opacity: 0, y: M.SHIFT.m });
    ST.batch(rv, {
      start: 'top 88%', once: true,
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, y: 0, duration: M.DUR.slow, ease: M.EASE.publish, stagger: M.STAGGER, overwrite: true });
      },
    });
  }

  /* --------------------------------- ícones das decisões se desenham */
  q('.cz-dc').forEach(function (card) {
    if (!below(card)) return;
    var box = card.querySelector('.cz-dc-ico');
    var svg = box && box.querySelector('.ico');
    if (!svg) return;
    gsap.fromTo(svg, { strokeDasharray: 140, strokeDashoffset: 140 }, {
      strokeDashoffset: 0, duration: M.DUR.epic, ease: M.EASE.commit, delay: 0.15, scrollTrigger: once(card),
      onComplete: function () { svg.style.strokeDasharray = ''; svg.style.strokeDashoffset = ''; },
    });
    gsap.from(box, { scale: 0.6, rotate: -12, duration: M.DUR.slow, ease: 'back.out(2)', scrollTrigger: once(card) });
  });

  /* ------------------------------ diagramas: caixas e setas em ordem */
  q('[data-draw] .diagram').forEach(function (svg) {
    if (svg.getBoundingClientRect().top < vh * 0.85) return;
    var items = q(':scope > rect, :scope > text, :scope > circle, :scope > path', svg);
    var tl = gsap.timeline({ paused: true, defaults: { ease: M.EASE.publish } });
    var t = 0;
    items.forEach(function (el) {
      if (el.tagName.toLowerCase() === 'path') {
        var cls = el.getAttribute('class') || '';
        if (cls.indexOf('ln-soft') > -1 || !el.getTotalLength) {
          gsap.set(el, { opacity: 0 });
          tl.to(el, { opacity: 1, duration: 0.4 }, t);
        } else {
          var len = el.getTotalLength();
          gsap.set(el, { opacity: 0, strokeDasharray: len, strokeDashoffset: len });
          tl.set(el, { opacity: 1 }, t);
          tl.to(el, { strokeDashoffset: 0, duration: 0.45, ease: M.EASE.commit,
            onComplete: function () { el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; } }, t);
        }
        t += 0.05;
      } else {
        gsap.set(el, { opacity: 0 });
        tl.to(el, { opacity: 1, duration: 0.5 }, t);
        t += el.tagName.toLowerCase() === 'rect' ? 0.06 : 0.015;
      }
    });
    ST.create({ trigger: svg, start: 'top 80%', once: true, onEnter: function () { tl.play(); } });
  });

  /* -------------------------------------------------- números contam */
  q('.cz-n, .cz-stats b, .cz-meta-n').forEach(function (el) {
    var node = Array.prototype.find.call(el.childNodes, function (n) { return n.nodeType === 3 && /\d/.test(n.nodeValue); });
    if (!node) return;
    var txt = node.nodeValue;
    var m = txt.match(/(\d+(?:[.,]\d+)?)/);
    if (!m) return;
    var target = parseFloat(m[1].replace(',', '.'));
    var dec = (m[1].split(/[.,]/)[1] || '').length;
    var sep = m[1].indexOf(',') > -1 ? ',' : '.';
    var o = { v: 0 };
    var paint = function () { node.nodeValue = txt.replace(m[1], o.v.toFixed(dec).replace('.', sep)); };
    if (below(el)) paint();
    gsap.to(o, {
      v: target, duration: M.DUR.epic + 0.4, ease: 'power3.out', scrollTrigger: once(el, 'top 90%'),
      onUpdate: paint, onComplete: function () { node.nodeValue = txt; },
    });
  });

  /* ----------------------------------------------- pesos e rotinas */
  var bars = q('.cz-w-bar i');
  if (bars.length && below(bars[0])) {
    gsap.from(bars, { scaleX: 0, duration: M.DUR.epic, ease: M.EASE.publish, stagger: 0.09, scrollTrigger: once(bars[0].closest('ol'), 'top 80%') });
  }
  q('.cz-rt').forEach(function (it) {
    if (!below(it)) return;
    gsap.from(it.querySelector('.cz-rt-dot'), { scale: 0, duration: M.DUR.base, ease: 'back.out(3)', scrollTrigger: once(it, 'top 85%') });
  });
  q('.cz-gates li').forEach(function (li, i, all) {
    if (i === 0 && !below(li)) return;
    if (i === 0) gsap.from(all, { opacity: 0, x: -M.SHIFT.m, duration: M.DUR.slow, ease: M.EASE.publish, stagger: 0.07, scrollTrigger: once(li, 'top 90%') });
  });

  /* ------------------------------------- títulos palavra a palavra */
  var SplitText = window.SplitText;
  if (SplitText) {
    var heads = q('[data-split]').filter(below);
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
      heads.forEach(function (h) {
        var split = SplitText.create(h, { type: 'words,lines', mask: 'lines' });
        gsap.from(split.words, {
          yPercent: 110, duration: M.DUR.slow + 0.2, ease: M.EASE.publish, stagger: 0.045,
          scrollTrigger: once(h),
          onComplete: function () { split.revert(); },
        });
      });
      ST.refresh();
    });
  }
})();
