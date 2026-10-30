---
title: 'DR-017i: Assembly partner combinations'
description: 'Responsive, native PrimeNG presentation for the mounted partner statistics disclosure.'
---

## Identity and scope

- ID: DR-017i. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Completed DR-017a-h remain unchanged.
- Design rules: [design refresh](../README.md).
- Confirmed consumer on 2026-10-30: `/competition/assembly` mounts
  [AssemblyComponent](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html),
  whose desktop branch mounts
  [PartnerCombinationsComponent](../../../libs/frontend/pages/competition/src/pages/assembly/components/partner-combinations/partner-combinations.component.ts).
  The supplied encounter/team/club/season URL renders nine historical pairs in the integrated browser.
- Project: `frontend-pages-competition`.
- Scope: only the existing partner-combinations template, its imports and focused component tests.
- Preserve nonempty-data visibility, desktop-only mounting, expanded-by-default toggleable Fieldset,
  four time ranges, conditional weeks with bounds 1-52, explicit forced refresh, descending total sort,
  four-name global filtering, conditional paginator above ten records and twenty rows per page.
- Exclude completed children, other assembly controls, generator/service/query behavior, mobile selectors,
  shared components, global theme, backend, translation assets and operational mutations.

## Baseline and approach

- Existing native Fieldset and Table already provide useful domain structure; retain them, without another Card.
- The fixed-width, single-line toolbar has an unlabeled weeks input, placeholder-only search and icon-only refresh.
- Preserve the compact full-width control row and icon-only refresh, using accessible translated names rather
  than duplicate visible labels. Use native `button[pButton]`, a hover/focus Tooltip, busy/disabled semantics
  and an explicit spinner. Use native table size/striping inputs instead of legacy CSS names.
- Replace green/red percentage classes with native success/danger Tags and the existing translated statistic label.
- One real consumer exists. No extra smart/presentational split or generic wrapper is justified; styling stays here.
- Capture safe synthetic before/after browser evidence. No server data changes are authorized.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and bounded scope.
- [x] Preserve data, translations, filters, sorting, refresh and disclosure.
- [x] Use native options, semantic utilities and no custom styles/overrides.
- [x] Check the actual responsive consumer without changing adjacent completed surfaces.
- [x] Record unrelated discoveries separately.

## Acceptance and verification

- [x] Named time-range, conditional weeks, refresh and search controls resolve in English, Dutch and French.
- [x] All four time-range values and selected weeks reach the existing forced-refresh service contract.
- [x] Loading prevents duplicate refresh and exposes busy state without changing the dataset.
- [x] Name filtering, empty filtered result, descending sorting, paginator threshold and twenty-row paging work.
- [x] Native disclosure remains expanded initially and supports keyboard collapse/expand.
- [x] Percentage text and existing 50% success/danger threshold remain, with a translated statistic label.
- [x] Zero stats still hides the disclosure; mobile still omits this desktop-only component.
- [x] Light/dark at 390/820/1280/1440px, long names and last-weeks layout are checked.
- [ ] Keyboard, focus, labels, contrast and applicable interaction states are checked.
- [ ] Relevant SSR/hydration and existing locale behavior are checked.
- [x] Focused Nx tests, lint and library build pass.
- [x] User visual review/approval is recorded.

## Evidence and handoff

- Worktree was clean before selection.
- Baseline: nine rows confirmed mounted; browser reports the previously recorded NG01354 warnings.
- Changed scope: only the partner-combinations template/imports and its new focused spec, plus the parent/backlog
  and this brief. No service, backend, translation asset, shared component or theme changes.
- Retained the native toggleable Fieldset; no wrapper, host styles, token overrides, PassThrough or dependency added.
  The existing component is the one styling location for its single real consumer; no artificial split introduced.
- Utility comparison after user correction: static authored class tokens increase from 10 (9 unique) to 12
  (10 unique). Flexible Select/search widths replace fixed widths and `ml-auto`; the existing row can wrap.
  One width-constraining weeks wrapper keeps the native fluid input compact rather than allowing inherited
  full-width input styling to split the toolbar. Two green/red palette bindings are removed.
  Native Table `size="small"` and `stripedRows` replace the two legacy style classes.
  Icon/spinner classes are native PrimeIcons, not a new styling layer.

### Validation on 2026-10-30

- Passed formatting: `npx prettier --write` on all six changed files.
- Initial focused test command `npx nx run frontend-pages-competition:test --runInBand
--testPathPatterns=partner-combinations` failed five filtering assertions because the test did not await the
  native debounce. Corrected the test helper to await the actual `filterDelay()`; no production workaround.
- Passed `npx nx run-many -p frontend-pages-competition -t test lint build --output-style=static`:
  all 215 tests in 13 suites, including 18 new partner tests; lint has 41 existing warnings and no errors;
  library build and its 10 prerequisite tasks pass. Existing executor/metadata warnings remain.
- Passed isolated installed Chrome using the existing Playwright dependency, headless, no authentication.
  All data changes and the refresh stub were browser-memory-only; no operational/admin mutations.
  Waited for the real component and nonempty statistics after hydration before injecting synthetic pairs.
- Six desktop cases: 820/1280/1440px in light/dark, 23 synthetic pairs, 20 visible rows, last-weeks controls,
  long names, no zero-width/overflowing controls or table-container overflow. Inspected synthetic screenshots
  at 820px light and 1440px dark; long names wrap at 820px and remain readable at 1440px.
