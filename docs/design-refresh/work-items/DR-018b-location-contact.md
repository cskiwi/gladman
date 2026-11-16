---
title: 'DR-018b: Location/contact information'
description: 'Shared selector prerequisite followed by bounded location/contact presentation and feedback.'
---

## Identity and scope

- ID: DR-018b. Status is authoritative in the [backlog](../backlog.md).
- Parent: [DR-018](DR-018-competition-editing.md). Rules: [design refresh](../README.md).
- Confirmed mounted consumer: `/competition/pbo-competitie-2026-2027/edit`, information tab, 2026-11-14.
- Preserve country/state filtering, contact-email validation, permissions, dirty tracking and mutation payloads.
- Exclude completed basic section, dates/settings, page chrome, global theme and operational mutations.

## Children and dependencies

- [DR-018b1](DR-018b1-country-state-selectors.md): shared country/state label and form integration prerequisite.
- [DR-018b2](DR-018b2-location-contact-presentation.md): location/contact semantic sections, native email validation
  and information-tab feedback. Selected on 2026-11-16; dependency: completed DR-018b1.
- Existing form component owns orchestration; selectors are existing reusable CVAs.
  No new smart/presentational abstraction is needed.

## Acceptance and handoff

- [x] Confirm mounted consumer and split shared work from page-only presentation.
- [x] Complete b1 and b2 with recorded verification and user review.
- [x] Review the integrated information tab without live saves; record the exact checks and limits below.
- [ ] Complete physical keyboard/pointer, overlay and full screenshot/accessibility checks.
- [ ] Verify alternate locales, live persistence and full SSR/hydration.
- [x] Obtain parent approval with any remaining limits disclosed.

The country/state wrappers had inner ngModel registration warnings
and missing label forwarding in the baseline; b1 fixes both and is Done with explicit approval
(`commit`, 2026-11-16), accepting its recorded verification limits without claiming unperformed checks passed.
Source inspection finds only the competition editor as a current consumer.
DR-018b2 implements the presentation and tab feedback; four focused tests and Nx lint/build pass.
Its brief records partial browser verification and remaining screenshot/accessibility/localization/persistence limits.
The user approved b2 with `Approve DR-018b2 and commit with disclosed limits` on 2026-11-16; its status is Done.
Both children's unchecked verification limits remain recorded, not claimed as passed.
Integrated review and separate parent approval are recorded below.
This parent is Done with accepted limits; both children's unchecked criteria remain historical limits.

## Integrated review, 2026-11-16

- Selected the recorded parent review, not another implementation slice. Worktree was clean.
- The mounted information tab confirms both completed children are present.
- Review scope: combined sections/labels, permission state, responsive layout and non-mutating feedback.
- Exclude live saves, dates/settings, page chrome, shared styling and translations.
- Existing form orchestration and reusable selector CVAs remain sufficient; no additional extraction is needed.
- Source inspection confirms the native Select label forwarding/standalone ngModel/fluid sizing and the semantic
  sections, described email Message and named saving ProgressBar are present. No application changes are required.
- All three regions are named by their headings; country/state have their visible field-label associations.
  Email has its native label and a conditional error description. No raw new translation keys in the Dutch snapshot.
- Unlike the children's earlier read-only baseline, the current authenticated account has edit permission.
  All six controls load enabled, pristine and untouched with `be`/`BE-VOV`. No account permissions were changed.
- Browser-only fixture matrix: light/dark at 390px/1440px, long invalid email, long stored error and saving feedback.
  All three sections have matching bounds and no internal overflow: 44.75-330.25px narrow, 110.75-1329.25px wide.
  Section scroll/client widths are 286px narrow and 1219px wide; Messages fit their containers.
  Email widths are 285.5px/602.25px. All three heading colors match in each theme.
  These are scoped DOM measurements, not full visual/page/topbar validation; DR-066 remains separate.
- Browser CVA-handler fixtures: Germany clears the old state and provides 16 states; country is dirty/touched.
  Clearing country produces null state, zero options and disabled state Select. These do not prove physical selection.
- Safe valid-email/optional-empty fixtures clear aria-invalid/error description. Saving false removes the ProgressBar
  while the stored error remains. Directly disabling the form disables email/country/state; real enabled values restored.
  Fixtures exercise component/CVA contracts with forced change detection, not live operations.
- Physical Tab attempt from the focused country control did not advance focus after either key press.
  Leave physical keyboard, focus traversal and overlay interaction unverified; no workaround or source change.
- Dark-wide integrated information screenshot inspected: native controls, restrained matching headings and readable
  location/contact grouping. No persistent image file was produced; the full four-case screenshot matrix was not run.
- `npx nx run frontend-pages-competition:test --testPathPatterns=competition-info.component.spec.ts --output-style=static`
  passes from Nx cache: one suite, four tests. Existing executor-deprecation/ts-jest warnings remain.
  No new tests are needed for this documentation-only parent review. Child lint/build results remain historical,
  not rerun here; no application source changed.
- Repository Prettier formats the three changed handoff documents; `git diff --check` passes.
- No save action or mutation method was activated. Mutation monitoring covered only the initial focus attempt
  (zero observed); full browser mutation monitoring and live persistence are not claimed.
- Reload restores actual permission/data, enabled/pristine/untouched form, zero Messages, saving false and null error.
  Original dark preference and 1693px/1272px viewport restored; shared browser returned to the homepage.
- Navigation/reload logs `InvalidStateError: Transition was aborted because of invalid state`, but the route loads.
  This matches the existing navigation caveat in the backlog; no shell/router change in this parent review.
- Not verified: physical keyboard/pointer, overlay/filter/clear interactions, complete screenshot matrix,
  contrast/full accessibility, alternate locales, live persistence and full SSR/hydration.
  Child acceptance does not imply these parent checks passed. No new styling exceptions or dependencies.
- User explicitly approved the parent with `Approve DR-018b and commit with disclosed limits` on 2026-11-16.
  Backlog status is Done. Approval accepts physical keyboard/pointer, overlay/filter/clear, complete screenshot
  matrix, contrast/full accessibility, alternate locales, live persistence and full SSR/hydration limits.
  Unperformed acceptance criteria remain unchecked; approval is not evidence that those checks passed.
  Approval authorizes committing only this parent's three handoff documents; no push.
- Keep DR-018 open. Exact next action: confirm the mounted dates tab, scope DR-018c and create its brief before
  implementation. DR-018c remains unstarted. Subsequent approval/status edits are documentation-only.
