---
type: Test Concept
title: Tests for EDU-45 — Privacy notice page at https://www.eulino.app/privacy
description: Unit and component tests for the bilingual privacy copy module, the PrivacyNotice and PrivacyApp components, the footer and header links and the second Vite entry, plus manual browser checks for mobile layout and the post-deploy /privacy redirect.
tags: [EDU-45, tests]
timestamp: 2026-11-04T14:45:00+01:00
---

## Scope

Tested (Vitest + Vue Test Utils, jsdom, `app/src/__tests__/`):

- **Data module `src/data/privacy.ts`** — structural and content rules from the acceptance
  criteria that a later edit could silently break: English and German notice in this order, the
  same unique section ids in the same order, all required sections (`in-short` first, `changes`
  last), no "EduBuddy", no `⟦…⟧` placeholders or `TODO`, no model names, "Gemini Live API" named,
  the Gemini API terms / Google privacy / Firebase privacy links, only `https:` / `mailto:` /
  `tel:` links, the controller address and e-mail link, and both "last updated" strings matching
  day, month (in the notice's language) and year of `PRIVACY_LAST_UPDATED`. Crash reports for all
  platforms (D11, user review round 1): Firebase Crashlytics in `in-short` and `crash-reports`,
  `crash-reports` names Android, iPhone, iPad and Mac and the 90 days, and the old Android-only /
  Apple opt-in / TestFlight wording is gone.
- **`PrivacyNotice.vue`** (with each real notice) — article `id`/`lang`/`aria-labelledby`, `h2`
  title, `<time datetime>`, one `h3` per section in order with id `${lang}-${sectionId}`, list items
  and address lines, paragraph count, link rules (external: `target="_blank"`,
  `rel` with `noopener`; `mailto:`/`tel:`: no `target`, no `rel`), a space between a link
  block's prefix and its link.
- **`PrivacyApp.vue`** — exactly one `h1` with the page title, header/main/footer, language links
  (`#en`/`#de` with matching `hreflang` and `lang`), English article before German, unique element
  ids on the whole page (anchors work), alt attribute on every image.
- **`SiteFooter.vue`** (extended) — order Privacy · Imprint · Developer; Privacy links to
  `/privacy/` in the same tab.
- **`SiteHeader.vue`** (new) — the logo is a link to `/` named "Eulino".
- **Entries (`entries.spec.ts`, node environment)** — `privacy/index.html` has a title with
  "Privacy notice", a non-empty meta description and the `/src/privacy-main.ts` script; neither
  HTML file contains "EduBuddy"; `vite.config.ts` lists both `index.html` and
  `privacy/index.html` as build input.
- **Build check** — `npm run build` writes `dist/privacy/index.html`, which references the built
  `privacy-*.js` and the shared `SiteFooter-*` chunks (checked by the tester on 2026-11-04).

Explicitly not tested automatically: the wording of the copy (approved in the architecture
concept; comparing it 1:1 would be a mirror test), styles and layout (jsdom has no layout), the
GitHub Pages redirect (only exists after deployment).

## Test Cases

| Class / Module | Test Case | Level | Status |
|--------|----------|-------|--------|
| privacy (data) | provides an English and a German notice, English first | Unit | ✅ |
| privacy (data) | uses the same section ids in the same order in both languages | Unit | ✅ |
| privacy (data) | uses unique section ids | Unit | ✅ |
| privacy (data) | contains every required section, `in-short` first, `changes` last | Unit | ✅ |
| privacy (data), en + de | never names the internal codename EduBuddy | Unit | ✅ |
| privacy (data), en + de | contains no placeholders or TODOs | Unit | ✅ |
| privacy (data), en + de | names no model | Unit | ✅ |
| privacy (data), en + de | names the Gemini Live API | Unit | ✅ |
| privacy (data), en + de | links the Gemini API terms, Google privacy policy, Firebase privacy page | Unit | ✅ |
| privacy (data), en + de | only uses https, mailto and tel links | Unit | ✅ |
| privacy (data), en + de | states the controller with address and e-mail link | Unit | ✅ |
| privacy (data), en + de | shows the same date as `PRIVACY_LAST_UPDATED` | Unit | ✅ |
| privacy (data), en + de | names Firebase Crashlytics in `in-short` and `crash-reports` (D11) | Unit | ✅ |
| privacy (data), en + de | `crash-reports` names "Android", "iPhone, iPad and Mac" / "iPhone, iPad und Mac" and the 90-day retention (D11) | Unit | ✅ |
| privacy (data), en + de | no longer says "Only the Android app", "Nur die Android-App", "Share with App Developers", "Mit App-Entwicklern teilen" or "TestFlight" (D11) | Unit | ✅ |
| PrivacyNotice, en + de | renders an article with the language as id and lang | Component | ✅ |
| PrivacyNotice, en + de | renders the title as h2 and the date as a time element | Component | ✅ |
| PrivacyNotice, en + de | renders one h3 per section in order with id `lang-sectionId` | Component | ✅ |
| PrivacyNotice, en + de | renders every list item and address line | Component | ✅ |
| PrivacyNotice, en + de | renders paragraphs and link blocks as paragraphs | Component | ✅ |
| PrivacyNotice, en + de | opens external links in a new tab without opener | Component | ✅ |
| PrivacyNotice, en + de | keeps mailto and tel links in the same tab | Component | ✅ |
| PrivacyNotice, en + de | separates the prefix of a link block from the link with a space | Component | ✅ (found a bug, fixed, see below) |
| PrivacyApp | renders exactly one h1 with the bilingual page title | Component | ✅ |
| PrivacyApp | renders header, main content and footer | Component | ✅ |
| PrivacyApp | links each language to its article with hreflang and lang | Component | ✅ |
| PrivacyApp | renders the English article before the German one | Component | ✅ |
| PrivacyApp | uses unique element ids on the page | Component | ✅ |
| PrivacyApp | gives every image an alt attribute | Component | ✅ |
| SiteFooter | shows Privacy, Imprint and Developer in this order | Component | ✅ |
| SiteFooter | links to the privacy page in the same tab | Component | ✅ |
| SiteHeader | links the logo to the home page | Component | ✅ |
| entries | gives the privacy page its own title | Unit (fs) | ✅ |
| entries | gives the privacy page a non-empty meta description | Unit (fs) | ✅ |
| entries | loads the privacy entry script | Unit (fs) | ✅ |
| entries | `index.html` / `privacy/index.html` never names EduBuddy | Unit (fs) | ✅ |
| entries | builds both the home page and the privacy page | Unit (config) | ✅ |
| dist | `dist/privacy/index.html` exists and references built assets | Build check | ✅ |
| Page | renders in `npm run dev` / `npm run preview` at `/privacy/`; `/` unchanged; footer "Privacy" opens the page; logo goes home | Manual browser | open |
| Page | at 320, 375, 768 px and desktop: no horizontal scrolling (long URLs, e-mail), readable line length, "In short" card, language links jump to the articles | Manual browser | open |
| Deployment | `curl -sI https://www.eulino.app/privacy` → `301`, `location: …/privacy/`; `curl -sI https://www.eulino.app/privacy/` → `200`; the Android app's link opens the page | Manual, after deploy | open |
| Copy (`deleting`) | when a Mac build exists: Finder shows the container as "Eulino" under `~/Library/Containers` | Manual | open |

### Bug found (fixed)

The first test run found that `PrivacyNotice.vue` rendered link blocks without the space
between prefix and link, e.g. "Phone:+49 (0) 162 4337334", "E-mail:info@michaelschreiber.net",
"Gemini API terms:https://…" (also in the production bundle). Cause: in
`<template v-if="block.prefix">{{ block.prefix }} </template>` Vue's default whitespace
`condense` removed the trailing whitespace inside the `<template>`.

Fixed by the developer in AI review round 1: the space is now part of the interpolated string,
`<template v-if="block.prefix">{{ `${block.prefix} ` }}</template>`, so the compiler cannot
strip it. The test "separates the prefix of a link block from the link with a space" passes
for both languages and guards against a regression.

### User review round 1 rework

The user decided that crash reports are described for all platforms (concept D11; the Apple part
is planned). `src/data/privacy.ts` was updated by the developer; the tester added 16 data unit
tests (8 per language) that guard the new statements and make sure the removed Android-only and
Apple opt-in / TestFlight wording does not come back. No bug found.

## Untested Areas

- **Wording of the copy** — approved verbatim in the concept (the module was diffed against the
  concept by the tester: identical). A text comparison in a test would only mirror the source.
- **Layout, mobile readability, scroll offsets** — need a real browser (manual checks above).
- **`privacy-main.ts`** — two lines (CSS import, mount); covered by the build and the manual
  `npm run dev` / `preview` check; a test would mock `createApp` and prove nothing.
- **301 `/privacy` → `/privacy/`** — GitHub Pages behaviour, only verifiable after deployment
  (curl check above).
- **`content.ts` `PRIVACY_URL`** — covered through the footer test (`href="/privacy/"`).

## Cost

- New tests: 67 (36 data unit, of which 16 from the user review round 1 rework; 16
  `PrivacyNotice` component, 6 `PrivacyApp` component, 2 `SiteFooter` component, 1 `SiteHeader`
  component, 6 entry/config unit). Suite: 10 → 77 tests, 4 → 9 files; duration about
  0.73 s → 0.9 s (the rework added no measurable time).
- No expensive automated tests. Component tests are used only where rendering is the behaviour
  (ids, anchors, link attributes, text spacing); rules about the copy are plain unit tests on the
  data. `entries.spec.ts` runs in the node environment because importing `vite.config.ts` loads
  esbuild, which does not work under jsdom.
- Manual browser checks are limited to layout at 320–768 px and desktop (jsdom has no layout) and
  the post-deploy redirect check, which cannot run before GitHub Pages serves the page.
