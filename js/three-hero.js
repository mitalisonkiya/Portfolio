/**
 * Three.js Interactive 3D Hero Visual
 * Features: Glowing particle constellation & interactive geometric core reacting to cursor movement & scroll.
 */

(function () {
  const container = document.getElementById('three-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  let scene, camera, renderer;
  let particles, particleGeo, particleMat;
  let polyMesh, wireMesh, innerGlow;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;

  function init() {
    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 1, 2000);
    camera.position.z = 700;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Ambient Particle Galaxy
    const particleCount = 750;
    particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x6366f1); // Indigo
    const color2 = new THREE.Color(0x06b6d4); // Cyan
    const color3 = new THREE.Color(0x10b981); // Emerald

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 1600;
      positions[i + 1] = (Math.random() - 0.5) * 1200;
      positions[i + 2] = (Math.random() - 0.5) * 1200;

      const mixedColor = Math.random() > 0.5 ? color1.clone().lerp(color2, Math.random()) : color2.clone().lerp(color3, Math.random());
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    particleMat = new THREE.PointsMaterial({
      size: 3.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 2. Interactive Floating Wireframe Icosahedron
    const geom = new THREE.IcosahedronGeometry(130, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    wireMesh = new THREE.Mesh(geom, wireMat);
    wireMesh.position.set(220, 0, -50);
    scene.add(wireMesh);

    // Inner glowing sphere
    const innerGeom = new THREE.SphereGeometry(70, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    innerGlow = new THREE.Mesh(innerGeom, innerMat);
    innerGlow.position.set(220, 0, -50);
    scene.add(innerGlow);

    // Event listeners
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    animate();
  }

  function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.4;
    mouseY = (event.clientY - windowHalfY) * 0.4;
  }

  function onScroll() {
    const scrollY = window.scrollY;
    camera.position.y = -scrollY * 0.3;
    if (wireMesh) {
      wireMesh.rotation.x = scrollY * 0.001;
      wireMesh.rotation.y = scrollY * 0.0015;
    }
  }

  function onWindowResize() {
    if (!container) return;
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    targetX = targetX + (mouseX - targetX) * 0.04;
    targetY = targetY + (mouseY - targetY) * 0.04;

    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.lookAt(scene.position);

    if (particles) {
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0004;
    }

    if (wireMesh) {
      wireMesh.rotation.x += 0.004;
      wireMesh.rotation.y += 0.006;
      innerGlow.rotation.x -= 0.003;
      innerGlow.rotation.y -= 0.005;
    }

    renderer.render(scene, camera);
  }

  // Safe initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
