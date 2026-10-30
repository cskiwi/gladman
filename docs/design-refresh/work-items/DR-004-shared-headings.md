---
title: 'DR-004: Shared headings and hero'
description: 'A responsive, theme-aware identity and heading system reviewed with the homepage and shell.'
---

## Identity and outcome

- ID: DR-004; owner unassigned; status tracked in the [backlog](../backlog.md).
- Dependency: [DR-001](DR-001-design-baseline.md).
- Review context: [DR-002](DR-002-home-pilot.md) and [DR-003](DR-003-app-shell.md), both still in review.
- Projects: `frontend-components`, `frontend-pages-home`, and application integration through `app`.
- Rules: [design refresh plan](../README.md).

On 2026-10-16 the user approved the combined heading, hero, and shell layout as the new direction. They explicitly
requested the same treatment for the homepage table and a neutral background that preserves content separation.
The user approved the final corrected canvas/table treatment on 2026-10-16 after the scoped table-token correction.
DR-004's shared-header checks are complete. Do not reopen the agreed layout or mistake styling approval for
completion of DR-002/DR-003's separate functional checks.

## Scope and approach

- Refresh [hero][hero], its shared title/avatar, [page header][page-header], and [section header][section-header].
- Integrate the homepage with these shared patterns to make the combined direction visible on `/`.
- Replace the decorative gradient/scanline hero and parallelogram avatar with native styled PrimeNG containers/avatar.
- Use readable title sizes, wrapping identity, and actions below identity on narrow screens.
- Preserve all projection slots, avatar variants, conditional controls, routes, localization, and ranking values.
- Inspect [breadcrumb][breadcrumb]; retain its existing native PrimeNG behavior unless a concrete defect needs fixing.
- Apply the same native card surface to the homepage reference section while retaining `p-table` and native spacing.
- After user review, align only homepage table rows to `{content.background}` through PrimeNG's scoped `dt` input.
  Preserve the global table preset and logged-in ranking header; the latter is deferred to player/profile work.
- At the user's explicit request, replace only the global page background with a semantic canvas token in the preset.
  Light uses the existing pale surface; dark uses the existing deepest surface. Preserve the inverted scale and all
  other component theme mappings.
- Exclude feature-page bodies, ranking/statistic semantics (DR-005), shell behavior, backend processes, and routes.

## Consumers and baseline

Hero consumers: player detail and ranking breakdown; club detail and team detail; competition detail and draw detail;
tournament detail, draw detail, and club detail. Several consumers own custom crests/headings; those page-specific
decorations remain for their feature slices.

Page-header consumers: player editing/head-to-head, competition sub-events, and admin. The homepage now consumes
section-header; there were no production consumers before this slice. Breadcrumb remains native across player, club,
competition, and tournament routes.

Baseline: the hero has a fixed three-column grid, two radial gradients and a scanline pseudo-element. Its avatar uses
gradient text, a clipped crest and a pseudo-element. Page-header has a highlighted tile and reserves avatar space even
when no avatar is projected. Section-header renders a span rather than a heading. The live homepage is anonymous and
loaded, but the existing API process still serves stale translations.

## Implementation checklist

- [x] Inspect consumer projection contracts and scope the shared concern.
- [x] Preserve slots, variants, translations, conditional content, and data.
- [x] Replace custom hero/avatar appearance with native PrimeNG.
- [x] Align page/section/title typography and responsive layout.
- [x] Compose the homepage with the shared patterns, including the native table in a bordered card.
- [x] Remove obsolete hero/avatar styles and record affected consumers.
- [x] Replace ambient page gradients with a preset-owned semantic canvas.

## Acceptance and verification

