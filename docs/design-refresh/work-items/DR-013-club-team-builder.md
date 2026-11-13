---
title: 'DR-013: Club team builder'
description: 'Incremental refresh of the mounted club team-builder tab and its dialogs.'
---

## Identity and scope

- ID: DR-013. Status: see the [backlog](../backlog.md).
- Dependencies: DR-012 (Done). Design rules: [design refresh](../README.md).
- Mounted consumer: `/clubs/:clubId`, permission-gated Ploegopstelling tab in
  [club detail](../../../libs/frontend/pages/club/src/pages/detail/page-detail.component.html).
- Project: `frontend-pages-club`.
- Preserve permissions, draft persistence, survey processing, player matching, ranking calculations,
  drag/drop, membership changes and explicit team saves.
- Do not change global styling, backend behavior or dependencies.
- Integrated-review repair: restore the connected Settings trigger after modal destruction, matching the other dialogs.
  Preserve Settings values, cancellation, save callbacks and native dialog configuration; no child redesign is reopened.

## Children

- DR-013a: settings dialog, selected first as a small independently reviewable surface.
- DR-013b: builder toolbar, responsive layout and player pools.
- DR-013c: presentational builder team cards.
- DR-013d: presentational player chips (pool and team-card consumers).
- DR-013e: survey import dialog.
- DR-013f: survey edit dialog.
- DR-013g: sub-event dialog.
- DR-013h: builder validation, notifications and confirmation copy (discovered English service output).

[DR-013a](DR-013a-builder-settings.md) is implemented and approved with disclosed limits.
[DR-013b](DR-013b-builder-layout-pools.md) implements the toolbar/layout/pools and is approved with disclosed limits.
All eight required children are now Done with explicit approval and disclosed verification limits.
Integrated verification and parent-level review are complete with approval below; do not reopen completed children.

## Baseline and handoff

Source and browser confirmed the tab and Settings action are mounted on `/clubs/smash-for-fun`
on 2026-11-13. The existing builder already separates its service from presentational team cards/player chips.
Reuse that separation; do not extract one-to-one wrappers for native PrimeNG fields.
DR-013b localized the toolbar/pools. DR-013c localizes card-owned labels and removes card-owned palette colors.
DR-013d has migrated player chips. DR-013e/f/g have migrated the import, survey-edit and sub-event dialogs.
DR-013h has localized service-generated validation, notifications and confirmations.

