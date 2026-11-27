---
title: 'DR-029n: Toolbar region consumer verification'
description: 'Verify generated center/end Toolbar consumers before separately retiring unmatched overrides.'
---

## Identity and scope

- Parent: DR-029; prerequisite: approved [DR-029m](DR-029m-unused-pair-value.md).
- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Started on existing `main`, 2026-11-27, with a clean worktree; no new branch/worktree.
- Investigation only: verify generated `.p-toolbar-center` and `.p-toolbar-end` consumers.
- Affected project: `app`; resolved Nx build options mount [global styles][styles].
- Preserve every application rule, including used Toolbar start and Card-flush.
- Exclude selector retirement, component extraction, dependencies, data mutations and final regression.
- No smart/presentational extraction is warranted for a generated-selector inventory.

## Implementation checklist

- [x] Reconcile prerequisite, current branch and mounted stylesheet.
- [x] Recheck tracked Toolbar references and installed generated-region conditions.
- [x] Check mounted consumers in light/dark at 390px/1440px without data changes.
- [x] Record retained behavior, unmatched candidates and unverified branches.
- [x] Format and validate documentation; persist the exact next action.

## Acceptance and verification

- [x] Each region has a source-backed consumer/retention decision.
- [x] Browser evidence distinguishes visible generated regions from hidden/unmounted branches.
- [x] Application styles, templates and utility usage remain unchanged.
- [x] User review of the investigation and disclosed verification limits.
- [ ] Full cross-route visual, accessibility, state, locale, workflow and SSR/hydration regression.

## Evidence and handoff

### Source inventory and decisions

- Exact tracked search finds two Toolbar templates/imports and four global selector lines.
  Node aggregation over 1,310 tracked HTML/TS/JS/MJS/SCSS/CSS/JSON files outside docs/instructions,
  using `toolbar[\s_-]*(center|end|start)|\bToolbar\b|p-toolbar|primeng/toolbar` case-insensitively,
  finds only those references, the builder label ID and two schedule test assertions.
  Tests are not consumer evidence; arbitrarily computed/external markup remains unverified.
- [Root routes][root-routes] mount the club and tournament libraries.
  [Club routes][club-routes] mount detail; [club detail][club-detail] renders the idle-deferred,
  permission-gated [builder][builder], which declares only `#start`.
  [Tournament routes][tournament-routes] mount admin; [admin][admin] renders [schedule][schedule]
  behind `canAccessSchedule()`. The schedule Toolbar projects an ordinary full-width div, no region templates.
- Installed PrimeNG Toolbar `contentChild` queries target direct `start`, `center` and `end` templates.
  Its generated template wraps each region in an independent `@if` for that template.
  Ordinary projected content cannot create a region implicitly.
  Installed source: `node_modules\primeng\fesm2022\primeng-toolbar.mjs`, lines 60-71 and 142-158.
- Served native Toolbar CSS supplies root flex/wrapping/space-between and region display/alignment.
  It does not supply region flex growth. Keep the used global `.p-toolbar-start { flex: 1; }` behavior.
  Center/end have no discovered application readers or generated consumers.
- Separate retirement candidate DR-029o: remove only center/end from the grouped flex rule and remove
  the end-justification block, after fresh verification. Do not retire start, Card-flush or form-width rules.
- All application files and template utilities remain unchanged. No new SCSS, colors, wrappers or exception.
  Shared domain presentation already exists; extraction does not help a generated-selector investigation.

### Browser evidence

- Shared page initially renders home in dark mode with Account visible; viewport override reports null.
  No operational/admin mutation, save, generation, publishing, drag/drop or import action was invoked.
- `/clubs/smash-for-fun?tab=team-builder`: explicitly selected the observed Ploegopstelling tab and
  awaited a visible Toolbar. All four settled light/dark 390px/1440px samples have one start and zero center/end.
  At 390px, Toolbar is 315.5 x 136px and start is 292.5 x 113px.
  At 1440px, Toolbar is 911 x 56px and start is 888 x 33px.
  Start computes `flex: 1 1 0%`; Toolbar has no internal horizontal overflow.
  Native role is toolbar; `aria-labelledby` resolves to Ploegopstelling.
