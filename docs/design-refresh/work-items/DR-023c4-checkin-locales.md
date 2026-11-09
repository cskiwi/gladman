---
title: 'DR-023c4: Check-in locale completeness'
description: 'Complete mounted check-in diagnostics and French terminology without changing operations or layout.'
---

## Identity

- ID: DR-023c4; parent [DR-023c](DR-023c-admin-checkin.md).
- Authoritative status: [backlog](../backlog.md).
- Dependencies: approved DR-023c1/c2/c3.
- Design rules: [rollout](../README.md).

## Scope

- Fresh authorized visible `app-checkin-tab` confirmed on 2026-11-09 at
  `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=checkin`.
- Projects: `frontend-pages-tournament`, `backend-translate`; API asset build/generated `i18n` keys as needed.
- Sources: [service][service], [tests][tests], [English][en], [Dutch][nl] and [French][fr] check-in entries.
- Translate the missing-records/statistics diagnostic and five existing non-Error operation fallbacks.
- Clarify French checked-in/pending states, row/bulk check-in actions and sub-event terminology.
- Preserve native presentation, data, selection, query/mutation contracts, permissions and Error diagnostics.
- Exclude unused dictionary blanks, other tabs, global/shared styling, dependencies and live operational writes.
- DR-051 owns missing/partial mutation results and stale selection/focus; DR-024 scheduling and DR-034 contrast
  remain separate.

## Baseline and approach

- Worktree clean. Actual Dutch tab renders genuine zero counts, complete summary/filter/table/empty labels.
- Six service-local English diagnostics remain: incomplete read plus initialize/check-in/no-show/undo/bulk fallbacks.
- French uses a noun for a checked-in state/action, "En prévision" for Pending and "Section" for sub-event.
- Reuse enrollment service's TranslateService pattern; preserve server/network Error messages verbatim.
- Existing smart tab/service split is sufficient. No repeated presentation consumer warrants extraction.
- No template/style edits planned; utility usage and native primitives stay unchanged.

## Implementation checklist

- [x] Confirm mounted consumer, prerequisites and bounded scope.
- [x] Complete consumed copy in all three assets and wire local diagnostics.
- [x] Add asset-backed regressions for local errors, recovery and locale changes.
- [x] Format, validate and persist the repository handoff.

## Acceptance and verification

- [x] All mounted check-in labels and six local diagnostics are meaningful in English/Dutch/French.
- [x] Local failures use the active locale; server/network Error messages remain unchanged.
- [x] Locale switching preserves status/search/selection and does not issue extra data queries.
- [x] Light/dark at 390/1440px preserve restored labels, actions and safe error/recovery feedback.
- [x] No layout/styles, dependencies, other tabs, backend business rules or operational test writes change.
- [x] Focused existing Nx tests/lint/build pass with exact evidence.
- [ ] Exhaustive accessibility/contrast, live operations and dedicated SSR/hydration verification.
- [x] User review or explicit acceptance with disclosed limits.

## Evidence and handoff

- Before: fresh real Dutch mounted tab, genuine empty list, no missing visible labels.
- Baseline source and real consumer establish locale-only scope; leave unconsumed blanks unchanged.
- Six new keys cover incomplete read and initialize/check-in/no-show/undo/bulk failures in all three dictionaries.
  French mounted Pending/Checked In, row/bulk actions and sub-event labels are clarified.
- Service follows the existing enrollment TranslateService pattern. Existing Error messages are preserved verbatim;
  non-Error mutation failures and the locally detected incomplete-read response use the active language.
  A displayed error retains the language in which it was raised until retry, matching enrollment behavior.
- Generated translation types contain precisely six added keys after API reload.
  No new component, wrapper or reusable styling pattern is needed.
- Template is byte-for-byte unchanged against HEAD. Literal `class` tokens remain 72 before and after;
  no new SCSS, inline styles, palette colors or theme/shared primitive changes.
- Passed commands (NX_DAEMON=false):

  ```powershell
  npx nx run frontend-pages-tournament:test --testPathPatterns=checkin-tab.component.spec.ts --runInBand --output-style=static
  npx nx run-many -t lint build -p frontend-pages-tournament,backend-translate --output-style=static
  npx nx run api:build:development --output-style=static
  ```

