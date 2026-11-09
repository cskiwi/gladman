---
title: 'DR-024a4: Draw dialogs and locales'
description: 'Bounded child sequence for mounted draw dialogs and remaining locale completeness.'
---

## Identity and scope

- ID: DR-024a4; parent [DR-024a](DR-024a-admin-draws.md).
- Authoritative status: [backlog](../backlog.md). Rules: [design refresh](../README.md).
- Dependencies: approved DR-024a1/a2/a3.
- Consumer: authorized Draws tab at
  `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=draws`, reconfirmed 2026-11-09.
- Keep the smart tab/service boundary; these dialogs have one live consumer each.
- Exclude scheduling, other tabs, shared/global styling and operational browser writes.

## Required children

1. [DR-024a4a](DR-024a4a-seeding-dialog.md): implemented seeding dialog, options and scoped locale copy.
   Focused tests/lint/build and browser layout/keyboard checks pass.
   User approved completion on 2026-11-09 with disclosed verification limits; this child is Done.
   Retain shared DR-033/DR-034 contrast failures and unperformed operational/accessibility/SSR checks.
2. DR-024a4b: scope creation dialog before implementation. Baseline native footer is absent in the live browser.
   `subEventType`, `minLevel` and `maxLevel` controls do not reach `createDraw`'s mutation payload.
   Resolve functional scope explicitly rather than quietly redesigning misleading controls.
3. DR-024a4c: remaining mounted draw locale completeness, including summary descriptions, creation options
   and confirmation/error copy. Inspect only after both dialogs are resolved.

## Aggregate acceptance

- [ ] Required children and their validation are complete.
- [ ] Aggregate evidence, remaining limits and required user review are reconciled.
- [ ] Parent review is approved without claiming unperformed checks passed.
