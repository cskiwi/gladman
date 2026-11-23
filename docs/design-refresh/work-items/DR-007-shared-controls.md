---
title: 'DR-007: Shared form controls and sync feedback'
description: 'Bounded shared-control slices and their mounted consumers.'
---

## Identity and scope

- ID: DR-007. Authoritative status: [backlog](../backlog.md).
- Rules: [design refresh](../README.md). No global theme changes are implied.
- Country/state integration is already approved in [DR-018b1](DR-018b1-country-state-selectors.md).
  Preserve that completed implementation and its accepted verification limits; do not restart it.
- Mounted competition and tournament detail pages consume shared sync indicators and action controls.
- First child: [DR-007a](DR-007a-sync-status-presentation.md), compact semantic sync-status presentation.
- Native sync action menus are covered by approved [DR-067](DR-067-sync-dropdown-name.md) naming and
  [DR-073](DR-073-sync-menu-focus.md) Escape focus restoration, with their accepted verification limits.
- Remaining mounted action notifications are scoped in [DR-007b](DR-007b-sync-action-feedback.md).
  DR-065 is unrelated builder import-failure feedback, not a dependency.
- Defer the game-only dialog: no current application consumer supplies `level: 'game'`.
- Club search contains service logic, not a visual component to refresh.

## Acceptance and handoff

- Selected 2026-11-23 on existing `main`, starting with a clean worktree: documentation-only reconciliation
  of remaining mounted sync-action/dialog scope. No application edits or operational mutations.
- Acceptance: verify current consumer/configuration evidence, preserve completed child limits, and persist the
  exact remaining work before deciding whether the parent can close.

- [x] Reconcile country/state work against its existing approved brief.
- [x] Confirm a current sync-indicator consumer and scope one implementation child.
- [x] Complete and obtain review for DR-007a, approved 2026-11-23 with its documented limits.
- [x] Reconcile remaining sync action/dialog work against current application consumers.
- [x] User approves the completed documentation-only reconciliation for commit, 2026-11-23: `commit`.
- [ ] Complete and obtain review for DR-007b before closing this parent.

DR-007 remains open until its required children and follow-ups are resolved.
DR-018b1, DR-007a, DR-067 and DR-073 remain approved Done; preserve their unchecked verification limits.
In particular, DR-007a retains its scoped zero-gap layout exception and DR-073 its native-focus workaround.
Historical child commands and theme/width matrices remain evidence of those slices, not fresh parent checks.

## Mounted-consumer reconciliation, 2026-11-23

The [root routes](../../../apps/app/config/app.routes.ts) mount the
[competition routes](../../../libs/frontend/pages/competition/src/lib.routes.ts) and
[tournament routes](../../../libs/frontend/pages/tournament/src/lib.routes.ts).
Fresh hydrated browser inventory at the unchanged dark 1288px by 1272px viewport confirms:

| Route / consumer                                   | Mounted configurations       | Visible controls |
| -------------------------------------------------- | ---------------------------- | ---------------- |
| `/competition/pbo-competitie-2026-2027`            | One event, twelve sub-events | 13               |
| `/tournament/eaff3ce2-a7de-4a89-8ca2-4110bb5fe3b8` | One event, 35 sub-events     | 15 of 36         |
| `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72` | One event, 36 sub-events     | 16 of 37         |
| Competition draw below                             | One draw                     | 1                |
| Tournament draw below                              | One draw                     | 1                |

- Competition draw: `/competition/pbo-competitie-2026-2027/sub-events/{subEventId}/draws/{drawId}`,
  sub-event `8e8ba158-859c-48a7-92ca-f2c3ce805f4f`, draw `78d42486-ab43-4484-9b68-a99e46bf96ae`.
- Tournament draw: `/tournament/pk-pbo-2025/sub-events/{subEventId}/draws/{drawId}`,
  sub-event `83ef864d-2e5f-4012-aa11-ea5fe0ee4627`, draw `ea1ac59a-1622-4e8b-823c-7a37e14e2674`.
- Actual configuration producers:
  [competition detail](../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.ts),
  [competition draw](../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.ts),
  [tournament detail](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.ts) and
  [tournament draw](../../../libs/frontend/pages/tournament/src/pages/draw-detail/page-draw-detail.component.ts).
  Source and browser levels agree: event/sub-event on details, draw on draw pages.
