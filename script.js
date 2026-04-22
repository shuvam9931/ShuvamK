/* ════════════════════════════════════════
   SHUVAM KUMAR — PORTFOLIO SCRIPTS
════════════════════════════════════════ */

/* ─── CURSOR ─── */
const curDot  = document.getElementById('cur-dot');
const curRing = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  curDot.style.left = mx + 'px';
  curDot.style.top  = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  curRing.style.left = rx + 'px';
  curRing.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

/* ─── THEME TOGGLE ─── */
const htmlEl   = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

function setTheme(t) {
  htmlEl.setAttribute('data-theme', t);
  themeBtn.textContent = t === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('sfTheme', t);
}
const savedTheme = localStorage.getItem('sfTheme');
if (savedTheme) setTheme(savedTheme);
themeBtn.addEventListener('click', () =>
  setTheme(htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
);

/* ─── MOBILE MENU ─── */
const mobileMenu = document.getElementById('mobileMenu');
document.getElementById('hamburger').addEventListener('click', () => mobileMenu.classList.add('open'));
document.getElementById('closeMenu').addEventListener('click',  () => mobileMenu.classList.remove('open'));
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ─── SCROLL: progress bar + nav shrink + scroll-top ─── */
const navEl  = document.getElementById('nav');
const goTop  = document.getElementById('goTop');
const pb     = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - innerHeight;
  pb.style.width = (scrolled / total * 100) + '%';
  navEl.classList.toggle('scrolled', scrolled > 60);
  goTop.classList.toggle('vis', scrolled > 400);
});

/* ─── COUNT-UP ANIMATION ─── */
function countUp(el) {
  const target = +el.dataset.target;
  const dur    = 2000;
  const step   = Math.max(20, dur / target);
  let current  = 0;
  const timer  = setInterval(() => {
    current++;
    el.textContent = current + (target === 100 ? '%' : '+');
    if (current >= target) clearInterval(timer);
  }, step);
}
let counted = false;
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !counted) {
      counted = true;
      document.querySelectorAll('.hstat-num[data-target]').forEach(countUp);
    }
  });
}, { threshold: 0.5 }).observe(document.getElementById('home'));

/* ─── SCROLL REVEAL ─── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal, .tl-item, .flip-card, .proj-flip').forEach(el =>
  revealObs.observe(el)
);

/* ─── ACTIVE NAV LINK ─── */
document.querySelectorAll('section[id]').forEach(sec => {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.45 }).observe(sec);
});

/* ─── PARTICLE CANVAS ─── */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let W, H, pts = [];

function resizeCanvas() {
  W = canvas.width  = innerWidth;
  H = canvas.height = innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function mkPt() {
  return {
    x:  Math.random() * W,
    y:  Math.random() * H,
    r:  Math.random() * 1.4 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    a:  Math.random() * 0.6 + 0.2
  };
}
for (let i = 0; i < 100; i++) pts.push(mkPt());

(function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  const isDark = htmlEl.getAttribute('data-theme') !== 'light';

  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = isDark
      ? `rgba(20,184,166,${p.a * 0.5})`
      : `rgba(13,148,136,${p.a * 0.3})`;
    ctx.fill();
  });

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = isDark
          ? `rgba(20,184,166,${(1 - d / 110) * 0.08})`
          : `rgba(13,148,136,${(1 - d / 110) * 0.05})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
})();

/* ─── TOAST HELPER ─── */
function showToast(type, icon, msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastMsg').textContent  = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 5000);
}

/* ════════════════════════════════════════
   CONTACT FORM — MAILTO (no backend needed)
   ─────────────────────────────────────────
   When the user clicks "Send Message":
   1. Reads name, email, message from the form
   2. Builds a mailto: link with everything pre-filled
      - To:      shuvam9931@gmail.com
      - CC:      the sender's email address
      - Subject: auto-generated with sender's name
      - Body:    name + email + message
   3. Opens the user's default mail client
      (Gmail, Outlook, Apple Mail, etc.)
   The user just hits SEND in their mail app — done!
════════════════════════════════════════ */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name    = document.getElementById('senderName').value.trim();
  const email   = document.getElementById('senderEmail').value.trim();
  const message = document.getElementById('senderMessage').value.trim();

  /* Basic validation */
  if (!name) {
    showToast('info', '⚠️', 'Please enter your name.');
    document.getElementById('senderName').focus();
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('info', '⚠️', 'Please enter a valid email address.');
    document.getElementById('senderEmail').focus();
    return;
  }
  if (!message) {
    showToast('info', '⚠️', 'Please write your message.');
    document.getElementById('senderMessage').focus();
    return;
  }

  /* Build mailto parts (encodeURIComponent handles special chars safely) */
  const TO      = 'shuvam9931@gmail.com';
  const CC      = encodeURIComponent(email);
  const SUBJECT = encodeURIComponent(`Portfolio Enquiry from ${name}`);
  const BODY    = encodeURIComponent(
    `Hi Shuvam,\n\n` +
    `You have received a new message from your portfolio:\n\n` +
    `─────────────────────────────\n` +
    `Name    : ${name}\n` +
    `Email   : ${email}\n` +
    `─────────────────────────────\n\n` +
    `Message :\n${message}\n\n` +
    `─────────────────────────────\n` +
    `Sent from shuvamkumar.dev portfolio`
  );

  /* Open mail client — pre-fills To, CC, Subject, Body */
  const mailtoLink = `mailto:${TO}?cc=${CC}&subject=${SUBJECT}&body=${BODY}`;
  window.location.href = mailtoLink;

  /* Show toast confirmation */
  showToast('success', '✅', 'Your mail app is opening with the message pre-filled. Just hit Send!');

  /* Reset form after a short delay */
  setTimeout(() => {
    document.getElementById('contactForm').reset();
  }, 1500);
});
