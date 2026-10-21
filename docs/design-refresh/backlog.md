---
title: 'Design refresh backlog'
description: 'Persistent status registry and frontend area inventory for the incremental redesign.'
---

## Current focus

DR-006h is Done with explicit user approval on 2026-10-21: shared upcoming encounter cards use native
PrimeNG Cards and the compact date-rail
direction from the user's `/players/axelle-de-prest` reference. Team links, home/away context, time, and
non-expandable behavior are preserved; dates include the month and an accessible full-date label. Played
cards, expanded games, services, and global styling are unchanged. Seven focused tests, component lint/build,
and app build pass (31 existing lint warnings). Team detail (11 cards), club schedule (37), and competition
draw (60) fit at 390px/1280px in light/dark without card overflow; all four team-card screenshots were inspected.
Muted-text contrast is 4.87:1 light / 6.65:1 dark. Keyboard team-link navigation and settled SSR pass.
Alternate locales, exhaustive hydration, and screen-reader output remain unverified.
The user approved completion and its scoped commit with these verification limits disclosed; unchecked
criteria are not claimed as passed. Next action: inspect and scope a separate mounted played-encounter-card
child under DR-006, preserving expansion and services. Do not start it in this invocation.
See the [brief](work-items/DR-006h-upcoming-encounter-cards.md). Parent DR-006 stays open. No push is authorized.

DR-006g is Done with explicit user approval on 2026-10-21: the mounted player upcoming heading is semantic, loading
placeholders use native Cards/Skeletons, the settled empty state uses a native Card, populated dates group
weekday/day/month separately from the hour, and the assembly action uses native `button pButton` with its translated
name and destinations preserved. Translations and service behavior remain unchanged. Three placeholder cards, 21
decorative skeletons, and no focus targets are covered by the focused spec. Seven tests, component lint/build, and app
build pass; 31 existing lint warnings remain. Earlier light/dark narrow/wide screenshots predate the final date/time
refinement; the user reviewed the latest version on their port-3000 instance and requested completion. SSR/hydration
and alternate locales remain unverified. Parent DR-006 remains open. Next action: inspect mounted consumers and scope
the next DR-006 child before implementation.
See the [brief](work-items/DR-006g-upcoming-game-states.md).

DR-006f is Done with explicit user approval on 2026-10-21: populated player upcoming-game cards use native
PrimeNG Cards and a wrapping layout. Three upcoming cards are shown initially; outlined View All/View Less
buttons expand and collapse the fetched encounters. Dates, draw/team destinations, home/away labels, and
assembly query parameters are preserved. Seven focused component tests and library lint/build pass (32 existing
lint warnings); the broader library test target still reports six unrelated bracket-tree failures. The earlier
layout check showed ten real encounters fitting at 390px/1280px in light/dark; ordinary card text contrast is at
least 4.87:1 and keyboard focus is visible. The earlier settled SSR check returned ten Cards before the
three-card initial display limit was added. Dark desktop and light mobile screenshots were inspected, and the
user reviewed the current player route and approved completion with the limits disclosed. Loading/empty markup,
header, services, and global styling are unchanged; real assembly navigation, alternate locales, exhaustive
hydration, and screen-reader output remain unverified. The six unrelated bracket-tree test failures also remain
an accepted limit, not a passing check. The original player route, dark class, and 1487x1252 viewport were restored;
no fixtures or backend mutations were needed. The next child is scoped as DR-006g; its implementation has not started.
Keep DR-006 open.
See the [brief](work-items/DR-006f-upcoming-game-cards.md).

DR-006e is Done with explicit user approval on 2026-10-17: mounted player recent-games initial/loading-more
placeholders now share a local native
PrimeNG Card/Skeleton template with a named busy section. Six initial/three appended placeholders and existing
services, filters, and pagination are preserved. All 26 focused tests and library lint/build pass (32 existing
lint warnings). Both states fit at 390px/1280px in light/dark, without overflow or focusable placeholders.
Dark desktop pixels were inspected; light/mobile capture returned the stale dark desktop frame, so that pixel
check remains unverified. Settled player SSR returns HTTP 200 with ten games; loading SSR and exhaustive hydration
were not verified. Browser fixtures are removed and the original player route, dark class, 1487x1252 viewport,
and ten games restored. The user requested "Approve and commit" with these limits disclosed; acceptance is not
a light/mobile pixel pass. The workflow now limits redesign to components with real application consumers and
treats DR approval as authorization for a scoped commit. Its proposed populated upcoming-game follow-up is now
DR-006f above; DR-006e remains complete and is not reopened. Keep DR-006 open.
See the [brief](work-items/DR-006e-recent-game-loading.md).

