---
title: 'DR-020d: Tournament editing information tab'
description: 'Native information fields, accessible dates and feedback on the mounted editing route.'
---

## Identity and scope

- ID: DR-020d; parent DR-020. Status is authoritative in the [backlog](../backlog.md).
- Dependencies: completed DR-020c. Rules: [design refresh](../README.md).
- Project: `frontend-pages-tournament`.
- Mounted consumer: `/tournament/8658b541-702a-408e-8114-2858a9428069/edit`, rendered anonymously on
  2026-11-02 with real identity and permission-disabled information controls.
- Source: [information component][component] and [template][template], mounted by the [editing page][page].
- Preserve six controls, required name, deferred dates, permission gating, dirty/pristine state,
  dates, save payload, success Toast and rejection/retry feedback.
- Exclude editing chrome, settings tab, service/backend logic, translations, shared theme and other routes.

## Baseline and approach

- Clean worktree at selection. Integrated browser confirms the real route; Playwright MCP's shared profile is busy.
- Baseline light/dark at 390/1440px fits the document; wide dark screenshot inspected.
  Five native date inputs have no associated labels because host `id` is used instead of `inputId`.
- Replace palette-paired section headings with semantic text; retain three useful semantic sections.
- Native fluid InputText/DatePicker, associated required/invalid feedback, and named native saving ProgressBar.
  Keep existing error Message; remove its progress-height inline override.
- No extraction: this existing smart child already owns its domain behavior and has one real page consumer.
  No shared field structure warrants a dumb wrapper solely for styling once.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and one bounded tab.
- [x] Simplify fields and native feedback without changing save logic or permissions.
- [x] Regression-test permissions, labels, validation, dates and save/error contracts with mocks only.
- [x] Verify layouts and interaction states; record remaining limits.
- [x] Update authoritative backlog and next action.

## Acceptance and verification

- [x] Native fluid fields and semantic section headings; no unnecessary wrappers.
- [x] Every date input has an associated translated visible label.
- [x] Required/touched name validation has native invalid state and associated feedback.
- [x] Saving indicator has an accessible name; mutation errors remain explicit.
- [x] No new palette utilities, SCSS, inline styles, `[pt]` or `[dt]`.
- [x] Light/dark at narrow/wide widths preserve information and fit.
- [x] Enabled date keyboard selection/overlay, labels and focus are checked without real mutations.
- [ ] Scoped text/control contrast passes.
- [x] Permission-disabled, empty-date, dirty, saving, failure and retry states remain usable.
- [x] Mocked payloads, dates, pristine state and success feedback preserve behavior.
- [x] Dutch SSR/client content and relevant deferred rendering are checked.
- [x] Relevant Nx lint/test/build pass.
- [x] User approves completion with the disclosed limits retained below.

## Evidence and handoff

- Before: palette-paired headings, red validation utility, five host-only date IDs, progress inline height.
- Changed application scope: information template and a new six-test [component spec][spec] only.
  Component logic, parent chrome and settings implementation are unchanged.
- Whole-template authored class tokens: 65 to 63. Three light/dark heading pairs and red validation utility removed.
  One outer wrapper and progress-height inline style removed. Native layout/appearance replaces these;
  no new abstraction, dependency or styling exception.
- PrimeNG documentation confirms `fluid`, DatePicker `inputId`, InputText `invalid`, Message and named ProgressBar.
- `npx nx run-many --targets=lint,test,build --projects=frontend-pages-tournament --output-style=static` passes:
  focused lint, all 81 tests in five suites, production library build and ten prerequisite tasks.
  Existing Nx Jest deprecation/ts-jest warnings remain; no new tooling.
- Six new mock-only regressions cover native sections/fluid labels, denied permissions/empty dates,
  touched required feedback and recovery, exact six-value payload/named pending state/success Toast,
  rejected save/dirty preservation/retry, and new-input date/pristine reset.
- Final eight-case light/dark matrix at 360/390/768/1440px passes document/input fit, all six associated labels,
  all five date IDs, three named sections and anonymous disabled controls.
  Browser-local enabled fixtures pass required/invalid feedback, recovery, named saving/busy state and native error.
  Branch transitions are explicitly awaited; these are not real authenticated save or outage workflows.
- Four light/dark 390/1440px keyboard cases exercise all five DatePickers: Tab from name to first day is
  focus-visible; native focus opens the dialog, ArrowDown enters its grid, ArrowRight changes the focused date,
  Enter binds a Date value, and Escape closes the reopened dialog and returns input focus.
  All twenty dialog cases fit horizontally. Native dialogs open on focus; ArrowDown alone is not a reopen command.
- Monitored matrices and final reload/tab-switch check have zero page errors and zero GraphQL mutations.
  Settings retains three disabled inputs, and Information is visible again after the settled tab transition.
- HTTP SSR at the isolated URL returns 200 with Dutch description, native section heading and real identity matching
  the client. Deferred date controls render after hydration. Exhaustive hydration correctness is not claimed.
- Before wide-dark and after wide-dark/narrow-light screenshots inspected in chat; none containing real data
  are committed. The user approves completion with the retained verification limits below.
- Port 3000 served stale source after reload. A temporary
  `npx nx run app:serve --port=3001 --output-style=static` verified final source with the existing backend proxy.
  The user's process was untouched; the temporary server is stopped after verification.
- Repository formatter runs on all changed files; `git diff --check` passes.

### Contrast and retained limits

Settled browser Canvas sRGB measurements composite alpha backgrounds over all ancestors on the actual Card.
These are scoped text observations, not an accessibility certification.

| Target                            | Light   | Dark    | Result                   |
| --------------------------------- | ------- | ------- | ------------------------ |
| Description, headings and labels  | 19.87:1 | 16.00:1 | Pass                     |
| Enabled name input text           | 13.01:1 | 13.73:1 | Pass                     |
| Native simple required validation | 4.83:1  | 5.08:1  | Pass                     |
| Saving description                | 19.87:1 | 16.00:1 | Pass                     |
| Native mutation error Message     | 4.44:1  | 4.40:1  | Fail normal text; DR-034 |

- No page-specific override is added for native Message contrast; the shared DR-034 audit remains open.
- English native `Choose Date` buttons/dialogs and full-date names persist on the Dutch route; DR-043 retains
  shared locale work. Visible field labels are translated and correctly associated.
- Actual screen-reader use, exhaustive focus/control/overlay contrast, mounted English/French,
  real authenticated saves/outages/retries, null tournament responses and exhaustive SSR/hydration are not verified.
  Tests use mocked mutations; browser fixtures change only local component/form state, never permissions or backend data.
- Exceptions: none.
- On 2026-11-02 the user selected "Approve DR-020d and commit with disclosed limits".
  Approval accepts the recorded limits; it does not turn failed/unperformed checks into passes.
  Only DR-020d's template, tests and repository handoff are approved for commit. No push or next slice is authorized.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
  with existing warnings and zero errors. Subsequent changes are documentation-only.
- Next: in a fresh invocation confirm and scope DR-020e settings. DR-020 remains open.
  DR-020e is a candidate only, not an implementation started here.

[component]: ../../../libs/frontend/pages/tournament/src/pages/edit/components/tournament-info/tournament-info.component.ts
[template]: ../../../libs/frontend/pages/tournament/src/pages/edit/components/tournament-info/tournament-info.component.html
[page]: ../../../libs/frontend/pages/tournament/src/pages/edit/page-edit.component.html
[spec]: ../../../libs/frontend/pages/tournament/src/pages/edit/components/tournament-info/tournament-info.component.spec.ts
