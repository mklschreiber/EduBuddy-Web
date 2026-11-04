---
type: Architecture Concept
title: EDU-45 — Privacy notice page at https://www.eulino.app/privacy
description: A second Vite entry (privacy/index.html, built to dist/privacy/index.html, served by GitHub Pages as /privacy → 301 /privacy/) renders one bilingual page (English and German articles with anchor links, no router, no i18n library, no new dependency) from a typed data module src/data/privacy.ts whose final copy is in this concept; the copy covers every data flow of the Android app and of the app for iPhone, iPad and Mac (verified against both app repositories), the website itself, legal bases and rights; crash reports via Firebase Crashlytics are described for all platforms (Apple integration planned, user review round 1); the footer gets a "Privacy" link and the header logo links home.
tags: [EDU-45, privacy, legal, build, vite, components, data, styles, tests]
timestamp: 2026-11-04T16:00:00+01:00
status: draft
---

## Story

As a parent, I want to read Eulino's privacy notice on the web, so that I understand which data
the app uses and that the conversation is processed by Google's Gemini Live API, not by Eulino
itself.

Jira: EDU-45 — https://mklschreiber.atlassian.net/browse/EDU-45

Acceptance criteria (short form; full text in Jira):

1. `https://www.eulino.app/privacy` serves the notice (a redirect to `/privacy/` is fine); `/`
   stays the coming-soon page.
2. Gemini Live API is the core section (voice streamed live to Google; Google creates Elly's
   answers and the transcripts; Eulino does not process or store audio, only sends; no control
   over Google; Google's terms for the parent's own key apply).
3. Google's handling per tier (free / paid / EEA-CH-UK) with links to the Gemini API terms, the
   Google privacy policy and the Firebase privacy page.
4. Every data flow of the apps (microphone, instructions + last 5 titles, resumption, history and
   transcript, pictures, BYOK key, Crashlytics Android only, backups, deleting, children, no ads /
   analytics / account). Changed by user review round 1: Crashlytics is described for all
   platforms (D11).
5. Android / Apple differences named correctly; "Eulino" only, never "EduBuddy", no model names.
6. The website itself: GitHub Pages, IP in server logs; no cookies, analytics, web fonts.
7. "In short" at the top, "Last updated" date, section about changes.
8. German and English; the language mechanism is decided here.
9. Footer link "Privacy" on every page.
10. "Who is responsible" with the controller data; legal bases, rights, children filled in; no
    `⟦…⟧` placeholders.
11. Title and meta description set; readable on mobile.

Out of scope: legal review (Gemini API terms 18+ / no consumer use / Paid Services only in the
EEA), changes to the apps.

No design artifact exists (`docs/design/EDU-45*` is absent). The page reuses the existing theme
(`src/assets/styles/main.css`), header, footer and logo.

Sources of the content (all read on 2026-11-04):

- Android: `EduBuddy-Android/docs/architecture/EDU-28-privacy-notice.md` (D9 inventory, appendix
  DE/EN draft), `stack.md` → Privacy, `EDU-4`, `EDU-14`, `EDU-25`, `EDU-42`,
  `app/src/main/res/xml/data_extraction_rules.xml`.
- Apple: `EduBuddy-Apple/docs/architecture/stack.md`, `EDU-31-onboarding.md` (Keychain, reinstall),
  `EDU-36-gemini-live-sessions.md` (Live, resumption, pictures), `EDU-39-session-history.md`
  (history, backup, no delete), `EDU-41-topic-suggestions.md` (last 5 titles), `EDU-42` (Apple).
- Google: https://ai.google.dev/gemini-api/terms ("How Google Uses Your Data", unpaid / paid /
  EEA-CH-UK, read 2026-11-04).
- Template for hosting, legal bases and rights: `michaelschreibernet/app/src/views/DataProtectionPage.vue`.
- Live check: `www.eulino.app` is a CNAME to `mklschreiber.github.io` (Cloudflare DNS only, not
  proxied; `server: GitHub.com`), so only GitHub sees visitor IP addresses. `/privacy` returns 404
  today.

## Architecture Decisions

### D1 — Vite multi-page build: `privacy/index.html` as a second entry (no router)

**Decision:** add a second HTML entry `app/privacy/index.html` and list both entries in
`build.rollupOptions.input` of `vite.config.ts`. The build writes `dist/index.html` and
`dist/privacy/index.html` (shared JS/CSS chunks in `dist/assets/`). GitHub Pages answers
`/privacy` with a **301 to `/privacy/`** and serves `privacy/index.html`; AC 1 accepts the redirect.

Why:

- **No new dependency** (Vue Router would be one) and no 404-fallback trick: with Vue Router and
  `404.html`, GitHub Pages answers `/privacy` with HTTP **404** status plus the SPA — crawlers,
  the Play Console URL check and link checkers would see a 404. The folder form is a real file
  with HTTP 200.
- The folder form (`privacy/index.html`) instead of `privacy.html`: it is the standard static-host
  layout, works the same in `vite dev` (`/privacy/`), `vite preview` and GitHub Pages, and is what
  the Android concept already anticipated (EDU-28 D1). Both apps keep linking
  `https://www.eulino.app/privacy` without a slash; browsers follow the 301.
- Each page has its own static `<title>` and `<meta name="description">` in its HTML file (AC 11),
  like `index.html` today — no head-management library.
- The base URL keeps working: Vite rewrites `/src/…` and public paths in both HTML files with
  `base`, and internal links are built from `import.meta.env.BASE_URL`.

### D2 — One page with both languages, English first, anchor links (AC 8)

**Decision:** the privacy page shows **both** notices on one page: an English `<article id="en"
lang="en">` followed by a German `<article id="de" lang="de">`. Below the page heading, a small
language navigation links `#en` ("English") and `#de` ("Deutsch").

Why:

- No state, no JavaScript logic, no i18n library, no second URL: the apps link one URL
  (`/privacy`), and every reader — a German parent, an English-speaking tester, a store reviewer —
  sees the full binding text without choosing anything. A switch would hide one language and need
  state (and a decision which language is the default for a link without a fragment).
- English first because the site is English (`<html lang="en">`) and the apps' source language is
  English; German readers jump with one tap. `lang` on each article makes screen readers and
  browser translation use the right language.
- Both notices have the **same sections in the same order with the same ids** (guarded by a
  test), so they cannot drift apart.

### D3 — Copy in a typed data module `src/data/privacy.ts`

All page copy lives in `app/src/data/privacy.ts` (types in `app/src/types/privacy.ts`), exactly as
written in "Interfaces" below — the developer copies it and does not reword it. A section is a
list of typed blocks (`paragraph`, `list`, `address`, `link`) so that the order of text, address
lines and links is data, and the components only render. `content.ts` stays the home-page copy
(profile: "all copy of the page"); a separate module keeps the ~30 kB notice out of the home
page's data and makes the notice testable on its own.

- `PRIVACY_LAST_UPDATED = '2026-11-04'` (ISO, for `<time datetime>`); the displayed text is per
  language ("Last updated: 4 November 2026" / "Stand: 4. November 2026"). When the notice changes,
  both strings and the constant are updated together (test: both display strings contain the day
  and year of the constant).
- German uses the "du" form, like the apps and the EDU-28 draft. The reader ("you" / "du") is the
  parent; the intro says so.
- Typographic quotes and apostrophes (`’`, `“ ”`, `„ “`) so no string needs escaping.

### D4 — Wording principles (AC 2, 5)

- **Eulino only sends; Google decides.** The notice states the facts of the apps and quotes the
  Gemini API terms in plain words, then links Google's binding text. It does not promise anything
  on Google's behalf.
- **"Eulino" only.** No "EduBuddy" anywhere — also not in paths (the Mac container is described
  as "Library → Containers → Eulino", not by bundle id). Elly stays Elly.
