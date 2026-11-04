---
title: 'DR-021d: General enrollment cart'
description: 'Native cart presentation with accessible event-specific actions.'
---

## Identity and scope

- ID: DR-021d. Parent: [DR-021](DR-021-tournament-enrollment.md).
- Prerequisite: DR-021a Done with disclosed limits. Status: [backlog](../backlog.md).
- Design rules: [plan](../README.md). Project: `frontend-pages-tournament`.
- Confirmed mounted consumer on 2026-11-04:
  `/tournament/8658b541-702a-408e-8114-2858a9428069/enroll`.
- Existing [cart component](../../../libs/frontend/pages/tournament/src/pages/general-enrollment/components/enrollment-cart/enrollment-cart.component.ts)
  and [template](../../../libs/frontend/pages/tournament/src/pages/general-enrollment/components/enrollment-cart/enrollment-cart.component.html).
- Preserve ordered items, partner indication, counts, parent-controlled state, remove/clear/submit outputs,
  loading and existing parent success/error feedback.
- Exclude filters/rankings, event tiles, dialog, services, other routes, shared theme, backend and translations.

## Baseline and approach

- Actual mounted route contains the empty cart; only one application consumer exists.
- Custom cart chrome uses paired numbered primary colors, decorative icons, an arbitrary minimum height,
  custom nested surfaces and a large empty icon. Imported Card is unused.
- Retain the meaningful smart-page/presentational-cart split. No new wrapper or shared component is justified.
- Use a native bordered Card with a semantic heading, simple list, native Divider and native Buttons.
- Keep translated empty feedback as simple semantic text inside the Card, plus summary and partner indication.
  Use existing translated remove copy with
  event-specific accessible context instead of the literal English `Remove` label.
- Keep service operations untouched. Browser interactions must use local fixtures and replaced parent handlers;
  block GraphQL mutations. Submission locking must cover remove as well as clear/submit.

## Implementation checklist

- [x] Confirm mounted consumer, dependency and bounded scope.
- [x] Simplify the existing presentational cart with native components.
- [x] Preserve outputs and feedback with mock-only regressions.
- [x] Keep excluded consumers and shared settings unchanged.
- [x] Record discoveries and persistent handoff.

## Acceptance and verification

- [x] Native Card, semantic heading/list/empty text and Buttons replace custom decoration.
- [x] Names/actions wrap and remove actions have localized event-specific accessible names.
- [x] Light/dark 360/390/768/1440px content and action labels fit.
- [ ] Desktop scrolled sidebar heading remains unobscured by the app header (pre-existing DR-047).
- [x] Keyboard remove/clear/submit, visible focus and disabled/submitting states work.
- [ ] Scoped text, focus and control contrast pass.
- [x] Counts, partner indication, empty state and mock-only parent success/error feedback remain explicit.
- [x] No new palette classes, SCSS, inline styles, dependencies or shared changes.
- [x] Record before/after authored class-token comparison.
- [x] Relevant Nx lint/test/build pass.
- [x] Mounted English/French/Dutch cart copy and Dutch empty-cart SSR/client text checks pass.
- [ ] Exhaustive hydration, screen-reader and real authenticated cart workflows pass.
- [x] User visual review or explicit approval with disclosed limits.

## Evidence and handoff

- Initial worktree is clean.
- Existing port 3000 service mounts the route. Anonymous ranking read reports `Forbidden resource`;
  this pre-existing service read-error limitation is already recorded in the parent brief.

### Implementation and reuse

- Keep the existing smart page and presentational cart. Only the cart implementation and related tests change.
  No new component, shared wrapper or consumer is added.
- Native Card title/subtitle/content/footer supply the content surface. Card root pass-through adds only
  `border border-surface`; semantic `h2`, `h3`, list and definition list provide structure.
- Preserve ordered event names, raw game codes, partner indication, singular/plural count and total.
  Names wrap, including long unbroken fixture names; private partner IDs and notes remain undisplayed.
- Replace literal English remove labels with the existing translated remove-from-cart copy plus the event name.
  Native remove/clear/submit Buttons retain their outputs and parent-controlled item state.
- Stack fluid footer actions so translated labels fit the narrow cart column without custom button styling.
- Intentionally lock removal during submission as well as clear/submit, avoiding edits to a pending snapshot.
  Native disabled inputs and handler guards enforce the same rule; all actions restore afterwards.
- Remove obsolete decorative event-icon logic, Badge/Spinner imports, numbered palette pairs, nested custom
  surfaces, minimum height, oversized empty icon and redundant TODO comments.
- Final empty feedback is two semantic paragraphs, not a custom visual Message wrapper.
  An intermediate native info Message failed dark normal-text contrast at 4.32:1 and was removed.
  Native Card plus semantic text meets the simple empty-copy requirement without a theme override.
- Static `class`/`styleClass` attribute tokens: **90 -> 42**, plus **two** Card root pass-through tokens.
  Counts exclude dynamic class-expression strings on both sides; the removed icon had additional dynamic classes.
- No new SCSS, inline CSS, dependency, service, backend, translation or shared-theme changes.

### Automated validation

All seven changed files are formatted with `npx prettier --write` and their explicit paths before validation.

