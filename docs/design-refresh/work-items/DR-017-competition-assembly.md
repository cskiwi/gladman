---
title: 'DR-017: Competition assembly'
description: 'Incremental refresh of the mounted competition assembly workflow.'
---

## Identity and scope

- ID: DR-017. Authoritative status: [backlog](../backlog.md).
- Design rules: [design refresh](../README.md).
- Confirmed consumer on 2026-10-30: `/competition/assembly` mounts
  [PageAssemblyComponent](../../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.component.ts)
  through the [competition routes](../../../libs/frontend/pages/competition/src/lib.routes.ts).
  The local browser displays the Dutch heading, season/club/team/encounter controls, and Download action.
- Project: `frontend-pages-competition`.
- Preserve URL restoration, team/encounter selection, lineup validation, player drag/drop, generator statistics,
  permissions, translations, and save/download contracts.
- Split this broad workflow into independently reviewable children; do not migrate everything together.

## Children and remaining scope

The initial 2026-10-31 parent audit is superseded by subsequent user evidence and feedback.
DR-017r is now a required presentation child: native change-team guidance Card and desktop/mobile
search Card parity. DR-017s separately defers the unconfirmed authenticated Save popup.
Parent completion requires DR-017r review and explicit acceptance of the preserved limits/Save deferral.

- [DR-017a: Page heading and filter chrome](DR-017a-assembly-page-chrome.md): the first implementation child.
- [DR-017b: Reusable player row](DR-017b-assembly-player-row.md): the existing presentational component mounted in
  the regular player pool and reused by backup, doubles, singles, and substitute lists.
- [DR-017c: Desktop player pool](DR-017c-assembly-player-pool.md): only the pool surface, availability controls,
  and backup disclosure, reusing the completed row unchanged.
- [DR-017d: Desktop doubles slots](DR-017d-assembly-doubles-slots.md): only the four mounted doubles containers
  and their statistics, preserving the completed rows and CDK behavior.
- [DR-017e: Desktop singles slots](DR-017e-assembly-singles-slots.md): only the four mounted singles containers
  and their statistics, preserving completed rows/pool/doubles and CDK behavior.
- [DR-017f: Desktop substitutes](DR-017f-assembly-substitutes.md): only the mounted substitutes container,
  preserving completed rows, CDK sorting and local forms.
- [DR-017g: Desktop generation controls](DR-017g-assembly-generation-controls.md): only the mounted generator
  surface, time-range/weeks controls and action presentation, preserving generation/service behavior.
- [DR-017h: Validation overview](DR-017h-assembly-validation-overview.md): the confirmed mounted validation
  summary and existing template reused in the confirmation dialog; exclude dialog chrome/actions and rules.
- [DR-017i: Partner combinations](DR-017i-assembly-partner-combinations.md): the confirmed mounted desktop statistics
  disclosure, responsive named controls and native table/percentage presentation; preserve services and mobile.
- Scope additional children only after confirming a real consumer not already covered by DR-017a-q.
- [DR-017j: Captain/add-player searches](DR-017j-assembly-player-searches.md): the two mounted responsive
  searches, reusing presentation across desktop/mobile without changing search services or lineup selectors.
- [DR-017k: Base/titular summaries](DR-017k-assembly-player-summaries.md): the two mounted information
  summaries, sharing one native presentation while preserving validation-derived rankings and exemptions.
- [DR-017l: Mobile singles](DR-017l-assembly-mobile-singles.md): only the four mounted mobile singles
  surfaces, with native named Cards. User feedback also authorizes full-name options/values across all
  mobile lineup selectors; doubles/substitute surfaces and semantics remain unchanged.
- [DR-017m: Mobile doubles](DR-017m-assembly-mobile-doubles.md): the four mounted doubles surfaces,
  sharing native Cards and a compact repeated Select template with distinct accessible names;
  preserve completed full-name presentation.
- [DR-017n: Mobile substitutes](DR-017n-assembly-mobile-substitutes.md): only the confirmed mounted
  append picker, named native Card/Select and existing full-name presentation; preserve lineup semantics.
  Selected-substitutes management is not added by this presentation slice.
