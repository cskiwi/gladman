---
title: 'DR-078: Tournament admin Planning narrow overflow'
description: 'Use a native Card for the admin tab container without complex selectors or shared styling changes.'
---

## Identity and scope

- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Started on existing `main`, 2026-11-27, with a clean worktree; no branch/worktree creation.
- Prerequisite: approved [DR-029o](DR-029o-unused-toolbar-regions.md) records the unresolved overflow.
- Mounted consumer: `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=schedule`.
  [Root routes][routes] mount tournament; [admin template][admin] renders Planning behind `canAccessSchedule()`.
- Affected projects: `frontend-pages-tournament`, `app`.
- One slice: correct the admin container's intrinsic sizing that makes Planning overflow at 390px.
  Check all five tabs sharing that container; preserve native tab scrolling, Panels and Toolbar.
- Exclude global/theme changes, other Panel consumers, DR-066, service logic, dependencies and data mutations.
- No smart/presentational extraction: the fault is native container sizing, not repeated domain presentation.

## Baseline and approach

- Both themes at 390px: document client width 375px, scroll width 663px; Toolbar width 585.453125px.
  The outer Panel grid container is 345px, but its direct content wrapper expands to 648.453125px.
- Both themes at 1440px: document client/scroll width 1425px; Toolbar 1215px; outer wrapper/container 1278px.
- The native wrapper is a grid item with `min-width: auto`. Its intrinsic track grows with the tab content,
  rather than allowing the native scrollable tablist to fit the available width.
- Temporary browser-only `min-w-0` on that wrapper reduces document scroll width to 375px and Toolbar to 282px.
  Adding it to the Toolbar/content alone does not solve the ancestor track overflow.
  Experiments were cleared by reload before collecting the four baseline samples.
- Native Panel API has no content-wrapper sizing input. Toolbar remains styled and unchanged.
- Initial direct-child `min-w-0` selector was rejected in review: user requested keeping classes simple.
- Revised approach: use native Card for the non-collapsible outer tab container, with only `block`.
  Nested meaningful groups remain Panels; no Card descendants exist in the five current admin tab templates.
  Native Card is a suitable content surface without Panel's collapsible grid wrapper.
- No SCSS, inline style, global rule, `[pt]`, `[dt]`, arbitrary selector, clipping or overflow hiding.
  Schedule markup/utilities remain unchanged; native Card spacing/appearance is an intentional local adjustment.

## Implementation checklist

- [x] Confirm source-mounted consumer, gates, clean branch and focused scope.
- [x] Reproduce in both themes at narrow/wide sizes and isolate the ancestor sizing cause.
- [x] Apply only the outer Panel layout correction.
- [x] Check Planning and the other four tabs without operational mutations.
- [x] Format, run focused Nx checks and persist evidence.

## Acceptance and verification

- [x] Planning document scroll width does not exceed client width at 390px in either theme.
- [x] Wide Planning layout retains native controls with only the native Card spacing adjustment.
- [x] Native tab scrolling, keyboard access, date filter and local panel toggle remain usable.
- [x] Disabled scheduling/publishing controls and existing permissions/phase gates are preserved.
- [x] Other four admin tabs sharing the corrected container are checked in both themes/narrow/wide.
- [x] Focused existing Nx lint/build/tests pass.
- [x] User approval of the simple native Card revision with disclosed limits.
- [ ] Full contrast, screen-reader, state, locale, operational workflow and SSR/hydration regression.

## Evidence and handoff

- Baseline: four settled samples, native theme buttons, 390px/1440px viewport with height 1000px.
  Empty schedule has six unscheduled games; auto-plan/publish disabled, generate/refresh/toggle enabled.
  No scheduling, publishing, generation, import, drag/drop or permission bypass.
- Changed scope: replace only the loaded admin outer Panel with Card, add its native import,
  and update the existing phase-gate test's container selector. Loading Panel stays unchanged.
  Schedule, global styles, nested Panels, services and translations unchanged; no extraction or dependency.

### Superseded selector implementation evidence

