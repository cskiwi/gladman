---
title: 'DR-025c: Settings confirmations and shared error feedback'
description: 'Native confirm dialogs for phase changes and sub-event deletion, and one error message for the Settings tab.'
---

## Identity and scope

- ID: DR-025c. Status is authoritative in the [backlog](../backlog.md).
- Parent: DR-025. Consumer: `app-settings-tab` at `/tournament/:id/admin` (tab 0).
- Selected because advancing/reverting the tournament phase and deleting a sub-event ran immediately without
  confirmation, and `updateError` was only displayed inside General settings, so phase and sub-event failures were silent.
- Exclude backend, service fallback error texts, and the dumb components' layout.

## Approach

- Smart `settings-tab` owns confirmations (native `p-confirmdialog` via `ConfirmationService`, same pattern as
  Scheduling DR-024b6) for next/previous phase and sub-event delete (danger severity).
- One `p-message severity="error"` for `updateError` at the top of the tab; removed the duplicate input, message and
  `MessageModule` from `app-general-settings`.
- New localized keys `all.tournament.admin.settings.{advancePhaseConfirm,goBackPhaseConfirm,deleteSubEventConfirm}` (nl/fr/en).

## Checklist

- [x] Handlers, payloads and dumb component outputs unchanged; confirmation only wraps the mutation call.
- [x] Lint and build pass.
- [x] Browser (authenticated, Dutch, dark): next-phase and sub-event delete dialogs open with localized text,
      danger accept on delete; Escape/Cancel closes without mutating; 375px dialog fits, no document overflow.
      Previous-phase dialog and light theme not checked; no confirmation was accepted (no live mutation).
- [ ] Error message visibility for a failed phase/sub-event mutation.
- [ ] Keyboard/focus, contrast, component tests.
- [ ] User review.

## Evidence

- `npx nx run-many -t lint build -p frontend-pages-tournament --output-style=static`: passed (12 tasks).
- Exceptions: none. No SCSS or palette classes added.

## Next action

Start the API (port 5000) with an admin session, browser-check the three dialogs and an error state, then review.

## Approval

The user approves completion and commit on 2026-11-11. Unperformed checks stay unchecked: error message display,
light theme, previous-phase dialog, accepting a mutation, keyboard/contrast, component tests, formal user review.