DR-006d is Done with explicit user approval on 2026-10-17: the mounted player recent-games header is a semantic
heading and labels its native compact,
wrapping SelectButton. Native item templating with semantic text fixes measured inactive light-label contrast
from 4.46:1 to 18.2:1, without global changes. All 24 focused tests, library lint (32 existing warnings), and
library build pass. Final 390px/1280px light/dark geometry and contrast pass; SSR returns 200 with all four named
options. Programmatic native clicks preserve filtering, but browser key attempts did not activate options, and
the screenshot showed unrelated chrome. No keyboard-selection or visual/pixel pass is claimed.
The user requested "Approved, commit" after these limits were disclosed; approval accepts completion with those
limits, not an unperformed keyboard or pixel pass. See the [brief](work-items/DR-006d-recent-game-filters.md).
Keep DR-006 open and prioritize used components. Its proposed mounted initial/loading-more skeleton follow-up
is now DR-006e above, preserving services and pagination; DR-006d's completed scope remains unchanged.

DR-006c is Done with explicit user approval on 2026-10-17 after revision: the user rejected won/lost Tags
widening the points column and requested
distinct light card surfaces. Results now use compact metadata icons with translated hidden text/title;
the points column contains only points again. Native PrimeNG Cards are white against the light canvas and
distinct from the dark canvas; no global theme changes. Fifteen focused tests, final library lint
(32 existing warnings), and build pass. Icons/scores fit at 390px/1280px in light/dark; result-icon contrast is
4.87:1 light / 6.65:1 dark. Keyboard focus and HTTP 200 SSR with ten Cards/result labels pass.
Dark desktop pixels show the compact `+452` column correctly. Light/mobile screenshot capture remains stale;
no light/mobile pixel pass or mounted unknown-state pass is claimed. The original player route, dark class,
1487x1252 viewport, and ten games are restored; no fixtures, persistence, or backend mutations.
The user explicitly requested "Approve & commit" with those verification limits disclosed; this is not a
light/mobile pixel pass. Next candidate: scope the mounted player recent-games header/filter presentation as
a separate DR-006 child, preserving filtering, services, and pagination. Do not start that next slice here.
See the [brief](work-items/DR-006c-recent-game-results.md); keep DR-006 open and prioritize used components.

DR-006b is Done with explicit user approval on 2026-10-17: mounted player recent-game set scores use success/secondary Tags,
with a check icon for winning scores. Nine focused tests, shared-library lint (32 existing warnings), and build pass.
All 50 score Tags fit at 390px/1280px in light/dark; contrast is at least 4.57:1. Keyboard link focus and HTTP 200
SSR with 50 scores/25 winner icons pass. The dark desktop screenshot was inspected; the light/mobile capture was
stale, so no light/mobile pixel pass is claimed. Cards, result bands, filters, points, and services are unchanged.
Original route, dark class, 1487x1252 viewport, and ten articles are restored after a read-only reload; no fixtures,
persistence changes, or backend mutations. The user approved completion and requested a commit with the screenshot
limit disclosed; this is not an unperformed light/mobile pixel pass. Its result-band follow-up is now DR-006c above,
keeping the parent open and preferring production consumers over unused match-row.
See the [brief](work-items/DR-006b-recent-game-scores.md).

DR-006a is Done with explicit user approval on 2026-10-17 and the screenshot limit retained:
the mounted player recent-games ranking-point chips now use native PrimeNG success/danger Tags.
Four focused tests, shared-library lint (32 existing warnings), and shared-library build pass. Positive and temporary
negative values fit at 390px/1280px in light/dark, with contrast at least 4.57:1. SSR returns 200 with the native Tag;
keyboard link focus remains visible. Dark desktop Tag pixels were inspected, but the light/mobile screenshot captured
unrelated content, so no light/mobile pixel pass is claimed. The temporary method fixture is removed; real points,
the original player route, dark class, and 1487x1252 viewport are restored. No persistence or backend mutation occurred.
The user approved completion with the light/mobile screenshot coverage limit disclosed, not a light/mobile pixel pass.
The subsequent score slice is now DR-006b above; the completed point scope is unchanged.
Keep DR-006 open. Cards, filters, and services remain unmigrated.
See the [brief](work-items/DR-006a-recent-game-points.md) for exact commands and coverage limits.

