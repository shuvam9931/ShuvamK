/* ==========================================================================
   SHUVAM KUMAR — OSMO PARALLAX + LENIS + SALESFORCE PORTFOLIO ENGINE
   Strictly validated JavaScript (all statements end with explicit semicolons)
   ========================================================================== */
'use strict';

document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger failed to load.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------------------
     0. DARK / LIGHT THEME TOGGLE (SAVED IN LOCALSTORAGE)
     ------------------------------------------------------------------------ */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeToggleIcon = document.getElementById('themeToggleIcon');
  const htmlEl = document.documentElement;

  const savedTheme = localStorage.getItem('shuvam-sf-theme') || 'light';
  htmlEl.setAttribute('data-theme', savedTheme);
  if (themeToggleIcon) {
    themeToggleIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const currentTheme = htmlEl.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      htmlEl.setAttribute('data-theme', nextTheme);
      localStorage.setItem('shuvam-sf-theme', nextTheme);
      if (themeToggleIcon) {
        themeToggleIcon.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
      }
    });
  }

  /* ------------------------------------------------------------------------
     1. LENIS SMOOTH SCROLLING + OSMO 4-LAYER MOUNTAIN PARALLAX
     (Exact yPercent: 70, 55, 40, 10 from your prompt)
     ------------------------------------------------------------------------ */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  const triggerElement = document.querySelector('[data-parallax-layers]');
  if (triggerElement) {
    const osmoTl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: '0% 0%',
        end: '100% 0%',
        scrub: 0
      }
    });

    const layers = [
      { layer: '1', yPercent: 70 },
      { layer: '2', yPercent: 55 },
      { layer: '3', yPercent: 40 },
      { layer: '4', yPercent: 10 }
    ];

    layers.forEach(function (layerObj, idx) {
      const targetNodes = triggerElement.querySelectorAll('[data-parallax-layer="' + layerObj.layer + '"]');
      if (targetNodes.length > 0) {
        osmoTl.to(
          targetNodes,
          {
            yPercent: layerObj.yPercent,
            ease: 'none'
          },
          idx === 0 ? undefined : '<'
        );
      }
    });
  }

  /* ------------------------------------------------------------------------
     2. SALESFORCE HERO SECTION PARALLAX (SCROLL + MOUSE FLOAT)
     ------------------------------------------------------------------------ */
  const heroSection = document.getElementById('hero');
  const parallaxLayers = document.querySelectorAll('[data-parallax-speed]');

  parallaxLayers.forEach(function (layer) {
    const speedAttr = layer.getAttribute('data-parallax-speed');
    const speed = parseFloat(speedAttr) || 0.2;

    gsap.to(layer, {
      y: function () {
        return window.innerHeight * speed;
      },
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  if (heroSection && window.innerWidth > 768) {
    heroSection.addEventListener('mousemove', function (e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;

      gsap.to('.float-pill', {
        x: x,
        y: y,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power2.out'
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. SCROLL-DRIVEN CAMERA ZOOM:
        App Dock -> Zoom Into Salesforce -> Move to SAP -> Zoom Out
     ------------------------------------------------------------------------ */
  const launcherView = document.getElementById('launcherView');
  const sfAppWindow = document.getElementById('sfAppWindow');
  const sapAppWindow = document.getElementById('sapAppWindow');

  const stepDock = document.getElementById('stepDock');
  const stepSf = document.getElementById('stepSf');
  const stepSap = document.getElementById('stepSap');
  const stepExit = document.getElementById('stepExit');

  function setHudStep(activeEl) {
    const steps = [stepDock, stepSf, stepSap, stepExit];
    steps.forEach(function (el) {
      if (el) {
        el.classList.remove('active');
      }
    });
    if (activeEl) {
      activeEl.classList.add('active');
    }
  }

  const zoomTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#app-zoom-stage',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8
    }
  });

  // STEP 1: Highlight Salesforce Tile on the App Launcher Dock & Zoom In
  zoomTl.call(function () {
    setHudStep(stepDock);
  });

  zoomTl.to('#sfAppIcon', {
    scale: 1.18,
    borderColor: '#0176D3',
    boxShadow: '0 12px 30px rgba(1, 118, 211, 0.25)',
    duration: 0.6
  });

  zoomTl.to(launcherView, {
    scale: 2.4,
    opacity: 0,
    pointerEvents: 'none',
    duration: 1.2,
    ease: 'power2.inOut'
  });

  // STEP 2: Reveal & Hold the Salesforce Achievements App Window
  zoomTl.call(function () {
    setHudStep(stepSf);
  });

  zoomTl.fromTo(
    sfAppWindow,
    {
      scale: 0.65,
      opacity: 0,
      pointerEvents: 'none'
    },
    {
      scale: 1,
      opacity: 1,
      pointerEvents: 'auto',
      duration: 1.2,
      ease: 'power2.out'
    },
    '-=0.5'
  );

  zoomTl.to(sfAppWindow, {
    scale: 1.02,
    duration: 1.8
  });

  // STEP 3: Pan Left Out of Salesforce App & Slide in SAP Integration App
  zoomTl.to(sfAppWindow, {
    xPercent: -110,
    scale: 0.85,
    opacity: 0,
    pointerEvents: 'none',
    duration: 1.4,
    ease: 'power2.inOut'
  });

  zoomTl.call(function () {
    setHudStep(stepSap);
  });

  zoomTl.fromTo(
    sapAppWindow,
    {
      xPercent: 110,
      scale: 0.85,
      opacity: 0,
      pointerEvents: 'none'
    },
    {
      xPercent: 0,
      scale: 1,
      opacity: 1,
      pointerEvents: 'auto',
      duration: 1.4,
      ease: 'power2.inOut'
    },
    '<'
  );

  zoomTl.to('.code-editor-card', {
    scale: 1.02,
    boxShadow: '0 24px 60px rgba(1, 118, 211, 0.28)',
    duration: 1.8
  });

  // STEP 4: Zoom Out Cleanly from SAP App to Exit into Projects & Contact
  zoomTl.call(function () {
    setHudStep(stepExit);
  });

  zoomTl.to(sapAppWindow, {
    scale: 0.55,
    y: -60,
    opacity: 0,
    pointerEvents: 'none',
    duration: 1.4,
    ease: 'power2.in'
  });

  /* ------------------------------------------------------------------------
     4. CONTACT FORM MAILTO HANDLER
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('fname');
      const emailInput = document.getElementById('femail');
      const msgInput = document.getElementById('fmsg');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const msg = msgInput ? msgInput.value.trim() : '';

      if (!name || !email || !msg) {
        alert('Please fill in all required fields.');
        return;
      }

      const subject = encodeURIComponent('Salesforce Portfolio Inquiry from ' + name);
      const body = encodeURIComponent(
        'Hi Shuvam,\n\nMy name is ' + name + ' (' + email + ').\n\n' + msg + '\n\nBest regards,\n' + name
      );

      window.location.href = 'mailto:shuvam9931@gmail.com?subject=' + subject + '&body=' + body;
    });
  }
});
