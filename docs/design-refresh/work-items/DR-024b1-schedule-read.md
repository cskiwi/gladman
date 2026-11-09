---
title: 'DR-024b1: Scheduling read and error prerequisite'
description: 'Bounded approved repair of consumed Scheduling reads and explicit retryable read failures.'
---

## Identity and scope

- ID: DR-024b1. Status is authoritative in the [backlog](../backlog.md).
- Parent: [DR-024b Scheduling](DR-024b-admin-scheduling.md).
- Rules: [design refresh](../README.md).
- On 2026-11-09 the user explicitly selected "Approve Scheduling read-API and error-handling repair".
  This authorizes implementation scope, not completion or a commit before verification/review.
- Route: `/tournament/:tournamentId/admin?tab=schedule`.
- Projects: `frontend-pages-tournament`, `backend-graphql`.
- Intended outcome: consumed schedule/unscheduled-game/court reads match the domain model and running schema;
  failed or malformed reads produce explicit retryable feedback instead of successful empty arrays.
- Preserve tournament/date scoping, ordering, abort/refresh behavior, game/player identity and genuine empty data.
- Exclude presentation refresh, dormant operational API registration, dummy-data setup, phase/permission changes,
  other tabs, shared/global styling and dependencies.
- The route was initially phase-gated. A later API read confirms `DRAWS_MADE` and the authorized route mounts;
  no assistant phase/permission/data writes are performed.

## Approach

- Keep smart tab/service boundaries; no reusable presentational extraction is justified for a read repair.
- Register a narrowly scoped read resolver rather than activating the dormant combined mutation resolver.
- Resolve courts through real tournament/location memberships, not an invented singular tournament location.
- Keep all mutations unregistered/unchanged; expose only consumed reads and their necessary relation fields.
- Follow the existing Draws resource pattern: validate payloads, propagate diagnostics, use `hasValue()` guards.
- Add native loading/error/retry feedback without restyling the Scheduling layout.

## Implementation and acceptance

- [x] Restore consumed read queries without registering dormant operational mutations.
- [x] Read courts from active tournament location memberships, including multiple venues without duplicates.
- [x] Preserve schedule/date/court scoping, ordering, related game identities and unscheduled-game filtering.
- [x] Verify explicit server/transport/malformed-payload failures and read-only retry in focused component tests.
- [x] Verify summaries/grids and operational controls are hidden during loading/error in focused component tests.
- [x] Verify genuine empty reads, populated reads, date changes, retry and stale-result handling with focused tests.
- [x] Run focused Nx tests and relevant lint/build checks.
- [x] Verify the actual read operation against the running API after port 5000 is ready.
- [ ] Complete the current-code browser visual/keyboard/contrast/retry matrix when rendering is available.
- [x] Record user review and explicit completion approval with disclosed limits.

## Evidence and handoff

- Initial access/schema evidence is recorded in the [parent brief](DR-024b-admin-scheduling.md).
- Implementation:
  - [Read resolver][reads] provides consumed slot/game/court reads and necessary slot relations.
    Existing read methods are moved from the dormant [combined resolver][legacy], which inherits them.
    Only the read class is registered in the [GraphQL module][module]; operational mutations remain unexposed.
  - [Service][service] replaces the nonexistent singular location with `tournamentScheduleCourts`,
    reads the actual `gamePlayer` relation rather than the scalar `player`, validates all three arrays,
    propagates diagnostics and guards resource selectors with `hasValue()`.
  - [Template][template] uses native ProgressBar and Message plus an existing localized Refresh button for retry.
    Loading/error states hide misleading empty success and operational controls; success layout is not redesigned.
  - [Backend tests][backend-tests] and [component tests][frontend-tests] use synthetic data and mocked persistence.
- Static class/styleClass tokens: 742 before, 739 after. One inline loading style is removed; zero added.
  Existing success-layout palette classes/styles remain deliberately unmigrated; no new palette or styling layer.
- Commands and results on 2026-11-09:
  - `npx nx run-many -t test -p frontend-pages-tournament,backend-graphql --testPathPatterns=schedule --runInBand`
    passes 20 tests: nine backend and eleven frontend. Both executed freshly after the first fixes;
    the final rerun executes frontend and replays backend cache.
  - `npx nx run-many -t lint build -p frontend-pages-tournament,backend-graphql --output-style=static`
    passes all 19 tasks; final run replays 17 and executes two. Existing warnings remain, with zero lint errors.
  - `npx nx run api:build:development --output-style=static` passes all 16 tasks by cache replay.
  - Initial checks caught the case-sensitive ProgressBar selector and a removed import still used by legacy
    mutations; both are corrected. The first actual API probe caught the scalar `player` selection;
    the query now uses the real `gamePlayer` relation and its assertion is updated.
  - An attempted combined regex test selector containing pipes failed in Windows command-shell parsing
    before tests ran. The working selector above is used; no admin/check-in regression pass is claimed.