- The initial rendered wrapper retained `min-width: 0px` after reload, proving the initial utility was applied.
  Outer wrapper now fits its grid container; native tablist scroll controls appear at narrow widths.
  No content is clipped or hidden by the correction.

| Theme      | Viewport | Before document client/scroll | After document client/scroll | Before/after Toolbar |
| ---------- | -------- | ----------------------------- | ---------------------------- | -------------------- |
| Light/dark | 390px    | 375 / 663px                   | 375 / 375px                  | 585.453125 / 282px   |
| Light/dark | 1440px   | 1425 / 1425px                 | 1425 / 1425px                | 1215 / 1215px        |

- Four settled final Planning samples await actual native states, rather than sampling immediately after Enter.
  Earlier immediate attribute samples were stale and are not interaction-pass evidence.
  Enter collapses/restores the unscheduled panel in all four samples; final `aria-expanded=true`.
  Date filter ArrowDown opens the native listbox; Escape closes it and restores focus to `scheduleDateFilter`.
  No date option chosen, data writes or operational actions. Disabled properties and control names match baseline.
- Narrow dark native tab keyboard check: ArrowLeft focuses Loting, ArrowRight returns Planning, Enter activates it.
  Native tab scrolling remains available; no custom navigation behavior introduced.
- Other-tab matrix: sixteen samples covering Settings, Enrollments, Draws and Check-in in both themes at both widths.
  Corrected outer wrapper is 345px narrow / 1278px wide in every sample.
  Enrollments/Check-in display their native empty feedback; Draws is mounted; native tables retain internal scrolling.
  Settings still contains a busy subsection, so its fully loaded state is not verified.
  During tab transitions some samples show transient 15px document overflow; settled Planning returns to client width.
  One narrow dark Check-in resample still captured that transition; no exhaustive other-tab responsive pass claimed.
- After screenshots inspected: wide light admin composition, narrow light and dark Toolbar.
  Controls wrap within the native surface, with readable labels and no clipped actions.
  Screenshots remain session evidence, not committed domain records. Before evidence is measured geometry.
- Existing auth-token timeout, aborted GraphQL reads and reload abort occurred; subsequent navigation recovered.
  No clean-console or complete Settings-data claim. Existing findings remain open rather than hidden.

### Validation and review

```powershell
npx nx show project app --json
npx nx show project frontend-pages-tournament --json
npx prettier --write libs\frontend\pages\tournament\src\pages\admin\page-admin.component.html docs\design-refresh\work-items\DR-078-planning-narrow-overflow.md docs\design-refresh\backlog.md
npx nx run-many -t lint build -p frontend-pages-tournament app --output-style=static
npx nx run frontend-pages-tournament:test --testPathPatterns=page-admin.component.spec.ts --testPathPatterns=schedule-tab.component.spec.ts --runInBand --output-style=static
```

- Lint/build: 32 successful tasks, 29 cached; tournament lint, tournament build and app build execute.
  One pre-existing unused `_order` warning in live-upcoming; no unrelated fixes.
- Focused existing admin/schedule tests: two suites, 40 tests pass; includes permissions, native control names,
  empty/populated/updating gates, localization, confirmations and read feedback.
  First combined regex selector failed on Windows with path-not-found before execution; repeated plain selectors pass.
  Static-output replay uses the successful test cache. Existing ts-jest metadata/experimental VM warnings remain.
- No new jsdom test asserting a class string: real browser geometry is the regression evidence for this sizing fix.
- Full contrast, screen-reader, loaded Settings, populated schedule grid, permission variants, operational workflows
  and SSR/hydration regression not run. Localization behavior is covered by existing focused tests, not browser locales.
- User rejected the complex selector and requested simple classes; fresh Card checks are recorded below.
  Revised result entered Review before the explicit approval recorded below.
- Revised implementation has no styling exception.
- Exact next invocation after approval: separately scope DR-077 mounted club add-member control names.
  That candidate is not started; DR-029 and inherited findings stay open.

### Final handoff checks

- Initial scoped Prettier write/check and `git diff --check` passed.
  Revised changed-file inventory: admin TypeScript/template/test, this brief and backlog; no commit or push.
