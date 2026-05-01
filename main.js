import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/controls/OrbitControls.js";
import { VRButton } from "https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/webxr/VRButton.js";

const statusElement = document.getElementById("xr-status");
const wrapperElement = document.getElementById("xr-canvas-wrapper");
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear().toString();
}

if (!statusElement || !wrapperElement) {
  throw new Error("Required XR container elements are missing.");
}

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(wrapperElement.clientWidth, wrapperElement.clientHeight);
renderer.xr.enabled = true;
wrapperElement.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070911);

const camera = new THREE.PerspectiveCamera(
  60,
  wrapperElement.clientWidth / wrapperElement.clientHeight,
  0.1,
  100
);
camera.position.set(0, 1.6, 4.2);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2.1;
controls.target.set(0, 1.1, 0);
controls.update();

const ambient = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xa1c1ff, 1.6);
keyLight.position.set(4, 5, 2);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0x8d5bff, 10, 25);
rimLight.position.set(-3, 2, -4);
scene.add(rimLight);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(10, 48),
  new THREE.MeshStandardMaterial({
    color: 0x0d1325,
    metalness: 0.2,
    roughness: 0.85
  })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.001;
scene.add(floor);

const ringGroup = new THREE.Group();
scene.add(ringGroup);

for (let index = 0; index < 3; index += 1) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.75 + index * 0.45, 0.035, 24, 120),
    new THREE.MeshStandardMaterial({
      color: index === 1 ? 0x6bf5d7 : 0x7ea4ff,
      metalness: 0.75,
      roughness: 0.3
    })
  );
  ring.position.set(0, 1.2 + index * 0.24, 0);
  ring.rotation.x = index * 0.3;
  ring.rotation.y = index * 0.5;
  ringGroup.add(ring);
}

const centerOrb = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.45, 0),
  new THREE.MeshPhysicalMaterial({
    color: 0x9ab7ff,
    emissive: 0x122d8d,
    emissiveIntensity: 0.7,
    roughness: 0.25,
    metalness: 0.45,
    clearcoat: 0.9,
    clearcoatRoughness: 0.2
  })
);
centerOrb.position.y = 1.2;
scene.add(centerOrb);

const stars = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ size: 0.03, color: 0xc9d7ff })
);
const starCount = 280;
const starPositions = new Float32Array(starCount * 3);
for (let index = 0; index < starCount; index += 1) {
  const i = index * 3;
  starPositions[i] = (Math.random() - 0.5) * 35;
  starPositions[i + 1] = Math.random() * 18;
  starPositions[i + 2] = (Math.random() - 0.5) * 35;
}
stars.geometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
scene.add(stars);

const fallbackMessage = document.createElement("p");
fallbackMessage.className = "xr-fallback";
fallbackMessage.hidden = true;
fallbackMessage.textContent =
  "WebXR immersive mode is not available on this device. You can still explore the interactive 3D preview above.";
wrapperElement.appendChild(fallbackMessage);

let supportsImmersiveVR = false;
if ("xr" in navigator) {
  try {
    supportsImmersiveVR = await navigator.xr.isSessionSupported("immersive-vr");
  } catch (error) {
    supportsImmersiveVR = false;
  }
}

if (supportsImmersiveVR) {
  statusElement.textContent = "WebXR ready. Enter VR to open immersive mode.";
  statusElement.classList.add("xr-status-ready");
  const vrButton = VRButton.createButton(renderer);
  vrButton.classList.add("button", "button-primary", "xr-vr-button");
  wrapperElement.appendChild(vrButton);
} else {
  statusElement.textContent = "WebXR headset mode unavailable on this device/browser.";
  statusElement.classList.add("xr-status-fallback");
  fallbackMessage.hidden = false;
}

const onResize = () => {
  const { clientWidth, clientHeight } = wrapperElement;
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(clientWidth, clientHeight);
};

window.addEventListener("resize", onResize);

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const elapsed = clock.getElapsedTime();
  ringGroup.rotation.y = elapsed * 0.26;
  ringGroup.rotation.x = Math.sin(elapsed * 0.22) * 0.08;
  centerOrb.rotation.x = elapsed * 0.35;
  centerOrb.rotation.y = elapsed * 0.52;
  centerOrb.position.y = 1.2 + Math.sin(elapsed * 1.4) * 0.08;
  controls.update();
  renderer.render(scene, camera);
});
