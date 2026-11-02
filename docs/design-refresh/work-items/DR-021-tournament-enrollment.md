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

| ID                                      | Bounded scope                                                        | Dependency                                |
| --------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------- |
| [DR-021a](DR-021a-enrollment-chrome.md) | General enrollment heading, outer layout, loading and empty feedback | DR-020                                    |
| DR-021b                                 | General enrollment filters, rankings and accessible field labels     | DR-021a                                   |
| DR-021c                                 | General enrollment selectable sub-event tiles                        | DR-021a                                   |
| DR-021d                                 | General enrollment cart presentation and feedback                    | DR-021a                                   |
| DR-021e                                 | Partner-selection dialog                                             | DR-021c                                   |
| DR-021f                                 | Sub-event-specific enrollment route                                  | Confirm mounted consumer before selection |
| DR-021g                                 | My-enrollments route; split further if needed                        | Confirm mounted consumer before selection |

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

- DR-021b/c/d/e retain their existing legacy palette utilities, layout and behavior until selected.
- The general breadcrumb currently renders the untranslated key `all.tournament.detail.title`.
  Correct its context/localization in a separately scoped follow-up; DR-021a preserves breadcrumb behavior.
- The general service logs read failures without page-visible error state. Scope explicit read-error handling
  separately from DR-021a; do not treat an empty result as verified outage feedback.
- Native component contrast audits remain DR-032/033/034; do not override the shared preset in a page slice.

## Handoff

Keep the parent open until every required child is complete. Select only one child per invocation.
See DR-021a for baseline, changes, exact checks and pending review.
