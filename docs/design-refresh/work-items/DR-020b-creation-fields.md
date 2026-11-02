---
title: 'DR-020b: Tournament creation fields'
description: 'Native responsive creation fields, associated validation and mutation-error feedback.'
---

## Identity and scope

- Parent: [DR-020](DR-020-tournament-forms.md). Dependency: [DR-020a](DR-020a-creation-chrome.md), Done.
- Status: authoritative in the [backlog](../backlog.md). Rules: [design refresh](../README.md).
- Project: `frontend-pages-tournament`.
- Mounted route: `/tournament/create?clubId=cb0cfc70-d93c-4e81-92e6-07b5724d40b0`.
- Real consumer: [club detail](../../../libs/frontend/pages/club/src/pages/detail/page-detail.component.ts)
  invokes creation with its club identifier under the existing permission gate.
- Integrated browser mounted the real Smash For Fun form on 2026-11-02 without submitting.
- Source: [template](../../../libs/frontend/pages/tournament/src/pages/create/page-create.component.html),
  [component](../../../libs/frontend/pages/tournament/src/pages/create/page-create.component.ts),
  [service](../../../libs/frontend/pages/tournament/src/pages/create/page-create.service.ts).
- Refresh only creation fields, their labels/validation and mutation-error presentation.
- Preserve controls, validators, range/date selection, deferred loading, official toggle, mutation mapping,
  permissions, translated strings, navigation, completed Card/read chrome and native actions.
- Exclude editing, shared components/theme, backend, translation assets and operational creation/admin mutations.

## Baseline and approach

- Captured mounted light/dark wide/390px baseline before editing.
- Three date labels target `p-datepicker` hosts rather than their unnamed inner inputs.
  The name input lacks native required semantics and validation is not associated with its input.
- Fields mix fixed name/date widths; registration dates wrap independently.
- Required marker, validation and mutation error use three inline color attributes.
- Use native InputText invalid/required semantics, simple validation Message and native mutation-error Message.
- Use DatePicker `inputId`, `fluid` and native `ariaLabelledBy` for the range label/help.
- Keep necessary field gaps and use a responsive two-column registration-date grid.
- No shared extraction: these controls have no confirmed second matching consumer contract.
  Tournament/competition consistency means native PrimeNG presentation, not an artificial shared wrapper.
- Baseline entire-template static `class` tokens: 66; DatePicker `styleClass` adds three fixed-width tokens.
  No stylesheet is attached to this component.

## Implementation checklist

- [x] Confirm completed dependency and mounted real consumer.
- [x] Preserve data/form behavior while simplifying native field presentation.
- [x] Associate labels, required/invalid semantics and validation/help with the actual controls.
- [x] Replace custom mutation feedback with native Message.
- [x] Remove only scoped styling; leave Card/actions and unrelated consumers unchanged.
- [x] Record validation, utility comparison and out-of-scope discoveries.

## Acceptance and verification

- [x] Native PrimeNG covers controls and validation/mutation feedback.
- [x] Registration controls stack narrowly and align at wider widths without overflow.
- [x] Required/touched validation, name length limit, date range and optional dates preserve form contracts.
- [x] Revised date-input names include label/help through native options, with no `[pt]` or `[dt]`.
- [x] Name-error description references rendered content.
- [x] Keyboard focus, date overlay navigation/Escape and official toggle work.
- [x] Light/dark at 360/390/768/1440px, including error and disabled/busy states.
- [x] Label, help, simple validation and settled name-input focus contrast pass in both themes.
- [ ] Native mutation-error text contrast passes in both themes: fails at 4.44:1 light / 4.40:1 dark.
- [x] No new colors, numbered palette utilities, stylesheets or inline-style substitutes.
- [x] Mocked submission verifies unchanged payload/navigation, pending/error/retry without a real mutation.
- [x] Relevant Nx lint/test/build pass; exact results recorded.
- [x] Dutch SSR/client content preserved; other locale/hydration limits disclosed.
- [ ] Actual screen-reader output, exhaustive control/overlay focus and contrast, mounted English/French,
      exhaustive hydration and authenticated creation/cancel/error/retry workflows.
- [x] User approved the corrected slice with disclosed limits on 2026-11-02.

## Evidence and handoff

- Initial worktree clean. No operational mutations are permitted for verification.
- Before browser inspection confirms the three broken date-label targets and missing required/description semantics.
- Installed PrimeNG documentation confirms DatePicker `inputId`/`fluid`, InputText `invalid`,
  and Message `variant="simple"`/`size="small"` for validation.
- Only the creation template and its existing routed test suite change in application source.
  Component logic, service, form validators, payload mapping, routes, Card and action markup remain unchanged.
- Native InputText `required`/`maxlength="255"` mirror existing validators; explicit `aria-invalid` and
  conditional `aria-describedby` name the rendered validation Message. The required marker is decorative.
