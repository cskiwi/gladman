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
2. [DR-024a4b](DR-024a4b-creation-dialog.md): creation dialog is implemented and approved Done.
   Before this child, the deprecated native footer was absent in the live browser; form actions now render.
   `subEventType`, `minLevel` and `maxLevel` controls do not reach `createDraw`'s mutation payload.
   User explicitly chose removal on 2026-11-09; preserve selected sub-event and the existing API.
   All 94 focused tests and scoped lint/build pass; four theme/width layouts and overlays fit.
   Retain shared DR-033/DR-034 contrast failures, final network-observation timeouts and unperformed checks.
   User approved completion/commit with these disclosed limits on 2026-11-09; unchecked criteria remain.
3. [DR-024a4c](DR-024a4c-draw-locales.md): remaining mounted draw locale completeness, including summary
   descriptions, identity/type labels and confirmation/error copy. Both dialogs are approved Done.
   Existing localized creation/seeding options need verification, not another redesign.
   Locale child is approved Done on 2026-11-09: 127 focused tests and scoped lint/build pass.
   Twelve populated locale/theme/width cases, 36 overlays, nine canceled confirmations and 60 feedback fixtures pass.
   Keep shared DR-033/DR-034 contrast failures and unperformed operational/accessibility/SSR checks disclosed.
   User explicitly approved this child's completion/commit with these limits; aggregate review is separate.

## Aggregate acceptance

- [x] Required child implementation and focused validation are complete with their recorded limits retained.
- [x] Aggregate evidence, remaining limits and required user review are reconciled.
- [x] Parent review is approved without claiming unperformed checks passed.

## Aggregate reconciliation on 2026-11-09

- Selected only aggregate verification and handoff; initial worktree is clean.
- Child commits are `6ec04b39` (seeding), `91ca230c` (creation) and `ecbfe7fd` (mounted locales).
- Actual authorized Draws consumer is reconfirmed in Dutch/dark with HE 8-9, two genuine unassigned
  entries and no draws. No new consumer, permission override or operational write is needed.
- Reconcile the existing smart tab/service and approved child evidence without application changes.
  Keep both one-consumer dialogs in the tab; no repeated live domain structure justifies extraction.
- Aggregate review is separate from the three recorded child approvals.
- Combined source retains native Dialog/form/InputText/Select/Button/Message, responsive layout utilities,
  explicit labels, required name validation, optional size and reactive localized options.
  Creation preserves selected sub-event/name/type/size; seeding preserves ranking/random/manual values.
  Pending state, duplicate submission, failure/retry, malformed-response diagnostics and success refetch
  remain covered by focused mocks. Both visibility-guarded document Escape handlers restore opener focus;
  child browser evidence explains the body-ported native Dialog limitation.
- Mounted descriptions/type/unknown identity labels and three native confirmations use active translations;
  five consumed local failure fallbacks are localized while server Error messages remain unchanged.
  Asset-backed locale tests use all three real dictionaries and preserve values without additional reads.
  The unused setEntrySeed method remains excluded; missing/partial mounted operation feedback remains DR-053.
- Utility evidence is cumulative, not additive: full-template static class/styleClass tokens progress
  171 to 168 (seeding), 124 (creation), then remain 124 (locales).
  No new component, stylesheet, inline/global styling, shared theme, dependency or backend/schema change.
  No new styling exception; preserve the documented bounded Escape runtime workaround.
- Corrected parent planning statements without closing DR-024a or DR-024.

### Validation and browser evidence

- `npx nx show project frontend-pages-tournament --json` and
  `npx nx show project backend-translate --json` confirm existing targets and dependencies.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=pages/admin/tabs/draws --runInBand --output-style=static`:
  four suites / 127 tests pass by local Nx cache replay, not fresh execution.
- `npx nx run-many -t lint build -p frontend-pages-tournament,backend-translate --output-style=static`:
  all 16 tasks pass by Nx cache replay. Existing cached executor/Jest metadata/dynamic-import warnings remain.
  Cached tournament build also reports NG8102 on the localized draw-type fallback at template line 189;
  this reconciliation does not alter application code or claim a warning-free build.
- Fresh mounted DOM/snapshot confirms authorized Draws, selected HE 8-9, genuine counts 2/0/2/0,
  all four nonempty Dutch summary descriptions, unassigned table and empty draw list.
- Attempted fresh light/dark 390/1440px creation-dialog checks stop before the first successful click.
  Native theme-toggle actionability times out while the shared page reports visibilityState hidden.
  Retrying at desktop and bringToFront do not resolve it; screenshot scrolling also times out waiting for stability.
  Do not claim a fresh screenshot, settled responsive/theme matrix, dialog/keyboard or network-refresh pass.
- Prior child evidence remains valid but is not freshly repeated here:
  seeding/creation each record four theme/width layouts and overlays, keyboard/focus and local pending/error fixtures;
  locale child records twelve populated locale/theme/width cases, 36 overlays, nine canceled confirmations
  and 60 local feedback fixtures. Its final real refresh is HTTP 200 without GraphQL errors and retains focus.
  Creation child's final network-observation timeouts remain historical limits, not retroactive passes.
- Original Dutch/dark/1355x1249/HE 8-9/Draws is restored and confirmed from DOM.
  No dialogs, selected rows, synthetic records, intercepted requests or operational writes are introduced.
- Only the backlog and DR-024a4/DR-024a/DR-024 handoff documents change.
  Repository `npx prettier --write` runs on all four documents; `git diff --check` passes.
  Git reports existing LF-to-CRLF configuration warnings; authored changes retain LF.
  Documentation-only edits do not require new application build/test execution.

### Disclosed limits and exact next action

- [ ] Resolve DR-033: child native light primary Apply/Create text fails at 3.65:1.
- [ ] Resolve DR-034: child native error Message text fails light/dark at 4.44/4.40:1.
- [ ] Fresh aggregate light/dark, narrow/wide and keyboard checks complete on a visible shared browser.
- [ ] Full tournament/workspace suite, app production build, live operational/permission variants,
      exhaustive accessibility and dedicated SSR/hydration checks complete.
- [x] User approves aggregate completion with these limits, or requests bounded further verification.
- User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
  Authoritative backlog status is Done by explicit aggregate approval, separate from the child approvals.
  Approval covers only this four-document handoff and accepts the listed shared contrast failures, fresh browser
  actionability/timeouts, cached warnings and unperformed full-suite/app-build, live-operation/permission,
  exhaustive accessibility and SSR/hydration checks. Failed/unperformed criteria remain unchecked;
  approval is not evidence that they passed.
- Commit only this approved aggregate handoff without pushing. If future browser verification is requested,
  foreground the shared page before retrying actionability checks; operational browser writes remain excluded.
- Next candidate after approval: DR-024a draw-management aggregate reconciliation across its required children.
  Keep DR-024a and DR-024 open; do not begin that independent reconciliation or scheduling in this invocation.