- [x] Shared projection tests cover avatar, identity/title, metadata, working actions, stats, and default content.
- [x] Homepage tests retain ascending rows, zero/null behavior, anonymous/authenticated conditions, and native table.
- [x] Light/dark and 390px/1280px homepage layouts retain titles without page-level overflow.
- [x] Native components and semantic utilities supply appearance; no new SCSS or authored palette colors.
- [x] Homepage headings/contrast, keyboard drawer opening/Escape/focus return, and breadcrumb unit tests pass.
- [x] Relevant Nx lint, focused tests, and application build pass; broader pre-existing test failures are recorded below.
- [x] Live SSR markup contains both cards, translated headings, and hydration state; browser has no hydration errors.
- [x] The user approves the shared heading/hero/shell layout direction.
- [x] Repeat the homepage four-case layout/contrast checks using the integrated browser after preview restoration.
- [x] Check shared header/action geometry for seven existing hero consumers in all four theme/viewport cases.
- [x] Verify mounted player editing, head-to-head, and admin page-header consumers in all four cases.
- [x] Correct homepage table row/card background consistency and verify the native scoped token in both themes.
- [x] The user confirms the final neutral canvas and corrected table treatment (2026-10-16).
- [x] Complete route-level shared-header regression of all nine hero consumers, including narrow-screen actions.

## Evidence and handoff

### Implementation and validation

- Hero uses a native bordered `p-card`; avatar uses `p-avatar`. Removed both obsolete gradient/crest SCSS files.
  Page-header no longer reserves an empty avatar tile. Section-header now renders a semantic `h2`.
- Home uses the shared hero/title/avatar and section heading. Its reference section is a second bordered `p-card`
  containing native `p-table`, default row spacing, tabular numerals, and horizontal scrolling.
- Utility comparison (class-bearing elements): hero 3 to 5; page-header 8 to 6; section-header 3 to 3; home 12 to 13.
  The added wrappers provide responsive action layout and a coherent table surface, not decorative tiles.
- `NX_DAEMON=false npm exec nx run frontend-components:test -- --runInBand
--testPathPatterns=hero.component.spec.ts --output-style=static`: 7 passing tests.
- `NX_DAEMON=false npm exec nx run frontend-pages-home:test -- --runInBand --output-style=static`: 5 passing tests.
- `NX_DAEMON=false npm exec nx run-many -- --targets=lint
--projects=app,frontend-pages-home,frontend-components --output-style=static`: passed; 32 existing shared-library
  warnings, none in the changed heading/home files.
- `NX_DAEMON=false npm exec nx build app -- --configuration=development --output-style=static`: passed, including
  application browser/server and dependent library compilation.
- Shared test setup now uses the installed zoneless environment, matching the homepage; no dependency added.
  A full two-library test run exposed existing failures: ranking-progress lacks a TranslateService test provider,
  and bracket-tree tests reference removed methods/old ordering expectations (7 failures in those two suites).
  Those unrelated tests were not modified. The new shared-heading suite and all homepage tests pass independently.

### Browser evidence

- After the user restarted the server, checked live Dutch output without translation interception at 1280x900 and
  390x900 in both themes. No page-level horizontal overflow. At 390px the table container is 325px wide and scrolls
  its 672px table; all four columns remain reachable.
- Canvas has no background image. It differs from card surfaces in both themes; semantic card borders remain distinct.
  Light title/metadata contrast: 19.87:1 / 4.87:1. Dark: 16:1 / 6.65:1.
- Keyboard: native drawer opens with Enter, closes with Escape, returns focus to the trigger, and shows focus feedback.
  Theme choice survives reload. A browser-only long-name fixture wraps without horizontal overflow.
- Read-only `/admin` check confirms the page-header consumer renders on the new canvas without overflow. No indexing,
  sync, or operational mutations were executed. Other feature-page visual checks remain open.
- SSR response includes both native cards, translated section heading, canvas token, and hydration metadata. A fresh
  isolated browser reports no console/page errors. The existing PrimeUI license warning/watermark remains unrelated.
- Four theme/viewport screenshots and the long-name fixture were stored in the implementation session, not committed.
  That session-only evidence is not a reproducible fresh-chat artifact. Use `http://localhost:3000/` for final review
  after restoring responsive page rendering; the continuation below could not capture replacement screenshots.

### Continuation verification: 2026-10-16

