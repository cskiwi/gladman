---
title: 'DR-006l: Expanded encounter game surfaces'
description: 'Remove nested game Cards while preserving the shared encounter expansion and game content.'
---

## Identity and scope

- ID: DR-006l; parent DR-006 stays open. Status is authoritative in the [backlog](../backlog.md).
- Dependencies: approved DR-006h/i; follow the [design rules](../README.md).
- One shared encounter-presentation slice on the existing `main` branch, initially clean on 2026-11-21.
  The 2026-11-23 feedback revision integrates its existing uncommitted changes without starting another slice.
- Project: `frontend-components`; consumers: `frontend-pages-club` and `frontend-pages-competition`.
- Initial scope: expanded game wrappers in the [template][template] and directly related [tests][tests].
  User feedback on 2026-11-23 extends this to aligned rails and profile-consistent player/score presentation.
  Add only the native Tag import to the encounter component; leave the reference player profile unchanged.
- Confirmed mounted consumers: [club schedule][schedule], [team detail][team] and [competition draw][draw].
- Preserve summary/upcoming Cards, native expansion button, controlled region, lazy loading, loading/empty
  content, sorted games, home/away player groups, routes, levels, translated results and each ordered set pair.
  Intentionally adopt the profile's native winning-set Tags and stacked mobile sides with adjacent scores.
- Exclude parent page layouts, shared badges, bracket/recent-game work, services, global theme/CSS,
  translations, dependencies and operational mutations.

## Baseline and approach

- Mounted schedule: `/clubs/smash-for-fun?tab=schedule`; 120 shared encounters and forty expansion buttons.
- Mounted team: `/clubs/oostendse/teams/11b725dd-65ac-41da-a750-f75cd79300a7`;
  fourteen encounters and four expansion buttons.
- Mounted draw:
  `/competition/ef25fcfb-f860-415a-a4f4-e8dca7ea70cb/sub-events/c4b84033-b81f-4168-b539-3914f26b80fc/draws/0059a693-be63-4486-bf3d-450733e5e706`;
  72 encounters and eighteen expansion buttons.
- Before matrix: the first played expansion on each consumer contains eight nested Cards, no player links
  or set scores, at 390px/1440px in light/dark. All twelve cases have zero document/row overflow.
  Native Enter opens and Space closes each consumer; control IDs match and the native focus outline is present.
- Isolated installed Playwright/Chrome uses fresh context and DOM-only theme toggling, without preference writes.
  No user tabs, credentials, browser profiles or backend records are changed.
- Remove each inner Card, retaining its semantic article as a divided game row inside the existing summary Card.
  One semantic bottom border separates rows; the last row has no separator.
  The feedback revision below supersedes the original independently sized inner grids, not the domain data.
- Native Panel was considered using installed PrimeNG documentation. These games are rows of one encounter,
  not separate collapsible groups. Semantic articles avoid redundant surfaces, padding and extra panel landmarks.
- Existing input-driven shared encounter already serves all three consumers; no smart/presentational split or
  one-to-one wrapper is justified. This implementation styles the shared rows once.
- Before: one `p-card.block.card-flush` per game, plus `flex flex-col gap-3 p-4` list spacing.
  First revision: no per-game Card; `px-4` list inset and semantic divided articles, without custom CSS.
  Feedback revision removes the inset and shares a `72px/minmax(0,1fr)/auto` grid through native CSS subgrid
  utilities, aligning both metadata and score boundaries across rows. This matches the profile's 72px rail.
  Responsive placement utilities pair each mobile side with its scores, matching the profile without new CSS.
  One side loop replaces duplicated player markup. Existing semantic row dividers remain.

## Implementation checklist

- [x] Confirm mounted consumers, dependencies and surface-only scope.
- [x] Remove nested Card wrappers while preserving game content and ordering.
- [x] Update focused coverage for one outer Card and preserved expanded rows.
- [x] Preserve loading/empty/expansion behavior and check all three shared consumers.
- [x] Format changed files and run relevant existing Nx checks.
- [x] Persist evidence, verification limits, review state and exact next action.

## Acceptance and verification

- [x] Expanded games render zero Cards inside the unchanged native summary Card.
- [x] Rendered game order, player destinations, levels, result text and ordered set pairs pass focused tests.
- [x] No numbered/non-semantic palette utilities, SCSS, inline CSS, `[pt]` or `[dt]` are added.
- [x] Light/dark at 390px/1440px fit on all three mounted consumers with no document or row overflow.
- [x] Native Enter/Space expansion and controlled IDs pass; the existing solid focus outline remains present.
- [x] Existing loading/empty/supplied-game cases pass focused tests.
- [x] Relevant components/club/competition Nx lint/build and focused tests pass.
- [x] Synthetic populated player/badge/score layouts are checked at four widths in both themes.
- [ ] Populated live player/badge/score pixels, contrast and full keyboard traversal are verified.
- [ ] Alternate locales, screen-reader use and SSR/hydration are verified.
- [x] User review/approval is recorded before completion or commit.

## Initial revision evidence

