---
title: 'DR-029m: Unused pair-value rule retirement'
description: 'Recheck and retire only the unused global pair-value layout block.'
---

## Identity and scope

- Parent: DR-029; prerequisite: approved [DR-029l](DR-029l-global-layout-inventory.md).
- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Started on existing `main`, 2026-11-27, with a clean worktree; no new branch/worktree.
- Affected project: `app`. Resolved Nx build options mount [global styles][styles].
- Remove only `.pair-value-group` and its nested `.pair-value` layout rule after fresh consumer checks.
- Preserve Toolbar, Card-flush, generic small, grouped form widths, tokens and every component.
- No unused component redesign or new consumer. No dependencies, operational mutations or second slice.
- Existing shared presentation needs no smart/presentational extraction for dead CSS retirement.

## Implementation checklist

- [x] Reconcile prerequisite, current branch and mounted stylesheet.
- [x] Recheck exact and likely dynamic pair-value references in tracked application source.
- [x] Capture bounded browser baseline with safe read-only navigation.
- [x] Remove only the unused block; preserve all excluded styling and behavior.
- [x] Verify emitted CSS and relevant browser comparisons.
- [x] Format changed files and run focused Nx validation.
- [x] Persist evidence, review limits and next action.

## Acceptance and verification

- [x] Fresh consumer inventory finds no current pair-value readers.
- [x] Removed selectors are absent from served CSS; retained layout overrides remain.
- [x] Light/dark 390px/1440px home geometry and supplied dark-wide route samples match.
- [x] Native theme control keyboard activation and focus remain usable.
- [x] No template/utility changes, new colors, SCSS rules or styling exceptions.
- [x] App lint/build pass; test target availability recorded.
- [x] User review of the result and disclosed limits.
- [ ] Full cross-route visual, contrast, screen-reader, state, locale, workflow and SSR/hydration regression.

## Evidence and handoff

### Source and changed scope

- Fresh exact tracked search finds only the two stylesheet definitions.
  Node aggregation over 1,310 tracked HTML/TS/JS/MJS/SCSS/CSS/JSON files outside documentation/instructions
  also finds only these definitions, using `pair[\s_-]*value|pairValue` case-insensitively.
  Arbitrarily computed or external class names remain unverified.
- `npx nx show project app --json` confirms the mounted stylesheet and app lint/build; no app test target.
- Removed only the eleven-line pair-value block. All other stylesheet bytes are preserved.
  No template/utility changes, new SCSS rules, components, colors or styling workarounds.
- Preserve the used Toolbar start behavior, unmatched center/end rules, Card-flush, form widths and small.
  There is no new PrimeNG equivalent: an unused layout helper does not need a replacement.
- Existing shared domain presentation remains unchanged; no smart/presentational extraction earns its place here.
  Exceptions: none. Inherited DR-029 findings remain open.

### Browser evidence

- Before removal, recursive served CSSOM exposes both pair-value selectors and retained Toolbar/Card-flush rules.
  After removal, neither pair-value selector is present; retained rules have identical declarations.
  The cross-origin font stylesheet reports `SecurityError`; no exhaustive stylesheet-access claim.
- Home before/after comparisons match exactly in light/dark at 390px/1440px, height 1000px:
  heading geometry/font, first three table cells' geometry/font/padding, twelve body rows and no page overflow.
  At 390px the heading is 240 x 32.8125px with 26.25px font; at 1440px it is 1173 x 39.375px with 31.5px font.
  Table cell height is 39px and padding is 10.5px 14px in all samples. No pair-value nodes.
- All six user-supplied feature URLs were compared before/after in dark at 1440 x 1000px:
  competition, player, club, new tournament, finished tournament and the exact assembly query.
  First two visible heading metrics and sampled Card-flush/Toolbar-region metrics match exactly.
  Player's first two visible flush bodies remain 960.5 x 98.5px with 0px padding/gap.
  Other sampled default routes have no visible flush bodies or Toolbar start regions.
  No pair-value nodes in any sample. This is bounded geometry evidence, not dataset or full-tab verification.
- Native theme Button Enter activation, focused state and nonzero native outline pass all four home cases.
  Theme updates are awaited by checking the exact requested document class.
- Navigation reports pre-existing `InvalidStateError`; one aborted GraphQL read occurs.
  Initial return-home snapshot briefly shows Inloggen during auth reload; waited for Account before comparisons.
  No clean-console or exhaustive auth/SSR claim; no operational/admin mutations.
- Returned to home, dark theme, Account visible, no dialogs and documented 1571 x 1272 baseline viewport.
  The browser initially reports a null viewport override, so exact original viewport dimensions were not captured.
  Temporary measurement sessionStorage entries were removed. No screenshots or domain records committed.

### Validation and remaining action

```powershell
git --no-pager grep -n -I -i -e 'pair-value' -e 'pair_value' -e 'pairValue' -- ':!docs' ':!.github'
npx nx show project app --json
npx prettier --write apps\app\src\styles.scss docs\design-refresh\work-items\DR-029m-unused-pair-value.md docs\design-refresh\backlog.md
npx nx run-many -t lint build -p app --output-style=static
npx prettier --check apps\app\src\styles.scss docs\design-refresh\work-items\DR-029m-unused-pair-value.md docs\design-refresh\backlog.md
git diff --check
```

- App lint/build pass: 31 successful tasks including dependencies, 29 cached.
  Existing ineffective-dynamic-import warnings in sync-admin/admin remain; no unrelated fixes.
- Automated checks confirm the stylesheet differs from HEAD only by the intended block removal,
  compiled CSS excludes pair-value and retains Toolbar/Card-flush, and LF/frontmatter plus 523 local links pass.
- Scoped Prettier write/check and `git diff --check` pass; only stylesheet/brief/backlog are changed.
  Git warns about future LF-to-CRLF conversion; current edited file bytes are LF.
- No app test target; no new behavior test added for an unused CSS rule.
- Required pre-commit `npx nx run-many --target=lint --output-style=static` exits 1:
  22 of 34 targets pass, including app; twelve reproduce historical `@nx/dependency-checks` failures:
  `backend-seo`, `backend-health`, `shared`, `backend-authorization`, `backend-translate`,
  `backend-ranking`, `utils`, `i18n`, `backend-search`, `backend-database`,
  `frontend-modules-translation`, `backend-graphql`. No unrelated dependency fixes.
- Full visual, contrast, screen-reader, state, locale, workflow and SSR/hydration regression not run.
  Inherited findings stay open; neither geometry checks nor a build establish those outcomes.
- On 2026-11-27 the user explicitly requested `commit`, approving completion with the disclosed limits.
  Resulting backlog status: Done. Unperformed full regression remains unchecked; no new verification claim.
  Approved commit scope: only this stylesheet/brief/backlog on existing `main`; no push.
- Exact next invocation: separately scope DR-029n Toolbar center/end generated-consumer verification; not started.
  Retain used start behavior and Card-flush. DR-029 stays open.

[styles]: ../../../apps/app/src/styles.scss