DR-005e (shared ranking progress) is Done with explicit user visual approval on 2026-10-17. The user preferred the
revised header layout, then requested bigger level numbers with no underline. Native large outlined secondary
PrimeNG button-links now show the level beside its discipline; point tags share a row and the visible points label
is removed. Actual level font is 15.75px instead of the interim 12.25px, with a 42px-high native target and no underline.
Its two existing consumers are the homepage and player detail route. Calculations, relative destinations, inputs,
translations, and projection are preserved; no tier-badge or global theme changes were made.
Nine focused component tests, 12 homepage tests, shared-library lint, and shared-library build pass. Both mounted
consumers pass 390px/1280px light/dark geometry and contrast checks; homepage authenticated presentation uses a
disposable browser-memory fixture, not a real login. Player SSR HTML returns 200 with all three links and six tags.
Final dark desktop and light mobile screenshots were inspected; no authenticated SSR or exhaustive hydration pass
is claimed. The fixture is removed and the original player route, dark class, and 1487x1252 viewport are restored.
The next component slice is now scoped as DR-006a above, without reopening completed DR-005 children.
See the [brief](work-items/DR-005e-ranking-progress.md) for evidence and limits. Keep DR-005 open.

DR-005d (shared stat-card) is Done at the user's explicit request on 2026-10-17 with coverage limits retained.
Native PrimeNG Card/Tag replace its custom surface, oversized typography,
and legacy delta colors; inputs and projected content are preserved, and local SCSS is removed. Eight focused
tests and shared-library lint/build pass. Synthetic layout checks pass at 390px/1280px in light/dark; text
contrast is at least 4.57:1. One dark desktop fixture screenshot captured correctly, but the mobile/light
attempt returned that stale dark desktop frame. No mobile/light pixel pass or mounted-consumer/SSR pass is claimed.
The user approved completion with those limits, not a successful mobile/light pixel or routed/SSR pass; see the
[brief](work-items/DR-005d-stat-card.md). The temporary fixture is removed; the original player route, dark class,
and 1487x1252 viewport are restored. Keep DR-005 open.
Ranking progress is now scoped separately as DR-005e; the completed stat-card scope remains unchanged.

DR-005c (shared sparkline) is Done at the user's explicit request on 2026-10-17 after the verification limits
were presented. The component now uses SVG geometry, native semantic result colors with
semantic fallbacks, and a translated accessible description; its local SCSS was removed. Six focused tests and
shared-library lint/build pass. Synthetic geometry/contrast checks pass at 390px/1280px in light/dark, including
without Tag variables. There is no production caller, so routed/SSR verification is unavailable. Screenshot
attempts captured the underlying page instead of the temporary preview; no visual/pixel pass is claimed.
The user accepted completion with those limits retained; see the [brief](work-items/DR-005c-sparkline.md).
The fixture is removed, the player route and dark class are unchanged, and the viewport is 1487x1252.
The next child is now scoped as DR-005d below. DR-005 remains open.

DR-005b is Done at the user's explicit request on 2026-10-17 after the verification limits were presented.
The shared form sequence uses native success/danger tags; four focused tests and shared-library lint/build pass.
There is no production caller, so no routed/SSR visual pass is claimed. The light screenshot/computed-color
discrepancy remains a documented coverage limit, not a resolved technical finding. The temporary preview was removed
and the original player route, dark theme, and 1487x1252 viewport restored.
DR-005c and DR-005d are also complete. DR-005 remains open for its other components;
shared stat-card also has no production caller.

DR-001 through DR-005a are Done. The shared badge's theme-aware styling, focused tests, lint/build, player-route
contrast checks, and user-requested completion are recorded in its brief. Some consumer routes lack populated badge
data or a production caller; those remain documented coverage limits, not verified visual passes. Do not reopen
completed work or expand DR-005 without separately scoping the next child.
DR-004's long-name, keyboard, theme/viewport, SSR, and user-review evidence is reconciled in its brief. Browser
fixtures were removed and the homepage's original selection and dark preference restored; no dependency or backend
data changed. DR-008/DR-014/DR-022/DR-006 discoveries remain deferred.

Follow the [design rules and workflow](README.md) for every item. This file is the authoritative status registry. Keep
it updated in the same change as the implementation.

## Work registry

Each row is a trackable area, not a promise to migrate that entire area in one change. Split multi-route or multi-tab
areas into child items before starting them. Briefs are created on demand from the [template](work-item-template.md)
and linked from their registry rows.

