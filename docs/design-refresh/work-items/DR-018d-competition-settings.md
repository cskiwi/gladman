---
title: 'DR-018d: Competition settings'
description: 'Native, responsive controls and feedback in the mounted competition settings tab.'
---

## Identity and scope

- ID: DR-018d. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-018](DR-018-competition-editing.md). Dependencies: completed DR-018a/b/c.
- Rules: [design refresh](../README.md).
- Mounted consumer confirmed 2026-11-16: `/competition/pbo-competitie-2026-2027/edit`, settings tab.
- Project: `frontend-pages-competition`.
- [Editor template](../../../libs/frontend/pages/competition/src/pages/edit/page-edit.component.html) mounts the
  [settings component](../../../libs/frontend/pages/competition/src/pages/edit/components/competition-settings/competition-settings.component.ts).
- Scope: official, team matching, ranking and validation sections; five controls and settings-tab feedback.
- Preserve boolean values, optional matcher, ranking amount bounds 1-24, unit values, permission disabling,
  dirty/touched state, mutation payload and existing save/error behavior.
- Exclude information/dates, page chrome/tab orchestration (DR-018e), translations, shared theme/components,
  live saves, new validation and dependency changes.

## Baseline and approach

- Clean worktree at selection. Mounted Dutch settings tab confirmed through native DOM tab activation after
  pointer activation failed to complete in the shared browser.
- Real enabled/pristine form: official true, empty teamMatcher, validation true, ranking 4/months.
- Four headings use numbered primary/dark pairs. Official heading renders a missing `.official.title` key.
  Reuse the existing translated official label rather than add translations.
- Both checkboxes and ranking amount lack native input IDs/labels. Hints are not associated with inputs.
  Ranking inputs lack native fluid sizing; saving progress uses an inline height and has no status name.
- Use semantic labelled sections, native `inputId`, fluid inputs, described hints and named native progress.
- Existing page/form separation already isolates orchestration. No repeated domain structure justifies another
  smart/presentational extraction for this single mounted consumer.
- Before screenshot returned serialized bytes rather than a viewable image; baseline source/DOM is recorded,
  but visual baseline review is not claimed.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and bounded scope.
- [x] Simplify presentation without changing form or persistence logic.
- [x] Associate native labels/hints and use native fluid sizing.
- [x] Avoid shared/global changes, translations and new styling.
- [x] Record utility comparison and out-of-scope discoveries.

## Acceptance and verification

- [x] Four named semantic sections and five uniquely labelled controls render without raw heading keys.
- [x] Hints describe their controls; saving progress has a named live status and errors remain explicit.
- [x] Light/dark at 390px/1440px fit sections, controls and long feedback (DOM measurements).
- [ ] Checkbox toggles, matcher edits, ranking bounds/units and dirty/touched state remain usable.
- [x] Disabled permissions preserve values and disable native controls (focused tests and DOM fixture).
- [ ] Keyboard/focus, native overlays and contrast/accessibility are verified.
- [x] No new non-semantic colors, CSS or inline styling workarounds.
- [x] Relevant Nx lint/build and focused tests pass.
- [ ] Localization and SSR/hydration behavior are verified.
- [x] Visual/user review or explicit approval with disclosed limits is recorded.

## Evidence and handoff

- Implemented four named sections, semantic headings, native input IDs, four described hints, fluid text/number/select
  controls and named live saving feedback. Existing translated official label replaces the missing heading key.
  Select explicitly references its visible label because its focus target is not a native labelable input.
  Native ranking step buttons have translated field names plus `+`/`-` labels through documented pass-through.
- Only the settings template and its new focused tests change application scope. No production TypeScript,
  permissions, persistence, translations, shared components or styling changed.
- Template class tokens: 74 -> 69. Removed redundant section margins/wrappers and numbered primary/dark pairs.
  Semantic headings and field gaps match completed information/dates sections. No new extraction is warranted.
- PrimeNG documentation and installed declarations confirm native `inputId`, `ariaLabelledBy`, `ariaDescribedBy`,
  fluid sizing, Checkbox input pass-through and InputNumber step-button pass-through.
- `npx nx run-many -t lint build -p frontend-pages-competition --output-style=static` passes:
  12 tasks including dependencies, ten cached. Lint reports 41 existing warnings and zero errors.
- `npx nx run frontend-pages-competition:test --testPathPatterns=competition-settings.component.spec.ts --output-style=static`
  passes: one suite, four tests. Covers section/control/hint/step-button names, label toggles and matcher dirty/touched
  edits, populated/empty disabled controls, named saving/stored-error transitions and no mutation calls.
  Existing Nx Jest deprecation and ts-jest metadata warnings remain; broader suites were not run.
- Mounted Dutch light/dark DOM matrix at 390px/1440px: all four sections fit their containers.
  At 390px section client/scroll widths are 286px, bounds x=44.75..330.25px.
  At 1440px section client/scroll widths are 1219px, bounds x=110.75..1329.25px.
  All five controls fit and the original real values stay intact/pristine. No raw translation keys remain in the tab.
- Browser-only native DOM label toggles update both booleans; matcher input/blur updates its value and dirty/touched
  state. These are DOM-handler checks, not passed pointer/physical keyboard verification.
  Disabling the browser form preserves all values and disables the four inputs and unit combobox.
  Focused tests separately exercise the existing permission-denied component path.
- Browser-only saving/long stored-error fixtures fit all four theme/width cases:
  status/error client and scroll widths match at 286px/1219px. Status says `Competitie instellingen opslaan...`
  and names the indeterminate progressbar. Stopping saving removes progress and retains the stored error.
- Dark-wide after screenshot inspected: all sections and controls are visible.
  Another screenshot was clipped/mixed-theme during resizing and is inconclusive, not a passed narrow/light review.
  Initial animation-frame matrix stalled while the shared page reported `visibilityState: hidden`;
  reload cancelled it. Final DOM measurements use synchronous layout reads, not animation-frame waits.
- Programmatic checkbox focus works, but physical Space/Tab/Shift+Tab did not toggle or advance focus in this
  hidden shared browser. Pointer tab activation also failed to complete. Full physical interaction, ranking
  bounds/unit selection, overlay, screenshot matrix, contrast/full accessibility and alternate locales remain open.
  Existing native spinner contrast remains DR-058. No custom workaround was added.
- Reload restored real enabled/pristine/untouched values: official true, empty matcher, validation true, ranking
  4/months, saving false and error null. No save or mutation method was activated.
  Dark preference remains unchanged. After returning to the homepage, viewport restoration to 1693px/1272px
  was confirmed by DOM measurements; reload can reset requested dimensions in this shared browser.
- Existing English ranking units and editor option/save messages are deferred as DR-068.
  Existing page tab/save orchestration remains DR-018e; narrow topbar remains DR-066.
- Localization, operational persistence and complete SSR/hydration are not verified; build is not workflow evidence.
- Exceptions: none.
- User explicitly approved completion with `Approve DR-018d and commit with disclosed limits` on 2026-11-16.
  Approval accepts the recorded screenshot, physical interaction, ranking bounds/unit selection, overlay,
  contrast/accessibility, alternate-locale, persistence and SSR/hydration limits without claiming unperformed
  checks passed. Unchecked criteria remain. Subsequent changes are documentation-only approval/status updates.
  Approval authorizes only this slice, its tests and repository handoff commit; no push.
- Result: Done with approved limits. Next: confirm mounted page chrome/actions, scope DR-018e and create its brief
  before implementation on the next invocation. Keep parent DR-018 open and DR-018e unstarted.