- **No model names** ("an image model of the Gemini API", "the Gemini API"), no endpoint names.
- **Platforms are named on this page** (exception to the profile rule "page copy names no single
  platform or store"): a privacy notice must name platform differences (AC 5). Names used:
  "Android", "iPhone, iPad and Mac" (the Apple app is one multiplatform app for all three),
  "Google Play", "Apple", "iCloud". The home page stays platform-neutral. The profile
  (`docs/ai-project.md` → Platforms) gets this exception.
- Navigation paths use "→" like the Android app strings ("Settings → Privacy").

### D5 — Verified data inventory, both platforms

Every statement of the copy maps to this table. "Same" = identical on both platforms.

| Data flow | Android | iPhone, iPad, Mac | Copy section |
|---|---|---|---|
| Microphone only while a session runs, off on pause/stop | yes (EDU-1, EDU-13) | yes (EDU-36) | `gemini` |
| Voice streamed live to Gemini Live API; Google returns audio answer + input/output transcription | yes | yes (same `BidiGenerateContent`, `x-goog-api-key`) | `gemini` |
| No audio recorded or stored by the app | yes (stack Privacy) | yes (EDU-39 D1 "never audio") | `gemini`, `history` |
| Session instructions + titles (AI title, else topic) of the last 5 ended sessions in the Live setup | yes (EDU-2, EDU-6) | yes (EDU-41, newest 5) | `gemini`, `history` |
| Session resumption: Google keeps the session state for a limited time | yes (EDU-2) | yes (EDU-36 resumption handle) | `gemini` |
| History on device: start, duration, topic, language, status, AI title, ≤ 10 points; recorded once the lesson left its first step (EDU-42: start state) | Room `edubuddy.db` | `Application Support/History/history.json` | `history` |
| Transcript kept until summarised (seconds; max 5 failed attempts / 7 days), sent once to the Gemini API, then deleted | in the DB (can be in a backup made in that window, EDU-4) | `History/Pending/`, `isExcludedFromBackup` (never in a backup) | `history` |
| Picture: only a short description (subject) sent to an image model of the Gemini API; image only in memory | yes (EDU-19) | yes (EDU-36, stack) | `pictures` |
| API key BYOK, encrypted on device only, never backed up, sent only to Google; key check without content | Android Keystore (AES-GCM), `noBackupFilesDir` (EDU-7) | Keychain, `WhenUnlockedThisDeviceOnly`, not synchronizable (EDU-31 D6) | `api-key` |
| Key after deleting the app | deleted with app data | **stays in the Keychain** (EDU-31 D4 "Reinstall on iOS"; also on Mac), replaced on next setup | `api-key`, `deleting` |
| Crash reports Firebase Crashlytics, release builds, 90 days, no content | yes (EDU-14) | **planned** (user review round 1, D11; Apple story EDU-46 — today no Firebase / Google SDK in the Apple stack) | `in-short`, `crash-reports`, `deleting`, `legal-bases` |
| OS-level diagnostics shared with the developer only if the user opted in | Google Play (usage & diagnostics) | Apple ("Share with App Developers", TestFlight) | `crash-reports` (one generic sentence for both stores) |
| Backup | only `edubuddy.db` (history); cloud only end-to-end encrypted; device transfer | history.json **and UserDefaults** (onboarding flag, own lesson flow) in iCloud / Finder / Time Machine backups and Quick Start; key and pending transcripts never | `device-and-backups` |
| Settings (onboarding flag, lesson flow) | SharedPreferences, not backed up | UserDefaults, backed up | `device-and-backups` |
| Lesson-flow file export / share (only where the user chooses) | testing-only editor (EDU-25) | lesson flow editor (EDU-38) | `device-and-backups` |
| In-app delete of history | none (EDU-28 U4) | none (EDU-39 D12) | `deleting` |
| No ads, no analytics, no advertising ID, no account, no child profile; onboarding asks nothing about the child | yes | yes | `in-short`, `children` |
| Google Search grounding (would add 30-day storage) | not used (no `googleSearch` in code) | not used | — (not mentioned) |
| Website: GitHub Pages, IP/date/browser in server logs; no cookies, analytics, web fonts, external resources, forms | — | — | `website` |

Deviation from the story text, decided by the facts: AC 4 says "backups (Android backup / iCloud:
history only)". On Apple devices `UserDefaults` (whether the introduction is finished, an edited
lesson flow) is part of backups too (Apple stack.md → Backup). The copy says so; nothing personal
is in these settings.

### D6 — Legal bases and rights (AC 10), conservative; legal check recommended

Mapping (copy section `legal-bases`):

| Processing | Legal basis | Reason for the choice |
|---|---|---|
| App functions the user starts (conversation, instructions and titles, resumption, summary, pictures, key check, history and key on the device) | Art. 6(1)(b) GDPR | They are the function the parent chooses to use; the developer receives none of these data. |
| Crash reports (Crashlytics, all platforms; Apple planned, D11) | Art. 6(1)(f) GDPR | Legitimate interest in a stable app; no content, random installation ID. |
| Website server logs (GitHub Pages) | Art. 6(1)(f) GDPR | Same as the template (michaelschreiber.net). |
| Google's own processing under the parent's key; OS backups | not the developer's processing; Google's terms / the user's device settings | Stated as such, no legal basis claimed. |

Rights (copy section `rights`): Art. 15, 16, 17, 18, 20, 21 (objection against (f)), 77 with the
competent authority for a private controller in Bavaria (Leipheim): **Bayerisches Landesamt für
Datenschutzaufsicht, Promenade 18, 91522 Ansbach** (verified on lda.bayern.de, 2026-11-04). No
consent is collected, so Art. 7(3) withdrawal is not listed.

Children (copy section `children`): factual per EDU-28 D4 — a parent sets up Eulino with their own
Google account and key and uses it together with the child; the parent decides. No age limit and
no consent mechanism are promised (out of scope: legal check).

**Recommended legal check (not part of this story):** (b) vs. consent for children's voice data;
Crashlytics on (f) and § 25 TDDDG; the Gemini API terms (18+, no consumer use, Paid Services only
in the EEA/CH/UK) versus a children's app; the DPF statements for GitHub and Google. The texts here
describe facts and a reasonable mapping; they are not legal advice.

### D7 — Footer "Privacy" link and header home link (AC 9)

- `content.ts` gets `PRIVACY_URL = \`${import.meta.env.BASE_URL}privacy/\`` (resolves to
  `/privacy/`). The footer shows **Privacy · Imprint · Developer** in this order; "Privacy" is an
  internal link (same tab, no `target`, no `rel`). The trailing slash avoids the 301 hop for
  internal navigation; it is the same page as `/privacy`.
- The footer is used by both pages, so the link is on every page.
- `SiteHeader` wraps `AppLogo` in a link to `import.meta.env.BASE_URL`, so the privacy page has a
  way back home. The link's accessible name is the logo text "Eulino" (the icon has `alt=""`).
- The existing highlight with `id: 'privacy'` in `content.ts` is the home-page card "Listens only on
  request" (microphone only during a session). It is unrelated to the page, its text is still true
  (D5), and it stays unchanged.

### D8 — Keeping the notice true (rule from Android EDU-28 D8)

Recorded in `stack.md` → Privacy notice: any app story (Android or Apple) that adds or changes a
data flow (new recipient, new stored data, new backup scope, new SDK) requires a follow-up story in
this repository (label `Web`) to update `src/data/privacy.ts` and `PRIVACY_LAST_UPDATED`. D5 is
the inventory the page was written from; such a follow-up updates D5 as well. A change of the
website itself (new external resource, cookie, form, analytics) updates the `website` section in
the same story.

