---
title: 'DR-024a2: Draw summary presentation'
description: 'Replace decorative draw counters with a native grouped semantic summary.'
---

## Identity and scope

- ID: DR-024a2. Parent: [DR-024a](DR-024a-admin-draws.md).
- Status: [backlog](../backlog.md). Rules: [design refresh](../README.md).
- Dependency: approved DR-024a1. Project: `frontend-pages-tournament`.
- Actual authorized mounted consumer confirmed on 2026-11-09:
  `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=draws`.
- Source: `libs/frontend/pages/tournament/src/pages/admin/tabs/draws/draws-tab.component.{html,ts,spec.ts}`.
- Only the total, assigned, unassigned and draw-count presentation changes.
- Preserve the existing stats selector, selection/read lifecycle, permissions, labels and descriptions.
- Exclude filters, assignment/list markup, dialogs, scheduling, mutations, backend, translations and shared theme.

## Baseline and approach

- Mounted dark/wide baseline: four zero counts, ornamental icon circles, uppercase labels and colored borders.
- No document overflow at 1355x1249. Summary descendants contain 167 class tokens, excluding its grid wrapper.
- Use a native Panel within the existing shared Card; semantic `dl`/`dt`/`dd` repeat the established check-in pattern.
- A typed four-item definition eliminates repeated presentation. Keep smart orchestration in the existing tab/service.
  No new component solely to wrap a one-off primitive; no shared components change.
- Existing Dutch/French summary descriptions are empty; existing French terminology also needs later locale review.
  Preserve that content here; DR-024a4 owns mounted locale completeness.

## Implementation checklist

- [x] Confirm mounted consumer, prerequisite and bounded scope.
- [x] Replace decorative counters with native grouped semantic presentation.
- [x] Preserve count bindings and translated labels/descriptions.
- [x] No new palette classes, SCSS, inline styles, dependencies or global changes.
- [x] Record focused validation and accurate handoff.

## Acceptance and verification

- [x] Four label/value pairs show zero/nonzero counts and selection/refresh updates in focused tests.
- [x] Summary stays absent without selection, while loading and after failed/incomplete reads in focused tests.
- [x] Actual dictionaries preserve label/description binding without extra locale queries in focused tests.
- [x] Genuine empty light/dark at 390/1440px fit with readable labels and contrast.
- [x] Keyboard selector/refresh remain usable with stable refresh focus.
- [x] Focused Nx tests, lint and build pass.
- [ ] Populated real reads and loading/error/nonzero visual browser matrix verified.
- [ ] Dedicated SSR/hydration, exhaustive accessibility and live operational outcomes verified.
- [x] User visual review and approval recorded.

## Evidence and handoff

- The existing typed check-in loop is reused as a presentation pattern, not a new shared component.
  The smart tab/service split remains unchanged; only Panel import, four-item definition and summary markup change.
- Native Panel `header` verified against PrimeNG docs and installed types. No Card nesting or styling bindings.
- Full template static class/styleClass tokens: 512 before, 363 after. The replacement reduces repeated ornament,
  palettes, icon circles, hover effects and uppercase labels; layout uses one/two/four responsive columns.
- Before: mounted dark/wide four-zero decorative counters, baseline described above.
- After: inspected native dark/wide summary screenshot and semantic browser snapshot; four terms retain their values.
  Four real-empty cases pass: dark/light at 390/1440px, one/four columns respectively, no document overflow.
- Scoped rendered text contrast measured from computed colors converted through browser canvas to sRGB:
  dark label 6.65:1 and count 16:1; light label 4.87:1 and count 19.87:1 against resolved native Panel surface.
  These checks cover summary labels/counts, not an exhaustive application accessibility audit.
- Keyboard ArrowDown opens the named sub-event listbox, Escape closes it and retains selector focus.
  An earlier immediate Space/visibility probe was inconclusive; the awaited ArrowDown probe above passed.
- Keyboard Enter on refresh returns actual `SubEventDrawsData` HTTP 200, restores four genuine zeros and retains focus.
  No browser mutations, interception, synthetic operational records or backend changes were used.
- Original dark preference, Dutch locale, 1355x1249 viewport, HE 1 and Draws route remain restored.
- Existing unrelated `TournamentScheduleData` HTTP 400 still appears in the shared admin page; DR-024b owns it.
  No scheduling fix is included.

### Validation commands and limits

- `npx nx show project frontend-pages-tournament --json`: confirmed actual lint/build/test targets.
- `npx prettier --write` on all six changed files: passed before validation; handoff formatted again afterward.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=draws-tab.component.spec.ts --runInBand --output-style=static`:
  passed, one suite / 22 tests, fresh execution.
- Tests cover zero/nonzero four-count DOM, native semantic structure, replacement selection, refresh,
  no-selection/loading/failure/incomplete-read hiding, actual three-locale copy and zero extra locale reads.
  Existing asynchronous recovery, stale-response safety and focus tests also pass.
- `npx nx run-many -t lint build -p frontend-pages-tournament --output-style=static`:
  passed all 12 tasks; scoped lint/build executed, ten prerequisite builds replayed cache.
- Existing Nx Jest deprecation and ts-jest decorator-metadata warnings remain; no dependencies installed.
- Post-approval `npx nx run-many --target=lint --output-style=static`: passed all 34 projects from cache,
  with existing warnings and zero errors. This is cache replay, not fresh workspace lint execution.
- Auxiliary PowerShell locale inspection failed on existing case-differing JSON keys; actual dictionary validation
  uses the passing JavaScript/Jest tests, not that failed probe.
- Full tournament tests, populated real reads/browser matrices, live operations, exhaustive accessibility,
  dedicated SSR/hydration and live locale-switch matrices: not run. No claim these pass.
- Exceptions: none.
- User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
  Approval covers this summary implementation, focused tests and three repository handoff documents only.
  Authoritative status is Done by explicit approval; unchecked checks remain unverified, not passed.
- Parent DR-024a and DR-024 remain open.
- Exact next action in a fresh invocation: split DR-024a3 filters/assignment/draw-list into bounded children,
  confirming mounted consumers before selecting one. Do not begin it here or push.
