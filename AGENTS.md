# AGENTS.md

## Cursor Cloud specific instructions

### Repository state (IMPORTANT)

The `main` branch currently contains **only `README.md`** — there is no application
code on `main`. The actual product is a **Next.js WebXR marketing website**
("The Virtual Craft", React Three Fiber + Three.js) that lives on unmerged feature
branches (e.g. `cursor/local-dev-setup-80b8`, `cursor/modern-webxr-website-5cb4`).

Until one of those branches is merged into `main`, there is nothing to install, lint,
build, or run from `main` itself. If you need to work on the site, first get the app
onto your branch (merge a website branch into `main`, or branch from a website branch).

### Running the website (once the app is present)

The project is frontend-only (no backend, no database, no test suite). Uses npm
(a `package-lock.json` is committed).

- Install: `npm install`
- Dev server: `npm run dev` (Next.js, http://localhost:3000)
- Production build: `npm run build`
- Lint: `npm run lint`

### Notes / gotchas

- Node 22 and npm are preinstalled in the Cloud VM; no version manager juggling needed.
- ESLint is v8 with `eslint-config-next@14` (pinned for Next.js 14 compatibility).
- The homepage renders WebGL 3D scenes via React Three Fiber; give it a couple of
  seconds to hydrate before interacting.
- The update script installs node dependencies only when a `package.json` exists at the
  repo root, so it is a safe no-op while `main` is still empty.
