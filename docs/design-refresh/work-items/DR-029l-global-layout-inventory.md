---
title: 'DR-029l: Remaining global layout selector inventory'
description: 'Inventory pair-value, Toolbar and Card-flush consumers before any global layout retirement.'
---

## Identity and scope

- Parent: DR-029; prerequisite: approved [DR-029k](DR-029k-unused-feedback-selectors.md).
- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Started on existing `main`, 2026-11-27, with a clean worktree; no new branch/worktree.
- Documentation-only inventory of `.pair-value-group`, its nested `.pair-value`, the Toolbar region
  overrides and `.p-card.card-flush > .p-card-body` in [global styles][styles].
- `npx nx show project app --json` confirms the mounted stylesheet; the shared browser renders home.
- Preserve every application file, styling rule, component, data operation and localization.
- Exclude selector retirement, component extraction, dependencies, operational mutations and final regression.

## Approach and checklist

- [x] Reconcile prerequisite, current branch and mounted global stylesheet.
- [x] Trace exact and likely dynamic references, separating mounted, conditional and unmatched consumers.
- [x] Inspect installed PrimeNG structure and native layout capabilities.
- [x] Sample actual consumer styles in light/dark at 390px/1440px without changing data.
- [x] Record retention decisions and the exact next action in the backlog.
- [x] Format and validate documentation.

## Acceptance and verification

- [x] Each candidate has a source-backed consumer/retention decision.
- [x] Browser evidence distinguishes rendered consumers from unverified branches.
- [x] Application styles, templates and utility usage remain unchanged.
- [x] User review of the inventory and disclosed limits.
- [ ] Full cross-route visual, accessibility, state, locale, workflow and SSR/hydration regression.

## Evidence and handoff

### Source inventory and decisions

| Candidate                                 | Evidence                                                                    | Decision                                                                  |
| ----------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `.pair-value-group`, nested `.pair-value` | Only two definitions; no discovered readers.                                | Separate retirement candidate DR-029m; retain in this inventory.          |
| Toolbar region `flex: 1`                  | Builder renders a native start region; native CSS does not set flex growth. | Retain start behavior; center/end have no discovered generated consumers. |
| `.p-toolbar-end` justification            | Neither current Toolbar template declares an end template.                  | Unmatched retirement candidate; do not delete with the used start rule.   |
| Card-flush body padding/gap               | Seven declarations in four templates, all with mounted application wiring.  | Retain the shared opt-in rule; removal would restore native body spacing. |

- Exact tracked `git grep` finds seven global selector lines, seven Card-flush template declarations,
  three test assertions and four Toolbar opening/closing lines. Tests are not consumer evidence.
- Node aggregation of 1,310 tracked HTML/TS/JS/MJS/SCSS/CSS/JSON files outside documentation/instructions
  reproduces those references. `pair-value`, `pair_value`, `pairValue` and `pairValueGroup` candidates
  find only the two stylesheet definitions. Arbitrarily computed/external class names remain unverified.
- [Root routes][root-routes] mount club, player, competition and tournament feature routes.
  [Club routes][club-routes] mount detail and team detail. [Club detail][club-detail] wires the
  permission-gated, idle-deferred builder and the idle-deferred schedule tab.
  [Builder][builder] declares only `#start`; [club schedule][club-schedule] renders shared
  [encounter cards][encounter] for played/upcoming matches. Team detail and competition draw routes
  also use this shared encounter component; these additional routes were not browser-sampled.
- [Player routes][player-routes] mount [player detail][player-detail], which renders upcoming/recent
  dispatchers with `type="player"`. Their player branches reach [upcoming][upcoming] and [recent][recent].
  Both have two Card-flush declarations for their distinct match branches.
- [Tournament routes][tournament-routes] mount admin and live/upcoming. [Admin][admin] gates
  [schedule][schedule] behind access checks. That Toolbar projects one ordinary full-width div;
  it declares no start/center/end templates, so current global region rules do not affect it.
  [Live upcoming][live-upcoming] renders [live game cards][live-card] in its game loop.
- Installed PrimeNG Toolbar template renders each region only when its corresponding template exists.
  Native root layout already supplies flex, wrapping, spacing and space-between justification.
  Region styling supplies display/align-items, not flex growth or end justification.
- Installed Card renders `.p-card-body` directly under its root and reads `card.body.padding`/`card.body.gap`.
  PrimeNG API documentation confirms these tokens and the Toolbar templates; there is no native flush input.
  No scoped token/passthrough binding or replacement wrapper is introduced.
- Existing shared encounter/live-game presentation already separates domain data from reusable markup.
  No additional smart/presentational extraction earns its place in a selector inventory.
  Templates, utility usage and all application styling remain unchanged; no new exception.

### Browser evidence

- Shared browser starts at home, dark theme, 1571 x 1272. Recursive served CSSOM confirms all candidate
  rules, including the compiled nested pair selector. The cross-origin font stylesheet reports
  `SecurityError`; this is not exhaustive stylesheet access.
- `/clubs/smash-for-fun?tab=team-builder`: settled visible native Toolbar has one start and no center/end
  regions in each sample. Start computes `flex: 1 1 0%`. Light/dark at 390px: Toolbar/start widths
  315.5px/292.5px; at 1440px: 911px/888px. No sampled Toolbar overflow.
  Initial hidden tab DOM was zero-sized and is not used as visible evidence.
