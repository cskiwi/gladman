---
title: 'DR-021e: Enrollment partner dialog'
description: 'Native partner search, notes and responsive dialog actions for general enrollment.'
---

## Identity and scope

- ID: DR-021e. Parent: [DR-021](DR-021-tournament-enrollment.md). Dependency: DR-021c Done.
- Authoritative status: [backlog](../backlog.md). Design rules: [plan](../README.md).
- Project: `frontend-pages-tournament`.
- Confirmed consumer: `/tournament/8658b541-702a-408e-8114-2858a9428069/enroll`.
  The mounted page opens the existing dialog for the public MD 1-2 doubles event.
- Source: [dialog](../../../libs/frontend/pages/tournament/src/pages/general-enrollment/components/partner-selection-dialog/partner-selection-dialog.component.ts),
  [template](../../../libs/frontend/pages/tournament/src/pages/general-enrollment/components/partner-selection-dialog/partner-selection-dialog.component.html)
  and [parent](../../../libs/frontend/pages/tournament/src/pages/general-enrollment/page-general-enrollment.component.ts).
- Preserve GraphQL search with two-character trimmed threshold, optional partner/notes, 500-character
  validation, Cancel versus Continue results and parent cart integration. No operational mutations for testing.
- Exclude filters, tiles, cart, services, backend, translations and shared theme.

## Baseline and approach

- Clean worktree at start. Mounted baseline: native DynamicDialog, AutoComplete and Textarea;
  extra `p-6` padding inside native dialog content, decorative numbered primary icons, duplicate title,
  ineffective button `flex-1` roots and unassociated partner label (`for="partner"` has no matching input).
- Four light/dark 390/1440px baseline cases fit; native dialog clamps 500px to the 390px viewport.
  Partner description and notes counter are not associated with their inputs.
- Keep the meaningful page/dialog boundary. Search is already dialog-owned; do not extract a styling-only wrapper
  or add an unused consumer. Direct native components are preferable to new smart/dumb abstractions here.
- Use native fluid fields, semantic helper text, associated labels, wrapping action layout and documented
  DynamicDialog responsive sizing. No new styling layer, SCSS or palette exceptions.

## Implementation checklist

- [x] Confirm a mounted consumer and bounded scope.
- [x] Preserve search, optional results, translations and parent integration with regressions.
- [x] Use native options, remove decorative markup and unused imports.
- [x] Check themes, widths, overlays, focus presence, keyboard and validation states.
- [x] Record exact validation, discoveries and remaining review in the repository.

## Acceptance and verification

- [x] Native fields have persistent associated labels and accessible helper descriptions.
- [x] Utility markup is simpler; no new non-semantic colors, SCSS or inline styling workarounds.
- [x] Light/dark 360/390/768/1440px layouts and autocomplete overlay fit.
- [x] Keyboard search/selection, Cancel/Continue, focus order/trapping and disabled validation work.
- [ ] Scoped text, controls and focus contrast pass.
- [x] Optional partner/notes results, search threshold and mocked parent integration remain correct.
- [x] Existing English/French/Dutch field/action/empty copy renders in mounted fixtures.
- [x] Public route SSR excludes the client-opened dialog before interaction.
- [ ] Exhaustive SSR/hydration and native accessible feedback localization are verified.
- [x] Existing Nx lint/test/build pass.
- [ ] Screen-reader and actual authenticated workflows are verified.
- [ ] Required visual/user review passes.

## Evidence and handoff

- Baseline obtained using the actual mounted consumer and existing public events.
- Playwright MCP browser was already in use; integrated browser is available instead. No other process stopped.
- Parent `addToCart` is guarded/replaced with a local collector for dialog inspection; GraphQL mutations are blocked.
  Partner suggestions are local safe fixtures; tests do not establish live search permissions or service availability.
- Changed scope: dialog template, removal of an unused dialog InputText import, parent DynamicDialog breakpoints,
  dialog/parent regressions and repository handoff. No new components, consumers, services, styles or dependencies.
- Static `class` tokens: **30 to 20**, plus one native overlay pass-through class (`w-min`).
  Removed extra content padding, numbered-color icons, separator and ineffective button-root sizing.
  Native fluid fields/actions replace width utilities. The 500px dialog uses documented 90vw sizing below 640px.
- Native AutoComplete `optionLabel="fullName"` renders actual partner names.
  Named dropdown and associated `inputId` fix the broken label; pass-through associates the helper with the native input.
  Native Textarea has associated counter, invalid state and inclusive `maxlength=500`.
  The existing form validator and valid-result guard remain; partner/notes are still optional.
- Long spaced/unbroken suggestions initially expanded the native overlay beyond the viewport.
  A documented item template with two wrapping utilities and `w-min` overlay sizing lets native minimum width
  follow the input while keeping readable suggestions. No fixed-width palette/style workaround is introduced.
- Visible empty feedback reuses existing `all.search.noResults` in all three locales; no translation files change.

### Validation

All eight changed files are formatted with `npx prettier --write --end-of-line lf` and explicit paths.

