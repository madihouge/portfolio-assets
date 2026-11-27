/* Madi Houge — Homepage
   Links that point to pages/profiles that don't exist yet use href="#".
   Stop them from jumping to the top of the page until the real URLs
   are added. (The "work" link and the arrow use normal #work anchors
   and smooth-scroll via CSS.) */
document.querySelectorAll('a[href="#"]').forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
  });
});
