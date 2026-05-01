import * as THREE from "three";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";

export type ImmersiveSceneApi = {
  dispose: () => void;
  renderer: THREE.WebGLRenderer;
};

function makeLights(root: THREE.Group): void {
  const ambient = new THREE.AmbientLight(0x404868, 0.45);
  root.add(ambient);

  const key = new THREE.DirectionalLight(0xa8f5ff, 1.2);
  key.position.set(4, 8, 6);
  root.add(key);

  const rim = new THREE.DirectionalLight(0xc4b5fd, 0.55);
  rim.position.set(-6, 4, -4);
  root.add(rim);

  const fill = new THREE.PointLight(0x5ee7df, 0.9, 24);
  fill.position.set(0, 2.2, 3);
  root.add(fill);
}

function makeShowcaseGroup(): THREE.Group {
  const group = new THREE.Group();

  const coreGeo = new THREE.TorusKnotGeometry(0.55, 0.18, 180, 24);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x2a2f4a,
    metalness: 0.65,
    roughness: 0.25,
    emissive: new THREE.Color(0x1a2040),
    emissiveIntensity: 0.35,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  const ringGeo = new THREE.TorusGeometry(1.15, 0.02, 32, 128);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x5ee7df,
    transparent: true,
    opacity: 0.55,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const innerRingGeo = new THREE.TorusGeometry(0.92, 0.015, 24, 96);
  const innerRingMat = new THREE.MeshBasicMaterial({
    color: 0xa78bfa,
    transparent: true,
    opacity: 0.4,
  });
  const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerRing.rotation.x = Math.PI / 2.3;
  innerRing.rotation.z = Math.PI / 5;
  group.add(innerRing);

  const particleGeo = new THREE.SphereGeometry(0.04, 12, 12);
  const particleMat = new THREE.MeshStandardMaterial({
    color: 0xe8e9f2,
    emissive: 0x5ee7df,
    emissiveIntensity: 0.8,
    metalness: 0.2,
    roughness: 0.4,
  });

  const count = 48;
  const orbit = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const p = new THREE.Mesh(particleGeo, particleMat.clone());
    const t = (i / count) * Math.PI * 2;
    const r = 1.45 + (i % 5) * 0.08;
    p.position.set(Math.cos(t) * r, Math.sin(t * 2.3) * 0.35, Math.sin(t) * r);
    orbit.add(p);
  }
  group.add(orbit);

  group.userData.orbit = orbit;
  group.userData.core = core;
  group.userData.ring = ring;
  group.userData.innerRing = innerRing;

  return group;
}

function makeFloor(): THREE.Mesh {
  const geo = new THREE.CircleGeometry(4.5, 64);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x0c0e18,
    metalness: 0.15,
    roughness: 0.92,
  });
  const floor = new THREE.Mesh(geo, mat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.35;
  floor.receiveShadow = true;
  return floor;
}

export function createImmersiveScene(canvas: HTMLCanvasElement): ImmersiveSceneApi {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x06060f);
  scene.fog = new THREE.FogExp2(0x06060f, 0.085);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0.35, 3.4);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.xr.enabled = true;

  const world = new THREE.Group();
  scene.add(world);
  makeLights(world);

  const showcase = makeShowcaseGroup();
  showcase.position.y = 0.15;
  world.add(showcase);
  world.add(makeFloor());

  const controllerFactory = new XRControllerModelFactory();
  const controller0 = renderer.xr.getController(0);
  const controller1 = renderer.xr.getController(1);
  scene.add(controller0, controller1);

  const grip0 = renderer.xr.getControllerGrip(0);
  grip0.add(controllerFactory.createControllerModel(grip0));
  const grip1 = renderer.xr.getControllerGrip(1);
  grip1.add(controllerFactory.createControllerModel(grip1));
  scene.add(grip0, grip1);

  let lastTime = performance.now();
  const animate = (): void => {
    requestAnimationFrame(animate);
    const now = performance.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    const inXR = renderer.xr.isPresenting;
    if (!inXR) {
      showcase.rotation.y += dt * 0.35;
    } else {
      showcase.rotation.y += dt * 0.15;
    }

    const orbit = showcase.userData.orbit as THREE.Group | undefined;
    if (orbit) {
      orbit.rotation.y += dt * 0.5;
    }
    const ring = showcase.userData.ring as THREE.Mesh | undefined;
    const innerRing = showcase.userData.innerRing as THREE.Mesh | undefined;
    if (ring) ring.rotation.z += dt * 0.4;
    if (innerRing) innerRing.rotation.x += dt * 0.25;

    renderer.render(scene, camera);
  };
  animate();

  const resize = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  resize();
  window.addEventListener("resize", resize);

  return {
    renderer,
    dispose: (): void => {
      window.removeEventListener("resize", resize);
      renderer.dispose();
      scene.clear();
    },
  };
}
