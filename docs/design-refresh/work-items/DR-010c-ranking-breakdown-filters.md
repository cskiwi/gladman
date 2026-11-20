---
title: 'DR-010c: Ranking breakdown filters and view toggles'
description: 'Refresh only the included-game filters and point-column toggles on the player ranking breakdown.'
---

## Scope and baseline

- Parent: DR-010. Status: [backlog](../backlog.md). Rules: [design plan](../README.md).
- Project: `frontend-pages-player`. Source: [ranking breakdown page][page]. Mounted on 2026-11-20 at
  `/players/glenn-latomme/ranking/single` after DR-010a and DR-010b.
- The Dutch dark browser accessibility tree shows four count-bearing filters (6, 2, 3, 0) and two point-column
  toggles. The first two filters and the upgrade column are pressed. Group labels are plain text with icons.
- Use a native Card, labelled groups and compact native ToggleButtons. Keep the page/service split: the same
  service already owns state shared with the table and there is no second consumer of this control layout.
- Preserve independent selection, translated labels, counts, the latest-X condition and URL persistence.
  Exclude the header, period controls, games table markup, simulation, and shared styling.

## Acceptance

- [x] Two translated group names and six native toggle labels are exposed, with independent pressed states (Dutch).
- [x] Each toggle changes its original query parameter; representative filter and view changes update the table.
- [x] Reloading a link with all six non-default parameters restores filter and view state.
- [ ] Latest-X-only controls are hidden for a ranking system with no latest-X limit.
- [x] The groups fit at narrow and wide widths in light and dark.
- [x] All six controls are keyboard-operable and receive visible focus in tab order.
- [ ] Contrast and alternate locale rendering are verified.
- [x] No new styling layer, non-semantic colors, or shared component changes.
- [x] Focused player Nx lint, build and existing tests pass.
- [x] After-change browser evidence is recorded.
- [x] User approved the mounted Card with the documented verification limits.

## Evidence and handoff

- Dark-wide before/after screenshots: inline icon labels and a custom surface became two native fieldsets with
  legends above the controls in a single styled Card. The last toggle also shows its focus outline in the after view.
- The template drops palette/border and icon utilities. The remaining utilities handle wrapping, spacing, typography,
  and resetting the browser's fieldset border/spacing so the Card supplies the only surface. No exception.
- Existing reactive form controls bind directly to the four filters; the view toggles update their existing signals.
  Each pressed/unpressed pair shares one translated label expression. No new component, styles, or state owner.
- Dutch DOM bounds: at 390px the groups stack; at 1440px they sit side by side. All six fit in both themes and
  the shortest target is 31px high. These were bounds checks, not a full screenshot matrix.
- Space/Enter changed all six original query parameters and flipped the expected pressed states. Reloading that
  URL restored all six. From the default six game rows, turning off promotion yielded no rows and turning on
  unused games yielded nine. The out-of-scope fixture has zero matches. The promotion and degradation column
  controls changed the displayed headings as expected; no simulation or data mutation ran.
- Tab from the preset trigger reached all six toggles in order with `:focus-visible` and a solid outline.
  The starting URL, theme and native viewport were restored. The preview logged aborted view transitions,
  including on reload, but the tested navigation completed.

## Validation and resume

With `NX_DAEMON=false` and `NX_NO_CLOUD=true`, the following passed after the final template change:

```powershell
npx nx run-many -t lint build test -p frontend-pages-player --output-style=static
```

Player lint: 19 warnings, zero errors. Build passed. Both existing period-selection tests passed; the six
toggle interactions were checked in the browser rather than by those tests.

Not run: no-limit ranking-system fixture (the existing visibility guard is unchanged), out-of-scope matches
with a nonzero count, alternate locales, numeric contrast, full screenshot matrix, or full SSR/hydration.
Before committing, `npx nx run-many --target=lint --output-style=static` under the same environment failed in ten
unrelated projects on pre-existing `@nx/dependency-checks` version mismatches. Player lint passed.

On 2026-11-20 the user selected `Approve DR-010c with the documented limits and commit`. The unperformed checks
listed above remain unverified.

Next: confirm the mounted games table and scope a separate DR-010 child, excluding simulation. Keep DR-010 open.

[page]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/page-ranking-breakdown.component.html