- [DR-017o: Confirmation dialog](DR-017o-assembly-confirmation-dialog.md): only the confirmed mounted dialog
  chrome/actions, restoring native footer presentation while preserving validation and pending-action dispatch.
- [DR-017p: Loading feedback](DR-017p-assembly-loading-feedback.md): the naturally mounted native indeterminate
  ProgressBar, readable existing translated loading copy and an accessible association.
- [DR-017q: Load-error/unselected feedback](DR-017q-assembly-load-feedback.md): the mounted service stores query
  errors; native localized initial/error feedback and read-only retry are now explicitly approved.
  Retry restores error-button/result-region focus without stealing user-moved focus; loading/loaded priority
  and completed DR-017a-p presentation remain unchanged. DR-034 retains the native light error contrast failure;
  DR-039 records the pre-existing filter/service synchronization concern.
- [DR-017r: Change-team/search Card parity](DR-017r-assembly-search-card-parity.md): user-supplied mounted
  element evidence confirms the permission-only guidance; refresh its surface and use desktop Card
  presentation for mobile captain/add-player. Preserve the handlerless Edit contract.
- The page's authenticated Save popup is also absent on that route. Its model has a literal English
  `Save` label; DR-017s records this without changing save or permission contracts.
- Existing populated lineup emits NG01354 warnings about child controls not registering with the parent FormGroup.
  Investigate that functional concern separately before claiming lineup form regression coverage.
- Existing PDF download is still a logged request with an integration TODO, not document generation.
  Preserve that contract during visual work; scope functional completion separately.
- FloatLabel focused-label contrast outside this page is deferred to DR-031, not a hidden parent/theme change.
- Native unchecked Checkbox and secondary Button focus contrast is tracked as DR-032, including the desktop
  pool's remaining failures after removing scoped tokens at the user's request.
- Native Message text contrast is tracked as DR-034 after DR-017h's light severity/dark error measurements.
- Shared components, global theme and backend are not implicitly part of this parent.
  DR-017q's explicitly scoped translation assets/types are complete; other locale changes remain excluded.

## Acceptance and handoff

- [x] Confirm a mounted application consumer rather than an export or preview.
- [x] Scope the first child.
- [x] Complete and review DR-017a with explicit user approval and recorded verification limits.
- [x] Complete and review DR-017b with explicit user approval and recorded verification limits.
- [x] Complete and review DR-017c with explicit user approval and recorded native contrast/verification limits.
- [x] Complete and review DR-017d with explicit user approval and recorded verification limits.
- [x] Complete and review DR-017e with explicit user approval and recorded verification limits.
- [x] Complete and review DR-017f with explicit user approval and recorded verification limits.
- [x] Complete and review DR-017g with explicit user approval and recorded native accessibility/verification limits.
- [x] Complete and review DR-017h with explicit user approval and recorded native Message contrast/verification limits.
- [x] Complete and review DR-017i with explicit user approval and recorded native Fieldset/verification limits.
- [x] Complete and review DR-017j with explicit user approval and recorded native label/SSR/verification limits.
- [x] Complete and review DR-017k with explicit user approval and recorded native Tooltip/verification limits.
- [x] Complete and review DR-017l with explicit user approval and recorded verification limits.
- [x] Confirm remaining anonymous responsive surfaces and map them to completed children.
- [x] Reconcile later mounted change-team evidence and defer only the unconfirmed Save popup as DR-017s.
- [x] Review and approve DR-017m with its disclosed verification limits.
- [x] Review and approve DR-017n with its disclosed verification limits.
- [x] Review and approve DR-017o with its disclosed verification limits.
- [x] Review and approve DR-017p with explicit user approval and disclosed verification limits.
- [x] Review and approve DR-017q with its native contrast and disclosed verification limits.
- [x] Complete confirmed-consumer children DR-017a-q and record their approval limits.
- [x] Complete and approve required DR-017r change-team/search presentation corrections with disclosed limits.
- [ ] Approve parent completion with DR-017s deferral and child verification limits disclosed.
- [ ] Verify deferred authenticated Save presentation on a real authenticated consumer.
- [ ] Resolve recorded native contrast failures and perform actual screen-reader, alternate mounted locales,
      exhaustive hydration and authenticated/save workflow checks. Child approval did not establish these passes.

