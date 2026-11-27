---
title: 'DR-029f: Unused spacing token retirement'
description: 'Retire eight unmatched spacing properties and preserve radius overrides consumed by Tailwind.'
---

## Identity and scope

- Parent: DR-029; prerequisite: approved [DR-029e inventory](DR-029e-spacing-radius-inventory.md).
- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Project: `app`. Change only the [theme stylesheet](../../../apps/app/src/styles/theme.scss):
  remove `--space-1` through `--space-8` and their obsolete section comment.
  Correct the radius comment to identify generated Tailwind consumers; retain all four radius values.
- Actual mounted consumer: home at `http://localhost:3000/` loads
  [global styles](../../../apps/app/src/styles.scss), which imports the stylesheet.
  Resolved `app:build` confirms that entry; all supplied feature routes share it.
- Preserve radius overrides, win/loss/rank-gradient properties, qualification typography, native PrimeNG/Tailwind
  infrastructure, every other global rule, routes, data, permissions, localization and behavior.
- Exclude components, unused screens, preset changes, services, dependencies, operational mutations
  and final cross-route regression. No consumer is added just for redesign verification.
- Started on existing `main`, 2026-11-27, with a clean worktree; no branch/worktree switch.

## Baseline and approach

- Fresh exact tracked search outside documentation/instructions finds twelve definitions, no literal readers.
  Focused indirect-reader search for `space-`, `radius-`, `getPropertyValue`, `setProperty`
  and `@property` finds only the same definitions in non-template source.
- Capture home in light/dark at 390px/1440px and all six supplied feature routes in dark wide
  before/after. Check actual computed geometry, spacing, radius and typography.
- Generated CSS reveals an indirect consumer missed by the literal-source inventory:
  Tailwind `rounded-lg/sm/xl` rules read `--radius-lg/sm/xl`; its theme defines all four radius names.
  Existing unlayered root values override those layered defaults. Restore all four radius values
  before final verification; their deletion would silently change rounding, including legacy/deferred utilities.
- Final slice removes only eight spacing declarations. No markup/utility change or new SCSS rule.
  Radius retirement now requires separately scoped DR-029g consumer/cascade investigation.
- No smart/presentational extraction is justified for unmatched global properties.

## Implementation checklist

- [x] Confirm prerequisite, mounted stylesheet, resolved targets and fresh consumer evidence.
- [x] Capture bounded before evidence.
- [x] Remove only eight unused spacing declarations; preserve radius overrides and correct their comment.
- [x] Confirm retained compatibility properties and qualification typography in emitted CSS.
- [x] Persist validation, exclusions and the exact next action.

## Acceptance and verification

- [x] No retired spacing production references or emitted CSS declarations remain.
- [x] App lint/build pass; record existing test-target availability.
- [x] Home geometry/style samples match in light/dark at 390px/1440px.
- [x] All six supplied routes receive bounded dark-wide before/after consumer checks.
- [x] Native theme Button keyboard activation and visible focus remain usable.
- [ ] Full cross-route visual/accessibility, workflow, locale and SSR/hydration regression.
- [x] User reviews retirement with disclosed verification limits.

## Evidence and handoff

### Consumer checks and corrected scope

```powershell
git --no-pager grep -n -P -e '(?<![\w-])(?:--space-[1-8]|--radius-(?:sm|md|lg|xl))(?![\w-])' -- . ':!docs' ':!.github' ':!.claude' ':!package-lock.json'
git --no-pager grep -n -E -e 'space-' -e 'radius-' -e 'getPropertyValue' -e 'setProperty' -e '@property' -- apps libs tools ':!*.md' ':!*.html' ':!*.spec.ts'
npx nx show project app --json
npx nx run-many -t lint build -p app --output-style=static
git --no-pager grep -n -P -e '(?<![\w-])--space-[1-8](?![\w-])' -- . ':!docs' ':!.github' ':!.claude' ':!package-lock.json'
```

- Initial exact/focused searches: twelve definitions each; no literal readers.
  Broader template-inclusive search: 103 matches, twelve definitions, all other matches layout/whitespace utilities.
  An initial counting helper used PowerShell's reserved `$Matches`; discarded its output and reran with `$lines`.
- Initial emitted-CSS assertion expecting zero radius names fails: seven Tailwind definitions/readers remain.
  Investigating the emitted CSS exposes the radius collision, not evidence that the build failed.
  Restore all four overrides; rerun formatting, app checks and browser checks on the corrected scope.
- Built CSS defines Tailwind radius defaults `0.25rem`, `0.375rem`, `0.5rem`, `0.75rem`,
  plus retained unlayered app overrides `4px`, `8px`, `12px`, `20px`.
  It contains generated `rounded-lg/sm/xl` readers. Tracked utility users include bracket-tree,
  recent-games-team, team-encounters, qualification-draw, match-row and upcoming-match.
  This is consumer/cascade evidence, not a claim that every listed component is mounted.
  Do not redesign unused components or remove their dependencies here.
