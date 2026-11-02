---
title: 'DR-020c: Tournament editing chrome'
description: 'Native editing heading, Card, tabs, feedback and actions without restyling child forms.'
---

## Identity and scope

- ID: DR-020c; parent DR-020. Status is authoritative in the [backlog](../backlog.md).
- Dependencies: completed DR-020a/b. Rules: [design refresh](../README.md).
- Project: `frontend-pages-tournament`.
- Mounted consumer: `/tournament/8658b541-702a-408e-8114-2858a9428069/edit`, rendered anonymously on
  2026-11-02 with real tournament identity and permission-disabled form controls.
- Source: [editing page](../../../libs/frontend/pages/tournament/src/pages/edit/page-edit.component.ts)
  and [template](../../../libs/frontend/pages/tournament/src/pages/edit/page-edit.component.html).
- Preserve breadcrumb, permissions, both child forms, translations, cancel, current/all-save contracts and Toast.
- Exclude child-field presentation (DR-020d/e), mutation payloads, permission policy, shared components,
  theme, backend, translation assets and administration.

## Baseline and approach

- Integrated browser mounts the real lazy-loaded route; a route export alone is not the consumer evidence.
- Before: oversized display heading/eyebrow, custom surface wrapper, two inline-colored banners,
  fixed-width loading skeletons and icon-bearing action/tab names.
- Before checks: light/dark at 390/1440px fit the viewport; wide dark screenshot inspected in chat.
- Use a compact heading with real tournament context, native Card, Message severities, native button labels,
  and plain native Tabs. No wrapper extraction: the two existing smart form children already isolate behavior;
  no second confirmed consumer shares this editing chrome.
- Correct the obsolete `activeIndexChange` binding to native `valueChange`; selected-tab save dispatch must agree
  with the visible tab. This is tightly coupled to the chrome, not a child-form redesign.

## Implementation checklist

- [x] Confirm a mounted consumer and bounded scope.
- [x] Simplify chrome with native components and semantic utilities.
- [x] Preserve actions and regression-test selected-tab save dispatch.
- [x] Leave child forms and shared consumers unchanged.
- [x] Record utility comparison, verification limits and unrelated discoveries.

## Acceptance and verification

- [x] One localized heading, real context, native Card and native action labels.
- [x] Native warning/read-error feedback; responsive loading without fixed widths.
- [x] Both tabs remain keyboard-accessible and selected value drives Save current.
- [x] Cancel/all-save and dirty-state behavior pass mock-only regression tests.
- [x] Light/dark at 360/390/768/1440px fit the scoped chrome; both tabs retain content.
- [ ] Keyboard focus, labels and scoped contrast pass.
- [x] Loading/error/dirty feedback is checked without real mutations.
- [x] Dutch SSR/client heading and identity match.
- [x] Relevant Nx lint/test/build pass.
- [x] User approves completion with the disclosed contrast and workflow limits retained below.

## Evidence and handoff

- Worktree was clean before selection. No styling exceptions or dependencies authorized.
- Browser MCP could not acquire its shared profile; the integrated browser successfully mounts the route.
- Port 3000 continued serving the old template after rebuild/reload, with no registered service workers.
  Leave the user's process untouched. A temporary `npx nx run app:serve --port=3001 --output-style=static`
  mounted the changed application using the existing port-5000 proxy. The temporary server is stopped after checks.
- Before/after screenshots inspected in chat: wide dark baseline, wide dark native Card, narrow light final form.
  No screenshots or logs containing real application data are added to the repository.
- Authored whole-page template class tokens: 59 to 25; inline color styles: two to zero.
  Fixed loading widths and action/tab decorative icons are removed. No SCSS, palette utilities, `[pt]` or `[dt]`.
- Ten new regressions in the [editing spec](../../../libs/frontend/pages/tournament/src/pages/edit/page-edit.component.spec.ts)
  cover native heading/Card/actions, preserved read/query and disabled permissions, pending/error feedback,
  authorized dirty interaction, visible-tab current-save dispatch, pristine/rejected current-save,
  no-change all-save, waiting for both dirty children, failure feedback and relative cancellation/navigation.
  Save methods are mocked; no real mutation is executed. Child mutation implementations are untouched.
