// ---------- Loader ----------
(function () {
  var loader = document.getElementById('loader');
  if (!loader) return;
  var hide = function () {
    loader.classList.add('is-hidden');
    document.body.classList.add('is-loaded');
  };
  var min = 1900, max = 2700, start = performance.now(), fired = false;
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

// ---------- Cursor ----------
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

// ---------- Hero carousel ----------
(function () {
  var slides = document.querySelectorAll('.hero__slide');
  var dots = document.querySelectorAll('.hero__dot');
  var counter = document.getElementById('heroCounter');
  if (!slides.length) return;
  var i = 0, count = slides.length, autoTimer;
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function go(n) {
    slides[i].classList.remove('is-active');
    if (dots[i]) dots[i].classList.remove('is-active');
    i = (n + count) % count;
    slides[i].classList.add('is-active');
    if (dots[i]) dots[i].classList.add('is-active');
    if (counter) counter.textContent = pad(i + 1) + ' / ' + pad(count);
  }
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function () { go(i + 1); }, 6000);
  }
  function stopAuto() { if (autoTimer) clearInterval(autoTimer); }
  dots.forEach(function (d) {
    d.addEventListener('click', function () {
      go(parseInt(d.getAttribute('data-i'), 10));
      startAuto();
    });
  });
  startAuto();
})();

// ---------- Work horizontal scroll ----------
(function () {
  var scroller = document.getElementById('workScroll');
  var prev = document.getElementById('workPrev');
  var next = document.getElementById('workNext');
  if (!scroller || !prev || !next) return;
  function step() {
    var card = scroller.querySelector('.work-card');
    return card ? card.getBoundingClientRect().width + 28 : 320;
  }
  prev.addEventListener('click', function () { scroller.scrollBy({ left: -step(), behavior: 'smooth' }); });
  next.addEventListener('click', function () { scroller.scrollBy({ left: step(), behavior: 'smooth' }); });
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
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('[data-fade]').forEach(function (el) { observer.observe(el); });
})();

// ---------- Stagger observer ----------
(function () {
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -4% 0px' });
  document.querySelectorAll('[data-stagger]').forEach(function (el) { io.observe(el); });
})();

// ---------- Hero parallax (subtle) ----------
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var slides = document.querySelectorAll('.hero__slide');
  if (!slides.length) return;
  var ticking = false;
  function update() {
    var y = window.scrollY;
    var max = window.innerHeight;
    if (y > max) { ticking = false; return; }
    var offset = y * 0.22;
    slides.forEach(function (s) {
      s.style.backgroundPosition = 'center calc(50% + ' + offset + 'px)';
    });
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

// ---------- Experiences carousel ----------
(function () {
  var slides = document.querySelectorAll('.exp-slide');
  var dots = document.querySelectorAll('.exp-dot');
  var prev = document.getElementById('expPrev');
  var next = document.getElementById('expNext');
  if (!slides.length || !prev || !next) return;
  var i = 0, count = slides.length, autoTimer;
  function go(n) {
    slides[i].classList.remove('is-active');
    if (dots[i]) dots[i].classList.remove('is-active');
    i = (n + count) % count;
    slides[i].classList.add('is-active');
    if (dots[i]) dots[i].classList.add('is-active');
  }
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function () { go(i + 1); }, 7000);
  }
  function stopAuto() { if (autoTimer) clearInterval(autoTimer); }
  prev.addEventListener('click', function () { go(i - 1); startAuto(); });
  next.addEventListener('click', function () { go(i + 1); startAuto(); });
  dots.forEach(function (d) {
    d.addEventListener('click', function () {
      go(parseInt(d.getAttribute('data-i'), 10));
      startAuto();
    });
  });
  startAuto();
})();