## Parent reconciliation evidence: 2026-10-31

This audit predates the user's mounted change-team evidence and requested mobile Card parity.
Its counts and anonymous gates remain valid; its proposed DR-017r deferral/parent closure no longer applies.
The current required next action is to complete/review DR-017r; Save is now DR-017s.

- `git --no-pager status --short` returned a clean worktree before this invocation.
- A read-only Node scan of `docs/design-refresh/work-items/DR-017[a-q]-*.md` finds exactly 17 briefs,
  each with checked review/approval evidence. The authoritative backlog records all 17 as Done.
  Previous results and user approvals are historical evidence, not checks rerun by this audit.
- The [competition routes](../../../libs/frontend/pages/competition/src/lib.routes.ts) still mount
  `PageAssemblyComponent` at `/competition/assembly`; its page template still mounts `app-assembly`,
  the reused validation dialog and Toast.
- Installed Playwright/Chrome consumer audit:
  PowerShell single-quoted here-string piped to `node -`, using
  `require('playwright').chromium.launch({ channel: 'chrome', headless: true })`.
  Four fresh contexts use 390/1440px by 900px and both actual `.dark-theme` class states.
  Each navigates the supplied real assembly URL with existing encounter/team/club/season query parameters.
  No fixture, permissions change, operational action, new route, package or persistent preference is used.
- The first matrix fails because visible SSR markup is not sufficient evidence of client loaded/mobile state.
  The corrected matrix uses `page.waitForFunction` to require the real Angular component's
  `dataService.loaded() === true`, expected `isMobile()` value and corresponding mounted content.
  No application fix or arbitrary success-shaped fallback is used.
- All four corrected cases pass: three information/validation headings and two search inputs are mounted;
  390px has 13 native lineup Selects across nine Cards and no desktop slots/partner table;
  1440px has nine desktop slot headings (four doubles, four singles, substitutes) and partner combinations,
  with no mobile lineup Selects. The assembly root fits the viewport in all four cases.
- `loggedIn()` and `hasEditPermission()` are false in all four cases; no Save popup is mounted.
  Source confirms the Edit button has no click handler and Save remains an English model label.
  These establish conditional wiring and anonymous exclusion, not global disuse or permitted verification.
- Final isolated cases report zero `pageerror` events and zero GraphQL mutation requests.
  Contexts/browser close in `finally`. The shared MCP browser remains on the supplied route with its original
  dark class and 1571x1221 viewport; no user-managed server or browser is stopped.

| Confirmed surface                                                 | Completed child coverage  |
| ----------------------------------------------------------------- | ------------------------- |
| Page heading, filters and action chrome                           | DR-017a                   |
| Presentational rows reused by pool/slots                          | DR-017b                   |
| Desktop pool, availability and backup disclosure                  | DR-017c                   |
| Desktop doubles, singles and substitutes                          | DR-017d, DR-017e, DR-017f |
| Desktop generation controls and partner combinations              | DR-017g, DR-017i          |
| Validation summary and shared dialog message content              | DR-017h                   |
| Responsive captain/add-player searches and base/titular summaries | DR-017j, DR-017k          |
| Mobile singles, doubles and substitutes                           | DR-017l, DR-017m, DR-017n |
| Confirmation dialog chrome/actions                                | DR-017o                   |
| Loading, initial and error/retry feedback                         | DR-017p, DR-017q          |

Existing row components and named templates already author repeated presentation once. A new smart/dumb split
would add indirection without an uncovered shared presentation requirement; no extraction is made.
Existing CDK animation/preview SCSS is retained, not declared obsolete or removed without drag/drop verification.

## Historical audit validation and next action

The following documentation-only audit results are retained as history. Current implementation validation
and exact next action are in the [DR-017r brief](DR-017r-assembly-search-card-parity.md).
Do not treat the old closure proposal below as current approval readiness.

- Changed scope: this brief and the backlog only. No application, tests, translations, styles or workflow files.
- Passed: the four read-only mounted consumer cases and the 17-child approval-presence scan described above.
- Passed: `npm exec -- prettier --write --end-of-line lf "docs\design-refresh\backlog.md"
"docs\design-refresh\work-items\DR-017-competition-assembly.md"` (one command).
- Passed: `git diff --check`; only this brief and backlog are modified.
  Git warns that a future checkout may replace LF with CRLF; both actual edited files contain LF only.
