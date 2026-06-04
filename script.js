/* ── RL CODEXA WEBSITE SCRIPTS ── */

// ── CUSTOM CURSOR ──
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mx = -100, my = -100, rx = -100, ry = -100;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
});

function animateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .course-card, .why-card, .highlight, .chk').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });
sections.forEach(s => observer.observe(s));

// ── HERO CANVAS PARTICLE NETWORK ──
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [], W, H;

function resizeCanvas() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((W * H) / 18000), 90);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
    });
  }
}
initParticles();

let mouseX = -1000, mouseY = -1000;
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

function drawParticles() {
  ctx.clearRect(0, 0, W, H);

  // Lines between close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,180,216,${0.15 * (1 - dist / 130)})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
    // Mouse connection
    const dx = particles[i].x - mouseX;
    const dy = particles[i].y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 160) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0,180,216,${0.3 * (1 - dist / 160)})`;
      ctx.lineWidth = 1;
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    }
  }

  // Dots
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,180,216,${p.alpha})`;
    ctx.fill();

    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
  });

  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── COUNTER ANIMATION ──
function animateCounter(el, target, suffix) {
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 4);
    el.textContent = Math.floor(ease * target);
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target), '');
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll(
  '.course-card, .why-card, .tl-step, .about-left, .about-right, .contact-info, .contact-form, .ci-item, .highlight, .av-card'
);
revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ── COURSE CARD COLORS ──
document.querySelectorAll('.course-card').forEach(card => {
  const c = card.dataset.color;
  if (c) card.style.setProperty('--c', c);
});
document.querySelectorAll('.why-card').forEach((card, i) => {
  const colors = ['#00B4D8','#06D6A0','#FF9900','#9B5DE5','#F72585','#FFD43B'];
  card.style.setProperty('--c', colors[i % colors.length]);
  card.querySelector('.why-icon').style.setProperty('--c', colors[i % colors.length]);
  card.querySelector('.why-icon').style.background = `${colors[i % colors.length]}18`;
  card.querySelector('.why-icon').style.borderColor = `${colors[i % colors.length]}28`;
});

// ── CONTACT FORM ──
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('.btn-primary');
  btn.textContent = 'Sending...';
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.textContent = 'Message Sent! ✓';
    btn.style.background = 'var(--green)';
    btn.style.opacity = '1';
    document.getElementById('formSuccess').style.display = 'block';
    this.querySelectorAll('input, textarea').forEach(el => el.value = '');
    this.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);
    setTimeout(() => {
      btn.textContent = 'Send Enquiry →';
      btn.style.background = '';
      document.getElementById('formSuccess').style.display = 'none';
    }, 4000);
  }, 1200);
});

// ── SMOOTH ANCHOR SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