- `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=schedule`:
  unlike the earlier new-tournament sample, this imported tournament exposes an enabled Planning tab.
  Selected that real tab without bypassing permissions/phase gates; its visible Toolbar has zero start/center/end
  in all four settled light/dark 390px/1440px samples.
  At 390px, Toolbar is 585.453125 x 167px; at 1440px, 1215 x 80px.
  Role/accessible name are toolbar/Planning Beheren. Auto-plan/publish remain disabled in the sampled state.
  No internal Toolbar overflow, but the narrow document is 663px wide in a 390px viewport.
  Dark-narrow screenshot confirms clipping; dark-wide screenshot shows the native Toolbar intact.
  Record this existing page overflow separately as DR-078; it is not the topbar-only DR-066 finding.
- Recursive served CSSOM confirms both global Toolbar rules and the retained Card-flush rule;
  native region declarations have only display/align-items. One cross-origin font sheet reports SecurityError.
  No exhaustive CSSOM-access claim. All themes were awaited against the exact document class.
- Existing navigation InvalidStateError recurs; club navigation also aborts GraphQL reads.
  No clean-console, dataset-correctness, exhaustive state or SSR/hydration claim.
- There is no application before/after styling difference: this slice changes documentation only.
  Screenshots are session evidence, not committed domain records.
- Returned home, dark theme, Account visible, no visible dialogs, at the documented 1571 x 1272 baseline.
  Original viewport override was null, so exact original viewport dimensions were not captured.

### Validation and remaining action

```powershell
git --no-pager grep -n -I -e 'p-toolbar' -e 'ToolbarModule' -e 'primeng/toolbar' -e 'toolbar-center' -e 'toolbar-end' -- ':!docs' ':!.github'
npx nx show project app --json
npx prettier --write docs\design-refresh\work-items\DR-029n-toolbar-region-verification.md docs\design-refresh\backlog.md
npx prettier --check docs\design-refresh\work-items\DR-029n-toolbar-region-verification.md docs\design-refresh\backlog.md
git diff --check
npx nx run-many --target=lint --output-style=static
```

- Source inventory and eight settled browser samples pass for the investigation's generated-consumer criteria.
  Narrow Planning layout fails the broader responsive expectation and is recorded as DR-078, not a pass.
- Scoped Prettier write/check and `git diff --check` pass; only this new brief and backlog are changed.
  Git warns about future LF-to-CRLF conversion for the backlog; changed files are kept LF.
- Application build/tests not run: documentation-only investigation; app has lint/build but no test target.
- Required pre-commit workspace lint exits 1: 22 of 34 targets pass, including cached app lint.
  Twelve reproduce the historical `@nx/dependency-checks` failures: `backend-health`, `backend-seo`,
  `shared`, `backend-authorization`, `backend-ranking`, `i18n`, `backend-search`, `backend-translate`,
  `utils`, `backend-database`, `frontend-modules-translation`, `backend-graphql`.
  No unrelated dependency changes; this is not a workspace lint pass.
- Full visual, contrast, keyboard/focus, screen-reader, loading/error/permission variants, locale, workflow and
  SSR/hydration regression not run. Geometry/native names are not evidence of those outcomes.
- On 2026-11-27 the user selected `Approve inventory with documented limits and commit` and `Nothing else`.
  Resulting backlog status: Done by explicit approval of this investigation with disclosed limits.
  Unperformed full regression stays unchecked; approval is not evidence that these checks passed.
  Approved commit scope: only this brief/backlog on existing `main`; no push.
- Exact next invocation: separately scope DR-029o to freshly verify and retire only unmatched Toolbar
  center/end overrides. Retain used start, Card-flush and all other application behavior.
  DR-078 is independently deferred. DR-029 and inherited findings remain open.

[styles]: ../../../apps/app/src/styles.scss
[root-routes]: ../../../apps/app/config/app.routes.ts
[club-routes]: ../../../libs/frontend/pages/club/src/lib.routes.ts
[club-detail]: ../../../libs/frontend/pages/club/src/pages/detail/page-detail.component.html
[builder]: ../../../libs/frontend/pages/club/src/pages/detail/tabs/club-team-builder-tab.component.html
[tournament-routes]: ../../../libs/frontend/pages/tournament/src/lib.routes.ts
[admin]: ../../../libs/frontend/pages/tournament/src/pages/admin/page-admin.component.html
[schedule]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/schedule/schedule-tab.component.html
