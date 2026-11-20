---
title: 'DR-010g: Simulation row actions'
description: 'Make the ranking simulation row controls accessible and use native PrimeNG styling.'
---

## Scope and baseline

- Parent DR-010; follows DR-010d/f. Status: [backlog](../backlog.md). Rules: [design plan](../README.md).
- Project: `frontend-pages-player`. The [games table][table] is mounted on
  `/players/:playerId/ranking/:type`. Confirmed on `/players/glenn-latomme/ranking/single` on 2026-11-20.
- With both settings enabled in Dutch dark mode, six live-game row buttons had no explicit name and measured
  21 × 21 CSS pixels. Six checked latest-window checkboxes had no accessible label. The remove header was blank.
- Use direct PrimeNG controls in the existing list. The real and fictitious removal actions share one button
  template; a separate presentational component would couple another component to the table without reuse.
- Preserve conditional columns and local-only overrides. Exclude the toolbar, Add dialog, other table cells,
  ranking calculations, routes, and shared styling.

## Acceptance

- [x] Confirm a mounted consumer and capture its baseline.
- [x] Use native controls, named column headers, and translated accessible names with row context.
- [x] Verify keyboard operation and focus after local exclusion, simulated removal, and latest-window changes.
- [x] Verify table-local scrolling and control bounds in Dutch light/dark at 390px and 1440px.
- [x] Pass focused player Nx lint/build/test.
- [ ] Complete visual review, contrast, screen-reader, alternate locale, and SSR/hydration checks.

## Evidence and handoff

The shared removal template uses a native PrimeNG text button with danger severity and distinct names for
real-game exclusion and simulated removal. Both controls reference the visible opponent and, for real games,
the date. Tracking rows by game ID keeps focus on a retained checkbox. Either removal returns focus to the
existing Simulation trigger. No toolbar, dialog, ranking calculations, shared styling, or translation catalogs
changed. Static class tokens in the table dropped from 58 to 40 and five inline `style` attributes were removed.
No styling exceptions.

On 2026-11-20, the Dutch Singles preview showed:

- Accessibility snapshots named both column headers, six real-game buttons and six checked checkboxes.
- In both themes, the table scrolled within its 310px container at a 390px viewport. At 1440px it fit without
  scrolling. The checkbox column was reachable in all four cases, and there was no page-level horizontal overflow.
  The native removal button measured 28 x 28 CSS pixels; the unchanged checkbox measured 18 x 18.
- Space changed a row checkbox off and back on without losing keyboard focus. Enter excluded one real game,
  reduced the table from six rows to five, reported one exclusion, and focused Simulation. Reset restored six rows.
- A fictitious game added a seventh row and a distinct removal button even with real-game exclusion disabled.
  Enter removed it, hid the Actions column, and returned focus to Simulation. No persisted data was changed.
- As on the earlier slices, the shared preview logged an aborted view transition on reload; completed interaction
  checks were unaffected. Full visual review, touch and target spacing, contrast, screen-reader announcements,
  alternate locales and Doubles/Mixed layout, and SSR/hydration remain unverified.

With `NX_DAEMON=false` and `NX_NO_CLOUD=true`, the following passed:

```powershell
npx nx run-many -t lint build test -p frontend-pages-player --output-style=static
```

Lint reported 19 existing warnings and zero errors. The production library build and two existing period tests
passed; those tests do not exercise row controls.

### Approval and next action

On 2026-11-20 the user selected `Approve DR-010g with the documented limits and commit`.
The unchecked visual, accessibility, locale, Doubles/Mixed, and SSR/hydration checks remain unverified.

Precommit `npx nx run-many --target=lint --output-style=static` under the same Nx environment failed in the
same ten unrelated projects documented for DR-010f. The focused player checks passed.

Next: reconcile DR-010 against its completed children and the deferred DR-070 hover-details work;
do not reopen earlier slices.

[table]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/components/list-games/list-games.component.html