**Apple Crashlytics (D11):** the copy already describes Crashlytics for the Apple app. The Apple
story that integrates it, [EDU-46](https://mklschreiber.atlassian.net/browse/EDU-46) "Integrate Firebase & Crashlytics" (label Apple, relates to EDU-45), must verify the `crash-reports`, `in-short`,
`deleting` and `legal-bases` texts against what it actually ships (release builds only, data
collected, retention, no session content) and, if anything differs, create the `Web` follow-up.
Until EDU-46 ships, the notice describes a planned flow; this over-states, never
under-states, what the Apple app sends.

### D11 — Crash reports on all platforms (user review round 1)

**Decision (user, 2026-11-04):** Firebase Crashlytics will also be added to the app for iPhone,
iPad and Mac, and the notice says so already. The `crash-reports` section therefore describes one
behaviour for all platforms, modelled on Android EDU-14 and stated generically (no Apple-specific
details that do not exist yet):

- only published (release) versions send reports, not development builds (EDU-14: release builds
  only);
- data: technical error description, device data (model, operating-system version, free memory
  and storage, app version), a random installation ID, the times the app was started; no session
  content, no history, no API key;
- Firebase keeps reports for 90 days.

Replaced: "Only the Android app sends crash reports … The app for iPhone, iPad and Mac does not",
the Apple paragraph ("no crash reporting and no Firebase", "Share with App Developers",
TestFlight) and "Android" in the `deleting` and `legal-bases` crash items. The store-side opt-in
diagnostics stay as one generic sentence for Google Play and Apple. Crash reporting is no longer a
platform difference; the remaining differences (key storage and deletion, backups, transcript in
backups, deleting data) are unchanged.

### D9 — Styles and mobile (AC 11)

- The privacy page reuses the global theme; component styles are scoped.
- `main.privacy`: top padding like the hero (`clamp(112px, 13vw, 160px)`, the header is absolutely
  positioned), bottom `clamp(56px, 8vw, 96px)`. Content column `max-width: 760px` inside
  `.container` (≈ 70 characters per line at 17 px).
- `h1` `clamp(2rem, 5vw, 3rem)`, weight 800; article `h2` `clamp(1.5rem, 3.5vw, 2rem)`; section
  `h3` `1.25rem`, `margin-top: 40px`; paragraphs and lists `margin-top: 12px`, color
  `--color-text-muted` for body text, `--color-text` for headings; lists `padding-left: 1.25em`,
  items `margin-top: 6px`.
- Links in the notice: `color: var(--color-brand-light)`, underlined, `overflow-wrap: anywhere`
  (long URLs and the e-mail never overflow a 320 px screen).
- `.privacy-notice__updated`: `--color-text-subtle`, `0.9375rem`. `address`: `font-style: normal`.
- The "In short" section is a card: `border: 1px solid var(--color-border)`, `border-radius:
  var(--radius-lg)`, `background: var(--color-surface)`, `padding: 24px`.
- The German article: `margin-top: 72px; padding-top: 48px; border-top: 1px solid
  var(--color-border)`.
- Language links: inline pills like `.hero__status` (border, `--radius-pill`, `padding: 6px 16px`,
  `gap: 12px`, `margin-top: 20px`).
- Anchor targets (`article`, `h3`) get `scroll-margin-top: 24px`.

### D10 — No new dependency; version

No library, no router, no plugin. Minor version (new page): `0.1.0 → 0.2.0`
(`npm version minor --no-git-tag-version` in `app/`), relative to `main` at implementation time.

## Affected Components

| File | Change |
|---|---|
| `app/privacy/index.html` | **new** — second entry: head (title, description, OG), noscript, `#app`, `/src/privacy-main.ts` (D1) |
| `app/vite.config.ts` | `build.rollupOptions.input` with `main` and `privacy` (D1) |
| `app/src/privacy-main.ts` | **new** — imports `main.css`, mounts `PrivacyApp` |
| `app/src/PrivacyApp.vue` | **new** — page root: header, `main.privacy` with h1, language links, two `PrivacyNotice`, footer (D2, D9) |
| `app/src/components/PrivacyNotice.vue` | **new** — renders one `PrivacyNotice` (article, h2, date, intro, sections, blocks) |
| `app/src/types/privacy.ts` | **new** — types (Interfaces) |
| `app/src/data/privacy.ts` | **new** — the copy (Interfaces), `PRIVACY_LAST_UPDATED`, `PRIVACY_PAGE_TITLE` |
| `app/src/data/content.ts` | `PRIVACY_URL` (D7) |
| `app/src/components/SiteFooter.vue` | "Privacy" link first (D7) |
| `app/src/components/SiteHeader.vue` | logo links home (D7) |
| `app/src/__tests__/` | new `privacy.spec.ts`, `PrivacyNotice.spec.ts`, `PrivacyApp.spec.ts`, `SiteHeader.spec.ts`; extend `SiteFooter.spec.ts` (Testing Notes) |
| `app/package.json`, `app/package-lock.json` | version 0.2.0 (D10) |
| `docs/architecture/stack.md` | multi-page build, privacy page, bilingual copy module, D8 rule (done by the architect) |
| `docs/ai-project.md` | Platforms: exception for the privacy notice (D4, done by the architect) |

Not changed: `index.html`, `App.vue`, `ComingSoonHero.vue`, `AppLogo.vue`, `main.css`,
`deploy.yml` (it already deploys all of `app/dist`), `ci.yml`.

## Data Flow

```
build:  vite build ── input.main    ── index.html          ─► dist/index.html
                   └─ input.privacy ── privacy/index.html  ─► dist/privacy/index.html
                                                              dist/assets/* (shared chunks)
deploy: deploy.yml uploads app/dist ─► GitHub Pages (www.eulino.app)

request:  GET /privacy  ── 301 ──► /privacy/ ── 200 privacy/index.html
          privacy-main.ts ─► PrivacyApp.vue
                               ├─ SiteHeader (logo → BASE_URL)
                               ├─ h1 PRIVACY_PAGE_TITLE, links #en / #de
                               ├─ PrivacyNotice(privacyNotices[0] = en)
                               ├─ PrivacyNotice(privacyNotices[1] = de)
                               └─ SiteFooter (Privacy → BASE_URL + 'privacy/', Imprint, Developer)
          data/privacy.ts ─► PrivacyNotice ─► section h3 + blocks (p | ul | address | link)

apps:     Android (EDU-28) Settings → Privacy, onboarding step 3 ─► https://www.eulino.app/privacy
```

No data leaves the page: no requests besides the page's own files.

## Interfaces

### `app/vite.config.ts` (addition)

```ts
export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  plugins: [vue()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        privacy: fileURLToPath(new URL('./privacy/index.html', import.meta.url)),
      },
    },
  },
})
```

### `app/privacy/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#061716" />
    <meta name="color-scheme" content="dark" />
    <title>Privacy notice · Datenschutzhinweis – Eulino</title>
    <meta
      name="description"
      content="Which data the Eulino app and this website use: during a session the child's voice goes to Google's Gemini Live API; history and API key stay on the device. In English and German."
    />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Eulino" />
    <meta property="og:title" content="Privacy notice · Datenschutzhinweis – Eulino" />
    <meta
      property="og:description"
      content="Which data the Eulino app and this website use. In English and German."
    />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <noscript>
      <p>
        Please enable JavaScript to read Eulino's privacy notice. Bitte aktiviere JavaScript, um den
        Datenschutzhinweis von Eulino zu lesen. Contact / Kontakt: info@michaelschreiber.net
      </p>
    </noscript>
    <div id="app"></div>
    <script type="module" src="/src/privacy-main.ts"></script>
  </body>
</html>
```

### `app/src/privacy-main.ts`

```ts
import './assets/styles/main.css'

import { createApp } from 'vue'
import PrivacyApp from './PrivacyApp.vue'

createApp(PrivacyApp).mount('#app')
```

### `app/src/data/content.ts` (addition)

```ts
/** The privacy notice page (EDU-45); `/privacy` redirects here on GitHub Pages. */
export const PRIVACY_URL = `${import.meta.env.BASE_URL}privacy/`
```

### Components

- `PrivacyApp.vue` (no props): `SiteHeader`; `<main class="privacy"><div class="container
  privacy__inner">`; `<h1>{{ PRIVACY_PAGE_TITLE }}</h1>`; `<nav class="privacy__languages"
  aria-label="Language / Sprache">` with one `<a :href="`#${n.lang}`" :hreflang="n.lang"
  :lang="n.lang">{{ n.languageName }}</a>` per notice; `<PrivacyNotice v-for="n in privacyNotices"
  :key="n.lang" :notice="n" />`; `SiteFooter`. Exactly one `h1` on the page.
- `PrivacyNotice.vue`, `defineProps<{ notice: PrivacyNotice }>()`:
  - `<article :id="notice.lang" :lang="notice.lang" class="privacy-notice"
    :aria-labelledby="`${notice.lang}-title`">`
  - `<h2 :id="`${notice.lang}-title`">{{ notice.title }}</h2>`
  - `<p class="privacy-notice__updated"><time :datetime="PRIVACY_LAST_UPDATED">{{ notice.updated
    }}</time></p>`, `<p class="privacy-notice__intro">{{ notice.intro }}</p>`
  - per section: `<section :class="['privacy-notice__section', `privacy-notice__section--${s.id}`]"
    :aria-labelledby="`${notice.lang}-${s.id}`"><h3 :id="`${notice.lang}-${s.id}`">{{ s.title
    }}</h3>` + blocks in order:
    - `paragraph` → `<p>{{ text }}</p>`
    - `list` → `<ul><li v-for>{{ item }}</li></ul>`
    - `address` → `<address>` with one `<span class="privacy-notice__line">` (display: block) per
      line
    - `link` → `<p>{{ prefix }} <a :href>{{ link.label }}</a></p>` (no prefix → only the link);
      external (`href` starts with `https://`) → `target="_blank" rel="noopener noreferrer"`;
      `mailto:` / `tel:` → no `target`, no `rel`.
  - Text is rendered as text (`{{ }}`), never `v-html`.
- `SiteFooter.vue`: `<a :href="PRIVACY_URL">Privacy</a>` before "Imprint".
- `SiteHeader.vue`: `<a :href="homeUrl" class="site-header__home"><AppLogo /></a>`, `homeUrl =
  import.meta.env.BASE_URL`; style `display: inline-flex; text-decoration: none`.

### `app/src/types/privacy.ts`

```ts
export type PrivacyLanguage = 'en' | 'de'

export interface PrivacyLink {
  label: string
  href: string
}

export type PrivacyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: readonly string[] }
  | { type: 'address'; lines: readonly string[] }
  | { type: 'link'; prefix?: string; link: PrivacyLink }

export interface PrivacySection {
  /** Stable id, identical in both languages; the heading id is `${lang}-${id}`. */
  id: string
  title: string
  blocks: readonly PrivacyBlock[]
}

export interface PrivacyNotice {
  lang: PrivacyLanguage
  /** The language's own name, for the language links ("English", "Deutsch"). */
  languageName: string
  title: string
  /** Displayed date line, e.g. "Last updated: 4 November 2026". */
  updated: string
  intro: string
  sections: readonly PrivacySection[]
}
```

### `app/src/data/privacy.ts` — final copy (EN + DE)

Copy it as is (Prettier may re-wrap lines; the strings must stay identical).

```ts
import type { PrivacyLink, PrivacyNotice } from '@/types/privacy'

/** Date of the current notice (ISO). Update together with both `updated` strings (EDU-45 D3). */
export const PRIVACY_LAST_UPDATED = '2026-11-04'

export const PRIVACY_PAGE_TITLE = 'Privacy notice · Datenschutzhinweis'

export const CONTROLLER = {
  name: 'Michael Schreiber',
  street: 'Grockelhofen 32',
  city: '89340 Leipheim',
  phone: '+49 (0) 162 4337334',
  phoneHref: 'tel:+491624337334',
  email: 'info@michaelschreiber.net',
} as const

export const PRIVACY_LINKS = {
  geminiTerms: 'https://ai.google.dev/gemini-api/terms',
  googlePrivacy: 'https://policies.google.com/privacy',
  firebasePrivacy: 'https://firebase.google.com/support/privacy',
  githubPrivacyEn:
    'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
  githubPrivacyDe:
    'https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement',
} as const

const emailLink: PrivacyLink = { label: CONTROLLER.email, href: `mailto:${CONTROLLER.email}` }
const phoneLink: PrivacyLink = { label: CONTROLLER.phone, href: CONTROLLER.phoneHref }

const english: PrivacyNotice = {
  lang: 'en',
  languageName: 'English',
  title: 'Privacy notice',
  updated: 'Last updated: 4 November 2026',
  intro:
    'Eulino is a learning app for children: they talk with Elly, an owl and AI learning buddy. This notice explains which data the Eulino app (for Android and for iPhone, iPad and Mac) and this website use, where the data go and how you can delete them. It is written for parents: “you” means the parent who sets up Eulino.',
  sections: [
    {
      id: 'in-short',
      title: 'In short',
      blocks: [
        {
          type: 'list',
          items: [
            'During a session, your child’s voice is streamed live to Google’s Gemini Live API. Google creates Elly’s answers and the transcripts from it. Eulino itself does not process or store any audio: it only sends the data to Google and has no control over what Google does with them.',
            'Eulino uses your own Gemini API key, so Google’s terms for your key apply. On the free tier, Google may use the data to improve its products; in the European Economic Area, Switzerland and the United Kingdom, the stricter rules of the paid tier apply.',
            'The session history, your API key and the settings stay on your device. The content of the sessions never reaches the developer of Eulino.',
            'The app sends crash reports to Firebase Crashlytics (Google) so that errors can be fixed. They contain no session content.',
            'No advertising, no analytics, no account. This website uses no cookies.',
          ],
        },
      ],
    },
    {
      id: 'controller',
      title: 'Who is responsible',
      blocks: [
        {
          type: 'paragraph',
          text: 'Responsible for Eulino and this website (controller under the GDPR):',
        },
        {
          type: 'address',
          lines: [CONTROLLER.name, CONTROLLER.street, CONTROLLER.city, 'Germany'],
        },
        { type: 'link', prefix: 'Phone:', link: phoneLink },
        { type: 'link', prefix: 'E-mail:', link: emailLink },
        {
          type: 'paragraph',
          text: 'For the data that Google processes under your own API key, Google’s terms and privacy policy apply as well (see “What Google does with your data”).',
        },
      ],
    },
    {
      id: 'gemini',
      title: 'Talking with Elly: Google’s Gemini Live API',
      blocks: [
        {
          type: 'paragraph',
          text: 'This is the core of Eulino. Elly’s voice, her answers and the text of the conversation come from Google’s Gemini Live API, not from Eulino.',
        },
        {
          type: 'list',
          items: [
            'The app uses the microphone only while a session is running. When the session is paused or ended, the microphone is off. You can withdraw the microphone permission at any time in the settings of your device.',
            'During a session, the app streams your child’s voice live to Google’s Gemini Live API. Google creates Elly’s spoken answers from it and a text version (transcript) of what your child and Elly say.',
            'Eulino itself does not process or store any audio: the app only sends it to Google and plays Elly’s answers.',
            'Together with the conversation, the app sends the instructions for the session and the titles of the last five sessions from the history, so that Elly can suggest new topics.',
            'So that an interrupted session can continue, Google keeps the state of the conversation for a limited time (session resumption).',
            'Eulino has no control over what Google does with these data. Google’s terms for your own API key apply (next section).',
          ],
        },
      ],
    },
    {
      id: 'google',
      title: 'What Google does with your data',
      blocks: [
        {
          type: 'paragraph',
          text: 'Eulino only sends data to Google’s Gemini API. Because the app uses your own key, the requests run in your own Google Cloud project, and Google processes them under the Gemini API terms and Google’s privacy policy. According to the Gemini API terms:',
        },
        {
          type: 'list',
          items: [
            'Free tier (unpaid quota, no billing set up): Google uses the content sent and the answers to provide, improve and develop its products and technologies, and human reviewers may read and annotate them. Before that, Google disconnects the data from your Google account, API key and project. Google asks not to send sensitive, confidential or personal information to the free tier.',
            'Paid tier (billing set up): Google does not use the content to improve its products. It logs requests and answers for a limited period to detect and prevent abuse.',
            'In the European Economic Area, Switzerland and the United Kingdom, the paid-tier rules on how Google uses your data apply to the free tier as well.',
            'As with every internet connection, Google sees the IP address of your device. Google may process the data outside the EU, for example in the USA.',
          ],
        },
        { type: 'paragraph', text: 'Binding is Google’s own, current text:' },
        {
          type: 'link',
          prefix: 'Gemini API terms:',
          link: { label: PRIVACY_LINKS.geminiTerms, href: PRIVACY_LINKS.geminiTerms },
        },
        {
          type: 'link',
          prefix: 'Google privacy policy:',
          link: { label: PRIVACY_LINKS.googlePrivacy, href: PRIVACY_LINKS.googlePrivacy },
        },
      ],
    },
    {
      id: 'history',
      title: 'Session history and summaries',
      blocks: [
        {
          type: 'list',
          items: [
            'Once a session has moved past its first step, the app saves on your device: start time, duration, topic, language and, after the session, a title and up to 10 main points.',
            'To create the title and the points, the app keeps the text of the conversation (transcript) on your device for a short time and sends it once to the Gemini API (Google). Then the text is deleted – usually a few seconds after the session, at the latest after 7 days or 5 failed attempts.',
            'On iPhone, iPad and Mac, the transcript is never part of a backup. On Android, it can be part of a backup that happens to run during this short time.',
            'The history is shown only in the app. It contains no audio.',
          ],
        },
      ],
    },
    {
      id: 'pictures',
      title: 'Pictures',
      blocks: [
        {
          type: 'list',
          items: [
            'When Elly shows a picture, the app sends a short description written by Elly – only what the picture should show, no personal details – to an image model of the Gemini API (Google). Google creates the picture.',
            'Pictures are kept in memory only while they are shown. They are not saved and are not part of the history or of a backup.',
          ],
        },
      ],
    },
    {
      id: 'api-key',
      title: 'Your Gemini API key',
      blocks: [
        {
          type: 'list',
          items: [
            'You create the key yourself in Google AI Studio. It belongs to your Google account and your Google Cloud project. Eulino has no built-in key.',
            'The app stores the key encrypted and only on your device: on Android with the Android Keystore, on iPhone, iPad and Mac in the Keychain (only on this device, not synced with iCloud Keychain). The key is never part of a backup.',
            'The key is sent only to Google, with every request to the Gemini API. To check a new key, the app sends one request without any content.',
            'On iPhone, iPad and Mac, the key can stay in the Keychain of the device after the app is deleted. It stays on this device only and is replaced when you set up Eulino again. To make sure it can no longer be used, delete the key in Google AI Studio.',
          ],
        },
      ],
    },
    {
      id: 'crash-reports',
      title: 'Crash reports',
      blocks: [
        {
          type: 'paragraph',
          text: 'When the app crashes or stops responding, it sends a crash report to Firebase Crashlytics (Google), on Android as well as on iPhone, iPad and Mac. Only the published versions of the app do this, not development builds. The report contains the technical error description, device data (model, operating system version, free memory and storage, app version), a random installation ID and the times the app was started. It contains no session content, no history and no API key. Firebase keeps crash reports for 90 days.',
        },
        {
          type: 'paragraph',
          text: 'In addition, Google Play and Apple can share crash statistics with the developer if you allowed this in the settings of your device.',
        },
        {
          type: 'link',
          prefix: 'Firebase privacy:',
          link: { label: PRIVACY_LINKS.firebasePrivacy, href: PRIVACY_LINKS.firebasePrivacy },
        },
      ],
    },
    {
      id: 'device-and-backups',
      title: 'What stays on your device, and backups',
      blocks: [
        {
          type: 'list',
          items: [
            'On your device: the session history, the API key (encrypted), whether the introduction is finished, and the settings for the sessions.',
            'Android: only the session history can be part of your Android backup or of a transfer to a new device. A cloud backup is only made if Android can encrypt it end to end (screen lock set). The API key and the settings are never backed up.',
            'iPhone, iPad and Mac: the session history and the settings can be part of your iCloud backup, of a backup on your computer or with Time Machine, and of a transfer to a new device. The API key and transcripts waiting for their summary are never backed up.',
            'Eulino has no cloud sync of its own. If you export or share a lesson plan, the file goes only where you choose; it contains only the lesson steps.',
          ],
        },
      ],
    },
    {
      id: 'deleting',
      title: 'Deleting your data',
      blocks: [
        {
          type: 'list',
          items: [
            'The app has no delete button for the history yet.',
            'Android: Settings → Apps → Eulino → Storage → Clear storage (the names can differ on your device), or uninstall the app. This deletes the history, the API key and the settings.',
            'iPhone and iPad: delete the app. This deletes the history and the settings; the API key can stay in the Keychain (see “Your Gemini API key”).',
            'Mac: moving the app to the Trash does not delete its data. They stay in your user library under Library → Containers → Eulino; delete that folder as well.',
            'Backups: in the backup settings of your Google account (Android), of iCloud or of your computer (Apple). Older backups can still contain the history.',
            'Data at Google under your key: in Google AI Studio or your Google Cloud project. There you can also delete the key at any time. Google’s terms apply.',
            'Crash reports are deleted automatically after 90 days.',
          ],
        },
        { type: 'link', prefix: 'Questions:', link: emailLink },
      ],
    },
    {
      id: 'children',
      title: 'Children',
      blocks: [
        {
          type: 'paragraph',
          text: 'Eulino is a learning app for children. A parent sets up Eulino with their own Google account and their own Gemini API key and uses it together with the child. The parent decides whether and how the child uses Eulino.',
        },
        {
          type: 'paragraph',
          text: 'Eulino asks for no name, no age and no other details about the child and has no child profile. What the child says during a session goes to Google as described above. Please make sure that your child does not share personal details in the conversation.',
        },
      ],
    },
    {
      id: 'website',
      title: 'This website',
      blocks: [
        {
          type: 'list',
          items: [
            'This website (www.eulino.app) is hosted on GitHub Pages, a service of GitHub, Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, USA. When you open a page, GitHub processes technical access data in server log files, in particular your IP address, the date and time of access and information about your browser, to deliver the page and keep it secure.',
            'The website uses no cookies, no analytics, no tracking and no web fonts, loads nothing from other servers and has no forms.',
            'GitHub may process the data in the USA. GitHub participates in the EU-U.S. Data Privacy Framework.',
          ],
        },
        {
          type: 'link',
          prefix: 'GitHub privacy statement:',
          link: { label: PRIVACY_LINKS.githubPrivacyEn, href: PRIVACY_LINKS.githubPrivacyEn },
        },
      ],
    },
    {
      id: 'legal-bases',
      title: 'Legal bases',
      blocks: [
        {
          type: 'paragraph',
          text: 'The developer processes personal data on these legal bases of the GDPR (General Data Protection Regulation):',
        },
        {
          type: 'list',
          items: [
            'App functions you start yourself – the conversation with Elly, the session instructions and titles, session resumption, the summary, pictures, the key check, and the history and the key on your device: Art. 6(1)(b) GDPR (providing the app functions you use).',
            'Crash reports: Art. 6(1)(f) GDPR. The legitimate interest is a stable app without errors; the reports contain no session content.',
            'Server log files of this website: Art. 6(1)(f) GDPR. The legitimate interest is a reliable and secure delivery of the website.',
          ],
        },
        {
          type: 'paragraph',
          text: 'How Google processes the data it receives under your API key is governed by Google’s terms. Backups are made by Android or Apple according to the settings of your device.',
        },
      ],
    },
    {
      id: 'rights',
      title: 'Your rights',
      blocks: [
        { type: 'paragraph', text: 'Under the GDPR you have the right to:' },
        {
          type: 'list',
          items: [
            'access the personal data stored about you (Art. 15),',
            'rectification (Art. 16) and erasure (Art. 17) of these data,',
            'restriction of processing (Art. 18),',
            'data portability (Art. 20),',
            'object at any time, on grounds relating to your particular situation, to processing based on Art. 6(1)(f) GDPR (Art. 21),',
            'lodge a complaint with a supervisory authority (Art. 77), for example the Bavarian Data Protection Authority (Bayerisches Landesamt für Datenschutzaufsicht, Promenade 18, 91522 Ansbach, Germany).',
          ],
        },
        {
          type: 'paragraph',
          text: 'Most data never reach the developer: they are on your device, where you can delete them yourself, or at Google under your own key, where Google’s terms apply. For everything else, write to:',
        },
        { type: 'link', prefix: 'E-mail:', link: emailLink },
      ],
    },
    {
      id: 'changes',
      title: 'Changes to this notice',
      blocks: [
        {
          type: 'paragraph',
          text: 'When Eulino or this website changes how data are used, this notice is updated. The date at the top shows the current version. In the Android app, you find this notice under Settings → Privacy → Privacy notice.',
        },
      ],
    },
  ],
}

const german: PrivacyNotice = {
  lang: 'de',
  languageName: 'Deutsch',
  title: 'Datenschutzhinweis',
  updated: 'Stand: 4. November 2026',
  intro:
    'Eulino ist eine Lern-App für Kinder: Kinder sprechen darin mit Elly, einer Eule und KI-Lernbegleiterin. Dieser Hinweis erklärt, welche Daten die Eulino-App (für Android sowie für iPhone, iPad und Mac) und diese Website nutzen, wohin die Daten gehen und wie du sie löschen kannst. Er richtet sich an Eltern: „du“ ist das Elternteil, das Eulino einrichtet.',
  sections: [
    {
      id: 'in-short',
      title: 'Kurz gesagt',
      blocks: [
        {
          type: 'list',
          items: [
            'Während einer Session wird die Stimme deines Kindes live an die Gemini Live API von Google übertragen. Google erzeugt daraus Ellys Antworten und die Transkripte. Eulino selbst verarbeitet und speichert keine Audiodaten: Die App schickt die Daten nur an Google und hat keinen Einfluss darauf, was Google damit macht.',
            'Eulino nutzt deinen eigenen Gemini API-Key, deshalb gelten Googles Bedingungen für deinen Schlüssel. Im kostenlosen Kontingent darf Google die Daten nutzen, um seine Produkte zu verbessern; im Europäischen Wirtschaftsraum, in der Schweiz und im Vereinigten Königreich gelten die strengeren Regeln des bezahlten Kontingents.',
            'Der Verlauf, dein API-Key und die Einstellungen bleiben auf deinem Gerät. Die Inhalte der Sessions erreichen den Entwickler von Eulino nie.',
            'Die App sendet Absturzberichte an Firebase Crashlytics (Google), damit Fehler behoben werden können. Sie enthalten keine Inhalte der Sessions.',
            'Keine Werbung, keine Nutzungsanalyse, kein Konto. Diese Website verwendet keine Cookies.',
          ],
        },
      ],
    },
    {
      id: 'controller',
      title: 'Verantwortlich',
      blocks: [
        {
          type: 'paragraph',
          text: 'Verantwortlich für Eulino und diese Website (Verantwortlicher im Sinne der DSGVO):',
        },
        {
          type: 'address',
          lines: [CONTROLLER.name, CONTROLLER.street, CONTROLLER.city, 'Deutschland'],
        },
        { type: 'link', prefix: 'Telefon:', link: phoneLink },
        { type: 'link', prefix: 'E-Mail:', link: emailLink },
        {
          type: 'paragraph',
          text: 'Für die Daten, die Google mit deinem eigenen API-Key verarbeitet, gelten zusätzlich die Bedingungen und die Datenschutzerklärung von Google (siehe „Was Google mit deinen Daten macht“).',
        },
      ],
    },
    {
      id: 'gemini',
      title: 'Gespräche mit Elly: die Gemini Live API von Google',
      blocks: [
        {
          type: 'paragraph',
          text: 'Das ist der Kern von Eulino. Ellys Stimme, ihre Antworten und der Text des Gesprächs kommen von der Gemini Live API von Google, nicht von Eulino.',
        },
        {
          type: 'list',
          items: [
            'Die App nutzt das Mikrofon nur, solange eine Session läuft. Wenn die Session pausiert oder beendet ist, ist das Mikrofon aus. Die Mikrofon-Berechtigung kannst du jederzeit in den Einstellungen deines Geräts zurücknehmen.',
            'Während einer Session überträgt die App die Stimme deines Kindes live an die Gemini Live API von Google. Google erzeugt daraus Ellys gesprochene Antworten und eine Textfassung (Transkript) von dem, was dein Kind und Elly sagen.',
            'Eulino selbst verarbeitet und speichert keine Audiodaten: Die App schickt sie nur an Google und spielt Ellys Antworten ab.',
            'Mit dem Gespräch schickt die App die Anweisungen für die Session und die Titel der letzten fünf Sessions aus dem Verlauf, damit Elly neue Themen vorschlagen kann.',
            'Damit eine unterbrochene Session weitergehen kann, bewahrt Google den Stand des Gesprächs für eine begrenzte Zeit auf (Session-Fortsetzung).',
            'Eulino hat keinen Einfluss darauf, was Google mit diesen Daten macht. Es gelten Googles Bedingungen für deinen eigenen API-Key (nächster Abschnitt).',
          ],
        },
      ],
    },
    {
      id: 'google',
      title: 'Was Google mit deinen Daten macht',
      blocks: [
        {
          type: 'paragraph',
          text: 'Eulino schickt Daten nur an die Gemini API von Google. Weil die App deinen eigenen Schlüssel nutzt, laufen die Anfragen in deinem eigenen Google-Cloud-Projekt, und Google verarbeitet sie nach den Gemini-API-Bedingungen und der Datenschutzerklärung von Google. Laut den Gemini-API-Bedingungen gilt:',
        },
        {
          type: 'list',
          items: [
            'Kostenloses Kontingent (keine Abrechnung eingerichtet): Google nutzt die gesendeten Inhalte und die Antworten, um seine Produkte und Technologien bereitzustellen, zu verbessern und weiterzuentwickeln, und Menschen dürfen sie zur Prüfung lesen und kommentieren. Vorher trennt Google die Daten von deinem Google-Konto, API-Key und Projekt. Google bittet, im kostenlosen Kontingent keine sensiblen, vertraulichen oder persönlichen Angaben zu senden.',
            'Bezahltes Kontingent (Abrechnung eingerichtet): Google nutzt die Inhalte nicht, um seine Produkte zu verbessern. Anfragen und Antworten werden für eine begrenzte Zeit protokolliert, um Missbrauch zu erkennen und zu verhindern.',
            'Im Europäischen Wirtschaftsraum, in der Schweiz und im Vereinigten Königreich gelten die Regeln des bezahlten Kontingents zur Nutzung deiner Daten auch im kostenlosen Kontingent.',
            'Wie bei jeder Internetverbindung sieht Google die IP-Adresse deines Geräts. Google kann die Daten auch außerhalb der EU verarbeiten, zum Beispiel in den USA.',
          ],
        },
        { type: 'paragraph', text: 'Verbindlich ist Googles eigener, aktueller Text:' },
        {
          type: 'link',
          prefix: 'Gemini-API-Bedingungen:',
          link: { label: PRIVACY_LINKS.geminiTerms, href: PRIVACY_LINKS.geminiTerms },
        },
        {
          type: 'link',
          prefix: 'Datenschutzerklärung von Google:',
          link: { label: PRIVACY_LINKS.googlePrivacy, href: PRIVACY_LINKS.googlePrivacy },
        },
      ],
    },
    {
      id: 'history',
      title: 'Verlauf und Zusammenfassungen',
      blocks: [
        {
          type: 'list',
          items: [
            'Sobald eine Session über ihren ersten Schritt hinaus ist, speichert die App auf deinem Gerät: Startzeit, Dauer, Thema, Sprache und nach der Session einen Titel und bis zu 10 wichtige Punkte.',
            'Für Titel und Punkte bewahrt die App den Text des Gesprächs (Transkript) kurz auf deinem Gerät auf und schickt ihn einmal an die Gemini API (Google). Danach wird der Text gelöscht – meist wenige Sekunden nach der Session, spätestens nach 7 Tagen oder 5 fehlgeschlagenen Versuchen.',
            'Auf iPhone, iPad und Mac ist das Transkript nie Teil eines Backups. Unter Android kann es Teil eines Backups sein, das zufällig in dieser kurzen Zeit läuft.',
            'Der Verlauf wird nur in der App angezeigt. Er enthält keine Audiodaten.',
          ],
        },
      ],
    },
    {
      id: 'pictures',
      title: 'Bilder',
      blocks: [
        {
          type: 'list',
          items: [
            'Wenn Elly ein Bild zeigt, schickt die App eine kurze Beschreibung, die Elly schreibt – nur, was das Bild zeigen soll, keine persönlichen Angaben –, an ein Bildmodell der Gemini API (Google). Google erzeugt das Bild.',
            'Bilder liegen nur im Arbeitsspeicher, solange sie zu sehen sind. Sie werden nicht gespeichert und sind weder Teil des Verlaufs noch eines Backups.',
          ],
        },
      ],
    },
    {
      id: 'api-key',
      title: 'Dein Gemini API-Key',
      blocks: [
        {
          type: 'list',
          items: [
            'Den Schlüssel erstellst du selbst in Google AI Studio. Er gehört zu deinem Google-Konto und deinem Google-Cloud-Projekt. Eulino hat keinen eingebauten Schlüssel.',
            'Die App speichert den Schlüssel verschlüsselt und nur auf deinem Gerät: unter Android mit dem Android Keystore, auf iPhone, iPad und Mac im Schlüsselbund (nur auf diesem Gerät, nicht mit dem iCloud-Schlüsselbund synchronisiert). Der Schlüssel ist nie Teil eines Backups.',
            'Der Schlüssel geht nur an Google, mit jeder Anfrage an die Gemini API. Um einen neuen Schlüssel zu prüfen, schickt die App eine Anfrage ohne Inhalte.',
            'Auf iPhone, iPad und Mac kann der Schlüssel nach dem Löschen der App im Schlüsselbund des Geräts bleiben. Er bleibt nur auf diesem Gerät und wird ersetzt, wenn du Eulino wieder einrichtest. Damit er sicher nicht mehr genutzt werden kann, lösche den Schlüssel in Google AI Studio.',
          ],
        },
      ],
    },
    {
      id: 'crash-reports',
      title: 'Absturzberichte',
      blocks: [
        {
          type: 'paragraph',
          text: 'Wenn die App abstürzt oder nicht mehr reagiert, sendet sie einen Absturzbericht an Firebase Crashlytics (Google), unter Android ebenso wie auf iPhone, iPad und Mac. Das tun nur die veröffentlichten Versionen der App, keine Entwicklungsversionen. Der Bericht enthält die technische Fehlerbeschreibung, Gerätedaten (Modell, Version des Betriebssystems, freier Arbeitsspeicher und Speicherplatz, App-Version), eine zufällige Installations-ID und die Zeitpunkte, zu denen die App gestartet wurde. Er enthält keine Inhalte der Sessions, keinen Verlauf und keinen API-Key. Firebase bewahrt Absturzberichte 90 Tage auf.',
        },
        {
          type: 'paragraph',
          text: 'Außerdem können Google Play und Apple dem Entwickler Absturzstatistiken bereitstellen, wenn du das in den Einstellungen deines Geräts erlaubt hast.',
        },
        {
          type: 'link',
          prefix: 'Datenschutz bei Firebase:',
          link: { label: PRIVACY_LINKS.firebasePrivacy, href: PRIVACY_LINKS.firebasePrivacy },
        },
      ],
    },
    {
      id: 'device-and-backups',
      title: 'Was auf deinem Gerät bleibt, und Backups',
      blocks: [
        {
          type: 'list',
          items: [
            'Auf deinem Gerät: der Verlauf, der API-Key (verschlüsselt), ob die Einführung abgeschlossen ist, und die Einstellungen für die Sessions.',
            'Android: Nur der Verlauf kann Teil deines Android-Backups oder einer Übertragung auf ein neues Gerät sein. Ein Cloud-Backup gibt es nur, wenn Android es Ende-zu-Ende verschlüsseln kann (Displaysperre eingerichtet). Der API-Key und die Einstellungen werden nie gesichert.',
            'iPhone, iPad und Mac: Der Verlauf und die Einstellungen können Teil deines iCloud-Backups, eines Backups auf deinem Computer oder mit Time Machine und einer Übertragung auf ein neues Gerät sein. Der API-Key und Transkripte, die noch auf ihre Zusammenfassung warten, werden nie gesichert.',
            'Eulino hat keine eigene Cloud-Synchronisierung. Wenn du einen Lernplan exportierst oder teilst, geht die Datei nur dorthin, wo du es auswählst; sie enthält nur die Schritte des Lernplans.',
          ],
        },
      ],
    },
    {
      id: 'deleting',
      title: 'Deine Daten löschen',
      blocks: [
        {
          type: 'list',
          items: [
            'In der App gibt es noch keine Möglichkeit, den Verlauf zu löschen.',
            'Android: Einstellungen → Apps → Eulino → Speicher → Speicher löschen (die Namen können auf deinem Gerät anders sein), oder die App deinstallieren. Damit werden der Verlauf, der API-Key und die Einstellungen gelöscht.',
            'iPhone und iPad: die App löschen. Damit werden der Verlauf und die Einstellungen gelöscht; der API-Key kann im Schlüsselbund bleiben (siehe „Dein Gemini API-Key“).',
            'Mac: Wenn du die App in den Papierkorb legst, werden ihre Daten nicht gelöscht. Sie bleiben in deiner Benutzer-Library unter Library → Containers → Eulino; lösche auch diesen Ordner.',
            'Backups: in den Backup-Einstellungen deines Google-Kontos (Android), von iCloud oder deines Computers (Apple). Ältere Backups können den Verlauf noch enthalten.',
            'Daten bei Google zu deinem Schlüssel: in Google AI Studio oder deinem Google-Cloud-Projekt. Dort kannst du den Schlüssel auch jederzeit löschen. Es gelten Googles Bedingungen.',
            'Absturzberichte werden nach 90 Tagen automatisch gelöscht.',
          ],
        },
        { type: 'link', prefix: 'Fragen:', link: emailLink },
      ],
    },
    {
      id: 'children',
      title: 'Kinder',
      blocks: [
        {
          type: 'paragraph',
          text: 'Eulino ist eine Lern-App für Kinder. Ein Elternteil richtet Eulino mit dem eigenen Google-Konto und dem eigenen Gemini API-Key ein und nutzt es gemeinsam mit dem Kind. Die Eltern entscheiden, ob und wie das Kind Eulino nutzt.',
        },
        {
          type: 'paragraph',
          text: 'Eulino fragt keinen Namen, kein Alter und keine anderen Angaben zum Kind ab und hat kein Kinderprofil. Was das Kind während einer Session sagt, geht wie oben beschrieben an Google. Achte bitte darauf, dass dein Kind im Gespräch keine persönlichen Angaben macht.',
        },
      ],
    },
    {
      id: 'website',
      title: 'Diese Website',
      blocks: [
        {
          type: 'list',
          items: [
            'Diese Website (www.eulino.app) wird bei GitHub Pages gehostet, einem Dienst der GitHub, Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, USA. Wenn du eine Seite aufrufst, verarbeitet GitHub technische Zugriffsdaten in Server-Logdateien, insbesondere deine IP-Adresse, Datum und Uhrzeit des Zugriffs und Angaben zu deinem Browser, um die Seite auszuliefern und sicher zu betreiben.',
            'Die Website verwendet keine Cookies, keine Analyse, kein Tracking und keine Web-Fonts, lädt nichts von anderen Servern und hat keine Formulare.',
            'GitHub kann die Daten in den USA verarbeiten. GitHub nimmt am EU-U.S. Data Privacy Framework teil.',
          ],
        },
        {
          type: 'link',
          prefix: 'Datenschutzerklärung von GitHub:',
          link: { label: PRIVACY_LINKS.githubPrivacyDe, href: PRIVACY_LINKS.githubPrivacyDe },
        },
      ],
    },
    {
      id: 'legal-bases',
      title: 'Rechtsgrundlagen',
      blocks: [
        {
          type: 'paragraph',
          text: 'Der Entwickler verarbeitet personenbezogene Daten auf diesen Rechtsgrundlagen der DSGVO (Datenschutz-Grundverordnung):',
        },
        {
          type: 'list',
          items: [
            'App-Funktionen, die du selbst startest – das Gespräch mit Elly, die Anweisungen und Titel für die Session, die Session-Fortsetzung, die Zusammenfassung, Bilder, die Prüfung des Schlüssels sowie der Verlauf und der Schlüssel auf deinem Gerät: Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung der App-Funktionen, die du nutzt).',
            'Absturzberichte: Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse ist eine stabile App ohne Fehler; die Berichte enthalten keine Inhalte der Sessions.',
            'Server-Logdateien dieser Website: Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse ist eine zuverlässige und sichere Auslieferung der Website.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Wie Google die Daten verarbeitet, die es mit deinem API-Key erhält, regeln Googles Bedingungen. Backups erstellen Android oder Apple nach den Einstellungen deines Geräts.',
        },
      ],
    },
    {
      id: 'rights',
      title: 'Deine Rechte',
      blocks: [
        { type: 'paragraph', text: 'Nach der DSGVO hast du das Recht auf:' },
        {
          type: 'list',
          items: [
            'Auskunft über die zu dir gespeicherten personenbezogenen Daten (Art. 15),',
            'Berichtigung (Art. 16) und Löschung (Art. 17) dieser Daten,',
            'Einschränkung der Verarbeitung (Art. 18),',
            'Datenübertragbarkeit (Art. 20),',
            'Widerspruch jederzeit, aus Gründen, die sich aus deiner besonderen Situation ergeben, gegen eine Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21),',
            'Beschwerde bei einer Aufsichtsbehörde (Art. 77), zum Beispiel beim Bayerischen Landesamt für Datenschutzaufsicht, Promenade 18, 91522 Ansbach.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Die meisten Daten erreichen den Entwickler nie: Sie liegen auf deinem Gerät, wo du sie selbst löschen kannst, oder bei Google zu deinem eigenen Schlüssel, wo Googles Bedingungen gelten. Für alles andere schreib an:',
        },
        { type: 'link', prefix: 'E-Mail:', link: emailLink },
      ],
    },
    {
      id: 'changes',
      title: 'Änderungen dieses Hinweises',
      blocks: [
        {
          type: 'paragraph',
          text: 'Wenn sich ändert, wie Eulino oder diese Website Daten nutzen, wird dieser Hinweis angepasst. Das Datum oben zeigt den aktuellen Stand. In der Android-App findest du diesen Hinweis unter Einstellungen → Datenschutz → Datenschutzhinweis.',
        },
      ],
    },
  ],
}

export const privacyNotices: readonly PrivacyNotice[] = [english, german]
```

Notes on the copy:

- "Settings → Privacy → Privacy notice" / "Einstellungen → Datenschutz → Datenschutzhinweis" match
  the Android strings `settings_title`, `settings_section_privacy`, `settings_privacy_notice_title`
  (EDU-28 D6). The Apple app does not link the notice yet, so only Android is named there; when the
  Apple app gets the link, that sentence is updated (D8).
- The Android path "Settings → Apps → Eulino → Storage → Clear storage" is the EDU-28 wording; the
  German one matches it ("Speicher löschen").
- Crash reports are described for all platforms (D11); the Apple part is planned and must be
  verified by the Apple Crashlytics story EDU-46 (D8).
- The Mac container path "Library → Containers → Eulino" is how Finder shows the sandbox container
  of the app (display name). See Testing Notes (manual check when a Mac build is available).

## Testing Notes

Unit and component tests (`app/src/__tests__/`, Vitest + Vue Test Utils, jsdom):

- **`privacy.spec.ts`** (data):
  - two notices with `lang` `en` and `de`, in this order;
  - both have the same section ids in the same order, and the ids are unique; the required ids
    `in-short` (first), `controller`, `gemini`, `google`, `history`, `pictures`, `api-key`,
    `crash-reports`, `device-and-backups`, `deleting`, `children`, `website`, `legal-bases`,
    `rights`, `changes` (last) are present;
  - collect every string of a notice (titles, intro, updated, block texts, items, lines, prefixes,
    link labels and hrefs): none contains `edubuddy` (case-insensitive), `⟦`, `⟧`, `TODO`, or a
    model name (`/gemini-\d|flash|\bpro\b/i`);
  - each notice contains "Gemini Live API" and the links `https://ai.google.dev/gemini-api/terms`,
    `https://policies.google.com/privacy`, `https://firebase.google.com/support/privacy`;
  - the `controller` section has an `address` block with "Michael Schreiber", "Grockelhofen 32",
    "89340 Leipheim" and a link `mailto:info@michaelschreiber.net`;
  - `PRIVACY_LAST_UPDATED === '2026-11-04'`, and both `updated` strings contain "4" and "2026" and
    the month ("November");
  - every `href` starts with `https://`, `mailto:` or `tel:`;
  - crash reports for all platforms (D11): in both notices the `in-short` and `crash-reports`
    sections contain "Firebase Crashlytics"; the `crash-reports` section names "Android" and
    "iPhone, iPad and Mac" / "iPhone, iPad und Mac" and "90"; no string of a notice contains
    "Only the Android app", "Nur die Android-App", "Share with App Developers",
    "Mit App-Entwicklern teilen" or "TestFlight".
- **`PrivacyNotice.spec.ts`**: mount with each notice — `article` has `id` and `lang`; `h2` text is
  the title; `time[datetime="2026-11-04"]`; one `h3` per section in order with id
  `${lang}-${sectionId}`; list items and address lines rendered; external links have
  `target="_blank"` and `rel` containing `noopener`; the `mailto:` and `tel:` links have no
  `target`.
- **`PrivacyApp.spec.ts`**: exactly one `h1` (`Privacy notice · Datenschutzhinweis`); language
  links `#en` / `#de`; two articles; header, main and footer exist; heading ids on the page are
  unique; every `img` has an `alt`.
- **`SiteFooter.spec.ts`** (extend): a link "Privacy" with `href="/privacy/"`, no `target`; order
  Privacy, Imprint, Developer.
- **`SiteHeader.spec.ts`** (new): the logo is inside a link with `href="/"`.
- **Entry file check** (in `privacy.spec.ts` or a new `entries.spec.ts`, reading files with
  `node:fs` like `content.spec.ts`): `privacy/index.html` exists, has a `<title>` containing
  "Privacy notice", a non-empty `meta name="description"`, and the script
  `/src/privacy-main.ts`; neither HTML file contains "EduBuddy".

Build check (tester/reviewer): after `npm run build`, `dist/privacy/index.html` exists and
references the built assets.

Manual browser checks:

- `npm run dev` → `http://localhost:5173/privacy/` and `npm run preview` → `/privacy/`: page renders;
  the home page `/` is unchanged; footer "Privacy" opens the page; logo goes home.
- Widths 320, 375, 768 px and desktop: no horizontal scrolling (long URLs, e-mail), readable line
  length, the "In short" card, language links jump to the German / English article.
- After deployment: `curl -sI https://www.eulino.app/privacy` → `301` with `location:
  …/privacy/`; `/privacy/` → `200`; the Android app's link opens the page.
- When a Mac build exists: confirm that Finder shows the container as "Eulino" under
  `~/Library/Containers` (copy section `deleting`); otherwise adjust the sentence (D8).

## Open Questions

None blocking. Decided by the architect within the story: multi-page build (D1), one bilingual
page with anchor links (D2), copy module and "du" form (D3), platform names on this page (D4),
Apple backup includes settings (D5), legal-basis mapping (D6), `/privacy/` for the internal link
(D7), phone number shown (AC 10 "optional" — it is the same as in the imprint).

Information for the user (not part of this story): the legal check listed in D6 should happen
before a public release; it may change the `legal-bases`, `rights` and `children` sections.
