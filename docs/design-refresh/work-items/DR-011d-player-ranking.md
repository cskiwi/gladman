---
title: 'DR-011d: Player ranking editor'
description: 'Bounded children for the mounted ranking history and its independently saved dialog.'
---

## Identity and scope

- ID: DR-011d. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-011](DR-011-player-editing.md). Design rules: [refresh plan](../README.md).
- Mounted consumer: `/players/glenn-latomme/edit`, Ranking tab, confirmed 2026-11-25.
- Source: [ranking component][component], `frontend-pages-player`.
- Keep the existing page/form-child boundary; another smart/presentational wrapper has no repeated consumer.
- Split history/read feedback from the independently saved create/edit/delete dialog.

## Required children

- [DR-011d1: Ranking history and read states](DR-011d1-ranking-history.md): selected first.
- DR-011d2: Ranking dialog, validation and mutation feedback. Scope separately before promotion.

## Reconciliation and handoff

- [x] Confirm a mounted consumer and split into independently reviewable concerns.
- [x] Complete and review history/read states with documented verification limits.
- [ ] Complete and review dialog/mutation states.
- [ ] Reconcile the parent with child evidence and retained verification limits.

The dialog currently uses a fixed inline width, unassociated numeric/date labels and legacy validation copy.
Its mutation lifecycle and localization need separate review; no real ranking mutation is authorized for visual checks.
Do not treat history refresh as verification of dialog saves, deletion or backend permissions.

DR-011d1 is Done after explicit approval: `Approve DR-011d1 with documented limits and commit`.
Ten ranking tests plus eleven editor regressions and player lint/build
pass. The mounted history retains 41 groups/313 rows, with settled light/dark narrow/wide and sampled contrast checks.
Preserve the child's unchecked full visual/accessibility, locale and SSR/hydration criteria.
Next action: commit the approved child, then scope DR-011d2 in a subsequent invocation; keep this parent open.

[component]: ../../../libs/frontend/pages/player/src/pages/edit/components/player-ranking/player-ranking.component.ts
