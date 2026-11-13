---
title: 'DR-013h: Builder feedback localization'
description: 'Localized validation, notifications and confirmations in the mounted club team builder.'
---

## Identity and scope

- ID: DR-013h. Status: see the [backlog](../backlog.md).
- Parent: [DR-013](DR-013-club-team-builder.md). Dependencies: DR-013b through DR-013g (Done).
- Design rules: [design refresh](../README.md).
- Confirmed consumer: `/clubs/smash-for-fun?tab=team-builder`, including team-card validation,
  player-chip warning details, builder notifications and remove/save confirmations.
- Nx project: `frontend-pages-club`; existing nl/fr/en translation dictionaries and generated types.
- Sources: [builder caller](../../../libs/frontend/pages/club/src/pages/detail/tabs/club-team-builder-tab.component.ts),
  [service](../../../libs/frontend/pages/club/src/pages/detail/tabs/club-team-builder-tab.service.ts),
  [calculator](../../../libs/frontend/pages/club/src/pages/detail/tabs/team-builder/utils/team-index-calculator.ts),
  [Card](../../../libs/frontend/pages/club/src/components/team-builder/builder-team-card.component.html) and
  [chip](../../../libs/frontend/pages/club/src/components/team-builder/player-chip.component.html).
- Preserve calculations, validation order, counts, severities, permissions, draft initialization, payloads and mutations.
- Exclude algorithms, persistence changes, other routes/dialogs, shared theme/CSS and dependencies.

## Baseline and approach

- Clean worktree before selection. Mounted Dutch page displays English `Team index 79 exceeds maximum 76`
  and `Maximum 8 players allowed, have 10` in native Messages.
- The service/pure calculator store English validation and warning strings. Caller-owned Toast and ConfirmDialog
  strings are also English. Store typed translation descriptors instead and translate at presentation time,
  so changing locale does not require recalculating teams or translating by matching English strings.
- Keep existing smart/service and presentational Card/chip separation. No new wrapper is warranted.
- Reuse native Toast/ConfirmDialog with localized actions and responsive sizing; no new styling layer.
- Baseline templates already use semantic utilities. Record class-token comparison after implementation.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and bounded scope.
- [x] Localize validation and per-player warnings without changing calculations.
- [x] Localize notifications and confirmations while preserving callbacks and severities.
- [x] Preserve locale updates in presentational consumers; persistence payload construction is unchanged.
- [x] Record validation, evidence and discoveries; leave adjacent work unchanged.

## Acceptance and verification

- [x] Validation thresholds, order, regular/backup and gender rules are preserved in focused tests.
- [x] Locale changes update existing Card/chip messages without recalculating or mutating teams.
- [x] Notifications preserve severity/count/name/season interpolation.
- [x] Save/remove confirmations retain counts, warnings and exact callbacks; cancellation does not mutate in tests.
- [x] Native confirmation is usable in light/dark at 390px/1440px with named actions and keyboard dismissal.
- [x] No new palette utilities, SCSS or equivalent styling workaround.
- [x] Relevant Nx lint/build/tests pass, or infrastructure failures are recorded explicitly.
- [ ] Full accessibility/contrast, nl/fr/en browser and SSR/hydration verified.
- [x] User approved completion with the disclosed limits, retaining unchecked verification.

## Evidence and handoff

- Implemented 12 validation and 19 notification/confirmation keys in nl/fr/en, with corresponding generated types.
  Pure validation returns typed descriptors; Card/chip translate them at render time. Summary entries retain the
  team/player context separately. No domain calculation, save payload or persistence algorithm changed.
- Keep the existing service/presentational separation. There is no repeated new UI structure warranting extraction.
- Native ConfirmDialog retains its own header, icon and footer actions, focuses Cancel initially, and uses a small
  message template with text interpolation. This preserves line breaks and treats dynamic names as text, not HTML.
  Native Toast uses its documented narrow-screen breakpoint option and localized close-button passthrough.
- Installed ConfirmDialog's breakpoint handler iterates its input signal without reading it; closeAriaLabel is not
  forwarded to Dialog. Use layout-only `w-80 sm:w-160` sizing and documented close-button passthrough attributes.
  Focused component tests verify the named close action and native Cancel isolation. Follow-up: DR-064.
- Native confirmation also leaves focus on Body after dismissal. A scoped onHide handler restores the actual
  connected trigger, matching existing repository focus-restoration patterns without timers or global changes.
  Component and mounted Escape/Cancel/close checks pass after this repair.
- Literal static `class`/`styleClass` tokens: builder 111 -> 119, Card 74 -> 74, chip 54 -> 54.
  The increase is native overlay width, message wrapping/spacing and paragraph margin reset.
  Zero new colors, CSS/SCSS or equivalent appearance overrides. No styling exception.
- Existing import creation failure can still lead to a success notification, because the service logs and continues.
  That pre-existing persistence/error contract is not changed by localization; follow-up DR-065.
- No operational/admin mutation or live team-save/import/removal acceptance performed.
  Commit authorized by the explicit approval recorded below; no push authorized.

### Validation results

