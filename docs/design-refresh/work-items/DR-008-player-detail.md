---
title: 'DR-008: Player detail'
description: 'Reconcile the completed player-detail children and shared presentation against the mounted route.'
---

## Identity and scope

- ID: DR-008; authoritative status in the [backlog](../backlog.md).
- Rules: [design refresh](../README.md).
- Documentation-only parent reconciliation on existing `main`, 2026-11-25.
- Real consumer: `/players/glenn-latomme`, mounted by the [player routes][routes].
- Reconcile DR-008a-c and shared DR-004/DR-005/DR-006 against the current detail page.
- Exclude application edits, data operations, Follow persistence, head-to-head, editing, ranking breakdown,
  theme changes, dependencies and redesign-only consumers.
- Preserve the unrelated generated i18n worktree change.

## Required children and shared coverage

| Item                                       | Scope                                                  |
| ------------------------------------------ | ------------------------------------------------------ |
| [DR-008a](DR-008a-player-hero-actions.md)  | Named hero overflow action                             |
| [DR-008b](DR-008b-player-sidebar-cards.md) | Current form, record, match-ups and teams              |
| [DR-008c](DR-008c-player-page-chrome.md)   | Identity, localized actions and page states            |
| [DR-005](DR-005-ranking-statistics.md)     | Shared ranking progress, tier badges and form sequence |
| [DR-006](DR-006-games-matches-brackets.md) | Shared upcoming and recent games                       |

These items retain their Done statuses, recorded approvals and unchecked verification limits.
This reconciliation must not turn historical checks into a fresh application acceptance pass.

## Reconciliation checklist

- [x] Read completed child briefs and identify the routed consumer.
- [x] Inspect current page composition and sidebar templates.
- [x] Confirm shared presentation and unused legacy paths against source.
- [x] Record fresh read-only mounted evidence.
- [x] Identify remaining required scope or explain why no new implementation child is needed.
- [x] Format documents and validate local links, LF, registry consistency and whitespace.
- [x] Obtain parent review or explicit completion approval with disclosed limits.

## Evidence and handoff

- Source: [detail template][detail] and [controller][controller] retain the approved hero and four sidebar hosts.
- The identity retains its club link and native member-id Tag; localized Follow, comparison and named overflow
  actions remain. The native ProgressBar and Message page states remain, as does the service's `hasValue()` guard.
  The Follow signal still has no rendered/persisted outcome; this is pre-existing, not a completed workflow.
- All four sidebar templates retain native Cards, translated headings and loading/empty branches.
  Current form uses the shared sequence; season record uses native Tags; match-ups use the shared tier badge;
  teams use native Avatars, membership Tags and existing club/team links.
- [Ranking progress][ranking] retains its three disciplines, named native button links and directional Tags.
  Recent/upcoming dispatchers select their player branches, not unused team branches.
  [Recent games][recent] retains named filters, signed point Tags, player-relative set tracks and loading states.
  [Upcoming games][upcoming] retains dates/times, assembly links, expansion and loading/empty states.
  DR-006m's approved current presentation supersedes DR-006b/c: there is no explicit authoritative overall
  win/loss/unknown label. This reconciliation neither restores one nor claims equivalent accessibility.
- Native Card/Tag/Avatar and shared form/ranking/game presentation already provide reuse.
  Sidebar components keep their own data services and player-id inputs; three independently create the existing
  stats service. No query consolidation or one-to-one presentational wrapper is justified for this parent audit.
- Workspace TS/HTML search finds `RankSparkComponent` and `ShowLevelComponent` only in their declarations/local
  templates, not application callers. `ShowLevelService` is still used by the page: an active service does not
  establish a consumer for its legacy component. Leave both components and their styling untouched.
- No application utilities or styles changed; before/after utility usage is identical.
- No new exceptions, dependencies or operational mutations.

### Fresh mounted evidence

Read-only checks on 2026-11-25 used the user-shared localhost browser and existing server.
The page was navigated from `/` to `/players/glenn-latomme`; no account, theme preference or viewport was changed.
The shared browser was returned to its original `/` route after the checks.
Dark theme, 1288x1272 viewport:

- One detail page/hero and one visible ranking-progress host with three links.
- Ranking hrefs correctly resolve to `/players/glenn-latomme/ranking/single`, `/double` and `/mix`.
  This verifies destinations, not activation or the separate broken homepage ranking links.
