---
title: 'DR-012g: Club tournaments tab'
description: 'Native Card, Table, Tag and Message states with localized phase labels for the club detail tournaments tab.'
---

## Identity

- ID: DR-012g; parent [DR-012](../backlog.md). Status is authoritative in the [backlog](../backlog.md).
- Area: the fourth tab ("Toernooien") of the mounted `/clubs/:clubId` page (`app-club-tournaments-tab`).
- Dependencies: completed [DR-012a](DR-012a-club-page-chrome.md) to [DR-012f](DR-012f-club-schedule-tab.md); the card +
  table pattern of [DR-012e](DR-012e-club-player-roster-tab.md).
- Design rules: [design refresh plan](../README.md).

## Scope

- Project: `frontend-pages-club`. `app-club-tournaments-tab` template and component, plus a `hasValue()` guard in
  `ClubTournamentsTabService` so a failed request no longer throws from `value()`.
- Exclude the team builder tab (DR-013), tournament detail, the create-tournament route, GraphQL queries and permissions.

## Consumers

- `app-club-tournaments-tab`: `page-detail.component.html` (`/clubs/:clubId`, deferred on idle, inputs `clubId`,
  `canCreate`, output `createTournament`). No other consumer, so no dumb/smart split was introduced.

## Baseline

- Plain `h3` with a `size="small"` primary button; `p-datatable-sm p-datatable-striped` table with an extra eye-button
  column duplicating the name link; a `text-green-500` palette icon for official tournaments; English hard-coded
  phase labels (`'Draft'`, `'In Progress'`, ...) although `all.tournament.phases.*` exist; hand-built centered empty
  state with a `text-4xl` icon and a second create button; five `3rem` skeletons; errors never rendered (and thrown
  from `value()`).

## Approach

- Follow the roster tab: an `h2` with a tabular count, the create `p-button` (default size), and a native `p-table` (`size="small"`, scrollable, paginator above 10 rows, `ariaLabelledBy` the heading).
- Name is the only link; the eye column is gone. Official tournaments get a native info `p-tag` with visible text
  (`all.club.tournaments.official`) instead of a green icon plus tooltip; the "not official" minus icon is gone.
- Phase labels use the existing `all.tournament.phases.*` keys (as the tournament detail page does); native severities
  kept. Label and severity maps moved to module constants.
- States: native `p-message` for error (new `all.club.detail.tournaments.error`, nl/fr/en) and empty (existing
  `all.club.tournaments.noTournaments`); a plain skeleton while loading. The create button now lives only in the
  header (the duplicate "create your first" button is unused; its key is left in place).
- No outer `p-card`: the tab panel (`p-tabpanels`) is already a filled surface, so a Card inside it drew a second
  bordered box. After user review the Card was removed here and from the roster tab (DR-012e); the content now sits
  directly on the panel.
- No SCSS, palette, hex or arbitrary colour utilities.

## Checklist

- [x] Confirm mounted consumer and the smallest slice.
- [x] Replace legacy markup with native components.
- [x] Localize new copy in three locales (error key; phase labels reuse existing keys).
- [x] No numbered palette utilities, Tailwind palette colours, hex colours or new SCSS.
- [x] Lint and build pass.
- [x] Browser check (see Verification).
- [ ] Real data in the table (dev data has no club-linked tournaments).
- [ ] Keyboard/focus order and contrast checks.
- [ ] French/English copy in the browser.
- [ ] Loading skeleton and error message in the browser.
- [x] User review (approved with `commit`).

## Verification

- **Passed:** Prettier on changed files;
  `NX_DAEMON=false npm exec nx -- run-many --target=lint,build --projects=frontend-pages-club --output-style=static`
  (tasks passed).
- **Passed (browser, Dutch, `smash-for-fun`, signed in, 2026-11-11):** empty state in dark at wide width (0 count,
  create button, native secondary Message). Table checked in dark wide and light 390px using a **stubbed** GraphQL
  response (13 synthetic tournaments injected through `window.fetch` in the page; no database or backend changes):
  official Tags, localized phase Tags, missing date/name fallbacks, paginator, no page overflow (390/390). At 390px the
  table scrolls horizontally inside the Card (native `scrollable` behaviour); the phase column is off-screen until
  scrolled.
- **Not verified:** real data (the dev database has no tournament linked to any club), loading skeleton and error
  message in the browser, keyboard focus order, measured contrast, French/English copy, unit tests (no tab spec),
  hydration.

## Discoveries

- `DatePipe` `mediumDate` renders English month names ("Oct 10, 2026") under the Dutch UI; the application locale is not
  registered for Angular date formatting. Pre-existing and shared by other pages; not changed here.
- No tournament in the development database has a `clubId`, so this tab is empty for every club in dev data.

## Approval

The user approved completion with `commit` on 2026-11-11 after removing the outer Card. Status is Done with the unchecked limits accepted (real data, keyboard focus order, measured contrast, French/English copy, loading/error in the browser, light/390px after the Card removal, unit tests, hydration).

## Remaining action

None for this slice. DR-012 is reconciled as Done. Next candidate, not started: DR-013 (team builder) or DR-014 (team detail).
