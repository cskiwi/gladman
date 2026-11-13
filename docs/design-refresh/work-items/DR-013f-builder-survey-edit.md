---
title: 'DR-013f: Builder survey edit'
description: 'Responsive, localized native survey editing with labelled fields and preserved payloads.'
---

## Identity and scope

- ID: DR-013f. Status: see the [backlog](../backlog.md). Parent: [DR-013](DR-013-club-team-builder.md).
- Dependencies: DR-013d (Done). Design rules: [design refresh](../README.md).
- Mounted consumer confirmed on 2026-11-13: `/clubs/smash-for-fun?tab=team-builder`, player details -> edit survey,
  or player-chip double-click. The actual dialog was opened before editing using the chip's DOM double-click event.
- Project: `frontend-pages-club`; nl/fr/en translation assets and generated types.
- Scope: [dialog](../../../libs/frontend/pages/club/src/components/team-builder/edit-survey-dialog.component.ts),
  its template, survey-edit-only caller options/focus handling, and focus handoff in the two existing chip edit paths.
- Preserve every editable field, free-text availability/choices, defaults, survey metadata and exact close payloads.
- Exclude import, sub-event/settings dialogs, persistence/service algorithms, notifications (DR-013h), shared theme.
- No live survey/team save or other operational mutation for verification.

## Baseline and approach

- Clean worktree. Mounted Dutch dark dialog has English title/fields/actions, fixed 600px width, unnamed inputs,
  a red palette checkbox label and duplicated two-column team groups at every viewport.
- Native Fluid, responsive layout, labelled inputs, native Panel per team, shared domain/common translations.
- Render the two identical preference groups once using typed field descriptors. No new wrapper component:
  the dialog is already a bounded editor with one real caller, separate from the builder service.
- Native modal dismissal/focus containment and post-destruction trigger restoration, following DR-013e findings.
- Literal template class tokens: 123 -> 49. No new CSS, inline styling, palette classes or dependencies.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and independent scope.
- [x] Preserve survey values, defaults and metadata with focused tests.
- [x] Use native controls, associated labels and one team-group template.
- [x] Keep shared theme and adjacent workflows unchanged; check the bounded chip focus handoff.
- [x] Record discoveries outside scope (existing DR-032/033/058/059; no new backlog item required).

## Acceptance and verification

- [x] Native localized fields/actions, associated labels and named ranking summary.
- [x] Light/dark at 390px/1440px without horizontal dialog/page overflow.
- [x] Keyboard focus containment, Escape/Cancel and trigger return.
- [x] Existing/missing survey, free-text values and exact save/cancel output tested.
- [x] Reduced utility duplication; no new palette classes, SCSS or inline styling workarounds.
- [x] Focused Nx lint/build/temporary-zoneless tests pass; default infrastructure failure remains DR-059.
- [ ] Full accessibility/contrast audit.
- [ ] fr/en browser and SSR/hydration verified.
- [x] User approval with disclosed limits; unperformed verification remains unchecked.

## Evidence and handoff

- Before screenshot: mounted dark desktop English editor; after: dark desktop and narrow localized editor,
  retained in chat only. No sensitive screenshots/logs committed.
- Direct PrimeNG Fluid/Panel use keeps the editor separate from service orchestration without adding a wrapper.
  Typed field descriptors render both team groups through one template, including all existing free-text values.
- Three added domain labels under `all.player.survey` in nl/fr/en. Reuse shared edit, teams wanted,
  unavailability, numbered team, play day, remarks, stopping and button keys. Existing watcher regenerated
  [translation types](../../../libs/utils/i18n/src/lib/i18n.generated.ts); not hand-edited.
- The only shared-chip change is focusing its own persistent details Button before either edit output.
  This lets the caller capture a connected trigger instead of the disappearing body-appended Popover edit Button.
  Output remains the same player object; both mounted pools and team-card consumers retain their existing handlers.
  All builder/chip regressions pass; mounted team-card details and double-click event paths checked in browser.
- No shared theme, stylesheets, parser/matcher, draft/team persistence, backend logic or notification changes.
- Exceptions: none.

