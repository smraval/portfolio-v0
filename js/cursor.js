/* Shared pink circle cursor (all pages) */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- circle cursor (#C9545C) ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !document.documentElement.classList.contains('vinyl')) {
    var cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.appendChild(document.createElement('i'));
    document.body.appendChild(cursor);

    var x = -100, y = -100, tx = -100, ty = -100, started = false;
    var ease = reduceMotion ? 1 : 0.22;

    var frame = function () {
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      cursor.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      requestAnimationFrame(frame);
    };

    window.addEventListener('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!started) {                     // hide the system cursor only once ours is alive
        started = true;
        x = tx; y = ty;
        document.documentElement.classList.add('has-cursor');
        cursor.classList.add('is-visible');
        frame();
      }
    }, { passive: true });

    var LINKS = 'a[href], button, label[for], summary, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"]), .sig';
    document.addEventListener('mouseover', function (e) {
      cursor.classList.toggle('is-link', !!(e.target.closest && e.target.closest(LINKS)));
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', function () { cursor.classList.remove('is-visible'); });
    document.documentElement.addEventListener('mouseenter', function () { if (started) cursor.classList.add('is-visible'); });
  }

})();
