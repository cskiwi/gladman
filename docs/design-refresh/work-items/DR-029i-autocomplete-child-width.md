---
title: 'DR-029i: AutoComplete direct-child width retirement'
description: 'Verify current AutoComplete variants before retiring only the obsolete direct-child div width rule.'
---

## Identity and scope

- Parent: DR-029; prerequisite: approved [DR-029h](DR-029h-form-width-inventory.md).
- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Project: `app`; candidate: only `p-autoComplete > div { width: 100% }` in
  [global styles](../../../apps/app/src/styles.scss).
- Started on existing `main`, 2026-11-27, with a clean worktree; no new branch or worktree.
- Confirmed mounted baseline: home `/` renders the shell search AutoComplete with direct `INPUT` and `P-OVERLAY`
  children, 336px host width, and zero candidate-selector matches.
- Preserve the entire grouped form-width rule, all other styles, component templates, data, routes, permissions,
  localization, native options and behavior.
- Exclude global fluid migration, other cleanup, redesign of unused components, dependencies, operational mutations
  and final cross-route regression.

## Approach

- Inventory every tracked AutoComplete template and installed rendering branches, including multiple, loading,
  clear/dropdown icons and projected overlay content.
- Confirm real consumers; inspect safe mounted search and dropdown overlays without selecting or saving domain data.
- Compare light/dark at 390px/1440px before/after only if source and runtime evidence support retirement.
- No smart/presentational extraction: deleting a dead global selector introduces no repeated UI to extract.
- Utility usage remains unchanged; native PrimeNG and existing wrappers retain ownership of layout.

## Implementation and verification

- [x] Verify all tracked AutoComplete declarations and installed branch structure.
- [x] Verify mounted search/dropdown overlays and candidate matches.
- [x] Remove only the proven-unused direct-child width rule.
- [x] Compare bounded light/dark, narrow/wide geometry and keyboard overlay behavior.
- [x] Run focused existing Nx lint/build targets; record test availability.
- [x] Persist evidence, exclusions, failures and exact next action.
- [ ] Complete cross-route visual/contrast, screen-reader, locale, state/permission and SSR/hydration regression.
- [x] Obtain user review with disclosed verification limits.

## Evidence and handoff

### Source variants and retention boundary

- Tracked aggregation: eleven declarations in nine templates; no inline TypeScript declarations.
  No consumer enables multiple mode. Shell explicitly disables it; other declarations use the native false default.
- Installed AutoComplete renders direct single `input` or multiple `ul`; clear/loading templates live inside
  `span`, default icons are SVG, dropdown is `button`, and all popup/header/footer/item/empty/virtual-scroll
  content is nested under `p-overlay`. There is no `ng-content` root projection or direct-child `div`.
  Installed template evidence starts at `node_modules/primeng/fesm2022/primeng-autocomplete.mjs:1657`;
  overlay entry is at 1832 and footer at 1931. Multiple mode is source-inspected, not browser-enabled.
- Mounted shell search and club team-edit captain/add-member dialogs confirmed at `/clubs/smash-for-fun`.
  Captain includes a clear SVG; add-member renders `INPUT`, `BUTTON`, `P-OVERLAY`. Native popup content is
  appended to the body, not directly to AutoComplete. Every baseline case has zero candidate matches.
- Served CSSOM confirms the old rule and grouped rule both supply `width: 100%` before removal.
  Native multiple-list and dropdown-input sizing remain separate. Cross-origin font CSS is inaccessible
  (`SecurityError`); no all-stylesheet audit claim.
- Only the obsolete four-line rule is removed; grouped width styling and every component remain unchanged.
- A Node check compares current global styles against `git show HEAD:apps/app/src/styles.scss` with exactly
  that four-line block removed: pass. Compiled and served CSS contain no retired selector and retain the grouped rule.
- Utility/style comparison: zero template, class, color or component changes; four dead global SCSS lines removed.
  No styling exception or shared UI extraction. Native AutoComplete already owns every relevant rendering branch.

