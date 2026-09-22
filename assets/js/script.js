/* =====================================================================
   Ritika Mehndi Art — site scripts
   Plain JavaScript, no libraries. Everything degrades gracefully:
   if this file fails to load, the page is still readable and every
   WhatsApp / call link still works.
   ===================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. Footer year
     ------------------------------------------------------------------ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     2. Mobile navigation
     ------------------------------------------------------------------ */
  var header = document.getElementById('header');
  var toggle = document.getElementById('navToggle');
  var panel = document.getElementById('navPanel');

  function closeNav() {
    if (!toggle || !panel) return;
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('is-open')) return;
      if (panel.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ------------------------------------------------------------------
     3. Header state on scroll (throttled with rAF)
     ------------------------------------------------------------------ */
  var toTop = document.getElementById('toTop');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (toTop) toTop.classList.toggle('is-visible', y > 700);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     4. Active navigation link
     ------------------------------------------------------------------ */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"], .nav__panel a[href^="#"]')
  );
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean)
    .filter(function (el, i, arr) { return arr.indexOf(el) === i; });

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (a) {
          if (a.getAttribute('href') === id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------------------------
     5. Scroll reveal (one gentle fade per element, then done)
     ------------------------------------------------------------------ */
  var revealables = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.transitionDelay = Math.min(i * 70, 210) + 'ms';
        el.classList.add('is-in');
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(revealables, function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------
     6. FAQ accordion (one open at a time, animated height)
     ------------------------------------------------------------------ */
  var faqButtons = document.querySelectorAll('.faq__q');

  function collapse(btn) {
    var panelEl = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panelEl) return;
    panelEl.style.height = panelEl.scrollHeight + 'px';
    void panelEl.offsetHeight;
    panelEl.style.height = '0px';
    btn.setAttribute('aria-expanded', 'false');
  }

  function expand(btn) {
    var panelEl = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panelEl) return;
    panelEl.style.height = panelEl.scrollHeight + 'px';
    btn.setAttribute('aria-expanded', 'true');
    panelEl.addEventListener('transitionend', function handler(e) {
      if (e.propertyName !== 'height') return;
      if (btn.getAttribute('aria-expanded') === 'true') panelEl.style.height = 'auto';
      panelEl.removeEventListener('transitionend', handler);
    });
  }

  Array.prototype.forEach.call(faqButtons, function (btn) {
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      Array.prototype.forEach.call(faqButtons, function (other) {
        if (other !== btn && other.getAttribute('aria-expanded') === 'true') collapse(other);
      });
      if (isOpen) collapse(btn);
      else expand(btn);
    });
  });

  /* ------------------------------------------------------------------
     7. Gallery filters
     ------------------------------------------------------------------ */
  var filters = document.querySelectorAll('.filter');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));

  function visibleItems() {
    return items.filter(function (el) { return !el.classList.contains('is-hidden'); });
  }

  Array.prototype.forEach.call(filters, function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-filter');
      Array.prototype.forEach.call(filters, function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      items.forEach(function (item) {
        var show = value === 'all' || item.getAttribute('data-cat') === value;
        item.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ------------------------------------------------------------------
     8. Gallery lightbox
     ------------------------------------------------------------------ */
  var lightbox = document.getElementById('lightbox');
  var lbImage = document.getElementById('lbImage');
  var lbCaption = document.getElementById('lbCaption');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var current = 0;
  var lastFocused = null;

  function show(index) {
    var list = visibleItems();
    if (!list.length) return;
    current = (index + list.length) % list.length;
    var item = list[current];
    var img = item.querySelector('img');
    var caption = item.querySelector('figcaption');
    lbImage.src = img.getAttribute('src');
    lbImage.alt = img.getAttribute('alt') || '';
    lbCaption.textContent = caption ? caption.textContent : '';
    var multiple = list.length > 1;
    lbPrev.hidden = !multiple;
    lbNext.hidden = !multiple;
  }

  function openLightbox(item) {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    show(visibleItems().indexOf(item));
    lightbox.classList.add('is-open');
    document.body.classList.add('is-lightbox');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('is-lightbox');
    document.body.style.overflow = '';
    lbImage.src = '';
    if (lastFocused) lastFocused.focus();
  }

  if (lightbox) {
    items.forEach(function (item) {
      item.addEventListener('click', function () { openLightbox(item); });
    });

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function () { show(current - 1); });
    lbNext.addEventListener('click', function () { show(current + 1); });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox__figure')) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'Tab') {
        // keep focus inside the viewer
        var focusables = [lbClose, lbPrev, lbNext].filter(function (b) { return !b.hidden; });
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Swipe on touch devices
    var startX = null;
    lightbox.addEventListener('touchstart', function (e) {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(dx > 0 ? current - 1 : current + 1);
      startX = null;
    }, { passive: true });
  }
})();
