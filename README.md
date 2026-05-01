# TheVirtualCraft — Immersive WebXR Website

A modern, single-page website for **thevirtualcraft.com** built around WebXR immersive experiences.

## Stack

- **Vanilla HTML/CSS/JS** — no build step required, ships as static files
- **Three.js 0.166** (loaded via CDN ESM) — full-page 3D animated background, hero hologram preview, per-card 3D scenes
- **WebXR Device API** — native browser VR/AR session management (immersive-vr + immersive-ar) with hand tracking and hit-test optional features
- **Google Fonts** — Space Grotesk + Inter

## Features

- Dark futuristic design with glassmorphism cards, gradient text, and animated rings
- Animated Three.js background (stars, floating rings, parallax mouse tracking)
- 3D hologram card in the hero section with real-time rotating gem
- Per-card mini Three.js scenes: Nebula, Crystal Garden, Particle Forge, Virtual Gallery, Deep Ocean
- WebXR session modal with real-time device/support detection
- Graceful fallback for non-XR browsers
- Scroll-reveal animations, showcase filter, mobile-responsive layout

## Serving locally

Any static file server works:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

> **Note:** WebXR requires a secure context (HTTPS or localhost). For headset testing, serve over HTTPS or use a tunnelling tool like `ngrok`.
