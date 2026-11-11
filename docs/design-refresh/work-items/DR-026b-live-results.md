---
title: 'DR-026b: Live results display'
description: 'Refresh the public /tournament/:id/live/results display with native PrimeNG and the shared live header.'
---

## Identity

- ID: DR-026b (child of DR-026).
- Area and intended outcome: `/tournament/:tournamentId/live/results` adopts `app-live-display-header` and native
  `p-card`/`p-tag`, with semantic colors only.
- Parent, dependencies, and blockers: DR-026; DR-026a (shared header) is Done; none.
- Design rules: [redesign plan](../README.md).

## Scope

- Mounted consumer: lazy route `live/results` (`frontend-pages-tournament`).
- Files: `pages/live-results/page-live-results.component.{ts,html}`.
- Preserve: public access, live connection/disconnect, translations, winner/set/end-time data.
- Exclusions: upcoming and kiosk pages, live service, the shared header.

## Changes

- Replaced the hand-built header (`t-eyebrow`, `font-display`, `border-b`) and `bg-emphasis` page fill with the shared header.
- Removed `bg-green-100`, `text-yellow-500` and the first-card `border-2 border-primary`; winner uses `bg-highlight`
  and `text-primary` trophy; set scores are `p-tag severity="secondary"`.
- Rows wrap on narrow widths; removed unused `TableModule` import.
- Compact for TV: cards sit in an auto-fill grid (min 26rem, two columns at ~1300px) with tighter padding.

## Implementation checklist

- [x] Behavior and translation keys preserved.
- [x] Native PrimeNG used; palette colors removed.
- [x] Shared header adopted.
- [x] Lint passes.
- [x] Browser checks (light wide, light 375px, client fixture data).

## Acceptance and verification

- [x] `npx nx lint frontend-pages-tournament` passes.
- [ ] Dark theme, empty state, keyboard/contrast, large-display readability, build.

## Evidence and handoff

- Browser (Dutch, light): two fixture games injected into the page's `TournamentLiveService` signals (client only, no
  backend mutation); wide and 375px render and wrap correctly. Dark, empty state, build, keyboard/contrast and tests
  were not run.
- Status: Done with explicit approval (`commit`, 2026-11-11); unchecked limits above stay open (also 375px after compaction).
- Next: DR-026c upcoming adopts the header, then DR-026d kiosk.
