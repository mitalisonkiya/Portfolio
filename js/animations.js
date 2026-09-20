/**
 * Scroll Reveal Animations & Navigation Scroll Spy
 * Coordinates smooth viewport reveals, stagger sequences, and active nav link scrollspy.
 */

(function () {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Intersection Observer for Smooth Directional Scroll Reveals
  function initScrollReveals() {
    const selector = '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger';
    const revealElements = document.querySelectorAll(selector);
    if (!revealElements.length) return;

    if (isReducedMotion) {
      revealElements.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 2. Active Section Scroll Spy & Header Blur on Scroll
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.site-header');

    function onScroll() {
      const scrollPos = window.scrollY;

      // Header shadow / subtle elevation on scroll
      if (header) {
        if (scrollPos > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Highlight active nav link
      sections.forEach(section => {
        const top = section.offsetTop - 140;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveals();
    initScrollSpy();
  });
})();
