---
title: 'DR-028c: Sync plans tab'
description: 'Place the filters and hierarchy table of the /admin Synchronisatie sync-plans tab in native Cards.'
---

## Identity

- ID: DR-028c (child of DR-028).
- Area and intended outcome: the Sync Plannen tab uses native Cards like the overview and ranking tabs.
- Parent, dependencies, and blockers: DR-028; DR-028a and DR-028b Done; none.
- Design rules: [redesign plan](../README.md).

## Scope

- Mounted consumer: `/admin?tab=1`, Sync Plannen tab (`app-sync-plans-tab`).
- Files: `libs/frontend/pages/sync-admin/src/lib/components/sync-plans-tab/sync-plans-tab.component.{ts,html}`.
- Preserve: filters, selection, hierarchy table, ranking-sync dialog, Toast, confirm dialog.
- Exclusions: scheduling and ranking sync actions were not run (operational mutations); cron-jobs tab (DR-028d).

## Changes

- Filter and action rows share one native `p-card`; the hierarchy table sits in a second `p-card` (`CardModule`).
- Action row and its button group use `flex-wrap` so buttons no longer clip at 375px.
- Formatted with Prettier (re-indented template).

## Implementation checklist

- [x] Behavior preserved (markup wrapping only).
- [x] Lint and build pass (`npx nx run-many -t lint,build -p sync-admin`).
- [x] Browser: dark 375px and 1024px (two Cards, no horizontal page overflow, buttons inside the Card).

## Acceptance and verification

- [ ] Light mode, dialog, empty/loading states, keyboard/contrast and tests not verified.

## Evidence and handoff

- Status: Done with explicit approval (`commit`, 2026-11-11) and the disclosed limits above, which stay unchecked.
- Next: DR-028d cron jobs tab.