- PASS: repository `npx prettier --write --end-of-line lf` on every changed file.
- PASS: `npx nx run-many -t lint build -p frontend-pages-club --output-style=static` (12 tasks, inherited warnings).
- PASS before commit: `npx nx run-many --target=lint --output-style=static` (34 projects, inherited warnings).
- FAIL before execution:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=team-builder --output-style=static`:
  nine suites fail on missing `zone.js`, DR-059.
- PASS:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=team-builder
--jestConfig=tmp\dr013h-jest.config.cjs --output-style=static`: nine suites / 33 tests.
  Seven added cases cover calculation descriptors, inclusive/zero bounds, backup/gender/level behavior,
  live locale updates in Card/open chip details, save success/failure, removal/cancellation, locale-specific confirmation
  reopening and all notification callbacks/counts. Existing 26 regressions pass.
  The same 33 tests and focused lint/build pass again after adding confirmation focus return and localized Toast close.
- The temporary config changes only rootDir/setupFilesAfterEnv to the existing tournament zoneless setup.
  Removed after verification; no dependency or shared test setup changes.
- PASS: JSON parsing and exact key/interpolation-parameter parity across all three locales; `git diff --check`.
- NOT RUN: full application build/suite, live import/team save/removal, full accessibility/contrast,
  fr/en browser or dedicated SSR/hydration checks.

### Browser evidence and resolved blocker

- The actual mounted Dutch Card warnings were English before implementation. After implementation they expose
  the new raw keys because the running API serves the old dictionaries. Save confirmation opens with the
  existing Dutch heading/actions and raw new message/validation keys. Cancel receives native initial focus.
- Pointer clicks timed out waiting for moving nodes. A DOM click opened confirmation; this is not a passing
  pointer-interaction check. Escape was sent and later no confirmation remained, but timing/focus return is not verified.
- Both port 5000 and the port 3000 GraphQL proxy respond HTTP 200 to `{ __typename }`.
  The actual `/api/v1/translate/i18n/nl_BE` response does not contain `saveMessage`.
  A bounded 12-attempt readiness loop at five-second intervals still returned old assets on every attempt.
  API responsiveness alone is not translation readiness.
- The user responded `API refreshed; continue verification`. A follow-up PowerShell JSON conversion failed on
  existing case-sensitive `other`/`Other` keys; that was a client parsing failure, not API unavailability.
  A Node `fetch`/`JSON.parse` check confirms the real translation endpoint contains the new saveMessage in
  both ports, and both GraphQL endpoints return 200. No shared service was restarted by the assistant.
- Reloaded the actual mounted tab: nine Cards; errors now read `Ploegindex 79 overschrijdt het maximum van 76`
  and `Maximaal 8 spelers toegestaan, er zijn er 10`.
- Native Save confirmation opens with `9 bijgewerkte en 0 nieuwe ploegen met 72 spelers ... seizoen 2027`,
  two validation warnings, Dutch actions and no raw keys.
- Dutch light/dark at 1440x1000: settled confirmation 560x246px. At 390x844: 280x348px.
  All four cases have zero page/dialog horizontal overflow; native surfaces change with the theme.
  Initial Cancel focus, Tab to Save, Tab wrap to named close, Shift+Tab back to Save, Escape dismissal
  and actual Save-trigger focus return pass. Footer Cancel and keyboard header close also restore the trigger.
- At 390px in both themes, a 600-character synthetic unbroken DOM paragraph wraps without horizontal overflow;
  dismissal discards it. No model or backend data changed by that synthetic check.
- Applied unchanged settings locally to exercise success Toasts, never team persistence.
  Final four-case light/dark 1440px/390px Toast check observes zero GraphQL mutation requests.
  Translated summary/detail and `Sluiten` close label render; keyboard close works.
  Wide Toast: x=1157.5px, width=262.5px, height=77px, inside 1440px.
  Narrow Toast: x=9.75px, width=370.5px, height=62px, inside 390px. Neither theme overflows.
  An earlier Toast probe failed on an unscoped selector matching the separate global Toast; the final scoped probe
  waits for viewport dimensions and measures actual message elements after animation, not an empty host.
- Screenshot inspection: light/narrow and dark/wide show readable grouped confirmation copy and native actions.
  No sensitive screenshot/log committed. Full contrast/accessibility is not claimed (DR-032/033/034 remain).
- Restored dark theme at 1440x1000, closed overlays, and returned focus to the actual Save trigger.
- No live team save, import confirmation, player creation or removal accepted. Removal confirmation and
  success/error notification branches are covered by isolated component tests, not claimed as live browser workflows.
- Implementation and browser checks were moved to Review before seeking approval.
- Inherited limits: default club Jest setup needs missing `zone.js` (DR-059); shared contrast follow-ups
  DR-032/033/034 remain separate.

### Approval and next action

- The user explicitly approved `Approve and commit DR-013h with disclosed limits` on 2026-11-13.
- This child is Done. Approval accepts the recorded limits, including DR-059, fr/en browser, full accessibility/contrast,
  live persistence and SSR/hydration, without changing unchecked checks into passing results.
- Approval authorizes only this slice, its tests, translation assets/types and repository handoff.
- Exact next action: review the integrated DR-013 builder against the parent's remaining checklist and agree
  any parent-level verification limits before closing it. Keep DR-013 open; do not reopen completed children.
- DR-064/065 remain Backlog. No push authorized.
