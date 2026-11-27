---
title: 'DR-080: Mounted club add-member pending and error feedback'
description: 'Prevent duplicate membership requests and provide native localized failure feedback.'
---

## Identity and scope

- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Dependency: approved, completed [DR-079](DR-079-add-member-footer.md).
- Started on existing `main`, 2026-11-27, with a clean worktree; no new branch/worktree.
- Project: `frontend-pages-club`; mounted route: `/clubs/smash-for-fun`, overview.
- [Club detail](../../../libs/frontend/pages/club/src/pages/detail/page-detail.component.html) renders ClubTeamsTab;
  its edit action opens TeamEditComponent. Fresh browser navigation and Team bewerken > Lid toevoegen
  confirm the nested native Dialog is mounted.
- Scope: [TeamEditComponent](../../../libs/frontend/pages/club/src/components/team-edit/team-edit.component.ts),
  its nested dialog template and existing focused tests.
- Preserve immediate membership persistence, request variables, selected membership type, local roster update,
  dirty team form on success, existing permissions, routes and translations.
- Exclude outer-editor redesign, shared/global styles, search redesign, dependencies, live mutations and other routes.
- User selected `Keep dialog open until the request finishes (recommended)`: disable nested fields, Cancel,
  close and Escape during a request. Guard dependent outer Save/Cancel actions against the same pending request.

## Baseline and approach

- Existing `addMember` has no pending gate and only logs errors. Missing result data is silently ignored.
- Fresh dark 1571 x 1272 baseline: nested Dialog 450 x 269px, enabled close/player/Cancel, disabled empty Save.
- Reuse existing `all.team.detail.roster.addError`, translated in English, Dutch and French,
  and the club roster's inline native Message pattern. No new translation keys.
- Use native Button loading/disabled, Dialog closable/closeOnEscape, field disabled and Message severity.
  Installed PrimeNG types and generated API validation confirm these native capabilities.
- One real dialog consumer with no repeated domain structure: no smart/presentational extraction or primitive wrapper.
- Keep existing layout utilities; no new colors, SCSS or equivalent inline styling.
- All browser mutation checks must be intercepted with synthetic results; never forward mutations to the server.

## Implementation and acceptance

- [x] Confirm current mounted consumer, prerequisite and bounded scope.
- [x] Gate duplicate requests and pending dismissal; show native loading and disabled controls.
- [x] Show localized inline failure, retain selection for retry and reject missing membership results.
- [x] Preserve successful request variables, roster update and dirty form without an outer team mutation.
- [x] Verify pending/failure/retry/cancel with focused rendered-control tests using synthetic operations.
- [x] Verify settled light/dark at 390px/1440px, keyboard and safe mocked browser states.
- [x] Run focused Nx lint/build/test and scoped formatter checks.
- [x] Persist evidence, exact results and remaining actions.
- [x] Obtain user review with disclosed verification limits.
- [ ] Full contrast/screen-reader, alternate-locale, permissions, real persistence and SSR/hydration regression.

## Evidence and handoff

- API validation: Dialog closable/closeOnEscape, Button loading/disabled and Message error severity all valid.
- Browser navigation reproduced existing transition `InvalidStateError` and an aborted GraphQL request.
  No clean-console/auth/SSR pass claimed.
- Known focused test setup limit: default club Jest requires missing `zone.js` (DR-059);
  use the existing tournament zoneless setup override without dependency changes.
- Changed scope: component/template/existing tests and this brief/backlog only.
  Native Save now uses Button loading; no new layout utilities, palette classes, styles, wrappers or translation keys.
  Existing outer-editor styling and existing nested player-item blue utility remain unchanged.
- Eight focused rendered-control tests pass: the four existing tests and four pending/failure cases.
  The new cases fail before implementation on enabled pending Save, absent error feedback and uncaught synchronous error.
  Network errors, missing membership data and synchronous Apollo errors all log and show localized feedback.
  Selection/type and pristine form survive failure; retry clears feedback and uses the original variables;
  successful response adds one membership and marks the form dirty without an outer mutation.
- The pending test verifies disabled native Save/Cancel/player/type, spinner, hidden close, prevented document Escape,
  duplicate-request guard and guarded nested/outer actions. Settled completion/reopen restores enabled controls.
  Initial test reopening raced the native hide lifecycle; corrected by waiting for the rendered close before reopening.
- Native Escape limitation: installed Dialog binds its document listener on opening and does not recheck
  `closeOnEscape`/`closable` inside that listener. Dynamic inputs alone failed a real browser Escape check.
  A pending-only capture-phase keyboard subscription prevents Escape before that stale listener,
  with `takeUntilDestroyed` cleanup. No private PrimeNG API or component styling workaround.
  Native idle Escape still closes the dialog; membership-overlay Escape closes only the overlay.
- First browser selection by accessible option name failed because the existing field exposes `[object Object]`.
  Corrected safe selection uses the visible synthetic item text, without changing the consumer or bypassing gates.
  This existing label issue is deferred separately as DR-081.
