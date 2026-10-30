---
title: 'DR-016c: Competition draw statistics'
description: 'Restrained localized totals for the mounted competition draw hero.'
---

## Identity

- ID: DR-016c; parent DR-016. Authoritative status: [backlog](../backlog.md).
- Dependencies: agreed layout direction and completed DR-016a/DR-016b.
- Design rules: [design refresh](../README.md).

## Scope

- Mounted route:
  `/competition/pbo-competitie-2026-2027/sub-events/8e8ba158-859c-48a7-92ca-f2c3ce805f4f/draws/78d42486-ab43-4484-9b68-a99e46bf96ae`.
- [Competition routes][routes] mount [PageDrawsComponent][component]; browser confirmed on 2026-10-28.
- Nx project: `frontend-pages-competition`; consuming application: `app`.
- Only the four statistic groups in [the template][template], its unused import, tests, and handoff.
- Preserve encounter/played/upcoming/standing counts, order, partition logic, team dash fallback, and projection.
- Exclude hero identity/actions, section chrome, standings, encounters, qualification, loading/error handling,
  permissions, data services, translations, backend, shared components, and theme.

## Baseline and approach

- Worktree clean before selection; previous completed hero work is already persistent.
- Browser baseline: 72 encounters / 20 played / 52 upcoming / 9 teams, nine standing rows.
- Current page has 157 links; normalized ordered text/destination SHA-256:
  `73ac5499a218555a19fbbdbe984a190cb43d09d30fa44aed3b6cf8ac2eb9ff41`.
  This is the current baseline, not the historical 158-link count.
- Before screenshot: integrated browser hero capture, dark wide, inspected in this invocation.
- Replace legacy HeroStatValue and uppercase eyebrow labels with the DR-015f div/span pattern.
  Use restrained semantic totals and existing `all.competition` keys:
  `encounters`, `played`, `upcoming_encounters`, `teams`. No translation asset changes.
- Static totals need semantic HTML, not another PrimeNG visual wrapper. Native Card remains in the shared hero.
- Keep two/four columns and remove unnecessary relative/z-index utilities.
  No new component, SCSS, inline styles, palette colors, or shared changes.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, and bounded scope.
- [x] Preserve count bindings, team fallback, and existing surrounding behavior.
- [x] Reuse div/span pattern and existing translations without shared changes.
- [x] Add regression coverage for counts, zeros, fallback, locales, and legacy-markup removal.
- [x] Record evidence, discoveries, and exact next action.

## Acceptance and verification

- [x] Four localized div/span groups preserve existing bindings and order without list markup.
- [x] Legacy statistic component/variant and eyebrow styling removed only from this subtree.
- [x] Utility comparison recorded; zero new styles, numbered palettes, or non-semantic colors.
- [x] Light/dark at 390px/1280px fit with readable labels and totals.
- [x] Accessible text, contrast, and adjacent keyboard focus checked.
- [x] Populated counts, ordered links, and standings match baseline.
- [x] Component coverage includes zero counts, team fallback, and all three existing locale labels.
- [x] Focused Nx tests/lint and app build pass after formatting.
- [x] Populated SSR and localized mounted rendering checked.
- [ ] Actual screen-reader output, operational empty data, exhaustive hydration, and role/sync workflows.
- [x] User visual review or explicit completion approval with disclosed limits.

## Evidence and handoff

- Changed scope: this brief, backlog, and `page-draws.component.{html,ts,spec.ts}`.
  HeroStatValue import removed only from this consumer; its implementation and other consumers are unchanged.
  Existing component SCSS remains necessary for excluded encounter headings and is untouched.
- Utility comparison: source-authored tokens increase from 26 to 44 because each explicit semantic value
  replaces an encapsulated styled component. Rendered statistic-subtree tokens decrease from 66 to 44.
  Source class attributes increase from nine to thirteen; rendered attributes remain thirteen.
  Remaining utilities supply two/four-column layout, spacing, readable labels, and restrained tabular totals.
  No new component, wrapper, SCSS, inline style, numbered palette, or color exception.
  Played is a neutral count, not a match-result status; no custom win color remains.
