---
title: 'DR-029o: Unused Toolbar region override retirement'
description: 'Retire unmatched center/end overrides while preserving the used Toolbar start region.'
---

## Identity and scope

- Parent: DR-029; prerequisite: approved [DR-029n](DR-029n-toolbar-region-verification.md).
- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Started on existing `main`, 2026-11-27, with a clean worktree; no new branch/worktree.
- Affected project: `app`; resolved Nx build mounts [global styles][styles].
- Remove only center/end selectors from the grouped flex rule and the end-justification block.
- Preserve used start, Card-flush, form widths, theme tokens and every component.
- Real consumers: club detail's permission-gated team builder and tournament admin's phase-gated Planning tab.
- Exclude component extraction, dependencies, data mutations, other cleanup and final regression.
- Existing shared domain presentation remains unchanged; smart/presentational extraction adds no value here.

## Baseline and approach

- Fresh tracked search finds only two Toolbar templates/imports and the global overrides.
- Builder declares only `#start`; schedule projects ordinary content without region templates.
- Installed Toolbar generates regions only when their corresponding direct content template exists.
- Native PrimeNG root/region styling remains; keep the used start flex growth.
- Capture before/after geometry, region counts and native controls in both themes at 390px/1440px.
- Templates and Tailwind utility usage remain unchanged; no replacement styling or exception.

## Implementation checklist

- [x] Reconcile prerequisite, branch, mounted stylesheet and current Toolbar source.
- [x] Capture both real consumers before removal, respecting their gates.
- [x] Remove only unmatched center/end overrides.
- [x] Compare both consumers after removal and confirm served CSS.
- [x] Format changed files, run focused Nx checks and persist results.

## Acceptance and verification

- [x] Removed overrides have no discovered source or generated application consumers.
- [x] Used start flex growth and other global rules are preserved.
- [x] Both Toolbar consumers retain geometry, controls and names in light/dark at 390px/1440px.
- [x] Safe keyboard/focus and disabled-state checks pass without operational mutations.
- [x] App lint/build pass; no app test target exists.
- [x] User review with disclosed limits.
- [ ] Full cross-route visual, contrast, accessibility, state, locale, workflow and SSR/hydration regression.

## Evidence and handoff

### Source and changed scope

- Fresh Node aggregation over 1,310 tracked HTML/TS/JS/MJS/SCSS/CSS/JSON files outside docs/instructions
  uses `toolbar[\s_-]*(center|end|start)|\bToolbar\b|p-toolbar|primeng/toolbar`, case-insensitively.
  Only two Toolbar templates/imports, four global selector lines, builder label and two test assertions match.
  Tests/exports are not consumer evidence; arbitrarily computed/external markup remains unverified.
- [Root routes][root-routes] mount club and tournament libraries. Club detail renders the permission-gated,
  idle-deferred [builder][builder], which declares only `#start`. Tournament admin renders [schedule][schedule]
  behind `canAccessSchedule()`, projecting ordinary content without region templates.
- Installed `node_modules\primeng\fesm2022\primeng-toolbar.mjs`, lines 60-71 and 142-158,
  queries direct start/center/end templates and generates each region only when its template exists.
- Removed only two selectors from the flex rule and the four-line end-justification block.
  The `.p-toolbar-start { flex: 1; }` rule remains. No component, utility or theme-token changes.
- Recursive served CSSOM before/after confirms the removed custom flex/justification declarations disappear.
  Native root flex/wrapping and region display/alignment remain; retained start and Card-flush declarations match.
  One cross-origin font sheet reports SecurityError; no exhaustive CSSOM-access claim.
- No new SCSS, colors, wrappers, dependencies or consumer solely for verification; no styling exception.
  Smart/presentational extraction is not useful for this unused global-rule retirement.

### Browser comparison and safe interaction checks

- Shared browser began home/dark with Account visible, actual viewport 1571 x 1272 and viewport override null.
- Selected the real Ploegopstelling tab on `/clubs/smash-for-fun?tab=team-builder`.
  Selected the enabled Planning tab on
  `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=schedule`.
  No phase/permission bypass, save, import, generation, publishing or drag/drop action.
- Eight before and eight after samples use light/dark at 390px/1440px, height 1000px.
  Native theme buttons are used and the exact `.dark-theme` state is awaited before each settled sample.
  Both themes produce the following matching before/after geometry:

