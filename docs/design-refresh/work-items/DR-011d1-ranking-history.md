---
title: 'DR-011d1: Ranking history and read states'
description: 'Native ranking history tables, accessible edit entry points and explicit read feedback.'
---

## Identity and scope

- ID: DR-011d1. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-011d](DR-011d-player-ranking.md). No incomplete prerequisites.
- Design rules: [refresh plan](../README.md).
- Mounted consumer: `/players/glenn-latomme/edit`, Ranking tab, confirmed 2026-11-25.
- Project: `frontend-pages-player`; [component][component] and [template][template].
- Scope: grouped history presentation, read lifecycle and named edit entry points into the unchanged dialog.
- Preserve descending date order, group membership, initial expanded group, multiple expansion, rank/point values,
  add/edit targets and existing GraphQL query/variables/fetch policy.
- Exclude dialog contents, mutations, authorization, page/other forms, shared/global styles and dependency changes.
- Directly related scope: two read-state translations in existing English/Dutch/French catalogs and generated types.

## Baseline and approach

- Clean existing `main`; latest commit `643aee47` contains approved DR-011c.
- Hydrated baseline: 41 accordion groups, 313 custom clickable div rows, no tables or named row edit buttons.
  First group contains five updates, ranks 8/7/9, with dated point metadata.
- Rows are pointer-only, point zeroes are hidden by truthiness, headers do not wrap and reads have no error feedback.
- History-only baseline (before `<p-dialog>`): 19 class attributes, 63 utility tokens, 31 unique utilities.
- Replace custom tiles with native small scrollable Tables within the existing Accordion and native edit Buttons.
  Name each actual table with a semantic caption using the established `colgroup` pattern; no pass-through bindings.
- Preserve all three rank values with individually named optional point metadata; show zero points, omit missing points.
- Use native Messages for empty/read error and named progress/status for loading.
- Keep orchestration in the existing form child; no repeated domain structure justifies extraction.
- The host-only SCSS remains because deleting it would also change the excluded dialog host.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and one bounded child.
- [x] Preserve grouping, data, add/edit targeting and adjacent dialog behavior.
- [x] Use native PrimeNG/semantic markup without new styling exceptions.
- [x] Cover read states, stale responses, optional zero points and accessible edit targeting.
- [x] Leave shared/global code and adjacent forms unchanged.
- [x] Persist exact validation and review limits.

## Acceptance and verification

- [x] Actual tables have translated names, column headers and keyboard-operable dated edit actions.
- [x] Group order/counts and rank/point values are preserved; unit checks cover zero and absent points.
- [x] Loading, empty, missing context and failed/partial reads are distinguishable; stale reads cannot replace context.
- [x] Settled light/dark 390px/1440px layouts, contained scrolling and multiple expansion remain usable.
- [x] Visible Tab focus, labels, sampled contrast and Enter/Escape dialog entry/exit checked without mutations.
- [x] No new palette utilities, styles, dependencies, shared/global changes or pass-through bindings.
- [x] Relevant Nx test/lint/build checks pass.
- [ ] Full visual/accessibility, screen-reader/touch, locale and SSR/hydration checks pass.
- [x] Required user review/approval obtained with documented verification limits.

## Evidence and handoff

- Before evidence: mounted counts/text and local dark history crop inspected; no private screenshot committed.
- After: 41 native tables/313 dated edit buttons retain all 41 groups/313 records.
  First group still has five updates, ranks 8/7/9, with first-row points 68/234/31.
  Actual table names include `Ranking: Volgende ranking` and `Ranking: Sep 8, 2026`.
- Direct native Table use retains the existing Accordion. Named native edit icons occupy the leading Actions column,
  keeping focus visible on narrow screens. Plain date cells match the three rank columns' body typography and color.
  All cells are top-aligned; native info Tags identify ranking updates in the dated accordion headings, not body cells.
  Headers use existing canonical localized discipline labels; metadata says only the translated `Points: value`.
  Dates and point metadata stay unbroken; narrow data scrolls locally.
- Read lifecycle now names loading and distinguishes empty from rejected, partial or missing data/context.
  A request sequence prevents stale success/failure/finally from replacing current player/system state.
  Existing query, variables, fetch policy and grouping algorithm are unchanged.
