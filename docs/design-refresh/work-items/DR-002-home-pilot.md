---
title: 'DR-002: Home page pilot'
description: 'A bounded PrimeNG-first redesign of the home ranking reference page.'
---

## Identity and outcome

- ID: DR-002.
- Status and owner tracking: [backlog](../backlog.md); owner unassigned.
- Dependency: [DR-001](DR-001-design-baseline.md).
- Remaining prerequisite: [DR-002a](DR-002a-home-service-prerequisite.md). Its approved service fixes pass functional
  checks; native message contrast remains blocked on DR-007a, tracked in the backlog.
- Route: `/`.
- Nx project: `frontend-pages-home`; application integration through `app`.
- Rules: [design refresh plan](../README.md).

Prove the direction on one page before carrying it into player, club, competition, and tournament workflows. The goal is
a clear ranking reference page, not another decorative dashboard.

## Scope

- [Home template][template] and [component][component], with only directly necessary presentation changes.
- Ranking-system identity, update metadata, level count, and the level-reference table.
- Loading/error presentation and the conditionally visible authenticated player's ranking section.
- Remove only the home page's obsolete component styling once its usage has been checked.

Keep ranking formulas, authentication, routes, shell, theme preset, and shared component styling unchanged. The user
approved only DR-002a's bounded two-contract HomeService correction on 2026-10-16; other service work remains excluded.
Do not rewrite the shared hero or ranking-progress component from this page task. Existing internals of
shared components are tracked separately under DR-004 and DR-005. If a shared change becomes necessary, make the
dependency explicit and scope it independently.

## Implemented native-component approach

- DR-004 integrated the shared semantic heading and metadata in a native card-backed hero.
- The reference section uses native `p-card` and scrollable `p-table`, with the approved page-local row token.
- Cells retain meaningful data, semantic text, and only the necessary alignment/responsive utilities.
- Loading uses native skeletons; no-selection and failure feedback use `p-message`. DR-002a's guarded resource read
  now lets failures render; the native light-mode error text still misses the contrast requirement.
- The authenticated ranking-progress component and its user-ID condition remain unchanged; its design is deferred.
- No dependency, global theme, or shared-component changes belong to this remaining verification slice.

## Behavior to preserve

- Ranking-system name, level count, and optional last-calculation date.
- Ascending level order and all four translated column headings.
- Each row's level, promotion points, demotion points, and points won against that level.
- Distinct handling of `null` values and numeric zero; do not turn a valid zero into an empty value.
- Date formatting, localization, and the selected ranking system's updates.
- Loading and error signals, including their existing interaction with any already loaded content.
- Authenticated player's ranking section only under the existing user-ID condition.
- No new sorting/filtering/pagination behavior unless separately requested.

## Acceptance and verification

- [x] The page uses a native PrimeNG table and explicit native feedback components.
- [x] Data order, all four columns, translated headings, null placeholders, and zero values are preserved.
- [x] Changing the selected ranking system binds the declared GraphQL variable and updates matching displayed data.
  Distinct variable-keyed test fixtures and the browser fixture confirm this; no real-server multi-system audit claimed.
- [x] Anonymous/authenticated conditions, loading, failure, no-data, loaded, and recovery branches pass safe fixtures.
  Authenticated ranking internals remain excluded. Browser states are client-only; no real account was used.
- [x] Long system names and narrow screens retain access to every column without page-level overflow. Reconciled
  with DR-004's browser-only long-name fixture and four-case table scrolling evidence; not repeated in this pass.
- [ ] Full light/dark contrast acceptance. DR-004's loaded-page headings/contrast, drawer Enter/Escape/focus return,
  and persistence passed. Newly tested native error text is 4.41:1 in light mode, below 4.5:1; DR-007a is required.
- [x] Page-level utility usage is measured before/after and unnecessary classes/wrappers are removed.
- [x] There are zero new authored non-semantic colors or numbered palette utilities.
- [x] There is no new SCSS or inline-style workaround; the existing host layout rule remains and the unused gradient
  rule was removed.
- [x] Existing shared consumers and global styling remain unchanged.
- [x] Relevant Nx lint/build checks and focused tests pass. Latest result: 12 passed, no TODOs; lint and development
  homepage package build pass. Nine of ten build tasks were cached; homepage compilation was fresh.
- [x] Route SSR markup/hydration checks are recorded in DR-004. The two-line service fix adds no browser-only API;
  the final live route reload succeeds. No new full hydration audit is claimed.
- [x] The loaded route is visually reviewed before this pattern is applied elsewhere.

Inspect resolved Nx targets before running validation. Start with:

```powershell
npx nx show project frontend-pages-home --json
npx nx show project app --json
```

Use the available lint/build targets and smallest relevant existing test runner. Add focused regression tests for table
values/order and conditional content where current coverage is insufficient. Do not treat the existing application title
smoke test as proof of those behaviors.

## Evidence and handoff

### Approved service prerequisite: 2026-10-16

The user explicitly selected `Approve DR-002a service fixes` after the initial blocked handoff. Only two production
expressions changed: the query now sends `rankingSystemId`, and the resource selector checks `hasValue()` before
reading `value()`. No template, style, ranking formula, authentication, backend, dependency, or shared component changed.

