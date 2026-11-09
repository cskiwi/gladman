---
title: 'DR-024a4b: Draw creation dialog'
description: 'Responsive native draw creation with truthful controls and explicit operation states.'
---

## Identity and scope

- ID: DR-024a4b; parent [DR-024a4](DR-024a4-draw-dialogs-locales.md).
- Authoritative status: [backlog](../backlog.md). Rules: [design refresh](../README.md).
- Dependencies: approved DR-024a1/a2/a3 and DR-024a4a.
- Mounted authorized consumer confirmed 2026-11-09:
  `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=draws`.
  Both visible Create Draw buttons open this dialog with the selected HE 1 sub-event.
- Source: `libs/frontend/pages/tournament/src/pages/admin/tabs/draws/`.
- Projects: frontend-pages-tournament and backend-translate (scoped dictionary copy only).
- Preserve selected sub-event, name/type/optional-size payload, defaults/reset and success refetch.
- Exclude backend/schema behavior, other draw presentation, other tabs, shared/global styling and browser writes.
- The pre-existing enrollment template edit was committed externally during this invocation.
  It was not edited, staged or reverted by this slice.

## Baseline and approach

- Actual mounted dialog has no rendered footer actions, fixed 500px width, unbound Select labels,
  unnamed Close, hard-coded English options and numbered red required markers.
- `subEventType`, `minLevel` and `maxLevel` do not reach the service or creation API.
  `CreateTournamentDrawInput` accepts only subEventId/name/type/size.
- User selected **remove** on 2026-11-09: remove ignored controls and preserve the existing selected
  sub-event/API. This is scope approval, not approval of the finished implementation or a commit.
- Use native Dialog/form/InputText/Select/Button/Message and responsive layout utilities.
  Keep errors in the modal, prevent pending edits/duplicate submits/dismissal, restore opener focus.
- Preserve the smart tab/service boundary; one dialog with one live consumer does not justify a wrapper.
  No repeated domain form currently warrants a dumb component extraction.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and explicit unused-control decision.
- [x] Implement native responsive form, localized options and pending/error lifecycle.
- [x] Preserve payload/default/reset/cancel/refetch behavior in focused mock tests.
- [x] Format, validate and persist evidence and next action.

## Acceptance and verification

- [x] Only effective name/type/optional-size controls remain; selected sub-event payload is preserved.
- [x] Native responsive components, nonempty scoped copy in English/Dutch/French; no new styling layer.
- [x] Light/dark at 390/1440px and Select overlays fit.
- [x] Required validation, labels, keyboard selection, Escape/Cancel/Close and return focus pass.
- [x] Pending/error/malformed-response/retry/success states and duplicate submission pass mock tests.
- [x] Sampled title/label/input/Cancel normal text contrast meets 4.5:1.
- [ ] Shared native Create Button and error Message normal text contrast meets 4.5:1.
- [x] Focused existing Nx test/lint/build checks pass.
- [ ] Live operational creation, permission variants, exhaustive accessibility and SSR/hydration verified.
- [x] User review or explicit approval with disclosed limits.

## Evidence and handoff

- Baseline dark dialog screenshot inspected in chat; no real personal-data screenshot saved.
- Native form actions replace the deprecated, unrendered footer. Responsive `w-full sm:w-md`
  replaces fixed inline width. Name is required and has associated touched validation feedback;
  type/size use bound accessible labels and native fluid Select.
- Only effective controls remain. All three type values and all five optional sizes retain their payloads.
  Localized option labels react to language changes; scoped French creation/name/size terminology is corrected.
  The existing API watcher generates the three new translation-path declarations.
- Pending form is busy/readonly, hides clear/Close and disables actions. Duplicate submits and Escape are guarded.
  The creation dialog follows the seeding dialog's body-ported, visibility-guarded document Escape pattern.
  Native Select consumes Escape before the dialog; idle Escape and dismissal restore the actual opening button.
- Missing/malformed creation responses now show the translated generic error rather than silently failing.
  Failure preserves values and permits retry; opening again clears stale operation errors and resets defaults.
- Static class/styleClass tokens fall 168 to 124 overall and 61 to 17 in creation.
  Remove unused InputNumber import and unused category options. No new wrapper, styles, palette or dependency.
