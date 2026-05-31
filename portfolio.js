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
      this.isStar = Math.random() < 0.45;
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

  function initParticles(count = 250) {
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

  /* ============================================================
     MINI GAME (Star Runner)
     ============================================================ */
  const gameCanvas = document.getElementById('pf-game-canvas');
  if (gameCanvas) {
    const gCtx = gameCanvas.getContext('2d');
    const overlay = document.getElementById('pf-game-overlay');
    const msgEl = document.getElementById('pf-game-msg');
    const scoreEl = document.getElementById('pf-game-score');
    const hiEl = document.getElementById('pf-game-hi');
    
    let isPlaying = false;
    let isGameOver = false;
    let score = 0;
    let hiScore = localStorage.getItem('pf-star-hi') || 0;
    hiEl.textContent = hiScore;
    
    let gameSpeed = 5;
    let gravity = 0.6;
    let frame = 0;
    
    const star = {
      x: 50,
      y: 150,
      w: 30,
      h: 30,
      dy: 0,
      jumpForce: -10,
      grounded: false,
      jumpTimer: 0
    };
    
    let obstacles = [];
    
    function resetGame() {
      star.y = 150 - star.h;
      star.dy = 0;
      obstacles = [];
      score = 0;
      gameSpeed = 5;
      frame = 0;
      isGameOver = false;
    }
    
    function drawStar() {
      gCtx.save();
      gCtx.translate(star.x + star.w/2, star.y + star.h/2);
      gCtx.rotate(frame * 0.1);
      gCtx.fillStyle = '#d4af37';
      gCtx.shadowColor = 'rgba(212, 175, 55, 0.8)';
      gCtx.shadowBlur = 10;
      gCtx.beginPath();
      // Draw a 5-point star
      for (let i = 0; i < 5; i++) {
        gCtx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * 15,
                    -Math.sin((18 + i * 72) / 180 * Math.PI) * 15);
        gCtx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * 7,
                    -Math.sin((54 + i * 72) / 180 * Math.PI) * 7);
      }
      gCtx.closePath();
      gCtx.fill();
      gCtx.restore();
    }
    
    function drawObstacle(obs) {
      gCtx.fillStyle = '#9b59b6';
      gCtx.shadowColor = 'rgba(155, 89, 182, 0.5)';
      gCtx.shadowBlur = 8;
      gCtx.beginPath();
      // Draw a crescent moon shape
      gCtx.arc(obs.x + obs.w/2, obs.y + obs.h/2, obs.w/2, Math.PI*1.5, Math.PI*0.5, true);
      gCtx.arc(obs.x + obs.w/2 - 5, obs.y + obs.h/2, obs.w/2, Math.PI*0.5, Math.PI*1.5, false);
      gCtx.fill();
      gCtx.closePath();
    }
    
    function updateGame() {
      if (!isPlaying) return;
      
      requestAnimationFrame(updateGame);
      gCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
      
      // Ground line
      gCtx.beginPath();
      gCtx.moveTo(0, 150);
      gCtx.lineTo(600, 150);
      gCtx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      gCtx.stroke();
      
      // Star Physics
      star.dy += gravity;
      star.y += star.dy;
      
      if (star.y + star.h >= 150) {
        star.y = 150 - star.h;
        star.dy = 0;
        star.grounded = true;
      } else {
        star.grounded = false;
      }
      
      drawStar();
      
      // Obstacles
      if (frame % Math.max(60, Math.floor(120 - gameSpeed*2)) === 0) {
        let size = Math.random() * 10 + 20;
        obstacles.push({
          x: gameCanvas.width,
          y: 150 - size,
          w: size,
          h: size
        });
      }
      
      for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];
        o.x -= gameSpeed;
        drawObstacle(o);
        
        // Collision (simple AABB with small forgiveness margin)
        if (
          star.x + 5 < o.x + o.w &&
          star.x + star.w - 5 > o.x &&
          star.y + 5 < o.y + o.h &&
          star.y + star.h - 5 > o.y
        ) {
          gameOver();
        }
      }
      
      // Remove off-screen obstacles
      if (obstacles.length > 0 && obstacles[0].x < -50) {
        obstacles.shift();
      }
      
      // Score
      score++;
      if (score % 10 === 0) scoreEl.textContent = Math.floor(score / 10);
      if (score % 500 === 0) gameSpeed += 0.5;
      
      frame++;
    }
    
    function jump() {
      if (!isPlaying) {
        startMsg();
        return;
      }
      if (isGameOver) {
        resetGame();
        isGameOver = false;
        overlay.classList.add('pf-hidden');
        updateGame();
        return;
      }
      if (star.grounded) {
        star.dy = star.jumpForce;
        star.grounded = false;
      }
    }
    
    function startMsg() {
      resetGame();
      isPlaying = true;
      overlay.classList.add('pf-hidden');
      updateGame();
    }
    
    function gameOver() {
      isPlaying = false;
      isGameOver = true;
      overlay.classList.remove('pf-hidden');
      msgEl.innerHTML = 'Game Over!<br>Press Space or Tap to Restart';
      
      let finalScore = Math.floor(score / 10);
      if (finalScore > hiScore) {
        hiScore = finalScore;
        localStorage.setItem('pf-star-hi', hiScore);
        hiEl.textContent = hiScore;
      }
    }
    
    // Controls
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        if(document.activeElement === gameCanvas || e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
           e.preventDefault();
           jump();
        }
      }
    });
    
    gameCanvas.parentElement.addEventListener('mousedown', (e) => {
      e.preventDefault();
      jump();
    });
    gameCanvas.parentElement.addEventListener('touchstart', (e) => {
      e.preventDefault();
      jump();
    }, {passive: false});
    
    // Init Draw
    gCtx.fillStyle = '#0d0e1a';
    gCtx.fillRect(0,0,600,200);
    star.y = 150 - star.h;
    drawStar();
  }

  /* ============================================================
     MAGIC MOUSE TRAIL
     ============================================================ */
  const trailCanvas = document.createElement('canvas');
  trailCanvas.id = 'pf-trail-canvas';
  trailCanvas.style.position = 'fixed';
  trailCanvas.style.top = '0';
  trailCanvas.style.left = '0';
  trailCanvas.style.width = '100vw';
  trailCanvas.style.height = '100vh';
  trailCanvas.style.pointerEvents = 'none';
  trailCanvas.style.zIndex = '9999';
  document.body.appendChild(trailCanvas);
  
  const tCtx = trailCanvas.getContext('2d');
  let tWidth, tHeight;
  function resizeTrail() {
    tWidth = trailCanvas.width = window.innerWidth;
    tHeight = trailCanvas.height = window.innerHeight;
  }
  resizeTrail();
  window.addEventListener('resize', resizeTrail);

  let mouse = { x: -1000, y: -1000 };
  let trailParticles = [];

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    // Spawn particles on move
    for(let i=0; i<3; i++) {
      trailParticles.push({
        x: mouse.x,
        y: mouse.y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 + 0.5,
        life: 1,
        color: Math.random() > 0.4 ? '#d4af37' : '#c39bd3',
        size: Math.random() * 2.5 + 0.5
      });
    }
  });

  function animateTrail() {
    tCtx.clearRect(0, 0, tWidth, tHeight);
    for (let i = trailParticles.length - 1; i >= 0; i--) {
      let p = trailParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.025;
      
      if (p.life <= 0) {
        trailParticles.splice(i, 1);
        continue;
      }
      
      tCtx.beginPath();
      // Draw tiny stars instead of circles for the trail
      let s = p.size * p.life * 1.5;
      tCtx.save();
      tCtx.translate(p.x, p.y);
      tCtx.rotate(p.life * Math.PI);
      for (let j = 0; j < 4; j++) {
        tCtx.rotate(Math.PI / 2);
        tCtx.moveTo(0, 0);
        tCtx.lineTo(s * 0.4, s * 0.4);
        tCtx.lineTo(0, s);
        tCtx.lineTo(-s * 0.4, s * 0.4);
      }
      tCtx.restore();
      
      tCtx.fillStyle = p.color;
      tCtx.globalAlpha = p.life;
      tCtx.shadowBlur = 8;
      tCtx.shadowColor = p.color;
      tCtx.fill();
    }
    tCtx.globalAlpha = 1;
    tCtx.shadowBlur = 0;
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

}); // end DOMContentLoaded
