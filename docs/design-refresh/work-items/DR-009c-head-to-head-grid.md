---
title: 'DR-009c: Head-to-head matchup grid'
description: 'Native table presentation and explicit empty results for the mounted comparison grid.'
---

## Identity and scope

- ID: DR-009c. Status: see the [backlog](../backlog.md).
- Parent: [DR-009](DR-009-player-head-to-head.md). DR-009a/b are approved Done.
- Design rules: [refresh plan](../README.md).
- Mounted consumer: `/players/glenn-latomme/head-to-head`, confirmed hydrated on 2026-11-25.
- Project: `frontend-pages-player`; existing `main`, clean worktree at start. No new worktree or branch.
- Sources: [grid template][template], [grid component][component], its local row type and stylesheet.
- Preserve partner/opponent modes, translated headings, sorting, arithmetic mean win rate and summed game counts.
- Exclude filters, guidance/page states, service calculations/queries, player detail, shared/global styling and operations.

## Baseline and approach

- Mounted baseline: fifteen partner rows, average 33.24%, total 26; 34 opponent rows, average 23.53%, total 35.
- Dark-wide baseline grid crop inspected. Club labels use gray palette classes; opponent partner clubs are blank
  because the template reads `partner.name` instead of the service's `partnerClub.name`.
- Legacy small-table class replaces neither the native size input nor an explicit empty message.
- Local host SCSS adds narrow-only padding. Remove it in favor of a minimal block/min-width host layout.
- Use native Table small size, horizontal scrolling, semantic secondary copy and a translated native empty row.
- Correct the local row type to match existing service output and sort opponent partners by their displayed name.
- Keep the existing smart page/presentational grid boundary. No second consumer warrants another wrapper.
- Baseline template: seven class attributes, fourteen class tokens, three authored gray palette tokens;
  one local stylesheet with a narrow-width media query. Record final counts after implementation.

## Implementation checklist

- [x] Confirm real consumer, prerequisites and bounded scope.
- [x] Use native Table options and semantic metadata without new styles or shared changes.
- [x] Preserve mode-specific columns, row identity, sorting and aggregate semantics.
- [x] Make zero results explicit in both modes.
- [x] Add focused tests for changed grid behavior.
- [x] Record findings and accurate verification in the backlog.

## Acceptance and verification

- [x] Partners retain three columns; opponents retain four, including optional partner/club and missing-partner marker.
- [x] Native small table, semantic metadata and local scrolling work in light/dark at 390px/1440px.
- [x] Named table and sortable headers support keyboard access and visible focus.
- [x] Empty results have translated feedback spanning the current columns, without misleading aggregate values.
- [x] Default win-rate sorting, name/partner/game sorting and aggregate calculations remain correct.
- [x] No new palette classes, SCSS, inline styles, dependencies or global changes.
- [x] Focused Nx tests, player lint/build, formatting and whitespace checks pass.
- [x] Sampled ordinary body/club text contrast exceeds 4.5:1 in both themes.
- [x] User explicitly approves completion with disclosed verification limits; no unperformed check is claimed.
- [ ] Full screenshot/contrast matrix, screen-reader/touch, locale-switching and SSR/hydration checks.

## Evidence and handoff

- Implemented only local grid markup/component/type, deleted grid SCSS and added five focused grid test cases.
  Existing page/grid separation remains the reuse boundary; no extra wrapper, new consumer or shared/global edit.
- Native `size="small"` replaces the legacy class. Table pass-through names the actual table using existing
  translated mode labels. Native scrolling and nowrap cells retain readable columns at narrow widths.
- Semantic club text is now `text-sm text-muted-color`. Partner metadata reads `partnerClub.name`, matching
  the existing service output. Local row type now describes that output using only rendered player identity fields.
- Partner sorting uses `partner.fullName`, not the object. No calculation, request, permission or filter changes.
- Native empty row reuses existing `all.player.noResults`, spans three/four columns and exposes a status.
  Empty results omit aggregate values instead of displaying a misleading zero average/total.
- Retain the browser-only table guard; server fallback now exposes translated loading text as a status.
  This source-level preservation is not an SSR/hydration test.
- Template counts: seven to eight class attributes, fourteen to twelve class tokens, three to zero palette tokens.
  Removed the legacy `styleClass` and eleven-line stylesheet. Two host layout tokens provide `block min-w-0`.
  Remaining template tokens provide nowrap columns, semantic metadata/feedback and paragraph margin reset.
- Native table text alignment remains unchanged. Browser inspection showed `text-right` utilities were ineffective
  against component-layer defaults; removed those redundant utilities rather than adding overrides or theme changes.
- Exceptions: none. No dependencies, operational mutations, extractions or workflow edits.

### Validation commands

