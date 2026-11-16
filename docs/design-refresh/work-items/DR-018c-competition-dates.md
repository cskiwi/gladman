---
title: 'DR-018c: Competition dates'
description: 'Native, responsive date/time controls and feedback in the mounted competition dates tab.'
---

## Identity and scope

- ID: DR-018c. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-018](DR-018-competition-editing.md). Dependencies: completed DR-018a/b.
- Rules: [design refresh](../README.md).
- Mounted consumer confirmed 2026-11-16: `/competition/pbo-competitie-2026-2027/edit`, dates tab.
- Project: `frontend-pages-competition`.
- [Editor template](../../../libs/frontend/pages/competition/src/pages/edit/page-edit.component.html)
  mounts the [dates component](../../../libs/frontend/pages/competition/src/pages/edit/components/competition-dates/competition-dates.component.ts).
- Scope: seven existing date/time controls, registration/change-period sections and dates-tab saving feedback.
- Preserve optional/null values, date/time formatting, deferred rendering, dirty/touched state, permission disabling,
  translations, mutation fields and existing save/error behavior.
- Exclude information/settings, page chrome/tab orchestration (DR-018e), shared theme/components, translations,
  live saves, date-order validation and dependency changes.

## Baseline and approach

- Clean worktree at selection. Dutch dates tab mounted using native DOM tab activation after pointer timeout.
- Seven populated enabled inputs retain existing real dates, including historical change-period values.
  Input IDs are absent; visible labels currently target the DatePicker host, not its inner input.
- Three headings use paired numbered primary utilities. Pickers lack native fluid sizing.
- Saving progress uses an inline height override and has no associated status label.
- Follow completed information-tab semantic sections, heading hierarchy and native named saving feedback.
- Use native DatePicker `inputId`, `fluid`, accessible icon labels and pass-through hint descriptions.
- Keep native date/time behavior and existing deferred blocks. No new CSS, palette utilities or wrappers.
- Existing page orchestration and date form already separate responsibilities. One consumer and no genuinely
  repeated domain structure justify direct PrimeNG rather than a new smart/presentational component.
- Initial element screenshot capture failed waiting for stable bounds. A subsequent unscrolled baseline capture
  showed registration and part of period 1; full before coverage is unavailable. Source/DOM establish all seven inputs.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and bounded scope.
- [x] Simplify sections and feedback while preserving all seven controls and behavior.
- [x] Associate visible labels/hints with native inputs and use native fluid sizing.
- [x] Avoid shared/global changes, new styling and translation changes.
- [x] Record utility comparison and unrelated discoveries.

## Acceptance and verification

- [x] Three labelled semantic sections and seven uniquely labelled native date/time inputs render.
- [x] Registration hints describe their inputs; calendar icon buttons have meaningful names.
- [x] Native fluid controls fit light/dark at 390px and 1440px without dates-section overflow (DOM measurements).
- [ ] Optional empty/populated values, edit/disabled permissions and dirty/touched behavior remain usable.
- [x] Saving status names native indeterminate progress; stored error remains explicit across transitions.
- [ ] Keyboard focus, calendar/time interaction, contrast and overlay accessibility are verified.
- [x] No new non-semantic colors, CSS or styling workarounds; remaining utilities have layout reasons.
- [x] Focused existing Nx lint/build and presentation tests pass.
- [ ] Localization and SSR/hydration behavior are verified.
- [x] User approval with disclosed limits is recorded before completion or commit.

## Evidence and handoff

- Implemented three named sections, semantic headings, native fluid inputs, native input IDs, described hints,
  translated icon labels and named saving progress. Removed inline progress height; error Message is unchanged.
- Only the dates template and its new focused tests change application scope. No production TypeScript,
  translations, permissions, persistence, shared components or styling changed.
- Template class tokens: 68 -> 67. Semantic heading classes replace numbered primary/dark pairs;
  section spacing is owned by the form; field gaps match information fields.
  Period 1 uses two columns at medium widths and three at large widths to preserve input space.
