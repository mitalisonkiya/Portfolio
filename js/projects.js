/**
 * Expandable Projects List (Accordion Controller)
 * Ensures only one project is expanded at a time and maintains full accessibility.
 */

(function () {
  function initProjectsAccordion() {
    const projectItems = document.querySelectorAll('.project-item');

    projectItems.forEach(item => {
      const btn = item.querySelector('.project-header-btn');
      const drawer = item.querySelector('.project-drawer');
      if (!btn || !drawer) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all items first (Accordion behavior: only one open at a time)
        projectItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.project-header-btn');
          if (otherBtn) {
            otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle clicked item
        if (!isOpen) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initProjectsAccordion);
})();