- Two new `all.ranking.edit` keys (`loading`, `load-error`) exist in English, Dutch and French and their generated type.
  Dutch fixture rendering resolves both. A case-sensitive Node JSON check passes all three catalogs.
  Initial Windows PowerShell JSON parsing rejected existing case-distinct `other`/`Other` keys; no catalog fix
  was needed or made for that tool limitation.
- History-only metrics: class attributes 19 -> 13; utility tokens 63 -> 20; unique utilities 31 -> 13.
  Removed custom bordered/hover tiles, manual badges, pointer-only handlers and duplicate TranslateModule import.
  The existing host-only SCSS and excluded dialog remain unchanged; a scoped comparison confirms identical dialog markup.
- Reuse decision: keep the existing page/form boundary and direct native components. No new abstraction.
- Exceptions introduced: none. No dependencies, operational actions, shared/global styles or authorization changes.

### Automated validation

- Repository Prettier run for every changed document, component, template, test, catalog and generated type.
- `npx nx run frontend-pages-player:test --runInBand`
  `--testPathPatterns=player-ranking.component.spec.ts page-edit.component.spec.ts --output-style=static`:
  passed, two suites/21 tests (ten ranking, eleven parent editor).
  Existing ts-jest isolated-module/decorator metadata warning remains.
- `npx nx run-many -t lint build -p frontend-pages-player --output-style=static`:
  passed, twelve tasks, ten cached. Twenty existing lint warnings remain, no errors or new warnings.
  Final run repeated after the readable narrow scrolling adjustment; tests/lint/build still pass.
- Focused cases cover query shape, descending/group boundaries, zero/absent points, table names/headers,
  exact existing/add dialog targeting without mutation, rejected/missing/partial reads,
  stale success/failure suppression and missing/recovered system/player context.
- Parent test mock now supplies the real RankingSystemService `loaded` selector; production parent code is unchanged.
- `git diff --check`, LF/frontmatter across twelve changed files and 508 local documentation links: passed.
  Scoped added-line check finds no new forbidden palette utilities, pass-through or style bindings.
  Existing Git LF-to-CRLF index warnings remain; actual changed files use LF.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 22 of 34 targets pass
  (nineteen successful targets cached); twelve fail existing `@nx/dependency-checks`, matching DR-011c:
  backend-seo, backend-health, shared, backend-authorization, backend-ranking, i18n, backend-search,
  backend-translate, utils, backend-database, backend-graphql and frontend-modules-translation.
  Errors concern unchanged dependency versions, unused dependencies and missing peer declarations.
  Player lint passes. No unrelated manifest changes, dependency installation or skipped checks.

### Browser evidence and limits

- External Browser Task Group confirms the mounted real-data baseline and post-change counts/first-row values.
  Its Agent Tab was closed and Task Group finalized successfully, without changing a user-owned tab.
- Integrated browser final settled matrix: dark/light at 1440px/390px, height 900px.
  Client/document widths match at 1425px/375px respectively, including the native scrollbar.
  After the final label/indicator feedback, narrow content uses a 316px region with 432px scrollable data
  for the first group and 424px for the update group; wide content remains contained without page overflow.
- Native Tab reaches the fully visible dated edit button with `:focus-visible` and a solid outline in all four cases.
  Enter opens the existing editor; Escape closes it. The original source date and form Date milliseconds match,
  and ranks remain 8/7/9. No form value was saved and no delete/save was clicked.
- Multiple expansion and Enter/Space collapse verified. Native ArrowRight scrolls the narrow content region
  (observed scrollLeft 40) while the page remains 375px wide.
- Runtime read-only state fixtures exercise named loading, error and empty feedback in all four theme/width cases.
  Dutch text resolves, no raw keys; data restores after each case. This is presentation evidence, not a real failed API.
  Missing-system, stale and partial responses are exercised by focused tests, not claimed as live browser failures.
- Sampled rank/metadata contrast passes after converting actual CSS OKLCH colors to sRGB via canvas:
  dark 14.52/7.82:1; light 19.87/4.87:1. Corrected plain date colors match the unchanged rank colors in both themes.
  An initial RGB-only parser could not measure OKLCH;
  its invalid readings were discarded, not counted as contrast failures.
