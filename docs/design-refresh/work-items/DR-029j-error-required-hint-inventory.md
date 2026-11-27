---
title: 'DR-029j: Global error, required and hint selector inventory'
description: 'Inventory three global form-feedback selectors before any separately approved retirement.'
---

## Identity and scope

- Parent: DR-029; prerequisite: approved [DR-029i](DR-029i-autocomplete-child-width.md).
- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Started on existing `main`, 2026-11-27, with a clean worktree; no new branch or worktree.
- Documentation-only investigation of `.error-text`, `label.required::after` and `small.hint` in
  [global styles](../../../apps/app/src/styles.scss).
- Mounted baseline: home `/` renders the shell and ranking reference using the imported global stylesheet.
- Preserve every application rule, component, native PrimeNG option, route, translation and behavior.
- Exclude selector retirement, generic `small` styling, grouped widths, other cleanup, unused-component redesign,
  dependencies, operational mutations and final regression.

## Approach

- Inventory exact tracked definitions and direct/dynamic class readers; distinguish validation properties from CSS classes.
- Inspect mounted DOM and served stylesheet rules using safe read-only checks.
- Record native PrimeNG alternatives as future options, not authorization to migrate consumers.
- No smart/presentational extraction: a selector inventory introduces no shared UI to style.
- Template utility usage and application styling remain unchanged.

## Acceptance and verification

- [x] Confirm tracked definitions and potential direct/dynamic consumers.
- [x] Confirm the stylesheet is mounted and inspect bounded runtime matches.
- [x] Record retention/retirement boundaries and native feedback alternatives.
- [x] Preserve application files and document exclusions and unperformed checks.
- [x] Format and validate the scoped documents and local links.
- [x] Obtain review with disclosed verification limits.
- [ ] Complete cross-route state, accessibility, locale and SSR/hydration regression.

## Evidence and handoff

### Source inventory and boundaries

- Exact `git grep` over tracked non-documentation/non-workflow files finds only three definitions, all in
  [global styles](../../../apps/app/src/styles.scss): `.error-text` at 56, `label.required::after` at 61,
  and `small.hint` at 68. No exact class reader or additional selector definition.
- Aggregation of 1,309 tracked HTML/TS/JS/MJS/SCSS/CSS/JSON files, excluding docs, workflow files and the lockfile,
  reproduces these definitions. Required-class assignment/binding candidates and simple split error-class string
  candidates are empty. Hint occurrences outside translations/generated types/tests are only the global definition
  and competition editor IDs, ARIA references and translation keys; none assigns a `hint` class.
- The initial combined exploratory shell search ended with exit -1 after limiting unrelated error/text matches.
  It is not a successful exhaustive search claim; the subsequent bounded Node aggregation exits 0.
- HTML `required`, reactive `hasError('required')`, translation `.required` keys and `-hint` IDs are not CSS classes.
  No matching static class, Angular class binding, `ngClass` or discovered runtime class assignment.
  Arbitrarily computed/external markup is not exhaustively proven absent by literal/pattern searches.
- All three specific selectors are candidates for a separately scoped retirement, not removed here.
  The error and asterisk rules use the palette token `--p-red-500`; the hint rule uses semantic muted text at 12px.
  Do not replace these unused rules with a new semantic wrapper or add a consumer to demonstrate them.
- Preserve generic `small { font-size: small; color: var(--p-text-muted-color) }`.
  Twenty authored `small` declarations in ten tracked templates establish a different retention boundary;
  counts include conditional/deferred contexts, not twenty confirmed runtime nodes.
  The competition editor's two dates and two settings hints are source-mounted; settings hints are runtime-confirmed.
  Other `small` consumers remain unchanged; their full runtime/cascade audit is outside this slice.

| Specific selector       | Tracked definitions | Tracked class consumers | Bounded mounted matches | Decision                      |
| ----------------------- | ------------------- | ----------------------- | ----------------------- | ----------------------------- |
| `.error-text`           | 1                   | 0                       | 0                       | Separate retirement candidate |
| `label.required::after` | 1                   | 0                       | 0                       | Separate retirement candidate |
| `small.hint`            | 1                   | 0                       | 0                       | Separate retirement candidate |

### Mounted source and native alternatives

- [Root routes](../../../apps/app/config/app.routes.ts) mount competition and player libraries.
  [Competition routes](../../../libs/frontend/pages/competition/src/lib.routes.ts) mount `:competitionId/edit`;
  its [editor template](../../../libs/frontend/pages/competition/src/pages/edit/page-edit.component.html)
  renders info, dates and settings tabs.
- [Settings hints](../../../libs/frontend/pages/competition/src/pages/edit/components/competition-settings/competition-settings.component.html)
  use `small.text-muted-color` at lines 44 and 73; related IDs/ARIA references are not `.hint`.
  [Dates hints](../../../libs/frontend/pages/competition/src/pages/edit/components/competition-dates/competition-dates.component.html)
  use the same structure at lines 27 and 45.
