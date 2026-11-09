---
title: 'DR-024: Tournament draws and scheduling'
description: 'Aggregate scope for independently reviewable draw-management and scheduling work.'
---

## Identity and scope

- ID: DR-024. Status is authoritative in the [backlog](../backlog.md).
- Dependencies: approved DR-023a administration shell.
- Rules: [design refresh](../README.md).
- Route: `/tournament/:tournamentId/admin`; project: `frontend-pages-tournament`.
- Children: [DR-024a draw management](DR-024a-admin-draws.md) and DR-024b scheduling.
- Keep this parent open until both required children and aggregate acceptance are complete.
- Preserve permissions, phase access, query/mutation contracts, localization and routes.
- Exclude other tabs, global/shared styling and operational testing against real records.

## Evidence and handoff

- On 2026-11-09 the authorized imported completed tournament exposes Draws and Scheduling.
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
- Scheduling's previously observed `TournamentScheduleData` HTTP 400 remains independent and unrepaired.
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
- Current snapshot shows Scheduling and Check-in disabled. The earlier enabled-tab observation and Scheduling
  HTTP 400 are historical evidence, not verified current access or a fresh network result.
  Once DR-024a review is approved, confirm an actually permitted Scheduling consumer and its read-schema prerequisite
  before scoping DR-024b. Do not enable gated tabs or mutate phase/permissions for redesign verification.
- Exact next action in a fresh invocation is DR-024b consumer/prerequisite scoping;
  keep DR-024 open and do not begin scheduling in this invocation.

## Aggregate acceptance

- [x] Draw-management children are approved complete with recorded verification limits.
- [ ] Scheduling is scoped, implemented and approved separately.
- [ ] Aggregate behavior, accessibility, localization and responsive checks are reconciled.
- [ ] User review and approval are recorded.
