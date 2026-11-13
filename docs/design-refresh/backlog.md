---
title: 'Design refresh backlog'
description: 'Persistent status registry and frontend area inventory for the incremental redesign.'
---

## Current focus

DR-013a Team-builder settings dialog is Done with explicit approval
(`Approve and commit DR-013a with disclosed limits`, 2026-11-13)
([brief](work-items/DR-013a-builder-settings.md)): six native fluid InputNumbers with associated labels/four help texts,
native Divider, localized existing title and responsive dialog sizing. Club lint/build pass; the accessibility
regression passes with the existing tournament zoneless setup used by a temporary test config.
The default club test setup fails before tests because `zone.js` is missing (DR-059).
Browser-checked Dutch, light/dark at 1440px and 390px, labels, numeric adjustment, focus containment and cancel;
no settings/team save performed. Existing light Save contrast fails (3.65:1, DR-033), as do spinner icons
(2.67:1 light / 2.26:1 dark, DR-058). Not checked: fr/en browser, live save or dedicated SSR/hydration.
The approval accepts these disclosed limits without changing unchecked checks into passes and authorizes the scoped
commit. Keep DR-013 open. Next candidate, not started: DR-013b (scope its toolbar/layout/pools before implementation).

### Previous focus: Club tournaments tab (DR-012g)

DR-012g Club tournaments tab is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits ([brief](work-items/DR-012g-club-tournaments-tab.md)): the "Toernooien" tab of `/clubs/:clubId` (`app-club-tournaments-tab`) shows a counted heading, create button and native `p-table` (name link, official `p-tag`, localized phase tags from `all.tournament.phases.*`) directly on the tab panel with no nested Card (the same Card removal was applied to the DR-012e roster tab after review), native `p-message` error/empty states, a skeleton, nl/fr/en error copy and no SCSS; the service guards `value()` with `hasValue()`. Lint and build pass; browser-checked empty state and the table (stubbed GraphQL response, the dev DB has no club-linked tournaments) in dark wide and light 390px (before the Card removal; dark wide re-checked after). Not verified: real data, loading/error in the browser, keyboard/contrast, fr/en, tests. DR-012 parent is Done (children a-g; team builder is DR-013). Committed. Next candidate, not started: DR-013 club team builder or DR-014 club team detail; DR-029 must wait for unmigrated player/club pages.

### Previous focus: Club schedule tab (DR-012f)

DR-012f Club schedule tab is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits ([brief](work-items/DR-012f-club-schedule-tab.md)): the "Programma" tab of `/clubs/:clubId` (`app-club-schedule-tab`) now follows the player profile pattern (plain h2 with a tabular count above the shared encounter cards, no outer Card so borders are not doubled, no green/blue palette icons), `xl` viewport columns, native `p-message` error/no-teams/empty states, semantic skeletons and nl/fr/en copy under `all.club.detail.schedule.*`; `hasValue()` guards in the schedule and teams services let the error state render. Lint and build pass; browser-checked dark wide and dark 390px after review rework (no overflow; light not re-checked). Not verified: loading/error/empty in the browser, keyboard/contrast, fr/en, tests. Committed. Next candidate, not started: DR-012g club tournaments tab. DR-012 stays open until DR-012g is done.

### Previous focus: Club player roster tab (DR-012e)

DR-012e Club player roster tab is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits ([brief](work-items/DR-012e-club-player-roster-tab.md)): the `/clubs/:clubId` "Spelerslijst" tab replaces the per-player card grid with one native `p-card` holding a count, search `p-iconfield`, team `p-multiselect` and a sortable, paginated `p-table` (avatar, name link, member id, team tags linking to team pages, own-row highlight), native `p-message` error/empty/filtered-empty states, nl/fr/en copy under `all.club.detail.players.*`, and no SCSS. Lint and build pass; browser-checked dark 1024px, light wide and light 390px with search, team filter and paginator reset. Not verified: own-row highlight, loading/error in the browser, keyboard/contrast, fr/en, tests. Committed. Next candidate, not started: DR-012f club schedule tab. DR-012 stays open until DR-012e to DR-012g are done.

### Previous focus: Club teams tab (DR-012d)

DR-012d Club teams tab is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits ([brief](work-items/DR-012d-club-teams-tab.md)): the `/clubs/:clubId` teams tab (`app-club-teams-tab`, `app-team-filter-bar`, `app-team-card`) uses native `p-card`, `p-selectbutton`, `p-table` (fixed colgroup so every team shares the same columns, tooltips on E/D/G), `p-tag`, `p-avatar`, `p-message` and `app-form-sequence`, two teams per row from `xl`, nl/fr/en copy under `all.club.detail.teams.*`, and no SCSS. Shared `app-form-sequence` tags are now equal width. Lint, build and form-sequence specs pass; browser-checked dark wide and 390px. Not verified: light wide, signed-in edit/own-row states, empty/loading states, keyboard/contrast, fr/en, card/filter tests. Committed. Next candidate, not started: DR-012e club player roster tab; DR-012 stays open until DR-012e to DR-012g are done.

### Previous focus: Club sidebar cards (DR-012c)

DR-012c Club sidebar cards is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits ([brief](work-items/DR-012c-club-sidebar-cards.md)): the `/clubs/:clubId` aside has two native `p-card`s with nl/fr/en copy and no SCSS. Upcoming fixtures use a time rail with stacked home/away teams, top-performer rank numbers are gone, the club info card was removed (the hero carries that data) and top-performer links now go to `/players/:slug`. Lint and build pass; browser-checked dark wide and light 390px. Not verified: light wide, dark 390px, loading/empty states, keyboard/contrast, fr/en, tests. Committed. Next candidate, not started: DR-012d club teams tab; DR-012 stays open until its children are done (tabs DR-012d to DR-012g; team builder is DR-013).

### Previous focus: Club hero stats strip (DR-012b)

DR-012b Club hero stats strip is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits ([brief](work-items/DR-012b-club-hero-stats.md)): the four `[stats]` items of the
`/clubs/:clubId` hero use the competition/tournament stat pattern with a native win-rate Tag and nl/fr/en copy; the page
SCSS is removed. Lint and build pass; browser-checked dark wide, light wide and light 390px (no overflow). Not verified:
dark 390px, keyboard/contrast, fr/en, tests. Committed. Next candidate, not started: DR-012c club tabs and sidebar cards;
DR-012 stays open until its children are done. `HeroStatValueComponent` has no application consumer left (DR-029).

### Previous focus: Club detail page chrome (DR-012a)

DR-012a Club detail page chrome is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits ([brief](work-items/DR-012a-club-page-chrome.md)): the `/clubs/:clubId`
hero identity row, hero actions copy and page-level loading/error, mirroring DR-008c. The hero stats strip and the tabs
are excluded (next children). Implemented: native secondary id Tag, localized season/members/Share/Follow (nl/fr/en),
wrapping actions, native ProgressBar/Message, and `DetailService.club` guarded with `hasValue()` so the error state
renders. Lint and build pass; the loaded hero was browser-checked in dark and light at 1280px and 390px (no overflow)
and the error state renders natively. Not verified: keyboard/contrast, fr/en, tests. Committed. Next candidate, not
started: DR-012b hero stats strip (then the tabs); DR-012 stays open until its children are done.

### Previous focus: Player detail page chrome (DR-008c)

DR-008c Player detail page chrome is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits ([brief](work-items/DR-008c-player-page-chrome.md)): the `/players/:playerId` hero member-id chip is a native Tag, Follow/Edit labels are localized (nl/fr/en), actions wrap, loading/error use native ProgressBar/Message, and the dead page SCSS is removed. Also fixed the error state never rendering (`resource.value()` threw). Lint and build pass; dark wide, light 375px and the error state browser-checked. Not verified: light wide, dark 375px, keyboard/contrast, fr/en, tests. Committed. Next candidate, not started: DR-012 club detail (hero identity and page-level states); DR-029 must wait for the unmigrated club page.

### Previous focus: Player detail sidebar (DR-008b)

DR-008b Player detail sidebar cards is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits
([brief](work-items/DR-008b-player-sidebar-cards.md)): the four legacy sidebar cards on `/players/:playerId` (current
form, season record, toughest match-ups, teams) now use native `p-card`, shared `app-form-sequence`, native Tag/Avatar
and localized nl/fr/en copy; their local SCSS is removed, and the season-record progress bar was dropped at the user's
request. Lint and build pass; dark 1440px and light 375px browser-checked. Not verified: light wide, dark 375px,
loading/empty states, fr/en, keyboard/contrast, tests. Committed. Next candidate, not started: the remaining DR-008 player detail content (hero identity row and
page-level loading/error), then DR-012 club detail. DR-029 must wait for the unmigrated player and club pages.

### Previous focus: Admin reconciliation (DR-027, DR-028)

DR-027 and DR-028 parent reconciliation is Done with explicit approval (`commit`, 2026-11-11; documentation only, no application code changed). DR-028 children a-d are Done with disclosed limits; team matching stays a deferred, unmounted surface (its `/admin` tab is commented out). DR-027's only child is DR-027a; the `/admin` tab shell was unchanged and still renders correctly beside the refreshed tabs. Not verified: light mode, keyboard/contrast and tests for the admin tabs (recorded per child). Committed. Next action: reconcile DR-021 (open only because DR-021i is deferred) and choose the next candidate, DR-029 final cleanup or a Backlog audit item (DR-030 to DR-034).

### Previous focus: Cron jobs tab (DR-028d)

DR-028d Cron jobs tab is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits ([brief](work-items/DR-028d-cron-jobs-tab.md)): refresh button and table in a native Card on `/admin?tab=1`, cron expressions no longer wrap. Lint and build pass; dark wide checked. Not verified: light, 375px, dialogs, keyboard/contrast, tests. Committed. Next action: reconcile parent DR-028 (all children done).

### Previous focus: Sync plans tab (DR-028c)

DR-028c Sync plans tab is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits ([brief](work-items/DR-028c-sync-plans-tab.md)): filters and hierarchy table in native Cards on `/admin?tab=1`, action row wraps at 375px. Lint and build pass; dark 375px and 1024px checked. Not verified: light, dialog, keyboard/contrast, tests. Committed. Next candidate: DR-028d cron jobs tab.

### Previous focus: Sync ranking tab (DR-028b)

DR-028b Sync ranking-systems tab is in Review ([brief](work-items/DR-028b-sync-ranking-tab.md)): table wrapped in a native Card on `/admin?tab=1`. Lint and build pass; dark wide and 375px checked. Not verified: light, dialogs, keyboard/contrast, tests. Approved and committed 2026-11-11 with disclosed limits; status Done. Dashboard tab panels also lose side padding so the three cards share one width. DR-028a was committed (cecbc37f). Next candidate: DR-028c sync plans tab.

### Previous focus: Sync overview (DR-028a)

DR-028a Sync overview section is in Review ([brief](work-items/DR-028a-sync-overview.md)): native Cards, ProgressBar and responsive stats grid on `/admin?tab=1`. Lint and build pass; dark 800px and 375px checked. Not verified: light, active-job bar, retry/details, keyboard/contrast, tests. Not committed. Next candidate: DR-028b ranking tab.

### Previous focus: Admin search indexing (DR-027a)

DR-027a Admin search-indexing tab is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits ([brief](work-items/DR-027a-admin-search-indexing.md)): native Card titles, form layout and ProgressBar on the `/admin` Indexering tab; no indexing is run. Sync tab stays DR-028. Parent DR-021 remains In progress only because DR-021i is a deferred future item; reconcile it separately. Lint and build pass; dark 800px and light 375px checked, no indexing run. Next candidate, not started: DR-028 (Synchronisatie tab, scope one child first); DR-027 stays open until reconciled.

### Previous focus: Live displays aggregate (DR-026)

DR-026 Tournament live displays and kiosk is Done with explicit approval (`commit`, 2026-11-11; documentation only). All four children (DR-026a courts, b results, c upcoming, d kiosk) are Done with disclosed limits, which stay unchecked in their briefs: keyboard/contrast and tests for every display, dark/375px/populated gaps per brief, announcements, and kiosk view cycling. `/tournament/:id/live` still redirects to `courts`. No application code changed. Next action: pick the next candidate from the backlog (DR-027 global administration `/admin`, scope one child first).

### Previous focus: Live kiosk (DR-026d)

DR-026d Live kiosk display is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits: [brief](work-items/DR-026d-live-kiosk.md). Hard-coded slate/rose/emerald palette replaced by semantic colors and native `p-card`/`p-tag`/`p-message`; cycling, clock and stats kept. Lint and build pass; light/dark wide empty state browser-checked. Not verified: populated views, announcements, 375px, keyboard/contrast, tests. Next candidate, not started: reconcile parent DR-026.

### Previous focus: Live upcoming (DR-026c)

DR-026c Live upcoming display is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits ([brief](work-items/DR-026c-live-upcoming.md)): shared header (breadcrumb + hero), new presentational `app-live-game-card` following the profile game cards (time rail, players per side, court column, two columns from `xl`), SSR guard in the live service. Lint and build pass; browser-checked light/dark wide and dark 375px. Not verified: announcements, light 375px, keyboard/contrast, tests, live courts/results with the reworked header. Next candidate, not started: DR-026d kiosk.

### Previous focus: Live results (DR-026b)

DR-026b Live results display is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits ([brief](work-items/DR-026b-live-results.md)): shared header, native Card/Tag, palette colors removed. Lint passes; browser-checked light wide/375px with fixture data. Compact multi-column grid for TV. Not verified: dark, empty state, 375px after compaction, build, keyboard/contrast, tests. Next candidate, not started: DR-026c upcoming, then DR-026d kiosk.

### Previous focus: Live courts (DR-026a)

DR-026a Live courts display is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits (keyboard/contrast, dark 375px populated, no tests) ([brief](work-items/DR-026a-live-courts.md)): native Card/Tag, shared
`app-live-display-header`, palette/inline colors removed. Lint/build pass; browser-checked with client-side fixture data (dark/light wide, light 375px). Next candidate, not started: DR-026b results, then DR-026c upcoming adopt the header; then DR-026b results and DR-026c upcoming adopt the header, DR-026d kiosk.

### Previous focus: Draws and scheduling aggregate (DR-024)

DR-024 Tournament admin draws and scheduling aggregate is Done with explicit approval (2026-11-11, documentation only):
[brief](work-items/DR-024-admin-draws-scheduling.md). DR-024a and DR-024b and all their children are Done with disclosed
limits, which stay unchecked in the child briefs. Approval retains the unchecked aggregate verification. Next candidate, not
started: DR-026 tournament live displays and kiosk (scope one display as a child first).

### Previous focus: Settings aggregate (DR-025)

DR-025 Tournament admin settings aggregate is reconciled as Done (documentation only, 2026-11-11): [brief](work-items/DR-025-admin-settings.md).
All children (DR-025a/b/c) are Done with disclosed limits, which stay unchecked in the brief (light theme,
keyboard/contrast, live mutations, previous-phase dialog). Next candidate, not started: DR-026 tournament live displays
and kiosk (scope one display as a child first), or reconcile parent DR-024.

### Previous focus: Settings confirmations (DR-025c)

DR-025c Settings confirmations and shared error feedback is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits: [brief](work-items/DR-025c-settings-confirmations.md).
Native `p-confirmdialog` for next/previous phase and sub-event delete, plus one shared error `p-message` in the tab
(removed from General settings); nl/fr/en keys added. Lint and build pass; browser-checked (Dutch, dark, wide and 375px): phase-next and sub-event delete dialogs.
Not verified: light theme, previous-phase dialog, error display, accepting a mutation, keyboard/contrast, tests.
Next candidate, not started: reconcile parent DR-025.

### Previous focus: Settings sub-events (DR-025b)

DR-025b Settings sub-events table and dialog is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits: [brief](work-items/DR-025b-settings-sub-events.md). Native
`p-panel`, `p-tag`, localized Any/Yes/No/Edit/Delete (new `settings.any` key nl/fr/en), palette classes removed.
Lint and build pass. Browser-checked (Dutch, dark, wide and 390px; fixed Panel overflow and raw select keys). Not verified: light theme,
keyboard/contrast, live create/edit/delete. Not committed. Next: authenticated browser review of DR-025a/b.

### Previous focus: Settings phase and general (DR-025a)

DR-025a Settings phase stepper and general settings is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits: [brief](work-items/DR-025a-settings-phase-general.md).
Both sections use a native `p-panel`, native stepper labels and plain form markup; lint and build pass, dark wide/390px
browser-checked. Mobile uses a ProgressBar summary below `lg`. Not verified: light theme, keyboard/contrast, live save/phase change.
4 existing `draws-tab`/`draw-locales` spec failures are pre-existing. Next candidate, not started: DR-025b sub-events.

### Previous focus: Scheduling aggregate (DR-024b)

DR-024b Scheduling aggregate is Done with explicit approval (2026-11-11) and disclosed limits:
[brief](work-items/DR-024b-admin-scheduling.md). No application code changed. DR-024 stays open until its remaining
children are reconciled. Next candidates, not started: expose/verify slot generation and auto-scheduling (backend,
needs explicit authorization), or DR-025 tournament admin settings and phase controls.

### Previous completed focus: Scheduling confirmations (DR-024b6)

DR-024b6 Scheduling confirmations and copy is Done with explicit approval (`commit`, 2026-11-11) and disclosed limits: [brief](work-items/DR-024b6-schedule-copy.md).
Publish/delete `window.confirm()` prompts become native localized `p-confirmdialog`s and the English "TBD"/"vs" game
name is localized (nl/fr/en). 30 focused tests, lint and build pass. Browser-checked: Publish confirmation
(Dutch, dark wide, dark/light 375px). Not verified: light wide, keyboard/contrast, live publish, delete dialog (no
template caller). Next candidate, not started: expose/verify slot generation. Keep DR-024b/DR-024 open; slot generation exposure stays a separate candidate.

### Previous completed focus: Scheduling dialogs (DR-024b5)

DR-024b5 Scheduling dialogs is Done with explicit approval on 2026-11-11 and disclosed verification limits:
[dialogs brief](work-items/DR-024b5-schedule-dialogs.md).
Generate and Auto-schedule dialogs are presentational components with native forms and localized nl/fr/en copy.
The Generate dialog gains a venue select so courts can be chosen when none are linked to the tournament.
27 focused tests, lint and build pass; Generate dialog browser-checked (Dutch/dark/wide).
Not verified: Auto-schedule dialog in a browser, light/narrow, keyboard/contrast, live mutations (`generateTimeSlots`
is not exposed by the API). Next candidate, not started: expose/verify slot generation, then DR-024b6 remaining English
copy (`confirm()` texts). Keep DR-024b/DR-024 open.

### Previous completed focus: Scheduling grid and game panel

DR-024b4 Scheduling grid/game panel is Done with explicit approval and disclosed verification limits: [grid brief](work-items/DR-024b4-schedule-grid.md).
Native table/Card/Panel/Tag with presentational `app-schedule-slot` and `app-schedule-game-card`; smart tab keeps
drag-and-drop and mutations. Palette colors removed; eight locale keys added. 20 focused tests, lint and build pass.
Browser-verified with a client-only fixture (dark wide, light 390px). Not verified: drag/drop, keyboard/contrast, new component tests. Not committed.
The user approves completion and commit on 2026-11-11. Unperformed checks stay unchecked: drag-and-drop,
block/unblock/remove clicks, keyboard/contrast, new slot/game-card component tests, 24-court and light-wide checks.
Next candidate, not started: DR-024b5 Generate/Auto-schedule dialogs and remaining English copy. Keep DR-024b/DR-024 open.

### Previous completed focus: Scheduling controls

DR-024b3 Scheduling filters/actions is Done with explicit approval and disclosed verification limits:
[controls brief](work-items/DR-024b3-schedule-controls.md).
Confirmed normally mounted authorized Scheduling consumer on 2026-11-10,
Dutch/dark/1355x1249, visible document and genuine empty data.
Scope only date filter/actions, consumed locale copy and focused tests.
Preserve handlers, count/updating gates, read states and panel visibility.
Exclude approved summary, grid, dialogs, operations, backend/schema and shared/global styling.
Native Toolbar, localized names/expansion, associated date label and named date templates are implemented.
All 20 focused tests pass fresh; tournament lint/build pass 12 tasks with ten cache replays.
Four Dutch/light-dark/390-1440px cases pass control/document containment.
Enabled text/icon contrast passes: minimum 4.87:1 light and 5.47:1 dark.
Tab/focus-visible, Enter panel toggle and pointer date selection/current-date refresh/Delete clear are checked.
Complete keyboard-only date selection remains unverified after one fixture timeout.
Static tokens fall 21 to 14 in controls, 521 to 514 overall; no new styling layer or wrapper.
DR-054 records inherited option narrowing/read-remount focus loss; DR-037 retains native feedback localization.
Original Dutch/dark/1355x1249/Scheduling, All Dates, games panel open and genuine zero reads are restored.
Keep full-suite/app/backend build, locale browser matrix, exhaustive accessibility/live operations
and SSR/hydration unclaimed. No operational browser writes.
The user selects "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-10.
Approval covers only these controls/tests/handoff, not unperformed checks or whole-tab acceptance.
Post-approval workspace lint passes all 34 projects with existing warnings and zero errors;
29 tasks replay cache and five execute. No fresh full-workspace lint execution is claimed.
Commit only this approved slice without pushing.
Exact next action in a fresh invocation: scope DR-024b5 dialogs on its real mounted consumer.
Do not begin another implementation slice here.
Keep DR-024b and DR-024 open.

### Previous completed focus: Scheduling summary

DR-024b2 Scheduling summary is Done with explicit approval and disclosed verification limits:
[summary brief](work-items/DR-024b2-schedule-summary.md).
Confirmed normally mounted authorized Scheduling consumer on 2026-11-09, Dutch/dark/1355x1249,
visible document and genuine empty data. Six decorative tiles are replaced with a native Panel,
semantic counts and localized labels/descriptions. Service/date/read-state behavior is preserved.
Exclude filters, grid, dialogs, operations, backend/schema and shared/global styling.
All 15 focused tests pass fresh; tournament lint/build pass 12 tasks with six cache replays.
Four Dutch/light-dark/390-1440px browser cases pass with no summary/document overflow.
Summary text contrast passes: minimum 4.87:1 light, 6.65:1 dark; semantic region/terms add no tab stops.
Static summary tokens fall 240 to 22; whole template 739 to 521. No new styling layer or wrapper.
API translation declarations regenerate only the six new string keys; retain them in this scope.
Original Dutch/dark/1355x1249/Scheduling is restored; no fixture or operational write.
Keep full-suite/app/backend build, populated/read-state browser, exhaustive accessibility,
three-locale browser and SSR/hydration checks unclaimed; test-backed states are identified in the brief.
The user selects "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers only this summary, tests and repository handoff, not unperformed checks or whole-tab acceptance.
Post-approval workspace lint passes all 34 projects with existing warnings and zero errors;
21 tasks replay cache and 13 execute. No fresh full-workspace lint execution is claimed.
Commit only this approved slice/handoff without pushing.
Exact next action in a fresh invocation: scope DR-024b3 filters/actions on its real mounted consumer.
Keep DR-024b and DR-024 open; no other implementation slice in this invocation.

### Previous completed focus: Scheduling read/error prerequisite

DR-024b1 Scheduling read/error prerequisite is Done with explicit approval and disclosed limits:
[read/error prerequisite](work-items/DR-024b1-schedule-read.md).
The user explicitly approved the independent read-API/error-handling repair after the initial
[access/schema blocker check](work-items/DR-024b-admin-scheduling.md).
Only consumed reads and relation fields are registered; dormant operational mutations remain unexposed.
Courts use active event/venue memberships; player reads use `gamePlayer`, not the scalar `player`.
Resource failures/malformed payloads are explicit and retryable; loading/error hide empty summaries and actions.
All 20 focused tests pass. Scoped lint/build pass all 19 tasks (17 cache replays);
API development build passes all 16 tasks by cache replay.
The exact source read returns HTTP 200 against port 5000 with and without a date; genuine counts are 0/0/0.
Static class/styleClass tokens fall 742 to 739 and one inline loading style is removed; no new styling layer.
The supplied tournament is subsequently observed in `DRAWS_MADE`, without an assistant phase/data mutation.
Its authorized Scheduling route now mounts normally; the earlier phase gate is no longer the blocker.
The initial stale frontend blocker is resolved after the user restarts the frontend.
The actual mounted browser query now contains `tournamentScheduleCourts` and `gamePlayer`, not `location`,
and returns HTTP 200 with genuine empty data at Dutch/dark/1355x1249.
Client-only delayed-read fixture confirms native busy/progress DOM, no controls/selectors and no document
overflow at dark/1440px. HTTP 400 fixture reaches explicit native Message plus Refresh rather than empty success.
Further fixture checks time out while the shared browser reports hidden and Message remains in entry animation.
No four-case theme/width, screenshot, keyboard/contrast, malformed/populated or complete retry browser pass is claimed.
The unauthenticated helper tab cannot establish authorized behavior and is no longer available at cleanup.
All browser routes/fixtures are removed; Dutch/dark/1355x1249/Scheduling and genuine 0/0/0 reads are restored.
The user selects "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers only DR-024b1 repair/tests and its repository handoff, not unperformed checks or whole-tab acceptance.
Post-approval workspace lint passes all 34 projects with existing warnings and zero errors;
30 tasks replay cache and four execute. No fresh full-workspace lint execution is claimed.
Keep the remaining browser/full-suite/live-data/accessibility/SSR criteria unchecked and DR-024b/DR-024 open.
Commit only this approved scope without pushing; do not begin presentation or restart approved Draws children.
Exact next action in a fresh invocation: scope DR-024b2 Scheduling summary and its mounted missing count labels.
Read its real consumer and create its brief before starting; do not begin it in this invocation.
Dummy-data permission is recorded but unused; no assistant operational writes or push are made.

### Previous completed focus: draw-management aggregate

DR-024a draw-management aggregate reconciliation is Done with explicit approval:
[draw management](work-items/DR-024a-admin-draws.md).
All four required children are approved Done; their committed source, focused checks and browser evidence
are reconciled without application changes or restarting completed children.
Confirmed consumer on 2026-11-09: authorized tournament admin Draws tab, Dutch/dark, HE 1,
genuine empty counts 0/0/0/0, four descriptions, no dialog and no document overflow at 1355x1249.
All 127 focused tests and all 16 scoped lint/build tasks pass by Nx cache replay, not fresh execution.
Normal theme-toggle click times out after 3000ms while the shared browser reports hidden.
No fresh screenshot/theme/width/keyboard/overlay or refresh-network pass is claimed.
Keep smart tab/service boundaries; no repeated live domain consumer justifies extraction.
Exclude scheduling, other tabs, backend/schema, global/shared styling and operational browser writes.
Retain DR-033/DR-034 contrast failures, DR-052/DR-053 follow-ups and all unperformed full-suite/app-build,
populated real operation/permission, exhaustive accessibility and SSR/hydration checks.
Only three handoff documents change; no new styling layer, wrapper or exception.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers only this three-document aggregate handoff; failed/unperformed checks remain unchecked.
Commit only this approved scope without pushing; keep DR-024 open.
Exact next action in a fresh invocation is DR-024b: confirm a currently permitted mounted Scheduling consumer
and its recorded read-schema/HTTP 400 prerequisite before scoping. Current snapshot has Scheduling disabled;
do not enable gated tabs or mutate phase/permissions for verification.
Do not start DR-024b or another implementation slice in this invocation.

### Previous completed focus: draw dialogs and locales aggregate

DR-024a4 aggregate reconciliation is Done with explicit approval:
[draw dialogs and locales](work-items/DR-024a4-draw-dialogs-locales.md).
Three approved children are committed as `6ec04b39`, `91ca230c` and `ecbfe7fd`.
Combined source, focused tests and child evidence are reconciled on 2026-11-09; no application edits are needed.
All 127 focused tests and all 16 scoped lint/build tasks pass by Nx cache replay, not fresh execution.
Actual authorized Draws DOM confirms Dutch/dark/HE 8-9 with genuine counts 2/0/2/0 and four descriptions.
Fresh click/screenshot actionability checks time out while the shared page remains hidden, including after
desktop resize and bringToFront. No new visual/theme/width/keyboard or refresh-network pass is claimed.
Original 1355x1249/Dutch/dark/HE 8-9/Draws are restored; no dialog, selection, fixture or operational write.
Keep child three-locale/theme/width/overlay/feedback evidence attributed to its original verification.
Retain DR-033/DR-034 contrast failures, cached build warnings and unperformed full-suite/app-build,
live-operation/permission, exhaustive accessibility and SSR/hydration checks.
Only four handoff documents change; no new component, wrapper, styling layer or exception.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers only this four-document aggregate handoff; failed/unperformed checks remain unchecked.
Commit only this approved handoff without pushing.
Exact next action in a fresh invocation: reconcile DR-024a draw-management aggregate across its required
children, retaining all accepted limits. Do not begin it here. Keep DR-024a and DR-024 open.

### Previous completed focus: mounted draw locales

