---
type: AI Review
title: Review for EDU-45 — Privacy notice page at https://www.eulino.app/privacy
description: Round 4 — the round-3 finding is resolved (EDU-46 is referenced everywhere), no code changed and all checks pass; positive.
tags: [EDU-45, review]
timestamp: 2026-11-04T16:30:00+01:00
verdict: positive
---

## Round 1 — 2026-11-04T15:00:00+01:00

### Scope

- Architecture concept `EDU-45-privacy-notice-page.md` (draft, 2026-11-04T12:00) and testing
  concept `EDU-45-tests.md` (2026-11-04T14:45). No design copy exists.
- Uncommitted changes on `feature/EDU-45-privacy-notice-page-at-https-www-eulino-app-privacy`
  against `main` (745fd10): `vite.config.ts`, `privacy/index.html`, `src/privacy-main.ts`,
  `src/PrivacyApp.vue`, `src/components/PrivacyNotice.vue`, `src/types/privacy.ts`,
  `src/data/privacy.ts`, `src/data/content.ts`, `SiteFooter.vue`, `SiteHeader.vue`, and the docs
  `ai-project.md`, `stack.md`, `index.md`, `log.md`.
- Tests: `privacy.spec.ts`, `PrivacyNotice.spec.ts`, `PrivacyApp.spec.ts`, `SiteHeader.spec.ts`,
  `entries.spec.ts`, extended `SiteFooter.spec.ts`.
- Copy: the evaluated exports of `src/data/privacy.ts` were compared with the concept's
  "final copy" block (JSON of all exports) — identical.
- Facts spot-checked against `EduBuddy-Android` (EDU-28 D9, `strings.xml` for
  Settings → Privacy → Privacy notice / Einstellungen → Datenschutz → Datenschutzhinweis,
  `data_extraction_rules.xml` and `backup_rules.xml` incl. `clientSideEncryption` on Android 9–11,
  `minSdk 26`) and `EduBuddy-Apple/docs/architecture/stack.md` (no Firebase / Google SDK,
  Keychain `WhenUnlockedThisDeviceOnly` not synchronizable, `History/Pending/` excluded from
  backup, `history.json` and `UserDefaults` backed up). No contradiction found.
- Checks (in `app/`): `npm run test:unit -- --run` — 9 files, 61 tests passed;
  `npm run lint:check` — clean; `npm run build` — passes, writes `dist/index.html` and
  `dist/privacy/index.html` referencing `privacy-*.js` and the shared `SiteFooter-*` chunk/CSS.

Acceptance criteria: AC 1 (second entry, 301 only verifiable after deploy — manual check
recorded), AC 2–7 and 10 (copy sections `gemini`, `google`, `history`, `pictures`, `api-key`,
`crash-reports`, `device-and-backups`, `deleting`, `children`, `website`, `legal-bases`,
`rights`, `changes`, `in-short`, date, controller incl. phone, BayLDA), AC 8 (EN + DE articles
with the same section ids, guarded by a test), AC 9 (footer used on both pages), AC 11 (title,
description, viewport; mobile layout is an open manual check) are met by the implementation.

The architect's edit of `docs/ai-project.md` → Platforms (exception for the privacy notice) is
appropriate: AC 5 requires naming platform differences, the exception is narrowly scoped to
`/privacy`, the home page stays platform-neutral, and the rule is repeated in `stack.md` and
`log.md`.

The prefix/link spacing bug recorded by the tester is fixed in `PrivacyNotice.vue`
(`{{ `${block.prefix} ` }}`), and its test passes.

### Findings

1. **`docs/architecture/EDU-45-tests.md` is stale (tester).** The test case "separates the
   prefix of a link block from the link with a space" is still marked ❌ and the "Bug found"
   section describes the bug as open, although `PrivacyNotice.vue` is fixed and the test passes
   (61/61). The testing concept must reflect the current state: mark the case ✅ and note the bug
   as fixed (or drop the section).
2. **`docs/ai-project.md` → "Important Files" is stale (architect).** It still says
   `app/src/data/content.ts` holds "all copy of the page" and `app/index.html` holds "title,
   description and Open Graph tags". Since EDU-45 the privacy copy lives in
   `app/src/data/privacy.ts` and the privacy page's head is in `app/privacy/index.html`
   (`stack.md` was updated accordingly, the profile was not). Future agents read the profile
   first and would miss the second copy module and entry; add both files.

Observation (no finding, for the user): the notice is rendered by JavaScript; without JS only
the `<noscript>` contact line is shown. This is the same pattern as the home page and Google's
crawlers render JS, but if a store reviewer or link checker needs the text in the raw HTML, a
pre-rendered page would be a follow-up. The legal check from D6 remains open (out of scope).

### Verdict

findings

## Round 2 — 2026-11-04T15:30:00+01:00

### Scope

