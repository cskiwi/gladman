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
- Mounted action notifications are completed and approved in [DR-007b](DR-007b-sync-action-feedback.md).
  DR-065 is unrelated builder import-failure feedback, not a dependency.
- Defer the game-only dialog: no current application consumer supplies `level: 'game'`.
- Club search contains service logic, not a visual component to refresh.

## Acceptance and handoff

- Selected 2026-11-25 on existing `main`: parent completion reconciliation only.
  Preserve the unrelated generated i18n worktree change. Scope: this brief and backlog, no application edits.
  Confirm child approvals, source/history agreement and mounted consumers; preserve all accepted limits.
  Parent completion requires review of this reconciliation; previous child approvals do not approve it.
- Selected 2026-11-23 on existing `main`, starting with a clean worktree: documentation-only reconciliation
  of remaining mounted sync-action/dialog scope. No application edits or operational mutations.
- Acceptance: verify current consumer/configuration evidence, preserve completed child limits, and persist the
  exact remaining work before deciding whether the parent can close.

- [x] Reconcile country/state work against its existing approved brief.
- [x] Confirm a current sync-indicator consumer and scope one implementation child.
- [x] Complete and obtain review for DR-007a, approved 2026-11-23 with its documented limits.
- [x] Reconcile remaining sync action/dialog work against current application consumers.
- [x] User approves the completed documentation-only reconciliation for commit, 2026-11-23: `commit`.
- [x] Complete and obtain review for DR-007b, approved with documented limits.
- [x] Reconcile all completed child evidence and accepted limits before closing this parent.
- [x] User approves parent completion with the disclosed child and reconciliation limits.

All required children and DR-007 parent completion are approved Done with disclosed limits.
DR-018b1, DR-007a, DR-067, DR-073 and DR-007b remain approved Done; preserve their unchecked verification limits.
In particular, DR-007a retains its scoped zero-gap layout exception and DR-073 its native-focus workaround.
Historical child commands and theme/width matrices remain evidence of those slices, not fresh parent checks.

## Parent completion reconciliation, 2026-11-25

- Documentation-only scope: this brief and backlog. Existing `main`; preserve the unrelated generated i18n change.
  No application edits, theme changes, extractions, new consumers, dependencies or operational mutations.
- Child approvals and authoritative Done rows agree:
  DR-018b1 (`commit`, 2026-11-16), DR-007a, DR-067, DR-073 and DR-007b
  (each explicitly approved with documented limits on 2026-11-23).
- Committed sync history matches current source:
  `2d061434` status presentation, `ae083b01` dropdown naming, `a62cc385` Escape focus,
  `df4ddc6e` mounted notification localization. The latter contains its nine approved scoped files.
  No prior child commit remains to be created.
- Source reconfirms root/feature route mounting and the four production configuration producers linked below.
  Repository searches find only event/sub-event/draw application configurations; game-only menu/dialog entry
  remains unconsumed. The dormant ConfirmDialog has no action caller and is not an implemented workflow.
- Fresh hydrated browser inventory, dark 1288px by 1272px, covers all five routes recorded below:
  mounted counts 13/36/37/1/1, visible counts 13/15/16/1/1.
  Competition detail: one event and twelve sub-events; tournaments: one event with 35/36 sub-events;
  both draw pages: one draw. All dropdowns have accessible labels; zero open game dialogs or rendered dialogs.
  Each navigation waited for hydrated configurations and then settled before measurement.
  Hidden tournament panels were counted, not individually opened or workflow-verified.
- No main/menu action, sync/cache command, form save or notification fixture was activated.
  Original home route and dark preference were restored; no viewport or preference change.
  The existing navigation view-transition `InvalidStateError` recurred; it did not prevent settled inventory.
- Existing shared country/state CVAs and shared sync controller/presentational indicator remain meaningful reuse
  boundaries. A further smart/presentational split would only relocate native markup; do not create one.
- Preserve child limits: country/state physical keyboard/pointer, overlay and dirty/touched interaction proof;
  broader screenshots, full screen-reader/touch, contrast, locales/permissions, live persistence/operations,
  automated selector tests and SSR/hydration were not all verified. Refer to each child's exact unchecked criteria.
  DR-067's historical Escape failure was addressed by DR-073, not re-tested as a fresh parent focus pass.
- Preserve the icon-only Tag `gap-0!` exception and native-menu ARIA-owned Escape focus correction, including
  their documented removal conditions. No new exception.
- Theme commits `7959f2d9` / `8af9f4ff` postdate DR-007b.
  Current preset source now maps dark info/success/warn/error Toast details to semantic text and uses content-mixed
  backgrounds. This addresses the historical source cause, but does not prove current contrast.
  DR-074 stays Backlog for fresh shared-consumer verification; no implicit theme review or extra slice is included.
- Historical child tests/lint/build remain historical; no application Nx tasks are needed for these Markdown edits.
  No fresh screenshot matrix, contrast, operational workflow, full accessibility or SSR/hydration pass is claimed.
