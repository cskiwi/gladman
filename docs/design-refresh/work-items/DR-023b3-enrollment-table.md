---
title: 'DR-023b3: Enrollment table and feedback'
description: 'Native enrollment table and explicit query feedback on the mounted administration tab.'
---

## Identity

- ID: DR-023b3; parents DR-023b and DR-023 remain open.
- Authoritative status: [backlog](../backlog.md).
- Dependencies: approved DR-023a chrome, DR-023b consumer and DR-023b1/b2 summary/filters.
- Design rules: [rollout](../README.md).

## Scope

- Confirmed route: `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=enrollments`.
- Project: `frontend-pages-tournament`.
- Sources: [component][component], [template][template], [service][service], [tests][tests].
- Refresh the table heading, rows, pagination, notes, named actions and loading/empty/error/no-selection feedback.
- Let query failures reach the resource error state; guard resource reads and permit explicit refresh recovery.
- Preserve singles/doubles columns, player/guest/partner identity, statuses, position, notes, filtering and handlers.
- Exclude manual dialog/creation, operational mutation logic, summary/filter presentation, other tabs,
  backend/locale assets, dependencies and shared components/theme.
- Keep the existing smart tab/service split. This table has one consumer; no reusable wrapper is justified.

## Baseline and proposed approach

- Clean worktree at start on 2026-11-08; previous approved slice is already persistent.
- Authorized browser selects Inschrijvingen and mounts one actual `app-enrollments-tab`.
- Safe current data: HE 1, five zero summary counts, no enrollment rows.
- Custom table surface/header/avatars and two competing empty states; table is absent when empty.
- Loading uses a custom animated div and inline width; query exceptions return successful empty arrays.
- Waiting position uses manually paired orange palettes; notes are pointer-only tooltips.
- Use one scrollable small Table, native Tag/ProgressBar/Message and named native Buttons.
  Final implementation uses a named semantic section on the existing administration Card, not another Panel.
- Reuse meaningful existing translations for blank count/position/manual/selection labels.
  Full locale completeness remains DR-023b5; no translation asset edits in this slice.
- Show notes as readable wrapping text rather than an inaccessible icon-only tooltip.
- Verify light/dark 390/1440px, safe fixture rows/pagination/feedback, local search and refresh.
  Never execute operational mutations for visual checks.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and scope.
- [x] Simplify table/feedback with native components and semantic layout utilities.
- [x] Correct query error propagation and safe selectors with recovery regressions.
- [x] Preserve domain data/actions, localized labels and selection/search behavior.
- [x] Format changes and run focused Nx lint/test/build.
- [x] Record evidence, limits and exact handoff.

## Acceptance and verification

- [x] One native table handles populated and empty states, with correct singles/doubles colspan.
- [x] Pagination retains 10/25/50 options; ten-row paging verified by test and keyboard browser check.
- [ ] Exhaustive browser interaction with 25/50 row-size options passes; later check was interrupted.
- [x] Failed/missing-data queries are errors, not empty success; selectors remain safe and refresh recovers.
- [x] Loading has named native progress; empty and no-selection messages remain meaningful.
- [x] Status severity, waiting position, notes and accessible action names preserve information.
- [x] Light/dark 390/1440px table/feedback layouts fit; table scroll remains local.
- [x] Keyboard/focus, labels and sampled heading/count/header/empty contrast checked.
- [x] No new SCSS, inline CSS, palette, global/shared behavior or dependency.
- [x] Focused final enrollment regressions pass; Nx lint/build passed on final application sources.
- [x] Full final tournament test suite passes without timeout allowances; final serial Nx retry passes.
- [ ] Screen-reader, exhaustive accessibility/contrast, live nonzero operations and SSR/hydration verified.
- [x] User visual review or explicit approval with disclosed limits.

## Evidence and handoff

- Implementation: native small scrollable table always renders after successful loading, including empty data.
  Correct five/six columns and colspan; named section and native HTML caption provide accessible context.
  Installed Table has no `ariaLabelledBy` input: an initial attempted attribute did not name the table.
  The supported colgroup projection places a semantic caption directly inside the native table.
  No pass-through/design-token binding, custom CSS or shared component was added.
- Initial native Panel exposed an internal grid-wrapper min-content overflow on narrow nonzero fixtures.
  Replaced it with a semantic section on the existing Card, rather than patching native internals/global styles.
  Final narrow fixture container is 279px and table 478px with local horizontal scrolling; document is 375px
  within the 390px viewport. Wide container/table is 1212px and document fits 1440px.
- Static class/styleClass tokens from update feedback through no-selection fall from 173 to 35.
  Three authored inline/table-style bindings become zero; zero scoped numbered/nonsemantic palettes remain.
  Manual dialog styles remain excluded, unchanged and assigned to DR-023b4.
