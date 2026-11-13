---
title: 'DR-013g: Builder sub-event dialog'
description: 'Native, localized and keyboard-accessible sub-event selection in the mounted club team builder.'
---

## Identity and scope

- ID: DR-013g. Status: see the [backlog](../backlog.md).
- Parent: [DR-013](DR-013-club-team-builder.md). Dependencies: DR-013c (Done).
- Design rules: [design refresh](../README.md).
- Mounted consumer confirmed on 2026-11-13: `/clubs/smash-for-fun?tab=team-builder` ->
  team Card -> Reeks wijzigen. The existing permission-gated tab opens
  [SubEventDialogComponent](../../../libs/frontend/pages/club/src/components/team-builder/sub-event-dialog.component.ts)
  from [the builder](../../../libs/frontend/pages/club/src/pages/detail/tabs/club-team-builder-tab.component.ts).
- Nx project: `frontend-pages-club`. Translation assets: existing nl/fr/en dictionaries and generated types.
- Preserve Auto sentinel, grouping/order, current division, index/level bounds, manual selection payload,
  permissions and explicit Apply/Cancel behavior.
- Exclude team-selection/service algorithms, team saves, other dialogs, global styles and dependencies.

## Baseline and approach

- Baseline real first-team dialog shows English Current/Auto/help/Cancel/Apply, LIGA/PROV groups and five choices.
- Choices are click-only styled divs without radio semantics. Escape does not close the dialog (recorded in DR-013c).
- Replace custom option borders, selection colors and check icons with native PrimeNG RadioButtons and labels.
  Keep meaningful group headings and metadata; use only layout utilities and semantic secondary text.
- Use responsive native DynamicDialog options, named close, modal focus containment, Escape and post-destruction
  trigger focus restoration, matching the existing survey dialogs.
- Reuse the current service/presentational separation. There is only one real selector consumer; no new wrapper
  or smart/dumb split is warranted.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and one bounded slice.
- [x] Preserve option grouping, order, metadata and exact Auto/manual outputs.
- [x] Replace custom clickable options with native labelled controls.
- [x] Localize dialog-owned copy in nl/fr/en.
- [x] Configure responsive dismissal and post-destruction trigger restoration; caller regression passes.
- [x] Record before/after utility counts and out-of-scope discoveries.

## Acceptance and verification

- [x] Native choices expose selection and associated labels in component tests.
- [x] Native keyboard operation verified in the mounted browser dialog.
- [x] Zero new palette classes, SCSS or equivalent styling workarounds.
- [x] Light/dark at 390px/1440px fit; synthetic long DOM label wraps and scrolls at 390px.
- [x] Initial focus, Tab/Shift+Tab containment, Escape/Cancel and trigger return work.
- [x] Current/missing metadata and Auto-only states render in focused component tests.
- [x] Focused tests verify selection/Apply, Cancel isolation and caller dismissal/focus behavior.
- [x] Relevant Nx lint/build and isolated tests pass; default infrastructure failure recorded below.
- [ ] Localization, permissions and SSR/hydration behavior are preserved.
- [x] User approved completion with the disclosed limits, retaining unchecked verification.

## Evidence and handoff

- Worktree was clean before selection.
- Baseline pointer click timed out waiting for moving Card nodes; focused Enter opened the real dialog.
  Do not treat that pointer timeout as a passing interaction check.
- Measured baseline light 390px: dialog width 390px, no internal horizontal overflow, zero native radios.
  Escape leaves it open. Other baseline matrix results were not recovered from an interrupted browser-tool execution;
  no complete before matrix is claimed.
- Changed scope: selector template/component, caller dialog options/focus return and its existing regression file,
  one new selector spec, five translation keys in nl/fr/en and corresponding generated translation types.
- Literal template class tokens: 46 -> 40, plus removal of eight conditional border/background bindings.
  Remaining utilities serve spacing, wrapping, metadata hierarchy and the accessible fieldset legend.
  No new component, shared theme/CSS or parser/service/persistence change.
- Native RadioButton API verified against PrimeNG docs and installed `primeng` declarations/source.
  Existing grouping and level sorting remain. The only group fallback change is localized Other rather than English.
- Preserve the existing smart/service vs presentational dialog separation. A new component would have only one consumer
  and add no meaningful reusable behavior, so none was extracted.
