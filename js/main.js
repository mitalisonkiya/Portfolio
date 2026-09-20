/**
 * Main Navigation & Page Controller
 */

(function () {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  function setMenuState(open) {
    if (!mobileToggle || !navMenu) return;

    if (open) {
      navMenu.classList.add('open');
      if (navOverlay) navOverlay.classList.add('open');
      document.body.classList.add('menu-open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else {
      navMenu.classList.remove('open');
      if (navOverlay) navOverlay.classList.remove('open');
      document.body.classList.remove('menu-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    }
  }

  function initMobileMenu() {
    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      setMenuState(!isOpen);
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', () => setMenuState(false));
    }

    // Close menu when clicking nav links & smooth scroll
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            setMenuState(false);
            const headerOffset = 80;
            const targetPos = target.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({
              top: Math.max(0, targetPos),
              behavior: 'smooth'
            });
          }
        } else {
          setMenuState(false);
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        setMenuState(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        setMenuState(false);
      }
    });

    // Close menu if window is resized to desktop width
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        setMenuState(false);
      }
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', initMobileMenu);
})();
