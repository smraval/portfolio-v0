/* Project pages: section rail (hairline + one travelling dot + every section title). Titles in the page stay. */
(function () {
  'use strict';
  var main = document.querySelector('main.project-page'), hero = main && main.querySelector('.project-hero');
  if (!main || !hero) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // collect sections in page order: [data-rail] containers and any .section-label not inside one
  var els = [].slice.call(main.querySelectorAll('[data-rail], .section-label'));
  var items = [];
  els.forEach(function (el) {
    var own = el.hasAttribute('data-rail');
    if (!own && el.closest('[data-rail]')) return;
    var title = own ? el.getAttribute('data-rail') : el.textContent.trim();
    if (!title) return;
    if (!el.id) el.id = 'sec-' + items.length;
    items.push({ el: el, title: title });
  });
  if (items.length < 2) return;

  var rail = document.createElement('div'); rail.className = 'pj-rail'; rail.setAttribute('role', 'navigation'); rail.setAttribute('aria-label', 'Sections');
  rail.innerHTML = '<div class="hl"></div><div class="dt"></div>' + items.map(function (it) {
    return '<a href="#' + it.el.id + '">' + it.title.replace(/</g, '&lt;') + '</a>';
  }).join('');
  rail.querySelector('.hl').style.height = ((items.length - 1) * 34) + 'px';
  document.body.appendChild(rail);
  var dot = rail.querySelector('.dt'), links = [].slice.call(rail.querySelectorAll('a'));

  function topOf(el) { return el.getBoundingClientRect().top + window.pageYOffset; }
  var ticking = false;
  function update() {
    ticking = false;
    var y = window.pageYOffset, H = window.innerHeight;
    // the rail only starts once the main image and the roles/timeline row are scrolled past
    var heroEnd = hero.getBoundingClientRect().bottom + y;
    var railBottom = 140 + items.length * 34, ft = document.querySelector('.site-footer');
    var pastHero = hero.getBoundingClientRect().bottom <= 130;
    var clearOfFooter = !ft || ft.getBoundingClientRect().top >= railBottom + 24;
    rail.classList.toggle('on', pastHero && clearOfFooter);
    var tops = items.map(function (it) { return topOf(it.el); });
    var ref = y + H * 0.4, i = 0, fr = 0, j;
    for (j = 0; j < tops.length; j++) if (ref >= tops[j]) i = j;
    if (ref < tops[0]) { i = 0; fr = 0; }
    else if (i < tops.length - 1) fr = Math.max(0, Math.min(1, (ref - tops[i]) / (tops[i + 1] - tops[i])));
    dot.style.transform = 'translateY(' + ((i + fr) * 34 + 12.5 - 4.5) + 'px)';
    links.forEach(function (a, k) { a.classList.toggle('a', k === i); });
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  window.addEventListener('load', req);
  links.forEach(function (a, k) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: topOf(items[k].el) - 110, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
  update();
})();
