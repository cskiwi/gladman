---
title: 'DR-029c: Unused Chip/Tag modifier retirement'
description: 'Remove proven-unused global Chip/Tag modifiers without changing mounted presentation.'
---

## Scope and dependencies

- Parent: DR-029; completed DR-029a/b establish prior inventory and retirement boundaries.
- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Project: `app`. Only application edit: [theme stylesheet](../../../apps/app/src/styles/theme.scss).
- The mounted home route loads [global styles](../../../apps/app/src/styles.scss), which imports this stylesheet.
  Resolved `app:build` includes that global entry. Root [routes](../../../apps/app/config/app.routes.ts)
  mount home and the supplied feature areas.
- Remove `.p-chip.g-chip--primary`, `.p-chip.g-chip--win`, `.g-tag__dot`,
  `.g-tag--live .g-tag__dot` and their private `g-pulse` keyframes.
- Exclude all tokens, `.t-eyebrow`, other global rules, components, routes, services, data and dependencies.
  No live component uses these modifiers; do not add a consumer or smart/presentational wrapper for dead CSS.

## Baseline and approach

- Fresh exact tracked search on 2026-11-27, outside documentation/instructions, found definitions only.
  Search includes templates, TypeScript and styles, not just exported components.
- Shared home browser mounted at `http://localhost:3000/`, dark, 1571 x 1272, with zero matching modifier nodes.
- Delete only the unmatched rules and their section comment. Native PrimeNG Chip/Tag appearance stays untouched.
- Token references still exist in legacy component styles; tokens stay unchanged regardless of mounted status.
  Retain conditional qualification typography. Runtime-generated/external content is not exhaustively proven.

## Implementation checklist

- [x] Confirm mounted global stylesheet and fresh exact tracked modifier/animation references.
- [x] Capture bounded before/after mounted evidence.
- [x] Remove only the unused modifier rules and private animation.
- [x] Preserve all tokens, native Chip/Tag styling and other global rules.
- [x] Persist validation, exclusions and exact next action.

## Acceptance and verification

- [x] No production modifier/animation references remain; emitted CSS contains none.
- [x] Emitted CSS retains qualification typography and excluded tokens.
- [x] App lint/build pass; record exact commands and available test targets.
- [x] Sampled mounted home geometry/typography remains unchanged in light/dark at 390px/1440px.
- [x] Supplied feature routes receive a bounded read-only consumer smoke check.
- [x] Sampled native theme controls remain keyboard accessible with visible focus.
- [ ] Full cross-route visual/accessibility, workflow, locale and SSR/hydration regression.
- [x] User reviews removal with disclosed verification limits.

## Evidence and handoff

Initial exact tracked search:

```powershell
git --no-pager grep -n -P -e '(?<![\w-])(?:g-chip--primary|g-chip--win|g-tag__dot|g-tag--live|g-pulse)(?![\w-])' -- . ':!docs' ':!.github'
```

- Result: six matches, all in the stylesheet (four selectors, animation read and keyframe definition).
- `npx nx show project app --json`: global styles confirmed; lint/build available, no app test target.
- Utility usage: no templates change. No new SCSS, color, wrapper, abstraction or exception.

### Application validation

- `npx prettier --write apps\app\src\styles\theme.scss docs\design-refresh\backlog.md
docs\design-refresh\work-items\DR-029c-unused-chip-tag-modifiers.md`: pass.
  Preserved 254 unchanged backlog table rows and the original gradient formatting after formatter-only spillover.
  Final application change deletes only the 43-line unused modifier section; no token or native component change.
- `npx nx run-many -t lint build -p app --output-style=static`: pass, exit 0.
  31 successful tasks including dependencies, 29 cached; app build runs and emits the changed global CSS.
  Repeated after preserving unrelated original formatting: pass, 31 successful tasks, 29 cached.
- `git diff --check`: pass. Final LF/frontmatter and 454 existing local link targets pass across this
  brief and the backlog. Only the stylesheet, this child brief and its backlog handoff are changed.
- Repeated exact tracked search: zero production modifier/animation references.
  Regex inspection of `dist\apps\app\browser\styles.css`: zero retired names.
  `.t-eyebrow`, its token, all seven `--g-*` tokens, eight spacing tokens and four radius tokens remain.
