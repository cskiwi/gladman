---
title: 'DR-028a: Sync overview section'
description: 'Refresh the queue statistics and recent-jobs section of the /admin Synchronisatie tab with native PrimeNG.'
---

## Identity

- ID: DR-028a (child of DR-028).
- Area and intended outcome: the always-visible overview section of the Synchronisatie tab uses native Cards, a native
  ProgressBar and a responsive statistics grid, without changing queue or job behavior.
- Parent, dependencies, and blockers: DR-028; DR-027a Done; none.
- Design rules: [redesign plan](../README.md).

## Scope

- Mounted consumer: `/admin?tab=1` (`app-sync-dashboard` renders `app-overview-tab`).
- Files: `libs/frontend/pages/sync-admin/src/lib/components/overview-tab/overview-tab.component.{ts,html}`.
- Preserve: action buttons, clear/sync confirmations, job search, table paging, expansion indentation, job details
  dialog, Toast and websocket/queue updates.
- Exclusions: the dashboard heading and tab shell, the ranking / sync-plans / cron-jobs tabs (later children), the
  job details dialog markup, and running any clear, retry or sync action (operational mutations; never run for testing).

## Changes

- Queue statistics and recent jobs use native `p-card` with the `header` input instead of hand-built bordered `div`s with
  an `h3`.
- Removed per-statistic bordered tiles (no nested surfaces); the grid is `grid-cols-2 sm:grid-cols-4` so it fits narrow
  screens.
- Hand-built active-job progress bar replaced with native `p-progressbar`.
- Removed deprecated `responsiveLayout="scroll"` from the table.

## Implementation checklist

- [x] Behavior and translation keys preserved.
- [x] Native PrimeNG options used; no new colors or SCSS.
- [x] Lint passes (`npx nx lint sync-admin`).
- [x] Build passes (`npx nx build sync-admin`).
- [x] Browser: dark 800px and 375px (counts: 2 Cards, no horizontal overflow, scrollWidth 375).

## Acceptance and verification

- [ ] Light mode, active-job progress bar (no active job existed), failed-job retry and details dialog not exercised.
- [ ] Keyboard/contrast, tests (not run).

## Evidence and handoff

- Status: Review. Not committed; awaiting user approval.
- Next: DR-028b ranking tab, then sync plans and cron jobs; the dashboard heading and tab shell stay with DR-028.
