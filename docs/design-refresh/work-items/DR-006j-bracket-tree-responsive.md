---
title: 'DR-006j: Responsive shared bracket tree'
description: 'Make the mounted knockout bracket usable at narrow widths without changing its visualization or data.'
---

## Identity

- ID: DR-006j; parent DR-006 stays open. Status is authoritative in the [backlog](../backlog.md).
- Review status: Done with explicit user approval on 2026-10-23.
- Dependencies: none. Follow the [design rules](../README.md).

## Scope

- Project: `frontend-components`, consumed by `frontend-pages-tournament`.
- Confirmed mounted draw detail uses tournament slug `internationaal-tornooi-lokerse-bc-2023`, sub-event
  `755f536f-7d16-46ba-93c8-49d07123ce6c`, and draw `68b472cb-2940-47ec-ac17-eff7a15cab6a`.
- Refresh the shared [`BracketTree`][bracket-tree] presentation and its thin
  [`DrawKoTreeComponent`][draw-ko-tree] consumer for knockout draws.
- Preserve round ordering, bracket ordering, connector geometry, player links, scores, winner emphasis,
  Bye/TBD fallbacks, singles/doubles sizing, and the draw page's full-width layout.
- Exclude draw-game cards, standings, draw data/services, hero/actions, translations, unused `match-row` and
  `upcoming-match` components, and global styling.

## Baseline and proposed approach

- At 390px, the four-round bracket has a 1000px rendered canvas centered inside the viewport. Its first two
  rounds begin at `x=-312` and `x=-52`, leaving the initial rounds off-screen even though the parent has
  horizontal overflow.
- At 1280px, the same bracket spans `x=133..1133` and fits within the content area. The draw hero and games
  section remain usable at both widths.
- Keep the horizontal bracket visualization and its intentional pan/scroll behavior, but make the scroll
  viewport own the minimum width and start at the first round on narrow screens. Do not solve the issue by
  clipping the page or changing the bracket into a table.
- Prefer semantic PrimeNG/theme-aware surfaces and the minimum Tailwind layout utilities needed for sizing and
  overflow. Do not add a stylesheet, authored palette, or inline-style replacement; the existing computed
  geometry inputs remain necessary for connector positioning.
- Keep direct player navigation and all computed bracket algorithms unchanged unless a focused regression proves
  a presentation change requires otherwise.

## Implementation checklist

- [x] Confirm the smallest independently reviewable shared bracket slice and affected consumer.
- [x] Make the bracket viewport usable at 390px while retaining the wide horizontal visualization.
- [x] Preserve bracket ordering, links, scores, fallbacks, connectors, and singles/doubles geometry in focused tests.
- [x] Check the mounted tournament draw at 390px/1280px in light/dark themes.
- [x] Record discoveries outside the bracket scope in the backlog.

## Acceptance and verification

- [x] All rounds and match boxes are reachable by horizontal scrolling at 390px; no round starts off-screen
      before the user scrolls.
- [x] The 1280px bracket remains visually equivalent in information, order, spacing, and connector alignment.
- [x] Player links, scores, winner emphasis, Bye/TBD fallbacks, and singles/doubles heights remain unchanged.
- [x] No page-level horizontal overflow is introduced; the bracket's intentional scroll container is explicit.
- [x] Light/dark surfaces, keyboard focus, and player-link destinations are checked.
- [ ] Pixel contrast measurements are still pending; semantic theme geometry and keyboard focus passed.
- [ ] Empty and loading draw states, standings, games, localization, SSR, and hydration are either checked or
      recorded as limits.
- [x] Focused layout regression and relevant Nx lint/build targets pass.
- [ ] The existing full bracket-tree suite is clean; six pre-existing failures remain
      (`getTeamName` is absent and ordering expectations disagree with the current algorithm).
- [x] User reviewed the mounted result and approved completion with the limits recorded here.

## Evidence and handoff

- Before screenshots: `tmp/design-refresh/DR-006j-bracket-390-before.png` and
  `tmp/design-refresh/DR-006j-bracket-1280-before.png`; after screenshots:
  `tmp/design-refresh/DR-006j-bracket-{390,1280}-{light,dark}-after.png`. These are local and not committed.
- Before browser evidence: live KO draw data showed 15 games, populated player links, scores, and Bye matches.
  At 390px the bracket host measured 1000px wide and was centered at a negative x-position; at 1280px it
  measured 1000px wide and fit within the 1223px content region.
- Implementation is limited to `w-full min-w-0` on the routed bracket host and scroll viewport. The host now
  shrinks to the available content width, while the existing inline bracket canvas retains its calculated
  width and horizontal scrolling.
- The bracket remains a legitimate visualization. A table replacement, hidden overflow, or global shell change
  is out of scope.
- Focused layout regression passes. The pre-existing bracket-tree suite still reports six failures unrelated
  to this layout change; no production behavior was changed to make those stale assertions pass.
- The user approved completion on 2026-10-23 with pixel contrast measurements and the six existing suite failures
  disclosed. No push is authorized by this approval.
- Reusable-pattern decision: keep the existing bracket algorithm and direct player links; improve only the
  visualization's bounded scroll layout. The same host-width contract can be used by future draw visualizations.
- Exceptions: existing computed inline geometry is retained for connector placement and is not a new styling
  layer. No new exception is proposed.

## Source

- [Bracket tree][bracket-tree]
- [Bracket tree tests][bracket-tree-tests]
- [Mounted draw consumer][draw-ko-tree]
- [Tournament draw page][draw-page]

[bracket-tree]: ../../../libs/frontend/components/bracket-tree/src/bracket-tree.component.html
[bracket-tree-tests]: ../../../libs/frontend/components/bracket-tree/src/bracket-tree.component.spec.ts
[draw-ko-tree]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/components/draw-ko-tree.component.ts
[draw-page]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/page-draw-detail.component.html
