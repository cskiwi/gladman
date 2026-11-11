---
title: 'DR-028b: Sync ranking systems tab'
description: 'Place the ranking systems table of the /admin Synchronisatie tab in a native Card.'
---

## Identity

- ID: DR-028b (child of DR-028).
- Area and intended outcome: the Ranking Systems tab table sits on a native Card like the overview section above it.
- Parent, dependencies, and blockers: DR-028; DR-028a Done (committed); none.
- Design rules: [redesign plan](../README.md).

## Scope

- Mounted consumer: `/admin?tab=1`, Ranking Systems tab (`app-ranking-tab` renders `app-ranking-systems-overview`).
- Files: `libs/frontend/pages/sync-admin/src/lib/components/ranking-systems/ranking-systems-overview.component.{ts,html}`.
- Preserve: table columns, status tags, calculate / sync dialogs, Toast, loading skeletons.
- Exclusions: calculate and sync actions were not run (operational mutations); hard-coded English strings stay
  (translation work deferred); tab shell, sync-plans and cron-jobs tabs (later children).

## Changes

- Tab panels use `px-0!` so the statistics, jobs and ranking cards share one width (files: `dashboard/sync-dashboard.component.html`). Sync plans and cron jobs tabs also lose side padding; not checked.
- Table wrapped in a native `p-card` (`CardModule` imported); no new classes, colors or SCSS.
- Formatted with Prettier, which re-indented the template.

## Implementation checklist

- [x] Behavior preserved.
- [x] Lint and build pass (`npx nx run-many -t lint,build -p sync-admin`).
- [x] Browser: dark wide and 375px (one Card, no horizontal page overflow).

## Acceptance and verification

- [ ] Light mode, dialogs, loading and empty states, keyboard/contrast, tests not verified.

## Evidence and handoff

- Status: Done with explicit approval (`commit`, 2026-11-11) and the disclosed limits above, which stay unchecked.
- Next: DR-028c sync plans tab, then DR-028d cron jobs.
