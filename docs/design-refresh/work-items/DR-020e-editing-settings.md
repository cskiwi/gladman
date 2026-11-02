---
title: 'DR-020e: Tournament editing settings tab'
description: 'Semantic settings sections, native checkbox labels and saving feedback on the mounted editing route.'
---

## Identity and scope

- ID: DR-020e; parent DR-020. Status is authoritative in the [backlog](../backlog.md).
- Dependencies: completed DR-020c and DR-020d. Rules: [design refresh](../README.md).
- Project: `frontend-pages-tournament`.
- Confirmed consumer: `/tournament/8658b541-702a-408e-8114-2858a9428069/edit`, Settings tab,
  mounted anonymously on 2026-11-02 with real identity and three permission-disabled checkboxes.
- Source: [settings component][component] and [template][template], mounted by the [editing page][page].
- Preserve all three booleans, permission gating, dirty/pristine state, save payload, success Toast and rejection/retry.
- Exclude parent chrome, information tab, other routes, shared theme, backend, translations and mutation logic.

## Baseline and approach

- Worktree was clean at selection. The real mounted tab has three unnamed native checkbox inputs:
  host `id` does not associate the visible labels with the nested inputs.
- Four attempted light/dark 390/1440px baseline cases fit horizontally, but theme toggling was not settled;
  they do not establish both-theme colors. A wide dark screenshot was inspected.
- Baseline template has 56 authored class tokens, three palette-paired headings, redundant spacing wrappers,
  comments labelling obvious structure and an inline progress height.
- Use three named semantic sections, matching the completed information tab's headings and text.
  Keep native binary checkboxes, use documented `inputId`, and name native saving feedback with form busy state.
- Keep the existing smart child. One real consumer and three simple native fields do not justify a dumb wrapper.
  Competition alignment is a reference, not permission to change its separate, broader settings form.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and one bounded tab.
- [x] Simplify native fields and feedback without changing permissions or save logic.
- [x] Add mock-only regressions for labels, permissions, booleans, save/pending/success and failure/retry.
- [x] Verify layouts, keyboard interactions and feedback; disclose remaining limits.
- [x] Update authoritative backlog and next action.

## Acceptance and verification

- [x] Three native binary checkboxes have associated translated visible labels.
- [x] Three meaningful sections use semantic headings with consistent information-tab presentation.
- [x] Saving ProgressBar is named and form busy state is exposed; native error remains explicit.
- [x] Utility usage is reduced without new palette utilities, SCSS, inline styles, `[pt]` or `[dt]`.
- [x] Light/dark at 360/390/768/1440px preserve information and fit.
- [x] Label clicks, Tab/Shift+Tab/Space and native focus-visible state are checked.
- [ ] Scoped text/control contrast passes.
- [x] Permission-disabled, dirty, saving, failure, retry and success contracts pass with mocks/local fixtures.
- [x] Exact mocked boolean payloads, input replacement and pristine state are checked.
- [x] Dutch SSR/client content and relevant hydration are checked.
- [x] Relevant Nx lint/test/build pass.
- [x] User reviews the slice or explicitly approves completion with disclosed limits.

## Evidence and handoff

- Changed application scope: settings template and a new six-test [component spec][spec] only.
  Component logic, parent chrome, information, shared components and other routes are unchanged.
- Whole-template authored class tokens drop 56 to 49. One outer wrapper, three spacing wrappers,
  palette-paired headings, cursor styling, obvious comments and inline progress height are removed.
  Three named semantic sections match the completed information tab without a new abstraction.
- PrimeNG documentation and installed Checkbox declarations confirm native `inputId` label association.
  Named ProgressBar follows the completed information tab's documented native API.
- `npx nx run-many --targets=lint,test,build --projects=frontend-pages-tournament --output-style=static` passes:
  focused lint, all 87 tests in six suites, production library build and ten prerequisite tasks.
  Existing Nx Jest deprecation/ts-jest warnings remain; no new tooling or dependencies.
