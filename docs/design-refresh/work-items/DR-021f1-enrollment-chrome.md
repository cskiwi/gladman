---
title: 'DR-021f1: Withdrawn sub-event enrollment chrome'
description: 'Historical evidence for an unapproved slice withdrawn with obsolete page retirement.'
---

## Withdrawal

On 2026-11-07 the user clarified that general enrollment is the only enrollment page and authorized removal
of the incomplete sub-event/my-enrollments pages. DR-021f1 is withdrawn, not an approved design migration.
Its component/template and newly added tests are removed; none of the styling is retained or committed.
The Done backlog row means withdrawn with retirement, not that unchecked acceptance criteria passed.
Evidence below describes pre-retirement investigation only, not current mounted behavior.
See [DR-021f retirement](DR-021f-sub-event-enrollment.md) for authoritative scope, validation and next action.

## Historical identity and scope

- ID: DR-021f1. Parent: [DR-021f](DR-021f-sub-event-enrollment.md).
- Prerequisite: DR-021e Done. Status: [backlog](../backlog.md). Design rules: [plan](../README.md).
- Confirmed mounted route and real navigation consumer: see the parent brief.
- Project: `frontend-pages-tournament`. The former template/component are now removed.
- Scope: compact heading/sub-event subtitle, Back, closed/full banners, outer columns, loading and read-error feedback.
- Preserve breadcrumb, route parameters, flags, service and all child form/list/dialog behavior.
- Exclude player/status/info Card internals, tables, guest entry/dialog, services, backend, translations and shared theme.

## Baseline and approach

- Public route loads MS 1-2, phase DRAFT, no read error and zero confirmed entries.
- Four light/dark 390/1440px baseline samples: heading 26.25/31.5px; closed native Message has no text.
  The legacy content template does not render. Dark 390px recorded document width 424px; scope checks must
  distinguish inherited shared/child overflow from the page's outer layout.
- Replace oversized heading/eyebrow with semantic compact identity matching DR-021a.
- Use native Message content/icon and named ProgressSpinner instead of fixed-width skeleton placeholders.
- Branch on read errors before reading the resource value; preserve explicit service error text.
- Add a native small secondary Back action with the exact tournament route.
- Keep direct PrimeNG and the smart page. No reusable presentation is shared by this chrome alone.
- Retain the existing form stylesheet: its consumers are excluded. No new CSS, `[pt]` or `[dt]`.

## Implementation checklist

- [x] Confirm mounted consumer, dependency and one bounded child.
- [x] Preserve data, routes, flags and excluded workflow bindings.
- [x] Use native feedback and necessary layout utilities only.
- [x] Keep shared settings, services and excluded internals unchanged.
- [x] Record discoveries and exact validation results.

## Acceptance and verification

- [x] Compact heading/subtitle and Back render localized text and preserve the tournament target.
- [x] Closed banner shows existing translated text; closed/full banners preserve flags and native severity.
- [ ] Full/waiting-list feedback is localized in all supported languages.
- [x] Loading has a named progressbar and busy state; errors render without evaluating a failed resource value.
- [x] Outer columns and scoped chrome fit light/dark narrow/wide layouts.
- [x] Keyboard Back has a name, receives/reverses focus and activates the exact tournament destination.
- [ ] Scoped feedback/Button contrast and exhaustive focus/screen-reader checks pass.
- [x] Loaded/loading/error/full fixtures preserve content visibility and excluded workflow bindings.
- [x] Relevant Nx lint/test/build pass; no mutation is sent during validation.
- [x] Dutch public SSR/client heading and closed text agree.
- [ ] Localization and relevant SSR/hydration checks pass.
- [x] No authored palette colors, CSS or styling wrappers added; utility comparison recorded.
- [ ] User review or explicit approval with disclosed limits recorded.

## Evidence and handoff

### Implementation and reuse

- Compact semantic heading and normal sub-event subtitle replace oversized typography and the eyebrow.
  Native directive Button supplies Back; route parameters and breadcrumb stay unchanged.
- Native Message content/icon fixes empty legacy closed/full banners. Existing full/waiting-list key is missing
  from all three dictionaries; retain it without inventing English fallback copy. New DR-049 tracks this.
- Loading uses a named native progressbar and busy container. Error text is rendered in a native error Message
  before the failed resource value can be read; no service/error-shaping change is included.
- Existing three-track desktop layout remains, with minimum-width guards and top alignment.
  One wrapper groups banners and columns with native spacing; no component abstraction was extracted.
