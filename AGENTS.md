# AGENTS.md

Instructions for developing this project locally with Cursor (desktop app or CLI).

## Prerequisites

- Node.js 18+ and npm
- [Cursor](https://cursor.com) installed locally (desktop app recommended)

## Quick start

```bash
git clone https://github.com/thevirtualcraft/website.git
cd website
git checkout main
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Commands

| Task | Command |
|---|---|
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Start production server | `npm start` |
| Lint | `npm run lint` |

## Local development with Cursor Agent

Use Cursor on your machine instead of Cloud Agents:

1. Open this repo in the Cursor desktop app.
2. Use **Agent** or **Composer** from the sidebar — they run in your local environment, not a remote VM.
3. This file (`AGENTS.md`) is read automatically to guide the agent.
4. No cloud install script or remote VM is required; `npm install` on your machine is enough.

To avoid accidentally triggering Cloud Agents, do not start tasks from cursor.com/agents — work directly in the local IDE.

## Project notes

- Frontend-only — no backend or database.
- Default dev port: 3000 (Next.js).
- ESLint uses v8 with `eslint-config-next@14` (compatible with Next.js 14).
- No automated test suite is configured yet.

## Legacy feature branches

Earlier work was done on Cloud Agent feature branches. The canonical site now lives on `main`. These branches are kept for reference:

- `cursor/modern-webxr-website-5cb4` — merged into main
- `cursor/thevirtualcraft-redesign-dd06` — alternate Vite + TypeScript stack
- `cursor/immersive-redesign-webxr-3ac2` — static HTML/CSS/JS (no build step)