| Template / real consumer         | Declarations | Variants and source-mounted context                                                                |
| -------------------------------- | ------------ | -------------------------------------------------------------------------------------------------- |
| [Shell search][search]           | 1            | Single, no dropdown; item/header/empty templates; shell on all root routes.                        |
| [Survey import][import]          | 1            | Single, body overlay/responsive options; club builder opens the dialog; matching step conditional. |
| [Team edit][team-edit]           | 2            | Captain clear icon and add-member dropdown/item templates; club detail opens the dialog.           |
| [Club builder][builder]          | 1            | Single, fluid; permission-gated club detail team-builder tab.                                      |
| [Assembly searches][assembly]    | 2            | Fluid captain/add-player item templates; mounted assembly page renders this child.                 |
| [Assembly page][assembly-page]   | 1            | Fluid club search; root competition route mounts `/competition/assembly`.                          |
| [Ranking simulation][simulation] | 1            | Fluid item template in repeated simulation fields; player ranking route renders ListGames.         |
| [Manual enrollments][manual]     | 1            | Fluid/clear/force-selection item template in repeated fields; tournament admin enrollments tab.    |
| [Partner selection][partner]     | 1            | Fluid/dropdown/item template; tournament enroll page opens the dynamic dialog for doubles/mix.     |

- Counts are authored declarations, not expanded runtime fields. All nine have source-traced mounted callers;
  only shell, club captain and club add-member were runtime-exercised here. No unused component was redesigned
  or given a new consumer.
- Root routes mount club, player, competition and tournament. Club detail's overview tab emits team-edit events,
  its permission-gated builder opens survey import, player ranking renders ListGames, and tournament routes
  mount admin/enroll pages. Other forms/conditional states remain unchanged and are not claimed browser-verified.

### Browser comparison and keyboard checks

- Baseline uses native theme-button Enter activation with settled `.dark-theme`, viewport height 1000px,
  real search results without selection, and add-member dropdown Enter activation without saving.
  Search has fourteen options; dropdown shows the native empty state. Both Escape paths set `aria-expanded=false`.
  Initial scoped-overlay lookup timed out because the native popup is body-appended; corrected to the real popup.
  An immediate second Escape did not reliably close the nested dialog; corrected cleanup uses its native close
  button and outer Annuleren. These failed probes are not claimed as passes.
- After removal, the same four cases match every recorded x/width/height, option count, child structure and
  expanded/Escape state. Each has zero retired-selector matches and no page horizontal overflow.

| Metric, identical before/after in both themes | 390px        | 1440px              |
| --------------------------------------------- | ------------ | ------------------- |
| Header host/input width; height               | 347px; 33px  | 336px; 33px         |
| Header popup width; height                    | 347px; 233px | 346.390625px; 233px |
| Add-member host/popup width; host height      | 353px; 33px  | 413px; 33px         |
| Add-member input width                        | 320.1875px   | 379.875px           |
| Add-member empty popup height                 | 40px         | 40px                |
| Add-member dialog width                       | 390px        | 450px               |

- Header x is 14px narrow, 959.5px wide; dropdown x is 18.5px narrow, 513.5px wide.
  Popup widths are native content/min-width behavior, not required to equal the header width.
- Four final settled keyboard cases verify Tab returns to header input, localized host label remains present,
  ArrowDown assigns an existing active-option ID, Escape closes the popup and retains input focus.
  Baseline immediate active-ID samples varied during asynchronous results; they are not a four-case keyboard pass.
- Inspected actual search-control crops: dark wide and light narrow retain visible native focused borders.
  Immediate computed focus samples had no outline/shadow and were taken during border transitions;
  no numeric focus-contrast or complete four-case screenshot audit claimed.
- Add-member native dropdown Enter and input Escape pass before/after in all four cases.
  Its player combobox/dropdown and nested close button remain unnamed in snapshots: existing source has a plain
  label without `for`, no input ID/ARIA name and no dropdown ARIA label. Record separately as DR-077; do not
  fix this unrelated dialog or claim all accessible names pass.
