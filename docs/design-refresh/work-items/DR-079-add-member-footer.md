---
title: 'DR-079: Mounted club add-member dialog footer'
description: 'Restore native footer projection without changing member or team persistence.'
---

## Identity and scope

- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Follows completed [DR-077](DR-077-add-member-control-names.md); no incomplete prerequisites.
- Started on existing `main`, 2026-11-27, with a clean worktree; no new branch or worktree.
- Project: `frontend-pages-club`; mounted route: `/clubs/smash-for-fun`, overview.
- [Club detail](../../../libs/frontend/pages/club/src/pages/detail/page-detail.component.html) renders
  ClubTeamsTab; `editTeam` opens TeamEditComponent. Fresh browser check: Team bewerken then Lid toevoegen
  mounts the nested Dialog, with no Save/Cancel footer.
- Scope: [nested footer](../../../libs/frontend/pages/club/src/components/team-edit/team-edit.component.html)
  native projection and safe action/gate tests in the existing component test file.
- Preserve player search/filter/selection, membership type, translations, permission gates, immediate member mutation,
  cancellation and outer team-save behavior.
- Exclude outer-editor redesign, shared/global styles, dependencies, live mutations and complete workflow regression.

## Baseline and approach

- Installed PrimeNG 22 Dialog queries `contentChild("footer", { descendants: false })`;
  generated docs use a direct `ng-template #footer`. Existing `pTemplate="footer"` is not queried.
- Replace only the footer declaration with native `#footer`; preserve buttons, handlers and their existing classes.
- No smart/presentational extraction: one mounted consumer and no repeated domain structure; a wrapper would
  obscure native projection. No new utilities, colors, styles or localization keys.
- Baseline dark at original 1571 x 1272: nested dialog 450 x 218.5px, named player/type/close controls,
  no footer actions. Four settled light/dark 390px/1440px samples also confirm zero footer elements.
- Native footer intentionally increases dialog height; player/type dimensions should remain unchanged.

## Implementation and acceptance

- [x] Confirm mounted consumer, root cause and bounded scope.
- [x] Restore native footer with existing localized Save/Cancel actions.
- [x] Verify rendered disabled/enabled Save and Cancel reset without live data mutations.
- [x] Verify mocked membership success preserves existing variables, local membership update and dirty team form.
- [x] Check native geometry, visible actions and keyboard cancellation in light/dark at 390px/1440px.
- [x] Run focused existing Nx lint/build/test targets and scoped formatting checks.
- [x] Persist exact evidence, results, exceptions and next action.
- [x] Obtain user visual review with disclosed verification limits.
- [ ] Full screen-reader/contrast, alternate-locale, search/results/error/permissions and SSR/hydration regression.

## Evidence and handoff

- Fresh browser route navigation reports existing transition `InvalidStateError` and aborted request.
- Initial attempt to switch theme through active modal correctly failed on its mask; corrected sampling closes both
  dialogs before using the native theme control. No forced click, gate bypass or styling workaround.
- Changed scope: one template declaration (`pTemplate="footer"` to `#footer`) and two new rendered-control tests
  alongside the two existing accessibility tests. No production TypeScript, handlers, wrappers or classes changed.
- Existing test fixture now supplies a synthetic team ID/name. Test-only model constructors are mocked to avoid
  importing shared backend ORM/GraphQL decorators; no test infrastructure or dependency changes.
- Before the production fix, both new tests fail specifically on missing native footer Save; the two original tests pass.
  After the fix all four pass. Tests exercise real native buttons: empty Save disabled/no mutation,
  selected-player Save enabled, Cancel discards selection without dirtying the form, reopen resets REGULAR/empty,
  and mocked Save sends the existing team/player/BACKUP variables and updates local membership/dirty state
  only when the mocked result arrives. No outer team mutation occurs.
- Settled geometry in both themes, viewport height 1000px:

| Metric                 | 390px before / after  | 1440px before / after |
| ---------------------- | --------------------- | --------------------- |
| Dialog width           | 390 / 390px           | 450 / 450px           |
| Dialog height          | 218.5 / 269px         | 218.5 / 269px         |
| Player input width     | 320.1875 / 320.1875px | 379.875 / 379.875px   |
| Membership field width | 316 / 316px           | 376 / 376px           |
| Native footer width    | absent / 388px        | absent / 448px        |
| Native footer height   | absent / 50.5px       | absent / 50.5px       |
| Cancel width           | absent / 91.734375px  | absent / 91.734375px  |
| Save width             | absent / 77.78125px   | absent / 77.78125px   |
| Button height          | absent / 33px         | absent / 33px         |

