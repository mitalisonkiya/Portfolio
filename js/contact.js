/**
 * Contact Form Controller, Copy-to-Clipboard & Abuse Protection
 */

(function () {
  const contactForm = document.getElementById('contactForm');
  const toastEl = document.getElementById('globalToast');
  const toastMessage = document.getElementById('globalToastMsg');

  // Client-Side Abuse Prevention Cooldown
  let lastSubmitTime = 0;
  const SUBMIT_COOLDOWN_MS = 8000; // 8-second client cooldown between submissions

  // Show Toast Notification
  window.showToast = function (message, duration = 3500) {
    if (!toastEl) return;
    if (toastMessage) toastMessage.innerText = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, duration);
  };

  // 1-Click Copy to Clipboard
  window.copyToClipboard = function (text, element) {
    navigator.clipboard.writeText(text).then(() => {
      const originalText = element.innerHTML;
      element.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      element.style.background = '#10b981';
      element.style.color = '#022c22';
      
      showToast(`Copied "${text}" to clipboard!`);

      setTimeout(() => {
        element.innerHTML = originalText;
        element.style.background = '';
        element.style.color = '';
      }, 2000);
    }).catch(() => {
      showToast("Unable to copy to clipboard");
    });
  };

  // Form Submission Handler with Anti-Abuse Controls
  function handleFormSubmit(e) {
    e.preventDefault();

    // 1. Anti-Bot Honeypot Check (Hidden field that only bots fill)
    const honeypot = document.getElementById('website_hp');
    if (honeypot && honeypot.value.trim().length > 0) {
      // Silently drop bot submission
      showToast("Message sent successfully!");
      contactForm.reset();
      return;
    }

    // 2. Client-Side Rate Limit / Cooldown
    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((SUBMIT_COOLDOWN_MS - (now - lastSubmitTime)) / 1000);
      showToast(`Please wait ${remainingSeconds}s before sending another message.`);
      return;
    }

    const name = document.getElementById('formName')?.value.trim() || '';
    const email = document.getElementById('formEmail')?.value.trim() || '';
    const message = document.getElementById('formMessage')?.value.trim() || '';

    // 3. Input validation & length limits
    if (!name || !email || !message) {
      showToast("Please fill in all required fields.");
      return;
    }

    if (name.length > 80 || email.length > 120 || message.length > 2000) {
      showToast("Input exceeds allowed length limit.");
      return;
    }

    lastSubmitTime = now;
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send';
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';
      submitBtn.disabled = true;
    }

    // Simulate sending
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sent Successfully!';
        submitBtn.style.background = '#10b981';
        submitBtn.style.color = '#022c22';
      }

      // Confetti celebration
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 }
        });
      }

      showToast(`Thank you ${name}! Your message has been received.`);
      contactForm.reset();

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
        }
      }, 3500);
    }, 1000);
  }

  function init() {
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
