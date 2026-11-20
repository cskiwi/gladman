---
title: 'DR-010b: Ranking breakdown period selection'
description: 'Refresh the date and preset controls on the mounted player ranking breakdown.'
---

## Scope and baseline

- Parent: DR-010. Status: [backlog](../backlog.md). Rules: [design plan](../README.md).
- Project: `frontend-pages-player`. [Period selection][control] is already a child of the ranking breakdown and has
  one mounted consumer, confirmed at `/players/glenn-latomme/ranking/single` on 2026-11-20.
- The Dutch dark baseline shows the current range and two unnamed icon buttons. The calendar is embedded in an
  action Menu alongside a colored legend; the DatePicker has no day template that applies those markers.
- Retain the ranking period calculation, query parameter, date format, and four preset actions. Keep the existing
  route/control split; one consumer does not justify another presentational component.
- Exclude the completed header, filters, match results, simulation, and shared theme. Native DatePicker
  localization remains DR-043.

## Acceptance

- [x] Both triggers have distinct label bindings and translated assets in Dutch, English and French.
- [x] The calendar trigger is associated with its Dialog, which opens on the current end date.
- [x] Selecting a custom date through the DatePicker output recalculates the range and closes the Dialog.
- [x] On the mounted route, both overlays and all five actions retain the expected range and end query parameter.
- [x] Control and overlay bounds fit in both themes at narrow and wide viewport settings.
- [x] Both overlays open by keyboard and return focus to their trigger on Escape.
- [ ] Full keyboard traversal, visible focus, and contrast are checked.
- [x] No new styling layer, non-semantic colors, or shared component changes.
- [x] Focused Nx lint, build and component tests pass.
- [x] After-change browser evidence is recorded.
- [ ] Visual review is recorded.

## Evidence and handoff

- Before: mounted Dutch dark screenshot showed `Periode`, the range, and two unnamed icon buttons. No date
  template used the old legend or highlight calculations, so both were removed. The four preset commands and
  period calculation were not changed.
- After in source and Jest DOM: native Dialog and inline DatePicker replace the calendar in a popup Menu. The
  control reflects the selected end date, closes after selection, and keeps the separate native presets Menu.
  The installed Popover only autofocuses explicitly marked content and its Escape handler only hides; Dialog
  supplies native modal focus management instead. The calendar trigger is explicitly focused after Dialog hide
  because the installed Dialog did not restore it after Escape.
- Template class tokens: 43 to 23, including icon classes. Removed the block-only local stylesheet in favor of a
  host layout utility. No new stylesheet, shared extraction, or styling exception.
- Player Jest setup now follows the competition project's zoneless setup, with unknown template elements and
  properties still treated as errors. The first test run failed before executing because Zone.js was missing.

## Validation and resume

With `NX_DAEMON=false` and `NX_NO_CLOUD=true`, the final focused command passed:

```powershell
npx nx run-many -t lint build test -p frontend-pages-player --output-style=static
```

Lint reported 19 warnings and zero errors; the player build and both focused tests passed. The same command
passed again after the focus-return change. Whitespace validation passed.

The initial browser reload failed with `ERR_CONNECTION_REFUSED`. After the user restored the preview:

- The Dutch accessibility tree named both triggers, the Dialog, the close button, and the presets Menu.
  The calendar selected October 12, 2026 on open. The dark control screenshot shows the range and two actions.
- Picking October 20 displayed `21 Oct 2025 - 20 Oct 2026` with `end=2026-10-20` and restored trigger focus.
  The last points preset cleared `end`; last ranking, next points and next ranking set it respectively to
  `2026-09-08`, `2026-10-19` and `2026-10-08`. All four updated the displayed range.
- At viewport settings of 390px and 1440px in light and dark, the period group, Dialog, and Menu stayed within
  the viewport without horizontal overflow. Enter opened the Dialog, Space opened the Menu, and Escape returned
  focus to each trigger in all four cases. The original URL, theme and viewport were restored. No mutations ran.
- Full keyboard traversal, visible focus, contrast, the overlay screenshot matrix, alternate locales, and
  SSR/hydration remain unverified. English native DatePicker internals on the Dutch route remain DR-043.

Precommit `npx nx run-many --target=lint --output-style=static` under the same environment failed in ten
projects on pre-existing `@nx/dependency-checks` version mismatches. No dependency manifests changed.
The restored preview regenerated the tracked translation type with exactly the two new label keys.

On 2026-11-20 the user selected `Approve DR-010b with the documented limits and commit`. The slice closes
without marking visual review, full keyboard traversal, visible focus, contrast, the overlay screenshot matrix,
alternate locales, or SSR/hydration as passed.

Next action: confirm the mounted ranking filters and scope a separate DR-010 child for filters/view toggles.
Do not reopen the header or period controls or start the games table.

[control]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/components/period-selection/period-selection.component.html
