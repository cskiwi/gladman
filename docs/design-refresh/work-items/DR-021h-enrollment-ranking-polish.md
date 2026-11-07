---
title: 'DR-021h: Enrollment ranking summary visual polish'
description: 'User-requested visual improvement of the Jouw Rankings summary on general enrollment.'
---

## Identity

- ID: DR-021h. Parent: [DR-021](DR-021-tournament-enrollment.md).
- Dependency: DR-021b review is complete and its authoritative row is Done. Status: [backlog](../backlog.md).
- Design rules: [plan](../README.md).
- Added at the user's explicit request on 2026-11-04; DR-021b approval must not close this follow-up.

## Scope

- Confirmed consumer: `/tournament/8658b541-702a-408e-8114-2858a9428069/enroll`.
- Project: `frontend-pages-tournament`.
- Existing [filter template](../../../libs/frontend/pages/tournament/src/pages/general-enrollment/components/enrollment-filters/enrollment-filters.component.html).
- Improve the visual hierarchy, grouping and responsive presentation of `Jouw Rankings`.
  The current semantic heading/list is a baseline, not an accepted final ranking design.
- Preserve partial/absent rankings, translated disciplines/levels, associated checkbox and filtering behavior.
- Exclude filter fields, event tiles, cart, permissions, theme, backend, translations and enrollment mutations.

## Baseline and proposed approach

- DR-021b removes the legacy palette banner but the user explicitly requests further visual improvement.
- On 2026-11-07 the live route mounts `app-page-general-enrollment app-enrollment-filters` with 30 public events.
  The unauthenticated ranking request reports Forbidden and leaves rankings absent; use in-memory fixtures for
  ranked/partial states, without authentication changes or GraphQL mutations.
- The user selected "Compact grid with neutral level Tags (recommended)": translated disciplines and secondary
  native PrimeNG Tags, checkbox below, semantic border separating rankings from filter fields.
- Before implementation, 24 Dutch theme/width/ranked/partial/absent fixtures fit without page or section overflow.
  Captured dark 390px and light 1440px ranked summaries: cramped plain values beside disciplines and a checkbox
  pushed to the far right on desktop.
- Keep the meaningful smart-page/filter-child split. Extract presentation only for genuine reusable structure,
  not solely to hide utility classes.

## Implementation checklist

- [x] Confirm dependency and mounted consumer when selected.
- [x] Capture baseline and refine native semantic ranking presentation.
- [x] Preserve ranking data, checkbox behavior, labels and translations.
- [x] Record class comparison, affected consumers and any discoveries.

## Acceptance and verification

- [x] Rank disciplines/values and checkbox remain complete and associated.
- [x] Light/dark 360/390/768/1440px and partial/absent rankings remain usable.
- [ ] Keyboard, focus, labels and contrast are checked with shared issues disclosed.
  - Keyboard order/Space, label activation, labels, text and focus contrast pass.
  - Native unchecked Checkbox border fails 3:1 under existing DR-032; screen-reader remains not run.
- [x] No new palette classes, SCSS or equivalent styling workaround.
- [x] Relevant Nx lint/test/build pass, with exact commands and browser evidence.
- [x] User explicitly reviews the improved ranking presentation with disclosed limits.

## Evidence and handoff

- Source: DR-021b user review on 2026-11-04: keep `Jouw Rankings` visual improvement on the backlog.
- Worktree was clean before selection. No implementation approval for completion or commit is implied by
  the user's choice of presentation.

### Changed scope and reuse

- Only the existing filter child's ranking section changes; TagModule is the sole production TypeScript addition.
  Heading and semantic `dl` remain. Each supplied discipline has a native secondary Tag including translated
  level text. Small screens show aligned rows; `sm` and above use three grid columns.
  The labeled native Checkbox follows the summary, before a semantic divider and unchanged filter fields.
- Keep the existing smart-page/filter-child split. No second mounted ranking-summary consumer was found.
  Existing player ranking-progress is a different concern, not a reusable enrollment-summary wrapper.
  Native Tags and semantic `dl` avoid introducing another styling-only component.
- Ranking-section static class tokens change **22 to 38**. The increase pays for responsive row/value alignment
  (three repeated five-token row layouts), checkbox shrink protection and semantic separation.
  Native Tag appearance replaces no authored color/size overrides. Readability, not an arbitrary token quota,
  is the goal. Excluded field markup is byte-identical to HEAD.
- Two new regressions cover all neutral Tags, dynamic full/partial/absent rankings without filter emissions,
  non-interactive Tags and an empty ranking object. Existing label/checkbox/output/disabled tests still pass.
- No services, route, permissions, eligibility, translation, shared component, global theme, dependencies or styles
  change. No operational mutation is performed. No new backlog discovery or styling exception.

