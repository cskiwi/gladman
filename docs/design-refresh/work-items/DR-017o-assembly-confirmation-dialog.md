---
title: 'DR-017o: Assembly confirmation dialog'
description: 'Refresh mounted confirmation dialog chrome and restore native footer actions.'
---

## Identity and scope

- ID: DR-017o. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Dependencies: DR-017a and DR-017h (Done).
- Design rules: [design refresh](../README.md). Project: `frontend-pages-competition`.
- Confirmed mounted consumer on 2026-10-31: the supplied populated `/competition/assembly` route opens
  the dialog through Download after a browser-local invalid validation result. No consumer was added.
- Source: [page template][template], [page actions][component], [existing page regression tests][tests].
- Preserve reused validation content, pending-action dispatch, cancellation resets, modal focus containment,
  Escape/header dismissal, authentication gates and existing save/download contracts.
- Exclude completed DR-017a-n, lineup/data/services, translations, shared components, global theme,
  dependencies and operational/admin mutations.

## Baseline and approach

- Initial worktree clean. The Playwright MCP profile is in use; leave it untouched and use integrated browser.
- The actual dialog displays `There are warnings`, an unnamed close button and no footer buttons.
  The old `pTemplate="footer"` is not picked up by installed PrimeNG 22's named template query.
- Use documented `#footer`, direct native `button[pButton]` actions and existing translated copy.
- Reuse the existing team-formation title for a neutral name covering errors and warnings.
  Name native header dismissal with the existing Cancel translation.
- Use native Dialog `styleClass` layout sizing, `w-full max-w-xl m-4`, and one wrapping footer row.
  Keep native dragging/resizing and focus behavior; put cancellation before agreement.
- No smart/presentational wrapper: one dialog already projects the genuinely shared validation template.
  Extracting a one-to-one wrapper would not provide another real consumer.
- Scoped baseline: zero static utility tokens in the dialog. No scoped stylesheet or styling exception.

## Implementation checklist

- [x] Confirm mounted consumer, completed dependencies and one reviewable slice.
- [x] Restore translated named native dialog/footer actions without changing action logic.
- [x] Preserve reused validation content and cancellation/confirmation contracts with focused tests.
- [x] Capture safe before/after evidence and verify responsive/theme/keyboard behavior.
- [x] Record exact validation and repository-backed handoff.

## Acceptance and verification

- [x] A translated named modal, named header dismissal and visible native Cancel/Agree actions.
- [x] Existing English/Dutch/French title and action translations tested.
- [x] Invalid download/save opens the dialog; cancellation resets state without executing either action.
- [x] Confirmation dispatches only the recorded pending action; validation content remains unchanged.
- [x] Light/dark narrow/wide layouts, long-message wrapping and content scrolling checked.
- [x] Keyboard containment, Escape, header/footer cancellation and focus return checked.
- [x] Title/footer text and keyboard focus-ring contrast measured, including disclosed failures below.
- [ ] All contrast meets AA, including header dismissal; actual screen-reader output checked.
- [x] Existing relevant Nx test/lint/build tasks pass after repository formatting.
- [x] Dutch SSR/fresh responsive hydration and absent/busy/valid/authentication gates checked.
- [ ] Actual authenticated/save success/error workflows, mounted English/French, drag/resize interaction,
      interactions at every width and exhaustive hydration checked.
- [x] No new non-semantic colors, SCSS, inline style workaround, dependencies or shared changes.
- [x] User review or explicit completion approval recorded.

## Evidence and handoff

- Baseline browser-local synthetic validation uses the existing translated insufficient-players diagnostic;
  no player names are captured and no operational mutation is performed.
- Initial Download locator attempts assumed an exact accessible name without the existing icon glyph;
  they timed out. A scoped native-button locator opens the actual confirmation gate.
- The initial real empty lineup reports valid and bypasses the gate; a browser-local invalid validation
  result confirms the existing consumer without changing application code.
- Changed scope: page HTML, 11 new cases in the existing page tests, this brief, parent and backlog.
  No TypeScript implementation/service/shared/global changes. The existing emitted validation template
  remains the single content presentation for the summary and dialog.
- Scoped static utility tokens: zero before, seven after. Native `styleClass` uses three width/cap/gutter
  tokens; the footer has four tokens for wrapping/alignment/gap. No SCSS or inline styles.
  Initial width-only sizing filled the narrow viewport; `m-4` supplies verified 14px side gutters.
- PrimeNG Dialog documentation confirms native named footer, modal naming/focus and utility sizing.
  Installed `primeng-dialog.mjs` confirms `contentChild("footer")`, native `closeAriaLabel`, and
  content-then-footer focus selection. Cancellation is the first footer action; no custom focus code is added.
