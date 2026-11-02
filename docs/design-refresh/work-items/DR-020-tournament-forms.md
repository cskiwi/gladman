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
- DR-020b: creation fields, validation, mutation feedback and actions; scope before promotion.
- DR-020c: editing heading, tabs, feedback and actions; confirm mounted consumer before promotion.
- DR-020d: editing information tab; confirm mounted consumer before promotion.
- DR-020e: editing settings tab; confirm mounted consumer before promotion.

The parent remains open until all required children are complete. Child labels beyond DR-020a are proposed scopes,
not evidence of verified use or completed implementation.

## Consumer evidence

- [Tournament routes](../../../libs/frontend/pages/tournament/src/lib.routes.ts) lazy-load creation and editing.
- [Club detail](../../../libs/frontend/pages/club/src/pages/detail/page-detail.component.ts) navigates to creation
  with `clubId`; its tournaments tab emits the action under the existing permission gate.
- On 2026-11-02 isolated Chrome mounted `/tournament/create?clubId=cb0cfc70-d93c-4e81-92e6-07b5724d40b0`
  and rendered the real club name and creation form without submitting.

## Reuse decision

Direct native PrimeNG is appropriate for the small creation chrome. Do not extract a one-to-one wrapper.
Evaluate smart/presentational reuse when both editing consumers and their actual shared form contracts are inspected.
Competition/tournament browsing alignment remains the reference, not a reason to alter unrelated competition pages.
