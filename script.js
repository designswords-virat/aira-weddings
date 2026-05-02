// =========================================================
// AIRA — script.js
// Loader, custom cursor, scroll reveal, smooth-wheel scroll,
// work carousel, mobile menu, smooth anchor scroll, nav state.
// =========================================================

// ---------- Lenis smooth scroll (wheel + touch) ----------
(function () {
  if (typeof Lenis === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var lenis = new Lenis({
    duration: 1.1,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothWheel: true,
    touchMultiplier: 1.6
  });
  window.lenis = lenis;
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
})();

// ---------- Loader ----------
(function () {
  var loader = document.getElementById('loader');
  if (!loader) return;
  var hide = function () {
    loader.classList.add('is-hidden');
    document.body.classList.add('is-loaded');
  };
  var min = 2400, max = 3200, start = performance.now(), fired = false;
  var fire = function () {
    if (fired) return; fired = true;
    setTimeout(hide, Math.max(0, min - (performance.now() - start)));
  };
  window.addEventListener('load', fire);
  setTimeout(fire, max);
})();

// ---------- Nav scroll state ----------
(function () {
  var nav = document.getElementById('nav');
  if (!nav) return;
  var onScroll = function () {
    nav.classList.toggle('is-scrolled', window.scrollY > 80);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ---------- Cursor (desktop only) ----------
(function () {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  var cursor = document.getElementById('cursor');
  if (!cursor) return;
  document.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('[data-cursor]').forEach(function (el) {
    el.addEventListener('mouseenter', function () { cursor.classList.add('is-hovering'); });
    el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hovering'); });
  });
})();

// ---------- Scroll reveal ----------
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-fade]').forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-fade]').forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('[data-fade]').forEach(function (el) { observer.observe(el); });
})();

// ---------- Smooth wheel scroll (Lenis-lite, desktop only) ----------
// Intercepts wheel events and lerps the scroll position toward a target
// for a softer, "Framer-feel" page scroll. Skipped on touch devices and
// when prefers-reduced-motion is on. Anchor jumps still go through CSS
// scroll-behavior: smooth.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  var current = window.scrollY;
  var target = current;
  var ease = 0.10;
  var raf = null;
  var isAnimating = false;

  function maxScroll() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  function loop() {
    var diff = target - current;
    if (Math.abs(diff) < 0.3) {
      current = target;
      window.scrollTo(0, current);
      isAnimating = false;
      raf = null;
      return;
    }
    current += diff * ease;
    isAnimating = true;
    window.scrollTo(0, current);
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey) return; // browser zoom — don't intercept
    e.preventDefault();
    target = Math.max(0, Math.min(maxScroll(), target + e.deltaY));
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: false });

  // If something else scrolls (anchor click, keyboard, search bar), resync
  window.addEventListener('scroll', function () {
    if (!isAnimating) {
      current = window.scrollY;
      target = current;
    }
  }, { passive: true });

  // Resync on focus changes (tab key, form fields scrolling into view)
  window.addEventListener('keydown', function () {
    if (!isAnimating) {
      current = window.scrollY;
      target = current;
    }
  });
})();

// ---------- Work — carousel scroll buttons + progress ----------
(function () {
  var track = document.getElementById('workTrack');
  var prev  = document.getElementById('workPrev');
  var next  = document.getElementById('workNext');
  var bar   = document.getElementById('workBar');
  if (!track) return;
  var step = function () {
    var card = track.querySelector('.wcard');
    if (!card) return 320;
    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap || 24);
    return card.getBoundingClientRect().width + gap;
  };
  if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
  if (next) next.addEventListener('click', function () { track.scrollBy({ left:  step(), behavior: 'smooth' }); });
  track.addEventListener('scroll', function () {
    if (!bar) return;
    var max = Math.max(1, track.scrollWidth - track.clientWidth);
    var pct = track.scrollLeft / max;
    var width = 22;
    bar.style.left = (pct * (100 - width)) + '%';
  });
})();

// ---------- Mobile hamburger ----------
(function () {
  var btn = document.getElementById('navHamburger');
  var menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  function open() {
    btn.classList.add('is-open');
    menu.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    btn.classList.remove('is-open');
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  btn.addEventListener('click', function () {
    menu.classList.contains('is-open') ? close() : open();
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();

// ---------- Smooth anchor scroll ----------
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (window.lenis) {
        window.lenis.scrollTo(target, { offset: 0 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