| ID                          | Area                                            | Status  |
| --------------------------- | ----------------------------------------------- | ------- |
| [DR-001][baseline]          | Theme and design baseline                       | Done    |
| [DR-002][pilot]             | Home page pilot                                 | Done    |
| [DR-003][shell-work-item]   | App shell, navigation, search, and layouts      | Done    |
| [DR-004][heading-work-item] | Shared headings, hero, and breadcrumb           | Done    |
| DR-005                      | Shared ranking, statistics, and status patterns | Backlog |
| [DR-005a][tier-badge-work-item] | Shared tier badge                            | Done    |
| [DR-005b][form-sequence-work-item] | Shared form sequence                      | Done    |
| [DR-005c](work-items/DR-005c-sparkline.md) | Shared sparkline                       | Done    |
| [DR-005d](work-items/DR-005d-stat-card.md) | Shared stat-card                       | Done    |
| [DR-005e](work-items/DR-005e-ranking-progress.md) | Shared ranking progress              | Done |
| DR-006                      | Shared games, matches, and brackets             | Backlog |
| [DR-006a](work-items/DR-006a-recent-game-points.md) | Mounted player recent-game point indicators | Done |
| [DR-006b](work-items/DR-006b-recent-game-scores.md) | Mounted player recent-game set scores | Done |
| [DR-006c](work-items/DR-006c-recent-game-results.md) | Mounted player recent-game result indicator | Done |
| [DR-006d](work-items/DR-006d-recent-game-filters.md) | Mounted player recent-game heading and filters | Done |
| [DR-006e](work-items/DR-006e-recent-game-loading.md) | Mounted player recent-game loading presentation | Done |
| [DR-006f](work-items/DR-006f-upcoming-game-cards.md) | Mounted player populated upcoming-game cards | Done   |
| [DR-006g](work-items/DR-006g-upcoming-game-states.md) | Mounted player upcoming-games presentation | Done |
| [DR-006h](work-items/DR-006h-upcoming-encounter-cards.md) | Shared upcoming encounter cards | Done |
| DR-007                      | Shared form controls and sync feedback          | Backlog |
| DR-008                      | Player detail                                   | Backlog |
| DR-009                      | Player head-to-head                             | Backlog |
| DR-010                      | Player ranking breakdown                        | Backlog |
| DR-011                      | Player editing                                  | Backlog |
| DR-012                      | Club detail and browsing tabs                   | Backlog |
| DR-013                      | Club team builder                               | Backlog |
| DR-014                      | Club team detail                                | Backlog |
| DR-015                      | Competition detail and sub-event presentation   | Backlog |
| DR-016                      | Competition draws                               | Backlog |
| DR-017                      | Competition assembly                            | Backlog |
| DR-018                      | Competition editing                             | Backlog |
| DR-019                      | Tournament detail and club tournaments          | Backlog |
| DR-020                      | Tournament creation and editing                 | Backlog |
| DR-021                      | Tournament enrollment workflows                 | Backlog |
| DR-022                      | Tournament draw detail                          | Backlog |
| DR-023                      | Tournament admin: enrollments and check-in      | Backlog |
| DR-024                      | Tournament admin: draws and scheduling          | Backlog |
| DR-025                      | Tournament admin: settings and phase controls   | Backlog |
| DR-026                      | Tournament live displays and kiosk              | Backlog |
| DR-027                      | Global admin and search indexing                | Backlog |
| DR-028                      | Sync administration and team matching           | Backlog |
| DR-029                      | Legacy styling retirement and final regression  | Backlog |

## App and shared surfaces

### DR-001 and DR-002: establish the direction

- DR-001 covers the [preset][preset], [PrimeNG configuration][app-config], [global styles][styles], [theme
  styles][theme-styles], and [theme service][theme-service]. Capture and verify; do not reset the theme.
- DR-002 covers `/`, implemented by the [home page][home]. Preserve ranking data and authenticated content.
- DR-002 covers the homepage query, loading, failure, and recovery behavior with focused tests.
- DR-002 editor advisory discovered during DR-004: the existing loading wrapper's `role="status"` is flagged in favor
  of native `output`. Homepage Nx lint passes; review loading announcements in the remaining functional checks.
- DR-002 depends on DR-001. Other items should record their concrete dependencies when promoted to `Ready`.
- DR-029 is the final cleanup, after relevant legacy consumers have migrated and shared/global regression checks pass.

### DR-003: app chrome and layouts

- [Shell][shell]: desktop/mobile navigation, search, account menu, login, theme switch, and update notification.
- [Layouts][layouts]: centered and full-width content, page width, and responsive spacing.
- [Language selection][language-selection]: preserve the existing locale selection component and behavior.
- Consider native menus, buttons, avatars, toolbar, and drawer before retaining custom navigation mechanics.
- Check all routed pages, popup overlays, anonymous/authenticated states, and theme preference persistence.
- Split navigation, search, and notification changes if they cannot be reviewed together.

