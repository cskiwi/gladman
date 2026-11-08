---
title: 'DR-023c1: Check-in summary'
description: 'Five-count check-in summary scope and verified missing-read-API blocker.'
---

## Identity

- ID: DR-023c1; parent [DR-023c](DR-023c-admin-checkin.md).
- Authoritative status: [backlog](../backlog.md); do not maintain another status here.
- Dependencies: approved DR-023a chrome and a functioning check-in read API.
- Design rules: [rollout](../README.md).
- Intended outcome: a named native Panel containing five readable, theme-aware summary metrics.
- Owner: unassigned.

## Scope

- Exact mounted route: `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=checkin`.
- Projects: `frontend-pages-tournament`, approved `backend-graphql` prerequisite and summary `backend-translate` assets.
- [Tab template](../../../libs/frontend/pages/tournament/src/pages/admin/tabs/checkin/checkin-tab.component.html).
- [Tab component](../../../libs/frontend/pages/tournament/src/pages/admin/tabs/checkin/checkin-tab.component.ts).
- [Data service](../../../libs/frontend/pages/tournament/src/pages/admin/tabs/checkin/checkin-tab.service.ts).
- Preserve total, checked-in, pending, no-show and percentage meaning, including one-decimal percentage formatting.
- Preserve actual query data, loading/error distinction, localization and current phase/permission gates.
- Exclude filters, table, selection, operational mutations/handlers, other tabs and global theme/shared components.
- User approved the bounded API prerequisite repair on 2026-11-08.
  Registration exposes its existing query/mutation surface; preserve permission gates and verify output shapes.

## Baseline and proposed approach

- Worktree was clean at invocation start on 2026-11-08.
- Fresh authorized browser confirms selected Check-in and a visible `app-checkin-tab`.
  The administration gate permits check-in only for SCHEDULED, IN_PROGRESS or COMPLETED.
- Baseline summary: five duplicated decorative tiles, palette-colored icons/borders, paired light/dark colors,
  uppercase labels, hover shadows and zero/0% values. Dutch total/rate labels and descriptions are blank.
- Native Panel and definition-list direction already exists in the approved enrollment summary.
  Use a single typed metric loop with responsive layout and semantic text; no nested Cards, SCSS or inline styles.
- Reuse existing translated `totalPlayers`/`checkinRate` where appropriate.
  Missing visible summary descriptions must be completed or explicitly scoped before acceptance;
  remaining tab copy belongs to DR-023c4.
- Retain the smart tab/service split. Another wrapper is not justified by this single five-metric consumer.
- Scoped utility tokens, including the unchanged outer wrapper: 179 before, 27 after.
  The rest of the template is repository-formatted only; existing filter/table styles and behavior are not redesigned.
  Named refresh uses the documented native Panel icons template and remains mounted during loading/error/success,
  avoiding keyboard focus loss when feedback changes. DR-023c2 may consolidate the legacy action-bar refresh later.

## Initial verified blocker (resolved)

- Actual `TournamentCheckInData` emits HTTP 400, not a successful empty data response.
- Minimal same-origin read-only request:

```graphql
query DRCheckinRead($id: ID!) {
  tournamentCheckInList(tournamentEventId: $id) {
    id
  }
  checkInStats(tournamentEventId: $id) {
    total
    checkedIn
    pending
    noShow
    checkInRate
  }
}
```

- Variables use the confirmed tournament ID above. HTTP 400 reports:
  `Cannot query field "tournamentCheckInList" on type "Query"` and
  `Cannot query field "checkInStats" on type "Query"`.
- [Resolver](../../../libs/backend/graphql/src/resolvers/event/tournament/tournament-checkin.resolver.ts)
  declares the queries at lines 77 and 105.
- [Tournament resolver exports](../../../libs/backend/graphql/src/resolvers/event/tournament/index.ts)
  export it at line 8.
- [GraphQLModule](../../../libs/backend/graphql/src/graphql.module.ts) omits TournamentCheckInResolver
  from its imports/providers; tournament providers at lines 148-158 include enrollment, not check-in.
