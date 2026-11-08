---
title: 'DR-023b4: Manual enrollment dialog and creation'
description: 'Native administration dialog with functional member and guest enrollment.'
---

## Identity

- ID: DR-023b4; parents DR-023b and DR-023 remain open.
- Authoritative status: [backlog](../backlog.md).
- Dependencies: approved DR-023b1/b2/b3 and confirmed DR-023b consumer.
- Design rules: [rollout](../README.md).

## Scope

- Mounted route: `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=enrollments`.
- Projects: frontend-pages-tournament, backend-graphql, backend-translate.
- Sources: [tab][tab], [template][template], [service][service], [resolver][resolver].
- User chose functional manual enrollment with the dialog refresh on 2026-11-08.
- Add real player/partner selection, guest validation, explicit errors and successful list refresh.
- Authorize enrolling another player with the same tournament/club permissions as administration.
- Reuse existing enrollment rules; do not bypass phase, dates, guest policy or capacity.
- Exclude other tabs, summary/filter/table styling, existing operational handlers, shared theme/components,
  dependencies, database migrations and operational mutations for visual testing.

## Baseline and proposed approach

- Worktree clean at start; actual authorized enrollment child and Add dialog are mounted.
- Dutch dialog has no title, blank player/guest labels and no footer actions.
- Submission logs personal form data and closes without a mutation; guest fields have no validation.
- Fixed inline width, hand-positioned search icons, palette asterisks and obsolete textarea directive.
- Native Dialog, AutoComplete, Checkbox, InputText, Textarea, Message and Button with semantic layout.
- Keep the existing smart tab/service split; one dialog consumer does not justify a presentation wrapper.
- Existing partner dialog's searchPartners operation is absent from the backend.
  Initial generic players query loses nested name conditions; use the scoped manualEnrollmentPlayers query.
- Fill only dialog-specific locale copy; DR-023b5 retains remaining locale completeness.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and user-approved functional scope.
- [x] Implement authorized creation using existing enrollment rules.
- [x] Refresh dialog, real selections, conditional validation and explicit feedback.
- [x] Add focused backend/frontend regressions and locale checks.
- [x] Format, validate and persist evidence/handoff.

## Acceptance and verification

- [x] Member/guest inputs produce correct mocked mutations; failures retain the dialog and values.
- [x] No text-only player identity, self-partner or hidden singles partner is submitted.
- [x] Permission, missing entities, phase/date/capacity and duplicate-member rules remain enforced in tests.
- [x] Guest name/email and notes limits are validated.
- [x] Searches show explicit empty/error states and cannot apply stale responses.
- [x] Light/dark 390/1440px dialog and fresh search overlays fit.
- [x] Keyboard selection, named labels, dismiss and return focus verified.
- [x] Sampled heading/label/description/Cancel text contrast passes.
- [ ] Native error Message text meets 4.5:1; fails both themes under existing DR-034.
- [x] No new SCSS, inline styles, palettes, dependencies or shared styling.
- [x] Focused Nx lint/build/test pass.
- [ ] Live operational creation, screen-reader, exhaustive accessibility and SSR/hydration verified.
- [ ] User review or explicit approval with disclosed limits.

## Evidence and handoff

- Initial integrated navigation timed out waiting for load, but the page subsequently rendered.
- Selecting Inschrijvingen confirms one mounted child; Add opens the actual native dialog.
- At 390px its baseline width is 390px; blank title/labels/footer are observed in the live Dutch browser.
- No operational mutations have been performed. Creation is tested with mocks, not live enrollment writes.
- Implementation: native fluid AutoComplete controls select member identities, not arbitrary name strings.
  One shared field loop serves player and partner within this one-consumer dialog; no new wrapper component.
  Native guest Checkbox respects policy; guest name/email are required with 255-character limits.
  Notes retain 1000-character maximum. Singles omit hidden partner IDs; self-partnering is rejected.
- adminEnrollPlayer requires the same global/scoped tournament/club permissions as administration.
  It resolves the selected player, then delegates to the existing member enrollment method.
  Phase/date/duplicate/capacity/waiting-list and partner-matching behavior is not rewritten.
  Existing enrollGuest API/policy is reused unchanged; no administrator policy bypass.
- Creation errors/missing response data retain inputs and dialog; success refreshes the current table query.
  Pending creation disables reactive controls, duplicate submit and dismissal.
  Native form submission works through the actual submit Button inside the form.
  Supported closeAriaLabel names Close; onHide returns focus to the confirmed mounted Add action.
