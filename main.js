/**
 * TheVirtualCraft — main.js
 * Three.js background, mini scene canvases, WebXR session management,
 * UI interactions (nav scroll, mobile menu, filter, reveal animations).
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';

/* ═══════════════════════════════════════════════════════════════════
   CURSOR GLOW
   ═══════════════════════════════════════════════════════════════════ */
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorGlow.style.left = mouseX + 'px';
  cursorGlow.style.top  = mouseY + 'px';
});

/* ═══════════════════════════════════════════════════════════════════
   NAV SCROLL BEHAVIOUR
   ═══════════════════════════════════════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ═══════════════════════════════════════════════════════════════════
   MOBILE MENU
   ═══════════════════════════════════════════════════════════════════ */
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ═══════════════════════════════════════════════════════════════════
   SCROLL-REVEAL
   ═══════════════════════════════════════════════════════════════════ */
const revealEls = document.querySelectorAll(
  '.feature-card, .showcase-card, .xr-step, .about-stat-card, .xr-badge'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
revealEls.forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════════════════════════
   SHOWCASE FILTER
   ═══════════════════════════════════════════════════════════════════ */
const filterBtns    = document.querySelectorAll('.filter-btn');
const showcaseCards = document.querySelectorAll('.showcase-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    showcaseCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
    });
  });
});

/* ═══════════════════════════════════════════════════════════════════
   THREE.JS — FULL-PAGE BACKGROUND
   ═══════════════════════════════════════════════════════════════════ */
function initBackground() {
  const canvas   = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;

  // — Stars
  const starGeo = new THREE.BufferGeometry();
  const starCount = 2500;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) {
    starPos[i] = (Math.random() - 0.5) * 300;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.25,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });
  scene.add(new THREE.Points(starGeo, starMat));

  // — Floating hexagonal mesh rings
  const ringGroup = new THREE.Group();
  scene.add(ringGroup);

  function makeRing(radius, segments, color, opacity) {
    const geo = new THREE.TorusGeometry(radius, 0.06, 8, segments);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, wireframe: false });
    return new THREE.Mesh(geo, mat);
  }

  const r1 = makeRing(28, 64, 0xa78bfa, 0.10);
  const r2 = makeRing(20, 48, 0x22d3ee, 0.08);
  const r3 = makeRing(40, 80, 0x34d399, 0.05);
  r1.rotation.x = Math.PI / 3;
  r2.rotation.x = Math.PI / 5;
  r2.rotation.y = Math.PI / 4;
  r3.rotation.x = Math.PI / 6;
  ringGroup.add(r1, r2, r3);

  // — Floating particles
  const particleGeo = new THREE.BufferGeometry();
  const pCount = 150;
  const pPos   = new Float32Array(pCount * 3);
  const pVel   = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const i3 = i * 3;
    pPos[i3]     = (Math.random() - 0.5) * 120;
    pPos[i3 + 1] = (Math.random() - 0.5) * 80;
    pPos[i3 + 2] = (Math.random() - 0.5) * 60;
    pVel[i3]     = (Math.random() - 0.5) * 0.012;
    pVel[i3 + 1] = (Math.random() - 0.5) * 0.012;
    pVel[i3 + 2] = 0;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0xa78bfa, size: 0.5, transparent: true, opacity: 0.6, sizeAttenuation: true });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // — Icosahedron wireframe in centre
  const icoGeo = new THREE.IcosahedronGeometry(12, 1);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.04 });
  const ico    = new THREE.Mesh(icoGeo, icoMat);
  scene.add(ico);

  // — Mouse parallax
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', (e) => {
    targetX = ((e.clientX / window.innerWidth)  - 0.5) * 0.6;
    targetY = ((e.clientY / window.innerHeight) - 0.5) * 0.6;
  });

  // — Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // — Animate
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.005;

    camera.position.x += (targetX * 8 - camera.position.x) * 0.04;
    camera.position.y += (-targetY * 8 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    ringGroup.rotation.y = t * 0.15;
    ringGroup.rotation.x = Math.sin(t * 0.1) * 0.1;
    r1.rotation.z = t * 0.2;
    r2.rotation.z = -t * 0.18;
    ico.rotation.y = t * 0.07;
    ico.rotation.x = t * 0.04;

    // Animate particles
    const posArr = particleGeo.attributes.position.array;
    for (let i = 0; i < pCount; i++) {
      const i3 = i * 3;
      posArr[i3]     += pVel[i3];
      posArr[i3 + 1] += pVel[i3 + 1];
      if (Math.abs(posArr[i3])     > 60) pVel[i3]     *= -1;
      if (Math.abs(posArr[i3 + 1]) > 40) pVel[i3 + 1] *= -1;
    }
    particleGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();
}

