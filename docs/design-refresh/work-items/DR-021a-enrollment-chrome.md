---
title: 'DR-021a: General enrollment chrome'
description: 'Compact enrollment page heading, native content surface and explicit loading/empty presentation.'
---

## Identity

- ID: DR-021a. Parent: [DR-021](DR-021-tournament-enrollment.md). Prerequisite: DR-020 Done.
- Status: [backlog](../backlog.md), not duplicated here.
- Design rules: [plan](../README.md).
- Confirmed consumer on 2026-11-02: `/tournament/8658b541-702a-408e-8114-2858a9428069/enroll`.
  Browser mounts the existing route with 30 public sub-events; no consumer added.

## Scope

- Project: `frontend-pages-tournament`.
- [Page template](../../../libs/frontend/pages/tournament/src/pages/general-enrollment/page-general-enrollment.component.html)
  and its [component](../../../libs/frontend/pages/tournament/src/pages/general-enrollment/page-general-enrollment.component.ts).
- Compact semantic heading, subtitle, Back button, native filter Card, available-event heading/count,
  outer responsive grid, named loading indicator and native no-results Message.
- Preserve route, breadcrumb, translations, child bindings/outputs, cart and service behavior.
- Exclude filter fields/rankings, event tiles, cart internals, partner dialog, sub-event enrollment,
  my-enrollments, shared components/theme, backend and translations.

## Baseline and approach

- Existing page has 90 authored static class tokens, oversized heading, eyebrow subtitle, untranslated
  decorative `Events` eyebrow, hand-styled filters/empty surfaces and arbitrary 380px sidebar.
- Browser baseline: light/dark at 390/1440px; heading sizes 26.25/31.5px, 30 events, empty safe cart,
  no document horizontal overflow (scroll widths 375/1425px).
- Browser intercepts provide `me: null`, `enrollmentSession: null`, and empty user enrollments.
  Public event reads remain real; mutations are blocked. No user cart or operational data is needed.
- Use native Card, Message, named ProgressSpinner and directive Button. Keep existing smart page/child split.
  No new abstraction, SCSS, palette utilities, inline styles, `[pt]` or `[dt]`.
- Retain layout utilities only where needed; existing child-specific styling is not evidence this slice migrates it.

## Implementation checklist

- [x] Confirm a mounted consumer, prerequisites and bounded scope.
- [x] Preserve behavior and translations while simplifying the page presentation.
- [x] Use native PrimeNG capabilities and remove only in-scope obsolete markup.
- [x] Keep shared components, child internals and global settings unchanged.
- [x] Record unrelated discoveries and child scope in the parent brief.

## Acceptance and verification

- [x] Heading/subtitle and Back remain localized, readable and keyboard accessible.
- [x] Native filter Card, named progressbar and native no-results Message render correctly.
- [x] Outer grid preserves event/cart order and fits narrow/wide in light/dark.
- [x] Class usage comparison and absence of new styling workarounds are verified.
- [x] Loading, no-results and loaded states are verified using safe local fixtures.
- [x] Existing child inputs/outputs, navigation and submit feedback regressions pass without real mutations.
- [ ] Scoped keyboard/focus, labels and contrast checks pass.
- [x] Relevant Nx lint/build/test tasks pass.
- [ ] Localization and relevant SSR/hydration checks pass.
- [x] User visual review passes, or explicit approval records disclosed limits.

## Evidence and handoff

### Implementation and reuse

- One existing smart page retained with its meaningful presentational children. No styling-only component extracted.
- Native Card replaces the custom filter surface; native info Message replaces decorative no-results markup.
- Subtitle is ordinary paragraph content below the compact heading; decorative untranslated `Events` eyebrow removed.
- Event count remains in the accessible heading. Back uses native directive Button with native icon/label.
- Named ProgressSpinner and busy container retain loading text and hide the loaded content.
- Outer layout stacks below `xl`; at `xl` events span two of three tracks and the cart becomes sticky.
  This intentionally delays the sidebar until there is space without an arbitrary fixed-width track.
