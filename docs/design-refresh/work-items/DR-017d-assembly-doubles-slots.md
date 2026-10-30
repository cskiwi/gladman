---
title: 'DR-017d: Assembly desktop doubles slots'
description: 'Refresh the four mounted desktop doubles containers without changing lineup behavior.'
---

## Identity and scope

- ID: DR-017d. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Dependencies: DR-017b and DR-017c (Done).
- Design rules: [design refresh](../README.md). Project: `frontend-pages-competition`.
- Confirmed consumer on 2026-10-30: the supplied populated `/competition/assembly` URL mounts
  [AssemblyComponent](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.ts)
  through the page and competition routes. Actual Chrome displays `double1` through `double4`, initially empty,
  with slot statistics of 3/3, 2/3, 3/3, and 0/3.
- Outcome: native content surfaces, readable localized headings and semantic statistics for this doubles loop only.
- Preserve CDK IDs/data/connections/predicates/sorting/drop handler, player order/ranks, capacity, duplication and
  mixed-gender restrictions, statistics, tooltips, pool copy/return, local form synchronization, and localization.
- Exclude completed player rows/pool/chrome, singles/substitutes, mobile selectors, captain/add-player,
  summaries, generator, validation presentation, partner table, shared/theme/backend/translation assets.

## Baseline and approach

- Clean worktree at start. Read-only 1440px Chrome baseline in both themes; four empty mounted doubles lists.
  Session-local captures: `DR-017d-before-light.png` and `DR-017d-before-dark.png`. Do not commit live-data captures.
- Replace custom dashed containers and uppercase labels with native Card title/content and named regions.
  Keep the existing CDK list inside content with a minimum-height empty drop target and localized empty text.
- Preserve the win-rate signal with native success/danger Tags, following user review: success at >=50%,
  danger below 50%. Keep numerical values and make Tooltips available on keyboard focus as well as hover.
- Reuse the completed player row unchanged. Direct Card usage is simpler for this one repeated loop;
  no new wrapper or smart/presentational split is warranted. Singles are an independent later child.
- No `[dt]`, `[pt]`, host styling, inline styling, SCSS changes, dependencies, or operational mutations.
- Authored doubles-loop class tokens: 43 before, 33 after; four dynamic red/green palette bindings removed.
  Necessary wrapping, spacing and minimum drop-target height remain. No class-count target is imposed.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, baseline, and independently reviewable scope.
- [x] Preserve CDK and row behavior while refreshing only doubles containers.
- [x] Use native Card/Tag, localized headings/empty state, and keyboard-accessible tooltips.
- [x] Record focused checks, utility comparison, discoveries, and accurate handoff.

## Acceptance and verification

- [x] Four named native Cards; no new styling exceptions, token overrides, or dependencies.
- [x] Unchanged CDK bindings, capacity/duplicate/mixed rules, pool copy/return, and local form synchronization.
- [x] Empty, one-player, full pair, missing/populated statistics, and long names remain readable.
- [x] Real English/Dutch/French assets resolve all scoped labels and tooltip text in component tests.
- [x] Light/dark 820/1280/1440px layouts fit; unchanged 390px mobile branch retains its Selects.
- [x] Keyboard focus, hover/focus tooltips, Escape dismissal, accessible region names, and contrast pass.
- [x] Relevant Nx test/lint/build, formatting, and whitespace checks pass.
- [x] Populated Dutch SSR and hydrated local interactions pass.
- [ ] Actual screen-reader output, exhaustive hydration, mounted English/French, authenticated/save workflows.
- [x] User visual review or explicit completion approval is recorded.

## Evidence and handoff

- Changed scope: only the desktop doubles loop in
  [the assembly template](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html)
  and [12 focused tests](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly-doubles-slots.component.spec.ts).
  Template content before that loop and from the singles loop onward is byte-for-byte identical to HEAD.
  The only production TypeScript change imports TagModule into AssemblyComponent.
  No shared component, theme, stylesheet, asset, service, dependency, or route changes.
- Native Cards provide content surfaces and localized named h3 headings. Each unchanged CDK list is inside Card
  content, with an explicit existing localized empty label and a layout-only minimum drop-target height.
  Player rows and their parent drag bindings are reused unchanged.
- Statistics retain wins/totals/percentages, conditional pair summaries and the existing 50% color threshold.
  Native success/danger Tags replace authored palette colors. Focusable statistics have localized accessible names,
  native hover/focus Tooltips, and native browser focus rings, without custom styling or token overrides.
- Validation after formatting:

  ```powershell
  npx nx run-many -t test,lint,build -p frontend-pages-competition --output-style=static
  git diff --check
  ```

  All 153 tests pass in eight suites, including 12 new tests. Focused lint passes with the same 41 existing warnings,
  zero errors. Library build and 10 prerequisites pass. No application-wide build/lint/test is claimed.
  The first run had 152 passes and one test failure: pool sorting legitimately reorders female/male players after
  a drop. Corrected the test to compare preserved membership, not require a fixed unsorted pool order.
  No production behavior was changed to satisfy that assertion.
  Final Prettier checks pass for all six changed files, whitespace checks pass, and all 89 inline local links
  across the backlog, parent and child briefs resolve. Documentation-only handoff updates require no task rerun.

- Component tests cover real English/Dutch/French assets and all M/F/MX doubles labels; all four CDK contracts;
  capacity, duplicates, mixed-gender restrictions and the two-doubles-per-player limit; pool copying,
  slot transfer/return, local forms and validation invocation; zero/one/two players, missing/present statistics,
  order/ranks, keyboard Tooltip configuration, mobile selectors, and loading gates.
