---
title: 'DR-010: Player ranking breakdown'
description: 'Parent reconciliation of the seven ranking breakdown refresh slices and their verification limits.'
---

## Scope

Documentation-only reconciliation of `/players/:playerId/ranking/:type` in `frontend-pages-player`. The
[player routes][routes] load the [ranking page][page], which mounts period selection and the [games list][games].
Keep ranking calculations, routes, localization, table behavior, the existing component boundaries and shared styling
unchanged. No before/after styling comparison is applicable; this slice changes no application code.

## Required children

All seven children have explicit approval with their own recorded verification limits. The backlog owns their statuses.

| Child                                                      | Reconciled scope                                  |
| ---------------------------------------------------------- | ------------------------------------------------- |
| [DR-010a](DR-010a-ranking-breakdown-header.md)             | Header, ranking context, and game-type select     |
| [DR-010b](DR-010b-ranking-breakdown-period.md)             | Period controls, calendar and presets             |
| [DR-010c](DR-010c-ranking-breakdown-filters.md)            | Filters, view toggles and URL state               |
| [DR-010d](DR-010d-ranking-breakdown-games-table.md)        | Games table and restored status and level cues    |
| [DR-010e](DR-010e-ranking-breakdown-add-simulated-game.md) | Add simulated game dialog and opponent/partner UI |
| [DR-010f](DR-010f-ranking-breakdown-simulation-toolbar.md) | Simulation toolbar, settings and local reset      |
| [DR-010g](DR-010g-ranking-breakdown-row-actions.md)        | Simulation row actions and focus return           |

## Acceptance and evidence

- [x] Reconcile approvals and verify the corresponding implementation is present on the current branch.
- [x] Confirm the mounted Dutch Singles route still renders the refreshed sections together.
- [x] Separate the deferred accessibility work without reopening completed children.
- [x] Record explicit parent approval with the verification limits below.

On 2026-11-20 a read-only browser check of `/players/glenn-latomme/ranking/single` in the existing dark theme
showed the ranking heading and selector, both period triggers, the filter and view groups, the Simulation toolbar
and six games with the refreshed table headers and cells. No simulation or other actions were executed. The browser
again logged `InvalidStateError: Transition was aborted because of invalid state`; the route still rendered.
This smoke check did not establish the cause or confirm an SSR/hydration issue.

No Nx tasks were rerun for this documentation-only slice. The most recent recorded focused command was
`npx nx run-many -t lint build test -p frontend-pages-player --output-style=static` with `NX_DAEMON=false`
and `NX_NO_CLOUD=true`. DR-010g records passing lint (19 warnings, zero errors), build and two period-selection
tests; these tests do not cover the simulation workflow. The child briefs record ten unrelated workspace lint
failures on pre-existing dependency specifiers.

Documentation checks: formatted both changed Markdown files with Prettier, preserved existing spacing on
untouched backlog rows, verified brief link targets and passed `git diff --check`.

Not verified by this reconciliation: full light/dark and narrow/wide visual review, contrast, screen-reader
coverage, alternate locales, SSR/hydration, or a full interaction pass. The child checklists retain the finer
verification limits, such as untested sort cycles, no-limit fixtures and simulation states.

On 2026-11-20 the user selected `Approve DR-010 with the documented limits and commit`. The approval accepts
the verification limits above and in the child briefs; it does not mark unperformed checks as passed.

## Remaining work

- DR-070 remains independent backlog work. In the [games list][games], real-row date details open on
  `mouseenter`; average explanations use tooltips on table cells. Scope the two surfaces separately if needed,
  starting with a keyboard and touch trigger for date details. Do not change calculations or simulation.
- DR-071 tracks the existing unnamed InputNumber stepper buttons in the simulated-game dialog. It is not a
  closure dependency. Do not change shared PrimeNG behavior as part of a dialog-only fix.
- No extraction or styling exceptions in this slice. Keep the existing route and presentation boundaries
  unless a future slice identifies genuinely shared structure.
- Next: confirm the mounted date-details trigger and scope DR-070 for keyboard and touch access to date details
  only. No DR-070 implementation was started.

[routes]: ../../../libs/frontend/pages/player/src/lib.routes.ts
[page]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/page-ranking-breakdown.component.html
[games]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/components/list-games/list-games.component.html