- Initial read-only Browser presence checks confirm schedule and draw expansion.
  Browser screenshot timed out without capturing evidence. The initial team article wait also timed out;
  a fresh observation found all four buttons collapsed, so that attempt is not successful expansion evidence.
  The isolated Playwright baseline subsequently verifies all three actual expansions after hydration settles.
- Before screenshots: local `DR-006l-before-{390,1440}-{light,dark}.png`, not committed.
  Inspected narrow light and wide dark captures; sticky app chrome overlaps the wide capture's first row.
  These are empty-membership/score layout evidence, not populated game verification.
- After matrix: all twelve consumer/theme/width cases retain eight articles, matching rendered-text/destination
  fingerprints, zero nested Cards, zero Skeletons after loading, zero document overflow and zero row overflow.
  Each first row has a native semantic 1px separator; each last row has no bottom border.
  Content-region widths are unchanged: schedule 328.5px/583.5px, team 332px/1250px, draw 323px/860px.
- Keyboard Enter opens and Space closes all three consumers, with matching controlled IDs and hidden regions.
  The existing native solid 1px focus outline remains present in both themes; full traversal and focus contrast
  are not claimed. The existing dark focus-contrast discovery remains separate backlog work.
- After schedule screenshots: local `DR-006l-after-{390,1440}-{light,dark}.png`, not committed.
  All four were inspected. No rounded/shadowed per-game surfaces remain; rows share the outer Card.
  Sticky chrome overlaps the first row of wide captures; the twelve DOM cases cover bounds, not unobstructed pixels.
- Passed, after repository formatting:

  ```powershell
  $env:NX_DAEMON='false'
  npm exec -- nx run frontend-components:test --runInBand `
    --testPathPatterns=encounter-card.component.spec.ts --output-style=static
  npm exec -- nx run-many --targets=lint,build `
    --projects=frontend-components,frontend-pages-club,frontend-pages-competition --output-style=static
  ```

- All twenty tests pass, including upcoming behavior, named expansion, independent team links, loading/empty,
  supplied-game sorting, single/double/mixed levels, perspective result text, ordered set pairs and played zero.
  The existing supplied-game regression now requires one outer Card, no nested Card and both ordered articles.
  All six requested lint/build targets pass (eleven of fifteen total tasks restored from Nx cache).
  Existing lint warnings and the ts-jest metadata advisory remain; no dependencies or tooling were added.
- Exact isolated browser commands, using an uncommitted session helper and the installed Playwright/Chrome:

  ```powershell
  $evidence = 'C:\Users\glenn\.copilot\session-state\33167ba2-de15-495f-9454-9f86968696b5\files'
  node "$evidence\dr006l-browser.cjs" before
  node "$evidence\dr006l-browser.cjs" after
  ```

- Both browser commands pass and close their own isolated browser in `finally`; no server was started/stopped.
  Browser Task Group finalized: Agent Tab closed, no kept/released/failed tabs, authority revoked.
- Passed: `npx --no-install prettier --write` on all five changed files, `git --no-pager diff --check`,
  and read-only Node assertions for LF, Markdown front matter, 471 local links and the unique Review registry/focus.
  Git's checkout-conversion warning does not reflect the actual file endings; all five files contain only LF.
  Temporary browser helper/log/JSON measurements are removed after recording these results; screenshots stay local.
- Failed setup check: guessed consumer project names `frontend-club`/`frontend-competition` were incorrect.
  `npm exec -- nx show projects --projects="*club*,*competition*" --json` resolved the actual names;
  `nx show project` confirmed both consumers' existing targets before their successful lint/build run.
- Not run: full workspace lint/test, app production build, alternate locales, screen-reader and SSR checks.
  No full-workspace or historical child failures are claimed as reproduced in this slice.
- Not verified: populated live player/badge/set-score pixels, nonzero summaries, full keyboard traversal,
  focus/text contrast, touch, screen-reader use, alternate locales and exhaustive SSR/hydration.
  Live expanded games still omit memberships/set scores, so populated preservation is test-only evidence.
- Initial visual outcome: local before/after empty-game geometry inspected; approval was then outstanding.
  The backlog was Review at that handoff, before the feedback and completion approval recorded below.
- Exceptions: none. The existing internal responsive grid and semantic metadata/score dividers remain in scope.

## Review feedback revision, 2026-11-23

- User feedback: the left divider is not always aligned, and encounter games should match the player-profile styling.
  This authorizes the presentation revision, not completion or a commit.
- Confirmed on the user's actual draw:
  `/competition/ef25fcfb-f860-415a-a4f4-e8dca7ea70cb/sub-events/8e8ba158-859c-48a7-92ca-f2c3ce805f4f/draws/78d42486-ab43-4484-9b68-a99e46bf96ae`.
  Initial metadata widths varied from 32.92px to 35.44px solely with text width.
- Root fix: the list owns all three desktop tracks; row articles use `sm:grid-cols-subgrid`.
  All eight metadata rails are exactly 72px, and both metadata/right-score boundaries have less than 0.1px
  spread across rows at 640px, 768px and 1440px in both themes. Removing the list inset also aligns the rail
  with the encounter summary. No per-game Card, new stylesheet, inline CSS, token override or passthrough.
