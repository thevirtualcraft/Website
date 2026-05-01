const sceneContainer = document.getElementById("scene-container");
const sceneShell = document.getElementById("scene-shell");
const xrStatus = document.getElementById("xr-status");
const enterXrButton = document.getElementById("enter-xr");
const year = document.getElementById("year");
const revealTargets = document.querySelectorAll("[data-reveal]");
const modeButtons = document.querySelectorAll("[data-scene-mode]");

const sceneModes = {
  pulse: {
    accent: "#7c7cff",
    secondary: "#22d3ee",
    glow: "rgba(124, 124, 255, 0.38)",
    speed: 0.0028,
  },
  aurora: {
    accent: "#8b5cf6",
    secondary: "#34d399",
    glow: "rgba(52, 211, 153, 0.34)",
    speed: 0.0018,
  },
  signal: {
    accent: "#f97316",
    secondary: "#facc15",
    glow: "rgba(249, 115, 22, 0.36)",
    speed: 0.0035,
  },
};

let activeModeKey = "pulse";
let fallbackStarted = false;

if (year) {
  year.textContent = new Date().getFullYear().toString();
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  },
);

revealTargets.forEach((element) => {
  revealObserver.observe(element);
});

function setStatus(message, tone = "default") {
  if (!xrStatus) {
    return;
  }

  xrStatus.textContent = message;
  xrStatus.classList.remove("is-supported", "is-unsupported");

  switch (tone) {
    case "ready":
      xrStatus.classList.add("is-supported");
      break;
    case "warning":
    case "muted":
      xrStatus.classList.add("is-unsupported");
      break;
    default:
      break;
  }
}

function updateActiveMode(nextModeKey) {
  if (!(nextModeKey in sceneModes)) {
    return;
  }

  activeModeKey = nextModeKey;
  const activeMode = sceneModes[activeModeKey];

  document.documentElement.style.setProperty("--accent", activeMode.accent);
  document.documentElement.style.setProperty("--accent-secondary", activeMode.secondary);
  document.documentElement.style.setProperty("--accent-glow", activeMode.glow);

  modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.sceneMode === nextModeKey);
  });
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextModeKey = button.dataset.sceneMode;
    if (!nextModeKey) {
      return;
    }

    updateActiveMode(nextModeKey);
  });
});

