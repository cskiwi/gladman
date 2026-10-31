---
title: 'DR-017q: Assembly load-error and unselected feedback'
description: 'Localized native feedback for failed assembly loads and initial club/team selection.'
---

## Identity and scope

- ID: DR-017q. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Completed DR-017a-p are excluded.
- Design rules: [design refresh](../README.md). Owner: unassigned.
- Project: `frontend-pages-competition`.
- Confirmed mounted consumer on 2026-10-31: `/competition/assembly` renders [PageAssemblyComponent][page],
  [AssemblyComponent][template] and its real service through [competition routes][routes].
- Scope: feedback after loading/loaded branches, localized English/Dutch/French messages and retry label,
  plus tightly coupled retry focus recovery and a named programmatic loaded-result focus target.
- Preserve loading/loaded priority, form values, permissions, lineup selection, save/download and existing services.
- Exclude shared/global styling, completed lineup/dialog/statistics surfaces, operational mutations and
  the unconfirmed permission-only change-team block.

## Baseline and approach

- Isolated installed Chrome at 390px confirms the real initial state: loading false, loaded false, error null.
  `app-assembly` is mounted but empty. A browser-local safe error signal replay also renders no text.
- [AssemblyService][service] resets loading/loaded/error on load; without a team it stops unloaded.
  Failed queries populate `error` and stop loading without marking loaded.
- Native styled Message supplies initial guidance and error severity; a native secondary Button retries the
  current team/encounter via the existing `loadData` method. No raw server exception is exposed.
- Messages share the existing component across responsive branches. No extra smart/dumb component is justified
  for one existing consumer and two short feedback branches; styling is already authored once.
- Baseline feedback utility tokens: zero. Existing CDK stylesheet is out of scope.
- English/Dutch/French assets need scoped new copy; no translation-service implementation change.

## Implementation

- [x] Confirm real consumer, state gates and independently reviewable scope.
- [x] Add localized native initial/error feedback and read-only retry.
- [x] Preserve loading/loaded priority, form values and completed responsive presentation.
- [x] Restore retry/result focus without stealing focus if the user moves elsewhere during loading.
- [x] Record utility comparison, new discoveries and zero styling exceptions.

## Acceptance and verification

- [x] Real English/Dutch/French assets resolve guidance, error and retry copy in component tests.
- [x] Native severity, non-dismissable error and accessible feedback are present.
- [x] Retry uses the current encounter and existing load method without save/admin mutations.
- [x] Initial, error, loading, loaded and repeated transitions preserve service/form state.
- [x] Light/dark 360/390/768/1440px feedback fits without clipping adjacent filters.
- [x] Keyboard focus, retry activation and accessible names pass.
- [x] Initial guidance text contrast passes in both themes.
- [ ] Error text contrast passes in both themes: native light 4.41:1 fails 4.5:1; dark 4.63:1 passes.
- [x] Mounted Dutch initial and loaded SSR/fresh hydration are checked.
- [x] Relevant Nx test/lint/build tasks pass.
- [ ] Actual screen-reader announcements and mounted English/French are verified.
- [x] User review/approval is recorded before commit with disclosed verification limits retained.

## Evidence and handoff

- Baseline command: PowerShell here-string piped to `node -`, using existing
  `require('playwright').chromium.launch({ channel: 'chrome', headless: true })`.
  Browser is closed in `finally`; no installation or dependency changes.
- Integrated Playwright MCP cannot open its shared profile because another browser holds it.
  Isolated installed Chrome works; no shared browser was terminated.
- First baseline wait failed because an empty component is not visible; attached-component/hydrated checks succeed.
- Before capture: session `files/dr017q-before-unselected.png`; repository observations above are the durable evidence.
- Production changes: [template][template], [component][component], three locale assets and their automatically
  regenerated [translation types][types] (exactly three added keys). Services remain unchanged.
- Four feedback utility tokens (`flex flex-col gap-2`, `self-start`) replace zero baseline tokens for
  vertical spacing and intrinsic button alignment. No new wrapper/component, SCSS, inline styles, numbered
  palette colors or theme changes. Loaded-section attributes add a named `tabindex="-1"` focus target,
  not an extra sequential Tab stop or a layout change.
- Fourteen new [tests][tests] cover three real locales, persistent native Message settings, safe generic error
  content, disabled retry, current encounter dispatch, responsive state priority, real query failure/success,
  selection retention and focus restoration.
- Initial validation failed two async tests that did not await the actual retry promise. Awaiting that promise
  corrects the tests; no success-shaped fallback or service change was used.
