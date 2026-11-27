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

- [DR-011a: Profile form](DR-011a-player-profile.md): approved with documented limits.
- [DR-011b: Editor chrome and feedback](DR-011b-player-editor-chrome.md): approved with documented limits.
- [DR-011c: Claims form](DR-011c-player-claims.md): approved with documented limits.
- [DR-011d: Ranking editor](DR-011d-player-ranking.md): approved parent with two approved children.

## Reconciliation and handoff

- [x] Confirm a mounted consumer rather than an export or unused call chain.
- [x] Split this multi-tab route into independently reviewable children.
- [x] Complete and review all required children with their explicitly accepted verification limits.
- [x] Reconcile the parent against their evidence and retained verification limits.
- [x] Obtain explicit parent approval with the consolidated verification limits.

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
- DR-011d mounted Ranking tab confirmed on 2026-11-25: 41 groups/313 rows.
  [DR-011d1](DR-011d1-ranking-history.md) completed history/read states;
  [DR-011d2](DR-011d2-ranking-dialog.md) completed dialog/mutation scope.
- DR-011d1: native named history Tables and dated edit Buttons, explicit read feedback and stale-response protection.
  Ten ranking tests plus eleven editor regressions and player lint/build pass; twenty existing lint warnings.
  Settled theme/width geometry, keyboard entry and sampled contrast pass; final history crops inspected.
  Preserve unchecked full visual/accessibility, locale and SSR/hydration criteria. No real ranking mutation submitted.
- Explicit DR-011d1 approval: `Approve DR-011d1 with documented limits and commit`; child is Done.
  Preserve its unchecked verification limits.
  Required workspace lint: 22 targets pass; twelve reproduce existing dependency-check failures matching DR-011c.
- DR-011d2 is Done after explicit approval: responsive native dialog/validation, typed whitelisted payloads
  and guarded mutation feedback.
  39 ranking/editor tests and player lint/build pass; sixteen existing warnings remain.
  Four theme/width checks cover normal/calendar/invalid/pending/error geometry and final keyboard/focus restoration.
  Native light Save/Delete contrast fails under DR-033; full accessibility, locale, live mutations and SSR remain unchecked.
- Explicit DR-011d2 approval on 2026-11-27: `Approve with documented limits and commit`.
  Preserve unchecked verification limits and DR-033 contrast failures.
  Required workspace lint: 22 targets pass; twelve reproduce existing dependency-check failures from DR-011d1.
- Ranking children are committed on existing `main`: DR-011d1 `89b7c6ec`, DR-011d2 `f83321a5`.
  DR-011d evidence was reconciled and explicitly approved with documented limits on 2026-11-27; ranking parent is Done.

### Parent reconciliation, 2026-11-27

- Started with a clean worktree on existing `main`; no branch or worktree creation.
- Confirmed the current mounted chain: `/players` registration in [app routes][app-routes],
  `:playerId/edit` in [player routes][player-routes], and Profile/Claims/Ranking children in
  the [page template][page-template]. This is source confirmation, not a fresh hydrated-browser pass.
- Read every required child brief, including both ranking children, and inspected current page orchestration
  and all three child templates. Native Panels/fields, tab/save targeting and Toast, claims grouping/read feedback,
  ranking Tables and responsive labelled dialog remain present.
- The existing page/form boundary separates orchestration and child concerns. Ranking fields already render from
  one discipline list. No additional real consumer justifies another smart/presentational wrapper.
- Verified the approved implementation and ranking-parent commits in current branch history:

| Required concern | Approved commit | Retained evidence                                                                |
| ---------------- | --------------- | -------------------------------------------------------------------------------- |
| DR-011a profile  | `34e06bb5`      | Seven tests, player lint/build, bounded theme/width and keyboard checks          |
| DR-011b chrome   | `8907a115`      | Eighteen editor/profile tests, player lint/build, bounded chrome/Toast checks    |
| DR-011c claims   | `643aee47`      | Twenty-eight claims/editor/profile tests, player lint/build, safe-fixture checks |
| DR-011d1 history | `89b7c6ec`      | Twenty-one ranking/editor tests, player lint/build, bounded history checks       |
| DR-011d2 dialog  | `f83321a5`      | Thirty-nine ranking/editor tests, player lint/build, bounded dialog checks       |
| DR-011d parent   | `a96239dd`      | Explicitly approved documentation reconciliation with child limits               |

- These are inherited child results, not newly run application checks. Test totals overlap; do not sum them.
  All required children are Done by their individual approvals; optional DR-011e does not gate this parent.
- Utility comparisons remain child-scoped: profile 84 -> 65, chrome 46 -> 24, claims 60 -> 43,
  history 63 -> 20, dialog 66 -> 26. No new utility/style changes or exceptions in this reconciliation.
- No application, service, dependency, authentication, storage, browser or operational changes.
  Documentation-only scope does not require a new application build/test or visual pass.

### Consolidated verification limits

- Keep every unchecked child criterion unchanged. Parent reconciliation does not convert acceptance into a pass.
- Full screenshot/contrast/accessibility, screen-reader/touch, browser locale switching, live save/delete/permission/
  navigation and SSR/hydration checks remain unperformed as detailed in each brief.
- Claims retains its service-interrupted full mounted-catalog theme/width, browser-state, sampled-contrast and
  translated-label checks. Safe-fixture checks do not establish full real-catalog coverage.
- Light Button labels fail at 3.65:1 (Save) and 3.76:1 (Delete), warn Message at 2.83:1 and shared subtitle at
  4.46:1. DR-033/034/076 remain open; no shared/theme workaround or resolved contrast claim.
- Existing workspace lint: 22 of 34 targets pass; twelve dependency-check failures remain unresolved.
  The child briefs retain exact commands, target lists and warning counts; no workspace lint rerun in this scope.
- Existing identifier persistence and localization gaps remain deferred; no optional functional DR-011e started.
- Explicit parent approval on 2026-11-27: `Approve with documented limits and commit`.
  DR-011 is Done by that approval. The accepted limits above remain unchecked in every child;
  approval is not evidence that failed or unperformed checks passed.

### Exact next action

- Commit only this approved reconciliation and directly related handoff on existing `main`; no push.
- Next invocation: scope one bounded DR-029 cleanup child using the completed DR-029a inventory
  and a fresh consumer check. No remaining item is Ready; do not promote the entire global cleanup or remove
  deferred consumers without evidence. Do not restart completed player children or optional DR-011e.

### Documentation validation

- `git --no-pager log -8 --format="%h %s"` and scoped last-change logs confirm the six approved commits above.
- `npx prettier --write` with exactly the six changed design-refresh documents: passed.
  With no remaining `In progress` row, the formatter narrows the existing registry status column;
  historical rows, IDs and statuses are preserved apart from DR-011's transition to Review.
- `git --no-pager diff --check`: passed.
- Read-only inline Node assertions: six scoped documents use LF, valid frontmatter and trailing newlines;
  536 local link targets exist; DR-011/a-e registry rows are unique and match Done/Backlog after approval;
  every child checklist is unchanged from its committed version.
- Existing Git LF-to-CRLF warnings do not describe current file bytes; actual documents are verified LF.
- No application lint/build/test or browser checks run for this documentation-only reconciliation.

[page]: ../../../libs/frontend/pages/player/src/pages/edit/page-edit.component.ts
[app-routes]: ../../../apps/app/config/app.routes.ts
[player-routes]: ../../../libs/frontend/pages/player/src/lib.routes.ts
[page-template]: ../../../libs/frontend/pages/player/src/pages/edit/page-edit.component.html
