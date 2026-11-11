---
title: 'DR-024b6: Scheduling confirmations and copy'
description: 'Localized native confirmation dialogs and game names for the Scheduling tab.'
---

## Identity and scope

- ID: DR-024b6. Status is authoritative in the [backlog](../backlog.md).
- Parent: [DR-024b Scheduling](DR-024b-admin-scheduling.md). Dependencies: approved DR-024b1 to DR-024b5.
- Consumer: `app-schedule-tab` at `/tournament/:id/admin?tab=schedule` (Publish schedule button; game names in the grid
  and unscheduled panel).
- Change only the two browser `confirm()` prompts, the English "TBD"/"vs" game name, their locale keys and tests.
- Exclude grid, controls, dialogs, service error fallbacks (`Failed to ...` in `schedule-tab.service.ts`), backend.

## Approach

- Replace `window.confirm()` with the native PrimeNG `p-confirmdialog` (as in the club team builder), with localized
  header, message and accept label, a shared Cancel label, and a danger accept button for deletion.
- `getGameDisplayName` uses `tbd` and `versus` locale keys (interpolated, so word order can differ per language).
- New keys `tbd`, `versus`, `publishConfirm`, `deleteSlotConfirm` in en, nl_BE and fr_BE.

## Checklist

- [x] Publish and delete confirmations are native, localized dialogs; no `window.confirm`.
- [x] Game display name localized in all three locales.
- [x] Focused tests pass (confirmation copy per locale, no mutation before accept, localized names).
- [x] Format, lint and build pass.
- [x] Browser check on the authorized consumer: Publish confirmation, Dutch, dark wide, dark/light at 375px.

## Evidence

- `npx nx run frontend-pages-tournament:test --testPathPatterns=schedule --runInBand --output-style=static`:
  2 suites, 30/30 pass (27 existing plus 3 new locale cases).
- `npx nx run-many -t lint build -p frontend-pages-tournament --output-style=static`: passed.
- Browser (Dutch, real empty data, no writes): the Publish button is disabled with no slots, so the confirmation was
  opened by calling `publishSchedule()` on the mounted component. The native dialog shows the localized header,
  message, outlined Annuleren and primary Publiceren; it fits at 375px in dark and light; Annuleren closes it without
  a mutation. Wide light theme was not checked.
- Not run: keyboard/focus, contrast, live publish/delete (the delete handler `deleteSlot` currently has no
  template caller, so it is only unit-tested), SSR/hydration.
- Exceptions: none.

## Approval

The user approves completion and commit on 2026-11-11. Unperformed checks stay unchecked: light wide theme,
keyboard/focus, contrast, live publish/delete, SSR/hydration.