/* ═══════════════════════════════════════════════════════════════════
   THREE.JS — HERO HOLOGRAM PREVIEW CANVAS
   ═══════════════════════════════════════════════════════════════════ */
function initHeroPreview() {
  const canvas   = document.getElementById('xr-preview-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
  camera.position.z = 4;

  // Crystal / gem shape
  const geo = new THREE.OctahedronGeometry(1.2, 0);
  const mat = new THREE.MeshPhongMaterial({
    color: 0x22d3ee,
    emissive: 0x0a2040,
    specular: 0xa78bfa,
    shininess: 120,
    wireframe: false,
    transparent: true,
    opacity: 0.85,
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // Wireframe overlay
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.35 });
  scene.add(new THREE.Mesh(geo, wireMat));

  // Lights
  scene.add(Object.assign(new THREE.AmbientLight(0x1a1a3a), {}));
  const dl = new THREE.DirectionalLight(0xa78bfa, 3);
  dl.position.set(3, 3, 3);
  scene.add(dl);
  const dl2 = new THREE.DirectionalLight(0x22d3ee, 2);
  dl2.position.set(-3, -1, 2);
  scene.add(dl2);

  // Orbit ring
  const torusGeo = new THREE.TorusGeometry(1.8, 0.02, 8, 64);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.25 });
  const torus    = new THREE.Mesh(torusGeo, torusMat);
  torus.rotation.x = Math.PI / 2.5;
  scene.add(torus);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.015;
    mesh.rotation.y = t;
    mesh.rotation.x = t * 0.4;
    torus.rotation.z = t * 0.3;
    renderer.render(scene, camera);
  }
  animate();
}

/* ═══════════════════════════════════════════════════════════════════
   THREE.JS — SHOWCASE CARD CANVASES
   ═══════════════════════════════════════════════════════════════════ */
