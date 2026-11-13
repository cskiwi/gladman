---
title: 'DR-013e: Builder survey import'
description: 'Native, responsive survey-import dialog without changing matching or persistence algorithms.'
---

## Identity and scope

- ID: DR-013e. Status: see the [backlog](../backlog.md). Parent: [DR-013](DR-013-club-team-builder.md).
- Dependencies: DR-013b and DR-013d (Done). Design rules: [design refresh](../README.md).
- Mounted consumer confirmed on 2026-11-13: `/clubs/smash-for-fun?tab=team-builder`, Enquête Importeren.
- Project: `frontend-pages-club`; nl/fr/en translation assets and generated translation types.
- Scope: [dialog](../../../libs/frontend/pages/club/src/components/team-builder/import-survey-dialog.component.ts),
  its template and the import-only DynamicDialog options/trigger/focus handling in the mounted tab.
- Preserve Excel formats/10MB limit, matching, manual selection, create-new intent, counts and exact close payloads.
- Exclude parser/matcher algorithms, survey editing, notifications (DR-013h), persistence, backend and shared theme.
- No operational mutations or live confirmation for verification.

## Baseline and approach

- Clean worktree. Mounted Dutch dark upload view captured before editing.
- Fixed 800px dialog, English header, no visible Cancel in upload/matching, oversized padding and decorative icon.
- Review uses hand-styled icon buttons, inline sizing, green palette text, raw English confidence values and
  legacy table size class. Autocomplete has no accessible name.
- Native FileUpload custom upload will process only validated files locally, rather than `onSelect` raw files
  followed by a default upload request. Native Message will expose existing parse failures and empty results.
- Use native Button, Tag, Table size, ProgressBar and named AutoComplete with a responsive native Dialog.
  At <=640px, use the native responsive bottom chooser for suggestions; ordinary body-appended suggestions
  extended beyond the viewport when the input was near the right edge of a horizontally scrolled table.
- Use installed `[pAutoFocus]` on step text and replacement row controls; preserve focus when upload/search/
  create controls disappear. Restore the original native trigger after DynamicDialog destruction.
  `closeOnEscape` alone is insufficient in the installed Dialog; enable native `closable` as well.
- Keep orchestration in the existing dialog: no second real consumer warrants a presentational wrapper.
- Literal template class tokens: 60 -> 18. Removed hand-authored Button classes, inline sizing, legacy Table
  size class and green palette text. No component stylesheet, new CSS or theme changes.

## Implementation checklist

- [x] Confirm the mounted consumer, dependencies and independent slice.
- [x] Preserve selection, counts, translations and exact output semantics (focused tests).
- [x] Replace custom UI with native options and remove in-scope inline styling.
- [x] Keep shared components/theme and adjacent workflows unchanged.
- [x] Record related native Dialog findings for DR-013g in the backlog/parent.

## Acceptance and verification

- [x] Native controls, named row actions and localized confidence/empty/error states (source/tests; Dutch browser).
- [x] Valid local selection reaches parsing; invalid type/>10MB rejected in tests; browser invalid type and
      malformed workbook show explicit localized errors. No default upload request is configured.
- [x] Review counts, manual selection, create-new toggles, disabled confirm and close payloads preserved in tests.
- [x] Light/dark at 390px/1440px; long synthetic names scroll within the table, not the dialog/page.
- [x] Keyboard focus, native narrow chooser bounds, Escape/Cancel and trigger return checked in browser.
- [ ] Full accessibility/contrast audit.
- [x] No new palette classes, SCSS or inline styling workarounds.
- [x] Nx lint/build and temporary-zoneless regressions pass; default test setup remains DR-059.
- [ ] fr/en browser and SSR/hydration verified.
- [x] User approval with disclosed limits; unperformed verification remains unchecked.

## Evidence and handoff

- Before screenshot: mounted dark upload dialog, retained in chat only. After narrow upload captured in chat.
- Updated nl/fr/en import keys: contextual actions, four confidence labels, file hint, empty and processing-error
  copy. Reuse shared `all.player.newPlayer` and `all.common.cancel/error`. Native file validation uses localized
  common error and format/size guidance. Existing watcher regenerated translation types; not hand-edited.
- Native DynamicDialog lacks trigger restoration; the import caller restores it on `onDestroy`, after overlay
  removal, for Cancel, header close and Escape. Other dialogs are not silently changed.
- Native responsive suggestions intentionally use a bottom chooser only below 640px. Keyboard search/selection
  remains on the existing named input. No alternative custom overlay or styles were introduced.

### Validation commands and results