- PrimeNG documentation confirms native fluid sizing/input labels. Generated usage validation accepted an incorrect
  pass-through key; installed declarations, build and the focused test identified the actual contract:
  `pcInputText.root` forwards the registration hint attributes. No cast or workaround added.
- `npx nx run-many -t lint build -p frontend-pages-competition --output-style=static` passes:
  12 tasks including dependencies, ten cached. Lint has 41 existing warnings and zero errors.
- `npx nx run frontend-pages-competition:test --testPathPatterns=competition-dates.component.spec.ts --output-style=static`
  passes: one suite, three tests.
  Tests cover all labels/icon names/hints, disabled empty/populated date/time controls, pristine/untouched form state,
  named saving/error transitions and no mutation calls.
- Initial lint/build attempt failed on the now-corrected pass-through key.
  Initial `--runInBand --runTestsByPath` selection unexpectedly ran 22 suites (329 passed tests, one failed hint test).
  Switched to the repository's proven `--testPathPatterns` selector; final focused suite passes after correction.
  Broader suites were not rerun and are not claimed as a final full-suite pass.
- Mounted Dutch DOM matrix: light/dark at 390px and 1440px. All seven original populated values remain intact.
  Native inputs have visible labels, unique IDs and both registration hints; all seven icon buttons are named.
  At 390px all sections have equal client/scroll widths of 286px, bounds 44.75-330.25px.
  At 1440px all sections have equal client/scroll widths of 1219px, bounds 110.75-1329.25px.
  Date inputs and icon buttons fit their field containers in all four cases.
- Browser-only saving/long stored-error fixtures fit all four cases: error scroll/client widths 286px/1219px.
  Status says `Competitie data opslaan...` and names the indeterminate progressbar.
  Tests verify that stopping saving removes progress and preserves the stored error.
- Dark-wide full-page after screenshot inspected: all three sections and seven populated controls are visible.
  A later attempted light/narrow screenshot returned a blank dark 1693px image, not the requested state;
  it is inconclusive, not passed screenshot coverage. Full four-case visual review remains outstanding.
- Pointer tab activation timed out; native DOM tab activation mounted the real dates tab.
  Physical Tab/Shift+Tab/Escape did not reliably move focus/close the date overlay in this browser.
  Programmatic focus opened the native calendar/time dialog with meaningful native controls.
  Synthetic input produced a dirty date/time edit but blur/empty-input handling was inconclusive:
  touched stayed false and the empty edit retained the prior value. Do not claim physical interaction verification.
  No production handlers or date parsing changed; recheck real keyboard/clear/time selection during review.
- HMR initially left deferred date inputs unrendered; reload plus waiting for the attached input restored all seven.
  This is not a passed full hydration check. Existing console view-transition abort also observed.
- Native calendar dialog/month/day/time labels remain English on Dutch; recorded under existing DR-043.
  Existing narrow topbar issue remains DR-066. Page tab/save orchestration remains DR-018e.
- All fixture values/signals were reset by reload: real permission-enabled, pristine/untouched form,
  saving false, error null and seven real populated inputs. No save or mutation method activated.
  Original dark preference/1693px viewport restored; shared browser returned to homepage.
- Exceptions: none.
- Not verified: full screenshot matrix, physical keyboard/clear/time selection, contrast/full accessibility,
  alternate locales, operational persistence or complete SSR/hydration.
- User explicitly approved completion with `Approve DR-018c and commit with disclosed limits` on 2026-11-16.
  Approval accepts the recorded screenshot, physical interaction/clear/time selection, contrast/accessibility,
  alternate-locale, persistence and SSR/hydration limits without claiming unperformed checks passed.
  Unchecked criteria remain. Subsequent changes are documentation-only approval/status updates.
  Approval authorizes only this slice, tests and repository handoff commit; no push.
- Exact next action: confirm the mounted settings tab, scope DR-018d and create its brief before implementation
  on the next invocation. Keep parent DR-018 open and DR-018d/e unstarted.
