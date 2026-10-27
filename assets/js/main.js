/* Entrada de JS. O site funciona sem nada daqui: isto acrescenta tema manual,
   cabeçalho que some ao descer e o sistema de motion (motion.js).
   Script clássico com defer, carregado depois de motion.js. */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ---------------------------------------------------------------- tema */
  var LABEL = { light: 'claro', dark: 'escuro' };
  var toggle = document.querySelector('.theme-toggle');
  var current = function () {
    return root.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  };
  function paintToggle() {
    if (!toggle) return;
    toggle.setAttribute('aria-label', 'Mudar para o tema ' + LABEL[current() === 'dark' ? 'light' : 'dark']);
  }
  if (toggle) toggle.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('tema', next); } catch (e) { /* navegação privada */ }
    var paper = getComputedStyle(root).getPropertyValue('--paper').trim();
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.content = paper; });
    paintToggle();
  });
  paintToggle();

  /* ------------------------------------ cabeçalho: fio e some ao descer */
  var header = document.querySelector('.site-header');
  if (header) {
    var lastY = window.scrollY, ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        header.classList.toggle('is-stuck', y > 8);
        if (y > 400 && y > lastY + 4 && !header.contains(document.activeElement)) header.classList.add('is-hidden');
        else if (y < lastY - 4 || y <= 400) header.classList.remove('is-hidden');
        lastY = y; ticking = false;
      });
    }, { passive: true });
  }

  /* -------------------------------------------------------------- motion */
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger, M = window.SiteMotion;

  if (root.classList.contains('motion') && gsap && ScrollTrigger && M) {
    var plugins = [ScrollTrigger];
    if (window.SplitText) plugins.push(window.SplitText);
    gsap.registerPlugin.apply(gsap, plugins);
    root.classList.add('motion-ready');

    M.smoothScroll(gsap, ScrollTrigger, window.Lenis);
    M.heroParallax();
    M.marquee(gsap, ScrollTrigger);
    M.stackCards(gsap, ScrollTrigger);
    M.workGallery(gsap, ScrollTrigger);
    M.timeline(gsap, ScrollTrigger);
    M.counters(gsap);
    M.drawIcons(gsap);
    M.reveals(gsap, ScrollTrigger);
    // estudo de caso: a ilustração do topo toca ao carregar
    var top = document.querySelector('.case-cover .cover');
    if (top) M.playCover(top, gsap);
    // títulos depois das fontes, para as linhas quebrarem no lugar certo
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
      M.titles(gsap, ScrollTrigger, window.SplitText);
      ScrollTrigger.refresh();
    });
  } else {
    root.classList.add('motion-ready');
    root.classList.remove('motion');
  }
})();
