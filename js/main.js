/**
 * Mitali Sonkiya — Personal Portfolio Interactions & Animations
 * Features:
 * 0. Fast Kyokkou Gradient Page Loader (Northern Lights gradient, 120px bar, sessionStorage)
 * 1. Sticky Header Elevation
 * 2. Mobile Navigation Toggle
 * 3. Scroll Reveal Observer
 * 4. Scroll Progress Bar (2px ice-blue top bar)
 * 5. Cursor Spotlight (Desktop only, 60fps lerp, behind content)
 * 6. Stacked Project Cards (CSS sticky with scroll-linked scale down & dimming)
 * 7. Magnetic Buttons (8px cursor pull with spring easing, desktop only)
 * 8. Heading Text Scramble (600ms settling animation with screen reader accessibility)
 * Respects prefers-reduced-motion & mobile touch devices.
 */

(function () {
  // 0. ICE DOME PAGE LOADER CONTROLLER (0 to 100% counter & increased duration)
  const loaderEl = document.getElementById('pageLoader');
  const progressBarEl = document.getElementById('loaderProgressBar');
  const percentageEl = document.getElementById('loaderPercentage');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startTime = performance.now();

  let hasVisited = false;
  try {
    hasVisited = sessionStorage.getItem('portfolio_visited') === 'true';
  } catch (e) {
    hasVisited = false;
  }

  function startHeroAnimation() {
    document.body.classList.add('hero-loaded');
  }

  // If repeat visit in same session, skip loader immediately
  if (hasVisited && loaderEl) {
    loaderEl.style.display = 'none';
    startHeroAnimation();
  } else if (loaderEl) {
    // First visit: set flag in sessionStorage
    try {
      sessionStorage.setItem('portfolio_visited', 'true');
    } catch (e) {}

    let isPageLoaded = false;
    let isHeroImageLoaded = false;
    let isLoaderClosed = false;
    const targetDuration = prefersReducedMotion ? 400 : 2200; // ~2.2s smooth loading screen

    // Check hero image load state
    const heroImg = document.querySelector('.hanging-photo-frame img') || document.querySelector('img[src*="mitali_sonkiya"]');
    if (heroImg) {
      if (heroImg.complete) {
        isHeroImageLoaded = true;
      } else {
        heroImg.addEventListener('load', () => { isHeroImageLoaded = true; });
        heroImg.addEventListener('error', () => { isHeroImageLoaded = true; });
      }
    } else {
      isHeroImageLoaded = true;
    }

    if (document.readyState === 'complete') {
      isPageLoaded = true;
    } else {
      window.addEventListener('load', () => { isPageLoaded = true; });
    }

    function updateLoaderProgress(now) {
      if (isLoaderClosed) return;

      const elapsed = now - startTime;
      let rawProgress = Math.min(1, elapsed / targetDuration);

      // Ease progress slightly for natural pacing (smooth acceleration then decelerating near 99%)
      const easedProgress = Math.min(1, Math.pow(rawProgress, 0.85));
      const currentPercent = Math.min(100, Math.floor(easedProgress * 100));

      if (progressBarEl) {
        progressBarEl.style.transform = `scaleX(${easedProgress.toFixed(4)})`;
      }
      if (percentageEl) {
        percentageEl.textContent = `${currentPercent}%`;
      }

      const isReadyToComplete = (elapsed >= targetDuration) && isPageLoaded && isHeroImageLoaded;

      if (isReadyToComplete || elapsed >= 3200) {
        // Complete to 100%
        if (progressBarEl) progressBarEl.style.transform = 'scaleX(1)';
        if (percentageEl) percentageEl.textContent = '100%';
        closeLoader();
      } else {
        requestAnimationFrame(updateLoaderProgress);
      }
    }

    function closeLoader() {
      if (isLoaderClosed) return;
      isLoaderClosed = true;

      // Small pause at 100% for satisfying visual feedback
      setTimeout(() => {
        if (loaderEl) {
          loaderEl.classList.add('is-hidden');
        }

        // Trigger hero reveal right as loader begins sliding up
        setTimeout(startHeroAnimation, 180);

        // Remove loader after animation finishes
        setTimeout(() => {
          if (loaderEl) {
            loaderEl.style.display = 'none';
          }
        }, 750);
      }, prefersReducedMotion ? 60 : 160);
    }

    requestAnimationFrame(updateLoaderProgress);
  } else {
    startHeroAnimation();
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const isTouchDevice = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. STICKY HEADER ELEVATION
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. MOBILE NAVIGATION TOGGLE
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-resume-btn');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. SCROLL REVEAL OBSERVER
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-visible'));
  }

  // 4. SCROLL PROGRESS BAR (2px Ice-Blue)
  function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar || prefersReducedMotion) return;

    function updateProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;
    }

    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateProgress);
    }, { passive: true });

    updateProgress();
  }
  initScrollProgress();

  // 5. CURSOR SPOTLIGHT (Desktop Only)
  function initCursorSpotlight() {
    if (isTouchDevice || prefersReducedMotion) return;

    const spotlight = document.getElementById('cursorSpotlight');
    if (!spotlight) return;

    let mouseX = -500, mouseY = -500;
    let spotX = -500, spotY = -500;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        spotlight.style.opacity = '1';
      }
    }, { passive: true });

    function renderSpotlight() {
      // 400px diameter -> center offset by -200px
      spotX += (mouseX - 200 - spotX) * 0.09;
      spotY += (mouseY - 200 - spotY) * 0.09;

      spotlight.style.transform = `translate3d(${spotX.toFixed(2)}px, ${spotY.toFixed(2)}px, 0)`;

      requestAnimationFrame(renderSpotlight);
    }
    requestAnimationFrame(renderSpotlight);
  }
  initCursorSpotlight();

  // 6. STACKED PROJECT CARDS WITH SCALE & DIMMING (Desktop Only)
  function initStackedCards() {
    if (isTouchDevice || prefersReducedMotion) return;

    const cards = Array.from(document.querySelectorAll('.project-card'));
    if (cards.length === 0) return;

    function updateCardStack() {
      if (window.innerWidth <= 992) {
        cards.forEach(card => {
          card.style.transform = '';
          card.style.opacity = '';
          card.style.filter = '';
        });
        return;
      }

      const windowHeight = window.innerHeight;

      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;

        const nextCard = cards[i + 1];
        const nextRect = nextCard.getBoundingClientRect();
        const stickyTop = 90 + i * 20;

        if (nextRect.top < windowHeight && nextRect.top > stickyTop) {
          const totalDistance = windowHeight - stickyTop;
          const currentDistance = nextRect.top - stickyTop;
          const progress = Math.max(0, Math.min(1, 1 - currentDistance / totalDistance));

          const scale = 1 - progress * 0.05;
          const opacity = 1 - progress * 0.45;
          const brightness = 1 - progress * 0.25;

          card.style.transform = `scale(${scale.toFixed(3)})`;
          card.style.opacity = `${opacity.toFixed(2)}`;
          card.style.filter = `brightness(${brightness.toFixed(2)})`;
        } else if (nextRect.top <= stickyTop) {
          card.style.transform = `scale(0.95)`;
          card.style.opacity = `0.55`;
          card.style.filter = `brightness(0.75)`;
        } else {
          card.style.transform = `scale(1)`;
          card.style.opacity = `1`;
          card.style.filter = `none`;
        }
      });
    }

    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateCardStack);
    }, { passive: true });

    window.addEventListener('resize', updateCardStack, { passive: true });
    updateCardStack();
  }
  initStackedCards();

  // 7. MAGNETIC BUTTONS (Desktop Only)
  function initMagneticButtons() {
    if (isTouchDevice || prefersReducedMotion) return;

    const magneticBtns = document.querySelectorAll('.btn-primary');

    magneticBtns.forEach(btn => {
      let animationFrame = null;
      let targetX = 0, targetY = 0;
      let currentX = 0, currentY = 0;
      let isHovered = false;

      function animate() {
        currentX += (targetX - currentX) * 0.22;
        currentY += (targetY - currentY) * 0.22;

        btn.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

        if (isHovered || Math.abs(currentX) > 0.08 || Math.abs(currentY) > 0.08) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          btn.style.transform = '';
          animationFrame = null;
        }
      }

      btn.addEventListener('mousemove', (e) => {
        isHovered = true;
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // Up to 8px smooth magnetic pull
        targetX = Math.max(-8, Math.min(8, deltaX * 0.28));
        targetY = Math.max(-8, Math.min(8, deltaY * 0.28));

        if (!animationFrame) {
          animationFrame = requestAnimationFrame(animate);
        }
      });

      btn.addEventListener('mouseleave', () => {
        isHovered = false;
        targetX = 0;
        targetY = 0;
      });
    });
  }
  initMagneticButtons();

  // 8. HEADING TEXT SCRAMBLE (~600ms, Accessible with aria-label, Plays Once)
  function initHeadingScramble() {
    const headings = document.querySelectorAll('.section-title, .contact-title');
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_#*/<>[]~+=!';

    headings.forEach(heading => {
      const cleanText = heading.textContent.replace(/\s+/g, ' ').trim();
      heading.setAttribute('aria-label', cleanText);

      if (prefersReducedMotion) return;

      const originalNodes = Array.from(heading.childNodes).map(node => node.cloneNode(true));

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            obs.unobserve(entry.target);
            runScramble(heading, originalNodes, cleanText);
          }
        });
      }, { threshold: 0.15 });

      observer.observe(heading);
    });

    function runScramble(heading, originalNodes, cleanText) {
      const duration = 600;
      const startTime = performance.now();
      const length = cleanText.length;

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);

        if (progress >= 1) {
          heading.textContent = '';
          originalNodes.forEach(node => heading.appendChild(node.cloneNode(true)));
          return;
        }

        const settledCount = Math.floor(progress * length);
        let output = '';

        for (let i = 0; i < length; i++) {
          if (cleanText[i] === ' ') {
            output += ' ';
          } else if (i < settledCount) {
            output += cleanText[i];
          } else {
            output += glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        }

        heading.textContent = output;
        requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }
  }
  initHeadingScramble();
});