Selected only the outstanding DR-004 shared-consumer review. The worktree was clean before the handoff edits.
Inspected the actual hero template, projection tests, mounted feature routes, and owning route data services. The
approved native card and responsive projected-action wrapper are present; no application change was justified by
the evidence. No feature bodies, shared APIs, preset, permissions, dependencies, or operational state were changed.
Before/after utility usage is unchanged in this pass.

- **Passed (cached):**
  `NX_DAEMON=false npm exec nx run frontend-components:test -- --runInBand
  --testPathPatterns=hero.component.spec.ts --output-style=static`.
  Nx reports one local cache hit, one passing suite and seven passing tests, not a fresh test execution.
  Coverage includes all projection slots, conditional content, working actions, avatar variants, long title text,
  page/section headings, and native breadcrumb links. jsdom does not verify responsive geometry or contrast.
- **Passed:**
  `NX_DAEMON=false npm exec nx show project frontend-components -- --json` resolves existing test/lint/build targets.
- **Passed initially:** an anonymous Edge session rendered the homepage's `BBF Rating` heading and login controls.
  No theme/viewport acceptance matrix was completed in that initial session.
- **Failed prerequisite:** anonymous `POST http://localhost:3000/graphql` with the following read-only query returned
  `Forbidden resource`. No record identifiers, names, credentials, or response payloads were persisted.

```graphql
query DesignRefreshRouteCoverage {
  players(args: { take: 1 }) { id }
  clubs(args: { take: 1 }) { id }
  teams(args: { take: 1 }) { id club { id } }
  competitionEvents(args: { take: 10 }) {
    id
    competitionSubEvents { id competitionDraws { id } }
  }
  tournamentEvents(args: { take: 10 }) {
    id
    tournamentSubEvents { id drawTournaments { id } }
  }
}
```

- **Unavailable default browser:** `chromium.launch({ headless: true })` reports a missing Playwright headless shell;
  `chromium.launch({ channel: 'chromium', headless: true })` also reports a missing executable.
  `chromium.launch({ channel: 'msedge', headless: true })` succeeds using installed Edge. No download was attempted.
- **Blocked browser matrix:** Playwright was invoked from `node -e` using installed `@playwright/test`, Edge, isolated
  contexts, `serviceWorkers: 'block'`, a `gladman:theme` cookie, and planned viewports 390x900/1280x900 in both themes.
  `page.goto('http://localhost:3000/')` timed out after 30 seconds waiting for `load`. The focused retry
  `page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' })` also timed out after 30 seconds.
  Both stopped on the first light/390px navigation, before assertions or screenshots. No new visual pass is claimed.
- **Diagnostic probe:** the following `node -e` command returned `/api/health 200`, `/graphql 200`, and a timeout
  for `/`.
  Its JavaScript is expanded for readability; this Windows terminal required the invocation on one line and rejected
  stdin/multiline attempts before execution. A healthy API is not evidence that SSR page rendering or hydration works.
  The cause remains uninvestigated.

```bash
node -e '(async () => {
  for (const path of ["/api/health", "/graphql", "/"]) {
    try {
      const options = { signal: AbortSignal.timeout(5000) };
      if (path === "/graphql") {
        options.method = "POST";
        options.headers = { "content-type": "application/json" };
        options.body = JSON.stringify({ query: "query DesignRefreshConnection { __typename }" });
      }
      const response = await fetch("http://localhost:3000" + path, options);
      console.log(path, response.status);
    } catch (error) {
      console.log(path, error.name + ": " + error.message);
    }
  }
})()'
```

- **Not run in the initial attempt:** route-level theme/viewport, narrow actions, permission-dependent actions,
  contrast,
  fresh hydration/SSR checks, and final user canvas/table review. The historical checked acceptance entries above
  remain historical implementation evidence, not outcomes of this continuation.
- **Not rerun:** application lint/build and unrelated suites, because only Markdown handoff documents changed.
  No styling exception was introduced. No safe new browser screenshots exist from this pass.

### Integrated-browser results after preview restoration

The user restored the preview, shared a real player-detail route, requested the integrated browser, and enabled its
tools. Tool discovery now succeeds. Continued only the existing verification slice, with no application-source edits.

