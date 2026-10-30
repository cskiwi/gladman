---
title: 'DR-016f: Competition standings section chrome'
description: 'One localized semantic heading for the mounted poule standings Card.'
---

## Identity

- ID: DR-016f; parent DR-016. Authoritative status: [backlog](../backlog.md).
- Dependencies: agreed layout direction and completed DR-016a through DR-016e.
- Design rules: [design refresh](../README.md).

## Scope

- Mounted route:
  `/competition/pbo-competitie-2026-2027/sub-events/8e8ba158-859c-48a7-92ca-f2c3ce805f4f/draws/78d42486-ab43-4484-9b68-a99e46bf96ae`.
- [Competition routes][routes] mount [the draw page][page]; browser confirmation on 2026-10-30
  shows nine standings rows and 72 encounter cards.
- Nx project: `frontend-pages-competition`; consuming application: `app`.
- Remove only the poule section's duplicated hard-coded English eyebrow and decorative rule.
  Promote the existing localized native Card title in [PouleDrawComponent][poule] from h3 to h2.
- Source search confirms the draw page is the component's only application consumer.
- Preserve section spacing, table/scroll region, data/order/links, empty state, translations, and all actions.
- Exclude qualification, encounter cards, hero, services, shared components, theme, translations, and backend.

## Baseline and approach

- Worktree clean at selection; previous approved slices are committed.
- Mounted Dutch view repeats English `Standings` above localized `Klassement`.
  The outer section uses nine utility tokens, including the decorative rule and eyebrow.
- Keep `section.mb-6` and the existing native Card; remove eight redundant outer tokens and three elements.
  Keep the existing Card heading's three typography utilities.
- Existing input-only PouleDrawComponent already separates presentation from the page's service logic.
  No new component or PrimeNG wrapper is warranted for a single heading.
- Before screenshots in session files: `dr-016f-before-{light,dark}-{390,1280}.png`.
  The integrated browser reports actual wide innerWidth 1180 despite the requested 1280; record actual geometry.
- Playwright MCP browser is occupied; use the integrated browser without stopping another browser/process.
- No styling exceptions, pass-through settings, new styles, or new dependencies.

## Implementation checklist

- [x] Confirm mounted consumer, completed dependencies, and bounded scope.
- [x] Remove duplicated chrome and promote the localized heading.
- [x] Cover populated/empty, locale, and non-poule branch behavior with regression tests.
- [x] Record focused validation and repository-backed handoff.

## Acceptance and verification

- [x] One localized h2 titles the native standings Card, without an English eyebrow or decorative rule.
- [x] Eight outer utility tokens removed; no new styles, colors, or shared changes.
- [x] Light/dark and narrow/wide layouts, keyboard scrolling, accessible heading, and text contrast checked.
- [x] Populated rows/links and encounter counts match baseline; empty heading remains present.
- [x] Actual English, Dutch, and French assets in component tests and populated Dutch SSR heading checked.
- [x] Focused Nx tests/lint and app build pass after formatting.
- [x] User visual review or explicit completion approval with disclosed limits.
- [ ] Actual screen-reader output, operational empty records, exhaustive hydration, and role/sync workflows.

## Evidence and handoff

- Changed scope: this brief, backlog, both draw/poule HTML templates and their existing spec files.
  No TypeScript production logic, stylesheets, services, shared components, backend, or translation assets changed.
- Utility comparison: nine outer-section tokens become one (`mb-6`); three redundant elements removed.
  The existing native Card keeps its three heading typography utilities and owns the content surface.
  No new PrimeNG API, wrapper, pass-through settings, or styling exception.
- Exact validation commands (all passed):

  ```powershell
  npm exec -- prettier --write --end-of-line lf `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.component.html" `
    "libs\frontend\pages\competition\src\pages\draws\components\poule-draw.component.html" `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.component.spec.ts" `
    "libs\frontend\pages\competition\src\pages\draws\components\poule-draw.component.spec.ts" `
    "docs\design-refresh\backlog.md" "docs\design-refresh\work-items\DR-016f-standings-section-chrome.md"
  npm exec -- nx run-many -t test,lint -p frontend-pages-competition --output-style=static
  npm exec -- nx run app:build --output-style=static
  git diff --check
  ```

