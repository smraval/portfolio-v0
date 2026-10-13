/* Home page behaviour: circle cursor, live San Diego clock, tile reveal. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- live clock in San Diego ---------- */
  var clock = document.querySelector('[data-clock]');
  if (clock && window.Intl && Intl.DateTimeFormat) {
    var tz = 'America/Los_Angeles';
    var fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz });
    var fmtH = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', timeZone: tz });
    var moon = document.querySelector('[data-icon="moon"]');
    var sun = document.querySelector('[data-icon="sun"]');
    var tick = function () {
      var now = new Date();
      clock.textContent = fmt.format(now);
      var h = parseInt(fmtH.format(now), 10);
      var night = h < 6 || h >= 18;
      if (moon) moon.toggleAttribute('hidden', !night);
      if (sun) sun.toggleAttribute('hidden', night);
    };
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- tile reveal on scroll ---------- */
  var tiles = document.querySelectorAll('.tile');
  function startTiles() {
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.style.setProperty('--d', '0s'); en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0 });
    tiles.forEach(function (t) { io.observe(t); });
    // anything already (even partly) on screen when the page loads should not wait for a scroll
    var revealOnScreen = function () {
      tiles.forEach(function (t) {
        if (t.getBoundingClientRect().top < window.innerHeight - 24) { t.classList.add('is-in'); io.unobserve(t); }
      });
    };
    revealOnScreen();
    window.addEventListener('load', revealOnScreen);
    window.addEventListener('resize', revealOnScreen);
  } else {
    tiles.forEach(function (t) { t.classList.add('is-in'); });
  }
  }
  // on the home page the tiles wait for the opening to finish so their rise-in is actually seen
  if (document.documentElement.classList.contains('intro-on')) {
    var started = false, begin = function () { if (!started) { started = true; startTiles(); } };
    document.addEventListener('sr-intro-open', begin);
    setTimeout(begin, 6500);
  } else startTiles();

  /* ---------- tile animations loop continuously ---------- */
  if (!reduceMotion) {
    document.querySelectorAll('.tile video').forEach(function (v) {
      v.loop = true; v.muted = true;
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    });
  }

  /* ---------- about: free-time buttons scroll to their photos ---------- */
  document.querySelectorAll('.pbtn').forEach(function (b) {
    b.addEventListener('click', function () {
      setTimeout(function () {
        var t = document.querySelector('.free-time');
        if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }, 30);
    });
  });
})();
