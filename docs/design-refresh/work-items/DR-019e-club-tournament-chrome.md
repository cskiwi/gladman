---
title: 'DR-019e: Retire obsolete tournament club page'
description: 'User-directed page retirement, historical baseline failures, and scoped verification.'
---

## Identity and scope

- ID: DR-019e. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-019](DR-019-tournament-browsing.md). Rules: [design refresh](../README.md).
- Original prerequisite DR-041 is withdrawn: its failing queries belong only to the removed page.
- Project: `frontend-pages-tournament`.
- Confirmed mounted consumer on 2026-11-02:
  `/tournament/club/cb0cfc70-d93c-4e81-92e6-07b5724d40b0`.
  The page title and hero identify the requested club; this is a real routed page, not an export or preview.
- The user then stated: "Ah touranament/club shouldn't exist we can remove this page and routes and links".
- Revised scope: remove the obsolete route from
  [feature routes](../../../libs/frontend/pages/tournament/src/lib.routes.ts), remove its feature export,
  and delete the page component/template/SCSS/service/local barrel.
- Search application sources for inbound links, alternate imports and consumers.
- Preserve all other tournament routes and the separate `/clubs/:clubId` tournaments tab.
- Do not repair retired queries, add redirects, change backend/translations, or restyle shared/global components.
- DR-019h's proposed tab redesign is withdrawn with the page; no implementation is claimed for that item.

## Historical baseline and scope decision

- Worktree was clean before investigation. Initial investigation changed documentation only.
- Playwright MCP navigation failed because its existing browser profile is in use.
  The integrated browser successfully mounted the real route instead; no existing browser was stopped.
- A normal load and a second observed reload reproduce three HTTP 400 GraphQL validation failures:
  - `ClubTeamsDetail`: invalid `TeamPlayerMembership.startDate` / `endDate`,
    `Player.competitivePlayerIndex` and `Player.subEvents`.
  - `ClubTournamentHistory`: invalid `Entry.subEventTournament`.
  - `ClubStatistics`: invalid `Team.games`.
- The retired service contained these query fields and unguarded resource-value selectors.
  The browser reports `ResourceValueError` during rendering after a failed query.
  Empty tab feedback and generic error feedback coexist; they are not evidence of valid empty datasets.
- The real page displays untranslated keys, including `all.club.tabs.overview`,
  `all.club.info.title`, `all.club.players.noPlayers` and `all.club.teams.noTeams`.
  These belonged to the obsolete page; repairing them is no longer required.
- Historical chrome used `t-eyebrow`, `t-mono`, `HeroStatValueComponent`, an inline Select minimum width
  and an attached SCSS file. Page markup and styles are now deleted, not redesigned.
- Only the initial default-theme 1160px mounted baseline was inspected.
  Do not treat this as light/dark or responsive verification.
- No writes, enrollment submissions, operational mutations or new dependencies were used.
  Evidence records operation/error names rather than personal contact content.

## Implementation checklist

- [x] Confirm the original mounted consumer and reproduce its failures.
- [x] Record user direction to remove this page instead of redesigning or repairing it.
- [x] Remove its lazy route, feature export and five page files.
- [x] Search application sources for inbound links; none were found to remove.
- [x] Preserve the separate club tournaments tab and all other tournament routes in source.
- [x] Add route-contract tests for retirement and retained tournament destinations.
- [x] Withdraw DR-019h/DR-041 and reconcile parent/backlog scope.
- [x] Pass focused lint/test/build and browser retirement checks.

## Acceptance and verification

- [x] The retired URL cannot mount the deleted page or issue its invalid queries.
- [x] Actual tournament detail and club detail remain reachable.
- [x] Existing tournament tests and new route-contract tests pass.
- [x] Focused tournament lint and production library build pass.
- [x] User completion approval with disclosed limits is recorded.

Light/dark redesign, season interaction, visual contrast and screen-reader acceptance for the removed
page are no longer applicable. No replacement page, visual pattern or global theme change is introduced.

## Evidence and handoff

- Passed: integrated-browser route mount, initial rendered-content inspection, and observed reload
  capturing the three failing operation names, HTTP statuses and GraphQL validation messages above.
- Historical failures: three invalid queries, resource-read exceptions and untranslated labels.
  Removal supersedes the proposed data repairs; do not claim these failures were fixed.
- Source search covered application TypeScript/templates for route strings, component/service names,
  imports and tournament/club combinations. Only the deleted page, its barrels and its route referenced it.
- Initial `npx nx run-many -t lint test build -p frontend-pages-tournament --output-style=static`:
  45 tests and build passed; lint correctly found `chart.js` unused after deleting its only direct consumer.
- `npx nx run frontend-pages-tournament:lint --fix --output-style=static` passed and removed that
  project-local peer dependency. Root/shared chart dependencies are unchanged.
- Formatted all changed surviving files with `npx prettier --write` before validation.
- Final `npx nx run-many -t lint test build -p frontend-pages-tournament --output-style=static`:
  passed lint, both test suites/all 45 tests, production library build and ten prerequisite tasks.
  Existing executor/metadata warnings are not new failures.
- Application source search after removal finds zero retired route/component/service/import references.
- Browser: direct navigation to the old URL returns the development shell (HTTP 200), then logs Angular
  NG04002 (`Cannot match any routes`) and ends at `/`. Zero retired components and zero `ClubDetail`,
  `ClubTeamsDetail`, `ClubTournamentHistory` or `ClubStatistics` operations were observed.
  No uncaught page-error event occurred, but the console router error remains explicit.
  No new redirect, catch-all or HTTP 404 implementation was requested or added.
- Browser: supplied tournament detail returns HTTP 200 and the expected tournament heading/component.
  `/clubs/smash-for-fun` returns HTTP 200 and its expected club heading; clicking Toernooien selects the
  real tab and shows its localized heading/empty feedback, with zero obsolete links.
- Not run: authenticated/admin mutations, exhaustive retained-route workflows, full app build,
  screen reader and exhaustive SSR/hydration checks. This removal adds no visual UI requiring a theme matrix.
- Exceptions/reusable extractions: none.
- On 2026-11-02 the user selected "Approve DR-019e and commit with disclosed limits".
  Accepted limits include the existing NG04002/home fallback, untested authenticated/admin workflows,
  full app build, screen reader and exhaustive SSR/hydration. This is acceptance, not evidence those checks passed.
- Approval authorizes only this retirement, route tests, project-local dependency cleanup and repository handoff.
  No push is requested. Preserve all earlier child limits when closing DR-019.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
  with existing warnings and zero errors. Subsequent changes only record approval and these results.
- Exact next action in a fresh invocation: scope DR-019g's draw external-link contract investigation;
  not started here. Do not repair or recreate the retired page.
