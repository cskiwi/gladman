---
title: 'DR-009d: Head-to-head table name without pass-through'
description: 'Preserve translated native table naming while removing the existing pass-through binding.'
---

## Identity and scope

- ID: DR-009d. Status: see the [backlog](../backlog.md).
- Parent: [DR-009](DR-009-player-head-to-head.md). Prerequisite: approved Done DR-009c.
- Design rules: [refresh plan](../README.md); user rule: no PrimeNG `[pt]` or `[dt]` bindings.
- Mounted consumer: `/players/glenn-latomme/head-to-head`, freshly confirmed hydrated on 2026-11-25.
- Project: `frontend-pages-player`.
- Sources: [grid template][template], [grid component][component] and existing grid tests.
- Scope: replace only the table-name pass-through binding with supported native/semantic table naming.
- Preserve translated Partners/Opponents names, actual table semantics, columns, sorting, totals, empty/loading states
  and the browser-only table guard.
- Exclude filter/guidance/service changes, global/shared settings, dependencies and operational mutations.

## Baseline and proposed approach

- Before this slice, native Table received its actual table `aria-label` through `[pt]`, violating the standing rule.
- Fresh parent inventory: dark 1332x1272, table named `Partners`, fifteen rows, three columns, average 33.24%, total 26.
  Historical opponent/theme/width results remain in DR-009c, not fresh evidence for this child.
- Check the installed PrimeNG Table's documented naming inputs/templates before choosing the smallest replacement.
  A native caption is a candidate; verify the resulting actual table name rather than naming only a wrapper.
- Do not replace pass-through with `[dt]`, DOM mutation, CSS/inline styling or an accessibility-only wrapper hack.
- Retain the existing smart page/presentational grid boundary; there is no new reuse case.
- No utility/style changes are expected. Record any necessary visible caption/layout effect and its review evidence.

## Implementation checklist

- [x] Confirm installed native naming capabilities and capture current names in both modes.
- [x] Remove the existing `[pt]` binding without losing translated native table naming.
- [x] Adapt focused tests to the supported semantic contract, not implementation-specific attribute plumbing.
- [x] Preserve excluded files and existing grid behavior; add no styles or shared settings.
- [x] Record exact validation, browser evidence and remaining limits.

## Acceptance and verification

- [x] Grid template contains no `[pt]` or `[dt]`; no equivalent DOM/style workaround is introduced.
- [x] Actual table exposes the translated Partners/Opponents accessible name after switching modes.
- [x] Populated and empty results preserve three/four columns, sorting and aggregate semantics.
- [x] Light/dark at 390px/1440px retain contained native scrolling and the caption remains accessibility-exposed.
- [x] Native Enter/Space sorting and focus pass; named-table browser role lookup works in both modes.
- [ ] Screen-reader table navigation is manually verified.
- [x] Relevant existing focused Nx tests and player lint/build pass.
- [ ] Localization and browser-only SSR fallback are preserved; unperformed SSR tests remain explicitly open.
- [x] User reviews the result or approves completion with disclosed limits.

## Evidence and handoff

- Scoped during DR-009 parent reconciliation; implemented separately on existing `main` on 2026-11-25.
- Started with a clean worktree; no new worktree/branch, dependencies, consumers, extraction or operations.
- DR-009c remains approved Done with its original limits; this child corrects an uncovered compliance requirement.
- Parent reconciliation was explicitly approved by `commit` on 2026-11-25 with this follow-up disclosed.
  That completion does not implement or verify this child.

### Native naming implementation

- Installed PrimeNG 22.1.2 Table declarations expose no table-level `ariaLabel`/`ariaLabelledBy` input.
  Its `caption` template renders a sibling header `div`, not a native table caption.
  Inspected `node_modules/primeng/fesm2022/primeng-table.mjs`: the documented `colgroup` template outlet
  renders immediately inside the actual table before `thead`.
- Reused the native `<caption class="sr-only">` through `#colgroup` pattern already used by the mounted
  tournament enrollment table. No wrapper, DOM mutation, styling workaround or new abstraction.