- Browser verification uses installed Playwright and isolated installed Chrome, not the occupied MCP profile:

  ```powershell
  node "$env:USERPROFILE\.copilot\session-state\75d66e17-09b6-43d4-aac7-8e73e0820c59\files\verify-dr017d.cjs"
  ```

  The ad-hoc helper is removed after checking. Results/captures are session-local, not repository deliverables.
  Actual 820/1280/1440px in both themes pass with four named doubles regions and no text/container overflow.
  Synthetic local slots exercise a full pair, a one-player slot, long names, absent/present statistics and both
  pair summaries. No operational records are changed. Baseline live slot statistics still read 3/3, 2/3, 3/3, 0/3.
  Actual pointer pool-to-double copy and return pass; copying retains all eight pool players and updates the form.
  Component tests additionally verify slot-to-slot transfer and form synchronization.
  The unchanged 390px branch retains 13 Selects, no desktop doubles Cards and no player rows in both themes.

- Keyboard tests verify native focus, Tab movement to the next statistic, localized focus/hover Tooltip text,
  and Escape dismissal at all three desktop widths in both themes.
  Final native-Tag measurements supersede the initial neutral-text captures and contrast measurements.
  Actual computed colors converted to sRGB with browser canvas give minimum scoped plain-text contrast
  4.87:1 light / 6.65:1 dark. Tag text contrast is 4.57:1 success / 5.30:1 danger in light mode,
  and 10.57:1 success / 8.77:1 danger in dark mode.
  Focus screenshots confirm the native auto ring paints two solid pixels at the sampled top edge:
  RGB(16,16,16) against white in light mode, RGB(238,238,238) against RGB(9,16,24) in dark mode.
  Measured focus contrast against the surrounding Card is 19.03:1 light / 16.47:1 dark;
  minimum contrast against Tag fills is 15.58:1 light / 12.78:1 dark. No authored focus styling is introduced.
- Populated Dutch SSR returns HTTP 200 and all four named doubles Cards. The hydrated browser matrix has no page
  errors and sends no GraphQL mutations. Existing validation reads are not save/workflow verification.
- Visually inspected final native-Tag 820px dark and 1440px light captures: full synthetic long names wrap, statistics stay
  readable, and the surface matches the approved native-Card direction. Subsequent user approval is recorded below.
- Not run: actual screen-reader output, exhaustive hydration, mounted English/French switching, authenticated/save
  workflows, and operational saved/populated lineup records. Desktop CDK remains pointer-based; no new keyboard
  lineup-transfer mechanism is claimed. These limits are not passing checks.
- Reuse decision: keep direct PrimeNG Cards for this bounded repeated loop and the existing shared player row.
  Do not extract a wrapper merely to conceal utilities or expand this slice into singles/substitutes.
- Exceptions: none. No `[dt]`, `[pt]`, new host classes, styling substitutes, backend/translation changes, or
  dependency additions.
- User review correction on 2026-10-30: "Restore colors with native success/danger Tags".
  The initial neutral-text implementation removed useful win-rate color information; it is superseded.
  Restored native severity colors for slot, player, slot-pair and total-pair statistics at the unchanged 50% threshold.
  Existing three-locale tests now also assert success/danger severities including exactly 50%, no token overrides,
  and unchanged accessible descriptions/Tooltip behavior. All 153 tests, focused lint (41 existing warnings)
  and library build with 10 prerequisites pass again after formatting.
  User correction is not completion/commit approval.

  ```powershell
  node "$env:USERPROFILE\.copilot\session-state\75d66e17-09b6-43d4-aac7-8e73e0820c59\files\verify-dr017d-tags.cjs"
  ```

  Final browser matrix rechecks 820/1280/1440px in both themes, all four scoped statistic categories,
  25%/0%/50%/75%, long names, no overflow, named regions, focus/Tab/hover Tooltips, Escape dismissal,
  and unchanged 390px mobile selectors. SSR is HTTP 200 with rendered native severity Tags;
  live baseline values are unchanged and there are no page errors or GraphQL mutations.
  Earlier actual drag/form evidence remains applicable; no CDK bindings changed in the correction.
  Initial Tag contrast measurement wrongly treated translucent dark fills as opaque, causing a helper assertion.
  Correct alpha compositing against ancestor backgrounds passes; this was not an application failure.
  The helper is removed after checking. Final `DR-017d-tags-*` captures/results supersede neutral-statistic captures.

- Existing NG01354 child-control warnings and native Checkbox/Button contrast remain outside this slice,
  recorded in the parent and DR-032; do not silently fix shared/theme behavior.
- User approval on 2026-10-30: "Approve completion and commit with the disclosed verification limits".
  This authorizes completion and a commit containing only DR-017d implementation, tests and repository handoff.
  No push is authorized. The user accepted the recorded screen-reader, exhaustive hydration, mounted English/French,
  authenticated/save and operational populated-record verification limits. Those criteria remain unchecked;
  approval is not evidence that unperformed checks passed.
- Post-approval pre-commit validation:

  ```powershell
  npx nx run-many --target=lint --output-style=static
  ```

  Repository-wide lint passes across all 34 projects with existing warnings and no errors.
  Final formatting and whitespace checks pass. Only this approved slice and its handoff are staged.

- Next candidate in a fresh invocation: confirm/scope one mounted desktop singles-slot child, excluding completed rows,
  pool and doubles. Do not start it during this invocation. DR-017 remains open.
