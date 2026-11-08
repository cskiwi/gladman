---
title: 'DR-023b1: Enrollment-management summary'
description: 'Bounded five-count summary refresh on a confirmed phase-enabled administration consumer.'
---

## Identity

- ID: DR-023b1; parents DR-023b and DR-023 remain open.
- Authoritative status: [backlog](../backlog.md).
- Dependency: approved DR-023a administration chrome and confirmed DR-023b consumer.
- Design rules: [rollout](../README.md).

## Scope

- Confirmed route: `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=enrollments`.
- Read-only phase `ENROLLMENT_OPEN`; authorized browser mounts the real enrollment tab.
- Project: `frontend-pages-tournament`.
- Sources: [tab component][component], [template][template], unchanged [count service][service].
- Refresh only the summary: total, confirmed, pending, waiting list and cancelled/withdrawn counts.
- Preserve exact computed counts/status grouping, input order, zeros and English descriptions.
- Reuse existing `totalEntries` translation instead of blank localized `total`; no translation asset changes.
- Exclude filters/selection, query/error handling, table, dialogs, operations, services, other tabs and shared theme.

## Baseline and proposed approach

- Five decorative hand-built tiles duplicate icon circles, borders, hover effects, oversized counts and uppercase labels.
- Four tiles use manually paired light/dark green/blue/orange/red colors.
- Actual supplied summary is all zero; Dutch descriptions and total label are empty in existing translation assets.
- Use one native bordered Card, with semantic `dl`/`dt`/`dd` groups and normal theme-aware counts.
- Keep the smart tab/service split; a static typed metric list shares the repeated markup without a new UI wrapper.
- Existing StatCard was inspected: separate Cards for each metric would over-group this single summary.
  No shared component is changed or added solely for styling verification.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, exact scope and excluded concerns.
- [x] Replace repetitive tiles with one native Card and a definition list.
- [x] Preserve count mapping and descriptions; meaningful localized total label uses existing asset.
- [x] Record regression, browser evidence and exact remaining review actions.
- [x] Persist results and authoritative backlog/current focus.

## Acceptance and verification

- [x] All five counts retain order, exact values, zero rendering and reactive updates.
- [x] Native Card and semantic definition list; no buttons or focusable decorative metrics.
- [x] Existing English/Dutch/French metric labels render; existing blank descriptions remain disclosed.
- [x] Light/dark at 390/1440px fit with readable count/label/description layout.
- [x] Sampled text contrast passes; no color-only status communication.
- [x] No new stylesheets, inline colors, palette utilities, dependency or mutations.
- [x] Focused existing Nx lint/test/build passes.
- [ ] Screen-reader, exhaustive accessibility/contrast and SSR/hydration verified.
- [x] User review or explicit approval with disclosed verification limits.

## Evidence and handoff

- Initial blocker and resolution are recorded in the [parent brief](DR-023b-admin-enrollments.md).
- Available live summary has five zero counts; source investigations do not establish live nonzero workflow accuracy.
- Pre-existing non-reactive FormControl effects, swallowed enrollment query errors, missing locale descriptions
  and incomplete manual creation are assigned to DR-023b2/b3/b4, not fixed here.
- Implementation: a static `as const` metric list shares one template; no new presentation component is needed.
  Existing service counts, cancelled/withdrawn grouping and adjacent controls remain unchanged.
- Utility comparison: 217 to 29 static class tokens before the Filters marker, including the unchanged outer wrapper.
  This counts authored tokens, not five runtime copies of the loop body. Four manually paired palettes removed.
- Repository formatting normalizes the existing excluded template indentation; no excluded bindings/actions change.
- Five new regression cases use safe input-only counts, real native Card and the real tab component:
  structure/no decorative focus, zero values, nonzero exact mapping/reactive replacement, and three asset-backed locales.
  No mocked GraphQL mutation is called. These are presentation tests, not service or admin workflow verification.
- Exact focused command:

  ```powershell
  npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static
  ```

  Pass: 17 suites / 206 tests, tournament lint, production library build and ten prerequisite tasks.
  No app production build is claimed; later post-approval full-workspace lint is recorded below.

- Four actual mounted light/dark checks assert `innerWidth` equals 390/1440px.
  Native summary has one column narrow, five columns wide; five ordered zero counts and all Dutch labels remain.
  Summary and document have no horizontal overflow. No links/buttons/inputs/tabindex appear in the summary.
- Sampled label/count contrast: light 4.87/19.87:1; dark 6.65/16:1.
  Colors are converted through browser Canvas pixels before relative-luminance calculation because tokens are OKLCH.
  An initial RGB-only parser produced invalid low ratios; corrected measured checks supersede those results.
  One initial integrated wide measurement returned 1237px; repeated exact-width checks supersede it.
- Four temporary DOM-only layout fixtures at both themes/widths use 270-character unbroken labels,
  long descriptions and values 90000/12/3/4/5. No summary/document overflow; reload restores actual application DOM.
  These validate wrapping only, not data loading, filtering, status operations or signal updates.
- Before screenshot captures only five real summary tiles; after narrow light/dark screenshots show the full summary.
  Wide integrated screenshots partially crop the first label despite passing DOM containment checks;
  they are not claimed as complete 1440px visual evidence. A subsequent attached wide dark capture shows all labels.
  Local `DR-023b1-{390,1440}-{light,dark}.png` summary-only captures are not committed.
- Screen-reader, exhaustive accessibility/contrast/focus, SSR/hydration, browser alternative locales,
  actual nonzero enrollment workflows, loading/errors and mutation behavior are not verified.
  Existing blank Dutch/French descriptions remain visible as no text, not newly translated.
  The authenticated mounted zero summary does not establish that its pre-existing query/filter workflow works.
- No backend/translation change, styling exception, dependency, shared theme/component change or operational mutation.
- Exceptions: none. No operational mutations or application dependencies authorized.
- On 2026-11-08 user selected "Approve completion and commit with disclosed limits" and "Nothing else".
  Approval covers this summary, its tests and the consumer/child repository handoff; no push.
  Accepted limits are exactly the unperformed checks above, retained unchecked, not claimed as passed.
  Authoritative child status is Done; both parents remain open.
- Post-approval command `npx nx run-many --target=lint --output-style=static` passes all 34 projects
  with existing warnings and zero blocking errors. Subsequent changes are documentation-only.
- Commit the approved slice/handoff only. Exact next action in a fresh invocation: scope DR-023b2
  filters/selection on the confirmed safe consumer; inspect reactive-control behavior before acceptance.

[component]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.component.ts
[template]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.component.html
[service]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.service.ts
