---
type: Architecture Reference
title: Technology Stack and Tooling
description: Verified baseline for the Vue 3, TypeScript, and Vite coming-soon page in app/.
tags: [stack, vue, typescript, vite, web]
timestamp: 2026-10-26T21:45:00+01:00
status: current
---

## Application

- The web application lives in `app/`.
- **Vue 3** with single-file components, the Composition API, and
  **TypeScript**.
- **Vite** provides development and production builds.
- The Vite alias `@` resolves to `app/src`.
- Vite's base URL is `VITE_BASE_URL` when set, otherwise `/`. Asset URLs in
  components are built from `import.meta.env.BASE_URL`.
- Title, description and Open Graph tags are static in `app/index.html`.

## Client Libraries

Vue is the only runtime dependency. There is no router, state library, i18n
library, or UI component library; the page is English-only and its copy lives
in `src/data/content.ts`. No web fonts, analytics or cookies. Add libraries
only through an approved concept and record them here.

## Brand Assets

- `public/favicon.svg` — the Eulino app icon (radial teal gradient plus
  Elly's head), built from the adaptive-icon layers in the app repository
  (`EduBuddy/docs/design/EDU-24-1/`), cropped to the safe zone.
- `public/elly.svg` — Elly's head without background, for the hero.
- Colors follow the app's teal palette (`#1c8f90` → `#00575a`, light
  `#9cf1f1`) with Elly's beak orange (`#ffb347`) as accent.

## Source Layout

Within `app/src`:

- `assets/styles` for CSS variables and global styles;
- `components` for Vue components;
- `data` for typed page content;
- `types` for TypeScript interfaces; and
- `__tests__` for unit tests.

## Build, Test, and Lint

Run commands from `app/`. The CI and deploy workflows require these scripts
in `app/package.json`:

| Command | Configured action |
|---|---|
| `npm run build` | Runs `vue-tsc --build` and `vite build`. |
| `npm run test:unit` | Runs Vitest (`jsdom` environment). |
| `npm run lint` | Runs ESLint with `--fix` and a cache. |
| `npm run lint:check` | Runs ESLint without `--fix`; used by CI. |

## Continuous Integration

`.github/workflows/ci.yml` runs on pull requests to `main` with three
independent jobs (`lint`, `test`, `build`) on Node 20, each installing with
`npm ci` from `app/`.

## Deployment

GitHub Pages deployment is defined in `.github/workflows/deploy.yml`. On pushes
to `main` (and on manual dispatch), the workflow runs from `app/`, uses Node
20, installs with `npm ci`, builds with `npm run build`, and deploys
`app/dist`. The page is served from the custom domain
`https://www.eulino.app/` (configured in the repository Pages settings, DNS at
Cloudflare), so the deployment workflow supplies `VITE_BASE_URL=/`.
