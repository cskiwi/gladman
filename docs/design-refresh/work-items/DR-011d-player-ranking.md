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
- [DR-011d2: Ranking dialog, validation and mutation feedback](DR-011d2-ranking-dialog.md): approved 2026-11-27.

## Reconciliation and handoff

- [x] Confirm a mounted consumer and split into independently reviewable concerns.
- [x] Complete and review history/read states with documented verification limits.
- [x] Complete and review dialog/mutation states with documented verification limits.
- [ ] Reconcile the parent with child evidence and retained verification limits.

DR-011d2 baseline confirms fixed inline width, unassociated numeric/date labels, legacy validation copy
and a non-rendering legacy footer. Its mutation lifecycle and localization need separate review;
no real ranking mutation is authorized for visual checks.
Do not treat history refresh as verification of dialog saves, deletion or backend permissions.

DR-011d1 is Done after explicit approval: `Approve DR-011d1 with documented limits and commit`.
Ten ranking tests plus eleven editor regressions and player lint/build
pass. The mounted history retains 41 groups/313 rows, with settled light/dark narrow/wide and sampled contrast checks.
Preserve the child's unchecked full visual/accessibility, locale and SSR/hydration criteria.
DR-011d1's approved implementation is present in the clean worktree.
DR-011d2 now provides the responsive native dialog, associated fields/validation and confirmed mutation lifecycle.
39 ranking/editor tests plus player lint/build pass; sixteen existing warnings remain.
Four theme/width checks cover dialog/calendar geometry, invalid/pending/error presentation and final keyboard/focus.
Light native Save/Delete contrast remains DR-033; full accessibility, locale, live mutation and SSR limits remain.
Explicit DR-011d2 approval: `Approve with documented limits and commit`; retain unchecked criteria and contrast failures.
Required workspace lint: 22 targets pass; twelve reproduce the existing dependency-check failures from DR-011d1.
Approved commit scope: only DR-011d2 and its handoff.
Next action: reconcile this parent separately in a subsequent invocation.
Keep this parent open until that reconciliation; no push or second implementation slice.

[component]: ../../../libs/frontend/pages/player/src/pages/edit/components/player-ranking/player-ranking.component.ts
