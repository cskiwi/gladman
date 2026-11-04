---
title: 'DR-021b: General enrollment filters and rankings'
description: 'Semantic ranking summary and native, accessible enrollment filter fields.'
---

## Identity

- ID: DR-021b. Parent: [DR-021](DR-021-tournament-enrollment.md).
- Prerequisite: DR-021a Done with recorded user approval.
- Status: [backlog](../backlog.md). Design rules: [plan](../README.md).
- Confirmed mounted consumer on 2026-11-04:
  `/tournament/8658b541-702a-408e-8114-2858a9428069/enroll`, with 30 public events.
  No new consumer or operational mutation is needed.

## Scope

- Project: `frontend-pages-tournament`.
- Existing [filters component](../../../libs/frontend/pages/tournament/src/pages/general-enrollment/components/enrollment-filters/enrollment-filters.component.ts)
  and [template](../../../libs/frontend/pages/tournament/src/pages/general-enrollment/components/enrollment-filters/enrollment-filters.component.html).
- User-review follow-up also covers the narrow level predicate in the existing
  [page service](../../../libs/frontend/pages/tournament/src/pages/general-enrollment/page-general-enrollment.service.ts)
  and real-service mounted-list regression tests.
- Ranking summary, ranking checkbox, two MultiSelects, level range Slider, status Select and Clear.
- Preserve filter values, gender/ranking defaults, inclusive level payload, reset semantics and parent output.
- Exclude page chrome, selection tiles, cart, partner dialog, other enrollment routes, unrelated service behavior,
  shared components/theme, backend and translations.

## Baseline and approach

- Actual mounted light/dark 390/1440px baseline fits the viewport and shows 30 events.
- Both MultiSelect comboboxes lack accessible names; status is named only by its selected value.
  The level description has no association with the native handles.
- Ranking banner uses paired primary palettes and a decorative icon; filters use arbitrary 200px minimum widths
  and three inline width styles. Keep the existing meaningful smart-page/filter-child split.
- Use semantic ranking heading/list, native Checkbox, fluid MultiSelect/Select and named native Slider.
  Use existing translated field/level copy, not literal English `Level`.
- Check keyboard level changes against the emitted payload, not just thumb movement.
- No shared changes, new wrapper, dependency, SCSS, inline styling or palette exception.

## Implementation checklist

- [x] Confirm mounted consumer, dependency and bounded scope.
- [x] Simplify the existing component with native options and semantic layout.
- [x] Preserve defaults, reset, filters and parent output; cover with mock-only regressions.
- [x] Keep excluded consumers and shared settings unchanged.
- [x] Record discoveries outside scope and persistent handoff.

## Acceptance and verification

- [x] Native controls have persistent translated labels; rank information remains complete.
- [x] Light/dark 360/390/768/1440px layouts fit with and without rankings.
- [x] Keyboard selection, overlays, range changes, checkbox and reset work.
- [x] Actual rendered list filters known ranges and retains unknown/partially unknown bounds as requested.
- [ ] Labels, focus and scoped contrast pass.
- [x] Default, active, empty-result and disabled states remain usable.
- [x] No new palette classes, SCSS, inline-style workarounds or shared changes.
- [x] Record authored class-token comparison.
- [x] Relevant Nx lint/test/build pass, with exact commands/results.
- [ ] Localization and relevant SSR/hydration checks pass.
- [x] User visual review or explicit approval with disclosed limits.

## Evidence and handoff

- Before browser baseline: mounted public route, four light/dark 390/1440px cases; no document overflow.
  Client read intercepts suppress user/session responses; mutations are blocked.
  HTTP SSR can still supply user ranking data, so final matrices explicitly replace all user ranking/gender,
  enrollment and cart signals with safe local fixtures. No actual cart or operational actions are performed.

### Implementation and reuse

- Keep the existing smart page and presentational filter child; no styling-only extraction.
- Ranking banner becomes a named semantic section, heading and definition list.
  Only supplied ranking disciplines render; existing translated level copy replaces literal English `Level`.
- Persistent translated labels name both MultiSelects and the status Select.
  Both native range inputs reference the visible level-range description.
  PrimeNG exposes one label input for the whole range; individual values remain native.
