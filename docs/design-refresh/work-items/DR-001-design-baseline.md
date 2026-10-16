---
title: 'DR-001: Design baseline'
description: 'Verify theme semantics and define a safe baseline before implementing the first redesign slice.'
---

## Identity and outcome

- ID: DR-001.
- Status and owner tracking: [backlog](../backlog.md); owner unassigned.
- Dependencies: none.
- Outcome: a verified baseline and concrete acceptance checks for the home page pilot.
- Rules: [design refresh plan](../README.md).

This is an investigation/documentation slice, not a global theme rewrite. The existing source inventory is complete
enough to plan the work. Browser verification was completed on 2026-10-16 without changing application code.

## Scope

- [PrimeNG configuration][app-config] and [the Aura-derived preset][preset].
- [Global styles][styles], [additional theme styles][theme-styles], and [theme switching][theme-service].
- [Home page][home] and the shared components it currently uses.
- Anonymous/authenticated behavior and narrow/wide views needed to prepare DR-002.

Do not change the surface palette, shared component APIs, navigation, theme persistence, or feature behavior. Do not
upgrade packages or remove global CSS in this task.

## Work

1. Capture the home page's current light/dark appearance at representative mobile and desktop widths. Record the
   viewport sizes and use safe, reproducible test data.
2. Capture anonymous and authenticated states, loading, failure, no ranking-system data, and a loaded ranking table.
   Distinguish states supported by the application from states requiring a test fixture.
3. Verify that semantic text, border, emphasis, primary, and highlight utilities resolve as expected. Check computed
   colors and contrast in both modes rather than relying on class names.
4. Verify `.dark-theme` alignment between PrimeNG, theme switching, and any Tailwind dark variants still in use. Check a
   native popup as well as page content; overlays are appended to the document body.
5. Document the current inverted dark surface scale and compensating component overrides. Identify styling the pilot can
   avoid without changing global behavior.
6. Record baseline template utility usage, custom stylesheet dependencies, and the native PrimeNG replacements for
   DR-002.
7. Update the pilot brief with actual evidence, specific checks, and any genuine prerequisite. If theme integration
   blocks the pilot, add a small explicit prerequisite instead of broadening this into a theme rewrite.

## Acceptance

- [x] Before evidence identifies theme, viewport, authentication state, and safe data/fixture assumptions.
- [x] Semantic utilities and native component colors are verified in both themes, including readable contrast.
- [x] The document theme class, preference persistence, and overlay behavior are understood.
- [x] The custom dark palette and compensating overrides are recorded as constraints, not silently reset.
- [x] DR-002 has a concrete native-component approach and a reproducible behavior/visual verification checklist.
- [x] Any blocker is tracked with a scoped follow-up; no unsupported claim of successful verification is made.

## Evidence and handoff

- Browser baseline: captured from the running app at 1280x900 and 390x844 on 2026-10-16 using the anonymous,
  loaded BBF Rating data. Both light and dark full-page captures were taken. The wide layout had no horizontal
  overflow; the narrow layout moved the shell search to a second row and kept all table columns reachable without
  page-level overflow. The level table rendered ascending levels 1 through 12, preserved numeric zero if present in
  data, and rendered null thresholds as an em dash in the observed safe fixture.
- Authentication and state coverage: anonymous content was verified with the login action visible and no player
  ranking strip. The authenticated strip is gated by `user()?.id` and was not forced with a real account. The loaded
  success state was verified. Loading and error are supported by `HomeService` and the template, but were not forced
  against live data. No-ranking-system data would leave the page without an explicit empty message when not loading or
  errored; DR-002 must cover that state with a safe fixture and should add focused behavior tests. An error can render
  alongside previously loaded content because the error signal is independent of the ranking signal.
- Semantic color and contrast checks: computed values were inspected in both themes. Light mode resolved text to
  `oklch(0.14 0.02 250)`, muted text to `oklch(0.55 0.015 250)`, borders to
  `oklch(0.93 0.008 250)`, primary to `oklch(0.58 0.17 210)`, and highlight to
  `oklch(0.58 0.17 210 / 0.12)`. Dark mode resolved text to `oklch(0.94 0.005 250)`, muted text to
  `oklch(0.68 0.012 250)`, borders to `oklch(0.24 0.025 250)`, primary to `oklch(0.78 0.15 210)`, and
  highlight to `oklch(0.78 0.15 210 / 0.16)`. Heading, table header, table cell, and muted text remained readable in
  both visual checks; no authored color was changed by this slice.
- Theme integration: `ThemeService` applies `light-theme` or `dark-theme` and `data-theme` to the document root and
  persists `gladman:theme` in a one-year cookie. Toggling to light persisted through a reload. PrimeNG uses
  `.dark-theme` through `darkModeSelector`. The global autocomplete popup was appended below `body` and resolved to
  the light content surface in light mode and `oklch(0.17 0.02 250)` with light text in dark mode.
- Dark-palette constraint: the preset intentionally inverts the dark surface scale (`surface.0` is dark and
  `surface.950` is light) so existing surface utilities retain their intended direction. Form fields, select/popover/
  modal overlays, list and navigation items, secondary button variants, data-table rows, and toggle buttons contain
  compensating dark overrides. The pilot should use semantic utilities and native components rather than introducing
  additional palette classes or changing this global contract.
- Utility/style baseline: the home template currently contains 22 class-bearing elements, including `t-eyebrow`,
  `t-mono`, semantic surface/border utilities, layout utilities, arbitrary values, and two authored palette pairs
  (`text-green-600 dark:text-green-400` and `text-red-600 dark:text-red-400`). The page stylesheet contains a host
  flex/gap rule and a gradient `.rank-number` rule that is not referenced by the current template. DR-002 may remove
  only the proven-unused rule and should replace page-level table/feedback decoration with native PrimeNG behavior.
- DR-002 approach: use native `p-table` templates for the reference data, `p-message` for failure feedback, and a
  native progress or skeleton component for loading. Keep semantic headings, ranking metadata, the existing
  authenticated ranking-progress component, translated labels, sort order, null placeholders, and numeric zero.
- Validation: `npx nx lint frontend-pages-home app`, `npx nx test frontend-pages-home --runInBand`, and
  `npx nx build app --configuration=development` each reported one successful Nx task. Their wrappers remained alive
  after reporting success and were stopped explicitly; no task failure was reported. Browser console showed zero errors
  and one existing warning on route loads.
- Styling exceptions: none introduced. The existing page/global styles and palette remain unchanged.
- Next slice: [DR-002: Home page pilot](DR-002-home-pilot.md), with focused fixtures/tests for authenticated,
  loading, error, and no-ranking-system states.

[app-config]: ../../../apps/app/config/app.config.ts
[preset]: ../../../apps/app/config/theme.preset.ts
[styles]: ../../../apps/app/src/styles.scss
[theme-styles]: ../../../apps/app/src/styles/theme.scss
[theme-service]: ../../../libs/frontend/modules/theme/src/theme.service.ts
[home]: ../../../libs/frontend/pages/home/src/pages/home
