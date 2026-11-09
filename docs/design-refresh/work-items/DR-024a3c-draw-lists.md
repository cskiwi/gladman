---
title: 'DR-024a3c: Draw lists and actions'
description: 'Native draw lists, accessible actions and empty states in the mounted administration Draws tab.'
---

## Identity and scope

- ID: DR-024a3c. Parent: [DR-024a3](DR-024a3-draw-presentation.md).
- Status: [backlog](../backlog.md). Rules: [design refresh](../README.md).
- Dependencies: approved DR-024a1, DR-024a2, DR-024a3a and DR-024a3b.
- Actual authorized mounted consumer confirmed on 2026-11-09:
  `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=draws`, Dutch dark, HE 1, genuine empty records.
- Project: `frontend-pages-tournament`.
- Source: `libs/frontend/pages/tournament/src/pages/admin/tabs/draws/draws-tab.component.{html,spec.ts}`.
- Scope: draw list, type/capacity, seeds/player names, draw/entry actions, empty draw/list and no-selection feedback.
- Complete only the currently blank draw-list action labels and new assigned-empty copy in the three locale assets.
- Preserve IDs, counts, doubles names, action payloads/confirmations, loading/error gates and existing dialog handlers.
- Exclude summary, filters, assignment, dialog content, scheduling, backend/schema, permissions and shared/global styling.
- No dependencies or operational browser writes. Test operational payloads only with safe in-memory mocks.

## Baseline and approach

- Mounted dark/wide before screenshot inspected: decorative empty box with sitemap circle and duplicate Create action.
- Populated source has custom headers, circular seed badges, hand-built scrolling rows and English-only actions/copy.
- Use named native Panels, severity Tags, native scrolling Tables, translated named actions and plain empty text.
- Retain the smart tab/service boundary. Shared inventory and source search find no second real consumer sharing this
  draw-assignment presentation; a one-off dumb wrapper would not enable meaningful reuse.
- No new SCSS, palette, inline-style or global changes planned. Existing excluded dialog styles remain unchanged.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and bounded scope.
- [x] Simplify draw list and empty feedback with native components.
- [x] Preserve data, ordering, names, capacity, action wiring and disabled states in focused tests.
- [x] Verify nonempty English/Dutch/French labels for scoped controls and feedback.
- [x] Record utility comparison, validation, browser evidence and remaining limits.

## Acceptance and verification

- [x] Named Panels and Tables preserve draw identity/type, count/capacity, seed order and player names in tests.
- [x] Named seed/clear/delete/remove controls preserve handler arguments and disabled/loading feedback in tests.
- [x] Empty draw/list and no-selection states render; loading/error do not display false empty success in tests.
- [x] Light/dark at 390/1440px fit with genuine-empty and safe populated/empty/no-selection fixtures.
- [x] Keyboard order, settled native focus outlines and contextual control labels are verified.
- [x] Sampled normal list text and type Tags meet 4.5:1 in both themes.
- [ ] Native no-selection Message normal text meets 4.5:1: dark fails at 4.32:1 under DR-034.
- [x] Relevant Nx lint/build/tests pass.
- [ ] Live populated reads, operational permissions/workflows and exhaustive accessibility are verified.
- [ ] Dedicated SSR/hydration and full tournament regression suite are verified.
- [x] User visual review and approval recorded with disclosed verification limits.

## Evidence and handoff

- Before screenshot: genuine-empty mounted Dutch dark/wide consumer; no operational writes.
- After implementation: each named native Panel preserves draw type via native severity Tag and count/capacity text.
  Native 14rem scrolling Tables preserve source seed order, unseeded dash and singles/doubles names.
  Plain assigned-empty text replaces decorative inbox circles. The no-draw Panel retains Create;
  no-selection uses a native informational Message.
- Contextual translated accessible names distinguish every draw/entry action. Native `onClick` preserves handler
  arguments and existing clear/delete confirmations. Seeding/clear/delete now disable during an update;
  remove retains native loading/disabled feedback. Existing dialogs and service code are unchanged.
- Filled only four surfaced Dutch/French action labels; added assigned-empty text in English/Dutch/French.
  API's existing generator adds only `noEntriesAssigned` to
  `libs/utils/i18n/src/lib/i18n.generated.ts`; preserve this related generated property.
  Other blank labels, French terminology and dialog completeness remain DR-024a4.
- Full template static class/styleClass tokens fall from 272 to 171.
  Remaining scoped utilities provide minimum-width protection, name wrapping, spacing, action wrapping,
  muted capacity/empty text, tabular seeds, unbroken headings and a hidden column heading. No styling exception.
- No shared component, theme, stylesheet, inline-style, schema, dependency or service change.
  The smart tab/service remains the useful boundary; no repeated live consumer warrants extraction.
- Existing Scheduling HTTP 400 remains DR-024b. Existing Auth0 timeout appeared during reload.

### Validation commands and limits