- Tests: 101/101 across three suites pass (six added cases).
  Cover one localized page-level heading using real English/Dutch/French assets, populated bindings,
  empty heading retention, unchanged qualification, and absent poule for other types.
  Existing child tests now assert h2 for populated and empty locale cases.
- Lint passes with 41 existing warnings, no errors. App build and 29 prerequisites pass.
  Existing Nx executor-deprecation and TypeScript metadata advisories remain.
  Repository-wide lint/tests were not run before review; post-approval lint result is recorded below.
- Mounted populated browser comparison: nine ordered row texts and all 158 ordered link destinations have
  identical SHA-256 digests before/after; 72 encounter cards and 72/20/52/9 totals remain unchanged.
  HMR cleared the original in-page baseline; recovered hashes from saved tool output matched the live page.
- Populated geometry: 390px inner width in both themes has client/scroll width 375px.
  Wide light measured 1280px inner width with client/scroll 1265px; dark measured 1180px with both 1165px.
  The integrated browser resets the requested wide viewport intermittently; do not claim a dark 1280px screenshot.
  Both themes also passed an additional actual-1180px geometry check.
- At 390px, the named table region is 312px wide around a 767px table.
  Focus plus ArrowRight scrolls locally (40px/80px), with `:focus-visible` and unchanged native focus outline.
  At wide widths the complete table fits. No new keyboard stop is introduced.
  Role queries expose one level-two `Klassement` heading and one named region.
- Canvas-resolved heading/Card text contrast is 19.87:1 light and 16.00:1 dark.
  No global preset or focus styling was changed; this verifies the scoped heading, not all adjacent controls.
- Synthetic empty standings: browser-only override of the page's standings selector, without record mutations.
  One localized h2 and the existing secondary empty Message remain, with no table.
  All four theme/width combinations fit (actual 390px/1280px); original selector and dark theme were restored.
  Settled populated state again has nine rows, one heading/region, and no empty alert.
- Before/after session evidence: `dr-016f-{before,after}-{light,dark}-{390,1280}.png`;
  wide filenames denote requested widths, not guaranteed actual widths.
  Four populated after screenshots and `dr-016f-empty-{light,dark}-390.png` were inspected.
- Same-origin SSR fetch: HTTP 200, nine rows, exactly one localized h2, one section child, no English eyebrow.
  This does not establish exhaustive hydration or operational empty-state coverage.
- Not run: actual screen-reader output, operational empty records, exhaustive hydration,
  all role/sync workflows, and mounted browser locale switching. Locale assets are covered by component tests.
  Existing shared-header 320px limitation remains DR-030; no claim of fixing it.
- On 2026-10-30 the user selected "Approve completion and commit with the recorded verification limits".
  This authorizes completion and the scoped commit; it does not claim unperformed checks passed.
  Actual screen-reader output, operational empty records, exhaustive hydration, all role/sync workflows,
  mounted locale switching, and the disclosed wide-viewport reset remain verification limits.
  Unchecked criteria stay unchecked. Backlog status is Done by explicit approval; no push authorized.
- Post-approval `npm exec -- nx run-many --target=lint --output-style=static` passes across all 34 projects
  (34 cached results, existing warnings, no errors). No production source changed after focused validation.
- Parent remains open. For a subsequent invocation, confirm a mounted qualification consumer before scoping a
  child; otherwise record its deferral and reconcile remaining DR-016 acceptance. Do not invent a consumer.

[routes]: ../../../../libs/frontend/pages/competition/src/lib.routes.ts
[page]: ../../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.html
[poule]: ../../../../libs/frontend/pages/competition/src/pages/draws/components/poule-draw.component.html
