---
title: 'DR-024a3b: Unassigned entry selection and assignment'
description: 'Native entry selection and assignment controls on the mounted administration Draws tab.'
---

## Identity and scope

- ID: DR-024a3b. Parent: [DR-024a3](DR-024a3-draw-presentation.md).
- Status: [backlog](../backlog.md). Rules: [design refresh](../README.md).
- Dependencies: approved DR-024a1, DR-024a2 and DR-024a3a. Project: `frontend-pages-tournament`.
- Actual authorized mounted consumer confirmed on 2026-11-09:
  `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=draws`, Dutch dark, HE 1, genuine empty entries.
- Source: `libs/frontend/pages/tournament/src/pages/admin/tabs/draws/draws-tab.component.{html,ts,spec.ts}`.
- Scope: unassigned entries Panel, bulk/individual selection, target selector, assignment and its empty messages.
- Preserve entry names including doubles, IDs, selection/reset, assignment service, loading/errors and existing locales.
- Exclude summary, top-level filters, draw lists, dialogs, scheduling, backend/translations, shared/global theme,
  permissions, dependencies and browser operational writes.

## Baseline and approach

- Mounted dark/wide screenshot inspected before editing: custom bordered box, decorative orange inbox and green
  empty icon, English count/tooltips, unnamed icon actions, click-only rows and unbound target selector.
- Replace custom surfaces with a native Panel, checkbox-selection Table and plain translated empty text.
- Use the native Panel title for the unassigned count and native Assign badge for the selected count.
  Reuse nonempty generic check-in bulk-action labels and `all.tournament.entries`: the matching draw keys are blank
  in Dutch/French. Target/assignment/empty messages keep their existing draw keys. No translation changes.
- Retain the smart tab/service boundary. Shared component inventory has no matching repeated assignment consumer;
  no one-off wrapper or unnecessary smart/dumb extraction is warranted.
- Native table selection replaces custom row toggle styling and logic. Target selector reflects reset state.
- No styling exception, new dependencies or shared changes planned.

## Implementation checklist

- [x] Confirm actual consumer, dependencies and bounded child scope.
- [x] Simplify the selection/assignment presentation with native components.
- [x] Preserve selection, names, resets, action payloads and failure recovery in focused safe tests.
- [x] Use existing English/Dutch/French translations and accessible control names.
- [x] No new palette classes, SCSS, inline styles, dependencies or global changes.
- [x] Record focused validation, limitations and next action.

## Acceptance and verification

- [x] Native named Panel/Table, named bulk actions and fluid labeled target selector render correctly.
- [x] Checkbox and row selection toggle once; bulk select/clear and doubles names remain correct.
- [x] Assignment sends selected IDs/target; success clears selection/target and failure preserves retry state in tests.
- [x] Updating/disabled/loading/read failure and no-selection states remain explicit in focused tests.
- [x] Empty/no-unassigned states and three actual locale dictionaries are verified in focused tests.
- [x] Light/dark at 390/1440px, keyboard/focus and target overlays pass with real-empty/synthetic-populated data.
- [x] Measured title, header, entry, target/label and badge normal text meet 4.5:1 in both themes.
- [ ] All native Button normal text meets 4.5:1: light Assign fails under existing DR-033.
- [x] Relevant Nx tests, lint and build pass.
- [ ] Populated real browser reads, live operations/permissions and exhaustive accessibility are verified.
- [ ] Dedicated SSR/hydration and full tournament regression suite are verified.
- [x] User visual review and approval recorded.

## Evidence and handoff

- Before screenshot: actual mounted Dutch dark/wide, genuine empty. No operations or writes.
- After: native Panel uses `header` and `icons` templates, preserving a named region without a hand-built surface.
  Checkbox Table uses native selection, row indices, checkbox names and 20rem native scroll height.
  Removed the old checkboxes/import, row-toggle methods, selection palette pairs, decorative circles and empty icon.
  Assignment Select binds its current ID rather than only forwarding changes, so state resets are reflected.
  Bulk/row/checkbox/target controls are disabled during assignment; native Button loading prevents duplicate submits.
  Target and counted Assign controls appear only for a selection, as before. Service and operational payload stay intact.
- Existing smart tab/service boundary is sufficient; repeated rows alone do not justify another component.
  No shared component, theme, stylesheet, inline style, backend, translation or dependency changes. No exception.
- Full template static class/styleClass tokens: 357 before, 272 after. Remaining scoped utilities provide minimum-width
  protection, vertical assignment spacing, entry wrapping, an accessible hidden column heading and muted empty text.
  Remaining excluded draw-list/dialog utility markup is not claimed removed.