- Passed: read-only Node inline-relative-Markdown-link/LF scan checks 125 existing targets with
  `fs.existsSync`; none are missing and neither file contains carriage returns.
- Nx lint/build/tests: not run; documentation-only reconciliation does not require application tasks.
  DR-017q's 319 tests/lint/build and previous child checks remain historical, not rerun results.
- New visual/pixel review, quantitative contrast, keyboard interactions, actual screen-reader output,
  alternate mounted locales, operational save/edit/PDF and exhaustive SSR/hydration: not run.
  The final audit waits for client rendering but does not constitute exhaustive hydration validation.
- Native contrast follow-ups DR-031/032/033/034/035/038, mobile rule parity DR-036, empty copy DR-037,
  and filter/service mismatch DR-039 stay separate. Populated-form warnings and missing PDF integration
  remain recorded functional follow-up; no styling exception or global workaround is introduced.
- Exact next action: obtain parent approval of completed confirmed-consumer scope, DR-017r deferral and these
  preserved limits. Until then keep DR-017 in Review and do not commit.
  Approval must be recorded here before marking the parent Done with unchecked limits retained.
- After approval, next candidate: DR-019, confirm the supplied mounted tournament detail route and scope one
  reviewable child. Do not start that work in this invocation. A real permitted assembly session may separately
  unblock DR-017r; do not interpret parent closure as its implementation or verification.

## Current implementation handoff

DR-017r now refreshes the user-confirmed guidance Card and mobile search Card parity.
Seventy-four tests in five affected suites, focused lint (41 existing warnings, zero errors),
production library build/ten prerequisites and eight fresh responsive/theme browser checks pass.
Six scoped captain/mobile-add screenshots were inspected; Dutch loaded SSR/fresh client rendering pass.
The anonymous browser does not verify the post-change permitted guidance; component tests cover its real
permission computation and native presentation, not mounted permitted pixels/focus/contrast.
The user approved DR-017r completion/commit with disclosed verification limits on 2026-10-31.
Its [brief](DR-017r-assembly-search-card-parity.md) retains the unchecked limits; approval is not a claim
that permitted pixels/focus/contrast or other unperformed checks passed.
Post-approval lint passes all 34 projects with existing warnings and zero errors.
All required DR-017a-r children are Done; the parent is in Review, not implicitly Done.
Exact next action: reconcile parent closure with DR-017s Save deferral and preserved child limits,
then obtain separate parent approval. This child approval does not authorize parent closure or another UI slice.

## Historical child handoffs

The following child-stage next actions are historical and superseded by the current parent handoff above.

DR-017o refreshes only the mounted confirmation dialog chrome/actions and restores its previously unrendered
footer using PrimeNG's native named template. Reused validation content and pending-action methods are unchanged.
All 297 competition tests, focused lint/build, eight fresh theme/width modal cases, scoped interactions and Dutch
SSR pass. Native light Agree text/dark Cancel focus contrast failures remain DR-033; Message contrast remains DR-034.
Its brief records unchecked screen-reader, mounted-locale, authenticated/save and exhaustive hydration limits.
The user approved completion/commit with the disclosed native contrast failures and unchecked limits on 2026-10-31.
Approval is not evidence that failed or unperformed checks passed. DR-017o is Done; the parent remains open.
The 2026-10-31 remaining-surface reconciliation selects DR-017p's naturally mounted loading feedback only.
Load-error/unselected feedback remains DR-017q; the unconfirmed permission-only change-team block is deferred.
DR-017p adds readable localized polite status and a named native ProgressBar without changing service gates.
All 305 tests, focused lint/build, eight isolated responsive/theme cases and loaded SSR checks pass.
The status text passes contrast; unchanged native light value/track contrast is 2.97:1 and is retained in DR-038.
Actual screen-reader announcements, loading-state SSR, mounted alternate locales and authenticated/save checks
remain unverified. The user selected "Approve completion and commit with the disclosed verification limits"
on 2026-10-31. Approval accepts the native contrast failure and unchecked limits, not a claim they passed.
DR-017p is Done; the parent remains open.
The subsequent DR-017q implementation is now Done with explicit approval: 319 tests, focused lint/build, responsive state checks,
read-only retry/focus recovery and initial/loaded Dutch SSR pass. Native light error contrast remains DR-034.
The user approved completion/commit with disclosed limits on 2026-10-31; all 34 projects pass post-approval lint.
Exact next action in a fresh invocation: reconcile remaining confirmed consumers and parent scope.
Do not reopen completed DR-017a-q or begin another implementation slice here.

