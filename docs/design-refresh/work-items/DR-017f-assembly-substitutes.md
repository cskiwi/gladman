---
title: 'DR-017f: Assembly desktop substitutes'
description: 'Refresh the mounted desktop substitutes container without changing lineup behavior.'
---

## Identity and scope

- ID: DR-017f. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Dependency: DR-017b (Done).
- Design rules: [design refresh](../README.md). Project: `frontend-pages-competition`.
- Confirmed consumer on 2026-10-30: the supplied populated `/competition/assembly` URL mounts
  [AssemblyComponent](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.ts)
  through the [competition routes](../../../libs/frontend/pages/competition/src/lib.routes.ts).
  Isolated installed Chrome shows `substituteList`, Dutch heading `Invallers`, zero substitutes and eight pool players.
- Outcome: one native Card, localized named heading and explicit empty state.
- Preserve CDK ID/data/connections/predicate, enabled sorting, drop handler, duplicate/game-slot exclusions,
  pool copy/return, row/ranking display, local `subtitudes` form value, and localization.
- Exclude completed chrome/rows/pool/doubles/singles, mobile selectors, captain/add-player, summaries,
  generator, validation, partner table, shared/theme/backend/translation assets.

## Baseline and approach

- Initial worktree is clean. Isolated Chrome is used because the MCP browser profile is occupied;
  do not disturb the existing browser. Read-only scoped light/dark baseline captures are session-local:
  `DR-017f-before-light.png` and `DR-017f-before-dark.png`.
- Replace the dashed box and uppercase label with direct native Card/title markup, keeping CDK on an inner
  list with a layout-only empty-target height. Use existing `substitude` and `all.team.no-players` keys.
- Reuse the completed input-only player row unchanged. A single substitutes consumer does not warrant a
  new smart/presentational wrapper; styling remains in the native primitive and existing shared row.
- No token/PassThrough overrides, new row host classes, styles, dependencies or operational mutations.
- Baseline scoped authored class tokens: 18 (12 container, four label, two row).

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, baseline and independently reviewable scope.
- [x] Refresh only the substitutes container and preserve behavior.
- [x] Add focused localization, CDK and form regression coverage.
- [x] Record utility comparison, validation evidence, exceptions and accurate next action.

## Acceptance and verification

- [x] Native named Card, localized heading and explicit empty state without styling exceptions.
- [x] CDK contracts, sorting, duplicate/game-slot restrictions, pool copying/return and local forms preserved.
- [x] Empty/occupied/multiple substitutes, long names, ranks and existing warning Tooltips remain usable.
- [x] Real English/Dutch/French labels resolve in component tests.
- [x] Light/dark 820/1280/1440px layouts fit; unchanged 390px mobile selectors remain.
- [x] Keyboard/focus, accessible names, Tooltips and scoped text/icon contrast verified.
- [x] Relevant Nx test/lint/build, formatting and whitespace checks pass.
- [x] Populated Dutch route SSR and hydrated local interaction verified.
- [ ] Actual screen-reader output, exhaustive hydration, mounted English/French and authenticated/save workflows.
- [ ] Quantitative native focus-ring painted-area/contrast and Tooltip text contrast measurement.
- [x] User visual review or explicit completion approval recorded.

## Evidence and handoff

- Baseline: installed PrimeNG 22.1.2 Card declarations confirm the native `#title` template API.
- Changed scope: only the desktop substitutes block in
  [the assembly template](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html),
  [10 focused tests](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly-substitutes.component.spec.ts)
  and this repository handoff. A comparison against HEAD confirms the template before the substitutes comment
  and from the game-grid closing tags onward is byte-for-byte unchanged.
- No production TypeScript, shared component, theme, stylesheet, translation asset, service, route or dependency
  changes. No new permission/action/disabled contracts. Existing loading/unloaded gates and mobile Selects
  remain covered by tests. Existing pointer-only desktop CDK behavior is preserved, not made keyboard draggable;
  unchanged mobile Selects remain the selection alternative.
- Native Card exposes the localized h3 heading as its region name. The inner list retains `substituteList`,
  data/connections/predicate/drop handler and default enabled sorting. Existing row inputs/ranks/drag data
  are unchanged. No smart/presentational extraction is warranted beyond reusing the completed player row.
