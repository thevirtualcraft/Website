/* WebXR scene helpers — runs after A-Frame + main.js are loaded */

(function () {
  "use strict";

  const PILLAR_COUNT = 6;
  const PILLAR_RADIUS = 4.4;
  const SCENE_CENTER = { x: 0, y: 0, z: -3.2 };

  const ROOM_MOODS = [
    { name: "Aurora",   bg: "#05060a", fog: 0.04, key: "#7c5cff" },
    { name: "Reef",     bg: "#031826", fog: 0.05, key: "#23e0c4" },
    { name: "Orbital",  bg: "#0a0220", fog: 0.03, key: "#ff7ab8" },
    { name: "Atlas",    bg: "#0d1226", fog: 0.04, key: "#a89dff" },
  ];

  function el(tag, attrs) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k)) {
          node.setAttribute(k, attrs[k]);
        }
      }
    }
    return node;
  }

  function buildPillars(host, scene) {
    if (!host) return;
    const labels = ["VR", "AR", "3D", "AUDIO", "LIVE", "MULTI"];
    for (let i = 0; i < PILLAR_COUNT; i++) {
      const angle = (i / PILLAR_COUNT) * Math.PI * 2;
      const x = SCENE_CENTER.x + Math.cos(angle) * PILLAR_RADIUS;
      const z = SCENE_CENTER.z + Math.sin(angle) * PILLAR_RADIUS;

      const wrapper = el("a-entity", { position: `${x} 0 ${z}` });

      const pillar = el("a-box", {
        class: "clickable",
        width: "0.5",
        height: "1.6",
        depth: "0.5",
        color: i % 2 === 0 ? "#7c5cff" : "#23e0c4",
        metalness: "0.4",
        roughness: "0.25",
        opacity: "0.85",
        transparent: "true",
        position: "0 0.8 0",
      });

      pillar.addEventListener("mouseenter", () => {
        pillar.setAttribute("animation__hover", {
          property: "scale",
          to: "1.08 1.08 1.08",
          dur: 200,
          easing: "easeOutQuad",
        });
      });
      pillar.addEventListener("mouseleave", () => {
        pillar.setAttribute("animation__hover", {
          property: "scale",
          to: "1 1 1",
          dur: 200,
          easing: "easeOutQuad",
        });
      });
      pillar.addEventListener("click", () => {
        const mood = ROOM_MOODS[i % ROOM_MOODS.length];
        applyMood(scene, mood);
      });

      const cap = el("a-sphere", {
        radius: "0.18",
        color: "#ffffff",
        opacity: "0.85",
        transparent: "true",
        position: "0 1.7 0",
        animation: "property: position; to: 0 1.85 0; dir: alternate; loop: true; dur: 2200; easing: easeInOutSine",
      });

      const label = el("a-text", {
        value: labels[i] || `ROOM ${i + 1}`,
        align: "center",
        color: "#f5f6fb",
        width: "3",
        position: "0 2.2 0",
        rotation: `0 ${-((angle * 180) / Math.PI) - 90} 0`,
        font: "https://cdn.aframe.io/fonts/Exo2SemiBold.fnt",
      });

      wrapper.appendChild(pillar);
      wrapper.appendChild(cap);
      wrapper.appendChild(label);
      host.appendChild(wrapper);
    }
  }

  let currentMood = 0;
  function applyMood(scene, mood) {
    if (!scene) return;
    scene.setAttribute("background", `color: ${mood.bg}`);
    scene.setAttribute("fog", `type: exponential; color: ${mood.bg}; density: ${mood.fog}`);
    const env = scene.querySelector("[environment]");
    if (env) {
      const preset =
        mood.name === "Reef"
          ? "starry"
          : mood.name === "Orbital"
            ? "starry"
            : mood.name === "Atlas"
              ? "starry"
              : "starry";
      env.setAttribute(
        "environment",
        `preset: ${preset}; ground: hills; groundColor: ${mood.bg}; groundColor2: ${mood.key}; grid: cross; gridColor: ${mood.key}; dressing: none; horizonColor: #160b35; skyType: gradient; skyColor: #050714; lighting: none; fog: 0.6`
      );
    }
  }

  function hideLoader() {
    const loader = document.getElementById("xr-loading");
    if (loader) loader.classList.add("is-hidden");
  }

  function setup() {
    const scene = document.querySelector("a-scene");
    const pillarHost = document.getElementById("pillars");
    if (!scene) return;
    buildPillars(pillarHost, scene);

    if (scene.hasLoaded) {
      hideLoader();
    } else {
      scene.addEventListener("loaded", hideLoader, { once: true });
      // safety fallback if `loaded` doesn't fire (very old WebGL contexts):
      setTimeout(hideLoader, 4500);
    }

    scene.addEventListener("enter-vr", () => {
      document.body.classList.add("is-in-vr");
    });
    scene.addEventListener("exit-vr", () => {
      document.body.classList.remove("is-in-vr");
    });
  }

  if (document.readyState !== "loading") {
    setup();
  } else {
    document.addEventListener("DOMContentLoaded", setup);
  }
})();
