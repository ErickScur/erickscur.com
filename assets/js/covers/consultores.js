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
