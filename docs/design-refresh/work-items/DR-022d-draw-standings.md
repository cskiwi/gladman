---
title: 'DR-022d: Mounted round-robin draw standings'
description: 'Native PrimeNG standings presentation on the public tournament poule draw.'
---

## Identity

- ID: DR-022d; parent DR-022 remains open. Authoritative status: [backlog](../backlog.md).
- Dependencies: completed DR-022a/b/c. Design rules: [rollout](../README.md).

## Scope

- Project: `frontend-pages-tournament`.
- Confirmed real mounted consumer on 2026-11-07:
  `/tournament/internationaal-tornooi-lokerse-bc-2023/sub-events/`
  `b4740531-1537-44a7-a2c0-cc8d3d4eb90f/draws/d3331a9c-3400-4317-8d5b-46e5b1c1bfb9`.
- Tournament overview links to `MD 1-2 - Poule A`; hydrated draw mounts one standings child with three rows.
- Sources: [child][component], [template][template], [mounted parent][parent].
- Preserve row order, all eight columns, team/player identity precedence and abbreviated ID fallbacks.
- Correct tightly coupled presentation bugs: zero statistics must render `0`, and missing paired statistics
  must render `-`, not an incomplete pair.
- Reuse the existing smart page and input-only presentation child; no new wrapper or data-owning component.
- Exclude games/bracket, page feedback/actions, sorting/query behavior, services, backend, translation assets,
  and shared component implementations. Do not add navigation, admin actions or dependencies.
- On 2026-11-08 user explicitly expanded this slice to shared transparent default native table rows:
  "All tables in the project should use a transparant background as default so we always have the look
  like the ranking one".
- Authorized additional sources: [shared preset][preset], [homepage][home] and its existing regression test.
  Remove the superseded homepage row override; the shared preset now supplies light/dark transparent body rows.
  Preserve opaque sticky headers/footers and explicit striped/hover/selection states.
  No page-specific styling exception or new global stylesheet; this is explicit theme infrastructure work.

## Baseline and proposed approach

- Clean worktree at selection. Original template: 76 lines, 137 static class tokens and two inline color overrides.
- Four real light/dark 390/1440px cases retain three rows and no document overflow (375/1425px client widths).
- Real points value `0` currently displays `-`; every real won/lost value is zero but displays `-`.
- Native Card/Table replaces custom table surfaces, uppercase headings, cell typography and win/loss colors.
- Following user feedback, use the mounted homepage table as the presentation reference.
- Reuse its bordered Card, shared SectionHeader, tabular numbers, native Table and in-table empty feedback.
- Keep native cell alignment as actually rendered on the homepage (`start`).
  Its legacy `text-right` classes do not win against native Table styles and are not copied.
- Do not copy the homepage's `[dt]` row-background override or inline minimum-width option.
  Retain native row styling and the verified named keyboard scroll region without new styling exceptions.
- Localized heading/columns reuse existing competition label assets; no backend/translation restart needed.
- Keep one accessible horizontal scroll region with minimal layout utilities. Native cells own appearance.

## Implementation checklist

- [x] Confirm real mounted consumer, dependencies and bounded scope.
- [x] Preserve smart/presentation separation, identity fallbacks and source ordering.
- [x] Use native PrimeNG presentation and existing localization.
- [x] Remove scoped custom table styling and inline color overrides.
- [x] Verify zero/missing/empty/long-name/singles/doubles/team-ID cases.
- [x] Persist exact validation evidence and remaining actions.

## Acceptance and verification

- [x] Eight localized scoped column headers and named section/scroll region.
- [x] Native Card/Table; no page-specific styles or palette utilities.
- [x] Explicit shared transparent row default verified across mounted consumers in light/dark.
- [x] Zero values remain visible; null/undefined paired values show `-`.
- [x] Identity precedence and incoming order remain unchanged.
- [x] Light/dark 390/1440px real and safe synthetic layouts fit with local horizontal scrolling.
- [x] Keyboard scroll, visible focus and relevant text contrast verified.
- [x] Existing en/nl_BE/fr_BE label assets and populated SSR preserved.
- [x] Focused existing Nx lint/test/build tasks pass.
- [x] Revised table matches the mounted homepage's meaningful composition and actual numeric alignment.
- [ ] Screen-reader, exhaustive accessibility/contrast and hydration verified.
- [x] User visual review or explicit approval with disclosed limits.

