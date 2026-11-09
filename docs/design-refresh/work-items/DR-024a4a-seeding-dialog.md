---
title: 'DR-024a4a: Seeding dialog'
description: 'Responsive native seeding dialog with localized options and explicit operation states.'
---

## Identity and scope

- ID: DR-024a4a; parent [DR-024a4](DR-024a4-draw-dialogs-locales.md).
- Authoritative status: [backlog](../backlog.md). Rules: [design refresh](../README.md).
- Dependencies: approved DR-024a1/a2/a3; no backend/schema prerequisite.
- Mounted authorized consumer: imported tournament administration Draws tab on 2026-11-09.
  `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=draws`.
- Source: `libs/frontend/pages/tournament/src/pages/admin/tabs/draws/`.
- Projects: frontend-pages-tournament and backend-translate (existing dictionary copy only).
- Preserve ranking/random/manual values, target draw, default/reset, success refetch and service payload.
- Exclude creation, summary/list/filter presentation, scheduling, backend/schema behavior, global theme,
  shared components and operational browser writes.

## Baseline and approach

- Worktree clean at start. Real authorized Draws route mounts with genuinely empty HE 1 data.
- One-use browser-only SubEventDrawsData fixture supplies Safe Player / Safe verification draw.
  Open the existing visible auto-seed button; no fabricated consumer, phase/permission changes or writes.
- Four light/dark 390/1440px checks: width 390/400px; footer contains zero actions.
  Deprecated `pTemplate="footer"` is not rendered by the installed native Dialog.
- Method label is not bound to the combobox; Close is unnamed; options are hard-coded English.
  Dutch/French option keys already exist but are blank. English/French description needs correction.
- Use a native form inside Dialog, fluid Select, translated native item templates and responsive buttons.
  Restore focus to the actual opening button, show operation errors within the modal, prevent duplicate
  submission and dismissal while updating. Native option labels react to language changes.
- Keep the smart tab/service. No repeated live structure justifies a new dumb component or wrapper.
- Existing fixed inline width is replaced with responsive layout utilities; no SCSS or new styling layer.

## Implementation checklist

- [x] Confirm mounted consumer, baseline and one independently reviewable child.
- [x] Implement native dialog layout, labels, translated options and pending/error feedback.
- [x] Preserve selection, mutation payload/defaults and success/failure lifecycle in focused tests.
- [x] Format, validate and persist evidence and next action.

## Acceptance and verification

- [x] Native responsive Dialog/Select/Button; no new palettes, SCSS or inline styling workarounds.
- [x] Three translated options and description are nonempty in English, Dutch and French.
- [x] Light/dark at 390/1440px and fresh option overlays fit.
- [x] Label association, keyboard selection, Escape/Cancel/Close and return focus pass.
- [x] Pending/error/success/default/reset and duplicate submission are verified with mocks.
- [x] Sampled title, label, description and Cancel normal text contrast passes.
- [ ] Shared native Apply Button and error Message normal text contrast meets 4.5:1.
- [x] Focused existing Nx test/lint/build checks pass.
- [ ] Live operational seeding, permission variants, exhaustive accessibility and SSR/hydration verified.
- [x] User review or explicit approval with disclosed limits.

## Evidence and handoff

- Baseline screenshots inspected in chat; only safe synthetic identity used. No screenshots of real personal data saved.
- One-use browser fixtures expire after each scoped read. Final real refresh returns HTTP 200 and retains focus.
  Final reload confirms TournamentAdmin and SubEventDrawsData HTTP 200 without GraphQL errors, no synthetic draws
  or dialog, HE 1, original Dutch/dark/1355x1249 and unchanged Draws route.
- Shared components, preset, permissions, phase and operational records are unchanged.
  Keep the existing tab/service boundary; no extraction or new dependencies.
- Static class/styleClass tokens fall 171 to 168 for the whole template, 16 to 13 in the seeding section.
  Fixed inline width becomes responsive `w-full sm:w-md`; no stylesheet, inline style or palette addition.
- Reactive localized option labels reuse existing dictionary keys; no generated translation-type changes required.
  Fill six existing Dutch/French option blanks and correct scoped French terminology/English description.
- A missing/malformed autoSeedDraw response now raises the existing generic translated error rather than silently
  failing. Real errors remain explicit inside the modal; failure retains the method and allows retry.
