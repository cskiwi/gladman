---
title: 'DR-017j: Assembly captain/add-player searches'
description: 'Accessible native player searches with one presentation per control across responsive layouts.'
---

## Identity and scope

- ID: DR-017j. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Completed DR-017a-i remain unchanged.
- Design rules: [design refresh](../README.md). No incomplete prerequisites.
- Confirmed consumer on 2026-10-30: `/competition/assembly`, through
  [competition routes](../../../libs/frontend/pages/competition/src/lib.routes.ts), mounts
  [AssemblyComponent](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html).
  Local season 2026, Smash For Fun, team 1H renders both desktop AutoCompletes.
- Project: `frontend-pages-competition`.
- Scope: captain/add-player AutoComplete presentation, responsive reuse and focused tests. User feedback
  explicitly includes a separate desktop captain Card above the existing player Card and add-player within it.
- Preserve regular/backup case-insensitive name search, captain ID form assignment, add-player dispatch,
  native forced selection, responsive ordering and permission behavior.
- Exclude completed children except the explicitly requested player-Card content grouping. Other assembly controls,
  mobile lineup Selects, services, shared components,
  theme, stylesheets, backend, translation assets and operational/admin mutations.

## Baseline and approach

- Two copies of each FloatLabel/AutoComplete repeat across the mobile and desktop branches.
  Labels have no `for`/input ID association. The add label is hard-coded Dutch.
  The installed PrimeNG 22 AutoComplete uses `optionLabel`, not the legacy literal `field="firstName"`.
- Reuse two named Angular templates with the already imported NgTemplateOutlet.
  Keep search/data/selection behavior in the existing smart assembly component, with presentation defined once
  per control. A new component or one-to-one PrimeNG wrapper would add no meaningful shared domain behavior.
- Keep native on-variant FloatLabel and AutoComplete, supply stable input IDs and native fluid sizing,
  use the existing localized `all.club.teamBuilder.addPlayer` copy and correct native option labels.
  One typed full-name callback names suggestions, accessible options and selected values consistently,
  distinguishing players sharing a first name without changing the selected object or captain ID contract.
  Native item templates wrap long names using only `whitespace-normal wrap-anywhere`.
- Baseline scoped authored static class tokens: four (`mb-2` twice and `mt-2` twice).
  No scoped custom styles exist; the assembly stylesheet remains unchanged.

## Implementation checklist

- [x] Confirm mounted consumer, bounded scope and dependencies.
- [x] Reuse responsive presentation and preserve search/selection contracts.
- [x] Use native options, semantic utilities and no custom styling.
- [x] Verify actual responsive consumers and leave adjacent surfaces unchanged.
- [x] Record discoveries outside scope separately.

## Acceptance and verification

- [x] One associated localized label per input, stable unique IDs and no hard-coded Dutch.
- [x] Native suggestions/selected value show full player names rather than object stringification.
- [x] Regular/backup name search, empty matches, force selection, captain ID and add-player dispatch pass.
- [x] Both branches reuse the same templates and retain their control ordering.
- [x] Light/dark at narrow/wide widths, long names and suggestion overlays remain usable.
- [ ] Keyboard, focus, labels, contrast and applicable interaction states are checked.
- [ ] Relevant SSR/hydration and locale behavior are checked.
- [x] Focused Nx tests, lint and library build pass.
- [x] User visual review/approval is recorded.

## Evidence and handoff

- Worktree was clean before selection.
- Baseline: integrated browser confirms two mounted searches with empty input IDs and unassociated labels.
  Existing populated assembly logs NG01354 child-control warnings; no browser console errors.
- Changed scope: assembly template, one typed callback in its existing component, one new focused spec,
  this brief, the parent and backlog. No service, backend, translation asset, shared component or theme changes.
- Presentation reuse: two named templates replace four duplicated controls. A new component would be a
  one-to-one primitive wrapper; template reuse retains the existing smart/presentational boundary more simply.