- PASS: repository `npx prettier --write` for every changed source, test, generated and handoff file.
- PASS: `npx nx run-many -t lint build -p frontend-pages-club --output-style=static` (12 tasks; inherited warnings).
  Re-run after the final row-focus and responsive chooser changes.
- PASS before commit: `npx nx run-many --target=lint --output-style=static` (34 projects; inherited warnings).
- FAIL before execution:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=import-survey-dialog.component.spec.ts
--output-style=static` — existing missing `zone.js`, DR-059. No dependency or shared test-setup changes.
- PASS:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=team-builder
--jestConfig=tmp\dr013e-jest.config.cjs --output-style=static` — six suites, 18 tests.
  Four new import regressions cover native validated upload, processing/failure/retry/empty, counts,
  create/uncreate, named search, manual selection, exact payloads, confidence levels and Cancel in all steps.
  One new caller regression checks post-destruction trigger focus. Existing 13 builder tests remain passing.
- Temporary config spreads club Jest config and changes only rootDir and setupFilesAfterEnv to the existing
  tournament zoneless setup. Removed after verification. Intermediate fixtures needed explicit async rendering
  and a non-ambiguous confirm selector. Native AutoFocus descendant visibility cannot be asserted via JSDOM
  layout; actual row-action focus was checked in the browser instead, not replaced with a fake layout shim.
- Installed AutoFocus aliases its input as `[pAutoFocus]`, unlike the generated external API's `autofocus` name;
  corrected against installed source and verified with tests/build.
- PASS: Node `JSON.parse` and import-key parity in all three locale files.
- NOT RUN: full application build/suite, fr/en browser, dedicated SSR/hydration, full contrast/accessibility,
  live import confirmation/new-player creation/team save or all production workbook formats.

### Browser evidence

Real mounted Dutch tab on 2026-11-13; no import confirmed and no operational mutation.
Synthetic Excel-compatible HTML `.xls` fixtures exercise the existing SheetJS parser, including a long name.
Initial attempted request stubs did not provide reliable matching evidence; removed them and re-ran using the
real read-only search API. An aborted first attempt is not claimed as a successful matched-file test.
No browser routes/stubs are left installed.

| Theme | Viewport  | Upload/review dialog | Long-name review table                  | Page/dialog overflow |
| ----- | --------- | -------------------- | --------------------------------------- | -------------------- |
| Dark  | 390x844   | 370.5px              | 502px scroll width / 334px client width | None                 |
| Light | 390x844   | 370.5px              | 502px scroll width / 334px client width | None                 |
| Dark  | 1440x1000 | 800px                | 763px scroll/client width               | None                 |
| Light | 1440x1000 | 800px                | 763px scroll/client width               | None                 |

- Matching shows a named indeterminate ProgressBar; focus follows step text, not the detached file control.
- Invalid `.txt` stays on upload with native localized validation. Malformed ZIP `.xlsx` logs the existing
  parse error and shows the new localized Message; retry succeeds without retaining that Message.
- Two synthetic rows show 0 matched / 2 total and disabled Confirm. Create toggles to 1 to create, enables
  Confirm, focuses the cancel-create control; undo focuses Create. Search focuses its explicitly labelled input.
- An empty synthetic sheet shows 0 / 0, the explicit localized empty Message and disabled Confirm.
- Read-only manual search, ArrowDown and Enter select a player locally: 1 matched / 2 total, localized Hoog Tag,
  and focus returns to that row's edit Button. No Confirm click.
- Native mobile suggestion surface fits x=104.97..285.03, y=642..844 at 390x844; its list scrolls internally.
  The earlier ordinary anchored popup exceeded the right edge; the native responsive option fixes this locally.
- Shift+Tab from header close wraps to Confirm; Tab wraps back to named header close without leaving the dialog.
  Escape dismisses, returning focus to the actual import trigger. Caller regression also verifies this timing.
- API restarted after translation changes. Waited for port 5000 GraphQL `{ __typename }`, then loaded real
  club data through the frontend proxy. Development HMR caused transient aborted queries, not hidden passes.
- Contrast and full accessibility are not claimed from these interaction/layout checks. Existing shared focus/
  primary/Message contrast audits remain DR-032/DR-033/DR-034.

### Approval and next action

- The user explicitly approved `Approve and commit DR-013e with disclosed limits` on 2026-11-13.
- This child is Done. Approval accepts the disclosed limits; unchecked criteria remain unchecked and are not
  claimed as passed. The approval authorizes this implementation, tests, translations/generated types and handoff.
- Keep DR-013 open. Exact next action: scope DR-013f survey edit before implementation; not started.
- No push is authorized.
- Exceptions: none.
