/* Runs first on every page: a reload always starts at the top, and the load-in reveal gets a failsafe. */
(function () {
  var d = document.documentElement;
  try {
    var n = performance.getEntriesByType('navigation')[0];
    if (n && n.type === 'reload') {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
        window.addEventListener('pagehide', function () { history.scrollRestoration = 'auto'; });
      }
      window.scrollTo(0, 0);
      window.addEventListener('load', function () { window.scrollTo(0, 0); });
    }
  } catch (e) {}
  d.classList.add('rv');
  setTimeout(function () { if (!window.__rvOK) d.classList.add('rv-fail'); }, 4000);
})();
