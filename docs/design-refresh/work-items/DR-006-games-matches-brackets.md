---
title: 'DR-006: Shared games, matches, and brackets'
description: 'Reconcile approved shared-game children with current consumers and remaining presentation work.'
---

## Identity and scope

- ID: DR-006; authoritative status in the [backlog](../backlog.md).
- Rules: [design refresh](../README.md). Dependencies: approved DR-006a-j.
- Documentation-only parent reconciliation on the current branch, `main`, starting from a clean worktree.
- Confirm current consumers, retain child approvals and verification limits, and scope remaining work separately.
- Exclude application edits, global styling, services, calculations, translations, new consumers and dependencies.
- Keep the parent open while required follow-up work remains; reconciliation is not blanket visual approval.

## Required children

| Child                                          | Approved scope                                          |
| ---------------------------------------------- | ------------------------------------------------------- |
| [DR-006a](DR-006a-recent-game-points.md)       | Current-player signed point indicators                  |
| [DR-006b](DR-006b-recent-game-scores.md)       | Player-relative set scores                              |
| [DR-006c](DR-006c-recent-game-results.md)      | Recent-game results and Card surface                    |
| [DR-006d](DR-006d-recent-game-filters.md)      | Recent-game heading and filters                         |
| [DR-006e](DR-006e-recent-game-loading.md)      | Initial and appended loading placeholders               |
| [DR-006f](DR-006f-upcoming-game-cards.md)      | Populated upcoming-game cards and expansion             |
| [DR-006g](DR-006g-upcoming-game-states.md)     | Upcoming heading, date/action, loading and empty states |
| [DR-006h](DR-006h-upcoming-encounter-cards.md) | Shared upcoming encounter summaries                     |
| [DR-006i](DR-006i-played-encounter-cards.md)   | Played summaries and expanded games                     |
| [DR-006j](DR-006j-bracket-tree-responsive.md)  | Bounded knockout bracket scrolling                      |

All ten rows remain Done with their original approvals. Their historical before/after evidence does not
establish the exact current presentation or complete parent coverage.

## Reconciliation checklist

- [x] Read all ten child briefs and reconcile approvals with current source.
- [x] Confirm routed player and knockout bracket consumers without mutations.
- [x] Confirm current mounted shared encounter consumers.
- [x] Identify remaining concerns without reopening completed children.
- [x] Persist independently scoped follow-up and accurate current focus.
- [x] Format changed documents and validate links, LF, whitespace and registry consistency.
- [x] Obtain review of this reconciliation and its disclosed limits.

## Reconciliation source and evidence

Source inspection on 2026-11-21, before the separately implemented DR-006k/l follow-ups:

- [Player detail][player-detail] imports both game dispatchers; their player branches render
  [recent games][recent] and [upcoming games][upcoming].
  Recent games retain named native filters, signed point Tags, player-relative sets and shared loading markup.
  Current winning sets use success Tags; losing sets use plain muted text, not the secondary Tags recorded
  in DR-006b. The result icon/hidden result label from DR-006c is absent. Do not restore it without reconciling
  later approved changes and the intended result meaning in a separate slice.
- Upcoming games retain a named busy section, date/month/time, native assembly action, three-card initial
  view, expansion and three native loading Cards. No service or route changes are required here.
- [Shared encounter][encounter] retains upcoming and played variants, native expansion semantics and lazy
  loading. [Club schedule][schedule], [team detail][team] and [competition draw][competition-draw] import
  this shared implementation, not the similarly named legacy local competition component.
  Expanded games still nest Cards inside the summary Card, contrary to the current no-nested-Card rule.
  Record a separate surface-only follow-up; do not change expansion or loading during reconciliation.
- [Bracket tree][bracket] and its [KO adapter][ko] retain DR-006j's `w-full min-w-0` scroll contract.
  Round headings still author `text-primary-700`, `bg-primary-50`, `border-primary-200`; completed boxes
  bind `border-primary-400`. DR-006j only fixed responsive sizing, not semantic palette presentation.