- `npx nx show project frontend-pages-tournament --json`: confirmed targets.
- `npx prettier --write` on all changed files: passed before final handoff.
  The generated translation type retains its existing `prettier-ignore` directives.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=draws-tab.component.spec.ts --runInBand --output-style=static`:
  final fresh execution passed, one suite / 60 tests (15 new and 45 existing).
  An initial new pending-mutation test needed a second render cycle for the subsequent resource refetch;
  corrected fixture timing and reran successfully. No application timing workaround.
- Safe mocks verify correct clear/delete/remove variables, refetch after success, cancellation without writes,
  explicit failure with retained list/retry controls, pending guards, seeding dialog target,
  named regions/actions, type severities, capacity fallback, doubles, empty/missing entries and read gates.
  All three actual locale dictionaries pass. No real operational mutations.
- `npx nx run-many -t lint build -p frontend-pages-tournament --output-style=static`:
  final run passed all 12 tasks, ten replayed cache. Scoped lint/build executed.
  Removed a new redundant-coalescing Angular diagnostic before this final successful run.
- Not run: full tournament suite, populated real reads, live operational/permission checks,
  exhaustive accessibility, alternative browser locales and SSR/hydration.

### After-browser evidence

- Four genuine-empty Dutch light/dark at 390/1440px pass: named no-draw Panel, empty copy and retained Create
  fit without document/control overflow. Light/narrow empty screenshot inspected.
- Four safe populated/empty-draw Dutch light/dark at 390/1440px pass with a one-use intercepted read:
  12 explicitly safe entries, long readable player name, long unbroken draw name, four draws and all type severities.
  Titles, names, capacity, actions and Panel boundaries fit; the native Table scrolls internally.
  All empty draws retain translated assigned-empty text and disabled seeding/clear with enabled delete.
- The first narrow screenshot exposed fragmented headings despite no page overflow. Applied native Table `size="small"`
  and two nowrap headings. Reran focused tests, scoped lint/build and all four populated layouts.
  Both headings remain single-line at 28.5px height, without horizontal overflow in these fixtures.
  Final light/narrow and dark/narrow screenshots inspected, including visible native removal focus.
- Keyboard Tab proceeds seed/clear/delete/entry-remove in source order without clicking operational actions.
  Settled native focus-visible outlines are 1px in both themes. Early transition samples were transparent;
  settled checks wait 300ms. No full focus/graphic-contrast audit is claimed.
- Sampled normal text contrast uses canvas-converted sRGB and composited ancestor backgrounds:
  light title/header/seed/name 19.87:1, capacity/empty text 4.87:1, KO/POULE/QUALIFICATION/N/A Tags
  4.57/5.17/4.52/7.74:1. Dark equivalents 16:1, 6.65:1 and 10.51/9.12/9.31/9.51:1.
- Four safe no-selection Dutch light/dark at 390/1440px pass layout and disabled operational controls.
  A one-use TournamentAdmin read fixture empties only sub-events; phase/permissions are untouched.
  Native info Message text passes light at 4.77:1 but fails dark at 4.32:1. Record under existing DR-034;
  do not apply a page-specific override. Light/narrow Message screenshot inspected.
- After fixtures expire, Enter-on-refresh returns HTTP 200, retains button focus and restores four genuine zero counts.
  Final reload confirms real TournamentAdmin and SubEventDrawsData both HTTP 200, HE 1, no synthetic draw Panels,
  Dutch/dark/1355x1249 and the original Draws route. No route interceptors remain or browser operational writes occur.
- Apollo reports cache replacement warnings while synthetic lists are replaced by genuine records;
  final reload uses real data. Existing Scheduling HTTP 400 remains out of scope.

### Restart interruption and recovery

- Backend reload interrupted browser verification. Port 5000 briefly accepted a TCP connection and the API log recorded
  successful startup at 16:38:53, but subsequent HTTP probes to localhost, IPv4 and IPv6 were refused.
  Reloading the same admin route returned proxy HTTP 502 for translations, TournamentAdmin and Profile;
  `app-draws-tab` no longer mounted. No backend configuration, process or permission was changed.
- User selected "Backend is restored—continue verification" on 2026-11-09.
  HTTP readiness and the actual authorized route recovered; browser verification above then completed.
  The earlier Blocked handoff is superseded by this verified recovery.

### Exact next action

- User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
  Approval authorizes only this slice, focused tests, scoped locale/generated-type additions and repository handoff.
  Accepted limits: DR-034 dark Message contrast failure, full suite, populated real reads, live operations/permissions,
  exhaustive accessibility, alternative browser locales and SSR/hydration. All unchecked criteria remain unchecked.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects with existing warnings
  and zero errors; 21 replay cache and 13 execute. No claim that all workspace lint runs freshly.
- Mark only this child Done and commit the approved scope without pushing.
- Keep DR-024a3, DR-024a and DR-024 open until aggregate checks/review and remaining children are reconciled.
  Next candidate after approval is DR-024a3 aggregate reconciliation, then scoping DR-024a4 dialogs/locale children.
  Do not begin that independent work in this invocation. No push.
