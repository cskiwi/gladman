---
title: 'DR-024a: Draw management'
description: 'Draw-management aggregate and bounded child sequence.'
---

## Identity and scope

- ID: DR-024a. Parent: [DR-024](DR-024-admin-draws-scheduling.md).
- Status: [backlog](../backlog.md). Rules: [design refresh](../README.md).
- Consumer: `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=draws`,
  authorized Draws/Loting panel on 2026-11-09; real phase COMPLETED.
- Source: `libs/frontend/pages/tournament/src/pages/admin/tabs/draws/`.
- Existing smart tab/service owns selection, reads, entry operations and two dialogs.
- Preserve the shared administration Card/tab shell; use native Panels for future inner groups.

## Child sequence

1. [DR-024a1](DR-024a1-draw-read.md): reactive selection and honest read feedback prerequisite.
   Approved complete on 2026-11-09 with its disclosed verification limits retained.
2. [DR-024a2](DR-024a2-draw-summary.md): four-count summary approved complete on 2026-11-09
   with its disclosed verification limits retained.
3. [DR-024a3](DR-024a3-draw-presentation.md): filter/actions, unassigned assignment and draw-list children.
   All three presentation children are approved Done and committed. Aggregate reconciliation is complete;
   user approved aggregate completion on 2026-11-09 with child verification limits retained.
4. [DR-024a4](DR-024a4-draw-dialogs-locales.md): split into seeding dialog, creation dialog and
   remaining mounted locale completeness. Seeding child DR-024a4a is approved Done on 2026-11-09;
   preserve its shared contrast failures and unperformed checks.
   Creation child DR-024a4b is approved Done on 2026-11-09, with explicitly approved removal of ignored
   gender/level controls. Its focused checks pass; retain accepted contrast/network/operational limits.
   [Mounted locales DR-024a4c](DR-024a4c-draw-locales.md) are approved Done on 2026-11-09 with disclosed limits.
   All 127 focused tests and scoped lint/build pass; three-locale theme/width/overlay/feedback evidence is recorded.
   Shared contrast failures and unperformed live-operation/accessibility/SSR checks remain disclosed.
   DR-024a4 aggregate evidence is reconciled and separately approved on 2026-11-09 with disclosed limits.
   Aggregate focused checks pass by cache replay; fresh browser actionability times out on the hidden shared page.

## Baseline and exclusions

- The four decorative counters are replaced by DR-024a2's native Panel/semantic summary.
  DR-024a1 already replaced the loading bar. DR-024a3's children replace the legacy filter/list surfaces
  with native Panels/Tables and scoped translations. Both DR-024a4 dialogs are approved complete;
  its remaining locale child is approved complete. DR-024a4 aggregate reconciliation is approved complete,
  with shared contrast failures, fresh browser-actionability limits and unperformed checks retained.
- Do not claim a visual refresh from the prerequisite repair or silently include those presentation changes.
- Keep existing smart orchestration. Extract dumb components only for meaningful confirmed repeated consumers,
  not to conceal utility markup or wrap PrimeNG one-to-one.
- No changes to scheduling, other tabs, global theme, shared components, dependencies or operational records.

## Aggregate acceptance

- [x] Required child implementation and focused validation are complete.
- [ ] Light/dark, narrow/wide, locale, keyboard, overlays and contrast are verified.
- [x] Mutation/confirmation contracts, permissions and SSR/hydration are verified or disclosed as limits.
- [x] Aggregate review and user approval are recorded.

## Aggregate reconciliation on 2026-11-09

- Selected only aggregate verification and handoff. Initial worktree is clean; no application edits are needed.
- All four required children are approved Done in the authoritative backlog:

| Child    | Committed evidence | Reconciled outcome                                                          |
| -------- | ------------------ | --------------------------------------------------------------------------- |
| DR-024a1 | `a12df819`         | Reactive selection, explicit read/loading/error/retry and stale-read safety |
| DR-024a2 | `09076974`         | Native Panel and semantic four-count summary                                |
| DR-024a3 | `d15f4d41`         | Approved filters, selection/assignment and draw-list aggregate              |
| DR-024a4 | `3a0c2fd2`         | Approved seeding, creation and mounted-locale aggregate                     |

- DR-024a3's implementations are `1f8a4aef`, `94755dab` and `dd5eac92`;
  DR-024a4's implementations are `6ec04b39`, `91ca230c` and `ecbfe7fd`.
  Child approvals do not substitute for this draw-management aggregate review.
- Combined source retains native named Panels, scrolling Tables, fluid Selects, semantic counts,
  explicit loading/error branches and native Dialog/form/Button/Message controls.
  Selection changes clear stale assignment state; refresh and read failures do not imply successful empty data.
  Existing operation arguments, native confirmations, pending gates and dialog opener-focus handling remain wired.
- Required creation name/type and optional size preserve the selected sub-event API.
  Ignored gender/level controls were removed with explicit child approval, not silently by this reconciliation.
  Seeding keeps ranking/random/manual values; both dialogs retain their documented pending-safe Escape workaround.