## Initial proposal evidence

These measurements cover the first proposal only. Fresh homepage-aligned verification appears below.

- Baseline browser observed real player names, three standings and unchanged games mount.
- Changed scope: only the input-only standings child template/imports, ten new regression cases,
  this brief and backlog. No service, parent, shared, theme or translation-asset changes.
- Utility comparison: 137 to 18 static class tokens; 76 to 81 template lines.
  Native Table templates and explicit empty/missing-value branches explain the small line increase.
  Both inline win/loss colors and custom table appearance are removed. No styling exception.
- PrimeNG generated Table basic/accessibility documentation checked against native installed 22.1.2 behavior.
  Card/Table and the named horizontal scroll region reuse the competition poule's meaningful composition;
  its team-only model is not a reusable data-owning wrapper for tournament entrants.
- Formatting: `npx prettier --write` on the three changed child files, this brief and backlog.
- Final focused validation command:

  ```powershell
  npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static
  ```

  Passes lint with existing warnings, production library build and ten prerequisite tasks;
  15 suites / 184 tests. Ten new cases cover zero values, absent/incomplete pairs, identity precedence,
  no-ID order, input replacement, long names/escaped text, empty state and en/nl_BE/fr_BE assets.
  Initial lint rejected loose null comparisons; strict null-normalizing guards resolve all four new errors.
  Final suite/build verifies those corrected guards.

- Browser verification: existing `@playwright/test`, `node -` with a PowerShell stdin here-string,
  isolated `chromium.launch({ channel: 'chrome', headless: true })`; browser closed in `finally`.
  No dependency installation, shared browser termination, operational action or backend mutation.
- Four isolated real light/dark 390/1440px cases retain three standings and six game Cards.
  Every rendered cell matches the actual input values and order; real zero won/lost/points render `0`.
  No document overflow. Narrow region width is 327px with 789px local scroll content;
  wide region/content both measure 1363px.
- In four real cases, Shift+Tab/Tab returns focus to the named region with visible native 1px outline.
  Actual ArrowRight increases narrow scrollLeft to 34px light / 36px dark.
  Wide cases need no horizontal scroll. All eight column headers expose `scope="col"`.
- Twenty isolated safe synthetic cases (five inputs in four theme/width combinations) pass:
  singles/zero pairs, doubles with 160-character unbroken and long spaced names, team/player-ID/unknown fallbacks,
  null/undefined incomplete pairs and empty feedback. Names remain within their identity column.
  Inputs are replaced only in browser memory; real data is restored between combinations, browser then closed.
  Empty feedback is checked after native leave animations settle; it is absent on restored populated content.
  Monitored isolated run has zero page errors and zero GraphQL mutation attempts.
- Canvas-composited sampled text contrast (light / dark):
  title/header 19.87 / 16.00, muted row count 4.87 / 6.65 and player/zero values 19.87 / 16.64.
  All meet 4.5:1. Exhaustive contrast, focus-ring contrast and screen-reader behavior are not claimed.
- After screenshots inspected: native light 390px scrollable table and dark 1440px complete table.
  They show native row separators, paired player names, readable scoped headers and visible focus boundary.
  Screenshots are local browser evidence, not committed assets.
- Initial integrated browser was `document.visibilityState === 'hidden'`; screenshots were blank,
  pointer stability timed out and ArrowRight did not scroll. Those attempts are not passes.
  Isolated visible headless rendering above supersedes that harness limitation.
  An initial malformed PowerShell/Node quoting attempt did not execute the SSR check; stdin retry passed.