- Both footer buttons are within the dialog at all four viewport/theme combinations.
  Native footer spacing intentionally adds 50.5px height; fields keep their original widths/heights.
- All four safe keyboard cases pass: Type Tab reaches native Cancel; empty Save remains disabled;
  Cancel Enter closes the nested dialog; outer Save stays disabled; reopening resets empty player/Basis/disabled Save;
  player Escape closes the dialog, then outer Cancel closes the editor. Request observation records zero mutations.
- Inspected safe dialog-only dark-wide and light-narrow screenshots: both actions fit, names remain localized,
  focus is visible on Cancel. No private screenshots or raw browser logs committed.
- Initial post-fix sampling tried unscoped outer Cancel before nested exit animation completed and failed strict
  locator matching. Corrected final matrix scopes dialogs and waits for hidden state; no failed sample counted as a pass.
- Known test infrastructure limit: default club setup requires missing `zone.js` (DR-059);
  use the existing tournament zoneless setup override as in DR-077, without changing dependencies or infrastructure.
- Existing `addMember` has no pending-request gate and logs failures without user notification.
  Record separately as DR-080, not repaired or endorsed here; no live failure/repeated-save test.
- Browser restored to home `/`, dark, 1571 x 1272, with zero dialogs. Original viewport override was null;
  restoration uses explicit dimensions matching the original baseline. No clean-console/auth/SSR pass claimed.

### Validation

```powershell
npx nx show project frontend-pages-club --json
npx prettier --write libs\frontend\pages\club\src\components\team-edit\team-edit.component.html libs\frontend\pages\club\src\components\team-edit\team-edit.component.spec.ts docs\design-refresh\work-items\DR-079-add-member-footer.md docs\design-refresh\backlog.md
npx nx run-many -t lint build -p frontend-pages-club --output-style=static
npx nx run frontend-pages-club:test --runInBand --runTestsByPath src\components\team-edit\team-edit.component.spec.ts --setupFilesAfterEnv=C:\Users\glenn\Documents\Code\cskiwi\gladman\libs\frontend\pages\tournament\src\test-setup.ts --output-style=static
npx nx run frontend-pages-club:test --runInBand --runTestsByPath src\components\team-edit\team-edit.component.spec.ts --output-style=static
git diff --check
npx prettier --check libs\frontend\pages\club\src\components\team-edit\team-edit.component.html libs\frontend\pages\club\src\components\team-edit\team-edit.component.spec.ts docs\design-refresh\work-items\DR-079-add-member-footer.md docs\design-refresh\backlog.md
```

- Club lint/build pass: 12 tasks, 10 cached; 37 existing lint warnings and zero errors.
- Focused zoneless Jest: four tests pass. Initial constructor fixture import failed on backend GraphQL ESM;
  resolved with isolated test-only model mocks, then verified red/green footer tests. Existing ts-jest warnings remain.
- Default focused Jest fails before execution: missing `zone.js`, reproduced fresh (DR-059).
- Scoped Prettier write/check and `git diff --check` pass, including the final handoff.
- Not run: full app build/suites, full contrast/screen-reader/touch audit, alternate locales,
  populated live search/selection, errors/pending/repeated Save, permission variants, real persistence and SSR/hydration.

### Remaining actions

- Exceptions: none.
- On 2026-11-27 the user selected `Approve DR-079 with documented limits and commit`, then `Nothing else`.
  Resulting backlog status: Done by explicit approval with the disclosed limits.
  Full accessibility/contrast/locale/search/error/pending/permissions/live-persistence/SSR checks remain unchecked;
  approval is not evidence that an unperformed check passed.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 22 of 34 targets pass;
  twelve reproduce documented `@nx/dependency-checks` failures: `backend-health`, `backend-seo`, `shared`,
  `backend-ranking`, `backend-authorization`, `backend-translate`, `i18n`, `backend-search`, `utils`,
  `backend-database`, `frontend-modules-translation`, `backend-graphql`. No unrelated fixes or dependency changes.
- Approved commit scope: only template/test/brief/backlog on existing `main`, no push.
- Exact next invocation: separately scope DR-080 mounted add-member pending/error feedback with safe mocked operations;
  it is not started. DR-059 and inherited findings remain open; no second implementation slice.