- After repository Prettier formatting:

  ```powershell
  npx nx run-many -t test,lint,build -p frontend-pages-competition --output-style=static
  ```

  Pass: 297 tests in 18 suites (11 new). Focused lint: 41 existing warnings, zero errors.
  Competition library build and 10 prerequisites pass, with valid cache reuse.
  An earlier 295-test run also passed before adding the two valid-overview bypass cases and final gutters.
  No full-app build or repository-wide lint claimed at this review stage.

- Final fresh layout matrix: light/dark at 360/390/768/1440px verifies the actual native modal title,
  three named buttons, initial footer cancellation focus, no horizontal overflow and side gutters.
  Dialog widths are 332/362/504/504px respectively. Escape resets pending state and returns focus
  to the actual Download trigger in all eight cases. Matrix reports zero page errors and mutations.
- Separate 390px light/dark interaction checks verify Tab order Cancel -> Agree -> header close -> Cancel,
  native modal containment, Space cancellation, pointer header/footer cancellation, keyboard Enter agreement
  and pointer agreement of the save path. Browser-local `getPdf`/`executeSave` stubs count dispatch only:
  one download and one save per theme, no real operational action. Tests verify the actual methods with
  mocked Apollo and the existing PDF logged-request contract, not real persistence/document generation.
- At 390x600px in both themes, 30 long synthetic diagnostic sentences wrap without horizontal overflow;
  native content scrolls while the footer stays visible. Warning-only content has one warn Message,
  no error/success Message, and no duplicate IDs. Existing Message presentation remains unchanged.
- Contrast uses computed native colors converted through canvas to sRGB; translucent colors are composited
  over the actual dialog surface. Settled hover/keyboard measurements explicitly wait for CSS transitions:

  | Check                   | Light   | Dark    |
  | ----------------------- | ------- | ------- |
  | Title text              | 19.87:1 | 16.00:1 |
  | Cancel normal text      | 4.87:1  | 6.65:1  |
  | Cancel settled hover    | 4.66:1  | 6.28:1  |
  | Agree normal/focus text | 3.65:1  | 10.63:1 |
  | Agree settled hover     | 4.64:1  | 13.13:1 |
  | Cancel keyboard ring    | 8.46:1  | 1.40:1  |
  | Agree keyboard ring     | 3.65:1  | 10.22:1 |

  Light normal/focused Agree text fails 4.5:1; dark Cancel ring fails 3:1 against the dialog surface.
  DR-033 records these native/shared audits. Message contrast remains DR-034. No page-specific override
  or styling exception is introduced. Header-close quantitative contrast and actual screen-reader output
  remain unverified.

- Initial contrast attempts read hover transitions too early and used programmatic focus without
  `:focus-visible`; they do not establish hover/ring passes. Another wait was aborted by native initial
  focus cancelling its CSS transition. Final measurements wait for native initial focus, keyboard Tab
  and fulfilled transitions, and correctly disclose native failures rather than claiming all AA checks pass.
- Initial fresh matrix attempts raced the emitted overview/in-flight real validation, so the dialog
  did not open. These failed helpers are not counted as coverage. Final matrix waits for network idle,
  a mounted loaded consumer and the invalid emitted overview; a browser-local no-network validation stub
  isolates synthetic state. The verification-only GraphQL mutation guard records zero mutation attempts.
- Dutch SSR via `Invoke-WebRequest -UseBasicParsing` returns HTTP 200, includes the Dutch page title
  and dialog host, omits an open `role="dialog"` and no longer contains the English warning title.
  Eight fresh browser loads verify responsive hydration; exhaustive hydration remains unchecked.
- Existing and new tests cover absent/valid overview gates, busy Download disabling, authenticated menu
  visibility and save wiring. Real authenticated success/error workflows and drag/resize are not exercised.
- Safe integrated-browser screenshots: before dark 390px dialog (no footer/English title), after light/dark
  390px dialogs (translated chrome/native footer). Only the synthetic diagnostic appears; no player names
  or screenshots are committed. The browser is restored to the real route before handoff.
- On 2026-10-31 the user selected "Approve completion and commit with the disclosed verification limits".
  Approval accepts the recorded native contrast failures and unchecked screen-reader/header-close,
  mounted-locale, authenticated/save, drag/resize, interaction-width and exhaustive hydration limits.
  It does not establish that failed or unperformed checks passed. Authoritative status is Done.
  Only this slice/tests/handoff are approved for commit; no push.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes for all 34 projects,
  with existing warnings and zero errors. Only approval/validation handoff text changed after the final
  focused application checks; no subsequent implementation change requires another build/test run.
- Exceptions: none. Shared native contrast failures are disclosed, not claimed as passed.
- Exact next action in a fresh invocation: inspect remaining mounted assembly surfaces and reconcile
  DR-017's remaining scope before selecting one further child. Keep the parent open; do not reopen completed
  DR-017a-o or start another child here.

[template]: ../../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.component.html
[component]: ../../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.component.ts
[tests]: ../../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.component.spec.ts