- [Checked-in schema](../../../schema.graphql) lacks both Query fields and the CheckInStats type.
- The data-service loader catches all failures and returns empty records/null stats; selectors display zero counts.
  These zeros cannot be used as acceptance evidence. Live query compatibility after registration remains unverified.
- No operational API calls, initialization, permissions/phase changes or server policy changes were performed.
- Initial browser-context request failed with unsupported `Storage.getCookies`; a same-origin browser fetch
  then completed the read-only verification above. No credentials or personal record contents were captured.

## Implementation checklist

- [x] Confirm dependencies, actual mounted consumer and the smallest independently reviewable slice.
- [x] Diagnose the false-empty baseline and persist the precise prerequisite blocker.
- [x] Obtain approval for a bounded API/data prerequisite repair or user-restored functioning API.
- [x] Verify successful real list/statistics reads without operational mutations.
- [x] Preserve behavior and summary localization while simplifying presentation.
- [x] Use native PrimeNG Panel and a readable metric loop.
- [x] Remove only scoped decorative markup; preserve adjacent tab behavior.
- [x] Record utility/style comparison and any newly discovered out-of-scope work.

## Acceptance and verification

- [x] All five metrics preserve values and percentage precision for zero and safe nonzero fixtures.
- [x] Loading/query failures cannot masquerade as verified zero statistics.
- [x] Native Panel has a meaningful translated name and each metric has a readable label/description.
- [x] Utility usage is reduced; zero new palettes, SCSS or equivalent inline/global workarounds.
- [x] Light/dark at 390/1440px fit without information loss or document overflow caused by the summary.
- [x] Summary labels, keyboard/focus impact and sampled text contrast verified.
- [x] Existing relevant Nx lint/build/test tasks pass; exact commands/results recorded.
- [ ] Native error Message text meets 4.5:1 (DR-034 fails at 4.44/4.40:1).
- [ ] Live operational writes and complete pre-existing operational API validation.
- [ ] Dedicated SSR/hydration and exhaustive accessibility verification.
- [x] User visual review or explicit acceptance with disclosed limits.

## Evidence and handoff

### Implementation checks before API restart

- Update after prerequisite approval: native summary Panel, five-metric loop and named loading/error/refresh implemented.
  Existing resolver registered, initialization GraphQL return corrected from object to list, query where typed.
  Service errors propagate, incomplete responses reject explicitly and error-state selectors are safe.
  Summary descriptions completed in Dutch/French; French no-show summary label corrected.
- Focused Nx tests pass: summary 9 tests; resolver 6 tests (all persistence mocked).
  Initial resolver test failed only on floating-point exact equality; tolerant comparison passes.
- `npx nx run-many -t lint build -p frontend-pages-tournament,backend-graphql,backend-translate` passes all 22 tasks.
- `npx nx run api:build:development --output-style=static` passes all 16 tasks.
- Current runtime prerequisite: existing port-5000 process has not reloaded the updated bundle.
  Same-origin read still returns HTTP 400 after the successful API build.
  Request a user API restart rather than killing/replacing the user's development service.
  Actual successful query, refreshed dictionary, generated schema/types and browser acceptance remain pending.
- Above initial blocker/baseline evidence is historical; implementation now exists but runtime validation is incomplete.

### Final verification after API restart

- User selected "API restarted; continue verification". Live minimal reads now return HTTP 200:
  zero list records and `{ total: 0, checkedIn: 0, pending: 0, noShow: 0, checkInRate: 0 }`.
  The actual tab's full query succeeds and renders the five meaningful Dutch metrics/descriptions.
- Runtime introspection verifies initialization output `[TournamentCheckIn!]!`; no initialization mutation is executed.
  The checked-in schema snapshot remains historical, not runtime evidence; startup did not regenerate it.
- Final summary 12-case matrix: English/Dutch/French, light/dark, 390/1440px.
  Every case has five metrics, nonblank descriptions, translated refresh name and no summary/document overflow.
  Native layout has one column at 390px, five at 1440px. Fresh narrow header also fits.