DR-017j refreshes only the mounted responsive captain/add-player searches. Two named templates keep each
presentation in one place; native labels, full-name option/value text and long-name wrapping are verified.
After user feedback, desktop captain has its own native Card above the player Card; add-player is within the
player Card below the unchanged list/disclosure. Mobile ordering is unchanged.
All 237 competition tests, focused lint/build and eight isolated Chrome theme/width cases pass.
Native focused FloatLabel light contrast still fails at 2.66:1, tracked in DR-031; screen-reader,
exhaustive focus/hydration, mounted English/French and authenticated/save checks remain unverified.
The final SSR recheck could not connect after port 3000 stopped responding; earlier pre-grouping SSR passed.
The user approved completion/commit with these disclosed limits on 2026-10-30, including the unperformed final
SSR recheck. Approval is not evidence that failed or unperformed checks passed. DR-017j is Done.
DR-017k now refreshes both mounted base/titular summaries through one native Card/list template.
All 247 competition tests, focused lint/build and eight mounted theme/width cases pass.
The user approved completion/commit with disclosed verification limits on 2026-10-30; DR-017k is Done.
Final Dutch SSR and fresh hydration now pass, resolving DR-017j's specific unavailable final grouping recheck.
Other disclosed verification limits remain unchanged; approval does not mean unperformed checks passed.
DR-017m refreshes only the mounted mobile doubles surfaces with named native Cards and a compact repeated
Select template. User feedback removes extra visible position labels; distinct accessible names remain.
All 278 competition tests, focused lint/build and ten theme/width browser cases pass after that correction.
The user explicitly approved completion/commit with disclosed verification limits on 2026-10-31; DR-017m is Done.
Quantitative focus/option contrast, screen-reader, exhaustive hydration, mounted English/French and
authenticated/save checks remain unchecked; approval does not establish that unperformed checks passed.
Keep the parent open; confirm/scope one mounted mobile substitutes surface next, not a second slice here.
DR-017l now refreshes only the mounted mobile singles selectors with native Cards and full-name fluid Selects.
After user feedback, all 13 mobile lineup selectors share full-name option/value presentation.
After correcting option adapters to retain native tracking IDs, all 267 competition tests and focused lint/build pass.
Six fresh mobile theme/width cases explicitly report zero duplicated-key warnings across all 13 selectors.
The earlier four desktop theme/width browser cases also pass.
Dutch SSR and fresh hydration pass; disclosed screen-reader/focus/locale/authenticated limits remain unchecked.
The user explicitly approved completion/commit with disclosed verification limits on 2026-10-31; DR-017l is Done.
Approval is not evidence that unperformed checks passed. Scope one mounted mobile doubles surface group next,
preserving completed full-name presentation and excluding DR-017a-l; do not start it in this invocation.
Keep DR-017 open until all required children are complete.

DR-017a is complete with explicit user approval on 2026-10-30 after a requested desktop time-range translation fix.
All 112 competition tests, repository-wide lint, app build, and the scoped browser checks pass.
Its unchecked verification limits remain recorded; approval does not establish that they passed.
The parent remains open until its required children are complete. No shared smart/presentational split is introduced
without evidence of meaningful repeated structure or behavior across real consumers.

DR-017h refreshes the mounted validation summary and existing template reused in the confirmation dialog.
Native error/warn/success Messages replace palette-colored text, while object tracking preserves repeated-code
diagnostics and refreshed interpolation. All 197 competition tests, focused lint/build and recorded browser
behavior checks pass. Native Message text fails AA in several severity/theme combinations; DR-034 records the audit.
The user approved completion/commit with those disclosed limits on 2026-10-30.
Approval is not evidence that failed or unperformed checks passed. DR-017h is Done; the parent remains open.

