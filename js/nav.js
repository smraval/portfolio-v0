/* "work" in the nav: on the home page it scrolls to the projects without touching the URL;
   from any other page it returns home and lands on the projects section (no #hash in the URL). */
(function () {
  var KEY = 'sr-work';
  var path = location.pathname.replace(/index\.html$/, '');
  var isHome = path === '/' || path === '';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function toWork(smooth) {
    var w = document.getElementById('work');
    if (w) w.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' });
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href="/#work"], a[href="#work"]');
    if (!a || a.classList.contains('skip')) return;
    e.preventDefault();
    if (isHome) { toWork(true); return; }
    try { sessionStorage.setItem(KEY, '1'); } catch (_) {}
    location.assign('/');
  });

  /* home: the dot sits under "home" at the top and moves to "work" once the projects are in view */
  if (isHome) {
    var homeLink = document.querySelector('.nav-links a[data-home]'), workLink = document.querySelector('.nav-links a[data-work]');
    var spy = function () {
      var w = document.getElementById('work');
      if (!w || !homeLink || !workLink) return;
      var onWork = w.getBoundingClientRect().top < window.innerHeight * 0.45;
      workLink.classList.toggle('is-active', onWork);
      homeLink.classList.toggle('is-active', !onWork);
      if (onWork) { homeLink.removeAttribute('aria-current'); workLink.setAttribute('aria-current', 'location'); }
      else { workLink.removeAttribute('aria-current'); homeLink.setAttribute('aria-current', 'page'); }
    };
    window.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('resize', spy);
    spy();
  }

  if (isHome) {
    var flagged = false;
    try { flagged = sessionStorage.getItem(KEY) === '1'; } catch (_) {}
    if (flagged) {
      try { sessionStorage.removeItem(KEY); } catch (_) {}
      var go = function () { toWork(false); };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
      window.addEventListener('load', go);
    }
  }
})();

/* home: frosted background behind the pinned nav once the work section reaches it */
(function () {
  var nav = document.querySelector('.hero > .nav');
  if (!nav) return;
  var work = document.getElementById('work');
  // stays clear over the header; the frosted bar only fills in once the projects reach the nav
  var set = function () {
    var on = work ? work.getBoundingClientRect().top <= nav.offsetHeight : (window.pageYOffset > 8);
    nav.classList.toggle('is-stuck', on);
    nav.classList.toggle('is-scrolled', !on && (window.pageYOffset || document.documentElement.scrollTop) > 8);
  };
  window.addEventListener('resize', set);
  window.addEventListener('scroll', set, { passive: true });
  set();
})();
