---
title: 'DR-006i: Shared played encounter cards'
description: 'Refresh mounted played encounters and remove their inline component CSS.'
---

## Identity

- ID: DR-006i; parent DR-006 stays open. Status is authoritative in the [backlog](../backlog.md).
- Dependencies: DR-006h establishes the approved native Card/date-rail pattern.
- Follow the [design rules](../README.md).

## Scope

- Project: `frontend-components`; played summaries and, at the user's explicit request, expanded game presentation.
- Confirmed mounted route: `/clubs/oostendse/teams/11b725dd-65ac-41da-a750-f75cd79300a7`,
  with three played summaries on 2026-10-21.
- Other mounted consumers: club detail schedule and competition draw.
- Preserve date, home/away order, team links/fallbacks, perspective, score fallback, expansion,
  lazy loading, game sorting, loading/empty content, and expanded player links/set scores.
- Exclude upcoming markup, parent layouts, services, translations,
  global styling, and dependency changes.
- Intentionally replace the mouse-only clickable summary with a native expansion button. Team links
  remain independent; native Enter/Space activation and expanded state replace the unlabelled chevron.

## Baseline and proposed approach

- Clean initial worktree. Existing played summary has a custom bordered surface, decorative stripe,
  fixed three-column grid, truncated team names, hard-coded palette classes, and mouse-only expansion.
- Initial browser: port 3000, dark theme, 1220x1272. Team route has three 0-0 played summaries.
- Baseline screenshot: `tmp/design-refresh/DR-006i-before-dark.png`, inspected locally, not committed.
- Use native PrimeNG Card and Button, with semantic plain-text scores and minimal layout utilities.
  The initial Tag proposal was rejected in user review; retain the previous large numeric score format.
- Reuse DR-006h's date rail directly; no new abstraction, stylesheet, or global theme change.
- The initial slice retained expanded styles. The user subsequently requested removal of all `.component.ts`
  styling without SCSS; scope was extended to the existing expanded markup, not to services or other components.
- Replace expanded custom surfaces with native Cards; use Tailwind grids, wrapping player links, semantic
  winner text, translated perspective results, and paired plain-text scores. Host display uses a class.

## Implementation checklist

- [x] Confirm actual mounted consumers and independently reviewable scope.
- [x] Refresh played summaries with native Card/Button and large plain-text scores.
- [x] Preserve links, perspective, scores, loading, and expansion in focused tests.
- [x] Preserve upcoming markup and check all three mounted consumers.
- [x] Remove every inline component CSS rule without adding SCSS or styling workarounds.
- [x] Migrate expanded presentation while preserving player groups, levels, results, and set pairs.

## Acceptance and verification

- [x] Native Card surface, wrapping names, full-date accessible label, and ordered scores.
- [x] Perspective outcomes retain non-color meaning; neutral/tied scores remain readable.
- [x] Native expansion button exposes its name, controlled region, and expanded state.
- [x] Non-expandable summaries have no expansion button; team links do not expand games.
- [x] Loading, empty, supplied games, lazy loading, and expanded player links remain functional.
- [x] No new palette classes, SCSS, or inline styling workarounds.
- [x] Summary layouts at 390px/1280px in light/dark and all mounted consumers checked.
- [x] Keyboard focus and mounted neutral-score/text contrast pass.
- [x] Expanded eight-game list fits at 390px/1280px in light/dark on all three mounted consumers.
- [x] Focused tests preserve single/double/mixed player levels, both player groups, and unplayed/zero set handling.
- [ ] Populated expanded names, badges, result captions, and set scores verified visually in mounted data.
- [ ] Nonzero score visual states checked in mounted data.
- [x] Focused tests and relevant Nx lint/build pass.
- [ ] Relevant SSR/hydration and localization checked, or limits disclosed.
- [x] User approval recorded with the disclosed verification limits.

## Evidence and handoff

- No backend mutations, browser data fixtures, dependency additions, or new server processes.
- Installed PrimeNG 22.1.2 APIs checked against native Button/Tag documentation for the initial proposal;
  the final implementation does not import Tag.
