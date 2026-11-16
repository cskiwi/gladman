---
title: 'DR-018b2: Location/contact presentation and tab feedback'
description: 'Semantic competition information sections, native email validation and accessible saving feedback.'
---

## Identity and scope

- ID: DR-018b2. Status is authoritative in the [backlog](../backlog.md).
- Parent: [DR-018b](DR-018b-location-contact.md). Dependency: completed [DR-018b1](DR-018b1-country-state-selectors.md).
- Rules: [design refresh](../README.md).
- Confirmed mounted consumer: `/competition/pbo-competitie-2026-2027/edit`, information tab, 2026-11-16.
- Project: `frontend-pages-competition`.
- Source:
  [information template](../../../libs/frontend/pages/competition/src/pages/edit/components/competition-info/competition-info.component.html).
- Preserve form values, country/state CVAs, email validator, dirty/touched tracking, permissions and mutation payloads.
- Exclude completed basic fields, shared selectors/theme, dates/settings, page chrome, translations and live saves.

## Baseline and approach

- Clean worktree at selection. Real Dutch mounted page is populated, read-only and pristine.
- Dark-wide baseline screenshot inspected: location/contact headings use numbered primary colors; email feedback uses
  a numbered red color. These sections use redundant bottom margins and tighter spacing than the completed basic section.
- Replace section wrappers with labelled semantic sections, matching the basic heading/grid/field spacing.
- Use native InputText fluid/invalid options and a described error Message, keeping existing touched/email conditions.
- Replace the inline saving-bar height with native ProgressBar appearance and a named polite saving status.
- Keep the existing native error Message and saving/error signal contracts. No successful-save simulation or backend calls.
- Existing information form owns orchestration and uses shared presentational CVAs; no additional extraction is justified.
- PrimeNG metadata and installed declarations confirm InputText fluid/invalid, Message simple/small and native ProgressBar.
- Baseline whole-template class-token count: 64. No component stylesheet exists.

## Implementation checklist

- [x] Confirm mounted consumer, completed prerequisite and bounded page-only scope.
- [x] Implement semantic sections, native email validation and saving feedback.
- [x] Preserve form contracts and excluded source.
- [x] Record utility comparison, verification and remaining actions.

## Acceptance and verification

- [x] Location/contact headings label their sections and match the completed basic section.
- [x] Invalid email feedback appears only when touched, describes its field and clears after correction/empty input.
- [x] Saving progress has a readable accessible name/status; stored error remains explicit after saving ends.
- [x] Real values, disabled permissions and dirty/pristine behavior are preserved without saves.
- [x] Light/dark at 390px/1440px fit scoped sections, including long email/error states.
- [ ] Keyboard/focus, labels and contrast pass scoped checks.
- [x] Relevant Nx lint/build and focused tests pass.
- [x] No new numbered colors, custom CSS, shared changes or unnecessary components.
- [ ] Full localization, live persistence and SSR/hydration verification passes.
- [x] User visual review/approval is recorded.

## Evidence and handoff

- Changed only the information template, its new focused test suite and the b2/parent/backlog handoff.
  The basic section, component TypeScript, shared selectors, translations, other tabs and page chrome are unchanged.
- Location/contact are labelled sections with the same heading, grid and field spacing as basic information.
  Email now uses native fluid/invalid InputText and a simple small error Message, with conditional description.
  The saving status is polite/atomic and labels the native indeterminate ProgressBar; its inline height is removed.
- Whole-template class tokens: 64 -> 62. Removed numbered heading/error colors and redundant section margins.
  Remaining layout tokens serve section spacing and responsive field columns. No styling exceptions or new abstractions.
- `npx nx run-many -t lint build -p frontend-pages-competition --output-style=static` passes:
  12 tasks, 10 cached initially; final-source rerun passes with 11 cached.
  Final lint has 41 existing warnings and zero errors; no warnings in the new suite.
  Existing executor-deprecation and ts-jest metadata warnings are not changed by this slice.
- `npx nx run frontend-pages-competition:test --testPathPatterns=competition-info.component.spec.ts --output-style=static`
  passes: one suite, four tests. Tests cover region/field labels, touched invalid email and optional correction/empty
  transitions, named saving/stored-error transitions and read-only/pristine state. The mutation mock is never called.
- First test run: three passed, one failed because it expected the native Message alert inside its host.
  Corrected the assertion to the actual alert host; both subsequent focused runs pass.
- Repository Prettier formats all changed files; `git diff --check` passes.
  A reference link avoids widening/reformatting the entire backlog registry table.
- Real hydrated Dutch page loads `be`/`BE-VOV` and its original contact email, with all fields disabled and pristine.
  Editable fixtures override only this browser component's permission predicate and form state, not account/backend
  permissions. No save action is activated; full browser mutation monitoring and live persistence are not run.
- Mounted snapshots expose named location/contact regions, labelled email/country/state fields, the Dutch invalid-email
  alert and the progressbar named `Competitie info opslaan...`.
- Browser fixture matrix: light/dark at 390px/1440px, long invalid email plus long stored error and saving feedback.
  Forced component change detection checks rendered DOM contracts, not live saves or full visual behavior.
  At 390px sections have equal scroll/client widths of 286px, bounds 44.75-330.25px; email width 285.5px.
  At 1440px sections have equal scroll/client widths of 1219px, bounds 110.75-1329.25px; email width 602.25px.
  Both Messages fit their containers. Heading colors match basic information in each theme.
  These are scoped measurements, not proof that the whole page/topbar is overflow-free; DR-066 remains separate.
- Native email fill and Tab mark it dirty/touched and expose the translated error after change detection.
  Correcting to a safe fixture email makes it valid; Shift+Tab focuses the state field.
  Optional empty input remains valid and dirty/touched, with `aria-invalid=false` and no error description.
  Saving false removes the progressbar and retains stored error, as also verified by tests.
- Browser correction hides the leaving native Message, but its DOM-detachment wait times out with a hidden
  `p-message-leave-active` host. Unit tests verify removal after settling. Full animation/physical focus behavior
  remains unverified; no motion/styling workaround is introduced.
- Dark-wide before/after screenshots inspected: location/contact match the quieter basic heading presentation.
  Narrow screenshots are clipped. Subsequent screenshot attempts show stale layout/theme/value combinations;
  direct capture changes the measured viewport from 390px back to 1693px during capture.
  A frame-synchronized capture attempt returns no resumable result. These are failed/inconclusive captures,
  not passed light/dark screenshot coverage. Removed the two misleading temporary capture files.
- Restored real values, original permission predicate, disabled/pristine/untouched form, saving false and null error.
  Original dark preference retained; the shared browser is returned to the homepage.
- Not run/verified: full screenshot matrix, complete keyboard/focus and contrast/accessibility, alternate locales,
  live persistence, full SSR/hydration and unrelated unit/e2e suites. User acceptance below closes this slice with limits.
- User explicitly approved completion with `Approve DR-018b2 and commit with disclosed limits` on 2026-11-16.
  Backlog status is Done. Approval accepts the screenshot, full keyboard/contrast/accessibility, animation,
  alternate-locale, live-persistence and SSR/hydration limits without claiming unperformed checks passed.
  Unchecked acceptance criteria remain. Approval authorizes only b2 and its repository handoff; no push.
  Subsequent changes are documentation-only approval/status updates.
- Parents DR-018/DR-018b remain open. Exact next action: integrated DR-018b location/contact acceptance review of
  the already-Done b1/b2 children, without live saves. Record parent approval and any accepted limits separately.
  Do not start DR-018c until that parent review is reconciled.
