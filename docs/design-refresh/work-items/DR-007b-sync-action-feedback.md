---
title: 'DR-007b: Localized mounted sync-action feedback'
description: 'Complete native Toast localization for the shared event, sub-event, draw and cache actions.'
---

## Identity

- ID: DR-007b. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-007](DR-007-shared-controls.md). Rules: [design refresh](../README.md).
- Scoped 2026-11-23 during parent reconciliation; implementation has not started.
- Dependencies: DR-007a, DR-067 and DR-073 are approved Done. No unresolved prerequisite.
- Preserve their accepted verification limits; this child does not reopen status styling or native focus handling.

## Scope

- Shared [action controller](../../../libs/frontend/components/sync/src/sync-button.component.ts),
  existing [tests](../../../libs/frontend/components/sync/src/sync-button.component.spec.ts), and translations in
  [en](../../../libs/backend/translate/assets/i18n/en/all.json),
  [nl_BE](../../../libs/backend/translate/assets/i18n/nl_BE/all.json) and
  [fr_BE](../../../libs/backend/translate/assets/i18n/fr_BE/all.json).
- Preserve generator ownership of any dependent
  [translation types](../../../libs/utils/i18n/src/lib/i18n.generated.ts); avoid unrelated generated formatting.
- Confirmed consumers are the five competition/tournament detail/draw routes in the parent inventory.
  All use event/sub-event/draw levels. Projects: `frontend-components`, `frontend-pages-competition`,
  `frontend-pages-tournament`; translations are assets, not a backend behavior change.
- Outcome: headings and failure details use the active locale, alongside the existing translated queued/cache details.
- Preserve native success/error/warn severities, queue-versus-completed meaning, interpolation context, message
  delivery, main/menu payload differences, cache flags, permissions, disabled/loading behavior and focus handling.
- Exclude the unmounted game-level actions/dialog, dormant ConfirmDialog, admin sync dashboard, backend/queue
  behavior, new confirmation flows, global Toast/theme styling and completed country/state controls.
- Do not run real sync/cache operations for tests, change permissions or add a production consumer for verification.

## Baseline and proposed approach

- Parent source audit: `syncEvent`, `syncSubEvent` and `syncDraw` use translated queued details but English
  `Success`/`Error` headings and English failure details. `clearCache` uses translated cleared/empty details,
  English headings and an English failure detail. This is source evidence, not a live operational reproduction.
- Existing locale assets already provide `all.common.success` and `all.common.error`; verify their exact paths
  and reuse existing suitable keys before adding narrowly scoped missing notification keys.
- Native Toast already supplies status visuals and announcement behavior. Keep the template and styling unchanged
  unless a concrete acceptance failure requires a directly related adjustment; verify installed native APIs first.
- The current shared control is the reuse boundary for all consumers. Do not extract a new presentational wrapper
  merely to relocate identical native markup. A small shared notification helper is optional only if it removes
  genuine repeated behavior while retaining explicit, typed outcomes.
- Main sync requests include children; menu sync requests do not. Cache actions pass their selected children flag.
  Mock Apollo rather than activating server operations when verifying these contracts.
- Baseline SplitButton has zero layout/color utility tokens. Add none; leave unused dialog utilities/styles intact.

## Implementation checklist

- [ ] Reconfirm mounted consumers and current locale keys before editing.
- [ ] Localize mounted sync/cache headings and failure details, reusing existing queued/cleared/empty translations.
- [ ] Preserve native severities, message semantics, payloads, permissions and loading/focus behavior.
- [ ] Add focused mocked-operation regressions in the existing test file, without real mutations.
- [ ] Verify native notification presentation across mounted consumers and record remaining limits.
- [ ] Update parent/backlog with review status and exact next action.

## Acceptance and verification

- [ ] en/nl_BE/fr_BE produce translated headings/details for event/sub-event/draw success and rejected operations.
- [ ] Cache cleared, empty and rejected outcomes retain distinct native success/warn/error messages in all locales.
- [ ] No raw translation keys or missing-name `undefined` values are exposed in changed messages.
- [ ] Main/menu include-children flags and entity IDs remain unchanged in mocked mutation assertions.
- [ ] Both native buttons disable during pending operations and re-enable on success/failure; no false live proof.
- [ ] Existing naming, locale-update and Escape/Tab isolation tests remain passed.
- [ ] Safe browser-only notification fixtures fit light/dark at 390px/1440px; dismissal, announcement attributes
      and focus behavior are checked without executing an operational command.
- [ ] Confirm shared integration on competition/new tournament/imported tournament and both draw routes.
- [ ] Relevant Nx tests/lint/build and changed-file formatter checks pass, with exact commands/results recorded.
- [ ] No new styles, palette utilities, dependencies, production consumers, wrappers or hidden global changes.
- [ ] User review approves this slice with explicitly disclosed limits before completion/commit.
- [ ] Full screen-reader/touch, contrast, exhaustive permission/locale workflows and SSR/hydration are verified.

## Evidence and handoff

- Planning only: no application implementation, fixture, new tests or visual acceptance checks performed.
- Current parent inventory confirms 13/36/37/1/1 mounted controls, with only event/sub-event/draw configurations.
- Existing success/error messages are not proof that operational outcomes have been tested.
  Nine current shared tests cover naming/loading/focus, not mutation-notification behavior.
- Use existing resolved Nx targets and scoped commands from DR-073 as a starting point, verifying configuration
  before running. Add no tooling or dependencies. Do not treat parent documentation checks as application validation.
- Reusable-pattern decision: retain the existing shared action component; no new smart/presentational split needed.
- Exceptions: none proposed. No changes to the accepted DR-007a gap exception or DR-073 focus workaround.
- Exact next action: mark this child In progress and implement only its mounted notification-localization scope.
  Keep DR-007 open until this child is reviewed. No implementation has started and no commit approval is recorded.
