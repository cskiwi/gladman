---
title: 'DR-007: Shared form controls and sync feedback'
description: 'Bounded shared-control slices and their mounted consumers.'
---

## Identity and scope

- ID: DR-007. Authoritative status: [backlog](../backlog.md).
- Rules: [design refresh](../README.md). No global theme changes are implied.
- Country/state integration is already approved in [DR-018b1](DR-018b1-country-state-selectors.md).
  Preserve that completed implementation and its accepted verification limits; do not restart it.
- Mounted competition and tournament detail pages consume shared sync indicators and action controls.
- First child: [DR-007a](DR-007a-sync-status-presentation.md), compact semantic sync-status presentation.
- Sync action menus/dialogs remain separate. Existing unnamed dropdown discovery stays under DR-065.
- Club search contains service logic, not a visual component to refresh.

## Acceptance and handoff

- [x] Reconcile country/state work against its existing approved brief.
- [x] Confirm a current sync-indicator consumer and scope one implementation child.
- [x] Complete and obtain review for DR-007a, approved 2026-11-23 with its documented limits.
- [ ] Reconcile remaining sync action/dialog work and DR-065 before closing this parent.

DR-007 remains open until its required children and follow-ups are resolved.
Next action: scope one mounted sync action/dialog slice against the existing DR-065 dropdown-label discovery.
DR-007a is approved Done; preserve its unchecked verification limits and scoped zero-gap layout exception.
