/* ============================================================
   PORTFOLIO JS — Nguyễn Phương Anh — 2026
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     PRELOADER
     ============================================================ */
  const preloader = document.getElementById('pf-preloader');
  const minDelay = 1400;
  const startTime = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minDelay - elapsed);
    setTimeout(() => {
      preloader.classList.add('pf-preloader--out');
      setTimeout(() => preloader.remove(), 700);
    }, remaining);
  });

  /* ============================================================
     PARTICLE CANVAS
     ============================================================ */
  const canvas  = document.getElementById('pf-particles');
  const ctx     = canvas.getContext('2d');
  let particles = [];
  let width, height;

  function resizeCanvas() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', () => { resizeCanvas(); });

  const GOLD   = 'rgba(212, 175, 55,';
  const PURPLE = 'rgba(155, 89, 182,';
  const TEAL   = 'rgba(26, 188, 156,';
  const COLORS = [GOLD, PURPLE, TEAL, GOLD, GOLD]; // gold weighted

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x  = Math.random() * width;
      this.y  = initial ? Math.random() * height : height + 10;
      this.r  = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.a  = Math.random() * 0.6 + 0.15;
      this.da = (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1);
      this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.isStar = Math.random() < 0.12;
      this.tw = Math.random() * 0.02 + 0.005; // twinkle speed
      this.tp = Math.random() * Math.PI * 2;
    }
    update() {
      this.x  += this.vx;
      this.y  += this.vy;
      this.tp += this.tw;
      this.a   = 0.15 + Math.abs(Math.sin(this.tp)) * 0.5;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      if (this.isStar) {
        // small 4-point star
        const s = this.r * 2.5;
        ctx.save();
        ctx.translate(this.x, this.y);
        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 2);
          ctx.moveTo(0, 0);
          ctx.lineTo(s * 0.4, s * 0.4);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.4, s * 0.4);
        }
        ctx.closePath();
        ctx.restore();
      } else {
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      }
      ctx.fillStyle = `${this.col} ${this.a})`;
      ctx.fill();
    }
  }

  function initParticles(count = 120) {
    particles = [];
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }
  initParticles();

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ============================================================
     NAVIGATION
     ============================================================ */
  const nav       = document.getElementById('pf-nav');
  const toggle    = document.getElementById('pf-nav-toggle');
  const menu      = document.getElementById('pf-nav-menu');
  const navLinks  = document.querySelectorAll('.pf-nav__link');
  let   menuOpen  = false;

  // Sticky nav
  window.addEventListener('scroll', () => {
    nav.classList.toggle('pf-nav--scrolled', window.scrollY > 60);
    updateBackTop();
  }, { passive: true });

  // Mobile menu
  toggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    toggle.classList.toggle('pf-nav__toggle--open', menuOpen);
    menu.classList.toggle('pf-nav__menu--open', menuOpen);
    toggle.setAttribute('aria-expanded', menuOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      toggle.classList.remove('pf-nav__toggle--open');
      menu.classList.remove('pf-nav__menu--open');
      toggle.setAttribute('aria-expanded', false);
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('.pf-section[id]');
  const observerOpts = { rootMargin: '-40% 0px -55% 0px' };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('pf-nav__link--active'));
        const active = document.querySelector(`.pf-nav__link[data-section="${entry.target.id}"]`);
        if (active) active.classList.add('pf-nav__link--active');
      }
    });
  }, observerOpts);
  sections.forEach(s => sectionObserver.observe(s));

  /* ============================================================
     TYPED ROLE TEXT
     ============================================================ */
  const typedEl = document.getElementById('pf-typed-text');
  const roles = [
    'International Economics Student',
    'Tử Vi Đẩu Số Practitioner',
    'Tarot & Spiritual Arts Enthusiast',
    'Web Creator',
    'Seeker of Ancient Wisdom',
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let typePause = false;

  function typeLoop() {
    const current = roles[roleIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        typePause = true;
        setTimeout(() => { typePause = false; deleting = true; requestAnimationFrame(typeLoop); }, 2200);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(() => requestAnimationFrame(typeLoop), 400);
        return;
      }
    }
    if (!typePause) {
      setTimeout(() => requestAnimationFrame(typeLoop), deleting ? 40 : 70);
    }
  }
  // Start after preloader delay
  setTimeout(typeLoop, 1600);

  /* ============================================================
     TAROT CARD TILT
     ============================================================ */
  const tarotCard = document.getElementById('pf-tarot-card');
  if (tarotCard) {
    tarotCard.addEventListener('mousemove', (e) => {
      const rect = tarotCard.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const rx = (e.clientY - cy) / (rect.height / 2) * -12;
      const ry = (e.clientX - cx) / (rect.width  / 2) *  12;
      tarotCard.querySelector('.pf-tarot-card__inner').style.transform =
        `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    tarotCard.addEventListener('mouseleave', () => {
      tarotCard.querySelector('.pf-tarot-card__inner').style.transform = '';
    });
  }

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  const revealEls = document.querySelectorAll('.pf-reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('pf-revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  /* ============================================================
     COUNTER ANIMATION
     ============================================================ */
  const counters = document.querySelectorAll('.pf-count');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1500;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  /* ============================================================
     SKILL BAR ANIMATION
     ============================================================ */
  const skillBars = document.querySelectorAll('.pf-skillbar');
  const skillObs  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target.querySelector('.pf-skillbar__fill');
        const level = entry.target.dataset.level;
        // Short delay for visual stagger
        setTimeout(() => { fill.style.width = level + '%'; }, 200);
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(b => skillObs.observe(b));

  /* ============================================================
     BACK TO TOP BUTTON
     ============================================================ */
  const backTop = document.getElementById('pf-back-top');

  function updateBackTop() {
    backTop.classList.toggle('pf-back-top--visible', window.scrollY > 400);
  }
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================================
     CONTACT FORM (demo — no backend)
     ============================================================ */
  const form     = document.getElementById('pf-contact-form');
  const feedback = document.getElementById('pf-form-feedback');
  const submitBtn = document.getElementById('pf-submit-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = document.getElementById('pf-name').value.trim();
      const email   = document.getElementById('pf-email').value.trim();
      const message = document.getElementById('pf-message').value.trim();

      if (!name || !email || !message) {
        showFeedback('Please fill in all required fields.', false);
        return;
      }
      if (!isValidEmail(email)) {
        showFeedback('Please enter a valid email address.', false);
        return;
      }

      // Simulate sending
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Dispatching...';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Dispatch the Raven';
        showFeedback('✦ Your message has been sent! I will respond within 24 hours.', true);
      }, 1800);
    });
  }

  function showFeedback(msg, success) {
    feedback.textContent = msg;
    feedback.className = 'pf-form-feedback ' + (success ? 'pf-form-feedback--success' : 'pf-form-feedback--error');
    setTimeout(() => { feedback.textContent = ''; feedback.className = 'pf-form-feedback'; }, 6000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ============================================================
     SMOOTH ANCHOR SCROLLING (with nav offset)
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 10;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

}); // end DOMContentLoaded
