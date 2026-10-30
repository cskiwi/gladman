---
title: 'DR-017c: Assembly desktop player pool'
description: 'Refresh the mounted desktop player-pool container without changing rows or slot behavior.'
---

## Identity and scope

- ID: DR-017c. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Dependency: DR-017b (Done).
- Design rules: [design refresh](../README.md).
- Project: `frontend-pages-competition`.
- Confirmed consumer on 2026-10-30: the supplied populated `/competition/assembly` URL mounts
  [AssemblyComponent](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.ts)
  through [PageAssemblyComponent](../../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.component.html)
  and the [competition routes](../../../libs/frontend/pages/competition/src/lib.routes.ts).
  The desktop `playerList` contains eight regular players, nine checked checkboxes, and no backup players.
- Outcome: one native content surface, named availability controls, and a keyboard-operable backup disclosure.
- Preserve regular/backup order, availability selection, collapse state, CDK pool IDs/data/connections,
  pool-to-slot copying, slot-to-pool removal, ranking rules, and localization.
- Exclude the completed player row, captain/add-player controls, game/substitute slots, mobile selectors,
  base/titular summaries, generation, validation, partner statistics, permissions, theme, backend, and assets.

## Baseline and approach

- Baseline: actual 1441px, dark theme; eight names/rankings and all eight available player IDs captured read-only.
  Session-local screenshots: `DR-017c-before-dark.png` and `DR-017c-before-light.png`.
  The light capture switches only the document class, not the persisted theme preference.
  Do not commit browser captures or live data. No narrow before capture is claimed.
- Existing pool uses a hand-built dashed emphasis surface. Checkboxes have no accessible names;
  the backup disclosure is a click-only div. No backup instance exists in the supplied team.
  Exercise that conditional branch with browser-local synthetic data, not an operational mutation.
- Use native Card, Checkbox, and Button capabilities; preserve the CDK list inside the Card content.
  Reuse the existing presentational player row. A new smart/presentational split is not warranted for this
  single consumer; the repeated domain row is already shared.
- Keep the existing assembly stylesheet untouched: it also serves excluded drag/slot behavior.
  No new stylesheet, host styling, inline styling, palette, global setting, or dependency is required.

## Implementation checklist

- [x] Confirm mounted consumer, scope, dependency, and baseline.
- [x] Preserve selection and CDK bindings while replacing the pool surface.
- [x] Name localized controls and use a native keyboard disclosure.
- [x] Record focused checks, utility comparison, and remaining review accurately.

## Acceptance and verification

- [x] Native PrimeNG surface and controls; no new styling exceptions or dependencies.
- [x] Regular/backup names, ranks, order, and availability are preserved.
- [x] Select-all includes collapsed backups; individual changes update selection.
- [x] Backup disclosure works with Enter/Space and exposes expanded state and controlled region.
- [x] Empty pool is explicit; absent backups have no disclosure.
- [x] Light/dark desktop and constrained widths fit; mobile branch is unchanged.
- [x] Accessible names, keyboard focus behavior, text contrast, and checked Checkbox border/focus contrast pass.
- [ ] Native unchecked Checkbox borders and dark secondary Button focus meet 3:1 contrast.
      Measured failures remain explicit below; completion approval does not mean they pass.
- [x] Actual pool-to-slot drag and slot-to-pool return synchronize local form state.
- [x] Three real locale assets resolve without raw keys in component tests.
- [x] Relevant Nx test/lint/build, formatting, and whitespace checks pass.
- [x] Populated Dutch SSR and hydrated interactions pass.
- [ ] Actual screen-reader output, exhaustive hydration, mounted English/French, authenticated/save workflows.
- [x] User visual review or explicit completion approval is recorded.

## Evidence and handoff

- Only the desktop player-pool template, its native Card module import, and focused component tests change.
  The CDK list remains inside Card content with the same ID, data, connections, drop handler, and sorting setting.
  Its native Card title supplies a named h2/region and the select-all control.
  Per-player controls include the localized participation phrase and full player name.
  The native non-submit backup Button exposes expanded state and controls a persistent hidden region.
  An empty pool uses a secondary Message with the existing localized `all.team.no-players` text.
- Template class tokens: 40 before, 23 after. The dashed emphasis surface and click-only disclosure are retired.
  The existing player-row component is reused unchanged; no new abstraction, wrapper, SCSS, inline styles,
  host styling, palette, global theme change, backend/asset change, dependency, or operational mutation is added.
- User correction on 2026-10-30: "don't use [dt] / [pt] / host classes".
  Removed every scoped design-token binding and its configuration. No PassThrough, authored host classes,
  CSS-variable utility, inline style, SCSS, or other styling substitute is introduced.
  The final controls use native defaults; this correction is not completion approval.
  The trial scoped border/focus tokens passed contrast but are no longer part of the implementation.
  Contrast severity was also tried and rejected because the inverted dark preset makes its text/ring illegible.
  The final disclosure retains secondary severity without token overrides.
- Initial component test run: 139 passed, one failed because the new fixture supplied ranks under `ranking`,
  not `rankingLastPlaces`. Corrected the fixture, not production rank behavior.
  Initial test non-null-assertion warnings were removed using explicit required-element guards.