- Four genuine-empty Dutch light/dark at 390/1440px pass: named Panel, count, translated disabled bulk actions,
  empty text and controls fit without document overflow. Inspected light/narrow empty screenshot.
- Four synthetic-populated Dutch light/dark at 390/1440px pass with a one-use intercepted read:
  12 explicitly safe named entries, a long wrapping name and two safe target draws. These are not real populated reads.
  Native table scrolls internally; Panel/document/controls and both target options fit. Selection/target persist.
  All four target overlays close with Escape and retain target-selector focus.
  Inspected light/narrow and dark/wide screenshots; no private images committed.
- Safe browser keyboard checks pass after explicitly clearing selection:
  checkbox Space selects/deselects once; row Space/Enter selects/deselects; Enter on bulk select selects all 12.
  ArrowDown opens the target overlay, a second ArrowDown focuses its first option, and Enter selects Safe test draw A.
  Counted Assign becomes enabled but is never clicked. Browser assignment/deletion/seeding/generation are not run.
- Settled normal-text contrast measured by compositing computed backgrounds and canvas-converted sRGB:
  light title/header/label 19.87:1, target 13.61:1, selected name 4.67:1, Assign badge 7.74:1;
  dark title/unselected name/label/target 16:1, selected name 10.30:1 and badge 9.51:1.
  Assign label fails light at 3.65:1 and passes dark at 10.63:1. Record under DR-033, without a page workaround.
- Restored real DE 1 and HE 1 reads and Enter-on-refresh return HTTP 200. Refresh retains native button focus.
  Original dark theme, Dutch locale, 1355x1249 viewport, HE 1, closed overlay and Draws route are restored.
  One-use read interceptors expire automatically; synthetic records are replaced by four genuine zero counts.
- Existing independent Scheduling `TournamentScheduleData` HTTP 400 remains DR-024b.
  Existing Auth0 silent-token timeout is observed during hot reload; subsequent real reads still pass.
  Existing French draw terminology and unused blank draw labels remain for DR-024a4 locale completeness.

### Validation commands and limits

- `npx nx show project frontend-pages-tournament --json`: confirmed actual targets.
- `npx prettier --write` on all six changed files: passed before validation; handoff documents formatted again afterward.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=draws-tab.component.spec.ts --runInBand --output-style=static`:
  passed, one suite / 45 tests, fresh execution (14 new plus 31 existing).
  Includes native grouping/names, checkbox/row/bulk selection, keyboard/roving focus, target overlay/model/reset,
  doubles names, exact mock assignment payload/refetch/success/failure/pending guards and actual three-locale copy.
  Mutations use safe in-memory Apollo mocks only; no real backend writes.
- `npx nx run-many -t lint build -p frontend-pages-tournament --output-style=static`:
  passed all 12 tasks; scoped lint/build execute and ten prerequisite builds replay cache.
- Existing Nx Jest deprecation and ts-jest metadata warnings remain; no dependencies installed.
- Post-approval `npx nx run-many --target=lint --output-style=static`: passed all 34 projects from Nx cache
  with existing warnings and zero errors. No fresh workspace lint execution is claimed.
- Initial tests exposed missing JSDOM `matchMedia` and a premature assertion during asynchronous assignment refetch.
  Added a scoped/restored media-query mock and awaited resource completion; final suite passes.
- Initial immediate resize probes sampled transient overflow; awaited settled four-case checks pass.
  A keyboard probe timed out because selection had intentionally persisted from a prior synthetic read.
  Explicitly clear state before the passing probe; do not claim the initial attempt passed.
  An animation-wait contrast probe aborts on theme transition cancellation; separate settled measurements above pass
  except for the disclosed Assign contrast failure.
- Full tournament suite, populated real reads/browser operations, permissions, exhaustive locale/hover/focus/contrast,
  screen-reader audit and dedicated SSR/hydration: not run. Build is not evidence that these passed.
- User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
  Approval covers only this unassigned-entry implementation, focused tests and repository handoff.
  Authoritative status is Done by explicit approval; failed/unperformed checks remain unchecked.
  Approval does not claim that those checks passed. Commit only this approved slice/handoff; no push.
- Exact next action in a fresh invocation: scope DR-024a3c draw-list/actions/empty-state presentation
  from its mounted consumer before implementation.
  Keep DR-024a3, DR-024a and DR-024 open; do not start siblings now.
