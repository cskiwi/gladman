---
title: 'DR-005: Shared ranking, statistics, and status patterns'
description: 'Reconcile approved shared-pattern children with current application consumers and retained limits.'
---

## Identity and scope

- ID: DR-005; authoritative status in the [backlog](../backlog.md).
- Rules: [design refresh](../README.md). Dependencies: completed DR-005a-e.
- Documentation-only parent reconciliation on the current branch; no application implementation slice.
- Confirm current mounted consumers, reconcile the five approved children and record remaining concerns.
- Exclude component restyling, calculations, routes, translations, global theme, dependencies and new consumers.
- Preserve completed child evidence and approvals; older consumer inventories are historical, not current coverage.

## Required children

| Child                                  | Approved scope                             |
| -------------------------------------- | ------------------------------------------ |
| [DR-005a](DR-005a-tier-badge.md)       | Shared native ranking tier badge           |
| [DR-005b](DR-005b-form-sequence.md)    | Ordered native W/L tags                    |
| [DR-005c](DR-005c-sparkline.md)        | Compact semantic SVG bar visualization     |
| [DR-005d](DR-005d-stat-card.md)        | Native statistic Card and directional tags |
| [DR-005e](DR-005e-ranking-progress.md) | Shared levels and directional point totals |

All five children are Done with their recorded approvals and verification limits.
Parent reconciliation does not reopen them or turn isolated fixtures into mounted-consumer evidence.

## Acceptance and evidence

- [x] Reconcile child approvals against the current implementation and current production imports.
- [x] Confirm mounted player consumers without operational mutations or verification-only consumers.
- [x] Record unused components, later consumer additions and remaining concerns separately.
- [x] Persist the parent brief and accurate current focus in the backlog.
- [x] Obtain parent review or explicit approval with disclosed limits.

### Current source and consumer inventory

Source inspection on 2026-11-21 confirms the approved implementations remain on `main`:

- [Tier badge][badge] remains a native Tag with its existing input API and scoped design tokens.
  Current callers include recent games, strongest match-ups, encounter cards, tournament draw games
  and the [ranking games list][ranking-games]. The latter is an additional real consumer since DR-005a.
  The legacy match-row caller is still unmounted: a call inside an unused component is not a real consumer.
- [Form sequence][form] retains ordered native success/danger W/L tags, wrapping and the equal-width
  `min-w-8 justify-center` refinement recorded in [DR-012d](DR-012d-club-teams-tab.md).
  The [player current-form card][current-form] and [club team rosters][team-card] now mount it.
  [DR-008b](DR-008b-player-sidebar-cards.md) introduced the player consumer after DR-005b.
  DR-005b's no-consumer evidence describes its initial implementation, not today's application.
- [Ranking progress][progress] retains three named native button-styled links, directional tags and
  projected slots. Its current [player detail][player-detail] and [home][home] consumers remain.
- [Sparkline][sparkline] retains the translated SVG title, percentage geometry and semantic fill fallbacks.
  [Stat-card][stat-card] retains native Card/Tag, wrapping and projection.
  Search of `apps` and `libs/frontend` found only their own declarations and focused test references:
  neither has a production import or template consumer. Skip further redesign of these unused entries.
- None of the five component declarations references a stylesheet or inline component styles.
  This reconciliation removes no CSS and changes no template utilities.

The [root routes][root-routes] and [player routes][player-routes] mount player detail and ranking
breakdown; [club routes][club-routes] mount club detail and its existing Teams tab.
No new component or smart/presentational split is justified here: form sequence, tier badge and
ranking progress already provide meaningful shared presentation; consumer cards retain their data logic.

### Read-only mounted evidence

Browser checks on 2026-11-21 used one background Agent Tab and the existing localhost server.
No user-owned tab, theme preference, viewport, backend data or account state was changed.

- `/players/glenn-latomme`: one visible ranking-progress host, three anchors and six native tags;
  one visible current-form sequence containing ten native tags; 31 tier-badge hosts.
  Sparkline and stat-card hosts were absent. The document retained `dark-theme`.
- `/clubs/smash-for-fun`, default Teams tab: nine team cards, 45 form sequences and 224 result tags.
  All 45 sequences expose `role="group"` and a translated `Recente vorm` accessible name.
  The document retained `dark-theme`. No filter, roster, edit or operational control was activated.
