---
title: 'DR-013d: Builder player chips'
description: 'Semantic, accessible player rows shared by the mounted builder pools and team cards.'
---

## Identity and scope

- ID: DR-013d. Status: see the [backlog](../backlog.md).
- Parent: [DR-013](DR-013-club-team-builder.md). Prerequisite: DR-013c (Done).
- Design rules: [design refresh](../README.md).
- Mounted consumer: `/clubs/smash-for-fun` -> Ploegopstelling, confirmed 2026-11-13 (72 chips).
- Nx projects: `frontend-pages-club`, plus `frontend-pages-player` for its shared membership-label consumer.
  Existing nl/fr/en translation files and generated translation keys.
- Shared presentation: [component][component] and [template][template], consumed by
  [pools][pools] and [team cards][cards]. Reuse the existing smart/service and presentational separation.
- Preserve ranking fallbacks, mixed-ranking visibility, warnings, survey values, membership output,
  player-click output, double-click editing and the parents' CDK payloads.
- Exclude dialog internals (DR-013e/f/g), service-generated feedback (DR-013h), algorithms, backend behavior,
  permissions, shared theme and dependencies. No operational mutations.

## Baseline and approach

- Clean worktree at selection. Before screenshot: first mounted team card in dark mode.
- The row uses orange/red palette icons, hover-only details, a clickable non-keyboard Tag for membership,
  English labels and duplicated warning presentation in the popover.
- Keep one chip implementation for all real consumers; compute warning metadata once for one compact native Tag
  (count when multiple indicators apply, strongest severity) and the complete popover status list.
- Use native secondary text Button for explicit detail access (keyboard and touch as well as pointer),
  native small membership Button and native severity Tags. Preserve double-click editing and provide an
  explicit edit action within the details. Hover and click share the same native Popover and positioning:
  hover is non-modal without focus movement; click pins it with focus containment.
- Keep compact ranking numbers, semantic borders and minimal flex/wrapping utilities, without nested Cards,
  SCSS, inline CSS or a new wrapper component. One documented scoped small-Button paddingX token removes
  extra horizontal name padding; measured outer insets are equal.

## Implementation checklist

- [x] Confirm mounted consumers, prerequisites and bounded scope.
- [x] Simplify semantic presentation and localize component-owned text.
- [x] Preserve ranking, warning, survey and parent action behavior (source and focused tests).
- [x] Validate focused checks and mounted card consumers; persist evidence and remaining limits.

## Acceptance and verification

- [x] Native semantic controls; zero new palette colors, SCSS or inline CSS.
- [x] Warning metadata is rendered consistently in the row and details.
- [x] Membership and edit actions retain their exact output payloads (tests; no live membership mutation).
- [x] Fallback rankings and mixed-ranking visibility are preserved.
- [x] Survey preferences, negative 75% answers and unavailability remain available (component fixtures).
- [x] Light/dark, wide/narrow mounted card rows fit without horizontal overflow.
- [ ] Populated pool rows verified in the browser (current pools are empty).
- [x] Keyboard detail access/dismissal, membership/edit labels and sampled text/icon contrast verified.
- [x] Hover/click preserve the exact same panel and rectangle, including native upward flipping.
- [x] Reusable copy lives in shared common/domain namespaces; existing membership consumers migrated.
- [ ] Full accessibility and contrast, including inherited secondary-button focus-ring contrast.
- [x] All warning states, no survey and missing rankings verified with safe component fixtures.
- [ ] Unusually long/missing data and rich survey layouts verified in the browser.
- [x] Focused Nx lint/build/tests with the existing zoneless override pass.
- [ ] Default club test setup passes (existing DR-059 failure).
- [ ] Live membership, drag/drop, survey/team save workflows verified.
- [ ] fr/en browser localization and SSR/hydration verified.
- [x] User visual review or explicit approval with disclosed limits.

## Evidence and handoff

- Implemented and explicitly approved 2026-11-13 with disclosed limits. No operational mutations.
- Keep the existing chip/presentational component and smart parent/service boundary. Both pool render sites
  and the card's grouped render site use this one presentation; no new component or primitive wrapper.
