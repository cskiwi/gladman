---
title: 'DR-026d: Live kiosk display'
description: 'Refresh the public /tournament/:id/live/kiosk cycling TV display with native PrimeNG and semantic colors.'
---

## Identity

- ID: DR-026d (child of DR-026).
- Area and intended outcome: `/tournament/:tournamentId/live/kiosk` drops its hard-coded slate/rose/emerald/blue palette
  for semantic colors and native `p-card`/`p-tag`/`p-message`, staying readable at display distance.
- Parent, dependencies, and blockers: DR-026; DR-026a to c Done; none.
- Design rules: [redesign plan](../README.md).

## Scope

- Mounted consumer: lazy route `live/kiosk` (`frontend-pages-tournament`).
- Files: `pages/live-kiosk/page-live-kiosk.component.{ts,html}`.
- Preserve: public access, live connection/disconnect, 15 s view cycling, clock, stats footer, translations.
- Exclusions: live service, courts/results/upcoming pages, shared header (a kiosk is full screen; no breadcrumb).

## Changes

- Removed `bg-slate-*`, `text-rose/emerald/blue/orange/red-*`, `border-*-900`, gradients, shadows and `uppercase tracking-widest`
  headings. Courts and results are native `p-card` with `p-tag` status and `bg-highlight` winners; announcements are native
  `p-message` (urgent=error, warning=warn, info); the connection state is a `p-tag`; the stats footer is a `p-card`.
- Replaced four copy-pasted progress dots with a loop over a new `viewNames` computed (also drives `currentView`).
- Removed unused `NgClass`; added `CardModule`, `MessageModule`.

## Implementation checklist

- [x] Behavior and translation keys preserved.
- [x] Native PrimeNG used; palette colors removed.
- [x] Lint passes.
- [x] Build passes.
- [x] Browser: light/dark wide (empty courts state).

## Acceptance and verification

- [x] `npx nx lint frontend-pages-tournament` passes.
- [x] `npx nx build frontend-pages-tournament` passes.
- [ ] Browser: populated courts/results, announcements, upcoming view, 375px, view cycling (no live data; no mutations made).
- [ ] Keyboard/contrast, tests.

## Evidence and handoff

- Browser (Dutch, 1174px): dark and light render the empty courts view with header, clock and Live tag; no horizontal overflow.
- Status: Done with explicit user approval (`commit`, 2026-11-11). The unchecked criteria above (populated views, announcements, upcoming view, 375px, view cycling, keyboard/contrast, tests) are accepted limits, not passed checks.
- Next: reconcile parent DR-026.
