---
title: 'DR-006m: Recent-game result and score evidence'
description: 'Reconcile historical result checks with the current mounted player-game presentation.'
---

## Identity and scope

- ID: DR-006m; authoritative status: [backlog](../backlog.md). Parent DR-006 stays open.
- Rules: [design refresh](../README.md). Dependencies: completed DR-006b/c and later card alignment.
- Documentation-only investigation on the existing `main` branch, starting from a clean worktree.
- Mounted consumer: `/players/glenn-latomme`, through [player detail][consumer] and the recent-game dispatcher.
- Inspect the [current template][template], [component][component], [tests][tests] and [component guide][guide].
- Preserve player-relative sides, numeric scores, points, routes, filters, loading and pagination.
- Exclude application edits, restoring result icons, shared encounter/bracket work, themes, services and dependencies.

## Baseline and approach

- DR-006b recorded success/secondary score Tags with winning check icons.
- DR-006c recorded explicit translated win/loss/unknown labels and metadata icons.
- Later commit `a78b0401` deliberately changes both contracts: only winning sets retain Tags, without icons;
  other scores become plain text, and the explicit result markup is removed.
  Its test changes assert this absence. The current component guide documents the same design.
- Reconcile those revisions against the mounted consumer before proposing any implementation.
  Do not treat historical contrast, icon, hidden-label or SSR checks as evidence for today's markup.
- No new smart/dumb split is warranted: this slice changes no presentation or behavior.
  Keep the existing data-owning player component; no one-to-one wrapper merely to relocate styling.

## Investigation checklist

- [x] Confirm the current branch, clean worktree and real mounted consumer.
- [x] Trace result/score differences to the later committed layout and its updated tests/documentation.
- [x] Record current mounted score/result behavior and its non-color meaning.
- [x] Distinguish current evidence from historical checks and unverified edge cases.
- [x] Format and validate the brief, parent handoff and backlog together.
- [x] Obtain review of the reconciliation and its disclosed limits.

## Acceptance and verification

- [x] Current player-relative scores and absence of separate result indicators are documented accurately.
- [x] Light/dark and narrow/wide observations distinguish geometry from visual/accessibility verification.
- [x] No application behavior, utilities, CSS, translations or dependencies change.
- [x] No claim equates signed ranking points or winning-set styling with an explicit overall result.
- [x] Exact validation results, limitations and the next action are persistent.

## Evidence and handoff

- Initial read-only mounted check, 2026-11-23: ten recent articles, 48 set-score cells, 24 winning Tags,
  no hidden result labels or result icons; dark theme, 1069px viewport, no document overflow.
- Commit `a78b0401` (`refactor(games): align recent and upcoming game cards`) removes the result markup,
  winning check icons and secondary score Tags. Six result tests change from asserting translated result
  indicators to asserting their absence, including missing winner/membership cases.
- DR-006f's 2026-10-21 completion approval concerns the upcoming-card slice; it does not explicitly approve
  the recent-result accessibility trade-off. The later committed source, guide and tests establish intent,
  but are not proof of separate user approval or accessibility verification.
- Current meaning: each side's numbers remain in set order. On mobile, each player's side sits beside
  its scores; desktop uses two score columns in the same side order as the player pairs.
  Numeric comparison supplies non-color set meaning even without the former check icon.
  Tag shape versus plain text also differs; do not describe the distinction as color alone.
- There is no separate visible or hidden overall win/loss/unknown result. The service still queries
  `winner`, and `didCurrentPlayerWin` still exists, but the current template does not consume it.
  Therefore this presentation does not explicitly communicate an authoritative overall outcome for
  missing scores, missing membership, retirements or other nonstandard results.
  Signed ranking points are not a substitute for that outcome.
- Existing score logic omits undefined/incomplete and 0-0 sets, preserves played zero and tied values,
  and defaults display ordering to team 1 when membership is missing. This is unchanged behavior,
  not a newly verified fallback policy. Keep it separate from an explicit unknown-result decision.
- Current DOM observations, 2026-11-23:

  | Width  | Theme | Articles | Score cells | Winning Tags | Result labels/icons | Document/card overflow |
  | ------ | ----- | -------- | ----------- | ------------ | ------------------- | ---------------------- |
  | 390px  | Light | 5        | 26          | 13           | 0 / 0               | None / none            |
  | 390px  | Dark  | 5        | 26          | 13           | 0 / 0               | None / none            |
  | 1440px | Light | 5        | 26          | 13           | 0 / 0               | None / none            |
  | 1440px | Dark  | 10       | 48          | 24           | 0 / 0               | None / none            |