- [Player routes](../../../libs/frontend/pages/player/src/lib.routes.ts) mount `:playerId/edit`;
  its [profile form](../../../libs/frontend/pages/player/src/pages/edit/components/player-profile/player-profile.component.html)
  uses ordinary associated labels, native `required`, `invalid` and ARIA state, with
  `p-message severity="error" variant="simple" size="small"` for validation, not `.error-text`.
  Player form is source-inspected only; no profile fields edited or browser-validated.
- PrimeNG Message docs confirm native severity, simple variant and small size. Installed
  `node_modules/primeng/types/primeng-message.d.ts:76,105,110` confirms these inputs.
  Existing field validation/help patterns suffice; no component extraction, new binding, stylesheet or dependency.
  A visual asterisk alone would not establish required semantics if a future form needs a required indicator.
- Existing source passthrough bindings in competition help markup are outside scope and unchanged.
  No new passthrough/scoped-token bindings introduced.

### Browser evidence and limits

- Initial home `/`, dark, 1571 x 1272: all three candidate selectors have zero matches, as does generic `small`.
- Recursive served CSSOM inspection confirms all three authored rules and the separate generic `small` rule.
  Cross-origin Google font stylesheet access throws `SecurityError`; recorded, not suppressed as a pass.
  Mounted CSS evidence is the served dev stylesheet, not a new production build.
- Opened `/competition/pbo-competitie-2026-2027/edit` read-only. Info tab renders two required inputs but no
  `label.required`; zero matches for all three selectors. No fields changed, blurred to trigger validation or saved.
- Selected native Instellingen tab without editing. Both actual settings hints are `SMALL.text-muted-color`,
  computed 13px, not the candidate rule's 12px. Zero candidate matches in light/dark at 390px/1440px,
  height 1000px. Muted color resolves to existing theme tokens in both modes.
  These are selector/computed-style samples, not visual, contrast or comprehensive state-regression passes.
- Used native theme controls, restored dark and original 1571 x 1272 viewport, then returned home.
  Final settled check confirms Account restored, original URL/theme/viewport, zero candidate matches and no dialogs.
  Existing navigation `InvalidStateError: Transition was aborted because of invalid state` recurs;
  auth UI reloads during navigation. No clean-console/auth-lifecycle claim.
- No operational/admin mutation, form edit/save, data selection, upload, service start/stop or dependency change.
  No raw browser logs, domain records or screenshots committed.
- Application templates, utility classes, SCSS, tokens, data, permissions and localization are unchanged.
  No new styling exception or reusable-component decision.

### Validation and next action

```powershell
git --no-pager status --short
git branch --show-current
git --no-pager grep -n -I -e 'error-text' -e 'label.required' -e 'small.hint' -- ':!docs' ':!.github'
npx prettier --write docs\design-refresh\work-items\DR-029j-error-required-hint-inventory.md docs\design-refresh\backlog.md
npx prettier --check docs\design-refresh\work-items\DR-029j-error-required-hint-inventory.md docs\design-refresh\backlog.md
git diff --check
```

- Tracked inventory and bounded browser checks pass as described above.
- Scoped Prettier write/check and `git diff --check` pass.
  Node validation via PowerShell here-string confirms LF/frontmatter, 525 local link targets, candidate/open-parent
  registry and exactly two scoped documentation files; final pre-commit validation confirms approved Done.
  Git's future-CRLF warning does not reflect verified LF bytes.
- Application build/tests not run: documentation-only inventory, no application behavior changes.
  Required pre-commit `npx nx run-many --target=lint --output-style=static` runs 34 targets:
  22 pass (cached), twelve reproduce historical `@nx/dependency-checks` failures:
  `backend-health`, `shared`, `backend-seo`, `backend-ranking`, `backend-search`, `backend-authorization`,
  `i18n`, `utils`, `backend-translate`, `backend-database`, `frontend-modules-translation`, `backend-graphql`.
  Existing dependency-version/unused-package/missing-peer findings remain; no manifest fixes are in scope.
  No visual review, keyboard/focus/contrast, screen-reader, full error/disabled/permission/state workflow,
  locale switching or exhaustive SSR/hydration regression performed.
- On 2026-11-27 the user selected `Approve inventory with documented limits and commit` and `Nothing else`.
  Resulting backlog status: Done by explicit approval with disclosed limits.
  Unperformed visual/accessibility/state/locale/workflow/SSR checks remain unchecked; workspace lint failures
  and inherited findings remain unresolved. Approval covers only this inventory and backlog, on existing `main`, no push.
- Exact next invocation: separately scope DR-029k for fresh consumer checks and retirement of only these three
  unused rules plus their obsolete comments. Preserve generic `small` and every other global rule.
  DR-029 remains open; inherited findings and final regression remain unresolved.