- Query catch returning `[]` is removed. Missing/null response lists throw an explicit error.
  Shared local enrollment-data selector guards `hasValue()` for both list and stats.
  Errors render natively and refresh recovers; loading hides stale error and empty-success presentation.
  Empty/no-selection use native secondary severity: initial info empty text sampled only 4.34:1 in dark mode.
  Final empty text samples 7.74:1 light and 9.51:1 dark; no theme override needed.
- Existing meaningful labels replace blank table count/position/add/no-selection copy.
  Status options supply translated row tags; Withdrawn and existing Guest/Preferred/Unknown wording
  remain disclosed DR-023b5 locale work. All three asset-backed label tests pass.
- Seven new regression cases cover empty singles/doubles, three query failures/recovery, loading,
  row identity/position/notes/status/action gates and ten-row pagination.
  Existing filters/search/summary regressions pass; all mutation spies remain unused.
- Validation commands:

  ```powershell
  npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static
  ```

  Passed before the final feedback-only changes: 17 suites / 228 tests, lint, production library build
  and ten prerequisites. Initial new-test failures exposed unsupported Table labeling and incorrect
  Panel action template selection; corrected and rerun successfully before browser overflow correction.
  Final run: lint/build passed, tests hit four 5-second timeouts in unchanged suites (224 tests passed).
  Two serial Nx retries stalled before test execution, including `NX_DAEMON=false`; stopped only those
  tool-owned process trees. Direct full configured Jest retry also hit an unchanged detail-suite timeout
  and was stopped rather than changing unrelated tests.

  ```powershell
  npx jest --config "libs\frontend\pages\tournament\jest.config.ts" --runInBand --runTestsByPath "libs\frontend\pages\tournament\src\pages\admin\tabs\enrollments\enrollments-tab.component.spec.ts" --testTimeout=30000
  ```

  Final focused fallback passes: one suite / 27 tests, 92.224 seconds.
  Timeout allowance is an execution option, not a test/configuration source change.
  Existing Angular compiler/Jest executor warnings remain. Full final default-timeout suite is not claimed clean.

- Browser evidence: actual authorized HE 1 empty table and safe intercepted 26-row query responses.
  Four light/dark 390/1440px populated checks fit with readable notes, native tags and ten visible rows.
  Enter on native next-page button shows SAFE-10; HD 1 shows six columns and Safe Partner 0.
  Four empty-state checks preserve labels/counts and fit. Four settled long/unbroken error checks fit:
  narrow error/message widths 279/258px, wide error 1212px; no table in the failed state.
  Native loading exposes `progressbar`, localized `Spelers laden...`, busy=true and no table/error.
  Explicit gate release restores successful empty state. Failed-query/normal-query retry observes two
  enrollment requests and zero mutations. Browser routes/viewport/theme and normal data are restored.
- Keyboard Tab from Refresh reaches named Add, with native 1px solid focus outline in both themes.
  Heading/header contrast samples 19.87:1 light and 16:1 dark; secondary count 4.87/6.65:1.
  Full severity/action/focus contrast and screen-reader audit remain unverified.
  Initial regex-based color parsing produced invalid contrast results for modern color syntax;
  superseded by Canvas-normalized, alpha-composited RGB measurements above.
- Screenshots attached in chat show the actual final wide-dark table and native secondary empty feedback.
  Safe fixtures are intercepted read-only query responses, not stored enrollment data.
  Initial incomplete fixture responses caused cache missing-field warnings; complete queried fields were
  supplied on the final populated fixture run. Operational mutations were never used.
  Existing schedule/check-in GraphQL 400s are outside scope; source/permissions remain unchanged.
- Later optional 25/50 browser check was interrupted by detached option DOM; no exhaustive claim.
  Default ten-row paging, option preservation and related local-query behavior are covered by tests.
- On 2026-11-08 the user selected "Approve completion and commit with disclosed limits" and "Nothing else".
  Approval covers this table/feedback implementation, tests and repository handoff only.
  Initially accepted full-suite, 25/50, screen-reader, exhaustive accessibility/contrast, live-nonzero and SSR/hydration
  limits were disclosed. Remaining limits stay unchecked; no unperformed check is claimed passed. No push.
- Post-approval execution environment recovered:

  ```powershell
  npx nx run-many --target=lint --output-style=static
  npx nx run frontend-pages-tournament:test --runInBand --output-style=static
  ```

  All 34 workspace lint targets pass with existing warnings.
  Final default-timeout tournament suite passes: 17 suites / 228 tests, 74.659 seconds.
  This supersedes the full-suite execution limit above; other accepted verification limits remain unchecked.

- Exceptions: none.
- Authoritative child status is Done with explicit approval; both parents remain open.
- Remaining action: commit this approved slice/handoff only; preserve accepted verification limits.
  Exact next action in a fresh invocation: scope DR-023b4 manual dialog/creation on the confirmed consumer.
  Do not begin that implementation in this invocation.
- Out-of-scope known concerns: incomplete manual creation and blank locale copy remain DR-023b4/b5.

[component]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.component.ts
[template]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.component.html
[service]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.service.ts
[tests]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.component.spec.ts
