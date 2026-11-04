---
title: 'DR-021c: General enrollment selection tiles'
description: 'Native event Cards and accessible explicit enrollment selection actions.'
---

## Identity and scope

- ID: DR-021c. Parent: [DR-021](DR-021-tournament-enrollment.md).
- Prerequisite: DR-021a Done with disclosed limits. Status: [backlog](../backlog.md).
- Design rules: [plan](../README.md). Project: `frontend-pages-tournament`.
- Confirmed mounted consumer on 2026-11-04:
  `/tournament/8658b541-702a-408e-8114-2858a9428069/enroll`, with 30 public events.
- Existing [grid component](../../../libs/frontend/pages/tournament/src/pages/general-enrollment/components/sub-event-selection-grid/sub-event-selection-grid.component.ts)
  and [template](../../../libs/frontend/pages/tournament/src/pages/general-enrollment/components/sub-event-selection-grid/sub-event-selection-grid.component.html).
- Preserve event order, metadata, eligibility, capacity/waiting-list states, selected IDs and output payloads.
- Exclude filters/rankings, cart, partner dialog, services, other routes, shared theme, backend and translations.

## Baseline and approach

- Four mounted light/dark 390/1440px cases: 30 tiles, no document overflow, no native Cards.
- All 30 outer clickable divs lack keyboard semantics. Event names truncate; decorative icons, shadows,
  paired primary/orange/blue palettes and custom borders build the tile appearance.
- Use native Card title/subtitle/content/footer, semantic headings and capacity Tags.
- Use one explicit native Button per event for selection/removal, rather than a second inaccessible
  whole-card click target. Preserve the native action and parent outputs; this intentionally removes
  click-anywhere selection in favor of a predictable keyboard/pointer target.
- Keep the meaningful existing smart-page/presentational-grid split. Only one application consumer exists;
  no new wrapper or shared component is justified.
- Missing baseline `all.enrollment.alreadyEnrolled` translation and literal `Any` fallback require
  separate localization follow-up; do not claim these pre-existing cases are localized.

## Implementation checklist

- [x] Confirm mounted consumer, dependency and bounded scope.
- [x] Simplify the existing presentational grid with native components.
- [x] Preserve selection outputs, capacity and eligibility with mock-only regressions.
- [x] Keep excluded consumers and shared settings unchanged.
- [x] Record discoveries and persistent handoff.

## Acceptance and verification

- [x] Native Cards, Tags and Buttons replace custom tile decoration.
- [x] Names wrap and each action has event-specific accessible context.
- [x] Light/dark 360/390/768/1440px layouts fit.
- [x] Keyboard selection/removal, focus-visible state and disabled actions work.
- [ ] Scoped text, focus and control contrast pass.
- [x] Capacity, waiting-list, selected and ineligible states remain explicit.
- [x] No new palette classes, SCSS, inline styles, dependencies or shared changes.
- [x] Record before/after authored class-token comparison.
- [x] Relevant Nx lint/test/build pass.
- [ ] Localization and relevant SSR/hydration checks pass.
- [x] User visual review or explicit approval with disclosed limits.

## Evidence and handoff

- Initial worktree is clean.
- Baseline browser uses the existing port 3000 service. Client read interception returns no ranking,
  enrollments or cart and blocks GraphQL mutations. No operational action is performed.
- Standard Playwright MCP browser is busy in another session; integrated browser is available instead.

### Implementation and reuse

- Keep the existing smart page and presentational grid. No new component, shared wrapper or consumer.
- Native Card title/subtitle/content/footer replace custom decorative panels, headers and footers.
  Semantic `h3` titles wrap, including long unbroken names. Card root pass-through adds only
  `h-full border border-surface`, following the agreed semantic bordered content-surface direction.
- One/two-column layout keeps labels readable within the page's two-thirds event column;
  the old third column at desktop made Dutch actions unnecessarily cramped.
- Native secondary outlined Add and filled Remove actions communicate selection through existing translated
  labels and plus/minus icons. Disabled danger actions retain the eligibility/already-enrolled branch.
  `aria-labelledby` combines visible action copy with the corresponding event heading.
- Whole-card clicking is deliberately removed, not silently treated as preserved behavior.
  The explicit native Button supports pointer, Enter and Space without duplicate emissions.
  `toggleSelection` also guards ineligible input; parent-controlled IDs and event output contracts are unchanged.
- Remove redundant literal-English warning Chips, decorative icons, custom opacity/shadows/borders and
  palette-class pairs. The native disabled action retains the status; its pre-existing missing
  already-enrolled translation remains visible and is recorded as DR-046, not claimed fixed.
- Static `class`/`styleClass` attribute tokens: **91 -> 29**, plus **three** Card root pass-through
  tokens. This deliberately excludes dynamic class-expression strings from both counts;
  the removed template contained additional conditional palette/decorative expressions.
