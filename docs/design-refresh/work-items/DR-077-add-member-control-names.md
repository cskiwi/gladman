---
title: 'DR-077: Mounted club add-member dialog control names'
description: 'Native localized names for the club team editor nested add-member dialog.'
---

## Identity and scope

- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- No parent or incomplete prerequisites; follows the discovery in [DR-029i](DR-029i-autocomplete-child-width.md).
- Started on existing `main`, 2026-11-27, with a clean worktree; no new branch or worktree.
- Project: `frontend-pages-club`; mounted route: `/clubs/smash-for-fun`, overview tab.
- [Club detail](../../../libs/frontend/pages/club/src/pages/detail/page-detail.component.html) renders
  ClubTeamsTab; its edit event calls `editTeam` and opens TeamEditComponent.
- [Nested dialog template](../../../libs/frontend/pages/club/src/components/team-edit/team-edit.component.html):
  Team bewerken opens the editor, then Lid toevoegen opens this dialog; confirmed in the live application.
- Preserve search, gender/existing-member filters, selection, REGULAR default, cancellation, permissions and mutations.
- Exclude outer editor styling/accessibility, other routes, shared components, theme/global styles, dependencies,
  operational mutations and complete workflow regression.

## Baseline and approach

- Baseline dark, 1571 x 1272: dialog 450 x 218.5px; player input 379.875px, dropdown 33.125px,
  membership combobox 376px. Player and close/dropdown have no accessible names; Type is announced as Basis.
- Use AutoComplete `inputId` with its visible label and `dropdownAriaLabel`; Select `inputId` and
  `ariaLabelledBy`; Dialog `closeAriaLabel`. Installed PrimeNG 22 types/rendering confirm these inputs.
- Reuse existing translated player/type/close text; no new translation keys or runtime logic.
- No smart/presentational extraction: one consumer and no genuinely repeated domain structure to centralize.
- Preserve all existing classes and styles; no new SCSS, inline styling, color utilities or pt/dt.
- Existing nested footer does not render in the baseline snapshot; do not claim its Save/Cancel verified.
  Investigate separately as DR-079 rather than expanding this naming slice.

## Implementation and acceptance

- [x] Confirm mounted consumer and bounded scope.
- [x] Localize player input/dropdown, membership Type and close names using native APIs.
- [x] Preserve native geometry in light/dark at 390px/1440px.
- [x] Verify keyboard dropdown/empty state/Escape, Type overlay and close/cancel without saving data.
- [x] Add focused rendered-control regression tests and run existing club lint/build/test targets.
- [x] Persist exact evidence, failures and next action.
- [x] Obtain user visual review with disclosed verification limits.
- [ ] Complete screen-reader/contrast, alternate locale, loading/error/success/permissions and SSR/hydration regression.

## Evidence and handoff

- PrimeNG generated AutoComplete/Select/Dialog accessibility docs consulted; batch docs call rejected its
  combined fields, corrected to individual calls. Installed types and Dialog template confirm `closeAriaLabel`.
- Existing navigation `InvalidStateError` and aborted GraphQL request observed before implementation.
- Changed scope: only nested-dialog attributes/label associations and two rendered regression tests.
  All classes, colors, wrappers, styles, services and mutation handlers remain unchanged.
- Before: unnamed player input/dropdown and close; membership announced as Basis without its Type label.
  After: combobox Speler, button Speler, combobox Type with Basis value, button Sluiten.
- Settled geometry matches before/after in both themes, viewport height 1000px:

| Metric                 | 390px       | 1440px      |
| ---------------------- | ----------- | ----------- |
| Dialog width / height  | 390/218.5px | 450/218.5px |
| Player input width     | 320.1875px  | 379.875px   |
| Player dropdown width  | 32.8125px   | 33.125px    |
| Membership field width | 316px       | 376px       |
| Close button width     | 35px        | 35px        |

- Four final settled keyboard cases pass: visible Speler label focuses its native input; Tab focuses the named
  dropdown; Enter opens Geen spelers gevonden; input Escape closes the body-appended popup.
  Type ArrowDown opens Basis/Reserve without selection; Escape closes it and retains Type focus.
  Named Sluiten Enter closes the nested dialog; outer Opslaan remains disabled and Annuleren closes the editor.