### Validation on 2026-11-07

- Formatter passes for all changed files:
  `npx prettier --write` with the three enrollment-filters files and the changed design-refresh documents.
- Pass: `npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static`.
  Lint, **12 suites / 147 tests**, production Angular library packaging and ten prerequisite tasks pass.
  Existing cached prerequisite outputs are reused. No dependencies are installed.
- Pass: **72** mounted cases: actual `en`, `fr_BE`, `nl_BE` dictionaries, light/dark,
  **360/390/768/1440px**, full `{single:4,double:6,mix:5}`, partial `{double:12}` and absent `null`.
  Each has the expected three/one/zero disciplines and neutral Tags, no page/section/row horizontal overflow,
  and an associated translated checkbox when ranked. Absent rankings hide the entire section.
  French heading is `Vos classements`; Dutch is `Jouw Rankings`; both use `Niveau`, not English fallback.
  An initial matrix using unsupported `fr`/`nl` IDs retained English fallback and is not localization evidence;
  the final matrix uses the repository's actual supported locale IDs.
- Pass: **four** light/dark 390/1440px keyboard/pointer cases.
  Focus Checkbox, Space enables the parent filter, Tab reaches the event-type combobox,
  Shift+Tab returns and Space disables. Clicking the associated label toggles both ways.
  All **30 public events** remain, correctly preserving unknown min/max bounds; this is not evidence
  of ranked filtering reducing unknown-bound data. Component/service regressions remain intact.
- Pass: **four** disabled cases at the same themes/widths. Native Checkbox is disabled;
  real pointer coordinates on its label leave the exact parent payload unchanged.
  A normal Playwright label click initially timed out because its associated input was disabled;
  coordinate clicks verify the intended disabled behavior without bypassing native browser dispatch.
- Monitored final 72-case layout and four-case keyboard/pointer runs have **zero page errors or
  GraphQL mutation attempts**. The inherited unauthenticated ranking-read Forbidden console error occurs
  on initial mount/reload, remains explicit and is not fixed or claimed absent by this presentation slice.
- Pass: final Dutch dark 390px and light 1440px synthetic-summary screenshots captured after implementation.
  They show aligned discipline/value rows on narrow screens, three columns on wide screens and the Checkbox
  below instead of detached at the far right. Only safe ranking data is captured; no operational data is saved.
  These observations and the reproducible fixture matrix persist here rather than only in chat.
- Pass: public Dutch SSR GET of the general enrollment route is **HTTP 200**, contains the persistent
  enrollment field markup and has no ranking section. No authenticated ranking is invented on the server.
  Exhaustive hydration and authenticated SSR remain not run.

### Contrast and verification limits

Measurements composite computed ancestor backgrounds into sRGB after the native 0.2s transition settles.

- Pass: heading, discipline and Checkbox-label text: **19.87:1 light / 16.00:1 dark**.
- Pass: secondary Tag level text: **7.74:1 / 9.51:1**.
- Pass: keyboard Checkbox focus-visible solid 1px outline: **3.65:1 / 10.22:1**.
- Fail: enabled unchecked native Checkbox border: **1.48:1 / 1.40:1**, below 3:1.
  Existing shared [DR-032](../backlog.md) retains this finding; no local override.
- Not run: actual screen-reader, exhaustive control/checked-icon contrast, exhaustive hydration,
  authenticated ranking/registration workflows, live backend outages or retries. Existing loading/error/success
  handling belongs to excluded page/services/cart, not this ranking-only presentation.
- Browser fixtures were removed by restoring the supplied tournament detail route after validation.

### Approval and exact next action

On 2026-11-07 the user selected **"Approve DR-021h and commit with disclosed limits"** and **"Nothing else"**.
This approves the ranking-only implementation, its tests and repository handoff, not additional workflow changes.
No push is requested.

Accepted limits: existing DR-032 unchecked-border contrast failure, unperformed screen-reader/exhaustive
accessibility/hydration and authenticated ranking/registration/outage verification. Acceptance does not claim
failed or unperformed checks passed; the broad accessibility criterion stays unchecked.
The authoritative backlog is Done by explicit approval with these limits. DR-021 remains open for deferred scope.

Post-approval `npx nx run-many --target=lint --output-style=static` passes all **34 projects**,
with existing warnings and zero errors. Final documentation formatting and `git diff --check` pass.

Exact next action in a fresh invocation: scope DR-022 tournament draw detail using its recorded route/discoveries,
confirm a real mounted consumer and select one child view. Check DR-006 bracket-sizing dependency if applicable.
Do not start that implementation here. DR-021i remains deferred; do not restore retired enrollment pages.