- One compact warning Tag and detailed Tags share one computed metadata array. Preserve service-provided
  warning text verbatim (its English remains DR-013h), percentages, survey preferences and rank fallback 12.
- Replace non-keyboard membership Tag with native small outlined secondary Button. Shared membership
  abbreviations: en B/R (Base/Reserve), nl B/R (Basis/Reserve), fr T/R (Titulaire/Réserve).
  Hover/focus tooltip names the current state; the contextual action name also describes the next state.
  An initial native success-outline trial used low-contrast green text in light mode, so it was discarded
  rather than overridden with page colors; the native Button audit remains DR-033.
- Hover and the name Button open/pin one native Popover; retain row double-click editing and add an explicit
  edit-survey action. Membership double-click does not bubble into survey editing.
  A 150ms hide delay permits pointer crossing into the panel; pointer entry cancels it, with destroy cleanup.
  Unlike the rejected separate Tooltip/Popover attempt, the panel/content cannot flip independently.
- Installed Popover lacks some behavior described by generated docs: explicitly use native FocusTrap,
  an edit Button with autofocus only while pinned, trigger haspopup/expanded and Escape focus return.
  Real-browser checking caught unconditional HTML autofocus stealing focus even with focusOnShow=false;
  conditional autofocus fixes that and the existing hover/pin regression now checks both states.
  Follow-up DR-063 records the
  need to inspect other real consumers separately. No global fix or custom keyboard navigation abstraction.
- Literal template `class` tokens: 168 -> 54. Remaining utilities support row wrapping/minimum name basis,
  compact ranking layout, readable survey definitions and popover width. Remove palette colors and duplicated
  status markup; no SCSS or inline CSS. The scoped native Button token is described above.
- Shared copy: `all.team.membership.<REGULAR|BACKUP>` owns label, abbreviation and assignment action;
  `all.team.numbered` owns numbered headings. Reuse existing `all.team.preferred-day` and `all.common.viewDetails`.
  Remarks and choice summaries belong to `all.common`, ranking summaries to `all.ranking`,
  new-player text and survey copy to `all.player`. Only five builder-specific indicator/availability keys remain.
- Migrate team edit options, the team-player table and player-profile team Tags to the shared membership labels;
  remove the old form/sidebar duplicate keys. English Base and French Titulaire are intentionally standardized
  from existing labels, rather than retaining conflicting terms for the same membership state.
  Existing form-specific team-number label/placeholder remain separate from interpolated numbered headings.
- Add 22 matching keys and remove five duplicated membership keys in each locale.
  The existing watcher regenerates `libs/utils/i18n/src/lib/i18n.generated.ts`; never hand-edit it.

### Validation commands and results

- PASS: repository Prettier `--write` on every changed source, test, generated and handoff file.
- PASS: `npx nx run-many -t lint build -p frontend-pages-club frontend-pages-player`
  (14 tasks, final run 12 cached). Re-run after conditional autofocus and shared-label migration.
- PASS before commit: `npx nx run-many --target=lint --output-style=static` (34 projects; existing warnings).
- FAIL before tests:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=player-chip.component.spec.ts
--output-style=static`.
  Existing missing `zone.js` in the club test setup (DR-059). No install or shared test configuration change.
- PASS:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=team-builder
--jestConfig=tmp\dr013d-jest.config.cjs --output-style=static` (five suites, 13 tests).
  Re-run after final source changes. Five chip regressions cover named actions/output payloads,
  membership double-click isolation, all indicators/severities/percentages, both teams' survey choices,
  negative availability answers, remarks, unavailability, missing ranks, no-survey state, combined severity,
  membership tooltips and hover/pinned panel identity, focus and conditional autofocus.
  Existing card and builder regressions remain passing.
- Temporary config spreads the existing club config and replaces only setupFilesAfterEnv with the existing
  tournament zoneless setup, with rootDir pointed at the club project. Removed after validation.
  Initial test attempts exposed fixture-only issues (opening the overlay without its render flag, missing
  choice translations, and losing the Player fullName getter through object spread); corrected fixtures pass.
- PASS: Node JSON parsing and full locale-key parity; all 22 new keys also have matching interpolation parameters.
  No remaining source references to removed builder/form/sidebar translation paths; generated diff matches this slice.
  Initial Windows PowerShell ConvertFrom-Json cannot parse inherited case-distinct `other`/`Other` keys,
  so validation uses standard case-sensitive JSON.parse instead.