- Final light-narrow/dark-wide history-only crops inspected. No private screenshot or browser log committed.
  This is not a full screenshot matrix, full contrast audit, screen-reader/touch or locale-switching pass.
- Initial table-in-accordion intrinsic width overflow was fixed locally with `overflow-x-auto`.
  The edit action remains in the first column, separate from dates; no-wrap text preserves readable dates/metadata.
  No SCSS, inline/global style or pass-through workaround remains from the diagnosis.
- Early geometry reads during native transitions are not settled passes; final width/focus checks supersede them.
  Early post-HMR tab selection was reset during hydration; selected the settled mounted Ranking tab before final checks.
  Existing view-transition `InvalidStateError` console messages were observed; no hydration/SSR pass is inferred.
- Existing DR-033/034/076 shared findings remain open; no shared contrast fix is claimed.
  Full accessibility, locale and SSR/hydration verification remains unchecked.
- Temporary component-state/layout fixtures are removed; the original home URL, dark presentation and 1571x1272
  geometry are restored. No authentication/storage state changed and no service was started, stopped or restarted.

### Date-layout review correction

- User feedback: the date layout differed from other columns and ranking-update badges offset it.
- Replaced the centered button/row-header date with a plain native body cell. The native edit icon has its own leading
  Actions cell; the optional update Tag occupies a separate line below the date. All body cells use top alignment.
- Extended the existing focused test to require a plain date and separate action.
  The intermediate below-date Tag placement was superseded by the user's subsequent heading choice below.
  Repeated both focused suites and player lint/build: twenty tests pass, twenty existing lint warnings remain.
- Repeated light/dark 390px/1440px checks for both ordinary and update rows.
  Date/rank text tops are both 5.25px below the row top; date inset is 7px in both row types.
  Both use native 14px/400 text with identical colors. Moving the badge into the heading preserves that alignment.
- The edit icon retains visible, fully contained Tab focus and Enter/Escape entry/exit in all four cases.
  No page overflow or real mutation; final corrected light-narrow update-group crop inspected.
  Full visual/accessibility/locale/SSR limits and pending user review remain unchanged.

### Heading indicator and concise translated labels

- User selected `In the dated accordion heading` for the ranking-update indicator.
  Moved the native Tag there for groups with an update anchor; no Tags remain in table bodies or upcoming-only headings.
- Removed discipline prefixes from point metadata. Reused `all.ranking.breakdown.points` rather than adding new keys.
  Real Dutch rendering is now `Punten: 68`, `Punten: 234`, `Punten: 31`.
- Replaced the editor-specific header key construction with the existing canonical game-discipline translation keys.
  Actual catalogs contain English Singles/Doubles/Mixed, Dutch Enkel/Dubbel/Gemengd and French Simples/Doubles/Mixte.
  The excluded dialog still uses its existing editor labels; no shared catalog label or dialog was silently changed.
- Added one component regression that switches among those three locales and verifies translated headers and
  concise zero-point metadata. Actual catalog keys separately checked with Node.
  Final focused tests: two suites/21 tests. Player lint/build pass again; twenty existing warnings remain.
- Repeated settled dark/light 390px/1440px checks: 41 groups/313 rows, no page overflow, zero body Tags,
  one Tag in the dated test heading, translated headers/points and fully contained visible Tab focus.
  Date/rank text top offsets remain 5.25px in both ordinary and update rows.
- Final light-narrow update-group crop inspected. Original home URL, dark presentation and 1571x1272 geometry restored.
  No mutation, dependency, style, service or authorization change. Utility metrics remain 13 attributes/20 tokens.
- Subsequent explicit approval: `Approve DR-011d1 with documented limits and commit`.
  DR-011d1 is Done; unperformed verification criteria remain unchecked.

### Exact next action

- Commit only the approved DR-011d1 slice and its handoff on existing `main`. Do not push without a separate request.
- Preserve the accepted unperformed visual/accessibility/locale/SSR checks as unchecked.
- DR-011/DR-011d stay open; scope DR-011d2 dialog/validation/mutation feedback in a subsequent invocation,
  after this child's approved completion. Do not start it here.

[component]: ../../../libs/frontend/pages/player/src/pages/edit/components/player-ranking/player-ranking.component.ts
[template]: ../../../libs/frontend/pages/player/src/pages/edit/components/player-ranking/player-ranking.component.html
