---
title: 'DR-012d: Club teams tab'
description: 'Replace the legacy team card, gender filter bar and tab states of the club detail teams tab with native PrimeNG components.'
---

## Identity

- ID: DR-012d; parent [DR-012](../backlog.md). Status is authoritative in the [backlog](../backlog.md).
- Area: the first tab ("Teams Overzicht") of the mounted `/clubs/:clubId` page (`app-club-teams-tab`).
- Dependencies: completed [DR-012a](DR-012a-club-page-chrome.md) to [DR-012c](DR-012c-club-sidebar-cards.md); shared
  `app-form-sequence` ([DR-005b](DR-005b-form-sequence.md)).
- Design rules: [design refresh plan](../README.md).

## Scope

- Project: `frontend-pages-club`. `app-club-teams-tab` (loading, empty and filtered-empty states), `app-team-filter-bar`
  and `app-team-card`.
- Exclude the other tabs (DR-012e to DR-012g), team builder (DR-013), the team detail page
  (`/clubs/:clubId/teams/:teamId`), `app-team-game-stats` (no template consumer, unchanged), queries and services.

## Consumers

- `app-club-teams-tab`: `page-detail.component.html` (`/clubs/:clubId`).
- `app-team-card` and `app-team-filter-bar`: only `club-teams-tab.component.html`.

## Baseline

- `team-card.component.scss` (~370 lines) and `team-filter-bar.component.scss`: hand-built arena card with a gradient
  band, Space Grotesk/JetBrains Mono stacks, `oklch` literals, `--g-*` palette tokens, uppercase micro-labels, hover lift,
  custom segmented control, custom W/L dots, custom icon buttons.
- All copy hard-coded English (`teams`, `All/Men/Women/Mixed`, `Captain`, `Roster`, `Show less`, `View team ↗`, `No
teams match this filter.`); the six-card skeleton used `bg-highlight`.

## Approach

- Tab: native `p-card` skeletons, native `p-message` (secondary) for the empty and filtered-empty states.
- Filter bar: count text plus native `p-selectbutton` (counts inside the labels, `allowEmpty` off, labelled by the count
  text, wraps on narrow widths).
- Card: native `p-card` title template with a circular team-code avatar, semantic heading and edit action; `p-divider`
  separates the team identity from the captain. The captain's name sits beside accessible icon-only email/phone links;
  native `p-table` shows the roster (player, single/double/mix level, shared `app-form-sequence` for recent W/L) without
  a visible recent-form label. Player names wrap rather than truncate.
  The native `pButton` roster toggle exposes `aria-expanded` on the actual button. The separated footer groups
  games played/won and a localized win-rate tag in one wrapping row. The team-page button is omitted. Skeletons cover
  loading statistics.
  The signed-in player's row uses `bg-highlight` and a "You" tag.
- Copy localized under `all.club.detail.teams.*` (nl/fr/en); `i18n.generated.ts` edited by hand as in DR-012b/c.
- Both SCSS files removed; no palette, hex or arbitrary utilities.
- Shared `app-form-sequence` (second consumer: the player current-form card): tags get `min-w-8 justify-center` so W and
  L are the same width and align. Its four specs pass; the player card was not re-checked in the browser.
- E/D/G header abbreviations use native `pTooltip` (keyboard-focusable) instead of `title`.
- The two-column card grid uses `xl`. The fixed-layout roster has a 19rem minimum width: it fits without scrolling at
  a 390px viewport and scrolls inside the card at 320px without causing page overflow.

## Checklist

- [x] Confirm mounted consumers and the smallest slice.
- [x] Replace legacy markup with native components and remove both SCSS files.
- [x] Localize all copy in three locales.
- [x] No numbered palette utilities, hex colors, arbitrary values or new SCSS.
- [x] Lint and build pass.
- [x] Browser check (see Verification).
- [ ] Keyboard/focus and contrast checks.
- [ ] French/English copy.
- [ ] Edit button, own-row highlight and long roster states (need a signed-in captain).
- [x] User review: equal-width W/L tags, icon avatar for the captain, identical column widths for all teams with
      tooltips on the E/D/G abbreviations, and two teams per row.

## Verification

