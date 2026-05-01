# The Virtual Craft — website

Modern marketing site with a full-screen Three.js scene and **WebXR (immersive VR)** entry for headsets.

## Development

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the printed local URL. For WebXR on device, use HTTPS (production or a tunnel); desktop shows the real-time 3D background without VR.

## Production build

```bash
npm run build
npm run preview
```

Serve the `dist/` folder over HTTPS for headset VR sessions.