- Public SSR: `node -` stdin script uses Node `fetch` for the confirmed route.
  HTTP 200, native standings table, named heading, eight scoped headers, three body rows,
  real player content and games mount. Actual hydrated input/cells agree in isolated browser.
  Exhaustive hydration is not verified.
- Not run: screen-reader, exhaustive accessibility/contrast/hydration, browser alternative locales
  and authenticated workflows. Locale asset regressions pass; they are not alternative-locale browser passes.
- Initial proposal paused for review; the user requested the homepage reference rather than approving it.

## First homepage-aligned revision evidence

These results predate the explicitly requested shared transparent default below.

- On 2026-11-07 the user requested "use the homepage for reference on how to do a table".
  This is a revision request, not completion or commit approval.
- Inspected [homepage source][home] and its actual mounted `/` table in an isolated browser.
  Real homepage uses bordered Card, shared SectionHeader, native scrollable Table and tabular numbers.
  All four native headers and numeric cells compute `text-align: start`, despite legacy `text-right` utilities.
  Match actual presentation; do not add ineffective classes or important overrides.
- Revised child reuses the existing SectionHeader with projected row count, bordered Card and `tabular-nums`.
  Native scrollable Table remains inside the explicit named keyboard region.
  Empty data renders one native row spanning eight columns, matching the homepage's empty template pattern.
  Initial standalone Message/import is removed. Smart/presentation separation and identity/order remain intact.
- Revised source: the same three child files, brief and backlog. No shared/homepage modification.
  Keep homepage legacy `[dt]` and its dormant alignment cleanup deferred under DR-029, not a hidden side effect.
  No new inline/tableStyle, pass-through, design-token binding, palette utility, style or exception.
- Final template: 75 lines / 15 static class tokens versus original 76 / 137.
  Shared SectionHeader supplies its existing heading layout; it is reused, not recreated or modified.
- Format: `npx prettier --write` on the three revised child files, this brief and backlog.
- Final post-revision command:

  ```powershell
  npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static
  ```

  Passes lint with existing warnings, production library build and ten prerequisites;
  15 suites / 184 tests. Updated regressions require shared heading, bordered Card, native scrolling,
  tabular numbers and native colspan-eight empty row in all three locale assets.

- Revised isolated browser command: `node -` with PowerShell stdin here-string and existing `@playwright/test`.
  Waits for the actual hydrated parent draw selector, completed resource and three standings before focus tests.
  An earlier revision attempt focused a replaced SSR node and failed ArrowRight; it is not a pass.
  A subsequent actual-style assertion exposed ineffective numeric alignment utilities; final code omits them.
  Final verification is after the last source change and focused build, not borrowed from initial evidence.
- Four final real light/dark 390/1440px cases pass: bordered Card/shared heading/native scrolling/tabular numbers,
  homepage-matching native alignment, all actual input cells/order, three standings and six unchanged game Cards.
  Zero won/lost/points remain `0`; no document overflow.
  Narrow region/content widths: 325/792px; wide widths: 1361/1361px.
- Four real Shift+Tab/Tab focus cases expose native 1px visible region outline.
  Actual ArrowRight scrolls narrow region to 32px light / 35px dark.
  Native Table and the named region retain all eight scoped headers.
- Twenty final synthetic cases pass: singles/zero pairs, doubles with 160-character unbroken and long spaced
  names, team/player-ID/unknown identities, incomplete null/undefined pairs and native empty row.
  Names fit their column; all layouts fit the document; actual source inputs restored in `finally`.
  Monitored final browser has zero page errors and zero GraphQL mutation attempts; browser closed in `finally`.
- Final sampled composited text contrast (light / dark):
  title/header 19.87 / 16.00, muted count 4.87 / 6.65, player/zero 19.87 / 16.64,
  native empty row 4.87 / 6.91. All meet 4.5:1.
- Revised screenshots inspected: light 390px local-scroll table and dark 1440px full table.
  The shared heading has homepage spacing; Card border and native separators are visible.
  Old screenshots and measurements do not establish revised verification.
- Revised public SSR: Node `fetch` returns HTTP 200, shared heading, native scrollable Table,
  eight scoped headers, three body rows and real player content. Hydrated real cell values match the input.