- Final validation after focus correction:

  ```text
  npx nx run-many --targets=test,lint,build --projects=frontend-pages-competition --output-style=static
  ```

  Passed: 319 tests in 20 suites, focused lint (41 existing warnings, zero errors), production library build
  and all 10 prerequisite tasks. Prettier formats every changed file before validation.

- Eight fresh isolated Chrome cases: light/dark at 360/390/768/1440px, height 900px. Initial route
  `/competition/assembly` naturally displays Dutch guidance; local service error replay displays the generic
  translated error and enabled named retry. Names, status/alert live semantics, no text overflow,
  unchanged Season focus, Tab-to-Club, Enter/Space dispatch and missing-team disabled retry pass.
- Each case also navigates the supplied real team/encounter route and verifies loading overrides old loaded/error
  state, loaded restores the appropriate lineup and generic load-error text is absent.
  Final matrices report zero page errors and GraphQL mutations.
- Independent 390px light/dark checks intercept only read-only `TeamInfo` queries for safe fake IDs.
  Initial query failure and Enter retry both visibly fail; restoring the original team then retries successfully
  via real service reads. Failure refocuses the replacement retry button; success focuses the named result section.
  A separate delayed failure preserves Club focus when the user moves there during loading.
- Browser-discovered retry focus initially fell to BODY because the old button survives briefly during native
  Message leave animation. The async handler now recognizes its previous focused button as well as BODY
  before restoring focus after render. Tests and mounted browser checks pass after correction.
- Feedback bounds at 360/390/768/1440px: x=14/14/21/80px, widths=332/362/726/1280px, respectively.
  Text wraps to 48px message height at 360/390px and fits at 31px at 768/1440px.
- Text contrast from settled browser canvas sRGB luminance and alpha-composited backgrounds:
  initial secondary Message 7.74:1 light / 9.51:1 dark (pass);
  native error Message 4.41:1 light (fails 4.5:1) / 4.63:1 dark (passes).
  DR-034 retains the failure; no scoped severity/color workaround is introduced.
- SSR: read-only `fetch` returns HTTP 200 for initial and query-restored routes.
  Inspect the actual `<app-assembly>` subtree, not serialized translation data: initial guidance is present with
  no loaded title; restored route has the loaded title with no guidance or unresolved new key.
  Fresh client navigation preserves the corresponding state without observed hydration/page errors.
- Live API: `/api/v1/translate/i18n/{en,nl_BE,fr_BE}` returns HTTP 200 and each new localized error message.
  Port 5000 initially restarted; readiness later succeeded. Port 3000 went offline during browser checks;
  user restarted it and the matrices were rerun. No user-managed server was stopped/restarted by the agent.
- Early browser assertions raced native leave animation; settle on actual DOM removal before asserting.
  An early initial screenshot captured entry-animation clipping and is not accepted evidence.
  Final retained session screenshots: `files/dr017q-{light,dark}-{360,390,768,1440}-{initial,error}.png`.
  Four representative final captures (light 360 initial, dark 360 error, light 1440 error and dark 1440 initial)
  were visually inspected and show no clipping. Geometry checks cover all sixteen state/width captures;
  this does not claim all sixteen were visually inspected.
- Not verified: actual screen-reader announcements, mounted English/French, quantitative retry focus/icon contrast,
  forced loading/error SSR, authenticated/save success/error workflows, exhaustive hydration,
  reduced-motion/forced-colors rendering and retry interactions at every width.
- Approval on 2026-10-31: the user selected
  "Approve completion and commit with the disclosed verification limits".
  This explicitly accepts the native light error contrast failure and unchecked criteria; it does not
  claim those checks passed. Only this child/implementation/tests/handoff are authorized for commit; no push.
- Post-approval validation:

  ```text
  npx nx run-many --target=lint --output-style=static
  ```

  Passed all 34 projects with existing warnings and zero errors.

- Exceptions: none.
- Discovery: page club/season changes reset selected-team signals without clearing the service form's team/encounter
  or loaded lineup. DR-039 tracks this pre-existing functional mismatch; this slice does not claim it is fixed.
- Next action in a fresh invocation: reconcile remaining confirmed DR-017 consumers/parent scope.
  Keep the parent open until its remaining consumer audit/acceptance is resolved; do not start that here.

[page]: ../../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.component.ts
[template]: ../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html
[service]: ../../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.service.ts
[routes]: ../../../libs/frontend/pages/competition/src/lib.routes.ts
[component]: ../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.ts
[tests]: ../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly-load-feedback.component.spec.ts
[types]: ../../../libs/utils/i18n/src/lib/i18n.generated.ts
