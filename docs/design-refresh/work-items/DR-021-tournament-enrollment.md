---
title: 'DR-021: Tournament enrollment workflows'
description: 'Bounded enrollment presentation slices and preserved workflow contracts.'
---

## Identity and scope

- Parent: DR-021. Authoritative statuses: [backlog](../backlog.md).
- Project: `frontend-pages-tournament`. Design rules: [plan](../README.md).
- Prerequisite: DR-020 is Done with its disclosed verification limits.
- Preserve eligibility, filters, cart state, partner selection, permissions, submissions and cancellations.
- No shared-theme, backend, translation or operational changes as hidden side effects.

## Child slices

| ID                                              | Bounded scope                                                        | Dependency                                |
| ----------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------- |
| [DR-021a](DR-021a-enrollment-chrome.md)         | General enrollment heading, outer layout, loading and empty feedback | DR-020                                    |
| [DR-021b](DR-021b-enrollment-filters.md)        | General enrollment filters, rankings and accessible field labels     | DR-021a                                   |
| [DR-021c](DR-021c-enrollment-selection.md)      | General enrollment selectable sub-event tiles                        | DR-021a                                   |
| DR-021d                                         | General enrollment cart presentation and feedback                    | DR-021a                                   |
| DR-021e                                         | Partner-selection dialog                                             | DR-021c                                   |
| DR-021f                                         | Sub-event-specific enrollment route                                  | Confirm mounted consumer before selection |
| DR-021g                                         | My-enrollments route; split further if needed                        | Confirm mounted consumer before selection |
| [DR-021h](DR-021h-enrollment-ranking-polish.md) | Jouw Rankings visual polish retained at user request                 | DR-021b                                   |

General enrollment mounts at `/tournament/8658b541-702a-408e-8114-2858a9428069/enroll`.
The detail page links to it when enrollment is open, and links to `my-enrollments` independently.
The supplied historical tournament currently exposes the latter action; direct enrollment navigation mounts 30 events.
Source: [routes](../../../libs/frontend/pages/tournament/src/lib.routes.ts) and
[detail template](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.html).
No consumer was added for visual testing. Other child routes must be checked when selected.

## Reuse decisions and discoveries

The general page already composes separate filters, selection grid, cart and partner-dialog components.
Keep that meaningful split rather than extracting a styling-only page wrapper.
Competition-style compact headings and native content Cards are the reference, not a new tournament-specific theme.
Consider genuine domain presentation reuse when the sub-event and my-enrollments children are scoped.

- DR-021b implements native fluid filters, persistent labels and a semantic ranking summary.
  Its keyboard range-output repair preserves pointer-release filtering. See its brief for evidence and pending review.
  Following user feedback, list filtering explicitly retains unknown event bounds; names are not parsed.
  DR-021h remains open for the ranking summary's visual polish, even after DR-021b approval.
  DR-021c is the selected native selection-Card slice; DR-021d/e retain their existing presentation.
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
Its unchecked criteria remain unchecked. DR-021d cart is the next candidate for a fresh invocation, not started here.
DR-021h ranking visual polish remains open after DR-021b approval.
