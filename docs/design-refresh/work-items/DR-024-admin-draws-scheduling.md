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
- DR-024a3a filter/actions is the current selected implementation slice; DR-024a1/a2 are approved complete.
- DR-024a1 implementation and focused checks pass; the user approved completion with disclosed limits on 2026-11-09.
- Scheduling's previously observed `TournamentScheduleData` HTTP 400 remains independent and unrepaired.
- No shared component extraction is justified yet: retain smart page/tab/service boundaries.

## Aggregate acceptance

- [ ] Draw-management children are approved complete with recorded verification limits.
- [ ] Scheduling is scoped, implemented and approved separately.
- [ ] Aggregate behavior, accessibility, localization and responsive checks are reconciled.
- [ ] User review and approval are recorded.
