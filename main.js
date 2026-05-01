/* The Virtual Craft — interactions */

(function () {
  "use strict";

  const TVC = (window.TVC = window.TVC || {});

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function setupYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function setupReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    items.forEach((el) => io.observe(el));
  }

  function setupMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("mobile-nav");
    if (!toggle || !menu) return;

    function close() {
      toggle.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    }

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", close);
    });
  }

  /* ---------------------------------------------------------------------------
     Hero canvas — lightweight starfield-into-grid that gives a "virtual world"
     vibe without pulling in three.js on the landing page.
     --------------------------------------------------------------------------- */

  function setupHeroCanvas() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const state = {
      w: 0,
      h: 0,
      dpr: Math.max(1, Math.min(2, window.devicePixelRatio || 1)),
      stars: [],
      t: 0,
    };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      state.w = rect.width;
      state.h = rect.height;
      canvas.width = Math.floor(rect.width * state.dpr);
      canvas.height = Math.floor(rect.height * state.dpr);
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    }

    function seed() {
      const count = Math.max(60, Math.floor((state.w * state.h) / 9000));
      state.stars = new Array(count).fill(0).map(() => ({
        x: Math.random() * state.w,
        y: Math.random() * state.h,
        z: 0.3 + Math.random() * 0.7,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.06,
        hue: Math.random() < 0.5 ? 270 : Math.random() < 0.5 ? 175 : 320,
      }));
    }

    function drawHorizonGrid(t) {
      const w = state.w;
      const h = state.h;
      const horizon = h * 0.62;

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#06091a");
      grad.addColorStop(0.55, "#0a0e2a");
      grad.addColorStop(0.62, "#160b35");
      grad.addColorStop(1, "#02040c");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const sun = ctx.createRadialGradient(w / 2, horizon, 4, w / 2, horizon, h * 0.7);
      sun.addColorStop(0, "rgba(255, 122, 184, 0.55)");
      sun.addColorStop(0.4, "rgba(124, 92, 255, 0.2)");
      sun.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.strokeStyle = "rgba(124, 92, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const rows = 16;
      const speed = reduceMotion ? 0 : (t * 0.00015) % 1;
      for (let i = 0; i < rows; i++) {
        const p = (i + speed) / rows;
        const ease = p * p;
        const y = horizon + ease * (h - horizon);
        const alpha = Math.max(0, 1 - ease);
        ctx.globalAlpha = alpha * 0.7;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      const cols = 24;
      for (let i = -cols / 2; i <= cols / 2; i++) {
        const x = w / 2 + i * 36;
        ctx.beginPath();
        ctx.moveTo(w / 2, horizon);
        ctx.lineTo(x, h);
        ctx.strokeStyle = "rgba(35, 224, 196, 0.18)";
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawStars(dt) {
      const w = state.w;
      const horizon = state.h * 0.62;
      ctx.save();
      for (const s of state.stars) {
        if (!reduceMotion) {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
        }
        if (s.x < 0) s.x += w;
        if (s.x > w) s.x -= w;
        if (s.y < 0) s.y = horizon * Math.random();
        if (s.y > horizon) s.y = 0;
        const r = s.z * 1.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 80%, 75%, ${0.4 + s.z * 0.4})`;
        ctx.fill();
      }
      ctx.restore();
    }

    function drawRing(t) {
      const cx = state.w / 2;
      const cy = state.h * 0.62;
      const baseR = Math.min(state.w, state.h) * 0.18;
      ctx.save();
      ctx.translate(cx, cy);
      const rot = reduceMotion ? 0 : t * 0.00015;
      for (let k = 0; k < 3; k++) {
        const r = baseR + k * 14;
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.32, rot + k * 0.4, 0, Math.PI * 2);
        const grd = ctx.createLinearGradient(-r, 0, r, 0);
        grd.addColorStop(0, "rgba(124, 92, 255, 0)");
        grd.addColorStop(0.5, ["#7c5cff", "#23e0c4", "#ff7ab8"][k]);
        grd.addColorStop(1, "rgba(124, 92, 255, 0)");
        ctx.strokeStyle = grd;
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = 0.85 - k * 0.2;
        ctx.stroke();
      }
      ctx.restore();
    }

    let last = performance.now();
    function frame(now) {
      const dt = Math.min(64, now - last);
      last = now;
      state.t = now;
      drawHorizonGrid(now);
      drawStars(dt);
      drawRing(now);
      if (!reduceMotion) {
        requestAnimationFrame(frame);
      }
    }

    function start() {
      resize();
      seed();
      requestAnimationFrame(frame);
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        seed();
        if (reduceMotion) frame(performance.now());
      }, 120);
    });

    start();
  }

  /* ---------------------------------------------------------------------------
     Contact form (no backend; just a friendly local-only confirmation that
     hands off to a mailto: as a graceful fallback).
     --------------------------------------------------------------------------- */

  TVC.submitContact = function submitContact(event) {
    event.preventDefault();
    const form = event.target;
    const status = form.querySelector(".contact-form__status");
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      if (status) {
        status.style.color = "#ff7ab8";
        status.textContent = "Please fill in all fields.";
      }
      return false;
    }

    const subject = encodeURIComponent(`New project brief from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} <${email}>`);
    window.location.href = `mailto:hello@thevirtualcraft.com?subject=${subject}&body=${body}`;

    if (status) {
      status.style.color = "";
      status.textContent = "Thanks — your mail client should be opening now.";
    }
    form.reset();
    return false;
  };

  ready(function init() {
    setupYear();
    setupMobileNav();
    setupReveal();
    setupHeroCanvas();
  });
})();