- Native API evidence: PrimeNG MCP AutoComplete FloatLabel example associates `inputId` with `label for`;
  installed `primeng-autocomplete.d.ts` documents `optionLabel` as a property or getter callback.
  Native fluid sizing is verified in component tests and the actual browser.
- Utility comparison after review: four scoped spacing tokens become seven tokens: four suggestion-wrapping
  tokens (two per template) and three layout tokens for the player-Card content stack.
  Four redundant spacing wrappers disappear; existing outer gaps separate the native captain/player Cards.
  Two item spans are necessary to override inherited native `white-space: nowrap` for long names.
  No numbered colors, new stylesheets, inline styling, token overrides, PassThrough or dependencies.
- Localized add-player copy reuses an existing exact-domain phrase from the club team builder in all three assets.
  No new translation asset or server restart is needed.
- The new full-name display is intentional: it fixes legacy object labels and ambiguous first-name-only
  accessible options. Selected player objects, IDs, search pools and service methods are unchanged.
- Initial long-name browser inspection found native nowrap expanding the overlay past the mobile viewport.
  The two wrapping utilities fix this introduced overflow without constraining global overlays.
- Existing focused FloatLabel light contrast remains DR-031; no page-level styling workaround.
  Existing populated-lineup NG01354 warnings remain the parent's separate form-registration follow-up.

### Validation on 2026-10-30

- Passed formatting: `npx prettier --write` on all six changed files before validation; handoff updates formatted too.
- Initial `npx nx run frontend-pages-competition:test --runInBand --testPathPatterns=assembly-player-searches`
  exposed missing native debounce waits. Subsequent focused runs exposed missing JSDOM `matchMedia`,
  the native empty-message option and native force selection occurring after overlay dismissal.
  Tests now wait for the real `delay()`, reuse the existing test-only media mock and exercise Escape/change.
  No production timing, overlay or validation workaround was introduced.
- Passed final `npx nx run-many -p frontend-pages-competition -t test lint build --output-style=static`:
  all 237 tests in 14 suites, including 22 new search tests; lint has 41 existing warnings and no errors;
  library build and its 10 prerequisites pass. Existing executor/metadata warnings remain.
- Component tests cover both responsive branches and English/Dutch/French real assets, unique associated labels,
  fluid/force selection, case-insensitive regular/backup first/last-name filtering, no matches,
  full visible/accessibility labels, native pointer selection, captain ID-only form assignment,
  single add-player object dispatch, unmatched dismissal, branch switching and unchanged mobile Select count.
- Passed isolated installed Chrome using the existing Playwright dependency, headless and anonymous.
  Waited for mounted Angular hydration rather than merely the visible SSR input before seeding safe synthetic players.
  All mutations to players/add-player dispatch were browser-memory-only; no operational/admin mutations.
- Eight theme/width cases: 390/820/1280/1440px in both themes, with both searches checked in each.
  Both inputs and overlays fit after adding desktop Card padding. Mobile retains 13 lineup Selects; desktop retains its
  generator Select and optional partner-statistics Select. Exactly one input of each stable ID is mounted.
- Long synthetic full names wrap in the native mobile overlay (374px wide in a 390px viewport);
  desktop overlays may grow to 534px, remaining within their viewport without clipping the name.
  Both input and overlay bounds pass in all eight cases.
- Passed real accessible-name lookup from each translated associated label, distinct full-name option names,
  ArrowDown/Enter selection storing the correct captain ID or selected add-player object,
  Escape closing suggestions, explicit empty-result display, Tab dismissal and forced clearing of unmatched text.
  Component tests also cover native pointer selection; exhaustive hover/active states remain unverified.
- Contrast uses browser canvas conversion of CSS Color 4 computed colors to sRGB and composites native backgrounds.
  Initial regex-only readings were invalid for `color(srgb ...)` and were discarded before recording evidence.
  Suggestion text passes at 19.87:1 light / 16.00:1 dark.
  Focused native FloatLabel text fails 4.5:1 in light at 2.66:1 and passes in dark at 10.22:1,
  consistently across all widths. DR-031 remains the separate shared audit.