- **Passed:** `NX_DAEMON=false npm exec nx -- run-many --target=lint,build --projects=frontend-pages-club` (0 errors; the
  42 lint warnings are pre-existing in unrelated files). Prettier run on all changed files.
- **Passed (browser, Dutch, `smash-for-fun`, 9 teams):** dark at 1391px (single column, no table scrollbar, no page
  overflow), light at 390px and dark at 390px (cards fit the page, roster scrolls inside the card, no page overflow). The
  filter bar switches All/Heren/Dames/Gemengd (9/4/2/3) and the count updates; filtering to Gemengd shows 3 cards.
- **Passed (team-card refinement, 2026-11-11):** Prettier and
  `NX_DAEMON=false npm exec nx -- run-many --target=lint,build --projects=frontend-pages-club` (12 tasks succeeded,
  10 cached). No component logic, services, shared components or translations changed in this refinement.
- **Passed (refinement browser, Dutch):** light/dark at 1339px and 390px, no page overflow; all nine roster tables
  fit without scrolling at 390px (279px available). At 320px dark, tables scroll internally (209px available, 266px
  table) without page overflow. Existing team/player routes and mailto/tel targets remain intact.
- **Passed (refinement keyboard):** Enter expands the first roster from 5 to 7 players; Space collapses it to 5.
  Native-button `aria-expanded` changes from `true` to `false` and keyboard focus stays on the toggle.
- **Passed (card layout follow-up, Dutch):** captain email and phone icon links sit beside the captain name, with
  accessible names and unchanged `mailto:`/`tel:` targets. A divider separates team identity from captain details.
  The player heading no longer includes the visible recent-form label, the team-page action is removed, and the footer
  retains only its stats. Verified at desktop and 390px mobile widths; no page overflow after responsive tabs settle.
- **Passed (visual density follow-up):** removed the extra separator between captain and roster plus the footer border.
  Kept the intentional team/captain separator and native table row separators. Scoped lint/build pass; browser review
  confirms the team-card separator count is reduced to one.
- **Passed (project-consistency pass, 2026-11-11):** grouped captain and roster with a consistent layout gap; contact
  actions now follow the captain name and wrap on narrow cards. Avatars do not shrink. Rankings align with player names
  rather than recent-form badges. Removed extra row padding and the redundant footer wrapper; retained native Card,
  Table, Divider and Button appearance without SCSS or component overrides.
  Formatted the template and passed `NX_DAEMON=false npx nx run-many --target=lint,build --projects=frontend-pages-club`
  (12 tasks succeeded, 10 cached).
- **Passed (consistency browser checks, Dutch):** all nine cards in light/dark at 1339px, 390px and 320px have no page
  overflow. Tables fit at 390px and scroll internally at 320px. Visually reviewed desktop dark and mobile light.
  Enter expands the first roster from 5 to 7 rows; Space collapses it, updates `aria-expanded` and retains focus.
  Team/player navigation and accessible email/phone links remain in place. No data, service or translation changes.
- **Passed (captain icon follow-up):** removed link underlines from email/phone icon buttons. Scoped lint passes;
  browser computed styles confirm no decoration on either link/icon, including hover and focus.
- **Not verified:** edit dialog, own-row highlight styling, `p-message` empty/filtered-empty and loading skeleton,
  full keyboard focus order, measured contrast, French/English copy, unit tests (no team-card spec), hydration.

## Discoveries

- Recent form comes from the API most-recent-first; the old card padded missing games with grey dots. The shared
  `app-form-sequence` only renders W/L, so players with fewer than five games show fewer tags.
- Prettier rewrites unrelated files in `team-card/` when run on the whole folder (`team-game-stats`, `index.ts`);
  format only the changed files.

## Approval

The user approved completion with `commit` on 2026-11-11 after the review changes. Status is Done with the unchecked
limits accepted (keyboard focus order, measured contrast, French/English copy, edit dialog and own-row highlight,
empty/loading states, tests for the card and filter bar, tooltip keyboard behavior, player current-form card in the
browser). `frontend-components:test --testPathPatterns=form-sequence.component.spec.ts` (4 passed) and lint/build for
`frontend-pages-club,frontend-components` passed before the commit.

## Remaining action

None for this slice. Next candidate, not started: DR-012e club player roster tab.