- Exact validation commands:

  ```powershell
  npm exec -- prettier --write --end-of-line lf `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.component.html" `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.component.ts" `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.component.spec.ts" `
    "docs\design-refresh\backlog.md" "docs\design-refresh\work-items\DR-016c-draw-statistics.md"
  npm exec -- nx run-many -t test,lint -p frontend-pages-competition --output-style=static
  npm exec -- nx run app:build --output-style=static
  git diff --check
  ```

- Tests: 80/80 across three suites pass, including six new statistics cases.
  Regression coverage uses actual existing locale assets and checks group order, totals, zero encounters,
  unchanged en-dash team fallback, responsive columns, semantic values, and absence of legacy/list/control markup.
  Lint passes with 41 pre-existing warnings and no errors. App build and all 29 prerequisites pass.
  Existing executor-deprecation and TypeScript metadata advisories remain.
  No full repository lint/test run was performed before review.
- After approval, `npm exec -- nx run-many --target=lint --output-style=static` passes across all 34 projects,
  with existing warnings and no errors. No repository-wide test suite was run.
- Browser: Playwright MCP could not acquire its already-in-use profile; no existing process was terminated.
  The integrated browser successfully mounted the real populated route instead.
  Inspected before dark-wide hero and all four after hero screenshots, captured through `screenshotPage`.
  These are chat-attached visual evidence, not committed screenshot files.
- Dutch light/dark at 390px: document/client widths 375/375, statistic grid two 146.25px columns.
  At 1280px: widths 1265/1265, grid four 283.375px columns.
  No statistic or document overflow in the four theme/width checks.
- Normal-state composited sRGB contrast: labels 4.87:1 light / 6.65:1 dark;
  totals 19.87:1 / 16.00:1. Canvas color conversion includes ancestor backgrounds.
  Accessibility snapshot exposes ordered text: labels and 72/20/52/9 values, without interactive statistics.
  Tab then Shift+Tab reaches the unchanged named external anchor with focus-visible in both themes.
  The settled 2px semantic focus ring is visible in both light screenshots.
  No operational sync control or external destination was activated.
- Mounted English, French, and Dutch reloads use real asset labels and retain 72/20/52/9.
  An initial root-path language cookie duplicated the existing default-route-path cookie and caused a timeout.
  The test root cookie was removed; setting the existing default path correctly switched locales.
  Original Dutch cookie/dark theme were restored and viewport returned to 1280px.
- Immediate locale reload geometry sometimes reports transient document widths of 378px/390px.
  A final rerun awaits fonts and 750ms consecutive animation frames without document overflow.
  All three narrow locales then measure 375/375 with no summary overflow.
  This reproduces the layout-settlement behavior recorded in DR-016b; no styling workaround was added.
- SSR: initial PowerShell `Invoke-WebRequest` cookie-header probes all returned Dutch, so they do not
  establish localized SSR. Same-origin browser `fetch(location.href, { credentials: 'same-origin' })`
  under each correctly set locale returns HTTP 200 and actual English/French/Dutch summary labels,
  unchanged values, and zero legacy statistic elements. No unresolved summary keys remain.
- Final browser comparison: all 157 normalized ordered link records retain the baseline SHA-256 above.
  Nine standings and 72/20/52/9 remain unchanged. No backend records were written.
- Reusable pattern: DR-015f's simple div/span statistics with semantic muted labels and neutral totals.
  Existing translation wording is reused unchanged, including French `Joue` and `Les équipes`;
  copy editing is not part of this presentation slice.
- Not verified: actual screen-reader output, operational empty-data records, role/sync workflows,
  exhaustive hydration, and every hover/active interaction. Component tests cover zero/fallback data only.
  Hydrated populated rendering and locale reloads do not establish exhaustive hydration.
- Exceptions: none.
- Review outcome: four screenshots inspected by the agent. On 2026-10-28 the user selected
  "Approve completion and commit with the recorded verification limits".
  DR-016c is Done on that explicit approval. The unchecked screen-reader, operational empty-data,
  role/sync, hydration, and interaction limits above remain unverified; approval is not evidence they passed.
- Next action: commit only this approved implementation/tests/handoff; no push is authorized.
  Then scope one mounted DR-016 section-chrome child with its own brief in the next invocation.
  Do not start it here or restart DR-016c; keep parent DR-016 open.
- Out-of-scope remainder: section chrome, loading/error states, and encounters need separate children.
  Qualification still needs a confirmed mounted live consumer.

[routes]: ../../../libs/frontend/pages/competition/src/lib.routes.ts
[component]: ../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.ts
[template]: ../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.html
