---
title: 'DR-017e: Assembly desktop singles slots'
description: 'Refresh the four mounted desktop singles containers while preserving lineup behavior.'
---

## Identity and scope

- ID: DR-017e. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Dependencies: DR-017b and DR-017d (Done).
- Design rules: [design refresh](../README.md). Project: `frontend-pages-competition`.
- Confirmed consumer on 2026-10-30: the supplied populated `/competition/assembly` URL mounts
  [AssemblyComponent](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.ts)
  through the page and competition routes. Isolated Chrome shows `single1` through `single4`, initially empty,
  with slot statistics 1/3, 2/3, 1/3, 1/3.
- Outcome: native Cards, localized named headings/empty states, and accessible success/danger statistic Tags.
- Preserve CDK IDs/data/connections/predicates/sorting/drop handler, one-player capacity, singles duplication and
  mixed-gender restrictions, row/ranking display, statistics, pool copy/return, local forms, and localization.
- Exclude completed rows/pool/chrome/doubles, substitutes, mobile selectors, captain/add-player, summaries,
  generator, validation, partner table, shared/theme/backend/translation assets.

## Baseline and approach

- Clean initial worktree. Read-only 1440px light/dark baseline captured with isolated installed Chrome because
  the MCP browser profile is occupied. No operational mutations.
- Session-local evidence: `DR-017e-before-light.png` and `DR-017e-before-dark.png`; do not commit live-data captures.
- Replace only the singles loop's dashed boxes, uppercase labels and palette statistics with the completed
  doubles pattern: native Card, h3 heading, named region, native Tags and hover/focus Tooltips.
- Keep CDK on the inner content list, with a layout-only empty drop-target height and existing localized empty copy.
- Reuse the existing presentational player row unchanged. Direct PrimeNG in one repeated loop is simpler than
  extracting a new wrapper or expanding the already completed doubles scope for a smart/presentational split.
- No token/PassThrough overrides, host classes, SCSS, inline/global styling workarounds, dependencies or mutations.
- Authored singles-loop class tokens drop from 29 to 21; two dynamic red/green palette bindings are removed.
  Necessary wrapping, spacing and minimum-height layout remain; no class-count target is imposed.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, baseline and independently reviewable scope.
- [x] Refresh only singles containers while preserving CDK, rows, statistics and forms.
- [x] Add focused behavior/localization/accessible-statistic coverage.
- [x] Record utility comparison, validation evidence, exceptions and accurate next action.

## Acceptance and verification

- [x] Four named native Cards with localized headings and explicit empty states; no styling exceptions.
- [x] Unchanged CDK bindings, capacity/duplicate/mixed rules, pool copying, slot transfer/return and local forms.
- [x] Empty/occupied slots, missing/present statistics, 50% severity boundary and long names remain readable.
- [x] Real English/Dutch/French labels and descriptions resolve in component tests.
- [x] Light/dark 820/1280/1440px layouts fit; unchanged 390px mobile branch retains its Selects.
- [x] Keyboard access, visible native focus, hover/focus Tooltips, Escape, names and text/tooltip contrast verified.
- [x] Relevant Nx test/lint/build, formatting and whitespace checks pass.
- [x] Populated Dutch SSR and hydrated local interaction verified.
- [ ] Actual screen-reader output, exhaustive hydration, mounted English/French and authenticated/save workflows.
- [ ] Quantitative native focus-ring painted-area/contrast verification.
- [x] User visual review or explicit completion approval recorded.

## Evidence and handoff

- Changed scope: only the desktop singles loop in
  [the assembly template](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html),
  [12 focused tests](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly-singles-slots.component.spec.ts)
  and this repository handoff. A comparison against HEAD confirms the template before the singles comment and
  from the following Divider onward are byte-for-byte unchanged.
- No production TypeScript, service, route, shared component, theme, stylesheet, translation asset or dependency
  changes. No disabled/permission/action contracts are added or changed by the singles display.
  The existing loading branch and unchanged mobile selectors are covered by tests.