- Re-check of the two round-1 findings:
  - `docs/architecture/EDU-45-tests.md`: the prefix-space test case is now ✅ ("found a bug,
    fixed"), and the section "Bug found (fixed)" describes the cause and the fix in
    `PrivacyNotice.vue`. This matches the code and the passing test.
  - `docs/ai-project.md` → "Important Files": `content.ts` is now the copy of the home page and
    the shared header/footer (correct: `SiteFooter.vue` imports `DEVELOPER_NAME`,
    `DEVELOPER_URL`, `IMPRINT_URL` and `PRIVACY_URL` from it). It also lists
    `app/src/data/privacy.ts` and `app/privacy/index.html`, and `app/index.html` is limited to
    the home page.
- No code changes since round 1: the build output has the same asset hashes.
- Checks (in `app/`): `npm run test:unit -- --run` (9 files, 61 tests passed),
  `npm run lint:check` (clean) and `npm run build` (passes, `dist/privacy/index.html` written).

### Findings

None.

The round-1 observation still stands for the user and does not block: the notice is rendered by
JavaScript. The legal check from D6 is out of scope.

### Verdict

positive

## Round 3 — 2026-11-04T16:00:00+01:00

### Scope

This round reviews the rework after user review round 1: the user plans to add Firebase
Crashlytics to the Apple app, so the notice now describes crash reports for all platforms.

- Concept: new D11, and updates to the AC 4 note, D4 (store names), the D5 rows for crash reports
  and OS diagnostics, D6 (legal basis for crash reports on all platforms), the D8 Apple paragraph,
  the copy and the Testing Notes. Also the new rows in `log.md` and `stack.md` → Privacy Notice.
- Code: `app/src/data/privacy.ts`. Its evaluated exports are identical to the concept's final
  copy again (JSON comparison).
- Tests: 16 new data unit tests in `privacy.spec.ts`, 8 per language:
  - Firebase Crashlytics is named in `in-short` and `crash-reports`.
  - `crash-reports` names Android, iPhone/iPad/Mac and the 90 days.
  - Five outdated phrases ("Only the Android app", "Nur die Android-App", "Share with App
    Developers", "Mit App-Entwicklern teilen", "TestFlight") are absent.
- `EDU-45-tests.md`: the rework section, the test table and Cost (77 tests).
- Searched for leftover "Android only" statements in the copy, `privacy/index.html` (meta,
  Open Graph, noscript), `index.html`, `stack.md`, `ai-project.md`, the concept and the testing
  concept. No crash-report claim is left in the page copy or the HTML heads.
- Checks (in `app/`):
  - `npm run test:unit -- --run`: 9 files, 77 tests passed.
  - `npm run lint:check`: clean.
  - `npm run build`: passes.

Results of the copy check (EN and DE):

- `in-short`, `crash-reports`, `deleting` and `legal-bases` agree with each other in both
  languages. They say: Crashlytics on Android and on iPhone, iPad and Mac; published versions
  only, not development builds; error and device data, a random installation ID and app start
  times; no session content, no history and no API key; 90 days; Art. 6(1)(f).
- The opt-in store diagnostics are now one generic sentence for Google Play and Apple.
- The German is the same as the English in content.
- The Firebase privacy link is kept.
- The other platform differences are unchanged and still correct: key storage and deletion,
  backups, the transcript in backups, and the Mac data folder.
- The claim about the Apple app describes a planned flow. This follows the user's decision, and
  D8/D11 tie it to a check when the Apple integration ships.
- The AC 4 wording in the concept keeps the original Jira text "Crashlytics Android only", with
  the note "Changed by user review round 1 … (D11)". That is acceptable.
- `log.md` row "Verified differences: no Crashlytics on Apple" is a historical entry from the
  same day. The newer D11 row above it supersedes it, so this is not a finding.

Tests are proportionate. They are cheap data unit tests. The tests that check outdated phrases
are absent guard a user decision against regression, and they do not compare the copy 1:1.

### Findings

1. **The Apple Crashlytics story is still "no Jira story yet" (architect).** The Jira story
   **EDU-46 "Integrate Firebase & Crashlytics"** (label Apple, relates to EDU-45) now exists, but
   the docs still say "no Jira story yet". Affected places:
   - `EDU-45-privacy-notice-page.md`: the D5 crash-report row and the D8 paragraph "Apple
     Crashlytics (D11)".
   - `docs/architecture/stack.md` → Privacy Notice.
   - The newest row of `docs/architecture/log.md`.

   The D8/D11 safeguard depends on this hand-off: the Apple story must check the
   `crash-reports`, `in-short`, `deleting` and `legal-bases` texts when it ships. With
   "no Jira story yet", that check cannot be traced from this repository. Reference EDU-46 in
   these places.

### Verdict

findings

## Round 4 — 2026-11-04T16:30:00+01:00

### Scope

- Re-check of the round-3 finding. "no Jira story yet" no longer appears in `docs/` or `app/src`,
  apart from this review file. EDU-46 is now referenced in:
  - `EDU-45-privacy-notice-page.md`: the D5 crash-report row ("Apple story EDU-46"), the D8
    paragraph "Apple Crashlytics (D11)" (a link to EDU-46 with its title, and "Until EDU-46
    ships …") and the note under the copy.
  - `stack.md` → Privacy Notice ("Apple story EDU-46; EDU-46 must verify …").
  - `log.md`, newest row (edited in place).
- The handoff is now traceable from this repository: EDU-46 must check the `crash-reports`,
  `in-short`, `deleting` and `legal-bases` texts when it ships.
- No code changed. The privacy chunk has the same hash as in round 3 (`privacy-CSpJ3DLA.js`).
- Checks (in `app/`):
  - `npm run test:unit -- --run`: 9 files, 77 tests passed.
  - `npm run lint:check`: clean.
  - `npm run build`: passes.

### Findings

None.

Still open for the user, not blocking: the notice text is rendered by JavaScript (round-1
observation). The Apple crash-report text describes a planned flow until EDU-46 ships. The legal
check from D6 is out of scope.

### Verdict

positive
