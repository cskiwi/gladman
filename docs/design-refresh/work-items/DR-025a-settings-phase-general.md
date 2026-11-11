---
title: 'DR-025a: Settings phase stepper and general settings'
description: 'Native Panel chrome, stepper labels and plain form markup for the first two Settings sections.'
---

## Identity and scope

- ID: DR-025a. Status is authoritative in the [backlog](../backlog.md).
- Parent: DR-025 tournament admin settings and phase controls. Dependencies: approved DR-023a admin chrome.
- Consumer: `app-settings-tab` (tab 0, always enabled) at `/tournament/:id/admin`, confirmed mounted in the browser
  (Dutch, dark) on 2026-11-11.
- Change only `app-phase-stepper` and `app-general-settings` (templates and their imports).
- Exclude sub-events table/dialog (DR-025b), the smart `settings-tab` handlers, backend and shared/global styling.
- Preserve: phase advance/back outputs and gating, form validators, save payload, error message, translations.

## Approach

- Both sections used the same hand-built shell (bordered div, icon circle, h3 + description). It is replaced by a
  native `p-panel` with `header`; no wrapper component was added (the shell is now one PrimeNG element).
  The settings tab stays the smart component and the two sections stay presentational (inputs/outputs only).
- Stepper: native `p-step` text (number and label) replaces the custom circle button; the tooltip description is
  kept and the current phase description is shown as visible muted text. The stepper scrolls inside its own wrapper
  at narrow widths.
- General settings: plain `label for` + `fluid` inputs, date pickers use `inputId` so labels focus the input,
  options in a native `fieldset`/`legend`; palette `text-red-500`, `bg-emphasis` boxes and primary tint circles removed.

- Revision after review (2026-11-11): the first stepper dropped the step icons and overflowed a 390px panel. Icons are
  back as step markers; below `lg` the seven-step stepper is replaced by a native ProgressBar plus the current phase
  icon, name and description. Labels show under icons from `lg` up.

## Checklist

- [x] Native Panel/Stepper replace hand-built shells, icon circles and palette colors.
- [x] Handlers, outputs, validators and gating unchanged.
- [x] Lint and build pass; admin tests unchanged (see evidence).
- [x] Browser: Dutch dark wide and dark 390px, no document overflow.
- [ ] Light theme, keyboard/focus, contrast, advancing/saving with safe data.
- [ ] User review.

## Evidence

- `npx nx run-many -t lint build -p frontend-pages-tournament --output-style=static`: passed.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=admin`: 257 pass, 4 fail in `draws-tab` and
  `draw-locales` specs. The same 4 fail with these changes stashed, so they are pre-existing (not touched here).
- Browser (read only, no writes): Panels render with localized headers; stepper shows 7 labeled steps and the current
  phase description; buttons present; 390px has no document overflow.
- Not run: light theme (the emulated color scheme did not change the app theme), keyboard, contrast, live save or
  phase change, SSR/hydration, new unit tests for the two components.
- Exceptions: none.

## Next action

Scope DR-025b sub-events (table, filters and dialog) on the same consumer. Also record: the sub-events table still
has English `Any`/`Yes`/`No`/`Edit`/`Delete` literals and palette classes.

## Approval

The user approves completion and commit on 2026-11-11. Unperformed checks stay unchecked: light theme, keyboard/focus,
contrast, live save/phase change, SSR/hydration, new component tests, formal user review.