- Copy observed in the snapshots is Dutch despite the document's `lang="en"` attribute.
  This check is not an alternate-locale or correct-document-language pass.
- Evidence is aggregate DOM presence and visibility, not screenshots, contrast, full accessibility
  or a new light/dark/narrow/wide acceptance matrix. No personal screenshots or contact data are saved.
- The Agent Tab is closed through Task Group finalization; the user's existing tab remains untouched.

### Validation and remaining concerns

- Passed: clean initial `git --no-pager status --short`; `git branch --show-current` returned `main`.
- Passed: direct source/route inspection and browser aggregate checks above.
- Not run: Nx lint/build/test, because only Markdown changed. Child commands and results remain historical
  evidence in their briefs, not newly reproduced passes.
- Passed: `npx --no-install prettier --write docs\design-refresh\backlog.md
docs\design-refresh\work-items\DR-005-ranking-statistics.md` and `git --no-pager diff --check`.
  Prettier did not introduce unrelated table formatting changes.
- Passed: read-only Node validation of LF line endings, trailing whitespace and relative links
  (424 backlog targets, 22 parent-brief targets), plus the initial DR-005 Review and DR-072 Backlog registry assertions.
  `git --no-pager status --short` lists only the backlog and new parent brief.
  Git warns about future LF-to-CRLF checkout conversion; actual changed files contain only LF.
- DR-072 is a separate Backlog follow-up: the shared tier badge still binds `[dt]`, contrary to the
  current user direction not to use `[pt]` or `[dt]`. Preserve the old child approval as history.
  Before implementing DR-072, scope native Tag appearance with confirmed mounted consumers and
  verify size, contrast and existing inputs without scoped token bindings or page-specific styling.
  Do not silently change this widely shared component during parent reconciliation.
- The existing homepage ranking-link destination issue remains recorded under DR-008/DR-002.
  Navigation, SSR and hydration were not retested here.

## Verification limits and next action

- No application changes, component extraction, new styling, dependencies or data mutations.
- Retain all five child approvals and their limited populated-consumer, screenshot, locale and SSR coverage.
  In particular, isolated sparkline/stat-card fixtures are not routed evidence.
- Later player/club form-sequence consumers retain the unchecked keyboard, contrast, locale, state and
  hydration limits in DR-008b/DR-012d. This aggregate check does not close those gaps.
- Not verified here: light/narrow layouts, keyboard/focus, touch, screen readers, contrast, interaction
  states, alternate locales, full consumer matrix and SSR/hydration.
- On 2026-11-21 the user selected `Approve DR-005 with the documented limits and commit`.
  This closes the parent with the limits above and in its children; unperformed checks remain unverified.
  Only this parent brief and the backlog handoff are approved for this commit.
- Passed after approval: repeated Prettier, relative-link/LF/Done-registry checks and `git diff --check`.
  No application source changes require Nx validation.
- After approval, the next candidate is DR-072; confirm the mounted badge and create one bounded brief.
  Do not start it in this invocation. DR-006 parent reconciliation remains a later independent candidate.

[badge]: ../../../libs/frontend/components/tier-badge/src/tier-badge.component.html
[form]: ../../../libs/frontend/components/form-sequence/src/form-sequence.component.html
[progress]: ../../../libs/frontend/components/player-ranking-progress/src/player-ranking-progress.component.html
[sparkline]: ../../../libs/frontend/components/sparkline/src/sparkline.component.html
[stat-card]: ../../../libs/frontend/components/stat-card/src/stat-card.component.html
[ranking-games]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/components/list-games/list-games.component.html
[current-form]: ../../../libs/frontend/pages/player/src/pages/detail/components/player-current-form/player-current-form.component.html
[team-card]: ../../../libs/frontend/pages/club/src/components/team-card/team-card.component.html
[player-detail]: ../../../libs/frontend/pages/player/src/pages/detail/page-detail.component.html
[home]: ../../../libs/frontend/pages/home/src/pages/home/page-home.component.html
[root-routes]: ../../../apps/app/config/app.routes.ts
[player-routes]: ../../../libs/frontend/pages/player/src/lib.routes.ts
[club-routes]: ../../../libs/frontend/pages/club/src/lib.routes.ts
