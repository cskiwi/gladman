---
title: 'DR-013b: Builder toolbar, layout and player pools'
description: 'Responsive native builder controls and semantic player-pool surfaces.'
---

## Identity and scope

- ID: DR-013b. Status: see the [backlog](../backlog.md).
- Parent: [DR-013](DR-013-club-team-builder.md). Prerequisite: DR-013a (Done).
- Design rules: [design refresh](../README.md).
- Mounted consumer: `/clubs/smash-for-fun` → permission-gated Ploegopstelling tab, confirmed 2026-11-13.
- Nx project: `frontend-pages-club`; translations in the existing nl/fr/en `all.json` files.
- Sources: [template][template] and [component][component].
- Preserve actions, sort/filter values, duplicate pool slots, drop-list group/data/handlers, restore,
  permissions, service calculations and draft/save behavior.
- Exclude team-card internals (DR-013c), player-chip internals (DR-013d), dialogs (DR-013e/f/g),
  notifications/confirmations, service algorithms, shared theme, backend code and dependencies.

## Baseline and approach

- Dark wide browser baseline: fixed 288px sidebar plus three squeezed team columns inside the club content column.
  At 390px the page scroll width is 455px; the fixed pool and horizontal layout overflow.
- Toolbar contains English sort, backup, draft/performance and validation text. Search has only an English placeholder;
  add-player and team-type selects have no explicit accessible labels.
- Pool wrappers repeat borders/backgrounds, including red/gray light/dark palette pairs.
- Use native Toolbar and Panel surfaces, labeled native controls, localized copy and a stacked mobile layout.
  Retain minimal semantic dashed drop affordances and bounded scroll areas.
- Existing smart service, presentational team card and player chip already separate concerns.
  Reuse them; no one-to-one wrappers or new component solely to conceal class lists.

## Implementation checklist

- [x] Confirm mounted consumer, prerequisites and bounded scope.
- [x] Implement native controls/surfaces and responsive layout.
- [x] Preserve drop bindings, actions, slot counts and localization.
- [x] Record focused validation and remaining limitations.

## Acceptance and verification

- [x] Light/dark at 1440px and 390px fit without builder-induced horizontal overflow.
- [x] Toolbar, player search, backup checkbox and restore controls have localized accessible names.
- [x] Filtering, sort/backup toggles and overlay dismissal work without saving or changing player assignments.
- [x] Native semantic surfaces replace palette pairs; no new SCSS or equivalent appearance overrides.
- [ ] Relevant empty/loading/error/disabled and populated pool states are checked safely.
- [x] Drag/drop/restore and duplicate-slot behavior are preserved by focused regressions.
- [ ] Keyboard/focus and contrast are checked with any inherited failures recorded.
- [x] Focused Nx lint/build and tests with the existing zoneless setup override pass.
- [ ] Default club test setup passes (existing DR-059 failure).
- [x] User approves completion with the disclosed limits (2026-11-13; unchecked checks remain unverified).

## Evidence and handoff

- Implemented and explicitly approved with disclosed limits on 2026-11-13. Worktree clean before selection.
- Native Toolbar with one wrapping action group, native Panels for distinct player pools, explicit labels for
  autocomplete/search/checkbox, localized sort-button accessible names, contextual restore labels and native empty-team
  Message. Import is secondary so Save remains the primary action.
- Mobile stacks pools above teams; wide layouts keep a 252px pool column (the app uses a 14px root font).
  Team columns are reduced to avoid the baseline's squeezed cards. The wide pool column remains sticky below
  the app header; scrolling to the last team keeps its first Panel at 70px.
- Preserve the CDK group, three pool destinations, drag data, duplicate slots, handlers, restore callback and
  all team-card input/output bindings. No changes inside team cards, player chips or service algorithms.
- New nl/fr/en copy is under `all.club.teamBuilder.controls.*` (15 matching keys).
  The existing translation watcher regenerated `libs/utils/i18n/src/lib/i18n.generated.ts`; its diff contains
  only these keys. No hand edits to generated output.
- Template `class` tokens: 136 → 111, using whitespace-separated tokens in literal `class` attributes.
  Remove repeated palette backgrounds, opacity and arbitrary viewport-height sizing; retain semantic dashed
  drop affordances, bounded list scrolling, responsive sizing and necessary sticky/grid layout.
- No new abstraction: existing service/team-card/player-chip separation already provides meaningful reuse.
  The different pool destinations do not justify another one-to-one Panel wrapper.
- Existing global Toolbar rules force start/end groups to `flex: 1 1 0%`. One native start group with wrapping
  actions avoids squeezed mobile columns without changing global rules or adding appearance overrides.