- Two mobile cases: 390px in both themes still omits the partner component and retains 13 assembly Selects.
- Passed name filtering, translated empty filtered state, clearing, 20/3-row pagination, initial descending total
  order and keyboard ascending sort. Tests additionally cover the exact 10-record paginator threshold,
  each of the four name fields, four range values, weeks bounds/model, and zero-stat visibility.
- Passed initial Select Space opening, four translated options, Escape dismissal, Tab to weeks then refresh,
  keyboard refresh calling exactly `loadStats('last-weeks', 7, true)` against a memory-only stub.
  Busy disables refresh and supplies hidden spinner/`aria-busy`, preserving rows.
- Passed Fieldset Enter collapse and Space expand, but subsequent Select/header keyboard access fails:
  the native Fieldset removes their original `tabindex="0"` after expansion.
  Installed `primeng-fieldset.mjs` `updateTabIndex()` explicitly removes each descendant tabindex when expanded,
  including the Select's focusable span and sortable table headers. DR-035 records the separate native audit.
  The Fieldset and Select were already present before this slice; no local focus-management patch was added.
- Stable text contrast, measured after theme transitions before the toolbar correction, composites native Tag fills
  over their actual table-row surfaces (unchanged by the correction):
  light success/danger 4.57:1/5.30:1, dark 10.51:1/9.18:1.
  The first-pass visible labels and refresh text were removed at user request; their earlier contrast
  measurements are not evidence for the final icon-only Button.
  Final icon hover/focus/disabled contrast and quantitative focus-ring painted-area checks remain unverified.
  Existing shared native Button audit DR-033 remains separate.
- Dutch SSR: supplied URL returns HTTP 200 and the named partner range/search controls and localized refresh name.
  The isolated browser successfully hydrates to the mounted component and reports zero page errors and
  zero GraphQL mutations. Existing NG01354 console warnings remain; this is not exhaustive hydration proof.
- Not run: actual screen-reader output/Tag announcement, mounted English/French (all three locale assets are
  covered by component tests), authenticated/save workflows and exhaustive hydration/focus/contrast checks.
- Before evidence: integrated browser synthetic dark wide screenshot captured before editing.
  After evidence: four synthetic screenshots (820/1440px, both themes) and JSON measurements captured in session
  artifacts. The repository observations above are the durable handoff; screenshots contain no production data.
  The integrated page was reloaded after inspection to restore its real data; isolated Chrome was closed.
- Exceptions: none.
- User approval authorizes committing only this child, its tests and repository handoff; no push.
- Exact next action in a fresh invocation: confirm/scope remaining mounted captain/add-player controls under
  DR-017, excluding completed DR-017a-i. DR-017 remains open; do not start another child in this invocation.

### User review correction on 2026-10-30

- The user rejected the first-pass expansion from icon to text refresh, duplicated visible search copy, and
  reduced-width controls, requesting comparison of the before/after screenshots. This is not completion approval.
- Compared the captured baseline against both first-pass and corrected synthetic screenshots.
  Restored the compact icon-only refresh with a translated accessible name and hover/focus Tooltip.
  Removed the visible range/weeks/search labels; all controls retain translated accessible names.
  Restored a full-width flexible toolbar with the search occupying the remaining substantial width,
  rather than quarter-width grid cells. Fieldset, dataset and table behavior remain unchanged.
- Reverified 12 desktop cases: 820/1280/1440px, both themes, default and last-weeks modes.
  Every case is one vertically aligned row, starts/ends at the toolbar edges, has no overflowing controls,
  zero duplicate visible labels and a 35px icon-only refresh. Search spans 358/588/609px in default mode,
  or 313/543/564px in weeks mode, at those three widths.
- Inspected corrected 1440px dark default and 820px light weeks screenshots with the same two safe pairs used
  for the baseline, including the deliberately long name. The default composition again matches the baseline.
  Eight corrected screenshots and JSON results are saved in session artifacts; these observations are durable.
- Passed real browser accessible-name assertions for refresh/search/weeks; focus Tooltip, Escape dismissal,
  keyboard refresh, filtered empty/clear, busy/spinner and both unchanged 390px mobile cases.
  Zero page errors and GraphQL mutations. The previously recorded DR-035 native Fieldset limitation remains.
- Initial correction tests selected the Select's internal empty Tooltip rather than the refresh Tooltip;
  corrected the assertion to inspect the Button's own directive. All 18 focused tests pass.
- Final `npx nx run-many -p frontend-pages-competition -t test lint build --output-style=static` passes again:
  all 215 tests in 13 suites, lint with 41 existing warnings/no errors, library build and 10 prerequisites.
  Changed files are formatted. At that point status remained Review, pending the approval recorded below.

### Completion approval

- On 2026-10-30, after the corrected before/after comparison, the user selected:
  "Approve completion and commit with the disclosed verification limits".
- Mark only DR-017i Done. Approval accepts the recorded DR-035 Fieldset keyboard limitation, remaining
  screen-reader/Tag announcement, exhaustive focus/icon contrast/hydration, mounted English/French and
  authenticated/save verification limits. These criteria remain unchecked; approval does not mean they passed.
- No shared styling overrides, dependency changes or workflow files are included. No push is authorized.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects with existing
  warnings and no errors. All approved files were formatted before validation; handoff additions are formatted too.
