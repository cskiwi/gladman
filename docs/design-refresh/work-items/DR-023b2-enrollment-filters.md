---
title: 'DR-023b2: Enrollment filters and selection'
description: 'Native enrollment controls and reactive filtering on the mounted tournament administration tab.'
---

## Identity

- ID: DR-023b2; parents DR-023b and DR-023 remain open.
- Authoritative status: [backlog](../backlog.md).
- Dependencies: approved DR-023a chrome, DR-023b consumer confirmation and DR-023b1 summary.
- Design rules: [rollout](../README.md).

## Scope

- Route: `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=enrollments`.
- Project: `frontend-pages-tournament`.
- Sources: [component][component], [template][template], [service][service].
- Refresh sub-event, status, search and refresh controls only.
- Correct their non-reactive FormControl effects and local search dependency as part of functional acceptance.
- Preserve first-sub-event default, six status values, player/guest/confirmed-partner substring matching,
  summary semantics, routes, authorization and operational data.
- Exclude table presentation/feedback, manual dialog, mutations, other tab behavior, global theme and backend.
- User explicitly extended this slice to redundant border removal from all existing Card templates.
  This includes shared hero/stat/game Cards, home/competition/tournament/draw/admin Cards and public enrollment Cards.
  No other shared presentation or behavior is changed.
- Subsequent explicit user feedback restores the semantic border centrally in the application PrimeNG preset,
  rather than restoring repeated template classes. This is an authorized global theme scope extension.
- User then requested Panels instead of nested Cards. Replace this tab's summary/filter Cards with native
  named Panels inside the existing administration Card; preserve all contents and behavior.
- Keep the existing smart tab/service split. These controls have one current consumer; a new wrapper would not
  provide genuine shared structure.

## Baseline and proposed approach

- Fresh browser initially lacked permission; user signed in and confirmed retry.
- Selecting Inschrijvingen now visibly mounts the actual tab on the confirmed non-DRAFT tournament.
- Four baseline checks at light/dark 390/1440px fit without document overflow.
- Sub-event shows HE 1 but selectedSubEvent is unset; table heading is absent.
- Select comboboxes lack label association. Dutch search label is blank; Refresh is icon-only and unnamed.
- Use a native Card, responsive grid, fluid Selects and native IconField/InputIcon.
- Reuse existing meaningful locale keys for search, placeholder, statuses and refresh.
- Preserve the existing English Withdrawn option if no corresponding translation exists; disclose this locale limit.
- Bridge form values to signals, synchronize service filters and keep search local without refetching per keystroke.
- Swallowed query failures and incomplete manual creation are pre-existing DR-023b3/b4 concerns.

## Implementation checklist

- [x] Confirm visible mounted consumer, dependencies and exact scope.
- [x] Refresh the controls with native PrimeNG presentation.
- [x] Correct reactive selection/status/search wiring without operational mutations.
- [x] Apply the explicit all-Card redundant-border cleanup, preserving meaningful live-result accents.
- [x] Validate the subsequent centralized preset Card border in both themes and affected consumers.
- [x] Validate native named summary/filter Panels with zero nested Cards on this tab.
- [x] Add focused behavior and locale/structure regressions.
- [x] Format changed files and run focused Nx checks.
- [x] Persist evidence, scope boundaries and next action.

## Acceptance and verification

- [x] Default selection, changed/cleared selection and replacement tournament options synchronize.
- [x] All six status values reach the query; null means all statuses.
- [x] Search reacts immediately, case-insensitively matches player/guest/confirmed partner, and clears locally.
- [x] Search does not issue network queries; refresh reloads the selected query.
- [x] Controls have associated labels and a named refresh action; option accessible names are translated.
- [x] Light/dark 390/1440px, overlays, keyboard/focus and sampled contrast checked.
- [x] Existing English/Dutch/French labels verified with disclosed missing Withdrawn localization.
- [x] No new stylesheet, inline style, palette, shared component, dependency or mutation.
- [x] Focused tournament Nx lint/test/build and shared Card tests pass.
- [ ] Full shared-component test target is clean; six pre-existing bracket-tree failures remain.
- [x] Affected shared Card consumers spot-checked in both themes and widths.
- [ ] Screen-reader, exhaustive accessibility/contrast, SSR/hydration and nonzero live workflows verified.
- [x] User review or explicit approval with disclosed limits.

## Evidence and handoff

- Started 2026-11-08 with a clean worktree.
- Before DOM checks and screenshot attempt recorded; one integrated screenshot showed Settings despite the
  enrollment selector. It is not reliable visual evidence; visible consumer was separately confirmed after tab click.
- Selection is now a signal bridged from the FormControl; status/search bridge the same way.
  One effect synchronizes filters, including null selection. A separate tournament-options effect
  initializes/reconciles selection but does not reselect after an explicit control clear.
