---
title: 'DR-025b: Settings sub-events table and dialog'
description: 'Native Panel chrome, localized table literals and plain dialog form for the Settings sub-events section.'
---

## Identity and scope

- ID: DR-025b. Status is authoritative in the [backlog](../backlog.md).
- Parent: DR-025. Consumer: `app-sub-events` inside `app-settings-tab` at `/tournament/:id/admin` (tab 0).
- Change only the `app-sub-events` template, its `PanelModule` import, one option list and the `any` locale key.
- Exclude the smart `settings-tab` handlers, outputs and payloads, backend and shared/global styling.

## Approach

- Hand-built bordered shell and icon circle replaced by a native `p-panel` (header template holds title and Add button).
- Table: native `size="small"`, removed `overflow-x-auto` wrapper, hover and font classes; level numbers are plain text;
  waiting list is a native `p-tag` (success/secondary) instead of green palette circles.
- Localization: `Any`, `Yes`, `No`, `Edit`, `Delete` literals now use `all.tournament.admin.settings.any` (new, nl/fr/en),
  `all.common.yes/no` and `all.button.edit/delete`; icon buttons gain aria-labels.
- Dialog: `text-red-500` asterisks, `bg-emphasis` checkbox box and label utility classes removed; `fluid` inputs.
- Removed a leftover `console.log` from `saveSubEvent`.

## Checklist

- [x] Native Panel/Tag replace hand-built shell, circles and palette colors.
- [x] Handlers, outputs, validators and payloads unchanged.
- [x] Lint and build pass.
- [x] Browser: Dutch, dark, wide and 390px, no document overflow.
- [ ] Light theme, keyboard/contrast, live create/edit/delete, dialog dropdown re-check.
- [ ] Keyboard/contrast, live create/edit/delete, component tests.
- [ ] User review.

## Evidence

- `npx nx run-many -t lint build -p frontend-pages-tournament --output-style=static`: passed.
- Browser (authenticated, Dutch, dark): the Panel overflowed the page because the table widened the Panel grid column;
  fixed with `w-0 min-w-full` on the content wrapper so the table scrolls inside it. 390px: no document overflow.
  Dialog selects showed raw translation keys with `pTemplate="item"`; named `#item`/`#selectedItem` templates fix it
  (selected values now render Gemengd/Dubbelspel). Lint and build re-run: pass.
- Exceptions: none.

## Next action

Browser-verify DR-025a/b with an authenticated session (and the API on port 5000), then DR-025c phase controls review
or reconcile parent DR-025.

## Approval

The user approves completion and commit on 2026-11-11. Unperformed checks stay unchecked: light theme, keyboard/contrast,
live create/edit/delete, component tests, formal user review.
