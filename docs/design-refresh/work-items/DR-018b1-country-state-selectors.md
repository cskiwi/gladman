---
title: 'DR-018b1: Country/state selector integration'
description: 'Native accessible labels and isolated inner form controls for the mounted country/state selectors.'
---

## Identity and scope

- ID: DR-018b1. Status is authoritative in the [backlog](../backlog.md).
- Parent: [DR-018b](DR-018b-location-contact.md). Dependencies: completed DR-018a.
- Rules: [design refresh](../README.md).
- Confirmed mounted consumer: `/competition/pbo-competitie-2026-2027/edit`, information tab, 2026-11-14.
- Projects: `frontend-components` and `frontend-pages-competition`.
- Shared sources:
  [country component](../../../libs/frontend/components/country-state/src/country-select/country-select.component.ts),
  [country template](../../../libs/frontend/components/country-state/src/country-select/country-select.component.html),
  [state component](../../../libs/frontend/components/country-state/src/state-select/state-select.component.ts),
  [state template](../../../libs/frontend/components/country-state/src/state-select/state-select.component.html).
- Wire labels only in the
  [information template](../../../libs/frontend/pages/competition/src/pages/edit/components/competition-info/competition-info.component.html).
- Preserve CVA values/callbacks, country filtering, invalid-state reset, disabled controls, clear/filter options,
  body overlays, localization, permission gating and mutation payloads.
- Exclude location/contact headings, email feedback, saves, translations, other shared components and global theme.

## Baseline and approach

- Clean worktree at selection. Real Dutch page loads populated country/state and six disabled information controls.
- Source search finds no other template or programmatic consumers beyond the mounted competition editor.
- Dark-wide baseline screenshot inspected: controls are full-width, but country/state accessible names describe
  selected values rather than field labels. Two NG01354 inner-ngModel registration warnings reproduce.
- Forward optional `inputId` and `ariaLabelledBy` through existing CVAs to native Select.
  Mark inner ngModel standalone: the outer CVA, not the inner Select, owns parent reactive-form registration.
- Replace `styleClass="w-full"` with native `fluid`; retain existing smart/form and presentational CVA separation.
- Installed PrimeNG 22 Select declarations confirm `inputId`, `ariaLabelledBy` and native fluid support.
- Before utility count: one `w-full` token per shared template; page label wiring adds no utilities.
- No SCSS, inline CSS, palette colors, dependency changes or new wrappers.

## Implementation checklist

- [x] Confirm mounted consumer and bounded shared dependency scope.
- [x] Implement optional label forwarding, standalone ngModel and native fluid sizing.
- [x] Check current consumer and preserve form contracts.
- [x] Record out-of-scope discoveries and exact verification results.

## Acceptance and verification

- [x] Country/state comboboxes have field labels, not selected-value accessible names.
- [x] No inner-ngModel registration warnings reproduce on the mounted page.
- [x] Native full-width controls fit light/dark at 390px/1440px.
- [x] Disabled permissions and real loaded values remain unchanged.
- [ ] Keyboard selection, filtering/clear, country-dependent reset and dirty/touched values work without saving.
- [x] Relevant Nx lint/build checks pass; test results or absence are recorded.
- [x] No new custom styles, non-semantic colors or hidden shared changes.
- [ ] Full accessibility/contrast, alternate locales and SSR/hydration are verified.
- [x] User visual review/approval is recorded.

## Evidence and handoff

- Changed only the four shared selector source files, the consumer's label wiring, selector usage documentation
  and the repository design-refresh handoff. Existing CVA callbacks and country-reset logic are unchanged.
- Native Select now forwards optional `inputId`/`ariaLabelledBy`; both visible field labels are associated.
  Mounted accessibility snapshots expose `Land` and `Staat/Provincie`, with selected values separately.
- Inner ngModel is standalone, preventing accidental parent form registration. After hydration, two baseline
  NG01354 warnings no longer reproduce. The outer reactive form still receives selected values.
- Shared template utility tokens: one `w-full` -> zero per template; native fluid supplies width.
  Consumer utility count unchanged. No authored colors, SCSS, inline CSS or theme changes.
- `npx nx run-many -t lint build -p frontend-components frontend-pages-competition` passes:
  13 tasks succeeded, nine cached. The shared entry point and current page consumer compile.
  Approval-time rerun on 2026-11-16 passes: 13 tasks succeeded, all cached.
- Repository Prettier formats all changed files; `git diff --check` passes.
- Tests: no existing country/state suites; unrelated suites not run. No new tooling/dependencies.
- Real hydrated page is read-only/pristine with country `be` and state `BE-VOV`; both field labels and disabled
  states are preserved. Browser-only editable fixtures stub this component's permission predicate and enable
  its form; no account/backend permission is changed.
- Light/dark x 390px/1440px: both native fluid controls fit their columns.
  Narrow bounds 44.75-330.25px, width 285.5px, scroll/client 284px.
  Wide country bounds 110.75-714.75px, state 725.25-1329.25px; each width 604px, scroll/client 602px.
  These are field measurements, not proof that the whole page/topbar has no overflow; DR-066 stays separate.
- In all four cases, browser-only CVA fixtures select `de`: old state clears, 16 states remain, and the parent
  country is dirty/touched. Clearing country leaves zero states, null state and a disabled native state Select.
- Native DOM-dispatched ArrowDown opens country; filter input reduces options to Germany.
  DOM activation of Germany produces `de`, null state and dirty/touched parent control.
  Native Bayern option activation produces `DE-BY`, touched state and dirty form.
  DOM-dispatched Escape closes state (`aria-expanded=false`). Real values are restored afterward.
- These DOM checks exercise actual Select/ngModel/CVA handlers but do not prove physical keyboard, pointer,
  focus traversal, overlay visibility/positioning or screen-reader behavior. Normal Playwright key/click/role
  actions time out; this shared browser reports zero-size overlay bounds despite populated option DOM.
  Leave the combined interaction acceptance checkbox unchecked; no styling workaround was introduced.
- Dark-wide after screenshot inspected: native full-width inputs and focused state are retained, without
  presentation changes to headings/contact. Full four-case screenshot review is not verified.
- Initial browser reload aborted during hot reload; later navigation restored the real disabled populated DOM.
  Hydration/debug-component lookup can time out before becoming available, so full SSR/hydration is not claimed.
- Final hydrated check confirms real `be`/`BE-VOV`, read-only disabled form and pristine state.
  Original dark preference and 1693px/1272px dimensions restored; shared browser returned to the homepage.
- No save action was activated. Live persistence, complete mutation monitoring, full accessibility/contrast,
  alternate locale browsers and automated unit/e2e suites were not run.
- Existing numbered location/contact headings and email feedback belong to b2, not this shared prerequisite.
  Existing shared topbar overflow remains DR-066. No new reusable abstraction or styling exception.
- User explicitly approved completion with `commit` on 2026-11-16. Backlog status is Done.
  Approval accepts the disclosed physical keyboard/pointer, overlay, screenshot matrix, accessibility/contrast,
  localization, automated tests, live persistence and SSR/hydration limits without claiming those checks passed.
  Their acceptance checkboxes remain unchecked. Approval authorizes only this slice and its repository handoff;
  no push is authorized. Subsequent changes are documentation-only approval/status updates.
- Exact next action: scope DR-018b2 and create its brief in a fresh invocation.
  DR-018 and DR-018b remain open; b2 is not started.
