---
title: 'DR-019a: Tournament complete hero parity'
description: 'Competition-detail presentation for the complete mounted tournament hero, corrected after user review.'
---

## Identity

- ID: DR-019a. Parent: [DR-019](DR-019-tournament-browsing.md). Status: [backlog](../backlog.md).
- Dependencies: approved shared hero direction, DR-004. No blockers at selection.
- Design rules: [refresh plan](../README.md).

## Scope

- Exact route: `/tournament/8658b541-702a-408e-8114-2858a9428069`.
- Confirmed real consumer: loaded Internationaal Tornooi Lokerse BC 2023 in the integrated browser, 2026-10-31.
- Project: `frontend-pages-tournament`.
- Sources: [template](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.html),
  [component](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.ts),
  [styles](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.scss).
- Preserve initials, exact title, number, conditional location, comma-split dates and localized official/no text.
- Include all hero summaries and action presentation following the user's rejected identity-only review.
- Preserve totals, registration dates, phase meaning, enrollment/admin routes, sync controls and permission gates.
- Exclude live links, events/draws, loading/error, club browsing, business logic and all mutations.
- Reuse existing shared hero avatar/title without changing them; direct PrimeNG Tags and external Button.
- No new component extraction: the shared presentational components already separate reusable styling from page data.
- DR-019b is a reserved historical ID whose summaries/actions scope is absorbed into this same review slice.
  It is not another required child or a candidate for later implementation.

## Baseline and approach

- Dark 390px screenshot inspected: 88px gradient parallelogram crest, oversized custom heading and tiny custom badge.
- Loaded metadata: `IT`, `#BV_2022-2023_W17_1`, 29/30 Apr and 1 May 2023, localized official label.
- Page fits 390px before changes; hero shows 30 sub-events, 95 draws and DRAFT phase.
- Replace crest/title with existing responsive circular Avatar and wrapping heading.
- Replace manual status background/text class bindings with native success/secondary Tag.
- Use the competition's complete summary markup: normal-case muted labels, tabular counts, stacked type-count
  description, text dates and phase, identical grid/divider spacing.
- Render tournament dates as the competition's emphasized calendar metadata, with commas in the same text flow;
  use a native secondary number Tag and official Tag.
- Replace the custom external anchor appearance with the competition's native small secondary text Button.
  Its destination and blank-target security attributes stay unchanged; add the same contextual accessible name.
- Localize previously English summaries in tournament-specific English/Dutch/French keys.
  Reuse existing phase translations for all seven phases; missing phase uses existing localized Unknown.
- Remove only now-unused hero crest/title/metric and status-color SCSS. Live/event/feedback styles remain unchanged.
- Plain localized phase text replaces the custom colored uppercase badge intentionally, matching competition summary
  text. The enrollment-open action and all phase-dependent behavior remain unchanged.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and one independently reviewable slice.
- [x] Preserve data, routes and permission gates; localize previously literal summary/phase copy.
- [x] Reuse shared hero avatar/title and native Tag without changing shared consumers.
- [x] Match complete summary and action presentation to the competition reference.
- [x] Remove only hero-specific unused markup/styles.
- [x] Record adjacent discoveries as DR-019c-f, not production comments.

## Acceptance and verification

- [x] Native circular Avatar, wrapping h1 and success/secondary Tag render with preserved copy.
- [x] Whole-hero utilities are simplified; no new palette utilities, SCSS or inline-style workaround.
- [x] Complete heroes match typography/layout in light/dark at 390/1440px; metadata and adjacent content remain.
- [x] Decorative icons are hidden from assistive technology; headings/status text and contrast are checked.
- [x] Optional metadata, official/no and existing permission gates have focused regression coverage.
- [x] Zero/one/multiple event-type totals, registration dates and all seven localized phases have regressions.
- [x] Relevant Nx lint/build/test pass with commands/results recorded.
- [x] Real localized loaded SSR and client rendering are checked.
- [x] User approved the corrected whole hero and completion with the disclosed limits below.
- [ ] Actual screen-reader output is verified.
- [ ] Authenticated mounted workflows are verified, beyond component gate tests.
- [ ] Mounted English/French layouts are verified, beyond real translation-asset tests.
- [ ] Quantitative focus-ring contrast and exhaustive hydration checks are complete.

## Evidence and handoff

- Current outcome: complete hero parity, not merely identity parity. The final paired matrix compares actual Card,
  Avatar, h1, metadata, summary grid, label/count classes and computed font size/weight/line height/letter spacing/
  case, plus native external Button presentation. All comparisons pass at both widths in both themes.