DR-024a4c is Done with explicit approval: [mounted draw locales](work-items/DR-024a4c-draw-locales.md).
Actual authorized Draws tab reconfirmed on 2026-11-09 with HE 8-9 and two genuine unassigned entries.
Summary descriptions, consumed French terminology, identity/type labels, native confirmations and
five mounted local operation fallbacks are implemented. Payloads, selection, server diagnostics and layout remain.
Exclude unused copy/methods, other tabs, backend/schema, shared/global styling and browser operational writes.
All 127 focused tests and scoped lint/build pass; 33 new asset-backed cases cover all three locales.
Twelve locale/theme/390/1440px populated cases, 36 settled overlays, nine canceled native confirmations
and 60 client-only feedback fixtures pass. No operational browser writes are performed.
Static class/styleClass tokens remain 124; no new component wrapper, styling layer or exception.
Retain DR-033/DR-034 contrast failures and unperformed full-suite/app-build, live-operation/permission,
exhaustive accessibility and SSR/hydration checks. Adjacent French labels and draw reliability are DR-052/DR-053.
Original Dutch/dark/1355x1249/HE 8-9/Draws and genuine two-unassigned-entry data are restored; no fixtures remain.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers only this child's implementation/tests/scoped copy/generated keys and repository handoff.
Failed/unperformed checks remain unchecked; approval is not evidence that they passed.
Post-approval workspace lint passes all 34 projects with existing warnings and zero errors;
22 tasks replay cache and twelve execute. No fresh full-workspace lint execution is claimed.
Commit only this approved scope without pushing.
Exact next action in a fresh invocation: reconcile DR-024a4 aggregate evidence across its three approved children.
Do not begin aggregate reconciliation or another implementation slice here.
Keep DR-024a4, DR-024a and DR-024 open; no sibling implementation in this invocation.

### Previous completed focus: creation dialog

DR-024a4b is Done with explicit approval: [creation dialog](work-items/DR-024a4b-creation-dialog.md).
Actual authorized Draws tab and both mounted Create Draw actions confirmed on 2026-11-09.
User explicitly selected removal of ignored gender/level controls; preserve selected sub-event/API.
Native responsive name/type/optional-size form, scoped translations, labels/focus and operation states are implemented.
Exclude backend/schema, other tabs, shared/global styling and operational browser writes.
The pre-existing enrollment template edit was committed externally; this slice did not touch or stage it.
All 94 focused tests pass freshly; scoped tournament/translation lint/build pass (final 16-task cache replay).
Four light/dark 390/1440px layouts and type/size overlays fit; selection, clear, keyboard and return focus pass.
Four browser-only pending/error signal fixtures fit and guard dismissal without operational submissions.
Static class/styleClass tokens fall 168 to 124 overall and 61 to 17 in creation; no new styling or wrapper.
Retain DR-033 light Create contrast 3.65:1 and DR-034 error Message 4.44/4.40:1 failures.
Full suite, app build, live operations/permissions, populated real reads, alternate browser locales,
exhaustive accessibility and SSR/hydration remain unverified.
API root readiness probe expected 200 but the restarted API returns 404; port 5000 listens and real Draws mounts.
Final automated refresh/network-observation attempts time out; do not claim final GraphQL status/focus verification.
Original Dutch/dark/1355x1249/HE 1 and genuine empty records are restored; no dialog or synthetic records remain.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers only this child implementation/tests/scoped copy and handoff; failed/unperformed checks remain.
Post-approval workspace lint passes all 34 projects with existing warnings and zero errors;
22 tasks replay cache and twelve execute. No fresh full-workspace lint execution is claimed.
Commit only this approved scope without pushing.
Exact next action in a fresh invocation: scope DR-024a4c remaining mounted draw locale completeness.
Do not start it here.
Keep DR-024a4, DR-024a and DR-024 open.

### Previous completed focus: seeding dialog

DR-024a4a is Done with explicit approval: [seeding dialog](work-items/DR-024a4a-seeding-dialog.md).
Split DR-024a4 into seeding, creation and remaining mounted locale children.
Actual authorized Draws tab and visible auto-seed action confirmed on 2026-11-09;
use only one-use safe browser read fixtures for its currently empty real data.
Scope responsive native seeding dialog, translated options, accessible labels/focus and operation states.
Preserve ranking/random/manual payloads and the smart tab/service; no one-off wrapper.
Exclude creation, other tabs, backend/schema behavior, shared/global styling and browser operational writes.
Native responsive Dialog/form/Select/actions, translated options and modal error/pending feedback are implemented.
Ranking/random/manual payloads, defaults/reset, cancellation, failure/retry and success refetch pass mock tests.
74 focused tests and scoped tournament/translation lint/build pass; final lint/build replays 14 of 16 tasks.
Four light/dark 390/1440px layouts and fresh option overlays fit; selection and return focus pass.
Four browser-only pending/error signal fixtures fit and block dismissal/selection; no operational handlers submitted.
Native Dialog registers Escape once without rechecking pending inputs. A visibility-guarded document handler
handles this body-ported dialog; overlay Escape, idle dismissal and pending blocking are verified.
Static class/styleClass tokens fall 171 to 168 overall, 16 to 13 in seeding; no new styling or wrapper.
Retain DR-033 light Apply contrast 3.65:1 default (2.79:1 sampled hover) and DR-034 error Message 4.44/4.40:1.
Full suite, populated real reads, live-operation/permission variants, alternative browser locales,
exhaustive accessibility and SSR/hydration remain unverified.
Final real TournamentAdmin/SubEventDrawsData return 200 without GraphQL errors; refresh retains focus.
Original Dutch/dark/1355x1249/HE 1/Draws and genuine empty records are restored; one-use fixtures expire.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers only this child implementation/tests/scoped copy and handoff; failed/unperformed checks remain.
Post-approval workspace lint passes all 34 projects with existing warnings and zero errors;
29 tasks replay cache and five execute. No fresh full-workspace lint execution is claimed.
Commit only this approved scope without pushing.
Exact next action in a fresh invocation: scope DR-024a4b creation and explicitly resolve its recorded
non-submitted gender/level controls before implementation. Do not start it here.
Keep DR-024a4, DR-024a and DR-024 open; do not start siblings in this invocation.

### Previous completed focus: draw presentation aggregate

DR-024a3 aggregate reconciliation is Done with explicit approval:
[draw filters, assignment and lists](work-items/DR-024a3-draw-presentation.md).
All three required presentation children are approved Done and committed; do not restart their implementation.
Combined source, child evidence and the actual authorized Draws consumer are reconciled on 2026-11-09.
Sixty focused tests and all twelve scoped lint/build tasks pass by Nx cache replay, not fresh execution.
Four genuine-empty light/dark 390/1440px layouts fit; selector keyboard order and HTTP 200 refresh/focus pass.
Prior populated/assignment/no-selection fixture evidence remains attributed to the children, not rerun here.
Retain the existing smart tab/service boundary; no repeated live consumer justifies a one-off dumb wrapper.
Exclude dialogs/locales under DR-024a4, summary, scheduling, backend/schema and shared/global styling.
Retain DR-033/DR-034 contrast failures and unperformed full-suite, populated-real-read,
live-operation/permission, exhaustive accessibility/locale and SSR checks.
Only aggregate/parent handoff documents change; no application implementation, operations or new exceptions.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers only this four-document aggregate handoff; failed/unperformed checks remain unchecked.
Commit only the approved handoff without pushing.
Exact next action in a fresh invocation: scope one DR-024a4 dialog/locale child from its mounted consumer.
Do not begin DR-024a4 or close DR-024a/DR-024 in this invocation.

### Previous completed focus: draw lists and actions

DR-024a3c is Done with explicit approval: [draw lists and actions](work-items/DR-024a3c-draw-lists.md).
Actual authorized Draws consumer reconfirmed on 2026-11-09 at the imported tournament administration route.
Scope native draw Panels/Tables, identity/type/capacity, seeds/names, actions and empty/no-selection feedback.
Native named Panels, scrolling Tables, contextual translated actions and empty/no-selection feedback are implemented.
Completed only surfaced draw-list locale gaps; preserve the smart tab/service without a one-off wrapper.
Exclude summary, filters, assignment, dialogs, scheduling, backend/schema and shared/global styling.
Sixty focused tests and scoped Nx lint/build pass; final build/lint run replays ten of twelve tasks.
Static class/styleClass tokens fall 272 to 171; no extraction, new styling or exception.
Backend reload initially blocked after-browser checks; user restored it on 2026-11-09.
HTTP now responds and the authorized actual Draws route mounts again with genuine-empty HE 1 data.
Four genuine-empty, four synthetic-populated/empty-draw and four synthetic-no-selection theme/390/1440px cases fit.
Native compact Table and unbroken headings correct an observed narrow-header readability issue.
Long names, native scrolling, action names, keyboard order and settled 1px focus outlines pass.
Sampled normal list text passes in both themes; native no-selection info Message fails dark at 4.32:1 under DR-034.
Full suite, populated real reads, live operations/permissions, exhaustive accessibility and SSR remain unverified.
Real TournamentAdmin/SubEventDrawsData return 200; refresh retains focus. No operational browser writes.
Original Dutch/dark/1355x1249/HE 1/Draws preferences and genuine empty records are restored; one-use fixtures expire.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers only this implementation, focused tests, scoped locales/generated type and repository handoff.
DR-034 failure and unperformed checks remain unchecked; approval is not evidence that they passed.
Post-approval workspace lint passes all 34 projects with existing warnings; 21 replay cache and 13 execute.
Commit only this approved scope; do not push.
Exact next action in a fresh invocation: reconcile DR-024a3 aggregate evidence/review from its three approved children,
then scope the next DR-024a4 dialog/locale child from its mounted consumer. Do not start that work here.
Keep DR-024a3, DR-024a and DR-024 open.

### Previous completed focus: unassigned entries

DR-024a3b is Done with explicit approval:
[unassigned entry selection and assignment](work-items/DR-024a3b-unassigned-entries.md).
Actual authorized Draws consumer confirmed on 2026-11-09 at the imported tournament administration route.
Scope only the unassigned Panel, entry/bulk selection, target selector, assignment and related empty messages.
Native named Panel/Table, bulk controls, counted Assign action and bound fluid target selector are implemented.
Retain the smart tab/service without a one-off wrapper; native selection replaces custom toggle markup/logic.
Exclude draw lists, dialogs, scheduling, backend/translations and shared/global styling.
Forty-five focused tests and scoped lint/build pass; ten prerequisite builds replay cache.
Four real-empty and four synthetic-populated theme/390/1440px cases pass without document/control overflow.
Native target overlays, checkbox/row keyboard toggles, bulk selection and Escape/selector focus pass with safe data.
Real DE 1/HE 1 reads and refresh return HTTP 200; refresh retains focus. No operational browser actions are clicked.
Template static class/styleClass tokens fall 357 to 272; no extraction, new style or exception.
Light Assign normal text fails 3.65:1 under existing DR-033; measured remaining normal text passes.
Full suite, populated real reads, live operations/permissions, exhaustive accessibility and SSR remain unverified.
Original dark/Dutch/1355x1249/HE 1/Draws preferences and genuine empty records are restored; one-use fixtures expire.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers only this implementation, focused tests and repository handoff; failed/unperformed checks remain.
Post-approval workspace lint passes all 34 projects from Nx cache with existing warnings and zero errors.
No fresh workspace lint execution is claimed.
Commit only this approved slice/handoff; do not push.
Exact next action in a fresh invocation: scope DR-024a3c draw lists/actions/empty-state presentation
from its mounted consumer before implementation.
Keep DR-024a3, DR-024a and DR-024 open; do not begin siblings in this invocation.

### Previous completed focus: draw filters and actions

DR-024a3a is Done with explicit approval: [draw filters and actions](work-items/DR-024a3a-draw-filters.md).
Actual authorized visible Draws consumer confirmed on 2026-11-09 at the imported tournament administration route.
Split DR-024a3 into filter/actions, unassigned assignment, and draw-list/empty-state children.
Only the top-level sub-event selector and generate/create/refresh group are selected.
Native filter Panel and fluid Select match enrollment/check-in; retain smart tab/service, no one-off wrapper.
Selection, read lifecycle, operational handlers and translated labels are preserved.
Exclude summary, assignment/list/empty panels, dialogs, scheduling, backend, translations and shared/global styling.
Thirty-one focused tests and scoped lint/build pass; ten prerequisite builds replay cache.
Four genuine-empty theme/390/1440px layouts and selector overlays pass without document/control overflow.
Keyboard selector/action order, DE 1 selection/restoration and HTTP 200 refresh with stable focus pass.
No browser operational writes; original dark/Dutch/1355x1249/HE 1/Draws preferences are restored.
Template static class/styleClass tokens fall 363 to 357. No extraction, new style or exception.
Normal label/selector/secondary text contrast passes; light primary Create fails 3.65:1 under existing DR-033.
Full suite, populated live reads, operational/permission checks, exhaustive accessibility and SSR remain unverified.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers only this filter/actions slice, focused tests and repository handoff; failed/unperformed checks remain.
Post-approval workspace lint passes all 34 projects from Nx cache with existing warnings and zero errors.
No fresh workspace lint execution is claimed.
Commit only this approved implementation/tests/handoff; no push.
Exact next action in a fresh invocation: scope DR-024a3b unassigned selection/assignment from its mounted consumer.
DR-024a3, DR-024a and DR-024 remain open. Do not start siblings in this invocation.

### Previous completed focus: draw summary

DR-024a2 is Done with explicit approval: [draw summary presentation](work-items/DR-024a2-draw-summary.md).
Actual authorized visible Draws consumer confirmed on 2026-11-09 at the imported tournament admin route.
Four decorative counters become a native Panel and typed semantic definition-list loop, matching Check-in.
Stats/read behavior and translations are preserved; filters/lists/dialogs, scheduling and global theme are unchanged.
Twenty-two focused tests and scoped lint/build pass; ten build prerequisites replay cache.
Four genuine-empty theme/390/1440px cases pass without document overflow; label contrast is 6.65/4.87 dark/light.
Keyboard selector overlay/Escape and HTTP 200 refresh with stable focus pass; no browser operational writes.
Template class/styleClass tokens fall 512 to 363. Existing smart tab/service boundary is sufficient; no extraction.
Dutch/French blank descriptions and existing French terminology remain for DR-024a4 locale completeness.
Full tournament suite, populated live reads/browser states, exhaustive accessibility and SSR/hydration remain unverified.
Original dark theme, Dutch locale, 1355x1249 viewport, HE 1 selection and Draws route are restored.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers this summary implementation, focused tests and repository handoff only; unchecked limits remain.
Post-approval workspace lint passes all 34 projects from Nx cache; no fresh workspace lint execution is claimed.
DR-024a and DR-024 remain open. Commit only this approved slice/handoff; do not push.
Exact next action in a fresh invocation: split DR-024a3 filters/assignment/draw-list into bounded children,
confirm their actual mounted consumers and select only one. Do not start that child in this invocation.

### Previous completed focus: draw read prerequisite

DR-024a1 is Done with explicit approval: [draw selection and read prerequisite](work-items/DR-024a1-draw-read.md).
Mounted authorized Draws consumer confirmed on 2026-11-09 at the imported completed tournament admin route.
Repaired the nonreactive selector, input replacement and stale assignment reset; real reads now return HTTP 200.
Failed/incomplete reads surface native errors instead of false empty success; loading hides metrics/empty panels.
Native named loading, correctly named selector/refresh and stable asynchronous refresh focus are implemented.
Seventeen focused tests and uncached scoped lint/build pass; ten build prerequisites replay cache.
Four real-empty theme/390/1440px cases and native overlays pass; eight failed/incomplete-read cases pass.
Keyboard DE 1 selection and refresh return HTTP 200; no operational browser writes.
Delayed browser-interception probes time out; only the observed dark/wide loading state is claimed.
Unit tests verify asynchronous recovery and late-response safety; no full delayed-browser matrix is claimed.
Existing generic loading/error/refresh dictionaries pass in all three locales without translation/backend changes.
Static class/styleClass tokens fall 519 to 512; existing decorative/palette markup remains for later children.
Exhaustive accessibility/contrast, full tournament suite, populated real reads, live operations and SSR remain unverified.
Exclude draw styling, dialogs, scheduling, backend/schema changes, shared components and global theme.
Existing smart tab/service split is retained; no genuinely repeated consumer warrants a dumb-component extraction yet.
Original dark theme, Dutch locale, viewport and Check-in route are restored; query interception is removed.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers only this prerequisite, focused tests and repository handoff; unchecked limits remain unchecked.
Post-approval `npx nx run-many --target=lint` passes all 34 projects from cache; no fresh lint execution is claimed.
DR-024a and DR-024 remain open. Commit only this approved slice/handoff; do not push.
Exact next action in a fresh invocation: scope DR-024a2 draw-summary presentation on its actual visible consumer.
Do not restart the approved prerequisite or start another child in this invocation.

### Previous completed focus: administration aggregate acceptance

DR-023 aggregate acceptance is Done with explicit approval:
[administration parent](work-items/DR-023-admin-acceptance.md).
Reconciled approved DR-023a/b/c against committed source (`1a4c2365`, `228e99d3`, `8f262e15`).
Fresh authorized enrollment/check-in consumers are confirmed on 2026-11-09; real phase is COMPLETED.
Scope: documentation and safe aggregate verification only; no new application styling or operational writes.
Twenty-four actual empty locale/theme/390/1440px cases and native status overlays pass.
Both real refreshes return HTTP 200; keyboard tab/status/search and stable refresh focus pass.
Four unsubmitted manual Dialog theme/width cases pass, including disabled invalid submit and Escape/trigger focus.
Scoped tournament tests (18 suites / 288 tests) and lint/build plus ten prerequisites pass from Nx cache.
No fresh test execution or compilation is claimed. Recorded uncached execution remains in DR-023c.
Original browser preferences, route, filters, genuine empty records and closed Dialog are restored; zero mutations.
Existing smart page/tab/service split and typed loops are sufficient; no new extraction or styling exception.
Known DR-032/DR-034/DR-044 contrast failures, exhaustive accessibility, live operations/API and SSR/hydration remain.
DR-051 reliability and DR-024 scheduling-query discovery remain separate.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers only this parent/backlog handoff; accepted failed/unperformed criteria remain unchecked.
Post-approval workspace lint passes all 34 projects from Nx cache with existing warnings and zero errors.
Commit only this approved handoff; no push.
Exact next action in a fresh invocation: scope one DR-024 child, draw management first,
confirming its actual visible consumer and read prerequisites before implementation.
Do not restart completed children or start DR-024 in this invocation.

### Previous completed focus: check-in aggregate acceptance

DR-023c aggregate acceptance is Done with explicit approval:
[check-in parent](work-items/DR-023c-admin-checkin.md).
Reconciled four approved children and commits (`67c3af15`, `0cdbbdd9`, `a159b804`, `a23f9d89`) against current source.
Fresh authorized consumer confirmed on 2026-11-09 at the recorded administration route.
Scope: aggregate verification and repository handoff only; no new application styling or operational writes.
Final tournament suite passes 18 suites / 288 tests without cache replay.
Scoped frontend lint/build and ten dependency tasks pass from cache; no fresh compilation is claimed.
Twelve settled real-empty locale/theme/390/1440px cases and native status overlays pass.
Keyboard Pending/search, locale preservation with zero extra queries, HTTP 200 refresh and stable focus pass.
Three actual HTTP 200 dictionaries contain all six diagnostics. Child populated/error/paging evidence is retained.
Original preferences, All status, empty search and genuine empty records restored; zero browser mutations.
No new component extraction: existing smart tab/service and typed loops remain sufficient.
Remaining limits: failed DR-034 contrast, exhaustive accessibility, dedicated SSR/hydration and live operations/API.
DR-024 scheduling and DR-051 operational reliability remain separate.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers only this parent/backlog reconciliation; failed/unperformed criteria remain unchecked.
All four children and DR-023c are Done; DR-023 stays open for its own aggregate reconciliation.
Commit only this approved parent/backlog handoff; no push.
Exact next action in a fresh invocation: reconcile DR-023 across approved a/b/c without restarting children.
Do not begin that reconciliation or DR-024 in this invocation.

### Previous completed focus: check-in locale completeness

DR-023c4 is Done with explicit approval: [check-in locale completeness](work-items/DR-023c4-checkin-locales.md).
Fresh authorized visible Check-in consumer confirmed on 2026-11-09 at the recorded administration route.
Six local diagnostics now use the active locale; mounted French status/action/sub-event wording is clarified.
Existing layout, enum/query/mutation contracts, permissions and server/network Error diagnostics are preserved.
Focused 33 tests, scoped lint/build and API development build pass; six generated keys are formatted.
API recovered after rebuild; all three actual HTTP 200 dictionaries contain the scoped copy.
Twelve populated and twelve incomplete-read locale/theme/390/1440px cases pass; native overlays fit.
Sixty synthetic local-update-feedback layout cases pass; mocked tests cover all five operation failures/recovery.
Keyboard selection persists across locale changes with zero extra queries; real empty data/preferences restored.
Template utility tokens remain 72 to 72; no styling, dependencies, other tabs or browser mutations changed.
Limits: full tournament suite, exhaustive accessibility/contrast, dedicated SSR/hydration and live operations.
DR-034 native error contrast, DR-024 scheduling and DR-051 operational reliability remain separate.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
Approval covers this child's implementation, assets/generated keys, tests and repository handoff only.
Accepted failed/unperformed criteria remain unchecked; approval is not evidence that they passed.
Post-approval workspace lint passes all 34 projects with existing warnings.
Approved commit scope is this slice/handoff only; no push. DR-023c and DR-023 remain open.
Exact next action in a fresh invocation: reconcile DR-023c aggregate acceptance across its four approved children.
Do not begin that aggregate slice in this invocation.

### Previous completed focus: check-in table and actions

DR-023c3 is Done with explicit approval: [check-in table and actions](work-items/DR-023c3-checkin-table.md).
Fresh authorized visible Check-in consumer confirmed on 2026-11-08 at the recorded administration route.
Refresh native table/feedback and named selection/action presentation; preserve summary, filters and mutation contracts.
Exclude other tabs, global/shared styling, dependencies and browser operational writes.
DR-023c2 is already committed as `0cdbbdd9`; its pending-commit wording below is historical and superseded.
Native table/feedback/action presentation is implemented; utility tokens fall 133 to 31 with no new styling.
Focused 26 tests and scoped lint/build/API development build pass; final test/lint rerun has no lint findings.
User restarted API; port 5000 and all three actual dictionaries now pass, with the bounded generated key.
Populated narrow-screen verification found native Panel grid overflow; reused the approved enrollment section pattern.
Final 12 locale/theme/width cases, 25/50-row paging, keyboard selection and four recovery cases pass.
Sampled heading/member/status text contrast passes; no browser mutations and real data/preferences are restored.
Limits: full tournament suite, exhaustive accessibility/contrast, dedicated SSR/hydration and live operations.
DR-034 contrast, DR-024 scheduling and DR-051 operational reliability remain separate.
User selected "Approve completion and commit with disclosed limits" and "Nothing else".
Approval covers this child, bounded locale labels/generated key, tests and handoff; limits remain unchecked.
All 34 post-approval workspace lint targets pass with existing warnings.
Approved commit scope is this slice/handoff only; no push.
Exact next action in a fresh invocation: scope DR-023c4 remaining mounted check-in locale completeness.
Do not start it here; DR-023c and DR-023 remain open.
DR-023c and DR-023 remain open; do not start another child in this invocation.

### Previous completed focus: check-in filters

DR-023c2 is Done with explicit approval: [check-in filters/search](work-items/DR-023c2-checkin-filters.md).
Fresh authorized mounted Check-in consumer confirmed on 2026-11-08.
Native responsive filters, reactive status/local search and refresh consolidation are implemented.
Preserve initialization and selection; exclude table/operational redesign, other tabs and shared styling.
Focused 13 tests, scoped lint/build and API development build pass; utility tokens fall 36 to 15.
User restarted API; three actual HTTP 200 dictionaries now contain the initialization labels.
Final 12 settled locale/theme/390/1440px checks and four fresh status overlays fit.
Safe local-search/status/locale/loading/error/recovery checks pass; stable focus and zero mutations.
Sampled heading/labels and initialization contrast pass; exhaustive accessibility and SSR/hydration remain unverified.
Full tournament suite/live operations are not run; DR-034 native error contrast and DR-024 stay separate.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-08.
Approval covers this child, two initialization locale values, tests and handoff; limits remain unchecked.
All 34 post-approval workspace lint targets pass with existing warnings.
Commit this approved slice only; no push. DR-023c and DR-023 remain open.
Exact next action in a fresh invocation: scope DR-023c3 table/operational presentation with safeguards.
Do not start another child in this invocation.

### Previous completed focus: check-in summary

DR-023c1 check-in summary is Done with explicit approval: [summary brief](work-items/DR-023c1-checkin-summary.md).
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-08.
Approval covers this summary, its bounded API prerequisite, tests, summary locale assets and repository handoff.
Accepted failed/unperformed criteria remain unchecked; approval is not a claim that those checks passed.
Fresh authorized browser confirms the visible consumer at
`/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=checkin`.
Native Panel/typed metric loop replaces five decorative tiles; scoped utility tokens fall 179 to 27.
Named loading/error feedback and a stable native refresh action preserve keyboard focus.
Resolver registration, initialization list output and typed filtering are corrected; query errors are explicit.
Summary descriptions are complete in three locales; remaining tab copy is excluded.
User restarted API; actual list/statistics now return HTTP 200 and genuine zeros.
Runtime introspection verifies `[TournamentCheckIn!]!` initialization output without executing the mutation.
Final 12 locale/theme/390/1440px cases fit; four safe loading/nonzero/error/recovery cases pass with zero mutations.
Sampled summary text contrast passes: labels/descriptions 4.87/6.65:1, title/values 19.87/16.00:1.
Native error Message contrast still fails at 4.44/4.40:1; preserve DR-034 rather than adding page styling.
Focused summary 9 / resolver 6 tests pass; final tournament suite passes 18 suites / 264 tests.
Affected Nx lint/build and API development build pass; final frontend lint/build rerun passes.
Limits: exhaustive accessibility/contrast, dedicated SSR/hydration, live writes and complete operational API validation.
Post-approval all 34 workspace lint targets pass with existing warnings.
Exact next action in a fresh invocation: scope DR-023c2 filters/search on the confirmed visible consumer,
including refresh consolidation and existing nonreactive controls. Do not begin it in this invocation.
DR-023c and DR-023 remain open. Other children are unstarted; no dependencies, operational mutations or push.

### Previous completed focus: enrollment aggregate acceptance

DR-023b aggregate acceptance is Done with explicit approval: [reconciled parent](work-items/DR-023b-admin-enrollments.md).
All five approved children are committed; DR-023b5 is `57c1fc65`, not a pending commit.
Current source matches the approved native Panels/filters/Table/Dialog and three-locale copy.
The parent's evidence matrix distinguishes child passes from remaining aggregate acceptance.
Corrected DR-023b4's stale review checkbox and verified DR-023b3's outstanding 25/50-row paging.
No application, shared styling, dependencies or operational data change in this documentation-only slice.
Initial browser was unauthenticated; user subsequently logged in and resolved that verification blocker.
Fresh actual enrollment tab and Add/Cancel dialog fit in light/dark at 390/1440px; return focus passes.
Safe 56-row read-only fixtures verify 25/50-row keyboard selection/paging in all four cases, zero mutations.
Final full tournament Nx tests pass: 17 suites / 255 tests. Interceptors removed; real empty data restored.
Remaining limits: screen-reader/exhaustive accessibility/contrast, live nonzero operational workflows
and dedicated SSR/hydration verification.
DR-034 native error contrast remains failed at 4.44/4.40:1; shared bracket failures and DR-050 remain separate.
Only the outstanding full-suite check was rerun; existing child lint/build evidence remains historical.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-08.
Approval covers this aggregate documentation handoff only; the remaining criteria stay unchecked.
Exact next action: scope one DR-023c child on the freshly confirmed visible Check-in tab at the same admin route.
Check-in has a real authorized consumer; its initial mixed-locale zero summary is recorded, not redesigned.
DR-023c stays Backlog pending scope/brief; DR-023 remains open. Do not start another implementation slice or push.

### Previous completed focus: enrollment locale completeness

DR-023b5 is Done with explicit user approval: [enrollment locale completeness](work-items/DR-023b5-enrollment-locales.md).
Fresh authorized non-DRAFT enrollment consumer is confirmed; approved DR-023b4 is committed as `29dd2ef1`.
Completed mounted summary descriptions, Withdrawn, identity annotations, confirmation prompts and local errors
in English/Dutch/French, without changing layout, operational behavior or backend business rules.
Existing dialog copy is complete; verify rather than redesign it. Leave unconsumed dictionary blanks unchanged.
Implementation and focused 54-test suite pass; scoped lint/build and API/app development builds pass.
User restarted API; actual three-locale dictionary responses and generated types now contain the new keys.
Twelve settled locale/theme/390/1440px checks fit; keyboard Withdrawn selection sends the correct enum.
Locale switching preserves selection without refetching; dialog Cancel returns focus.
Safe populated/query-error fixtures verify identity/status/prompt copy and recovery; zero browser mutations.
Sampled description contrast passes 4.87/6.65:1. No styles, wrappers or dependencies change.
Exhaustive accessibility/contrast, live operations, full tournament suite and SSR/hydration remain unverified.
Native DR-034 error-message contrast is unchanged; both parents remain open.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-08.
Approval covers the locale implementation/tests/generated types and repository handoff only; limits remain unchecked.
Post-approval all 34 workspace lint targets pass with existing warnings.
Commit this approved slice/handoff only; no push.
Exact next action in a fresh invocation: reconcile DR-023b aggregate acceptance with approved child limits,
then confirm a real phase-enabled DR-023c check-in consumer before selecting implementation.
Do not begin another slice in this invocation.

### Previous completed focus: manual enrollment