### DR-004 to DR-007: shared patterns

- DR-004: [hero][hero], [page header][page-header], [section header][section-header], and [breadcrumb][breadcrumb].
  Simplify hierarchy and decoration without forcing every page into a hero.
- DR-005: [stat card][stat-card], [tier badge][tier-badge], [form sequence][form-sequence], [sparkline][sparkline], and
  [ranking progress][ranking-progress]. Keep useful domain meaning; prefer native severity and semantic text over a
  custom color system.
- DR-005a scopes only the shared tier badge and its five consumer groups; other patterns have separate child scopes.
  Keep the global rank-gradient token because other components still consume it. Its `match-row` call site has no
  production import; the inspected club/team and tournament poule routes did not render level badges with available
  safe data. See the [DR-005a brief][tier-badge-work-item] for exact test, browser, and review status.
- DR-005b scopes the form sequence only. It has no production caller; focused Angular tests cover its rendering
  contract and isolated native-tag markup supplies limited theme/viewport evidence. See its
  [brief][form-sequence-work-item] for user approval and the retained screenshot limitation. Stat-card
  is complete as DR-005d; ranking progress is scoped as DR-005e. Do not add a consumer solely for verification.
- DR-005c retains the miniature chart using SVG attributes and PrimeNG semantic tokens, with primary/text fallbacks
  when Tag-specific variables have not been injected. Its accessible title exposes translated outcomes as well as
  numeric heights. Six tests and isolated four-case geometry/contrast checks pass; no production caller exists.
  Screenshot capture did not include the fixture; the user accepted completion with that limit recorded in its
  [brief](work-items/DR-005c-sparkline.md). Global legacy result tokens remain for unmigrated consumers.
- DR-005d scopes stat-card only: native Card/Tag, wrapping text, directional icons, and preserved projection/inputs.
  Eight focused tests and shared-library lint/build pass. It has no production caller; isolated markup checks are
  not mounted Angular/SSR checks. The user explicitly approved completion with the stale mobile/light screenshot
  and consumer coverage limits retained in its [brief](work-items/DR-005d-stat-card.md).
  Ranking progress is scoped separately as DR-005e with two existing production consumers.
- DR-005e replaces ranking-progress decoration only, with focused and mounted-consumer evidence in its
  [brief](work-items/DR-005e-ranking-progress.md). Its calculations and relative links remain unchanged.
- DR-006: [games][games], [match row][match-row], [upcoming match][upcoming-match], and [bracket tree][bracket-tree].
  Keep score readability, result meaning, and responsive draw behavior.
- DR-006b discovery: resizing the mounted player list to mobile refreshes its page size; returning to desktop
  retained five articles for at least ten seconds. Reloading at desktop restores ten. Investigate breakpoint/page-size
  behavior separately before claiming responsive pagination coverage; score-only tests do not validate that workflow.
  Services, breakpoint logic, and pagination were unchanged in DR-006b.
- DR-007: [country/state controls][country-state] and [sync controls][sync-controls]. Preserve validation,
  disabled/loading states, and operation feedback. The [club-search area][club-search] currently contains service logic,
  not a visual component to redesign.
- DR-006d discovery for later shared-control work: native inactive SelectButton labels measured 4.46:1 in light
  mode against this preset's canvas. DR-006d fixes only its own label template with semantic `text-color`.
  Check other mounted SelectButton consumers when scoped; do not alter global theme tokens implicitly.
- DR-006g completed the player upcoming-list header/loading/empty follow-up, removed legacy `.upcoming*` SCSS,
  and replaced the assembly `p-button` host with native `button pButton`. Its approved scope stays complete.
- DR-006h refreshes only the shared encounter card's upcoming variant across club schedule, team detail, and
  competition draw. Played encounter surfaces and expanded game rows remain candidates for separate DR-006
  children after DR-006h approval; do not fold their palette/keyboard/legacy styling work into this slice.
- Each shared component can become its own child task. Inventory consumers before changing an API or appearance.
- Preserve legitimate visualization behavior; do not replace charts or brackets with a table solely to avoid styling.

## Feature areas and routes

Routes below are based on the [root route configuration][root-routes] and each linked feature route file. Tabs and
embedded workflows are tracked even where they do not have their own URL.

### Players

Project: `frontend-pages-player`. Source: [player feature][players]; [routes][player-routes].

