---
title: 'DR-026c: Live upcoming display'
description: 'Refresh the public /tournament/:id/live/upcoming display with native PrimeNG and the shared live header.'
---

## Identity

- ID: DR-026c (child of DR-026).
- Area and intended outcome: `/tournament/:tournamentId/live/upcoming` adopts `app-live-display-header`, native
  `p-card`/`p-tag`/`p-message`, with semantic colors only.
- Parent, dependencies, and blockers: DR-026; DR-026a (shared header) is Done; none.
- Design rules: [redesign plan](../README.md).

## Scope

- Mounted consumer: lazy route `live/upcoming` (`frontend-pages-tournament`).
- Files: `pages/live-upcoming/page-live-upcoming.component.{ts,html}`.
- Preserve: public access, live connection/disconnect, translations, stats tag, empty state.
- Exclusions: kiosk page, live service, the shared header.

## Changes

- Replaced the hand-built header (`t-eyebrow`, `font-display`, `border-b`) and `bg-emphasis` page fill with the shared header.
- Removed `border-green-500`, `text-green-500`, `bg-red-50`/`orange-50` and `*-500` announcement icon colors.
  Announcements are now native `p-message` (urgent=error, warning=warn, otherwise info).
- Cards wrap on narrow widths; removed unused `NgClass` import.
- Redesign (2026-11-11, user feedback: cramped, inline "vs", hard to read): new presentational
  `app-live-game-card` (`components/live-game-card`) with time/court separated and teams stacked; reusable by
  results/courts/kiosk.
- Rework (2026-11-11, user feedback: must match the player profile, no inline templates, SSR error): shared
  `app-live-display-header` now renders breadcrumb + `app-hero` (also affects live courts/results, which share it);
  `app-live-game-card` follows the player upcoming-game card (time column, tag, stacked teams, court); both
  templates moved to `.html` files. `TournamentLiveService.connectToTournament` is a no-op on the server
  (`window is not defined` during SSR).
- Final layout (2026-11-11, user feedback: match the profile, fewer Tailwind classes): section header plus a
  vertical list of `app-live-game-card` (copy of the profile upcoming-encounter card structure; no table, no
  outer card). The hero shows the tournament name/crest (new `name` field in the query) and the breadcrumb links
  back to the tournament.
- Fix (2026-11-11): the `minmax(26rem,1fr)` grid overflowed the right edge at 375px; it is now single-column and
  switches to the auto-fill grid from `md`.
- Behavior change (requested 2026-11-11): the placeholder empty list is replaced by a public GraphQL load
  (`tournamentEvent` sub-events/draws/games plus `tournamentScheduleCourts`). Unfinished games show soonest first and
  reload on schedule updates and game completions. No backend change.

## Implementation checklist

- [x] Behavior and translation keys preserved.
- [x] Native PrimeNG used; palette colors removed.
- [x] Shared header adopted.
- [x] Lint passes.
- [x] Browser: light wide empty state.

## Acceptance and verification

- [x] `npx nx lint frontend-pages-tournament` passes.
- [x] Browser: dark 375px populated cards (no horizontal overflow: scrollWidth 375, cards 28-347).
- [x] `npx nx build frontend-pages-tournament` passes (exit 0).
- [ ] Browser: announcements (needs a live announcement; not created to avoid mutations), light 375px.
- [ ] Keyboard/contrast, tests.

## Evidence and handoff

- Browser (Dutch, light, wide): empty state with shared header and Live tag renders correctly.
- Browser (Dutch, light, wide): 4 unfinished games from the HD TEST draw render with court, time and team names.
- Browser (Dutch, dark, 375px): populated cards stack in one column after the overflow fix, with Next tag, court and time.
- Browser (Dutch) after the card redesign: dark wide, light wide and light 375px show no overlap and a readable
  hierarchy (time, stacked teams, category/court).
- Browser (Dutch) final layout: light wide, dark wide, dark 375px render like the profile list; no overlap.
- Status: Done with explicit user approval (`commit`, 2026-11-11); the unchecked criteria above are accepted limits, not passed checks. Layout evolved with user feedback: players per side like recent games, time as primary rail element, two columns from `xl`.
- Previously: Review. Announcements, light 375px, keyboard/contrast and tests are not verified.
- Next: DR-026d kiosk.
