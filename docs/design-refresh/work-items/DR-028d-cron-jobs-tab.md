---
title: 'DR-028d: Cron jobs tab'
description: 'Place the cron jobs table of the /admin Synchronisatie tab in a native Card.'
---

## Identity

- ID: DR-028d (child of DR-028).
- Area and intended outcome: the Cron Jobs tab uses a native Card like the overview, ranking and plans tabs.
- Parent, dependencies, and blockers: DR-028; DR-028a to DR-028c Done; none.
- Design rules: [redesign plan](../README.md).

## Scope

- Mounted consumer: `/admin?tab=1`, Cron Jobs tab (`app-cron-jobs-tab`).
- Files: `libs/frontend/pages/sync-admin/src/lib/components/cron-jobs-tab/cron-jobs-tab.component.{ts,html}`.
- Preserve: refresh, trigger, edit schedule, enable/disable, scrape-year dialog, Toast.
- Exclusions: no job was triggered, edited or toggled (operational mutations).

## Changes

- Refresh button and table share one native `p-card` (`CardModule`).
- Cron expressions use `whitespace-nowrap` so they no longer wrap mid-expression.
- Formatted with Prettier.

## Implementation checklist

- [x] Behavior preserved (markup wrapping only).
- [x] Lint and build pass (`npx nx run-many -t lint,build -p sync-admin`).
- [x] Browser: dark wide (Card, table, actions aligned).

## Acceptance and verification

- [ ] Light mode, 375px, dialogs, loading/empty states, keyboard/contrast and tests not verified.
- [ ] `whitespace-nowrap` change was made after the browser check and is not re-checked visually.

## Evidence and handoff

- Status: Done with explicit approval (`commit`, 2026-11-11) and the disclosed limits above, which stay unchecked.
- Next: DR-028 parent reconcile (all four children done once approved), then DR-027/DR-021 reconcile.
