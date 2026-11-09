---
title: 'DR-024a: Draw management'
description: 'Draw-management aggregate and bounded child sequence.'
---

## Identity and scope

- ID: DR-024a. Parent: [DR-024](DR-024-admin-draws-scheduling.md).
- Status: [backlog](../backlog.md). Rules: [design refresh](../README.md).
- Consumer: `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=draws`,
  authorized Draws/Loting panel on 2026-11-09; real phase COMPLETED.
- Source: `libs/frontend/pages/tournament/src/pages/admin/tabs/draws/`.
- Existing smart tab/service owns selection, reads, entry operations and two dialogs.
- Preserve the shared administration Card/tab shell; use native Panels for future inner groups.

## Child sequence

1. [DR-024a1](DR-024a1-draw-read.md): reactive selection and honest read feedback prerequisite.
   Approved complete on 2026-11-09 with its disclosed verification limits retained.
2. [DR-024a2](DR-024a2-draw-summary.md): four-count summary approved complete on 2026-11-09
   with its disclosed verification limits retained.
3. [DR-024a3](DR-024a3-draw-presentation.md): filter/actions, unassigned assignment and draw-list children.
   All three presentation children are approved Done and committed. Aggregate reconciliation is complete;
   user approved aggregate completion on 2026-11-09 with child verification limits retained.
4. [DR-024a4](DR-024a4-draw-dialogs-locales.md): split into seeding dialog, creation dialog and
   remaining mounted locale completeness. Seeding child DR-024a4a is approved Done on 2026-11-09;
   preserve its shared contrast failures and unperformed checks. Other children are not started.

## Baseline and exclusions

- The four decorative counters are replaced by DR-024a2's native Panel/semantic summary.
  DR-024a1 already replaced the loading bar. DR-024a3's children replace the legacy filter/list surfaces
  with native Panels/Tables and scoped translations. Dialog styling and remaining locale gaps stay DR-024a4.
- Do not claim a visual refresh from the prerequisite repair or silently include those presentation changes.
- Keep existing smart orchestration. Extract dumb components only for meaningful confirmed repeated consumers,
  not to conceal utility markup or wrap PrimeNG one-to-one.
- No changes to scheduling, other tabs, global theme, shared components, dependencies or operational records.

## Aggregate acceptance

- [ ] Required child implementation and focused validation are complete.
- [ ] Light/dark, narrow/wide, locale, keyboard, overlays and contrast are verified.
- [ ] Mutation/confirmation contracts, permissions and SSR/hydration are verified or disclosed as limits.
- [ ] Aggregate review and user approval are recorded.
