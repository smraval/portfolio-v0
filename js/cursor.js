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


  /* ---------- over any text (and while selecting): the cursor is a pink eighth note ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var root = document.documentElement;
    var note = document.createElement('div');
    note.className = 'note-cursor';
    note.setAttribute('aria-hidden', 'true');
    note.innerHTML = '<svg viewBox="0 0 18 36" width="18" height="36" fill="#c9545c"><ellipse cx="6" cy="28.5" rx="5" ry="3.5" transform="rotate(-22 6 28.5)"/><rect x="9.6" y="2" width="1.7" height="26.5"/><path d="M11.3 2c.2 6.2 6.4 7.6 5.5 16.2-.7-4.4-2.7-6.6-5.5-7.6z"/></svg>';
    document.body.appendChild(note);
    var down = false, selecting = false, onText = false, raf = 0, last = null;
    var INTERACTIVE = 'a[href], button, input, select, textarea, label, video, summary, [role="button"], .tile, .sig';
    var place = function (e) { note.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)'; };
    var setSel = function (on) { if (on !== selecting) { selecting = on; root.classList.toggle('is-selecting', on); } };
    var setText = function (on) { if (on !== onText) { onText = on; root.classList.toggle('is-text', on); } };
    var hasSel = function () { var s = window.getSelection && window.getSelection(); return !!(s && !s.isCollapsed && String(s).trim().length); };
    // is the pointer actually on a piece of text (not just on a block that contains some)?
    var textAt = function (x, y, target) {
      if (target && target.closest && target.closest(INTERACTIVE)) return false;
      var node = null, off = 0;
      if (document.caretPositionFromPoint) { var p = document.caretPositionFromPoint(x, y); if (p) { node = p.offsetNode; off = p.offset; } }
      else if (document.caretRangeFromPoint) { var r = document.caretRangeFromPoint(x, y); if (r) { node = r.startContainer; off = r.startOffset; } }
      if (!node || node.nodeType !== 3 || !node.nodeValue.trim()) return false;
      var rg = document.createRange(), len = node.nodeValue.length;
      rg.setStart(node, Math.max(0, off - 1)); rg.setEnd(node, Math.min(len, off + 1));
      var rects = rg.getClientRects();
      for (var i = 0; i < rects.length; i++) {
        var q = rects[i];
        if (x >= q.left - 6 && x <= q.right + 6 && y >= q.top - 2 && y <= q.bottom + 2) return true;
      }
      return false;
    };
    document.addEventListener('mousedown', function (e) {
      down = e.button === 0 && !(e.target.closest && e.target.closest(INTERACTIVE)); place(e);
    }, true);
    window.addEventListener('mousemove', function (e) {
      place(e); last = e;
      if (down && !selecting && hasSel()) setSel(true);
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0; if (last) setText(textAt(last.clientX, last.clientY, last.target));
      });
    }, { passive: true });
    window.addEventListener('scroll', function () { if (last && !raf) raf = requestAnimationFrame(function () { raf = 0; setText(textAt(last.clientX, last.clientY, document.elementFromPoint(last.clientX, last.clientY))); }); }, { passive: true });
    window.addEventListener('mouseup', function () { down = false; setSel(false); }, true);
    window.addEventListener('blur', function () { down = false; setSel(false); setText(false); });
    root.addEventListener('mouseleave', function () { setText(false); });
  }

})();