- No new out-of-scope code defect identified. DR-059 remains the known default test infrastructure issue.
  Existing shared contrast follow-ups DR-032/033 remain outside scope; no full contrast claim.

### Validation commands and results

- PASS: repository `npx prettier --write --end-of-line lf` on all changed files.
- PASS: `npx nx run-many -t lint build -p frontend-pages-club --output-style=static` (12 tasks, inherited warnings).
- PASS before commit: `npx nx run-many --target=lint --output-style=static` (34 projects, inherited warnings).
- FAIL before execution:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=team-builder --output-style=static`:
  eight suites fail on missing `zone.js`, DR-059. No dependency or shared test setup changes.
- PASS:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=team-builder
--jestConfig=tmp\dr013g-jest.config.cjs --output-style=static`: eight suites / 26 tests.
  Three selector cases verify associated labels, grouped level order, current/manual checked state, zero/missing bounds,
  missing-name fallback, Auto-only rendering, exact Apply payload and Cancel isolation.
  Added caller regression verifies manual/Auto initialization, null/undefined dismissal without a service update,
  exact confirmed ID/sentinel forwarding and focus restoration only after destruction.
- Temporary config spreads club Jest config and changes only rootDir/setupFilesAfterEnv to the existing tournament
  zoneless setup; removed after verification.
- PASS: Node `JSON.parse` and new-key parity in all three locales; `git diff --check`.
- NOT RUN: full application build/suite, full accessibility/contrast, fr/en browser, live Apply/team save,
  dedicated SSR/hydration.

### Browser evidence and resolved blocker

- Translation changes triggered a frontend HMR error (`TranslateDirective` metadata) followed by a full reload
  while the API was unavailable. No claim that this intermediate state is a passing browser check.
- Initially port 5000 refused connections; the port 3000 GraphQL proxy returned 502.
  Two bounded readiness loops (12 attempts each, 10-second intervals plus request timeouts) did not recover it.
  The existing frontend listener still runs. No shared service was stopped, replaced or restarted by this task.
- Initial reload left an application error state without translations/data.
  The user subsequently reported `API is ready; continue verification`. Both port 5000 and port 3000 GraphQL
  endpoints then returned HTTP 200 / `{"data":{"__typename":"Query"}}` to the read-only readiness query.
- Reopened the shared mounted `/clubs/smash-for-fun?tab=team-builder` page and used focused Enter on the first
  Card's Reeks wijzigen action. Actual translated dialog rendered with six native radios and LIGA/PROV metadata.
- Dutch light/dark at 1440x1000: dialog 500px wide. At 390x844: dialog 370.5px wide.
  All four cases have no page/dialog horizontal overflow and actions within viewport bounds.
  Computed Dialog backgrounds are `oklch(1 0 0)` in light and `oklch(0.17 0.02 250)` in dark.
- All six radios have one visible associated label; the fieldset exposes the Reeks selecteren group.
  Initial focus settles on Auto after the native modal opening animation.
- ArrowDown moves focus/selection from Auto to 1e Liga; Space keeps that selection.
  Tab from Apply wraps to the named header close; Shift+Tab returns to Apply.
- Escape dismisses after the native close animation and restores the actual Card trigger.
  Reopening shows Auto, proving local selection was discarded.
  Pointer selection of 2e Liga followed by footer Cancel likewise returns focus and reopens with Auto.
- At 390px, replaced one label's DOM text with a long unbroken synthetic name (no data/model change).
  In both themes it wraps without horizontal overflow, native Dialog content scrolls and Apply can be reached.
  Dismissed the dialog to discard the synthetic DOM change, and restored dark theme / 1440x1000 afterward.
- Screenshot inspection: light/narrow and dark/wide show readable grouped choices and native actions.
  No sensitive screenshots committed. Full contrast/accessibility is not claimed; inherited DR-032/033 remain separate.
- No operational/admin mutations, Apply, draft/team save or commit were performed.
- Fr/en browser, full accessibility/contrast, live Apply and SSR/hydration remain unchecked.

### Approval and next action

- The user explicitly approved `Approve and commit DR-013g with disclosed limits` on 2026-11-13.
- This child is Done. Approval accepts the disclosed limits, including DR-059, without changing unchecked checks
  into passing results. It authorizes only this slice, its tests, generated types and repository handoff.
- Keep DR-013 open. Exact next action: scope DR-013h builder validation, notification and confirmation localization
  before implementation; not started.
- No push is authorized.