- No shared/global behavior, backend/schema or operational records change. No browser creation is submitted.

### Validation

- `npx prettier --write` was run on all changed files, including the generated translation type.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=pages/admin/tabs/draws --runInBand --output-style=static`:
  all 94 tests across three suites pass, freshly executed; 20 creation cases are new.
  Covers labels/required controls, all types/sizes/optional size, both openers, cancellation/reset/focus,
  pending locks/duplicate submit, missing target/type, error/missing/malformed response/retry/refetch,
  three dictionaries and reactive locale switching. Existing draw/seeding tests also pass.
- `npx nx run-many -t lint build -p frontend-pages-tournament,backend-translate --output-style=static`:
  all 16 tasks pass; initial run replays ten tasks, final run replays all sixteen.
  Existing Nx executor and Jest metadata warnings remain; no new lint errors.
- `git diff --check` passes. Git emits existing line-ending configuration warnings; authored files use LF.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects with
  existing warnings and zero errors; 22 tasks replay cache and twelve execute.
  No fresh full-workspace lint execution is claimed.
- Full workspace suite, app production build, live creation writes, populated real reads,
  permission variants, alternative browser locales, exhaustive accessibility and SSR/hydration are not run.
- Translation reload temporarily produced proxy 502 and authentication timeout messages.
  A bounded root-HTTP-200 readiness probe failed: the restarted API actually returns 404 at its root.
  Port 5000 subsequently listens and logs successful Nest startup; the real authorized Draws route mounts again.

### Browser evidence

- Use the actual authorized consumer with genuine empty HE 1 data, not a fabricated route or permission override.
  Only safe draft text is entered; no creation/other operational handler is submitted.
- Four settled light/dark 390/1440px layouts fit: dialog width 390/392px, no document/content overflow,
  and every field/action stays inside the viewport. Light and dark narrow screenshots are inspected in chat.
- Fresh type/size overlays fit at 351/353px and show translated options. Native keyboard selection works;
  use Home/ArrowDown/Enter for a deterministic first-option starting point after reopening.
  Choosing size 16 and clearing it returns to the optional-size placeholder.
- Tab cycles name, type, size, Cancel, Create, Close and name. Buttons have settled 1px focus outlines;
  text input/Select use their native focus borders. Full graphical/focus contrast is not claimed.
  Cancel and Escape return focus to the top opener; native Close returns focus to the empty-list opener.
- Four browser-only error/pending signal fixtures fit. Safe error text is visible inside the modal;
  pending state is busy/readonly, disables both actions, removes Close and survives Escape.
  These checks set only local updating/updateError presentation signals, never operational handlers.
  Signals are cleared and the actual route is reloaded afterward.
- Sampled light title/labels/input/Cancel ratios are 19.87/19.87/13.61/4.87:1;
  dark ratios are 16/16/16/6.65:1. Native Create fails light at 3.65:1 (existing DR-033),
  passes dark at 10.63:1. Native error Message fails light/dark at 4.44/4.40:1 (existing DR-034).
  Preserve failed acceptance unchecked; no page-specific palette workaround.
- Original Dutch/dark/1355x1249, Draws route and HE 1 are restored with no dialog or synthetic records.
  Final reload mounts real data, but automated final refresh/network-observation attempts time out.
  Do not claim final GraphQL status or refresh-focus verification from those attempts.

### Approval and remaining action

- On 2026-11-09 the user selected **Approve completion and commit with disclosed limits** and **Nothing else**.
  Approval covers only this implementation/tests/scoped copy and repository handoff.
  Mark Done by explicit acceptance, not by claiming failed or unperformed checks passed.
- Accepted limits: DR-033/DR-034 contrast failures, final network-observation/actionability timeouts,
  unperformed full workspace suite and app build, live operational creation, populated real reads,
  permission variants, alternative browser locales, exhaustive accessibility and SSR/hydration.
  Workspace lint was unperformed at approval and subsequently passed as recorded above;
  other unchecked criteria remain unchanged.
- Commit only this approved scope, without pushing.
- Exact next action in a fresh invocation: scope DR-024a4c remaining mounted locale completeness from
  the authorized consumer; do not start it here.
- Keep DR-024a4, DR-024a and DR-024 open. No new styling exception or extraction decision is needed.