- Repository-wide `app-sync-button`, `SyncButtonConfig`, game-level configuration and dialog-entry searches
  find only these production consumers. The game level in shared tests is not a mounted consumer.
  `openGameSyncDialog()` is reachable only from the game-level menu; do not invoke it manually to justify redesign.
- The [shared template](../../../libs/frontend/components/sync/src/sync-button.component.html) renders no visible
  game dialog on these routes. Its unused fixed width, labels and utilities stay unchanged.
  The shared ConfirmDialog has no caller in this controller; do not turn it into a new workflow or treat its
  dormant host as proof of a mounted confirmation flow. DR-064 remains a separate native-component audit.
- [Shared action logic](../../../libs/frontend/components/sync/src/sync-button.component.ts) already centralizes
  main/menu dispatch and notifications. No new smart/presentational extraction is justified for this inventory.
  Preserve the meaningful shared boundary rather than creating a one-to-one SplitButton/Toast wrapper.

## Remaining work and verification limits

- DR-007b is the one required next child: localize mounted event/sub-event/draw and cache Toast feedback.
  Existing queued/cleared/empty details are translated, but headings and failure details remain hard-coded English.
  Native success/error/warn severities already exist; reuse them without restyling Toast or changing the theme.
- Main sync dispatch includes children; menu sync excludes them. Cache commands distinguish their children flag.
  Preserve those operation contracts, loading disablement and existing queue-versus-completed meaning.
  The [resolvers](../../../libs/backend/graphql/src/resolvers/system/sync.resolver.ts) return true after queuing
  event/sub-event/draw work and throw on permission failures; no queue/cache operation was run for this audit.
- Existing [nine shared tests](../../../libs/frontend/components/sync/src/sync-button.component.spec.ts) cover
  names, locale updates, disablement and focus isolation, not operation-notification outcomes.
  DR-007b must add mocked outcome coverage; source inspection is not live success/error verification.
- Fresh browser work checks inventory only: no screenshot, light/narrow, contrast, keyboard, screen-reader/touch,
  alternate locale, operational transition or SSR/hydration regression pass is claimed.
  Hidden tournament panels were counted, not individually opened or workflow-verified.
- First probe raced hydration and passed a removed element to Angular debug lookup; discard that sample.
  Settled repeats guard element existence and wait for an actual hydrated component before reading configurations.
  Navigation also emits the previously recorded view-transition `InvalidStateError`; no application code changed.
- Changed scope: this parent, backlog and the next child's brief only. Zero application/style/utility changes,
  dependencies, new production consumers or mutations. Original home route and dark viewport are restored.
- Repository formatter:
  `npx prettier --write "docs\design-refresh\backlog.md"
"docs\design-refresh\work-items\DR-007-shared-controls.md"
"docs\design-refresh\work-items\DR-007b-sync-action-feedback.md"` passes.
- The same three paths with `npx prettier --check` pass; `git diff --check` passes.
  Read-only Node assertions verify LF/frontmatter/no H1 in all three files, 483 resolving local links,
  DR-007 In progress, DR-007b Ready, and DR-007a/DR-067/DR-073 still Done.
  Backlog table alignment changes are formatter-only. Git's checkout-policy CRLF warnings do not indicate
  CRLF in these working files; byte-level assertions pass.
- No application Nx tasks were needed during this documentation-only reconciliation.
  Previous child results are not rerun or relabeled as fresh.
- No new exception. Parent closure is not requested: finish DR-007b and review its evidence first.
  Exact next action: implement the Ready DR-007b brief; do not start its implementation in this invocation.
- Explicit approval, 2026-11-23: `commit`. The reconciliation slice is complete and approved with the
  disclosed verification limits. This does not close DR-007 or approve unimplemented DR-007b.
  Preserve the open child and unchecked criteria; commit only these three handoff documents, without pushing.
- Required pre-commit `npx nx run-many --target=lint --output-style=static` runs all 34 projects:
  24 pass from cache; ten reproduce existing `@nx/dependency-checks` installed-version/package-range errors in
  unchanged manifests. Failures: backend-seo, backend-health, shared, backend-ranking, backend-authorization,
  backend-translate, backend-search, utils, backend-database and backend-graphql.
  No unrelated dependency corrections are included. Formatting and whitespace checks pass.
