---
title: 'DR-012f: Club schedule tab'
description: 'Plain headings, native Messages and viewport-based columns for the played/upcoming encounter lists of the club detail schedule tab.'
---

## Identity

- ID: DR-012f; parent [DR-012](../backlog.md). Status is authoritative in the [backlog](../backlog.md).
- Area: the third tab ("Programma") of the mounted `/clubs/:clubId` page (`app-club-schedule-tab`).
- Dependencies: completed [DR-012a](DR-012a-club-page-chrome.md) to [DR-012e](DR-012e-club-player-roster-tab.md),
  [DR-006h](DR-006h-upcoming-encounter-cards.md)/[DR-006i](DR-006i-played-encounter-cards.md) (shared encounter card)
  and [DR-016d](DR-016d-encounter-section-chrome.md) (the pattern reused here).
- Design rules: [design refresh plan](../README.md).

## Scope

- Project: `frontend-pages-club`. `app-club-schedule-tab` template and component, plus `hasValue()` guards in
  `ClubScheduleTabService` and `ClubTeamsTabService` so a failed request no longer throws from `value()`.
- Exclude the other tabs (DR-012g), team detail encounters (DR-014), the shared encounter card, GraphQL queries and
  sorting/partition logic.

## Consumers

- `app-club-schedule-tab`: `page-detail.component.html` (`/clubs/:clubId`, deferred on idle). No other consumer, so no
  dumb/smart split was introduced. `ClubTeamsTabService.teams` is also read by the teams and players tabs; the guard
  only changes the error state from throwing to an empty list.

## Baseline

- Card titles carried green/blue Tailwind palette icons (`text-green-500`, `text-blue-500`), an `text-xs` count in
  parentheses and an empty `#subtitle` template; fixed `lg:grid-cols-[70%_1fr]` columns that squeezed the upcoming
  panel beside the 320px page sidebar.
- Skeletons used `border border-surface` boxes; the empty states were hand-built centered icon blocks and reused
  `no_encounters_description` ("Deze reeks…", about a draw, not a club). Service errors were never rendered.

## Approach

- Follow the player profile (`app-upcoming-games`/`app-recent-games`): a plain `h2` (`text-base font-semibold`) with a
  muted tabular count above the encounter cards, with **no outer Card**. The shared encounter card is already a
  native `p-card`, so an outer Card nested Cards and doubled every border (first iteration, replaced after review).
- Columns use the app's normal viewport breakpoint (`xl:grid-cols-[minmax(0,1fr)_22rem]`), stacking below `xl`. The
  first iteration used a Tailwind container query (`@container`), rejected in review as unconventional here.
- States: native `p-message` for error (teams or encounters), no teams (existing `all.team.noTeams`) and no
  encounters (new club-specific copy); plain skeletons for loading; existing `all.competition.*` partition-empty copy.
- Copy under `all.club.detail.schedule.*` (nl/fr/en); `i18n.generated.ts` edited by hand as in DR-012b to DR-012e.
- No SCSS, palette, hex or arbitrary colour utilities.

## Checklist

- [x] Confirm mounted consumer and the smallest slice.
- [x] Replace legacy markup with native components.
- [x] Localize new copy in three locales.
- [x] No numbered palette utilities, Tailwind palette colours, hex colours or new SCSS.
- [x] Lint and build pass.
- [x] Browser check (see Verification).
- [ ] Keyboard/focus order and contrast checks.
- [ ] French/English copy in the browser.
- [ ] Loading skeleton, error and empty messages in the browser.
- [x] User review (approved with `commit`).

## Verification

- **Passed:** Prettier on changed files;
  `NX_DAEMON=false npm exec nx -- run-many --target=lint,build --projects=frontend-pages-club --output-style=static`
  (0 errors, tasks passed).
- **Passed (browser, Dutch, `smash-for-fun`, 35 played / 85 upcoming, 2026-11-11), after the review rework:** dark at
  ~1770px (two columns beside the sidebar, only the encounter cards have borders, no overflow) and dark at 390px
  (stacked 331px sections, 390/390). The first iteration (outer Cards) was also checked in light at 390px/1440px; the
  light theme was not re-checked after the rework.
- **Not verified:** loading skeleton, error and empty messages in the browser, keyboard focus order, measured
  contrast, French/English copy, unit tests (no schedule-tab spec), hydration.

## Discoveries

- Wrapping the shared encounter card in another `p-card` (as DR-016d does on the competition draws page) gives nested
  bordered Cards; the player profile pattern avoids that. DR-016d's panels may deserve the same follow-up.

## Approval

The user approved completion with `commit` on 2026-11-11 after the review rework (outer Cards and container query
removed). Status is Done with the unchecked limits accepted (keyboard focus order, measured contrast, French/English
copy, loading/error/empty states in the browser, light theme after the rework, unit tests, hydration).

## Remaining action

None for this slice. Next candidate, not started: DR-012g club tournaments tab.
