---
title: 'DR-006k: Bracket semantic presentation'
description: 'Replace numbered palette presentation in the mounted knockout bracket without changing geometry.'
---

## Identity

- ID: DR-006k; parent [DR-006](DR-006-games-matches-brackets.md) remains open.
- Status: authoritative in the [backlog](../backlog.md); scoped only, implementation not started.
- Dependencies: completed [DR-006j](DR-006j-bracket-tree-responsive.md).
- Rules: [design refresh](../README.md). No current dependency or decision blocker for this bounded scope.

## Scope

- Nx projects: `frontend-components`, consumed by `frontend-pages-tournament`.
- Source: [bracket template][bracket], its [tests][tests], and the existing [KO adapter][ko].
- Confirmed mounted consumer, 2026-11-21:
  `/tournament/internationaal-tornooi-lokerse-bc-2023/sub-events/755f536f-7d16-46ba-93c8-49d07123ce6c/draws/68b472cb-2940-47ec-ac17-eff7a15cab6a`.
- Refresh round-header and completed-match-border presentation only; use semantic theme-aware styling.
- Preserve round order, team order, match sizes, connector geometry, scroll bounds, winner emphasis,
  scores, player destinations, Bye/TBD fallbacks and singles/doubles calculations.
- Exclude player/encounter cards, draw page chrome, standings, services, localization changes, global theme,
  algorithm changes and the six historically recorded stale bracket-suite failures.
- Do not reopen DR-006j's approved scrolling fix or introduce unused consumers.

## Baseline and proposed approach

- Current mounted draw has four round headings, fifteen completed-border boxes and 28 player anchors.
- Heading tokens: `text-primary-700`, `bg-primary-50`, `border-primary-200`.
  Completed boxes bind `border-primary-400`. These violate current semantic-only palette rules.
- Existing scroll host and viewport retain `w-full min-w-0`; preserve this contract.
- Keep semantic headings rather than wrapping each heading in a new component solely for appearance.
  Use semantic text/surface/highlight utilities as appropriate; verify the actual preset in both themes.
- Native PrimeNG is preferred if meaningful status UI is needed, but a bracket remains a legitimate visualization.
  Do not replace it with a table, redesign the algorithm or move custom colors to CSS/TypeScript.
- Retain existing computed inline geometry solely for connector placement; no new styling exception is proposed.
- Existing input-only KO adapter and shared bracket already separate data ownership and presentation.
  No additional smart/presentational split is justified for changing these color tokens.
- Before implementation, inspect installed APIs and resolved Nx targets; capture light/dark, narrow/wide evidence.
  Baseline evidence here establishes mounted use, not complete visual/accessibility acceptance.

## Implementation checklist

- [ ] Reconfirm mounted consumer and read current template/test context.
- [ ] Capture baseline utility usage and light/dark, narrow/wide views using safe existing data.
- [ ] Replace numbered palette utilities with meaningful semantic presentation.
- [ ] Preserve geometry, scrolling, links, scores and winner/fallback meaning.
- [ ] Add only focused behavior/presentation regression coverage that fails without the change.
- [ ] Format changed files and record exact targeted Nx commands and browser outcomes.

## Acceptance and verification

- [ ] No numbered primary/surface utilities or manually paired palette colors remain in this bracket template.
- [ ] Round names and completed/winner states remain readable in light/dark at 390px/1440px.
- [ ] Header, border and player-text contrast are measured against actual resolved surfaces.
- [ ] All rounds remain reachable inside the bracket scroll container without document horizontal overflow.
- [ ] Player links preserve destinations, keyboard access and visible focus.
- [ ] Scores, Bye/TBD, round/team ordering and singles/doubles geometry remain unchanged.
- [ ] No new CSS/SCSS, `[pt]`/`[dt]`, global token change, dependency, algorithm change or wrapper is introduced.
- [ ] Relevant existing Nx lint/build and focused tests pass; known baseline failures are distinguished.
- [ ] SSR/hydration, alternate locales and unavailable checks are recorded rather than assumed.
- [ ] User visual review or explicit completion approval with disclosed limits is obtained.

## Evidence and handoff

- Planning only, 2026-11-21. No application files changed or Nx tasks run.
- Parent reconciliation confirms this real mounted consumer with source and browser aggregate evidence.
- Baseline: four numbered-palette headings, fifteen completed-border boxes, 28 player anchors.
  No fresh screenshots, theme/width matrix or contrast measurements are available for this child.
- Reuse the existing shared bracket and input-only adapter; no extraction or new styling infrastructure.
- Existing exception retained: computed geometry inputs used by the legitimate bracket visualization.
- Parent reconciliation review is approved, 2026-11-21; this child's implementation is not approved as complete.
- Next invocation: implement only this semantic-presentation slice;
  preserve completed scrolling work, then update this brief and the backlog with verified results.

[bracket]: ../../../libs/frontend/components/bracket-tree/src/bracket-tree.component.html
[tests]: ../../../libs/frontend/components/bracket-tree/src/bracket-tree.component.spec.ts
[ko]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/components/draw-ko-tree.component.html