- User feedback on 2026-11-02: "never use [pt] [dt]".
  Remove the initial pass-through binding. DatePicker uses native `fluid`, `inputId` and `ariaLabelledBy`;
  the range label and help both contribute to its accessible name, rather than a separate input description.
  No wrapper, DOM mutation, custom directive or styling alternative is introduced.
  Earlier range-description observations are superseded by the verified native label/help name.
  A source assertion confirms neither forbidden binding is present in the creation template.
  After the correction, the same focused Nx command passes lint, all 65 tests, production library build
  and ten prerequisites again. Eight additional light/dark 360/390/768/1440px checks pass full accessible
  name/reference resolution, Tab/Arrow/Escape/return focus and document fit, with zero monitored page errors
  or mutation requests. The browser exposes the combined translated label/help as the combobox name.
  The repeated HTTP GET returns 200 with the new label ID, help and real club context;
  the deferred DatePicker itself remains client-rendered as before.
- Whole-template static class tokens drop from 66 to 46, with three additional fixed-width `styleClass` tokens
  removed. All three inline color attributes and the custom mutation banner/icon are removed.
- Five new routed tests verify required/touched/recovered/maxlength semantics, deferred date labels/help/range,
  official toggle, invalid submission, pending state, exact ISO payload mapping, slug/id navigation,
  failure data retention and retry clearing. Apollo and navigation are mocked; no real mutation is invoked.
- `npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static`:
  final run passes focused lint, all 65 tests in three suites, production library build and ten prerequisites.
  Existing lint/compiler/deprecation warnings remain.
  The first run passed lint/build but failed one test because PrimeNG's invalid appearance does not set
  `aria-invalid`; adding that explicit attribute fixes the accessibility omission and the regression.
- Integrated-browser matrix: all eight light/dark 360/390/768/1440px cases pass settled document/overlay fit,
  narrow stacking/wide pairing, all five label targets, required/touched feedback, Nov 7-8 range selection,
  optional Oct 1/Nov 1 dates, official checkbox, valid/invalid submit gating and native local error/busy fixtures.
  Native busy feedback retains its accessible label, disables submit and has a decorative spinner.
  No actual submit or cancel navigation is performed.
- Four additional keyboard cases (light/dark at 390/1440px) pass Tab order through all date inputs and icon buttons,
  ArrowDown/ArrowRight day navigation, Escape dismissal/return focus and Space toggling the official checkbox.
  Their page-error and mutation-request monitors both report zero.
- Browser harness retries were needed to scope day selectors to the active calendar and await outgoing overlays.
  Hidden calendars retain duplicate day labels and leave transitions can temporarily expose two dialogs;
  final checks target each native panel ID and await its hidden state. These were harness errors, not app defects.
- After finite transitions settle, text contrast over composited ancestor backgrounds:
  labels 19.87:1 light / 16.00:1 dark; help 4.87:1 / 6.65:1; simple validation 4.83:1 / 5.08:1.
  Native mutation error fails AA normal text at 4.44:1 / 4.40:1; DR-034 retains that shared audit.
  Settled valid name-input focus border is 3.65:1 / 10.22:1 against its input surface.
  Intermediate transition colors are not used as final contrast evidence.
- HTTP GET returns 200 with Dutch heading, real club context, required name semantics and range-help content.
  Client content matches. Deferred controls are client-verified, not claimed as SSR-rendered date inputs.
- Before screenshots: light/dark at narrow/wide widths. After inspection: dark wide populated form,
  light 390px and dark 1440px validation/mutation-error fixtures.
  The screenshots contain only safe local field values; repository observations above are the durable evidence.
- `npx prettier --write` formats all five changed/new files. `git diff --check` passes with existing Git
  line-ending configuration warnings. Files remain LF.
- Not run: actual screen-reader, exhaustive control/overlay focus/contrast/hydration, mounted English/French,
  authenticated permissions, real creation/cancel/server-failure/retry or destination-page workflows.
  Error/busy browser states are local selector fixtures, not real server or authenticated passes.
  Existing untranslated service-error strings remain unchanged.
- Native DatePicker dialog/button/day names remain English on the mounted Dutch route.
  New DR-043 records a separate shared locale audit, coordinated with DR-037, without page-specific overrides.
- Agent visual inspection passes the bounded layout.
- The user selected "Approve corrected DR-020b and commit with disclosed limits" on 2026-11-02.
  Approval accepts the recorded native mutation-error contrast failure and unperformed screen-reader,
  exhaustive focus/contrast/hydration, mounted English/French, authenticated/create/cancel and real error/retry checks.
  Native English calendar accessibility labels remain DR-043; native Message contrast remains DR-034.
  Keep all unverified/failed criteria unchecked: acceptance does not mean they passed.
  Only this slice, tests and repository handoff are approved for commit; no push.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
  with existing warnings and zero errors.
- Exceptions: none.
- Exact next action in a fresh invocation: confirm a real mounted editing consumer and scope DR-020c editing chrome.
  DR-020 stays open; DR-020c is the next candidate, not started here.
