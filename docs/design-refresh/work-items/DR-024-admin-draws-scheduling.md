---
title: 'DR-024: Tournament draws and scheduling'
description: 'Aggregate scope for independently reviewable draw-management and scheduling work.'
---

## Identity and scope

- ID: DR-024. Status is authoritative in the [backlog](../backlog.md).
- Dependencies: approved DR-023a administration shell.
- Rules: [design refresh](../README.md).
- Route: `/tournament/:tournamentId/admin`; project: `frontend-pages-tournament`.
- Children: [DR-024a draw management](DR-024a-admin-draws.md) and
  [DR-024b scheduling](DR-024b-admin-scheduling.md).
- Keep this parent open until both required children and aggregate acceptance are complete.
- Preserve permissions, phase access, query/mutation contracts, localization and routes.
- Exclude other tabs, global/shared styling and operational testing against real records.

## Evidence and handoff

- Earlier on 2026-11-09 the authorized imported completed tournament exposed Draws and Scheduling.
  This is historical evidence; the fresh prerequisite check below confirms a different current phase.
- Draws has a confirmed visible consumer, not merely an export or hidden panel.
- DR-024a1/a2 and all three DR-024a3 presentation children are approved complete.
  DR-024a3 aggregate evidence is reconciled and explicitly approved on 2026-11-09 with recorded limits retained.
  DR-024a4 is split into seeding, creation and remaining locale children.
  Seeding DR-024a4a is approved Done on 2026-11-09 with disclosed verification limits;
  Creation DR-024a4b is approved Done on 2026-11-09 with accepted contrast/network/operational limits.
  Remaining locales [DR-024a4c](DR-024a4c-draw-locales.md) are approved Done on 2026-11-09 with disclosed limits.
  Focused tests/lint/build and scoped three-locale browser checks pass; recorded verification limits remain.
  DR-024a4 aggregate evidence is reconciled and separately approved on 2026-11-09 with disclosed limits.
  All 127 focused tests and 16 scoped lint/build tasks pass by cache replay; fresh interactions time out
  on the hidden shared browser. Preserve child contrast failures and unperformed checks. Keep this parent open.
- DR-024a1 implementation and focused checks pass; the user approved completion with disclosed limits on 2026-11-09.
- Scheduling's initially observed `TournamentScheduleData` HTTP 400 is recorded by the prerequisite check below;
  the later approved DR-024b1 repair resolves that read-schema blocker.
- No shared component extraction is justified yet: retain smart page/tab/service boundaries.
- DR-024a draw-management aggregate reconciliation is separately approved on 2026-11-09 with disclosed limits.
  All four required children are approved Done and their committed source/evidence is reconciled.
  Combined 127 tests and 16 scoped lint/build tasks pass by cache replay, not fresh execution.
  No application changes or new shared/dumb components are required.
  Fresh mounted Draws DOM confirms Dutch/dark/HE 1 with genuine empty counts and four descriptions.
  Theme-toggle actionability times out while the shared browser is hidden; retain all child contrast failures
  and unperformed aggregate/operational/permission/accessibility/SSR checks.
  User selected "Approve completion and commit with disclosed limits" and "Nothing else".
  Only DR-024a is Done; approval does not imply the unchecked criteria passed or close this parent.
- DR-024b prerequisite check on 2026-11-09: current authorized Draws page has Scheduling disabled
  (`aria-disabled="true"`) and zero mounted `app-schedule-tab` elements.
  A same-origin read returns HTTP 200 with phase `ENROLLMENT_CLOSED`, consistent with the existing access gate.
  A second same-origin read using the exact existing `TournamentScheduleData` operation returns HTTP 400:
  `Query.tournamentSchedule`, `Query.unscheduledGames` and `TournamentEvent.location` are absent,
  each reported as `GRAPHQL_VALIDATION_FAILED`.
  This probe does not establish a mounted Scheduling consumer or a successful empty schedule.
  No application edits, operational writes, phase/permission changes or component extractions are made.
  The shared browser currently reports visible; earlier hidden-browser failures remain historical child evidence.
- The user subsequently approves the bounded [DR-024b1 read/error prerequisite](DR-024b1-schedule-read.md).
  Its 20 focused tests and scoped lint/build pass; corrected source reads return HTTP 200 against the running API.
  No dormant scheduling mutations are registered and no assistant operational/phase/data writes are made.
  The supplied tournament is subsequently observed in `DRAWS_MADE`, and its authorized Scheduling route mounts.
  The phase gate and missing backend read schema are no longer the current blockers.
  After reload the shared browser still emits legacy `location`/`player` reads (HTTP 400) and displays empty success.
  This is stale frontend runtime evidence, not verification of the new read/error UI.
- The user subsequently restarts the frontend; the normally mounted browser emits the corrected read and
  receives HTTP 200 with genuine empty data. The stale-source blocker is resolved.
  Native pending/error fixture DOM is confirmed, but hidden-browser entry animation/actionability limits
  prevent the complete theme/width/keyboard/retry matrix. Synthetic routes are removed and real data restored.
- The user selects "Approve completion and commit with disclosed limits" and "Nothing else" for DR-024b1
  on 2026-11-09. Only that read/error prerequisite is Done; unchecked visual/full-suite/live-data/accessibility/SSR
  criteria remain unchecked. DR-024b and this parent remain open.
  DR-024b2 summary/count labels are subsequently implemented and explicitly approved with disclosed limits.
  All 15 focused tests and scoped lint/build pass; four Dutch theme/width browser checks and summary contrast pass.
  User approval and disclosed full-suite/browser/accessibility/SSR limits are recorded in the
  [summary brief](DR-024b2-schedule-summary.md). Only the summary presentation changes.
  Only DR-024b2 is Done; all unperformed checks remain unchecked.
  Exact next action: commit the approved summary/handoff; scope DR-024b3 filters/actions in a fresh invocation.
  Keep both Scheduling and this parent open. Do not bypass gates or restart approved Draws work.

## Aggregate acceptance

- [x] Draw-management children are approved complete with recorded verification limits.
- [ ] Scheduling is scoped, implemented and approved separately.
- [ ] Aggregate behavior, accessibility, localization and responsive checks are reconciled.
- [ ] User review and approval are recorded.
