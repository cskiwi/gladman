---
title: 'DR-006n: Bracket score and connector contrast'
description: 'Improve mounted knockout score and progression-line contrast without changing bracket geometry.'
---

## Identity

- ID: DR-006n; parent [DR-006](DR-006-games-matches-brackets.md) remains open.
- Status: authoritative in the [backlog](../backlog.md).
- Dependencies: approved [DR-006k](DR-006k-bracket-semantic-presentation.md).
- Rules: [design refresh](../README.md).

## Scope

- Projects: `frontend-components` and its real consumer `frontend-pages-tournament`.
- Mounted consumer confirmed on 2026-11-23:
  `/tournament/internationaal-tornooi-lokerse-bc-2023/sub-events/755f536f-7d16-46ba-93c8-49d07123ce6c/draws/68b472cb-2940-47ec-ac17-eff7a15cab6a`.
  The routed draw-detail page mounts `app-draw-ko-tree`, which supplies games to `app-bracket-tree`.
  Current DOM: four rounds, fifteen matches, 28 player links, 26 scores and 28 connector segments.
- Change only the [shared bracket template][bracket] and focused [layout/presentation tests][tests].
- Preserve scores, winner highlights/bold labels, neutral match borders, Bye/TBD fallbacks, ordering,
  doubles sizing, connector geometry, responsive scrolling and player destinations.
- Exclude algorithms, data fetching, page chrome, other game surfaces, global theme, dependencies and localization.
  Do not reopen approved DR-006j/k work or fix historical stale component tests.

## Baseline and approach

- The previous investigation measured winner scores at 2.90:1 light / 8.16:1 dark and connectors at
  1.00:1 / 1.10:1. Recheck actual resolved colors before editing.
- Scores currently bind `text-primary` for the winner and `text-color` otherwise. Align winning score color
  with the existing winner-label `text-color-emphasis`; preserve the score content and bold typography.
- Connector segments currently use `bg-emphasis`, a surface treatment rather than a meaningful diagram line.
  Use `bg-current text-muted-color`: neutral, semantic muted text color supplies the line fill through currentColor.
  One extra utility per connector is purposeful; it avoids custom CSS, arbitrary token syntax or numbered shades.
- Keep the legitimate bracket visualization and existing computed geometry. Native PrimeNG has no knockout-tree
  replacement; no new primitive, wrapper, SCSS or equivalent appearance override is needed.
- The input-only KO adapter and shared presentation component already separate responsibilities.
  No further smart/presentational extraction is justified for this contrast-only slice.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and bounded scope on the current branch.
- [x] Capture fresh before/after theme-width evidence.
- [x] Change only score and connector semantic colors; preserve content and geometry.
- [x] Add focused regression cases for both winners and pending/Bye states.
- [x] Format changed files and record focused Nx checks.
- [x] Update the backlog and exact next action.

## Acceptance and verification

- [x] Actual score text contrast is at least 4.5:1 in both themes.
- [x] Actual connector contrast is at least 3:1 against its surrounding surface in both themes.
- [x] All four rounds, match/connector rectangles, scores and player hrefs remain unchanged at 390px/1440px.
- [x] No document overflow; later rounds remain reachable in the existing inner scroll viewport.
- [x] Player links remain keyboard-reachable with visible focus.
- [x] Both winner sides, pending matches and Bye score omission retain behavior in focused tests.
- [x] No new palette utilities, stylesheets, appearance overrides, theme changes, dependencies or extraction.
- [x] Components/tournament lint/build and focused tests pass.
- [x] Light/dark screenshots are inspected at narrow/wide widths.
- [ ] Populated doubles/TBD, screen-reader use, touch, alternate locales and SSR/hydration are verified.
- [x] User visual review or explicit completion approval with disclosed limits is obtained.

## Evidence and handoff

- Started 2026-11-23 on existing `main`; initial worktree clean. No operational mutations.
- Browser confirms the real mounted draw, not a preview/export-only consumer.
- Implementation changes only the template's two winning-score bindings and three connector class lists.
  Tests extend both existing winner cases with three-set content and pending-color checks, and add progression
  segment and pending-placeholder/Bye cases. Geometry, score computation and data ownership are untouched.
- Utility comparison: winning `text-primary` becomes `text-color-emphasis`, matching the existing winner-label
  intent. Each of three connector sites replaces one `bg-emphasis` with `bg-current text-muted-color`.
  This adds three static utility occurrences to express neutral semantic fill without authored CSS.