- PASS: `git diff --check`.
- NOT RUN: full application build/suite, fr/en browser, dedicated SSR/hydration, live membership/drag/drop/save,
  full accessibility or browser fixtures for rich survey/long/missing data and populated pools.

### Browser evidence

Real mounted Dutch tab; 72 card chips in nine teams. Pools are mounted but currently empty; do not claim a
populated-pool browser pass. Before/after screenshots remain in chat, not committed.

| Theme | Viewport  | Document scroll width | Chip horizontal overflow |
| ----- | --------- | --------------------- | ------------------------ |
| Light | 390x844   | 375px                 | None, all 72 chips       |
| Dark  | 390x844   | 375px                 | None, all 72 chips       |
| Light | 1440x1000 | 1425px                | None, all 72 chips       |
| Dark  | 1440x1000 | 1425px                | None, all 72 chips       |

- Final shared-panel checks repeat all four document-width and row-overflow measurements above after responsive
  layout settles; immediate measurements during viewport resizing are not used as final evidence.
  Minimum visible name-label width: 85.58px narrow / 415.08px wide for this dataset.
- Enter on the name opens details and focuses the edit Button. Tab and Shift+Tab remain inside;
  Escape closes and returns focus to the same trigger, with expanded true -> false.
- Narrow detail bounds fit the viewport (approximately x=63 to 305 at 390px), without internal overflow.
  Details retain all three rank values even when the non-mixed row deliberately omits mixed ranking.
- Explicit edit action opens the existing survey dialog for the correct player; the popover disappears.
  Cancel closes without applying or saving. Dialog English and internals remain DR-013f.
- Final eight-case matrix: both themes at 390px/1440px, normal and near-bottom anchors.
  Hover is non-modal and preserves focus; clicking retains the exact DOM panel and all rectangle coordinates
  within 1px, changes to modal and focuses edit. Normal panels open below, near-bottom panels above, with
  the same direction after pinning. Tab containment and Escape return pass in every case; no row overflow.
- Pointer crossing preserves the panel beyond its 150ms delay (checked after 220ms); leaving closes it.
  The mounted abbreviation is B and its tooltip is Basis. The migrated player profile also renders Basis.
  Existing team edit/table label changes have build/source checks, not a separate mounted workflow pass.
- Equal outer Button insets measured 4.5px (root padding 3.5px) during the feedback pass.
- Sampled light/dark contrast: name, ranks and secondary membership text 4.87/6.65:1;
  warning indicator 4.52/9.36:1. Native membership target 28.19x27.5px, above 24px minimum.
  These are samples, not a full contrast/a11y pass; inherited secondary focus-ring audit remains DR-032.
- Translation changes caused expected API restarts and transient 502/resource errors.
  Waited for a successful port-5000 GraphQL `{ __typename }` read, then reloaded the real mounted page
  through the frontend proxy and checked loaded localized data. No operational request was made.
- Original dark theme and original 1717x1272 viewport restored; persisted theme preference untouched.

### Approval and next action

Feedback is implemented and revalidated: combined indicators, equal padding, shared Basis (B)/Reserve labels,
hover/focus membership explanation, and one shared hover/click panel with identical positioning.
The click-only first review and separate Tooltip/Popover intermediate attempt are superseded by this evidence.
The user explicitly approved `Approve and commit DR-013d with disclosed limits` on 2026-11-13.
This child is Done; all remaining unchecked verification limits above are accepted, not claimed as passed.
Approval authorizes only this slice's implementation, tests, translations/generated keys and handoff commit.
Keep parent DR-013 open. Next candidate: scope DR-013e survey import before implementation; not started.
No push is authorized.

[component]: ../../../libs/frontend/pages/club/src/components/team-builder/player-chip.component.ts
[template]: ../../../libs/frontend/pages/club/src/components/team-builder/player-chip.component.html
[pools]: ../../../libs/frontend/pages/club/src/pages/detail/tabs/club-team-builder-tab.component.html
[cards]: ../../../libs/frontend/pages/club/src/components/team-builder/builder-team-card.component.html
