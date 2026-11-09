---
title: 'DR-023c3: Check-in table and actions'
description: 'Native check-in table, explicit feedback and accessible operational action presentation.'
---

## Identity

- ID: DR-023c3; parent [DR-023c](DR-023c-admin-checkin.md).
- Authoritative status: [backlog](../backlog.md).
- Dependencies: approved DR-023a, DR-023c1 and DR-023c2; filters committed as `0cdbbdd9`.
- Design rules: [rollout](../README.md).
- Outcome: a readable native table with named selection/actions and honest loading/error/empty feedback.

## Scope

- Fresh authorized visible consumer confirmed on 2026-11-08:
  `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=checkin`.
- [Component](../../../libs/frontend/pages/tournament/src/pages/admin/tabs/checkin/checkin-tab.component.ts),
  [template](../../../libs/frontend/pages/tournament/src/pages/admin/tabs/checkin/checkin-tab.component.html),
  [tests](../../../libs/frontend/pages/tournament/src/pages/admin/tabs/checkin/checkin-tab.component.spec.ts).
- Project: `frontend-pages-tournament`; bounded `backend-translate` labels and one generated `i18n` key.
- Preserve status enum/severity, identity, sub-event, timestamp, 10/25/50 paging, selection and mutation contracts.
- Preserve summary/filters and route/phase/permission gates. Never execute browser operational mutations.
- Exclude other tabs, global/shared styling, dependencies, backend business rules and broad locale completeness.

## Baseline and approach

- Clean worktree; previous child is committed despite stale pending-commit handoff wording.
- Actual Dutch empty list has a blank heading/feedback, `0 players`, unnamed selection controls and two Initialize
  actions. Scheduling HTTP 400 remains DR-024.
- Replace decorative surface/header/icons, palette row highlights and custom loading bar with a semantic section/Table
  and ProgressBar. Keep only layout utilities and native status Tags.
- Use one native table empty template; distinguish read loading/error from successful empty results.
  Keep initialization solely in filters rather than suggesting initialization for every no-match search.
- Name icon actions/checkboxes, expose count with translated Players and use native small table sizing/scrolling.
- Fix tightly coupled row-variable shadowing of `checkIn()`; verify mutation arguments only with mocked Apollo.
- Keep the existing smart tab/service split: no repeated real presentation consumer warrants a new component.
- Safeguards: disable operational/selection controls during updates and row actions without enrollment IDs;
  keep read filters available. Functional concurrency/partial-result changes require separate scope.

## Implementation checklist

- [x] Confirm mounted consumer, prerequisites and bounded scope.
- [x] Replace decorative table/header/loading/empty presentation.
- [x] Preserve row information, selection/paging and named action contracts.
- [x] Record utility comparison and out-of-scope discoveries.

## Acceptance and verification

- [x] Native Table, semantic section/statuses and reduced utilities; no new SCSS/inline styling/palette colors.
- [x] Player/guest/member-ID, sub-event, status and time remain visible; paging supports 10/25/50.
- [x] Keyboard selection, named actions and disabled update/missing-ID states work.
- [x] Mocked row check-in/no-show/undo/bulk actions use exact existing mutation arguments; no live writes.
- [x] Loading/read errors do not show misleading empty/initialize feedback; update errors remain explicit.
- [x] Light/dark at 390/1440px preserve information with contained table scrolling.
- [x] Focused Nx tests/lint/build pass with exact evidence.
- [ ] Exhaustive accessibility/contrast, live operations and dedicated SSR/hydration verification.
- [x] User review or explicit acceptance with disclosed limits.

## Evidence and handoff

- Before screenshot captured from the shared authorized browser; genuine empty data only.
- Installed PrimeNG types and generated usage validation verify native Table scrolling/small size/tableStyleClass,
  Checkbox binary/naming/disabled and Button severity/size/onClick; ProgressBar docs confirm indeterminate mode.
  Documentation section lookups initially failed; installed types and final generated usage validation pass.
- Scoped authored utility tokens fall 133 to 31; four inline styles/tableStyle bindings and four palette row
  bindings are removed. Native status Tags replace paired green/red row styling.
- One Initialize action remains in filters; read loading/errors disable it and never suggest initialization for
  a no-match search. Native list error/empty feedback is explicit; update errors wrap safely.
- Row variable is now `record`, fixing its shadowing of `checkIn()` without changing the mutation contract.
  Missing enrollment IDs disable pending actions/checkboxes; Select pending includes actionable records only.
  All selection/operational controls disable during an update; filters remain available.
- Guest/unknown identity and status Tags reuse existing localized copy. Added `checkin.clearSelection` in three
  locales; filled mounted Dutch/French Players/time/empty labels and corrected French no-show action wording.
  No unconsumed blanks are filled. Generated translation types regenerate at API startup.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=checkin-tab.component.spec.ts --runInBand
