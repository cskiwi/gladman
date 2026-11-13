---
title: 'DR-013c: Builder team cards'
description: 'Native semantic team status, metadata and reusable player grouping in the mounted builder.'
---

## Identity and scope

- ID: DR-013c. Status: see the [backlog](../backlog.md).
- Parent: [DR-013](DR-013-club-team-builder.md). Prerequisite: DR-013b (Done).
- Design rules: [design refresh](../README.md).
- Mounted consumer: `/clubs/smash-for-fun` -> Ploegopstelling, confirmed 2026-11-13.
  Nine `app-builder-team-card` instances render in the permission-gated tab.
- Nx project: `frontend-pages-club`; existing nl/fr/en translation files.
- Sources: [card template][template], [component][component], [consumer][consumer].
- Preserve index calculations, sorting, membership groups, CDK payloads and all parent output bindings.
- Exclude player-chip internals (DR-013d), dialogs, builder service/algorithms, backend behavior,
  permissions, shared theme, dependencies and operational mutations.

## Baseline and approach

- Card header bypasses native title spacing; status tags are icon-only, removal dims all content.
- Metadata uses English labels, palette colors and clickable spans without keyboard access.
- Index progress overrides colors with inline palette tokens. Replace with a native severity Tag
  and explicit warning/error Messages, preserving the existing index thresholds and displayed numbers.
- Six copies of player-chip bindings differ only in their group and mixed-ranking input.
  Keep the existing smart service/presentational card separation; consolidate repeated groups within
  this card rather than creating a one-to-one PrimeNG wrapper or changing player-chip appearance.
- Use native Card title/footer, Tags, Buttons and Messages, semantic definition-list metadata,
  localized labels and minimal dashed CDK drop affordance. No SCSS or inline appearance overrides.

## Implementation checklist

- [x] Confirm mounted consumer, prerequisites and bounded scope.
- [x] Simplify native presentation and localize card copy.
- [x] Preserve actions, CDK payloads, sorting and player-chip inputs/outputs.
- [x] Record focused validation, review and remaining limitations.

## Acceptance and verification

- [x] Index values, severity and explicit warnings match existing thresholds.
- [x] Sub-event action is keyboard accessible; removal/delete actions have contextual accessible names.
- [x] Regular/backup and mixed gender groups retain their players, order and event payloads (focused regression).
- [x] Removal, empty and validation states render explicitly (focused regression).
- [x] Native semantic components; no new palette classes, SCSS or inline appearance overrides.
- [x] Light/dark at wide/narrow widths preserve information without horizontal overflow.
- [x] Keyboard action, visible focus, labels and sampled contrast checked; failures recorded below.
- [ ] Full accessibility/contrast passes, including native Message and dark secondary focus-ring contrast.
- [ ] Browser removal/empty/backup/missing-or-unusually-long data states verified.
- [ ] fr/en browser localization and dedicated SSR/hydration behavior verified.
- [x] Focused Nx lint/build and tests with the existing zoneless setup override pass.
- [ ] Default club test setup passes (existing DR-059 failure).
- [x] User visual review or explicit approval with disclosed limits (2026-11-13).

## Evidence and handoff

- Implemented and explicitly approved with disclosed limits on 2026-11-13; worktree clean before selection.
  No operational mutations.
- Native Card title/footer, visible promotion/demotion Tags, index severity Tag, native warning/error Messages,
  semantic definition-list metadata and a native keyboard-operable sub-event Button.
  Remove whole-card opacity and the inline palette-based progress bar.
- Preserve the index thresholds and numeric current/maximum display. A below-minimum index now also displays its
  existing error explanation when the sub-event has no maximum; previously the explanation was hidden with the bar.
- Consolidate six player-chip render sites into one grouped loop. All existing CDK, player-click and membership
  payloads remain; no player-chip, parent service, dialog or shared theme changes.
- Add 20 matching keys in nl/fr/en under `all.club.teamBuilder.card.*`. The translation watcher regenerated only
  those keys in `libs/utils/i18n/src/lib/i18n.generated.ts`; generated output was not hand-edited.
- Literal template `class` tokens: 175 -> 74 (first pass 69). The remaining utilities provide title/actions, definition-list,
  group spacing, wrapping and a semantic dashed drop target. No new SCSS, palette classes or styling exceptions.