- **Failed before correction:** restored regressions produced three failures (variable binding, initial failure,
  subsequent failure), with nine passing tests. No exception was suppressed in the test environment.
- **Passed after correction, fresh:**
  `NX_DAEMON=false npm exec nx run frontend-pages-home:test -- --runInBand --output-style=static`:
  12 tests, one suite, zero pending/skipped tests. Distinct variable-keyed data verifies switching; both initial and
  subsequent failures render native feedback, and a subsequent successful selection restores the table.
- **Passed:** `NX_DAEMON=false npm exec nx run frontend-pages-home:lint -- --output-style=static` and
  `NX_DAEMON=false npm exec nx build frontend-pages-home -- --configuration=development --output-style=static`.
  Homepage package compilation was fresh; nine prerequisite tasks were cached. The spec has no editor errors.
  HomeService retains existing readonly/statusText editor advisories outside the corrected expressions.
- **Passed static browser matrix:** 390x900/1280x900 in light/dark. A temporary browser-only Apollo replacement handled
  only the `RankingSystem` operation while the actual HomeService/resource and template remained active. An in-memory
  selection signal supplied fixture IDs; no session-storage selection, account, or backend mutation was used.
  The query replacement/original selection were restored and the page reloaded after testing.
- Every case showed three labelled skeletons, distinct two-row alternate data/long title, error alert, successful
  recovery, a four-column empty row, and no-selection feedback. Requests used `rankingSystemId`, not `id`.
  Narrow table/container: 672px/325px, scroll maximum 347px; wide: 1201px/1201px. No page overflow.
- Loading label is `Rankingsysteem wordt geladen`; native error feedback retains `role="alert"`/`aria-live="polite"`.
  Empty/no-selection text renders in Dutch. These are DOM/label checks, not an actual screen-reader session.
- **Browser limitation:** the integrated tab reports `visibilityState: hidden`; native animations pause at time zero.
  A theme click/idle-wait attempt stalled and was canceled by reload, reporting a transition-abort console error.
  Final static checks selected the theme class directly and explicitly finished finite animations, excluding hidden
  `.p-message-leave-active` nodes when testing recovery. Motion timing and immediate DOM removal are not claimed.
- **Failed accessibility gate:** settled 14px/500 error text contrast is 4.41:1 light and 4.63:1 dark at both widths.
  Transient measurements were discarded; final measurement forced style recalculation/finished finite transitions
  and converted native colors through canvas before compositing backgrounds. DR-007a owns this separate native-token
  prerequisite. No styling workaround was added to the approved service fix.
- Safe error screenshots: inspected wide dark and full narrow light views. A misleading narrow element crop was
  superseded by a full view and geometry: search bottom 89px, error top 114.5px, with no overlap. Images remain
  session-scoped; measured results here are the durable evidence. No sensitive screenshot/log was committed.
- **Not run:** full application build, unrelated suites, real-account workflows, real-server alternate-system
  selection, visible-tab animation timing, or a new complete SSR/hydration audit. Prior DR-004 checks remain historical.
- **Next action:** scope DR-007a's native error-message contrast correction and affected consumers. Service behavior
  no longer blocks progress, but DR-002/DR-002a remain open until the failed contrast gate and required review pass.

### Initial safe-fixture continuation (before service approval)

Selected only DR-002's remaining state verification. The worktree was clean. Inspected the actual template,
component, service, existing tests, resolved Nx targets, and DR-004's evidence. No production source was edited.
The existing component spec now uses a controllable selected-system signal and Apollo response mock while retaining
the real HomeService/resource path. No real account, backend mutation, collection discovery, or dependency was used.

- **Passed:** pending request shows three native skeletons and a labelled status region, with no premature message
  or table; completing the safe response restores the three table rows and removes loading feedback.
- **Passed:** clearing the selected ID renders the informational message without another Apollo query; a successful
  zero-level response renders the four-column empty row. A user object without an ID cannot expose player rankings.
- **Passed:** the existing five tests still cover ordered values/zero/null handling, anonymous and authenticated
  projection, shared headings, native card/table composition, and the scoped table token. Four tests were added.
- **Failed probe:** expected `variables: { rankingSystemId: 'test-system' }`; actual request uses
  `variables: { id: 'test-system' }`, although the query declares `$rankingSystemId`. Five other tests passed.
- **Failed probe:** a synthetic HTTP 503 produces `Resource is currently in an error state ... Fixture ranking
  service unavailable` from `resource.value()`, before `.p-message-error` can render. Nine other tests passed.
- Both failures are existing service behavior, not introduced by these tests. The two expectations are retained as
  named TODOs, with complete reproduction bodies in [DR-002a](DR-002a-home-service-prerequisite.md). They are not
  passed acceptance checks. Skipped test bodies were initially used but flagged by editor diagnostics; TODOs avoid
  that advisory without asserting broken behavior as correct.