- Native Cards expose localized h3 headings and named regions. Inner CDK lists retain IDs, data, connections,
  entry predicate, sorting and drop handler. Rows/ranks are reused unchanged, with explicit localized empty copy.
  Native success/danger Tags retain the >=50% threshold, wins/totals and player percentages; localized
  descriptions are exposed as accessible names and hover/focus Tooltips. No new abstraction is warranted.
- Validation after formatting:

  ```powershell
  npx nx run-many -t test,lint,build -p frontend-pages-competition --output-style=static
  git diff --check
  ```

  All 165 tests in nine suites pass, including 12 new tests. Focused lint passes with the same 41 existing warnings,
  zero errors. The library build and 10 prerequisites pass. No full app build or repository-wide validation is claimed.
  The component tests cover M/F/MX naming in English/Dutch/French, all four CDK contracts, scalar singles form values,
  pool copy/return, slot transfer, substitute removal, duplicate/capacity/gender rules, ranks, missing/present
  statistics, the 50% threshold, Tooltip configuration, mobile selectors and loading.

- Browser verification uses installed Playwright and isolated installed Chrome, not the occupied MCP profile:

  ```powershell
  node "$env:USERPROFILE\.copilot\session-state\2e76c98e-6b56-4f79-86a5-c10cdab97789\files\verify-dr017e.cjs"
  ```

  The ad-hoc helper is removed after checking. Results/captures remain session-local, not repository deliverables.
  The first helper attempt encountered pre-hydration SSR markup before Angular exposed its component;
  waiting for the actual hydrated loaded component resolved the harness issue. No application change was needed.
  Final verification passes all six 820/1280/1440px theme combinations, with four named regions and no
  scoped/container/document overflow. Browser-local synthetic data covers occupied/empty slots, long names,
  missing/present statistics and both severities. No operational records are changed.
  The unchanged 390px branch retains 13 Selects, no desktop Cards and no player rows in both themes.

- Keyboard verification in every desktop/theme combination passes focus/hover Tooltip text matching the accessible
  name, Escape dismissal and Tab to the next statistic. Captures wait for the Tooltip transition to finish.
  Native automatic focus rings are visible in inspected 820px light and 1440px dark screenshots, with computed
  outline colors RGB(16,16,16) / RGB(238,238,238). Painted area and quantitative focus contrast remain unchecked.
- Actual computed colors converted to sRGB via browser canvas give minimum scoped plain-text contrast
  19.87:1 light / 16.00:1 dark, Tag text 4.57:1 light / 10.07:1 dark, and stable Tooltip text
  13.61:1 light / 9.95:1 dark. These measurements do not establish unrelated-page or focus-ring compliance.
- A real pointer pool-to-single copy preserves all eight pool players and updates the scalar local form.
  Pointer return empties the slot and sets its form value to null. Component tests additionally verify transfer
  between singles and invocation of validation. Dutch SSR responds HTTP 200 with all four named singles Cards.
  Browser checks report no page errors or GraphQL mutations; mutation requests are guarded against.
- Live baseline and refreshed slot statistics remain 1/3, 2/3, 1/3, 1/3 before synthetic state is introduced.
  Live-data screenshots remain outside the repository. Visual inspection confirms wrapped names, native surfaces
  and readable stable Tooltips; user review is still required.
- No new exceptions or unrelated discoveries. Previously recorded parent functional follow-ups remain separate.
- On 2026-10-30 the user selected "Approve completion and commit with the disclosed verification limits"
  and "Nothing else". This approves completion and a commit containing only DR-017e implementation, tests and
  repository handoff, without pushing. No workflow changes are included.
- Accepted limits remain unchecked above: actual screen-reader output, exhaustive hydration, mounted English/French,
  authenticated/save workflows and quantitative native focus-ring painted-area/contrast verification.
  Approval is not evidence that these unperformed checks passed.
- DR-017e is Done in the authoritative backlog. No further production changes follow approval.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects with
  existing warnings and no errors. Final formatting and whitespace checks pass for all five changed files;
  92 inline local handoff links resolve. Documentation-only approval updates need no application task rerun.
- After completion, the next candidate is one confirmed mounted desktop substitute-container child, not started here.
- DR-017 remains open; do not begin substitutes or another child in this invocation.
