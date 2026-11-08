---
title: 'DR-023c2: Check-in filters'
description: 'Reactive, localized native check-in filters and refresh consolidation.'
---

## Identity

- ID: DR-023c2; parent [DR-023c](DR-023c-admin-checkin.md).
- Authoritative status: [backlog](../backlog.md).
- Dependencies: approved DR-023c1 and DR-023a.
- Design rules: [rollout](../README.md).
- Outcome: readable native filters that actually update status/search, with one stable refresh action.

## Scope

- Confirmed authorized mounted route on 2026-11-08:
  `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=checkin`.
- Projects: `frontend-pages-tournament` and bounded `backend-translate` locale assets.
- [Component](../../../libs/frontend/pages/tournament/src/pages/admin/tabs/checkin/checkin-tab.component.ts),
  [template](../../../libs/frontend/pages/tournament/src/pages/admin/tabs/checkin/checkin-tab.component.html),
  [service](../../../libs/frontend/pages/tournament/src/pages/admin/tabs/checkin/checkin-tab.service.ts).
- Preserve query/status enums, local case-insensitive name/guest/member-ID search, tournament context,
  summary counts, selection, initialization handler, errors and permission/phase gates.
- Exclude table/operational redesign, other tabs, global/shared styling, dependencies and live writes.

## Baseline and approach

- Clean worktree; actual authorized browser renders the approved summary with successful genuine zero reads.
- Filters use a decorative hand-built surface, fixed widths and manually positioned search icon.
  Status uses hard-coded English options; label targets the host, not the native Select input.
  Dutch search/initialization labels are blank, and two refresh actions are mounted.
- Component effects read nonreactive FormControl values; service search reads a nonreactive form value.
- Use native Panel, fluid Select/InputText and IconField/InputIcon following approved enrollment filters.
  Translate options reactively without changing enum values.
- Keep search local and separate from server query parameters to avoid refetching on every keystroke.
- Preserve the existing smart tab/service split. No meaningful repeated domain structure warrants another wrapper.

## Implementation checklist

- [x] Confirm dependencies, mounted consumer and bounded scope.
- [x] Simplify filters with native PrimeNG, preserve adjacent behavior and remove duplicate refresh.
- [x] Wire reactive status/search and localized labels/options.
- [x] Record scoped utility comparison and discoveries without expanding scope.

## Acceptance and verification

- [x] Status changes send the exact enum; All clears it; tournament changes preserve filters.
- [x] Search reacts for player/guest/member-ID, clearing restores rows, and search alone sends no query.
- [x] Locale switching preserves selected status/search without a data refetch.
- [x] Loading/error recovery retains filters and one named, stable refresh; no test operational mutations.
- [x] Native labels, keyboard selection/focus and overlays work.
- [x] Light/dark at 390/1440px fit; scoped sampled text contrast passes.
- [x] Fewer authored utilities; no new palette utilities, SCSS or inline styling.
- [x] Focused Nx tests/lint/build pass; commands and actual evidence recorded.
- [ ] Exhaustive accessibility/contrast and dedicated SSR/hydration verification.
- [x] User review or explicit acceptance with disclosed limits.

## Evidence and handoff

- Before: actual mounted Dutch status is English "All"; search/initialization are unnamed.
  Existing scheduling HTTP 400 is outside scope (DR-024).
- Authored filter utility tokens fall from 36 to 15, measured from class/styleClass attributes.
  Native Panel/Select/IconField/InputText replaces decoration and fixed widths; no wrapper or new styling.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=checkin-tab.component.spec.ts --runInBand`
  passes 1 suite / 13 tests, including existing summary checks and four filter regressions.
  Static-output repeat replays the same result from cache; it is not another test execution.
- `npx nx run-many -t lint build -p frontend-pages-tournament,backend-translate --output-style=static`
  passes both targets and 12 dependency tasks.
- `npx nx run api:build:development --output-style=static` passes all 16 tasks.
  Existing executor/metadata warnings remain. No dependencies or operational mutations.
- Native APIs verified from PrimeNG docs: Select inputId/ariaLabelledBy/fluid, InputText fluid and IconField.
- Initial runtime blocker: fresh same-origin `/api/v1/translate/i18n/nl_BE` returned HTTP 200 but `initialize: ""`
  after API build. New Dutch/French initialization labels pass actual-asset tests, not live dictionary validation.
  Request API restart rather than replace/kill the user's service; wait for port 5000 to return.
- One initial reload emitted NG0506 hydration stabilization warning; dedicated hydration remains unverified.

### Verification after runtime restart

- User selected "API restarted; continue verification" and "Nothing else".
  Port 5000 responds; frontend briefly refused connections while restarting, then recovered.
  A PowerShell dictionary parse failed on unrelated existing case-distinct `other`/`Other` keys;
  browser JSON parsing completed verification without changing those keys.
- Fresh actual HTTP 200 dictionaries contain the expected initialization label in English, Dutch and French.
  Existing keys only changed values; no generated type additions were necessary.
- Final 12 locale/theme/390/1440px cases fit: Panel and controls stay within the viewport,
  document scroll width is 375 at 390px with scrollbar and 1440 at 1440px.
  Locale changes use the native account menu and wait for the exact expected initialization label.
  Initial cookie-only locale attempt stayed Dutch and was discarded; intermediate menu-name/navigation
  attempts were corrected without mutations. Transient overflow samples before menu animations settled
  were rerun after settling; final cases above pass.
- Fresh native status overlays fit in all four theme/width cases, expose all four named options,
  and Escape returns focus. Keyboard selection sends `PENDING` and retains native input focus.
- Safe two-record query-response fixtures verify player-name, guest-name, member-ID, no-match and clear-search
  results without another query. No fixture or operational data is saved to the server.
  Changing locale preserves selected Pending/search without another query.
- Safe pending/error/recovery responses retain filter values and stable refresh keyboard focus.
  Error displays "Safe check-in read failure"; recovery restores metrics. Zero browser mutations.
  Handlers/listeners removed in finally; real empty data restored by reload.
  Test-fixture Apollo cache replacement warning is not used as live data evidence.
- Sampled native Panel heading/status/search text contrast passes at 16.00:1 dark / 19.87:1 light.
  Initialization label passes at 6.65:1 dark / 4.73:1 light.
  Computed OKLCH colors were converted through browser canvas to sRGB before WCAG luminance calculation;
  an initial RGB-only diagnostic was invalid and is not evidence.
- Dutch locale, dark preference and wide viewport restored after checks.
- Still not verified: exhaustive accessibility/contrast/screen-reader checks, dedicated SSR/hydration,
  full tournament suite and live initialization/other operational workflows.
  DR-034's native error contrast limitation and DR-024 scheduling errors remain separate.
- No custom styling exceptions, shared changes, dependencies or extracted wrappers.
  Existing translated initialization key also supplies the untouched empty-state action.
- User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-08.
  Approval covers DR-023c2 filters/service/tests, the two initialization locale values and repository handoff.
  Accepted limits: exhaustive accessibility/contrast/screen-reader checks, dedicated SSR/hydration,
  full tournament suite, live initialization/operational workflows and existing DR-034/DR-024 limitations.
  These limits remain unchecked; approval is not a claim that unperformed or failed checks passed.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 workspace targets,
  with existing warnings. Documentation-only approval updates require no application rerun.
- Exact next action: commit this approved child/handoff only, without push.
  Next fresh invocation scopes DR-023c3 table/operational presentation with safeguards on the confirmed consumer;
  do not begin it or DR-023c4 here. Both parents remain open.