- Search uses a bounded authenticated query with parameterized ILIKE predicates for every whitespace-separated word.
  Each word can match first name, last name or member ID; order is irrelevant.
  Wildcards are escaped; maximum input is 100 characters, maximum results 20 with stable name/ID ordering.
  Query failures and missing response data are explicit; obsolete responses after typing/closing are ignored.
- Live generic-query verification initially returned unrelated first-name matches for reversed names.
  queryFixer.ts merges AND branches using only the first OR member, overwriting earlier conditions.
  This shared converter is unchanged; DR-050 records separate investigation.
- Live authenticated dialog searches now verify surname-only, both name orders, member ID and zero-result cases.
  All supplied examples return the expected people, with HTTP 200 and no query errors.
  A separate cookie-only fetch was rejected by the authenticated guard; final evidence uses the real Apollo UI.
- User restarted the API after its old runtime retained the previous schema despite a successful rebuild.
  Read-only introspection confirms manualEnrollmentPlayers is exposed before final live search checks.
- Dialog-specific Dutch/French blanks are filled; existing English help is clarified.
  Generated [translation types][translation-types] contain the three new keys and are included in this slice.
  DR-023b5 retains non-dialog localization; other dictionaries and application copy remain untouched.
- Scoped static class/styleClass tokens fall from 83 to 32; one inline style and two palette tokens become zero.
  No stylesheet, global preset, dependencies or other tab changes.
- Four guest fixture checks: light/dark at 390/1440px preserve labels/valid submit, no local/document overflow.
  Narrow native dialog width is 390px; desktop width 448px. Guest fields/actions stack at narrow widths.
  The recorded real tournament disallows guests; these checks intercept only its browser query response to
  enable the guest branch temporarily, without changing server policy, phase or permissions.
- Four doubles-member checks: both themes/widths show player/partner and fresh native search overlays fit.
  Overlay widths are 353px narrow and 411px desktop. Resize of an already-open native overlay retains its old
  coordinates; final evidence opens/searches after resizing, not a claim of live-resize repositioning.
- Keyboard ArrowDown/Enter selects real player and partner results. Native Cancel hides the dialog;
  explicit return-focus correction is verified in the browser and a regression test.
  Empty-result feedback is meaningful. Injected safe search errors render in both themes and recover on retry.
- Sampled contrast: description/Cancel 4.87:1 light and 6.65:1 dark; label/title 19.87:1 and 16:1.
  Native error Message text fails 4.44:1 light and 4.40:1 dark, retained under DR-034 without page overrides.
  Full Checkbox/Button borders, focus contrast and exhaustive screen-reader/accessibility remain unverified.
- Safe dark narrow guest screenshot reviewed; no personal-data screenshots/logs are committed.
- Validation:

  ```powershell
  $env:NX_DAEMON='false'
  npx nx run-many --projects=frontend-pages-tournament,backend-graphql,backend-translate --targets=lint,test,build --output-style=static --parallel=2
  npx nx run app:build:development --output-style=static
  npx nx run api:build:development --output-style=static
  ```

  Final scoped lint/build/test passes: tournament 17 suites / 245 tests; backend 1 suite / 25 tests.
  Translation target has no tests and exits successfully, not a claimed translation test suite.
  Existing lint/ts-jest warnings remain. App browser/SSR build and API development build pass.
  Three-locale asset-backed dialog tests and focused mutation/search/form regressions pass.
  Initial unsupported PrimeNG inputs, a query-read typing error and misplaced test block were corrected.
  Earlier Nx test discovery stalled; only tool-owned attempts were stopped, then the final Nx runs passed.
  App build does not establish live SSR/hydration or operational enrollment correctness.

- Existing other-tab Schedule/Check-in queries emit HTTP 400 on this administration route;
  excluded operational tabs remain unchanged and are not claimed clean-console.
- Temporary browser query/error interceptors are removed and normal routing restored before handoff.
- User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-08.
  Approval covers this implementation/tests, scoped locale/generated types and repository handoff only.
  Native error-contrast, live-operation and exhaustive accessibility/hydration limits stay unchecked.
  Acceptance is not a claim that those unperformed/failed checks passed.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 workspace lint targets
  with existing warnings. No application sources changed after the final successful focused checks.
- Authoritative backlog marks this approved slice Done; both parents remain open.
  Commit only the approved slice/handoff; no push.
- Exact next action: scope DR-023b5 remaining enrollment locale completeness on the confirmed consumer.
  Dialog copy is already complete; do not begin another slice in this invocation.

[tab]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.component.ts
[template]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.component.html
[service]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.service.ts
[resolver]: ../../../libs/backend/graphql/src/resolvers/event/tournament/tournament-enrollment.resolver.ts
[translation-types]: ../../../libs/utils/i18n/src/lib/i18n.generated.ts