function buildFallbackScene() {
  if (!sceneContainer || fallbackStarted) {
    return;
  }

  fallbackStarted = true;
  sceneContainer.innerHTML = "";

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    sceneContainer.innerHTML =
      "<p style='padding:1rem;color:#e2e8f0;'>Your browser does not support the canvas features required for this preview.</p>";
    return;
  }

  sceneContainer.appendChild(canvas);

  const particles = Array.from({ length: 44 }, (_, index) => ({
    orbit: 120 + ((index * 17) % 190),
    size: 2 + (index % 5),
    angle: index * 0.35,
    drift: 0.004 + (index % 7) * 0.0009,
    vertical: 0.5 + (index % 5) * 0.18,
  }));

  let animationFrameId = 0;

  function resizeCanvas() {
    const bounds = sceneContainer.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(bounds.width * pixelRatio);
    canvas.height = Math.floor(bounds.height * pixelRatio);
    canvas.style.width = `${bounds.width}px`;
    canvas.style.height = `${bounds.height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function drawGrid(time, width, height) {
    context.save();
    context.translate(width / 2, height * 0.6);
    context.strokeStyle = "rgba(148, 163, 184, 0.12)";
    context.lineWidth = 1;

    for (let i = -8; i <= 8; i += 1) {
      context.beginPath();
      context.moveTo(i * 38, -140);
      context.lineTo(i * 74, 180);
      context.stroke();
    }

    for (let depth = 1; depth <= 7; depth += 1) {
      const wave = Math.sin(time * 0.0008 + depth) * 8;
      context.beginPath();
      context.moveTo(-380, depth * 28 + wave);
      context.quadraticCurveTo(0, depth * 18 - 26 + wave, 380, depth * 28 + wave);
      context.stroke();
    }

    context.restore();
  }

  function drawOrb(time, width, height, activeMode) {
    const x = width / 2;
    const y = height / 2.1;
    const pulse = 52 + Math.sin(time * activeMode.speed) * 10;
    const glowGradient = context.createRadialGradient(x, y, 10, x, y, pulse * 2.2);
    glowGradient.addColorStop(0, "rgba(255,255,255,0.92)");
    glowGradient.addColorStop(0.2, activeMode.secondary);
    glowGradient.addColorStop(0.45, activeMode.accent);
    glowGradient.addColorStop(1, "rgba(15, 23, 42, 0)");

    context.fillStyle = glowGradient;
    context.beginPath();
    context.arc(x, y, pulse * 2.2, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "rgba(255,255,255,0.25)";
    context.lineWidth = 1.5;
    context.beginPath();
    context.arc(x, y, pulse, 0, Math.PI * 2);
    context.stroke();
  }

  function drawParticles(time, width, height, activeMode) {
    particles.forEach((particle, index) => {
      const angle = particle.angle + time * particle.drift * activeMode.speed * 200;
      const radius = particle.orbit + Math.sin(time * 0.0014 + index) * 18;
      const x = width / 2 + Math.cos(angle) * radius;
      const y =
        height / 2.2 +
        Math.sin(angle * particle.vertical) * (particle.orbit * 0.22) +
        Math.cos(time * 0.001 + index) * 12;

      const gradient = context.createRadialGradient(x, y, 0, x, y, particle.size * 5);
      gradient.addColorStop(0, "rgba(255,255,255,0.95)");
      gradient.addColorStop(0.4, activeMode.secondary);
      gradient.addColorStop(1, "rgba(15,23,42,0)");

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, particle.size * 2.4, 0, Math.PI * 2);
      context.fill();
    });
  }

  function drawScene(time) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const activeMode = sceneModes[activeModeKey];

    context.clearRect(0, 0, width, height);

    const background = context.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, "rgba(2, 6, 23, 0.96)");
    background.addColorStop(0.55, "rgba(15, 23, 42, 0.9)");
    background.addColorStop(1, "rgba(3, 7, 18, 0.98)");
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    context.fillStyle = activeMode.glow;
    context.beginPath();
    context.ellipse(width * 0.25, height * 0.3, 120, 80, 0, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.ellipse(width * 0.75, height * 0.72, 180, 120, 0, 0, Math.PI * 2);
    context.fill();

    drawGrid(time, width, height);
    drawOrb(time, width, height, activeMode);
    drawParticles(time, width, height, activeMode);

    animationFrameId = window.requestAnimationFrame(drawScene);
  }

  resizeCanvas();
  animationFrameId = window.requestAnimationFrame(drawScene);

  const resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
  });
  resizeObserver.observe(sceneContainer);

  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(animationFrameId);
    resizeObserver.disconnect();
  });
}

function buildThreeScene() {
  if (!sceneContainer || typeof window.THREE === "undefined") {
    buildFallbackScene();
    return null;
  }

  sceneContainer.innerHTML = "";

  const { THREE } = window;
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
  renderer.xr.enabled = true;
  sceneContainer.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030712, 0.075);

  const camera = new THREE.PerspectiveCamera(
    50,
    sceneContainer.clientWidth / sceneContainer.clientHeight,
    0.1,
    100,
  );
  camera.position.set(0, 1.6, 6.8);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const keyLight = new THREE.PointLight(0x7c7cff, 4.2, 30, 2);
  keyLight.position.set(0, 2.8, 2.6);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0x22d3ee, 2.2, 24, 2);
  fillLight.position.set(2.8, 1.6, -1.4);
  scene.add(fillLight);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(7.5, 96),
    new THREE.MeshStandardMaterial({
      color: 0x0a1024,
      metalness: 0.45,
      roughness: 0.38,
      transparent: true,
      opacity: 0.96,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.4;
  scene.add(floor);

  const floorGrid = new THREE.GridHelper(14, 20, 0x3ce6d8, 0x20304c);
  floorGrid.position.y = -1.39;
  floorGrid.material.transparent = true;
  floorGrid.material.opacity = 0.28;
  scene.add(floorGrid);

  const orbMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    emissive: 0x7c7cff,
    emissiveIntensity: 1.4,
    metalness: 0.15,
    roughness: 0.08,
    transparent: true,
    opacity: 0.95,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  });

  const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 3), orbMaterial);
  scene.add(orb);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide,
  });

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.05, 16, 180), ringMaterial);
  ring.rotation.x = Math.PI / 2.8;
  scene.add(ring);

  const torusGroup = new THREE.Group();
  scene.add(torusGroup);

  const torusPrimary = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.24, 180, 24),
    new THREE.MeshStandardMaterial({
      color: 0x7c7cff,
      emissive: 0x7c7cff,
      emissiveIntensity: 0.6,
      metalness: 0.58,
      roughness: 0.22,
    }),
  );
  torusPrimary.position.set(-2.6, 0.15, -0.6);
  torusGroup.add(torusPrimary);

  const torusSecondary = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.58, 0.18, 180, 24),
    new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.55,
      metalness: 0.52,
      roughness: 0.26,
    }),
  );
  torusSecondary.position.set(2.45, -0.1, 0.35);
  torusSecondary.rotation.x = 0.9;
  torusGroup.add(torusSecondary);

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 220;
  const starPositions = new Float32Array(starCount * 3);

  for (let index = 0; index < starCount; index += 1) {
    const stride = index * 3;
    const radius = 5.6 + Math.random() * 5.2;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 4.8;
    starPositions[stride] = Math.cos(angle) * radius;
    starPositions[stride + 1] = height;
    starPositions[stride + 2] = Math.sin(angle) * radius;
  }

  starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.055,
      transparent: true,
      opacity: 0.92,
    }),
  );
  scene.add(stars);

  let controls = null;
  if (typeof THREE.OrbitControls !== "undefined") {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 4.2;
    controls.maxDistance = 9;
    controls.maxPolarAngle = Math.PI * 0.56;
    controls.target.set(0, 0.4, 0);
  }

  const heroRig = new THREE.Group();
  heroRig.add(camera);
  scene.add(heroRig);

  function applyMode(modeKey) {
    const mode = sceneModes[modeKey];
    if (!mode) {
      return;
    }

    orbMaterial.emissive.set(mode.accent);
    keyLight.color.set(mode.accent);
    fillLight.color.set(mode.secondary);
    ringMaterial.color.set(mode.secondary);
    torusPrimary.material.color.set(mode.accent);
    torusPrimary.material.emissive.set(mode.accent);
    torusSecondary.material.color.set(mode.secondary);
    torusSecondary.material.emissive.set(mode.secondary);
  }

  applyMode(activeModeKey);

  function resizeRenderer() {
    const width = sceneContainer.clientWidth;
    const height = sceneContainer.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const clock = new THREE.Clock();

  renderer.setAnimationLoop(() => {
    const elapsed = clock.getElapsedTime();
    const activeMode = sceneModes[activeModeKey];
    const amplitude = 0.12 + activeMode.speed * 22;

    orb.rotation.x = elapsed * 0.3;
    orb.rotation.y = elapsed * 0.46;
    orb.position.y = Math.sin(elapsed * 1.2) * 0.18;

    ring.rotation.z += 0.0035;
    ring.scale.setScalar(1 + Math.sin(elapsed * 1.8) * 0.03);

    torusPrimary.rotation.x = elapsed * 0.45;
    torusPrimary.rotation.y = elapsed * 0.24;
    torusSecondary.rotation.y = -elapsed * 0.4;
    torusSecondary.rotation.z = elapsed * 0.32;
    torusGroup.position.y = Math.sin(elapsed * 1.15) * amplitude;
    stars.rotation.y = elapsed * 0.025;

    if (controls) {
      controls.update();
    } else {
      camera.lookAt(0, 0.5, 0);
    }

    renderer.render(scene, camera);
  });

  const resizeObserver = new ResizeObserver(() => {
    resizeRenderer();
  });
  resizeObserver.observe(sceneContainer);

  window.addEventListener("beforeunload", () => {
    resizeObserver.disconnect();
    renderer.setAnimationLoop(null);
    renderer.dispose();
  });

  return {
    applyMode,
    renderer,
  };
}

async function initWebXr(threeScene) {
  if (!enterXrButton) {
    return;
  }

  if (!threeScene || !("xr" in navigator)) {
    setStatus("WebXR is not available on this browser, but the 3D preview is live.", "muted");
    enterXrButton.disabled = true;
    return;
  }

  const vrButtonSlot = document.getElementById("vr-button-slot");

  try {
    const isSupported = await navigator.xr.isSessionSupported("immersive-vr");

    if (!isSupported) {
      setStatus("VR mode is unsupported on this device, but the 3D preview is live.", "muted");
      enterXrButton.disabled = true;
      return;
    }

    if (typeof window.VRButton !== "undefined" && vrButtonSlot) {
      const vrButton = window.VRButton.createButton(threeScene.renderer);
      vrButtonSlot.innerHTML = "";
      vrButtonSlot.appendChild(vrButton);
      vrButton.hidden = true;
      vrButton.tabIndex = -1;
    }

    setStatus("VR-ready browser detected.", "ready");
    enterXrButton.disabled = false;

    enterXrButton.addEventListener("click", () => {
      const nativeVrButton = vrButtonSlot?.querySelector("button");
      if (!nativeVrButton) {
        setStatus("VR launch control is not available right now.", "warning");
        return;
      }

      nativeVrButton.click();
    });

    threeScene.renderer.xr.addEventListener("sessionstart", () => {
      if (sceneShell) {
        sceneShell.classList.add("is-in-xr");
      }
      setStatus("Immersive VR session started.", "ready");
    });

    threeScene.renderer.xr.addEventListener("sessionend", () => {
      if (sceneShell) {
        sceneShell.classList.remove("is-in-xr");
      }
      setStatus("VR session ended. Preview remains active.", "default");
    });
  } catch (error) {
    setStatus("Unable to determine WebXR support right now.", "warning");
    enterXrButton.disabled = true;
  }
}

const threeScene = buildThreeScene();
updateActiveMode(activeModeKey);

if (threeScene) {
  const originalUpdateActiveMode = updateActiveMode;
  updateActiveMode = function patchedUpdateActiveMode(nextModeKey) {
    originalUpdateActiveMode(nextModeKey);
    threeScene.applyMode(activeModeKey);
  };
  updateActiveMode(activeModeKey);
}

initWebXr(threeScene);