```shell
npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static
git --no-pager diff --check
```

- Pass: lint, **12 suites / 141 tests**, production library build and ten prerequisite tasks.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all **34 projects**,
  with existing warnings and zero errors. Only approval/handoff documentation changes follow the focused checks.
- Fifteen added cases cover associated native inputs/helpers/dropdown, empty-copy configuration,
  trimmed threshold, suggestions, logged search failure, Cancel versus optional Continue, full-name rendering,
  edited notes/count, invalid/500-character boundary and parent D/MX dialog result integration.
- Initial tests incorrectly reopened a real dialog before its closing lifecycle completed.
  Independent parent fixtures now cover each cancel/partner/optional result; final checks pass.
- Whitespace check passes. Git warns that checkout conversion would replace LF with CRLF;
  no Git configuration is changed. Formatter explicitly writes LF.

### Browser and server evidence

- Four baseline light/dark 390/1440px DOM cases establish the broken label and existing native sizing.
  Before evidence is source/DOM metrics, not a claimed baseline screenshot.
- Final **48** mounted local fixture cases: English/French/Dutch x light/dark x
  360/390/768/1440px x loaded/empty suggestions. All dialog/overlay bounds and action labels fit.
  Three safe options include long spaced and unbroken names. All option content fits without horizontal overflow.
  Fields retain labels/descriptions; freshly opened dialog headers, field labels and empty feedback are localized.
- Four final keyboard light/dark 390/1440px cases pass ArrowDown/Enter selection and exact partner/notes results,
  Tab order through dropdown/notes/Cancel/Continue, native focus trap wrap and Shift+Tab reversal.
  Native solid focus-visible outline is observed; this is not exhaustive focus contrast evidence.
  Actual Textarea input caps 501 characters at 500. Programmatic invalid data disables Continue;
  clicking its visible disabled target does not close/emit. Editing valid notes restores Continue.
- Four final pointer cases at the same theme/width combinations pass actual option selection,
  exact partner/notes results, Cancel without parent output and optional Continue without partner or notes.
  Optional undefined fields serialize as null in the browser tool output, not changed application results.
- Overlay Escape retains the dialog and dismisses suggestions. Empty state uses native AutoComplete feedback.
  Earlier checks that did not await overlay hide raced its animation; final cases await native visibility.
- Final monitored layout/keyboard checks record **zero page errors and zero GraphQL mutation attempts**.
  The anonymous page still logs its inherited forbidden ranking/cart reads on load; this is not a clean-console claim.
- Inspected final dark desktop dialog and light narrow long-suggestion screenshots using only safe fixtures.
  Durable evidence is these metrics and regressions, not session-only screenshot paths.
- `Invoke-WebRequest -UseBasicParsing` against the mounted public route returns **HTTP 200** with the enrollment
  host and without a partner-dialog host/input. The dialog remains client-opened; exhaustive hydration is not verified.

### Contrast, discoveries and remaining review

- Settled computed colors are sampled to sRGB with Canvas; alpha colors are composited over actual ancestors.
  Semantic labels: **19.87:1 light / 16.00:1 dark**. Helpers/counter: **4.87:1 / 6.65:1**.
  Secondary Cancel text: **4.87:1 / 6.65:1**.
- Unfocused native field borders fail at **1.48:1 / 1.40:1**; secondary Cancel border fails at
  **1.23:1 / 1.40:1**. Retain shared DR-032; do not override the preset in this dialog.
- Native primary Continue text fails light at **3.65:1** and passes dark at **10.63:1**.
  Retain DR-033. Early transition samples are superseded by settled, non-hover measurements.
  Exhaustive hover/focus/selected/disabled contrast is not claimed.
- Native `Option List` and `1 items selected` accessible feedback remains English in Dutch.
  Add this shared configuration evidence to DR-037; localized field/dropdown/empty copy does not prove all
  native screen-reader announcements are localized.
- New DR-048 retains inherited search failure logging without visible error/retry feedback.
  Investigate request lifetime/stale ordering separately; browser fixtures do not reproduce or repair those risks.
- Exceptions: none. No backend, translation, shared-theme or unrelated application changes.
- Not run: screen-reader checks, exhaustive hydration/contrast, live search/outage recovery,
  authenticated cart enrollment and real partner service operations. These are not claimed as passed.
- On 2026-11-04 the user selected **"Approve DR-021e and commit with disclosed limits"** and **"Nothing else"**.
  Approval accepts the shared DR-032/033 contrast failures, DR-037 native accessibility localization,
  DR-048 inherited search-feedback/lifecycle follow-up and unperformed screen-reader, exhaustive hydration/contrast
  and real search/authenticated cart workflows. It does not claim failed or unperformed checks passed.
- The backlog marks DR-021e Done by explicit approval with these limits. Unchecked criteria stay unchecked.
  Approval authorizes only this slice, its tests and repository handoff. No push or additional slice is requested.
- Exact next action in a fresh invocation: confirm and scope the real DR-021f sub-event-specific enrollment consumer.
  Do not add a consumer solely for visual testing. DR-021 remains open.
