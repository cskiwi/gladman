---
title: 'DR-011: Player editing'
description: 'Bounded migration of the mounted player editor, one form or shared page concern at a time.'
---

## Identity and scope

- ID: DR-011. Authoritative status: [backlog](../backlog.md).
- Design rules: [refresh plan](../README.md). No incomplete prerequisites.
- Mounted route: `/players/glenn-latomme/edit`, confirmed hydrated on 2026-11-25.
- Root `/players` registration loads the player routes; `:playerId/edit` mounts
  [PageEditComponent][page], which renders profile, claims and ranking children.
- Project: `frontend-pages-player`. Preserve data, permissions, routing and save behavior.

## Required children

- [DR-011a: Profile form](DR-011a-player-profile.md): selected first; profile child only.
- DR-011b: Editor chrome, tab state, loading/error and save feedback. Scope separately before promotion.
- DR-011c: Claims form. Scope separately before promotion.
- DR-011d: Ranking form. Scope separately before promotion.

## Reconciliation and handoff

- [x] Confirm a mounted consumer rather than an export or unused call chain.
- [x] Split this multi-tab route into independently reviewable children.
- [ ] Complete and review all required children.
- [ ] Reconcile the parent against their evidence and retained verification limits.

The existing page/container and form-child boundary already separates orchestration from each form.
Do not introduce a second wrapper without confirmed repeated structure in real consumers.
The profile child currently owns its reactive form, permissions and mutation; extracting those is not required
to refresh its presentation.

### Deferred findings

- The parent binds legacy `activeIndexChange` instead of native Tabs value change; current-tab saving can target
  the wrong form. Investigate within DR-011b, not as a hidden profile change.
- Parent unsaved/error palette markup, progress inline height and local Toast provider/rendering need DR-011b review.
- Profile `sub` and `memberId` controls are editable for administrators but are absent from its update payload.
  Preserve that behavior here; decide their intended editability/persistence in optional functional DR-011e.
  This follow-up does not gate the design parent; it needs a separate scope/decision before promotion.
- Profile mutation/error copy and administrative labels, and shared PrimeNG calendar locale copy, retain existing
  localization gaps. Do not equate this presentation slice with a complete editor-localization pass.

### Current child evidence

- DR-011a is Done after explicit approval on 2026-11-25:
  `Approve DR-011a with documented limits and commit`.
- Seven focused tests and player lint/build pass; 24 pre-existing warnings remain.
- Native Panels, fluid/named controls and semantic validation are scoped to the profile child.
- Preserve the child's unchecked full visual/accessibility, locale, live-save and SSR/hydration criteria.
- Required workspace lint: 22 targets pass; twelve reproduce existing dependency-check failures recorded in the child.
- Exact next candidate: scope DR-011b editor chrome, tab state and feedback in a subsequent invocation.
  No other implementation child is started.

[page]: ../../../libs/frontend/pages/player/src/pages/edit/page-edit.component.ts