- Static authored class tokens: scoped chrome/layout/loading/error **57 -> 35**; whole template **171 -> 149**.
  Count includes both outer column classes and excludes Card/list/dialog internals from the scoped figure.
- Existing form SCSS, legacy palette classes and guest inline sizing remain in excluded children.
  They are not new exceptions or evidence this slice refreshes those children.
- Formatter reindents the existing template and wraps one unchanged guest-service call.
  Whitespace-insensitive review confirms no excluded binding/handler changes.

### Automated validation

Formatted all seven changed files using `npx prettier --write` with explicit paths.

```shell
npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static
git --no-pager diff --check
```

- Pass: focused lint, **13 suites / 150 tests**, production library build and ten prerequisite tasks.
- Nine new mock-only tests cover identity/route initialization, Back, closed/full flags, loading,
  failed-resource guarding/recovery, login navigation, player values/delegation and guest dialog opening.
- Initial run: one assertion incorrectly expected an anchor from the existing PrimeNG login Button;
  corrected the test to click the native Button and assert its Router destination. Final complete rerun passes.
- No dependencies, backend/translation changes or real mutations. Whitespace check passes.
- Temporary `npx nx run app:serve` preview also compiles browser/server development bundles successfully.
  The previously supplied port 3000 stopped listening during validation; port 5000 stayed available.

### Browser and SSR evidence

- Pass: public MS 1-2 route returns HTTP **200**; mounted heading/subtitle/closed text are
  `Toernooi Inschrijving`, `MS 1-2`, `Inschrijving Gesloten`.
- Pass: **32 settled Dutch fixtures**: light/dark, **360/390/768/1440px**, loaded/full/loading/error.
  Long safe event name wraps; heading, Back, messages, busy region and both outer columns fit.
  Document widths match viewport widths. Columns stack below desktop; 1440px tracks are about 412.66px each.
- Loading has no loaded Cards, heading or messages after settlement. Read-error fixture deliberately throws
  if the resource value is accessed; native exact `Safe read failure` renders without a page error.
  Full fixture shows the inherited missing key, not translated copy; localization is not passed.
- Initial 120ms samples caught deferred Message destruction; repeated checks wait for exact branch text,
  count and content detachment. Only the settled results above are accepted as evidence.
- Pass: **four keyboard cases**, light/dark at 390/1440px. Tab then Shift+Tab returns to Back;
  it matches `:focus-visible`; Enter navigates to the exact tournament detail route.
  Initial focus/navigation attempt ran before client settlement and timed out; final repeated checks wait for
  initialized component/loaded native text. This is not exhaustive hydration or focus-contrast validation.
- Pass: Dutch HTTP SSR heading and closed text agree with the loaded client.
  Source checks confirm existing title/closed/loading/Back strings in English, French and Dutch.
  English mock regressions pass; mounted English/French and exhaustive hydration remain unverified.
- Browser screenshots inspected: light 390px and dark 1440px public empty-entry views.
  Compact identity, visible closed feedback and stacked/wide surfaces are readable.
  Existing untranslated Card/list labels remain excluded; numeric/layout evidence is retained here,
  not only in session screenshots.
- Final monitored fixture, navigation and screenshot checks: **zero page errors and mutation attempts**.
  Local fixtures were restored; temporary interception/listeners and preview are cleaned up before handoff.

### Contrast, limits and next action

- Sampled semantic heading/subtitle text passes: **18.20:1 light / 16.64:1 dark**.
- Native Back text: **4.46:1 light** fails normal-text 4.5:1; dark **6.91:1** passes. Retain shared DR-032.
- Native closed warning text: **2.83:1 light** fails; dark **7.98:1** passes.
  Error text: **4.41:1 light** fails; dark **4.63:1** passes.
  Full info text: **4.75:1 light / 4.57:1 dark** passes sampled contrast but fails localization.
  Measurements composite rendered native colors/backgrounds; retain shared DR-034, without page overrides.
- Screen-reader, exhaustive contrast/focus/hydration, actual outages, authenticated enrollment/cancellation
  and guest submission remain unverified. Mock delegation is not live workflow validation.
- Exceptions: none. No styling overrides, new dependencies, backend or shared-theme changes.
- Superseded next action: do not seek styling approval or start DR-021f2-f4.
  DR-021f retirement replaces this unapproved implementation. DR-049 is withdrawn for the removed consumer;
  shared contrast audits remain open for their surviving consumers.
