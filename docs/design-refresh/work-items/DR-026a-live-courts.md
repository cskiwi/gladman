---
title: 'DR-026a: Live courts display'
description: 'Refresh the public /tournament/:id/live/courts display with native PrimeNG and a shared live header.'
---

## Identity

- ID: DR-026a (child of DR-026).
- Area and intended outcome: `/tournament/:tournamentId/live/courts` uses native `p-card`/`p-tag`, semantic colors
  only, and a shared presentational `app-live-display-header` that results/upcoming (and later kiosk-adjacent
  pages) can adopt.
- Parent, dependencies, and blockers: DR-026; none.
- Design rules: [redesign plan](../README.md).

## Scope

- Mounted consumer: `lib.routes.ts` lazy route `live/courts` (`frontend-pages-tournament`).
- Files: `pages/live-courts/page-live-courts.component.{ts,html}`, new
  `components/live-display-header/live-display-header.component.ts`.
- Preserve: public access, live connection/update behavior, `/live` redirect, translations, game/sets/winner data.
- Exclusions: results, upcoming and kiosk pages (they keep their own header until their children), live service.

## Baseline and proposed approach

- Removed: `t-eyebrow` label, `bg-emphasis` page fill, `border-l-4 border-{green,blue,orange}-500`, `bg-green-100`,
  inline `style` colors (`--g-win`, `rgb(180,83,9)`), `font-display`, hand-built stat tile border/rounding.
- Status is carried by native `p-tag` severity; winner by `bg-highlight` + bold.
- Smart page keeps service wiring; header is a dumb component (title + connection state inputs).

## Implementation checklist

- [x] Dependencies confirmed; slice limited to the courts display.
- [x] Behavior and translation keys preserved.
- [x] Native PrimeNG used; palette/inline colors removed.
- [x] Shared dumb header extracted (used by this page now; results/upcoming adopt it in their children).
- [x] Lint/build pass.
- [x] Browser checks (light/dark, narrow/wide).

## Acceptance and verification

- [x] Lint and build for `frontend-pages-tournament` / app pass.
- [x] Dark and light, 375px and wide render with data/empty states.
- [ ] Keyboard/contrast.

## Evidence and handoff

- Validation: `npx nx lint frontend-pages-tournament` passed; `npx nx build app` finished without errors (`pnpm` shim
  is broken in this shell, so Nx ran through npx). Prettier applied.
- Browser (Dutch): empty state dark wide/375px, then client-side fixture data (4 courts: playing, available,
  blocked, completed with winner; stats) injected into the page's `TournamentLiveService` signals via the dev-mode
  component handle. No database or backend mutation was made. Dark wide, light wide and light 375px all render
  correctly: stats card, status tags, winner highlight, set scores and start time. Dark 375px of the populated state was
  not separately captured. Keyboard and contrast checks not run; no tests added or run.
- Remaining: user visual review of the pattern before DR-026b/c adopt the header.
- Exceptions: none.
