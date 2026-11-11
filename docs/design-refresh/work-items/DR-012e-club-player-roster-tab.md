---
title: 'DR-012e: Club player roster tab'
description: 'Replace the per-player card grid of the club detail roster tab with one native Card and Table.'
---

## Identity

- ID: DR-012e; parent [DR-012](../backlog.md). Status is authoritative in the [backlog](../backlog.md).
- Area: the second tab ("Spelerslijst") of the mounted `/clubs/:clubId` page (`app-club-players-tab`).
- Dependencies: completed [DR-012a](DR-012a-club-page-chrome.md) to [DR-012d](DR-012d-club-teams-tab.md).
- Design rules: [design refresh plan](../README.md).

## Scope

- Project: `frontend-pages-club`. `app-club-players-tab` template and component, plus a `hasValue()` guard in
  `ClubPlayersTabService` so the error state can render.
- Exclude the other tabs (DR-012f, DR-012g), team builder (DR-013), the GraphQL query and the deduplication logic.

## Consumers

- `app-club-players-tab`: `page-detail.component.html` (`/clubs/:clubId`, deferred on idle). No other consumer, so no
  dumb/smart split was introduced.

## Baseline

- A card per player (up to four columns): gradient band, hover lift, Space Grotesk font stack, arbitrary sizes
  (`text-[0.9375rem]`, `h-[3px]`, `min-w-[32px]`), `t-eyebrow`/`t-mono` legacy classes, an untranslated
  `View profile ↗` footer and an inline-styled search/multiselect toolbar.
- The service error was never rendered; loading used hand-built `bg-emphasis` boxes.

## Approach

- One native `p-card` holding a toolbar and a native `p-table` (dense roster instead of 45 cards).
- Toolbar: player count (`{{count}} spelers`, or `{{count}} van {{total}} spelers` when filtered, `aria-live`), native
  search `p-iconfield` and team `p-multiselect`. Stacks full-width below `sm`, one row from `sm`.
- Table: sortable player column (avatar initials, name link to `/players/:slug`, muted member id) and a teams column of
  secondary `p-tag`s linking to `/clubs/:clubId/teams/:teamId`, each with the full team name as `aria-label` and
  tooltip. No initial sort highlight (the service already sorts by name). Paginator of 25 only when needed; the page
  resets to the first page whenever the filters change (`linkedSignal`). The signed-in player's row gets
  `bg-highlight` and the existing "You" tag, as on the teams tab.
- States: native `p-message` for error, empty (no players) and the table's filtered-empty message; Card skeletons for
  loading.
- Copy under `all.club.detail.players.*` (nl/fr/en); `i18n.generated.ts` edited by hand as in DR-012b to DR-012d.
- No SCSS, palette, hex or arbitrary utilities.

## Exception

- `apps/app/src/styles.scss` has an unlayered `p-multiselect { width: 100% }` rule that overrides Tailwind width
  utilities on the host. Rather than change global styles in a tab slice, the multiselect sits in a
  `w-full sm:w-64` wrapper. Retire the global rule in DR-029 after checking its consumers.

## Checklist

- [x] Confirm mounted consumer and the smallest slice.
- [x] Replace legacy markup with native components.
- [x] Localize all copy in three locales.
- [x] No numbered palette utilities, hex colors, arbitrary values or new SCSS.
- [x] Lint and build pass.
- [x] Browser check (see Verification).
- [ ] Keyboard/focus order and contrast checks.
- [ ] French/English copy.
- [ ] Own-row highlight (needs a signed-in club player), loading skeleton and error state in the browser.
- [x] User review (approved with `commit`).

## Verification

- **Passed:** Prettier on changed files;
  `NX_DAEMON=false npm exec nx -- run-many --target=lint,build --projects=frontend-pages-club` (0 errors; the 42 lint
  warnings are pre-existing).
- **Passed (browser, Dutch, `smash-for-fun`, 45 players, 2026-11-11):** dark at 1024px (toolbar on one row, no page
  overflow), light at 1009px, light at 390px (toolbar stacked, table fits with 294px available, no page overflow).
  Search `ber` gives "3 van 45 spelers" and hides the paginator; `berzzz` shows the filtered-empty message. Paginator
  appears for 45 rows; moving to page 2 and then filtering on "Smash For Fun 1D" shows "7 van 45 spelers" from the
  first row. Team tags are focusable links with the team name as accessible name and correct team URLs.
- **Not verified:** own-row highlight, loading skeleton and error message in the browser, keyboard focus order,
  measured contrast, French/English copy, unit tests (no players-tab spec), hydration.

## Discoveries

- Native paginator button labels ("First Page", "Next Page") are English in the Dutch UI; PrimeNG locale
  configuration is app-wide (see DR-037/DR-043 for comparable native localization gaps).

## Approval

The user approved completion with `commit` on 2026-11-11. Status is Done with the unchecked limits accepted
(keyboard focus order, measured contrast, French/English copy, own-row highlight, loading skeleton and error state in
the browser, unit tests, hydration).

## Remaining action

None for this slice. Next candidate, not started: DR-012f club schedule tab.

## Follow-up (2026-11-11, during DR-012g review)

The user disliked the border around the roster. The tab panel is already a filled surface, so the outer `p-card` was removed (and its `CardModule` import); the count/filters/table and skeleton sit directly on the panel. Lint and build pass; dark wide browser-checked. Light and 390px not re-checked.