- Caption uses the original translated mode keys. It is the table's first element child; browser role/name
  lookup confirms its accessible name without `aria-label` on either the actual table or a naming wrapper.
- Visible grid classes/layout are unchanged. Added only one `sr-only` utility occurrence for the semantic caption;
  no numbered colors, SCSS, inline/global styles, shared settings or new styling exception.
- Existing page/service/presentational-grid boundary already centralizes this table; no further split is justified.
- Tests now assert native caption ownership, empty-result naming and live English/Dutch mode/language updates.
  Existing sorting, missing-partner metadata and unweighted aggregate tests remain in the focused run.
- Browser-only guard and server fallback are unchanged. This is source preservation, not an SSR test pass.

### Validation on 2026-11-25

- `npx prettier --write` for the grid template/test and three changed handoff Markdown files.
- `npx nx run frontend-pages-player:test --runInBand --testPathPatterns=head-to-head --output-style=static`:
  two suites, fourteen tests pass; the log retrieval repeat uses the Nx cache.
- `npx nx run-many -t lint build -p frontend-pages-player --output-style=static`:
  player lint/build and ten dependency tasks pass; 24 existing player lint warnings, zero errors.
- Hydrated route before changes, dark 1571x1272: actual names `Partners` and `Tegenstanders` confirmed.
  Partners: fifteen rows, three columns, average 33.24%, total 26.
  Opponents: 34 rows, four columns, average 23.53%, total 35.
- After changes, eight settled mode/theme/width cases: Partners/Tegenstanders in light/dark at 390px/1440px.
  Actual table lookup by translated accessible name passes populated and empty; caption is first child,
  no `aria-label`, unchanged columns/rows/averages/totals and no document horizontal overflow.
- Native scroller is `overflow-x: auto`: at 390px, client width 310px with content widths 462px/647px;
  at 1440px, both modes fit 1243px. Caption uses the existing screen-reader utility with `clip-path: inset(50%)`;
  it does not add a visible title or alter table layout.
- Each case uses the real minimum-games filter at 9999 for translated empty results, correct colspan 3/4,
  no footer aggregates, and retained named table; resetting zero restores fifteen/34 rows.
- Enter/Space on the native name header toggles `aria-sort` with focus retained in all eight settled cases.
  An earlier immediate attribute sample was stale; reran the entire matrix waiting for each expected sort state.
  The settled run passes; do not treat that initial sample as evidence of a sorting regression.
- Inspected a dark narrow screenshot crop; capture is partial and includes sticky shell overlap.
  No full screenshot/pixel matrix, contrast measurement, manual screen-reader/touch navigation,
  browser locale-switch workflow, loading-overlay audit or SSR/hydration regression test was performed.
- Restored dark theme, original 1571x1272 viewport, Partners mode and minimum zero with fifteen rows.
  No operational/admin actions or persisted test fixtures.
- Scoped Prettier and `git --no-pager diff --check` pass. Node assertions verify five files' LF bytes,
  three Markdown frontmatters, 490 local links, the unique Review registry row and no grid `[pt]`/`[dt]` binding.
  Git warns about future CRLF conversion; current file contents are LF.

### Review handoff

- Explicit approval on 2026-11-25: `Approve DR-009d with documented limits and commit`.
  Authoritative backlog status is Done by that approval, not a claim that unperformed checks passed.
- Preserve unchecked manual screen-reader, full visual/contrast and SSR/locale/workflow limits.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 22 targets pass;
  twelve fail existing dependency checks, matching the prior parent/child runs: backend-seo, backend-health,
  backend-authorization, shared, backend-search, backend-ranking, i18n, backend-translate, utils,
  backend-database, frontend-modules-translation and backend-graphql. No unrelated fixes.
- Commit only the grid template/test, this brief, parent follow-up update and backlog; no push.
- Exact next candidate: scope DR-011 player editing, first confirming the mounted consumer and selecting one form.
  No other implementation slice is started here.

[template]: ../../../libs/frontend/pages/player/src/pages/head-to-head/head-to-head-grid/head-to-head-grid.component.html
[component]: ../../../libs/frontend/pages/player/src/pages/head-to-head/head-to-head-grid/head-to-head-grid.component.ts
