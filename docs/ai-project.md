# Eulino Landing Page — AI Project Profile

> Project-specific values for the shared ai-base workflow (`.ai-base/handbook.md`).
> On conflict, this file wins over the generic files.

## Project

Eulino Landing Page — coming-soon page for the app Eulino (voice-based learning
companion for children with the owl Elly). Vue 3, TypeScript, Vite website; application in
`app/`; deployed to GitHub Pages from `app/dist` by `deploy.yml` on push to `main`
(project page `https://mklschreiber.github.io/edubuddy-LandingPage/`, `VITE_BASE_URL` is
`/edubuddy-LandingPage/` until a custom domain is set).

- Keep changes compatible with that build path.
- Work from `app/` for all `npm` commands. The dev server is `npm run dev`.
- Stack details: `docs/architecture/stack.md`.
- **Naming:** "Eulino" is the marketing name and the only app name shown on the page.
  "EduBuddy" is the internal codename (app repository, package, Jira project `EDU`, this
  repository's name) and must not appear in page copy. The owl is still called Elly.
- **Platforms:** the app is planned for Android and iOS; page copy says "app" and names no
  single platform or store.
- Brand assets come from the app repository (`EduBuddy`, `docs/design/EDU-24-1/`): the app
  icon layers are the source of `app/public/favicon.svg` and `app/public/elly.svg`.

## Jira

<!-- TODO: fill in once the Jira project for the landing page exists. -->

| Setting | Value |
|---|---|
| Site | `https://mklschreiber.atlassian.net` |
| Cloud ID | `8e9f1375-dd39-419a-b3cf-48a86adeb617` |
| Project key | `<KEY>` |
| Board ID | `<n>` |
| Uses sprints | `<yes \| no>` |

| Status | Transition ID |
|---|---|
| Open | `<id>` |
| In Progress | `<id>` |
| In Review | `<id>` |
| Done | `<id>` |

## Branches & Story IDs

Generic rules from the handbook apply.

## Checks

All commands run in `app/`. CI:

- `ci.yml` — every pull request: `npm run lint:check`, `npm run test:unit -- --run`,
  `npm run build`.
- `deploy.yml` — every push to `main`: builds and deploys `app/dist` to GitHub Pages.

`npm run lint` may apply fixes (`--fix`). `npm run lint:check` does not.

### Developer runs

- `npm run lint`
- `npm run build`

### Tester runs

- `npm run test:unit -- --run`
- `npm run lint`
- `npm run build`

### Reviewer runs

- `npm run test:unit -- --run`
- `npm run lint:check`
- `npm run build`

## Versioning

In `app/` run `npm version <patch|minor|major> --no-git-tag-version`. It updates
`app/package.json` and both version fields in `app/package-lock.json`.

### Version source

File: `app/package.json`

Read command (file content on stdin, prints one `X.Y.Z` line or nothing):

```sh
awk -F'"' '/^  "version":/{print $4; exit}'
```

## Documentation

- Index `docs/architecture/index.md`: concepts and testing concepts under
  `## Current Concepts`, AI reviews under `## Reviews`.
- Log `docs/architecture/log.md`: newest first, one row `| <YYYY-MM-DD> | <decision> |` at the
  top of the table.

## Important Files

- `app/package.json` — scripts, dependencies and the version
- `app/src/data/content.ts` — all copy of the page
- `app/index.html` — title, description and Open Graph tags
- `.github/workflows/deploy.yml` — GitHub Pages deployment and `VITE_BASE_URL`

## Agent: architect

- Affected units: components, data modules, styles, tests.
- Also read `docs/architecture/stack.md`.
- **Technology stack:** Vue 3 Composition API, TypeScript, Vite, Vitest, Vue Test Utils, and ESLint, plus the client libraries recorded in `docs/architecture/stack.md`.
- **Project root:** Source code and package scripts are in `app/`. Do not introduce a backend, persistence layer, or abstraction pattern unless the ticket requires it.
- **App facts:** Copy about the app must match the EduBuddy app repository (`docs/architecture/`); do not invent features.

## Agent: developer

- **Vue:** Use Vue 3 Composition API with `<script setup lang="ts">`; keep presentation components focused and move reusable stateful behavior into composables where appropriate.
- **TypeScript:** Use explicit types at public boundaries and reuse types from `app/src/types/`.
- **Assets:** Build asset URLs from `import.meta.env.BASE_URL`, because the page is served below `/edubuddy-LandingPage/`.
- **State and navigation:** Use Pinia and Vue Router only when an approved concept requires them.

## Agent: tester

Tests live in `app/src/__tests__/`.

### Tech Stack for Tests

- **Vitest** — unit-test runner
- **Vue Test Utils** — Vue component testing utilities
- **jsdom** — browser-like test environment

### Test Levels

- **Unit and component tests** (`app/src/__tests__/`, cheap, milliseconds each): data modules,
  and components mounted in jsdom (rendered content, props, links, alt texts). Use them for
  everything that can be checked this way.
- **Manual browser checks** (expensive): only for layout and visuals that jsdom cannot cover
  (responsive breakpoints, animations); record them in the test concept.

### Naming Convention

```
<ComponentName>.spec.ts        // Component test
<moduleName>.spec.ts           // Data or utility test
```

### Test Structure (Given / When / Then)

```ts
it('renders the expected content', () => {
  const wrapper = mount(Component, { props: { value: 'test' } })

  expect(wrapper.text()).toContain('test')
})
```

### Asynchronous work

Do not use fixed delays; await Vue updates and mocked asynchronous work deterministically.

## Agent: reviewer

No additional rules.
