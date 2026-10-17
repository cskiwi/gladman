---
title: 'DR-006d: Player recent-game heading and filters'
description: 'Semantic heading and accessible native filters for mounted player recent games.'
---

## Identity

- ID: DR-006d; parent DR-006 remains open. Authoritative status: [backlog](../backlog.md).
- Dependencies: completed DR-006a, DR-006b, and DR-006c. Rules: [design refresh](../README.md).

## Scope

- Project: `frontend-components`; existing mounted `/players/:playerId` recent-games heading and filter group only.
- Source: [template][template] and [existing tests][tests]. The player dispatcher is the production consumer.
- Preserve translated labels/counts, single non-empty selection, filtered games, and visibility while loading/empty.
- Exclude cards, scores/results/points, services, pagination, breakpoint logic, skeletons, global styles, and APIs.
- No dependencies, custom CSS, or new wrapper components.

## Baseline and proposed approach

- Clean worktree on 2026-10-17. Shared player route has ten real games and four native filter buttons.
- Heading is an eyebrow span inside two flex wrappers; native `role="group"` has no accessible name.
- Replace the decorative header with a semantic heading, retain native SelectButton and use documented compact sizing.
- Name the native group using the existing translated title; retain option labels and counts without new locale keys.
- Hypothesis: template-only heading/label/size changes preserve the existing selection and rendering contract.
- Cheap falsification: existing component tests plus heading/group-name assertions and native selection/empty tests.
- Baseline: heading has two wrappers and eleven utility tokens including legacy `t-eyebrow`;
  filter has a five-utility wrapper. Record the final comparison after verification.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, clean worktree, and bounded scope.
- [x] Simplify heading and name/size the native filter without changing behavior.
- [x] Verify focused selection/visibility tests and existing indicator tests.
- [x] Record utility comparison, browser evidence, and any out-of-scope discoveries.

## Acceptance and verification

- [x] Semantic heading and translated accessible group name render.
- [x] All four options/counts and non-empty selection preserve local filtering.
- [x] Loading/empty visibility and filtered-empty state remain usable in focused tests.
- [x] Light/dark at 390px/1280px: heading and all filter labels fit; computed contrast passes.
- [ ] Actual keyboard option navigation/activation passes; direct focus alone is not sufficient.
- [x] Relevant SSR output retains heading, group name, and options.
- [x] Focused Nx tests and library lint/build pass; no new colors, SCSS, dependencies, or global changes.
- [x] User explicitly approved completion on 2026-10-17 with the disclosed verification limits retained.

## Evidence and handoff

- Baseline mounted DOM: `/players/glenn-latomme`, dark, 1487x1252, ten articles; labels
  `Alle · 528`, `Enkel · 178`, `Dubbel · 268`, `Gemengd · 82`; group has no accessible name.
- Final presentation: `h2` uses existing translated title and a player-specific ID, linked through native
  `ariaLabelledBy`. Native `size="small"` and `flex-wrap` preserve readable option counts at narrow widths.
  Documented native item templating supplies `text-color` for each label after the default foreground failed
  light-mode contrast. This is a semantic utility, not a custom color, stylesheet, or global override.
- Utility comparison: remove both heading wrappers and the filter wrapper (three elements); heading utilities
  drop from eleven tokens to four. Filter layout drops from five tokens to two (`mb-4 flex-wrap`). The native
  item template adds one semantic text utility on its label span for the measured contrast requirement.
- Passed commands on 2026-10-17:

  ```bash
  NX_DAEMON=false npm exec -- nx show project frontend-components --json
  NX_DAEMON=false npm exec -- nx run frontend-components:test --runInBand --testPathPatterns=recent-games-player.component.spec.ts --output-style=static
  NX_DAEMON=false npm exec -- nx run-many --targets=lint,build --projects=frontend-components --output-style=static
  NX_DAEMON=false npm exec -- nx run frontend-components:build --output-style=static
  ```

- Final focused tests: 24 pass, including all 15 retained indicator cases and nine new heading, native selection,
  count-label, filtered-empty, initial-empty, and loading-visibility cases. Services are mocked; no test network calls.
  Initial four interaction failures came from clicking before NgModel initialization settled; waiting for initial
  fixture stability fixes them without application logic changes.
- Library lint: zero errors and 32 existing warnings. Final standalone library build passes with eight cached
  prerequisite tasks. Existing Nx executor/ts-jest warnings remain. Template/test editor diagnostics are clear.
- Failed command (not a source failure): combining `test,lint,build` with Jest flags forwarded `runInBand` to build,
  which reported `'runInBand' is not found in schema`. Tests/lint passed in that run; standalone build above passes.
  Keep Jest-only flags on the test target in future invocations.
- Final mounted geometry: 390px and 1280px in both themes, no horizontal page overflow; heading and all four option
  labels fit. Group is 347px wide/two rows (62px high) on mobile, about 391px/one row (31px high) on desktop.
  Before normal-size desktop width was about 430px. This does not validate the deferred responsive pagination issue.
- Contrast: initial native inactive light labels measured 4.46:1 and failed. Final semantic labels measure
  18.2:1 inactive / 19.87:1 selected in light, 16:1 inactive / 13.78:1 selected in dark, at both viewport widths.
  Measurements convert computed colors using browser-memory canvas and composite settled ancestor backgrounds.
- Mounted programmatic native clicks select singles/doubles/mixed and show 3/5/2 loaded games respectively;
  return to All restores ten. All four selection values, repeated selection, and empty cases also pass unit tests.
  No service query, pagination, calculation, result/score/point presentation, or data contract changed.
- Keyboard limit: direct focus reaches each option with `:focus-visible`; first option showed a 1px solid outline.
  Tab, ArrowRight/Space, and directly targeted Enter attempts did not change selection in this hidden integrated
  browser. Cause is unresolved; do not call this a keyboard pass or assume a confirmed application regression.
  Manually verify native selection on the actual browser before approval, or explicitly accept the coverage limit.
- Screenshot limit: baseline selector capture timed out on stability. Final dark-desktop selector capture showed
  unrelated app chrome rather than the filter, despite correct measured DOM bounds. No visual/pixel pass is claimed;
  mobile/light screenshot verification was not completed. Review actual light/dark desktop/mobile presentation.
- Final SSR after item-template change: read-only HTTP 200, translated heading, matching group/heading ID, and four
  semantic option labels. No exhaustive hydration, authenticated SSR, alternate-locale, or screen-reader audit.
- Browser restored: `/players/glenn-latomme`, dark class, 1487x1252, ten articles, All selected. No fixtures, saved
  preference writes, account operations, or backend mutations; local server already runs at `http://localhost:3000`.
- Discovery recorded in backlog: check native inactive SelectButton contrast in other mounted consumers only when
  separately scoped. Reusable decision: use native item templates and semantic text for local contrast requirements.
- Exceptions: none.
- Review outcome: user requested "Approved, commit" on 2026-10-17 after the screenshot and keyboard-selection
  limits were disclosed. This explicitly accepts completion with those limits; it is not evidence of a successful
  pixel or keyboard-selection check. That unchecked verification item remains visible above.
- Exact next action: scope mounted initial/loading-more skeletons as a separate child, preserving services and
  pagination. Existing `g-card` markup remains untouched. Parent DR-006 stays open; no second slice was started.
- Commit explicitly requested by the user; include the implementation, tests, and repository handoff together.

[template]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.html
[tests]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.spec.ts