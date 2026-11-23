---
title: 'DR-007b: Localized mounted sync-action feedback'
description: 'Complete native Toast localization for the shared event, sub-event, draw and cache actions.'
---

## Identity

- ID: DR-007b. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-007](DR-007-shared-controls.md). Rules: [design refresh](../README.md).
- Scoped 2026-11-23 during parent reconciliation; selected for implementation on the same date.
- Existing `main`, clean worktree; preserve the current branch and do not create a worktree.
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

- [x] Reconfirm mounted consumers and current locale keys before editing.
- [x] Localize mounted sync/cache headings and failure details, reusing existing queued/cleared/empty translations.
- [x] Preserve native severities, message semantics, payloads, permissions and loading/focus behavior.
- [x] Add focused mocked-operation regressions in the existing test file, without real mutations.
- [x] Verify native notification presentation across mounted consumers and record remaining limits.
- [x] Update parent/backlog with review status and exact next action.

## Acceptance and verification

- [x] en/nl_BE/fr_BE produce translated headings/details for event/sub-event/draw success and rejected operations.
- [x] Cache cleared, empty and rejected outcomes retain distinct native success/warn/error messages in all locales.
- [x] No raw translation keys or missing-name `undefined` values are exposed in changed messages.
- [x] Main/menu include-children flags and entity IDs remain unchanged in mocked mutation assertions.
- [x] Both native buttons disable during pending operations and re-enable on success/failure; no false live proof.
- [x] Existing naming, locale-update and Escape/Tab isolation tests remain passed.
- [x] Safe browser-only notification fixtures fit light/dark at 390px/1440px; dismissal, announcement attributes
      and focus behavior are checked without executing an operational command.
- [x] Confirm shared integration on competition/new tournament/imported tournament and both draw routes.
- [x] Relevant Nx tests/lint/build and changed-file formatter checks pass, with exact commands/results recorded.
- [x] No new styles, palette utilities, dependencies, production consumers, wrappers or hidden global changes.
- [x] User review approves this slice with explicitly disclosed limits before completion/commit.
- [ ] Full screen-reader/touch, contrast, exhaustive permission/locale workflows and SSR/hydration are verified.

## Evidence and handoff

- Source reconfirmed the four production configuration producers and five route consumers from the parent.
  Fresh hydrated five-route inventory reconfirms 13/36/37/1/1 controls, event/sub-event on details and draw on draws.
- Safe before fixture, Dutch locale: `Error` / `Failed to sync Example event`, injected through the
  component's MessageService without an operation. Screenshot inspected; initial multi-element selector failed,
  then the single active Toast selector succeeded. No operational outcome is claimed.
- Headings reuse `all.common.success`, `all.common.error` and, for empty cache, `all.cache.clear`.
  Existing queued/cleared/empty details stay unchanged. Four new failure keys per locale preserve entity context.
  Missing, empty or whitespace-only display names use the existing entity ID, not `undefined`.
  No game-only notification/dialog/template or permission/mutation code was changed.
- Native Toast documentation confirms `MessageService.add`, severity/summary/detail and alert announcements.
  No new options, styles or utility tokens: SplitButton remains zero layout/color tokens before and after.
- Existing nine tests plus 24 focused regressions pass: actual three-locale assets, all mounted levels,
  queued/rejected sync and cleared/empty/rejected cache outcomes; exact main/menu mutation names, IDs and child flags;
  pending native-button disablement and re-enablement; missing/blank names; prior naming/locale/Escape isolation.
  All operations are mocked Apollo observables. No actual sync/cache operation was run.
- `npx nx run frontend-components:test --testPathPatterns=sync-button --runInBand --output-style=static`:
  one suite, 33 tests passed; existing PrimeUI license/ts-jest warnings.
- Initial `--runTestsByPath=libs/frontend/components/sync/src/sync-button.component.spec.ts` selection was ineffective:
  Jest ran all fourteen suites, thirteen passed; six failures in unchanged bracket-tree tests (removed
  `getTeamName` and order/visualCode expectations), 143 tests passed. These are unrelated; no bracket changes.
  The established `--testPathPatterns=sync-button` selector above isolates the required file successfully.
