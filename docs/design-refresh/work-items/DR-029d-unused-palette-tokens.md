---
title: 'DR-029d: Unused palette and gradient token retirement'
description: 'Remove four unreferenced global tokens while retaining all compatibility consumers.'
---

## Scope and dependencies

- Parent: DR-029; completed DR-029a/b/c establish inventory and retirement boundaries.
- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Project: `app`. Application scope: [theme stylesheet](../../../apps/app/src/styles/theme.scss).
- Mounted home and supplied feature routes load [global styles](../../../apps/app/src/styles.scss),
  which imports this stylesheet. Resolved `app:build` confirms the entry.
- Remove only `--g-accent-muted`, `--g-win-muted`, `--g-loss-muted`, `--g-gradient-primary`,
  including their light overrides and now-obsolete section comments.
- Retain `--g-win`, `--g-loss`, `--g-gradient-rank`, qualification typography, spacing and radius tokens.
- Exclude components, theme preset, other global overrides, routes, services, translations and dependencies.
  Do not redesign unused components or add consumers. No smart/presentational split is justified for unused tokens.

## Baseline and approach

- Started on existing `main`, 2026-11-27, with a clean worktree; no branch/worktree switch.
- Fresh exact tracked search outside documentation/instructions returns seven definitions of the four candidates,
  all in the global theme stylesheet. No reads or dynamic name fragments found in the broader `--g-` search.
- Referenced tokens remain in legacy hero-stat-value, match-row and rank-spark styles.
  Their mounted status does not authorize removing their dependencies in this slice.
- Existing integrated browser home is mounted in dark presentation. Capture four theme/width home samples
  and dark-wide samples on all six supplied feature URLs before/after.
- Delete unused declarations only; preserve native PrimeNG appearance and retained token values.
  No template utility changes, new styling, dependency, abstraction or exception.

## Implementation checklist

- [x] Confirm mounted stylesheet, resolved app targets and fresh exact tracked token references.
- [x] Capture bounded before evidence.
- [x] Remove only the unreferenced declarations and obsolete comments.
- [x] Preserve all referenced tokens and qualification typography.
- [x] Persist validation, exclusions and exact next action.

## Acceptance and verification

- [x] No retired production token references or emitted CSS declarations remain.
- [x] Emitted CSS retains referenced tokens and qualification typography.
- [x] App lint/build pass; record available test targets.
- [x] Settled home geometry/typography matches in light/dark at 390px/1440px.
- [x] Supplied feature routes receive bounded dark-wide before/after consumer samples.
- [x] Native theme control retains keyboard activation and visible focus.
- [ ] Full cross-route visual/accessibility, workflow, locale and SSR/hydration regression.
- [x] User reviews removal with disclosed verification limits.

## Evidence and handoff

```powershell
git --no-pager grep -n -P -e '(?<![\w-])(?:--g-accent-muted|--g-win-muted|--g-loss-muted|--g-gradient-primary)(?![\w-])' -- . ':!docs' ':!.github'
git --no-pager grep -n -e '--g-' -- apps libs tools ':!*.spec.ts'
npx nx show project app --json
```

- Exact search: seven candidate definitions, no external references. Broader search confirms retained readers.
- `app` has lint/build and no test target. No behavior tests planned for unused declarations.
- Before home samples: twelve rows, no page overflow; heading 26.25px/600 narrow and 31.5px/600 wide;
  first cell 14px/400; native Tag 12.25px/700, 82.453125 x 24.5.
- Six feature headings and first native Tags sampled in dark 1440px, without operational mutations.
  Club/assembly also have first-cell samples; other sampled routes have no table cell.
- Initial browser helper could not restore `page.viewportSize()` because the integrated browser returned null.
  Repeated baseline succeeds with explicit viewport; restore the previous handoff's 1571 x 1272 geometry.

### Application validation

- Scoped `npx prettier --write` on the stylesheet, backlog and this brief: pass.
  Preserve unrelated original table alignment and retained gradient wrapping after formatter-only spillover.
- `npx nx run-many -t lint build -p app --output-style=static`: pass, exit 0;
  31 successful tasks including dependencies, 29 cached. App build emits the changed CSS.
  Repeated after preserving original formatting: pass, same task/cache counts.
- `git diff --check`: pass. LF/frontmatter and 455 local link targets across brief/backlog pass.
  Preserved 256 unchanged table rows. Final application diff: one comment replacement and 15 deleted lines.
  Only the stylesheet, this brief and backlog are changed.
- Repeated exact tracked search: zero retired production names.
  `dist\apps\app\browser\styles.css`: zero occurrences of all four retired names;
  retained win/loss declarations occur twice each, rank-gradient once, and `.t-eyebrow` once.
- No `app:test` target; no behavior test added for unused declarations.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: fails, exit 1.
  22 of 34 targets pass; twelve reproduce historical `@nx/dependency-checks` failures:
  `backend-health`, `shared`, `backend-seo`, `backend-authorization`, `i18n`, `backend-ranking`,
  `backend-translate`, `utils`, `backend-search`, `backend-database`, `frontend-modules-translation`,
  `backend-graphql`. No dependency manifest changed; these remain outside this approved slice.
- No dependency or operational changes, no service started/stopped/restarted, no branch/worktree switch.

### Browser evidence and limits

- After home samples match every recorded font, weight, color, background and rectangle in four cases.
  Runtime computed values for all four retired properties are empty in both themes.
- Narrow heading rectangle: x=102.5, y=157.5, w=240, h=32.8125;
  wide: x=161, y=121, w=1173, h=39.375.
  First cell narrow: x=32.5, y=815.8125, w=63.84375, h=39;
  wide: x=91, y=523.875, w=109.828125, h=39.
- Heading/cell text: light `oklch(0.14 0.02 250)`, dark `oklch(0.94 0.005 250)`.
  Native Tag light text/background: `rgb(21,128,61)` / `rgb(220,252,231)`;
  dark: `rgb(134,239,172)` / `color(srgb 0.133333 0.772549 0.368627 / 0.16)`.
  Twelve rows and no page overflow throughout. Wait for authenticated ranking link before after measurements.
- All six supplied dark-wide feature heading/Tag font/color/background/width/height samples match exactly;
  club/assembly first-cell samples match too. No all-tab, settled dataset equality or full screenshot pass claimed.
- Four theme/width Enter checks toggle theme, update accessible name and retain active `:focus-visible`
  focus with native `auto` outline. Restore home URL, native dark preference and 1571 x 1272 geometry.
- Navigation-time GraphQL `net::ERR_ABORTED` observed; no clean-console claim.
  Full visual/contrast, screen-reader/touch, loading/error/permission workflows, locale and SSR/hydration
  regression remain unperformed. Qualification branch preserved in source/CSS, not exercised.
  Inherited DR-033/034/076 and historical workspace dependency-check failures remain open.
- No screenshots or private logs committed; no new styling exception or smart/presentational wrapper.
- On 2026-11-27 the user selected `Approve with documented limits and commit` and `Nothing else`.
  Status Done by explicit approval; full regression remains unchecked. Approval accepts the disclosed
  bounded browser coverage and historical failures, not a claim that unperformed checks passed.
  Commit only this implementation and handoff; do not push.
  Next invocation: separately scope one DR-029 spacing/radius consumer inventory, without retiring references
  or redesigning unused components. DR-029 remains open; no second slice started.
