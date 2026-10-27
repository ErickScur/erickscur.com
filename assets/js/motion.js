/* ==========================================================================
   Sistema de motion — erickscur.com.br (v2)

   Momentos assinatura:
     1. Hero      — nome sobe da linha de base, as três camadas de cor e a foto
                    entram (CSS puro, primeiro paint) e reagem ao mouse.
     2. Três vidas — cartões de cor empilham no scroll; o de baixo recua.
     3. Projetos  — galeria pinada com scroll horizontal; cada ilustração
                    toca a sua animação quando entra.
     4. Carreira  — linha vertical que se desenha, o ano rola como odômetro,
                    cada passo acende na cor da sua frente.
   O resto: títulos palavra a palavra, números que contam, revelações curtas.

   Só transform e opacity (exceções pontuais: clip-path de revelação e
   stroke-dashoffset dos ícones). Tokens equivalentes em CSS: --dur-*, --ease-*.
   Script clássico (não módulo): funciona também abrindo o arquivo direto.
   Expõe window.SiteMotion.
   ========================================================================== */
(function () {
  'use strict';

  var DUR = { tap: 0.12, quick: 0.24, base: 0.48, slow: 0.9, epic: 1.4 };
  var EASE = {
    publish: 'expo.out',     // ≈ cubic-bezier(0.16, 1, 0.3, 1): coisa chegando
    commit: 'power2.inOut',  // ≈ cubic-bezier(0.65, 0, 0.35, 1): estado mudando
    ack: 'power3.out',       // resposta a input
    stream: 'none',          // linear: tempo passando
  };
  var SHIFT = { s: 8, m: 24, l: 48 };
  var STAGGER = 0.06;

  var q = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ------------------------------------------------ hero: mouse e palco */
  function heroParallax() {
    var stage = document.querySelector('.stage');
    if (!stage || !window.matchMedia('(pointer: fine)').matches) return;
    var hero = document.querySelector('.hero');
    var raf = 0;
    hero.addEventListener('pointermove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        stage.style.setProperty('--px', (x * 1.4).toFixed(3));
        stage.style.setProperty('--py', (y * 1.4).toFixed(3));
        raf = 0;
      });
    });
    hero.addEventListener('pointerleave', function () {
      stage.style.setProperty('--px', 0); stage.style.setProperty('--py', 0);
    });
  }

  /* marquee: acelera com a velocidade do scroll */
  function marquee(gsap, ScrollTrigger) {
    var track = document.querySelector('.marquee-track');
    if (!track || !track.getAnimations) return;
    var anim = track.getAnimations()[0];
    if (!anim) return;
    var state = { rate: 1 };
    ScrollTrigger.create({
      trigger: document.body, start: 0, end: 'max',
      onUpdate: function (self) {
        state.rate = 1 + Math.min(Math.abs(self.getVelocity()) / 500, 5);
        anim.playbackRate = state.rate;
        gsap.to(state, { rate: 1, duration: 0.9, ease: EASE.ack, overwrite: true, onUpdate: function () { anim.playbackRate = state.rate; } });
      },
    });
  }

  /* -------------------------------------------- títulos palavra a palavra */
  function titles(gsap, ScrollTrigger, SplitText) {
    if (!SplitText) return;
    q('.sec-head h2, .method-aside h2, .contact h2').forEach(function (h) {
      if (h.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      var split = SplitText.create(h, { type: 'words,lines', mask: 'lines' });
      gsap.from(split.words, {
        yPercent: 110, duration: DUR.slow + 0.2, ease: EASE.publish, stagger: 0.045,
        scrollTrigger: { trigger: h, start: 'top 85%', once: true },
        onComplete: function () { split.revert(); },
      });
    });
  }

  /* ------------------------------------------------- revelações curtas */
  function reveals(gsap, ScrollTrigger) {
    var targets = q([
      '.sec-head .kicker', '.sec-head p', '.method-aside p', '.claude-badge',
      '.rule', '.route', '.socials li', '.mail-big', '.contact-photo', '.work-foot',
      '.case-thesis > *', '.chapter', '.decision', '.number', '.next',
    ].join(','));
    var below = targets.filter(function (el) { return el.getBoundingClientRect().top > window.innerHeight * 0.92; });
    gsap.set(below, { opacity: 0, y: SHIFT.m });
    ScrollTrigger.batch(below, {
      start: 'top 88%', once: true,
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, y: 0, duration: DUR.slow, ease: EASE.publish, stagger: STAGGER, overwrite: true });
      },
    });
  }

  /* ícones de traço que se desenham (o stroke-dash herda para dentro do <use>) */
  function drawIcons(gsap) {
    q('.rule-ico .ico, .route .ico').forEach(function (svg) {
      if (svg.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      gsap.fromTo(svg, { strokeDasharray: 140, strokeDashoffset: 140 }, {
        strokeDashoffset: 0, duration: DUR.epic, ease: EASE.commit,
        scrollTrigger: { trigger: svg, start: 'top 85%', once: true },
        onComplete: function () { svg.style.strokeDasharray = ''; svg.style.strokeDashoffset = ''; },
      });
      var box = svg.closest('.rule-ico');
      if (box) gsap.from(box, { scale: 0.6, rotate: -12, duration: DUR.slow, ease: 'back.out(2)', scrollTrigger: { trigger: box, start: 'top 85%', once: true } });
    });
  }

  /* números que contam até o valor (o texto original volta no fim) */
  function counters(gsap) {
    q('.life-num, .life-stats b').forEach(function (el) {
      var node = Array.prototype.find.call(el.childNodes, function (n) { return n.nodeType === 3 && /\d/.test(n.nodeValue); });
      if (!node) return;
      var txt = node.nodeValue;
      var m = txt.match(/(\d+(?:[.,]\d+)?)/);
      if (!m) return;
      var target = parseFloat(m[1].replace(',', '.'));
      var dec = (m[1].split(/[.,]/)[1] || '').length;
      var sep = m[1].indexOf(',') > -1 ? ',' : '.';
      var o = { v: 0 };
      gsap.to(o, {
        v: target, duration: DUR.epic + 0.4, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: function () { node.nodeValue = txt.replace(m[1], o.v.toFixed(dec).replace('.', sep)); },
        onComplete: function () { node.nodeValue = txt; },
      });
    });
  }

  /* ---------------------------------------------- três vidas: empilhar */
  function stackCards(gsap, ScrollTrigger) {
    var cards = q('.life');
    if (!cards.length) return;
    ScrollTrigger.matchMedia({
      '(min-width: 64em)': function () {
        cards.forEach(function (card, i) {
          var next = cards[i + 1];
          if (!next) return;
          gsap.to(card, { scale: 0.93, ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true } });
          gsap.to(card.querySelector('.shade'), { opacity: 0.15, ease: 'none', scrollTrigger: { trigger: next, start: 'top 70%', end: 'top 20%', scrub: true } });
        });
      },
    });
    cards.forEach(function (card) {
      gsap.from(q('.life-main > *, .life-side > *, .life-logos li', card), {
        y: SHIFT.l, opacity: 0, duration: DUR.slow, ease: EASE.publish, stagger: 0.05,
        scrollTrigger: { trigger: card, start: 'top 75%', once: true },
      });
      var art = card.querySelector('.life-art');
      if (art) gsap.fromTo(art, { rotate: -20, scale: 0.8 }, { rotate: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* ------------------------------------------ ilustrações dos projetos */
  function playCover(el, gsap) {
    if (!el || el.dataset.played) return;
    var slug = (el.className.match(/cover--([\w-]+)/) || [])[1];
    var fn = slug && window.SiteCovers && window.SiteCovers[slug];
    el.dataset.played = '1';
    if (typeof fn === 'function') { try { fn(el, gsap); } catch (e) { /* fica a versão estática */ } }
  }

  /* ------------------------------------- projetos: galeria horizontal */
  function workGallery(gsap, ScrollTrigger) {
    var pin = document.querySelector('.work-pin');
    if (!pin) return;
    var track = pin.querySelector('.work-track');
    var bar = pin.querySelector('.work-progress i');
    var panels = q('.proj', track);

    ScrollTrigger.matchMedia({
      '(min-width: 64em)': function () {
        var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
        var tween = gsap.to(track, {
          x: function () { return -dist(); }, ease: 'none',
          scrollTrigger: { trigger: pin, start: 'top top', end: function () { return '+=' + dist() * 0.65; }, pin: true, scrub: 0.45, invalidateOnRefresh: true, anticipatePin: 1 },
        });
        if (bar) gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: function () { return '+=' + dist() * 0.65; }, scrub: true } });
        panels.forEach(function (p, i) {
          var cov = p.querySelector('.cover');
          var st = i === 0 ? { trigger: pin, start: 'top 60%', once: true } : { trigger: p, containerAnimation: tween, start: 'left 70%', once: true };
          ScrollTrigger.create(Object.assign({}, st, { onEnter: function () { playCover(cov, gsap); } }));
          gsap.from(p.querySelector('.proj-info'), { opacity: 0, x: SHIFT.l, duration: DUR.slow, ease: EASE.publish, scrollTrigger: st });
        });
      },
      '(max-width: 63.99em)': function () {
        panels.forEach(function (p) {
          ScrollTrigger.create({ trigger: p, start: 'top 75%', once: true, onEnter: function () { playCover(p.querySelector('.cover'), gsap); } });
        });
      },
    });
  }

  /* ----------------------------------------------- carreira: odômetro */
  function buildYear(el, value) {
    el.textContent = '';
    String(value).split('').forEach(function () {
      var d = document.createElement('span'); d.className = 'digit';
      var s = document.createElement('span'); s.className = 'strip';
      for (var n = 0; n <= 9; n++) { var k = document.createElement('span'); k.textContent = n; s.appendChild(k); }
      d.appendChild(s); el.appendChild(d);
    });
  }
  function setYear(gsap, el, value, instant) {
    var strips = q('.strip', el);
    String(value).split('').forEach(function (ch, i) {
      var to = -parseInt(ch, 10) * 10;
      if (instant) gsap.set(strips[i], { yPercent: to });
      else gsap.to(strips[i], { yPercent: to, duration: DUR.slow, ease: 'expo.inOut', delay: i * 0.04, overwrite: true });
    });
  }

  function timeline(gsap, ScrollTrigger) {
    var list = document.querySelector('.tl-list');
    if (!list) return;
    var items = q('.tl-item', list);
    var yearEl = document.querySelector('.tl-year');
    var now = document.querySelector('.tl-now');
    var swatch = now && now.querySelector('.swatch');
    var laneName = now && now.querySelector('.lane-name');
    var names = { eng: 'engenharia', cont: 'conteúdo', sh: 'software house', edu: 'formação' };
    var lanes = { eng: '--eng', cont: '--cont', sh: '--sh', edu: '--ink' };

    if (yearEl && items.length) { buildYear(yearEl, items[0].dataset.year); setYear(gsap, yearEl, items[0].dataset.year, true); }

    var fill = list.querySelector('.tl-spine i');
    if (fill) gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 60%', end: 'bottom 60%', scrub: true } });

    var current = -1;
    var activate = function (i) {
      if (i === current) return;
      current = i;
      items.forEach(function (x, k) { x.classList.toggle('is-on', k <= i); });
      if (i < 0) return;
      var it = items[i];
      if (yearEl) setYear(gsap, yearEl, it.dataset.year);
      if (swatch) swatch.style.background = 'var(' + lanes[it.dataset.lane] + ')';
      if (laneName) laneName.textContent = names[it.dataset.lane] + ' · ' + it.querySelector('.tl-where').textContent;
    };

    items.forEach(function (it, i) {
      ScrollTrigger.create({
        trigger: it, start: 'top 60%',
        onEnter: function () { activate(i); },
        onLeaveBack: function () { activate(i - 1); },
      });
      var card = it.querySelector('.tl-card');
      gsap.fromTo(card, { clipPath: 'inset(0% 100% 0% 0% round 24px)', x: SHIFT.l }, {
        clipPath: 'inset(0% 0% 0% 0% round 24px)', x: 0, duration: DUR.slow + 0.2, ease: EASE.publish,
        scrollTrigger: { trigger: it, start: 'top 85%', once: true },
        onComplete: function () { card.style.clipPath = ''; },
      });
      gsap.from(it.querySelector('.tl-dot'), { scale: 0, duration: DUR.base, ease: 'back.out(3)', scrollTrigger: { trigger: it, start: 'top 85%', once: true } });
    });
  }

  /* ------------------------------------------------------ scroll suave */
  function smoothScroll(gsap, ScrollTrigger, Lenis) {
    if (!Lenis || !window.matchMedia('(pointer: fine)').matches) return null;
    var lenis = new Lenis({ lerp: 0.11, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    var OFFSET = -72;
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href*="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      var url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash || url.hash === '#') return;
      var el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      var go = function (immediate) {
        var y = el.getBoundingClientRect().top + window.scrollY + OFFSET;
        lenis.scrollTo(y, { immediate: !!immediate, lock: true, duration: 1.2, onComplete: function () {
          // o pin muda as posições no caminho: corrige se chegou fora do lugar
          if (!immediate && Math.abs(el.getBoundingClientRect().top + OFFSET) > 6) go(true);
        } });
      };
      go(false);
      history.pushState(null, '', url.hash);
      if (el.matches('main, section, [tabindex]')) el.focus({ preventScroll: true });
    });
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    return lenis;
  }

  window.SiteMotion = {
    DUR: DUR, EASE: EASE, SHIFT: SHIFT, STAGGER: STAGGER,
    heroParallax: heroParallax, marquee: marquee, titles: titles, reveals: reveals, drawIcons: drawIcons,
    counters: counters, stackCards: stackCards, workGallery: workGallery, timeline: timeline,
    playCover: playCover, smoothScroll: smoothScroll,
  };
})();
