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
- Keep this aggregate open until required children and aggregate review are complete.

## Child sequence

1. [DR-024a3a](DR-024a3a-draw-filters.md): sub-event filter and top-level actions only.
   Approved complete on 2026-11-09 with DR-033 contrast failure and unperformed checks retained.
2. [DR-024a3b](DR-024a3b-unassigned-entries.md): unassigned entries, selection and assignment controls.
   Approved complete on 2026-11-09 with DR-033 contrast failure and unperformed checks retained.
3. [DR-024a3c](DR-024a3c-draw-lists.md): populated draw lists, draw actions and empty/no-selection presentation.
   Approved complete on 2026-11-09 with DR-034 dark Message contrast failure and unperformed checks retained.

All three required presentation children are approved Done. Keep the aggregate open for evidence/review reconciliation;
their unchecked live-operation, accessibility and SSR limits are not aggregate passes.

## Boundaries and acceptance

- Preserve the smart tab/service boundary; extract presentation only when a real repeated consumer justifies it.
- Mounted empty panels confirm the assignment/list surfaces, but populated behavior needs safe focused fixtures.
- Do not add a consumer, perform browser operational writes or hide shared/global changes in a child.
- Exclude summary, dialogs, scheduling, backend/schema, dependencies and shared theme.
- [ ] All required children and their focused checks are complete.
- [ ] Aggregate behavior, responsive/theme, localization and accessibility evidence is reconciled.
- [ ] User review and approval are recorded with outstanding verification limits retained.
