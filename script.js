/* ═══════════════════════════════════════════════════════════
   SHUVAM KUMAR  —  script.js
   Loader · Dark/Light Theme · Cursor · Navbar · Parallax
   Particles · Scroll Reveal · Counters · Typing · Flip Cards
   Contact Form
═══════════════════════════════════════════════════════════ */
'use strict';

/* ══════════════════════════════════════
   1.  LOADER
══════════════════════════════════════ */
(function () {
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loaderBar');
  const msg    = document.getElementById('loaderMsg');

  const steps = [
    'Initializing Salesforce environment...',
    'Loading Apex classes...',
    'Connecting SAP integration...',
    'Deploying Lightning components...',
    'Portfolio ready!'
  ];

  let pct = 0, step = 0;

  const iv = setInterval(() => {
    pct += Math.random() * 20 + 8;
    if (pct > 100) pct = 100;
    bar.style.width = pct + '%';

    const idx = Math.floor((pct / 100) * steps.length);
    if (idx !== step && idx < steps.length) { step = idx; msg.textContent = steps[idx]; }

    if (pct >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        loader.classList.add('gone');
        revealHero();
      }, 350);
    }
  }, 110);
})();

function revealHero() {
  document.querySelectorAll('.hero .fade-up, .hero .fade-right').forEach((el, i) => {
    setTimeout(() => el.classList.add('vis'), i * 110);
  });
}


/* ══════════════════════════════════════
   2.  ★ DARK / LIGHT THEME TOGGLE ★
══════════════════════════════════════ */
(function () {
  const btn  = document.getElementById('themeBtn');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;

  // Restore saved preference
  const saved = localStorage.getItem('sk-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  icon.textContent = saved === 'dark' ? '🌙' : '☀️';

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    icon.textContent = next === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('sk-theme', next);
  });
})();

/* ══════════════════════════════════════
   3.  CUSTOM CURSOR
══════════════════════════════════════ */
(function () {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();

  // Grow on interactive elements
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .flip-card, .proj-flip, .glass-card, .chip')) {
      dot.style.width = dot.style.height = '18px';
      ring.style.width = ring.style.height = '52px';
      ring.style.borderColor = 'rgba(0,196,240,.7)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .flip-card, .proj-flip, .glass-card, .chip')) {
      dot.style.width = dot.style.height = '10px';
      ring.style.width = ring.style.height = '36px';
      ring.style.borderColor = '';
    }
  });

  // Hide on touch devices
  document.addEventListener('touchstart', () => {
    dot.style.display = ring.style.display = 'none';
  }, { once: true });
})();

/* ══════════════════════════════════════
   4.  NAVBAR  (scroll effect + active links + mobile)
══════════════════════════════════════ */
(function () {
  const nav     = document.getElementById('navbar');
  const burger  = document.getElementById('burger');
  const drawer  = document.getElementById('mobDrawer');
  const overlay = document.getElementById('mobOverlay');
  const close   = document.getElementById('mobClose');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    setActiveLink();
  }, { passive: true });

  // Mobile open / close
  function openMenu()  { drawer.classList.add('open'); overlay.classList.add('show'); burger.classList.add('open'); }
  function closeMenu() { drawer.classList.remove('open'); overlay.classList.remove('show'); burger.classList.remove('open'); }

  burger  && burger.addEventListener('click',  openMenu);
  close   && close.addEventListener('click',   closeMenu);
  overlay && overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMenu));

  // Active nav link
  function setActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 180) cur = s.id; });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
    });
  }

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ══════════════════════════════════════
   5.  PARTICLES (Hero canvas)
