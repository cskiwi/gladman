---
title: 'DR-024b5: Scheduling dialogs'
description: 'Presentational Generate-slots and Auto-schedule dialogs with native forms and localized copy.'
---

## Identity and scope

- ID: DR-024b5. Status is authoritative in the [backlog](../backlog.md).
- Parent: [DR-024b Scheduling](DR-024b-admin-scheduling.md). Dependencies: approved DR-024b1 to DR-024b4.
- Consumer: `app-schedule-tab` at `/tournament/:id/admin?tab=schedule`, opened by the toolbar Generate and
  Auto-schedule buttons (confirmed mounted in DR-024b3/b4).
- Change only the two dialogs, their consumed locale keys and focused tests.
- Exclude summary, controls, grid, game panel, `confirm()` publish/delete workflows, backend/schema and shared styling.
- Preserve form defaults, service payloads, `updating` gating and the schedule result contents.

## Approach

- Smart/dumb split (requested): `app-schedule-generate-dialog` and `app-schedule-auto-dialog` own their form state and
  markup and emit `generate` / `run` values; the smart tab keeps the service calls and visibility.
- Follow the approved Draws dialog pattern: responsive `w-full sm:w-md`, native `form`, associated labels, fluid
  controls, in-modal `p-message` error, no dismissal while updating, footer actions inside the form.
- Red-asterisk palette spans and the green/orange/red result palette become `required` inputs, native Tag/Message
  severities and `text-muted-color`.
- Dialog closes after Generate only when the mutation reported no error (previously it always closed).
- English copy ("Scheduled: n games", "Skipped", "Conflicts:", "... and n more", strategy labels) moves to locale keys;
  blank nl_BE/fr_BE values for the dialogs are filled.

## Checklist

- [x] Both dialogs extracted as presentational components with native layout and no palette colors.
- [x] Hard-coded English and blank nl/fr dialog copy localized (strategies, description, results, counts, more-conflicts).
- [x] Focused component tests and the existing schedule tests pass.
- [x] Format, lint and build pass.
- [ ] Browser check on the authorized consumer (light/dark, narrow/wide): Generate dark/wide only; rest not run.
- [x] User review: approved completion and commit on 2026-11-11 with the limits below.

## Evidence

- `npx prettier --write` on the schedule folder, both docs and the three locale files: passed.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=schedule --runInBand --output-style=static`:
  2 suites, 26/26 pass (20 existing plus 6 new dialog tests: defaults/reset on open, single emit, no submit while
  updating or invalid, no close while updating, conflict truncation, auto-dialog defaults).
- `npx nx run-many -t lint build -p frontend-pages-tournament --output-style=static`: passed (7/12 cache replays).
- Schedule tab: dialog markup, forms, strategy/duration options and the Tailwind palette spans are removed from
  `schedule-tab.component.*`; it keeps visibility, service calls and the result signal. Generate now closes only when
  no update error was recorded, and both dialogs show the error inside the modal. The service gains `clearUpdateError()`.
- Browser (Dutch/dark/wide, real empty data, no writes): Generate dialog opens from the real consumer with localized
  labels, defaults (09:00-18:00, 30 min, 0 min break, first day), native fluid controls, no overflow, all six labels
  associated with controls, Generate disabled with no courts, Escape closes it. The Auto-schedule button is disabled on
  this tournament's empty data, so that dialog was not opened.
- Not run: Auto-schedule dialog in the browser, light theme, narrow width, keyboard/focus,
  contrast, live generate/auto-schedule mutations, full suite, SSR/hydration. No operational writes were made.
- Slot-duration labels and the " min" suffix stay as literal numbers with "min"; the `confirm()` publish/delete texts
  and `getGameDisplayName` English remain for a later copy child.
- Court selection (user-reported): the tournament has no linked venues, so `tournamentScheduleCourts` returned nothing and
  the Generate dialog's court list was empty. The dialog now has a filterable Venue select (existing public `locations`
  query with courts, loaded lazily by `ScheduleTabService.loadVenues()`); choosing a venue offers its courts and selects
  all of them. Without a venue it still offers the tournament's linked courts. No backend change. Opening a venue's
  filter no longer risks a reset: the defaults effect reacts only to the dialog opening.
- Browser (Dutch/dark/wide, real data, no writes): the venue list loads and filters; choosing "'t Rosco" selects its
  22 courts and enables Generate. Native "22 items selected" is PrimeNG's English default (see DR-037).
- Tests: 27/27 schedule tests pass; lint and build pass.
- Not verified: submitting Generate (the `generateTimeSlots` mutation is a dormant operational mutation that DR-024b1
  deliberately left unexposed, so generation itself may still fail until it is separately approved and registered).
- Exceptions: none.

## Approval

The user approves completion and commit on 2026-11-11. Unperformed checks stay unchecked and are not claimed:
Auto-schedule dialog in a browser, light theme, narrow width, keyboard/focus, contrast, live generate/auto-schedule
mutations and SSR/hydration.