const sceneBuilders = {
  nebula(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(canvas.offsetWidth || 320, canvas.offsetHeight || 180);
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, (canvas.offsetWidth || 320) / (canvas.offsetHeight || 180), 0.1, 100);
    camera.position.z = 6;

    const count = 1200;
    const pos   = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r     = Math.random() * 4;
      pos[i * 3]     = r * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = r * Math.sin(theta);
      const c = new THREE.Color().setHSL(0.7 + Math.random() * 0.2, 1, 0.6 + Math.random() * 0.3);
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.85 });
    scene.add(new THREE.Points(geo, mat));
    let t = 0;
    (function animate() { requestAnimationFrame(animate); t += 0.008; camera.rotation.z = t * 0.05; renderer.render(scene, camera); })();
  },

  crystal(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.offsetWidth || 320, canvas.offsetHeight || 180);
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, (canvas.offsetWidth || 320) / (canvas.offsetHeight || 180), 0.1, 50);
    camera.position.z = 4;
    for (let i = 0; i < 8; i++) {
      const geo = new THREE.ConeGeometry(0.2 + Math.random() * 0.3, 1 + Math.random(), 5);
      const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.5 + Math.random() * 0.15, 1, 0.6),
        transparent: true, opacity: 0.75, shininess: 150,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1);
      m.rotation.x = Math.random() * Math.PI;
      scene.add(m);
    }
    scene.add(new THREE.AmbientLight(0x334488, 2));
    const dl = new THREE.DirectionalLight(0x22d3ee, 4); dl.position.set(3, 5, 3); scene.add(dl);
    let t = 0;
    (function animate() { requestAnimationFrame(animate); t += 0.01; scene.rotation.y = t * 0.3; renderer.render(scene, camera); })();
  },

  particles(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(canvas.offsetWidth || 320, canvas.offsetHeight || 180);
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, (canvas.offsetWidth || 320) / (canvas.offsetHeight || 180), 0.1, 50);
    camera.position.z = 5;
    const count = 600;
    const pos   = new Float32Array(count * 3);
    const vel   = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = 0;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xf472b6, size: 0.07, transparent: true, opacity: 0.9 });
    scene.add(new THREE.Points(geo, mat));
    let t = 0;
    (function animate() {
      requestAnimationFrame(animate);
      t += 0.01;
      const posArr = geo.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        posArr[i3]     += vel[i3] * (1 + 0.5 * Math.sin(t + i));
        posArr[i3 + 1] += vel[i3 + 1] * (1 + 0.5 * Math.cos(t + i));
        if (Math.abs(posArr[i3]) > 2) vel[i3] *= -1;
        if (Math.abs(posArr[i3 + 1]) > 1.5) vel[i3 + 1] *= -1;
      }
      geo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    })();
  },

  gallery(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.offsetWidth || 320, canvas.offsetHeight || 180);
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, (canvas.offsetWidth || 320) / (canvas.offsetHeight || 180), 0.1, 50);
    camera.position.set(0, 1.5, 6);
    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.MeshPhongMaterial({ color: 0x0a0a20, shininess: 50 })
    );
    floor.rotation.x = -Math.PI / 2; floor.position.y = -1.5;
    scene.add(floor);
    // Frames on walls
    for (let i = 0; i < 4; i++) {
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.9, 0.05),
        new THREE.MeshPhongMaterial({ color: new THREE.Color().setHSL(i * 0.25, 0.8, 0.4), emissive: new THREE.Color().setHSL(i * 0.25, 0.8, 0.15) })
      );
      frame.position.set(-3 + i * 2, 0.5, -3);
      scene.add(frame);
    }
    scene.add(new THREE.AmbientLight(0x112244, 3));
    const dl = new THREE.PointLight(0xffffff, 3, 10); dl.position.set(0, 3, 0); scene.add(dl);
    let t = 0;
    (function animate() { requestAnimationFrame(animate); t += 0.005; camera.position.x = Math.sin(t) * 3; camera.lookAt(0, 0, -2); renderer.render(scene, camera); })();
  },

  ocean(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.offsetWidth || 320, canvas.offsetHeight || 180);
    const scene  = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x001830, 0.08);
    const camera = new THREE.PerspectiveCamera(75, (canvas.offsetWidth || 320) / (canvas.offsetHeight || 180), 0.1, 50);
    camera.position.set(0, 0, 5);
    // Water plane
    const seg = 40;
    const waterGeo = new THREE.PlaneGeometry(14, 14, seg, seg);
    const waterMat = new THREE.MeshPhongMaterial({ color: 0x003366, emissive: 0x001122, transparent: true, opacity: 0.85, shininess: 200, wireframe: false });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2.8;
    water.position.y = -2;
    scene.add(water);
    scene.add(new THREE.AmbientLight(0x001144, 3));
    const dl = new THREE.DirectionalLight(0x22aaff, 2); dl.position.set(0, 5, 5); scene.add(dl);
    let t = 0;
    (function animate() {
      requestAnimationFrame(animate);
      t += 0.03;
      const pos = waterGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), z = pos.getZ(i);
        pos.setY(i, Math.sin(x * 0.8 + t) * 0.2 + Math.sin(z * 0.6 + t * 0.7) * 0.15);
      }
      pos.needsUpdate = true;
      waterGeo.computeVertexNormals();
      renderer.render(scene, camera);
    })();
  },
};

/* ═══════════════════════════════════════════════════════════════════
   THREE.JS — DEMO DEVICE CANVAS
   ═══════════════════════════════════════════════════════════════════ */