- Initial immediate post-click disabled samples were transient and are not accepted as settled evidence.
  A fresh atomic DOM matrix waits 1000ms after synthetic request interception and 500ms after Escape.
  All four light/dark 390px/1440px samples confirm disabled Save/Cancel/player/type, hidden close,
  one native spinner and an open pending dialog after Escape.
- Four synthetic failure/retry/success/reopen/keyboard-Cancel cases pass in those same viewport/theme combinations.
  Failure text is the existing Dutch translation; retry enables the outer Save and adds exactly one synthetic row;
  reopening clears feedback and disables empty Save. No outer team Save is submitted.
- Before/after geometry in both themes, viewport height 1000px:

| Metric              | 390px before / after  | 1440px before / after |
| ------------------- | --------------------- | --------------------- |
| Empty dialog width  | 390 / 390px           | 450 / 450px           |
| Empty dialog height | 269 / 269px           | 269 / 269px           |
| Player input width  | 320.1875 / 320.1875px | 379.875 / 379.875px   |
| Error dialog height | absent / 331px        | absent / 331px        |

- Native Message intentionally adds 62px height. Error and footer controls fit within the dialog in all four
  settled samples. Inspected safe nested-dialog-only dark-wide and light-narrow error screenshots;
  no private screenshot or raw browser log is committed.
- All synthetic mutations were fulfilled or aborted by route handlers; none was forwarded to the server.
  Completed success matrix: eight intercepted member requests, zero other mutation attempts.
  Completed settled pending matrix: four intercepted failures. Additional isolated/crop attempts also intercepted.
  Route handlers were removed in `finally`; full home navigation clears the synthetic Apollo cache.
- Browser restored to home `/`, dark, 1571 x 1272, zero dialogs. Original viewport override was null;
  restoration uses explicit dimensions matching the initial viewport. Authentication after reload is not a pass.

### Validation

```powershell
npx nx show project frontend-pages-club --json
npx prettier --write libs\frontend\pages\club\src\components\team-edit\team-edit.component.ts libs\frontend\pages\club\src\components\team-edit\team-edit.component.html libs\frontend\pages\club\src\components\team-edit\team-edit.component.spec.ts docs\design-refresh\work-items\DR-080-add-member-feedback.md docs\design-refresh\backlog.md
npx nx run frontend-pages-club:test --runInBand --runTestsByPath src\components\team-edit\team-edit.component.spec.ts --setupFilesAfterEnv=C:\Users\glenn\Documents\Code\cskiwi\gladman\libs\frontend\pages\tournament\src\test-setup.ts --output-style=static
npx nx run-many -t lint build -p frontend-pages-club --output-style=static
npx nx run frontend-pages-club:test --runInBand --runTestsByPath src\components\team-edit\team-edit.component.spec.ts --output-style=static
npx prettier --check libs\frontend\pages\club\src\components\team-edit\team-edit.component.ts libs\frontend\pages\club\src\components\team-edit\team-edit.component.html libs\frontend\pages\club\src\components\team-edit\team-edit.component.spec.ts docs\design-refresh\work-items\DR-080-add-member-feedback.md docs\design-refresh\backlog.md
git diff --check
```

- Final focused zoneless Jest: eight tests pass; existing ts-jest metadata warning remains.
- Final club lint/build: 12 tasks pass, 10 cached; 37 existing lint warnings, zero errors.
- Default focused Jest fails before test execution on missing `zone.js`, reproduced fresh (DR-059).
- Scoped formatter and whitespace checks pass.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 22 of 34 targets pass (cached).
  Twelve reproduce documented `@nx/dependency-checks` failures: `backend-seo`, `backend-health`, `shared`,
  `backend-ranking`, `backend-search`, `i18n`, `backend-authorization`, `backend-translate`, `utils`,
  `backend-database`, `frontend-modules-translation`, `backend-graphql`. No unrelated fixes or dependency changes.
- Not run: full app build/suites, complete contrast/screen-reader/touch audit,
  alternate-locale runtime, permission variants, live persistence, navigation during pending and SSR/hydration regression.

### Remaining actions

- Styling exceptions: none. Native Escape API limitation and bounded keyboard guard are documented above.
- On 2026-11-27 the user selected `Approve DR-080 with documented limits and commit`, and `Nothing else`.
  Resulting backlog status: Done by explicit approval with disclosed verification limits.
  Full contrast/screen-reader/locale/permissions/live-persistence/navigation-during-pending/SSR checks remain unchecked;
  approval does not claim unperformed checks passed. Default Jest and workspace lint limitations remain recorded.
- Approved commit scope: component/template/tests/brief/backlog only on existing `main`, no push.
- Exact next invocation: separately scope DR-081 mounted add-member player option/selection labels,
  using safe synthetic search data and fresh installed API checks. It is not started.