- Before review correction, Dutch SSR response 200 contained both input IDs, the associated add-player label
  and translated copy. The final grouped-layout SSR recheck failed to connect because the user-managed port 3000
  stopped responding after all eight browser cases and the pool-control checks; a separate availability probe
  confirmed it remained unreachable. Final SSR is not reverified; no shared process was restarted.
  Final mounted hydration records zero browser page errors and zero GraphQL mutations.
  This does not establish exhaustive hydration or authenticated/save workflow coverage.
- Before evidence: two blank native control crops captured in the integrated browser, without player data.
  After evidence: synthetic control/overlay crops at 390px light and 1440px dark, plus eight-case JSON measurements,
  saved in session artifacts. Inspected both themes, mobile long-name wrapping and the unchanged native control shape.
  The integrated page was reloaded to restore real data; isolated Chrome closes after each run.
  These repository observations are the durable evidence, not a dependency on session-only screenshots.
- Not run: actual screen-reader output, exhaustive focus-ring painted-area/contrast, every hover/active state,
  mounted English/French, exhaustive hydration, authenticated/save and operational workflows.
- Exceptions: none.
- Completion is explicitly approved with the limits recorded below. No push is authorized.
- Exact next action in a fresh invocation: confirm/scope one remaining mounted DR-017 information-panel surface,
  with the base-player summary as the next candidate, excluding completed DR-017a-j.
  Recheck final Dutch SSR when port 3000 returns. Keep DR-017 open; do not begin another child here.

### User review correction on 2026-10-30

- The user requested cohesion rather than controls floating outside content surfaces.
  Final clarification: "Kaptain above the mogelijke titularisen it's a separate blok".
  This is design feedback, not completion approval.
- Desktop captain now occupies its own named native Card above the existing player Card.
  Add-player is inside the existing player Card, below the unchanged list/disclosure.
  A native layout stack separates the list and input. Both controls remain outside the CDK drop-list element.
  Mobile retains the existing captain-before-lineup/add-player-after-lineup order and shared search templates.
- This explicitly authorizes only the player Card's content grouping, not a new redesign of completed DR-017c.
  Heading, select-all, availability, row components, backups and CDK bindings are preserved.
- An intermediate validation overlapped the layout clarification and failed one grouping assertion against
  the superseded composition. The settled final source/spec pass all 237 tests, focused lint and library build.
- Reverified all eight theme/width cases, native search/keyboard/empty/dismissal behavior, desktop grouping,
  and unchanged mobile mounting. The browser check now waits for native overlay state/keyboard focus and
  completed asynchronous dismissal before starting the next input interaction.
  Pool select-all toggling and backup disclosure/rows also pass with browser-memory-only synthetic data.
- Inspected final 820px light captain/player Card crops and 1440px dark player Card crop.
  Safe synthetic screenshots show the separate captain block and add-player grouped with possible titulars.
  Final native contrast limits remain recorded above; no styling workaround was introduced.
- At that point status remained Review, with the final SSR recheck and other limits disclosed.

### Completion approval

- On 2026-10-30, after the corrected separate captain/player Card layout, the user selected:
  "Approve completion and commit with the disclosed verification limits".
- Mark only DR-017j Done. Approval accepts the recorded DR-031 native light-label contrast failure,
  final SSR recheck blocked by the stopped user-managed server, actual screen-reader output,
  exhaustive focus/hover/hydration, mounted English/French and authenticated/save/operational verification limits.
  These criteria remain unchecked; approval does not mean failed or unperformed checks passed.
- Only this child's implementation, tests and repository handoff are approved for commit.
  No shared styling overrides, dependency changes or workflow files are included. No push is authorized.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects,
  with existing warnings and no errors. All approved files are formatted; approval/handoff additions are formatted too.

### Later verification during DR-017k

- On 2026-10-30, after the user restarted the local servers, the final grouped assembly route returns HTTP 200
  with Dutch page text and captain input in server HTML. Fresh mounted hydration has no page errors or
  GraphQL mutations. The specific unavailable final grouping SSR recheck is now resolved.
- Other unchecked verification limits and the original completion approval remain unchanged.
