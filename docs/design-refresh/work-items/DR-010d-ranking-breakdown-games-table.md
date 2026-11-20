---
title: 'DR-010d: Ranking breakdown games table'
description: 'Refresh the mounted ranking results table without changing simulation or ranking calculation.'
---

## Scope and baseline

- Parent: DR-010. Status: [backlog](../backlog.md). Rules: [design plan](../README.md).
- Project: `frontend-pages-player`. The [table][table] is mounted on
  `/players/glenn-latomme/ranking/single`; the Dutch dark baseline shows six rows and eight columns.
- Match the home ranking table's native Card, shared heading and default PrimeNG spacing. Simplify header
  decoration and status styling, and expose sorting through
  keyboard-operable buttons. Preserve the existing ascending, descending and default order cycle.
- Preserve conditional columns, values, date hover details, and empty/loading behavior. Exclude simulation controls,
  simulation-only cells and behavior, completed header/period/filters, and shared styling.
- Keep the current page/list/service boundaries. There is only one table consumer; a local template can share sort
  button markup without introducing a second component or a new state owner.

## Acceptance

- [x] Native Card and Table, shared heading, scoped columns and semantic status treatments implemented.
- [x] Date sort accepts Space/Enter, exposes direction and cycles back to the original order with visible focus.
- [ ] Promotion and degradation order cycles are verified.
- [x] Light/dark DOM bounds at 390px/1440px fit; horizontal scroll is local to the table at 390px.
- [x] Downgrade headings and the filtered empty state render in Dutch; original rows return.
- [ ] Loading, hover details, alternate locales and applicable accessibility checks are verified.
- [x] Focused player Nx lint/build/test pass.
- [x] User approved the revised table with the documented verification limits.

## Evidence and handoff

The dark-wide baseline shows decorative glyphs in column headings, click-only sorting, and colored status icons.
The before screenshot was inspected in the browser and is not committed.

- The first implementation used compact density and left the custom surface; the user requested closer alignment
  with the home ranking table. The revision uses the same native Card, existing SectionHeader, default table
  density and scroll configuration. Simulation actions keep their order and handlers, without a colored bar.
- Dark browser comparison with the home level-reference table confirms identical body cell padding
  (10.5px by 14px), header background and transparent rows. The revised dark screenshot was inspected.
- Removed the duplicate overflow wrapper, normal-results inline column widths, decorative header icons and custom
  status badges. Plain translated Yes/No, native Tags for exceptional statuses and signed points replace palette
  classes and hover-only row status icons. Remaining table utilities handle readable wrapping,
  numeric alignment, empty spacing and emphasis. Existing simulation-only styling remains untouched; no new
  SCSS, palette colors, shared/theme changes or exceptions.
- The three sort buttons share a local template and expose the existing sort state as `aria-sort` on the active
  column. The comparison and rank computations are unchanged. Existing hover handlers/tooltip bindings remain;
  DR-070 tracks improving their keyboard and touch access separately.

## Validation and resume

With `NX_DAEMON=false` and `NX_NO_CLOUD=true`, the final run passed:

```powershell
npx nx run-many -t lint build test -p frontend-pages-player --output-style=static
```

Player lint: 19 warnings, zero errors. Build passed and both existing period tests passed; they do not
exercise the games table. `git diff --check` passed.

Precommit `npx nx run-many --target=lint --output-style=static` under the same environment failed in the same
ten unrelated projects as DR-010c. Player lint passed; no unrelated fixes are included.

After the user restarted port 3000, the revised Dutch route was verified. The date column sorted oldest first,
newest first, then original order, with `aria-sort` ascending/descending/removed and a solid focus outline.
The downgrade toggle exposed eleven columns; filtering showed `Geen wedstrijden` and restoring returned six rows.
Measured native horizontal scroll was 598px in a 310px container at 390px, and zero in a 1243px container
at 1440px in both themes. This was programmatic scrolling, not a keyboard or touch scroll test.
Theme and filter settings were restored; no mutations or simulation were run.

On 2026-11-20 the user selected `Approve DR-010d with the documented limits and commit`. The remaining sort cycles,
keyboard/touch scrolling, date/average hover details, loading/error states, numeric contrast, rare-status fixtures,
alternate locales, full screenshot matrix and SSR/hydration remain unverified.

Next: confirm the mounted simulation controls and scope a separate DR-010 child. Keep the parent open.

[table]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/components/list-games/list-games.component.html