- Four safe read-only interaction cases verify `12 / 4 / 7 / 1 / 33.3%`, named Skeleton loading without zero metrics,
  explicit query-error alert, Enter refresh recovery and focus retained on the stable native action.
  Query-response interceptors were removed; real zero data restored. Observed browser mutations: zero.
- Browser tooling could not complete timer-delayed interceptors reliably. Explicitly holding and fulfilling
  the check-in read produced the final passed loading/recovery checks above; failed attempts are not acceptance.
  A hydration stability warning occurred during the stalled fixture. Dedicated hydration remains unverified.
- Sampled title/value contrast: 19.87:1 light, 16.00:1 dark. Labels/descriptions: 4.87:1 / 6.65:1.
  Native error Message contrast, including translucent background compositing: 4.44:1 / 4.40:1 (failed DR-034).
  Do not add a page-level severity palette or styling exception.
- Before screenshot captures the actual decorative/false-zero baseline.
  After screenshots capture the final real-zero Dutch summary in dark/wide and light/narrow.
  Screenshots contain no player records; browser evidence is summarized here, not only in session storage.
- No dependency, shared theme/component, routes/permissions/phase, operational-handler or live-data changes.
  Enabling the registered resolver exposes its existing mutation surface; permission denial is mock-tested for
  all five actions, but complete operational validation belongs to DR-023c3, not this visual summary.
- Existing control effects read nonreactive FormControl values; assign reactive filter/search repair to DR-023c2.
  Remaining table/feedback styling and blank/mixed-language tab copy belong to DR-023c3/c4.
  Independent `TournamentScheduleData` HTTP 400 remains a DR-024 prerequisite discovery.
- Exceptions/new abstractions: none. Existing smart tab/service separation plus the typed metric loop is sufficient.
- User explicitly approved completion/commit with the remaining limits disclosed; see approval below.
- Exact next action in a fresh invocation: scope DR-023c2 without restarting this summary.
  Parents remain open; no other child is implemented in this invocation and no push is authorized.

## Validation commands

- `npx nx run frontend-pages-tournament:test --testPathPatterns=checkin-tab.component.spec.ts --runInBand`:
  passed 1 suite / 9 tests. Final full suite includes the stable-refresh focus regression.
- `npx nx run backend-graphql:test --testPathPatterns=tournament-checkin.resolver.spec.ts --runInBand --output-style=static`:
  passed 1 suite / 6 tests. Initial exact floating-point expectation failed; tolerant comparison passes.
- `npx nx run-many -t lint build -p frontend-pages-tournament,backend-graphql,backend-translate`:
  passed all 22 tasks, including prerequisites; existing backend lint warnings remain.
- `npx nx run api:build:development --output-style=static`: passed all 16 tasks; webpack compiled successfully.
- `npx nx run-many -t lint build test -p frontend-pages-tournament --output-style=static --runInBand`:
  overall failed because the build executor rejects test-only `runInBand`.
  Its final test subtask passed 18 suites / 264 tests and lint passed.
- `npx nx run-many -t lint build -p frontend-pages-tournament --output-style=static`:
  final corrected command passed, including the final stable-refresh markup.
- Repository Prettier ran on every changed file; `git --no-pager diff --check` passed.
- Post-approval `npx nx run-many --target=lint --output-style=static` passed all 34 workspace projects,
  with existing warnings retained.
- Not run: live operational writes, complete operational API suite, exhaustive accessibility/contrast
  and dedicated SSR/hydration. Full application SSR build is not a hydration substitute.

## Approval

- Date: 2026-11-08.
- User selected "Approve completion and commit with disclosed limits" and "Nothing else".
- Approval covers the summary implementation/tests, bounded API prerequisite, summary locale assets and handoff.
- Accepted limits: failed DR-034 native error Message contrast (4.44/4.40:1), exhaustive accessibility/contrast,
  dedicated SSR/hydration, live operational writes and complete pre-existing operational API validation.
- These criteria remain unchecked; explicit acceptance does not claim they passed.
- DR-023c1 is Done in the authoritative backlog. DR-023c/DR-023 remain open for subsequent children.
- Conventional Commit includes only this approved slice and its handoff; no push.
