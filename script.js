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

document.querySelectorAll('a, button, .course-card, .why-card, .highlight, .chk, .internship-card, .apply-btn').forEach(el => {
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
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });
sections.forEach(s => navObserver.observe(s));

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
function animateCounter(el, target) {
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
        animateCounter(el, parseInt(el.dataset.target));
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll(
  '.course-card, .why-card, .tl-step, .about-left, .about-right, .contact-info, .contact-form, .ci-item, .highlight, .av-card, .internship-card, .certificate-showcase'
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

// ── COURSE TAB SWITCHER ──
document.querySelectorAll('.course-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.course-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const collegeGrid = document.getElementById('tabCollege');
    const alumniGrid  = document.getElementById('tabAlumni');
    const cibCollege  = document.getElementById('cibCollege');
    const cibAlumni   = document.getElementById('cibAlumni');
    if (target === 'college') {
      collegeGrid.classList.remove('cg-hidden');
      alumniGrid.classList.add('cg-hidden');
      cibCollege.classList.remove('cib-hidden');
      cibAlumni.classList.add('cib-hidden');
    } else {
      alumniGrid.classList.remove('cg-hidden');
      collegeGrid.classList.add('cg-hidden');
      cibAlumni.classList.remove('cib-hidden');
      cibCollege.classList.add('cib-hidden');
    }
    document.querySelectorAll('#tab' + target.charAt(0).toUpperCase() + target.slice(1) + ' .course-card').forEach((el, i) => {
      el.classList.remove('visible');
      el.style.transitionDelay = `${i * 60}ms`;
      setTimeout(() => el.classList.add('visible'), 30);
    });
  });
});

// ─────────────────────────────────────────────────────────────────
// ── EMAILJS CONFIG ──
const EMAILJS_PUBLIC_KEY       = 'Cfv_2Ej4erJhTeEmN';
const EMAILJS_SERVICE_ID       = 'service_9bz80v2';
const EMAILJS_TEMPLATE_ENQUIRY = 'template_pdmgrg8';   // 👈 College Enquiry
const EMAILJS_TEMPLATE_INTERN  = 'template_k712a7b';   // 👈 Internship Application
const OWNER_EMAIL              = 'rlcodexa@gmail.com';
// ─────────────────────────────────────────────────────────────────

// Initialize EmailJS
try {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
} catch (err) {
  console.error('EmailJS init failed:', err);
}

// ── Reusable EmailJS sender with proper error mapping ──
async function sendEmail(templateId, templateParams) {
  try {
    return await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      templateParams,
      { publicKey: EMAILJS_PUBLIC_KEY }
    );
  } catch (err) {
    const msg = (err && (err.text || err.message)) || 'Unknown error';
    console.error('EmailJS send error:', err);
    throw new Error(msg);
  }
}

function isGmailAuthError(err) {
  const text = (err?.text || err?.message || '').toString().toLowerCase();
  return (
    text.includes('invalid_grant') ||
    text.includes('invalid grant') ||
    text.includes('gmail_api') ||
    text.includes('reconnect your gmail')
  );
}

function handleEmailError(err, btn, errorBox, btnText) {
  btn.disabled = false;
  btn.style.opacity = '1';
  btn.innerHTML = `${btnText} <span class="btn-arrow">→</span>`;

  const message = isGmailAuthError(err)
    ? '⚠️ Email service is temporarily disconnected. Please email us directly at <strong>rlcodexa@gmail.com</strong> or call <strong>+91-6382605525</strong>.'
    : '❌ Something went wrong. Please try again or contact us directly at <strong>rlcodexa@gmail.com</strong>.';

  if (errorBox) {
    errorBox.innerHTML = message;
    errorBox.style.display = 'block';
  } else {
    alert(message.replace(/<[^>]+>/g, ''));
  }
}

// ── FORM MODE SWITCHER (Enquiry ↔ Internship) ──
const contactForm    = document.getElementById('contactForm');
const internshipForm = document.getElementById('internshipForm');
const contactHeading = document.getElementById('contactHeading');
const contactSub     = document.getElementById('contactSubtext');
const modeButtons    = document.querySelectorAll('.form-mode-btn');

function switchFormMode(mode, preselectTrack = null) {
  modeButtons.forEach(b => b.classList.toggle('active', b.dataset.mode === mode));

  if (mode === 'internship') {
    contactForm.classList.add('form-hidden');
    internshipForm.classList.remove('form-hidden');
    contactHeading.innerHTML = 'Apply for <span class="text-accent">Internship</span>';
    contactSub.textContent   = 'Submit your application — our team will get back within 48 hours.';

    if (preselectTrack) {
      const trackSelect = document.getElementById('internTrack');
      if (trackSelect) {
        for (let opt of trackSelect.options) {
          if (opt.value === preselectTrack) {
            trackSelect.value = preselectTrack;
            break;
          }
        }
      }
    }
  } else {
    internshipForm.classList.add('form-hidden');
    contactForm.classList.remove('form-hidden');
    contactHeading.innerHTML = 'Let\'s Partner <span class="text-accent">Your College</span>';
    contactSub.textContent   = 'Reach out to discuss a tie-up for the upcoming academic year.';
  }

  // Re-trigger reveal animation
  const activeForm = mode === 'internship' ? internshipForm : contactForm;
  activeForm.classList.remove('visible');
  setTimeout(() => activeForm.classList.add('visible'), 30);
}

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => switchFormMode(btn.dataset.mode));
});