- Six new mock-only regressions cover sections/translated labels, permission-disabled values and label clicks,
  enabled label toggles for all booleans, exact pending payload/named saving/success Toast,
  rejected save/dirty preservation/retry, and replacement-input/pristine reset.
- Final eight-case light/dark 360/390/768/1440px matrix passes document fit, three named sections,
  all three labels and disabled real values. Disabled-label clicks do not toggle.
  Local enabled/saving/error fixtures fit, expose busy state and name the progress indicator in Dutch.
- Four light/dark 390/1440px keyboard cases pass all twelve label-click/Space toggle-and-restore checks,
  sequential Tab, reverse Shift+Tab, dirty state and focus-visible state. No save buttons are invoked.
- Matrices and final reload/tab-switch monitoring record zero page errors and zero GraphQL mutations.
  Local fixtures enable only form controls, not authorization, and are reset by a final real-route reload.
- Anonymous same-origin `fetch` plus DOMParser returns HTTP 200 with matching Dutch description, all three
  headings, native input IDs and permission-disabled state. Client tab changes retain the six information inputs.
  Reload reports normal Angular hydration and no hydration-error messages; exhaustive hydration is not claimed.
  The integrated browser's request context does not support `Storage.getCookies`; same-origin fetch replaces it.
- Before wide-dark and after wide-dark/narrow-light screenshots were inspected in chat.
  No real-data screenshots or logs are committed. Both-theme final checks use the real theme button with settled
  styles, not the unsettled baseline's direct class toggles.
- Port 3000 serves final source after reload; no temporary server or backend/translation changes were needed.
- Repository Prettier runs on all five changed files; `git diff --check` passes.

### Contrast and retained limits

Settled browser Canvas sRGB measurements composite alpha backgrounds over all ancestors on the actual Card.
The final focus measurement uses Tab/Shift+Tab and waits for transitions; an earlier direct-focus probe did not
reliably settle focus and is not acceptance evidence.

| Target                             | Light   | Dark    | Result                          |
| ---------------------------------- | ------- | ------- | ------------------------------- |
| Description, headings, labels/help | 19.87:1 | 16.00:1 | Pass                            |
| Saving description                 | 19.87:1 | 16.00:1 | Pass                            |
| Unchecked enabled Checkbox border  | 1.48:1  | 1.40:1  | Fail non-text; DR-032           |
| Unchecked Checkbox focus outline   | 3.65:1  | 10.22:1 | Pass sampled native focus state |
| Native mutation-error Message text | 4.44:1  | 4.40:1  | Fail normal text; DR-034        |

- No page-specific override is added for existing native Checkbox/Message contrast. Shared DR-032/034 remain open.
- Actual screen-reader, exhaustive checked/hover/focus/control contrast, mounted English/French,
  real authenticated saves/outages/retries, null tournament responses and exhaustive SSR/hydration are not verified.
  Save success and retry are mock-tested contracts, not actual operational workflows.
- Exceptions: none.
- On 2026-11-02 the user selected "Approve DR-020e and commit with disclosed limits".
  Approval accepts the recorded limits; it does not turn failed/unperformed checks into passes.
  Only DR-020e's template, tests and repository handoff are approved for commit. No push or next slice is authorized.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
  with existing warnings and zero errors. Subsequent changes are documentation-only.
- All five DR-020 children now have explicit approval; the parent is reconciled as Done with their limits retained.
- Exact next action in a fresh invocation: confirm a real DR-021 enrollment consumer, split the broad parent
  into bounded children and select only one. Do not start another slice in this invocation.

[component]: ../../../libs/frontend/pages/tournament/src/pages/edit/components/tournament-settings/tournament-settings.component.ts
[template]: ../../../libs/frontend/pages/tournament/src/pages/edit/components/tournament-settings/tournament-settings.component.html
[page]: ../../../libs/frontend/pages/tournament/src/pages/edit/page-edit.component.html
[spec]: ../../../libs/frontend/pages/tournament/src/pages/edit/components/tournament-settings/tournament-settings.component.spec.ts