- Eight paired screenshots were inspected:
  `DR-019a-parity-{tournament,competition}-{390,1440}-{light,dark}.png` in session files.
  Keyboard-focus screenshots use `DR-019a-parity-focus-{390,1440}-{light,dark}.png`.
  No screenshots/logs are committed; the observations here are the persistent handoff.
- Loaded Dutch tournament summaries show Reeksen 30, over 3 types, existing draw label Reeks 95,
  Inschrijving -, Fase Concept. Existing draw translation is preserved, not silently changed to competition's Poules.
  Dates remain 29 Apr/30 Apr/1 May 2023; all four live links remain outside the hero.
- Existing my-enrollments to external-link Tab order passes; explicit `:focus-visible` and an actual spread
  of at least 1.99px confirm the 2px focus ring after its transition, not just focus ownership.
- Four loaded Dutch SSR responses are HTTP 200 with matching h1 and localized summaries; fresh clients load
  identically. Eight paired pages have zero page errors, zero mutations, fitting page/hero bounds and zero
  legacy eyebrow/mono/metric/status-color classes within the hero.
- Utility comparison for the complete page-authored hero: 117 static class tokens before to 86 after;
  legacy custom tokens 11 to zero and arbitrary tokens four to zero.
  Shared component classes are unchanged, not moved or hidden.
- Translation assets and their automatically regenerated types are the only backend-adjacent changes.
  Port 5000 is back with HTTP 200. The user corrected the translation URL:
  `http://localhost:3000/api/v1/translate/i18n/nl_BE`, which serves the new summary keys.
- Changed text contrast passes after finite theme transitions finish. Initial in-transition native external
  samples were below 4.5:1; the fully settled competition reference is 4.87:1 light / 6.65:1 dark.
  A temporary semantic label-color correction was removed as unnecessary. The final external label uses
  exactly the native competition presentation, without an extra class, override or global change.
- User approval: "Approve corrected DR-019a and commit with disclosed limits".
  This authorizes completion and a commit containing only this slice, not a push.
  The unchecked screen-reader, authenticated mounted workflows, mounted English/French, quantitative focus-ring
  contrast and exhaustive hydration checks are accepted limits, not retroactively passed checks.
  Next action in a fresh invocation: scope DR-019c live-navigation presentation, not reserved DR-019b.
- Actual screen-reader, authenticated mounted workflows, mounted English/French, quantitative focus-ring
  contrast and exhaustive hydration remain unverified. Component tests cover localized copy and permitted gates.
- Exceptions: none.

## Initial identity-only review history

- Baseline: real Dutch route loaded anonymously; no operational/admin actions used.
- Playwright MCP navigation failed because its profile is in use; integrated browser succeeded without closing others.
- Initial evidence: four fresh isolated Chrome contexts at 390/1440px with actual `.dark-theme` on/off.
  Loaded title/IT/number/all three dates/official text remain; page and identity bounds fit in every case.
  Summary content remains 30 sub-events, 95 draws and DRAFT; four existing live links remain.
  Identity has no focusable elements or extra Tab stops; all decorative icons have `aria-hidden="true"`.
  Focus first existing hero action, then Tab reaches its existing toernooi.nl link in every case.
  Four read-only SSR requests return HTTP 200 with matching Dutch title, initials and official label.
  Fresh loaded client rendering matches, with zero page errors and zero GraphQL mutations.
- Four initial isolated hero screenshots were inspected: `DR-019a-after-{390,1440}-{light,dark}.png`
  in session files. No screenshots/logs are committed; the observations here are the persistent handoff.
  The integrated browser's background-page screenshot remained stale after theme changes and scrolling
  timed out, so it is not used as dark-mobile proof. An initial isolated screenshot raced hydration and
  detached; the final matrix waits for network idle and the loaded heading before sampling/capturing.
- User feedback: "Make sure it looks feels the same as the competition detail pages as this has a similar page".
  The real supplied competition route was compared at 390/1440px in light mode.
  Both use the exact shared Card, Avatar and h1 classes, and the same metadata class list.
  Both Avatars measure 56px at 390px; headings measure 26.25px there.
  Tournament number/dates replace competition season/type/location, without changing the shared composition.
  This proved only identity parity, which the user explicitly rejected as insufficient when switching routes.
  The response "If you switch beetween a competition and toernament detaill the hero card still looks very different"
  expanded this same review slice to complete hero parity, absorbing the proposed DR-019b scope.
- Utility comparison, page-authored hero identity only: static class tokens 42 to 18;
  utility tokens 33 to 12, excluding icon and legacy custom class names.
  Shared component classes are unchanged, not moved or hidden. Native Tag icon template preserves the
  shield with explicit decorative-icon hiding; its default icon did not supply `aria-hidden`.
  Initially removed only `.tournament-crest` and `.tournament-name`; review correction also removes the
  now-unused hero metric/status helpers. All non-hero SCSS consumers remain.
