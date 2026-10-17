---
title: 'Design refresh backlog'
description: 'Persistent status registry and frontend area inventory for the incremental redesign.'
---

## Current focus

DR-005b is Done at the user's explicit request on 2026-10-17 after the verification limits were presented.
The shared form sequence uses native success/danger tags; four focused tests and shared-library lint/build pass.
There is no production caller, so no routed/SSR visual pass is claimed. The light screenshot/computed-color
discrepancy remains a documented coverage limit, not a resolved technical finding. The temporary preview was removed
and the original player route, dark theme, and 1487x1252 viewport restored.
Next action: scope one remaining DR-005 child, with sparkline the next candidate; inspect its consumers and create
its brief before implementation. No next child has been started.
DR-005 remains open for its other unscoped components; shared stat-card also has no production caller.

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
| DR-006                      | Shared games, matches, and brackets             | Backlog |
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
- DR-005a scopes only the shared tier badge and its five consumer groups; the other DR-005 patterns remain unscoped.
  Keep the global rank-gradient token because other components still consume it. Its `match-row` call site has no
  production import; the inspected club/team and tournament poule routes did not render level badges with available
  safe data. See the [DR-005a brief][tier-badge-work-item] for exact test, browser, and review status.
- DR-005b scopes the form sequence only. It has no production caller; focused Angular tests cover its rendering
  contract and isolated native-tag markup supplies limited theme/viewport evidence. See its
  [brief][form-sequence-work-item] for user approval and the retained screenshot limitation. Stat-card, sparkline,
  and ranking progress remain unscoped; do not add a consumer solely for design verification.
- DR-006: [games][games], [match row][match-row], [upcoming match][upcoming-match], and [bracket tree][bracket-tree].
  Keep score readability, result meaning, and responsive draw behavior.
- DR-007: [country/state controls][country-state] and [sync controls][sync-controls]. Preserve validation,
  disabled/loading states, and operation feedback. The [club-search area][club-search] currently contains service logic,
  not a visual component to redesign.
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