- Reference remains the unchanged [recent player games][profile]. Use native success Tags for set winners,
  muted plain-text losing sets, non-monospace score typography, the same minimum score height,
  player/badge gap and desktop/mobile side arrangement. Preserve home/away ordering rather than the profile's
  current-player-first ordering; preserve existing game-winner emphasis and translated encounter perspective.
- Mounted profile reference, after layout settled: 72px rail, native success Tags, Inter score font,
  21px minimum score height and 5.25px player/badge gap at the current 14px root font.
  The first immediate read had zero/empty geometry during navigation and was discarded.
- Current live schedule/team/draw data still omit game memberships and set scores.
  All 24 live consumer cases pass at 390px/640px/768px/1440px in light/dark: eight rows, zero nested Cards,
  no document/row overflow, aligned desktop rails and right-score dividers, and matching mobile side-row bounds.
  Native Enter opens and Space collapses all three consumers.
- Additional populated verification is explicitly synthetic, not a claim about live game data:
  an isolated fresh Chrome context overrides only the read-only `EncounterGames` response locally.
  No writes, user cookies/profile access or production consumers were added.
  Eight cases use Singles/Doubles/Mixed, orders 1/10/111, long safe player names, paired three-set results
  including a played zero, 26 player links/badges and 24 winning-set Tags.
  Both desktop boundaries remain aligned; mobile players and their own scores occupy identical row bounds.
  No document/row overflow. The local override disappears with its browser context.
- Local synthetic evidence: `DR-006l-feedback-{390,1440}-{light,dark}.png`, not committed.
  Narrow light and wide dark screenshots inspected; player sides, badges, native scores and shared dividers
  match the intended profile pattern. Sticky app chrome overlaps part of these tall element captures.
- Passed after formatting, 50 tests across the unchanged profile and revised encounter suites:

  ```powershell
  $env:NX_DAEMON='false'
  npm exec -- nx run frontend-components:test --runInBand --runTestsByPath `
    libs\frontend\components\games\encounter-card\src\encounter-card.component.spec.ts `
    libs\frontend\components\games\recent\src\player\recent-games-player.component.spec.ts --output-style=static
  npm exec -- nx run-many --targets=lint,build `
    --projects=frontend-components,frontend-pages-club,frontend-pages-competition --output-style=static
  ```

- All six lint/build targets passed; eleven of fifteen total tasks were cached.
  Existing lint warnings and ts-jest metadata warnings remain. Nx Cloud artifact upload timed out with
  `ECONNABORTED` after successful targets (command exit 0); remote cache upload did not pass.
- The initial combined regex test selector was misinterpreted as a shell pipe on Windows and did not run tests.
  The explicit-path command above replaces that failed attempt and ran both suites successfully.
- Exact browser helper command: `node "$evidence\dr006l-feedback.cjs"`, using the same evidence directory above.
  All 32 cases pass; the helper closes its isolated browser in `finally`. Temporary helper/logs are removed.
- Final handoff checks pass: repository Prettier on all six changed files, `git --no-pager diff --check`,
  LF assertions, 472 local links, front matter and the unique matching Review registry/current focus.
- Remaining limits: populated real-game visuals, contrast, full keyboard traversal, touch, screen readers,
  other locales, and SSR/hydration remain unverified. Synthetic layout checks do not close those criteria.
- Revision initially returned to Review; the completion approval below supersedes that pending-review handoff.

## Approval and completion, 2026-11-23

- Explicit user approval: `Approve DR-006l with documented limits and commit`.
  This authorizes completion and the scoped implementation/tests/handoff commit, not a push.
- Result: Done in the authoritative backlog, with unchecked criteria preserved.
  Accepted limits remain populated live-game visuals, contrast/full traversal, touch, screen readers,
  alternate locales and SSR/hydration. Synthetic checks are not substituted for those outcomes.
- Required pre-commit `npx nx run-many --target=lint --output-style=static` ran all 34 workspace projects
  and failed on existing dependency-version checks in ten untouched projects:
  `backend-health`, `shared`, `backend-seo`, `backend-authorization`, `backend-translate`,
  `backend-ranking`, `backend-search`, `utils`, `backend-database`, and `backend-graphql`.
  The six scoped frontend lint/build targets and fifty tests remain passing; no application edits follow them.
- Only the three encounter source/test files and three design-refresh handoff documents are approved for commit.
  No new dependencies, global styles, backend changes, reference-profile edits or workflow files.
- Exact next action: in a fresh invocation, reconcile DR-006m's recent-result/current-score evidence against
  later approved changes and the mounted player profile before choosing implementation.
  Keep DR-006 open and leave DR-006n separate; do not begin either in this invocation.

[template]: ../../../libs/frontend/components/games/encounter-card/src/encounter-card.component.html
[tests]: ../../../libs/frontend/components/games/encounter-card/src/encounter-card.component.spec.ts
[schedule]: ../../../libs/frontend/pages/club/src/pages/detail/tabs/club-schedule-tab.component.html
[team]: ../../../libs/frontend/pages/club/src/pages/team-detail/page-team-detail.component.html
[draw]: ../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.html
[profile]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.html