- `npx nx run frontend-pages-player:test --runInBand --testPathPatterns="head-to-head.*component.spec.ts"
--output-style=static`: pass after final application edits, thirteen tests across two suites.
  Five new grid cases cover mode/name/club rendering, default sort/aggregates, partner-name sorting,
  both empty modes/recovery and optional metadata. Eight existing page/filter/state cases remain passing.
- Initial test run: twelve passed, one failed because its text assertion assumed a space between adjacent block
  elements. Corrected the assertion to inspect displayed names, not incidental DOM whitespace; no product fallback.
- `npx nx run-many -t lint build -p frontend-pages-player --output-style=static`: pass after final application edits.
  Twelve tasks, ten cached. Player lint reports 24 existing warnings and zero errors.
  Earlier test runs emitted existing ts-jest metadata warnings; the final run passes without them.
- Scoped `npx prettier --write`: pass on every changed file. `git --no-pager diff --check` passes.
  Node assertions pass for seven files' LF endings, three documents' frontmatter, 485 local links,
  unique Review registry row and zero scoped palette/inline-style/legacy-table-class regressions.
  Git warns about future CRLF conversion; current file bytes are verified LF.
- No dependency installs, workspace-wide tests or full application build.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 22 targets pass from cache;
  twelve fail dependency checks outside this slice, matching the prior DR-009a/b failing target list:
  backend-health, backend-seo, backend-search, backend-authorization, shared, i18n, backend-ranking, utils,
  backend-translate, backend-database, frontend-modules-translation and backend-graphql.
  Failures concern unchanged dependency manifests; no unrelated fixes are included.

### Browser evidence

- Real mounted localhost route, no injected row fixtures or operational commands. Minimum-games `1000` safely
  produces empty filtered results; resetting to `0` restores real data. Only read queries and local UI state changed.
- Populated theme/width checks retain fifteen partner rows and 34 opponent rows, with three/four columns.
  Totals remain 26/35 and arithmetic mean rates remain 33.24%/23.53%; no weighted-average change.
  Opponents show 24 partner club labels and ten missing-partner markers.
- Final settled checks cover keyboard sorting in both themes at both widths. Enter/Space change native `aria-sort`;
  sorted numeric game counts are ordered, names sort alphabetically, and Tab enters the next sortable header.
  Native keyboard-origin focus exposes a solid 1px outline. Unit tests separately verify partner-name order.
- One early keyboard loop read sort state before rendering settled; another requested narrow sample measured wide.
  Neither is counted as narrow evidence. Settled repeats wait after events; separate partner repeats explicitly
  assert actual 390px width in both themes.
- At 390px, grid viewport is 310px wide, with local scroll content around 462px (partners)/647px (opponents).
  At 1440px, viewport/content are 1243px with no horizontal scrolling needed.
  No document-level horizontal overflow in either mode, theme or checked width.
- Final eight empty cases: both modes x light/dark x 390px/1440px. All show `Geen resultaten` status,
  correct three/four-column span, empty aggregate footer and zero page overflow; real results recover afterward.
- Sampled ordinary club/body colors against their opaque native Card background via browser canvas sRGB conversion:
  metadata 7.82:1 dark / 4.87:1 light; body 14.52:1 dark / 19.87:1 light. Both widths agree.
  This does not audit every selected/sorted/focus/empty state or replace screen-reader testing.
- Inspected light-wide and dark-narrow opponent crops. Shared-browser captures clip edges/headers and do not provide
  a complete viewport screenshot matrix. No full pixel, screen-reader/touch, locale or SSR/hydration pass claimed.
- Existing navigation view-transition abort messages recur; one Auth0 token timeout appeared during live reload.
  Public route and data remained available. Authentication workflows were not validated or changed.
- Browser left on the comparison route with initial 1332x1272 viewport and dark presentation restored,
  partners mode, minimum zero and default win-rate ordering. No guidance dismissal preference was changed.

### Exact next action

- Explicit approval on 2026-11-25: `Approve DR-009c with documented limits and commit`.
  This authorizes completion and the scoped commit while retaining unchecked full screenshot/contrast-matrix,
  screen-reader/touch, locale/workflow and SSR/hydration criteria. It is not evidence those checks passed.
- DR-009c is Done by that approval. Commit only its grid implementation/tests and three-document handoff.
  No push is authorized.
- Exact next action for the next invocation: reconcile DR-009 parent scope against approved DR-009a/b/c,
  retaining all child approvals and unchecked verification limits. Keep the parent open until that reconciliation.
- Existing Select/service locale follow-ups remain in the backlog; do not begin another implementation slice here.

[template]: ../../../libs/frontend/pages/player/src/pages/head-to-head/head-to-head-grid/head-to-head-grid.component.html
[component]: ../../../libs/frontend/pages/player/src/pages/head-to-head/head-to-head-grid/head-to-head-grid.component.ts
