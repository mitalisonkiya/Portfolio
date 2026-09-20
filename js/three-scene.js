/**
 * Premium 3D WebGL Ambient Particle Wave (Three.js)
 * Clean, modern interactive constellation particle field reacting smoothly to mouse & scroll.
 */

(function () {
  const container = document.getElementById('three-canvas-bg');
  if (!container || typeof THREE === 'undefined') return;

  // Reduced motion check
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let scene, camera, renderer;
  let particleField, linesMesh;
  let particlePositions, particleVelocities;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let isRunning = true;
  const pCount = 280;
  const maxDistance = 120;

  function isDarkTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 700;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Particle Cloud with Organic Floating Velocities
    const pGeo = new THREE.BufferGeometry();
    particlePositions = new Float32Array(pCount * 3);
    particleVelocities = [];

    const spreadX = 1400;
    const spreadY = 1000;
    const spreadZ = 600;

    for (let i = 0; i < pCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * spreadX;
      particlePositions[idx + 1] = (Math.random() - 0.5) * spreadY;
      particlePositions[idx + 2] = (Math.random() - 0.5) * spreadZ;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.35,
        y: (Math.random() - 0.5) * 0.35,
        z: (Math.random() - 0.5) * 0.25
      });
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const pMat = new THREE.PointsMaterial({
      size: 3.2,
      color: isDarkTheme() ? 0x818CF8 : 0x4338CA,
      transparent: true,
      opacity: isDarkTheme() ? 0.45 : 0.28,
      blending: THREE.AdditiveBlending
    });

    particleField = new THREE.Points(pGeo, pMat);
    scene.add(particleField);

    // 2. Dynamic Constellation Connection Lines
    const maxLines = (pCount * (pCount - 1)) / 2;
    const linePositions = new Float32Array(maxLines * 6);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMat = new THREE.LineBasicMaterial({
      color: isDarkTheme() ? 0x818CF8 : 0x4338CA,
      transparent: true,
      opacity: isDarkTheme() ? 0.12 : 0.06,
      blending: THREE.AdditiveBlending
    });

    linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(linesMesh);

    // Event Listeners
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onWindowResize, { passive: true });

    // Watch Theme Changes
    const observer = new MutationObserver(() => {
      const dark = isDarkTheme();
      if (particleField) {
        particleField.material.color.setHex(dark ? 0x818CF8 : 0x4338CA);
        particleField.material.opacity = dark ? 0.45 : 0.28;
      }
      if (linesMesh) {
        linesMesh.material.color.setHex(dark ? 0x818CF8 : 0x4338CA);
        linesMesh.material.opacity = dark ? 0.12 : 0.06;
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    animate();
  }

  function onMouseMove(e) {
    const halfX = window.innerWidth / 2;
    const halfY = window.innerHeight / 2;
    mouseX = (e.clientX - halfX) * 0.18;
    mouseY = (e.clientY - halfY) * 0.18;
  }

  function onScroll() {
    const scrollY = window.scrollY;
    if (camera) {
      camera.position.y = -scrollY * 0.22;
    }
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  let step = 0;
  function animate() {
    if (!isRunning) return;
    requestAnimationFrame(animate);

    step += 0.008;
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 0.4;
    camera.lookAt(scene.position);

    // Update Particle Positions
    const pos = particleField.geometry.attributes.position.array;
    const linePos = linesMesh.geometry.attributes.position.array;
    let lineIdx = 0;

    for (let i = 0; i < pCount; i++) {
      const idx = i * 3;
      const v = particleVelocities[i];

      pos[idx] += v.x + Math.sin(step + i) * 0.08;
      pos[idx + 1] += v.y + Math.cos(step + i) * 0.08;
      pos[idx + 2] += v.z;

      // Wrap-around bounds
      if (pos[idx] < -700) pos[idx] = 700;
      if (pos[idx] > 700) pos[idx] = -700;
      if (pos[idx + 1] < -500) pos[idx + 1] = 500;
      if (pos[idx + 1] > 500) pos[idx + 1] = -500;
      if (pos[idx + 2] < -300) pos[idx + 2] = 300;
      if (pos[idx + 2] > 300) pos[idx + 2] = -300;

      // Connect nearby particles with subtle constellation lines
      for (let j = i + 1; j < pCount; j++) {
        const jdx = j * 3;
        const dx = pos[idx] - pos[jdx];
        const dy = pos[idx + 1] - pos[jdx + 1];
        const dz = pos[idx + 2] - pos[jdx + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance && lineIdx < linePos.length - 6) {
          linePos[lineIdx++] = pos[idx];
          linePos[lineIdx++] = pos[idx + 1];
          linePos[lineIdx++] = pos[idx + 2];
          linePos[lineIdx++] = pos[jdx];
          linePos[lineIdx++] = pos[jdx + 1];
          linePos[lineIdx++] = pos[jdx + 2];
        }
      }
    }

    particleField.geometry.attributes.position.needsUpdate = true;
    linesMesh.geometry.setDrawRange(0, lineIdx / 3);
    linesMesh.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  // Lifecycle
  document.addEventListener('visibilitychange', () => {
    isRunning = !document.hidden;
    if (isRunning) animate();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
