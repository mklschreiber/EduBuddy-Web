# Architecture Documentation Log

This log records material decisions made in the current architecture
documentation.

| Date | Decision |
|---|---|
| 2026-10-26 | Platform-neutral copy: Eulino is planned for Android and iOS, so the page says "app" and "Coming soon" without naming Android or Google Play (hero eyebrow and status, meta description, Open Graph, noscript). |
| 2026-10-26 | Naming: the page shows only the marketing name "Eulino" (`APP_NAME` in `src/data/content.ts`, title, meta tags, logo); "EduBuddy" stays the internal codename of the app repository and this repository. The mascot is still Elly. The logo shows the name in one weight, without the two-part "my**Standby**" styling. |
| 2026-10-26 | Initialized the repository like myStandby-LandingPage: ai-base 1.4.0 as submodule `.ai-base/` with symlinked agents and skills, `CLAUDE.md`, `.github/copilot-instructions.md`, `.mcp.json` and the profile `docs/ai-project.md` (Jira values still open); PR CI (`lint`, `test`, `build`) and GitHub Pages deployment from `app/` with `VITE_BASE_URL=/edubuddy-LandingPage/`. Scaffolded `app/` (Vue 3, TypeScript, Vite, Vitest, ESLint) with an English coming-soon page: header, hero with Elly and three highlights, footer with imprint; copy in `src/data/content.ts`; icon and Elly SVG from the app's EDU-24 icon design; no router, SEO plugin, fonts or analytics. |