- Focused test result: 1 suite / 33 tests. Seven new asset-backed cases cover all three locale read failures,
  all five local mutation-failure fallbacks, preserved server diagnostics, recovery and retained locale state.
  Existing 26 summary/filter/table/contract tests still pass. All operation tests use mocked Apollo only.
- Scoped lint/build pass both targets and 12 dependency tasks; final repeat after generated-key formatting passes.
  API development build passes all 16 tasks. Existing executor/metadata warnings are not new failures.
- Repository Prettier ran on every changed file. Generated formatting is preserved with
  `--tab-width 4 --quote-props preserve --single-quote false`; its diff contains only six keys.
- During rebuild, the browser temporarily received API connection/502 errors.
  API subsequently recovered without a requested user restart; all three actual HTTP 200 dictionaries contain
  the six new nonblank values and the revised French labels.
  The first PowerShell availability probe could not parse unrelated case-distinct dictionary keys
  (`other`/`Other`); JavaScript browser JSON parsing verifies the served assets instead.
  A browser request-context helper is unsupported by this browser bridge; same-origin fetch works.
- Twelve settled populated cases (three locales, light/dark, 390/1440px) pass on the real mounted consumer.
  Safe browser-only read fixtures show member/guest/unknown identities and all three native status Tags.
  All translated headings/actions are nonblank, native status overlays fit and the document has no overflow.
  Native table horizontal scrolling remains contained; row actions retain translated accessible names.
- Keyboard Space selects the pending row. Switching the real TranslateService across all three locales keeps
  its identity selected and sends zero additional check-in queries. Native overlays open/close with Escape.
  Status/search preservation with a non-default enum and nonempty search is also verified by asset-backed tests.
- Twelve incomplete-read cases pass across the same locale/theme/width matrix.
  Both native error surfaces display the actual served localized diagnostic, initialization disables,
  and the table is not replaced by false empty feedback. Switching the fixture back to valid data recovers.
- Sixty synthetic update-feedback layout cases (five diagnostics times twelve combinations) fit and retain
  the populated table. These set only the existing client feedback signal, not operational mutations;
  real failure handling and retry are established by mocked tests, not claimed as live operational evidence.
- Safe French narrow dark tab and light filter screenshots were inspected.
  The full dark element capture is viewport-clipped at the top, so it is not proof of whole-tab visibility;
  settled DOM measurements and scoped light capture establish fitting text and controls.
- Interceptor and temporary browser state removed. Original Dutch/dark/1355x1249 preferences restored.
  Real query returns zero rows, no read/update error and no selection; genuine empty feedback is restored.
  Observed browser mutations: zero. Apollo emits a cache replacement warning when restoring the real empty list;
  it is not evidence of an operational backend write.
- Not run: full tournament suite, exhaustive screen-reader/contrast, dedicated SSR/hydration and live operations.
  Existing DR-034 native error contrast remains a known separate failure; no contrast pass is inferred here.
- User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
  Approval covers this child's implementation, assets/generated keys, tests and repository handoff.
  Accepted failed/unperformed checks stay unchecked; approval does not claim exhaustive visual/accessibility,
  live operational or hydration verification. Commit only this approved slice; no push.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects
  with existing warnings. Approval/handoff documentation is formatted before committing.
- Exceptions: none. Existing DR-034 native error contrast remains separate.
- Exact next action in a fresh invocation: reconcile DR-023c aggregate acceptance across its four approved children.
  Do not start that aggregate slice or another implementation child in this invocation.
- Parents stay open; no other slice starts in this invocation.

[service]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/checkin/checkin-tab.service.ts
[tests]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/checkin/checkin-tab.component.spec.ts
[en]: ../../../libs/backend/translate/assets/i18n/en/all.json
[nl]: ../../../libs/backend/translate/assets/i18n/nl_BE/all.json
[fr]: ../../../libs/backend/translate/assets/i18n/fr_BE/all.json