DR-017b refreshes the existing input-only player row for its five pool/slot call sites, without a new abstraction.
It is complete with explicit user approval on 2026-10-30 after removing host styling; see its brief for exact
evidence and unchecked limits. Approval is not evidence that unperformed checks passed.
Player-pool/slot containers and the other remaining surfaces are not implicitly complete.
The next pool child is now scoped as DR-017c with a confirmed mounted consumer.
DR-017c implements the native desktop player-pool Card, named controls, and keyboard disclosure without
`[dt]`, `[pt]`, or authored host classes, as requested in user review.
Focused tests/lint/build and browser behavior pass; native unchecked-border and dark disclosure-focus contrast
failures remain disclosed and unchecked. The user approved completion/commit with those native contrast and
verification limits on 2026-10-30; approval does not establish that failed or unperformed checks passed.
DR-017d implements native Cards and accessible success/danger statistic Tags for the desktop doubles loop only.
User review requested restoring the existing win-rate color signal; the native-Tag correction is reverified.
All 153 competition tests, focused lint/build and browser checks pass; exact evidence and unchecked verification
limits are recorded in its brief. The user approved completion/commit with those limits on 2026-10-30;
approval does not establish that unperformed checks passed.
DR-017e is now scoped after confirming all four mounted singles slots in isolated Chrome on 2026-10-30.
It refreshes only the singles loop with native Cards and accessible native Tags. All 165 competition tests,
focused lint/build and the recorded responsive/theme/browser checks pass. Its brief preserves exact evidence
and unchecked screen-reader, hydration, mounted-locale, authenticated/save and quantitative focus-ring limits.
The user approved completion/commit with those disclosed limits on 2026-10-30. Approval is not evidence that
unperformed checks passed. DR-017e is Done; no further production changes follow approval.
The historical next action to scope substitutes is fulfilled by DR-017f, confirmed mounted on 2026-10-30.
DR-017f implements the native substitutes Card, localized heading and explicit empty state, preserving
CDK sorting/drop contracts and completed rows. All 175 competition tests, focused lint/build and the recorded
browser checks pass. Its brief preserves exact evidence and unchecked verification limits.
The user approved completion/commit with its disclosed verification limits on 2026-10-30.
Approval is not evidence that unperformed checks passed. DR-017f is Done; no further production changes follow approval.
Post-approval repository-wide lint passes across all 34 projects with existing warnings, no errors.
The historical next action to scope generation controls is fulfilled by DR-017g, confirmed mounted on 2026-10-30.
DR-017g implements only the native generation-controls Card, fluid controls and hover/focus Tooltips.
The user's review correction replaces the four deprecated component Buttons with native `button[pButton]`,
direct translated text, hidden icons and child-spinner/native-disabled loading, without changing adjacent controls.
All 186 competition tests, focused lint/build and recorded browser behavior checks pass.
Preserved native light-mode Button text/focus and focused-label contrast failures remain disclosed;
DR-031 and DR-033 track the separate audits. Screen-reader/Tooltip association and other unchecked limits
remain in its brief. The user approved completion/commit with those disclosed limits on 2026-10-30.
Approval is not evidence that failed or unperformed checks passed. DR-017g is Done; no production changes follow.
The historical next action to scope validation presentation is fulfilled by DR-017h.
The historical next action to scope partner combinations is fulfilled by DR-017i.
DR-017i refreshes only the mounted desktop partner-combinations disclosure and controls.
All 215 competition tests, focused lint/build and recorded responsive/interaction checks pass.
Native Fieldset re-expansion removes Select/header tab stops; DR-035 records the separate dependency-level audit.
Full keyboard/focus, screen-reader, mounted-locale, authenticated/save and exhaustive hydration checks remain open.
The user approved completion/commit with those disclosed limits on 2026-10-30.
Approval is not evidence that failed or unperformed checks passed. DR-017i is Done; the parent remains open.
Exact next action in a fresh invocation: confirm/scope remaining mounted captain/add-player controls,
excluding completed DR-017a-i. Do not start another child here.
Do not reopen completed children. The parent remains open.
