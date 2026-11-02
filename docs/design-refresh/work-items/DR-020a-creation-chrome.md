---
title: 'DR-020a: Tournament creation chrome'
description: 'Native creation chrome, form Card and action buttons without changing form semantics.'
---

## Identity

- Parent: [DR-020](DR-020-tournament-forms.md). Dependencies: none.
- Status: [backlog](../backlog.md). Rules: [design refresh](../README.md).
- Project: `frontend-pages-tournament`.

## Scope and baseline

- Mounted route: `/tournament/create?clubId=cb0cfc70-d93c-4e81-92e6-07b5724d40b0`.
- Real consumer: club detail tournaments tab invokes creation with its club identifier.
- [Template](../../../libs/frontend/pages/tournament/src/pages/create/page-create.component.html),
  [component](../../../libs/frontend/pages/tournament/src/pages/create/page-create.component.ts),
  [service](../../../libs/frontend/pages/tournament/src/pages/create/page-create.service.ts).
- Baseline: uppercase decorative club eyebrow, oversized heading, custom skeleton surface and inline-colored
  read-error/no-club banners. The no-club fallback eyebrow is untranslated English.
- Replace heading/read-state chrome with semantic heading/context, native Card and native Message severities.
- User feedback on 2026-11-02 explicitly extends this slice to the loaded form's outer surface: use native `p-card`,
  not a styled `div`. The controls and form behavior remain excluded and unchanged.
- Follow-up feedback restores port 3000 and requests modern button syntax. Extend the slice to its two native
  `button[pButton]` actions, projected `pButtonLabel`, and a decorative busy spinner with native disabled/aria-busy.
  Keep cancel routing, submit handler, invalid/busy gating, labels and mutation semantics unchanged.
- Exclude fields, validation, mutation feedback, submit/cancel logic, date overlays, editing, admin, shared components,
  theme, assets and backend. Preserve existing controls and form behavior.
- No wrapper extraction: this scope has no repeated domain structure warranting another component.

## Implementation

- [x] Confirm real application consumer and independently reviewable scope.
- [x] Simplify heading and read feedback with native PrimeNG.
- [x] Preserve club loading/errors and existing form behavior.
- [x] Record utility comparison, checks, discoveries and remaining actions.

## Acceptance and verification

- [x] One localized h1, wrapping club context, no decorative English fallback.
- [x] Loading uses native Card/Skeleton; missing club uses info Message; read failure uses error Message.
- [x] Loaded form uses native Card, without a manually styled replacement surface (routed component tests).
- [x] Post-correction mounted visual verification of the loaded form Card.
- [x] Native action buttons, busy/invalid states and existing click/submit contracts.
- [x] No new colors, numbered palette utilities, SCSS, token overrides or styling substitutes.
- [x] Light/dark at narrow/wide widths: scoped fit and unchanged form visibility.
- [x] Heading/context and info text contrast pass in both themes.
- [ ] Native error text contrast passes in both themes: light fails at 4.41:1; dark passes at 4.64:1.
- [x] Normal Tab movement, Escape dismissal and native `role="alert"` feedback semantics.
- [ ] Exhaustive keyboard/focus, contrast of excluded controls and actual screen-reader output.
- [x] Read-state fixtures are explicitly distinguished from operational failures.
- [x] Existing relevant Nx lint/test/build pass.
- [x] Dutch SSR/client heading/context preserved; broader locale/hydration limits disclosed.
- [x] User approved the corrected slice with the disclosed verification limits on 2026-11-02.

## Evidence and handoff

- Baseline isolated Chrome mounted the real club/form on 2026-11-02; no mutation submitted.
- Playwright MCP could not acquire its occupied browser profile. Use independently launched installed Chrome;
  do not close or terminate another user's browser.
- Added seven routed component regressions for heading/context, short-name fallback, missing club, pending-to-loaded
  Card/Skeleton, mapped failure and native button click/submit/busy contracts. No tests invoke mutations.
- Installed PrimeNG's Button type marks `p-button` deprecated; directive `loading` is deprecated too.
  The documented loading example uses a child spinner and native disabled. Both actions now use `button[pButton]`
  with projected translated `pButtonLabel`; submit has a decorative PrimeIcons spinner, disabled and aria-busy.
  Cancel keeps `type="button"`/its existing handler; submit keeps `type="submit"`/the form's existing ngSubmit.
- A tightly coupled service repair guards `resource.value()` when `resource.error()` is present. Previously the
  heading's club read could throw before rendering the existing error branch. Query, mapping and mutations stay intact.
