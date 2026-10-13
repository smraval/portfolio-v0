/* Load-in reveal: everything on screen rises in, staggered; the rest rises in as it is scrolled to.
   Selector list mirrors css/reveal.css. The home opening (record) finishes first. */
(function () {
  'use strict';
  var d = document.documentElement;
  var SEL = ".nav-logo, .nav-links > a, .pj-logo, .pj-links > a, .hero h1, .hero-statement, .hero-now, .about-photo, .about-copy > *, .experience h2, .exp-item, .free-time > .eyebrow, .pbtn, .project-page .pj-back, .project-page :is(h1,h2,h3,h4,p,li,figure,video,blockquote,img,.section-label,.meta-item,.prototype-button,.blue-prototype-button,.red-prototype-button), .site-footer .footer-brand, .site-footer .footer-local, .site-footer .footer-note, .site-footer .footer-email, .site-footer .footer-links a, .site-footer .footer-sig";
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var all = [].slice.call(document.querySelectorAll(SEL));
  // an element inside another animated element just rides along with it
  var els = all.filter(function (e) {
    var p = e.parentElement;
    while (p) { if (p.matches && p.matches(SEL)) { e.classList.add('rv-skip', 'rv-in'); return false; } p = p.parentElement; }
    return true;
  });
  window.__rvOK = true; d.classList.remove('rv-fail');

  function begin() {
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('rv-in'); }); return; }
    var vh = window.innerHeight, k = 0;
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('rv-in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    els.forEach(function (e) {
      var r = e.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) { e.style.setProperty('--rd', Math.min(0.7, k++ * 0.07).toFixed(2) + 's'); e.classList.add('rv-in'); }
      else io.observe(e);
    });
  }

  if (d.classList.contains('intro-on')) {
    var done = false, go = function () { if (!done) { done = true; begin(); } };
    document.addEventListener('sr-intro-open', go);
    setTimeout(go, 6500);
  } else begin();
})();
