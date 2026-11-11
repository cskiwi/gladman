---
title: 'DR-024b: Tournament Scheduling'
description: 'Scheduling prerequisites, independently reviewable presentation children and remaining acceptance.'
---

## Identity

- ID: DR-024b. Status is authoritative in the [backlog](../backlog.md).
- Parent: [DR-024 tournament draws and scheduling](DR-024-admin-draws-scheduling.md).
- Dependencies: approved DR-023a administration chrome and the separately approved
  [DR-024b1 read/error prerequisite](DR-024b1-schedule-read.md).
- Rules: [design refresh](../README.md).
- This parent retains the historical prerequisite check and tracks bounded children, not a whole-tab redesign.
- Required children: approved [DR-024b1 reads/errors](DR-024b1-schedule-read.md),
  [DR-024b2 summary](DR-024b2-schedule-summary.md),
  [DR-024b3 filters/actions](DR-024b3-schedule-controls.md), then separately scoped grid/game panel
  and operational dialogs. Keep this parent open until its required work and aggregate review are complete.

## Scope and intended outcome

- Route: `/tournament/:tournamentId/admin?tab=schedule`; project: `frontend-pages-tournament`.
- Intended next outcome: scope the bounded grid/game-panel child on the established mounted consumer.
  The read/error prerequisite, summary and controls are approved; grid/game panel and dialogs remain unstarted.
- Supplied tournament: `759e0526-8440-4108-bba3-55a7d8b94e72`.
- Initial actual consumer: authorized admin Draws tab, not Scheduling.
  The later read-repair check below confirms the now-enabled mounted Scheduling consumer.
- Source: [admin access and phase gate][admin], [guarded tab mounting][template],
  [Scheduling read and error handling][service], [existing Scheduling resolver][resolver].
- Preserve phase/permission access, routes, scheduling data, dates, court selection, translations and safeguards.
- Exclude completed Draws work, other tabs, shared/global styling, dependencies and operational mutations.
- No phase/permission changes, forced mounting or new consumers solely for visual verification.
- Backend/schema repair was not authorized by the initial check; the user subsequently approved the bounded
  DR-024b1 read/error prerequisite, not whole-tab presentation or dormant operational API activation.

## Verified blockers and baseline

On 2026-11-09 the supplied shared page remains at
`/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=draws`.

1. The DOM reports Planning with `aria-disabled="true"` and zero `app-schedule-tab` elements.
   The page reports `document.visibilityState === "visible"`.
2. Read-only same-origin `POST /graphql`, operation `DesignRefreshScheduleAccess`, returns HTTP 200:

   ```graphql
   query DesignRefreshScheduleAccess($tournamentEventId: ID!) {
     tournamentEvent(id: $tournamentEventId) {
       id
       phase
     }
   }
   ```

   Variables use the supplied tournament ID. The returned phase is `ENROLLMENT_CLOSED`.
   The existing gate permits only `DRAWS_MADE`, `SCHEDULED`, `IN_PROGRESS` and `COMPLETED`.
   No permitted mounted Scheduling consumer is established.

3. A second same-origin read reproduces the exact existing `TournamentScheduleData` operation in
   [the service][service], with that ID and no date filter. It returns HTTP 400, not a successful empty dataset.
   All three diagnostics have code `GRAPHQL_VALIDATION_FAILED`:
   - `Cannot query field "tournamentSchedule" on type "Query".`
   - `Cannot query field "unscheduledGames" on type "Query".`
   - `Cannot query field "location" on type "TournamentEvent".`
4. The source loader currently catches read failures and returns empty arrays. Its repair must preserve
   diagnostics and expose explicit error/retry feedback rather than interpreting schema failures as empty data.
   No repair is attempted here.

The browser probes use existing same-origin reads only, without retrieving or exposing credentials.
No operational write, navigation, fixture, theme/viewport change or UI gate override is performed.

## Proposed approach after unblocking

