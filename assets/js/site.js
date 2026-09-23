// jose_diaz.dev — progressive enhancements. The page is fully readable without this file.
(function () {
  'use strict';
  var root = document.documentElement;

  // ---- Email: assembled at runtime so the plain address never sits in the HTML ----
  var user = 'diazjose';
  var host = 'umich.edu';
  document.querySelectorAll('.js-email').forEach(function (a) {
    a.href = 'mailto:' + user + '@' + host;
  });

  // ---- Theme toggle (light / dark), remembered per browser ----
  var toggle = document.querySelector('.theme-toggle');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  function currentTheme() {
    return root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
  }
  function syncToggle() {
    if (!toggle) return;
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    toggle.title = 'Switch to ' + next + ' theme';
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncToggle();
    });
    systemDark.addEventListener('change', syncToggle);
    syncToggle();
  }

  // ---- Scroll-spy: highlight the nav link for the section in view ----
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function setActive(id) {
    links.forEach(function (a) {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) io.observe(s); });
  }

  // ---- Lightbox for detailed figures (falls back to opening the image) ----
  var dialog;
  function openLightbox(href, alt) {
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.className = 'lightbox';
      dialog.innerHTML =
        '<img alt="">' +
        '<div class="lightbox-bar"><span>click outside or press Esc to close</span>' +
        '<button type="button">close</button></div>';
      document.body.appendChild(dialog);
      dialog.querySelector('button').addEventListener('click', function () { dialog.close(); });
      dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    }
    var img = dialog.querySelector('img');
    img.src = href;
    img.alt = alt || '';
    dialog.showModal();
  }
  document.querySelectorAll('[data-lightbox]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (typeof HTMLDialogElement !== 'function' || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      var inner = a.querySelector('img');
      openLightbox(a.getAttribute('href'), inner && inner.alt);
    });
  });

  // ---- BibTeX: show / hide and copy to clipboard ----
  document.querySelectorAll('[data-bibtex]').forEach(function (btn) {
    var box = document.getElementById(btn.getAttribute('data-bibtex'));
    if (!box) return;
    btn.addEventListener('click', function () {
      var open = box.hidden;
      box.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    });
    var copy = box.querySelector('.copy');
    var pre = box.querySelector('pre');
    copy.addEventListener('click', function () {
      var text = pre.textContent;
      var done = function () {
        copy.textContent = 'copied ✓';
        setTimeout(function () { copy.textContent = 'copy'; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { selectText(pre); });
      } else {
        selectText(pre);
      }
    });
  });
  function selectText(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
})();
