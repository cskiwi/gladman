---
title: 'DR-017g: Assembly generation controls'
description: 'Refresh only the mounted desktop generation controls, preserving local lineup behavior.'
---

## Identity and scope

- ID: DR-017g. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Dependency: DR-017a (Done).
- Design rules: [design refresh](../README.md). Project: `frontend-pages-competition`.
- Confirmed consumer on 2026-10-30: the supplied populated `/competition/assembly` URL mounts
  [AssemblyComponent](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.ts)
  through the [competition routes](../../../libs/frontend/pages/competition/src/lib.routes.ts).
  Isolated installed Chrome displays the Dutch generation heading, time range and four action buttons.
- Outcome: a named native Card with fluid controls and keyboard-accessible strategy Tooltips.
- Preserve time-range values/templates, conditional weeks input and bounds, strategies, loading/disabled states,
  local generation and clearing, translations and desktop-only visibility.
- Exclude completed chrome/rows/pool/slots/substitutes, mobile selectors, captain/add-player, summaries,
  validation, partner combinations, generator/service logic, shared/theme/backend/translation assets.

## Baseline and approach

- Initial worktree contains an unrelated generated translation change; preserve it.
- The MCP browser profile is occupied. Use isolated installed Chrome without disturbing that profile.
- Read-only baseline captures: session-local `DR-017g-before-light.png` and `DR-017g-before-dark.png`.
- Replace the custom bordered/padded surface and unassociated heading label with native Card/title markup.
  Replace repeated host/inner width classes with documented native fluid controls.
- Reuse direct PrimeNG components. There is only one mounted generation-controls block; a new
  smart/presentational wrapper would not share meaningful structure across consumers.
- No token/PassThrough overrides, host styling, styles, dependencies or operational mutations.
- Scoped static authored class tokens drop from 26 to 12, including removal of duplicated host/inner Button widths.
  Ten cover layout/typography; two are the clear icon's `pi pi-trash`. Three dynamic native icon/spinner class
  bindings replace deprecated icon/loading inputs, without new palette or layout styling.
  Necessary heading typography and control-group layout remain. Surrounding template is byte-for-byte unchanged.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, baseline and one independently reviewable slice.
- [x] Refresh only generation-controls presentation and preserve behavior.
- [x] Add focused localization, interaction, loading/disabled and clear regression coverage.
- [x] Record utility comparison, exact validation results and accurate next action.

## Acceptance and verification

- [x] Native named Card, localized heading and fluid controls without styling exceptions.
- [x] Strategies, time-range values, conditional weeks/bounds and local clear/form contracts preserved.
- [x] Loading/disabled, empty available-player and loaded/unloaded/mobile gates verified.
- [x] English/Dutch/French labels resolve in component tests.
- [x] Light/dark desktop widths and unchanged narrow/mobile layout verified.
- [x] Keyboard movement, native visible focus, localized names and hover/focus/Escape Tooltips verified.
- [ ] All scoped text/focus contrast meets AA; preserved native light-mode colors fail as detailed below.
- [x] Relevant Nx test/lint/build, formatting and whitespace checks pass.
- [x] Dutch SSR and hydrated local interaction verified without operational mutations.
- [ ] Actual screen-reader output/Tooltip association, exhaustive hydration, mounted English/French,
      authenticated/save workflows and quantitative focus-ring painted-area checks.
- [x] User visual review or explicit completion approval recorded.

## Evidence and handoff

- Changed scope: only the desktop generation block in
  [the assembly template](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html),
  [11 focused tests](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly-generation-controls.component.spec.ts)
  and this repository handoff. No production TypeScript, shared component, theme, stylesheet, service,
  route, translation asset or dependency changes.
- Preserve existing info/success/warn/danger outlined severities and icons. Clear remains enabled during
  generation and with no available players, matching its existing contract. No new permission gate is added.
  The loading flag resets on rejection and errors propagate; no success-shaped fallback is introduced.
- User review on 2026-10-30 requested native `button[pButton]` instead of deprecated `<p-button>`.
  This is a correction request, not completion/commit approval. The four scoped actions now use native
  `type="button"`, direct translated text, hidden decorative icons, native click/disabled and `aria-busy`.
  The installed directive also deprecates its loading input and label/icon child directives:
  use direct children with conditional spinner classes instead, as its declarations recommend.
  Completed controls outside this slice are not silently migrated.
- Installed PrimeNG declarations confirm Card title templates and Select/InputText/Button fluid inputs.
  Strategy Tooltips now use the native `both` event to support keyboard focus as well as hover.