- DR-008: `/players/:playerId`. Include current form, season record, strongest matchups, teams, and ranking summaries.
- DR-008 discovery from DR-004 verification: the player hero's existing icon-only overflow menu lacks an accessible
  name. Add a localized label and verify keyboard/menu behavior in the player slice; no shared API change is needed.
- The user explicitly deferred the logged-in homepage ranking header to player/profile work; leave it unchanged in
  DR-004's table-surface correction.
- DR-005e discovery for DR-008/DR-002 follow-up: the shared ranking strip's existing relative links resolve to
  `/ranking/single`, `/ranking/double`, and `/ranking/mix` on the homepage. Root routes do not mount `ranking`;
  player-detail links resolve correctly and keyboard activation passes. Scope a separate destination fix using the
  player identity; do not treat preserving these existing links as a passing homepage navigation check.
- DR-009: `/players/:playerId/head-to-head`. Include comparison selection and the matchup grid.
- DR-010: `/players/:playerId/ranking/:type`. Include period selection, game lists, and ranking explanations.
- DR-011: `/players/:playerId/edit`. Include profile, claims, and ranking forms; split by form when needed.
- Preserve player identity links, filters, calculations, permissions, and translated labels.

### Clubs

Project: `frontend-pages-club`. Source: [club feature][clubs]; [routes][club-routes].

- DR-012: `/clubs/:clubId`. Cover club information, players, teams, schedule, tournaments, and their filters/cards.
  Start with one tab; do not migrate every tab in a single patch.
- DR-013: the team-builder tab and its dialogs, survey import/editing, player chips, settings, and sub-event selection.
  Include relevant team-edit interactions; split the builder and individual dialogs into child tasks.
- DR-014: `/clubs/:clubId/teams/:teamId`. Cover team information, players table, encounters, and relevant edit actions.
- DR-014 discovery from DR-004 verification: the consumer's existing `text-4xl`/`truncate` team title clips at 390px
  in both themes. Shared hero and action bounds pass. Address title wrapping when migrating the team page.
- Preserve team selection, survey handling, drag/drop or equivalent interactions, and data-editing behavior.

### Competition

Project: `frontend-pages-competition`. Source: [competition feature][competitions]; [routes][competition-routes].

- DR-015: `/competition/:competitionId`. Cover metadata, actions, grouped sub-events, and draw links. The [standalone
  sub-events page][sub-events] exists in source but is not mounted by the current feature routes. Verify whether it has
  consumers before including migration or retirement; do not add a new route.
- DR-016: `/competition/:competitionId/sub-events/:subEventId/draws/:drawId`. Cover poule/qualification presentations
  and encounter cards.
- DR-017: `/competition/assembly`. Cover player assembly and partner combinations.
- DR-018: `/competition/:competitionId/edit`. Cover information, dates, and settings; split by form section.
- Preserve calculations, draw/encounter navigation, synchronization controls, and permission-dependent actions.

### Tournament browsing and editing

Project: `frontend-pages-tournament`. Source: [tournament feature][tournaments]; [routes][tournament-routes].

- DR-019: `/tournament/:tournamentId` and `/tournament/club/:clubId`. Cover tournament information and club tournament
  browsing as separate child tasks.
- DR-020: `/tournament/create` and `/tournament/:tournamentId/edit`. Cover information and settings forms; do not change
  creation or save semantics.

### Tournament enrollment

Parent: DR-021. Project: `frontend-pages-tournament`. Split into child tasks before implementation:

- `/tournament/:tournamentId/enroll`: filters, sub-event selection, cart, and partner-selection dialog.
- `/tournament/:tournamentId/sub-events/:subEventId/enroll`: sub-event-specific enrollment.
- `/tournament/:tournamentId/my-enrollments`: existing registrations and available actions.
- Preserve eligibility, validation, selections/cart state, partner handling, and submission/cancellation behavior.
- Existing [enrollment documentation][enrollment-docs] is context, not a reason to change the workflow during styling.

### Tournament draws

Parent: DR-022. Project: `frontend-pages-tournament`.

- `/tournament/:tournamentId/sub-events/:subEventId/draws/:drawId`.
- Cover the draw page, games, knockout tree, and standings table, splitting each view if needed.
- Preserve the full-width layout, score/result meaning, navigation, and any pan/zoom interaction.
- DR-022 discovery from DR-004: the existing bracket-tree body overflows at 390px and 1280px while the shared hero
  and its actions fit. At 1280px the bracket host is 1302px wide and extends to x=1284. Investigate bracket sizing
  with DR-006; do not hide this by clipping the page or changing shared headings.

### Tournament administration

Projects: `frontend-pages-tournament`, with shared controls where already used. All three areas live under
`/tournament/:tournamentId/admin`.