- Workspace template search finds no application caller for `app-match-row` or `app-upcoming-match`.
  Team branches of the recent/upcoming dispatchers have no caller passing `type="team"`.
  Skip these unused paths; do not mount them for redesign verification.

Read-only browser checks on 2026-11-21 used one background Agent Tab on the existing port-3000 server:

- `/players/glenn-latomme`: one visible recent and one visible upcoming player host; ten recent articles,
  24 winning set Tags, zero hidden result labels; three upcoming articles and three assembly buttons.
  No legacy match-row/upcoming-match hosts. The document retained `dark-theme`.
- KO route below: one visible bracket, four ordered round headings, 28 player anchors, four numbered-palette
  headings and fifteen completed-border boxes. Host and scroll container retain their width/shrink classes.
- Team route `/clubs/oostendse/teams/11b725dd-65ac-41da-a750-f75cd79300a7`: fourteen shared summaries,
  fourteen full-date labels and four named expansion buttons with controlled regions.
- Competition draw route below: 72 shared summaries, 72 full-date labels and eighteen named expansion buttons.
- `/clubs/smash-for-fun?tab=schedule`: 120 shared summaries and forty expansion buttons.
  The first expansion opens a visible controlled region containing eight nested game Cards, no Skeletons;
  collapsing restores `aria-expanded="false"` and the hidden region. Only a read-only game query is triggered.
- One initial exact-name `Programma` lookup failed with `NOT_FOUND`, input uncommitted.
  A fresh snapshot confirmed the tab; a uniquely matching name pattern succeeded.
- These are presence/visibility checks, not a fresh theme/width/contrast or workflow matrix.
  No screenshots, personal data fixtures, preference writes or operational mutations were performed.

KO consumer:
`/tournament/internationaal-tornooi-lokerse-bc-2023/sub-events/755f536f-7d16-46ba-93c8-49d07123ce6c/draws/68b472cb-2940-47ec-ac17-eff7a15cab6a`.

Competition draw consumer:
`/competition/ef25fcfb-f860-415a-a4f4-e8dca7ea70cb/sub-events/c4b84033-b81f-4168-b539-3914f26b80fc/draws/0059a693-be63-4486-bf3d-450733e5e706`.

[Root routes][root-routes] mount the [player][player-routes], [club][club-routes],
[competition][competition-routes] and [tournament][tournament-routes] feature routes.

## Validation, limits and next action

- Passed: initial `git --no-pager status --short` (clean), `git branch --show-current` (`main`),
  source/route inspection and mounted aggregate checks above.
- Passed: `npx --no-install prettier --write docs\design-refresh\backlog.md
docs\design-refresh\work-items\DR-006-games-matches-brackets.md
docs\design-refresh\work-items\DR-006k-bracket-semantic-presentation.md` and `git --no-pager diff --check`.
- Passed: read-only Node assertions for front matter, LF, whitespace and relative links
  (432 backlog targets, 27 parent-brief targets, seven child-brief targets), plus unique registry rows:
  initial parent Review, DR-006a-j Done, DR-006k Ready, DR-006l/m Backlog.
  Git warns about later checkout conversion; actual changed documents contain only LF.
- Final browser cleanup passed: Task Group authority revoked, its Agent Tab closed, no retained tabs.
  The user's existing tab was not claimed or changed. No server process was started or stopped.
- Changed scope: only this new parent brief, the scoped DR-006k brief and the backlog.
  Only these documents are approved for commit; no push is requested.
- Not run: Nx lint/build/test; this slice changes only Markdown. Retain child commands as historical results,
  including the six known bracket-suite failures; they have not been reproduced or fixed here.
- Not verified: fresh light/dark/narrow/wide pixels, keyboard/focus, touch, contrast, screen readers,
  state/permission workflows, alternate locales and SSR/hydration.
- No new application utility classes, styling rules, dependencies or extraction.
  Existing data-owning dispatchers and input-driven encounter/KO components already separate responsibilities.
  A new one-to-one wrapper is not justified; evaluate reuse only for a concrete repeated presentation need.