- Mounted descriptions, identity/type labels, confirmation copy and five local failure fallbacks use translations.
  Server Error diagnostics remain unchanged. The unused setEntrySeed method is not a mounted localization requirement.
- Preserve the existing smart tab/service split. No second real consumer sharing domain presentation justifies
  a dumb component; no one-to-one PrimeNG wrapper is introduced merely to hide markup or style once.
- Utility evidence is cumulative, not additive: full-template static class/styleClass tokens progress
  519 to 512 (read), 363 (summary), 357/272/171 (presentation), 168/124/124 (dialogs/locales).
  No new component, dependency, stylesheet, inline/global styling, shared theme or backend/schema change here.
  No new exception. The recorded body-ported Dialog Escape workaround remains explicit.

### Validation and browser evidence

- `npx nx show project frontend-pages-tournament --json` and
  `npx nx show project backend-translate --json` confirm existing lint/build/test targets.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=pages/admin/tabs/draws --runInBand --output-style=static`:
  four suites / 127 tests pass by Nx cache replay, not fresh execution.
  These combine selection/read/summary/list/assignment, dialog contracts and all three real locale dictionaries.
- `npx nx run-many -t lint build -p frontend-pages-tournament,backend-translate --output-style=static`:
  all 16 tasks pass by Nx cache replay. Existing cached warnings remain, including Jest executor/metadata warnings
  and NG8102 on the draw-type fallback at template line 189. Do not claim a warning-free or fresh build.
- Fresh actual authorized Draws snapshot and read-only DOM inspection confirm Dutch/dark, HE 1,
  genuine empty counts 0/0/0/0, four nonempty descriptions and four named native regions.
  At the original 1355x1249 viewport, document width fits; no dialog is open.
  This is mounted DOM evidence, not a new screenshot or a full responsive/interaction matrix.
- The shared browser reports visibilityState hidden. A normal theme-toggle click times out after 3000ms
  waiting for visibility/enabled/stable actionability. No forced click or permission override is used.
  No fresh light/dark, narrow/wide, keyboard, dialog, screenshot or refresh-network pass is claimed.
  Existing console InvalidStateError is observed on initial snapshot; no new application code is introduced.
- Prior child evidence is retained with its original provenance, not claimed freshly rerun:
  read prerequisite covers four genuine-empty layouts and eight failed/incomplete read fixtures;
  summary covers four genuine-empty layouts, scoped label/count contrast and keyboard refresh;
  presentation aggregate covers four genuine-empty layouts and real HTTP 200 refresh with focus;
  dialogs cover four theme/width layouts each, overlays and client-only pending/error fixtures;
  locale child covers twelve populated locale/theme/width cases, 36 overlays, nine canceled confirmations,
  60 local feedback fixtures and final genuine HTTP 200 refresh with focus.
  Synthetic read/client feedback fixtures are not live operational verification.
- Original Dutch/dark/1355x1249/HE 1/Draws remains unchanged after the failed click.
  No selection, dialog, interceptor, synthetic record, operational write or backend/translation restart is introduced.
- Current snapshot shows Scheduling and Check-in disabled. Older parent evidence of enabled tabs and
  Scheduling HTTP 400 is historical, not a fresh access or network pass.
  Do not enable a gated tab or mutate phase/permissions to verify scheduling.
- Only this brief, the backlog and DR-024 parent handoff change.
  `npx prettier --write` on all three documents and `git diff --check` pass.
  Git reports existing LF-to-CRLF configuration warnings; authored changes retain LF.
  Documentation-only edits need no additional application checks.

### Disclosed limits and exact next action

- [ ] Resolve DR-033: native light primary normal text fails at 3.65:1; recorded hover and Tooltip limits remain.
- [ ] Resolve DR-034: native dark info text fails at 4.32:1 and error text at light/dark 4.44/4.40:1.
- [ ] Fresh aggregate light/dark, narrow/wide, keyboard and overlay checks pass in a visible shared browser.
- [ ] Full tournament/workspace suite, app production build, live operational/permission variants,
      populated real draw matrix, exhaustive accessibility and dedicated SSR/hydration checks pass.
- [x] User approves aggregate completion with these limits, or requests bounded further verification.
- DR-052 owns adjacent shared French action/tab terminology; DR-053 owns mounted operation missing/partial-response
  feedback and selection/post-write focus reliability. Neither is silently repaired or treated as verified here.
- User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
  Authoritative backlog status is Done by explicit aggregate approval, separate from the child approvals.
  Approval covers only this three-document handoff; failed/unperformed checks remain unchecked,
  not retroactively passed. Commit only this approved scope without pushing. Keep DR-024 open.
- Exact next action in a fresh invocation is DR-024b: confirm a currently permitted mounted Scheduling consumer
  and reconcile its recorded read-schema/HTTP 400 prerequisite before scoping one child.
  If gated or unavailable, record the precise blocker rather than enabling it. Do not start that work here.
