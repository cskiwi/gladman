---
title: 'DR-020: Tournament creation and editing'
description: 'Bounded child slices for the mounted tournament creation and editing routes.'
---

## Identity and scope

- Parent: DR-020. Status is authoritative in the [backlog](../backlog.md).
- Rules: [design refresh](../README.md).
- Project: `frontend-pages-tournament`.
- Preserve creation/save semantics, permissions, localization, routing and form state.
- No shared theme, backend, translation or administration changes.

## Children

- [DR-020a](DR-020a-creation-chrome.md): creation heading, native form Card and read feedback.
- [DR-020b](DR-020b-creation-fields.md): creation fields, validation and mutation feedback;
  preserve DR-020a's completed native actions.
- [DR-020c](DR-020c-editing-chrome.md): editing heading, tabs, feedback and actions; user-approved with disclosed limits.
- [DR-020d](DR-020d-editing-information.md): editing information tab; user-approved with disclosed limits.
- [DR-020e](DR-020e-editing-settings.md): editing settings tab; user-approved with disclosed limits.

All five children are complete with explicit user approval and their disclosed limits retained.
The parent is reconciled as Done on 2026-11-02 after approval of DR-020e.
This closes the bounded presentation refresh, not the unverified real mutation workflows or shared audits.

## Closure and next action

- Creation chrome/fields and editing chrome/information/settings are approved; see each child's evidence.
- DR-032/033/034/043/044 retain shared contrast and DatePicker locale audits. No global styling is changed here.
- Actual screen-reader use, exhaustive control contrast/hydration, mounted English/French,
  null-data responses and real authenticated creation/save/outage workflows remain unverified.
- Acceptance does not mark unperformed or failed checks as passed. Unchecked criteria remain in child briefs.
- Next invocation: confirm a real DR-021 enrollment consumer, split the parent into bounded children,
  then select only one. No enrollment implementation is included in DR-020.

## Consumer evidence

- [Tournament routes](../../../libs/frontend/pages/tournament/src/lib.routes.ts) lazy-load creation and editing.
- [Club detail](../../../libs/frontend/pages/club/src/pages/detail/page-detail.component.ts) navigates to creation
  with `clubId`; its tournaments tab emits the action under the existing permission gate.
- On 2026-11-02 isolated Chrome mounted `/tournament/create?clubId=cb0cfc70-d93c-4e81-92e6-07b5724d40b0`
  and rendered the real club name and creation form without submitting.
- On 2026-11-02 the integrated browser mounted
  `/tournament/8658b541-702a-408e-8114-2858a9428069/edit` with real tournament identity and both child forms,
  anonymously and without mutation requests.

## Reuse decision

Direct native PrimeNG is appropriate for the small creation chrome. Do not extract a one-to-one wrapper.
Editing retains its existing information/settings smart children, each owning its form, permissions and mutations.
DR-020c uses native chrome directly; no second confirmed consumer shares meaningful structure needing extraction.
DR-020d/e should reevaluate genuine field reuse without moving styling into a one-to-one wrapper.
Competition/tournament browsing alignment remains the reference, not a reason to alter unrelated competition pages.