- Native fluid fields and a responsive one/two/four-column grid replace inline widths and arbitrary minima.
  Clear sits below the grid; ranking checkbox wraps naturally below its summary.
- Authored static class tokens: **70 -> 49**. Remove all paired palette classes, decorative icon,
  three inline width styles and redundant wrappers. No SCSS, inline-style, theme or shared-component change.
- Tight accessibility-related behavior repair: installed Slider emits `onChange` for keyboard/native-input
  changes but not `onSlideEnd`. Handle those events so the parent actually filters; pointer drags still
  apply only on release. No change to eligibility, defaults, reset values or filter payload shape.

### Automated validation

All changed files are formatted with `npx prettier --write` and their explicit paths before validation.

```shell
npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static
git --no-pager diff --check
```

- Pass after user feedback: lint, all **nine suites / 106 tests**, production library build and ten prerequisites.
- Ten new mock-only cases cover persistent labels, partial rankings/checkbox, three gender defaults,
  supplied filters, both real keyboard range handles, pointer-release/native-input output, reset and disabled controls.
- Three additional mounted-list cases use the real service with mocked Apollo reads and verify actual grid inputs
  and rendered content for keyboard range updates, pointer release, inclusive endpoints and unknown bounds.
- Initial integrated run: lint/build pass; one new text assertion fails because `Safe low` is also a substring of
  the intentionally retained `Safe lower bound only`. Correcting it to a word-boundary assertion produces the
  final passing result above; no application change was needed for that test correction.
- Whitespace check passes. Git reports existing LF-to-CRLF configuration warnings; edited files use LF.
- No dependencies or tooling added. Unrelated existing `docker-compose.yaml` changes remain untouched.

### Browser evidence

Port 3000 serves final source; no temporary server, backend or translation restart is needed.
Fixtures use rankings 4/6/5 or no ranking, null gender, empty enrolled IDs and cart, and no cart ID.

- Pass: **16** light/dark 360/390/768/1440px loaded cases, with/without rankings.
  All fields/summary fit, all five native inputs have label references, all three ranked disciplines remain,
  30 events render and document scroll width equals client width.
- Pass: four light/dark 390/1440px keyboard cases. Event type `NATIONAL` yields zero events;
  Category selects singles, status selects Open, both native range arrows update the actual parent payload
  to 2 through 11, and Space toggles the ranking checkbox.
- Pass: Escape returns from native MultiSelect overlays; Tab visits the native chip remove control before
  Category and Shift+Tab returns to the preceding combobox. An initial assertion omitted the chip stop;
  corrected checks pass without changing native keyboard order.
- Pass: Enter on Clear restores mixed, no category, ranked inclusive levels 4/5/6, Available and unchecked
  ranking filter. Native Clear focus is `:focus-visible` with a solid 1px outline in all four cases.
- Pass: actual pointer drag changes the local range to 3/12 while the parent remains 1 through 12;
  release emits 3 through 12. This validates pointer-release semantics, not just a synthetic output.
- Pass: four light/dark 360/1440px maximum-chip cases, fitted event-type overlays and disabled native
  controls. All three comboboxes report disabled, checkbox and both range inputs are disabled, no overflow.
- Pass: Dutch HTTP SSR returns 200 and all three persistent field labels match mounted client copy.
  English field/ranking copy is covered by unit tests. Exhaustive hydration and mounted English/French are not verified.
- Monitored matrices, interactions and HTTP check record zero page errors or GraphQL mutation requests.
- Initial cleanup reload/navigation subsequently recorded 27 dev `@ng/component` dynamic-import failures
  for other preloaded components. A clean repeat mounted the final enrollment labels and original detail
  route with zero page errors/mutations; no unrelated application edits or server restart were needed.
  Final reload resets local fixtures; interception/listeners are removed and the supplied detail route is restored.
- Before dark-wide screenshot and four safe after light/dark 390/1440px filter screenshots are local
  `.playwright-mcp/DR-021b-*.png` evidence, not committed operational data or the only persistent handoff.
  Direct inspection of the light-narrow/dark-wide captures confirms readable hierarchy and native fields.
  Required user visual review remains outstanding.

### Contrast, discoveries and limits