- `npx nx run-many -t lint build -p frontend-components frontend-pages-competition frontend-pages-tournament
--output-style=static`: all fifteen tasks pass, seven cached. Existing lint warnings only.
- Running API regenerated exactly four dependent entries in the generator-owned translation type.
  No manual generated edit; its own `prettier-ignore` pragmas preserve generator formatting.
  Repository `prettier --write` reports unchanged and `prettier --check` passes.
- Resolved blocker: localhost:3000 initially refused connections, confirmed by two TCP checks. User response:
  `I restarted the app; continue verification`. Fresh reload confirms updated controller and Dutch failure assets.
- Browser-only MessageService fixtures, not controller operations, cover all five mounted routes at
  390px/1440px in light/dark: twenty cases, with en/nl_BE/fr_BE switched live.
  Competition checks all nine message variants; the other routes sample queued/error/empty-cache variants.
  Total: 252 synthetic notifications, all with translated content, named close buttons, native `role=alert`,
  `aria-live=assertive`, `aria-atomic=true` and unchanged focus on the main sync button.
- Initial 400ms geometry sampling caught eight first-notification transitions before settlement.
  Discard those geometry samples. Longer-settled queued-message repeats on all twenty mounted theme/width
  combinations pass: native Toast bounds stay within viewport, close controls remain visible, GUID details wrap
  without inner overflow, and main-button focus is retained. At 390px the Toast spans x=92.5..355.
- Twenty matrix and four screenshot-fixture Enter/Space close checks dismiss the alert.
  Four explicit close-focus samples return to `body`, the existing native behavior; no new restoration is claimed.
  Dismissal is not operational workflow validation. No sync/cache command, permission or backend data was mutated.
- Before and after native Toast images inspected in light/dark. Two initial light captures were invalid due to
  browser viewport/paint timing and are discarded; a settled light repeat is readable.
  Integrated screenshot capture can reset the viewport to the panel's 1288px width, so screenshots are not evidence
  of a full 390px/1440px screenshot matrix; the separate measured DOM matrix above verifies those dimensions.
- Existing dark error-detail text is nearly invisible in both baseline and after images.
  Computed detail color is `oklch(0.14 0.02 250)` over translucent red; light is `oklch(0.3 0.025 250)`.
  Record this native/global contrast issue as DR-074, not a local style workaround or a contrast pass.
- Original home route, dark preference and 1288px by 1272px viewport restored; fixture messages cleared.
  Previously recorded navigation view-transition `InvalidStateError` remains unrelated.
- Final changed-file Prettier, whitespace, byte-level LF, locale-key, Markdown structure and local-link checks
  cover the nine scoped files: all nine use LF, three Markdown documents have frontmatter/no H1,
  434 local document links resolve, and all three locales contain the four new keys.
  Registry assertions retain DR-007 In progress, approved DR-007b/DR-007a/DR-067/DR-073 Done and DR-074 Backlog.
- Reusable-pattern decision: retain the existing shared action component; no new smart/presentational split needed.
- Exceptions: none proposed. No changes to the accepted DR-007a gap exception or DR-073 focus workaround.
- No active connection blocker remains. Full screen-reader/touch, measured contrast, exhaustive permission/locale
  workflows and SSR/hydration are not verified; no actual queued/completed/cache workflow is claimed.
- Explicit approval: `Approve DR-007b with documented limits and commit`.
  This authorizes completion and the scoped commit with the unchecked criteria retained, including the native
  dark Toast contrast issue DR-074, screenshot limits, screen-reader/touch, permissions, SSR and real operations.
  Approval is not evidence that these unperformed checks passed. No styling exception was introduced.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 34 projects,
  24 pass (nineteen cached); ten reproduce existing `@nx/dependency-checks` installed-version/package-range
  errors in unchanged manifests: backend-health, backend-seo, shared, backend-translate, backend-ranking, utils,
  backend-authorization, backend-search, backend-database and backend-graphql.
  Do not fix those unrelated dependency ranges in this slice. Final formatting/link/LF/registry checks pass.
- Exact next action: commit only the nine approved implementation/test/translation/handoff files, without pushing.
  Next invocation: reconcile DR-007 parent completion and accepted child limits before closing the parent.
