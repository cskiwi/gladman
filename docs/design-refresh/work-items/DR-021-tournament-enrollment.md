---
title: 'DR-021: Tournament enrollment workflows'
description: 'Bounded enrollment presentation slices and preserved workflow contracts.'
---

## Identity and scope

- Parent: DR-021. Authoritative statuses: [backlog](../backlog.md).
- Project: `frontend-pages-tournament`. Design rules: [plan](../README.md).
- Prerequisite: DR-020 is Done with its disclosed verification limits.
- Preserve general enrollment eligibility, filters, cart state, partner selection, permissions and submissions.
- User-directed retirement removes the obsolete single-event/cancellation and incomplete overview UI;
  backend operations/data stay unchanged. A new overview is separately deferred.
- No shared-theme, backend, translation or operational changes as hidden side effects.

## Child slices

| ID                                              | Bounded scope                                                        | Dependency                             |
| ----------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------- |
| [DR-021a](DR-021a-enrollment-chrome.md)         | General enrollment heading, outer layout, loading and empty feedback | DR-020                                 |
| [DR-021b](DR-021b-enrollment-filters.md)        | General enrollment filters, rankings and accessible field labels     | DR-021a                                |
| [DR-021c](DR-021c-enrollment-selection.md)      | General enrollment selectable sub-event tiles                        | DR-021a                                |
| [DR-021d](DR-021d-enrollment-cart.md)           | General enrollment cart presentation and feedback                    | DR-021a                                |
| [DR-021e](DR-021e-partner-dialog.md)            | Partner-selection dialog                                             | DR-021c                                |
| [DR-021f](DR-021f-sub-event-enrollment.md)      | Retire obsolete sub-event enrollment and incomplete overview         | DR-021e                                |
| DR-021g                                         | Incomplete my-enrollments page; withdrawn with retirement            | None                                   |
| [DR-021h](DR-021h-enrollment-ranking-polish.md) | Jouw Rankings visual polish retained at user request                 | DR-021b                                |
| DR-021i                                         | Future my-enrollments overview; separately scope later               | Confirm requirements and real consumer |

General enrollment mounts at `/tournament/8658b541-702a-408e-8114-2858a9428069/enroll`.
The detail page links to it when enrollment is open. Direct navigation mounts 30 public events.
On 2026-11-07 the user confirmed this is the only enrollment page and authorized removal of the other pages.
The incomplete my-enrollments and sub-event routes/implementations/exports are retired under DR-021f.
Source: [routes](../../../libs/frontend/pages/tournament/src/lib.routes.ts) and
[detail template](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.html).
No consumer was added for visual testing. A future overview is retained as DR-021i, not implemented here.

## Reuse decisions and discoveries

The general page already composes separate filters, selection grid, cart and partner-dialog components.
Keep that meaningful split rather than extracting a styling-only page wrapper.
Competition-style compact headings and native content Cards are the reference, not a new tournament-specific theme.
Only extract genuine shared presentation for current consumers; do not restore retired pages to justify reuse.

- DR-021b implements native fluid filters, persistent labels and a semantic ranking summary.
  Its keyboard range-output repair preserves pointer-release filtering. See its brief for evidence and accepted limits.
  Following user feedback, list filtering explicitly retains unknown event bounds; names are not parsed.
  DR-021h was kept open after DR-021b approval and is now separately approved with its recorded limits.
  DR-021c selection Cards, DR-021d cart and DR-021e dialog have user approval with recorded limits.
- The general breadcrumb currently renders the untranslated key `all.tournament.detail.title`.
  Correct its context/localization in a separately scoped follow-up; DR-021a preserves breadcrumb behavior.
- The general service logs read failures without page-visible error state. Scope explicit read-error handling
  separately from DR-021a; do not treat an empty result as verified outage feedback.
- Native component contrast audits remain DR-032/033/034; do not override the shared preset in a page slice.

## Handoff

Keep the parent open until every required child is complete. Select only one child per invocation.
DR-021a and DR-021b have user approval with their recorded limits;
see their briefs for exact checks, shared DR-032/DR-045 discoveries and unperformed verification.
DR-021c has explicit user approval with the disclosed native DR-032 contrast and DR-046 localization limits.
It preserves the presentational child and parent outputs, using explicit Buttons instead of whole-card clicks.
Its unchecked criteria remain unchecked. DR-021d cart has explicit approval: native Card/list/actions, accessible remove names,
submission locking, 126 passing tests and 72 mounted locale/theme/width/state fixture cases.
Its shared native Button contrast failures remain DR-032/033; inherited sticky/header overlap is new DR-047.
Actual authenticated cart operations, exhaustive hydration and screen-reader checks remain unverified.
On 2026-11-04 the user approved DR-021d and its scoped commit with these disclosed limits, including DR-047.
See its brief for exact results and approval; keep unchecked criteria unchecked.
DR-021e partner dialog has explicit user approval: associated native fields, wrapping suggestions/actions and responsive sizing;
141 passing tests, focused lint/build, 48 locale/theme/width/state fixtures and four keyboard/four pointer cases.
Shared DR-032/033 contrast and DR-037 native status localization remain open; DR-048 records inherited search feedback.
On 2026-11-04 the user approved DR-021e completion and its scoped commit with the disclosed limits.
Unchecked criteria remain unchecked. On 2026-11-07 the user replaced unapproved DR-021f1 styling with retirement
of the obsolete sub-event and incomplete my-enrollments pages. None of the chrome implementation/new tests remain.
DR-021f1-f4 and DR-021g are withdrawn, not design migrations; DR-049 is withdrawn for the removed consumer.
DR-021f retirement has passing focused lint/build and 145 tests, including direct unmatched-route regressions;
four pointer cases preserve general detail-to-enrollment navigation with 30 public events.
On 2026-11-07 the user approved retirement completion and its scoped commit with disclosed limits.
Shared audits stay open for surviving consumers; unperformed checks remain unperformed.
See the retirement brief for approval, limits and the exact next action.
DR-021h ranking visual polish was kept open after DR-021b approval and is now separately approved.
Its compact neutral native Tag grid, associated Checkbox below and semantic separation are now implemented.
Focused lint/build, 147 tests, 72 actual locale/theme/width/ranking-state fixtures and four keyboard/pointer cases pass.
On 2026-11-07 the user approved DR-021h completion and its scoped commit with disclosed limits; its row is Done.
Native unchecked Checkbox border remains DR-032.
Keep its screen-reader, exhaustive accessibility/hydration and authenticated workflow limits unchecked.
Next candidate is DR-022 draw detail: confirm a mounted consumer, scope one view and check DR-006 if applicable.
No next implementation is started in this invocation. The parent remains open for deferred scope.
DR-021i retains a future my-enrollments overview; no replacement is started here.