DR-013a implements native fluid fields, label/help associations, Divider, responsive dialog sizing and the existing
localized title. Lint/build and an isolated accessibility regression (temporary zoneless setup override) pass.
Light/dark wide/narrow browser checks pass for layout; inherited contrast failures, default club test infrastructure
and unchecked live-save/locale/SSR checks remain disclosed in its brief.
The user approved completion and a scoped commit on 2026-11-13 with those limits accepted.
DR-013b adds native Toolbar/Panel surfaces, responsive stacking/sticky pools and localized accessible controls.
Focused lint/build and two regressions with the temporary zoneless override pass; Dutch light/dark wide/narrow
browser checks pass for layout. Default tests (DR-059), light Save contrast (DR-033), live mutation workflows,
fr/en browser and SSR remain disclosed limits. No team-card/player-chip internals or algorithms changed.
The user explicitly approved completion and a scoped commit on 2026-11-13, preserving all unchecked criteria.
[DR-013c](DR-013c-builder-team-cards.md) implements native card titles, index/status Tags, Messages,
keyboard-accessible sub-event actions, localized labels and one rendering path for every player group.
It preserves the existing service/presentational separation without adding another component.
Lint/build pass; eight related tests pass with the existing temporary zoneless override, while the default setup
still fails on DR-059. Dutch light/dark wide/narrow views fit without horizontal overflow.
Native Message contrast failures remain DR-034; remaining verification limits are recorded in the child.
The user explicitly approved completion and a scoped commit on 2026-11-13, preserving all unchecked criteria.
[DR-013d](DR-013d-builder-player-chips.md) implements the shared player-chip presentation and is approved.
Native semantic Tags/Buttons, one combined indicator, shared common/domain translations and keyboard-accessible
details replace palette icons and hover-only access. Hover/click share one native Popover and exact positioning:
hover preserves focus; clicking pins it with focus containment and conditional autofocus. Membership is Basis (B)
or Reserve in Dutch, shared with existing team-edit/table and player-profile consumers.
Existing presentational separation, ranks, surveys and outputs remain.
Club/player lint/build pass; 13 related tests pass with the temporary zoneless override (DR-059 remains open).
Dutch light/dark wide/narrow card rows and keyboard details/edit-opening/Cancel pass; populated pools, rich/long
browser states, live mutations, fr/en browser, full accessibility and SSR remain disclosed limits in the child.
The final eight-case browser matrix preserves hover/click panel identity and geometry, including upward flipping.
The user explicitly approved completion and a scoped commit on 2026-11-13, preserving all unchecked criteria.
DR-013e [survey import](DR-013e-builder-survey-import.md) is implemented and approved with disclosed limits.
Native validated local upload, responsive Dialog/Table, named controls and localized nl/fr/en states replace
custom button styles, inline sizing and palette text. Focus follows native step/row controls and returns to the
import trigger after destruction. Native narrow suggestions use the responsive bottom chooser.
Club lint/build pass; 18 related tests pass with the temporary zoneless override. Dutch light/dark wide/narrow
layout and local interactions checked; no live confirmation/mutation. Remaining limits are in the child.
The user explicitly approved `Approve and commit DR-013e with disclosed limits` on 2026-11-13.
All unchecked verification limits remain disclosed in the child. Approval authorizes its scoped commit.
[DR-013f](DR-013f-builder-survey-edit.md) implements the native responsive survey editor and is approved.
Fluid/Panel, associated labels, shared nl/fr/en copy and one typed preference-group loop replace duplicated markup.
Exact payloads remain; chip edit paths focus the persistent trigger before opening and the caller restores it
after modal destruction. This bounded shared-chip focus change is checked by tests and the mounted team-card flow.
Club lint/build pass; seven builder suites / 22 tests pass with the temporary zoneless override (DR-059 remains).
Dutch light/dark wide/narrow layout, labels, keyboard opening, focus wrap, Escape/Cancel and discard/reopen checked.
No live save. Full accessibility/contrast, fr/en browser, populated imported-survey browser states, long identity
and SSR/hydration remain unchecked. The user explicitly approved
`Approve and commit DR-013f with disclosed limits` on 2026-11-13; approval authorizes its scoped commit.
[DR-013g](DR-013g-builder-sub-event.md) implements native labelled RadioButtons, localized dialog copy and responsive
modal options with Escape and post-destruction trigger restoration. It preserves grouping, metadata and exact selection
payloads, with no service algorithm or persistence changes. Club lint/build pass; eight builder suites / 26 tests pass
with the temporary zoneless override, while default tests remain DR-059.
API/proxy recovered after user intervention. Mounted Dutch light/dark at 390px/1440px fit with no horizontal overflow.
Native radio Arrow/Space selection, initial focus, focus wrap, Escape/Cancel discard and actual trigger return pass.
Long synthetic DOM labels wrap with native vertical content scrolling. No live Apply/team save.
The user explicitly approved `Approve and commit DR-013g with disclosed limits` on 2026-11-13.
DR-013g is Done with fr/en browser, full accessibility/contrast, live Apply and SSR/hydration still unchecked.
Approval authorizes its scoped commit without claiming unperformed checks passed.
Keep this parent open. [DR-013h](DR-013h-builder-feedback.md) now implements typed validation descriptors and localized
nl/fr/en notifications/confirmations, preserving calculations and persistence payloads. Club lint/build pass;
nine builder suites / 33 tests pass with the existing temporary zoneless override (DR-059 remains).
The API asset blocker is resolved after the user's refresh. Dutch light/dark at 390px/1440px, translated Card warnings,
confirmation keyboard containment/dismissal/trigger return and Toast layout/close-label checks pass.
No live team save/import/removal accepted; fr/en browser, full accessibility/contrast and SSR remain unchecked.
The user explicitly approved `Approve and commit DR-013h with disclosed limits` on 2026-11-13.
DR-013h is Done; approval accepts its remaining limits without claiming unperformed checks passed.
That approval authorized only the child's scoped commit, leaving the parent open at that point.
The integrated review and explicit parent approval below complete that next action.
DR-064/065 remain Backlog. No push authorized.

- [x] Complete and review all required children (their recorded approvals retain their disclosed limits).
- [x] Verify the integrated builder's mounted layout and safe dialog/control interactions without operational mutations.
- [x] Repair and regress the integrated Settings trigger-focus handoff.
- [ ] Full loading/error/populated-pool/long-data browser matrix.
- [ ] Live drag/drop, membership, import confirmation and settings/survey/team persistence.
- [ ] Full accessibility/contrast, fr/en browser and dedicated SSR/hydration verification.
- [ ] Default club test setup passes (DR-059).
- [x] Record accepted verification limits before closing this parent (explicit approval below).

## Integrated parent review: 2026-11-13

### Scope and repair

- Clean worktree at selection. Source and mounted DOM confirm the permission-gated team-builder tab is in use;
  all eight required child rows are Done with approvals in their briefs.
- Reconciled outdated parent statements that still described completed dialogs/localization as future work.
- Retained the existing smart/service and presentational Card/chip separation. No new wrapper is warranted:
  Cards and chips already share their rendering paths across their real consumers.
- The initial four-case matrix found Settings Cancel did not return focus to its actual trigger. Import,
  sub-event, survey and confirmation dismissal already restored their triggers.
- Bounded repair in the existing builder caller: capture activeElement before opening Settings and restore it
  on DynamicDialog destruction only if it is still a connected HTMLElement. This matches the other callers;
  no timers, shared dialog changes, new configuration, translation or persistence changes.