--output-style=static` passes 1 suite / 26 tests.
  Two initial runs failed four recovery assertions: the first referenced detached row buttons after reload;
  the second read before the mutation continuation scheduled resource reload.
  Awaiting that continuation and querying the current button verifies recovery without changing production timing.
- `npx nx run-many -t lint build -p frontend-pages-tournament,backend-translate --output-style=static`
  passes both targets and 12 dependency tasks.
  Initial lint reports seven new test non-null warnings; those are corrected with an explicit required-button guard.
  Final focused rerun passes all 26 tests; `npx nx run frontend-pages-tournament:lint --output-style=static`
  passes with no lint findings after this test-only correction.
- `npx nx run api:build:development --output-style=static` passes all 16 tasks and packages locale assets.
- Initial live HTTP 200 dictionaries expose old Dutch/French blank labels and no `clearSelection` in any locale.
  The loader reads built assets with watch disabled; a build does not reload the running API.
  User API restart is required at that point; the subsequent actual dictionary verification below passes.
- No styling exceptions, shared changes, dependencies, browser mutations or extracted wrappers.
- DR-051 records pre-existing partial/missing mutation-result and stale selection/focus reliability work separately.
  Existing DR-024 scheduling HTTP 400 and DR-034 native error contrast remain outside scope.
- User selected "API restarted; continue verification" and "Nothing else".
  Port 5000 listens; fresh actual HTTP 200 dictionaries contain all scoped values in three locales.
  Startup regenerated precisely one `clearSelection` type key. Prettier preserves generated formatting with
  `--tab-width 4 --quote-props preserve --single-quote false`; generated file remains a one-line scoped diff.
- First fixture reload sampled SSR-transferred genuine emptiness before client refresh; discard that sample.
  Explicit native Refresh reliably mounts safe records without a server mutation.
- Populated native Panel content grid expanded to 630px inside a 278px host at 390px.
  Replaced that list-only Panel with the already-approved enrollment semantic section/table direction.
  Native Table now contains horizontal scrolling; no custom CSS, inline widths or hidden-overflow workaround.
  A transient post-HMR 466px document sample settled to 375px and is not final layout evidence.
- After section correction, focused 26 tests and frontend lint/build plus 10 dependency tasks pass again.
- Final browser checks after user restart pass on 2026-11-09:
  - Twelve settled English/Dutch/French, light/dark, 390/1440px populated cases fit.
    Document width is 375px at 390px and 1425px at 1440px with scrollbar.
    Native table container is 279px narrow with content 570/659/599px by locale; scrolling is contained.
  - Safe 56-record client-only response fixture verifies 25/50-row selection and six-row last page in all 12 cases.
    Paging is native; dropdown opens with Enter. Space selects the named player checkbox; Enter clears selection
    in every case. All list buttons have accessible names.
  - Player/member ID, guest annotation, sub-event, localized status/severity and local `11:30` timestamp remain visible.
    Missing enrollment controls are disabled. After screenshot, native page size is restored to 10.
  - Four safe loading/error/recovery theme/width cases pass: named native ProgressBar, no misleading empty table,
    disabled Initialize during read loading/error, stable Refresh focus and successful empty recovery.
    Recovered document widths are 375/1440px. Update failures and concurrent disabled controls use mocked unit tests,
    not browser operational writes.
  - Sampled light/dark contrast passes: heading 19.87/16.00, member ID 4.87/6.65,
    Pending 4.52/9.31, Checked In 4.57/10.51 and No Show 5.30/8.73.
    Canvas converts computed theme colors to sRGB; transparent ancestor backgrounds are composited before luminance.
  - Initial automation selected Back via a broad header selector; restored the admin route.
    Intermediate locale attempts assumed Dutch menu names in French; corrected translated menu-name matching.
    Those incomplete attempts are not the final matrix evidence.
  - Zero browser mutations. Every route interceptor is removed in finally; actual data is restored by reload.
    Test-only Apollo cache replacement warnings are not operational data evidence.
    Dutch locale, dark preference and 1440px viewport are restored.
- Native error Message contrast remains the previously recorded DR-034 limitation; no new shared styling.
  Existing scheduling HTTP 400 remains DR-024.
- User selected "Approve completion and commit with disclosed limits" and "Nothing else".
  Approval covers this child's table/actions, bounded locale labels/generated key, tests and repository handoff.
  Accepted limits remain unchecked: full tournament suite, exhaustive accessibility/screen-reader/contrast,
  dedicated SSR/hydration, live operational workflows and existing DR-034/DR-024/DR-051 limitations.
  Approval is not evidence that an unperformed or failed check passed.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 workspace targets
  with existing warnings; the changed frontend project has no lint findings.
- Approved commit scope: this child and its repository handoff only; no push.
  Exact next action in a fresh invocation: scope DR-023c4 remaining mounted locale completeness.
- Still unverified: full tournament suite, dedicated SSR/hydration, exhaustive accessibility/screen-reader/contrast,
  live operational workflows and DR-051 partial-result/selection/post-write focus semantics.