- DR-023: enrollment management and check-in tabs, one child task per tab.
- DR-024: draw management and scheduling tabs, one child task per tab.
- DR-025: settings, general settings, sub-events, and phase controls.
- Treat any shared admin tab shell change as an explicit cross-tab dependency.
- Preserve permissions, confirmations, validation, live state, and destructive-action safeguards.

### Tournament live displays

Parent: DR-026. Project: `frontend-pages-tournament`. Use one child task per display:

- `/tournament/:tournamentId/live/courts`.
- `/tournament/:tournamentId/live/results`.
- `/tournament/:tournamentId/live/upcoming`.
- `/tournament/:tournamentId/live/kiosk`.
- `/tournament/:tournamentId/live` currently redirects to `courts`; keep that behavior.
- Preserve public access, refresh/update behavior, kiosk cycling, and readability at display distances. Check
  large-screen use as well as mobile/desktop layouts.

### Global administration and synchronization

Projects: `frontend-pages-admin` and `sync-admin`. Source: [admin feature][admin], [sync feature][sync-admin]; [admin
routes][admin-routes] and [sync routes][sync-routes].

- DR-027: `/admin`, its search-indexing form, operation feedback, information, and the parent tab layout.
- DR-028: the sync dashboard embedded in `/admin`, including overview, cron jobs, sync plans, and ranking systems.
- Team matching exists in the sync library. Its own `dashboard` and `team-matching` routes are not mounted in the
  current root routes, and the admin team-matching tab is commented out. Record this as a deferred surface, not
  permission to expose it.
- Split sync tabs and team matching into child tasks. Preserve operational controls and live progress feedback.
- Do not run indexing, sync, cron, or other administrative mutations as part of visual verification.

## Remaining project coverage

- `app`: bootstrap, global theming, and route integration; covered by DR-001, DR-003, and DR-029.
- `frontend-components`: all existing visual areas are assigned to DR-003 through DR-007.
- `frontend-modules-theme`: covered by DR-001 and DR-029, with switching checked in each relevant slice.
- `frontend-modules-translation`: selection UI is covered by DR-003; preserve localization throughout.
- `frontend-modules-auth`: no standalone redesign screen identified; preserve login and permission behavior.
- `frontend-modules-graphql`, `frontend-modules-seo`, and `frontend-utils`: no independent visual redesign target.
  Preserve their data, metadata, SSR, and utility behavior; do not refactor them for visual cleanup.
- `app-e2e`: grow focused regression checks alongside implementation; final cross-area coverage is part of DR-029.
- Shared models, translations, backend/API/worker projects, and infrastructure are outside this visual redesign, except
  directly necessary localized UI copy or a separately scoped prerequisite.

## DR-029: final cleanup

- Search all consumers before removing old gradients, `g-*`/`t-*` styling, custom tokens, or component overrides.
- Revisit the inverted dark palette only as an explicit, separately reviewable theme change with consumer coverage.
- Remove only unused global rules and stylesheets. Do not delete compatibility styling still used by deferred screens.
- Check all migrated routes, shared overlays, translations, theme persistence, and SSR/hydration.
- Record any remaining justified styling exceptions and remaining unmigrated surfaces.

## Progress, evidence, and discoveries

DR-005e navigation also logged `InvalidStateError: Transition was aborted because of invalid state` while routes
still loaded. No global transition change was made; investigate only if reproducible in the relevant route/shell
follow-up. This is not a claimed clean-console or exhaustive hydration pass.

DR-001 established the baseline; DR-002 and DR-003 implemented the homepage and shell. [DR-004][heading-work-item]
records the approved shared layout, native homepage table composition, and explicitly requested neutral canvas.
Its implementation evidence records passing focused tests, lint, application build, and live light/dark narrow/wide
checks. This continuation reproduced the focused tests (Nx cache hit), the homepage's four theme/viewport cases,
and seven hero consumers' four-case geometry checks in the integrated browser. Homepage contrast, table scrolling,
drawer keyboard/focus return, and dark preference after reload pass. Two safe homepage screenshots were reviewed;
no feature-data screenshots were committed. A later SSR timeout/HTTP 500 was resolved before this resume; the three
mounted page-header consumers now pass all 12 theme/viewport cases. The user then supplied a tournament URL, and its
detail and linked draw heroes passed eight more shared-boundary checks. A homepage-local row token resolves the
requested table/card background mismatch; five homepage tests, homepage lint, and the library build pass. The user
approved the final canvas/table treatment on 2026-10-16; whole feature bodies are not claimed as migrated. Broader
shared-library ranking-progress/bracket-tree test failures remain outside this slice.

