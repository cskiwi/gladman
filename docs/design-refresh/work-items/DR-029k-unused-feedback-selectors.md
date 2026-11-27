---
title: 'DR-029k: Unused global feedback selector retirement'
description: 'Retire only unused error, required-label and hint selectors while preserving native feedback.'
---

## Identity and scope

- Parent: DR-029; prerequisite: approved [DR-029j](DR-029j-error-required-hint-inventory.md).
- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Started on existing `main`, 2026-11-27, with a clean worktree; no new branch/worktree.
- Affected Nx project: `app`; mounted global stylesheet: [styles](../../../apps/app/src/styles.scss).
- Retire only `.error-text`, `label.required::after`, `small.hint` and their three comments.
- Mounted reference: `/competition/pbo-competitie-2026-2027/edit`, information and settings tabs.
  [Competition routes](../../../libs/frontend/pages/competition/src/lib.routes.ts) mount the editor;
  [settings template](../../../libs/frontend/pages/competition/src/pages/edit/components/competition-settings/competition-settings.component.html)
  renders ordinary semantic `small` hints, not `.hint`.
- Preserve generic `small`, grouped widths, every other global rule, components, routes, data and localization.
- Exclude form edits/saves, operational mutations, dependencies, shared-component redesign and final regression.

## Baseline and approach

- Fresh tracked exact search finds only the three definitions; no direct consumers.
- Recheck dynamic-class candidates and mounted DOM before deletion.
- Remove dead styling, not replace it with wrappers or new styles.
  Existing PrimeNG validation/help remains unchanged; no smart/presentational extraction earns its place here.
- Template utility usage remains unchanged; three SCSS rules and their comments are the entire application scope.

## Implementation checklist

- [x] Confirm prerequisite, clean current branch and mounted stylesheet/reference consumer.
- [x] Recheck direct/dynamic consumers and served CSS.
- [x] Retire only the unused rules/comments, preserving generic hints and native required semantics.
- [x] Compare light/dark hints and required controls at 390px/1440px before/after.
- [x] Format scoped changes and run app lint/build.
- [x] Record evidence and pending review in the backlog.

## Acceptance and verification

- [x] Served CSS no longer includes the three selectors.
- [x] Generic hint computed styles and required-control semantics match before/after.
- [x] Native keyboard tab/theme interaction remains usable in sampled layouts.
- [x] No new styles, colors, utilities, dependencies or component abstractions.
- [x] Relevant existing Nx lint/build checks pass; app has no test target.
- [x] User approval with disclosed limits; full visual review remains unperformed.
- [ ] Full cross-route visual, contrast, screen-reader, state, locale and SSR/hydration regression.

## Evidence and handoff

- Fresh `git grep` finds only definitions at lines 56, 61 and 68 in the global stylesheet.
- `npx nx show project app --json` confirms mounted stylesheet, lint/build targets and no test target.
- Existing navigation `InvalidStateError: Transition was aborted because of invalid state` recurs before changes.
- Node aggregation of 1,309 tracked HTML/TS/JS/MJS/SCSS/CSS/JSON files reproduces three definitions.
  Required/hint class bindings, static classes and object-key candidates find only unrelated translation/generated
  type keys beyond those definitions. No discovered class consumer. Arbitrarily computed/external markup is not
  exhaustively excluded by these bounded searches.
- Served recursive CSSOM before: all three candidate rules plus generic `small`; after: only generic `small`.
  All four light/dark 390px/1440px samples have zero candidate DOM matches.
  Cross-origin font stylesheet inspection reports `SecurityError`, not a clean exhaustive CSSOM pass.
- Both visible settings hints retain 13px text, their theme-resolved muted colors and ARIA descriptions.
  Exact before/after geometry matches: narrow x=48.25, width=278.5, height=32, y=649.25/804.75;
  wide x=114.25, width=598.75, height=16, y=528.75/668.25.
  Dates hints also exist in hidden tab DOM; their zero-sized boxes are not visible-state evidence.
- Information inputs `name` and `season` retain native required properties and associated labels in all four
  after cases, matching the initial information baseline. No field values edited or validation/save triggered.
- Four native theme Enter toggles switch themes and retain the theme button's focus; keyboard Enter selects
  the information tab in each case. This is bounded keyboard evidence, not a complete focus/overlay audit.
- Narrow document overflow exists before and after; final bounded geometry identifies the already tracked
  DR-066 topbar: scroll width 424px, available width 375px at a 390px viewport.
  Main/page Card/tab widths fit. No new discovery ID or hidden overflow fix is needed.
- Restored home `/`, dark theme and original 1571 x 1272 viewport, Account visible and no dialogs.
  Existing navigation transition error recurs. No clean-console/auth-lifecycle claim.
- No screenshots/domain logs committed. Evidence is computed-style/geometry and keyboard sampling, not full visual review.

### Validation and remaining action

```powershell
git --no-pager grep -n -I -e 'error-text' -e 'label.required' -e 'small.hint' -- ':!docs' ':!.github'
npx nx show project app --json
npx prettier --write apps\app\src\styles.scss docs\design-refresh\work-items\DR-029k-unused-feedback-selectors.md docs\design-refresh\backlog.md
npx nx run-many -t lint build -p app --output-style=static
```

- Fresh source checks pass as described above. App lint/build and 29 prerequisite tasks pass (exit 0).
  App has no test target; no tests added for dead-CSS deletion.
- Scoped Prettier write/check and `git diff --check` pass.
  Node validation confirms LF/frontmatter, 471 local link targets, exactly three changed files and an exact
  application delta of only the three rules/comments. Initial validator incorrectly trimmed porcelain's leading
  status whitespace and failed its scope assertion; corrected parsing passes. No application fix was required.
- Full visual review, contrast, screen-reader, loading/error/disabled/permission states, locale switching and
  exhaustive cross-route SSR/hydration regression not run. Existing DR-066 and inherited findings remain open.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 34 targets, 22 pass and twelve
  reproduce historical `@nx/dependency-checks` failures: `backend-seo`, `backend-health`, `shared`, `i18n`,
  `backend-authorization`, `backend-ranking`, `backend-search`, `utils`, `backend-translate`,
  `backend-database`, `frontend-modules-translation`, `backend-graphql`. No unrelated manifest fixes.
- On 2026-11-27 the user selected `Approve with documented limits and commit` and `Nothing else`.
  Resulting backlog status: Done by explicit approval with disclosed limits. Unperformed visual/accessibility/state/
  locale/workflow/SSR checks remain unchecked; historical workspace lint failures and DR-066 remain unresolved.
  Approval covers only this stylesheet/brief/backlog on existing `main`; no push.
- Exact next invocation: separately scope remaining global pair-value/toolbar/Card-flush consumer inventory
  under DR-029; no next implementation slice started.
- Exceptions: none. No second implementation slice.
