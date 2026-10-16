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
enough to plan the work; browser verification has not yet been done.

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

- [ ] Before evidence identifies theme, viewport, authentication state, and safe data/fixture assumptions.
- [ ] Semantic utilities and native component colors are verified in both themes, including readable contrast.
- [ ] The document theme class, preference persistence, and overlay behavior are understood.
- [ ] The custom dark palette and compensating overrides are recorded as constraints, not silently reset.
- [ ] DR-002 has a concrete native-component approach and a reproducible behavior/visual verification checklist.
- [ ] Any blocker is tracked with a scoped follow-up; no unsupported claim of successful verification is made.

## Evidence and handoff

- Browser baseline: not captured yet.
- Semantic color and contrast checks: not run yet.
- Utility/style baseline: not measured yet.
- Prerequisites discovered beyond this task: none recorded yet.
- Styling exceptions: none.
- Next proposed slice: [DR-002: Home page pilot](DR-002-home-pilot.md).

[app-config]: ../../../apps/app/config/app.config.ts
[preset]: ../../../apps/app/config/theme.preset.ts
[styles]: ../../../apps/app/src/styles.scss
[theme-styles]: ../../../apps/app/src/styles/theme.scss
[theme-service]: ../../../libs/frontend/modules/theme/src/theme.service.ts
[home]: ../../../libs/frontend/pages/home/src/pages/home