// ── ENQUIRY FORM SUBMIT ──
contactForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = this;
  const btn  = form.querySelector('.btn-primary');
  const successBox = document.getElementById('formSuccess');
  const errorBox   = document.getElementById('formError');

  const courses = [...form.querySelectorAll('input[type=checkbox]:checked')]
    .map(el => el.value).join(', ') || 'None selected';

  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner"></span> Sending...';
  btn.style.opacity = '0.75';
  if (errorBox) errorBox.style.display = 'none';

  const templateParams = {
    from_name:    form.querySelector('input[type=text]').value,
    college_name: form.querySelectorAll('input[type=text]')[1].value,
    from_email:   form.querySelector('input[type=email]').value,
    phone:        form.querySelector('input[type=tel]').value || 'Not provided',
    courses:      courses,
    message:      form.querySelector('textarea').value || 'No message',
    time:         new Date().toLocaleString('en-IN', {
                     dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata'
                   }),
    to_email:     OWNER_EMAIL,
  };

  try {
    await sendEmail(EMAILJS_TEMPLATE_ENQUIRY, templateParams);

    btn.innerHTML = '✓ Enquiry Sent!';
    btn.style.background = 'var(--green)';
    btn.style.opacity = '1';
    successBox.style.display = 'block';
    form.querySelectorAll('input, textarea').forEach(el => el.value = '');
    form.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);

    setTimeout(() => {
      btn.innerHTML = 'Send Enquiry <span class="btn-arrow">→</span>';
      btn.style.background = '';
      btn.disabled = false;
      successBox.style.display = 'none';
    }, 5000);

  } catch (err) {
    handleEmailError(err, btn, errorBox, 'Send Enquiry');
  }
});

// ── INTERNSHIP FORM SUBMIT ──
internshipForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = this;
  const btn  = form.querySelector('.btn-primary');
  const successBox = document.getElementById('internSuccess');
  const errorBox   = document.getElementById('internError');

  const get = name => form.querySelector(`[name="${name}"]`);
  const checkedRadio = form.querySelector('[name="intern_duration"]:checked');

  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner"></span> Submitting...';
  btn.style.opacity = '0.75';
  if (errorBox) errorBox.style.display = 'none';

  const templateParams = {
    from_name:        get('intern_name').value,
    college_name:     get('intern_college').value,
    from_email:       get('intern_email').value,
    phone:            get('intern_phone').value,
    current_year:     get('intern_year').value,
    internship_track: get('intern_track').value,
    duration:         checkedRadio ? checkedRadio.value : 'Not selected',
    skills:           get('intern_skills').value   || 'Not provided',
    resume_link:      get('intern_resume').value   || 'Not provided',
    linkedin:         get('intern_linkedin').value || 'Not provided',
    message:          get('intern_message').value,
    time:             new Date().toLocaleString('en-IN', {
                         dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata'
                       }),
    to_email:         OWNER_EMAIL,
  };

  try {
    await sendEmail(EMAILJS_TEMPLATE_INTERN, templateParams);

    btn.innerHTML = '✓ Application Submitted!';
    btn.style.opacity = '1';
    successBox.style.display = 'block';
    form.reset();

    setTimeout(() => {
      btn.innerHTML = 'Submit Application <span class="btn-arrow">→</span>';
      btn.disabled = false;
      successBox.style.display = 'none';
    }, 6000);

  } catch (err) {
    handleEmailError(err, btn, errorBox, 'Submit Application');
  }
});

// ── SMOOTH ANCHOR SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target && !a.classList.contains('apply-btn') && a.id !== 'internshipCtaBtn') {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── INTERNSHIP APPLY BUTTONS - SWITCH FORM & PRE-SELECT TRACK ──
const internshipTrackMap = {
  'Software Dev Internship':  'Software Dev (Python/Full Stack/Java)',
  'AI/ML Internship':         'AI / ML',
  'Cloud & DevOps Internship':'Cloud & DevOps (AWS)',
};

// 1) Internship card "Apply" buttons
document.querySelectorAll('.internship-card').forEach(card => {
  const titleEl = card.querySelector('h3');
  if (!titleEl) return;
  const trackKey = titleEl.textContent.trim();
  const cardBtn = document.createElement('a');
  cardBtn.href = '#contact';
  cardBtn.className = 'apply-btn';
  cardBtn.innerHTML = 'Apply Now →';
  card.appendChild(cardBtn);

  cardBtn.addEventListener('click', e => {
    e.preventDefault();
    const preselect = internshipTrackMap[trackKey] || null;
    switchFormMode('internship', preselect);
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// 2) Main "Apply for Internship" CTA button
const ctaBtn = document.getElementById('internshipCtaBtn');
if (ctaBtn) {
  ctaBtn.addEventListener('click', e => {
    e.preventDefault();
    switchFormMode('internship', null);
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// 3) "Partner With Us" nav button → switch to enquiry form
document.querySelectorAll('a[href="#contact"]').forEach(link => {
  if (link.classList.contains('apply-btn') || link.id === 'internshipCtaBtn') return;
  link.addEventListener('click', () => {
    const activeMode = document.querySelector('.form-mode-btn.active');
    if (activeMode && activeMode.dataset.mode !== 'enquiry') {
      switchFormMode('enquiry');
    }
  });
});