- Not run: screen-reader, exhaustive accessibility/contrast/focus-ring contrast/hydration,
  browser alternative locales and authenticated workflows. Existing locale regressions pass.
- Resulting status: Review. No blocker or new styling exception. No commit or push authorized.
- Exact next action: user review/approval of revised DR-022d with disclosed limits.
  After approval, record limits, mark child Done and commit only its implementation/tests/handoff.
  Reconcile DR-022 parent scope before choosing another implementation; do not start one here.

## Shared transparent-default evidence and handoff

- On 2026-11-08 the user again requested the ranking-table appearance, then explicitly requested:
  "All tables in the project should use a transparant background as default so we always have the look
  like the ranking one". This authorizes the shared-default implementation, not completion or commit.
- Actual dark ranking rows/Card are both `oklch(0.17 0.02 250)`; previous standings rows use
  `oklch(0.14 0.02 250)` on that same Card surface.
  Native padding already matches (`10.5px 14px`), typography/separators also match.
  The earlier structural comparison did not establish equivalent backgrounds; that mismatch is now corrected.
- Shared preset sets ordinary DataTable row `background: 'transparent'` in both light/dark schemes.
  The surrounding Card/canvas now supplies the surface for every native table without a local override.
  Remove the superseded homepage row `[dt]`; existing homepage regression now requires `dt()` undefined.
- Preserve opaque header/headerCell/footer/footerCell tokens for sticky/readable table chrome,
  and opt-in stripes plus hover/selection styling. Transparent defaults concern ordinary unselected body rows,
  not removal of intentional state feedback. Legacy hand-built tables with explicit backgrounds are not migrated.
- Changed scope adds shared preset, homepage template/existing regression and design rules README.
  Earlier "no shared/theme/homepage change" statements describe the preceding page-only proposal, not this extension.
  No new style file, semantic-token bypass, local CSS-variable exception, palette choice or dependency.
- Source inventory finds 19 frontend templates with native tables, including shared tier popover;
  club roster/edit/survey/tournaments, competition poule/assembly combinations, player head-to-head/breakdown,
  tournament standings/admin tables and sync-admin tables. The same preset covers them centrally.
  Their original models/actions/routes are unchanged; unmounted components are not given new consumers.
- Additional confirmed real routes:
  `/competition/pbo-competitie-2026-2027/sub-events/8e8ba158-859c-48a7-92ca-f2c3ce805f4f/`
  `draws/78d42486-ab43-4484-9b68-a99e46bf96ae` (nine standings, nine links), and
  `/clubs/smash-for-fun/teams/1161b779-2cbe-457c-b829-e0d756ff99bc` (eight roster rows, eight links).
  Both are linked by the supplied real competition/club routes.
- Sixteen final mounted cases across those routes, homepage (12 rows) and draw (three rows),
  in light/dark 390/1440px, pass:
  every ordinary row computes `rgba(0, 0, 0, 0)`, ordered cells/links match baseline,
  native cell padding is unchanged and document scroll/client widths match.
  Without a Card, roster rows correctly use the app canvas.
- Four final draw keyboard cases return visible region focus using Shift+Tab/Tab;
  ArrowRight moves narrow scrollLeft to 35px light / 32px dark. Wide cases require no scrolling.
- Final sampled composited ordinary-cell contrast after theme transitions settle:
  homepage/draw/poule 19.87 light / 16.00 dark; roster 18.20 / 16.64. All meet 4.5:1.
  An initial immediate post-toggle roster measurement sampled the animating light canvas and failed at 1.21:1;
  final settled checks wait 500ms. That transient attempt is not a steady-state pass or exhaustive audit.
- Two theme-state fixtures on the real home Table preserve native stripes, hover and selected styling:
  striped first row is a native tinted surface; hover and selected backgrounds stay distinct.
  Selection fixture applies the native selected class only; it is not authenticated row-selection validation.
  Native `scrollHeight="100px"` fixture keeps opaque sticky thead at the scroll container's top in both themes.
  Inputs/classes restored in `finally`; isolated browser closed.
  Initial stripe assertion incorrectly sampled the second/even unstriped row; first/odd native stripe retry passes.
