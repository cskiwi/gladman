---
title: 'DR-024a1: Draw selection and read prerequisite'
description: 'Repair the mounted nonreactive selector and make draw reads fail explicitly.'
---

## Identity

- ID: DR-024a1. Parent: [DR-024a](DR-024a-admin-draws.md).
- Status: [backlog](../backlog.md). Rules: [design refresh](../README.md).
- Dependency: approved DR-023a shell. Project: `frontend-pages-tournament`.

## Scope and baseline

- Actual visible authorized consumer:
  `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=draws`.
- On 2026-11-09 the selector displays HE 1, but selectedSubEvent stays null and actions remain disabled.
- Selecting DE 1 changes the displayed value with zero GraphQL requests and still asks to select a sub-event.
- Cause: an Angular effect reads plain `FormControl.value`, which is not reactive.
- The service also swallows all read failures into successful empty arrays; the template never renders `error()`.
- Live read-only introspection returns HTTP 200 and confirms `TournamentSubEvent` read fields including
  `entries`, `unassignedEntries` and `drawTournaments`. Full real-query validation remains required.
- Repair only selection/read/loading/error/retry, with no mutation contract changes or operational browser writes.
- Exclude counters/list/dialog visual redesign, locale cleanup of pre-existing English, scheduling and backend.
- Retain smart tab/service orchestration; no genuinely repeated structure warrants extraction in this prerequisite.

## Implementation checklist

- [x] Confirm actual visible consumer, scope and prerequisite defect.
- [x] Synchronize automatic/manual selection with the service filter and clear stale entry/target selection.
- [x] Surface failed/incomplete reads without false empty-state success or throwing value selectors.
- [x] Use native named loading/error/retry feedback without new styling or translations.
- [x] Preserve queries, mutations, permissions, routes and excluded markup.

## Acceptance and verification

- [x] Focused tests cover initial/manual/cleared selection, input replacement, failed/incomplete reads and recovery.
- [x] Latest selected sub-event wins if an earlier read resolves late.
- [x] Actual `SubEventDrawsData` returns HTTP 200 or its precise blocker is recorded.
- [x] Loading/error do not display successful empty states or stale metrics.
- [x] Light/dark at 390/1440px, keyboard selector and refresh focus are verified.
- [x] Existing dictionaries supply the newly mounted generic loading/error/refresh wording.
- [x] Relevant Nx test/lint/build checks pass; exact results are recorded.
- [ ] Exhaustive accessibility/contrast, live operations and dedicated SSR/hydration checks pass.
- [x] User review/approval is recorded before completion or commit.

## Evidence and handoff

- Before: mounted dark-theme selector mismatch reproduced without any mutations; safe evidence is the behavior above.
- `toSignal(valueChanges)` makes the existing FormControl genuinely reactive. Input reconciliation selects the first
  valid sub-event, preserves an existing ID on refresh, and clears a removed selection without querying a missing ID.
- Manual clearing remains cleared until the input list changes. Changing the selected ID clears assignment selection.
- The read resource propagates errors, rejects absent/null collections, and guards value selectors with `hasValue()`.
  A genuine response containing three empty arrays remains a successful empty dataset.
- Native ProgressBar and Message replace the custom loading bar and previously hidden read failures.
  Counters and entry/draw panels are withheld while loading or failed. Operational entry/create buttons are disabled
  during those states; mutation implementations and query documents remain unchanged.
- Incomplete-response feedback reuses `all.error.genericTitle`; network/server Error diagnostics remain unchanged.
- The selector uses `inputId` plus localized `ariaLabel`; refresh uses localized name/tooltip and `aria-busy`.
- Browser verification initially found refresh losing focus because native Button loading disables its button.
  Reused the existing check-in refresh approach: keep the refresh control mounted/enabled and show read progress
  separately. A dedicated pending-retry test and real keyboard refresh verify stable focus.
- Static `class`/`styleClass` whitespace-token count: 519 before, 512 after, measured from HEAD versus the worktree.
  Seven removed loading-bar tokens become one screen-reader-only utility. Formatting the touched legacy template
  accounts for its broad indentation diff; no list/dialog presentation migration is claimed.

### Validation commands

- `npx nx show project frontend-pages-tournament --json`: confirmed actual lint/build/test targets.
- `npx prettier --write` on all eight changed files: passed.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=draws-tab.component.spec.ts --runInBand --output-style=static`:
  passed, 1 suite / 17 tests, fresh execution on the final accessible-selector revision.
- `npx nx run-many -t lint build -p frontend-pages-tournament`: passed, 12 tasks; scoped lint/build executed,
  ten prerequisite builds replayed cache. Earlier static output confirms the same result.
- Existing Jest executor deprecation and ts-jest decorator-metadata warning remain; no new tooling was installed.
- Full tournament tests, operational/API mutation tests and dedicated SSR/hydration checks: not run.
- Post-approval `npx nx run-many --target=lint`: passed, all 34 projects replayed cache.
  This is cached validation, not a fresh workspace lint execution.

### Browser evidence

- Real initial HE 1 and keyboard-selected DE 1 `SubEventDrawsData` return HTTP 200 with all three arrays empty.
  Real keyboard refresh also returns HTTP 200 and retains focus. These are genuine empty reads, not swallowed failures.
- Four settled real-empty cases pass: dark/light at 390/1440px. The named native selector and opened listbox fit
  without document horizontal overflow; Escape closes the listbox.
- Eight safe intercepted query-response cases pass: failed/incomplete reads in both themes and widths.
  Error text is visible, successful empty messages and counters are absent, refresh focus remains, and no document
  overflow occurs. Only `SubEventDrawsData` responses were replaced; operational writes were never used.
- Native dark/wide pending loading was observed with localized status, no false empty message and retained focus.
  Repeated delayed-interception attempts timed out or aborted before a complete matrix; this is a failed browser
  probe, not a passed asynchronous-browser matrix. Interceptors were removed and actual reads restored afterward.
  The focused tests independently pass delayed recovery, selection changes during a pending read and late completion.
- An error-matrix attempt overlapping package rebuild was invalidated by live reload; it is not acceptance evidence.
  The final eight-case matrix ran after the final build and passed.
- Three actual repository dictionaries (`en`, `nl_BE`, `fr_BE`) pass focused loading/error/refresh copy checks.
  Live browser locale switching is not claimed.
- Original dark preference, `nl_BE`, 1355x1249 viewport, genuine data and initial Check-in route are restored.
- Exhaustive accessibility/contrast, populated real datasets, live operational outcomes, dedicated hydration and
  a complete delayed-browser matrix remain unchecked. Existing DR-034 native error-contrast work remains separate.
- User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
  Authoritative status is Done by that explicit approval, not a claim that the unchecked verification passed.
  Approval covers the selection/read prerequisite, focused tests and four repository handoff documents only.

### Remaining actions and decisions

- Existing decorative/palette markup remains for future bounded presentation children, not a new exception.
- No dependencies, SCSS, inline/global styling, shared components, backend or translation assets changed.
- Existing smart tab/service boundaries are sufficient; no extraction merely to style a one-off primitive.
- Scheduling's separately mounted `TournamentScheduleData` HTTP 400 is still visible and belongs to DR-024b.
- Accepted limits: full tournament suite, exhaustive accessibility/contrast, populated real datasets, live operational
  outcomes, live locale switching, dedicated SSR/hydration and the complete delayed-browser matrix remain unchecked.
- Approved commit scope is this slice/handoff only, without pushing. DR-024a and DR-024 remain open.
- Exact next action in a fresh invocation: scope DR-024a2 summary presentation; do not start it in this invocation.