- Confirm a naturally eligible authorized tournament and mount Scheduling through its normal tab.
- Agree on the independent read-API prerequisite, including all three schema failures; do not assume that
  registering an existing resolver alone resolves the missing `TournamentEvent.location` contract.
- Scope the smallest read/error prerequisite and its focused tests before refreshing presentation.
- Split summary, filters/grid and operational dialogs into independently reviewable children if needed.
- Keep the smart tab/service boundary. Assess presentational extraction only after confirming genuinely
  repeated structure among real consumers; do not introduce a wrapper merely to relocate utilities.
- Use native styled PrimeNG, semantic utilities and existing patterns. No styling exception is proposed.
- Capture theme/width/interaction baselines and utility/style counts on the selected mounted child,
  not on a disabled or forced-mounted tab.

## Prerequisite checklist

- [x] Reconcile the backlog, parent brief, current DOM and phase-gate source.
- [x] Recheck the historical HTTP 400 with the exact existing read operation and record current diagnostics.
- [x] Preserve phase, permissions, approved Draws work and the supplied browser state.
- [x] Record blockers and exact next action in the parent and backlog.
- [x] Observe the supplied authorized tournament in a naturally permitted phase (`DRAWS_MADE`) on a later read.
- [x] Confirm its normally mounted Scheduling consumer without assistant phase/permission/data changes.
- [x] Agree on the independent read-API repair scope and select DR-024b1 as the one prerequisite child.

## Acceptance and verification still required

- [x] The actual Scheduling read succeeds against the running API with correct court/slot/game data (DR-024b1).
- [x] Query failure is explicit and retryable; failed reads do not appear as successful empty datasets (DR-024b1 focused tests).
- [x] Relevant date/filter/refetch behavior and loading/empty/error states have focused regression coverage (DR-024b1/b3).
- [x] Scope one presentation child with concrete light/dark, narrow/wide and interaction acceptance checks.
- [ ] Native PrimeNG, semantic colors and no-new-styling rules are verified on that implementation.
- [ ] Keyboard, focus, labels, contrast, localization and applicable SSR/hydration behavior are checked.
- [ ] Relevant existing Nx lint/build/test tasks pass for any eventual application changes.
- [ ] User review is recorded before completion.

## Evidence and handoff

- Passed: current DOM gate/unmounted check and phase read (HTTP 200), consistent with source.
- Failed: exact existing Scheduling data read (HTTP 400) for the three schema fields listed above.
- Documentation validation:
  - `npx prettier --write` with the three changed Markdown paths passes.
  - `git diff --check` passes; Git warns about configured future CRLF conversion, but all three files
    are verified to contain LF only.
  - Focused Node assertions pass for all seven brief links, both incoming child links and both Blocked rows.
    An initial broad Markdown-link matcher misread existing checkbox prose as a link; the focused check
    avoids that false positive and validates the changed handoff.
- Not run: mounted Scheduling visuals, light/dark, width, keyboard, overlays, operational interactions,
  application lint/build/tests and SSR/hydration. This documentation-only check is not visual acceptance.
- Changed scope: this brief, backlog current focus/status/area evidence and parent handoff only.
- Utility/style comparison: no application templates or styles change; no reduction or visual pass is claimed.
- Reusable-pattern decisions: retain smart tab/service boundaries; defer extraction until real reuse is confirmed.
- Exceptions: none. Prior approved Draws verification limits remain unchanged.
- No commit or push is made without approval of this handoff.
- After this check, the user permitted modifying/adding dummy data to fill the supplied tournament.
  No such writes have been performed. Prefer synthetic identities rather than copying real player records.
- The user subsequently selected "Approve Scheduling read-API and error-handling repair".
  [DR-024b1](DR-024b1-schedule-read.md) implements that bounded prerequisite and records focused verification.
  Initially the frontend browser still serves old query/UI after reload; the user's subsequent restart resolves this.
  Current API and normally mounted browser reads now pass with the corrected operation.
  The later route is authorized and mounted in `DRAWS_MADE`; do not keep treating the initial gate as current.