DR-023b4 is Done with explicit user approval: [manual enrollment dialog and creation](work-items/DR-023b4-manual-enrollment.md).
Authorized enrollment consumer and actual Add dialog confirmed on the recorded non-DRAFT route.
User chose functional manual enrollment with the refresh on 2026-11-08.
Native member/partner selection, guest validation, authorized creation and explicit feedback are implemented.
Scoped search matches every name/member-ID word in either order; all supplied live examples pass.
Preserve enrollment safeguards; exclude other tabs, shared styling and operational visual-test mutations.
Dialog utility tokens fall 83 to 32; zero authored palettes, inline styles or new stylesheets.
Four guest/doubles dialog and fresh-overlay theme/width checks fit; keyboard selection and return focus pass.
Guest browser branch uses a temporary query-response fixture, not a server policy change.
Heading/label/description/Cancel text contrast passes; native error Message fails DR-034 at 4.44/4.40:1.
Final scoped Nx lint/build/test passes: tournament 17 suites/245 tests, backend 1 suite/25 tests.
Translation target has no tests; all three asset-backed dialog-label tests pass.
App browser/SSR and API development builds pass. Existing warnings/other-tab query errors remain.
Live operational writes, exhaustive screen-reader/accessibility/contrast and SSR/hydration stay unverified.
Shared nested-filter converter defect is DR-050; it is not changed as a hidden side effect.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-08.
Approval covers this implementation/tests, dialog locale/generated types and repository handoff only.
Accepted contrast/live-operation/accessibility/hydration limits remain unchecked.
Post-approval all 34 workspace lint targets pass with existing warnings.
Parents remain open. Commit only this approved slice/handoff; no push.
Exact next action: scope DR-023b5 remaining enrollment locale completeness on the confirmed consumer.
Dialog copy is already completed; do not start another slice in this invocation.

### Previous completed focus: enrollment table

DR-023b3 is Done with explicit user approval: [enrollment table and feedback](work-items/DR-023b3-enrollment-table.md).
Fresh authorized browser confirms the actual enrollment tab on the recorded non-DRAFT consumer.
Refresh table/heading/rows/pagination and loading/empty/error/no-selection feedback only.
Correct swallowed query errors and guard resource selectors; preserve filters, data and operational handlers.
Exclude manual dialog/creation, other tabs, locale assets and shared theme/components.
One named semantic section on the existing Card contains a native small scrollable Table and feedback.
Query errors/missing response data are explicit; safe selectors and refresh recovery replace swallowed failures.
Visible notes, translated status Tags, named gated actions and meaningful existing labels preserve information.
Scoped utilities fall 173 to 35; zero authored inline styles, palettes, new stylesheets or shared changes.
Four populated/empty/error light/dark 390/1440px checks fit; narrow scrolling is local to the table.
Enter paginates ten rows; doubles columns/partner, named loading, error recovery and zero mutations verified.
Final empty secondary Message contrast passes 7.74/9.51:1; heading/count/header samples pass.
Nx lint/build passes; prior full Nx 17 suites/228 tests passes before final feedback-only changes.
Final full run has four unchanged-suite timeouts; serial Nx retries stall before execution.
Final configured Jest fallback passes all 27 enrollment tests with explicit 30-second timeout allowance.
After approval, execution recovered: final serial default-timeout Nx tests pass all 17 suites/228 tests.
All 34 workspace lint targets pass with existing warnings.
Exhaustive 25/50 browser interactions, screen-reader/accessibility/contrast,
SSR/hydration and live nonzero operational workflows remain unverified. No push.
User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-08.
Approval covers this table/feedback implementation/tests and repository handoff only; accepted limits stay unchecked.
Both parents remain open. Commit this approved slice/handoff only; no push.
Exact next action in a fresh invocation: scope DR-023b4 manual dialog/creation on this confirmed consumer.
Do not begin that implementation in this invocation.

### Previous completed focus: enrollment filters

DR-023b2 is Done with explicit user approval: [enrollment filters and selection](work-items/DR-023b2-enrollment-filters.md).
Native Card/grid/fluid Select/IconField controls replace the custom filter surface; utility tokens fall 40 to 21.
Reactive FormControl bridges now synchronize default/changed/cleared sub-event, status and local search.
Search does not refetch; native refresh reloads the current status/sub-event query.
Existing localized labels and native option accessible names are retained; missing Withdrawn localization is DR-023b5.
User explicitly extended the slice: remove redundant `border border-surface` from all p-cards now.
24 Card tags in 15 templates no longer repeat the border; preserve meaningful live-result emphasis borders.
After review approval, user requested the necessary shared border in the PrimeNG theme preset instead.
Supported Card component CSS uses the same semantic content-border token; no native Card border token exists.
User subsequently requested Panels rather than Cards inside Cards. This tab's summary/filters now use named
native Panels inside the existing administration Card; no operational contents or other tab behavior changes.
Final preset border CSS uses the existing low-priority theme layer so intentional utility accents override it.
Both themes preserve native 1px borders, primary 2px borders and green 4px left accents in safe cascade fixtures.
No other shared behavior, backend, translation assets, operations or dependencies change.
Final tournament lint/test/build passes: 17 suites / 221 tests and ten prerequisites.
Expanded four-project lint/build and home/competition/tournament tests pass.
Shared tests retain six known unchanged bracket-tree failures; ten suites / 96 tests pass.
Focused hero/games Card tests pass: four suites / 64 tests.
Four actual filter light/dark 390/1440px layout/overlay/keyboard checks pass; sampled text contrast passes.
Actual status/refresh queries preserve variables; search issues no query and monitored interactions no mutations.
Affected home/competition/player/club/tournament/draw/public-enrollment Card spot checks fit both themes/widths.
Screen-reader, exhaustive accessibility/contrast/hydration, live alternate locales/nonzero workflows
and exhaustive shared-consumer states remain unverified. Failed-query feedback is still DR-023b3.
Temporary preview helpers are stopped; normal browser routing is restored. No push.
User approved completion/commit with disclosed limits, then explicitly requested the centralized preset border.
Final checks pass: zero nested Cards on the enrollment tab, two named Panels and 28 settled
shared-consumer cases with exact semantic 1px Card borders and viewport fit.
Final app development browser/SSR build and all 34 workspace lint targets pass with existing warnings.
User again approved completion/commit with disclosed limits and selected "Nothing else" after the final corrections.
Approval covers filters, Panels, shared Card border/template cleanup, tests and repository handoff only.
Unchecked shared-suite, screen-reader, exhaustive accessibility/hydration and nonzero workflow limits remain.
Both parents stay open. Approved slice/handoff committed as `fd333c79`; no push.
Exact next action in a fresh invocation: scope DR-023b3 table/feedback on this confirmed consumer,
including swallowed-query error handling. Do not begin it in this invocation.

### Previous completed focus: enrollment summary

DR-023b1 is Done with explicit user approval: enrollment-management summary, within open parents DR-023b and DR-023.
See the [summary brief](work-items/DR-023b1-enrollment-summary.md).
User supplied `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin`; read-only phase is `ENROLLMENT_OPEN`.
The authorized integrated browser selects Inschrijvingen and mounts the actual enrollment tab.
One native Card and semantic definition-list counts replace five decorative metric tiles.
Preserve count computation/status grouping; use existing `totalEntries` for the otherwise blank localized total label.
Exclude filters, table, dialogs, services, operations, tab shell/theme and translation assets.
Summary static class tokens fall from 217 to 29; no new stylesheet, palette, shared component or service change.
Focused tournament Nx lint/test/build passes: 17 suites / 206 tests and ten prerequisite tasks.
Four actual light/dark 390/1440px checks preserve five zero counts and localized labels without overflow.
Four temporary safe long-label/description/count layout fixtures also fit; these are not enrollment workflow tests.
Sampled label/count contrast passes: light 4.87/19.87:1, dark 6.65/16:1.
English/Dutch/French asset-backed label/description tests pass; blank Dutch/French descriptions remain pre-existing.
Screen-reader, exhaustive accessibility/contrast, SSR/hydration, alternative browser locales and actual
nonzero enrollment workflows remain unverified; accepted limits stay unchecked. No operational mutations.
On 2026-11-08 user selected "Approve completion and commit with disclosed limits" and "Nothing else".
Approval covers this summary, tests and consumer/child handoff only; no push.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects with existing warnings.
Exact next action in a fresh invocation: scope DR-023b2 filters/selection on the confirmed safe consumer.
Inspect non-reactive FormControl effects before defining behavior acceptance; do not start it in this invocation.

### Consumer confirmation and initial blocker

DR-023b's initial consumer blocker is resolved by the user-supplied safe route above.
See the [consumer confirmation brief](work-items/DR-023b-admin-enrollments.md).
On 2026-11-08 the originally supplied tournament's read-only GraphQL query returned `DRAFT`.
The initially available integrated browser rendered the admin heading and permission warning, with zero tabs and
zero `app-enrollments-tab` consumers. Source also excludes enrollment content while phase is `DRAFT`.
No implementation slice was selected before resolving that blocker; no permissions or phase were changed.
The user then supplied the safe non-DRAFT route above; the actual authorized enrollment tab was confirmed.
Initial documentation-only blocker checks did not establish application or visual acceptance;
the later summary validation is recorded separately above and in its child brief.

### Previous completed focus: administration chrome

DR-023a is Done with explicit user approval: mounted tournament administration chrome and page feedback only.
See the [administration chrome brief](work-items/DR-023a-admin-chrome.md).
The supplied tournament mounts the admin shell and Settings; enrollment/draw/schedule/check-in tabs are disabled.
Do not change phase, permissions or operational data to enable a redesign consumer.
Preserve the existing smart page and tab children; this explicitly shared shell affects DR-023/DR-024/DR-025.
Refresh heading/back action, native Card/Tabs and loading/error/permission feedback; exclude all tab contents.
DR-022 is reconciled as Done: all four children are approved Done, and DR-006j already covers the mounted bracket.
Inherited disclosed verification limits remain in the child briefs; reconciliation adds no new verification claims.
Compact localized header/native Back, bordered Card/scrollable Tabs and native loading/error/permission feedback
replace custom chrome and inline styles. The page stylesheet is removed; static utilities drop from 59 to 43.
An error-state regression exposed unsafe resource reads; the existing `hasValue()` guard now permits explicit feedback.
Final focused tournament Nx lint/test/build passes: 16 suites / 201 tests, production library build and ten prerequisites.
Four mounted authenticated light/dark 390/1440px cases preserve all five tabs, disabled gates and Settings contents.
No document overflow; native tab scroll buttons work by pointer and Enter, with visible 1px keyboard focus.
Sixteen isolated safe feedback/long-name/loading/error fixtures pass without page errors or mutation attempts.
Public admin SSR is HTTP 200 with heading/context/permission feedback; actual Back destination and restoration pass.
Native light Back text 4.46:1, selected tab 3.65:1, warning 2.83:1 and error 4.41:1 remain shared
DR-032/DR-044/DR-034 failures; dark text passes. No page-specific palette fixes.
Screen-reader, exhaustive accessibility/contrast/hydration, alternative browser locales and phase-enabled
operational tab workflows remain unverified. DR-023 stays open for DR-023b/c.
On 2026-11-08 user selected "Approve completion and commit with disclosed limits" and "Nothing else".
Approval covers the shell, guarded error selector, tests and repository handoff/DR-022 reconciliation only; no push.
Shared contrast failures and unperformed checks remain unchecked, not claimed as passed.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects with existing warnings.
Exact next action: confirm a real phase-enabled enrollment consumer before scoping DR-023b.
If none is available, record the blocker and request an appropriate safe tournament; do not mutate phase for testing.
Do not begin another implementation slice in this invocation.

### Previous completed focus: draw standings

DR-022d is Done with explicit user approval: standings match rankings through shared transparent table row defaults.
See the [draw standings brief](work-items/DR-022d-draw-standings.md).
Mounted `MD 1-2 - Poule A` has three standings; its tournament overview provides the real draw link.
Keep the existing smart-page/input-only child split. Exclude games/bracket, feedback/actions, services,
backend and translation assets. Preserve identity precedence and source order.
On 2026-11-08 user requested transparent backgrounds as the default for all project tables.
Shared PrimeNG row tokens now use `transparent` in light/dark; remove the superseded homepage row `[dt]`.
Preserve opaque sticky headers/footers, explicit stripes and hover/selection states.
This is an explicit shared-theme scope extension, not an unapproved page-specific styling exception.
Bordered Card/shared SectionHeader, native scrollable Table, tabular numbers and native empty row
follow the actual mounted homepage. Localized columns and named keyboard region remain accessible.
Zero statistics now render `0`; incomplete null/undefined pairs render `-`.
Static class tokens drop 137 to 15; two inline color overrides removed; no new stylesheets or dependencies.
Final app/home/tournament Nx lint/test/build passes: 16 suites / 196 tests, library production builds,
app development browser/SSR build and 27 prerequisites. Existing warnings remain.
Four isolated real light/dark 390/1440px cases preserve all input cells/order, three rows and six game Cards.
Twenty safe synthetic cases pass, including long names, zero/missing pairs, identity fallbacks and empty feedback.
Actual narrow ArrowRight scrolling and four visible native keyboard focus cases pass.
Sampled title/header/count/player/zero/empty contrast passes; public SSR is HTTP 200 with shared heading/table/players.
Integrated hidden-browser attempts were unreliable; isolated headless checks supersede them.
Monitored isolated browser checks have zero page errors or GraphQL mutation attempts.
Screen-reader, exhaustive accessibility/contrast/focus-ring contrast/hydration, browser alternative locales
and authenticated workflows remain unverified; accepted limits stay unchecked, not claimed as passed.
On 2026-11-07 user requested "use the homepage for reference on how to do a table"; no approval or commit.
Reuse its bordered Card, shared SectionHeader, tabular numbers and native table empty row.
Retain the named keyboard scroll region; do not copy the homepage's legacy `[dt]` or inline width styling.
Actual homepage numeric alignment is native `start`; ineffective legacy `text-right` utilities are not copied.
The homepage row `[dt]` removal is completed by the explicit shared-theme extension below;
ineffective homepage alignment cleanup remains deferred. No other local component overrides are changed.
Final revised validation above is fresh: hydrated-parent gate avoids focus on replaced SSR nodes.
Narrow ArrowRight reaches 32/35px light/dark; final 20 fixtures and eight contrast samples pass.
Fresh shared verification: 16 real light/dark 390/1440px cases cover homepage rankings (12 rows),
draw standings (3), competition poule (9) and club team roster (8). All ordinary rows compute transparent;
ordered cells/links and no document overflow are preserved. Sampled settled text contrast passes.
Four standings focus cases and real narrow ArrowRight scrolling pass; 20 new edge-case checks pass.
Native opt-in stripes, hover and selected styling remain distinct in both themes;
opaque sticky headers remain readable at 100px scroll height. Selection is a style fixture, not a workflow pass.
Final public home/draw SSR is HTTP 200. Monitored final checks have zero page errors or mutation attempts.
Other authenticated/admin, tier-popover, head-to-head/ranking-breakdown and modal table workflows are not verified.
Club tournament tab has no table on the supplied data; player/competition/tournament landing pages
do not themselves mount native tables. No consumers are added for testing.
On 2026-11-08 user selected "Approve DR-022d and shared table defaults; commit with disclosed limits"
and "Nothing else". Approval covers this slice, shared preset/homepage change, tests and handoff only.
Accepted limits include unverified screen-reader/exhaustive accessibility/contrast/focus/hydration,
browser alternative locales, all authenticated/admin/sync/modal/player/tier workflows and app production build.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects
with existing warnings and zero errors. Only the approved scope is authorized for commit; no push.
Original next action was parent reconciliation before selecting another item.
That reconciliation is completed by DR-023a on 2026-11-08; DR-022 is Done with the previously approved limits retained.

### Previous completed focus: draw games

DR-022c is Done with explicit user approval: mounted draw games aligned with the player profile.
See the [draw games brief](work-items/DR-022c-draw-games.md).
User requested game results consistent with the mounted player profile; the initial table presentation is superseded.
Use native Cards with a date rail, desktop paired teams/stacked score columns and mobile team-aligned score rows.
Reuse native success Tags for winning sets, matching the actual player-profile presentation without its legacy overrides.
Both teams share one template; keep the existing smart-page/presentation-child split and shared tier badge unchanged.
The revised template drops 244 to 117 static class tokens and 264 to 121 lines.
Final focused Nx lint/test/build passes: 14 suites / 174 tests, production library build and ten prerequisites.
Four real light/dark 390/1440px cases preserve 15 games, 28 links and 66 scores without document overflow.
Measured desktop team/score pairs share a row; mobile scores align with each team's row.
Twenty-eight safe synthetic doubles/mixed/long-name/bye/pending/partial/empty/undated cases fit.
Four keyboard cases expose visible native 1px link focus; real pointer/Enter destinations pass.
Monitored revised fixture/interaction cases record zero page errors or GraphQL mutation attempts.
Sampled player/date/score/metadata/winner/bye text contrast passes in both themes.
Public SSR is HTTP 200 with 15 Cards, 66 named scores, player content and unchanged bracket.
Screen-reader, exhaustive accessibility/contrast/focus-ring contrast/hydration and browser alternative locales remain unverified.
No new styles, exception, dependency, backend, translation-asset, service or shared/theme changes; no push.
On 2026-11-07 the user requested removal of player-link underlines and explicitly approved completion/commit.
Links now use `no-underline`; accepted screen-reader, exhaustive accessibility/contrast/focus/hydration,
browser alternative-locale and authenticated-workflow limits remain unchecked, not claimed as passed.
Bye Tags fit their content on both team positions in eight light/dark 390/1440px cases:
36.5625px matches label plus native padding; no stretched tag or document overflow.
Post-approval focused lint/test/build passes with 174 tests; all 34 repository lint projects pass.
Only this slice/tests/handoff are approved for commit. Final post-approval checks and approval are recorded in the brief.
Exact next action in a fresh invocation: confirm a real mounted round-robin standings consumer before scoping DR-022d.
DR-022 stays open; do not begin another implementation slice in this invocation.

### Previous completed focus: draw feedback

DR-022b is Done with explicit user approval: draw switching and page loading/error/empty feedback.
See the [draw feedback brief](work-items/DR-022b-draw-feedback.md).
Native pressed buttons, localized section/loading labels, Card/Skeleton loading and severity-based Messages
replace scoped custom presentation. Guarded resource selectors let actual failed requests render without exceptions.
Approved identity/actions, games, standings/bracket internals, requests, routes and translation assets are unchanged.
Static authored switcher/empty/loading/error class tokens change 9/32/20/7 to 15/12/19/5.
Final `npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static` passes:
13 suites / 160 tests, production library build and ten prerequisites; nine added page regressions include
pending loading, actual failure/recovery, missing-response error, both empty states, switching and three locale assets.
Twenty synthetic light/dark 390/1440px state cases fit, including human-readable and unbroken long switch labels.
Pointer/Enter/Space fixtures navigate correctly and update pressed state; no records are changed.
An intercepted real client query failure shows one alert, no hero or page exception; recovery restores
14 standings, 15 games and mounted bracket/games. Monitored failure and interaction cases attempt zero mutations.
Empty/error text contrast passes. Native light selected/secondary button text fails at 3.65/4.46:1,
retained under existing DR-033/032; dark button text passes. Native 1px keyboard focus is visible.
Screen-reader, exhaustive accessibility/focus contrast/hydration and live multi-draw/permission/sync workflows
remain unverified. Public populated SSR is HTTP 200 with hero/games/bracket and no single-draw switcher.
No new styles, exception, dependency, backend, translation-asset or shared/theme changes; no push.
On 2026-11-07 the user selected "Approve DR-022b and commit with disclosed limits" and "Nothing else".
Approval accepts the DR-032/033 Button contrast failures and unperformed screen-reader, exhaustive accessibility,
focus/hover contrast, hydration and live multi-draw/permission/sync checks; it does not claim they passed.
Unchecked criteria remain unchecked. Only this slice, tests and repository handoff are approved for commit.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects
with existing warnings and zero errors. No application code changed after the final focused lint/test/build run.
Exact next action in a fresh invocation: scope DR-022c mounted games from the confirmed public draw,
inspect its source/consumer and choose only one reviewable games slice. DR-022 remains open. Do not begin it here.

### Previous completed focus: draw identity

DR-022a is Done with explicit user approval: draw identity and actions on the mounted public knockout draw.
See the [draw identity brief](work-items/DR-022a-draw-identity.md).
Reuse approved shared hero primitives and native PrimeNG Tags/buttons; preserve breadcrumb, external URL and sync.
Exclude switching, games, standings, bracket, loading/error states, services, translations and global theme.
DR-006j already addressed the recorded bracket-sizing discovery; do not reopen its completed scope here.
Shared avatar/title, native secondary metadata Tags and an accessible native external button are implemented.
Hero class tokens drop 53 to 23; the unused 68-line page stylesheet is removed (host keeps `block`).
`npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static` passes:
13 suites / 151 tests, including four new draw regressions, production library build and ten prerequisites.
Four real light/dark 390/1440px layouts fit, preserve identity/actions and retain games/bracket mounts.
Four keyboard cases show external-link focus and a 2px semantic ring. Breadcrumb pointer navigation passes.
Measured title/Tag/link text contrast passes; exhaustive contrast, screen-reader, authenticated sync permissions,
alternative locales, long-name browser fixtures and exhaustive hydration remain unverified.
Public draw SSR is HTTP 200 with named hero and external label; monitored reload has zero page errors/mutation attempts.
No dependency, backend, translation, service, shared-component or global-theme changes; no new styling exception.
On 2026-11-07 the user selected "Approve DR-022a and commit with disclosed limits" and "Nothing else".
Approval accepts the unperformed screen-reader, exhaustive contrast/accessibility/hydration, authenticated sync,
alternative-locale and long-name browser checks; it does not claim unperformed checks passed.
Unchecked criteria remain unchecked. Only this slice, its tests and repository handoff are approved; no push.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors.
Exact next action in a fresh invocation: scope DR-022b switching and loading/error/empty feedback
from the mounted page. Do not begin that implementation here; DR-022 remains open.

### Previous completed focus: enrollment ranking polish

DR-021h is Done with explicit user approval: bounded `Jouw Rankings` visual polish on general enrollment.
See the [ranking polish brief](work-items/DR-021h-enrollment-ranking-polish.md).
DR-021b is Done; the mounted page has 30 public events and the existing filter child.
The user selected a compact discipline/level grid with neutral native Tags, checkbox below and a semantic divider.
Preserve the existing smart-page/filter-child split, ranking semantics, translations and filter payloads.
Exclude other filter fields, tiles, cart, services, theme, backend, translations and enrollment mutations.
Implementation and two new component regressions are complete. Ranking-only class tokens change 22 to 38 for
responsive discipline/value alignment, checkbox shrink protection and separation; excluded field markup is unchanged.
`npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static` passes:
12 suites / 147 tests, production library build and ten prerequisite tasks.
Seventy-two real en/fr_BE/nl_BE light/dark 360/390/768/1440px ranked/partial/absent cases fit and retain labels.
Four keyboard/pointer cases preserve checkbox outputs, adjacent focus order and all 30 unknown-bound public events.
Four disabled native-checkbox pointer cases emit no change. Monitored layout/interaction cases record zero page errors
or GraphQL mutation attempts. Text/Tag/focus contrast passes; native unchecked border fails under existing DR-032.
Public Dutch SSR is HTTP 200 with enrollment fields and no ranking section; exhaustive hydration is not verified.
Screen-reader, exhaustive accessibility/hydration and authenticated registration/outage checks remain unverified.
No new styling exception, dependency, backend, translation, service or shared-theme changes.
On 2026-11-07 the user selected "Approve DR-021h and commit with disclosed limits" and "Nothing else".
Approval accepts DR-032 and the unperformed screen-reader/accessibility/hydration/authenticated-workflow limits;
it does not claim failed or unperformed checks passed. Unchecked criteria remain unchecked.
Only this slice, its tests and repository handoff are approved for commit; no push.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors.
Exact next action in a fresh invocation: scope DR-022 tournament draw detail from its recorded route and discoveries,
confirm a real mounted consumer and choose one child view. Check bracket-sizing dependency with DR-006 if applicable.
DR-021 remains open; DR-021i remains deferred. Do not restore retired pages or begin another slice.

### Previous completed focus: obsolete enrollment retirement

DR-021f is Done with explicit user approval: retirement of obsolete enrollment pages.
See the [active retirement brief](work-items/DR-021f-sub-event-enrollment.md).
On 2026-11-07 the user clarified that `/tournament/:tournamentId/enroll` is the only enrollment page;
the incomplete sub-event and my-enrollments pages can be removed. A new overview will be made later.
Both obsolete pages, page-only services/styles, exports, route entries and detail overview action are removed.
General enrollment and its children/services, admin enrollment, backend/data, translations and theme remain unchanged.
Unapproved DR-021f1 chrome work is discarded; DR-021f1-f4 and DR-021g are withdrawn with retirement,
not approved styling migrations. New DR-021i retains a future my-enrollments overview without implementing it.
Final retirement lint/build and 12 suites / 145 tests pass, including direct Router rejection of both old URLs.
Four light/dark 390/1440px detail pointer cases navigate to general enrollment with 30 events/three children.
No retired detail button/link, no monitored page errors or mutation attempts. HTTP dev fallback is 200 shells,
not a promised 404; no redirect is added.
General enrollment's existing screen-reader/contrast/hydration and live workflow limits remain unchanged.
On 2026-11-07 the user selected "Approve retirement and commit with disclosed limits" and "Nothing else".
Approval accepts unchanged general-enrollment verification limits and dev-server SPA-shell behavior;
it does not claim unperformed live registration/accessibility/hydration checks passed.
Only this retirement, its tests and handoff are approved for commit; no push.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors.
Exact next action in a fresh invocation: scope DR-021h ranking polish using its brief and real general-page consumer.
DR-021i overview remains deferred until separately requested/scoped; do not restore retired pages.
DR-021 remains open; do not start the future overview or another design slice here.

### Previous completed focus: partner dialog

DR-021e is Done with explicit user approval: partner-selection dialog on the confirmed general enrollment route.
See the [active brief](work-items/DR-021e-partner-dialog.md).
Scope: native fields, associated labels/descriptions, responsive actions and dialog sizing.
Preserve search, optional partner/notes and parent-controlled cart integration.
Exclude filters, tiles, cart internals, services, backend, translations and shared theme.
Native fluid fields, localized dropdown/empty feedback, associated helpers and wrapping actions are implemented.
The meaningful page/dialog split remains; native suggestion templates wrap long names without custom CSS.
Static class tokens drop 30 to 20, plus one layout class on the native overlay pass-through.
Focused lint, 12 suites / 141 tests, production library build and ten prerequisite tasks pass.
Forty-eight English/French/Dutch light/dark 360/390/768/1440px loaded/empty fixture cases fit.
Four final keyboard cases pass selection, field order, focus wrapping/reversal, validation and exact results.
Four pointer cases pass selection, Cancel and optional Continue; native disabled targets emit nothing.
Monitored final layout/keyboard checks have zero page errors or GraphQL mutation attempts.
Public route SSR is HTTP 200 without a dialog before interaction; exhaustive hydration remains unverified.
Semantic text passes; native field/secondary borders fail DR-032 and light primary Continue text fails
at 3.65:1 under DR-033. No page overrides. DR-037 retains native English listbox/status feedback.
New DR-048 retains inherited partner-search failure feedback and request-lifecycle investigation.
Screen-reader, exhaustive contrast/hydration, live search/outages and authenticated cart operations remain unverified.
No styling exceptions, dependencies, backend, translation or shared-theme changes.
On 2026-11-04 the user selected "Approve DR-021e and commit with disclosed limits" and "Nothing else".
Approval accepts the shared contrast/native accessibility localization and unperformed workflow/hydration limits;
it does not claim failed or unperformed checks passed. Only this slice, its tests and handoff are approved; no push.
Unchecked criteria remain unchecked.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors.
Exact next action in a fresh invocation: confirm and scope DR-021f's real sub-event-specific enrollment consumer.
Do not assume use from a route export or add a consumer solely for visual testing. DR-021f is not started here.
DR-021 remains open.

### Previous completed focus: enrollment cart

DR-021d is Done with explicit user approval: general enrollment cart on the confirmed
`/tournament/8658b541-702a-408e-8114-2858a9428069/enroll` route.
See the [active brief](work-items/DR-021d-enrollment-cart.md).
Scope: native cart Card, readable ordered items, localized accessible actions, empty and submitting states.
Preserve parent-controlled items, partner indication, counts, outputs and parent success/error feedback.
Exclude filters, rankings, event tiles, dialog, services, shared theme, backend and translations.
Native bordered Card, semantic heading/list/empty text, wrapping names and localized remove actions are implemented.
The existing smart-page/presentational-cart split remains. All actions now lock during submission, including remove.
Static class tokens drop 90 to 42, plus two semantic Card root pass-through classes.
Focused lint, all 126 tests, production library build and ten prerequisites pass.
Seventy-two English/French/Dutch light/dark 360/390/768/1440px loaded/submitting/empty fixtures fit.
Four final keyboard and four pointer cases pass; disabled visible targets emit nothing.
Dutch empty-cart SSR/client copy matches. Monitored interaction checks have zero page errors or mutation attempts.
Semantic text passes. Native secondary border/dark focus and light success Submit text/focus fail contrast;
retain shared DR-032/033, without page overrides.
New DR-047 records the inherited desktop sticky sidebar under the fixed app header; page chrome stays unchanged.
Screen-reader, exhaustive hydration/contrast and real authenticated cart/partner/submission/outage operations
remain unverified. No styling exceptions, services, backend, translations or shared-theme changes.
On 2026-11-04 the user selected "Approve DR-021d and commit with disclosed limits" and "Nothing else".
Approval includes submission locking, shared DR-032/033 contrast limits and inherited DR-047 sticky overlap;
it does not claim failed or unperformed checks passed. Only this slice, its tests and handoff are approved;
no push. Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors. Failed/unperformed criteria remain unchecked.
Exact next action in a fresh invocation: confirm and scope DR-021e partner-selection dialog.
DR-021e is the next candidate, not an implementation started here. DR-021 remains open.

### Previous completed focus: enrollment selection tiles

