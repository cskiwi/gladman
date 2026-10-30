---
title: 'DR-006h: Shared upcoming encounter cards'
description: 'Refresh the mounted shared upcoming encounter variant without changing played encounters.'
---

## Identity

- ID: DR-006h; parent DR-006 stays open. Status is authoritative in the [backlog](../backlog.md).
- Dependencies: none. Follow the [design rules](../README.md).

## Scope

- Project: `frontend-components`; only the shared encounter card's `upcoming` variant.
- Confirmed mounted route: `/clubs/oostendse/teams/11b725dd-65ac-41da-a750-f75cd79300a7`,
  showing eleven upcoming and three played encounters on 2026-10-21.
- Other real consumers: club detail schedule tab and competition draw page.
- Preserve home/away team links, abbreviations/TBD fallbacks, translated perspective, date/time,
  and the absence of expansion/score controls for upcoming encounters.
- Exclude played cards, expanded games, parent layouts, queries/services, global styles, and translations.

## Baseline and proposed approach

- Upcoming and played currently share a custom bordered surface, decorative stripe, fixed three-column grid,
  arbitrary date widths/fonts, and truncated team names. Upcoming cards omit the month.
- Render upcoming encounters in a native PrimeNG Card with semantic text, a wrapping team row,
  and grouped date/time. The user supplied `/players/axelle-de-prest` as the existing design reference;
  use its compact date rail, responsive top date row, native Card surface, and zero-padding body passthrough.
  Do not redesign or reopen the completed player work.
- Keep all played markup and its required inline component styles unchanged.
- Installed PrimeNG 22.1.2 Card supports projected content and passthrough; use its native surface and the
  existing player-card body spacing pattern.

## Implementation checklist

- [x] Confirm real mounted consumers and a populated baseline.
- [x] Replace upcoming custom surfaces with native Cards and readable team/date layout.
- [x] Preserve behavior, links, fallbacks, and perspective in focused regression tests.
- [x] Leave played presentation, expansion, and service logic unchanged.

## Acceptance and verification

- [x] Native Card is used only for upcoming encounters, with no new styling rules or palette colors.
- [x] Both team links and translated home/away context are preserved; missing team metadata stays usable.
- [x] Upcoming cards never load or expand games, even when a loader or games are supplied.
- [x] Date includes weekday/day/month and time; team names wrap rather than truncate.
- [x] Light/dark at 390px/1280px, focus/keyboard, contrast, and affected consumers are checked.
- [x] Focused tests and relevant Nx lint/build pass.
- [ ] Relevant SSR/hydration and localization behavior checked, or limits disclosed.
- [x] User approval recorded with the disclosed verification limits.

## Evidence and handoff

- Initial worktree clean. Baseline browser: port 3000, light theme, 1249x1221.
- No backend mutations, dependency additions, or new server processes are needed.
- Scope changed only the upcoming template branch and Card import; added a focused seven-test spec.
  The played branch's custom styles remain required and are not removed in this slice.
- Utility comparison: upcoming removes `.enc-card`, clickable-row bindings, the decorative stripe, empty
  right column, truncated identity line, arbitrary fonts, and conditional score palette expressions from its
  rendered branch. Remaining classes serve the responsive date rail, wrapping text, spacing, borders,
  typography, and semantic colors. More explicit branch markup isolates played behavior; no wrapper component,
  global styles, or new CSS rules are introduced. The existing `72px` rail and `p-0! gap-0!` passthrough are
  reused from the approved player reference, not a new styling exception.
- Exact validation commands, all passed on the final implementation:

  ```powershell
  $env:NX_DAEMON='false'
  npm exec -- nx run frontend-components:test --runInBand `
    --testPathPatterns=encounter-card.component.spec.ts --output-style=static
  npm exec -- nx run-many --targets=lint,build --projects=frontend-components --output-style=static
  npm exec -- nx run app:build --output-style=static
  git --no-pager diff --check
  ```

- Seven focused tests pass: native Card/date/accessibility/team links; both perspectives; no matching
  perspective; abbreviation/TBD fallbacks; upcoming non-expansion/loader behavior; played scores/expansion.
  Lint passes with 31 pre-existing warnings; library and consuming app builds pass.
  Nx Jest deprecation and TypeScript metadata warnings are existing tooling advisories.
- The first draft had a misplaced closing block; focused tests/build caught it and it was corrected.
  Port 3000 briefly retained that error/old markup; after the successful rebuild and reload it rendered
  eleven native Cards without a compile overlay. No server was started or restarted.
- Mounted browser matrix passed for 390px/1280px, light/dark:
  - Team detail: eleven upcoming Cards; all links unclipped, zero card/document overflow, three legacy
    played surfaces still present. Document widths were 375px/1265px, matching client widths.
  - Club `/clubs/oostendse`, Programma tab: 37 upcoming Cards, zero card overflow.
  - Competition draw: 60 upcoming Cards, zero card overflow on the route below.
- Draw route:
  `/competition/ef25fcfb-f860-415a-a4f4-e8dca7ea70cb/sub-events/c4b84033-b81f-4168-b539-3914f26b80fc/draws/0059a693-be63-4486-bf3d-450733e5e706`.
- Screenshots inspected for all four team-card cases; local uncommitted evidence is under
  `tmp/design-refresh/DR-006h-{390,1280}-{light,dark}.png`, with baseline and player-reference captures.
  These are not committed. Muted text contrast: 4.87:1 light / 6.65:1 dark; normal team text:
  19.87:1 light / 16:1 dark. Native focus outline present in both themes.
- Keyboard Tab moved from home to away team; Enter navigated to the expected DZ99 team route.
- Settled SSR: read-only HTTP request returned 200; all eleven upcoming encounter elements contained native
  Cards, and the first full-date accessible label was present. Exhaustive hydration, alternate locales,
  and screen-reader output remain unverified; no loading/error states belong to this card-only branch.
- Original browser route `/`, light class, and 1249x1221 viewport restored. No state fixtures or backend mutations.
- Reusable-pattern decision: reuse the profile's compact native Card/date rail without adding a one-to-one
  wrapper. Played surfaces/expanded rows remain a separately scoped follow-up under DR-006.
- Exceptions: none.
- User decision on 2026-10-21: "Approve DR-006h and commit". The user accepted completion with alternate
  locales, exhaustive hydration, and screen-reader output unverified. These remain unchecked; approval does
  not turn them into passing checks. Status is Done in the backlog. Only this slice and its handoff are
  authorized for commit; no push is authorized.
- Exact next action for a fresh invocation: inspect and scope a separate mounted played-encounter-card child
  under DR-006, preserving expansion and services. Parent DR-006 stays open; no second slice started here.

## Source

- [Template](../../../libs/frontend/components/games/encounter-card/src/encounter-card.component.html)
- [Component](../../../libs/frontend/components/games/encounter-card/src/encounter-card.component.ts)
- [Team consumer](../../../libs/frontend/pages/club/src/pages/team-detail/page-team-detail.component.html)
- [Schedule consumer](../../../libs/frontend/pages/club/src/pages/detail/tabs/club-schedule-tab.component.html)
- [Draw consumer](../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.html)