### DR-004 verification prerequisites discovered on 2026-10-16

- Resolved: the user enabled integrated-browser tools. Successful checks followed the shared player route and its
  existing links; do not repeat anonymous broad collection discovery or resume terminal-driven browser automation.
- Resolved: the earlier SSR timeout/HTTP 500 did not recur during resumed player, editing, head-to-head, admin, and
  homepage navigation. Its cause remains uninvestigated; no server or backend changes were needed for this pass.
- Resolved: the user supplied an approved tournament detail URL. Its existing links supplied a draw URL, and both
  heroes passed their four-case checks. No collection discovery or operational mutations were needed.

The homepage template and existing test now contain the scoped row-token correction and its assertion. The global
table preset, logged-in ranking header, feature bodies, dependencies, and operational state remain unchanged.
No styling exception was introduced. DR-004's final user visual approval remains recorded independently.

That statement completes DR-004 only. DR-002 is also complete; its focused tests and visual review are recorded in
the [home pilot brief][pilot].

Reuse rounded native card surfaces with semantic borders, readable shared headings, and a flat preset-owned canvas.
Do not reintroduce ambient gradients or custom table styling. Keep sensitive data out of committed screenshots/logs.

When splitting an item, add child rows to the registry with their own status and brief. Keep the parent row and mark it
done only after its required children pass review. Add new routes or newly discovered UI surfaces here rather than
silently expanding the active task.

[baseline]: work-items/DR-001-design-baseline.md
[pilot]: work-items/DR-002-home-pilot.md
[shell-work-item]: work-items/DR-003-app-shell.md
[heading-work-item]: work-items/DR-004-shared-headings.md
[tier-badge-work-item]: work-items/DR-005a-tier-badge.md
[form-sequence-work-item]: work-items/DR-005b-form-sequence.md
[preset]: ../../apps/app/config/theme.preset.ts
[app-config]: ../../apps/app/config/app.config.ts
[styles]: ../../apps/app/src/styles.scss
[theme-styles]: ../../apps/app/src/styles/theme.scss
[theme-service]: ../../libs/frontend/modules/theme/src/theme.service.ts
[root-routes]: ../../apps/app/config/app.routes.ts
[home]: ../../libs/frontend/pages/home/src/pages/home
[shell]: ../../libs/frontend/components/shell
[layouts]: ../../libs/frontend/components/layout
[language-selection]: ../../libs/frontend/modules/translation/selection
[hero]: ../../libs/frontend/components/hero
[page-header]: ../../libs/frontend/components/page-header
[section-header]: ../../libs/frontend/components/section-header
[breadcrumb]: ../../libs/frontend/components/breadcrumb
[stat-card]: ../../libs/frontend/components/stat-card
[tier-badge]: ../../libs/frontend/components/tier-badge
[form-sequence]: ../../libs/frontend/components/form-sequence
[sparkline]: ../../libs/frontend/components/sparkline
[ranking-progress]: ../../libs/frontend/components/player-ranking-progress
[games]: ../../libs/frontend/components/games
[match-row]: ../../libs/frontend/components/match-row
[upcoming-match]: ../../libs/frontend/components/upcoming-match
[bracket-tree]: ../../libs/frontend/components/bracket-tree
[country-state]: ../../libs/frontend/components/country-state
[sync-controls]: ../../libs/frontend/components/sync
[club-search]: ../../libs/frontend/components/club-search
[players]: ../../libs/frontend/pages/player/src
[player-routes]: ../../libs/frontend/pages/player/src/lib.routes.ts
[clubs]: ../../libs/frontend/pages/club/src
[club-routes]: ../../libs/frontend/pages/club/src/lib.routes.ts
[competitions]: ../../libs/frontend/pages/competition/src
[competition-routes]: ../../libs/frontend/pages/competition/src/lib.routes.ts
[sub-events]: ../../libs/frontend/pages/competition/src/pages/sub-events
[tournaments]: ../../libs/frontend/pages/tournament/src
[tournament-routes]: ../../libs/frontend/pages/tournament/src/lib.routes.ts
[enrollment-docs]: ../enrollment-frontend-architecture.md
[admin]: ../../libs/frontend/pages/admin/src
[admin-routes]: ../../libs/frontend/pages/admin/src/lib.routes.ts
[sync-admin]: ../../libs/frontend/pages/sync-admin/src/lib
[sync-routes]: ../../libs/frontend/pages/sync-admin/src/lib/lib.routes.ts
