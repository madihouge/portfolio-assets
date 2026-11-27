/* Madi Houge — hand-cut panel shapes
   ------------------------------------------------------------
   Gives every element with class "organic" a subtly irregular,
   rounded outline (like the Happy Trails reference) using a
   CSS clip-path. Corners get slightly different radii and the
   edges bow in by a pixel or two, so no two panels match exactly.
   The photos themselves are never scaled or distorted, only
   trimmed at the very edge by the outline.

   Tweak the look with the numbers in SETTINGS. */

(function () {
  var SETTINGS = {
    radius: 0.075,      // base corner size, as a share of the panel's shorter side
    minRadius: 16,      // px
    maxRadius: 42,      // px
    radiusJitter: 0.22, // how much each corner varies (0 = all equal)
    edgeBow: 2.4        // max px an edge curves inward
  };

  // Small deterministic random generator so shapes don't change on reload
  function rng(seed) {
    return function () {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  }

  function shapePath(w, h, seed) {
    var r = rng(seed);
    var base = Math.max(SETTINGS.minRadius, Math.min(SETTINGS.maxRadius, Math.min(w, h) * SETTINGS.radius));
    function rad() { return base * (1 - SETTINGS.radiusJitter + r() * SETTINGS.radiusJitter * 2); }
    function bow() { return 0.4 + r() * (SETTINGS.edgeBow - 0.4); }
    function mid() { return 0.38 + r() * 0.24; }

    // each corner: horizontal + vertical radius (slightly different = hand-cut)
    var c = [0, 1, 2, 3].map(function () { var a = rad(); return [a, a * (0.85 + r() * 0.3)]; });
    var k = 0.5523; // circle approximation
    var tl = c[0], tr = c[1], br = c[2], bl = c[3];
    var f = function (n) { return n.toFixed(2); };

    var d = [];
    d.push('M', f(tl[0]), '0');
    // top edge (bows down slightly)
    d.push('Q', f(tl[0] + (w - tl[0] - tr[0]) * mid()), f(bow() * 2), f(w - tr[0]), '0');
    // top-right corner
    d.push('C', f(w - tr[0] * (1 - k)), '0', f(w), f(tr[1] * (1 - k)), f(w), f(tr[1]));
    // right edge
    d.push('Q', f(w - bow() * 2), f(tr[1] + (h - tr[1] - br[1]) * mid()), f(w), f(h - br[1]));
    // bottom-right corner
    d.push('C', f(w), f(h - br[1] * (1 - k)), f(w - br[0] * (1 - k)), f(h), f(w - br[0]), f(h));
    // bottom edge
    d.push('Q', f(bl[0] + (w - bl[0] - br[0]) * mid()), f(h - bow() * 2), f(bl[0]), f(h));
    // bottom-left corner
    d.push('C', f(bl[0] * (1 - k)), f(h), '0', f(h - bl[1] * (1 - k)), '0', f(h - bl[1]));
    // left edge
    d.push('Q', f(bow() * 2), f(tl[1] + (h - tl[1] - bl[1]) * mid()), '0', f(tl[1]));
    // top-left corner
    d.push('C', '0', f(tl[1] * (1 - k)), f(tl[0] * (1 - k)), '0', f(tl[0]), '0');
    d.push('Z');
    return d.join(' ');
  }

  var els = document.querySelectorAll('.organic');
  if (!els.length || !window.CSS || !CSS.supports('clip-path', 'path("M0 0")')) return;

  function apply(el, i) {
    var w = el.offsetWidth, h = el.offsetHeight;
    if (!w || !h) return;
    el.style.clipPath = 'path("' + shapePath(w, h, 7919 * (i + 3)) + '")';
    el.style.borderRadius = '0';
  }

  var ro = new ResizeObserver(function (entries) {
    entries.forEach(function (e) { apply(e.target, Array.prototype.indexOf.call(els, e.target)); });
  });
  els.forEach(function (el) { ro.observe(el); });
})();