- The obsolete event handler is removed. Native `valueChange` accepts string/number/undefined; the template narrows
  undefined before writing the existing string signal. Tests switch the actual rendered tabs.
- Final validation:
  `npx nx run-many --targets=lint,test,build --projects=frontend-pages-tournament --output-style=static`
  passes focused lint, all 75 tests in four suites, production library build and ten prerequisites.
  Ten prerequisite builds are cached; the final library build/lint/test execute.
  Existing Nx Jest deprecation and ts-jest metadata warnings remain; no new tooling is introduced.
- Initial validation found nullable tab-event typing and missing Jest ResizeObserver; both are corrected.
  The observer test shim follows the existing detail spec and restores the original global.
  The dirty regression dispatches a real input event so zoneless rendering is exercised rather than assumed.
- Final eight-case browser matrix: light/dark at 360/390/768/1440px all pass document/header fit,
  one localized heading with real context, both visible tab contents and unchanged disabled child controls.
- The same eight cases pass browser-local dirty-warning/Save-all enablement, read-error Message text and
  three native loading Skeletons, one inside Card. These directly set dev-only component state, not backend data
  or permissions. Settled branch transitions are awaited; these are not real outage/save workflow passes.
- Four final keyboard cases (light/dark at 390/1440px) pass Tab from Cancel to Save current to the selected tab,
  skipping disabled Save all; all three show `:focus-visible`. ArrowRight/Enter activates Settings;
  ArrowLeft/Space restores Information. Every tabpanel's accessible-name reference resolves.
- Monitored final loaded/fixture matrix: zero page errors and zero GraphQL mutation requests.
- `Invoke-WebRequest` to the final port-3001 editing URL returns HTTP 200 with native header,
  Dutch heading and tournament context matching the client. This is not exhaustive hydration verification.
- Repository formatter runs on all six changed files; `git diff --check` passes.

### Settled contrast and retained limits

Measurements use browser Canvas sRGB luminance with alpha backgrounds composited over all ancestors, after theme
transitions settle. These are scoped observations, not a complete accessibility certification.

| Target                                | Light   | Dark    | Outcome                           |
| ------------------------------------- | ------- | ------- | --------------------------------- |
| Heading, tournament context, subtitle | 18.20:1 | 16.64:1 | Pass                              |
| Native Cancel text                    | 4.46:1  | 6.91:1  | Light normal-text failure; DR-032 |
| Native Save current text              | 3.35:1  | 10.63:1 | Light normal-text failure; DR-033 |
| Native selected tab text              | 3.65:1  | 10.22:1 | Light normal-text failure; DR-044 |
| Native unselected tab text            | 4.87:1  | 6.65:1  | Pass                              |
| Native warning Message text           | 2.83:1  | 7.98:1  | Light normal-text failure; DR-034 |
| Native error Message text             | 4.41:1  | 4.63:1  | Light normal-text failure; DR-034 |
| Native Cancel outline against canvas  | 7.74:1  | 1.46:1  | Dark non-text failure; DR-032     |

- The new subtitle initially used muted text, measuring 4.46:1 in light mode. It now uses semantic `text-color`,
  verified in the final client and SSR, rather than introducing a page-specific color or shared-theme change.
- Native component contrast failures remain open in the shared audits. No hidden palette fixes or exceptions.
- Real authenticated saves, real server outage/retry, actual screen-reader, mounted English/French,
  null-data/empty responses, exhaustive focus/contrast/overlays and hydration are not verified.
- Existing child DatePicker/Checkbox labels, colors, validation, busy states and mutations are excluded here;
  DR-020d/e must inspect them. Do not treat chrome verification as child-form completion.
- On 2026-11-02 the user selected "Approve DR-020c and commit with disclosed limits".
  Approval accepts the shared contrast failures in the table and unverified workflows listed above;
  it does not claim that failed or unperformed checks passed. The contrast criterion remains unchecked.
  Only DR-020c implementation, its tests and repository handoff are authorized for commit; no push.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects from cache,
  with existing warnings and zero errors. No application code changes follow the final focused validation.
- Exact next action in a fresh invocation: scope DR-020d information-tab presentation on the confirmed editing route,
  preserving DR-020c chrome and save dispatch. It is not started here; DR-020 remains open.
