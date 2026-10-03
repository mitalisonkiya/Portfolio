/**
 * Mitali Sonkiya — Interactive Hanging Photo Card
 * Natural pendulum & spring physics with drop-in bounce, interactive drag-and-release,
 * keyboard nudge navigation, dynamic SVG string bending, and tab-aware idle sway.
 * 60fps vanilla JavaScript using transform + requestAnimationFrame only.
 */

(function () {
  function initHangingCard() {
    const stage = document.getElementById('hangingStage');
    const anchor = document.getElementById('hangingAnchor');
    const card = document.getElementById('hangingCard');
    const stringPath = document.getElementById('hangingStringPath');
    const sheen = document.getElementById('cardSheen');

    if (!stage || !anchor || !card || !stringPath) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      card.style.transform = 'translate3d(-50%, 100px, 0) rotate(0deg)';
      updateString(0, 100);
      return;
    }

    // Geometry & Scaling
    let naturalLength = window.innerWidth <= 768 ? 85 : 110;
    let currentLength = naturalLength;

    // Physics State
    // Initial drop from above
    let angle = 0.32;
    let angularVelocity = -0.08;
    let dropY = -300;
    let dropVelocity = 160;

    const gravity = 920;
    const angularDamping = 1.45;
    const springK = 55;
    const springDamping = 8.2;

    let isDragging = false;
    let dragPointerId = null;
    let dragOffset = { x: 0, y: 0 };
    let lastPointerPos = { x: 0, y: 0, time: 0 };
    let pointerVelocity = { vx: 0, vy: 0 };

    let isTabVisible = !document.hidden;
    let lastTime = performance.now();
    let idleTimer = 0;

    // Handle Window Resize
    window.addEventListener('resize', () => {
      naturalLength = window.innerWidth <= 768 ? 85 : 110;
    }, { passive: true });

    // Handle Tab Visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isTabVisible = false;
      } else {
        isTabVisible = true;
        lastTime = performance.now();
        requestAnimationFrame(physicsLoop);
      }
    });

    // Helper: Update SVG String Path
    function updateString(currentAngle, lengthWithDrop) {
      const stageRect = stage.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();

      // Top anchor position relative to stage
      const ax = anchorRect.left + anchorRect.width / 2 - stageRect.left;
      const ay = anchorRect.top + anchorRect.height / 2 - stageRect.top;

      // Card top grommet attachment point
      const cx = ax + Math.sin(currentAngle) * lengthWithDrop;
      const cy = ay + Math.cos(currentAngle) * lengthWithDrop;

      // Calculate slight curvature when slack or moving
      const dist = Math.hypot(cx - ax, cy - ay);
      const isCompressed = dist < naturalLength * 0.95;
      const slackOffset = isCompressed ? (naturalLength - dist) * 0.5 : 0;

      const midX = (ax + cx) / 2 + Math.sin(currentAngle + Math.PI / 2) * slackOffset;
      const midY = (ay + cy) / 2 + slackOffset;

      stringPath.setAttribute('d', `M ${ax.toFixed(2)} ${ay.toFixed(2)} Q ${midX.toFixed(2)} ${midY.toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)}`);
    }

    // Pointer Event Handlers
    function onPointerDown(e) {
      if (e.button !== undefined && e.button !== 0) return;

      isDragging = true;
      dragPointerId = e.pointerId || null;
      card.classList.add('is-dragging');

      const cardRect = card.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      dragOffset = {
        x: clientX - (cardRect.left + cardRect.width / 2),
        y: clientY - cardRect.top
      };

      lastPointerPos = { x: clientX, y: clientY, time: performance.now() };
      pointerVelocity = { vx: 0, vy: 0 };

      if (e.target.setPointerCapture && dragPointerId !== null) {
        try {
          e.target.setPointerCapture(dragPointerId);
        } catch (_) {}
      }
    }

    function onPointerMove(e) {
      if (!isDragging) return;

      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const now = performance.now();
      const dt = (now - lastPointerPos.time) / 1000;

      if (dt > 0.008) {
        pointerVelocity.vx = (clientX - lastPointerPos.x) / dt;
        pointerVelocity.vy = (clientY - lastPointerPos.y) / dt;
        lastPointerPos = { x: clientX, y: clientY, time: now };
      }

      const anchorRect = anchor.getBoundingClientRect();
      const ax = anchorRect.left + anchorRect.width / 2;
      const ay = anchorRect.top + anchorRect.height / 2;

      const targetCardX = clientX - dragOffset.x;
      const targetCardY = clientY - dragOffset.y;

      const dx = targetCardX - ax;
      const dy = targetCardY - ay;

      let targetAngle = Math.atan2(dx, dy);
      targetAngle = Math.max(-1.3, Math.min(1.3, targetAngle));

      const rawDist = Math.hypot(dx, dy);
      const clampedDist = Math.max(naturalLength * 0.7, Math.min(naturalLength * 1.6, rawDist));

      angle = targetAngle;
      currentLength = clampedDist;
      dropY = 0;
      angularVelocity = 0;
      dropVelocity = 0;
      idleTimer = 0;
    }

    function onPointerUp() {
      if (!isDragging) return;

      isDragging = false;
      card.classList.remove('is-dragging');

      if (card.releasePointerCapture && dragPointerId !== null) {
        try {
          card.releasePointerCapture(dragPointerId);
        } catch (_) {}
      }
      dragPointerId = null;

      // Project momentum into angular velocity
      const projectedVelocity = (pointerVelocity.vx * Math.cos(angle) - pointerVelocity.vy * Math.sin(angle)) / naturalLength;
      angularVelocity = Math.max(-14, Math.min(14, projectedVelocity * 0.85));

      dropVelocity = (currentLength - naturalLength) * 8;
      dropY = currentLength - naturalLength;
      currentLength = naturalLength;
    }

    // Attach Pointer Events
    card.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });

    // Keyboard Accessibility (Nudge swing with Arrow keys)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        angularVelocity -= 2.2;
        idleTimer = 0;
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        angularVelocity += 2.2;
        idleTimer = 0;
        e.preventDefault();
      } else if (e.key === ' ' || e.key === 'Enter') {
        dropVelocity += 60;
        angularVelocity += (Math.random() > 0.5 ? 1.8 : -1.8);
        idleTimer = 0;
        e.preventDefault();
      }
    });

    // 60fps Physics & Render Loop
    function physicsLoop(timestamp) {
      if (!isTabVisible) return;

      const deltaMs = Math.min(timestamp - lastTime, 40);
      const dt = deltaMs / 1000;
      lastTime = timestamp;

      if (!isDragging) {
        idleTimer += dt;

        // 1. Vertical Drop / Spring Simulation
        if (Math.abs(dropY) > 0.1 || Math.abs(dropVelocity) > 0.1) {
          const springForce = -springK * dropY;
          const dampingForce = -springDamping * dropVelocity;
          const totalAccelY = springForce + dampingForce;

          dropVelocity += totalAccelY * dt;
          dropY += dropVelocity * dt;

          if (Math.abs(dropY) < 0.2 && Math.abs(dropVelocity) < 0.5) {
            dropY = 0;
            dropVelocity = 0;
          }
        }

        // 2. Pendulum Angular Motion Simulation
        const angularAccel = -(gravity / naturalLength) * Math.sin(angle) - angularDamping * angularVelocity;
        angularVelocity += angularAccel * dt;
        angle += angularVelocity * dt;

        // 3. Ambient Idle Sway when settled
        const isSettled = Math.abs(angle) < 0.015 && Math.abs(angularVelocity) < 0.02 && Math.abs(dropY) < 0.5;
        if (isSettled) {
          const ambientSway = 0.022 * Math.sin(idleTimer * 1.3) + 0.008 * Math.sin(idleTimer * 2.6);
          angle = ambientSway;
        }
      }

      // Visual Transform
      const totalYOffset = naturalLength + dropY;
      const deg = (angle * 180) / Math.PI;

      card.style.transform = `translate3d(-50%, ${totalYOffset.toFixed(2)}px, 0) rotate(${deg.toFixed(2)}deg)`;

      // Dynamic Light Sheen & Shadow based on tilt angle
      const shadowX = (-Math.sin(angle) * 18).toFixed(1);
      const shadowY = (12 + Math.cos(angle) * 8).toFixed(1);
      card.style.boxShadow = `${shadowX}px ${shadowY}px 32px rgba(0, 0, 0, 0.65), 0 0 20px rgba(143, 211, 255, 0.08)`;

      if (sheen) {
        const sheenOpacity = (0.5 + Math.sin(angle) * 0.35).toFixed(2);
        sheen.style.opacity = Math.max(0.18, Math.min(0.85, sheenOpacity));
      }

      updateString(angle, totalYOffset);

      requestAnimationFrame(physicsLoop);
    }

    requestAnimationFrame(physicsLoop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHangingCard);
  } else {
    initHangingCard();
  }
})();
