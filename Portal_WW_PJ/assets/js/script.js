/* ===========================
   script.js — William Weiss Premium Landing Page
=========================== */

// ──────────────────────────────
// NAVBAR: scroll state + mobile menu
// ──────────────────────────────
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!navbar) return;

  // Scroll shadow
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on mobile link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
})();


// ──────────────────────────────
// REVEAL AO SCROLL (IntersectionObserver)
// ──────────────────────────────
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -48px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


// ──────────────────────────────
// FAQ ACCORDION
// ──────────────────────────────
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Fecha todos
      items.forEach(i => {
        i.classList.remove('open');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Abre o clicado (se estava fechado)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


// ──────────────────────────────
// RIPPLE EFFECT NOS BOTÕES CTA
// ──────────────────────────────
(function initButtonRipple() {
  const buttons = document.querySelectorAll('.btn-primary');

  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple-anim {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.8;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      circle.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        left:${x}px;top:${y}px;border-radius:50%;
        background:rgba(255,255,255,0.18);pointer-events:none;
        transform:scale(0);animation:ripple-anim 0.6s ease-out forwards;
      `;

      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });
})();


// ──────────────────────────────
// SCROLL SUAVE PARA ÂNCORAS
// ──────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const navMain = document.querySelector('.nav-main');
      const navH = navMain ? navMain.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ──────────────────────────────
// ACTIVE NAV LINK (IntersectionObserver)
// ──────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.style.color      = isActive ? 'var(--red)' : '';
          link.style.fontWeight = isActive ? '600' : '';
        });
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '0px 0px -40% 0px'
  });

  sections.forEach(sec => observer.observe(sec));
})();


// ──────────────────────────────
// CARD TILT SUTIL (hero card)
// ──────────────────────────────
(function initCardTilt() {
  const card = document.querySelector('.hero-card-premium');
  if (!card || window.innerWidth < 900) return;

  const MAX_TILT = 4;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotateX =  dy * MAX_TILT;
    const rotateY = -dx * MAX_TILT;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    setTimeout(() => card.style.transition = '', 500);
  });
})();