- Service query parameters depend only on sub-event/status with equality comparison.
  Search reads the reactive filter snapshot and does not invalidate the server query.
  No query/error/status-count semantics or operational handlers were otherwise changed.
- Status labels use the existing translation stream for native options, preserving enum values.
  The first template-only translation rendered correct text but exposed raw keys through native `aria-label`;
  browser evidence caught this and the native translated-options implementation supersedes it.
- Missing Dutch/French search copy is avoided with existing `all.common.search` and `searchPlayers` keys.
  Refresh uses `all.button.refresh`; sub-event placeholder uses its existing meaningful label.
  Withdrawn has no existing translated label and remains English in all locales, tracked by DR-023b5.
- User feedback: "p-cards shouldn't need `border border-surface` anywhere".
  User then explicitly selected "All p-cards now".
  Removed the redundant pair from 24 Card tags in 15 templates, including the approved summary Card.
  Root-only pass-through bindings are removed; selection-grid height uses native `styleClass="h-full"`.
  Existing unrelated body pass-through bindings are retained, not added or expanded.
  Intentional live-result primary/green emphasis borders remain.
  Historical child evidence remains historical; the rollout rules now record this newer Card direction.
- Utility comparison: filter class/styleClass tokens fall from 40 to 21.
  The count covers the Filters marker through update-error feedback, not runtime template expansion.
- Required repository formatting also normalizes existing wrapping/indentation in changed legacy Card
  templates/tests and aligns the backlog table. Excluded bindings and operational handlers remain unchanged.
- Fifteen new safe component/service regression cases cover selection/default/replacement/clear,
  six status values, local search matching/clear, refresh and three real locale assets.
  Existing summary regressions still pass; border expectations are updated to the explicit user direction.
  All regression mutation spies remain unused.
- Exact final tournament check:

  ```powershell
  npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static
  ```

  Pass: 17 suites / 221 tests, tournament lint/production library build and ten prerequisite tasks.
  Initial formatting caught a mismatched closing tag; corrected before validation.
  The first test run exposed mistakenly nested test setup; isolated suites corrected and all checks rerun.

- Expanded Card check:

  ```powershell
  npx nx run-many --projects=frontend-components,frontend-pages-competition,frontend-pages-home,frontend-pages-tournament --targets=lint,test,build --output-style=static
  ```

  Lint/build pass for all four projects and nine prerequisite tasks.
  Home: 1 suite / 12 tests; competition: 20 suites / 323 tests; tournament: 17 suites / 221 tests pass.
  Shared components: 10 suites / 96 tests pass, 1 suite / 6 tests fail.
  Failures are the unchanged bracket-tree missing `getTeamName` and ordering expectations already recorded
  in DR-006j; no bracket source/tests were modified.
  Existing lint/deprecation/Angular warnings and a shared test worker teardown warning remain.

- Focused shared Card test command:

  ```powershell
  npx nx run frontend-components:test --testPathPatterns games hero stat-card --runInBand --output-style=static
  ```

  Pass: 4 suites / 64 tests; runner reports `hero|games`.
  Do not claim this selector includes stat-card. Its template compiles in the shared build.
  An earlier pipe-separated argument failed in Windows command parsing and did not execute tests.

- App check `npx nx build app --configuration=development --output-style=static` passed with 29 prerequisites
  before the later Card/accessible-option corrections; no final app production build is claimed.
  Final library builds and current mounted browser checks cover those later corrections.
- The port-3000 server initially served the old controls. A temporary built-asset preview returned HTTP 200
  after correcting the generated CSR index filename, but integrated route interception timed out.
  All preview helpers were stopped and browser routes removed.
  User restarted the frontend; subsequent checks confirm the current native controls and border-free Cards.
- Four actual light/dark 390/1440px cases: one/four filter columns, associated Dutch labels,
  named refresh, no Card/document overflow, six native options with localized accessible names.
  One initial dark popup sample raced its opening animation; explicit option waits supersede it.
  Space opens the status Select; Escape and Tab reach search then refresh; refresh has a visible native 1px outline.
- Sampled label contrast: 19.87:1 light / 16:1 dark.
  Selected text: 13.61:1 light / 16:1 dark.
  Refresh text: 4.53-4.87:1 light / 6.07-6.65:1 dark, including focused/hover states.
  Browser Canvas converts OKLCH colors before luminance calculations. These are samples, not an exhaustive audit.
- Actual status selection and refresh each issue the expected `SubEventEnrollments` query with `CONFIRMED`.
  Search fill/clear issues zero enrollment queries. Monitored interaction block reports zero mutation requests.
  Real supplied enrollments remain empty; synthetic nonzero unit fixtures are not live workflow evidence.
