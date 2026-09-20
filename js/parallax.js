/**
 * Multi-Layer Parallax Engine, 3D Tilt Cards, Spotlight Mouse Illumination & Custom Cursor
 */

(function () {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Top Scroll Progress Bar
  function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    function updateProgress() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        progressBar.style.width = '0%';
        return;
      }
      const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      progressBar.style.width = `${progress.toFixed(2)}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  // 2. Multi-Layer Parallax Scroll Engine
  function initParallaxScroll() {
    if (isReducedMotion) return;

    const parallaxElements = document.querySelectorAll('[data-parallax-depth]');
    if (!parallaxElements.length) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // When at the very top, reset cleanly
      if (scrollY <= 5) {
        parallaxElements.forEach(el => {
          el.style.transform = '';
        });
        ticking = false;
        return;
      }

      parallaxElements.forEach(el => {
        const depth = parseFloat(el.getAttribute('data-parallax-depth')) || 0.1;
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distanceToCenter = elementCenter - windowHeight / 2;
        const translateY = distanceToCenter * depth * -1;

        el.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // 3. Dynamic Card Spotlight Mouse Reflection
  function initSpotlightCards() {
    if (isReducedMotion || window.innerWidth < 900) return;

    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
        card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
      });
    });
  }

  // 4. Interactive 3D Tilt Effect with Multi-Depth Layering
  function init3DTiltCards() {
    if (isReducedMotion || window.innerWidth < 900) return;

    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
      const depthPills = card.querySelectorAll('[data-tilt-depth]');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6; // max 6deg for tasteful luxury
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`;

        // Counter-parallax depth for floating pill badges
        depthPills.forEach(pill => {
          const depthZ = parseFloat(pill.getAttribute('data-tilt-depth')) || 40;
          const shiftX = ((x - centerX) / centerX) * 4;
          const shiftY = ((y - centerY) / centerY) * 4;
          pill.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, ${depthZ}px)`;
        });
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        depthPills.forEach(pill => {
          pill.style.transform = '';
        });
      });
    });
  }

  // 5. Smooth Custom Minimal Cursor Follower
  function initCursorFollower() {
    if (isReducedMotion || window.innerWidth < 900) return;

    const dot = document.querySelector('.cursor-dot');
    if (!dot) return;

    let mouseX = -100, mouseY = -100;
    let dotX = -100, dotY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function renderCursor() {
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;
      dot.style.left = `${dotX.toFixed(1)}px`;
      dot.style.top = `${dotY.toFixed(1)}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Subtle expansion on interactive elements
    const hoverables = document.querySelectorAll('a, button, .project-header-btn, .chip, .floating-pill, .tilt-card');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(2.4)';
        dot.style.opacity = '0.7';
        dot.style.boxShadow = '0 0 12px var(--accent-glow)';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
        dot.style.opacity = '1';
        dot.style.boxShadow = 'none';
      });
    });
  }

  // 6. Section Depth Reveal via IntersectionObserver
  function initDepthReveals() {
    const depthSections = document.querySelectorAll('.depth-section');
    if (!depthSections.length) return;

    if (isReducedMotion) {
      depthSections.forEach(s => s.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    depthSections.forEach(s => observer.observe(s));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initParallaxScroll();
    initSpotlightCards();
    init3DTiltCards();
    initCursorFollower();
    initDepthReveals();
  });
})();