- No player, membership or captain selected; no real member/team save or other operational mutation performed.
- Inspected safe dialog-only light 390px and dark 1440px screenshots: native focused input, visible labels,
  close action and unchanged layout. No raw/private screenshot or browser log committed.
- Initial geometry probes captured entry scaling and are superseded, not passes.
  Animation `finished` probe aborted; transform-none wait timed out because the settled transform is an identity
  matrix; corrected final measurements use a 400ms settling wait and match the unscaled native widths.
  Initial immediate Escape/Space samples were premature/wrong key; final cases use ArrowDown and wait for
  `aria-expanded` plus popup visibility. Type popup is body-appended, not a descendant of the dialog.
- Browser returned to home `/`, dark, 1571 x 1272, no dialogs. Viewport override was initially null and is
  now explicitly set to its captured original dimensions. Auth reload/token timeout, aborted requests,
  navigation transition errors and NG0506 hydration warning observed; no clean-console or auth/SSR pass claimed.

### Validation

```powershell
npx nx show project frontend-pages-club --json
npx nx show project app --json
npx prettier --write libs\frontend\pages\club\src\components\team-edit\team-edit.component.html libs\frontend\pages\club\src\components\team-edit\team-edit.component.spec.ts docs\design-refresh\work-items\DR-077-add-member-control-names.md docs\design-refresh\backlog.md
npx nx run-many -t lint build -p frontend-pages-club --output-style=static
npx nx run frontend-pages-club:test --runInBand --runTestsByPath src\components\team-edit\team-edit.component.spec.ts
npx nx run frontend-pages-club:test --runInBand --runTestsByPath src\components\team-edit\team-edit.component.spec.ts --setupFilesAfterEnv=C:\Users\glenn\Documents\Code\cskiwi\gladman\libs\frontend\pages\tournament\src\test-setup.ts --output-style=static
git diff --check
```

- Club lint/build pass: 12 tasks, 10 cached; 37 lint warnings, zero errors.
- Default focused Jest fails before execution: missing `zone.js` in existing club setup (DR-059).
  Corrected invocation overrides setup with the existing tournament zoneless helper; two tests pass.
  No dependency/test infrastructure changes. Existing ts-jest metadata warnings remain.
- Tests verify actual native rendered label associations/button names, REGULAR default, native close cancellation,
  pristine team form and no mutation call, not just template string constants.
- Scoped Prettier write/check and `git diff --check` pass. Final scope is template, test, brief and backlog only.
  Backlog formatter also realigns its existing registry table; no unrelated status/content changes.
- Not run: full app build, full suites, screen-reader/touch/numeric contrast audit, alternative locales,
  search loading/error/results/selection, permission variants, real mutations and exhaustive SSR/hydration.

### Remaining actions

- Exceptions: none; legacy styles are preserved outside scope, not endorsed as a reusable pattern.
- DR-079 records the mounted nested footer's missing Save/Cancel actions, already absent at baseline.
  Its existing `pTemplate="footer"` needs a separate native template/API investigation and focused tests.
  No repair, data mutation or second implementation slice started.
- On 2026-11-27 the user selected `Approve DR-077 with documented limits and commit`.
  Resulting backlog status: Done by explicit approval of this slice with its disclosed limits.
  Full contrast/screen-reader/alternate-locale/state/permissions/search-results/real-save/SSR checks remain
  unchecked; approval does not turn them into passed checks. Existing DR-059 and DR-079 remain open.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 22 of 34 targets pass;
  twelve reproduce historical `@nx/dependency-checks` failures: `backend-seo`, `backend-health`,
  `backend-ranking`, `shared`, `backend-authorization`, `i18n`, `backend-translate`, `backend-search`,
  `utils`, `backend-database`, `frontend-modules-translation`, `backend-graphql`.
  No manifests, infrastructure or unrelated code changed to repair these existing failures.
- Approved commit scope: only nested template/test/brief/backlog on existing `main`, no push.
- Exact next invocation: separately scope DR-079 mounted add-member missing footer actions using fresh
  consumer/API evidence and a new brief; it is not started. DR-029 and inherited findings remain open.