- Validation commands for this reconciliation:
  `npx prettier --write "docs\design-refresh\backlog.md"
"docs\design-refresh\work-items\DR-007-shared-controls.md"` and the same paths with `--check`;
  `git diff --check`; read-only Node LF/frontmatter/local-link/registry assertions on the two documents.
  All pass: both documents formatted; 476 local links resolve; both files use LF with frontmatter and no H1;
  seven status assertions retain DR-007 Review, five completed child/follow-up rows Done and DR-074 Backlog.
  These assertions preceded parent approval; the approval-time registry retains DR-007 Done.
  No Ready registry rows remain. Git checkout-policy CRLF warnings are not working-file CRLF failures.
- Explicit approval, 2026-11-25: `Approve DR-007 with documented limits and commit`.
  This accepts parent completion with the disclosed child/reconciliation limits and pending verification of
  the subsequent Toast theme correction. It is not evidence that any unperformed check passed.
  Keep child checkboxes and historical exceptions unchanged. Commit only this brief/backlog; no push.
- Required approval-time `npx nx run-many --target=lint --output-style=static`: 34 projects,
  22 pass without cache hits; twelve fail `@nx/dependency-checks` outside this documentation-only slice.
  Failures: backend-authorization, backend-ranking, backend-search, utils, backend-health, backend-seo, shared,
  backend-translate, backend-database, backend-graphql, i18n and frontend-modules-translation.
  Errors include installed-version/package-range mismatches, unused `nestjs-i18n` in i18n/utils and missing
  `@angular/common` peer dependency in frontend-modules-translation. No unrelated corrections are included.
  The generated i18n worktree change remains untouched. Changed-file formatting and whitespace checks pass.
- Exact next action for the next invocation: scope DR-074 fresh Toast contrast verification of the committed correction.
  Do not begin that audit or another implementation slice here.

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

## Completed child and historical verification limits

- DR-007b is the completed required child: mounted event/sub-event/draw and cache Toast feedback is localized.
  Existing queued/cleared/empty details remain unchanged; headings reuse common/cache translations.
  Four new failure keys per locale preserve entity context, falling back to the ID when the display name is absent.
  Native success/error/warn severities and shared presentation are unchanged.
  Thirty-three focused tests and scoped three-project lint/build pass.
  User restart resolved the connection blocker. Five-route light/dark 390px/1440px notification fixtures pass
  settled geometry, locale, alert-attribute and dismissal checks.
  DR-007b is approved Done: `Approve DR-007b with documented limits and commit`.
  Unchecked operational/accessibility/SSR and screenshot limits remain; approval is not a pass for those checks.
  Historical native Toast dark detail contrast is tracked as DR-074; later theme work needs fresh verification.
- Main sync dispatch includes children; menu sync excludes them. Cache commands distinguish their children flag.
  Preserve those operation contracts, loading disablement and existing queue-versus-completed meaning.
  The [resolvers](../../../libs/backend/graphql/src/resolvers/system/sync.resolver.ts) return true after queuing
  event/sub-event/draw work and throw on permission failures; no queue/cache operation was run for this audit.
- Existing [shared tests](../../../libs/frontend/components/sync/src/sync-button.component.spec.ts) now include
  the nine naming/loading/focus cases plus 24 mocked notification/payload/disablement/name-fallback regressions.
  Mocked success/error outcomes are not live operational verification.
- The remaining evidence below is historical documentation-only reconciliation, not DR-007b verification.
  DR-007b's evidence and completed approval are recorded above and in its brief.
- That reconciliation's browser work checked inventory only: no screenshot, light/narrow, contrast, keyboard, screen-reader/touch,
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
  then-current DR-007 In progress, DR-007b Ready, and DR-007a/DR-067/DR-073 Done.
  These historical registry assertions are not the current statuses.
  Backlog table alignment changes are formatter-only. Git's checkout-policy CRLF warnings do not indicate
  CRLF in these working files; byte-level assertions pass.
- No application Nx tasks were needed during this documentation-only reconciliation.
  Previous child results are not rerun or relabeled as fresh.
- No new exception. At that reconciliation, parent closure was not requested; DR-007b still required implementation.
  DR-007b is now approved Done; the 2026-11-25 section supersedes this historical next action.
- Explicit approval, 2026-11-23: `commit`. The reconciliation slice is complete and approved with the
  disclosed verification limits. This does not close DR-007 or approve unimplemented DR-007b.
  Preserve the open child and unchecked criteria; commit only these three handoff documents, without pushing.
- Required pre-commit `npx nx run-many --target=lint --output-style=static` runs all 34 projects:
  24 pass from cache; ten reproduce existing `@nx/dependency-checks` installed-version/package-range errors in
  unchanged manifests. Failures: backend-seo, backend-health, shared, backend-ranking, backend-authorization,
  backend-translate, backend-search, utils, backend-database and backend-graphql.
  No unrelated dependency corrections are included. Formatting and whitespace checks pass.