- Changed scope additionally includes
  [tests](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.spec.ts) and
  [test setup](../../../libs/frontend/pages/tournament/src/test-setup.ts).
  The previously testless project's zone-based setup required missing `zone.js`. Use the existing
  competition `setupZonelessTestEnv` pattern instead, retaining strict unknown-element/property checks.
  No dependency installation or manifest changes.
- No initial approval was recorded; this is not evidence that the full hero was accepted.

## Validation results

- `npx nx run frontend-pages-tournament:test --runInBand --output-style=static`:
  initial failure before tests because `zone.js` is absent. After zoneless setup, fixture assertions
  exposed the native icon's missing hiding and existing `p-button` RouterLinks, which are not anchors.
  Use the documented Tag icon template and inspect actual RouterLink URL trees; no action behavior is changed.
- `npx nx run-many -t test lint build -p frontend-pages-tournament --output-style=static`:
  final whole-hero run passes all 24 tests, lint with no warnings/errors, library production build and
  ten prerequisites. Existing build import warnings and Jest executor/metadata notices remain.
- Intermediate test failures are resolved: original assertions counted two icons after hiding the shield;
  new summary cases initially replaced the tournament signal instead of exercising route/resource updates,
  so computed totals/phase retained old dependencies. Fixtures now use real query responses and navigation.
  jsdom lacks ResizeObserver for the existing event Tabs; a local suite mock is restored after the suite.
  Registration tests inspect each rendered line rather than assuming DOM textContent inserts line breaks.
- `npx nx run-many -t test lint -p frontend-pages-tournament --output-style=static`:
  initial identity-only pass, twelve tests in one suite and lint with zero errors/warnings. Real English/Dutch/French
  translation assets cover both official/no; optional metadata, one-sided location, anonymous/permitted gates,
  existing URLs and adjacent summary/live content have focused regression coverage.
- `npx nx run frontend-pages-tournament:build --configuration=production --output-style=static`:
  passes with ten prerequisites. Existing ineffective-dynamic-import warnings remain; no dependency upgrade.
- `npx nx run backend-translate:lint --output-style=static`: pass.
- Post-approval `npx nx run-many --target=lint --output-style=static`: all 34 projects pass with
  existing warnings and zero errors. Only approval/handoff text changes after the focused application checks.
- Browser matrix: read-only local Chrome Playwright helper using existing `@playwright/test`,
  separate contexts, 390/1440x1000px, actual theme class, loaded/idle wait, element screenshots, Tab and SSR requests.
  This helper is temporary session tooling, not a new test dependency or repository script.
- Initial readiness probing used the wrong `/api/translate` path and failed, not an actual backend outage.
  The supplied `/api/v1/translate` endpoint is confirmed with native JSON.parse; PowerShell's case-insensitive
  JSON parser rejected existing `other`/`Other` keys and is not used as translation validation.
- The first paired assertion assumed the competition draw translation Poules; corrected to the actual existing
  tournament translation Reeks without changing source. Final matrix passes the actual output.
- Color sampling initially raced finite theme transitions. Final sampling waits for running finite animations
  to finish before reading computed colors; it does not treat an interrupted animation Promise as a page failure.
  The focus-ring check parses its actual spread numerically, not a substring that also matches fractional pixels.
- Contrast: browser Canvas resolves actual CSS colors including OKLCH/alpha to sRGB and composites
  native background against the Card, then uses WCAG relative luminance.

| Hero text                     | Light   | Dark    | Required ratio | Result |
| ----------------------------- | ------- | ------- | -------------- | ------ |
| Heading                       | 19.87:1 | 16.00:1 | 3:1 large text | Pass   |
| Dates/counts/phase            | 19.87:1 | 16.00:1 | 4.5:1          | Pass   |
| Muted summary labels/fallback | 4.87:1  | 6.65:1  | 4.5:1          | Pass   |
| Number Tag                    | 7.74:1  | 9.51:1  | 4.5:1          | Pass   |
| Native external link label    | 4.87:1  | 6.65:1  | 4.5:1          | Pass   |
| Initials                      | 16.15:1 | 13.78:1 | 3:1 large text | Pass   |
| Official Tag                  | 4.57:1  | 10.57:1 | 4.5:1          | Pass   |

Ratios match at both widths. Do not retain the transient 3.22:1 light external sample as a native theme failure.
Alternate mounted secondary official-status contrast remains unverified; component tests cover the native
secondary severity and real localized label. Contrast passes do not imply screen-reader or user-review approval.
