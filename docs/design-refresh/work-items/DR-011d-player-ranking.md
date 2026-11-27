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

- [DR-011d1: Ranking history and read states](DR-011d1-ranking-history.md): approved 2026-11-25.
- [DR-011d2: Ranking dialog, validation and mutation feedback](DR-011d2-ranking-dialog.md): approved 2026-11-27.

## Reconciliation and handoff

- [x] Confirm a mounted consumer and split into independently reviewable concerns.
- [x] Complete and review history/read states with documented verification limits.
- [x] Complete and review dialog/mutation states with documented verification limits.
- [x] Reconcile the parent with child evidence and retained verification limits.

DR-011d2 replaces the recorded fixed-width, unnamed-field and missing-footer baseline with the native responsive
dialog and explicit feedback. Its supported mutation lifecycle is covered by the child's focused tests.
Live mutation, complete localization and full accessibility verification remain unperformed;
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
Both approved children are committed on existing `main`: history `89b7c6ec`, dialog `f83321a5`.

### Parent reconciliation, 2026-11-27

- Started with a clean worktree on existing `main`; no branch/worktree or application changes.
- Confirmed the current mounted source chain: root `/players` registration in
  [app routes][app-routes], `:playerId/edit` in [player routes][player-routes], and the Ranking tab's
  `<app-player-ranking [player]="player" />` in the [page template][page-template].
  This is source confirmation, not a fresh hydrated-browser count or workflow pass.
- Read both complete child briefs and current ranking component/template. History/read feedback, named native
  Tables, optional zero points and stale-read protection remain present; the responsive labelled dialog,
  validation, pending guards, explicit payload and confirmed-result feedback remain present.
- Existing page/form-child separation is sufficient. The dialog already renders repeated discipline/points fields
  from one list; no additional real consumer justifies a new smart/presentational extraction.
- Child approvals remain scoped to their recorded work and disclosed limits. No unchecked child criteria changed.
  Prior 39-test/player lint/build results are inherited evidence, not new runs in this documentation-only slice.
- Retain light Save/Delete contrast failures at 3.65/3.76:1 under DR-033, plus DR-034/076 findings.
  Full screenshot/contrast/accessibility, screen-reader/touch, locale, live save/delete and SSR/hydration checks
  remain unperformed. The twelve existing workspace dependency-check failures are not resolved here.
- Parent reconciliation is complete and explicitly approved with documented limits; no new visual or functional
  pass is claimed. Approval on 2026-11-27: `Approve with documented limits and commit`; parent is Done.
  DR-011 remains open for its own reconciliation. No application build/test or browser check is required or run
  for this documentation-only scope; no service, authentication, storage or operational changes.

### Documentation validation

- `git --no-pager log -5 --format="%h %s"` and the two child briefs' scoped log confirm
  `89b7c6ec` and `f83321a5` on current `main`.
- `npx prettier --write` with the five changed design-refresh documents: passed, no formatting changes needed.
- `git --no-pager diff --check`: passed. Existing LF-to-CRLF Git warnings remain;
  the direct Node check confirms all five actual documents use LF, frontmatter and trailing newlines.
- Read-only inline Node check: 523 relative local link targets exist; authoritative DR-011d is Review,
  DR-011d1/DR-011d2 remain Done. After explicit approval, DR-011d is Done as well.
  These are documentation checks, not application tests.

### Exact next action

- Commit only this approved reconciliation and its directly related handoff on existing `main`; do not push.
- Exact next invocation: reconcile DR-011 separately against all required children, retaining their
  accepted verification limits. Do not start another implementation slice or the optional DR-011e follow-up here.

[component]: ../../../libs/frontend/pages/player/src/pages/edit/components/player-ranking/player-ranking.component.ts
[app-routes]: ../../../apps/app/config/app.routes.ts
[player-routes]: ../../../libs/frontend/pages/player/src/lib.routes.ts
[page-template]: ../../../libs/frontend/pages/player/src/pages/edit/page-edit.component.html