- Exceptions: none. No dependencies, operational mutations or shared theme changes. Scoped commit approved below.

### Validation commands

- PASS: repository Prettier `--write` on every changed source, test, generated and handoff file.
- PASS: `npx nx run-many -t lint build -p frontend-pages-club`
  (12 tasks succeed, 10 dependency tasks cached on the final run).
- PASS, pre-commit: `npx nx run-many --target=lint` (34 tasks succeed, two cached).
- FAIL before tests:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=club-team-builder-tab.component.spec.ts
--output-style=static`.
  The existing club setup requires missing `zone.js` (DR-059); no install or infrastructure change.
- PASS, two tests:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=club-team-builder-tab.component.spec.ts
--jestConfig=<temporary-config> --output-style=static`.
  Temporary `dr013b-jest.config.cjs` spread the existing club config, set its `rootDir` to the club project and
  replaced only `setupFilesAfterEnv` with the existing tournament zoneless setup.
  Removed after validation. The [regressions][test] render the real template and verify labels, live locale changes
  for sort accessible names, duplicate draggable slots, all three pool drop callbacks, filtering and restore.
- PASS: all three translation files parse and the 15 new key names match.
- PASS: `git diff --check`.
- NOT RUN: full application build, full suite, dedicated SSR/hydration, fr/en browser review, live team save,
  add/remove/restore assignments or survey import.

### Browser evidence

Real mounted tab, Dutch, no fixture or operational data mutations:

| Theme | Viewport  | Document scroll width | Outcome                                       |
| ----- | --------- | --------------------- | --------------------------------------------- |
| Dark  | 1440×1000 | 1425px                | Toolbar fits; pool/team columns readable      |
| Light | 1440×1000 | 1425px                | Semantic surfaces and labels readable         |
| Dark  | 390×844   | 375px                 | Pools stack; no horizontal overflow           |
| Light | 390×844   | 375px                 | Actions wrap; fields and empty pool contained |

- Before dark wide/narrow and after all four theme/viewport combinations inspected using browser screenshots.
  Screenshots remain in chat, not committed. Before narrow scroll width was 455px.
- Final dark wide check confirms the enlarged team-type select label is untruncated (187px client/scroll width).
  Sticky pool behavior rechecked at the last team. Narrow stopping/remove Panels and first team also inspected.
- Real data has nine team cards, seven valid teams, no unassigned/stopping/removed players.
  Filter shows the translated no-match state and clearing restores the translated all-assigned state.
  Sort Index/Name pressed states and backup checkbox toggle and restore successfully.
- Keyboard: team-type select opens with ArrowDown, shows M/F/MX, and Escape dismisses without adding a team.
  Space activates Index; Name is restored. Search-label activation focuses the input; its native focus border
  is visible. This is not a full keyboard-only drag/drop accessibility pass.
- Light text contrast (computed CSS colors converted to sRGB): labels 19.87:1, input text 13.61:1,
  muted empty-state text 4.87:1, secondary Import 7.74:1. Dark Panel labels 16:1 and muted empty text 6.65:1.
  Existing light Save text remains 3.65:1 (DR-033); no full contrast pass is claimed.
- Translation changes restarted the API: waited until port 5000 returned before reloading. The restart produced
  transient 502s; HMR also aborted read requests. The mounted data and controls rendered after recovery.
- Original dark document class restored; persisted theme preference untouched.

### Approval and next action

On 2026-11-13 the user selected **"Approve and commit DR-013b with disclosed limits"** after the review summary.
DR-013b is Done by that explicit approval, not by treating unperformed checks as passed.
Accepted limits: browser loading/error/no-team/removed-player states, real drag/drop/restore and save workflows,
full keyboard/contrast including DR-033, fr/en browser, default club tests (DR-059), dedicated SSR/hydration,
full application build and full suite. All corresponding unchecked criteria remain unchecked.
Approval authorizes only this slice's implementation, tests, generated translation keys and repository handoff commit.
Only approval/handoff documentation changed after focused validation; no application revalidation is needed.
Default native select-trigger English feedback remains part of DR-037, not this page-only slice.
Keep DR-013 open. Next candidate: scope DR-013c team cards before implementation; it has not been started.
No push authorized.

[template]: ../../../libs/frontend/pages/club/src/pages/detail/tabs/club-team-builder-tab.component.html
[component]: ../../../libs/frontend/pages/club/src/pages/detail/tabs/club-team-builder-tab.component.ts
[test]: ../../../libs/frontend/pages/club/src/pages/detail/tabs/club-team-builder-tab.component.spec.ts
