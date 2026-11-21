---
title: 'DR-070: Ranking details and average explanations'
description: 'Parent reconciliation of the approved ranking popover slices and their remaining verification limits.'
---

## Scope

Documentation-only reconciliation of DR-070 in the [backlog](../backlog.md), following the
[design rules](../README.md). The [player routes][routes] mount `/players/:playerId/ranking/:type`;
the [ranking page][page] mounts the [games list][games] in `frontend-pages-player`.

Confirm the two approved children remain implemented together, record their evidence and retain their limits.
Exclude ranking calculations, simulation, DR-071 stepper labels, routes, translations and shared styling.
No application code, component extraction or new styling is needed; there is no styling before/after comparison.

## Required children

The backlog owns statuses. Both children are Done with explicit approval on 2026-11-20.

| Child                                              | Reconciled scope                                        |
| -------------------------------------------------- | ------------------------------------------------------- |
| [DR-070a](DR-070a-ranking-game-date-details.md)    | Date details: hover and activation, dismissal and focus |
| [DR-070b](DR-070b-ranking-average-explanations.md) | Promotion/relegation explanations and compact headers   |

Their approvals accept disclosed limits; they do not establish that unchecked criteria passed.
DR-071 is independent work, not a parent closure dependency.

## Acceptance and evidence

- [x] Reconcile both child approvals and confirm their implementation on the current branch.
- [x] Confirm the mounted Dutch Singles table renders date and average controls together.
- [x] Preserve child verification limits and keep DR-071 separate.
- [x] Persist a linked parent brief and an accurate backlog handoff.
- [x] Obtain explicit parent review or approval with the limits below.

On 2026-11-21 source inspection confirmed native date Buttons and Popovers, one local average template
for both directions, contextual names, named Close buttons, focus-return bindings and shared local
hover/activation handlers. The average explanation reads the corrected divisor for both directions.
No new smart/presentational split is justified: both children already share the same real games-list
consumer and local presentation templates. Do not extract a component solely to hide markup.

A read-only browser check of `/players/glenn-latomme/ranking/single` in Dutch and the existing dark
theme at 1571 x 1221 showed six rows, six named date controls and six named promotion-average controls.
All six average values had computed dashed text decoration. The native count header displayed `P#`
with the full accessible name `Promotie #`. The visible average values were five zeros and `45`.
The relegation column was hidden by the existing view state; it was not enabled during this check.
No simulation, data mutation, theme change or viewport change was performed.
This is mounted-consumer evidence, not a new interaction or visual acceptance matrix.

No Nx tasks were rerun for this documentation-only reconciliation. Both children record
`npx nx run-many -t lint build test -p frontend-pages-player --output-style=static` with
`NX_DAEMON=false` and `NX_NO_CLOUD=true` passing lint (19 existing warnings, zero errors), build and
two period-selection tests. Those tests do not cover popovers. Their precommit workspace lint runs
failed in the same ten unrelated projects; this reconciliation does not resolve or rerun those failures.

Documentation validation: Prettier ran on all three changed Markdown files. Formatter-only changes to
untouched backlog table rows were removed to keep this handoff scoped. Local links in both parent briefs,
the new backlog brief target, LF line endings and `git diff --check` passed.

## Verification limits and next action

- Not rerun here: light/dark and narrow/wide matrix, keyboard, hover, dismissal, focus return or Doubles checks.
  The children retain their previously recorded passing observations.
- Still unverified: touch opening/dismissal, screen-reader use, contrast and complete visual review;
  tournament-backed, missing-detail and simulated date fixtures; a non-default minimum-game relegation
  divisor; broader no-data/simulation fixtures, alternate locales and SSR/hydration.
- No styling exceptions or new dependencies. Existing out-of-scope styling remains unchanged.
- On 2026-11-21 the user selected `Approve DR-070 with the documented limits and commit`.
  This closes the parent with the limits above and in both child briefs; unperformed checks remain unchecked.
- The next candidate is DR-071: confirm the mounted Add simulated game dialog and scope only its unnamed
  InputNumber stepper controls. Do not begin that implementation in this invocation.

[routes]: ../../../libs/frontend/pages/player/src/lib.routes.ts
[page]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/page-ranking-breakdown.component.html
[games]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/components/list-games/list-games.component.html
