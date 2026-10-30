---
title: 'DR-017b: Assembly player row'
description: 'Refresh the existing presentational player row reused by assembly pools and slots.'
---

## Identity and scope

- ID: DR-017b. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Dependency: DR-017a (Done).
- Design rules: [design refresh](../README.md).
- Project: `frontend-pages-competition`.
- Confirmed mounted consumer on 2026-10-30: the supplied populated `/competition/assembly` URL renders eight
  [AssemblyPlayerComponent](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly-player/assembly-player.component.ts)
  instances in the regular player pool.
  The existing [assembly template](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html)
  also reuses this input-only component in backup, doubles, singles, and substitute lists (five call sites).
- Outcome: one readable, theme-aware player row with accessible competition-status and ranking-exemption indicators.
- Preserve full names, ranking defaults, event/slot ranking selection, inputs, and the parent's CDK drag bindings.
- Exclude pool/slot containers, base/titular summaries, mobile selectors, generation, validation, partner statistics,
  permissions, shared theme, backend, and translation assets.

## Baseline and approach

- Reuse the existing presentational component; no new smart/presentational split or PrimeNG wrapper is warranted.
- Baseline: eight pool names/rankings, no live warning/exemption players, empty slots.
  Actual integrated-browser width is 1249px, dark theme.
  Session-local captures: `.playwright-mcp/DR-017b-before-desktop-dark.png` and
  `.playwright-mcp/DR-017b-before-row-dark.png`; do not commit browser evidence.
- The row has two nested flex wrappers, reduced-opacity ranking text, yellow/orange palette icons, hover-only
  explanations, and one SCSS host display rule.
- Use native warning-severity Tags with localized accessible names and hover/focus Tooltips.
  Keep compact layout utilities and semantic ranking text; remove the redundant wrapper and stylesheet.
- The existing competition-status asset uses a single-brace `{playerFullName}` placeholder, which TranslatePipe
  does not interpolate. Resolve this exact placeholder locally when constructing the tag explanation.
  Do not alter global translation behavior or the validation component.

## Implementation checklist

- [x] Confirm mounted consumer, scope, dependency, and five existing template call sites.
- [x] Preserve name/ranking behavior and CDK integration.
- [x] Use native semantic status indicators and keyboard-accessible explanations.
- [x] Remove only the component's retired host stylesheet and redundant markup.
- [x] Record focused checks, evidence, and remaining review accurately.

## Acceptance and verification

- [x] Regular, backup, double, single, and substitute row consumers retain names/rankings and drag data.
- [x] Ranking defaults, M/F/MX rules, and reactive input changes pass component tests.
- [x] Warning/exemption states have localized names, native severity, focus/hover explanations, and Escape dismissal.
- [x] Three real locale assets resolve without raw translation keys or placeholder tokens in component tests.
- [x] Light/dark desktop and constrained row widths fit, including long synthetic names and both statuses.
- [x] Narrow mobile selectors remain unchanged; this row is not mounted by the mobile branch.
- [x] Relevant text contrast and native keyboard focus are checked in both themes.
- [x] No new palette utilities, SCSS, inline styles, shared theme changes, or dependencies.
- [x] Focused Nx tests, lint, build, formatting, and whitespace checks pass.
- [x] Populated Dutch SSR renders eight rows; hydrated browser controls/tooltips and local drag work.
- [ ] Actual screen-reader output, exhaustive hydration, mounted English/French, and full lineup/save workflows.
- [x] User visual review or explicit completion approval is recorded.

## Evidence and handoff

- Reused the existing presentational component, changing only its template/metadata and adding its component tests.
  Parent template, service, CDK bindings, and all excluded areas remain unchanged.
- Native Tags use warning severity, explicit localized image names and tab stops, plus native Tooltips on both
  hover and focus. Names wrap, ranks remain unbroken, and reduced-opacity text is retired.
- The single-brace status placeholder is resolved for the current player without HTML interpolation or global changes.
- Template class tokens: 22 before, 11 after. There are no authored host classes or host styling.
  Existing parent flex layouts size the row; name wrapping stays inside the external template.
  One redundant flex wrapper, both palette colors, and the component SCSS file/reference are removed.
- Initial focused tests: 15 passed, three failed because the new test treated PrimeNG 22's signal severity as a
  property. Correcting the typed Tag assertion resolved the failures; no production workaround was added.
- Final validation after formatting:

  ```powershell
  npx nx run-many -t test,lint,build -p frontend-pages-competition --output-style=static
  git diff --check
  ```

  All 130 tests pass across six suites (18 new row tests); lint passes with the same 41 existing warnings.
  Competition library build and all 10 prerequisites pass.
  Repository formatter covers every changed surviving file; local Markdown links and whitespace are checked.
  No dependency/tooling additions, backend changes, or operational mutations were required.