- Validation after formatting:

  ```powershell
  npx nx run-many -t test,lint,build -p frontend-pages-competition --output-style=static
  npx nx run-many -t test,lint -p frontend-pages-competition --output-style=static
  git diff --check
  ```

  The first runner passes lint and the library build with 10 prerequisite builds; new tests initially fail
  because the assertions treat PrimeNG signal inputs as properties and include the Select's internal Tooltip.
  The corrected final runner passes all 186 tests in 11 suites; lint has 41 existing warnings, no errors.
  After the user's correction, the combined test/lint/build command passes again: 186 tests in 11 suites,
  41 existing lint warnings/no errors, library build and 10 prerequisites. No full app build is claimed.
  A preliminary formatter check also caught a misplaced closing tag, corrected before the build.
  Tests cover three locales, all three dispatches, conditional weeks/bounds, pending and rejected generation,
  zero available players, clearing every local slot/form, pool preservation and desktop/loading gates.
  Updated assertions require four native directives/no scoped `p-button`, non-submit button types,
  hidden icons, three busy/spinning actions during pending work and restored icons afterward.

- Browser verification uses installed Playwright and isolated installed Chrome:

  ```powershell
  node "$env:USERPROFILE\.copilot\session-state\ad52eb68-14f4-4ed7-a11c-da7666133c35\files\verify-dr017g.cjs"
  ```

  Ad-hoc helper is removed after checking; results and captures remain session-local, not repository deliverables.
  Final run passes all six 820/1280/1440px theme combinations, native keyboard Select opening, four translated
  options, conditional weeks input set to seven, visible focus, hover/focus Tooltips, Escape and Tab movement.
  The harness was corrected to exclude the Select's extra dropdown button, await reactive DOM removal and
  allow focus-color transitions to settle. Intermittent pointer Select-opening waits were replaced with the
  actual keyboard opening check; no application fallback was added.

- After the native-Button correction, the final matrix passes again with all six theme/desktop cases,
  exact localized accessible Button names (icons are hidden), native busy/spinner/disabled states,
  hover/focus/Escape/Tab Tooltips, real random generation/clearing, mobile and Dutch SSR.
  Running the browser beside the library rebuild initially caused a development live reload during an option
  click. Final verification runs after the rebuild and passes without reload interference.
  Final `DR-017g-native-{width}-{theme}.png` captures and `DR-017g-native-results.json` supersede the initial
  component-Button captures; scoped colors remain as measured below. Actual Tooltip association is recorded
  independently of visible text: null IDs are not treated as proof of association.

- Native Card/control/document bounds have no scoped horizontal overflow. Dutch headings wrap at 820px;
  inspected final 820px light and 1440px dark captures show the intended native Card composition.
  Unchanged 390px mobile keeps 13 Selects and no generation region in both themes.
- Real local random generation fills four singles and four doubles; Clear empties all slots/substitutes,
  resets scalar `single1` to null and preserves the eight-player pool. Component tests cover all strategies.
  No-available-player disables only the three strategies. Dutch SSR returns HTTP 200 with the named Card.
  Browser has zero page errors and zero GraphQL mutations. No operational/admin actions are used.
- Transition-stable computed colors, converted through canvas to sRGB and composited over actual backgrounds:
  heading contrast 19.87:1 light / 16.00:1 dark; selected text and weeks input 13.61:1 / 16.00:1.
  Focused time-range label is **2.66:1 light (fail)** / 10.22:1 dark; weeks label 4.87:1 / 6.65:1.
  The focused-label issue is already tracked as DR-031; no shared-theme correction is hidden here.
- Preserved native outlined Button text contrast, light / dark:
  variations **2.77:1 (fail)** / 8.92:1; best results **2.28:1 (fail)** / 10.97:1;
  random **2.80:1 (fail)** / 8.44:1; clear **3.76:1 (fail)** / 6.91:1.
  Stable strategy focus is a one-pixel solid native severity-colored outline with no box shadow.
  Its light contrast also fails 3:1 for the first three strategies. Quantitative painted-area verification
  remains unchecked. DR-033 records a separately scoped native Button accessibility audit.
- Tooltips display the same localized copy on hover and focus and dismiss on Escape/blur.
  Native Buttons have no `aria-describedby` and displayed Tooltips have no ID; association/output
  is not claimed and is included in DR-033. The localized visible action names remain present.
- The user selected "Approve completion and commit with the disclosed verification limits" on 2026-10-30,
  after the requested native-Button correction and its passing revalidation.
  Approval accepts the recorded native light-mode text/focus and focused-label contrast failures, missing
  Tooltip association, and unchecked screen-reader, exhaustive hydration, mounted English/French,
  authenticated/save and quantitative focus-ring painted-area checks. These criteria remain unchecked.
  Approval is not evidence that failed or unperformed checks passed.
  Only DR-017g implementation/tests/handoff are authorized for commit; do not stage the unrelated generated
  translation change or push. No production changes follow approval.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects with
  existing warnings, no errors. Approval/handoff documentation is formatted before staging.
- Exceptions: none.
- Exact next action in a fresh invocation: confirm/scope one mounted validation-presentation child, excluding
  completed DR-017a-g surfaces. Do not start it here. DR-017 remains open.
