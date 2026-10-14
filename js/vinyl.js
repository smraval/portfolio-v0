/* Record cursor shared by home and about. Exposes window.Vinyl for the home intro. */
(function () {
  'use strict';
  var root = document.documentElement;
  if (!root.classList.contains('vinyl')) return;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var vc = document.createElement('div');
  vc.className = 'vc'; vc.setAttribute('aria-hidden', 'true');
  vc.innerHTML = '<div class="vc-disc"><i></i></div>';
  var tag = document.createElement('div');
  tag.className = 'vtag'; tag.setAttribute('aria-hidden', 'true');
  document.body.appendChild(vc); document.body.appendChild(tag);
  var disc = vc.firstChild;

  var V = window.Vinyl = { x: -100, y: -100, tx: -100, ty: -100, moved: false, held: root.classList.contains('intro-on'), hov: null };
  var angle = 0, running = false, lastMove = 0, tagW = 160;
  function frame() {
    V.x += (V.tx - V.x) * (reduce ? 1 : 0.42);
    V.y += (V.ty - V.y) * (reduce ? 1 : 0.42);
    var moving = performance.now() - lastMove < 150;
    angle += reduce ? 0 : (moving ? 4.5 : 1.5);
    vc.style.transform = 'translate3d(' + (V.x - 15) + 'px,' + (V.y - 15) + 'px,0)';
    disc.style.transform = 'rotate(' + angle + 'deg)';
    var tx = V.x + 22; if (tx + tagW > window.innerWidth - 8) tx = V.x - 22 - tagW;
    tag.style.transform = 'translate3d(' + tx + 'px,' + (V.y - 14) + 'px,0)';
    requestAnimationFrame(frame);
  }
  V.show = function () {
    V.held = false;
    if (V.moved) { vc.classList.add('is-visible'); root.classList.add('has-cursor'); }
    if (!running) { running = true; frame(); }
    syncTag();
  };
  V.place = function (x, y) { V.x = V.tx = x; V.y = V.ty = y; };

  function syncTag() {
    if (V.hov && !V.held) {
      var t = V.hov.querySelector('.tile-title');
      tag.textContent = V.hov.getAttribute('data-tag') || ('now playing: ' + (t ? t.textContent.trim() : ''));
      tagW = tag.offsetWidth || 160;
      tag.classList.add('is-visible');
    } else tag.classList.remove('is-visible');
  }

  window.addEventListener('mousemove', function (e) {
    V.tx = e.clientX; V.ty = e.clientY; lastMove = performance.now();
    if (!V.moved) {
      V.moved = true; V.x = V.tx; V.y = V.ty;
      if (!V.held) { root.classList.add('has-cursor'); vc.classList.add('is-visible'); }
      if (!running) { running = true; frame(); }
    }
  }, { passive: true });

  function learn(e) {
    if (V.moved || typeof e.clientX !== 'number') return;
    V.moved = true; V.x = V.tx = e.clientX; V.y = V.ty = e.clientY; lastMove = performance.now();
    if (!V.held) { root.classList.add('has-cursor'); vc.classList.add('is-visible'); }
    if (!running) { running = true; frame(); }
  }
  document.addEventListener('pointerover', learn, { passive: true, capture: true });
  document.addEventListener('pointerdown', learn, { passive: true, capture: true });

  document.addEventListener('mouseover', function (e) {
    var t = e.target.closest && e.target.closest('.tile');
    if (t !== V.hov) { V.hov = t; syncTag(); }
  }, { passive: true });

  root.addEventListener('mouseleave', function () { vc.classList.remove('is-visible'); tag.classList.remove('is-visible'); });
  root.addEventListener('mouseenter', function () { if (V.moved && !V.held) { vc.classList.add('is-visible'); syncTag(); } });
})();
