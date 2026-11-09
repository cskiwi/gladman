---
title: 'DR-024a3a: Draw filters and actions'
description: 'Native grouped filter and action presentation for the mounted administration Draws tab.'
---

## Identity and scope

- ID: DR-024a3a. Parent: [DR-024a3](DR-024a3-draw-presentation.md).
- Status: [backlog](../backlog.md). Rules: [design refresh](../README.md).
- Dependencies: approved DR-024a1 and DR-024a2. Project: `frontend-pages-tournament`.
- Actual authorized visible consumer confirmed on 2026-11-09:
  `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=draws`, real phase COMPLETED.
- Source: `libs/frontend/pages/tournament/src/pages/admin/tabs/draws/draws-tab.component.{html,spec.ts}`.
- Only the sub-event selector and top-level generate/create/refresh action group change.
- Preserve control identity, read lifecycle, operational handlers, loading/disabled states and translations.
- Exclude summary, unassigned/assigned entries, list and empty panels, dialogs, confirmations, scheduling,
  permissions, backend, translations, dependencies, shared components and global theme.

## Baseline and approach

- Before: styled generic filter box with repeated surface/border utilities and minimum-width selector.
  Genuine empty Dutch light/dark at 390/1440px fit without document overflow; actions are enabled.
- Capture before screenshot of mounted dark/wide tab; record browser findings here rather than commit private images.
- Use the enrollment/check-in native filter Panel pattern, existing translated `all.games.filters`,
  fluid Select and responsive layout-only utilities. Retain the named refresh without replacing it while loading.
- The existing smart tab/service owns orchestration. Direct PrimeNG is preferable to a one-off dumb wrapper;
  no genuinely repeated domain structure warrants extraction in this child.
- No shared component changes or styling exception planned.

## Implementation checklist

- [x] Confirm actual consumer, dependencies and bounded child scope.
- [x] Replace the custom filter box with native grouped controls.
- [x] Preserve selection, actions, disabled/loading behavior and translated names.
- [x] No new palette classes, SCSS, inline styles, dependencies or global changes.
- [x] Record focused validation and repository-backed handoff.

## Acceptance and verification

- [x] Native Panel and fluid Select preserve readable grouping without decorative surface utilities.
- [x] Selection/refresh and stale-selection reset regressions pass.
- [x] Generate/create handler wiring and loading/error/no-selection action guards pass in safe tests.
- [x] Actual English/Dutch/French labels persist across locale switches without extra reads in focused tests.
- [x] Light/dark at 390/1440px preserve labels, fit and native selector overlay.
- [x] Keyboard selector/actions and stable refresh focus are verified in the browser.
- [x] Scoped labels, selector and secondary-button normal text meet 4.5:1 contrast in both themes.
- [ ] All native Button normal text meets 4.5:1 contrast: light primary Create fails under existing DR-033.
- [x] Focused Nx tests, lint and build pass.
- [ ] Populated real reads, full locale/interaction browser matrices and exhaustive focus/hover contrast verified.
- [ ] Dedicated SSR/hydration, exhaustive accessibility and live operational outcomes verified.
- [x] User visual review and approval recorded.

## Evidence and handoff

- Before: screenshot inspected on the actual mounted dark/wide tab; four baseline theme/width cases pass.
- After: inspected native dark/wide and light/narrow screenshots and semantic snapshot.
  The existing outer administration Card and native inner filter Panel match enrollment/check-in grouping.
- Only filter markup and focused component tests change in application source. Panel was already imported.
  Native Select `fluid` and Panel `header` are verified against installed PrimeNG 22 types/native rendering.
  Top actions use native `onClick`; existing handlers and disabled/loading bindings are unchanged.
- Full template static class/styleClass tokens fall from 363 to 357; no custom border/surface box remains in scope.
  Remaining utilities provide responsive selector/action alignment, spacing and minimum-width protection.
  Excluded assignment/list/dialog palette utilities are not claimed removed.
- Four genuine-empty Dutch light/dark at 390/1440px cases pass: no document overflow, all controls fit their Panel.
  Four corresponding selector-overlay cases show all 35 real options within the viewport;
  keyboard ArrowDown opens and Escape retains selector focus.
- Wide light keyboard order is selector, Generate, Create, Refresh. Enter on Refresh returns real
  `SubEventDrawsData` HTTP 200, restores four genuine zeros and preserves the same focused native button.
- Narrow light keyboard selection HE 1 to DE 1 and back returns HTTP 200 for both reads; monitored mutation attempts: zero.
  Generate is stubbed only in the safe component test; no browser operational actions or data writes are used.
- Settled normal-text contrast, computed colors converted through canvas to sRGB:
  dark header/label/selector 16:1, secondary Generate/Refresh 6.65:1, primary Create 10.63:1.
  Light header/label 19.87:1, selector 13.61:1, secondary Generate/Refresh 4.87:1;
  primary Create fails at 3.65:1, recorded under existing DR-033 rather than adding a page color workaround.
  An intermediate dark transition sample is discarded; only settled dark measurements above are evidence.
- Original dark preference, Dutch locale, 1355x1249 viewport, HE 1, closed overlay and Draws route are restored.
- Existing independent Scheduling `TournamentScheduleData` HTTP 400 remains DR-024b; do not fix it here.
- Smart/dumb decision: retain existing smart tab/service, reuse the established native Panel pattern directly.
  No shared component changes, extraction, styling exception, dependency, backend or translation changes.

### Validation commands and limits

- `npx nx show project frontend-pages-tournament --json`: confirmed actual lint/build/test targets.
- `npx prettier --write` on all seven changed files: passed before Nx checks; documentation formatted again afterward.
  The initial formatter found a mismatched closing tag; corrected before tests/build, with no remaining template error.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=draws-tab.component.spec.ts --runInBand --output-style=static`:
  passed, one suite / 31 tests, fresh execution (nine new regressions plus 22 existing tests).
  Covers native grouping/fluid selector, safe handler wiring, read/no-selection/failure/update guards,
  actual three-locale filter copy, summary behavior, selection/read recovery and asynchronous focus safety.
- `npx nx run-many -t lint build -p frontend-pages-tournament --output-style=static`:
  passed all 12 tasks; scoped lint/build execute, ten prerequisite builds replay cache.
- Existing Nx Jest deprecation and ts-jest decorator-metadata warnings remain. No dependencies installed.
- Post-approval `npx nx run-many --target=lint --output-style=static`: passed all 34 projects from Nx cache
  with existing warnings and zero errors. This is cache replay, not fresh workspace lint execution.
- An initial combined overlay probe times out during viewport/theme transitions; a later stable,
  awaited-option four-case probe passes. Do not treat the timeout as application failure or passing evidence.
- Full tournament suite, populated real reads/browser matrices, live operations/permissions, full locale-switch
  browser matrix, exhaustive accessibility/screen-reader/contrast and dedicated SSR/hydration: not run.
- User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
  Approval covers this filter/actions implementation, focused tests and repository handoff only.
  Authoritative status is Done by explicit approval; DR-033 failure and unperformed checks remain unchecked.
  Approval does not claim those checks passed. Commit only this approved slice/handoff; no push.
- Exact next action in a fresh invocation: scope DR-024a3b unassigned selection/assignment
  from its mounted consumer before implementation.
  Leave DR-024a3/a/DR-024 aggregates open; do not begin another child in this invocation.