function initDemoCanvas() {
  const canvas   = document.getElementById('demoCanvas');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.offsetWidth || 280, canvas.offsetHeight || 160);
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, (canvas.offsetWidth || 280) / (canvas.offsetHeight || 160), 0.1, 50);
  camera.position.z = 3.5;

  // Grid floor
  const gridHelper = new THREE.GridHelper(6, 12, 0x22d3ee, 0x0a1530);
  gridHelper.position.y = -1;
  scene.add(gridHelper);

  // Pulsing orb
  const orbGeo = new THREE.SphereGeometry(0.6, 32, 32);
  const orbMat = new THREE.MeshPhongMaterial({ color: 0xa78bfa, emissive: 0x330066, shininess: 100, transparent: true, opacity: 0.9 });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  scene.add(orb);

  // Ring around orb
  const rGeo = new THREE.TorusGeometry(0.9, 0.02, 8, 48);
  const rMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.5 });
  const ring = new THREE.Mesh(rGeo, rMat);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  scene.add(new THREE.AmbientLight(0x111133, 2));
  const pl = new THREE.PointLight(0xa78bfa, 6, 10); pl.position.set(2, 2, 2); scene.add(pl);

  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    t += 0.02;
    orb.scale.setScalar(1 + 0.05 * Math.sin(t * 2));
    ring.rotation.y = t * 0.8;
    camera.position.x = Math.sin(t * 0.3) * 1.5;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  })();
}

/* ═══════════════════════════════════════════════════════════════════
   WEBXR SESSION MANAGEMENT
   ═══════════════════════════════════════════════════════════════════ */
const xrOverlay    = document.getElementById('xrOverlay');
const xrModalClose = document.getElementById('xrModalClose');
const cancelXRBtn  = document.getElementById('cancelXRBtn');
const confirmXRBtn = document.getElementById('confirmXRBtn');
const xrModalDesc  = document.getElementById('xrModalDesc');
const xrFallback   = document.getElementById('xrFallback');

const statusDevice  = document.getElementById('statusDevice');
const statusSupport = document.getElementById('statusSupport');
const statusReady   = document.getElementById('statusReady');

let currentExperience = 'nebula';

function setStatus(el, state, text) {
  el.className = 'xr-status-item ' + state;
  el.lastChild.textContent = ' ' + text;
}

async function probeWebXR() {
  setStatus(statusDevice, '', 'Detecting device…');
  setStatus(statusSupport, '', 'Checking WebXR support…');
  setStatus(statusReady, '', 'Waiting…');

  await delay(400);

  const ua = navigator.userAgent;
  const deviceName = /OculusBrowser|Quest/i.test(ua)      ? 'Meta Quest Browser'
                   : /SamsungBrowser/i.test(ua)            ? 'Samsung Internet'
                   : /Mobile|Android/i.test(ua)            ? 'Mobile Browser'
                   : 'Desktop Browser';
  setStatus(statusDevice, 'ok', deviceName + ' detected');

  await delay(500);

  if (!('xr' in navigator)) {
    setStatus(statusSupport, 'warn', 'WebXR not available in this browser');
    setStatus(statusReady, 'warn', 'Will open in flat 3D preview mode');
    xrFallback.textContent = 'For the full VR/AR experience, open this page on a Meta Quest Browser, or Chrome on a WebXR-capable Android device.';
    return false;
  }

  let vrSupported = false;
  try {
    vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
  } catch (_) {
    vrSupported = false;
  }

  if (vrSupported) {
    setStatus(statusSupport, 'ok', 'WebXR immersive-vr supported');
    setStatus(statusReady, 'ok', 'Ready to launch — click Enter XR');
    xrFallback.textContent = '';
    return true;
  }

  let arSupported = false;
  try {
    arSupported = await navigator.xr.isSessionSupported('immersive-ar');
  } catch (_) {
    arSupported = false;
  }

  if (arSupported) {
    setStatus(statusSupport, 'ok', 'WebXR immersive-ar supported');
    setStatus(statusReady, 'ok', 'AR mode available — click Enter XR');
    xrFallback.textContent = '';
    return 'ar';
  }

  setStatus(statusSupport, 'warn', 'No immersive XR session supported');
  setStatus(statusReady, 'warn', 'Opening as flat 3D experience');
  xrFallback.textContent = 'Your browser supports the WebXR API but your device is not reporting an immersive headset. The experience will open as a 3D web preview.';
  return false;
}