- Correct the approved DR-029e inventory's factual radius-retirement guidance without changing its historical approval.
  DR-029g is a separate investigation candidate, not an implementation or authorization to remove radius overrides.
- Final exact spacing search returns zero matches (expected exit 1); built CSS contains zero spacing names.
  Retained win/loss declarations occur twice each; rank-gradient, eyebrow token and `.t-eyebrow` occur once each.
  All four radius overrides remain alongside Tailwind defaults. No new styling exception.
- Final app lint/build: pass, exit 0; 31 successful tasks including dependencies, 29 cached.
  Existing `app` targets have no test target; no new behavior test for dead spacing declarations.
- Scoped Prettier runs on all changed files; retain unchanged backlog table alignment after formatter spillover.
  Gradient wrapping changes only through the formatter; its value is unchanged.
  `git diff --check`, LF/frontmatter, 515 local links, registry/four-file scope and unchanged historical
  inventory checkboxes: pass. Link checker rerun excludes fenced regex examples from link parsing.
  Unrelated backlog table rows retain their existing formatting; Git CRLF warnings do not reflect actual file bytes.

### Browser evidence

- Before/after home: light/dark at 390px/1440px, height 1000px, twelve rows and no page overflow.
  Heading, first Card/body, first cell and native Tag rectangles, fonts, weights, colors, backgrounds,
  padding, gaps and radii match. Wait for the authenticated ranking link and twelve rows before sampling.
- Narrow heading: `[102.5,157.5,240,32.8125]`; wide: `[161,121,1173,39.375]`.
  Narrow Card/body: `[14,114.5,347,546.3125]` / `[15,115.5,345,544.3125]`.
  Wide Card/body: `[72.5,78,1280,307.875]` / `[73.5,79,1278,305.875]`.
  Card radius stays 20px; body padding/gap stays 17.5px/7px.
- Cell padding remains `10.5px 14px`; Tag radius/padding/gap remains `8px` / `3.5px 7px` / `3.5px`.
  Heading font remains 26.25px narrow, 31.5px wide, weight 600; cell 14px/400; Tag 12.25px/700.
  Heading/cell text remains light `oklch(0.14 0.02 250)`, dark `oklch(0.94 0.005 250)`.
  Card remains light `oklch(1 0 0)`, dark `oklch(0.22 0.018 250)`.
  After: eight spacing values empty; radius values remain `4px`, `8px`, `12px`, `20px` in both themes.
- All six supplied feature URLs sampled in dark at 1440px/1000px:
  competition, player, club, new tournament, imported finished tournament and assembly with supplied query.
  Heading/Card/body/Tag dimensions and styles match every recorded sample; club/assembly cell samples match too.
  Club/assembly sampled row counts remain 45/9. Other sampled routes have no first cell.
  No full dataset, all-tab, overlay or workflow equality claim.
- Four Enter checks toggle the native theme Button, update its accessible name and retain
  active `:focus-visible` with native `auto` outline. An initial immediate check raced theme/focus rendering;
  rerun waits for the target theme and visible native outline and passes.
  Restore home URL, original dark preference and 1571 x 1272 geometry.
- Navigation `InvalidStateError` transition-abort console errors occur before and after; no clean-console claim.
  No operational/admin mutations, dependencies, service lifecycle or branch/worktree changes.
  No screenshots or private logs committed.

### Review and exact next action

- On 2026-11-27 the user selected `Approve with documented limits and commit` and `Nothing else`.
  Resulting status: Done by explicit approval of the eight-token retirement and disclosed limits.
  Full regression remains unchecked; approval does not claim unperformed checks passed.
  Commit only this child and directly related handoff/inventory correction; do not push.
- Full cross-route visual/contrast, screen-reader/touch, loading/error/permission workflows,
  locale and SSR/hydration regression remain unchecked. Qualification branch not exercised.
  Inherited DR-033/034/076 findings and historical workspace dependency-check failures remain open.
  Required `npx nx run-many --target=lint --output-style=static`: fails, exit 1; 22 of 34 targets pass.
  Twelve reproduce historical `@nx/dependency-checks` failures: `backend-health`, `backend-seo`,
  `backend-authorization`, `shared`, `backend-ranking`, `i18n`, `backend-translate`, `backend-search`,
  `utils`, `backend-database`, `frontend-modules-translation`, `backend-graphql`.
  No dependency manifest changed; no claim of resolving these accepted, out-of-scope failures.
- Exact next invocation: separately scope DR-029g radius utility-consumer/cascade investigation using fresh mounted-consumer
  checks and generated CSS; retain all radius values unless a separately reviewed change proves safe.
  DR-029 remains open; do not start that investigation or final regression in this invocation.
