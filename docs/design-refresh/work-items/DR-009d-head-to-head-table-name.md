---
title: 'DR-009d: Head-to-head table name without pass-through'
description: 'Preserve translated native table naming while removing the existing pass-through binding.'
---

## Identity and scope

- ID: DR-009d. Status: see the [backlog](../backlog.md).
- Parent: [DR-009](DR-009-player-head-to-head.md). Prerequisite: approved Done DR-009c.
- Design rules: [refresh plan](../README.md); user rule: no PrimeNG `[pt]` or `[dt]` bindings.
- Mounted consumer: `/players/glenn-latomme/head-to-head`, freshly confirmed hydrated on 2026-11-25.
- Project: `frontend-pages-player`.
- Sources: [grid template][template], [grid component][component] and existing grid tests.
- Scope: replace only the table-name pass-through binding with supported native/semantic table naming.
- Preserve translated Partners/Opponents names, actual table semantics, columns, sorting, totals, empty/loading states
  and the browser-only table guard.
- Exclude filter/guidance/service changes, global/shared settings, dependencies and operational mutations.

## Baseline and proposed approach

- Current native Table receives its actual table `aria-label` through `[pt]`; this violates the standing user rule.
- Fresh parent inventory: dark 1332x1272, table named `Partners`, fifteen rows, three columns, average 33.24%, total 26.
  Historical opponent/theme/width results remain in DR-009c, not fresh evidence for this child.
- Check the installed PrimeNG Table's documented naming inputs/templates before choosing the smallest replacement.
  A native caption is a candidate; verify the resulting actual table name rather than naming only a wrapper.
- Do not replace pass-through with `[dt]`, DOM mutation, CSS/inline styling or an accessibility-only wrapper hack.
- Retain the existing smart page/presentational grid boundary; there is no new reuse case.
- No utility/style changes are expected. Record any necessary visible caption/layout effect and its review evidence.

## Implementation checklist

- [ ] Confirm installed native naming capabilities and capture current names in both modes.
- [ ] Remove the existing `[pt]` binding without losing translated native table naming.
- [ ] Adapt focused tests to the supported semantic contract, not implementation-specific attribute plumbing.
- [ ] Preserve excluded files and existing grid behavior; add no styles or shared settings.
- [ ] Record exact validation, browser evidence and remaining limits.

## Acceptance and verification

- [ ] Grid template contains no `[pt]` or `[dt]`; no equivalent DOM/style workaround is introduced.
- [ ] Actual table exposes the translated Partners/Opponents accessible name after switching modes.
- [ ] Populated and empty results preserve three/four columns, sorting and aggregate semantics.
- [ ] Light/dark at 390px/1440px retain contained native scrolling and any caption remains readable.
- [ ] Keyboard sorting/focus and named table navigation remain usable.
- [ ] Relevant existing focused Nx tests and player lint/build pass.
- [ ] Localization and browser-only SSR fallback are preserved; unperformed SSR tests remain explicitly open.
- [ ] User reviews the result or approves completion with disclosed limits.

## Evidence and handoff

- Scoped during DR-009 parent reconciliation only; implementation, tests and new visual verification are not run.
- No application edits, new consumers, extraction, styling exceptions or operations.
- DR-009c remains approved Done with its original limits; this child corrects an uncovered compliance requirement.
- Parent reconciliation was explicitly approved by `commit` on 2026-11-25 with this follow-up disclosed.
  That completion does not implement or verify this child.
- Exact next action: mark this child In progress and update current focus before implementing this bounded change.
  Do not reopen approved work or begin a different implementation slice.

[template]: ../../../libs/frontend/pages/player/src/pages/head-to-head/head-to-head-grid/head-to-head-grid.component.html
[component]: ../../../libs/frontend/pages/player/src/pages/head-to-head/head-to-head-grid/head-to-head-grid.component.ts
