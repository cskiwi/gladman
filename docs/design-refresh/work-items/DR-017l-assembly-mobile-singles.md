---
title: 'DR-017l: Assembly mobile singles'
description: 'Refresh mobile singles surfaces and share full-name display across mobile lineup selectors.'
---

## Identity and scope

- ID: DR-017l. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Dependencies: DR-017e and DR-017j (Done).
- Design rules: [design refresh](../README.md). Project: `frontend-pages-competition`.
- Confirmed mounted consumer on 2026-10-31: the supplied populated `/competition/assembly` URL,
  at 390px, renders 13 Selects including Heren Enkel 1-4. Isolated installed Chrome verifies hydration.
- Source: [assembly template](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html).
- Preserve options/filtering, selected player identity, standalone ngModel, clear/change dispatch, scalar
  form synchronization, validation, gender/capacity/duplicate rules and responsive branch behavior.
- Exclude desktop, mobile doubles/substitute surfaces and semantics, completed children, services, shared components, theme,
  backend, translation assets, dependencies and operational mutations.
- User feedback on 2026-10-31 explicitly extends option/selected-value full names to
  "All mobile lineup selectors (singles, doubles and substitutes)". This is not completion/commit approval.

## Baseline and approach

- Four repeated Fieldsets contain first-name-only Selects with hard-coded English placeholders and no
  explicit accessible control names. Scoped authored static class tokens: one (`w-full` in the repeated loop).
- Replace only this loop with native named Cards and localized visible labels naming each Select.
- Reuse `playerOptionLabel` from DR-017j for options and values; use native fluid Select.
  Native option/selected-item templates wrap long names with layout utilities.
- One repeated template styles all four actual consumers once; no one-to-one smart/dumb wrapper is warranted.
- MCP browser profile is occupied. Existing Playwright with isolated installed Chrome is used instead.
- Before light/dark full-page captures are session-local; do not commit live-data screenshots.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, baseline and one independently reviewable slice.
- [x] Refresh only mobile singles while preserving behavior and localization.
- [x] Add focused tests for naming, values, filtering, clearing and unchanged branches.
- [x] Record validation, utility comparison and accurate handoff.

## Acceptance and verification

- [x] Native named Cards and localized, explicitly labelled Selects render all four slots.
- [x] All 13 mobile lineup Selects show first and last names in actual options and selected values.
- [x] Existing filtering, current selection, assignment/clearing, form synchronization and validation remain.
- [x] English/Dutch/French, M/F/MX names, duplicate first names and long names are covered in component tests.
- [x] Light/dark narrow/wide layouts and relevant empty/loading/unloaded states remain usable.
- [x] Keyboard selection/Delete clearing, Escape, Tab order, accessible names and long overlays verified.
- [x] Native focused border is visible in inspected screenshots; selected-text contrast passes.
- [ ] Actual screen-reader output and quantitative focus-ring, placeholder and option text contrast.
- [x] Existing relevant Nx tests/lint/build pass; final formatting/whitespace results recorded below.
- [x] Dutch SSR/fresh hydration and excluded desktop behavior remain intact.
- [ ] Exhaustive hydration, mounted English/French and authenticated/save workflows.
- [x] User visual review or explicit completion approval recorded.

## Evidence and handoff

- Baseline command: `node <session-files>\dr017l-browser.cjs` passes mounted hydration and records
  13 Selects, including the four singles at 390px; light/dark captures remain session-local.
- No GraphQL mutations are allowed by the verification helper.
- Changed scope: the mobile singles surfaces and, after explicit user feedback, all mobile lineup
  option/selected-value naming and wrapping, plus a typed option-label adapter in
  [AssemblyComponent](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.ts),
  [20 focused tests](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly-mobile-singles.component.spec.ts)
  and repository handoff. No service/shared/theme/style/translation changes.
- Installed native Select accepts a string property for `optionLabel`, unlike AutoComplete's callback API.
  An initial build caught the attempted callback binding. The final adapter uses native `label`/`value`
  options, applies the existing `playerOptionLabel` callback once per option and retains original player objects.
  It works with plain GraphQL objects, without relying on the model's prototype `fullName` getter.
- Existing local singles controls hold a player object or null, not an ID. Initial new tests incorrectly
  expected IDs; corrected tests verify the repository's actual scalar-object form contract.
- Initial singles utility comparison: one authored token became seven (three heading tokens and two wrapping tokens each
  in the native option/selected-item templates). Fluid Select replaces `w-full`. Increased usage is necessary
  for readable native headings and long-name wrapping; zero new palette/SCSS/inline styling.
- Final application validation after formatting:

  ```powershell
  npx nx run-many -t test,lint,build -p frontend-pages-competition --output-style=static
  ```

  Final pass after the full-name extension: 266 tests in 16 suites, including 19 new tests;
  lint has 41 existing warnings and no errors.
  Library build and 10 prerequisites pass. No full app build or repository-wide validation is claimed.

- Final repository Prettier formatting of all six changed files and `git diff --check` pass.
  Git reports its existing LF-to-CRLF checkout warnings; no whitespace errors are reported.

- Component tests verify real English/Dutch/French placeholders and M/F/MX slot names, shared option labels,
  original form values, four assignment/clear dispatches, validation, regular/backup and mixed filtering,
  occupied-slot behavior, long names, empty/loading/unloaded gates and unchanged desktop.