### Validation commands and results

- PASS: repository `npx prettier --write --end-of-line lf` for all changed source/test/generated/handoff files.
- PASS: `npx nx run-many -t lint build -p frontend-pages-club --output-style=static` (12 tasks, inherited warnings).
  Re-run after the final test and generated-type changes.
- PASS before commit: `npx nx run-many --target=lint --output-style=static` (34 projects, inherited warnings).
- FAIL before execution:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=team-builder --output-style=static`
  — all seven suites fail on missing `zone.js`, DR-059. No dependency/shared setup changes.
- PASS:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=team-builder
--jestConfig=tmp\dr013f-jest.config.cjs --output-style=static`
  — seven suites / 22 tests. Three new editor regressions cover all labels, independent team/availability bindings,
  free text, zero team count, imported metadata, missing-survey defaults, exact save output and Cancel isolation.
  Added caller destruction/focus regression and an assertion that the chip focuses its persistent trigger before emit.
- Temporary config spreads club Jest config and changes only rootDir/setupFilesAfterEnv to the existing tournament
  zoneless setup. Removed after verification. Intermediate test failures were fixture timing and an incorrect synthetic
  InputNumber `input` event; corrected by settling NgModel rendering and using native ArrowDown key events.
- PASS: Node `JSON.parse` and survey-key parity in nl/fr/en. Literal class-token count measured against HEAD.
- PASS: `git diff --check`.
- NOT RUN: full application build/suite, live survey/team save, fr/en browser, full accessibility/contrast,
  dedicated SSR/hydration or populated imported surveys in browser.

### Browser evidence

Real mounted Dutch tab on 2026-11-13; no survey/team save or operational mutation.
Ordinary baseline pointer actions timed out on moving chip nodes; DOM double-click opened the baseline editor.
Final keyboard path verified separately: Enter on focused chip details -> Enter on native edit -> modal opens.
Do not claim baseline timeouts as passing pointer tests.

| Theme | Viewport  | Dialog width | Dialog/page horizontal overflow | Team field layout |
| ----- | --------- | ------------ | ------------------------------- | ----------------- |
| Dark  | 1440x1000 | 600px        | None                            | Two columns       |
| Light | 1440x1000 | 600px        | None                            | Two columns       |
| Dark  | 390x844   | 370.5px      | None                            | One column        |
| Light | 390x844   | 370.5px      | None                            | One column        |

- Computed native Dialog backgrounds change from `oklch(1 0 0)` to `oklch(0.17 0.02 250)`;
  actual preset light/dark styles, not just class presence, checked. Original dark class restored afterward.
- All 12 editable controls have associated visible labels. Native Panel regions are named Ploeg 1/Ploeg 2,
  and ranks expose the localized full discipline summary.
- Initial focus lands on the native stopping Checkbox inside the modal. Label click focuses preferred day;
  ArrowUp changes team count from 1 to 2.
- Long synthetic first-choice text and eight-line remarks remain within the dialog/page at 390px.
  Native vertical content scrolling reaches the actions without horizontal overflow.
- Tab from Save wraps to named header close; Shift+Tab wraps back. Escape dismisses and restores the actual
  chip details Button. Cancel also restores it. Reopening shows original count 1 and empty choice/remarks,
  proving discarded local edits did not update the player.
- No full contrast pass claimed: inherited shared primary/focus/spinner concerns remain DR-032/033/058.
  Fr/en browser, unusually long player identity, populated imported survey browser states and SSR remain unchecked.
- Translation changes restarted the API and temporarily produced frontend 502s. Waited for both port 5000 and
  the port 3000 GraphQL proxy to answer `{ __typename }`, then reloaded the real mounted data successfully.

### Approval and next action

- The user explicitly approved `Approve and commit DR-013f with disclosed limits` on 2026-11-13.
- This child is Done. Approval accepts the disclosed limits without changing unchecked criteria into passes.
  It authorizes only this slice, tests, generated types and repository handoff in a scoped Conventional Commit.
- Keep DR-013 open. Exact next action: scope DR-013g sub-event dialog before implementation; not started.
- No push is authorized.
