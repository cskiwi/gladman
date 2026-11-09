---
title: 'DR-024a3: Draw filters, assignment and lists'
description: 'Bounded presentation children for the mounted administration Draws tab.'
---

## Identity and scope

- ID: DR-024a3. Parent: [DR-024a](DR-024a-admin-draws.md).
- Status: [backlog](../backlog.md). Rules: [design refresh](../README.md).
- Dependencies: approved DR-024a1 read lifecycle and DR-024a2 summary.
- Actual authorized mounted consumer confirmed on 2026-11-09:
  `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=draws`.
- Source: `libs/frontend/pages/tournament/src/pages/admin/tabs/draws/`.
- Required children and aggregate review are complete with explicitly accepted verification limits.

## Child sequence

1. [DR-024a3a](DR-024a3a-draw-filters.md): sub-event filter and top-level actions only.
   Approved complete on 2026-11-09 with DR-033 contrast failure and unperformed checks retained.
2. [DR-024a3b](DR-024a3b-unassigned-entries.md): unassigned entries, selection and assignment controls.
   Approved complete on 2026-11-09 with DR-033 contrast failure and unperformed checks retained.
3. [DR-024a3c](DR-024a3c-draw-lists.md): populated draw lists, draw actions and empty/no-selection presentation.
   Approved complete on 2026-11-09 with DR-034 dark Message contrast failure and unperformed checks retained.

All three required presentation children are approved Done. Aggregate evidence/review reconciliation is complete;
their unchecked live-operation, accessibility and SSR limits are not aggregate passes.

## Boundaries and acceptance

- Preserve the smart tab/service boundary; extract presentation only when a real repeated consumer justifies it.
- Mounted empty panels confirm the assignment/list surfaces, but populated behavior needs safe focused fixtures.
- Do not add a consumer, perform browser operational writes or hide shared/global changes in a child.
- Exclude summary, dialogs, scheduling, backend/schema, dependencies and shared theme.
- [x] All required children and their focused checks are complete.
- [x] Aggregate behavior, responsive/theme, localization and accessibility evidence is reconciled.
- [x] User review and approval are recorded with outstanding verification limits retained.

## Aggregate reconciliation on 2026-11-09

- Selected only aggregate verification and handoff, not another implementation child.
  Initial worktree is clean. The approved children are committed as `1f8a4aef` (filters),
  `94755dab` (unassigned entries) and `dd5eac92` (draw lists/actions).
- Actual authorized mounted consumer is reconfirmed at the recorded route, Dutch/dark, HE 1, genuine empty records.
  Combined source retains native named Panels, fluid selectors, selection Table and scrolling draw Tables.
  Operational handlers, action arguments, native disabled/loading gates and read/error branches remain wired.
- No application edits are needed for reconciliation. Retain the smart tab/service boundary:
  no second real consumer sharing the domain presentation justifies extracting a one-off dumb component.
  No new component, dependency, locale, stylesheet, inline styling or global change.
- Child utility evidence is cumulative, not additive: full-template static class/styleClass tokens
  progress 363 to 357 to 272 to 171. Summary's earlier change is outside this aggregate.
- Child tests cover three real locale dictionaries, singles/doubles names, seed order, capacity,
  selection/target/reset, pending/error recovery and mocked assignment/remove/clear/delete contracts.
  The child fixtures provide populated, empty-draw and no-selection browser evidence;
  those checks are not claimed freshly rerun during this reconciliation.
- Existing blank summary descriptions, French terminology, dialog copy and English confirmations
  remain for DR-024a4. Do not describe the entire Draws tab as fully localized.
- Corrected outdated DR-024a/DR-024 parent planning statements without closing either parent.

### Validation and fresh browser evidence

- `npx nx show project frontend-pages-tournament --json`: confirms lint/build/test targets.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=draws-tab.component.spec.ts --runInBand --output-style=static`:
  passes one suite / 60 tests by Nx cache replay, not a fresh execution.
- `npx nx run-many -t lint build -p frontend-pages-tournament --output-style=static`:
  passes all 12 tasks by Nx cache replay. Existing cached warnings remain; no new dependencies.
- Four settled genuine-empty Dutch light/dark at 390/1440px cases pass:
  no document overflow, all four named regions fit, both empty messages remain visible,
  and empty unassigned bulk controls remain disabled.
- Keyboard ArrowDown opens all 35 real sub-event options; Escape restores selector focus.
  Tab proceeds Generate, Create, Refresh. Enter on Refresh returns real `SubEventDrawsData`
  HTTP 200 without GraphQL errors, retains native button focus and restores four genuine zero counts.
- Combined dark/wide screenshot is inspected; initial capture overlaps the selector probe,
  so it is not evidence of a closed overlay. Final settled overlay closure is separately verified;
  a subsequent closed-overlay dark/wide screenshot is inspected and confirms the combined native Panel layout.
- No operational actions, request interceptors or synthetic records are used in this invocation.
  Original Dutch/dark/1355x1249/HE 1/Draws route and closed overlay are restored.
  Existing Scheduling HTTP 400 is still visible and remains DR-024b.
- `npx prettier --write` on the four changed handoff documents passes; `git diff --check` passes.
  Documentation-only edits do not require new application build/test execution.

### Disclosed limits and exact next action

- [ ] Resolve DR-033: child light primary Create/Assign normal text fails at 3.65:1.
- [ ] Resolve DR-034: child dark native no-selection info Message text fails at 4.32:1.
- [ ] Full tournament suite, populated real reads, live operations/permissions, exhaustive accessibility,
      browser locale matrix and dedicated SSR/hydration are verified.
- [x] User approves aggregate completion with these limits retained, or requests bounded further verification.
- User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
  Authoritative backlog status is Done by explicit aggregate approval.
  Approval covers only the four-document handoff and accepts the listed contrast and unperformed-check limits.
  All failed/unperformed criteria remain unchecked; approval is not evidence that they passed.
- Commit only this aggregate handoff with a Conventional Commit; no push.
  Keep DR-024a and DR-024 open. Next invocation: scope one DR-024a4 dialog/locale child from its mounted consumer,
  splitting the creation dialog, seeding dialog and remaining locale work before implementation.
  Do not begin that independent work here.
