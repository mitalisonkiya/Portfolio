/**
 * Luxury Editorial Preloader Controller
 * Handles animated progress, dynamic state messages, and smooth exit curtain transition.
 */

(function () {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('is-loading');

  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloaderBar');
  const percentEl = document.getElementById('preloaderPercent');
  const statusEl = document.getElementById('preloaderStatus');

  if (!preloader) {
    document.body.classList.remove('is-loading');
    return;
  }

  // If user prefers reduced motion, skip quickly
  if (isReducedMotion) {
    setTimeout(() => {
      preloader.classList.add('loaded');
      document.body.classList.remove('is-loading');
    }, 150);
    return;
  }

  let currentPercent = 0;
  const targetDuration = 1350; // ~1.35 seconds for crisp, elegant experience
  const startTime = performance.now();

  const statusMessages = [
    { at: 0, text: 'INITIALIZING SYSTEM...' },
    { at: 28, text: 'COMPILING 3D CONSTELLATION...' },
    { at: 62, text: 'PREPARING ASSETS & LAYOUT...' },
    { at: 88, text: 'CALIBRATING INTERACTIONS...' },
    { at: 98, text: 'EXPERIENCE READY' }
  ];

  function getStatusText(percent) {
    let msg = statusMessages[0].text;
    for (let i = 0; i < statusMessages.length; i++) {
      if (percent >= statusMessages[i].at) {
        msg = statusMessages[i].text;
      }
    }
    return msg;
  }

  function updatePreloader(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / targetDuration);
    
    // Ease out cubic progress curve
    const eased = 1 - Math.pow(1 - progress, 3);
    currentPercent = Math.min(100, Math.floor(eased * 100));

    if (bar) bar.style.width = `${currentPercent}%`;
    if (percentEl) percentEl.textContent = `${String(currentPercent).padStart(2, '0')}%`;
    if (statusEl) statusEl.textContent = getStatusText(currentPercent);
    preloader.setAttribute('aria-valuenow', String(currentPercent));

    if (progress < 1) {
      requestAnimationFrame(updatePreloader);
    } else {
      // Complete and dismiss
      if (bar) bar.style.width = '100%';
      if (percentEl) percentEl.textContent = '100%';
      if (statusEl) statusEl.textContent = 'WELCOME';

      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.classList.remove('is-loading');

        // Trigger hero animations if needed
        const heroAnimElements = document.querySelectorAll('.animate-hero, .animate-hero-card');
        heroAnimElements.forEach(el => {
          el.style.animationPlayState = 'running';
        });
      }, 260);
    }
  }

  requestAnimationFrame(updatePreloader);

  // Safety fallback to guarantee preloader is always dismissed
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (!preloader.classList.contains('loaded')) {
        preloader.classList.add('loaded');
        document.body.classList.remove('is-loading');
      }
    }, 2200);
  });
})();
