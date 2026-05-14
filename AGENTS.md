# AGENTS.md

## Cursor Cloud specific instructions

### Repository structure

The `main` branch contains only a `README.md`. All development work lives on feature branches. There are two types:

- **Framework branches** (Next.js 14, Vite + TypeScript) — require `npm install` before running
- **Static branches** (plain HTML/CSS/JS with Three.js from CDN) — no build step needed

### Framework branches

| Branch | Stack | Dev command | Lint | Build |
|---|---|---|---|---|
| `cursor/modern-webxr-website-5cb4` | Next.js 14, React Three Fiber, Tailwind | `npm run dev` | `npm run lint` (needs ESLint 8 + eslint-config-next@14 installed as devDependencies) | `npm run build` |
| `cursor/thevirtualcraft-redesign-dd06` | Vite 6, TypeScript, Three.js | `npm run dev` | `npx tsc --noEmit` (no dedicated lint script) | `npm run build` |

### Gotchas

- **Next.js branch ESLint**: The `package.json` on `cursor/modern-webxr-website-5cb4` does not include `eslint` or `eslint-config-next` in devDependencies. You must install them manually: `npm install --save-dev eslint@8 eslint-config-next@14` and create `.eslintrc.json` with `{"extends": "next/core-web-vitals"}`. ESLint 9 is incompatible with Next.js 14's lint command.
- **Vite branch has no lint script**: Use `npx tsc --noEmit` for type checking.
- **No automated tests**: Neither branch includes test frameworks or test files.
- **No backend or database**: All branches are frontend-only static sites.
- **Default ports**: Next.js uses port 3000, Vite uses port 5173.
