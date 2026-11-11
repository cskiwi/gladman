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
- [ ] Browser: dark, 375px, populated cards, announcements.
- [ ] Keyboard/contrast, build, tests.

## Evidence and handoff

- Browser (Dutch, light, wide): empty state with shared header and Live tag renders correctly.
- Browser (Dutch, light, wide): 4 unfinished games from the HD TEST draw render with court, time and team names.
- Status: Review. Announcements were not visually verified.
- Next: DR-026d kiosk.
