---
title: 'DR-017h: Assembly validation overview'
description: 'Refresh the mounted validation summary and reused dialog content without changing validation rules.'
---

## Identity and scope

- ID: DR-017h. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Dependency: DR-017a (Done).
- Design rules: [design refresh](../README.md). Project: `frontend-pages-competition`.
- Confirmed consumer on 2026-10-30: the supplied populated `/competition/assembly` URL mounts
  [AssemblyComponent](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.ts)
  through the [competition routes](../../../libs/frontend/pages/competition/src/lib.routes.ts).
  Isolated Chrome displays the Dutch validation fieldset and translated no-errors state.
- Outcome: a named native Card and native error/warn/success Messages for the existing validation template.
- Preserve error-before-warning ordering, interpolation, repeated validation codes with different parameters,
  template output, dialog reuse, loading/loaded gates and mobile/desktop visibility.
- Exclude dialog chrome/actions, backend validation, service logic, translation assets, completed DR-017a-g,
  summaries, captain/add-player controls, partner combinations, shared components and theme.

## Baseline and approach

- Preserve the unrelated generated translation change present at invocation.
- MCP Chrome profile is occupied; use isolated installed Chrome without interrupting other browsers.
- Session-local baseline captures: `DR-017h-before-light.png` and `DR-017h-before-dark.png`.
- Replace the validation Fieldset with a named Card; use native Message severities rather than red/orange/green text.
- Reuse the existing template in the page and confirmation dialog. No additional smart/presentational wrapper:
  the template already shares the meaningful content; data/rules remain in the existing service.
- Track validation objects rather than message codes: several players may share a code, and new parameter
  objects must recreate the existing initialization-based message renderer.
- No styling exception, dependency, global change or operational mutation is planned.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, baseline and one independently reviewable slice.
- [x] Refresh only validation summary/content and preserve behavior.
- [x] Add focused severity, localization, repeated-code, update and dialog-template coverage.
- [x] Record utility comparison, exact validation results and accurate next action.

## Acceptance and verification

- [x] Named native Card and error/warn/success Messages without styling exceptions.
- [x] Error/warning ordering, repeated codes, changed parameters and translated content preserved.
- [x] Existing shared template/output works in a second outlet without duplicate heading IDs.
- [x] Loading/loaded and mobile/desktop gates preserved.
- [x] English/Dutch/French labels and interpolated messages verified in component tests.
- [x] Light/dark and narrow/wide layouts, long content and distinct severity states verified.
- [x] Accessible region/list semantics and native live-region attributes verified in the DOM.
- [ ] All scoped text contrast meets AA; native Message severities fail as recorded below.
- [x] Relevant Nx test/lint/build, formatting and whitespace checks pass.
- [x] Relevant Dutch SSR and hydrated local interaction verified without operational mutations.
- [ ] Actual screen-reader output, exhaustive hydration, mounted English/French and authenticated/save workflows.
- [x] User visual review or explicit completion approval recorded.

## Evidence and handoff

- Changed scope: only the validation Card and existing overview template in
  [the assembly template](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html),
  [11 focused tests](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly-validation-overview.component.spec.ts)
  and this repository handoff. No production TypeScript, rules, service, shared component, theme, stylesheet,
  route, translation asset or dependency changes.
- Scoped static authored class tokens: 14 before, 9 after. Remaining utilities provide Card flex/minimum width,
  heading typography and list reset/spacing. Three palette colors and the unnecessary overview wrapper are removed.
  Native severity icons preserve a non-color distinction; no dismiss buttons or auto-dismiss are added.
- The list explicitly uses `role="list"` to preserve list semantics when bullets are removed.
  The existing template already shares meaningful presentation across two real outlets; no new component is needed.
- Object identity replaces message-code tracking: repeated codes can represent different players; a fresh server
  result must recreate the existing initialization-based message renderer to avoid stale interpolated names.
  Tests cover both repeated-code rows and refreshed same-code parameter objects.
- Validation after formatting:

  ```powershell
  npx nx run-many -t test,lint,build -p frontend-pages-competition --output-style=static
  git diff --check
  ```

  All 197 tests in 12 suites pass. Focused lint passes with 41 existing warnings, no errors.
  The library build and 10 prerequisite builds pass; no full application build is claimed.
  The new 11 tests cover three locales, native components/severities, repeated codes/parameters, output validity,
  second-outlet reuse without duplicate IDs, warning-only/success transitions, mobile/desktop and loading gates.
  All changed files are formatted with the repository Prettier configuration.

- Isolated installed Chrome verification:

  ```powershell
  node "$env:USERPROFILE\.copilot\session-state\af9a0616-a4b5-4003-bb4c-f42efcc0a10c\files\verify-dr017h.cjs"
  ```

  The temporary helper is removed after checking. Captures and JSON measurements remain session-local.
  Initial harness attempts ran before hydration/initial loading finished; waiting for the Angular component and
  network idle resolves those harness-only races without application changes.
  The first contrast assertion fails; final measurement keeps those failures explicit rather than claiming AA.
  All 24 structural/state cases pass: 390/820/1280/1440px, light/dark, success/mixed errors+warning/warning-only.
  Native Messages wrap long synthetic names without scoped horizontal overflow.
  At 390px both themes retain 13 mobile Selects and no desktop pool.
  Fresh same-code parameters update correctly after hydration. The actual Download gate opens the reused
  confirmation content with three Messages and no duplicate heading ID; its close button can receive focus,
  and Escape cancels without invoking PDF/save confirmation. No operational confirm button is clicked.
  Browser page errors: zero. GraphQL mutations: zero.
  The Dutch HTTP SSR response contains the named validation Card and success Message.

- Native Message roots expose `role="alert"` and explicit `aria-live="polite"` in this installed version.
  Generated documentation describes assertive announcements; the installed DOM takes precedence.
  DOM inspection is not actual screen-reader announcement verification. No extra tab stops are introduced
  inside the non-interactive overview; dialog actions/chrome remain unchanged.
- Heading contrast: 19.87:1 light, 16.00:1 dark. Native Message text measurements composite translucent native
  fills over the actual Card. Results are identical at all four widths:

  | Severity | Light  | Dark   | Text AA result |
  | -------- | ------ | ------ | -------------- |
  | Success  | 3.16:1 | 6.48:1 | Light fails    |
  | Error    | 4.44:1 | 4.40:1 | Both fail      |
  | Warn     | 2.85:1 | 7.49:1 | Light fails    |

  Preserve native styling rather than introduce page-level overrides; DR-034 records a separate shared
  Message contrast audit. No contrast failure is checked off or claimed as passed.

- Screenshots inspected: 390px light mixed diagnostics and 1280px dark mixed diagnostics.
  Authenticated/save workflows, mounted English/French, actual screen-reader output and exhaustive hydration
  remain unperformed.
- User approval on 2026-10-30: "Approve completion and commit with the disclosed verification limits".
  The user also selected "Nothing else". Approval accepts the recorded native contrast failures and unperformed
  checks; it is not evidence that they passed. Preserve all unchecked acceptance entries.
  Only DR-017h implementation, tests and repository handoff are authorized for commit; no push.
  Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects with existing
  warnings and no errors. No production changes follow approval.
- Exceptions: none.
- Exact next action in a fresh invocation: do not reopen completed DR-017h. DR-017 remains open; confirm/scope
  one remaining mounted assembly surface (for example partner combinations), excluding completed DR-017a-h.