- Live read verification:
  - Waited for the actual GraphQL endpoint on port 5000, not an assumed HTTP 200 at its root.
  - Exact first `gql` operation extracted from the source service returns HTTP 200 without GraphQL errors
    for both no date filter and `2026-11-09T00:00:00.000Z`, with genuine slot/court/unscheduled-game counts 0/0/0.
  - Runtime introspection confirms the three read fields and no exposed checked dormant scheduling mutations.
  - A read-only eligible-tournament lookup returns the supplied tournament in `DRAWS_MADE`.
    No assistant data write or phase change produced that state.
- Browser verification and initial runtime blocker:
  - Confirmed the real authorized Scheduling route mounts through its existing phase gate.
  - The shared browser initially retained a stale compilation overlay. After checking zero dirty form controls
    and reloading, normal tab clicks still time out while the shared browser reports hidden.
    Direct navigation to the now-permitted route mounts it without overriding access.
  - Observed the actual browser `TournamentScheduleData` request after reload: it still contains legacy
    `location` and scalar `player` selections, lacks both `tournamentScheduleCourts` and `gamePlayer`,
    returns HTTP 400, and the mounted old UI hides the failure as empty success.
    This proves stale served frontend code; it is not evidence that the new source error handling failed or passed.
  - A separate clean verification tab is unauthenticated and denied access; no credentials are copied or bypassed.
  - Fresh light/dark, narrow/wide, screenshot, keyboard/focus, contrast, pending/error/retry and populated
    real-data browser acceptance remain unverified. Full suites, app build, live operations and SSR/hydration
    are not run. No operational browser writes are performed.
- Subsequent restart verification:
  - The user selects "I have restarted the frontend; continue verification".
  - Reloaded authorized Scheduling request now uses `tournamentScheduleCourts` and `gamePlayer`, no legacy location,
    and receives HTTP 200 without GraphQL errors. One normal Scheduling component is mounted.
    Dutch/dark/1355x1249 is confirmed, with genuine empty slot/court/game data and no read error.
  - A client-only delayed read at dark/1440px confirms native ProgressBar/busy DOM, zero buttons/selectors,
    no grid and no document overflow. No operational control is exposed while pending.
  - An HTTP 400 read fixture reaches explicit native Message (`Response not successful: Received status code 400`)
    and a localized Refresh button instead of empty success. This is DOM evidence, not a completed visual pass.
  - Attempts at a four-case theme/width and schema/transport/malformed/populated/retry browser matrix do not
    complete. The page reports hidden; Message stays `p-message-enter-active`, so visible waits and keyboard
    actionability time out. Do not count the attempted matrix or a browser retry as passed.
  - One harness cleanup initially encounters `page.viewportSize() === null`; the known original dimensions are
    explicitly restored. All fixtures/routes are subsequently removed and genuine HTTP 200 counts 0/0/0 restored.
    Final browser state is Dutch/dark/1355x1249 on Scheduling, without a dialog or persisted synthetic record.
  - Hidden entry-animation/actionability limits remain; light/dark/narrow/wide, screenshots, contrast,
    keyboard/focus, malformed/populated real data and full browser retry acceptance are not newly verified.
    The implementation's complete retry/filter/stale-result coverage remains attributed to the 20 focused tests.
- The user selects "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
  DR-024b1 is Done by that explicit approval, not by claiming unperformed checks passed.
  Accepted limits: full browser theme/width/keyboard/contrast/retry, populated real-data workflows,
  full suites, app build and SSR/hydration remain unverified. Retain the unchecked criteria above.
  Existing native contrast follow-ups DR-033/DR-034 remain separate and unresolved.
  Approval authorizes only this read/error repair, focused tests and repository handoff; no workflow changes or push.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects with existing warnings
  and zero errors; 30 tasks replay cache and four execute. No fresh full-workspace lint execution is claimed.
- Keep DR-024b and DR-024 open; do not start summary/filter/grid/dialog presentation children here.
- Next candidate after approval: scope DR-024b2 summary and mounted missing count labels in a fresh invocation.
- No shared component extraction, new styling exception, dependency, dummy data or push.

[reads]: ../../../libs/backend/graphql/src/resolvers/event/tournament/tournament-schedule-read.resolver.ts
[legacy]: ../../../libs/backend/graphql/src/resolvers/event/tournament/tournament-schedule.resolver.ts
[module]: ../../../libs/backend/graphql/src/graphql.module.ts
[service]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/schedule/schedule-tab.service.ts
[template]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/schedule/schedule-tab.component.html
[backend-tests]: ../../../libs/backend/graphql/src/resolvers/event/tournament/tournament-schedule-read.resolver.spec.ts
[frontend-tests]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/schedule/schedule-tab.component.spec.ts