- Passed: `npx nx run frontend-components:test --testPathPatterns=bracket-tree.layout.spec.ts --runInBand`.
  The focused presentation/layout suite succeeds, including both winner sides and pending/Bye cases.
  The historical unrelated component-suite failures were not rerun or repaired.
- Passed: `npx nx run-many -t lint build -p frontend-components frontend-pages-tournament --output-style=static`.
  All thirteen tasks including dependencies succeed; ten are from cache.
  Existing lint warnings remain (31 in components, one in tournament); no errors.
- Formatting: repository Prettier was run on all changed files before validation; handoff documents were
  formatted again after recording the results.
- Isolated installed Playwright/Chrome, read-only browser check: current route at actual 390px/1440px
  in light/dark, with transitions settled. Theme class changed only in the isolated DOM; no preference writes,
  shared-process changes, server mutations or synthetic production consumers. Owned browser closed in `finally`.
- Fresh before/after comparison passes in all four cases: identical normalized text, ordered hrefs,
  round headings, fifteen match rectangles and all 28 connector rectangles (relative to the bracket).
  Fifteen winner rows, 26 scores and 28 links remain. Neutral match borders are unchanged.
- Actual document widths are exactly 390px/1440px, without horizontal overflow.
  Inner viewport/scroll widths remain 362px/1042px narrow and 1398px/1398px wide.
  All 28 player links are reached in order with visible native focus outlines and viewport-visible rectangles.
  Keyboard traversal reaches inner scrollLeft 680px narrow and 0px wide.
- Contrast method: browser-resolved colors sampled into an sRGB canvas, alpha composited through ancestor
  backgrounds, then WCAG relative luminance calculated. Score colors are evaluated against their own row;
  line fills against the surrounding ancestor surface, not the segment's own background.

| Minimum contrast       | Light before | Light after | Dark before | Dark after |
| ---------------------- | ------------ | ----------- | ----------- | ---------- |
| Winning score text     | 2.90:1       | 16.30:1     | 8.16:1      | 14.45:1    |
| All score text         | 2.90:1       | 16.30:1     | 8.16:1      | 14.45:1    |
| Progression connectors | 1.00:1       | 4.46:1      | 1.10:1      | 6.91:1     |

- Four after screenshots inspected. Local, uncommitted evidence uses
  `tmp/design-refresh/DR-006n-{390,1440}-{light,dark}-{before,after}.{png,json}`.
  JSON captures include content/geometry comparisons, contrast and keyboard results.
- Visual result: connectors now expose the existing progression geometry in both themes; winning scores remain
  bold on highlighted rows but use readable neutral text. No decorated match outlines or new UI components.
- Not run: populated doubles/TBD browser fixtures, screen-reader use, touch, alternate locales,
  SSR/hydration, full stale component suite and broader draw workflows. TBD placeholder is unit-tested only;
  these limits do not establish full bracket accessibility.
- Exceptions: existing computed visualization geometry only; no new styling exception proposed.
- Explicit completion approval, 2026-11-23: `Approve DR-006n with documented limits and commit`.
  This authorizes only this slice's implementation, tests and repository handoff commit, without push.
  It accepts the unchecked populated doubles/TBD-browser, screen-reader/touch, locale, SSR/hydration,
  full stale suite and surrounding workflow limits; it does not claim unperformed checks passed.
- Required pre-commit `npx nx run-many --target=lint --output-style=static` reproduces the existing
  `@nx/dependency-checks` version-specifier errors in ten untouched projects: `backend-health`,
  `backend-seo`, `backend-authorization`, `shared`, `backend-ranking`, `backend-search`,
  `backend-translate`, `utils`, `backend-database` and `backend-graphql`.
  The other 24 targets pass from cache. Scoped components/tournament lint/build and focused tests pass.
  No unrelated dependency corrections are included. Prettier, LF, relative-link and whitespace checks pass.
- Next candidate: reconcile DR-006's remaining required follow-ups and accepted child limits separately.
  Parent stays open; do not begin another slice in this invocation.

[bracket]: ../../../libs/frontend/components/bracket-tree/src/bracket-tree.component.html
[tests]: ../../../libs/frontend/components/bracket-tree/src/bracket-tree.layout.spec.ts