- Used `read_page`, `navigate_page`, `screenshot_page`, and `run_playwright_code` on the shared tab. Scripts called
  `page.setViewportSize({ width, height: 900 })` for widths 390/1280, toggled the named native theme button, and waited
  for finite browser animations to finish before reading geometry and computed styles. This avoided measuring
  intermediate theme-transition colors. Native OKLCH colors were converted to sRGB through a temporary 1px canvas
  before contrast calculation; initial numeric parsing of OKLCH was discarded, not treated as an application defect.
- **Passed homepage matrix:** two native cards, one `h1`, semantic `h2`, four table columns and 12 rows in both
  themes and at both widths; no page-level overflow or canvas background image. Light canvas/card sRGB values were
  `[243,245,248]` / `[255,255,255]`; dark values were `[4,10,17]` / `[9,16,24]`.
- **Passed contrast:** title/metadata 19.87:1 / 4.87:1 in light; 16:1 / 6.65:1 in dark. Measurements were identical
  at both widths after animations settled.
- **Passed narrow table access:** 310px viewport for the 672px table; `scrollLeft` reached its 362px maximum.
  Desktop table/container were both 1201px. Native row separators and scrolling were retained.
- **Passed keyboard:** at 390px, focusing `Navigatiemenu openen`, pressing Enter, then Escape opened/closed the
  native drawer and returned focus to the trigger. A subsequent explicit run returned `focusReturned: true`.
- **Passed dark persistence:** after toggling dark and using `navigate_page` with `type: 'reload'`, the homepage
  retained `data-theme="dark"`. Direct cookie inspection was unsupported by the integrated-browser protocol, so it
  was not used as persistence evidence.
- **Visual evidence:** integrated-browser viewport screenshots of narrow light and wide dark homepage were inspected.
  They contain no player data. Resource attachments are session-scoped; measured results are persisted here instead
  of treating those attachments as durable repository evidence. No feature-page screenshots were committed.
- **Passed shared geometry:** the seven consumers below each rendered an `app-hero h1` at both widths in both themes.
  No shared header overflow or projected action escaped its native card. This is 28 consumer geometry checks, not
  a complete feature-body, permission, workflow, or accessibility audit.
- **Existing consumer findings:** the player overflow-menu button has no accessible name; its existing source has
  neither label nor `ariaLabel`. The club-team `h1` uses its existing `text-4xl`/`truncate` classes and clips at 390px
  in both themes, despite fitting the shared card. Recorded under DR-008/DR-014; no hidden feature migration made.
- **Incomplete tournament discovery:** the tournament-club page rendered but contained no tournament-detail links.
  A read-only `DesignRefreshTournamentRoutes` query requested three events and nested sub-event/draw IDs. It did not
  complete during two deferred waits; subsequent navigation destroyed the execution context. No query result or
  route-data success is claimed. Do not repeat collection discovery; use explicit approved tournament URLs/fixtures.
- **Historical SSR blocker:** subsequent `navigate_page` to the previously working player-detail URL timed out after ten
  seconds and ultimately displayed HTTP 500 with Angular SSR's aborted-request `TimeoutError`. Tool access is no
  longer blocked; responsive SSR is. No cause has been established, and no backend changes were attempted.
- **Not verified in that attempt:** tournament detail/draw, remaining page-header consumers, permission-dependent
  actions,
  full keyboard/accessibility audits on feature pages, fresh hydration audit, and final user canvas/table approval.

### Resumed page-header verification

The next `continue` resumed only outstanding DR-004 checks. The shared player page rendered again. Read-only
integrated-browser navigation to head-to-head, player editing, admin, and the homepage then succeeded without the
earlier SSR timeout. No application, server, permission, dependency, or styling changes were made.

- Used `navigate_page` for existing routes and `run_playwright_code` for four-case geometry. Each case called
  `page.setViewportSize({ width, height: 900 })` for widths 390/1280, used the named theme button for light/dark,
  awaited `document.fonts.ready` and finite animations, then measured `app-page-header header` and its `h1`.