DR-021c is Done with explicit user approval: general enrollment selection tiles on the confirmed
`/tournament/8658b541-702a-408e-8114-2858a9428069/enroll` route, with 30 public events.
See the [active brief](work-items/DR-021c-enrollment-selection.md).
Scope: native event Cards, semantic metadata/capacity and explicit accessible selection actions.
Preserve eligibility, selected IDs, waiting-list/capacity states and parent outputs.
Exclude filters, rankings, cart, dialog, services, shared theme, backend and translations.
Keep the existing smart-page/presentational-grid split; do not add a styling-only wrapper.
Native bordered Cards, wrapping headings, semantic capacity Tags and event-named native Buttons are implemented.
The existing smart-page/presentational-grid split remains. Whole-card pointer selection intentionally becomes
explicit Button selection; keyboard, pointer, output payloads, eligibility and parent-controlled selection pass.
Static class attributes drop 91 to 29 tokens, plus three semantic/native root pass-through classes.
Focused lint, all 118 tests, production library build and ten prerequisites pass.
Eight light/dark 360/390/768/1440px fixture cases fit; four 390/1440px keyboard/pointer cases pass.
Four additional cases verify actual visible disabled targets do not emit. Dutch SSR/client titles match
for 30 public native Cards. Monitored browser checks have zero page errors or GraphQL mutation attempts.
Scoped normal/hover text passes. Secondary outline contrast fails 1.23:1 light / 1.40:1 dark;
dark focus outline also fails 1.40:1. Keep the shared DR-032 audit open; no page overrides.
New DR-046 records the existing missing already-enrolled translation and literal `Any` fallback.
Screen-reader, exhaustive contrast/hydration, mounted English/French and real authenticated cart/dialog
operations remain unverified. No styling exceptions, backend, service, translation or shared-theme changes.
On 2026-11-04 the user selected "Approve DR-021c and commit with disclosed limits" and "Nothing else".
Approval includes explicit Button-only selection; it does not claim unperformed or failed checks passed.
Only this slice, its tests and repository handoff are approved for commit; no push.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors.
Unchecked contrast/localization/workflow/accessibility criteria remain unchecked.
Exact next action in a fresh invocation: confirm and scope DR-021d general enrollment cart.
DR-021d is the next candidate, not an implementation started here.
DR-021 remains open; do not start another child in this invocation.

### Previous completed focus: enrollment filters

DR-021b is Done with explicit user approval after feedback: general enrollment filters/rankings on the confirmed
`/tournament/8658b541-702a-408e-8114-2858a9428069/enroll` route.
See the [active brief](work-items/DR-021b-enrollment-filters.md).
Scope: ranking summary, native filter fields and accessible persistent labels.
Preserve defaults, reset values, inclusive level filtering and parent output.
Exclude page chrome, tiles, cart, dialog, unrelated service behavior, shared theme, backend and translations.
Semantic ranking summary, fluid native fields and persistent labels are implemented.
Keyboard/native-input range changes now update the actual filter; pointer changes still apply on release.
The existing smart page/presentational child split remains; no shared/theme/backend/translation changes.
Authored class tokens drop 70 to 49. Focused lint, all 106 tests, library build and ten prerequisites pass.
Sixteen light/dark 360/390/768/1440px ranked/unranked cases and four 390/1440px keyboard cases pass.
Actual pointer-release semantics and four maximum-chip/overlay/disabled cases pass.
Dutch SSR/client field labels match; English copy is unit-tested. Monitored checks record no errors/mutations.
Scoped text contrast passes; native unchecked Checkbox border fails 1.48:1 light / 1.40:1 dark (DR-032).
New DR-045 retains native focusable-but-aria-hidden chip Remove and literal English accessible-label evidence.
Screen-reader, exhaustive control/focus/overlay contrast/hydration, mounted English/French and real authenticated
operations/outages remain unverified. No styling exceptions. Unchecked criteria remain unchecked.
User feedback requires the ranking summary's visual polish to stay open as DR-021h and actual list-level
slider verification. The user clarified that unknown event level bounds must remain visible regardless
of the slider; only events with both known bounds are filtered. Do not infer levels from display names.
The narrow service predicate now retains unknown/partial bounds without parsing names or changing eligibility.
Four light/dark 390/1440px real mounted-list keyboard cases and four actual pointer cases verify removal of
non-overlapping known events while retaining unknown bounds. Three integration regressions cover the actual grid.
All 30 public events have unknown bounds and intentionally stay visible at 5/6 under the clarified requirement.
On 2026-11-04 the user selected "Approve DR-021b and commit with disclosed limits" and "Nothing else".
Only this slice, its tests and repository handoff, including the requested open DR-021h follow-up, are approved
for commit; no push. Approval does not claim unperformed checks passed or close ranking visual polish.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors. Unrelated staged changes are excluded from the approved commit.
Exact next action in a fresh invocation: confirm and scope DR-021c selection tiles;
do not start it in this invocation.
DR-021 remains open; DR-021c selection tiles are the next candidate, not an implementation started here.

### Previous completed focus: enrollment chrome

DR-021a is Done with explicit user approval: general enrollment page chrome on the confirmed
`/tournament/8658b541-702a-408e-8114-2858a9428069/enroll` route.
Scope: compact heading, native filter Card, outer responsive layout and loading/empty feedback.
Exclude filters, event tiles, cart internals, partner dialog, services, shared theme, backend and translations.
See the [active brief](work-items/DR-021a-enrollment-chrome.md) and
[parent/child scope](work-items/DR-021-tournament-enrollment.md).
Compact semantic heading, native filter Card, named loading and native no-results Message are implemented.
The existing smart page and presentational children remain; no styling-only extraction or shared changes.
Static class tokens drop 90 to 45. Lint, all 93 tests, production library build and ten prerequisites pass.
Eight light/dark 360/390/768/1440px loaded and settled loading/no-results cases pass fit and expected content.
Four light/dark 390/1440px keyboard cases pass Back/Tab/Shift+Tab and visible native focus.
Enter navigates to the original tournament; browser Back restores enrollment. Monitored checks have no page
errors or GraphQL mutations. Dutch SSR/client heading/subtitle match; unit tests cover English chrome.
Semantic page text and native info Message contrast pass; native light Back text fails (shared DR-032).
Screen-reader, exhaustive focus/control contrast/hydration, mounted English/French, actual authenticated
enrollment/cart operations and outages remain unverified. No styling exceptions.
The user selected "Approve DR-021a and commit with disclosed limits" on 2026-11-02, with nothing else requested.
Only this slice, its tests and repository handoff are approved for commit; no push.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors.
Unchecked contrast/workflow/accessibility criteria remain unchecked; approval is not evidence that they passed.
DR-021 remains open. Exact next action in a fresh invocation: confirm and scope DR-021b filters/rankings
on the existing general enrollment route. Do not start another child in this invocation.

### Previous completed focus: editing settings

DR-020e is Done with explicit user approval: editing settings-tab presentation on the confirmed
`/tournament/8658b541-702a-408e-8114-2858a9428069/edit` route.
Scope: three semantic sections, native associated checkbox labels and named saving feedback.
Preserve permissions, three booleans, save payloads and feedback. Exclude chrome, information, backend and shared theme.
See the [active brief](work-items/DR-020e-editing-settings.md).
Three semantic sections, native checkbox labels and named busy/saving feedback are implemented.
The existing smart child is retained; no styling-only extraction or shared changes.
Authored template class tokens drop 56 to 49; palette headings, redundant wrappers and inline progress height are removed.
Six new mock-only regressions pass; focused lint, all 87 tests and production library build plus ten prerequisites pass.
Eight light/dark 360/390/768/1440px cases pass fit, labels, disabled values and local saving/error fixtures.
Four light/dark 390/1440px keyboard cases pass all checkbox label/Space toggles, Tab/Shift+Tab and focus-visible state.
Monitored matrices/reload/tab-switch checks have zero page errors or GraphQL mutations; Dutch SSR/client content matches.
Scoped description/heading/label/help/saving contrast passes; settled sampled native focus outline passes.
Enabled unchecked borders fail 1.48:1 light / 1.40:1 dark (DR-032); native error Message fails
4.44:1 / 4.40:1 (DR-034). No page overrides or styling exceptions.
Actual screen-reader, exhaustive control contrast/hydration, mounted English/French, null-data responses
and real authenticated saves/outages/retries remain unverified. Local fixtures are reset by final reload.
Port 3000 serves final source; no temporary server was needed.
The user selected "Approve DR-020e and commit with disclosed limits" on 2026-11-02.
Only this slice, its tests and repository handoff are approved for commit; no push.
Unchecked contrast/workflow criteria remain unchecked; acceptance is not evidence that they passed.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors.
DR-020 is Done: all five bounded creation/editing children have user approval with their recorded limits.
Shared audits and unperformed operational/accessibility checks remain open in the briefs/backlog.
Exact next action in a fresh invocation: confirm a real DR-021 enrollment consumer, split the broad parent
into bounded children and select only one. Do not start DR-021 in this invocation.

### Previous completed focus: editing information

DR-020d is Done with explicit user approval: editing information-tab presentation on the confirmed
`/tournament/8658b541-702a-408e-8114-2858a9428069/edit` route.
Scope: native fluid fields, semantic section headings, date labels, required-name feedback and named saving indicator.
Preserve permissions, six controls, save payloads and feedback. Exclude settings, chrome, backend and shared theme.
See the [active brief](work-items/DR-020d-editing-information.md).
Native fluid fields, three semantic sections, five date-label associations, required-name feedback and named saving
ProgressBar are implemented. The existing smart child is retained; no styling-only wrapper extraction.
Template class tokens drop 65 to 63; palette-paired headings, red validation utility and inline progress height are removed.
Six new mock-only regressions pass; focused lint, all 81 tests and production library build plus ten prerequisites pass.
Eight light/dark 360/390/768/1440px cases pass fit, labels, disabled controls and local feedback fixtures.
Four light/dark 390/1440px keyboard cases pass all five date selections/overlays, Escape focus return and Tab movement.
Monitored matrices/reload/tab-switch checks have zero page errors or mutations; Dutch SSR/client content matches.
Scoped description/heading/label/name/validation/saving text contrast passes. Native error Message fails
at 4.44:1 light / 4.40:1 dark (DR-034); native English DatePicker names on Dutch remain DR-043.
Actual screen-reader, exhaustive control/overlay/focus contrast and hydration, mounted English/French,
null-data responses and real authenticated save/outage/retry workflows remain unverified. No styling exceptions.
Port 3000 serves stale source; isolated port 3001 verifies final source without touching that process.
The temporary server is stopped after verification.
The user selected "Approve DR-020d and commit with disclosed limits" on 2026-11-02.
Only this slice, its tests and repository handoff are approved for commit; no push.
Unchecked contrast/workflow criteria remain unchecked; acceptance is not evidence that they passed.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors.
Exact next action in a fresh invocation: confirm and scope DR-020e editing settings-tab presentation.
Do not begin DR-020e here. DR-020 stays open; settings is the next candidate, not an implementation started here.

### Previous completed focus: editing chrome

DR-020c is Done with explicit user approval: compact editing heading/real context, native Card, Messages,
tabs and native button labels.
The supplied editing route mounts anonymously with permission-disabled child controls.
Child forms, save payloads, permissions, shared theme, backend, translations and creation slices are unchanged.
Native tab value changes now update the existing signal so Save current follows the visible tab.
Ten new regressions pass; final focused lint, all 75 tests, production library build and ten prerequisites pass.
Authored template class tokens drop 59 to 25; two inline-colored banners and fixed loading widths are removed.
Eight final light/dark 360/390/768/1440px cases pass loaded/fixture fit, both tabs and native feedback.
Four final keyboard cases pass Tab/Arrow/Enter/Space and tabpanel naming references.
Monitored final matrix has zero page errors and GraphQL mutations. Dutch HTTP SSR/client heading/context match.
Heading/context/subtitle contrast passes; native light Cancel/Save-current/selected-tab/warning/error text
and dark Cancel outline fail. DR-032/033/034 and new DR-044 retain those shared audits, not page overrides.
Actual screen-reader, real authenticated saves/outages, mounted English/French, null-data/empty responses
and exhaustive focus/contrast/overlays/hydration remain unverified. No styling exceptions.
Port 3000 served stale chrome; an isolated port-3001 Nx server verified final source without touching that process.
The temporary server is stopped after verification.
See the [active brief](work-items/DR-020c-editing-chrome.md).
The user selected "Approve DR-020c and commit with disclosed limits" on 2026-11-02.
Only this slice, its tests and repository handoff are approved for commit; no push.
Unchecked contrast/workflow criteria remain unchecked; acceptance is not evidence that they passed.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects from cache,
with existing warnings and zero errors.
Exact next action in a fresh invocation: scope DR-020d editing information-tab presentation on the confirmed route.
Do not begin DR-020d/e here. DR-020 remains open; DR-020d is the next candidate, not an implementation started here.

### Previous completed focus: creation fields

DR-020b is Done with explicit user approval after feedback: never use `[pt]` or `[dt]`.
The range control now uses native `ariaLabelledBy` for its label and help, with neither binding present.
The corrected template passes lint, all 65 tests, production library build and ten prerequisites.
Eight additional light/dark width cases pass the full accessible name, references, Tab/Arrow/Escape and fit,
with zero monitored page errors or mutation requests.
Creation fields use native fluid controls, responsive registration dates,
associated required/invalid/name feedback and translated date-input labels.
Mutation errors use native Message; three inline colors and custom banner/icon are removed.
Whole-template class tokens drop 66 to 46, plus three removed fixed-width DatePicker tokens.
The real Smash For Fun form is mounted without submitting; completed DR-020a Card/actions remain unchanged.
Five new regressions preserve pending/error/retry, exact payloads, dates/toggle and navigation with mocks only.
All 65 tournament tests, focused lint, production library build and ten prerequisites pass.
Eight light/dark 360/390/768/1440px cases pass fit, native controls, real range selection and local error/busy fixtures.
Four narrow/wide keyboard cases pass date Tab/Arrow/Escape and checkbox Space, with zero monitored errors/mutations.
Dutch HTTP SSR returns 200 with matching heading/club context. Label/help/simple validation and settled name focus pass
contrast; native mutation error fails at 4.44:1 light / 4.40:1 dark and remains DR-034.
DR-043 records existing English native date dialog/button/day names on the Dutch route.
Actual screen-reader, exhaustive control/overlay contrast/focus/hydration, mounted English/French,
authenticated/create/cancel and real server-error/retry workflows remain unverified. No styling exceptions.
Editing, component/service logic, shared styles, backend and translation assets are unchanged.
See the [active brief](work-items/DR-020b-creation-fields.md).
The user selected "Approve corrected DR-020b and commit with disclosed limits" on 2026-11-02.
Only this slice, its tests and repository handoff are approved for commit; no push.
Unchecked contrast/workflow criteria remain unchecked; acceptance is not evidence that they passed.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors.
Exact next action in a fresh invocation: confirm a real mounted editing consumer and scope DR-020c editing chrome.
DR-020 stays open; DR-020c is the next candidate, not an implementation started here.
Do not begin another child in this invocation.

### Previous completed focus: creation chrome

DR-020a is Done with explicit user approval after follow-up feedback: the loaded form uses native `p-card`;
its two actions use modern `button[pButton]`/`pButtonLabel` syntax without changing behavior.
The user approved completion/commit with disclosed limits, then requested this correction before committing.
Creation heading and native Card/Skeleton/info/error read feedback are implemented.
The real club tournaments action links to `/tournament/create?clubId=...`; isolated Chrome mounted the supplied
club's creation form on 2026-11-02 without submitting. Fields, mutation feedback, action logic and editing are excluded.
The club resource read is guarded on error so the native failure branch can render.
Scoped class tokens drop from 44 to 10 after the form Card correction; two inline-colored read banners are removed.
All 60 tournament tests, focused lint, production library build and ten prerequisites pass.
Eight settled light/dark 360/390/768/1440px cases pass scoped fit, real club content, normal Tab movement,
native read-state semantics and browser-local loading/error fixtures; no page errors or GraphQL mutations.
Dutch SSR/client heading/context match. Heading/context contrast is 18.20:1 light / 16.64:1 dark;
info Message is 4.75:1 / 4.59:1. Native error text fails light at 4.41:1, passes dark at 4.64:1; DR-034 retains it.
Actual screen-reader, exhaustive focus/hydration, mounted English/French, authenticated/create/cancel,
real outage/retry and excluded form/date-picker workflows remain unverified. No styling exceptions.
See the [parent scope](work-items/DR-020-tournament-forms.md) and [active brief](work-items/DR-020a-creation-chrome.md).
The user restored port 3000; the completed final matrix verifies native Card/body and two native button labels,
invalid/busy gating, decorative spinner and Dutch SSR in all eight cases. No connectivity blocker remains.
Component tests verify cancel and form-submit contracts without invoking mutations.
The user selected "Approve corrected DR-020a and commit with disclosed limits" on 2026-11-02.
Only this slice and its handoff are approved for commit; no push. Unchecked criteria stay unchecked.
Final repository-wide lint passes all 34 projects with existing warnings and zero errors.
Exact next action in a fresh invocation: scope DR-020b creation fields/mutation feedback,
preserving the completed native Card and action syntax. Do not start another child here.
DR-020 stays open.
DR-020b is the next candidate; creation/save logic remains unchanged.

### Previous completed focus: draw external-link repair

DR-042 is Done with explicit user approval: tournament detail requests draw `visualCode`, restoring 95 external actions.
The exact-path executed-query regression fails before the repair and passes after; all 53 tournament tests,
focused lint, production library build and ten prerequisites pass.
Anonymous before/after API comparison confirms all other response data unchanged.
Eight light/dark 360/390/768/1440px cases pass all three tabs (33/33/29 external links), fit and settled keyboard focus.
Minimum settled focus-ring contrast is 3.65:1 light / 10.22:1 dark; hover icon contrast is 4.66:1 / 6.28:1.
Loaded Dutch SSR/client heading, all 95 internal routes and all 95 external link contracts match.
No styling, shared component extraction, backend, translation or destination-page changes; no exceptions.
See the [repair brief](work-items/DR-042-draw-external-link-repair.md).
Actual screen-reader, authenticated workflows, mounted English/French and exhaustive hydration remain unverified.
Missing-code/fallback states are fixture-covered, not mounted-data passes. No external site was opened.
The user selected "Approve DR-042 and commit with disclosed verification limits" on 2026-11-02.
Only the repair, regression tests and repository handoff are approved for commit; no push.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors. Unchecked criteria remain unchecked; approval is not a performed check.
Exact next action in a fresh invocation: confirm a real DR-020 creation/editing consumer, split the broad
form area into children and scope one mounted route/tab. Do not start it here. DR-019 remains Done.

### Previous completed focus: draw external-link query investigation

DR-019g is Done with explicit user approval: the tournament-detail draw external-link query mismatch is reproduced.
The mounted supplied route contains 95 internal draw links, 30 external sub-event links and zero external draw links.
The actual detail query omits draw `visualCode`; adding only that selection in a read-only comparison returns codes
for all 95 draws, with all other response data unchanged. The backend already exposes the field anonymously.
Existing mocked component tests supply codes independently of the query, so they cannot catch this omission.
This investigation changes documentation only; the user-visible bug is not fixed.
See the [query-contract brief](work-items/DR-019g-draw-external-link-contract.md).
The user selected "Approve DR-019g and commit the investigation" on 2026-11-02.
Only the documentation-only investigation and backlog handoff are approved for commit; no push.
Formatting, whitespace and all 11 brief evidence links pass. No application validation is claimed.
Exact next action: scope DR-042's one-field detail-query repair and query-contract regression tests,
then verify the newly reachable native external actions.
Do not start that repair or another design slice in this invocation. DR-019 remains Done.

### Previous completed focus: obsolete club tournament page retirement

DR-019e is Done with explicit user approval of retirement and the disclosed verification limits.
The user confirmed `/tournament/club/:clubId` should not exist and requested removal of the page, routes and links.
Its component/template/SCSS/service/barrel and lazy route are removed; the feature barrel no longer exports it.
No inbound application links were found. The real `/clubs/:clubId` tournaments tab is intentionally preserved.
See the [retirement brief](work-items/DR-019e-club-tournament-chrome.md).
DR-019h and DR-041 are closed as withdrawn by this scope decision, not as implemented redesigns or repaired queries.
Focused lint, 45 tests, production library build and ten prerequisites pass.
The retired URL mounts no obsolete component and issues none of its four query operations.
It reaches the application's existing unmatched-route behavior: Angular logs NG04002 and the browser ends at `/`.
No custom redirect/404 behavior was added. Tournament detail and the real club's Toernooien tab still load.
The user selected "Approve DR-019e and commit with disclosed limits" on 2026-11-02.
This accepts unmatched-route behavior and the unperformed checks; it does not claim repaired queries or full regressions.
Only this retirement, route tests, dependency cleanup and repository handoff are approved for commit; no push.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors.
DR-019 is Done: required children are approved complete and obsolete club tab/repair proposals are withdrawn.
Each child's unchecked criteria and disclosed limits remain authoritative; closure is not a new parent-wide test pass.
Exact next action in a fresh invocation: scope DR-019g's draw external-link query-contract investigation.
It is a separate discovery, not another required browsing child. Do not start it here.

### Previous completed focus: detail loading/error feedback

DR-019f is Done with explicit user approval: tournament detail uses competition-aligned native ProgressBar/error Message.
A reproduced resource-read exception is fixed with a guarded selector so failures render instead of leaving a blank page.
Completed hero/live/events, query, error mapping, routes, localization and gates remain unchanged.
Forty-three tests, focused lint, production library build and ten prerequisite tasks pass.
Eight isolated light/dark 360/390/768/1440px cases pass named progress, mapped failure, recovery, native semantics,
fit, restored content/132 anchors and normal Tab movement, with zero page errors/console errors/mutations.
Loaded Dutch SSR/client content matches; a real missing-tournament GET returns native SSR error feedback.
Native light error-text contrast is 4.41:1 (fails 4.5:1) and progress value/track 2.97:1 (fails 3:1);
dark passes at 4.63:1/8.81:1. DR-034/DR-038 retain those cross-consumer audits, without scoped styling overrides.
Actual screen-reader, mounted English/French, authenticated workflows, real network failure/retry and exhaustive hydration
remain unverified. Asset tests and browser-local read fixtures do not stand in for those checks.
Source-only discovery DR-040 records competition detail's similar unguarded resource read for separate investigation.
See the [feedback brief](work-items/DR-019f-tournament-feedback.md).
The user selected "Approve DR-019f and commit with disclosed verification limits".
This accepts the listed limits without claiming failed or unperformed checks passed.
Only DR-019f implementation, tests and repository handoff are approved for commit; no push.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects with existing warnings,
zero errors. Unchecked criteria remain unchecked.
Exact next action in a fresh invocation: confirm a real DR-019e club-browsing consumer and scope one child.
Do not begin it here. DR-019 remains open.

### Previous completed focus: event/draw presentation

DR-019d is Done with explicit user approval: tournament sub-events use competition-aligned native Cards, semantic headings,
outlined draw anchors, named external text actions and localized fallback/empty feedback.
Native type Tabs, grouping/order/counts, slug-based routes, metadata and sync gates remain intact.
Thirty-five tests, focused tournament/translation lint and the production library build plus ten prerequisites pass.
Eight isolated light/dark 360/390/768/1440px browser cases pass all three tabs, fit, responsive columns,
95 actual draw routes, keyboard activation, synthetic long-name wrapping and settled text/focus contrast.
Minimum hover/focus text contrast is 4.66:1 light / 6.28:1 dark; draw/external ring contrast is
3.65:1 light / 10.22:1 dark. Four paired competition cases confirm Card classes and heading typography.
Loaded Dutch SSR content matches client headings; keyboard Enter reaches the first draw and Back restores 95 links.
Final isolated cases have zero page errors/mutations. Actual screen-reader, mounted English/French,
exhaustive hydration and mounted authenticated workflows remain unverified.
Empty/fallback states and draw-external-code branches are fixture-covered, not mounted-data passes.
Hero, live navigation, destination pages, shared/global styling and loading/error feedback remain excluded.
The existing missing draw `visualCode` query contract is recorded separately as DR-019g, not changed here.
The user selected "Approve DR-019d and commit with disclosed verification limits".
Only its implementation/tests/translations/generated types and repository handoff are approved for commit. No push.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors. Unchecked criteria remain unchecked; acceptance is not a performed check.
Exact next action in a fresh invocation: confirm and scope DR-019f detail loading/error feedback.
See the [event/draw brief](work-items/DR-019d-tournament-events.md).
Do not begin another child here. DR-019 remains open.

### Previous completed focus: live navigation

DR-019c is Done with explicit user approval: the four mounted tournament live-navigation links use secondary outlined anchors,
a semantic heading, wrapping localized descriptions and one native Card matching competition content surfaces.
Routes, order and public availability remain unchanged; hero, events, feedback and live destination pages are excluded.
Twenty-eight tests, focused lint, production library build and ten prerequisites pass.
Eight isolated light/dark 360/390/768/1440px browser cases pass fit, responsive columns, routes, keyboard order,
2px focus rings and settled text/ring contrast. Minimum text contrast is 4.66:1 light / 6.28:1 dark;
ring contrast is 3.65:1 light / 10.22:1 dark. A first bare-canvas attempt failed light description contrast;
the native Card resolves it without new styling rules or theme changes.
Dutch loaded SSR/client content matches with HTTP 200; keyboard Enter opens courts and Back restores the links.
Zero page errors/mutations occur. Actual screen-reader, mounted English/French, exhaustive hydration and authenticated
live workflows remain unverified; asset/gate tests do not stand in for these checks.
The user selected "Approve DR-019c and commit with disclosed verification limits".
Only this child implementation/tests and repository handoff are approved for commit; no push is requested.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects with existing warnings
and zero errors.
Unchecked criteria remain unchecked; acceptance does not turn unperformed checks into passes.
Exact next action in a fresh invocation: confirm and scope one mounted DR-019d sub-event/draw presentation child.
Do not begin it here.
See the [live-navigation brief](work-items/DR-019c-tournament-live-navigation.md). DR-019 remains open.

### Previous completed focus: tournament hero parity

DR-019a is Done with explicit user approval after correcting identity-only presentation to complete hero parity.
The competition reference now also drives summary typography, normal-case labels, stacked counts/type copy,
registration/phase text, emphasized calendar metadata, number Tag and native external Button presentation.
Tournament totals, dates, routes, admin/enrollment/sync gates and adjacent page content remain intact.
New tournament-scoped English/Dutch/French summary keys and generated translation types are included.
Twenty-four tests, focused lint, translation lint, library production build and ten prerequisites pass.
Eight isolated paired competition/tournament cases at light/dark 390/1440px pass actual shared classes,
computed typography, fit, native actions and the absence of legacy hero decoration.
Four Dutch loaded SSR/client comparisons pass with HTTP 200; no page errors or mutations occur.
Keyboard Tab reaches the named external action with a measured near-2px focus ring.
Summary/identity/external-link contrast passes after finite theme transitions finish.
An initial in-transition external-text sample was misleading; settled native label contrast is
4.87:1 light / 6.65:1 dark on the reference. No extra label-color utility or theme override is needed.
The API is ready and the user-supplied `/api/v1/translate/i18n/nl_BE` endpoint serves the new copy.
Actual screen-reader, mounted English/French, authenticated mounted workflows, quantitative focus-ring
contrast and exhaustive hydration remain unverified. The user selected
"Approve corrected DR-019a and commit with disclosed limits", accepting those limits without claiming they passed.
Only the approved hero implementation, tests, translations/generated types and repository handoff are approved
for commit; no push is requested.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors.
DR-019b is reserved history: its summaries/actions scope is absorbed into this same DR-019a review,
not another required child or a later implementation candidate. DR-019 remains open.
Exact next action in a fresh invocation: confirm and scope DR-019c live-navigation presentation; do not start it here.
See the [hero parity brief](work-items/DR-019a-tournament-identity.md).

### Superseded identity-only review

The initial DR-019a review on 2026-10-31 matched only the shared Avatar/title/official Tag.
Twelve tests, lint, build and four identity browser cases passed, but the user rejected the resulting
whole-card difference when switching routes. The current review includes the originally deferred summary/action
scope; the brief retains that initial evidence as history, not proof of whole-hero acceptance.

### Previous completed focus: assembly parent reconciliation

