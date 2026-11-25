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
- [DR-009c](DR-009c-head-to-head-grid.md): matchup grid presentation and empty-state slice, approved Done on 2026-11-25.
  Native sizing/scrolling, semantic metadata and explicit empty results; local partner-name sorting/club fields corrected.
  Thirteen focused page/grid tests and player lint/build pass; approval retains the child's unchecked verification limits.
- [DR-009d](DR-009d-head-to-head-table-name.md): follow-up to preserve translated table naming without
  pass-through. Native translated caption implemented and approved Done on 2026-11-25 with disclosed limits.
  Historical parent approval and child verification limits remain unchanged.

## Parent reconciliation checklist

- [x] Reconcile approved DR-009a/b/c briefs with committed history and current source.
- [x] Confirm a hydrated application consumer and the existing smart/presentational boundary.
- [x] Preserve child approvals and their unchecked verification limits without claiming fresh passes.
- [x] Record uncovered work as a bounded child rather than expanding this documentation slice.
- [x] Complete and review the disclosed DR-009d compliance follow-up with its disclosed verification limits.
- [x] Obtain parent completion approval with remaining verification limits disclosed.

## Evidence and handoff

- Clean worktree on existing `main` at invocation start; no worktree/branch creation or commits.
- Baseline dark 1288x1272 screenshot inspected: four palette-colored filter groups; missing filter toggle and guidance
  header/dismiss button, caused by legacy `pTemplate="header"` markup. Native grid renders fifteen partner rows.
- Existing page/container plus `HeadToHeadGridComponent` already separates data orchestration from grid presentation.
  The filter has one real consumer; another smart/presentational split would not provide genuine reuse.
- Explicit `commit` approval on 2026-11-25 accepts parent completion with the disclosed limits and open DR-009d.
  At parent approval, that follow-up was not yet implemented or verified; see its subsequent approval below.
- The former hard-coded guidance close name is translated by DR-009b; it is no longer outstanding.
  One-time translated option labels, partner-club caption semantics, English service failures and native Select
  no-match/status copy remain separate locale follow-ups. Do not change global locale behavior in this page slice.
- DR-009a's checks and remaining review limits are recorded in its brief; do not generalize them to the whole route.
- DR-009b's fresh four guidance/eight page-state theme/width cases and keyboard/persistence checks are recorded
  in its brief; do not generalize them to grid internals or the whole route.

### Fresh reconciliation on 2026-11-25

- Documentation-only slice on existing `main`, starting clean. No new worktree/branch, application edits or commit.
- Confirmed child commits: DR-009a `dcaefdfe`, DR-009b `910de41b`, DR-009c `287b77ab`.
  Their focused tests and Nx lint/build results remain historical, not rerun passes.
- Source confirms the mounted route, shared breadcrumb/header, native filter Panel, translated guidance dismissal,
  explicit loading/error/results branches and presentational native table.
- Existing page SCSS still supplies host stacking and an old `.filters` rule. No styling cleanup is included here.
- Fresh hydrated `/players/glenn-latomme/head-to-head`, dark 1332x1272: one filter Panel, four fieldsets,
  one guidance region/four list items, one grid and a table named `Partners`.
  Three columns, fifteen rows, average 33.24% and total 26; zero nested Cards, alerts or document overflow.
- Read-only DOM inventory only: no theme/viewport changes, guidance dismissal, backend mutations or data fixtures.
  Existing view-transition abort recurred during navigation; the route/data rendered.
- No fresh screenshot, light/narrow, opponent, keyboard, contrast, locale, screen-reader/touch or SSR/hydration pass.
  All unchecked DR-009a/b/c criteria remain unchecked; those approvals do not cover unperformed checks.
- Found a compliance gap: the table uses `[pt]` for `aria-label`. Preserve DR-009c's historical approval
  and record DR-009d separately rather than silently accepting the binding or changing application code here.
- The page/service/grid boundary remains sufficient. No new smart/presentational extraction or styling exception.
- Application builds/tests are not run for this documentation-only reconciliation.
- Scoped `npx prettier --write` passes for the three changed Markdown files.
  Node assertions pass for three files' LF/frontmatter, 489 local links and unique/correct DR-009/a/b/c/d registry rows.
  `git --no-pager diff --check` passes. Git warns about future CRLF conversion; current file bytes are LF.
- Exact next action: implement only DR-009d, retaining both translated table names and existing grid behavior.
  Parent completion is approved with this disclosed follow-up still open. No other slice is started.

### Approval and commit

- Explicit approval on 2026-11-25: `commit`. Mark this reconciliation Done with disclosed verification limits.
- Retain all child unchecked screenshot/theme/width, interaction, accessibility, locale and SSR/hydration limits.
  DR-009d was Ready at parent approval; that approval did not establish the `[pt]` requirement had been fixed.
- Commit only this parent brief, DR-009d brief and backlog; no application changes or push.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 22 targets pass; twelve fail existing
  dependency checks, matching DR-009a/b/c: shared, backend-health, backend-seo, backend-ranking, backend-search,
  i18n, backend-authorization, backend-translate, utils, backend-database, frontend-modules-translation
  and backend-graphql. No unrelated manifests or failures are changed.

### DR-009d follow-up approval

- On 2026-11-25, explicit `Approve DR-009d with documented limits and commit` approves the native caption fix.
- The compliance follow-up is Done; retain its unchecked screen-reader, full visual/contrast and SSR checks.
  Historical parent/child approvals and their limits above are unchanged.
- Exact next candidate: scope DR-011 player editing after confirming a mounted consumer, one form at a time.