- Authored scoped class tokens drop from 18 to 12. Necessary full-grid span, heading, spacing, wrapping inherited
  from the row and empty-target minimum height remain. No styling exceptions or overrides are introduced.
- Validation after formatting:

  ```powershell
  npx nx run-many -t test,lint,build -p frontend-pages-competition --output-style=static
  npx nx run-many -t test,lint -p frontend-pages-competition --output-style=static
  git diff --check
  ```

  The first run passes lint/build and 10 prerequisite builds; new tests initially fail on incorrect array-identity
  assumptions. Existing sorting clones arrays and reorders the pool. Tests are corrected to compare form contents
  and pool membership, preserving that behavior rather than changing production logic.
  Final run passes all 175 tests in 10 suites, including 10 new tests; lint has 41 existing warnings, no errors.
  The production template is unchanged since the passing build. No full app build is claimed.
  Tests cover three locales, CDK contracts, copy/return, sorting, duplicates, singles/doubles exclusions,
  unrestricted substitute capacity/gender, slot transfers, form array/scalar shapes, row ranks/warnings and gates.

- Browser verification uses installed Playwright and isolated installed Chrome, not the occupied MCP profile:

  ```powershell
  node "$env:USERPROFILE\.copilot\session-state\0b0c0f0f-4470-4edf-8796-85b67f00ba2c\files\verify-dr017f.cjs"
  ```

  The ad-hoc helpers are removed after checking; results and captures remain session-local, not repository
  deliverables. Final verification passes all six 820/1280/1440px theme combinations in empty and synthetic
  multiple-substitute states. Long names wrap, mixed-event ranks remain visible, and the named Card/list/document
  have no horizontal overflow. Inspected 820px light and 1440px dark screenshots show native warning focus rings.
  The unchanged 390px branch retains 13 Selects and no desktop rows/Cards in both themes.

- Warning Tags retain accessible names and hover/focus Tooltips matching those names. Escape dismisses the
  Tooltip; Tab reaches the next warning. Native `:focus-visible` is true in all desktop/theme combinations,
  with automatic outline colors RGB(16,16,16) / RGB(238,238,238). Painted area and quantitative focus contrast
  remain unchecked. Actual screen-reader output and Tooltip text contrast are not claimed.
- Actual computed colors converted to sRGB via browser canvas give minimum scoped text contrast
  19.87:1 light / 16.00:1 dark and warning icon contrast 4.52:1 / 9.36:1 against the Tag fill.
  The measurement helper initially treated the dark translucent Tag fill as opaque; compositing it over the
  actual Card background resolves that harness error without changing application code.
- A real pointer pool-to-substitutes copy preserves all eight pool players and updates the local form array.
  Pointer return restores the empty state/form without duplicating the pool. Component tests additionally verify
  multiple substitutes, within-list reorder and transfer to singles/doubles. No operational records are changed.
  Dutch route SSR responds HTTP 200 with the localized named Card. The live baseline has zero substitutes;
  occupied/multiple states use browser-local synthetic data, not saved records.
  Browser checks report no page errors or GraphQL mutations; mutation requests are guarded against.
- Exceptions: none. Existing French `substitude` copy is preserved as-is; translation editing is outside this slice.
- User review on 2026-10-30: the user selected "Approve completion and commit with the disclosed verification limits".
  This authorizes only DR-017f implementation, tests and repository handoff; no push.
  Screen-reader output, exhaustive hydration, mounted English/French, authenticated/save workflows, quantitative
  focus-ring checks and Tooltip contrast measurement remain unchecked. Approval is not evidence that they passed.
  No visual or workflow validation is inferred from the build.
- Post-approval required validation:

  ```powershell
  npx nx run-many --target=lint --output-style=static
  ```

  All 34 projects pass with existing warnings, no errors. No production changes follow approval.
  The final handoff is formatted and `git diff --check` passes.

- Exact next action in a fresh invocation: confirm/scope one mounted generation-controls child.
  DR-017 stays open. Do not start another child here or reopen completed children.