══════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('ptcCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const N = 65;
  const pts = Array.from({ length: N }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - .5) * .45,
    vy: -(Math.random() * .5 + .15),
    r:  Math.random() * 1.6 + .4,
    a:  0, ma: Math.random() * .45 + .08, fs: Math.random() * .007 + .003,
    c:  Math.random() > .5 ? '0,196,240' : '0,112,210'
  }));

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Connection lines
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 110) {
          ctx.save();
          ctx.globalAlpha = (1 - d/110) * .11;
          ctx.strokeStyle = '#00c4f0'; ctx.lineWidth = .6;
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke(); ctx.restore();
        }
      }
    }
    // Particles
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -8) { p.y = canvas.height + 8; p.x = Math.random() * canvas.width; }
      if (p.a < p.ma) p.a += p.fs;
      ctx.save(); ctx.globalAlpha = p.a;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgb(${p.c})`; ctx.fill(); ctx.restore();
    });
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ══════════════════════════════════════
   6.  SCROLL REVEAL
══════════════════════════════════════ */
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('vis');
      // Animate skill bars when the flip-back becomes visible via JS scroll
      e.target.querySelectorAll('.sf[data-w]').forEach((b, i) => {
        setTimeout(() => { b.style.width = b.dataset.w + '%'; }, i * 100 + 200);
      });
      // Animate counters
      e.target.querySelectorAll('.hst-n[data-target], .ach-n[data-target]').forEach(el => {
        if (!el.dataset.counted) animCount(el, +el.dataset.target);
      });
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => io.observe(el));
})();

/* ══════════════════════════════════════
   7.  COUNTER ANIMATION
══════════════════════════════════════ */
function animCount(el, target) {
  el.dataset.counted = '1';
  let start = null;
  const dur = 1600;
  (function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
    el.textContent = Math.floor(e * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  })(performance.now());
}

/* ══════════════════════════════════════
   8.  TYPING EFFECT (hero role)
══════════════════════════════════════ */
(function () {
  const el = document.getElementById('typedRole');
  if (!el) return;
  const roles = ['Developer & Administrator', 'Apex Engineer', 'LWC Builder', 'SAP Integrator', 'CRM Specialist'];
  let ri = 0, ci = 0, del = false, timer;

  function tick() {
    const cur = roles[ri];
    if (del) {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; timer = setTimeout(tick, 400); return; }
    } else {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del = true; timer = setTimeout(tick, 2000); return; }
    }
    timer = setTimeout(tick, del ? 55 : 90);
  }

  setTimeout(tick, 1200);
})();

/* ══════════════════════════════════════
   9.  FLIP CARD — animate bars on hover
══════════════════════════════════════ */
document.querySelectorAll('.flip-card').forEach(card => {
  const bars = card.querySelectorAll('.sf[data-w]');
  card.addEventListener('mouseenter', () => {
    bars.forEach((b, i) => {
      b.style.width = '0%';
      setTimeout(() => { b.style.width = b.dataset.w + '%'; }, i * 100 + 80);
    });
  });
});

/* ══════════════════════════════════════
   10.  PARALLAX — extra depth on JS side
   (CSS background-attachment:fixed does
    the main work; JS adds subtle scale)
══════════════════════════════════════ */
(function () {
  const bgs = document.querySelectorAll('.parallax-bg');
  let tick  = false;

  window.addEventListener('scroll', () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => {
      bgs.forEach(bg => {
        const sec  = bg.parentElement;
        const rect = sec.getBoundingClientRect();
        const vh   = window.innerHeight;
        if (rect.bottom < -100 || rect.top > vh + 100) { tick = false; return; }
        // Gentle extra layer beyond CSS fixed
        const prog = rect.top / (vh + rect.height); // -1 → 1
        bg.style.transform = `translateY(${prog * 18}px) scale(1.08)`;
      });
      tick = false;
    });
  }, { passive: true });
})();

/* ══════════════════════════════════════
   11.  HERO CARD — mouse parallax
══════════════════════════════════════ */
(function () {
  const card = document.querySelector('.hero-card');
  const hero = document.getElementById('home');
  if (!card || !hero) return;

  hero.addEventListener('mousemove', e => {
    const cx = hero.offsetWidth / 2, cy = hero.offsetHeight / 2;
    const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
    card.style.animation   = 'none';
    card.style.transform   = `perspective(900px) rotateY(${dx * 9}deg) rotateX(${-dy * 6}deg) translateY(-6px)`;
  });
  hero.addEventListener('mouseleave', () => {
    card.style.animation = '';
    card.style.transform = '';
  });
})();

/* ══════════════════════════════════════
   12.  CONTACT FORM
══════════════════════════════════════ */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('fname').value.trim();
    const mail = document.getElementById('femail').value.trim();
    const msg  = document.getElementById('fmsg').value.trim();

    if (!name || !mail || !msg) { alert('Please fill in all fields.'); return; }

    const sub  = encodeURIComponent(`Portfolio Enquiry from ${name}`);
    const body = encodeURIComponent(
      `Hi Shuvam,\n\nMy name is ${name} (${mail}).\n\n${msg}\n\nBest regards,\n${name}`
    );
    window.location.href = `mailto:shuvam9931@gmail.com?subject=${sub}&body=${body}`;
  });
})();

/* ══════════════════════════════════════
   13.  KEYBOARD ACCESSIBILITY
══════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const drawer  = document.getElementById('mobDrawer');
    const overlay = document.getElementById('mobOverlay');
    const burger  = document.getElementById('burger');
    drawer?.classList.remove('open');
    overlay?.classList.remove('show');
    burger?.classList.remove('open');
  }
});

/* ══════════════════════════════════════
   14.  CONSOLE EASTER EGG
══════════════════════════════════════ */
console.log('%c👋 Hey Recruiter!', 'font-size:22px;font-weight:900;color:#00c4f0');
console.log('%cThis portfolio belongs to Shuvam Kumar — Salesforce Developer & Administrator.', 'font-size:14px;color:#8b949e');
console.log('%c📧 shuvam9931@gmail.com  |  📱 +91 9939364141', 'font-size:13px;color:#0070d2;font-weight:600');
console.log('%c🌐 shuvam9931.github.io/ShuvamK', 'font-size:13px;color:#0070d2');
