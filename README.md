# thevirtualcraft.com

The marketing site for **The Virtual Craft**, an immersive content studio that
ships WebXR / VR / AR experiences runnable in any modern browser.

The site itself is a small static project — no build step, no framework — so it
can be deployed straight to GitHub Pages, Netlify, Vercel, S3 + CloudFront, or
any static host.

## Stack

- HTML, CSS, vanilla JS (no bundler)
- [A-Frame 1.5](https://aframe.io/) (open-source WebXR / three.js framework) for
  the live `xr.html` showcase scene
- `aframe-environment-component` for procedural skies / grounds
- Google Fonts: Space Grotesk, JetBrains Mono

## Project layout

```
.
├── index.html       # Landing page (hero, work, services, studio, contact)
├── xr.html          # Live WebXR demo scene (Aurora Atrium)
├── styles.css       # All styling
├── main.js          # Site interactions + hero canvas
├── xr.js            # Builds dynamic content for the WebXR scene
├── assets/
│   ├── favicon.svg
│   └── og-image.svg
└── README.md
```

## Run locally

Because `xr.html` loads A-Frame from a CDN and uses ES modules under the hood,
serve over HTTP (don't open with `file://`).

```bash
# any static server works, for example:
python3 -m http.server 4173
# then visit http://localhost:4173
```

To test WebXR you'll want either:

- A laptop + an Oculus / Quest / Vision Pro / Pico headset on the same network,
  visiting your dev URL over HTTPS, **or**
- The desktop browser's built-in WebXR emulator (Chrome DevTools → "WebXR").

## Deploy

Any static host works. For example:

```bash
# Netlify
netlify deploy --prod --dir .

# GitHub Pages: push to main and turn on Pages for /
```

WebXR requires HTTPS in production — every recommended host above provides it
by default.

## Notes for designers

- Brand gradient is `--grad-text` in `styles.css`
  (`#7c5cff → #23e0c4 → #ff7ab8`).
- All section spacing is fluid via `clamp()`.
- The hero scene is a Canvas2D vector mock, *not* WebGL, so it stays light on
  the marketing page. The real WebXR scene lives at `/xr.html`.
- Reduced-motion users get all animations disabled.