- Browser restored to home/dark at 1571 x 1272 with an explicit viewport override.
  Initial home snapshot shows Inloggen during authentication resolution; account restoration is not claimed.
  No login/logout action was performed.
- Full application validation above preceded this documentation-only result update.
  Exact final formatting command uses `npx prettier --check` on those three changed files.
  Git warns about future CRLF conversion; formatting writes LF.

### Simple native Card revision

- User input, 2026-11-27: "Thats some complex tailwind classes, is that really necessary ? keep the classes always simple".
- Removed the internal descendant selector completely; outer container has only `class="block"`.
- Fresh native Card lint/build pass: 32 successful tasks, 29 cached. Existing lint/ts-jest warnings remain.
  Repeated focused command above executes both suites again: 40 tests pass, no test-cache replay.
- Four fresh settled native Card Planning samples:

| Theme      | Viewport | Document client/scroll | Outer Card | Toolbar  |
| ---------- | -------- | ---------------------- | ---------- | -------- |
| Light/dark | 390px    | 375 / 375px            | 347px      | 278.5px  |
| Light/dark | 1440px   | 1425 / 1425px          | 1280px     | 1211.5px |

- Native Card spacing changes Toolbar width by 3.5px relative to the Panel-based layout.
  This is intentional native-component appearance, not a width override or a hidden layout regression.
- Four fresh native Enter collapse/restore and date-filter ArrowDown/Escape checks pass with actual-state waits;
  focus returns to the named filter and disabled button properties/names match baseline.
- Narrow dark ArrowLeft focuses Loting, ArrowRight returns Planning and Enter activates it.
- Sixteen fresh other-tab samples retain native empty feedback/tables and the Card width above.
  Zero nested Cards in every sample. Settings busy subsection and transient 15px transition overflow remain
  disclosed limits; no full other-tab/state regression claim.
- Revised screenshots inspected: native Card wide light and Planning narrow dark; no clipped controls.
  No operational mutations, custom wrappers, complex classes, SCSS, token bindings or styling exception.
- Initial selector evidence above is historical only; these fresh checks validate the final Card implementation.
- Native reuse decision: use Card for a non-collapsible outer content group instead of targeting Panel internals.
  Retain Panels for meaningful nested groups; the loading Panel remains unchanged.
- Browser navigation again hit an auth timeout, then the actual authorized route recovered with Account visible.
- The simple native Card revision entered Review, then received the explicit approval below.
  Do not revive the rejected selector.

### Approval and commit handoff

- On 2026-11-27 the user selected "Approve DR-078 with documented limits and commit".
  Resulting authoritative backlog status: Done by explicit approval, not an exhaustive regression pass.
- Accepted limits remain unchecked: full contrast/screen-reader/state/locale/operational/SSR regression,
  loaded Settings and populated schedule/browser permission variants; other-tab transition samples remain disclosed.
- Final scoped Prettier check of all five changed files and `git diff --check` pass.
  Browser restored home/dark at 1571 x 1272; no login/logout or operational mutations.
- Required pre-commit command: `npx nx run-many --target=lint --output-style=static`.
  Exits 1: 22 of 34 targets pass, including app/tournament.
  Twelve reproduce the documented `@nx/dependency-checks` failures: `backend-health`, `backend-authorization`,
  `shared`, `backend-seo`, `backend-ranking`, `backend-search`, `i18n`, `utils`, `backend-translate`,
  `backend-database`, `frontend-modules-translation`, `backend-graphql`.
  No manifest changes or unrelated fixes; no workspace-lint pass claimed.
- Approved commit scope: only admin TypeScript/template/test, this brief and backlog on existing `main`.
  No workflow changes, new branch/worktree, dependencies or push.
- Next candidate: separately scope DR-077's mounted add-member accessible names with fresh consumer checks.
  DR-077 is not started; DR-029 and inherited findings remain open.

[routes]: ../../../apps/app/config/app.routes.ts
[admin]: ../../../libs/frontend/pages/tournament/src/pages/admin/page-admin.component.html
