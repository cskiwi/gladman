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
- [DR-011b: Editor chrome and feedback](DR-011b-player-editor-chrome.md): approved with documented limits.
- [DR-011c: Claims form](DR-011c-player-claims.md): approved with documented limits.
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

- DR-011b replaces legacy `activeIndexChange` with native Tabs value change and verifies actual selected-tab saves.
  It also replaces parent palette/inline feedback and restores a local native Toast outlet; approved with limits.
- Light native Button/warn Message contrast remains DR-033/034; shared subtitle contrast is new DR-076.
  Preserve the child's unchecked contrast/full-accessibility, locale, live-save and SSR/hydration criteria.
- In the DR-011b page test, asynchronously added claims controls remained enabled when the permission predicate
  was false. DR-011c fixes child initialization with focused tests without changing the permission predicate.
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
- DR-011b: eleven page tests plus the seven profile tests and player lint/build pass, with 20 existing lint warnings.
  Settled theme/width geometry and native keyboard checks pass; inherited light contrast failures remain disclosed.
- Explicit DR-011b approval on 2026-11-25: `Approve DR-011b with documented limits and commit`.
  Preserve unchecked contrast/full-accessibility, locale, live-save and SSR/hydration criteria.
  Required workspace lint: 22 targets pass; twelve reproduce existing dependency-check failures outside this slice.
- DR-011c: native category Panels, labelled Checkbox descriptions, bulk dirty tracking and guarded save lifecycle.
  Ten claims tests plus eighteen editor/profile regressions and player lint/build pass; twenty existing warnings.
  Two missing locale keys added to all three catalogs and their generated i18n type.
  Four safe-fixture theme/width keyboard/geometry cases pass; real catalog counts/current-save activation confirmed.
  Local frontend/API interruption prevented remaining screenshot/contrast, browser-state and locale verification.
  Fixtures removed and temporary helper stopped; no operational mutation or shared service restart.
- Explicit DR-011c approval on 2026-11-25: `Approve DR-011c with documented limits and commit`.
  Preserve unchecked visual/accessibility, browser-state, locale, real-save/navigation and SSR/hydration criteria.
  Required workspace lint: 22 targets pass; twelve reproduce existing dependency-check failures matching DR-011b.
- DR-011 remains open. Exact next candidate: scope DR-011d ranking form and confirm its mounted consumer
  in a subsequent invocation; do not start it here.

[page]: ../../../libs/frontend/pages/player/src/pages/edit/page-edit.component.ts