- Final implementation validation after repository formatting:

  ```powershell
  npx nx run-many -t test,lint,build -p frontend-pages-competition --output-style=static
  git diff --check
  ```

  All 141 tests pass in seven suites, including 11 new pool tests.
  Lint passes with the same 41 existing warnings and no errors; library build and 10 prerequisites pass.
  No full application build, repository-wide lint, or full application test run is claimed for this bounded slice.

- Browser matrix uses installed Playwright and Chrome:

  ```powershell
  node "$env:USERPROFILE\.copilot\session-state\3c9f8ee9-987a-4366-89c8-eda582058662\files\verify-dr017c-native.cjs"
  ```

  The ad-hoc helper is removed after checking; results/captures remain session-local.
  Actual 820/1280/1440px in both themes pass with eight live names/ranks matching baseline.
  Two synthetic backups exercise long-name wrapping, disclosure, and availability without a database mutation.
  Native accessible-name queries, Space selection, Enter/Space disclosure, Tab movement, expanded state,
  select-all including collapsed backups, and individual regular/backup selection pass.
  The unchanged 390px mobile branch has 13 Selects, no desktop Card, and no player rows in both themes.

- Final native-default WCAG contrast calculations convert actual computed OKLCH colors to sRGB with browser canvas:
  minimum text contrast is 4.87:1 light / 6.65:1 dark.
  Checked Checkbox border/focus passes at 3.65:1 / 10.22:1.
  Unchecked focused Checkbox borders fail at 1.48:1 / 1.40:1.
  Disclosure focus passes light at 8.46:1 but fails dark at 1.40:1.
  Checkbox and Button focus use native solid 1px outlines; keyboard behavior passes independently of contrast.
  These failures are not waived by removing overrides, and are not reported as passing checks.
  Initial helper failures included an obsolete nested Checkbox selector and treating OKLCH as RGB;
  those were measurement errors, not application failures.
  The removed scoped-token trial had passed contrast; its earlier captures/results are superseded by the
  `DR-017c-native-*` evidence. No global preset or excluded consumers were changed to work around the correction.
- Pointer drag of a live regular player to double1 copies without removing pool membership and updates the form.
  Drag back to the pool removes the slot entry, preserves pool membership, and clears the local form value.
  These checks do not save or generate an operational lineup.
- Populated Dutch read-only SSR returns HTTP 200, eight rows, Card title, and named participation controls.
  The final hydrated browser matrix reports no page errors.
  Unit tests cover three real locale assets, explicit empty/no-backup states, order/CDK data, selection,
  absence of per-instance token overrides, and unchanged loading/unloaded/mobile gates.
  All 141 tests, lint (41 existing warnings), and library build with 10 prerequisites pass again after the correction.
- Final session-local evidence: `DR-017c-native-live-{820,1280,1440}-{light,dark}.png`,
  `DR-017c-native-backup-{820,1280,1440}-{light,dark}.png`, `DR-017c-native-empty-{light,dark}.png`,
  and `DR-017c-native-results.json`.
  The native-default matrix repeats all six desktop cases, keyboard selection/disclosure, drag/return and form sync,
  both 390px mobile themes, explicit empty states, and Dutch SSR without page errors.
  Runtime assertions confirm Checkboxes have no per-instance design tokens; source checks find no
  `[dt]`, `[pt]`, or host metadata bindings in the changed assembly component/template.
- The user explicitly approved completion with disclosed limits. Actual screen-reader output, exhaustive hydration, mounted English/French,
  authenticated/save workflows, and operational backup/empty records remain unverified.
  The supplied team has no live backups; synthetic branch checks are not evidence of an operational backup workflow.
- Existing parent NG01354 warnings and download TODO remain outside this slice.
- Integrated Playwright MCP browser was occupied; the VS Code integrated browser opens the live route successfully.
- Reusable decision: keep repeated row presentation in the existing player-row component, with CDK and selection
  orchestration in AssemblyComponent. No new smart/presentational split is justified for this one pool consumer.
- Native unchecked Checkbox and secondary Button focus contrast is tracked as DR-032, including the remaining
  pool failures above. A shared/theme fix is not authorized by this page-only slice.
- Exceptions: no styling exception or workaround. The user accepted the disclosed native contrast failures as
  completion limits, not passing accessibility checks. DR-032 remains open.
- Exact next action in a fresh invocation: confirm and scope one mounted desktop game-slot container child,
  excluding completed rows and this pool. Do not start it in this invocation.
  Preserve the user's no-`[dt]`/`[pt]`/authored-host-classes correction when making further changes to this slice.

### Completion approval

- On 2026-10-30 the user selected
  "Approve completion and commit with the disclosed native contrast and verification limits".
- DR-017c is Done by that explicit approval, not by claiming failed or unperformed checks passed.
  The unchecked native-border/dark-focus contrast, screen-reader, exhaustive hydration, mounted English/French,
  authenticated/save, and operational backup/empty limits above remain unchanged.
- Only this slice's implementation, tests, and repository handoff are approved for a Conventional Commit; no push.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects with existing
  warnings and no errors. Final handoff formatting, LF, whitespace, and inline local-link checks pass.
- The final native-default 820px light and 1280px dark backup screenshots were inspected after removing overrides.
  Names remain complete and wrapped, native rows retain their ranks, and Checkbox focus remains visible.