- Reuse decision: keep the existing smart service and presentational card/chip separation. A single grouped loop
  styles real repeated structure once without another component or one-to-one native wrapper.
- Remaining English validation text comes from the unchanged service, not card-owned labels: follow-up DR-013h.
- No SCSS or color exceptions. Native contrast failures stay in the shared audits, not page-specific overrides.
  The scoped native Button sizing decision is recorded below.

### Validation commands

- PASS: repository Prettier `--write` on every changed source, test, generated and handoff file.
- PASS: `npx nx run-many -t lint build -p frontend-pages-club`
  (12 tasks; seven cached initially and on the final inline-control check; intermediate runs had 10/11 cached).
- PASS, pre-commit: `npx nx run-many --target=lint` (34 tasks, 21 cached).
- FAIL before tests:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=builder-team-card.component.spec.ts
--output-style=static`.
  Existing `zone.js` dependency missing in club setup (DR-059); no install or shared setup change.
- PASS: card regressions with `--jestConfig=tmp\dr013c-jest.config.cjs` (three tests).
  Re-run after alignment feedback and again after final inline-button sizing: three tests pass.
- PASS: `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=builder
--jestConfig=tmp\dr013c-jest.config.cjs --output-style=static` (four suites, eight tests).
  Re-run after restoring the inline sub-event action and index validity feedback: eight tests pass.
  Temporary config spreads the existing club config, sets its rootDir to the club project and replaces only
  setupFilesAfterEnv with the existing tournament zoneless setup. Removed after validation.
  Tests cover index boundaries, missing maximum/metadata, named actions, pending removal, validation/empty rendering,
  mixed/regular/backup order, consolidated toggle, ranking inputs and CDK/chip output payloads.
- A first combined selector containing a pipe was rejected by the Windows command shell before Jest ran;
  replaced with the single `builder` selector above, not treated as an application failure.
- PASS: all three translation files parse; the 20 key names match.
- PASS: `git diff --check`.
- NOT RUN: full application build/suite, dedicated SSR/hydration, live save/delete/membership/drag/drop,
  fr/en browser, full accessibility or browser fixtures for empty/removal/backup/long/missing data.

### Browser evidence

Real mounted Dutch tab; before dark first-card screenshot and initial after all four theme/viewport combinations.
Screenshots remain in chat, not committed. Source retains the baseline for other before states.

| Theme | Viewport  | Document scroll width | Card horizontal overflow |
| ----- | --------- | --------------------- | ------------------------ |
| Dark  | 1440x1000 | 1425px                | None, all nine cards     |
| Light | 1440x1000 | 1425px                | None, all nine cards     |
| Dark  | 390x844   | 375px                 | None, all nine cards     |
| Light | 390x844   | 375px                 | None, all nine cards     |

- Inspected warning card and promoted mixed card in light narrow; group headings, both old/new sub-events,
  index range, standing and validation feedback remain. Real data has no backup groups; test covers those.
- Tab moves from removal to the named sub-event action. Enter opens the existing dialog, Cancel closes it
  without applying or saving. Escape does not dismiss the existing dialog; preserve that finding for DR-013g.
- Keyboard focus outline is visible in both themes. Light outline is clearly contrasted; dark secondary-button
  outline measures 1.40:1 against the Card, retained for the shared DR-032 audit.
- Sampled text contrast, light/dark: heading 19.87/16:1, muted metadata and settled sub-event button 4.87/6.65:1,
  success Tag 4.57/10.51:1, warning Tag 4.52/9.31:1. Removal icon is 3.76/5.08:1 (non-text target 3:1).
- FAIL, native Message text (DR-034): warning 2.85:1 light (dark 7.49:1 passes);
  validation error 4.44:1 light / 4.40:1 dark, below 4.5:1. No claim that full contrast passes.
- Waited for port 5000 to listen after translation changes, then reloaded the mounted data successfully.
  An attempted guessed health URL returned 404; port readiness and the recovered real page, not that URL,
  establish API recovery. Transient HMR/read-request aborts occurred during rebuilds.
- Restored original dark document class and wide viewport; persisted theme preference untouched.

### Metadata alignment feedback

- The user requested another pass on the information below the team name; this was feedback, not approval.
- Move the index into the same definition list as sub-event, range, maximum level and standing.
  Every label now starts on one edge and every value shares the same right-aligned column.
  Put warning feedback after the complete metadata block rather than interrupting its rows.
- Rechecked the final layout in light/dark at 1280x900 and 390x844.
  All nine cards have identical right edges for every value cell, with no card/page horizontal overflow:
  document scroll width 1265px at 1280px and 375px at 390px.
- Screenshots inspected in both themes and widths. The browser resize to 1440px did not take effect on this
  pass (one explicit wait timed out), so the final wide recheck uses the verified 1280px viewport instead.
- No event binding, data, translation, service or dialog changes in this feedback pass.
- Focused lint/build and all three card regressions pass again. Previously disclosed verification limits remain.

### Final inline action and compact rows

- The user clarified that the index needs a visual validity indicator and a header pencil looks like editing the
  whole team. The temporary plain-index/header-edit experiment was rejected, not approved.
- Restore the native severity index Tag with check/warning icon; successful indices additionally have localized
  screen-reader text (`indexValid`). Keep the pencil next to the current sub-event label, or the new sub-event
  label for promoted/demoted teams, preserving which sub-event is editable.
- Keep right-aligned values free of trailing action icons. Use equal implicit grid rows without an extra row gap.
  Final measured label-to-label spacing is 24.75px for all five first-card metadata rows;
  the previously liked plain bottom rows were 24.5px apart.
- The default native small Button still enlarged the row, so use its documented scoped `root.sm` tokens:
  `paddingX: 0.125rem`, `paddingY: 0.1875rem`, `iconOnlyWidth: 1.75rem`.
  This is native component token configuration, not inline CSS, custom button markup or a shared theme change.
  Installed token definitions are in `node_modules/@primeuix/themes/types/button/index.d.ts`.
  The first padding trial measured only 23px tall and was corrected before handoff.
- The final native pencil target measures 24.5x24.75px, meeting the 24px minimum in this application's 14px-root
  layout. Its native hover/focus/disabled behavior and colors remain intact. Remove this local sizing if PrimeNG
  provides a suitable native compact-inline size; do not propagate it to unrelated controls.
- Rechecked final screenshots in light/dark at 390x844 and 1280x900: no horizontal overflow in any of nine cards
  (document widths 375px / 1265px). Every first-card value cell ends on the same right edge.
- Tab reaches the inline pencil from removal; Enter opens its dialog and Cancel closes it without applying.
  Tooltip hover/dismissal was observed. Inherited dark focus-ring contrast remains disclosed under DR-032.
- Translation changes restarted the API again. Waited for port 5000 to return, reloaded and verified the real
  mounted page and Dutch screen-reader validity copy. No mutation was performed.
- Final focused lint/build and three card regressions pass; the related eight-test run also passes after the
  inline-action/validity changes. All earlier failed/not-run verification limits remain unchanged.

### Approval and next action

On 2026-11-13 the user selected **"Approve and commit DR-013c with disclosed limits"** after reviewing the final
inline-pencil/validity-Tag version. DR-013c is Done by that explicit approval, not by treating unperformed checks
or known failures as passed.
Accepted limits: native Message/dark focus-ring contrast (DR-034/032), default club test setup (DR-059),
browser removal/empty/backup/long/missing states, fr/en browser, live mutation workflows, full accessibility,
dedicated SSR/hydration, full application build and full suite. All corresponding unchecked criteria remain unchecked.
The existing sub-event Escape behavior (DR-013g) and English service feedback (DR-013h) remain separate follow-ups.
Approval authorizes only this slice's implementation, tests, translations/generated keys and repository handoff commit.
Only approval/handoff documentation changed after focused validation; no application revalidation is needed.
Keep the parent DR-013 open. Next candidate/action: scope DR-013d player chips before implementation; not started.
No push authorized.

[template]: ../../../libs/frontend/pages/club/src/components/team-builder/builder-team-card.component.html
[component]: ../../../libs/frontend/pages/club/src/components/team-builder/builder-team-card.component.ts
[consumer]: ../../../libs/frontend/pages/club/src/pages/detail/tabs/club-team-builder-tab.component.html