- Scoped class-token comparison (header through immediately before `<form>`, including the form wrapper):
  44 to 10 after the user-requested native form Card correction; two read-feedback inline style attributes removed.
  Remaining form colors are excluded DR-020b work.
- Initial context `text-muted-color` measured 4.46:1 in light mode. Normal semantic `text-color` now gives
  18.20:1 light / 16.64:1 dark for both context and heading, without a styling override.
- Native info Message text: 4.75:1 light / 4.59:1 dark. Native error Message text: 4.41:1 light (fails 4.5:1) /
  4.64:1 dark (passes). Alpha backgrounds are composited over ancestor surfaces before calculating contrast.
  DR-034 retains the shared native error contrast audit; no exception or override added.
- `npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static`:
  final run passes lint, 60 tests in three suites, production library build and ten prerequisite tasks.
  Existing lint/compiler/deprecation warnings remain. The initial test run failed because the new test expected
  Message's alert role on a child rather than its host, and waited for stability on an intentionally pending read;
  corrected tests pass without timeout increases.
- `npx prettier --write` was run on all seven changed/new files. `git diff --check` passes;
  Git emits existing line-ending configuration warnings. Files remain LF.
- Isolated installed Chrome checks eight settled cases: light/dark at 360/390/768/1440px.
  Real club data, one translated heading, context, form visibility, normal Tab movement and Escape pass.
  The final loaded form is inside native Card/body, with zero `p-button` elements and two projected native labels.
  Invalid submit is disabled; a safe local name enables it; browser-local creating state shows a spinner and
  disables submit. No actual submit or cancel navigation is performed.
  Scoped regions and the settled document fit all widths. An initial un-settled 360px overflow observation disappears
  after deferred controls/transitions settle; it is not recorded as an application defect.
- All eight cases also check no-club, pending and read-error states with native feedback semantics and fit.
  Pending/error use browser-local intercepted `ClubForTournament` reads reached by client navigation from no-club;
  these are fixtures, not real outage or permission verification. SSR transfer caching made full-reload interception
  unsuitable. No page errors or GraphQL mutations occurred.
- A separate real HTTP GET returns 200 with Dutch heading and club context matching the client.
- Before captures: light/dark 390/1440px. After captures: eight theme/width cases and their three read states.
  Safe local evidence is named `DR-020a-before-*`, `DR-020a-after-*`, `DR-020a-info-*`, `DR-020a-loading-*`,
  `DR-020a-error-*` and `DR-020a-browser-results.json` in this session's files directory.
  The repository-backed observations above are the durable evidence; future work must not depend on session files.
- Visual inspection of final light 390px, dark 1440px and dark error 390px captures confirms the bounded chrome.
  Earlier captures taken during overlay/theme transitions are superseded.
- The user selected "Approve DR-020a and commit with disclosed verification limits" on 2026-11-02,
  then requested the loaded form Card correction before committing. Approval does not claim unchecked checks passed.
  The correction is implemented without changing the controls or form bindings.
  Post-correction `npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static`
  passes all 60 tests, focused lint, production library build and ten prerequisites.
  Tests explicitly assert the form is under native Card/body, including pending-to-loaded recovery.
  A mismatched closing tag was caught by formatting during the correction, fixed before the passing validation.
  No commit has been created.
- Final repository-wide `npx nx run-many --target=lint --output-style=static` passed all 34 projects,
  with existing warnings and zero errors, after the form Card and native button corrections.
- Port 3000 briefly stopped responding; both Chrome and an independent HTTP probe failed. The user restored it.
  A first immediate retry saw the stale button bundle while rebuilding; the completed retry verifies the final
  Card and native button markup in all eight cases, read fixtures and Dutch SSR. No connectivity blocker remains.
  Final captures and results replace the earlier evidence files; results are now written only after a passing run.
- Not run: actual screen-reader output, exhaustive focus/hover/hydration, mounted English/French,
  authenticated/create/cancel workflows, real outage/retry and date-picker behavior/contrast.
  Existing untranslated service-error strings and excluded form colors are not changed by this slice.
- Exceptions: none.
- The user selected "Approve corrected DR-020a and commit with disclosed limits" on 2026-11-02.
  Only this slice, its tests and repository handoff are approved for commit; no push.
  Acceptance preserves the unchecked contrast/workflow checks and is not evidence that they passed.
- Next action in a fresh invocation: scope DR-020b creation fields and mutation feedback,
  preserving the completed native Card/action markup. Keep DR-020 open; DR-020b is the next candidate,
  not an implementation started in this invocation.