- Two focused caller regressions verify restoration occurs after destruction, not close; a disconnected trigger
  is not focused, and cancellation never calls updateConfig. Existing settings-save callback regression still passes.
- No template, utility or styling changes: builder/Card/chip literal class counts remain 119/74/54.
  No new SCSS, palette colors, dependencies or styling exceptions. Children are not reopened.

### Validation

- PASS: repository `npx prettier --write --end-of-line lf` on all changed files and the temporary test config.
- PASS: `npx nx run-many -t lint build -p frontend-pages-club --output-style=static`:
  12 tasks including dependencies, cache used; existing dependency warnings remain.
- PASS after approval: `npx nx run-many --target=lint --output-style=static`:
  all 34 projects pass with inherited warnings.
- FAIL before execution:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=team-builder --output-style=static`:
  all nine suites fail on missing `zone.js`, zero tests executed (DR-059).
- PASS:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=team-builder
--jestConfig=tmp\dr013-parent-jest.config.cjs --output-style=static`:
  nine suites / 35 tests, including the two new Settings handoff cases.
  Initial pre-repair run passed the existing 33 tests; final run includes the repair.
- Temporary config spreads the existing club config and changes only rootDir/setupFilesAfterEnv to the existing
  tournament zoneless setup. Removed after verification; no repository-wide test-infrastructure change.
- PASS: `git diff --check`.
- NOT RUN: full application build/suite, default setup repair, full contrast/accessibility audit, fr/en browser,
  dedicated SSR/hydration and operational persistence workflows. Existing child limits remain unchecked.

### Browser evidence

- Real mounted Dutch tab: nine Cards and 72 player chips; current unassigned/stopping pools are empty.
- Final matrix: light/dark at 1440x1000 and 390x844. Zero page/Card/dialog horizontal overflow or raw translation
  keys. All five dialog paths fit inside the viewport and initially contain focus.
- Native dialog widths (rounded CSS pixels): wide Settings/import/sub-event/survey/confirmation =
  500/800/500/600/560; narrow = 371/371/371/371/280.
- All 20 keyboard paths open via actual controls. Settings/import/sub-event/survey close via footer Cancel;
  confirmation closes via Escape with Cancel initially focused. All 20 return focus to their actual connected
  triggers after the repair. Survey is reached through the actual chip details Popover, not a component preview.
- The four cases preserve exact Card text before/after cancellation; a request observer sees zero GraphQL
  mutations throughout the final matrix. No import file confirmed, player created, team removed or team saved.
- Additional dark/wide checks: select Index then restore Name; toggle backup grouping off/on; filter the empty
  pool and clear it. Selected states change correctly and the final Card text matches the initial text.
- Settings: all six inputs have labels. ArrowUp changes an unsaved value; Cancel/reopen restores the original.
  Shift+Tab from the first input wraps to Save; Tab wraps back. Cancel returns focus. Zero GraphQL mutations
  observed throughout these extra control checks.
- Pointer opening and footer Cancel return independently checked at light/390px after the repair.
  Early probes hit an overly exact icon-bearing button name, duplicate header/footer Cancel names and a stale
  snapshot reference; these failed probes are not passing pointer checks. Final probes use scoped actual controls.
- Screenshot inspection: light/wide Settings before the repair, light/narrow toolbar/pools and Settings after
  the repair, and dark/wide Card/pool composition. The caller-only repair does not alter appearance.
  No screenshots or personal fixture data added to the repository.
- A transient GraphQL request failure appeared among browser recent events during development reloads.
  Final read-only `{ __typename }` probes return HTTP 200 / Query on both ports 3000 and 5000.
  No backend/translation restart was needed or performed.
- Restored initial dark theme and 1643x1272 viewport, closed dialogs, restored sort/group/filter controls and
  left focus on Settings. Live data, team membership and assignments were not changed.

### Approval, accepted limits and exact next action

- Parent was moved to Review after integrated checks and before seeking approval.
- On 2026-11-13 the user explicitly approved:
  `Commit and close of the team-builder  DR-013  so for the next iteration we can move to the next component`.
- Parent is now Done in the authoritative backlog. Approval accepts the disclosed limits below without claiming
  unperformed checks passed; all corresponding checklist entries remain unchecked.
- Inherited unresolved work remains separate: DR-032/033/034/058 contrast, DR-059 default test setup,
  DR-063 Popover native behavior, DR-064 ConfirmDialog native inputs and DR-065 import failure reporting.
- Accepted unverified limits: live persistence and membership/drag/drop, populated pools, complete
  loading/error/long-data browser states, fr/en browser, full accessibility/contrast and SSR/hydration.
  DR-059 still prevents the default test setup from executing; only the temporary zoneless run passes.
- Approval authorizes committing only this Settings caller fix, its two regressions and repository handoff.
  It does not authorize shared infrastructure/theme fixes, other backlog items or a push.
- Exact next action: scope DR-014 club team detail from its mounted consumer, create its brief and split broad
  work before selecting a single implementation slice. DR-014 remains Backlog; not started in this invocation.