| Consumer | Width  | Toolbar width x height | Start width x height | Regions start/center/end |
| -------- | ------ | ---------------------- | -------------------- | ------------------------ |
| Builder  | 390px  | 315.5 x 136px          | 292.5 x 113px        | 1 / 0 / 0                |
| Builder  | 1440px | 911 x 56px             | 888 x 33px           | 1 / 0 / 0                |
| Planning | 390px  | 585.453125 x 167px     | Not generated        | 0 / 0 / 0                |
| Planning | 1440px | 1215 x 80px            | Not generated        | 0 / 0 / 0                |

- Builder start computes `flex: 1 1 0%` in every sample. Neither Toolbar has internal horizontal overflow.
  Names remain Ploegopstelling and Planning Beheren; native roles remain toolbar.
  All observed button labels/disabled properties match. Planning auto-plan/publish stay disabled.
- Four builder keyboard samples: focus Import, Tab reaches Team Toevoegen; ArrowDown opens its listbox;
  Escape closes it with `aria-expanded=false` and focus returned. No option selected/team added.
- Four Planning keyboard samples: focused unscheduled-games toggle responds to Enter, collapses with
  `aria-expanded=false`, then Enter restores `true`. This is local presentation only, not a data mutation.
- After crops inspected: builder light-narrow wraps its select/actions; Planning dark-wide retains native
  controls and disabled actions. Screenshots are session evidence, not committed domain records.
- Existing DR-078 persists: narrow Planning document width 663px in a 390px viewport before and after.
  Builder document width is 375px; both wide documents are 1425px with the vertical scrollbar.
  Geometry preservation is not a responsive pass for the existing Planning overflow.
- Existing navigation InvalidStateError and aborted club GraphQL reads recur.
  No clean-console, dataset-correctness, full visual/contrast/accessibility, locale or SSR/hydration claim.
- Browser restoration: home/dark at captured 1571 x 1272; viewport dimensions restored with an explicit override,
  not the original null override. No visible dialogs; no operational mutations.

### Validation and remaining action

```powershell
git --no-pager grep -n -I -e 'p-toolbar' -e 'ToolbarModule' -e 'primeng/toolbar' -e 'toolbar-center' -e 'toolbar-end' -- ':!docs' ':!.github'
npx nx show project app --json
npx prettier --write apps\app\src\styles.scss docs\design-refresh\work-items\DR-029o-unused-toolbar-regions.md docs\design-refresh\backlog.md
npx nx run-many -t lint build -p app --output-style=static
npx prettier --check apps\app\src\styles.scss docs\design-refresh\work-items\DR-029o-unused-toolbar-regions.md docs\design-refresh\backlog.md
git diff --check
npx nx run-many --target=lint --output-style=static
```

- App lint/build pass: 31 successful tasks, 29 cached; app lint and build execute.
  Resolved app configuration has no test target. No new tests for removing unused CSS declarations.
- Scoped Prettier write/check and `git diff --check` pass. Only stylesheet/brief/backlog are changed.
  Git warns about future LF-to-CRLF conversion; changed files remain LF.
- Full cross-route visual, contrast, screen-reader, loading/error/permission variants, locale, operational workflow
  and SSR/hydration regression not run; retain unchecked criteria.
- DR-078 and inherited findings remain open. DR-029 parent remains open.
- Required pre-commit workspace lint exits 1: 22 of 34 targets pass, including app lint.
  Twelve reproduce the historical `@nx/dependency-checks` failures: `backend-health`, `backend-authorization`,
  `shared`, `backend-seo`, `backend-ranking`, `backend-search`, `i18n`, `utils`, `backend-translate`,
  `backend-database`, `frontend-modules-translation`, `backend-graphql`.
  No dependency manifests changed; no unrelated fixes and no workspace lint pass claimed.
- On 2026-11-27 the user selected `Approve with documented limits and commit` and `Nothing else`.
  Resulting backlog status: Done by explicit approval with disclosed limits.
  Full regression remains unchecked; approval does not imply an unperformed check passed.
  Approved commit scope: only stylesheet/brief/backlog on existing `main`; no push.
- Exact next invocation: separately scope existing DR-078 narrow Planning overflow, using its recorded evidence
  and fresh mounted-consumer checks. DR-078 is not started; DR-029 and inherited findings stay open.

[styles]: ../../../apps/app/src/styles.scss
[root-routes]: ../../../apps/app/config/app.routes.ts
[builder]: ../../../libs/frontend/pages/club/src/pages/detail/tabs/club-team-builder-tab.component.html
[schedule]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/schedule/schedule-tab.component.html