- Native English option-list/status feedback remains under existing DR-037. Inherited DR-033/034/076 remain open.
- No result, captain, member, enrollment or other domain value selected/saved. No data/permission/storage/auth
  mutation, upload, generation, service start/stop or dependency changes.
- Restored original home `/`, dark theme and 1571 x 1272 viewport; search cleared and dialogs closed.
  Existing `InvalidStateError: Transition was aborted because of invalid state` and navigation-aborted GraphQL
  request remain; auth UI reloads during navigation. No clean-console/auth-lifecycle claim.
- A served-sheet lookup initially missed HMR's `styles.css?t=...` URL; corrected recursive CSSOM inspection
  confirms zero retired rules and the grouped `100%` rule. Cross-origin font error is retained, not suppressed.
- No private screenshot, raw browser log or domain data committed.

### Validation and exact next action

```powershell
npx nx show project app --json
npx prettier --write apps\app\src\styles.scss docs\design-refresh\work-items\DR-029i-autocomplete-child-width.md docs\design-refresh\backlog.md
npx nx run-many -t lint build -p app
git diff --check
```

- Nx discovery and focused app lint/build pass: 31 successful tasks including dependencies, 29 cached.
  App has no test target. No new test is warranted for a dead selector with no rendering/behavior change.
- Exact source-delta, compiled CSS and served CSSOM checks pass.
  Scoped Prettier write/check and `git diff --check` pass. Node validation via PowerShell here-string passes
  LF/frontmatter, 524 local link targets, Review/candidate/open-parent registry and exactly three scoped files.
  Git's future-CRLF warnings do not reflect the verified LF bytes. Final browser check confirms original home,
  dark, 1571 x 1272, Account restored, zero candidate matches and no dialogs.
- Not run: unit tests, full route/overlay/state/permission regression, real save/add/remove/import workflows,
  all theme screenshot/contrast checks, screen-reader/touch, locale switching and exhaustive SSR/hydration.
  Structural absence does not turn these unperformed checks into passes.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 22 of 34 targets pass;
  twelve reproduce the recorded historical `@nx/dependency-checks` failures:
  `backend-seo`, `backend-health`, `shared`, `backend-ranking`, `backend-authorization`, `i18n`,
  `backend-search`, `utils`, `backend-translate`, `backend-database`, `frontend-modules-translation`,
  `backend-graphql`. Existing dependency-version/unused-package/missing-peer findings remain unchanged;
  no manifests or unrelated code changed to repair them.
- On 2026-11-27 the user selected `Approve with documented limits and commit` and `Nothing else`.
  Resulting backlog status: Done by explicit approval of the implementation and disclosed limits.
  Unperformed broad accessibility/state/permission/locale/workflow/SSR checks remain unchecked; DR-077,
  inherited findings and workspace lint failures are not claimed resolved.
- Approval authorizes only global styles and this child/backlog handoff; commit on existing `main`, no push.
- Exact next invocation: separately scope DR-029j error/required/hint global-selector consumer inventory.
  Preserve those selectors until fresh consumer evidence supports a separate retirement; do not start it here.
- DR-029 remains open; existing workspace dependency-check failures and inherited final-regression limits remain.

[search]: ../../../libs/frontend/components/shell/src/components/search/search.component.html
[import]: ../../../libs/frontend/pages/club/src/components/team-builder/import-survey-dialog.component.html
[team-edit]: ../../../libs/frontend/pages/club/src/components/team-edit/team-edit.component.html
[builder]: ../../../libs/frontend/pages/club/src/pages/detail/tabs/club-team-builder-tab.component.html
[assembly]: ../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html
[assembly-page]: ../../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.component.html
[simulation]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/components/list-games/list-games.component.html
[manual]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.component.html
[partner]: ../../../libs/frontend/pages/tournament/src/pages/general-enrollment/components/partner-selection-dialog/partner-selection-dialog.component.html
