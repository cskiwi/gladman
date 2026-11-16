---
title: 'DR-018e: Competition editor chrome and actions'
description: 'Native editor surfaces and feedback with correctly selected current-tab actions.'
---

## Identity and scope

- ID: DR-018e. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-018](DR-018-competition-editing.md). Dependencies: completed DR-018a/b/c/d.
- Rules: [design refresh](../README.md).
- Mounted consumer confirmed 2026-11-16: `/competition/pbo-competitie-2026-2027/edit`.
- Project: `frontend-pages-competition`.
- Sources: [editor](../../../libs/frontend/pages/competition/src/pages/edit/page-edit.component.ts) and its
  [template](../../../libs/frontend/pages/competition/src/pages/edit/page-edit.component.html).
- Scope: header/actions, native tab surface, unsaved/load feedback and current-tab action routing.
- Preserve child forms, permissions, dirty values across tab changes, translations, payloads and relative navigation.
- Prevent overlapping saves and leaving through page actions while a child save is running.
- Exclude child redesign, shared components/theme, translations, operational saves and persistence refactoring.

## Baseline and approach

- Clean worktree at selection. Dutch populated information/settings tabs mounted with editable controls.
- Dark-wide before screenshot inspected at 1693px/1272px.
- Header has a decorative eyebrow and page-only title SCSS; tabs use a custom bordered emphasis wrapper.
- Unsaved/load errors use inline custom status colors; loading progress has inline sizing and no accessible name.
- Native DOM settings-tab activation selects settings while page `activeTabIndex()` remains `'0'`.
  The page listens to unsupported `activeIndexChange` instead of installed Tabs `valueChange`.
  Fix this tightly coupled action bug with focused tests and no live saves.
- Use a normal heading/subtitle, native Card, scrollable Tabs, warning/error Messages and named loading progress.
- Existing page/form separation already isolates orchestration; no repeated domain structure warrants extraction.
- Baseline: 58 authored template class tokens and one 13-line page stylesheet.
- No shared/global changes or styling exception is planned.

## Implementation checklist

- [x] Confirm mounted consumer, native APIs, dependencies and bounded scope.
- [x] Simplify chrome and replace custom feedback with native semantic components.
- [x] Connect native tab selection to current-tab saves and prevent overlapping page actions.
- [x] Preserve child forms and navigation; avoid shared/global changes.
- [x] Record class comparison, validation and discoveries.

## Acceptance and verification

- [x] One normal heading, native Card/Tabs and named loading/error/unsaved feedback render.
- [x] Selecting each tab updates the page state and routes current-save to only its dirty child.
- [x] Unsaved values persist across tab changes; permission-disabled forms remain disabled.
- [x] Saving disables all page actions and blocks duplicate calls without changing mutation payloads.
- [ ] No changes/pristine, loading, error and child saving/failure/success transitions are checked safely.
- [x] Light/dark at 390px/1440px fit the header, actions, feedback and tab surface (DOM measurements).
- [ ] Keyboard/focus, native tab scrolling and contrast/accessibility are verified.
- [x] No new colors, CSS, inline styling workarounds or shared changes.
- [x] Focused Nx lint/build/tests pass.
- [ ] Localization and full SSR/hydration are verified.
- [x] Visual/user review or explicit approval with disclosed limits is recorded.

## Evidence and handoff

- Implemented normal title/subtitle, native Card/Tabs and semantic warning/error Messages.
  Loading has a polite atomic live status and a natively labelled indeterminate progressbar.
  Tab icons are decorative rather than part of accessible names; native tab/panel associations remain intact.
- Native `valueChange` now updates the typed current-tab handler. A child-derived saving signal disables all
  three page actions, sets tab-surface `aria-busy` and guards overlapping save/navigation calls.
  This intentionally prevents cancelling through page actions during a save; browser navigation is not intercepted.
- Removed the page-only stylesheet, retaining host block layout through a utility. Authored template class tokens:
  58 -> 34. No child templates/logic, payloads, permissions, translations, shared components or theme changed.
  Existing page/form separation remains sufficient; no extra smart/presentational wrapper was added.
- PrimeNG documentation and installed declarations confirm native Tabs `valueChange`, automatic scrolling and
  Message severity. Scrolling is enabled by default; no deprecated `scrollable` input was added.
  ProgressBar uses the native `aria-labelledby` attribute, not a component `ariaLabelledBy` input.
