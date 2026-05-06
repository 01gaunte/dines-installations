/* ============================================================
   Dines Installations — Design B
   Refined parallax: scroll-driven Ken Burns zoom + horizontal
   filmstrip drift + reveals + counters.
   ============================================================ */

(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('#year').textContent = new Date().getFullYear();

  // ---------- tabs ----------
  const panels = {
    home:     $('#tab-home'),
    about:    $('#tab-about'),
    services: $('#tab-services'),
    contact:  $('#tab-contact'),
  };

  const setTab = (name, push = true) => {
    if (!panels[name]) return;
    Object.entries(panels).forEach(([k, el]) => el.classList.toggle('hidden', k !== name));
    $$('.tab-link').forEach(b => {
      if (b.hasAttribute('data-no-highlight')) return;
      b.classList.toggle('is-active', b.dataset.tab === name);
    });
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    if (push) history.replaceState({}, '', `#${name}`);
    requestAnimationFrame(() => bindReveals(panels[name]));
    $('#mobileNav').classList.add('hidden');
  };

  $$('.tab-link').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    setTab(btn.dataset.tab);
  }));

  $('#navToggle').addEventListener('click', () => $('#mobileNav').classList.toggle('hidden'));

  const initial = (location.hash || '#home').replace('#', '');
  setTab(panels[initial] ? initial : 'home', false);

  // ---------- reveals ----------
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        revealIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  function bindReveals(scope = document) {
    $$('.reveal', scope).forEach(el => { if (!el.classList.contains('in')) revealIO.observe(el); });
  }
  bindReveals();

  // ---------- counters ----------
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const dur = 1600;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const v = target * eased;
        el.textContent = decimals ? v.toFixed(decimals) : Math.floor(v).toLocaleString();
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  $$('.counter').forEach(el => counterIO.observe(el));

  // contact form
  const form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.reset();
      const status = $('#formStatus');
      status.classList.remove('hidden');
      setTimeout(() => status.classList.add('hidden'), 5000);
    });
  }

  if (reduced) return;

  // ---------- parallax ----------
  // Ken Burns zoom — scale background photos slowly as they pass through view
  const zoomEls = $$('[data-zoom]');

  // Filmstrip horizontal drift on scroll
  const film = $('#filmStrip');

  let scrollY = window.scrollY;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  function loop() {
    for (const el of zoomEls) {
      const wrapper = el.parentElement;
      const rect = wrapper.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) continue;
      const strength = parseFloat(el.dataset.zoom) || 0.08;
      // 0..1 progress through viewport
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      const scale = 1 + clamped * strength;
      const translateY = (clamped - 0.5) * 30; // slight drift
      el.style.transform = `scale(${scale.toFixed(4)}) translate3d(0, ${translateY.toFixed(2)}px, 0)`;
    }

    if (film) {
      const r = film.getBoundingClientRect();
      if (r.bottom > -200 && r.top < window.innerHeight + 200) {
        const center = r.top + r.height / 2 - window.innerHeight / 2;
        const offset = center * -0.18;
        film.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
      }
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

})();
