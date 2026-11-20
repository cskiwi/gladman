---
title: 'DR-070b: Ranking table average explanations'
description: 'Accessible explanations for promotion and relegation averages on ranking game rows.'
---

## Scope

- Parent: DR-070 in the [backlog](../backlog.md); follow the [design rules](../README.md).
- Mounted consumer: `/players/glenn-latomme/ranking/single`, confirmed in Dutch on 2026-11-20.
  The same ranking games list serves other disciplines. Affected Nx project: `frontend-pages-player`.
- Keep ranking calculations, sorting, filters, date details (DR-070a), simulation, stepper labels
  (DR-071), routes, and shared theme outside this change.

## Baseline and approach

- The mounted six-row Singles table has an upgrade average column by default. Its nonzero average was plain
  text in the accessibility tree. The cell-level tooltip is pointer-only and exists even on blank cells.
- Use a single local template for both directions, with a styled PrimeNG button and anchored Popover.
  Reuse the [games list][games] date-details interaction; no new shared component or styling layer.

## Acceptance and verification

- [x] Confirm the mounted table and define one independently reviewable slice.
- [x] Preserve the calculations, threshold text, and native status indicators; explain the actual divisor.
- [x] Show controls for calculated averages (including zero), not cells without a calculation.
- [x] Verify hover, contextual names, keyboard opening, dismissal, and focus return.
- [x] Verify promotion popover bounds at narrow and wide widths in light and dark.
- [x] Verify compact count labels, full header tooltips, and dashed average underlines in Dutch Doubles at both widths.
- [ ] Verify touch opening and dismissal, screen-reader use, and visual contrast in both themes.
- [ ] Verify a non-default minimum-game divisor in the relegation explanation.
- [ ] Verify locale, simulation and no-data states, and SSR/hydration where relevant.
- [x] Run focused Nx lint, build and test.
- [ ] Obtain visual review.

## Implementation and evidence

- One local template serves promotion and relegation. Native Button, Popover, and Tag supply control, overlay,
  and status styling. The popovers reuse the date control's hover/activation handlers and close timer.
  Only layout, text wrapping, and heading hierarchy utilities were added. No stylesheets, color exceptions,
  translation keys, or shared components changed. A separate component would not have another consumer.
- The upgrade baseline displayed `45` and hovered as `313 / 7`, with the minimum-game and threshold
  explanations. The new upgrade popover matched that text and kept the Tag. The two relegation controls
  showed `0 / 1` and `313 / 2`; four uncalculated relegation cells had no controls. The relegation text now
  uses the calculation's corrected divisor when a minimum applies, instead of always showing the raw count.
  The mounted fixture did not exercise a corrected relegation divisor.
- In the Dutch Singles route, Enter and Space opened named popovers and focused Close. Escape and mouse
  Close returned focus to the originating button. Hover held focus in place, let the pointer move into
  the popover and dismissed after leaving both areas. Date details still opened with Enter and returned
  focus on Escape after the handler rename.
- The upgrade popover fit at 390px and 1440px in both themes; viewport and theme were restored. Browser
  touch emulation was inconclusive in the shared page. No physical touch or screen-reader check was run.
- In the first layout revision, the two count headers sized to their labels with sort icons stacked below.
  Their combined width fell from 272px to 234px in Doubles with both columns shown. The icon-to-value gap
  went from 0px to at least 7px, and all 14 average controls fit their cells at both widths. At 390px, the
  last value could be brought fully into view by scrolling the table. Enter still sorted the relegation
  count column, and Space/Escape still opened the average explanation and returned focus in light mode.
- The final revision removes the info icon and applies dashed text decoration directly to tagged and untagged
  values. Untagged values use normal semantic text color. Count headers show translated initials (`P#`, `D#`
  in Dutch), with full accessible names and native PrimeNG hover tooltips. Sorting logic is unchanged.
- After the preview recovered, both count tooltips showed their full Dutch names at 390px and 1440px.
  The columns measured 82px and 83px, and all 14 Doubles averages fit their cells with dashed text underlines.
- `npx nx run-many -t lint build test -p frontend-pages-player --output-style=static`, with `NX_DAEMON=false`
  and `NX_NO_CLOUD=true`, passed after correcting a template equality lint error. Lint had 19 existing
  warnings and no errors. The two existing period-selection tests do not cover the popovers.
- Precommit `npx nx run-many --target=lint --output-style=static` under the same environment failed in the
  same ten unrelated projects recorded for DR-010 and DR-070a. Focused player lint passed.

## Next action

On 2026-11-20 the user selected `Approve DR-070b with the documented limits and commit`. The explicit approval
closes the slice without checking off unperformed verification above.

Reconcile parent DR-070 against both completed children. Leave DR-071 for a separate invocation.

[games]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/components/list-games/list-games.component.html