async function startXRSession(mode) {
  if (!('xr' in navigator)) return false;
  const sessionMode = mode === 'ar' ? 'immersive-ar' : 'immersive-vr';
  try {
    const session = await navigator.xr.requestSession(sessionMode, {
      requiredFeatures: sessionMode === 'immersive-ar' ? ['hit-test'] : [],
      optionalFeatures: ['hand-tracking', 'layers'],
    });

    const xrCanvas = document.createElement('canvas');
    document.body.appendChild(xrCanvas);
    const ctx = xrCanvas.getContext('webgl2', { xrCompatible: true });
    const xrRenderer = new THREE.WebGLRenderer({ canvas: xrCanvas, context: ctx });
    xrRenderer.xr.enabled = true;
    xrRenderer.xr.setSession(session);

    const xrScene = new THREE.Scene();
    const geo = new THREE.IcosahedronGeometry(0.3, 1);
    const mat = new THREE.MeshPhongMaterial({ color: 0xa78bfa, emissive: 0x220044, shininess: 80 });
    const obj = new THREE.Mesh(geo, mat);
    obj.position.set(0, 1.5, -1.5);
    xrScene.add(obj);
    xrScene.add(new THREE.AmbientLight(0xffffff, 1));
    const dl = new THREE.DirectionalLight(0xffffff, 2); dl.position.set(1, 3, 1); xrScene.add(dl);

    xrRenderer.setAnimationLoop((_time, frame) => {
      if (!frame) return;
      obj.rotation.y += 0.02;
      xrRenderer.render(xrScene, new THREE.PerspectiveCamera());
    });

    session.addEventListener('end', () => {
      xrRenderer.setAnimationLoop(null);
      xrCanvas.remove();
    });

    return true;
  } catch (err) {
    console.warn('XR session failed:', err);
    return false;
  }
}

function openXROverlay(experience) {
  currentExperience = experience || 'nebula';
  xrModalDesc.textContent = `Preparing "${experienceTitle(experience)}" for immersive mode…`;
  xrFallback.textContent = '';
  xrOverlay.classList.add('open');
  probeWebXR();
}

function closeXROverlay() {
  xrOverlay.classList.remove('open');
}

function experienceTitle(id) {
  const titles = { nebula: 'Nebula Drift', crystal: 'Crystal Garden', particles: 'Particle Forge', gallery: 'Virtual Gallery', ocean: 'Deep Ocean' };
  return titles[id] || id;
}

confirmXRBtn.addEventListener('click', async () => {
  confirmXRBtn.textContent = 'Launching…';
  confirmXRBtn.disabled = true;

  const ok = await startXRSession('vr');
  if (!ok) {
    // Fallback: open inline 3D experience in a new tab / same page
    alert(`Opening "${experienceTitle(currentExperience)}" as a flat 3D preview.\n\nFor the full immersive experience, visit this page on a WebXR-capable headset.`);
  }
  closeXROverlay();
  confirmXRBtn.textContent = 'Enter XR';
  confirmXRBtn.disabled = false;
});

xrModalClose.addEventListener('click', closeXROverlay);
cancelXRBtn.addEventListener('click', closeXROverlay);
xrOverlay.addEventListener('click', (e) => { if (e.target === xrOverlay) closeXROverlay(); });

// Wire up all launch buttons
document.querySelectorAll('.btn-launch').forEach(btn => {
  btn.addEventListener('click', () => openXROverlay(btn.dataset.experience));
});
document.getElementById('launchXRBtn').addEventListener('click', () => openXROverlay('nebula'));
document.getElementById('enterVRBtn').addEventListener('click', () => openXROverlay('nebula'));
document.getElementById('ctaLaunchBtn').addEventListener('click', () => openXROverlay('nebula'));

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════ */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ═══════════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════════ */
function init() {
  initBackground();
  initHeroPreview();
  initDemoCanvas();

  // Init scene canvases after they're in DOM and have size
  requestAnimationFrame(() => {
    document.querySelectorAll('.scene-canvas').forEach(canvas => {
      const sceneName = canvas.dataset.scene;
      if (sceneBuilders[sceneName]) {
        // Give it a moment to be sized by the layout
        setTimeout(() => sceneBuilders[sceneName](canvas), 50);
      }
    });
  });
}

init();