- Static authored class tokens: **90 -> 45**. No palette utilities, SCSS, inline styles or `[pt]`/`[dt]` added.
  Existing excluded children still have legacy styling; this is not a claim they were refreshed.

### Automated validation

Formatted all six changed files with `npx prettier --write` and their explicit paths.

```shell
npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static
git --no-pager diff --check
```

- Pass: lint (zero errors), all seven test suites / **93 tests**, production library build and ten prerequisites.
- Six new mock-only regressions cover localized chrome/route initialization, Back target, named loading,
  no-results feedback, child inputs/outputs and submission busy/success/error feedback.
- No dependencies or tooling added. No actual mutations used for tests.
- Whitespace check passes. Git emits existing LF-to-CRLF configuration warnings; edited files use LF.

### Browser evidence

Port 3000 serves final source. No temporary server or backend/translation restart was needed.
Before evidence is recorded above; after checks use the same mounted route and safe read intercepts.

- Pass: eight loaded cases, light/dark at **360/390/768/1440px**, with 30 events and safe empty cart.
  Document, heading, Back, event region and cart fit; DOM/event/cart order remains intact.
  At 1440px the three outer tracks measure approximately 412.66px each; lower sampled widths stack.
- Pass: eight settled no-results/loading cases at the same widths/themes.
  Local filter `eventType: ['NATIONAL']` produces zero events and native translated info Message;
  filters/cart remain mounted. Local loading signal produces the named progressbar
  `Beschikbare evenementen laden...`, busy state and no child content.
  An initial synchronous sample saw deferred removal; checks were repeated after DOM detachment, all passing.
- Pass: four light/dark 390/1440px keyboard cases. Tab moves from Back to the existing first filter;
  Shift+Tab returns, with `:focus-visible` and a solid 1px native outline.
  Enter activates Back to the exact original tournament detail route; browser Back returns to 30 events.
- Pass: Dutch HTTP SSR heading/subtitle match mounted client content. English chrome is covered by unit tests.
  No monitored page errors or GraphQL mutation requests during fixture, keyboard and navigation checks.
- Browser inspection confirms native surfaces and compact hierarchy. User visual review is still required.
- Final reload confirms final source with 30 events and zero monitored errors/mutations.
  Local fixtures reset; test interception/listeners removed and browser restored to the supplied tournament detail.

### Contrast and limits

Measurements use browser canvas sRGB and composited ancestor backgrounds, with theme transitions settled.

- Initial light subtitle/count at 4.46:1 failed the 4.5:1 normal-text threshold.
  Changed these and loading text to semantic normal text, not a local palette override.
- Final heading/subtitle/count/loading text: **18.20:1 light / 16.64:1 dark**, passing.
- Native no-results info Message: **4.75:1 / 4.57:1**, passing.
- Native Back text fails in light mode: sampled **4.15:1** after navigation, **4.41:1** in earlier
  unfocused sampling; dark samples **6.33:1 / 6.89:1** pass.
  Keep shared DR-032 open; no page override or styling exception introduced.
- Actual screen-reader, exhaustive control/focus contrast and hydration, mounted English/French,
  real authenticated cart/enrollment operations, backend outages and operational retries remain unverified.
  Excluded child accessibility, eligibility, partner and cart internals are not newly claimed as verified.
- Read-error presentation and untranslated breadcrumb context remain parent follow-ups, not hidden scope expansion.

### Approval and next action

On 2026-11-02 the user selected **"Approve DR-021a and commit with disclosed limits"** and **"Nothing else"**.
This explicitly accepts completion with the native light Back contrast failure, actual screen-reader,
exhaustive control/focus contrast and hydration, mounted English/French, real authenticated enrollment/cart
operations and outage/retry checks still unverified. The unchecked criteria above stay unchecked.
Approval is not evidence that these checks passed.

Only this slice, its tests and repository handoff are approved for commit; no push.
Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
with existing warnings and zero errors. Commit only the approved scope.
DR-021 stays open; next invocation should confirm and scope DR-021b filters/rankings on the existing
general enrollment route. Do not start DR-021b in this invocation.