- Browser matrix uses existing Playwright with installed Chrome:

  ```powershell
  node "$env:USERPROFILE\.copilot\session-state\9c25b195-d776-478c-95df-778bce925380\files\verify-dr017b.cjs"
  ```

  The ad-hoc helper is removed after checking; screenshots/results remain session-local, not committed.
  Default bundled headless-shell launch was unavailable; installed Chrome worked without downloading dependencies.
  Helper corrections wait for hydration, theme transition completion, and CDK drop completion rather than
  confusing SSR/transition/drag-placeholder states with final application results.

- Actual 820/1280/1440px in both themes: eight real pool names/rankings match baseline before synthetic seeding.
  Synthetic REGULAR/BACKUP, double, single, and substitute rows verify all five call sites and their CDK drag data.
  Full long names wrap without row overflow, including both status tags.
  Ranking output is respectively `4 - 6`, `4 - 6`, `6`, `4`, `4 - 6`.
- Both themes pass hover/focus Tooltips, actual Tab movement between tags, native 1px auto focus outline,
  Escape dismissal, and localized accessible image-name queries.
  Final text contrast minima exceed 18:1 light / 15:1 dark; icon contrast exceeds 4.5:1 / 8.6:1.
  Initial semantic muted ranks measured 4.46:1 on the existing pool background and were corrected locally to
  semantic normal text color. No theme or parent surface changes are hidden in that fix.
- Actual pointer drag from the synthetic pool to double2 preserves pool membership, sets the slot player ID,
  and synchronizes the double2 form value. This is browser-local state only, not a save operation.
- At 390px in both themes, the unchanged mobile branch retains 13 Selects and mounts no player rows.
  This does not claim that its existing hard-coded placeholders, forms, or full mobile workflow were refreshed.
- Read-only populated SSR fetch returns HTTP 200, eight player rows, and the updated semantic rank markup.
  No page errors occur in the final hydrated matrix; existing parent NG01354 warnings remain outside scope.
- Eight after screenshots are `DR-017b-after-{820,1280,1440}-{light,dark}.png` and
  `DR-017b-mobile-{light,dark}.png` in session storage.
  Inspected 820px light and 1280px dark screenshots: complete names/rankings, native tags and visible focus.
  Before screenshot coverage was dark desktop only; no light/mobile before screenshot is claimed.
- Review outcome: implementation checks pass; the user explicitly approved completion with the recorded limits.
  Tests cover real English/Dutch/French assets and reactive language/player changes, not mounted locale switching.
  Screen-reader output, exhaustive hydration, authenticated/full lineup/save workflows are not verified.
- No new shared pattern or unrelated discovery is introduced. Later children must still scope pool/slot containers,
  mobile selectors, generation, validation, and partner statistics separately; existing parent follow-ups remain.
- Exceptions: none.
- Exact next action in a fresh invocation: confirm and scope one mounted DR-017 player-pool/slot container child,
  excluding the completed row component. DR-017 remains open. Do not start another child in this invocation.

### User review correction

- On 2026-10-30 the user requested: "don't use `host` styling". This was a change request, not completion approval.
- Removed the component's host class metadata entirely. No host-binding substitute, SCSS, inline styles, or new
  parent classes were added. All five existing consumers already participate in flex layouts.
- Repeated formatting and the same Nx test/lint/build command above: all 130 tests, lint (41 existing warnings),
  and library build with 10 prerequisites pass after the correction.
- Repeated actual 820/1280/1440px light/dark checks using an ad-hoc `verify-dr017b-no-host.cjs` helper in the same
  session folder, removed after verification. All five synthetic consumers fit, preserve rankings/CDK drag data,
  and have no authored `block` or `min-w-0` host classes.
- Hover/focus Tooltips, actual Tab movement, native focus outline, Escape dismissal, pointer drag and double2 form
  synchronization pass again. Minimum measured text/icon contrast remains 18.19:1/4.51:1 light and 15.12:1/8.66:1 dark.
- Both 390px mobile branches still have no player rows and 13 Selects. Populated SSR returns eight rows without
  host styling; the hydrated matrix has no page errors.
- Six corrected desktop captures are `DR-017b-no-host-{820,1280,1440}-{light,dark}.png` in session storage.
  The original unchecked workflow limits still apply.

### Completion approval

- On 2026-10-30 the user selected "Approve completion and commit with the recorded verification limits"
  after the no-host-styling correction.
- DR-017b is Done by that explicit approval, not by claiming unperformed checks passed.
  Screen-reader output, exhaustive hydration, mounted English/French, and full authenticated lineup/save workflows
  remain unchecked above.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects with existing
  warnings and no errors. Final handoff formatting, whitespace, and local-link checks pass.
- Only this slice's implementation, tests, and repository handoff are approved for a Conventional Commit; no push.
- Later work must keep the row free of authored host styling as requested for this slice.