- Each observed player-side element has a matching score-side element; score contents introduce no
  links, buttons or tabindex attributes. This is DOM correspondence, not a complete accessibility audit.
  Counts changed during the asynchronous breakpoint refresh; do not claim identical datasets across
  widths or establish the historical responsive-pagination issue as fixed or reproduced from this check.
- Inspected current first-card screenshots: light 390px and dark 1440px. The first is a populated
  two-set doubles game; mobile pairs the horizontal scores with their players, desktop retains columns.
  Opposite theme/width pairs have DOM evidence only. No before/after comparison is applicable because
  application source is unchanged. No screenshots containing player data were added to the repository.
  The first screenshot selector matched five Cards and failed strict selection; selecting the first
  matched Card explicitly succeeded. This was a capture error, not an application failure.
- Passed:

  ```powershell
  $env:NX_DAEMON='false'
  npx --no-install nx show project frontend-components --json
  npx --no-install nx run frontend-components:test --runInBand --testPathPatterns=recent-games-player.component.spec.ts --output-style=static
  ```

- Resolved test target is the existing Jest run-command. All 29 existing tests pass, one suite, no cache hit.
  Coverage includes player-side ordering, mobile pairing, played zero/tied/incomplete scores, points,
  deliberate result-icon absence for both sides/missing winner/membership, filters and placeholders.
  Tests were not added or changed merely to restate unchanged behavior.
- Not run: application build, because this changes only Markdown; existing checks are not a fresh
  build result. Required workspace lint was run after approval, as recorded below.
  Not verified: current contrast, full keyboard/focus traversal, touch, screen-reader
  output, alternate locales, authenticated SSR/hydration, full state/permission workflows or live
  missing/nonstandard results. Historical DR-006b/c contrast, result-label and SSR evidence is not current.
- An existing transition-aborted console error appeared on profile navigation; it was not investigated
  or claimed fixed by this documentation slice. No operations, fixtures, account/preference writes,
  dependencies, new browser/server processes or persisted theme changes were introduced.
- Utility/style comparison: no change. Native PrimeNG Cards and winning Tags, plain losing/tied values,
  existing semantic utilities and responsive layout remain exactly as committed.
- Result: reconciliation approved with its disclosed limits, not permission to propagate an accessibility claim.
  Keep DR-006b/c Done as historical approved work; this brief supersedes their current-markup assumptions.
  No new component extraction: the shared encounter's different data/interaction contract is outside scope;
  DR-006l already owns its alignment with the profile reference.
- Explicit approval, 2026-11-23: `Approve DR-006m with documented limits and commit`.
  This accepts completion of the documentation reconciliation and its disclosed absence of explicit
  overall results; it does not claim unperformed accessibility, nonstandard-result or SSR checks passed.
  DR-006m is Done; DR-006 remains open. Any later result-accessibility correction needs separate bounded scope.
- Exact next action: scope DR-006n's bracket score/connector contrast against its mounted consumer;
  do not begin it in this invocation. Commit only this approved documentation handoff, without a push.
- Documentation validation passed:

  ```powershell
  npx --no-install prettier --write docs\design-refresh\backlog.md docs\design-refresh\work-items\DR-006m-recent-game-evidence.md docs\design-refresh\work-items\DR-006-games-matches-brackets.md
  git --no-pager diff --check
  ```

- Read-only Node assertions pass for front matter, LF-only contents and all local link targets:
  backlog 439, this brief seven, parent brief 29. Before approval, the registry and current focus agreed on Review.
  Git's checkout-conversion warning does not reflect CRLF in the checked files.
  Only these three Markdown documents changed. Approval authorizes their commit, not a push.
- Browser cleanup: returned the shared tab to its original home route and dark theme, with the original
  1069px width and a 1000px test height. Theme changes were in memory only, without preference writes.
- Required pre-commit check: `npx --no-install nx run-many --target=lint --output-style=static` fails
  in ten untouched projects on existing `@nx/dependency-checks` installed-version mismatches:
  backend-seo, backend-health, backend-ranking, shared, backend-translate, backend-search,
  backend-authorization, utils, backend-database and backend-graphql.
  The other 24 project lint targets pass from cache, including components/player lint with existing warnings.
  This reproduces the previously documented workspace limitation; no dependencies or unrelated code changed.
- Exceptions: none; no implementation or new styling.

[consumer]: ../../../libs/frontend/pages/player/src/pages/detail/page-detail.component.html
[template]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.html
[component]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.ts
[tests]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.spec.ts
[guide]: ../../../libs/frontend/components/games/recent/README.md
