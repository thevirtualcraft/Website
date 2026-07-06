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

### Services

This product has exactly **one service** — there is no backend, database, API route
(`src/app/api/*` does not exist), queue, or separate worker process. WebXR/3D is all
client-side (React Three Fiber + `@react-three/xr`).

#### Service: `thevirtualcraft-website` (Next.js 14 frontend)

The single web service. Frontend-only, npm-based (a `package-lock.json` is committed —
use npm, not pnpm/yarn). Default port **3000**.

| Task | Command | Notes |
|---|---|---|
| Install deps | `npm install` | ~489 packages; run from repo root |
| Dev server | `npm run dev` | Hot-reload; serves http://localhost:3000 |
| Type check | `npx tsc --noEmit` | Strict mode; also run implicitly by `next build` |
| Lint | `npm run lint` | `next lint` → `eslint-config-next` (core-web-vitals) |
| Production build | `npm run build` | Static prerender of `/`; output to `.next/` |
| Production server | `npm run start` | Requires a prior `npm run build`; `-- -p <port>` to change port |

No automated test suite is configured (`npm test` is not defined). Verify changes by
running the dev server and exercising the UI in a browser.

### Notes / gotchas

- Node 22 and npm are preinstalled in the Cloud VM; no version manager juggling needed.
- ESLint is v8 with `eslint-config-next@14` (pinned for Next.js 14 compatibility).
- The homepage renders WebGL 3D scenes via React Three Fiber; give it a couple of
  seconds to hydrate before interacting.
- `next.config.js` sets `transpilePackages: ['three']`; keep this when touching the
  build config or the Three.js imports will fail to compile.
- `npm run start` needs a completed `npm run build` first, and cannot share a port with
  a running dev server — pass `-- -p 3100` (or similar) to run both side by side.
- The update script installs node dependencies only when a `package.json` exists at the
  repo root, so it is a safe no-op while `main` is still empty.