- Twenty freshly rerun standings fixtures in four theme/width combinations pass:
  singles/zero statistics, long doubles names, team/player-ID/unknown identities,
  null/undefined incomplete pairs and native empty row. All rows including empty feedback remain transparent;
  names/layout fit. Original input restored in `finally`.
- Monitored final route and edge-case runs record zero page errors and zero GraphQL mutation attempts.
  Safe read-only route navigation, in-memory visual fixtures and no operational/admin mutation.
- Public home and draw SSR checks return HTTP 200 with native scrollable tables;
  draw retains eight scoped column headers and mounted real data.
- Final screenshots inspected without focused-region screenshot artifacts:
  dark 1440px has one coherent Card/header/row surface like the ranking table;
  light 390px keeps local horizontal scrolling and native row separators.
- Formatting: `npx prettier --write` on changed theme/home files and all changed design-refresh documents;
  unchanged standings files retain their prior formatted state.
- Final focused command:

  ```powershell
  npx nx run-many --projects=app,frontend-pages-home,frontend-pages-tournament --targets=lint,test,build --output-style=static
  ```

  Passes three lint projects, 16 suites / 196 tests (home 12, tournament 184), production library builds,
  app development browser/SSR build and 27 prerequisite tasks. Existing lint/build warnings remain.
  App has no unit-test target. App production build is not claimed.
  Direct `node -` assertions against exported `BadmanPreset` pass for transparent light/dark row defaults
  and unchanged dark sticky-header, stripe, hover and selected tokens.

- Not verified: all authenticated/admin/sync workflows, shared tier popover, import modal, player
  head-to-head/ranking-breakdown and every table interaction; screen-reader, exhaustive accessibility/contrast,
  focus-ring contrast/hydration and browser alternative locales.
  Club `Toernooien` data mounts no table; supplied player/competition/tournament landing pages themselves
  also have no native table. Their absence is not a table-verification pass.
  An initial role-tab lookup timed out; native tab selection confirmed the empty club tournament data.
- Resulting status: Review. No implementation blocker or styling exception.
  Shared behavior change was explicitly requested; no commit or push approved.
- Exact next action: user review of DR-022d including the global transparent-default extension.
  After approval with disclosed limits, record acceptance and commit only this implementation/tests/handoff.
  Reconcile DR-022 parent scope before selecting another implementation; do not start one here.

## Approval and final delivery

- On 2026-11-08 the user selected "Approve DR-022d and shared table defaults; commit with disclosed limits"
  and "Nothing else". This explicitly approves completion and the scoped commit, not a push.
- Authoritative child status is Done. DR-022 parent remains open pending its mounted-scope reconciliation.
- Approval accepts unperformed screen-reader/exhaustive accessibility/contrast/focus-ring contrast/hydration,
  browser alternative locales, all authenticated/admin/sync/import-modal/player/tier workflows and app
  production build. Existing passing checks do not imply those unperformed checks passed.
  The exhaustive accessibility/hydration criterion remains unchecked.
- Approved scope: standings implementation/tests, shared transparent-row preset,
  removal of the superseded homepage row override and its updated regression, and repository design handoff.
  No unrelated files or workflow configuration may be staged.
- No application code changed after passing app/home/tournament focused validation and final browser checks.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
  with existing warnings and zero errors. No application code changed after the final focused build/tests.
- Exact next action in a fresh invocation: reconcile DR-022 against its four completed children and
  remaining mounted scope. If complete, scope the next mounted DR-023 administration child.
  Do not begin another implementation here.

[component]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/components/draw-standings-table.component.ts
[template]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/components/draw-standings-table.component.html
[parent]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/page-draw-detail.component.html
[home]: ../../../libs/frontend/pages/home/src/pages/home/page-home.component.html
[preset]: ../../../apps/app/config/theme.preset.ts