- **Passed 12 cases:** player editing, head-to-head, and admin retain visible titles within the shared header and
  viewport, with no header or page horizontal overflow. Admin and editing subtitles are visible in all four cases.
- **Passed editing actions:** all three projected controls remain inside the header in every case, including the
  native disabled save-all state. No action was activated and no form value or operational data was changed.
- **Passed head-to-head subtitle:** the first probe queried `[subTitle]`, which is an `ng-container` and therefore
  has no DOM element. Source confirmed this projection contract. A corrected four-case probe of the rendered
  `h1.nextElementSibling` verifies visible, unclipped subtitle content. The first selector result is not a UI defect.
- **Passed breadcrumb focus:** focusing the first breadcrumb link then pressing Tab reaches the player link.
  Measured `breadcrumbKeyboardReachable: true` and `focusVisible: true` in all four cases. No link was activated.
- **Visual evidence:** inspected the wide dark admin header using `screenshot_page` with selector `app-page-header`.
  The screenshot contains only the shared admin heading/subtitle; no player form or contact data was captured.
  The attachment is session-scoped; the measurements above are the durable handoff.
- **Remaining prerequisite:** explicit approved tournament detail/draw URLs or safe fixtures are still absent.
  Did not repeat broad collection queries, the completed seven-hero matrix, or unrelated workflows.
- **Not rerun:** Nx tests/lint/build because no application sources changed. Existing results remain recorded above;
  this pass does not claim full feature permission, mutation, accessibility, or hydration coverage.
- The integrated browser is left at `/` in wide dark mode for final canvas/table confirmation.

### Remaining review matrix

The user supplied an approved tournament route, and its existing links supplied the draw route. SSR and route-data
prerequisites are resolved. All shared-header entries below are complete, and the user approved the corrected
homepage table treatment on 2026-10-16.
Use the integrated browser. Preserve safe data in screenshots; do not invoke sync/indexing or editing mutations.
Reuse the existing approved layout without reopening implementation.

| Consumer | Route pattern | This continuation |
| --- | --- | --- |
| Player detail | `/players/:playerId` | Shared bounds pass x4; menu label deferred to DR-008 |
| Player ranking | `/players/:playerId/ranking/:type` | Shared header/title/actions pass x4 |
| Club detail | `/clubs/:clubId` | Shared header/title/actions pass x4 |
| Club team | `/clubs/:clubId/teams/:teamId` | Shared bounds pass x4; narrow title deferred to DR-014 |
| Competition detail | `/competition/:competitionId` | Shared header/title/actions pass x4 |
| Competition draw | `/competition/:competitionId/sub-events/:subEventId/draws/:drawId` | Shared bounds pass x4 |
| Tournament detail | `/tournament/:tournamentId` | Shared header/title/actions pass x4; keyboard focus passes |
| Tournament draw | `/tournament/:tournamentId/sub-events/:subEventId/draws/:drawId` | Shared bounds pass x4 |
| Tournament club | `/tournament/club/:clubId` | Shared header/title pass x4; no actions projected |

Shared hero, mounted page-header, and homepage section-heading checks are complete; do not repeat them. Existing
feature-body and consumer-specific defects are deferred, not passed as full feature audits. Competition sub-events
remains unmounted; do not add a route. Do not check off user visual approval based on tests or measurements alone.

### User-requested table correction and final tournament checks

The user reported that the logged-out table background did not match the rest of the UI, supplied a tournament
example, and explicitly left the logged-in ranking header for later player/profile work.

- **Cause:** in dark mode the global DataTable row token uses `{surface.0}`, the page canvas, whereas cards and
  column headers use `{content.background}` / `{surface.50}`. This made the table body appear cut out of its card.
- **Correction:** only the homepage `p-table` now binds
  `[dt]="{ row: { background: '{content.background}' } }"`. PrimeNG's documented scoped-token API supplies appearance;
  no stylesheet, custom palette, global DataTable change, shared component change, or styling exception was added.
  Class-bearing element counts and layout utilities are unchanged. The existing table test asserts this binding.