- Client-only fixture checks confirm native pending/error DOM but cannot complete visual/keyboard/retry acceptance
  while the shared browser is hidden and Message's entry animation remains unfinished.
  All fixture routes are removed and real empty reads, Dutch/dark/1355x1249/Scheduling are restored.
- The user explicitly approves DR-024b1 completion and commit with disclosed limits on 2026-11-09.
  That child is Done; unperformed checks remain unchecked and this parent is not complete.
- DR-024b2 summary/count labels are implemented and explicitly approved with disclosed limits.
  The confirmed authorized consumer now uses a native Panel/definition list with six localized labels/descriptions.
  All 15 focused tests pass; scoped lint/build pass 12 tasks with six cache replays.
  Four Dutch light/dark/390/1440px browser cases preserve labels, counts and containment without overflow.
  Summary text contrast passes at 4.87:1 light and 6.65:1 dark; no new tab stops or styling layer.
  Original Dutch/dark/1355x1249/Scheduling is restored, with no operational browser writes.
  The summary child retains all unperformed suite/browser/accessibility/SSR checks unchecked.
  User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
  Only DR-024b2 is Done; approval neither verifies the unperformed checks nor closes this parent.
- DR-024b3 filters/actions now uses a native Toolbar, localized names/expansion, associated date label
  and native date templates; the user approves completion and commit with disclosed limits on 2026-11-10.
  All 20 focused tests pass fresh; scoped lint/build pass 12 tasks with ten cache replays.
  Four Dutch theme/width cases and enabled contrast pass; safe date selection/refresh/Delete clear passes.
  Complete keyboard-only selection, exhaustive accessibility, locale browser/full-suite/live-operation/SSR checks
  remain unverified. Inherited date-option narrowing/read-remount focus is recorded separately as DR-054.
  Original Dutch/dark/1355x1249/Scheduling and genuine empty reads are restored, without operational writes.
- Approval leaves the controls child's unperformed criteria unchecked and this parent open.
- Exact next action in a fresh invocation: scope DR-024b4 grid/game panel on its real mounted consumer.
  Commit only the approved controls/tests/handoff without pushing; do not begin another child here.
  Remaining grid/game panel/dialog/localization/operational and aggregate acceptance stays open.

[admin]: ../../../libs/frontend/pages/tournament/src/pages/admin/page-admin.component.ts
[template]: ../../../libs/frontend/pages/tournament/src/pages/admin/page-admin.component.html
[service]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/schedule/schedule-tab.service.ts
[resolver]: ../../../libs/backend/graphql/src/resolvers/event/tournament/tournament-schedule.resolver.ts

## Aggregate reconciliation (2026-11-11)

All required children are Done by explicit approval: b1 reads/errors, b2 summary, b3 controls, b4 grid/game panel,
b5 Generate/Auto-schedule dialogs and b6 confirmations/localized game names. Presentation uses native Toolbar, Panel,
Card, Table, Tag, Dialog and ConfirmDialog with presentational `app-schedule-slot` and `app-schedule-game-card`
children; the smart tab and service keep drag-and-drop, mutations and read state. No styling exception was recorded.

Disclosed limits accepted on approval (unchecked items stay unperformed):

- [ ] Native PrimeNG/semantic-color rules were verified per child, not as one end-to-end pass on the final tab.
- [ ] Keyboard/focus, contrast, SSR/hydration and full workflow checks remain unperformed in several children
      (see their briefs for exact limits, including drag-and-drop, delete dialog and light/wide checks).
- [ ] Slot generation and auto-scheduling are not exposed by the API (`TournamentScheduleReadResolver` registers
      reads only), so the Generate and Auto-schedule submits cannot work live. This is a functional/backend
      activation, outside design refresh until separately authorized; it is a candidate, not started.
- [x] Aggregate user review and explicit completion approval with the disclosed limits (`Approve and commit`, 2026-11-11).

No application code changed in this reconciliation.

The user approved completion and commit on 2026-11-11. Unchecked items above are not claimed as verified.