```shell
npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static
git --no-pager diff --check
```

- Pass: lint, **11 suites / 126 tests**, production library build and ten prerequisite tasks.
- Eight new cart cases verify named native Card, translated empty copy, singular/plural counts, ordered
  items, game codes, partner indication, private-data omission, named native actions, exact outputs,
  parent-controlled updates and submission locking/restoration.
- The existing parent success/error regression now clicks the actual submit Button with a mock Subject.
  It verifies one service submission, disabled actions while pending, no removal/clear during submission,
  success/error notifications and restored actions after both responses. No real service mutation runs.
- Final lint/test/build is rerun after replacing the experimental empty Message with semantic paragraphs.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all **34 projects**,
  with existing warnings and zero errors. Only documentation changes follow the focused 126-test/build pass.

### Browser evidence

- Existing integrated browser, actual mounted enrollment route and public data establish the consumer.
  No preview, new route or synthetic consumer is added. Real authenticated cart operations are not performed.
- Four baseline light/dark 390/1440px local fixture cases: no native Card, three items, literal English remove
  names, no document overflow but long unbroken names overflow their row. Baseline screenshot inspected.
- Final **72** local fixture cases: English/French/Dutch x light/dark x 360/390/768/1440px x
  loaded/submitting/empty. All preserve content counts, translated copy and fitting Card/headings/action labels.
  No document overflow; three item rows/five actions when populated, no rows/actions when empty;
  all actions disabled while submitting. Long spaced/unbroken names and partner indication are included.
- Native icon-only Buttons report a two-pixel client/scroll metric difference from native borders,
  not overflowing labels or Cards. Their glyphs remain visibly contained; no local styling override is added.
- Four final light/dark 390/1440px keyboard cases: Space/Enter remove the expected IDs once, Tab reaches
  clear then submit, Shift+Tab reverses correctly and native solid focus-visible outline exists.
- Four matching pointer cases emit exactly one remove/clear/submit output each. Actual visible disabled
  targets are clicked with the mouse and emit nothing; loading and `aria-busy` remain explicit.
- Parent handlers are replaced with local output collectors and GraphQL mutations are blocked.
  Final monitored keyboard/pointer checks record **zero page errors and zero mutation attempts**.
- Mounted locale switching uses existing translations only, restoring Dutch afterwards.
  Dutch server-rendered heading and both empty paragraphs exactly match client text.
  This is scoped copy evidence, not proof of exhaustive hydration or authenticated state restoration.
- Final light narrow empty/populated and dark wide populated screenshots are inspected.
  Screenshots use only safe local fixtures; persistent handoff relies on these metrics and committed tests,
  not session-only image paths.

### Contrast and deferred discovery

- Settled colors are converted to sRGB; alpha backgrounds are composited over actual Card ancestors.
  Semantic title/name/summary/empty text: **19.87:1 light / 16.00:1 dark**.
  Metadata/subtitle/empty description: **4.87:1 / 6.65:1**.
- Native danger remove icon normal/hover: **3.76/3.44:1 light**, **6.91/6.62:1 dark**, passing non-text.
  Remove focus against the Card: **3.76:1 / 6.91:1**.
- Native secondary Clear text normal/hover: **4.87/4.66:1 light**, **6.65/6.28:1 dark**.
  Its outline border fails at **1.23:1 / 1.40:1**; dark focus fails at **1.40:1**
  (light focus passes at **8.46:1**). Shared DR-032 remains open.
- Existing success-severity Submit text normal/hover fails light at **2.28/3.30:1**;
  dark passes at **8.55/10.62:1**. Submit focus fails light at **2.28:1** and passes dark at **10.97:1**.
  Shared DR-033 retains these native success Button cases; no page/shared palette override is introduced.
- New DR-047 records the pre-existing desktop sticky sidebar/header overlap on this route:
  the unchanged `xl:sticky xl:top-6` wrapper pins the Card at 21px while the fixed app banner ends at 57px.
  After scrolling, the cart heading spans 39.5-64px and is partly obscured by the banner.
  The baseline screenshot also shows this overlap. Page chrome is excluded from DR-021d.
  The final unobscured screenshot is captured at the grid's natural position, not evidence that DR-047 is fixed.

### Review and next action

- Exceptions: none. Shared contrast failures and the inherited sticky overlap are not claimed as passed.
- Screen-reader, exhaustive hydration/contrast and actual authenticated cart/partner/submission/outage operations
  remain unverified. Local fixtures do not establish live eligibility or service behavior.
- On 2026-11-04 the user selected **"Approve DR-021d and commit with disclosed limits"** and **"Nothing else"**.
  Approval includes the removal/submission lock, shared DR-032/033 contrast limits, inherited DR-047 overlap
  and unperformed screen-reader, exhaustive hydration/contrast and actual authenticated workflows.
  Acceptance does not claim failed/unperformed checks passed; those criteria stay unchecked.
- Approval authorizes only this slice, its tests and repository handoff. No push or additional implementation
  slice is requested. The backlog marks DR-021d Done by explicit approval with the recorded limits.
- DR-021 remains open. Exact next action in a fresh invocation: confirm the mounted consumer and scope
  DR-021e partner-selection dialog. Do not start it here.