- **Passed:** `NX_DAEMON=false npm exec nx run frontend-pages-home:test -- --runInBand --output-style=static`:
  five tests, one suite, fresh execution (no cache hit). Ordering, zero/null handling, native table, headings, and
  authenticated ranking projection still pass.
- **Passed:** `NX_DAEMON=false npm exec nx run frontend-pages-home:lint -- --output-style=static`.
- **Passed:** `NX_DAEMON=false npm exec nx build frontend-pages-home -- --configuration=development
  --output-style=static`: homepage Angular package and nine prerequisite tasks passed; eight of ten tasks cached.
  The homepage compilation was fresh. Full application build and unrelated suites were not rerun.
- **Passed live table matrix:** at 390x900 and 1280x900 in light/dark, computed row, column-header, and containing
  card backgrounds now match. Table text contrast is 19.87:1 light / 16:1 dark. All 12 rows and four columns remain;
  no homepage overflow. Narrow table/container widths remain 672px/310px; wide widths are 1201px/1201px.
  The body-level global row token remains unchanged, confirming the override is local. Inspected an anonymous
  wide-dark homepage screenshot after the correction; no player data is captured in this evidence.
- **Passed tournament detail:** used the user-provided event `121e59f3-53a4-4b77-ae01-325d5ceed933` and its existing
  draw links. At both widths/themes the hero title, identity, stats, and visible actions fit; narrow actions sit
  below identity. Visible actions are reachable with Tab and retain `:focus-visible`. No action was activated.
- An initial keyboard probe assumed a second action button and timed out after permission-dependent controls
  settled. The corrected probe follows visible `button,a` controls; the complete four-case rerun passed. This was
  a probe assumption, not an application defect or evidence of changed permissions.
- **Passed tournament draw header:** followed the event's first existing draw link. All four cases retain title
  and three visible action controls inside the card, with narrow actions below identity. This consumer intentionally
  has no stats slot. Breadcrumb Tab reachability and visible focus pass. No sync/admin control was activated.
- **Existing draw-body issue:** page overflow remains outside the hero in all four cases. A targeted geometry probe
  identifies `app-bracket-tree` and its body wrappers, not the shared header. At 1280px, the bracket host is 1302px
  wide and ends at x=1284 while the shared hero is 1223px wide and fits. Deferred to DR-022/DR-006 in the backlog;
  no clipping workaround or feature migration was introduced.
- **User review passed:** the user selected `Approved` for the corrected homepage table background and requested
  finishing this slice. No claim is made that full feature-body, permission/mutation, or accessibility audits have
  passed. The logged-in header is unchanged and explicitly deferred to player/profile work.
- **Existing editor advisory:** the unchanged loading wrapper's `role="status"` is flagged in favor of native
  `output`. It predates this correction, and Nx lint still passes. Recorded for DR-002's loading-state checks;
  the scoped-token binding and existing spec have no new diagnostics.

### Scope decision and next action

The existing global body rule now consumes `--p-app-canvas`; colors are defined only in the PrimeNG preset extension
using existing surface tokens. This is an explicitly requested theme-infrastructure change, not a page-level styling
workaround. No new stylesheet, palette, dependency, or styling exception was introduced. Legacy feature-specific
gradient tokens remain until their consumers migrate.

DR-004 is complete, including final user visual approval; the authoritative backlog row is `Done`. No technical
blocker or styling exception remains. Do not repeat completed matrices or collection discovery.
Next candidate: DR-002's loading/failure/no-system and selected-system-switching checks with safe fixtures; first
reconcile its earlier open visual checklist against this evidence. Do not start that slice here. DR-003 functional
checks and DR-008/DR-014/DR-022 discoveries remain separate open work. Do not start DR-005 or redesign the approved
layout. Keep the logged-in ranking header deferred to player/profile work as requested.

[hero]: ../../../libs/frontend/components/hero
[page-header]: ../../../libs/frontend/components/page-header
[section-header]: ../../../libs/frontend/components/section-header
[breadcrumb]: ../../../libs/frontend/components/breadcrumb
