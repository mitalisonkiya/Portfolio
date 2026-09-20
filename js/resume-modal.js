/**
 * Interactive Resume Sheet Modal Controller
 * Allows recruiters & clients to view, inspect, and print/download the clean resume.
 */

(function () {
  const resumeModal = document.getElementById('resumeModal');

  window.openResumeModal = function () {
    if (!resumeModal) return;
    resumeModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeResumeModal = function () {
    if (!resumeModal) return;
    resumeModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.printResume = function () {
    window.print();
  };

  window.downloadResume = function () {
    // Triggers print or toast for PDF save
    window.print();
  };

  function init() {
    if (!resumeModal) return;

    // Close on backdrop click
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        window.closeResumeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeModal.classList.contains('open')) {
        window.closeResumeModal();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
