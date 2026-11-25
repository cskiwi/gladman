---
title: 'DR-009: Player head-to-head'
description: 'Bounded rollout for the mounted player comparison route.'
---

## Identity and scope

- ID: DR-009. Status: see the [backlog](../backlog.md).
- Route: `/players/:playerId/head-to-head`, mounted by
  [player routes](../../../libs/frontend/pages/player/src/lib.routes.ts).
- Project: `frontend-pages-player`. Dependencies: approved DR-008 and shared page-header/breadcrumb work.
- Consumer confirmed on 2026-11-25 at `/players/glenn-latomme/head-to-head`: hydrated page, filters and populated grid.
- Preserve player identity, reactive filters, partner/opponent calculations, sorting, totals, translations and routes.
- Exclude player detail, ranking, editing, global theme and shared components.

## Children

- [DR-009a](DR-009a-head-to-head-filters.md): native filter panel, semantic groups, fluid controls and accessible
  filter names. Done after explicit approval on 2026-11-25, retaining the child's documented verification limits.
- [DR-009b](DR-009b-head-to-head-guidance.md): page guidance and loading/error presentation is approved Done.
  Native title/dismissal and page feedback implemented; service failure reads/messages guarded.
  Eight focused tests and player lint/build pass; explicit approval on 2026-11-25 retains documented limits.
- DR-009c: matchup grid presentation and states. Scope separately; existing gray palette classes remain here.

## Evidence and handoff

- Clean worktree on existing `main` at invocation start; no worktree/branch creation or commits.
- Baseline dark 1288x1272 screenshot inspected: four palette-colored filter groups; missing filter toggle and guidance
  header/dismiss button, caused by legacy `pTemplate="header"` markup. Native grid renders fifteen partner rows.
- Existing page/container plus `HeadToHeadGridComponent` already separates data orchestration from grid presentation.
  The filter has one real consumer; another smart/presentational split would not provide genuine reuse.
- Do not close this parent until all required children and review are complete.
- Out-of-slice findings to reconcile when scoping children: hard-coded guidance close name and one-time translated
  option labels. Native no-match/status copy is English beside Dutch field labels; investigate shared PrimeNG
  locale feedback separately. Do not silently expand DR-009a into a data-layer or shared-configuration rewrite.
- DR-009a's checks and remaining review limits are recorded in its brief; do not generalize them to the whole route.
- DR-009b's fresh four guidance/eight page-state theme/width cases and keyboard/persistence checks are recorded
  in its brief; do not generalize them to grid internals or the whole route.
- Exact next candidate: scope DR-009c grid/states in the next invocation; keep this parent open.