- User approval on 2026-11-21: `Approve this reconciliation handoff and commit, keeping DR-006 open`.
  This approves only the documentation reconciliation and commit, not parent completion or unperformed checks.
  Parent returns to Backlog for its remaining work; preserve unchecked child criteria, especially
  screenshots/keyboard limits, populated expanded-game data and nonzero encounter scores.
- At reconciliation, DR-006k was Ready and DR-006l/m were unscoped Backlog follow-ups.
  The latest follow-up state below supersedes that historical next action.

## Follow-up progress

- [DR-006k](DR-006k-bracket-semantic-presentation.md) is Done with its recorded approval and limits.
- [DR-006l](DR-006l-expanded-encounter-games.md) replaces nested game Card wrappers with shared divided
  semantic rows. All three real mounted consumers retain eight games with no nested Cards or overflow
  in twelve light/dark 390px/1440px cases. Enter/Space and controlled IDs pass.
  Twenty focused tests and components/club/competition lint/build pass; populated visual and broader
  accessibility/locale/SSR limits remain in the child brief. The initial revision awaited user review.
- DR-006l review feedback, 2026-11-23: shared subgrid tracks now align the 72px metadata rail and score boundary.
  Scores/player spacing and responsive pairing follow the unchanged player-profile reference.
  Fifty encounter/profile tests and scoped lint/build pass; 24 live plus eight synthetic populated cases fit
  four widths in both themes. Live populated/contrast/full-traversal/locale/SSR limits remain.
  Nx Cloud cache artifact upload failed after successful targets.
  Explicit approval on 2026-11-23, `Approve DR-006l with documented limits and commit`, completes the revised child.
  Child is Done with unchecked limits retained; workspace lint still fails in ten untouched dependency-check projects.
- [DR-006m](DR-006m-recent-game-evidence.md) is Done after documentation-only reconciliation, 2026-11-23.
  Later commit `a78b0401`, current guide and tests intentionally remove result icons/hidden labels and use
  winning-set Tags with plain losing/tied scores. Numeric comparisons preserve set meaning but do not
  explicitly convey an authoritative overall win/loss/unknown result. Historical label/contrast/SSR checks
  must not be presented as current evidence. All 29 existing tests pass; four mounted theme/width DOM checks
  show no overflow and matched player/score sides. Two current screenshots inspected; broader limits remain
  in the child brief. No application changes or new extraction.
  Explicit approval: `Approve DR-006m with documented limits and commit`.
  This accepts the disclosed absence of explicit overall results and unchecked limits, not unperformed checks.
  DR-006n remains separate bracket score/connector contrast work.
- Parent stays Backlog until required follow-ups are resolved; approved DR-006a-k are not reopened.
- Exact next action: scope DR-006n bracket score/connector contrast against its mounted consumer.
  Do not start that candidate here or restore old recent-result icons implicitly.
  Commit only the approved DR-006m documentation handoff; no push.
  DR-006l approval does not complete this parent.

[player-detail]: ../../../libs/frontend/pages/player/src/pages/detail/page-detail.component.html
[recent]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.html
[upcoming]: ../../../libs/frontend/components/games/upcoming/src/player/upcoming-games-player.component.html
[encounter]: ../../../libs/frontend/components/games/encounter-card/src/encounter-card.component.html
[schedule]: ../../../libs/frontend/pages/club/src/pages/detail/tabs/club-schedule-tab.component.html
[team]: ../../../libs/frontend/pages/club/src/pages/team-detail/page-team-detail.component.html
[competition-draw]: ../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.html
[bracket]: ../../../libs/frontend/components/bracket-tree/src/bracket-tree.component.html
[ko]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/components/draw-ko-tree.component.html
[root-routes]: ../../../apps/app/config/app.routes.ts
[player-routes]: ../../../libs/frontend/pages/player/src/lib.routes.ts
[club-routes]: ../../../libs/frontend/pages/club/src/lib.routes.ts
[competition-routes]: ../../../libs/frontend/pages/competition/src/lib.routes.ts
[tournament-routes]: ../../../libs/frontend/pages/tournament/src/lib.routes.ts
