/* ============================================================
   Dines Installations — interaction & parallax engine
   10 parallax techniques wired up here:
   1) scroll-driven Y parallax        ([data-parallax-y])
   2) scroll-driven X parallax        ([data-parallax-x])
   3) mouse-tracking parallax         ([data-mouse])
   4) horizontal sticky scroll        (#horizontalTrack)
   5) 3D tilt-card mouse parallax     (.tilt-card)
   6) IntersectionObserver reveals    (.reveal)
   7) clip-path mask reveal           (.reveal-mask)
   8) global animated sun orb         (#sunOrb / #sunOrb2)
   9) pinned sticky text-on-image     (#pinSection)
  10) 3D perspective form tilt        ([data-tilt-form])
   ============================================================ */

(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- year ----------
  $('#year').textContent = new Date().getFullYear();

  // ---------- tab switching ----------
  const panels = {
    home:     $('#tab-home'),
    about:    $('#tab-about'),
    services: $('#tab-services'),
    contact:  $('#tab-contact'),
  };

  const setTab = (name, push = true) => {
    if (!panels[name]) return;
    Object.entries(panels).forEach(([k, el]) => {
      el.classList.toggle('hidden', k !== name);
    });
    $$('.tab-link').forEach(b => b.classList.toggle('is-active', b.dataset.tab === name));
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    if (push) history.replaceState({}, '', `#${name}`);
    // re-trigger reveals on the now-visible panel
    requestAnimationFrame(() => bindReveals(panels[name]));
    // re-measure horizontal scroll
    requestAnimationFrame(measureHorizontal);
    // close mobile nav
    $('#mobileNav').classList.add('hidden');
  };

  $$('.tab-link').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      setTab(btn.dataset.tab);
    });
  });

  // mobile nav toggle
  $('#navToggle').addEventListener('click', () => {
    $('#mobileNav').classList.toggle('hidden');
  });

  // initial tab from hash
  const initial = (location.hash || '#home').replace('#', '');
  setTab(panels[initial] ? initial : 'home', false);

  // ---------- (6) IntersectionObserver reveals ----------
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        revealIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  function bindReveals(scope = document) {
    $$('.reveal, .reveal-mask', scope).forEach(el => {
      if (!el.classList.contains('in')) revealIO.observe(el);
    });
  }
  bindReveals();

  // ---------- counters ----------
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const dur = 1400;
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

  if (reduced) return; // skip motion below if user prefers reduced

  // ---------- (1) scroll-driven Y parallax + (2) scroll-driven X parallax ----------
  // Uses requestAnimationFrame loop; each element has data-parallax-y / data-parallax-x
  // value = strength factor (0..1). Negative = opposite direction.
  const parallaxYEls = $$('[data-parallax-y]');
  const parallaxXEls = $$('[data-parallax-x]');

  // ---------- (3) mouse-tracking layers ----------
  const mouseEls = $$('[data-mouse]');
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  window.addEventListener('mousemove', (e) => {
    tmx = (e.clientX / window.innerWidth - 0.5);
    tmy = (e.clientY / window.innerHeight - 0.5);
  }, { passive: true });

  // ---------- (8) sun orb drift ----------
  const sunOrb  = $('#sunOrb');
  const sunOrb2 = $('#sunOrb2');

  // ---------- (4) horizontal sticky scroll ----------
  const horizontalSection = $('#horizontalSection');
  const horizontalTrack   = $('#horizontalTrack');
  let horizontalDistance  = 0;

  function measureHorizontal() {
    if (!horizontalSection || !horizontalTrack) return;
    if (horizontalSection.classList.contains('hidden') ||
        getComputedStyle(horizontalSection).display === 'none') {
      horizontalDistance = 0; return;
    }
    horizontalDistance = Math.max(0, horizontalTrack.scrollWidth - window.innerWidth + 64);
  }
  window.addEventListener('resize', measureHorizontal);
  window.addEventListener('load', measureHorizontal);
  measureHorizontal();

  // ---------- (5) tilt cards ----------
  $$('.tilt-card').forEach(card => {
    let rect = null;
    const enter = () => { rect = card.getBoundingClientRect(); };
    const move = (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top ) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`;
    };
    const leave = () => {
      card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
      rect = null;
    };
    card.addEventListener('mouseenter', enter);
    card.addEventListener('mousemove', move);
    card.addEventListener('mouseleave', leave);
  });

  // ---------- (10) form 3D perspective tilt ----------
  const formEl = $('[data-tilt-form]');
  if (formEl) {
    let rect = null;
    formEl.parentElement.addEventListener('mouseenter', () => { rect = formEl.getBoundingClientRect(); });
    formEl.parentElement.addEventListener('mousemove', (e) => {
      if (!rect) rect = formEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top ) / rect.height - 0.5;
      formEl.style.transform = `rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    formEl.parentElement.addEventListener('mouseleave', () => {
      formEl.style.transform = 'rotateY(0) rotateX(0)';
      rect = null;
    });
  }

  // contact form fake submit
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

  // ---------- main rAF loop ----------
  let scrollY = window.scrollY;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  function loop() {
    // smooth mouse easing
    mx += (tmx - mx) * 0.08;
    my += (tmy - my) * 0.08;

    // scroll-driven parallax Y
    for (const el of parallaxYEls) {
      const rect = el.parentElement.getBoundingClientRect();
      // only animate when near viewport
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) continue;
      const speed = parseFloat(el.dataset.parallaxY) || 0.2;
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    }

    // scroll-driven parallax X (text bands)
    for (const el of parallaxXEls) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) continue;
      const speed = parseFloat(el.dataset.parallaxX) || 0.1;
      const offset = (scrollY) * speed;
      el.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
    }

    // mouse-tracking
    for (const el of mouseEls) {
      const strength = parseFloat(el.dataset.mouse) || 20;
      el.style.transform = `translate3d(${(mx * strength).toFixed(2)}px, ${(my * strength).toFixed(2)}px, 0)`;
    }

    // sun orb drift (combined scroll + mouse)
    if (sunOrb) {
      sunOrb.style.transform  = `translate3d(${(mx * -40 + scrollY * 0.05).toFixed(2)}px, ${(my * -40 + scrollY * 0.08).toFixed(2)}px, 0)`;
    }
    if (sunOrb2) {
      sunOrb2.style.transform = `translate3d(${(mx * 30 - scrollY * 0.04).toFixed(2)}px, ${(my * 30 - scrollY * 0.06).toFixed(2)}px, 0)`;
    }

    // horizontal sticky scroll
    if (horizontalSection && horizontalTrack && horizontalDistance > 0) {
      const r = horizontalSection.getBoundingClientRect();
      const total = horizontalSection.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -r.top / total));
      horizontalTrack.style.transform = `translate3d(${(-progress * horizontalDistance).toFixed(2)}px, 0, 0)`;
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

})();