- Changed played summaries, expansion-shell accessibility, expanded presentation, native imports, and focused tests.
  The hidden controlled container exists while collapsed; expanded content is still mounted only when expanded.
  Loader logic, sorting, supplied games, player routes, level selection, and set winner/played checks are unchanged.
- Utility/style comparison: removed `.enc-card`, hover surface, accent stripe, truncation, custom font
  expressions, duplicated nested score-color expressions, and manually paired green/red palette classes.
  Remaining utilities provide date-rail layout, wrapping, spacing, typography, and semantic colors.
  The existing `72px` rail and `p-0! gap-0!` passthrough follow DR-006h, not a new styling exception.
  All former inline styles, `.g-card*`/`.enc-expanded` hooks, decorative game bands, and legacy game-result colors
  are removed. Expanded player names wrap; winning players and set scores use semantic text and font emphasis.
  Perspective-specific game outcomes have translated text instead of a decorative result band.
  Native Cards own surfaces; layout utilities replace the old rules without new CSS, SCSS, or inline styles.
- Final validation commands, all passed:

  ```powershell
  $env:NX_DAEMON='false'
  npm exec -- nx run frontend-components:test --runInBand `
    --testPathPatterns=encounter-card.component.spec.ts --output-style=static
  npm exec -- nx run-many --targets=lint,build --projects=frontend-components --output-style=static
  npm exec -- nx run app:build --output-style=static
  npm exec -- nx run frontend-components:lint --output-style=static
  git --no-pager diff --check
  ```

- All 20 tests pass: six existing upcoming cases plus played native surface/date/scores/button,
  home/away win/loss/tie combinations, fallback metadata/scores, independent team navigation,
  deferred loader/skeletons/no repeat loading after data arrives, sorted supplied games/player routes/set scores,
  single/double/mixed level selection and both player groups, native game Cards, translated perspective results,
  omitted unplayed sets, and a played zero score. Scores are emitted as ordered set pairs rather than column-major
  markup, preserving the visible home/away columns and set order.
- Lint passes with 31 existing warnings, none introduced here. Library and consuming app builds pass.
  Nx executor deprecation and TypeScript metadata warnings remain existing tooling advisories.
- Initial checks caught a misplaced template closing block and an unsupported directive `[icon]` input;
  both were corrected. Native `button pButton iconOnly` now projects its decorative chevron.
  A navigation test initially lacked a route stub; it now verifies the preserved destination while
  stubbing Router navigation. These initial failures are not presented as passing attempts.
- Initial mounted summary matrix passed in light/dark at 390px/1280px, before the plain-score revision:
  - Team route: three played Cards and eleven unchanged upcoming Cards; no summary or document overflow.
  - Club `/clubs/oostendse`, Programma tab: nine played Cards and 37 upcoming Cards; no summary overflow.
    Its first played card expanded to eight games and collapsed successfully.
  - Competition draw: twelve played Cards and sixty upcoming Cards; no summary or team-link clipping.
- Draw route:
  `/competition/ef25fcfb-f860-415a-a4f4-e8dca7ea70cb/sub-events/c4b84033-b81f-4168-b539-3914f26b80fc/draws/0059a693-be63-4486-bf3d-450733e5e706`.
- Initial screenshots for all four team-summary cases were inspected. After the user's score revisions,
  the same four evidence paths were refreshed with the user's current draw and inspected:
  `tmp/design-refresh/DR-006i-{390,1280}-{light,dark}.png`. Evidence is not committed.
- Final plain-score/center-alignment matrix: eighteen played summaries, zero score Tags, zero summary
  overflow at 390px/1280px in light/dark. Score numbers and separator have identical vertical centers in
  every case. Current review route:
  `/competition/ef25fcfb-f860-415a-a4f4-e8dca7ea70cb/sub-events/8e8ba158-859c-48a7-92ca-f2c3ce805f4f/draws/78d42486-ab43-4484-9b68-a99e46bf96ae`.
  That summary-only matrix predates inline-style removal; the final expanded matrix and SSR rerun are below.
- Final CSS-free expanded matrix: eight native game Cards inside the encounter Card, zero old CSS hooks,
  and zero encounter/game overflow at 390px/1280px in light/dark on the current draw, team detail, and club
  schedule. Team data is supplied directly; schedule/draw lazy-loading paths still open the eight games.
  Four expanded screenshots were inspected:
  `tmp/design-refresh/DR-006i-expanded-{390,1280}-{light,dark}.png`.
  Sticky app chrome overlaps the top of these tall element captures; the visible game regions were inspected,
  not claimed as complete unobstructed encounter screenshots.
- Source check confirms zero `styles`, stylesheet references, inline styles, old game CSS hooks, or legacy
  result-token references in this component/template. No stylesheet files were added.
- Mounted text contrast, light/dark: secondary text 4.87:1 / 6.65:1 and normal text 19.87:1 / 16:1.
  Final plain-text scores use these same semantic normal/muted text colors on the native Card surface.
  Initial neutral Tag contrast was 7.74:1 / 9.51:1; Tags were subsequently removed at the user's request.
  Conversion used a canvas to resolve the preset's OKLCH colors
  to sRGB before calculating contrast; a first RGB-only parser was invalid and its results were discarded.
- Keyboard Tab moved from home team to away team to expansion button. A native solid 1px focus outline
  was verified in both themes after hydration settled. Enter opened eight games; Space closed the container,
  with settled `aria-expanded="false"` and hidden content. Earlier immediate reads during hydration or
  before Angular updated the attribute were retried after settling, not treated as failures of final behavior.
- Final read-only SSR request after CSS removal returned HTTP 200, fourteen encounter elements, three played Cards,
  three named collapsed buttons with matching controls, and three hidden controlled containers.
- Limits: live team data has 0-0 scores, so nonzero result cases have focused-test coverage only,
  not mounted pixel verification. Alternate locales, exhaustive hydration, and screen-reader output
  remain unverified. Available live expanded games contain no memberships or set scores. Their empty geometry
  is verified, but populated player links/badges, result captions, and set-score pixels have test coverage only.
- Reusable-pattern decision: native Card/date rail matches the approved upcoming summary; direct PrimeNG
  is sufficient without a wrapper. Native expansion Button is the intentional accessibility/interaction change.
- Backlog status is Done with explicit user approval on 2026-10-23.
- User feedback on 2026-10-21: "Already nice" but restore the previous score format without Tags;
  then center the separator with both scores. Plain large numbers now use semantic normal/muted text,
  and an `items-center` score row with a single-line separator. No palette colors or custom styles added.
  Browser measurement on the user's current draw showed identical vertical centers for both numbers
  and the separator (954.796875px); tests assert the intended center alignment and absence of Tags.
  After both requested revisions, all sixteen tests, component lint/build, and consuming app build passed again.
- Additional user feedback: remove styling from `.component.ts` using Tailwind and PrimeNG, without SCSS.
  The expanded presentation was added to this item's scope as explicitly requested. All inline component styles
  are now removed, and the final twenty tests, component lint/build, and app build pass.
- User decision on 2026-10-23: "commit and push". This approves completion and the scoped commit/branch push
  with the disclosed verification limits. Unchecked populated visual, locale, exhaustive hydration, and
  screen-reader criteria remain unverified; approval is not a passing check for those outcomes.
- Exceptions: none.
- Exact next action for the next invocation: inspect mounted shared match/bracket consumers and scope the
  next DR-006 child; do not start another implementation here.

## Source

- [Template](../../../libs/frontend/components/games/encounter-card/src/encounter-card.component.html)
- [Component](../../../libs/frontend/components/games/encounter-card/src/encounter-card.component.ts)
- [Tests](../../../libs/frontend/components/games/encounter-card/src/encounter-card.component.spec.ts)
- [Team consumer](../../../libs/frontend/pages/club/src/pages/team-detail/page-team-detail.component.html)
- [Schedule consumer](../../../libs/frontend/pages/club/src/pages/detail/tabs/club-schedule-tab.component.html)
- [Draw consumer](../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.html)
