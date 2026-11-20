---
title: 'DR-070a: Ranking game date details'
description: 'Keyboard and touch access to the match details on real ranking game rows.'
---

## Scope

- Parent: DR-070 in the [backlog](../backlog.md); design rules in the [rollout](../README.md).
- Mounted consumer: `/players/glenn-latomme/ranking/single`, confirmed in Dutch on 2026-11-20.
  The same [games list][games] serves other ranking disciplines. Affected Nx project: `frontend-pages-player`.
- Keep dates, event and draw names, encounter teams, and player-relative scores. Leave average explanations
  (DR-070b), simulation and stepper labels (DR-071), ranking calculations, sorting, routing, and shared theme alone.

## Baseline and approach

- Six real rows rendered in the mounted dark-theme Singles table. Date text was plain in the accessibility tree.
  Hovering the first date cell opened an unnamed overlay containing encounter teams, draw, event and three set scores.
  The template disabled pointer events on the overlay; leaving the cell hid it.
- Use a native styled date button and an anchored PrimeNG Popover, as requested by the user after trying the
  modal alternative. Use the existing table and one shared details template for all rows.

## Acceptance and verification

- [x] Confirm the mounted consumer and independent scope.
- [x] A real-row date has a contextual button name and opens the correct encounter details and scores.
- [x] Keyboard and mouse open and close details; Escape and Close return focus to the originating date.
- [x] Hover opens without moving focus, stays open when entering the popover, and closes when leaving both areas.
- [x] Popover bounds fit at 390px and 1440px in light and dark.
- [ ] Verify touch, visual legibility and contrast.
- [ ] Verify tournament-backed, missing-detail and simulated rows.
- [x] No new palette classes, SCSS or equivalent overrides; scoped lint, build and tests pass.
- [ ] Visual review passes.

## Implementation and evidence

- The date button uses the translated details label, date and opponent for its accessible name. Rows with no
  details keep a plain date, and simulated rows keep their existing badge. The popover has a named Close
  button and restores focus on Close or Escape. Outside clicks are handled natively.
- Encounter and tournament data use the same source fields. Native Tag severities replace the old red/green
  score classes; score values remain player-first. The popover removes the pointer-events override.
  The date is a subtitle with no paragraph margins; remaining utilities cover layout, wrapping and hierarchy.
  No styling exception or shared change.
- No smart/presentational component split: row-local native popovers render one details template. A local
  preview/activation distinction and short close delay follow the club team-builder pattern without editing it.
- Added the details label to the Dutch, English and French `all.json` dictionaries and generated locale type.
- `npx nx run-many -t lint build test -p frontend-pages-player --output-style=static`, with `NX_DAEMON=false`
  and `NX_NO_CLOUD=true`, passed: lint reported 19 existing warnings and zero errors, build passed, and two
  existing period-selection tests passed. Those tests do not cover the date popover.
- The preview became available again after an initial `ERR_CONNECTION_REFUSED`. In the mounted Dutch Singles
  route, Enter opened the first date, focus moved to Close, and Escape returned focus and collapsed the
  trigger. Its encounter, draw, event and all three score pairs matched the baseline. Space opened a
  second date with the correct content. Clicking outside dismissed it.
- DOM bounds, the trigger's `aria-controls` target and focus return via mouse Close passed at 390px and
  1440px in both themes. Theme and viewport were restored. A popover can cover the next date until dismissed.
- After restoring hover at the user's request, hover kept focus on the trigger and stayed open while moving into
  the content. Leaving both areas dismissed it; clicking pinned it and moved focus to Close. Space still
  opened it and Escape restored focus. Hover bounds fit at 390px and 1440px in both themes.
- Desktop recheck after the final rebuild measured zero title/date block margins and zero gap between their boxes.
  The previous standalone date paragraph had 12.25px margins on both sides, plus the layout gap.
- Not verified: touch, visual approval, contrast, screen-reader use, tournament/missing-detail/simulated
  fixtures, alternate locales and SSR/hydration.
- Precommit `npx nx run-many --target=lint --output-style=static` under the same environment failed in the ten
  projects already listed in DR-010's workspace lint history. Focused player lint passed.

On 2026-11-20 the user selected `Approve DR-070a with the documented limits and commit`. The explicit approval
closes the slice without checking off unperformed verification above.

## Next action

Confirm the mounted average explanations on the Singles ranking route and scope DR-070b separately.
Do not reopen DR-070a or start DR-071 as part of that slice.

[games]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/components/list-games/list-games.component.html