Canvas sRGB measurements composite ancestor backgrounds after theme transitions settle.

- Pass: ranking heading/terms/values, labels and range description: **19.87:1 light / 16.00:1 dark**.
- Pass: native MultiSelect placeholder and unfocused Clear label: **4.87:1 / 6.65:1**.
  Selected status text: **13.61:1 / 16.00:1**.
- Fail: native enabled unchecked Checkbox border: **1.48:1 / 1.40:1**, below 3:1.
  Existing shared DR-032 retains this; no page override or styling exception.
- New shared follow-up **DR-045**: native MultiSelect chip Remove is keyboard-focusable with
  `role="button"`, `tabindex="0"` and literal English `aria-label="Remove"`, but also `aria-hidden="true"`.
  This is native rendered markup, not authored by this slice. Audit affected consumers and locale support separately.
- Actual screen-reader, exhaustive control/focus/overlay contrast and hydration, mounted English/French,
  actual authenticated enrollment operations, backend outages and operational retries remain unverified.
  These limits keep the broad accessibility/localization checks unchecked.
- Loading/error/success feedback lives in excluded page/service/cart surfaces; existing page tests still pass.
  No new network or save state is introduced by this filter-only child.
- Styling exceptions: none.

### Approval and exact next action

On 2026-11-04, after the list-level verification and unknown-bound clarification below, the user selected
**"Approve DR-021b and commit with disclosed limits"** and **"Nothing else"**.
This approves only DR-021b's implementation, tests and repository handoff, including the requested open
DR-021h ranking-polish follow-up. No push is requested.

Accepted limits remain the unchecked accessibility/localization criteria, shared DR-032/DR-045 findings,
unperformed operational checks and deferred ranking visual polish. Acceptance does not claim those checks passed
or that the current ranking presentation is final. No new styling exception is approved.
All 30 public events intentionally remain visible for any range because their bounds are unknown.

Post-approval `npx nx run-many --target=lint --output-style=static` passes all **34 projects**,
with existing warnings and zero errors. Approved commit scope is this slice and its handoff only;
unrelated staged `docker-compose.yaml` changes are excluded. No push is requested.
DR-021 remains open. Exact next action in a fresh invocation: confirm and scope DR-021c selection tiles;
do not start it here.
DR-021h remains Backlog and must not be closed with DR-021b.

### User feedback and list-level verification

On 2026-11-04 the user made approval conditional on keeping `Jouw Rankings` visual improvement on the
backlog and fixing/verifying slider application to the list.
[DR-021h](DR-021h-enrollment-ranking-polish.md) is the explicit open ranking-polish follow-up;
approving DR-021b does not accept its current ranking summary as the final visual design.

Investigation confirms all 30 events on the supplied route return null `minLevel` and `maxLevel`.
The original range-output check proved the payload, not a reduction in real list content.
The user explicitly clarified: **unknown event levels stay visible regardless of the slider;
only events with known min/max bounds are filtered**.

- Make the service predicate explicit: apply inclusive overlap only when both bounds are known.
  If either bound is null/undefined, retain the event for this filter. Other active filters still apply.
  Do not parse names, modify source data, infer enrollment requirements or change eligibility logic.
- Pass: four light/dark 390/1440px real mounted-list keyboard cases using six safe local events.
  Range 5/6 removes known 1/2 and 11/12 events and shows exactly four cards:
  the known 5/6 event plus fully unknown, missing-lower and missing-upper events.
- Pass: four real pointer cases at the same themes/widths. During dragging to 11/12, all six remain;
  release removes known low/middle cards, leaving known high and all three unknown-bound events.
- Initial synchronous DOM sample preceded signal rendering; repeated checks explicitly wait for the excluded
  cards to detach and the visible heading count to update. All four settled cases pass.
- Pass: after resetting fixtures, actual public data retains all 30 events at range 5/6 because all bounds
  are unknown. This is now the user's required behavior, not evidence that known-range filtering failed.
- Keyboard matrices record zero page errors and all feedback checks record zero mutation requests.
  Final reload resets all local fixtures and restores the supplied detail route; interception is removed.
- No backend, translation, source-data mutation or enrollment operation was performed.
- The user subsequently approved with disclosed limits; see the approval above.