- **Passed, fresh final execution:**
  `NX_DAEMON=false npm exec nx run frontend-pages-home:test -- --runInBand --output-style=static`:
  one suite, nine passed, two TODOs, no cache hit. One attempt exited 127 without output before the successful retry;
  it is not counted as a test result.
- **Passed:** `NX_DAEMON=false npm exec nx run frontend-pages-home:lint -- --output-style=static`.
  Editor diagnostics for the final spec also report no errors. Existing executor/ts-jest warnings remain unrelated.
- **Not run:** new browser fixture matrix, application/library build, and unrelated suites. This pass changes only
  component tests and handoff documents; it does not claim new visual, screen-reader, workflow, or hydration evidence.
  Existing DR-004 browser/SSR/user-review evidence is explicitly reconciled in the checklist above.
- Before/after UI and utility counts are unchanged. No screenshot is needed to represent a production UI change
  because none was made. No styling exception, new shared pattern, or shared-consumer change was introduced.
- At this stage approval was required for DR-002a. That approval and the resulting correction/checks are recorded
  above; do not restore the historical TODOs or request the same service approval again.

### Approved shared-layout follow-up

On 2026-10-16 the user approved the combined shared heading/hero/shell layout and requested matching table treatment.
[DR-004](DR-004-shared-headings.md) now owns that integration and the explicitly requested global neutral canvas.
The homepage retains native `p-table` inside a rounded, semantic-bordered `p-card` with its shared section heading.
Five homepage tests pass, including a native-table/card/scrollability assertion and authenticated strip projection.
Live restarted-API translations, 1280px/390px light/dark layouts, long-name wrapping, keyboard drawer/focus return,
theme persistence, and SSR markup/hydration checks pass. The user approved the final corrected canvas/table treatment
in DR-004 on 2026-10-16; its homepage-local row token aligns the table with the native card background.
Loading/error/no-system and selected-system switching coverage remain open; this does not mark the entire pilot done.

- Implementation: complete for the selected page structure and native loading/error/table presentation. The DR-001
  baseline is the only prerequisite. Service and shared component behavior remain excluded.
- Changed scope: [home component][component], its template/style, focused component regression test, and the page test
  setup. The test setup uses the installed zoneless Jest environment because `zone.js` is not installed; production
  dependencies were not changed.
- Before browser evidence: captured on 2026-10-16 from the anonymous loaded route at 1280x900 and 390x844 in both
  themes. Wide and narrow layouts had no page-level horizontal overflow. Native autocomplete overlay behavior and theme
  persistence were also checked.
- Initial safe state evidence was limited to anonymous loaded output. The continuations above add controlled
  loading, no-selection, empty-level, user-ID, failure, switching, and recovery coverage; feedback contrast remains open.
- Utility/style comparison: baseline is 22 class-bearing elements in the home template plus a page stylesheet with a
  host flex/gap rule and an unused `.rank-number` rule. The pilot now has 12 class-bearing elements, uses no authored
  numbered palette or light/dark color pairs, and retains only the host layout rule.
- Validation results: `NX_DAEMON=false npx nx lint frontend-pages-home --output-style=static`, `NX_DAEMON=false npx nx
  lint app --output-style=static`, `NX_DAEMON=false npx nx test frontend-pages-home --runInBand --output-style=static`,
  and `NX_DAEMON=false npx nx build app --configuration=development --output-style=static` passed. The focused test
  suite contains two passing regression tests. Nx daemon startup stalled during concurrent initial runs; rerunning
  without the daemon produced the final results.
- Browser review: the live route was checked at 1280x900 and 390x844 in light and dark themes. The document had no
  page-level horizontal overflow in either viewport. At 390px the native table scroll container exposed all four
  columns (`scrollWidth` 672px, `clientWidth` 347px); computed heading and cell text remained readable in both themes.
  The accessibility tree exposed the `h1`, `h2`, table headers, rows, and login controls. The browser reported no
  console errors; the existing PrimeUI license warning remains. The browser session used the already-running API
  process, so it displayed the new translation keys until that process is restarted; the API build below verifies the
  deployed translation assets instead.
- Translation validation: the three source locale JSON files parse successfully. `NX_DAEMON=false npx nx build api
  --configuration=development --output-style=static` passed and generated the new English, Dutch, and French keys in
  `dist/apps/api/assets/i18n` and the generated i18n type. Restart the local API before the next live visual review.
- Remaining verification is DR-007a's native error-message contrast correction and final affected-state review.
  Failure/switching/recovery checks now pass. Long-name, keyboard/focus, restarted-API translation, and SSR/hydration
  evidence from DR-004 remains reconciled above; do not repeat its consumer matrix.
- Visual review: the loaded anonymous route and final corrected canvas/table presentation are approved in DR-004.
  New failure-state review remains open because its light-mode native message contrast fails the acceptance threshold.
- Styling exceptions: none.
- Reusable-pattern decision: keep the result page-local until the pilot review; do not alter shared hero,
  section-header, ranking-progress, theme, or shell components in this slice.

[template]: ../../../libs/frontend/pages/home/src/pages/home/page-home.component.html
[component]: ../../../libs/frontend/pages/home/src/pages/home/page-home.component.ts