- Final isolated browser command:

  ```powershell
  node "$env:USERPROFILE\.copilot\session-state\8ce45693-909c-402d-bcea-26a656f97f94\files\dr017l-browser.cjs"
  ```

  Pass: six 360/390/768px mobile theme cases and four 820/1440px desktop theme cases, each with fresh hydration.
  Mobile has four correctly associated headings/comboboxes and the existing 13 Selects.
  Safe browser-local players distinguish identical first names. ArrowDown/Enter selection, Delete and
  pointer clearing, Escape dismissal and Tab to the next singles control pass.
  Long option/selected full names fit the viewport/Card without document overflow in all mobile cases.
  Final Dutch SSR is HTTP 200 and retains all desktop singles headings; no page errors or GraphQL mutations.

- Ad-hoc browser attempts initially read state before native option focus, signal rendering and overlay
  transitions settled. The helper now waits for each observable state and uses fresh hydration per case.
  No application workaround was needed. The helper is removed after verification; captures remain session-local.
- Selected text contrast, measured with actual computed colors converted to sRGB through browser canvas,
  passes at 13.61:1 light and 16.00:1 dark. This is not evidence of placeholder/option/focus-ring compliance.
  Inspected native keyboard-focus screenshots show the focused border; quantitative focus remains unchecked.
- Existing mobile filled-slot replacement and cross-slot duplicate differences are recorded in DR-036.
  They remain unchanged; this slice does not claim functional parity with desktop drag/drop.
- User feedback requested first/last names when selecting a player; clarification explicitly selected all
  mobile lineup selectors. The correction therefore includes the eight doubles and one substitute Select,
  without changing their Fieldsets, placeholders, clear behavior, indices or service rules.
- `getMobilePlayerOptions(slotId, index?)` preserves each existing filtering argument and original player value.
  One `mobilePlayerOptionTemplate` supplies wrapping for both native item/selected-item slots in all 13 controls.
  No new component is needed; actual repeated domain presentation is styled once.
- Final all-mobile selector utility comparison: five authored static tokens become nine, comprising
  four unchanged doubles/substitute layout tokens, three singles heading tokens and two shared wrapping tokens.
  Singles no longer duplicate wrapping between item/selected-item templates.
- Final correction browser command:

  ```powershell
  node "$env:USERPROFILE\.copilot\session-state\8ce45693-909c-402d-bcea-26a656f97f94\files\dr017l-fullnames.cjs"
  ```

  All six 360/390/768px light/dark cases select actual options and verify first/last names in all 13 native
  selected values. Doubles retain both original player values; substitutes retain the original append value.
  Safe synthetic long options/selected values wrap without document overflow in every mobile case.
  Singles Delete clearing and Tab order remain intact. Four 820/1440px theme cases retain desktop.
  Final Dutch SSR is HTTP 200; fresh hydration reports zero page errors and no GraphQL mutations.
  Captures are session-local and the helper is removed after checking.

- The initial extension test wrongly expected an appended substitute to remain in available options;
  existing filtering correctly removes it. The corrected assertion verifies the preserved filter contract.
  Browser checks verify its cached native selected label still shows the full name.
- Additional contrast measurements are the initial singles evidence above, not an exhaustive contrast
  audit of all 13 controls. Other disclosed verification limits remain unchecked.
- Subsequent user feedback reported NG0955 duplicated empty keys when opening/selecting an option.
  Root cause: native Select `trackOption` resolves `dataKey` against the outer option object, not its
  `optionValue`. The new label/value wrappers lacked the original `id`, so all tracked IDs were undefined.
- The final adapter retains `id: player.id` alongside label/value, preserving the existing `dataKey="id"`.
  One new regression test calls native `trackOption` across all 13 Selects and verifies nonempty unique
  keys and stable keys after refreshed option wrappers. The substitute retains its original object tracking.
- Final checks after the tracking fix: the same Nx command passes all 267 tests in 16 suites (20 new),
  lint with 41 existing warnings/no errors, library build and 10 prerequisites.
- Warning-specific browser command:

  ```powershell
  node "$env:USERPROFILE\.copilot\session-state\8ce45693-909c-402d-bcea-26a656f97f94\files\dr017l-tracking.cjs"
  ```

  Six fresh 360/390/768px light/dark cases open the real mounted eight-option dropdown without selection,
  then safely open/select/reopen all 13 controls using browser-local synthetic players.
  Native option keys are nonempty/unique and selected names contain first/last names.
  Explicit console capture reports zero NG0955/duplicated-key warnings and zero page errors.
  No GraphQL mutations are permitted. The helper is removed after checking.

- Earlier browser helpers checked page errors but did not capture NG0955 console warnings;
  their successful visual/full-name checks were not evidence that no tracking warning occurred.
  This gap is now covered by the native-key regression and warning-specific mounted verification.
- No styling exceptions or dependencies. User approval on 2026-10-31:
  "Approve completion and commit with the disclosed verification limits".
- Accepted limits: actual screen-reader output; quantitative native focus-ring, placeholder and option text
  contrast; exhaustive hydration; mounted English/French; authenticated/save workflows. These remain unchecked.
  Approval is not evidence that unperformed checks passed. Earlier failed tracking behavior was corrected and
  verified before approval. Only this slice, its tests and repository handoff are approved; no push.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects,
  with existing warnings and no errors. Final approval/handoff changes are documentation-only.
- Status is Done in the backlog. Exact next action in a fresh invocation: confirm/scope one mounted mobile
  doubles surface group, preserving completed full-name presentation and excluding completed DR-017a-l.
  Keep DR-017 open and do not start another child here.
