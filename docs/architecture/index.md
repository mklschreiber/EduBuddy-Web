# Architecture Documentation

This directory holds current, durable architecture concepts for the web
application in `app/`.

## Baseline

- [Technology Stack and Tooling](stack.md) — Vue 3, TypeScript, Vite, test,
  lint, brand assets and deployment baseline.

## Current Concepts

<!-- New entries will be added here by the Architect and Tester Agents -->

* [EDU-45 — Privacy notice page](EDU-45-privacy-notice-page.md) - Second Vite entry `privacy/index.html` (/privacy → /privacy/), one bilingual EN/DE page from `src/data/privacy.ts` with the final copy, verified data inventory of both apps, footer "Privacy" link.
* [Tests for EDU-45 — Privacy notice page](EDU-45-tests.md) - Unit and component tests for the bilingual copy module, `PrivacyNotice`, `PrivacyApp`, footer, header and the multi-page entry; manual checks for 320–768 px layout and the post-deploy `/privacy` 301.

## Reviews

<!-- New entries will be added here by the Reviewer Agent -->
<!-- Format: * [Review for Ticket Title](story-id-review.md) - Short description of the latest verdict -->

* [Review for EDU-45 — Privacy notice page](EDU-45-review.md) - Round 4: positive — round-3 finding resolved (EDU-46 referenced in the concept, stack and log); tests, lint and build pass.

When a feature requires a durable architecture decision, add a concise
Markdown concept document here, list it in this section, and record the
decision in [log.md](log.md).