- No new SCSS, inline CSS, dependency, shared/theme, service, backend or translation changes.

### Automated validation

All six changed files are formatted with `npx prettier --write` and their explicit paths before validation.

```shell
npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static
git --no-pager diff --check
```

- Pass: lint, **10 suites / 118 tests**, production library build and ten prerequisite tasks.
- Twelve new mock-only cases cover ordered Cards, semantic wrapping titles, associated action names,
  explicit Button-only selection, one emitted base event without calculated fields, one removal,
  parent-controlled selection, both disabled branches, six capacity/waiting-list combinations and empty/unknown levels.
- Existing real-service filter/grid integration regressions also pass; no service predicate or parent handler changes.
- The final check is rerun after the native secondary severity and Card root/layout refinements.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all **34 projects**,
  with existing warnings and zero errors. Only documentation changes follow the focused 118-test/build pass.

### Browser evidence

- Actual mounted baseline: light/dark 390/1440px, 30 events, no overflow, zero native Cards and
  30 non-keyboard outer clickable divs. Before/after public-grid screenshots were inspected.
- Final browser uses safe local parent/grid fixtures and replaced output handlers; no actual cart action,
  partner dialog, enrollment or admin operation is performed. Fixtures are not evidence of live service eligibility.
- Eight light/dark 360/390/768/1440px cases: nine native Cards, one/two columns, zero document/card/heading
  overflow, including a long unbroken name. Three disabled branches stay disabled.
  Cases include selected, unlimited, low capacity, full, waiting-list, ineligible and already-enrolled events.
- Four light/dark 390/1440px keyboard cases: Space selects once, Enter removes once, Tab follows event order
  and skips disabled actions, Shift+Tab reverses correctly. Native focus-visible is present.
  Corresponding pointer Add/Remove checks emit exactly once each with no calculated fields.
- Four further 390/1440px cases scroll each of three disabled actions fully into view before an actual
  pointer click: zero outputs. These are visible-target checks, not off-screen clicks.
- Scoped settled normal text minimum: **4.52:1 light / 6.65:1 dark**.
  Hover minimum: **4.52:1 / 6.28:1**. Native Tags, metadata, headings and enabled labels are sampled.
- Initial native primary outlined Add text failed at **3.65:1 light**. Switching to the documented
  secondary severity resolves the text failure without a theme or label-color override.
- Native secondary outline boundary fails **1.23:1 light / 1.40:1 dark** against its content surface.
  Sampled 1px native focus outline passes light at **8.46:1** but fails dark at **1.40:1**.
  Keep DR-032 open; the scoped contrast criterion remains unchecked. Disabled controls are not claimed
  as passing active-control contrast.
- Same-origin HTTP SSR returns **200**, with **30 native Cards / 30 Buttons** and event titles matching
  the loaded Dutch client before local fixtures. This is a narrow SSR/content check, not exhaustive hydration proof.
- Monitored final matrices and reload have **zero page errors and zero GraphQL mutation attempts**.
- Final cleanup removes fixtures, output replacements and read/mutation interception; a reload restores
  30 public Cards on the existing server. The unauthenticated ranking read again logs the baseline
  `Forbidden resource` console error; that is not a new tile error or a verified authenticated workflow.
- Browser harness limitations: standard MCP profile is busy; use integrated browser. A first local fixture
  attempt ran before hydration; wait for Angular's mounted component before applying fixtures.
  Integrated `page.request.get` lacks `Storage.getCookies`; same-origin browser `fetch` provides SSR evidence.
  A harness-only `Response.status()` typo was corrected to `Response.status`; neither is an application failure.

### Review limits and exact next action

- On 2026-11-04 the user selected "Approve DR-021c and commit with disclosed limits" and "Nothing else".
  Approval includes the deliberate explicit Button-only selection change and authorizes only this slice,
  its tests and repository handoff for commit, without pushing.
- DR-046: baseline missing `all.enrollment.alreadyEnrolled` renders a key; partial level bounds still render
  literal `Any`. Unit fixtures supply English text and do not prove production translations exist.
  Both are separately scoped localization work, not new translated-copy claims.
- Not run: actual screen-reader, mounted English/French, exhaustive focus/control contrast/hydration,
  authenticated cart persistence, real partner-dialog/submission workflows and network outages.
  Loading/read-error UI belongs to the unchanged parent and is not validated by these local tile fixtures.
- Exceptions: none. Native shared contrast failures are retained in DR-032, not overridden here.
- Approval accepts the recorded limits; it does not turn failed or unperformed verification into passes.
  Contrast and localization/SSR-hydration criteria remain unchecked.
- Exact next action in a fresh invocation: confirm and scope DR-021d general enrollment cart;
  do not start it in this invocation.
  DR-021 remains open, as does DR-021h ranking polish.
