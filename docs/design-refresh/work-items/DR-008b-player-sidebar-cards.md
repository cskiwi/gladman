---
title: 'DR-008b: Player detail sidebar cards'
description: 'Replace the four legacy player-detail sidebar cards with native PrimeNG components and localized copy.'
---

## Identity

- ID: DR-008b; parent [DR-008](../backlog.md). Status is authoritative in the [backlog](../backlog.md).
- Area: the sidebar of the mounted `/players/:playerId` page (`app-page-detail`).
- Dependencies: DR-005b `app-form-sequence` and DR-005a `app-tier-badge` (both completed shared components).
- Design rules: [design refresh plan](../README.md).

## Scope

- Project: `frontend-pages-player`; folder `pages/detail/components/`.
- Current form, season record, toughest match-ups and teams cards, each a smart component that keeps its data service.
- Exclude the hero, ranking progress, upcoming/recent games, `rank-spark` and `show-level` (no mounted consumer was
  touched), `player-stats.service.ts` and any query.

## Baseline

- Each card set its own `:host` border, radius and padding in SCSS instead of a native Card.
- Legacy `t-eyebrow` all-caps headings, `form-dot`, `record-bar`, `legend-dot`, `opp-row` bars, `team-avatar` and
  `g-chip--*` classes, with palette tokens (`--g-win`, `--g-loss`, `oklch(from ...)`).
- All copy was hard-coded English ("Current form", "Season record", "Loading…", "No teams this season.").
- The shared `app-form-sequence` had no production consumer; the current-form card is now its first.

## Implementation

- Every card is a native `p-card` with a `header`; the four SCSS files were removed.
- Current form: `app-form-sequence` plus a localized summary; indeterminate `p-progressbar` while loading.
- Season record: native success/danger `p-tag`s and localized labels. The win-rate `p-progressbar` was removed at the
  user's request (the win-rate tag and W/L tags already carry the information); the bar remains only as the loading state.
- Toughest match-ups: name + `app-tier-badge` with a danger `p-tag` record. The per-row bar was dropped because every
  listed match-up has a win rate below 50%, so it only repeated the tag.
- Teams: `p-avatar` (circle) with the team link beside it, club name, and an info/secondary `p-tag` for Regular/Backup.
  The avatar sits outside the link so it is not underlined or link-colored.
- Lists use `m-0 list-none p-0` because the app does not reset `ul` indentation.
- Locale keys added under `player.detail.*` in nl_BE, en and fr_BE. Existing `player.noRecentGames` and
  `player.noGames` are reused for empty states.

## Checklist

- [x] Confirm the mounted consumer (`app-page-detail` sidebar) and smallest slice.
- [x] Replace the legacy markup with native components and remove the local SCSS.
- [x] Localize all copy in three locales.
- [x] No numbered palette utilities, hex colors or new SCSS.
- [ ] Add focused component tests (none exist for these components).
- [ ] Keyboard/focus and contrast checks.

## Verification

- **Passed:** `NX_DAEMON=false npm exec nx run frontend-pages-player:lint` (0 errors, 17 pre-existing warnings in other
  files), `:build` (production) and `:test -- --runInBand` (no spec files in the project, exits successfully).
- **Passed (browser, Dutch, real data for `glenn-latomme`):** dark 1440px sidebar; light 375px with no horizontal
  overflow (`scrollWidth` 375). The first Teams render was fixed after review: list indentation, link underline/color
  bleeding into the avatar, and missing hover affordance.
- **Not verified:** light 1440px, dark 375px, loading and empty states, an unlinked team (no club slug), French/English
  rendering, keyboard focus, text contrast, hydration.

## Approval

- The user approved completion with `commit` on 2026-11-11 after the Teams rework and the season-record progress bar
  removal. Status is Done with the unchecked limits above accepted (component tests, keyboard/focus, contrast, and the
  unverified theme/width/state/locale cases). The bar removal was not re-checked in a browser; lint and build were re-run.

## Discoveries

- `FormSequenceComponent` always renders W/L letters, so they are not localized in nl/fr; the season-record tags use the
  same letters for consistency. Candidate follow-up in the shared component.
- Each of the three stats cards creates its own `PlayerStatsService`, so the same 1000-row query runs three times
  (Apollo may de-duplicate). Not changed here.
- Player-detail loading and error states still use `text-red-600` and inline progress bar styling (page-level, not in
  this slice).
