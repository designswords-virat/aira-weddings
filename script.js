// ---------- Loader ----------
(function () {
  var loader = document.getElementById('loader');
  if (!loader) return;
  var hide = function () {
    loader.classList.add('is-hidden');
    document.body.classList.add('is-loaded');
  };
  var min = 1500, max = 2300, start = performance.now(), fired = false;
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

// ---------- Magazine parallax — slow image translate within frame ----------
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var imgs = document.querySelectorAll('.spread__img, .essay__img, .studio__breaker__img, .post__img, .svc__img');
  if (!imgs.length) return;
  var ticking = false;
  function update() {
    imgs.forEach(function (img) {
      var rect = img.getBoundingClientRect();
      var vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      var progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      var offset = progress * -14;
      img.style.backgroundPosition = 'center calc(50% + ' + offset + 'px)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

// ---------- Hero parallax ----------
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var bg = document.querySelector('.hero__img');
  if (!bg) return;
  var ticking = false;
  function update() {
    var y = window.scrollY;
    if (y > window.innerHeight) { ticking = false; return; }
    bg.style.transform = 'translate3d(0,' + (y * 0.28) + 'px, 0) scale(' + (1 + y * 0.0003) + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
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
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
