---
title: 'DR-010f: Simulation toolbar and settings'
description: 'Clarify the ranking simulation controls and name their native settings popover.'
---

## Scope and baseline

- Parent DR-010; follows completed DR-010e. Status: [backlog](../backlog.md). Rules: [design plan](../README.md).
- Project: `frontend-pages-player`. The [ranking page][page] renders the [games list][list] on
  `/players/:playerId/ranking/:type`. Confirmed both controls mounted on `/players/glenn-latomme/ranking/single`.
- Clarify Add, settings, and reset priorities. Name the native Popover and connect it to its trigger.
  Preserve the two labelled checkboxes, conditional reset and exclusion count, and local-only simulation.
- Exclude the Add simulated game dialog, row controls, ranking calculations, routes, and shared theme.
- Dutch dark desktop baseline (1368px): both actions were text buttons, the active-state cue was `!`,
  and the 236px popover had two labelled unchecked checkboxes but no accessible dialog name or trigger
  relationship. The games table showed six rows. No persisted data was changed.
- Use direct PrimeNG primitives. The toolbar and settings have one consumer and share local state with the list;
  no new smart/presentational split is needed.

## Acceptance

- [x] Confirm a mounted consumer and capture the baseline.
- [x] Use native PrimeNG controls and no new custom styling or palette utilities.
- [x] Verify baseline-state toolbar and open popover bounds in Dutch light/dark at 390px and 1440px.
- [x] Verify accessible names, expanded state, keyboard entry, forward Tab wrap, Escape, and focus return.
- [x] Verify settings, conditional reset, local additions, and exclusion count without persisting data.
- [x] Pass focused player Nx lint/build/test.
- [ ] Complete visual review, including the override state at narrow widths, and measure contrast.
- [ ] Verify screen-reader announcements, reverse Tab wrap, outside-click dismissal, alternate locales,
      Doubles/Mixed layout, and full SSR/hydration.

## Evidence and handoff

The toolbar now prioritizes Add, uses an outlined secondary settings button, and uses the existing translated
Reset action instead of the `!` badge as the visible override cue. The exclusion count is a status region.
The named Popover uses the existing labelled checkboxes and PrimeNG FocusTrap. Reset returns focus to Add
when its button disappears. Ranking calculations, simulation state, the Add dialog, row actions, and shared
styles are unchanged. Static `class` tokens (including icons) decreased from 30 to 26, with one conditional
`sr-only` utility to keep the empty status out of the layout. No styling exceptions.

On 2026-11-20, the shared Dutch Singles preview showed:

- The toolbar and popover fit at 390px and 1440px in both themes, with no internal horizontal popover overflow.
- Enter opens the named dialog and focuses the first checkbox. Space toggles both checkboxes, Tab wraps from the
  second to the first, and Escape closes the dialog and restores trigger focus. The trigger's expanded state
  tracks visibility and its controls reference points to the settings content. Focus matched `:focus-visible`
  in all four layout probes; focus indicator contrast was not measured.
- The latest-window override revealed Reset. A local exclusion reduced six rows to five and showed the count of
  one. Adding a local game brought the count back to six. Reset restored the original six rows and checked
  latest-window state, hid its own button, and focused Add. Reload restored the untouched baseline. No save ran.
- The shared browser logged `InvalidStateError: Transition was aborted because of invalid state` on route loads
  before and after the change; the interaction checks still completed.

With `NX_DAEMON=false` and `NX_NO_CLOUD=true`, the following passed:

```powershell
npx nx run-many -t lint build test -p frontend-pages-player --output-style=static
```

Lint reported 19 warnings and zero errors. Build and two existing period tests passed; the tests do not exercise
these controls. `git diff --check` passed.

### Approval and next action

On 2026-11-20 the user selected `Approve DR-010f with the documented limits and commit`.
The unchecked visual, accessibility, locale, and SSR/hydration checks remain unverified.

Precommit `npx nx run-many --target=lint --output-style=static` under the same Nx environment failed on existing
`@nx/dependency-checks` version mismatches in ten unrelated projects, matching DR-010e. Focused player checks pass.

Next: confirm the mounted row actions and scope them as a separate child, including the unnamed remove buttons
and latest-window checkboxes. Keep DR-010 open and leave the completed dialog and toolbar unchanged.

[page]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/page-ranking-breakdown.component.html
[list]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/components/list-games/list-games.component.html
