/* Madi Houge — project photo zoom
   ------------------------------------------------------------
   Click (or press Enter on) any photo on a project page to see it
   full screen over a blurred view of the page. Click anywhere
   outside the photo, or press Escape, to close it. */

(function () {
  var photos = document.querySelectorAll('.project .panel img');
  if (!photos.length) return;

  // Overlay, built once and reused
  var overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Enlarged photo');
  overlay.hidden = true;

  var big = document.createElement('img');
  big.className = 'lightbox__img';
  overlay.appendChild(big);
  document.body.appendChild(overlay);

  var lastFocus = null;

  function open(img) {
    lastFocus = img;
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    overlay.hidden = false;
    document.documentElement.classList.add('lightbox-open');
    overlay.setAttribute('tabindex', '-1');
    overlay.focus();
  }

  function close() {
    overlay.hidden = true;
    document.documentElement.classList.remove('lightbox-open');
    big.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }

  photos.forEach(function (img) {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Enlarge photo: ' + (img.alt || 'project image'));
    img.addEventListener('click', function () { open(img); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); }
    });
  });

  // Clicking anywhere except the photo itself closes it
  overlay.addEventListener('click', function (e) {
    if (e.target !== big) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });
})();