- All four sidebar hosts are visible, each with one native Card; zero nested sidebar Cards.
- One current-form sequence with ten Tags, 31 tier-badge hosts, ten recent articles with 24 winning-set Tags,
  and three upcoming articles with three assembly buttons.
- Zero legacy rank-spark/show-level/match-row/upcoming-match hosts.
- Zero detail buttons lacking text, `aria-label` and `aria-labelledby`; this is a basic naming heuristic,
  not a computed accessible-name, keyboard or screen-reader pass.
- Document width is 1273px within the 1288px viewport; no wide horizontal document overflow was observed.
- Rendered text is Dutch while document `lang` is `en`. This is not a language/locale accessibility pass.
- No follow/edit, assembly, filter, expansion or operational action was activated. No screenshots or personal
  fixtures were saved; these are aggregate mounted checks, not a new visual acceptance matrix.

### Validation and retained limits

- Initial worktree: only unrelated generated i18n modified; branch `main`.
- Committed child history agrees with source: DR-008a `9f0dc201`, DR-008b `053d764e`, DR-008c `c122131f`.
  Later `a43df53c` native button markup is retained; this audit makes no source edits.
- No application build/test rerun: this slice changes only Markdown and no documentation test target
  has been identified. Required pre-commit workspace lint is recorded below.
  Historical child task results remain historical, not freshly reproduced passes.
- Passed: `npx --no-install prettier --write docs\design-refresh\backlog.md
docs\design-refresh\work-items\DR-008-player-detail.md`.
- Passed: `git --no-pager diff --check`; the tracked document diff is limited to this handoff.
- Passed: read-only inline Node assertions for LF, front matter, trailing whitespace and all local links
  (468 backlog targets, thirteen parent-brief targets), plus exactly one DR-008 Review registry row
  and three Done child rows.
- Worktree status contains only this parent brief/backlog and the original unrelated generated i18n change.
  Git warns about future LF-to-CRLF conversion; direct byte checks confirm these documents currently use LF.
- Child approvals remain in force with their unchecked theme/width, loading/empty/unlinked-team, keyboard,
  contrast, French/English, focused component-test and SSR/hydration limits.
- No fresh screenshots, light/narrow layout, full interactions, contrast, screen-reader/touch,
  permission/state matrix, alternate locales or SSR/hydration checks were performed.
- Existing W/L copy, independently created stats services, UI-only Follow and homepage ranking destinations
  remain recorded concerns, not work silently included or declared fixed here.

## Review and next action

- No new required player-detail implementation child was identified within this reconciliation.
  The mounted page's presentation is covered by approved DR-008a-c and shared DR-004/DR-005/DR-006.
- Explicit approval on 2026-11-25: `Commit`. This marks DR-008 Done with the disclosed limits above accepted.
  Approval is not evidence that unperformed checks passed; all child verification limits remain unchanged.
- Required pre-commit `NX_DAEMON=false npx nx run-many --target=lint`: 34 targets,
  22 passed from cache and twelve failed existing `@nx/dependency-checks` outside this documentation slice.
  Failures affect i18n, shared, utils, frontend-modules-translation, backend-seo/search/authorization/health/
  ranking/translate/database/graphql. Errors concern installed-version ranges, unused `nestjs-i18n`
  and missing `@angular/common` peer dependency; no unrelated fixes or manifests are included.
- Repeated scoped formatting and final Done-registry/local-link/LF/whitespace checks pass after approval.
- Only this parent brief and backlog are authorized for the scoped commit; preserve unrelated generated i18n.
- Exact next candidate is DR-009: confirm the mounted head-to-head route and
  create a bounded brief before promoting any implementation child. DR-009 remains Backlog, not started.
- Do not begin DR-009 or another implementation slice here. No push is authorized.

[routes]: ../../../libs/frontend/pages/player/src/lib.routes.ts
[detail]: ../../../libs/frontend/pages/player/src/pages/detail/page-detail.component.html
[controller]: ../../../libs/frontend/pages/player/src/pages/detail/page-detail.component.ts
[ranking]: ../../../libs/frontend/components/player-ranking-progress/src/player-ranking-progress.component.html
[recent]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.html
[upcoming]: ../../../libs/frontend/components/games/upcoming/src/player/upcoming-games-player.component.html
