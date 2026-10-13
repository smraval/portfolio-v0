/* Home: the staff under the name (whole staff strums where the cursor crosses a line),
   floating notes, strum hint, and the opening sequence. */
(function () {
  'use strict';
  var root = document.documentElement, hero = document.querySelector('.hero'), h1 = hero && hero.querySelector('h1');
  if (!hero || !h1) { root.classList.remove('intro-on'); return; }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  /* Placeholder tune: scale degrees (0 = bottom line). Replace with the real notes. */
  var TUNE = [2, 4, 5, 7, 5, 4, 2, 0, 2, 4, 5, 4, 2, 1, 2, 4, 7, 9, 7, 5, 4, 2];
  var GLYPHS = ['♪', '♩', '♫'];

  var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'staff-svg'); svg.setAttribute('aria-hidden', 'true');
  var notes = document.createElement('div'); notes.className = 'staff-notes'; notes.setAttribute('aria-hidden', 'true');
  var hint = document.createElement('div'); hint.className = 'staff-hint'; hint.setAttribute('aria-hidden', 'true'); hint.textContent = 'strum the staff ♪';
  hero.insertBefore(svg, hero.firstChild); hero.insertBefore(notes, svg.nextSibling); hero.appendChild(hint);

  var lastSpawn = 0, paths = [], st = [], ys = [], N = 100, W = 1280, sp = 30, bottom = 0, tune = 0;
  var s = { on: false, x: -999, y: -999, tx: -999, ty: -999, last: -1, ready: false, act: 0 };

  function geometry() {
    var hr = hero.getBoundingClientRect(); W = hr.width;
    var probe = document.createElement('span'); probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    h1.appendChild(probe);
    var base = probe.getBoundingClientRect().top - hr.top; h1.removeChild(probe);
    var fs = parseFloat(getComputedStyle(h1).fontSize);
    sp = fs * 0.234; bottom = base + fs * 0.19;
    ys = [0, 1, 2, 3, 4, 5].map(function (i) { return bottom - (5 - i) * sp; }); /* six strings */
    N = Math.max(40, Math.round(W / 11.6));
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + hr.height);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    paths = ys.map(function () {
      var p = document.createElementNS(NS, 'path'); p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#C9545C');
      p.setAttribute('stroke-opacity', '.5'); p.setAttribute('stroke-width', '1.5'); svg.appendChild(p); return p;
    });
    st = ys.map(function () { return { y: new Float32Array(N + 1), v: new Float32Array(N + 1) }; });
    hint.style.top = Math.max(8, ys[0] - 40) + 'px';
    draw(true);
  }

  function gau(d, w) { return Math.exp(-(d * d) / (2 * w * w)); }
  var running = false, raf = 0;
  function wake() { if (!running) { running = true; raf = requestAnimationFrame(loop); } }

  function draw(force) {
    var energy = 0, i, li;
    // the lines only lean toward the cursor while it is on or near the staff; past that they settle
    var dist = s.on ? Math.max(ys[0] - s.y, s.y - ys[5], 0) : 1e9;
    var pull = Math.max(0, 1 - dist / (sp * 2)), damp = pull > 0 ? 0.985 : 0.93;
    for (li = 0; li < ys.length; li++) {
      var q = st[li];
      if (!force) {
        for (i = 1; i < N; i++) { var a = (q.y[i - 1] + q.y[i + 1] - 2 * q.y[i]) * 0.42 - q.y[i] * 0.012; q.v[i] = (q.v[i] + a) * damp; }
        for (i = 1; i < N; i++) { q.y[i] += q.v[i]; energy += Math.abs(q.v[i]) + Math.abs(q.y[i]); }
      }
      var d = 'M0 ' + ys[li].toFixed(1);
      for (i = 1; i <= N; i++) {
        var x = i / N * W, l = pull ? -gau(x - s.x, 90) * (ys[li] - s.y) * 0.08 * pull : 0;
        d += ' L' + x.toFixed(1) + ' ' + (ys[li] + (i < N ? q.y[i] : 0) + l).toFixed(1);
      }
      paths[li].setAttribute('d', d);
    }
    return energy;
  }

  function spawn(x) {
    if (reduce) return;
    var p = TUNE[tune++ % TUNE.length], y = bottom + sp / 2 - p * sp / 2;
    var n = document.createElement('div'); n.className = 'staff-gl'; n.textContent = GLYPHS[tune % 3];
    n.style.left = x + 'px'; n.style.top = y + 'px'; notes.appendChild(n);
    var jx = Math.max(40, W * 0.06) * (0.7 + Math.random() * 0.6), jy = -sp * 3 * (0.8 + Math.random() * 0.4);
    var a = n.animate([
      { opacity: 0, transform: 'translate(-50%,-50%) scale(.5)' },
      { opacity: .85, transform: 'translate(-50%,-50%) scale(1)', offset: .12 },
      { opacity: .6, offset: .6 },
      { opacity: 0, transform: 'translate(calc(-50% + ' + jx + 'px),calc(-50% + ' + jy + 'px)) scale(1.15) rotate(12deg)' }
    ], { duration: 2800, easing: 'cubic-bezier(.25,.5,.3,1)' });
    a.onfinish = function () { n.remove(); }; a.finished.catch(function () {});
  }

  function loop() {
    if (s.on) { s.x += (s.tx - s.x) * 0.3; s.y += (s.ty - s.y) * 0.3; }
    if (s.ready && s.on && s.last >= 0) {
      ys.forEach(function (ly, li) {
        if ((s.last - ly) * (s.y - ly) < 0) {
          s.act = performance.now();
          var j = Math.round(s.x / W * N), sg = (s.y - s.last) > 0 ? 1 : -1;
          for (var n = -8; n <= 8; n++) { var q = j + n; if (q > 0 && q < N) st[li].v[q] += sg * (3.2 - Math.abs(n) * 0.2); }
          if (performance.now() - lastSpawn > 260) { lastSpawn = performance.now(); spawn(s.x); }
        }
      });
    }
    s.last = s.on ? s.y : -1;
    var e = draw(false);
    hint.style.opacity = (s.ready && fine && performance.now() - s.act > 2500) ? 0.7 : 0;
    if (!s.on && e < 0.02 && !(s.ready && fine)) { running = false; return; }
    raf = requestAnimationFrame(loop);
  }

  function point(cx, cy) {
    var r = hero.getBoundingClientRect();
    var x = cx - r.left, y = cy - r.top;
    if (!s.on) { s.x = x; s.y = y; }
    s.on = true; s.tx = x; s.ty = y; wake();
  }
  window.addEventListener('mousemove', function (e) { point(e.clientX, e.clientY); }, { passive: true });
  window.addEventListener('scroll', function () { if (s.on) wake(); }, { passive: true });
  root.addEventListener('mouseleave', function () { s.on = false; });
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(geometry, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(geometry);
  geometry();
  h1.addEventListener('animationend', geometry);

  /* ---------- opening ---------- */
  var intro = document.querySelector('.intro');
  function finish() { root.classList.remove('intro-on'); s.ready = true; s.act = performance.now(); if (window.Vinyl) window.Vinyl.show(); wake(); }
  if (!root.classList.contains('intro-on') || !intro || reduce) {
    root.classList.remove('intro-on');
    s.ready = true; s.act = performance.now(); setTimeout(function () { svg.classList.add('drawn'); }, 350); if (window.Vinyl) window.Vinyl.show(); wake(); return;
  }
  var rec = intro.querySelector('.intro-rec'), disc = intro.querySelector('.intro-disc'), ind = intro.querySelector('.intro-ind');
  var bar = ind.querySelector('.bar i');
  var spin = 0, spd = 6, spinning = true;
  (function spinLoop() { if (!spinning) return; spin += spd; disc.style.transform = 'rotate(' + spin + 'deg)'; requestAnimationFrame(spinLoop); })();
  var t0 = performance.now();
  bar.animate([{ width: '0%' }, { width: '100%' }], { duration: 1500, easing: 'cubic-bezier(.4,.1,.3,1)', fill: 'forwards' });
  setTimeout(function () { spd = 1.5; }, 1300);

  var loaded = document.readyState === 'complete', go = false;
  if (!loaded) window.addEventListener('load', function () { loaded = true; });
  var wait = setInterval(function () {
    var el = performance.now() - t0;
    if (el >= 1500 && (loaded || el >= 3500)) { clearInterval(wait); open(); }
  }, 60);

  function open() {
    var rr = rec.getBoundingClientRect(), sx = rr.left + 100, sy = rr.top + 100;
    // lift the record out so it can fly over the page while the white cover fades
    var ghost = document.createElement('div'); ghost.className = 'intro-ghost';
    ghost.innerHTML = '<div class="intro-disc"><i></i></div>'; document.body.appendChild(ghost);
    var gd = ghost.firstChild;
    rec.style.visibility = 'hidden';
    ind.style.opacity = 0;
    intro.style.transition = 'opacity .7s ease'; intro.style.opacity = 0;
    svg.style.transition = 'opacity .7s ease .3s'; svg.style.opacity = 1; setTimeout(function () { svg.classList.add('drawn'); }, 500);
    document.dispatchEvent(new Event('sr-intro-open'));
    root.classList.remove('intro-on'); // releases scroll lock; cover stays until faded
    intro.classList.add('is-out'); intro.style.pointerEvents = 'none'; intro.style.animation = 'none';
    var V = window.Vinyl, canFly = fine && V && V.moved, T = 900, f0 = performance.now(), ang = spin;
    function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function step() {
      var t = Math.min(1, (performance.now() - f0) / T), e = ease(t);
      ang += 1.5;
      var tx = V && V.moved ? V.tx : sx, ty = V && V.moved ? V.ty : sy;
      var x, y, sc;
      if (canFly) { x = sx + (tx - sx) * e; y = sy + (ty - sy) * e; sc = 1 + (0.19 - 1) * e; }
      else { x = sx; y = sy; sc = 1 - 0.4 * e; ghost.style.opacity = 1 - e; }
      ghost.style.transform = 'translate3d(' + (x - 100) + 'px,' + (y - 100) + 'px,0) scale(' + sc + ')';
      gd.style.transform = 'rotate(' + ang + 'deg)';
      if (t < 1) requestAnimationFrame(step);
      else {
        ghost.remove(); spinning = false; intro.remove();
        if (canFly) { V.place(tx, ty); point(tx, ty); }
        finish();
      }
    }
    requestAnimationFrame(step);
  }
})();