- Affected consumer spot checks: home, supplied competition/player/club/tournament routes,
  the DR-022d mounted draw and DR-021 public enrollment route, in light/dark at 390/1440px.
  All final samples have visible Cards, zero redundant Card borders and no document overflow.
  Competition's first transient zero-Card sample was repeated: all four final samples show 13 Cards.
  Draw retains eight Cards and three standings rows; public enrollment retains 32 Cards.
  These checks do not establish exhaustive shared-consumer workflow/accessibility parity.
- Attached final wide-dark and narrow-dark filter captures show native controls; screenshots are not committed.
- `git diff --check` passes. Git emits existing checkout-policy CRLF warnings; authored changes are formatted with LF.
- Unverified: screen-reader, exhaustive accessibility/contrast/focus-ring contrast, SSR/hydration,
  alternate live locales, nonzero enrollment workflows, failed-query feedback, and exhaustive shared consumer states.
  Query failures still become empty arrays, assigned to DR-023b3; manual creation remains DR-023b4.
- No backend/translation asset changes, dependencies, admin mutations or push.
- User approved completion and commit with disclosed limits, selecting "Nothing else", on 2026-11-08.
  Before commit, user revised the Card direction: the border is necessary and must be in the theme preset.
  Earlier border-free visual evidence is not validation of that later preset change.
- Styling exception: [theme preset](../../../apps/app/config/theme.preset.ts), component Card CSS.
  Installed Card root tokens offer background/radius/color/shadow but no border option.
  Use the supported component `css` hook and `dt('content.border.color')` for a shared 1px solid border.
  This exactly reuses PrimeUI `border-surface`'s semantic token, with no manual light/dark palette.
  A token-only Card override cannot introduce a CSS property that the installed component never renders.
  Remove this CSS if Card gains native border tokens; do not move it to templates or page stylesheets.
  Existing native styling, layout and accent utilities must remain effective.
- User then requested native Panels instead of Cards inside Cards.
  Summary/filters now use two named Panels inside one administration Card, with zero nested Cards on this tab.
  Existing translated `enrollments.title` and `all.games.filters` supply native headers and region names.
  No hidden header is used, avoiding Panel's otherwise dangling native region label.
- Panel regression initially rejected PrimeNG's own motion `--height`/`--width` inline properties.
  Assertions now exclude only the native `.p-panel-content-container`, not authored inline styles.
  Final tournament lint/test/build passes again: 17 suites / 221 tests and ten prerequisites.
- Final Card CSS lives in `@layer theme`, the existing lower-priority layer, so intentional utility accents work.
  Unlayered CSS blocked those accents. `components` also failed because the application imports utilities
  before registering components; a later layer-order statement cannot reorder layers already registered.
  Final safe DOM-only cascade fixtures in both themes verify ordinary 1px borders, primary 2px borders
  and green 4px left accents. Fixtures are removed immediately; no new application consumers are created.
- Twenty-eight final settled consumer checks across the seven routes above confirm visible Cards, exact
  1px solid borders matching `--p-content-border-color`, and no document overflow in light/dark 390/1440px.
  Initial resize/data-load samples caught temporary overflow or zero Cards; final checks wait for actual
  mounted Cards and viewport fit. These do not establish transient loading/hydration parity.
- Four final native-Panel cases preserve five zero counts, named regions/labels, six Select options,
  keyboard search/refresh progression, 1px native focus and no Panel/document overflow.
  Header/label contrast is 19.87:1 light / 16:1 dark.
  Fully settled refresh focus/hover contrast is 4.87/4.66:1 light and 6.65/6.28:1 dark.
  Earlier immediate/300ms samples caught theme-color transitions; one-second settled samples supersede them.
  Transient animation contrast remains outside the exhaustive unverified checks.
- Final post-correction commands:

  ```powershell
  npx nx build app --configuration=development --output-style=static
  npx nx run-many --target=lint --output-style=static
  ```

  Pass: current app development browser/SSR build and 29 prerequisites; all 34 workspace lint targets.
  Existing warnings remain. No production app build, screen-reader or exhaustive hydration claim.

- On 2026-11-08 the user again selected "Approve completion and commit with disclosed limits" and "Nothing else",
  confirming the final Panel/preset correction. Approval covers the filters, Panels, shared Card border/template
  cleanup, tests and repository handoff; no push. Accepted limits stay unchecked, not claimed as passed.
- Authoritative child status is Done; both parents remain open.
- Commit the approved slice/handoff only. Exact next action in a fresh invocation: scope DR-023b3
  enrollment table/feedback on the same confirmed consumer, including swallowed-query error handling.
  Do not start that implementation in this invocation.

[component]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.component.ts
[template]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.component.html
[service]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.service.ts