- Native readonly Select, disabled actions, loading spinner and busy form preserve pending input/context.
  An additional method guard prevents duplicate submissions, including native form submissions.

### Validation

- `npx prettier --write` was run on every changed file before validation.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=pages/admin/tabs/draws --runInBand`
  with `--output-style=static`: 74 tests pass across two suites, freshly executed.
  Includes all three method payloads, reset/cancel, labels/options in all three dictionaries and language switching,
  pending controls/duplicate submit/Escape, explicit error/missing-data retry and success refetch.
- Initial combined regex selector was rejected by Windows command parsing; directory selector above replaces it.
  Initial pending assertion incorrectly expected an HTML readonly attribute on a native span; replaced by checking
  that clicking cannot open options or change the value. Final scoped tests pass.
- `npx nx run-many -t lint build -p frontend-pages-tournament,backend-translate --output-style=static`:
  all 16 tasks pass; final run replays 14 tasks and executes tournament lint/build.
  No new lint warnings; existing Nx executor and Jest metadata warnings remain.
- Full workspace suite, app production build, live seeding writes, permission variants, populated real reads,
  alternative browser locales, exhaustive screen-reader/accessibility and SSR/hydration are not run.
- Translation changes briefly caused browser proxy 502 while the API restarted.
  Bounded HTTP readiness wait confirmed port 5000 returned 200 before reloading the actual authorized route.
  One navigation was aborted during HMR; the route subsequently remounted and final verification uses real reads.
  Existing independent Scheduling HTTP 400 is unchanged.

### Browser evidence

- Baseline/after light and dark narrow screenshots inspected using safe data.
  Final native dialog widths are 390px at 390px viewport and 392px at 1440px viewport.
  All four settled normal layouts fit with every control inside the viewport and no document/content overflow.
- Four fresh native option overlays are 351px narrow / 353px desktop, fit and display the translated three options.
  ArrowDown/Enter selects Willekeurig; reopening resets to Op rangschikking. Initial measurements during
  animations were discarded; settled checks wait 300ms.
- Keyboard Tab cycles method, Cancel, Apply, Close, method. Native Button focus outlines settle at 1px.
  Select uses its native focus border, not an added outline. Full graphical/focus contrast is not claimed.
  Label/inputId and ariaLabelledBy match; Close is explicitly named.
  Cancel and Close return focus to the actual opening action; idle Escape does likewise.
- Native Dialog binds its document Escape listener only when opened and does not recheck closeOnEscape/closable
  when the key is pressed. Browser pending verification caught dismissal despite updated native inputs.
  Disable the native Escape listener and handle only this visible dialog's Escape at document level, because
  its real container is portalled to body. The Select consumes Escape first while its overlay is open.
  Final four theme/width checks confirm overlay-only Escape, idle dismissal/focus return and pending blocking.
  No library patch or global dialog configuration change is made.
- Four pending/error presentation cases use only the mounted component's browser-local updating/updateError signals,
  not operational handlers or network writes. Error text fits, actions disable, Close disappears, busy/spinner
  render, selection stays locked and Escape cannot dismiss. Mock tests verify the actual asynchronous lifecycle.
- Sampled canvas-converted sRGB text contrast with composited ancestor backgrounds:
  title/label 19.87:1 light and 16:1 dark; description/Cancel 4.87:1 and 6.65:1.
  Native Apply fails light 3.65:1 default (initial hover sample 2.79:1) and passes dark 10.63:1.
  Native error Message fails 4.44:1 light / 4.40:1 dark. Retain under DR-033/DR-034 without page overrides.
- Exceptions: no styling exceptions. The localized, visibility-guarded keyboard handler is the bounded native
  runtime workaround described above; unrelated dialog behavior is not changed.

### Exact next action

- User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
  Approval covers only this child implementation, focused tests, scoped dictionary copy and repository handoff.
  Accepted limits: DR-033/DR-034 contrast failures, full suite/app build, populated real reads, live seeding/permission
  variants, alternative browser locales, exhaustive accessibility and SSR/hydration. All unchecked criteria stay unchecked.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects with existing warnings
  and zero errors. 29 tasks replay cache and five execute; this is not fresh execution of every lint task.
- Mark only this child Done and commit its approved scope without pushing.
- Keep DR-024a4, DR-024a and DR-024 open. Next candidate is DR-024a4b creation: explicitly resolve its
  non-submitted gender/level controls before implementation. Do not start it or the remaining locale child here.