- `npx nx run-many -t lint build -p frontend-pages-competition --output-style=static` passes:
  12 tasks including dependencies, ten cached. Final lint: 39 existing warnings, zero errors.
  The prior unused RouterLink and event `any` warnings are removed; unrelated warnings remain.
- `npx nx run frontend-pages-competition:test --testPathPatterns=page-edit.component.spec.ts --output-style=static`
  passes: one suite, seven tests. Uses real child forms/native Tabs with mocked save methods and denied-permission
  fixtures. Covers three-tab current-save routing, pristine no-op, dirty values across tab changes, native warning,
  all three child busy/recovery states, blocked duplicate saves/cancel, relative cancel navigation, named loading,
  stored load errors and read-only forms. The mutation stub is never called.
- Initial tests exposed missing jsdom ResizeObserver, incorrect descendant-role selectors and the incorrect
  progress attribute. Resolved with the existing tournament-test ResizeObserver mock pattern, native host-role
  assertions and the correct ARIA attribute; the mock is restored after the suite.
  Existing Nx Jest deprecation and ts-jest metadata warnings remain. Broader suites were not run.
- Mounted Dutch native DOM tab activation now reports active `'0'`, `'1'`, `'2'` matching the selected tab.
  Browser-only safe unsaved name remains dirty and intact across all three tabs; original value/pristine state restored.
  Native tab `aria-controls`/panel `aria-labelledby` associations and icon hiding pass DOM inspection.
- Four-case light/dark DOM matrix at 390px/1440px: header, wrapping actions, Card, tabs and long spaced load-error
  and unsaved-warning fixtures fit. At 390px header/Card/messages are x=14..361px, width 347px; at 1440px they
  are x=80..1360px, width 1280px. Their client/scroll widths match. Native tablist widths are 310px/1243px.
  Browser saving fixtures disable all three actions and set `aria-busy=true`; form values remain unchanged.
- Loading fixture fits all four cases, has named `Competitie gegevens laden...` progress and no determinate value.
  Loading status client/scroll widths match at 362px/1280px. Reload removes all browser-only fixtures.
- Dark-wide before/after screenshots inspected. A light-narrow screenshot shows the responsive header/actions and
  native tab navigator, but is embedded in a larger blank canvas; it is partial evidence, not a passed full matrix.
  Full screenshot review remains outstanding.
- Programmatic focus reaches the first tab. Physical ArrowRight/Enter leaves it unchanged while the shared browser
  reports `visibilityState: hidden`; keyboard/pointer, native navigator interaction, full accessibility/contrast and
  animation-exit behavior are not verified. Message exit nodes remain during hidden-page fixtures.
  No custom animation/style workaround was added.
- Pristine/current-save and mocked failure/busy recovery are tested; real save-all no-change/success/failure workflows,
  operational persistence, alternate locales and complete SSR/hydration are not verified.
  No browser save or mutation method was activated. Build is not workflow evidence.
- Final reload confirms all three real forms enabled/pristine/untouched, saving false, errors null, active tab `'0'`
  and zero Messages. Returned to the original homepage and restored dark mode with viewport 1693px/1272px.
- Required precommit `npx nx run-many --target=lint --output-style=static` passes for all 34 projects,
  three cached. Existing warnings and Nx executor deprecations remain; no unrelated fixes were made.
- Existing narrow topbar remains DR-066, spinner contrast DR-058 and English options/messages DR-068.
  Source inspection additionally found save-all can treat an invalid information save's resolved early return as
  success; DR-069 records that separate persistence-result follow-up. It was not exercised through a live save.
- Exceptions: none.
- User explicitly approved completion with `Approve DR-018e and commit with disclosed limits` on 2026-11-16.
  Approval accepts the recorded screenshot, physical interaction/native navigator, contrast/accessibility,
  animation-exit, alternate-locale, operational save-all/persistence and SSR/hydration limits without claiming
  unperformed checks passed. Unchecked criteria remain. Subsequent changes are documentation-only approval/status
  updates. Approval authorizes only this slice, its tests and repository handoff commit; no push.
- Result: Done with approved limits. Exact next action: DR-018 integrated parent review on the next invocation,
  without restarting completed children. DR-069 remains an unstarted separate follow-up.
- Keep DR-018 open; do not start another implementation slice or push.