- `/clubs/smash-for-fun?tab=schedule`: 120 Card-flush nodes in each sample, including hidden tab DOM.
  The first visible encounter body computes padding/gap 0px; content width equals body width.
  Light/dark at 390px: body 313.5 x 132px; at 1440px: 583.5 x 87.5px.
  This is bounded geometry evidence, not full visual review or dataset correctness.
- Initial schedule theme sampling read dark twice at 390px because the theme update had not settled.
  Repeated all four cases with `waitForFunction` checking the exact requested document theme; corrected
  samples above confirm both themes. No failed sample is counted as light-mode evidence.
- `/players/glenn-latomme`, dark 1440px: three upcoming and ten recent Card-flush nodes; first two
  sampled bodies have 0px padding/gap and 960.5px width. Individual alternate branches remain unverified.
- `/tournament/eaff3ce2-a7de-4a89-8ca2-4110bb5fe3b8/admin`: Planning has `aria-disabled="true"`;
  no schedule component mounted in this sampled phase. Did not bypass permissions/phase gates.
  Schedule's region-free structure is source evidence, not browser verification.
- `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/live/upcoming`, dark 1440px:
  four live game cards; all four bodies compute 0px padding/gap. No game or schedule mutations.
- No pair-value nodes in home or sampled club, player and live-upcoming DOM.
  No center/end Toolbar regions in the builder samples; conditional/external markup remains unverified.
- Restored home, dark theme, original 1571 x 1272, Account visible and no dialogs.
  Existing navigation `InvalidStateError` recurs; initial club navigation also reports an aborted GraphQL read.
  No clean-console, exhaustive authentication or SSR/hydration claim.
- No screenshots, domain records or browser logs committed. No before/after styling comparison is needed:
  this slice changes documentation only.

### Validation and remaining action

```powershell
git --no-pager grep -n -I -e 'pair-value' -e 'card-flush' -e 'p-toolbar' -- ':!docs' ':!.github'
npx nx show project app --json
npx prettier --write docs\design-refresh\work-items\DR-029l-global-layout-inventory.md docs\design-refresh\backlog.md
npx prettier --check docs\design-refresh\work-items\DR-029l-global-layout-inventory.md docs\design-refresh\backlog.md
git diff --check
```

- Source aggregation and mounted browser checks pass with the limits above.
  Initial exact accessible-name click timed out; regex matching the observed decorated tab name succeeded.
  Initial combined PrimeNG metadata request was rejected; separate Toolbar/Card requests succeeded.
- Scoped Prettier write/check and `git diff --check` pass. Node validation confirms LF/frontmatter,
  536 local link targets, the authoritative Review row and exactly two changed documentation files.
  Git warns about future LF-to-CRLF conversion for the backlog; current file bytes remain LF.
- Application build/tests not run: documentation-only inventory.
  Required pre-commit `npx nx run-many --target=lint --output-style=static` exits 1:
  22 of 34 targets pass, including app; twelve reproduce historical `@nx/dependency-checks` failures:
  `backend-health`, `backend-seo`, `shared`, `backend-ranking`, `backend-search`, `i18n`,
  `backend-authorization`, `backend-translate`, `utils`, `backend-database`,
  `frontend-modules-translation`, `backend-graphql`. No unrelated dependency fixes.
  Full visual, contrast, keyboard/focus, screen-reader, state, locale, workflow and SSR/hydration regression
  not run. Inherited DR-029 findings remain open.
- On 2026-11-27 the user selected `Approve inventory with documented limits and commit` and `Nothing else`.
  Resulting backlog status: Done by explicit approval of this documentation-only inventory with disclosed limits.
  Unperformed full visual/accessibility/state/locale/workflow/SSR checks remain unchecked; no retirement approved.
  Commit scope is only this brief/backlog on existing `main`; no push.
- Exact next invocation: separately scope DR-029m to recheck and retire only the unmatched pair-value rule.
  Toolbar center/end cleanup needs its own fresh generated-consumer check; retain used start and Card-flush.
  DR-029 stays open; no second slice started.

[styles]: ../../../apps/app/src/styles.scss
[root-routes]: ../../../apps/app/config/app.routes.ts
[club-routes]: ../../../libs/frontend/pages/club/src/lib.routes.ts
[club-detail]: ../../../libs/frontend/pages/club/src/pages/detail/page-detail.component.html
[builder]: ../../../libs/frontend/pages/club/src/pages/detail/tabs/club-team-builder-tab.component.html
[club-schedule]: ../../../libs/frontend/pages/club/src/pages/detail/tabs/club-schedule-tab.component.html
[encounter]: ../../../libs/frontend/components/games/encounter-card/src/encounter-card.component.html
[player-routes]: ../../../libs/frontend/pages/player/src/lib.routes.ts
[player-detail]: ../../../libs/frontend/pages/player/src/pages/detail/page-detail.component.html
[upcoming]: ../../../libs/frontend/components/games/upcoming/src/player/upcoming-games-player.component.html
[recent]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.html
[tournament-routes]: ../../../libs/frontend/pages/tournament/src/lib.routes.ts
[admin]: ../../../libs/frontend/pages/tournament/src/pages/admin/page-admin.component.html
[schedule]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/schedule/schedule-tab.component.html
[live-upcoming]: ../../../libs/frontend/pages/tournament/src/pages/live-upcoming/page-live-upcoming.component.html
[live-card]: ../../../libs/frontend/pages/tournament/src/components/live-game-card/live-game-card.component.html