- No `app:test` target exists. No tests added for deletion of unused CSS; no application behavior changed.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: fails, exit 1.
  22 of 34 targets pass; twelve reproduce the historical `@nx/dependency-checks` failures:
  `backend-seo`, `backend-health`, `shared`, `i18n`, `backend-authorization`, `backend-ranking`,
  `backend-translate`, `backend-search`, `utils`, `backend-database`, `frontend-modules-translation`,
  `backend-graphql`. No dependency manifest changed; these are outside this approved slice.

### Browser evidence

Used the existing integrated browser with read-only route navigation and the existing theme control.
No fixtures, operational/admin mutations, private screenshots or logs were committed.

| Home sample                          | Before and after, identical                                                 |
| ------------------------------------ | --------------------------------------------------------------------------- |
| 390px heading                        | 26.25px / 600; x=102.5, y=157.5, w=240, h=32.8125                           |
| 1440px heading                       | 31.5px / 600; x=161, y=121, w=1173, h=39.375                                |
| 390px first cell                     | 14px / 400; x=32.5, y=815.8125, w=63.84375, h=39                            |
| 1440px first cell                    | 14px / 400; x=91, y=523.875, w=109.828125, h=39                             |
| First native Tag                     | 12.25px / 700; w=82.453125, h=24.5                                          |
| Heading/cell text                    | Light `oklch(0.14 0.02 250)`; dark `oklch(0.94 0.005 250)`                  |
| Tag text/background                  | Light `rgb(21,128,61)` / `rgb(220,252,231)`; dark green / translucent green |
| Rows / retired nodes / page overflow | 12 / 0 / none in all four cases                                             |

- Home measurements use 390px and 1440px widths, 1000px height, 1500ms resize and 500ms theme settling.
  Native Tag positions also match: x/y=32.5/344.8125 narrow, 91/314.875 wide.
  Dark Tag text is `rgb(134,239,172)`, background `color(srgb 0.133333 0.772549 0.368627 / 0.16)`.
- All six supplied feature URLs mount their real headings before/after in dark 1440px:
  competition, player, club, new tournament, imported finished tournament and parameterized assembly.
  Heading/first native Tag font, color, background and geometry match; sampled club/assembly first cells match.
  Five headings remain 31.5px / 600; assembly remains 21px / 600.
  No retired modifier nodes or page overflow. No `.p-chip` nodes sampled; no native Chip visual pass claimed.
- Club row counts differ (70 before, 45 after) during asynchronous section loading.
  This bounded heading/Tag/first-cell consumer check does not prove settled dataset equality or all-tab behavior.
  No CSS was responsible for row loading; services, templates and data are unchanged.
- Four theme/width cases: native theme Button focus + Enter flips theme, updates its accessible name
  and retains active focus with `:focus-visible` and `auto` outline.
  An initial check timed out because its locator used the old name after activation; a stable role/name
  pattern fixes the test, and all four final cases pass. This was a test-locator issue, not a product fix.
- Navigation emits existing `InvalidStateError: Transition was aborted because of invalid state` before/after;
  a baseline navigation-time GraphQL `net::ERR_ABORTED` also appears. No clean-console claim.
- Restored home URL, dark preference through the native control, and original 1571 x 1272 viewport.
  No service started, stopped or restarted; no branch/worktree switch.

### Limits and exact next action

- No template utilities change; no extra abstraction, smart/presentational split or styling exception.
- Qualification branch preserved in source/emitted CSS, not exercised.
- Full feature theme/width and screenshot/contrast review, screen-reader/touch, interaction states,
  workflows, locales and SSR/hydration regression remain unperformed.
  Inherited DR-033/034/076 and historical workspace dependency-check failures remain open.
- On 2026-11-27 the user selected `Approve with documented limits and commit` and `Nothing else`.
  Status is Done by explicit approval; the full regression checklist remains unchecked.
  Approval accepts the bounded browser coverage and disclosed historical failures, not a claim they passed.
- Commit only this approved child implementation and repository handoff; do not push.
- Exact next invocation: scope DR-029d for remaining unused palette/gradient tokens using fresh tracked
  consumer evidence. This candidate is not started. Retain referenced tokens and qualification typography;
  do not redesign unused components or treat this child as final cross-route regression.
