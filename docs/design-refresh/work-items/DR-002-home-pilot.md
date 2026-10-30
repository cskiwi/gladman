---
title: 'DR-002: Home page pilot'
description: 'A bounded PrimeNG-first redesign of the home ranking reference page.'
---

## Identity and outcome

- ID: DR-002; authoritative status: [backlog](../backlog.md); owner unassigned.
- Dependency: [DR-001](DR-001-design-baseline.md).
- Route: `/`; Nx project: `frontend-pages-home`; application integration: `app`.
- Outcome: establish the approved ranking-reference layout with native PrimeNG components and preserve page behavior.
- Rules: [design refresh plan](../README.md).

## Scope

- Homepage heading, ranking-system identity and metadata, level-reference table, loading and feedback states, and the
  authenticated player's ranking section.
- Preserve ranking calculations, null/zero handling, localization, authentication, selection updates, and responsive
  access to all table columns.
- Keep shared hero, ranking-progress, shell, and theme behavior outside this page slice.

## Implementation

- The reference table uses native `p-card` and scrollable `p-table` with the approved page-local row treatment.
- Loading and feedback use native PrimeNG components; the authenticated ranking section retains its existing condition.
- No new dependency, shared-component change, theme-preset change, or styling exception was introduced.

## Acceptance and verification

- [x] Native PrimeNG table, card, skeleton, and feedback components cover the page UI.
- [x] Ranking data order, translated headings, null placeholders, zero values, selection updates, and authentication
  conditions are preserved.
- [x] Loading, no-selection, empty, failure, and recovery states pass focused tests and safe browser fixtures.
- [x] Narrow and wide layouts retain table access without page-level horizontal overflow in light and dark themes.
- [x] The final page layout was visually approved with the shared heading and shell direction.
- [x] No unrelated shared behavior, dependencies, or styling exceptions were introduced.
- [x] Focused Nx tests, lint, and package build checks pass; browser and SSR evidence is recorded below.

## Evidence and handoff

- **Passed:** `NX_DAEMON=false npm exec nx run frontend-pages-home:test -- --runInBand --output-style=static`;
  12 tests passed with no pending or skipped tests.
- **Passed:** `NX_DAEMON=false npm exec nx run frontend-pages-home:lint -- --output-style=static`.
- **Passed:** `NX_DAEMON=false npm exec nx build frontend-pages-home -- --configuration=development --output-style=static`;
  homepage compilation was fresh and nine prerequisite tasks used cache.
- Safe browser fixtures covered 390px and 1280px in light and dark themes, including loading, empty, no-selection,
  failure, recovery, alternate selected data, and table scrolling. No account or backend mutation was used.
- The approved shared-layout brief records the combined homepage/shell review, translation, and SSR/hydration checks.
  A new full application build and full SSR/hydration audit were not run in this slice.
- Reusable-pattern decision: use native PrimeNG page components and retain the established shared heading and shell.
- Exceptions: none. Remaining work: none.