DR-017 parent reconciliation is Done with explicit user approval on 2026-10-31.
All eighteen required DR-017a-r children are Done
with recorded approval; current source and four fresh isolated light/dark 390/1440px browser cases confirm
the mounted responsive scope, shared search templates, native search Cards and anonymous Save/Edit gates.
Mobile has fourteen Cards and thirteen lineup Selects; desktop has fifteen Cards, nine slot headings and
two generator Selects (not lineup pickers). Both named search inputs are unique and Card-contained;
three summary headings and viewport fit pass in all cases, with zero page errors or GraphQL mutations.
The first audit incorrectly counted desktop generator Selects as lineup pickers; the corrected scoped
assertion passes without changing application code. This is a consumer audit, not new pixel, contrast,
keyboard, screen-reader, authenticated workflow, alternate-locale or exhaustive hydration validation.
DR-017r is complete, not deferred. Only DR-017s authenticated Save presentation remains deferred;
its literal English Save copy and the handlerless Edit/PDF integration contracts remain unchanged.
Existing native contrast failures and all child verification limits remain disclosed, not resolved.
Only the parent brief and backlog change; no application restyle, extraction or styling exception.
The user selected "Approve parent completion and commit with disclosed limits", explicitly accepting
DR-017s deferral and preserved child limits. Unchecked criteria remain unchecked; approval is not a pass.
Only this parent handoff is approved for commit; no push.
Exact next action: DR-019, confirm the supplied mounted tournament detail route and scope one child
in the next invocation. Do not begin that UI slice here. DR-017s remains separately deferred.
See the [parent reconciliation evidence](work-items/DR-017-competition-assembly.md#parent-closure-reconciliation).

### Previous completed focus: search Card parity

DR-017r is Done with explicit user approval on 2026-10-31 following the requested visual corrections.
The supplied mounted-element evidence confirms the permission-only change-team guidance below the desktop
player list. Refresh that custom surface with a native Card and make mobile captain/add-player searches
use the existing desktop Card presentation. Preserve permissions, search behavior, responsive order and
the currently handlerless Edit button; implementing its missing action is not approved by visual feedback.
All required DR-017a-r children are now Done. DR-017 remains in Review for separate parent closure approval.
The authenticated Save popup remains separately deferred as DR-017s, not part of DR-017r.
The guidance now uses a named native Card with associated existing copy and unchanged outlined Edit.
The captain Card lives in its shared template; mobile add-player gains the desktop player Card/title
without adding a mobile player list. Search behavior, responsive order and permissions are preserved.
Seventy-four tests in five affected suites pass (four new permission regressions); focused lint passes
with 41 existing warnings and zero errors; production library build and ten prerequisites pass.
Eight isolated light/dark 360/390/768/1440px cases pass named Card/native-style parity, fit, unique inputs,
search ArrowDown/Escape focus, responsive counts and anonymous gates, with zero page errors/mutations.
Six scoped captain/mobile-add screenshots were inspected; real Dutch loaded SSR and fresh client rendering pass.
Permitted post-change guidance pixels/focus/contrast remain unavailable in the anonymous browser; the
user's before-element confirms the consumer, and component tests cover the permitted gate/presentation.
No simulated browser permissions, backend/translation/style changes, dependencies or new action are introduced.
Existing native FloatLabel contrast remains DR-031; actual screen-reader, mounted English/French,
quantitative new-surface contrast, authenticated/save and exhaustive hydration remain unchecked.
The user selected "Approve completion and commit with disclosed verification limits".
Approval accepts the unavailable permitted guidance/contrast and other unchecked checks; it does not claim
they passed. Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects
with existing warnings and zero errors. Only this child implementation/tests and related handoff are approved
for commit; no push. Exact next action in a fresh invocation: reconcile DR-017 parent closure and obtain
explicit acceptance of DR-017s Save deferral and preserved child limits. Do not begin another UI slice here.
See the [DR-017r brief](work-items/DR-017r-assembly-search-card-parity.md).

### Previous focus: parent audit, superseded by user evidence

DR-017 parent reconciliation is Review on 2026-10-31. All 17 required confirmed-consumer children,
DR-017a-q, are Done with recorded approval; no further anonymous assembly restyle is warranted.
The parent brief now maps current source and mounted responsive surfaces to those children.
Four isolated Chrome cases (390/1440px, actual light/dark theme class) confirm loaded surface counts,
two searches, three summaries and preserved anonymous permission gates, with no page errors or mutations.
The first matrix sampled transient SSR/loading DOM; the corrected matrix waits for Angular's real
loaded/responsive branch before collecting evidence. This is a consumer audit, not new pixel, contrast,
screen-reader, authenticated workflow or exhaustive hydration validation.
DR-017r explicitly defers the unconfirmed authenticated Save menu and permission-only change-team block.
The Save menu still contains literal English copy; the Edit button still has no handler.
Neither is globally unused. Do not simulate permissions, create a consumer or perform mutations to redesign them.
Existing CDK SCSS is retained; no component extraction, application, translation or global-theme change.
Child contrast failures and unchecked limits remain unchanged, including DR-031 through DR-039 follow-ups.
Only the [parent brief](work-items/DR-017-competition-assembly.md) and this backlog changed.
Exact next action: obtain parent approval of the completed confirmed scope, DR-017r deferral and preserved
verification limits before marking DR-017 Done or committing. No approval or push is assumed.
After approval, the next candidate is DR-019: confirm the supplied mounted tournament detail route and scope
one child; do not start it in this invocation. A later permitted assembly route can unblock DR-017r separately.

### Previous completed focus: initial/error feedback

DR-017q is Done with explicit user approval on 2026-10-31: the mounted assembly now has native localized initial/error feedback and
a read-only retry action. Real English/Dutch/French copy and 14 new tests pass; all 319 competition tests
in 20 suites, focused lint (41 existing warnings, zero errors), library build and 10 prerequisites pass.
Eight light/dark 360/390/768/1440px cases pass layout, naming, keyboard dispatch and loading/loaded priority.
Separate 390px theme checks pass intercepted query failure/retry, real-team recovery and focus preservation:
failed retry refocuses the new button, successful retry focuses the named result region, and user-moved focus
is not stolen. Native Message leave animations required retaining the previous focused-button identity.
Dutch initial/loaded SSR and fresh hydration pass; no page errors or mutations occur in the final matrices.
Initial text contrast passes at 7.74:1 light / 9.51:1 dark. Native error text is 4.41:1 light (fails 4.5:1)
and 4.63:1 dark (passes); DR-034 retains that audit without page/global color overrides.
Four added feedback utility tokens provide spacing/action alignment; no new wrapper, SCSS or shared/theme change.
The named loaded-section focus target is a tightly coupled accessibility change, not a lineup restyle.
New locale keys and their automatically generated translation types are included.
Actual screen-reader output, mounted English/French, quantitative retry focus/icon contrast,
forced error/loading SSR, authenticated/save workflows and exhaustive hydration remain unchecked.
DR-039 records the pre-existing club/season selection-to-service mismatch; this slice preserves those gates.
See the [DR-017q brief](work-items/DR-017q-assembly-load-feedback.md).
The user selected "Approve completion and commit with the disclosed verification limits".
Approval accepts the native light error contrast failure and unchecked limits; it does not claim they passed.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects
with existing warnings and zero errors. Only this slice/tests/handoff are approved for commit; no push.
Exact next action: inspect remaining confirmed consumers and reconcile DR-017 parent scope; do not start that here.
Keep DR-017 open. The permission-only change-team block still lacks a confirmed permitted consumer.

### Previous completed focus: loading feedback

DR-017p is Done with explicit user approval on 2026-10-31: the confirmed mounted loading branch has
readable existing localized status text,
polite/atomic semantics and a named native indeterminate ProgressBar.
All 305 competition tests in 19 suites (8 new), focused lint (41 existing warnings, zero errors),
library build and 10 prerequisites pass after the semantic text-contrast correction.
Eight fresh isolated Chrome light/dark 360/390/768/1440px cases pass naming, fit, loading priority,
focus preservation, Tab-to-Club and loaded branch restoration; all eight scoped screenshots were inspected.
The final matrix has zero page errors, hydration diagnostics or mutations.
Status text contrast passes at 18.20:1 light / 16.64:1 dark.
The preserved native light progress value/track contrast is 2.97:1, below 3:1; DR-038 retains the separate audit.
No services, translation assets, shared/global styles, new wrappers or completed DR-017a-o changed.
Loading utilities increase from zero to five for one shared spacing row and readable semantic text.
The real SSR response is correctly loaded with no stale loading element; forced server-loading SSR,
actual screen-reader announcements, mounted English/French, authenticated/save workflows and exhaustive
hydration remain unverified.
The user selected "Approve completion and commit with the disclosed verification limits".
Approval accepts the recorded native contrast failure and unchecked limits; it does not claim they passed.
Only this slice/tests/handoff are approved for commit; no push.
Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects
with existing warnings and zero errors.
See the [DR-017p brief](work-items/DR-017p-assembly-loading-feedback.md).
Exact next action in a fresh invocation: confirm and scope DR-017q's load-error/unselected feedback
using the mounted assembly route and real service gates.
Do not start DR-017q here.
The permission-only change-team block has no click handler and was not mounted for the supplied anonymous route.
Do not redesign it without confirming an actual permitted consumer. Keep DR-017 open.

### Previous completed focus: confirmation dialog

DR-017o is Done with explicit user approval on 2026-10-31: the mounted confirmation dialog has a translated title,
named header dismissal, responsive gutters and visible native Cancel/Agree actions via PrimeNG's named footer.
The previously missing footer was an obsolete template-query usage, not a missing application consumer.
All 297 competition tests in 18 suites (11 new), focused lint (41 existing warnings, zero errors),
library build and 10 prerequisites pass. Eight fresh light/dark 360/390/768/1440px cases pass naming,
fit, initial cancellation focus, Escape and focus return, with zero page errors or mutations.
Separate 390px theme checks pass Tab containment, Space/Enter, header/footer cancellation,
browser-local no-network pending-action dispatch, warning-only content and long-message scrolling.
Dutch SSR and fresh responsive hydration pass. Scoped utility tokens increase from zero to seven for
width cap/gutters and the wrapping footer row. No new wrapper, translation asset, stylesheet or theme change.
Native light Agree normal/keyboard text contrast fails at 3.65:1; native dark Cancel focus-ring contrast
fails at 1.40:1. DR-033 retains these audits; native Message contrast remains DR-034.
Screen-reader output, header-close quantitative contrast, mounted English/French, actual authenticated/save
success/error workflows, drag/resize interaction and exhaustive hydration remain unverified.
The user selected "Approve completion and commit with the disclosed verification limits".
Approval accepts the recorded native contrast failures and unchecked limits; it does not claim those checks passed.
Only this slice/tests/handoff are approved for commit; no push.
Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects
with existing warnings and zero errors.
Exact next action in a fresh invocation: inspect remaining mounted assembly surfaces and reconcile DR-017's
remaining scope before selecting one further child. Do not reopen completed DR-017a-o or begin that child here.
See the [DR-017o brief](work-items/DR-017o-assembly-confirmation-dialog.md). Keep DR-017 open.

### Previous completed focus: mobile substitutes

DR-017n is Done with explicit user approval on 2026-10-31: the mounted mobile substitutes picker uses a named Card,
translated existing prompt, native fluid sizing and stable full-name option identities.
All 286 competition tests in 18 suites (8 new), lint (41 existing warnings, zero errors), library build
and 10 prerequisites pass. Six fresh mobile light/dark 360/390/768px cases verify names, prompt,
focus, native sizing and the mounted eight-option baseline; four 820/1440px cases retain desktop.
Placeholder contrast passes at 4.87:1 light / 6.65:1 dark. Separate fresh 390px light/dark checks pass
keyboard assignment/Delete clearing, sequential appends/form arrays, exclusion, pointer selection/clear,
Escape, Tab order, long-name option/value fit and empty/loading/unloaded gates.
Dutch SSR and fresh responsive hydration pass. The final layout matrix reports no page errors or NG0955.
Existing append-picker clearing does not remove an appended substitute; DR-036 retains functional parity work.
Existing English empty-result feedback remains DR-037. No shared/global/backend/translation changes or exceptions.
Auth/save workflows, actual screen-reader output, quantitative focus/option/selected-value contrast,
exhaustive hydration and interaction-at-every-width coverage remain unverified.
The user selected "Approve completion and commit with the disclosed verification limits".
Approval accepts unchecked limits; it is not evidence that unperformed checks passed.
Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects
with existing warnings and zero errors. Only this slice/tests/handoff are approved for commit; no push.
Exact next action: confirm and scope one remaining mounted assembly surface, such as confirmation
dialog chrome/actions, excluding completed DR-017a-n. Do not start that child here.
See the [DR-017n brief](work-items/DR-017n-assembly-mobile-substitutes.md). Keep DR-017 open.

### Previous completed focus: mobile doubles

DR-017m is Done with explicit user approval on 2026-10-31: the four mounted mobile doubles surfaces
use named native Cards and one repeated
Select block. After user feedback, native translated select-player placeholders are the only visible
prompts; eight distinct accessible slot/position names remain without extra visible labels.
Completed full-name templates/values,
indexed form/filtering behavior and excluded desktop/singles/substitutes remain unchanged.
All 278 competition tests in 17 suites (11 new), focused lint (41 existing warnings, no errors),
library build and 10 prerequisites pass. Six fresh mobile light/dark 360/390/768px cases verify
names, keyboard assignment/Delete clearing, partner exclusion, Escape, Tab order and long-name fit.
Four desktop 820/1440px theme cases, additional 390px pointer/empty/loading/unloaded checks and Dutch
SSR/fresh hydration pass. The complete matrix reports zero page errors, NG0955 warnings or mutations.
Final placeholders pass contrast at 4.87:1 light / 6.65:1 dark; selected values at 13.61:1 / 16.00:1.
Scoped authored utility tokens increase from three to six for necessary heading/position spacing.
All listed Nx/browser/SSR checks were rerun after removing visible labels.
Actual screen-reader output, quantitative focus/option contrast, exhaustive hydration,
mounted English/French and authenticated/save checks remain unverified. DR-037 records the existing
English native empty-result copy on the Dutch route. No styling exceptions or dependencies.
The user selected "Approve completion and commit with the disclosed verification limits" after the compact correction.
Approval accepts the unchecked limits; it is not evidence that unperformed checks passed.
Only this slice, its tests and repository handoff are approved for commit; no push.
Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects,
with existing warnings and zero errors.
Exact next action in a fresh invocation: confirm/scope one mounted mobile substitutes surface child,
excluding completed DR-017a-m. Keep DR-017 open; do not start it here.
See the [DR-017m brief](work-items/DR-017m-assembly-mobile-doubles.md).

### Previous completed focus: mobile singles

DR-017l is Done with explicit user approval on 2026-10-31 after fixing user-reported NG0955 warnings.
The adapter now preserves each player's ID for existing native `dataKey="id"` tracking.
All 267 competition tests in 16 suites (20 new), focused lint (41 existing warnings, no errors),
library build and 10 prerequisites pass. Six fresh mobile theme/width cases open/reopen/select all 13
controls, verify nonempty unique native keys and full-name selected values, and report zero NG0955
console warnings or page errors. The real mounted eight-option baseline is also checked in every case.
The earlier scope/evidence below remains historical:
user feedback explicitly extended full-name display to all mobile lineup
selectors (singles, doubles and substitutes). One shared option/value template now names and wraps all 13.
Only naming/wrapping is extended; doubles/substitute surfaces and behavior remain unchanged.
Final verification passes all 266 competition tests in 16 suites (19 new), focused lint (41 existing warnings),
library build and 10 prerequisites. Six fresh mobile theme/width cases verify actual full-name options and
selected values in all 13 controls, original doubles/substitute values and long-name fit. Four unchanged desktop
theme/width cases, final Dutch SSR and hydration pass with no page errors or mutations.
Scoped all-mobile selector static tokens increase from five to nine; wrapping is authored only once.
The following additional interaction/contrast evidence describes the initial singles implementation:
the four mounted mobile singles selectors share named native Cards and fluid Selects.
Localized headings/placeholders and full-name options/values replace unnamed first-name-only controls.
A typed label/value adapter reuses the existing full-name callback and retains original player form values.
Existing options/filtering, standalone values, assignment/clearing and form synchronization remain unchanged.
All 260 competition tests in 16 suites (13 new), focused lint (41 existing warnings, no errors),
library build and 10 prerequisites pass. Six mobile 360/390/768px light/dark browser cases verify
keyboard selection, Delete clearing, pointer clearing, Escape, Tab order, names and long-option/selected wrapping.
Four 820/1440px theme cases retain desktop singles; final Dutch SSR and fresh hydration pass.
Selected-text contrast passes at 13.61:1 light / 16.00:1 dark; no page errors or GraphQL mutations.
Initial singles-only authored class tokens increased from one to seven before the shared-template correction.
No styling exceptions, dependencies, shared/theme/service/backend/translation changes or commits.
Screen-reader output, quantitative focus-ring/placeholder/option contrast, exhaustive hydration,
mounted English/French and authenticated/save workflows remain unverified.
DR-036 records existing mobile replacement/duplicate-rule gaps separately; no functional fix is hidden here.
The user selected "Approve completion and commit with the disclosed verification limits".
Approval accepts the recorded limits; it does not establish that unchecked checks passed.
Only this slice, its tests and repository handoff are approved for commit; no push.
Post-approval `npx nx run-many --target=lint --output-style=static` passes for all 34 projects,
with existing warnings and no errors.
Exact next action in a fresh invocation: confirm/scope one mounted mobile doubles surface group,
preserving the now-completed full-name presentation in all mobile selectors and excluding completed DR-017a-l.
Keep DR-017 open.
See the [DR-017l brief](work-items/DR-017l-assembly-mobile-singles.md).

### Previous completed focus: player summaries

DR-017k is Done with explicit user approval on 2026-10-30: the mounted base/titular summaries now share one native
Card/list template. Validation-derived order, indices, rankings/sums and exemptions remain intact.
Named regions, wrapping names and localized native exemption Tags replace duplicated Fieldsets/palette icons.
Static layout/color class tokens drop from 26 to 25; mobile Cards size to content after a verified flex-basis fix.
All 247 competition tests in 15 suites (10 new), focused lint (41 existing warnings, no errors),
library build and 10 prerequisites pass. Mounted browser checks cover eight theme/width cases,
keyboard/focus/hover/Escape, long names, M/F/MX/zeroes and empty/loading/unloaded states.
Text contrast passes at 19.87:1 light / 16.00:1 dark; exemption icons pass at 4.52:1 / 9.31:1.
Final Dutch SSR and fresh mounted hydration pass with no page errors or GraphQL mutations.
This also resolves DR-017j's previously unavailable final grouping SSR recheck.
Native Tooltip association remains absent; the complete exemption is the Tag's accessible name.
DR-033 retains the shared native Tooltip audit, now including this Tag consumer.
Actual screen-reader output, exhaustive focus/hover/hydration, mounted English/French and authenticated/save
workflows remain unverified. Completed children, controls, services, shared components, theme and assets are unchanged.
No styling exceptions or dependencies. The user approved completion/commit with the disclosed verification limits.
Approval accepts those limits; it does not mean unperformed checks passed. Only this slice and its handoff
are approved for commit; no push.
Post-approval repository-wide lint passes across all 34 projects with existing warnings and no errors.
See the [DR-017k brief](work-items/DR-017k-assembly-player-summaries.md).
Exact next action in a fresh invocation: confirm/scope one remaining mounted mobile lineup selector group (for example singles),
excluding completed DR-017a-k. Keep DR-017 open; do not start that child here.

### Previous completed focus: captain/add-player searches

DR-017j is Done with explicit user approval on 2026-10-30 after clarified visual feedback:
desktop captain has a separate native Card above
the player-pool Card, while add-player is inside the player-pool Card below its list.
This explicitly extends the slice to desktop Card content grouping;
the completed pool's heading, availability, rows, disclosure and CDK contracts remain unchanged.
The mounted captain/add-player searches reuse two native templates across mobile/desktop.
Each control is styled once without a new component wrapper; stable input IDs associate translated labels.
One full-name callback names options and selected values consistently, distinguishing identical first names.
Existing local regular/backup searching, captain ID assignment, add-player dispatch and force selection remain.
Two wrapping utilities per suggestion prevent long full names from overflowing the narrow viewport.
Scoped static class tokens increase from four to seven: four suggestion-wrapping tokens and three layout tokens
for spacing inside the player Card. Four old spacing wrappers are removed; existing outer gaps remain.
All 237 competition tests in 14 suites (22 new search tests), focused lint (41 existing warnings, no errors),
library build and 10 prerequisites pass. Isolated Chrome verifies both searches in eight 390/820/1280/1440px
light/dark cases: labels, long names, overlay fit, keyboard selection, Escape, empty results and Tab clearing.
Mounted hydration has no page errors or GraphQL mutations; pool availability and backup disclosure also pass.
Dutch SSR passed before the grouping correction. The final SSR recheck could not connect because port 3000
stopped responding after all eight browser cases; recheck it when the user-managed server is available.
Native suggestion text contrast passes at 19.87:1 light / 16.00:1 dark; focused label contrast fails in light
at 2.66:1 and passes in dark at 10.22:1. Existing DR-031 retains the shared native label audit; no overrides added.
Screen-reader output, exhaustive focus/hover/hydration, mounted English/French and authenticated/save workflows
remain unverified. Completed DR-017a-i, lineup selectors, services, shared components, theme and translation assets
remain unchanged. No dependencies or styling exceptions.
See the [DR-017j brief](work-items/DR-017j-assembly-player-searches.md).
The user selected "Approve completion and commit with the disclosed verification limits".
Approval accepts these limits, including the unperformed final SSR recheck; it does not mean they passed.
Only this slice, its tests and repository handoff are approved for commit; no push.
Post-approval repository-wide lint passes across all 34 projects with existing warnings, no errors.
Exact next action in a fresh invocation: confirm/scope one remaining mounted DR-017 information-panel surface,
with the base-player summary as the next candidate, excluding completed DR-017a-j. Do not start it here.
DR-017 remains open. Recheck final Dutch SSR when the user-managed port 3000 is available.

### Previous completed focus: partner combinations

DR-017i is Done with explicit user approval on 2026-10-30: the mounted desktop partner-combinations disclosure
now has responsive named controls,
native icon-only `button[pButton]` refresh with busy/disabled feedback, native Table size/striping and statistic Tags.
The existing Fieldset, data visibility, range/weeks, forced refresh, filtering, sorting and pagination remain.
All 215 competition tests in 13 suites, focused lint (41 existing warnings, no errors), library build and
10 prerequisites pass. Isolated Chrome verifies six desktop theme/width cases and two unchanged mobile cases,
synthetic long names, filtering/empty/clear, paging, initial keyboard sorting/Select, refresh/busy and zero stats.
Tag contrast passes; Dutch SSR and mounted hydration have no page errors or GraphQL mutations.
Native Fieldset expansion removes Select/header tab stops: new DR-035 records this dependency-level issue.
Actual screen-reader output, exhaustive focus/contrast/hydration, mounted English/French and authenticated/save
workflows remain unchecked. Static utility tokens increase 10 to 12 for flexible control widths/wrapping;
two palette bindings and legacy Table classes are removed. No styling exceptions or dependencies.
Completed DR-017a-h, mobile selectors, services, translations, shared components and theme remain unchanged.
User review requested restoring the baseline toolbar: icon-only refresh, one search placeholder and full-width
controls rather than visible labels and a four-column grid. That correction is implemented and reverified:
12 desktop theme/width/range cases, two unchanged mobile cases, focus Tooltip/Escape, refresh/filter/busy,
accessible names and all 215 tests/lint/build pass again.
See the [DR-017i brief](work-items/DR-017i-assembly-partner-combinations.md).
The user selected "Approve completion and commit with the disclosed verification limits".
Approval accepts those limits; it is not evidence that failed or unperformed checks passed.
Only this slice, its tests and repository handoff are approved for commit; no push.
Post-approval repository-wide lint passes across all 34 projects with existing warnings, no errors.
Exact next action in a fresh invocation: confirm/scope a remaining mounted DR-017 assembly surface, with
captain/add-player controls as the next candidate, excluding completed DR-017a-i. Do not start it here.
DR-017 remains open.

### Previous completed focus: validation overview

DR-017h is Done with explicit user approval on 2026-10-30: the mounted validation overview uses a named native Card
and error/warn/success Messages.
The existing template is reused in the confirmation dialog, without a new wrapper or duplicate heading IDs.
Repeated validation codes and refreshed parameters render correctly; rules and error-before-warning order remain.
Scoped authored class tokens drop from 14 to 9, removing three palette colors and an unnecessary wrapper.
All 197 competition tests in 12 suites, focused lint (41 existing warnings, no errors), library build and its
10 prerequisites pass. Isolated Chrome verifies 24 cases at 390/820/1280/1440px in both themes, success/mixed/warning
states, long content wrapping, diagnostic updates, dialog reuse/focus/Escape cancellation, unchanged mobile
selectors and Dutch SSR. No browser page errors or GraphQL mutations.
Native Message text fails AA: light success 3.16:1, error 4.44:1, warn 2.85:1; dark error 4.40:1.
Dark success/warn pass at 6.48:1/7.49:1. DR-034 records the separate native Message contrast audit.
Actual screen-reader output, exhaustive hydration, mounted English/French and authenticated/save workflows remain
unchecked. No styling exceptions, overrides, dependencies, backend or translation asset changes.
Completed DR-017a-g and other assembly surfaces remain unchanged.
See the [DR-017h brief](work-items/DR-017h-assembly-validation-overview.md).
The user selected "Approve completion and commit with the disclosed verification limits".
Approval accepts those limits; it is not evidence that failed or unperformed checks passed.
Only this slice, its tests and repository handoff are approved for commit; no push.
Post-approval repository-wide lint passes across all 34 projects with existing warnings, no errors.
Exact next action in a fresh invocation: confirm/scope one remaining mounted assembly surface (for example
partner combinations), excluding completed DR-017a-h. DR-017 remains open; do not start another child here.
The unrelated generated translation change is preserved.

### Previous completed focus: generation controls

DR-017g is Done with explicit user approval on 2026-10-30 after the requested native `button[pButton]` correction.
The mounted desktop assembly generation controls use a native named Card, fluid controls
and hover/focus strategy Tooltips. Strategies, time-range values, conditional weeks, loading/disabled and local
clear/form contracts are preserved; scoped static authored class tokens drop from 26 to 12.
Ten remaining tokens cover layout/typography; native icon/spinner classes replace deprecated inputs.
All 186 competition tests in 11 suites, focused lint (41 existing warnings, no errors), library build and its
10 prerequisites pass again after correction. Isolated Chrome reverifies all six 820/1280/1440px theme cases,
native Button names, busy/spinner/disabled states, keyboard Select opening,
Tooltips/Escape/Tab, local random generation/clearing, no-player disabling and Dutch SSR without mutations/errors.
Unchanged 390px mobile retains 13 Selects and no generation controls in both themes.
Preserved native light-mode Button text fails 4.5:1 at 2.28-3.76:1; focused FloatLabel fails at 2.66:1.
DR-031 retains the label audit; new DR-033 records native Button text/focus contrast and Tooltip association.
Actual screen-reader output, exhaustive hydration, mounted English/French, authenticated/save and quantitative
focus-ring painted-area checks remain unchecked. No styling exceptions, overrides or dependencies.
Completed children, mobile selectors, validation, partner combinations, services and theme remain unchanged.
The unrelated generated translation change is preserved.
See the [DR-017g brief](work-items/DR-017g-assembly-generation-controls.md).
The user selected "Approve completion and commit with the disclosed verification limits".
Approval accepts those limits; it is not evidence that failed or unperformed checks passed.
Only this slice, its tests and repository handoff are approved for commit; no push.
Post-approval repository-wide lint passes across all 34 projects with existing warnings, no errors.
Exact next action in a fresh invocation: confirm/scope one mounted validation-presentation child, excluding all
completed DR-017a-g surfaces. Do not start it here. DR-017 remains open.

### Previous completed focus: substitutes

DR-017f is Done with explicit user approval on 2026-10-30: the mounted desktop substitutes container uses a native Card,
localized named heading and explicit empty state. Completed chrome/rows/pool/doubles/singles, CDK sorting/drop
contracts, lineup restrictions and local forms are preserved. Scoped authored class tokens drop from 18 to 12.
All 175 competition tests in 10 suites, focused lint (41 existing warnings, no errors), library build and its
10 prerequisites pass. Isolated Chrome verifies empty/multiple synthetic substitutes and long names at
820/1280/1440px in both themes, warning hover/focus Tooltips, Escape, Tab, visible native focus, real pointer
pool copy/return and local form synchronization. Unchanged 390px retains 13 Selects and no desktop rows in both themes.
Minimum scoped text contrast is 19.87:1 light / 16.00:1 dark; warning icon contrast against its composited Tag
fill is 4.52:1 / 9.36:1. Dutch SSR returns the named Card; no browser page errors or GraphQL mutations.
Screen-reader output, exhaustive hydration, mounted English/French, authenticated/save workflows and quantitative
native focus-ring painted-area/contrast remain unchecked. No styling exceptions, overrides or dependencies.
The user selected "Approve completion and commit with the disclosed verification limits".
Approval is not evidence that unchecked checks passed. Only this slice, its tests and handoff are approved
for commit; no push. Post-approval repository-wide lint passes across all 34 projects with existing warnings,
no errors. See the [DR-017f brief](work-items/DR-017f-assembly-substitutes.md).
Exact next action in a fresh invocation: confirm/scope one mounted generation-controls child, excluding completed
chrome/rows/pool/doubles/singles/substitutes. Do not start it here. DR-017 remains open.

### Previous completed focus: singles

DR-017e is Done with explicit user approval on 2026-10-30: the four mounted desktop singles-slot containers now use
native Cards, localized named headings/empty states, and accessible success/danger statistic Tags.
Completed player rows, CDK contracts, singles rules, pool copy/return, scalar local forms and mobile selectors
are preserved. Only the singles loop changes; authored class tokens drop from 29 to 21 and two palette bindings
are removed. No token/PassThrough overrides, host classes, styles, dependencies or operational mutations.
All 165 competition tests in nine suites, focused lint (41 existing warnings, no errors), and library build
with 10 prerequisites pass. Isolated Chrome verifies 820/1280/1440px in both themes, synthetic empty/occupied
slots, long names, missing/present statistics, native focus, hover/focus Tooltips, Escape, Tab, real pointer
copy/return and scalar form synchronization. Unchanged 390px retains 13 Selects and no desktop rows/Cards.
Minimum scoped text contrast is 19.87:1 light / 16.00:1 dark; Tag text 4.57:1 / 10.07:1 and Tooltip text
13.61:1 / 9.95:1. Dutch SSR returns all four named Cards; browser reports no page errors or GraphQL mutations.
Screen-reader output, exhaustive hydration, mounted English/French, authenticated/save workflows and quantitative
native focus-ring painted-area/contrast verification remain unchecked. Approval is not evidence that they passed.
The user selected "Approve completion and commit with the disclosed verification limits".
Only this slice, its tests and repository handoff are approved for commit; no push.
Post-approval repository-wide lint passes across all 34 projects with existing warnings and no errors.
Exact next action in a fresh invocation: confirm/scope one mounted desktop substitute-container child,
without reopening completed rows/pool/doubles/singles. DR-017 remains open; no second slice is started here.
See the [DR-017e brief](work-items/DR-017e-assembly-singles-slots.md).

### Previous completed singles prerequisite

DR-017d is Done with explicit user approval on 2026-10-30, after the requested correction restoring native
success/danger statistic Tags (success at >=50%, danger below).
The four confirmed mounted desktop doubles-slot containers use native Cards,
localized named headings/empty states, and semantic keyboard-accessible statistics.
CDK contracts, completed player rows, pool copying/return, lineup rules, and local forms are preserved.
Authored doubles-loop class tokens drop from 43 to 33; four dynamic palette bindings are removed.
All 153 competition tests, focused lint (41 existing warnings, no errors), and library build with 10 prerequisites pass.
Isolated Chrome verifies actual 820/1280/1440px in both themes, empty/one/full synthetic slots, long names,
accessible regions, hover/focus Tooltips, Escape dismissal, Tab movement, real pointer drag/return and form sync.
Final scoped plain-text contrast is 4.87:1 light / 6.65:1 dark.
Native Tag text contrast is 4.57:1 success / 5.30:1 danger light, 10.57:1 success / 8.77:1 danger dark.
Native focus contrast is 19.03:1 / 16.47:1 against the Card and at least 15.58:1 / 12.78:1 against Tag fills.
The final Tag matrix reverifies widths, themes, keyboard Tooltips, wrapping and SSR; initial neutral captures
are superseded. No styling overrides are introduced.
The unchanged 390px branch retains 13 Selects and no player rows/Cards in both themes.
Dutch SSR returns all four named Cards; browser checks have no page errors or GraphQL mutations.
Actual screen-reader output, exhaustive hydration, mounted English/French, authenticated/save workflows and
operational populated lineup records remain unchecked; approval is not evidence that they passed.
The user selected "Approve completion and commit with the disclosed verification limits".
Only DR-017d implementation, tests and repository handoff are approved for commit; no push.
Post-approval repository-wide lint passes across all 34 projects with existing warnings and no errors.
Singles/substitutes, mobile selectors, generator, validation, shared/theme/backend/assets remain unchanged.
No token/PassThrough overrides, new host classes, SCSS, styling substitutes, dependencies, or mutations are introduced.
Exact next action in a fresh invocation: confirm and scope one mounted desktop singles-slot child,
excluding completed rows, pool and doubles. DR-017 remains open.
The [DR-017d brief](work-items/DR-017d-assembly-doubles-slots.md) preserves final Tag evidence and unchecked limits.
Do not reopen DR-017a/b/c/d or begin another implementation child here.

### Previous completed focus

DR-017c is Done with explicit user approval on 2026-10-30: the mounted desktop assembly player pool uses a native Card,
named availability Checkboxes, a keyboard-operable backup Button, and an explicit localized empty state.
The eight live names/ranks match baseline; synthetic backups verify the conditional branch without mutations.
CDK IDs/data/connections, selection behavior, pool copy/return, and local form synchronization pass.
The user requested no `[dt]`, `[pt]`, or host classes; all scoped token overrides are removed.
No styling substitute or shared/theme change is introduced. Pool template class tokens drop from 40 to 23.
All 141 competition tests, focused lint (41 existing warnings), and library build with 10 prerequisites pass.
Installed Chrome verifies actual 820/1280/1440px in both themes, keyboard selection/disclosure, full names,
accessible names, native keyboard focus, pointer drag/return, explicit empty state, and Dutch SSR again after correction.
Minimum text contrast is 4.87:1 light / 6.65:1 dark; checked Checkbox border/focus is 3.65:1 / 10.22:1;
native unchecked border fails at 1.48:1 / 1.40:1. Disclosure focus is 8.46:1 light (pass), 1.40:1 dark (fail).
Those native contrast failures remain unchecked; the user accepted them as completion limits, not passing checks.
Separately scoped DR-032 work remains open.
The unchanged 390px branch retains 13 Selects and no player rows in both themes.
Actual screen-reader output, exhaustive hydration, mounted English/French, authenticated/save workflows,
and operational backup/empty records remain unchecked. Approval is not evidence that they passed.
The user selected "Approve completion and commit with the disclosed native contrast and verification limits".
Only DR-017c implementation, tests, and repository handoff are authorized for commit; no push.
Post-approval repository-wide lint passes across all 34 projects with existing warnings and no errors.
The completed player row is reused unchanged.
Slots, mobile selectors, captain/add-player controls, summaries, generator, validation, partner statistics,
theme, backend, and translation assets are excluded.
Exact next action: confirm and scope one mounted desktop game-slot container child in a fresh invocation,
excluding the completed rows and pool. DR-017 remains open.
Native Checkbox/secondary Button contrast, including the disclosed remaining pool failures, is tracked as DR-032,
not a hidden shared/theme change. The no-override correction and subsequent explicit approval are recorded separately
in the [brief](work-items/DR-017c-assembly-player-pool.md). Do not reopen DR-017c or start another child here.

### Earlier completed focus

DR-017b is Done with explicit user approval on 2026-10-30, after removing host styling and reverifying the correction.
The existing input-only assembly player row is refreshed once for its five pool/slot call sites.
Native warning Tags replace palette-colored icons, with localized names and hover/focus Tooltips.
Names wrap without truncation; ranking rules and parent CDK bindings are preserved.
Template class tokens drop from 22 to 11; the row-only SCSS rule/file is removed without host styling.
All 130 competition tests, focused lint (41 existing warnings), and library build with 10 prerequisites pass.
Headless Chrome verifies actual 820/1280/1440px in both themes, all five synthetic row consumers,
accessible names, native focus, hover/focus Tooltips, Escape dismissal, and a real CDK pool-to-double drag/form sync.
The eight live pool names/rankings match baseline; 390px retains the unchanged mobile branch with no player rows.
Final minimum ranking/name contrast exceeds 18:1 light and 15:1 dark; warning icon contrast exceeds 4.5:1/8.6:1.
Initial muted ranking contrast was 4.46:1 on the pool, fixed locally with semantic normal text color.
Populated Dutch SSR returns eight rows; the browser matrix has no page errors.
The user selected "Approve completion and commit with the recorded verification limits".
Actual screen-reader output, mounted English/French switching, exhaustive hydration, and full lineup/save workflows
remain unchecked; approval is not evidence that they passed.
Post-approval repository-wide lint passes across all 34 projects with existing warnings, no errors.
Pool/slot containers, mobile selectors, generator, validation, partner statistics, theme, backend, and translation
assets are unchanged. DR-017a remains Done.
Only [DR-017b](work-items/DR-017b-assembly-player-row.md) and its handoff are approved for commit; no push is authorized.
Exact next action in a fresh invocation: confirm and scope one mounted DR-017 player-pool/slot container child,
excluding the completed row component. Do not reopen DR-017b or begin another implementation slice here.
DR-017 remains open.

DR-017a is Done with explicit user approval on 2026-10-30: the mounted `/competition/assembly` heading/filter chrome
and the user's requested desktop time-range translation correction.
The decorative English eyebrow and hand-built filter surface are replaced by a localized heading, native Card,
responsive fluid controls, persistent semantic labels, and explicit accessible Select names.
The authenticated save-menu trigger uses the existing localized Save name.
Authored chrome class tokens drop from 41 to 33; two local SCSS rules are retired without new styles.
All 112 competition tests, focused lint (41 existing warnings), repository-wide lint across 34 projects,
and app build with 29 prerequisites pass.
Headless Chrome verifies actual 390/1280/1440px, both themes, and unselected/populated query-restored filter Cards.
Minimum measured text contrast is 4.87:1 light and at least 5.69:1 dark; club focus border is 3.65:1/10.22:1.
Native season keyboard selection, live club/team/encounter reads, three component-tested locales, and Dutch SSR pass.
Actual authenticated workflows, operational download/save, screen-reader output, mounted English/French switching,
and exhaustive hydration remain unchecked; approval is not evidence that they passed.
The user approved commit after fixing the desktop translations.
Both mounted time-range Selects now use native named templates and localized accessible names;
three real-locale component tests and mounted Dutch 1440px light/dark option-selection checks pass.
Generation heading/buttons already use the correct translations. Translation assets and backend remain unchanged.
Only DR-017a, the requested template correction, tests and handoff are authorized for commit; no push.
The native FloatLabel focused label failed light contrast at 2.66:1 before persistent labels replaced it here;
shared consumer auditing is deferred as DR-031.
Except for that named-template correction, player pools/slots, generator and partner statistics, service logic,
validation dialog, shared components,
theme, backend, and translations are excluded.
The historical next action to scope one mounted player-pool/slot child is fulfilled by DR-017b above.
Do not reopen DR-017a.
DR-017 remains open until its required children are scoped and complete.
See the [parent](work-items/DR-017-competition-assembly.md) and [child brief](work-items/DR-017a-assembly-page-chrome.md).

DR-016 is Done with explicit user approval on 2026-10-30 after a documentation-only consumer audit.
DR-016a through DR-016g remain Done and are not reopened.
The supplied competition mounts 12 sub-events and 26 draw links, all POULE; qualification has conditional route wiring
but no confirmed live instance in that competition. Defer qualification styling without adding a consumer or fixture.
This does not establish that qualification is globally unused.
Parent reconciliation, formatting, whitespace, and 76 inline local-link checks pass.
The user selected "Approve parent completion and commit with the recorded verification limits".
Qualification deferral and all unchecked parent criteria remain unverified; approval is not evidence that they passed.
Only the parent brief and backlog are authorized for this commit; no push is authorized.
Exact next action: confirm and scope one mounted DR-017 assembly child in a fresh invocation, not here.
If a real qualification URL is later supplied, inspect it before scoping a separate child; do not restart completed work.
See the [parent brief](work-items/DR-016-competition-draws.md).

DR-016g is Done with explicit user approval on 2026-10-30: the table uses league standings terminology,
not a generic classification.
Dutch uses Stand/Plaats; French uses Classement/Rang; aligned empty copy names the teams and series.
English Standings/Position and numeric ordering remain unchanged.
All 101 competition tests and focused lint pass (41 existing warnings).
The correct API endpoint `/api/v1/translate/i18n/:locale` returns updated Dutch/French copy and unchanged English.
The mounted Dutch page exposes Stand as heading/region, Plaats as first column, and positions 1 through 9.
Mounted French/English switching via browser cookie assignment did not change the Dutch page; do not claim it passed.
The user selected "Approve and commit with the recorded verification limits".
Unchecked criteria remain unverified; approval is not evidence that they passed.
Only DR-016g and its handoff are authorized for commit; no push is authorized.
Post-approval repository-wide lint passes across all 34 projects (29 cached results, existing warnings).
DR-016f remains Done at its approved commit.
Exact next action for a fresh invocation: confirm a mounted qualification consumer before scoping another DR-016
child; otherwise record its deferral and reconcile remaining parent acceptance.
See the [brief](work-items/DR-016g-standings-terminology.md).

DR-016f is Done with explicit user approval on 2026-10-30: the mounted poule standings section has one localized h2,
without the duplicate English eyebrow or decorative rule. Outer utility tokens drop from nine to one.
All 101 competition tests, focused lint (41 existing warnings), and app build with 29 prerequisites pass.
All nine ordered rows, 158 ordered links, 72 encounter cards, and 72/20/52/9 totals match baseline.
Populated and synthetic-empty light/dark checks fit at narrow/wide widths; heading contrast, accessible names,
keyboard scrolling, three component-tested locales, and populated Dutch SSR pass.
The integrated browser's requested 1280px width sometimes resets to 1180px; actual widths are disclosed in the brief.
Actual screen-reader output, operational empty records, exhaustive hydration, and role/sync workflows remain unchecked.
The existing input-only PouleDrawComponent has one application consumer; no abstraction was added.
Qualification, shared components, theme, translations, and backend are unchanged.
The user selected "Approve completion and commit with the recorded verification limits".
Unchecked criteria remain unverified; approval is not evidence that they passed.
Post-approval repository-wide lint passes across all 34 projects (34 cached results, existing warnings).
Only DR-016f and its handoff are authorized for commit; no push is authorized.
The next invocation should confirm a mounted qualification consumer before scoping another DR-016
child; if none exists, record its deferral and reconcile remaining parent acceptance rather than adding a consumer.
See the [brief](work-items/DR-016f-standings-section-chrome.md).

DR-016e is Done with explicit user approval on 2026-10-30: the mounted competition draw loading, error,
and overall-empty states use native PrimeNG.
Guarded resource reads allow the existing load error to render; a browser-intercepted failure and recovery pass.
All 95 competition tests, focused lint (41 existing warnings), and app build with 29 prerequisites pass.
After approval, repository-wide lint passes across all 34 projects (34 cached results, existing warnings).
Synthetic states fit at 390px/1280px in both themes; error and empty text contrast, accessible names,
and populated SSR checks pass. At 320px the unchanged shared header overflows; follow-up DR-030 is in Backlog.
Actual screen-reader output, operational empty records, exhaustive hydration, and role/sync workflows remain unchecked.
The user selected "Approve completion and commit with the recorded verification limits"; unchecked criteria remain
unverified. Only this slice and its handoff are authorized for commit; no push is authorized.
The historical next action to scope standings outer-section chrome is fulfilled by DR-016f above.
Do not restart DR-016e.
See the [brief](work-items/DR-016e-draw-states.md) for precise evidence and remaining checks.

DR-016d is Done with explicit user approval on 2026-10-28: the mounted competition draw's played/upcoming chrome
uses native Cards
and single localized semantic headings/counts. Authored shell/header utilities drop from 44 to 24.
All 88 competition tests, focused lint (41 existing warnings), and app build with 29 prerequisites pass.
All 158 ordered links, nine standings, 20/52 encounter cards, and 72/20/52/9 statistics match baseline.
Light/dark at 390px/1280px, six inspected header screenshots, header/count contrast, accessible headings,
three mounted locales, and localized populated SSR pass on the isolated port-3001 app preview.
The original port-3000 watcher retained an earlier corrected template error; it was preserved, not restarted.
The validation helper is stopped after checks. No shared source, translation asset, backend, or theme changed.
Adjacent shared expansion Button keyboard reachability passes, but its unchanged dark focus outline is only 1.40:1.
Actual screen-reader output, operational empty records, role/sync workflows, and exhaustive hydration remain unverified.
The user selected "Approve completion and commit with the recorded verification limits".
Unchecked criteria remain unverified; approval is not evidence that they passed.
Repository-required lint passes across all 34 projects (34 cached results, existing warnings, no errors).
Only the scoped implementation/tests/handoff commit is authorized; no push is authorized.
The stale port-3000 watcher may still need restarting under user control for local inspection.
The historical next action to scope a mounted loading/error/overall-empty child is fulfilled by DR-016e above.
Do not restart DR-016d.
DR-016a/b/c remain Done; DR-016 remains open.
See the [brief](work-items/DR-016d-encounter-section-chrome.md) for exact evidence and remaining checks.

DR-016c is Done with explicit user approval on 2026-10-28: the four mounted competition draw hero statistics
use restrained div/span totals
and existing translations, preserving counts/order/team fallback.
All 80 competition tests, focused lint (41 existing warnings), and app build with 29 prerequisites pass.
Rendered utility tokens drop from 66 to 44. All 157 current ordered links, nine standings,
and 72/20/52/9 totals match the invocation's baseline.
Light/dark at 390px/1280px fit; all four hero screenshots were inspected.
Contrast, accessible text, adjacent keyboard focus, three mounted locales, and localized populated SSR pass.
Actual screen-reader output, operational empty records, role/sync workflows, and exhaustive hydration remain unverified.
No shared components, translation assets, backend, or theme changed.
The user selected "Approve completion and commit with the recorded verification limits".
Unchecked criteria remain unverified; approval is not evidence that they passed.
After approval, repository-required lint passes across all 34 projects with existing warnings and no errors.
Only the scoped implementation/tests/handoff commit is authorized; no push is authorized.
The historical next action to scope one mounted section-chrome child is fulfilled by DR-016d above.
Do not restart DR-016c.
See the [brief](work-items/DR-016c-draw-statistics.md) for precise commands and evidence.
Do not begin another implementation slice in this invocation; DR-016 remains open.

DR-016b is Done with explicit user approval on 2026-10-28: the mounted competition draw hero identity/actions use
native secondary Tags and an
external-link Button, preserving the title/fallback, optional metadata, destination, and sync configuration.
All 74 competition tests, focused lint (41 existing warnings), and app build with 29 prerequisites pass.
Identity/action utility tokens drop from 57 to 17. All 158 ordered page links, nine standings, and statistics
match baseline. Light/dark 390px/1280px fit, keyboard focus/intercepted Enter, accessible naming, contrast,
three localized mounted reloads, and populated SSR pass. Four screenshots were inspected.
Actual screen-reader output, operational missing metadata, sync/role workflows, exhaustive hydration, and
every hover/active state remain unverified. No backend, translation assets, shared components, or theme changed.
The user selected "Approve completion and commit with the recorded verification limits".
Unchecked criteria remain unverified; approval is not evidence that they passed.
Repository-required lint passes across all 34 projects with existing warnings and no errors.
Only the scoped implementation/tests/handoff commit is authorized; no push is authorized.
The historical next action to scope a separate draw-statistics child is fulfilled by DR-016c above.
Do not restart DR-016b.
See the [brief](work-items/DR-016b-draw-hero.md) for precise commands and evidence.
Do not restart DR-016a or begin a second implementation slice. DR-016 remains open.

DR-016a is Done with explicit user approval on 2026-10-28: the mounted competition poule standings use native Table/Card,
named success/danger direction Tags, and a neutral secondary empty Message.
All nine rows and club links match baseline. All 63 competition tests, focused lint (41 existing warnings),
and app build with 29 prerequisites pass. Utility tokens drop from 96 to 16.
The user's "don't use [pt]" correction is applied: accessible naming and keyboard scrolling live on a semantic
outer region; the native Table has no pass-through options. Corrected four-case geometry/focus, row/link equality,
screenshots, and SSR pass. Native table semantics and column headers remain inside the named region.
Light/dark at 390px/1280px fit with keyboard-scrollable local overflow; populated and French empty screenshots
were inspected. Three mounted locales and twelve synthetic empty theme/width/locale combinations pass.
The native info Message failed dark contrast (4.32:1); secondary now passes at 7.74:1 light / 9.51:1 dark.
Populated text/status contrast, named accessibility-tree content, keyboard focus, and populated SSR pass.
Actual screen-reader output, operational missing/empty records, exhaustive hydration, and every hover/active state
remain unverified. No backend records, translations, shared components, or theme were changed.
The user selected "Approve completion and commit with the recorded verification limits" after the no-[pt] correction.
Unchecked criteria remain unverified; approval is not evidence that they passed.
Repository-required lint passes across all 34 projects (34 cached results, existing warnings).
The scoped implementation/tests/handoff commit is authorized; no push is authorized.
The historical next action to scope a separate mounted draw-chrome child is fulfilled by DR-016b above.
Do not restart DR-016a.
Qualification still requires confirming a mounted live consumer.
DR-016 remains open pending remaining children and parent acceptance. No second implementation slice was started.
See the [brief](work-items/DR-016a-poule-standings.md) for precise evidence and limits.

DR-015g is Done with explicit approval of the numbered-label correction on 2026-10-28.
The originally approved localization was committed as `7382cbb8`. The user then rejected GUID fragments
and selected "Localized numbered label, such as Poule 1". Use each draw's one-based displayed position
within its sub-event for unnamed labels and matching accessible names; preserve real names and URLs.
The corrected version passes 49/49 component tests, focused competition/translation lint, and app build.
Repository-required lint after correction approval passes across all 34 projects with existing warnings.
Mounted synthetic fixtures confirm localized numbering/reset in all three locales, light/dark 390px/1280px
fit, keyboard focus, and inspected narrow screenshots. All 52 populated link records retain their fingerprint;
restored populated SSR responds HTTP 200. No backend records were changed.
The user selected "Approve correction and commit with the recorded verification limits".
Operational unnamed records, screen-reader output, exhaustive hydration, and screenshot-size limits remain
unverified/disclosed; approval is not evidence that these passed. A separate follow-up commit is authorized.
The historical next action to scope one mounted DR-016 child is now fulfilled by DR-016a above.
Do not restart DR-015g.
Parent DR-015 remains open pending parent-level acceptance. No second implementation slice was started.
See the [brief](work-items/DR-015g-competition-draw-copy.md). No push is authorized.

Historical initial-version completion: DR-015g was approved on 2026-10-28; competition detail's unnamed-draw labels,
matching external-link accessible names,
and empty Card copy now use two real competition keys in all three locales.
The supplied route retains 12 Cards, 26 internal/external pairs, and the exact ordered link/name fingerprint.
All 46 component tests, focused competition/translation lint, and app build with 29 prerequisites pass.
After approval, repository-required lint across all 34 projects passes with existing warnings.
Synthetic Angular-resource edge fixtures render the real localized fallback and Message without backend writes.
Measured light/dark 390px/1280px geometry, keyboard focus, contrast, mounted locale reloads, and populated SSR pass.
French synthetic narrow screenshots were inspected; full-page screenshot sizing limits are recorded in the brief.
Operational unnamed/empty records, screen-reader output, and exhaustive hydration remain unverified.
The user selected "Approve completion and commit with the disclosed verification limits";
unchecked criteria remain unchecked. This authorizes only the scoped implementation/tests/handoff commit.
No class, shared terminology, tournament value, permission, global theme, or application TypeScript changed.
See the [brief](work-items/DR-015g-competition-draw-copy.md).
The historical next candidate was one bounded mounted DR-016 child; DR-016a now records that scope and evidence.
Parent DR-015 remains open pending parent-level acceptance. No second implementation slice was started.
No push is authorized.

DR-015f is Done with explicit user approval on 2026-10-28: "mark as done and commit".
Statistics retain the existing div/span vocabulary, restrained totals, readable dates, and localized context.
The user confirmed keeping concurrent competition metadata edits and updating the affected tests.
Info Tags, removed redundant Card labels/`Idx`, ASCII separators/fallbacks, and competition terminology edits
are retained. The unrelated `gladman.babel` edit is excluded from the scoped commit.
Final 34/34 tests, focused competition/translation lint, app build with 29 prerequisites,
and repository-wide lint across all 34 projects pass (existing warnings remain).
Corrected light/dark at 390px/1280px fit; all four corrected screenshots were inspected.
Summary contrast remains at least 4.87:1 light / 6.65:1 dark; adjacent keyboard access and SSR markup pass.
No list markup was added to statistics. DatePipe's English month formatting remains unchanged.
Live absent-date/zero-count data, screen-reader output, exhaustive hydration, and cross-consumer visual checks
of retained shared terminology remain unverified; applicable component coverage and historical locale checks
are recorded in the brief. Unchecked criteria stay unchecked despite explicit completion approval.
See the [brief](work-items/DR-015f-competition-statistics.md) for exact evidence and limits.
Its competition draw fallback-name/empty-copy localization follow-up is now scoped as DR-015g above.
Do not restart DR-015f.
Parent DR-015 remains open. The scoped commit is approved; no push is authorized.

DR-015e is Done with explicit user approval on 2026-10-28: the mounted competition hero's toernooi.nl
anchor now uses a native PrimeNG
secondary text Button with a competition-specific accessible name. Visibility, destination, new-tab safety,
action order, and edit/sync behavior are preserved. All 55 ordered page links and hero text match the baseline.
Twenty-four component tests, library lint (41 existing warnings), and app build with 29 prerequisites pass.
Light/dark at 390px/1280px fit; keyboard access, safely intercepted Enter activation, and SSR markup pass.
The user approved completion/commit, then requested no `[dt]` on 2026-10-28 before any commit.
The local token override is removed and a regression assertion requires undefined `dt`.
The user then requested no button outline and no underlining on any toernooi.nl icons on the page.
All 27 external anchors use `no-underline`; the hero's native outline is replaced only for keyboard focus
by a semantic primary 2px ring (3.65:1 light / 10.22:1 dark). No resting border/ring is visible.
Two focused important utilities are documented in the brief because native unlayered rules otherwise win.
One native contrast limit remains: light active text 4.46:1 fails 4.5:1.
Normal/hover text passes (minimum 4.66:1 light / 6.28:1 dark); no replacement styling was introduced.
Final tests, lint, build, and four-case geometry/focus pass apart from the light active-text contrast failure.
Four final screenshots were inspected; earlier screenshots with the removed override remain historical.
Mounted alternate locale, authenticated edit interaction, live missing-code data, exhaustive hydration,
screen-reader output, and operational sync remain unverified; relevant presentation branches have component coverage.
See the [brief](work-items/DR-015e-competition-hero-link.md) for exact evidence and limits.
The user selected "Approve completion and commit" after reviewing the outline/underline corrections and
disclosed light active-text contrast failure and other verification limits. Unchecked criteria remain unverified
or failed; approval is not evidence that they passed. The scoped implementation/tests/handoff commit is authorized.
Its competition hero statistics follow-up is now scoped as DR-015f above.
Keep parent DR-015 open. No push is authorized.

DR-015d is Done with explicit user approval on 2026-10-23: the mounted competition sub-event metadata row
now uses native secondary PrimeNG Tags.
Maximum level, index bounds/separator, event type, truthy visibility conditions, translations,
ordering, and draw destinations are preserved; sync behavior is unchanged.
All 12 Cards retain identical normalized metadata and all 52 ordered draw destinations.
Nineteen component tests, library lint (41 existing warnings), and app build with 29 prerequisites pass.
Light/dark at 390px/1280px fit without overflow; all four final screenshots were inspected.
Minimum metadata contrast is 7.74:1 light / 9.50:1 dark. Static semantics, existing keyboard focus,
and SSR markup pass. Mounted alternate locale, live absent/zero metadata, exhaustive hydration,
screen-reader output, and operational sync actions remain unverified; edge cases/locale are component-tested.
See the [brief](work-items/DR-015d-competition-metadata.md).
The user selected "Approve completion and commit", accepting the disclosed verification limits;
unchecked checks remain unverified. Its scoped implementation/tests/handoff commit is authorized.
The competition hero external-link follow-up is now scoped as DR-015e above, preserving mounted behavior.
Keep parent DR-015 open. No push is authorized.

DR-015c is Done with explicit user approval on 2026-10-23: competition draw lists use native PrimeNG
anchor Buttons and a native empty Message. The user selected "Approve completion and commit",
accepting the disclosed verification limits; unchecked checks remain unverified.
Draw metadata remains visible, external links have draw-specific accessible names, and long names wrap.
One Card `min-w-0` utility prevents unbroken names from widening the mobile grid; no custom CSS was added.
All 26 internal and 26 external destinations retain the same ordered SHA-256 fingerprint.
Eleven component tests, library lint (41 existing warnings), and app build pass.
Light/dark at 390px/1280px, a browser-only 240-character name stress check, keyboard activation/focus,
SSR markup, and final screenshot inspection pass. Normal/hover text contrast is at least 4.66:1 light
and 6.28:1 dark. Mounted alternate locale, live empty data, exhaustive hydration, and screen-reader
output remain unverified; empty/fallback/locale behavior has component-test coverage.
See the [brief](work-items/DR-015c-competition-draw-links.md) for approval and verification details.
Its metadata-chip follow-up is now scoped as DR-015d above, preserving values and conditionals.
Keep parent DR-015 open. The scoped implementation/tests/handoff commit is approved; no push is authorized.

DR-015b is Done with explicit user approval on 2026-10-23 following the formatting/SCSS-removal request.
The user confirmed "we are done. mark it so and commit", accepting the disclosed verification limits.
The entire competition detail
template is formatted; its local SCSS and reference are deleted. The hero uses existing shared avatar/title
components, totals/headings use Tailwind and semantic classes, official/type statuses use native Tags,
and the existing error presentation uses a native Message. No custom CSS replacement was introduced.
The competition detail's group shortcuts use native PrimeNG buttons,
translated names/counts, associated targets, and semantic section/group/event headings.
Eight component tests, library lint (41 existing warnings), app build, and Prettier HTML check pass.
Light/dark 390px/1280px document/hero/Card/navigation geometry, keyboard activation, settled text contrast
(4.57:1 light / 6.65:1 dark minimum across the expanded styling scope), and SSR markup pass.
Final light-mobile hero/Card and dark-desktop hero screenshots were inspected.
Alternate-locale coverage is a component test, not a mounted locale pass;
exhaustive hydration and screen-reader output remain unverified. See the
[brief](work-items/DR-015b-competition-group-navigation.md).
Its draw-link follow-up is now scoped and implemented as DR-015c above.
Parent DR-015 remains open. No push is authorized.

DR-006j is Done with explicit user approval on 2026-10-23.
The routed host now shrinks to the content width while the existing bracket canvas remains horizontally scrollable.
Focused layout tests and relevant library/app lint/build checks pass. The full bracket-tree suite retains six
pre-existing failures unrelated to this change. Light/dark 390px/1280px geometry and keyboard link focus pass;
pixel contrast remains unverified. The user approved completion with this limit disclosed. See the
[brief](work-items/DR-006j-bracket-tree-responsive.md).
Parent DR-015 remains open for the remaining competition-detail presentation work.

DR-015a is Done with explicit user approval on 2026-10-23 after replacing the mounted competition detail's custom
sub-event article surface with native PrimeNG Cards. Existing grouping, draw links, metadata, sync controls, and
responsive grid behavior are preserved. The supplied competition route was inspected after the app rebuild;
narrow/light pixel review and keyboard, SSR, locale, and screen-reader checks remain pending and were accepted as
disclosed limits. See the [brief](work-items/DR-015a-competition-event-cards.md).

The mounted DR-006 consumer inventory found no production callers for the legacy `match-row` or `upcoming-match`
components. No redesign child was created for unused components; adding a consumer only for verification would
violate the consumer-first scope rule. The next mounted slice is [DR-008a](work-items/DR-008a-player-hero-actions.md),
which gives the player detail hero's icon-only actions a localized accessible name without changing its behavior.
DR-008a is Done with explicit user approval on 2026-10-23; mounted light/dark narrow/wide geometry and keyboard
menu activation pass. No pixel-contrast measurement or alternate-locale browser pass is claimed.

DR-006i is Done with explicit user approval on 2026-10-23 after the inline-style removal request.
Summaries and expanded games
use native Cards, Tailwind layout, and semantic text; all component CSS is removed, with no SCSS or inline-style
replacement. Plain encounter scores retain their large format and centered separator. Player groups, routes,
levels, game order/results, played-set pairs, loading, and expansion are preserved. Upcoming markup, services,
and global styling are unchanged. All 20 focused tests, component lint/build, and app build pass
(31 existing lint warnings). Final expanded eight-game lists fit at 390px/1280px in light/dark on team detail,
club schedule, and the user's current draw. Four expanded screenshots were inspected; final collapsed SSR passes.
Earlier keyboard checks passed; the named native button still intentionally replaces mouse-only whole-row activation.
Available live games lack player memberships/set scores: populated names, badges, result labels, and set pairs have
focused-test coverage, not mounted pixel verification. Alternate locales, exhaustive hydration, and screen-reader
output remain unverified.
The user requested "commit and push", accepting completion with the disclosed verification limits;
unchecked criteria remain unverified. The scoped commit and branch push are authorized.
Exact next action: inspect mounted shared match/bracket consumers and scope the next DR-006 child.
Do not start another implementation here. Parent DR-006 stays open.
See the [brief](work-items/DR-006i-played-encounter-cards.md).

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

| ID                                                            | Area                                                                         | Status      |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------- |
| [DR-001][baseline]                                            | Theme and design baseline                                                    | Done        |
| [DR-002][pilot]                                               | Home page pilot                                                              | Done        |
| [DR-003][shell-work-item]                                     | App shell, navigation, search, and layouts                                   | Done        |
| [DR-004][heading-work-item]                                   | Shared headings, hero, and breadcrumb                                        | Done        |
| DR-005                                                        | Shared ranking, statistics, and status patterns                              | Backlog     |
| [DR-005a][tier-badge-work-item]                               | Shared tier badge                                                            | Done        |
| [DR-005b][form-sequence-work-item]                            | Shared form sequence                                                         | Done        |
| [DR-005c](work-items/DR-005c-sparkline.md)                    | Shared sparkline                                                             | Done        |
| [DR-005d](work-items/DR-005d-stat-card.md)                    | Shared stat-card                                                             | Done        |
| [DR-005e](work-items/DR-005e-ranking-progress.md)             | Shared ranking progress                                                      | Done        |
| DR-006                                                        | Shared games, matches, and brackets                                          | Backlog     |
| [DR-006a](work-items/DR-006a-recent-game-points.md)           | Mounted player recent-game point indicators                                  | Done        |
| [DR-006b](work-items/DR-006b-recent-game-scores.md)           | Mounted player recent-game set scores                                        | Done        |
| [DR-006c](work-items/DR-006c-recent-game-results.md)          | Mounted player recent-game result indicator                                  | Done        |
| [DR-006d](work-items/DR-006d-recent-game-filters.md)          | Mounted player recent-game heading and filters                               | Done        |
| [DR-006e](work-items/DR-006e-recent-game-loading.md)          | Mounted player recent-game loading presentation                              | Done        |
| [DR-006f](work-items/DR-006f-upcoming-game-cards.md)          | Mounted player populated upcoming-game cards                                 | Done        |
| [DR-006g](work-items/DR-006g-upcoming-game-states.md)         | Mounted player upcoming-games presentation                                   | Done        |
| [DR-006h](work-items/DR-006h-upcoming-encounter-cards.md)     | Shared upcoming encounter cards                                              | Done        |
| [DR-006i](work-items/DR-006i-played-encounter-cards.md)       | Shared played encounter cards and expanded presentation                      | Done        |
| [DR-006j](work-items/DR-006j-bracket-tree-responsive.md)      | Shared bracket responsive layout                                             | Done        |
| DR-007                                                        | Shared form controls and sync feedback                                       | Backlog     |
| DR-008                                                        | Player detail                                                                | Backlog     |
| [DR-008a](work-items/DR-008a-player-hero-actions.md)          | Player hero actions                                                          | Done        |
| [DR-008b](work-items/DR-008b-player-sidebar-cards.md)         | Player detail sidebar cards (form, record, match-ups, teams)                 | Done        |
| [DR-008c](work-items/DR-008c-player-page-chrome.md)           | Player detail page chrome (hero identity, actions copy, loading/error)       | Done        |
| DR-009                                                        | Player head-to-head                                                          | Backlog     |
| DR-010                                                        | Player ranking breakdown                                                     | Backlog     |
| DR-011                                                        | Player editing                                                               | Backlog     |
| DR-012                                                        | Club detail and browsing tabs                                                | Done        |
| [DR-012a](work-items/DR-012a-club-page-chrome.md)             | Club detail page chrome (hero identity, actions copy, loading/error)         | Done        |
| [DR-012b](work-items/DR-012b-club-hero-stats.md)              | Club hero stats strip (teams, season record, ranking, next home match)       | Done        |
| [DR-012c](work-items/DR-012c-club-sidebar-cards.md)           | Club sidebar cards (upcoming fixtures, top performers)                       | Done        |
| [DR-012d](work-items/DR-012d-club-teams-tab.md)               | Club teams tab (`app-team-card`, filter bar)                                 | Done        |
| [DR-012e](work-items/DR-012e-club-player-roster-tab.md)       | Club player roster tab                                                       | Done        |
| [DR-012f](work-items/DR-012f-club-schedule-tab.md)            | Club schedule tab                                                            | Done        |
| [DR-012g](work-items/DR-012g-club-tournaments-tab.md)         | Club tournaments tab                                                         | Done        |
| [DR-013](work-items/DR-013-club-team-builder.md)              | Club team builder                                                            | In progress |
| [DR-013a](work-items/DR-013a-builder-settings.md)             | Team-builder settings dialog                                                 | Done        |
| DR-013b                                                       | Builder toolbar, layout and player pools                                     | Backlog     |
| DR-013c                                                       | Builder team cards                                                           | Backlog     |
| DR-013d                                                       | Builder player chips                                                         | Backlog     |
| DR-013e                                                       | Survey import dialog                                                         | Backlog     |
| DR-013f                                                       | Survey edit dialog                                                           | Backlog     |
| DR-013g                                                       | Sub-event dialog                                                             | Backlog     |
| DR-014                                                        | Club team detail                                                             | Backlog     |
| DR-015                                                        | Competition detail and sub-event presentation                                | Backlog     |
| [DR-015a](work-items/DR-015a-competition-event-cards.md)      | Competition sub-event Cards                                                  | Done        |
| [DR-015b](work-items/DR-015b-competition-group-navigation.md) | Competition navigation and local-style retirement                            | Done        |
| [DR-015c](work-items/DR-015c-competition-draw-links.md)       | Competition draw links and empty presentation                                | Done        |
| [DR-015d](work-items/DR-015d-competition-metadata.md)         | Competition sub-event metadata Tags                                          | Done        |
| [DR-015e](work-items/DR-015e-competition-hero-link.md)        | Competition hero external link                                               | Done        |
| [DR-015f](work-items/DR-015f-competition-statistics.md)       | Competition hero statistics and localization                                 | Done        |
| [DR-015g](work-items/DR-015g-competition-draw-copy.md)        | Competition draw fallback and empty copy                                     | Done        |
| [DR-016](work-items/DR-016-competition-draws.md)              | Competition draws                                                            | Done        |
| [DR-016a](work-items/DR-016a-poule-standings.md)              | Competition poule standings                                                  | Done        |
| [DR-016b](work-items/DR-016b-draw-hero.md)                    | Competition draw hero identity and actions                                   | Done        |
| [DR-016c](work-items/DR-016c-draw-statistics.md)              | Competition draw hero statistics                                             | Done        |
| [DR-016d](work-items/DR-016d-encounter-section-chrome.md)     | Competition draw encounter section chrome                                    | Done        |
| [DR-016e](work-items/DR-016e-draw-states.md)                  | Competition draw loading, error, and overall-empty                           | Done        |
| [DR-016f](work-items/DR-016f-standings-section-chrome.md)     | Competition poule standings section chrome                                   | Done        |
| [DR-016g](work-items/DR-016g-standings-terminology.md)        | Competition league standings terminology                                     | Done        |
| [DR-017](work-items/DR-017-competition-assembly.md)           | Competition assembly                                                         | Done        |
| [DR-017a](work-items/DR-017a-assembly-page-chrome.md)         | Assembly page heading and filter chrome                                      | Done        |
| [DR-017b](work-items/DR-017b-assembly-player-row.md)          | Reusable assembly player row                                                 | Done        |
| [DR-017c](work-items/DR-017c-assembly-player-pool.md)         | Desktop assembly player-pool container                                       | Done        |
| [DR-017d](work-items/DR-017d-assembly-doubles-slots.md)       | Desktop assembly doubles-slot containers                                     | Done        |
| [DR-017e](work-items/DR-017e-assembly-singles-slots.md)       | Desktop assembly singles-slot containers                                     | Done        |
| [DR-017f](work-items/DR-017f-assembly-substitutes.md)         | Desktop assembly substitutes container                                       | Done        |
| [DR-017g](work-items/DR-017g-assembly-generation-controls.md) | Desktop assembly generation controls                                         | Done        |
| [DR-017h](work-items/DR-017h-assembly-validation-overview.md) | Assembly validation overview and reused message content                      | Done        |
| [DR-017i][dr-017i]                                            | Desktop assembly partner combinations                                        | Done        |
| [DR-017j][dr-017j]                                            | Responsive assembly captain/add-player searches                              | Done        |
| [DR-017k][dr-017k]                                            | Reused assembly base/titular information summaries                           | Done        |
| [DR-017l](work-items/DR-017l-assembly-mobile-singles.md)      | Mobile assembly singles selectors                                            | Done        |
| [DR-017m](work-items/DR-017m-assembly-mobile-doubles.md)      | Mobile assembly doubles surfaces                                             | Done        |
| [DR-017n](work-items/DR-017n-assembly-mobile-substitutes.md)  | Mobile assembly substitutes picker                                           | Done        |
| [DR-017o](work-items/DR-017o-assembly-confirmation-dialog.md) | Assembly confirmation dialog chrome/actions                                  | Done        |
| [DR-017p](work-items/DR-017p-assembly-loading-feedback.md)    | Assembly loading feedback                                                    | Done        |
| [DR-017q](work-items/DR-017q-assembly-load-feedback.md)       | Assembly load-error and unselected feedback                                  | Done        |
| [DR-017r](work-items/DR-017r-assembly-search-card-parity.md)  | Assembly change-team Card and responsive search parity                       | Done        |
| DR-017s                                                       | Deferred authenticated assembly Save popup                                   | Backlog     |
| DR-018                                                        | Competition editing                                                          | Backlog     |
| [DR-019](work-items/DR-019-tournament-browsing.md)            | Tournament detail and retired club tournaments                               | Done        |
| [DR-019a](work-items/DR-019a-tournament-identity.md)          | Tournament complete hero parity                                              | Done        |
| DR-019b                                                       | Reserved history: summaries/actions absorbed into DR-019a                    | Backlog     |
| [DR-019c](work-items/DR-019c-tournament-live-navigation.md)   | Tournament detail live-navigation links                                      | Done        |
| [DR-019d](work-items/DR-019d-tournament-events.md)            | Tournament detail sub-events and draw-link presentation                      | Done        |
| [DR-019e](work-items/DR-019e-club-tournament-chrome.md)       | Retire obsolete tournament club page                                         | Done        |
| [DR-019f](work-items/DR-019f-tournament-feedback.md)          | Tournament detail loading/error feedback                                     | Done        |
| [DR-019g](work-items/DR-019g-draw-external-link-contract.md)  | Investigate draw external-link visualCode query contract                     | Done        |
| DR-019h                                                       | Club tournament tabs; withdrawn with page retirement                         | Done        |
| [DR-020](work-items/DR-020-tournament-forms.md)               | Tournament creation and editing                                              | Done        |
| [DR-020a](work-items/DR-020a-creation-chrome.md)              | Creation chrome and native form Card                                         | Done        |
| [DR-020b](work-items/DR-020b-creation-fields.md)              | Creation fields and mutation feedback                                        | Done        |
| [DR-020c](work-items/DR-020c-editing-chrome.md)               | Editing chrome and actions                                                   | Done        |
| [DR-020d](work-items/DR-020d-editing-information.md)          | Editing information tab                                                      | Done        |
| [DR-020e](work-items/DR-020e-editing-settings.md)             | Editing settings tab                                                         | Done        |
| [DR-021](work-items/DR-021-tournament-enrollment.md)          | Tournament enrollment workflows                                              | In progress |
| [DR-021a](work-items/DR-021a-enrollment-chrome.md)            | General enrollment page chrome                                               | Done        |
| [DR-021b](work-items/DR-021b-enrollment-filters.md)           | General enrollment filters and rankings                                      | Done        |
| [DR-021c](work-items/DR-021c-enrollment-selection.md)         | General enrollment selection tiles                                           | Done        |
| [DR-021d](work-items/DR-021d-enrollment-cart.md)              | General enrollment cart                                                      | Done        |
| [DR-021e](work-items/DR-021e-partner-dialog.md)               | Partner-selection dialog                                                     | Done        |
| [DR-021f](work-items/DR-021f-sub-event-enrollment.md)         | Retire obsolete sub-event and my-enrollments pages                           | Done        |
| [DR-021f1](work-items/DR-021f1-enrollment-chrome.md)          | Sub-event chrome; withdrawn with page retirement                             | Done        |
| DR-021f2                                                      | Sub-event forms/info; withdrawn with page retirement                         | Done        |
| DR-021f3                                                      | Sub-event lists; withdrawn with page retirement                              | Done        |
| DR-021f4                                                      | Guest dialog; withdrawn with page retirement                                 | Done        |
| DR-021g                                                       | Incomplete my-enrollments page; withdrawn with retirement                    | Done        |
| [DR-021h](work-items/DR-021h-enrollment-ranking-polish.md)    | Jouw Rankings visual polish; retained after DR-021b review                   | Done        |
| DR-021i                                                       | Future my-enrollments overview; separately scope later                       | Backlog     |
| DR-022                                                        | Tournament draw detail                                                       | Done        |
| [DR-022a](work-items/DR-022a-draw-identity.md)                | Draw identity and actions                                                    | Done        |
| [DR-022b](work-items/DR-022b-draw-feedback.md)                | Draw switching and page loading/error/empty feedback                         | Done        |
| [DR-022c](work-items/DR-022c-draw-games.md)                   | Mounted draw games                                                           | Done        |
| [DR-022d](work-items/DR-022d-draw-standings.md)               | Mounted round-robin draw standings                                           | Done        |
| [DR-023](work-items/DR-023-admin-acceptance.md)               | Tournament admin: enrollments and check-in aggregate acceptance              | Done        |
| [DR-023a](work-items/DR-023a-admin-chrome.md)                 | Shared tournament administration chrome and feedback                         | Done        |
| [DR-023b](work-items/DR-023b-admin-enrollments.md)            | Enrollment management; aggregate approved with disclosed limits              | Done        |
| [DR-023b1](work-items/DR-023b1-enrollment-summary.md)         | Enrollment-management five-count summary                                     | Done        |
| [DR-023b2](work-items/DR-023b2-enrollment-filters.md)         | Enrollment filters/selection; shared Card border and nested Panels           | Done        |
| [DR-023b3](work-items/DR-023b3-enrollment-table.md)           | Enrollment table and feedback; explicit query errors                         | Done        |
| [DR-023b4](work-items/DR-023b4-manual-enrollment.md)          | Manual enrollment dialog and functional authorized creation                  | Done        |
| [DR-023b5](work-items/DR-023b5-enrollment-locales.md)         | Mounted enrollment locale completeness; descriptions, statuses and feedback  | Done        |
| [DR-023c](work-items/DR-023c-admin-checkin.md)                | Check-in aggregate acceptance across four approved children                  | Done        |
| [DR-023c1](work-items/DR-023c1-checkin-summary.md)            | Check-in five-count summary and approved read-API prerequisite               | Done        |
| [DR-023c2](work-items/DR-023c2-checkin-filters.md)            | Reactive check-in filters/search and refresh consolidation                   | Done        |
| [DR-023c3](work-items/DR-023c3-checkin-table.md)              | Check-in table/feedback and operational action presentation                  | Done        |
| [DR-023c4](work-items/DR-023c4-checkin-locales.md)            | Remaining mounted check-in locale completeness                               | Done        |
| [DR-024](work-items/DR-024-admin-draws-scheduling.md)         | Tournament admin: draws and scheduling; approved with disclosed child limits | Done        |
| [DR-024a](work-items/DR-024a-admin-draws.md)                  | Draw management aggregate; approved with disclosed verification limits       | Done        |
| [DR-024a1](work-items/DR-024a1-draw-read.md)                  | Reactive draw selection and explicit read feedback prerequisite              | Done        |
| [DR-024a2](work-items/DR-024a2-draw-summary.md)               | Draw summary presentation                                                    | Done        |
| [DR-024a3](work-items/DR-024a3-draw-presentation.md)          | Draw filters, assignment and draw-list presentation aggregate                | Done        |
| [DR-024a3a](work-items/DR-024a3a-draw-filters.md)             | Draw sub-event filter and top-level actions                                  | Done        |
| [DR-024a3b](work-items/DR-024a3b-unassigned-entries.md)       | Unassigned entry selection and assignment                                    | Done        |
| [DR-024a3c](work-items/DR-024a3c-draw-lists.md)               | Draw lists, draw actions and empty/no-selection panels                       | Done        |
| [DR-024a4](work-items/DR-024a4-draw-dialogs-locales.md)       | Draw dialogs and mounted locale completeness aggregate                       | Done        |
| [DR-024a4a](work-items/DR-024a4a-seeding-dialog.md)           | Seeding dialog, scoped locale options and operation states                   | Done        |
| [DR-024a4b](work-items/DR-024a4b-creation-dialog.md)          | Creation dialog; remove ignored controls with explicit scope approval        | Done        |
| [DR-024a4c](work-items/DR-024a4c-draw-locales.md)             | Remaining mounted draw locale completeness                                   | Done        |
| [DR-024b](work-items/DR-024b-admin-scheduling.md)             | Scheduling; all children done, approved with disclosed limits                | Done        |
| [DR-024b1](work-items/DR-024b1-schedule-read.md)              | Scheduling reads/error feedback; approved with disclosed verification limits | Done        |
| [DR-024b2](work-items/DR-024b2-schedule-summary.md)           | Scheduling summary and mounted count labels; approved with disclosed limits  | Done        |
| [DR-024b3](work-items/DR-024b3-schedule-controls.md)          | Scheduling controls and labels; approved with disclosed verification limits  | Done        |
| [DR-024b4](work-items/DR-024b4-schedule-grid.md)              | Scheduling grid/game panel; approved with disclosed verification limits      | Done        |
| [DR-024b5](work-items/DR-024b5-schedule-dialogs.md)           | Scheduling Generate/Auto-schedule dialogs; approved with disclosed limits    | Done        |
| [DR-024b6](work-items/DR-024b6-schedule-copy.md)              | Scheduling confirmations and localized game names                            | Done        |
| [DR-025](work-items/DR-025-admin-settings.md)                 | Tournament admin: settings; all children done, approved with limits          | Done        |
| [DR-025a](work-items/DR-025a-settings-phase-general.md)       | Settings phase stepper and general settings                                  | Done        |
| [DR-025b](work-items/DR-025b-settings-sub-events.md)          | Settings sub-events table and dialog                                         | Done        |
| [DR-025c](work-items/DR-025c-settings-confirmations.md)       | Settings confirmations and shared error feedback                             | Done        |
| [DR-026](work-items/DR-026a-live-courts.md)                   | Tournament live displays and kiosk; children a-d Done with limits            | Done        |
| [DR-026a](work-items/DR-026a-live-courts.md)                  | Live courts display and shared live header                                   | Done        |
| [DR-026b](work-items/DR-026b-live-results.md)                 | Live results display                                                         | Done        |
| [DR-026c](work-items/DR-026c-live-upcoming.md)                | Live upcoming display                                                        | Done        |
| [DR-026d](work-items/DR-026d-live-kiosk.md)                   | Live kiosk display                                                           | Done        |
| DR-027                                                        | Global admin and search indexing; only child a, parent tabs unchanged        | Done        |
| [DR-027a](work-items/DR-027a-admin-search-indexing.md)        | Admin search-indexing tab Cards and form                                     | Done        |
| DR-028                                                        | Sync administration; children a-d Done, team matching deferred (unmounted)   | Done        |
| [DR-028a](work-items/DR-028a-sync-overview.md)                | Sync overview section Cards and progress bar                                 | Done        |
| [DR-028b](work-items/DR-028b-sync-ranking-tab.md)             | Sync ranking systems tab Card                                                | Done        |
| [DR-028c](work-items/DR-028c-sync-plans-tab.md)               | Sync plans tab Cards                                                         | Done        |
| [DR-028d](work-items/DR-028d-cron-jobs-tab.md)                | Sync cron jobs tab Card                                                      | Done        |
| DR-029                                                        | Legacy styling retirement and final regression                               | Backlog     |
| DR-030                                                        | Shared header overflow at 320px                                              | Backlog     |
| DR-031                                                        | Native FloatLabel focused-label contrast audit                               | Backlog     |
| DR-032                                                        | Native Checkbox and secondary Button contrast audit                          | Backlog     |
| DR-033                                                        | Native Button contrast and Tooltip association audit                         | Backlog     |
| DR-034                                                        | Native Message severity text contrast audit                                  | Backlog     |
| DR-035                                                        | Native Fieldset descendant tab-stop restoration audit                        | Backlog     |
| DR-036                                                        | Mobile assembly replacement and duplicate-rule parity                        | Backlog     |
| DR-037                                                        | Native Select default feedback localization audit                            | Backlog     |
| DR-038                                                        | Native ProgressBar value/track contrast audit                                | Backlog     |
| DR-039                                                        | Assembly filter/service selection synchronization                            | Backlog     |
| DR-040                                                        | Investigate competition detail resource error rendering                      | Backlog     |
| DR-041                                                        | Club tournament repairs; withdrawn with page retirement                      | Done        |
| [DR-042](work-items/DR-042-draw-external-link-repair.md)      | Restore tournament detail draw external-link query field                     | Done        |
| DR-043                                                        | Native DatePicker accessibility-label localization audit                     | Backlog     |
| DR-044                                                        | Native Tabs selected-text contrast audit                                     | Backlog     |
| DR-045                                                        | Native MultiSelect chip accessibility and locale audit                       | Backlog     |
| DR-046                                                        | Enrollment tile localization gaps                                            | Backlog     |
| DR-047                                                        | Enrollment desktop sticky sidebar/header overlap                             | Backlog     |
| DR-048                                                        | Partner search failure feedback and request lifecycle                        | Backlog     |
| DR-049                                                        | Sub-event localization; withdrawn with page retirement                       | Done        |
| DR-050                                                        | Shared GraphQL nested AND/OR conversion loses predicates                     | Backlog     |
| DR-051                                                        | Check-in operational result feedback, stale selection and post-write focus   | Backlog     |
| DR-052                                                        | Shared French action and tournament-administration tab terminology           | Backlog     |
| DR-053                                                        | Draw operational result feedback, selection and post-write focus             | Backlog     |
| DR-054                                                        | Scheduling date-option stability and focus across read-state remounts        | Backlog     |
| DR-055                                                        | Admin indexing tab hard-coded English copy and toast messages                | Backlog     |
| DR-056                                                        | Admin page dead `@if (false)` access-denied branch                           | Backlog     |
| DR-057                                                        | Native PrimeNG paginator aria-labels stay English in nl/fr                   | Backlog     |
| DR-058                                                        | Native InputNumber spinner icon contrast audit                               | Backlog     |
| DR-059                                                        | Club Jest setup requires missing zone.js                                     | Backlog     |

[dr-017i]: work-items/DR-017i-assembly-partner-combinations.md
[dr-017j]: work-items/DR-017j-assembly-player-searches.md
[dr-017k]: work-items/DR-017k-assembly-player-summaries.md

## App and shared surfaces

### DR-058: Native InputNumber spinner contrast

- DR-013a browser checks on `/clubs/smash-for-fun` → Ploegopstelling → Instellingen find enabled native spinner
  icons at 2.67:1 against their field background in light and 2.26:1 in dark, below the 3:1 non-text target.
- The SVG icons inherit the native button color; no page overrides were added. Audit the shared preset/component
  tokens and other InputNumber consumers in a separate slice; do not repair global styling in a dialog-only task.
- The existing primary Save text also fails at 3.65:1 in light; that remains under DR-033.

### DR-059: Club Jest setup alignment

- DR-013a's focused test cannot start with `libs/frontend/pages/club/src/test-setup.ts`: it imports
  `setupZoneTestEnv`, which requires the absent `zone.js`.
- The existing tournament setup uses `setupZonelessTestEnv` and runs the new settings accessibility test successfully
  when selected through a temporary config override. No dependency or shared test-setup changes were made.
- Scope a separate club test-setup alignment and run the existing player-matcher tests as well as component tests.
  Do not describe the temporary-override pass as a default-target pass.

### DR-054: Scheduling date-option stability and read focus

- DR-024b3 source inspection confirms `availableDates` derives from already date-filtered slots in
  `schedule-tab.service.ts`; choosing one day narrows the available days until the filter is cleared.
- The existing top-level loading branch unmounts successful controls on every read. A refreshed date filter
  is a new element; focus restoration across filter/refetch is not implemented or claimed.
- Scope read-option ownership and stable keyboard focus separately, preserving local-midnight serialization,
  explicit loading/errors and existing permission gates. No service behavior change is hidden in controls styling.
- Complete keyboard-only date selection also needs a settled browser recheck after DR-024b3's fixture timeout.

### DR-052: adjacent French action and administration tab terminology

- DR-024a4c browser checks observe global `all.button.create` as "Création", and tournament administration
  tab labels "Entrées"/"Dessiner"/"Enregistrement" rather than domain-consistent action/entry/draw/check-in terms.
- Scope shared dictionary changes separately, inventory their mounted consumers and verify all affected surfaces.
  Draw-child copy is corrected, but its locale-only slice does not silently change shared/global labels.
- Native English option-list and dropdown-trigger labels remain under DR-037.

### DR-053: draw operational reliability

- DR-024a4c source inspection confirms mounted generate/delete/assign/remove/clear operations can return false
  without explicit feedback for absent mutation data; partial-result and post-refetch selection/focus need scoping.
- Keep operational behavior separate from the locale-only child. Inventory response contracts and intended
  partial-success/permission semantics, then use mocked tests rather than tournament-data mutations for design checks.
- Creation/seeding children already handle their own missing/malformed results; do not regress those paths.

### DR-051: check-in operational reliability

- Separately scope the existing smart tab/service's operational result handling, rather than hiding business changes
  inside DR-023c3 presentation.
- Missing mutation data currently returns false/null without explicit feedback; bulk partial results clear the entire
  selection without surfacing failed IDs. Selection can outlive filtering, refetch or a tournament context change.
- Native row controls are replaced during successful refetch; preserving post-write focus needs an explicit target.
- Confirm intended partial-success/selection semantics and permission/phase/concurrency requirements before changing
  contracts. Use mocked tests; do not mutate tournament data merely to verify design.
- DR-023c3 only names/disables existing controls, excludes missing-ID pending records from Select pending and fixes
  template variable shadowing of `checkIn()`. It does not claim complete operational workflow verification.

### DR-050: nested GraphQL filter conversion

Discovered during DR-023b4 live manual-player search on 2026-11-08.
[GraphQLWhereConverter](../../libs/backend/graphql/src/utils/queryFixer.ts) converts each AND child's OR to
only its first member, then Object.assign overwrites earlier matching-field conditions.
The generic players query for a surname/first-name pair consequently returned unrelated first-name matches.
DR-023b4 uses a bounded enrollment-specific parameterized search; shared converter behavior is unchanged.
Separately inventory confirmed consumers and test logical predicates before repairing shared query semantics.
Do not broaden the dialog slice into a global filtering rewrite.

### DR-049: sub-event enrollment localization gaps

Withdrawn on 2026-11-07 with user-directed page retirement. No dictionary changes are made for a removed consumer.
The following records historical evidence, not a current application issue:

DR-021f1 confirms the real sub-event enrollment consumer. Existing `all.enrollment.fullWithWaitingList`
is absent from English/French/Dutch dictionaries and now appears as a raw key in the native full Message.
Existing Card/list labels such as `info`, `type`, `confirmedEntries`, `noConfirmed` and `waitingList`
also render raw keys; service errors and literal Singles/Doubles/Guest copy need a separately scoped audit.
Historical source: removed sub-event template and the
[translation dictionaries](../../libs/backend/translate/assets/i18n).
Preserve semantics and supported languages; do not hide missing labels with success-shaped English fallbacks.
Scope translation/error-copy work separately; DR-021f1 adds no dictionary or service changes.

### DR-033 additional evidence: administration draw filters

- [DR-024a3a](work-items/DR-024a3a-draw-filters.md), mounted authorized Draws filter Panel on 2026-11-09:
  native primary Create text fails light normal-state contrast at 3.65:1; dark passes at 10.63:1.
- Native secondary Generate/Refresh normal text passes at 4.87:1 light and 6.65:1 dark on the native Panel.
  Header/label/selector normal text also passes. Exhaustive hover/focus/border contrast remains unverified.
- Preserve native styling here; any shared theme correction belongs to DR-033 with cross-consumer validation.
- [DR-024a3b](work-items/DR-024a3b-unassigned-entries.md), same mounted consumer on 2026-11-09:
  synthetic-populated native Assign normal text also fails light at 3.65:1 and passes dark at 10.63:1.
  Selection text passes at 4.67:1 light / 10.30:1 dark; badge text passes at 7.74:1 / 9.51:1.
  Retain this additional consumer in the shared audit, without page-specific color workarounds.

### DR-032/034 historical evidence: withdrawn sub-event enrollment chrome

The sub-event consumer is removed on 2026-11-07. These measurements do not require page fixes or restarting
DR-021f1; shared audits remain open for other surviving consumers.

DR-021f1 native Back text measures 4.46:1 light / 6.91:1 dark; light fails 4.5:1 (DR-032).
Native closed warning text measures 2.83:1 light / 7.98:1 dark; error text 4.41:1 light / 4.63:1 dark.
Light warning/error text fails 4.5:1; retain the shared native Message audit (DR-034).
Info text passes sampled 4.75:1 light / 4.57:1 dark but lacks localization (DR-049).
Semantic heading/subtitle passes 18.20:1 light / 16.64:1 dark.
No page overrides; exhaustive focus and screen-reader contrast remains unverified.
See the [DR-021f1 brief](work-items/DR-021f1-enrollment-chrome.md) for exact fixture and verification limits.

### DR-048: partner search failure feedback and request lifecycle

DR-021e preserves the existing dialog-owned GraphQL query and two-character trimmed threshold.
Its regression confirms that a failed query logs `Partner search error:` and clears suggestions;
the template has no distinct page-visible error/retry feedback. Empty results must not masquerade as an outage.
Source: [partner dialog](../../libs/frontend/pages/tournament/src/pages/general-enrollment/components/partner-selection-dialog/partner-selection-dialog.component.ts).
Scope a separate functional follow-up with localized pending/error/retry feedback and existing observable conventions.
Investigate stale-response ordering and subscriptions after dialog destruction; these risks are not independently
reproduced by the design slice. Do not claim a request-lifecycle repair from the mocked layout checks.
Real search availability, permissions and outage recovery remain unverified; do not mutate enrollment data to test them.

### DR-032/033/037 additional evidence: enrollment partner dialog

DR-021e confirms native unfocused field borders at 1.48:1 light / 1.40:1 dark and secondary Cancel borders
at 1.23:1 / 1.40:1 against the dialog. Shared DR-032 remains open.
Native primary Continue text fails light at 3.65:1 and passes dark at 10.63:1; retain DR-033 without page overrides.
Semantic labels/helpers and settled secondary Cancel text pass in both themes.
The dropdown has an explicit localized name and visible empty results reuse `all.search.noResults`.
Native AutoComplete still announces English `Option List` and `1 items selected` in Dutch;
include its shared PrimeNG locale configuration in DR-037 rather than adding a second page translation system.
See the [dialog brief](work-items/DR-021e-partner-dialog.md) for verified scope and unperformed checks.

### DR-047: enrollment desktop sticky sidebar/header overlap

DR-021d confirms the existing general enrollment sidebar uses `xl:sticky xl:top-6`.
After scrolling at 1440px, its Card pins at 21px under the app banner ending at 57px;
the heading spans 39.5-64px and is partly obscured. Baseline cart screenshots show the same issue.
Source: [general enrollment template](../../libs/frontend/pages/tournament/src/pages/general-enrollment/page-general-enrollment.component.html).
Scope a separate page-chrome repair after DR-021d review; preserve the sidebar's responsive behavior and shared header.
Verify initial/scrolled positions, keyboard-focused controls and narrow/wide light/dark layouts.
DR-021d changes only cart internals; it does not claim this inherited visibility failure is fixed.

### DR-032/033 additional evidence: general enrollment cart

DR-021d's native secondary Clear border fails at 1.23:1 light / 1.40:1 dark against the Card;
dark focus also fails at 1.40:1. Secondary label normal/hover text passes in both themes.
The existing success-severity Submit Button fails normal/hover light text at 2.28/3.30:1 and light focus at 2.28:1.
Dark Submit text/focus passes. Native danger remove icon normal/hover/focus passes the non-text threshold.
Keep DR-032/033 open, with no scoped or shared palette overrides.
See the [cart brief](work-items/DR-021d-enrollment-cart.md) for semantic copy checks and exact state evidence.

### DR-042: tournament detail draw external-link repair

The [DR-019g investigation](work-items/DR-019g-draw-external-link-contract.md) reproduces the missing draw
`visualCode` selection against the actual anonymous local API and mounted tournament detail route.
DR-019g is approved complete. The [repair brief](work-items/DR-042-draw-external-link-repair.md) records the field only under detail's
`tournamentSubEvents.drawTournaments`, and assert that exact nested selection in the executed query.
Retain native link styling, accessible names, `target`/`rel`, missing-code gates and all internal draw routes.
Check both missing tournament code and missing draw code, including localized unnamed-draw labels.
Run focused Nx lint/tests/build, then verify mounted links in light/dark and narrow/wide layouts,
all type tabs, keyboard/focus and SSR. External-site availability is not an application acceptance dependency.
No backend, translations, shared abstraction, global styling or draw-destination redesign is needed.
This is a separate functional discovery, not a required child reopening completed DR-019.

### DR-017r: user-confirmed change-team guidance and search Card parity

On 2026-10-31 the user supplied mounted element/route evidence for the permission-only change-team
guidance and requested native visual refresh, plus desktop Card presentation for mobile captain/add-player.
This supersedes the earlier consumer deferral for that block and the parent's closure proposal.
The [DR-017r brief](work-items/DR-017r-assembly-search-card-parity.md) scopes those adjacent presentation
corrections only. The Edit button's missing action remains functional follow-up, not a styling permission.

### DR-017s: deferred authenticated assembly Save popup

The 2026-10-31 DR-017 parent audit confirms that the supplied assembly route is anonymous at both
390px and 1440px: `loggedIn()` and `hasEditPermission()` are false, and the Save menu is not mounted.
The [page template](../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.component.html)
conditionally mounts a Save popup for authenticated users;
its [menu model](../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.component.ts)
still has a literal English `Save` label. The
[assembly template](../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html)
conditionally displays change-team guidance and a handlerless Edit button for club edit permissions.
The user's later element evidence confirms change-team for DR-017r, but does not confirm the Save popup.
The Save popup remains a real conditional call site, not a globally unused component.

Before promoting DR-017s, obtain a real authenticated mounted Save popup without operational mutations,
then scope one small child from the work-item template.
Preserve save dispatch, validation dialog, permissions, translations and completed DR-017a-q.
Do not silently implement missing Edit functionality as a styling task.

### DR-039: assembly filter/service selection synchronization

Source inspection during DR-017q finds that `onClubSelect`, `onClubClear` and `onSeasonChange` reset
`selectedTeamId`/`selectedEncounterId` but leave the service form's team/encounter and loaded lineup intact.
Investigate stale lineup/query/retry state after changing or clearing filters in a separate functional slice.
Preserve URL restoration, valid selection and real read consumers; do not use admin/save mutations for testing.
DR-017q only reflects existing loading/loaded/error gates; it does not claim this mismatch is corrected.

### DR-032/033/034/044: editing chrome contrast evidence

DR-020c's final mounted editing route measures settled native Cancel text at 4.46:1 light / 6.91:1 dark,
and its outline against the canvas at 7.74:1 / 1.46:1 (DR-032). Save-current text is 3.35:1 / 10.63:1
(DR-033). Native warning Message text is 2.83:1 / 7.98:1; native error text is 4.41:1 / 4.63:1
(DR-034). Light normal-text and dark secondary-outline failures remain open.
Native selected tab text is 3.65:1 / 10.22:1; unselected text is 4.87:1 / 6.65:1.
New DR-044 must audit selected Tabs text across confirmed consumers before any shared token change.
Use the 4.5:1 normal-text threshold, not the 3:1 large-text/non-text threshold, for these small tab labels.
Heading/context/subtitle use semantic text and pass at 18.20:1 / 16.64:1.
No shared or scoped palette override is introduced. See the [brief](work-items/DR-020c-editing-chrome.md).

DR-023a confirms the same native administration-shell limits on 2026-11-08:
Back text 4.46:1 / 6.91:1 (DR-032), selected Tabs text 3.65:1 / 10.22:1 (DR-044),
permission warning 2.83:1 / 7.98:1 and read error 4.41:1 / 4.63:1 (DR-034).
Heading/context pass at 18.20:1 / 16.64:1. Disabled tab text is not claimed to meet normal-text contrast.
Keep shared audits open; no new palette workaround or shared preset change is hidden in this shell slice.

### DR-032/034 additional evidence: editing settings

DR-020e measures enabled unchecked native Checkbox borders against the Card at 1.48:1 light / 1.40:1 dark,
failing the 3:1 non-text threshold. Settled sampled native focus outlines pass at 3.65:1 / 10.22:1.
Native mutation-error Message text fails normal text at 4.44:1 / 4.40:1.
Semantic description/heading/label/help/saving text passes at 19.87:1 / 16.00:1.
See the [settings-tab brief](work-items/DR-020e-editing-settings.md); retain contrast acceptance unchecked.
Shared DR-032/034 remain open; no page override, token change or styling exception is introduced.

### DR-032 additional evidence: general enrollment Back

DR-021a's native outlined secondary Back label measures 4.15:1 light after navigation and 4.41:1 in an
earlier unfocused sample, failing the 4.5:1 normal-text threshold. Dark samples at 6.33:1 / 6.89:1 pass.
Page subtitle/count/loading use semantic normal text after initial muted text failed at 4.46:1.
Final page text passes at 18.20:1 / 16.64:1; native no-results info Message passes at 4.75:1 / 4.57:1.
Keep the shared control audit open; no preset or page-specific palette overrides were introduced.
See the [enrollment chrome brief](work-items/DR-021a-enrollment-chrome.md).

### DR-034 additional evidence: administration draw no-selection Message

[DR-024a3c](work-items/DR-024a3c-draw-lists.md) measures the native informational no-selection Message over
the actual administration Card: 4.77:1 light passes, 4.32:1 dark fails the 4.5:1 normal-text threshold.
Four safe no-sub-event read fixtures at 390/1440px fit with all operational controls disabled.
Preserve native styling and leave this criterion unchecked; any correction belongs to the shared Message audit.
No page workaround, shared token change or styling exception is introduced.

### DR-034 additional evidence: creation read-error Message

DR-020d adds mounted editing-information evidence: native mutation-error Message text measures 4.44:1 light
and 4.40:1 dark over the actual Card, failing normal text. Native simple name validation passes at 4.83:1 / 5.08:1.
See the [information-tab brief](work-items/DR-020d-editing-information.md); retain the contrast criterion unchecked.
No shared token or page-specific override is added.

DR-020b adds creation mutation-error feedback evidence: native error Message text measures 4.44:1 light
and 4.40:1 dark, failing the 4.5:1 normal-text threshold over composited ancestor backgrounds.
Native simple validation text passes at 4.83:1 / 5.08:1. No page-specific or shared theme override is added.
See the [creation-fields brief](work-items/DR-020b-creation-fields.md); retain failed criteria unchecked.

DR-020a's native error Message measures 4.41:1 in light mode (fails AA normal text) and 4.64:1 in dark
(passes), with alpha background colors composited over ancestors. Info passes at 4.75:1 / 4.59:1.
Eight settled light/dark 360/390/768/1440px cases use browser-local read fixtures, not real outages.
No page-specific override or shared theme change is introduced; keep the failed light check open.
See the [creation brief](work-items/DR-020a-creation-chrome.md).

### DR-034 additional evidence: assembly load-error Message

DR-017q measures native error Message text over its actual composited background at 4.41:1 light,
below the 4.5:1 normal-text threshold, and 4.63:1 dark, passing. Native secondary initial guidance is
7.74:1 light / 9.51:1 dark. All measurements use settled browser canvas sRGB luminance at four widths.
Keep the existing cross-consumer Message audit open; do not introduce scoped colors or theme changes here.

DR-019f confirms the same native error Message failure on tournament detail: 4.41:1 light / 4.63:1 dark,
at 360/390/768/1440px. The error branch is now reachable after its guarded resource read.
Keep this consumer in the shared audit; no tournament-specific token/color workaround was introduced.

### DR-038: native ProgressBar contrast

DR-017p measures the unchanged native indeterminate ProgressBar on the real assembly route:
light value/track is 2.97:1, below the 3:1 graphic threshold; value/canvas is 3.35:1.
Dark value/track is 8.81:1 and value/canvas is 10.63:1.
The added semantic status text independently explains loading and passes at 18.20:1 light / 16.64:1 dark.
Audit the native preset/component across confirmed consumers separately; do not add page-scoped tokens or colors.
These are browser sRGB canvas measurements after theme/layout settling, not a complete accessibility certification.

DR-019f adds the tournament detail native indeterminate ProgressBar as a confirmed consumer:
light value/track 2.97:1, dark 8.81:1 at 360/390/768/1440px.
Its existing localized accessible name identifies loading; that is not proof of graphic-contrast compliance.

### DR-040: competition detail resource error rendering

Source inspection during DR-019f finds competition detail's public selector still reads `competitionResource.value()`
without checking `hasValue()`, the same pattern reproduced as an exception in tournament detail.
Investigate the actual competition error state separately, including SEO/template readers and recovery.
This is source evidence, not a reproduced competition-route failure or permission to expand DR-019f.

### DR-037: native Select feedback localization

On 2026-10-31, the confirmed mounted mobile doubles Select on the Dutch `/competition/assembly` route
shows English `No results found` when its browser-local player options are empty, in both themes.
The native empty feedback remains usable; DR-017m reuses existing defaults and does not change shared configuration.
Audit existing PrimeNG locale configuration and real consumers before scoping a separate locale fix.
Do not add page-specific overrides or translation assets as a hidden side effect of a surface refresh.

### DR-043: native DatePicker accessibility-label localization

DR-020d confirms the same English native button/dialog/full-date names on the mounted Dutch editing-information tab.
All five visible date labels now correctly associate with native inputs; the shared native locale audit stays open.

DR-020b confirms translated field labels on the mounted Dutch club tournament-creation route,
but native dialog/icon buttons still say `Choose Date` and date cells have English full-date names.
Investigate the shared PrimeNG locale configuration and affected real DatePicker consumers before a bounded fix.
Coordinate with DR-037's Select locale audit; do not duplicate or silently change global locale behavior.
No page-specific override, translation asset or dependency is added during the creation-field refresh.

### DR-036: mobile assembly rule parity

- Discovered during DR-017l source inspection; this functional follow-up is not a styling exception.
- In [AssemblyService](../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.service.ts),
  `getAvailablePlayersForSlot(slotId, 0)` preserves the selected player but calls capacity-limited `canDrop`
  for alternatives. A filled singles slot therefore offers only its current player until cleared.
- `setSlotPlayer` directly assigns/synchronizes/validates; it does not apply the cross-slot duplicate check
  used by `movePlayer`. This behavior predates the refresh and remains unchanged.
- Confirm expected mobile replacement and duplicate/capacity behavior, then scope a functional fix with
  service/component regression tests and safe mounted interaction checks. Do not modify validation rules
  or desktop drag/drop as an incidental design-refresh change.

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
- DR-006i started with the shared played summary. At the user's request it also removes all inline component CSS,
  migrating expanded games to native Cards with wrapping player names, semantic winner emphasis, translated
  perspective results, and paired plain-text set scores. Native Button replaces mouse-only expansion.
  Populated expanded-game pixels remain unverified because the available live games omit membership/set data.
- DR-006b discovery: resizing the mounted player list to mobile refreshes its page size; returning to desktop
  retained five articles for at least ten seconds. Reloading at desktop restores ten. Investigate breakpoint/page-size
  behavior separately before claiming responsive pagination coverage; score-only tests do not validate that workflow.
  Services, breakpoint logic, and pagination were unchanged in DR-006b.
- DR-007: [country/state controls][country-state] and [sync controls][sync-controls]. Preserve validation,
  disabled/loading states, and operation feedback. The [club-search area][club-search] currently contains service logic,
  not a visual component to redesign.
- DR-015e discovery for shared-control/theme follow-up: native secondary text Button active text measured
  4.46:1 in light mode, and its default dark focus ring measured 1.40:1 against the content surface.
  At the user's request DR-015e uses no `[dt]`. Its hero-only keyboard ring addresses focus without an outline;
  the light active-text contrast limit remains.
  Scope and check any shared correction separately; sync controls and draw links remain unchanged.
- DR-016d discovery for shared-control/theme follow-up: the unchanged played encounter expansion Button is
  keyboard-reachable with a named focus-visible state, but its settled native 1px outline is 1.40:1
  against its own dark encounter Card (8.46:1 light). Scope any correction with the shared encounter consumers
  and theme checks; no shared-control CSS or token was changed by the page-chrome slice.
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
  DR-016a covers standings; DR-016b covers only hero identity/actions; DR-016c covers hero statistics.
  DR-016d covers only played/upcoming panel surfaces and localized headings/counts.
  DR-016e covers loading, error, and overall-empty states. DR-016f covers poule standings outer section chrome.
  DR-016g covers league standings terminology. The 2026-10-30 parent audit found 26 POULE links and no qualification
  instance in the supplied competition; qualification is deferred, not declared globally unused.
  Its routed conditional consumer remains unchanged. See the [parent reconciliation](work-items/DR-016-competition-draws.md)
  for remaining acceptance and review; no new consumer may be added solely for redesign verification.
- DR-017: `/competition/assembly`. Cover player assembly and partner combinations.
  DR-017p covers only the naturally mounted loading indicator and its localized accessible feedback.
  DR-017q completes native localized load-error/initial guidance and a read-only retry with explicit approval.
  Its failure/success focus recovery uses a named programmatic result target without restyling loaded content.
  The parent remains open: DR-017r now covers user-confirmed change-team guidance and mobile search Card parity.
  DR-017s defers the unconfirmed authenticated Save popup. The earlier parent audit is superseded by this
  user evidence. DR-017r is now approved with disclosed limits; separate parent closure review remains.
  Pre-existing filter/service synchronization is separately tracked as DR-039.
  The permission-only change-team block is unconfirmed on the supplied anonymous route and has no action handler.
  Do not add a consumer or invoke administrative mutations to justify refreshing it.
  DR-017a completes the mounted heading/filter chrome and the approved desktop time-range template correction.
  DR-017b covers only the existing player row reused in regular/backup pools and doubles/singles/substitutes.
  DR-017c covers only the desktop pool surface, availability controls, and disclosure, without token overrides.
  DR-017d completes only the four desktop doubles containers and accessible native statistic Tags,
  with explicit user approval and recorded verification limits.
  DR-017e covers only the four desktop singles containers, reusing the completed rows and native statistic pattern.
  DR-017f covers only the desktop substitutes container, reusing completed rows and preserving CDK sorting.
  DR-017g covers only the desktop generation-controls Card, fluid controls and hover/focus Tooltips.
  DR-017h covers only the validation overview Card and existing template reused in the confirmation dialog.
  DR-017i covers only the desktop partner-combinations disclosure, responsive named controls and native
  table/statistic presentation; completion is explicitly approved with native Fieldset restoration tracked in DR-035.
  DR-017j covers only responsive captain/add-player searches with reused templates, native associated labels
  and full-name options/values. Completion is explicitly approved with disclosed verification limits;
  native focused light-label contrast remains DR-031.
  DR-031 retains focused FloatLabel contrast; DR-033 records native outlined Button accessibility:
  generation-control light text 2.28-3.76:1, strategy focus below 3:1 and missing native Button
  `aria-describedby` while Tooltips display. DR-017k also confirms no native Tooltip ID/association on its
  exemption Tags; their complete translated `aria-label` still names the exemption independently.
  Audit affected consumers separately; no page-level token workaround.
  DR-032 tracks unchecked Checkbox/secondary Button focus contrast, including the pool's disclosed native failures.
  The parent records pre-existing populated-lineup NG01354 form-registration warnings and unimplemented PDF
  generation as functional follow-up, not completed visual scope.
- DR-018: `/competition/:competitionId/edit`. Cover information, dates, and settings; split by form section.
- Preserve calculations, draw/encounter navigation, synchronization controls, and permission-dependent actions.
- DR-015e confirms an existing missing-visual-code sync-status exception in the detail component.
  Its external-link visibility tests isolate that unrelated validation; a missing-code live route is not claimed
  to work. Review missing-code sync behavior separately before changing its contract.

### Tournament browsing and editing

Project: `frontend-pages-tournament`. Source: [tournament feature][tournaments]; [routes][tournament-routes].

- DR-019: `/tournament/:tournamentId`. The obsolete `/tournament/club/:clubId` page is retired by user request
  under DR-019e; its tab redesign (DR-019h) and query repairs (DR-041) are withdrawn, not implementation candidates.
  The separate `/clubs/:clubId` tournaments tab remains intact.
- DR-020: `/tournament/create` and `/tournament/:tournamentId/edit`. Cover information and settings forms; do not change
  creation or save semantics.

### Tournament enrollment

Parent: DR-021. Project: `frontend-pages-tournament`. Child scopes:

See the [parent brief](work-items/DR-021-tournament-enrollment.md).
DR-021a-e have user approval with disclosed limits. General enrollment is the only enrollment page.
DR-021f retires the obsolete sub-event and incomplete my-enrollments pages at the user's request.
DR-021f1-f4 and DR-021g are withdrawn, not design migrations; DR-021i retains the future overview.

- `/tournament/:tournamentId/enroll`: filters, sub-event selection, cart, and partner-selection dialog.
- Former sub-event/my-enrollments routes are removed; do not restore consumers solely for redesign verification.
- Preserve general eligibility, validation, selections/cart state, partner handling and submission behavior.
- New my-enrollments overview (DR-021i) needs separate scope; no replacement or cancellation UI is added here.
- Existing [enrollment documentation][enrollment-docs] is context, not a reason to change the workflow during styling.

### DR-021i: future my-enrollments overview

On 2026-11-07 the user said a new overview will be made later, replacing the incomplete retired page.
Keep this Backlog until its real consumer, route, data, permissions, interactions and acceptance checks are scoped.
Do not restore the old implementation or assume its route/cancellation workflow is the requirement.
This invocation only retires obsolete UI under DR-021f; no overview is implemented.

### Tournament draws

Parent: DR-022. Project: `frontend-pages-tournament`.

- `/tournament/:tournamentId/sub-events/:subEventId/draws/:drawId`.
- Cover the draw page, games, knockout tree, and standings table, splitting each view if needed.
- Preserve the full-width layout, score/result meaning, navigation, and any pan/zoom interaction.
- DR-022 discovery from DR-004: the existing bracket-tree body overflows at 390px and 1280px while the shared hero
  and its actions fit. At 1280px the bracket host was 1302px wide and extended to x=1284.
  DR-006j subsequently corrected the mounted bracket's bounded scroll sizing; preserve that completed work.
- DR-022a scopes identity/actions only. DR-022b retains page switching and loading/error/empty feedback;
  DR-022c retains games; DR-022d confirms the mounted `MD 1-2 - Poule A` round-robin standings consumer.
- DR-022b implements native page feedback and switching; approved completion retains native light selected Button text
  at 3.65:1 (DR-033) and outlined secondary Button text at 4.46:1 (DR-032). Dark text is 10.63/6.91:1.
  Four keyboard cases expose native 1px focus; exhaustive focus-ring contrast remains unverified.
  Empty Message text is 7.74:1 light / 9.51:1 dark; semantic error text is 18.29:1 / 14.63:1.
  No page-level palette overrides are added. Keep the shared audits open.
- On 2026-11-08 parent reconciliation confirms completed DR-022a/b/c/d cover identity, feedback, games and standings.
  The mounted KO child still delegates to shared BracketTree; DR-006j already completed its responsive scope.
  Parent is Done with the children's previously approved limits retained; no completed implementation is restarted.

### Tournament administration

Projects: `frontend-pages-tournament`, with shared controls where already used. All three areas live under
`/tournament/:tournamentId/admin`.

- DR-023: enrollment management and check-in tabs, split into independently reviewable children.
- DR-023a: shared administration chrome/feedback prerequisite for DR-023b/c and DR-024/DR-025 tab work.
  The original supplied tournament disabled operational tabs; later authorized evidence confirms enrollment and check-in
  consumers on the imported finished tournament. DR-023b is approved Done with disclosed limits.
  The initial missing-check-in-query blocker is resolved by the approved DR-023c1 resolver repair and API restart.
  All four DR-023c children are approved Done and committed; source, fresh empty-tab checks and final 288-test suite
  are reconciled in the parent brief. DR-023c is approved Done with disclosed limits.
  [DR-023 aggregate reconciliation](work-items/DR-023-admin-acceptance.md) is approved Done with disclosed limits:
  fresh 24-case empty-tab layouts/overlays, safe keyboard/refresh/Dialog checks and cached scoped Nx checks pass.
  User approval retains native contrast, exhaustive accessibility/live-operation/API/hydration limits unchecked.
  Do not restart completed children. Next invocation scopes one DR-024 draw-management child on its real consumer.
  Never treat swallowed query failures as a successful empty dataset or mutate phase/records for testing.
- DR-024: draw management and scheduling tabs, one child task per tab.
  Split into DR-024a draw-management aggregate and DR-024b scheduling; no whole-tab rewrite.
  All required DR-024a children and draw-management aggregate reconciliation are approved Done
  with retained verification limits. Do not restart the approved selector/read, presentation or dialog/locale children.
  Initial DR-024b prerequisite check confirms `ENROLLMENT_CLOSED`, a disabled tab and three missing schema fields.
  The user subsequently approves the bounded DR-024b1 read/error repair; its 20 tests and scoped builds/lints pass.
  Corrected source reads return HTTP 200 against the running API; dormant mutations remain unexposed.
  The supplied event is subsequently observed in `DRAWS_MADE` and Scheduling mounts without assistant data writes.
  After the user's frontend restart, the mounted browser emits the corrected query and receives HTTP 200.
  Client-only pending/error fixture DOM is confirmed, but hidden-browser Message entry animation prevents
  completion of the theme/width/keyboard/retry matrix. Routes and synthetic data are removed; real empty reads restored.
  DR-024b1 is explicitly approved Done with those limits; its parents remain open.
  DR-024b2 summary/count labels are approved Done with disclosed limits: 15 focused tests and scoped lint/build pass.
  Four Dutch theme/width browser cases and summary contrast pass; unperformed checks remain unchecked.
  [DR-024b3 filters/actions](work-items/DR-024b3-schedule-controls.md) is approved Done with disclosed limits:
  native Toolbar/names/date templates, 20 passing focused tests and scoped lint/build.
  Four Dutch theme/width cases and enabled control contrast pass; date fixture and keyboard limits are in its brief.
  User approval leaves unperformed checks unchecked and parents open.
  Next action in a fresh invocation is scoping DR-024b5 Generate/Auto-schedule dialogs; DR-024b4 grid is Done with disclosed limits.
  Grid/game panel/dialog presentation remains unstarted; preserve all parent and prerequisite limits.
  Do not enable gated tabs, mutate phase/permissions or repair this independent tab during draw-management work.
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
- DR-012e discovery: `apps/app/src/styles.scss` sets an unlayered `p-multiselect { width: 100% }` (with other inputs)
  that overrides Tailwind width utilities on the host; the roster tab uses a sizing wrapper. Retire after a consumer check.

## Progress, evidence, and discoveries

- DR-033 (additional mounted consumer during DR-017o): the native dialog Agree Button has light normal/keyboard
  text contrast 3.65:1, below 4.5:1; its settled hover passes at 4.64:1. The native outlined Cancel Button's
  dark keyboard focus ring is 1.40:1 against the dialog surface, below 3:1. Other measured title/action text
  and focus combinations pass; quantitative header-close contrast remains unchecked.
  Preserve native styling and audit shared preset/confirmed consumers separately, not with page-local overrides.
- DR-035 (discovered during DR-017i): native Fieldset collapse/re-expansion removes the existing Select span
  and sortable-header `tabindex="0"`, preventing their subsequent keyboard access. Reproduced in isolated Chrome;
  installed PrimeNG `Fieldset.updateTabIndex()` removes rather than restores descendant tabindex on expansion.
  Audit confirmed Fieldset consumers and a native/upstream fix separately; do not add page-local focus hacks,
  silently remove disclosure behavior or broaden a page slice into a dependency upgrade.
  DR-017i preserves the existing native Fieldset and leaves full keyboard/focus acceptance unchecked.
- DR-034 (discovered during DR-017h): native styled Messages on the mounted assembly Card fail 4.5:1 text
  contrast in light success (3.16:1), error (4.44:1), warn (2.85:1), and dark error (4.40:1).
  Dark success/warn pass (6.48:1/7.49:1). Measurements composite native translucent fills over the actual Card.
  Audit the shared preset and confirmed Message consumers separately; do not add page-local styling overrides.
  DR-017h preserves the native presentation and leaves contrast checks unchecked with explicit completion approval.
- DR-030 (discovered during DR-016e): at a 320px viewport, the unchanged shared topbar tools and login Button
  extend to x=338px while the document client width is 305px. At 390px they fit. Investigate the mounted shared
  shell and all affected consumers in a separate slice; no header, theme, or global changes were made in DR-016e.
- DR-015c (2026-10-23): native anchor Buttons are appropriate for draw navigation; retain anchor semantics,
  semantic label colors, wrapping text, and a shrinking Card/grid item. No shared abstraction is needed.
- DR-003 follow-up observation during DR-015c keyboard navigation: immediate return navigation emitted
  `AbortError: Transition was skipped. New ViewTransition started`. The intended route and return both succeeded;
  the detail page had no errors after reload. Recheck rapid route transitions in a separate shell/router slice;
  no router/theme changes were made here.

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
