---
title: 'DR-015d: Competition sub-event metadata'
description: 'Native PrimeNG Tags for metadata on mounted competition detail Cards.'
---

## Identity

- ID: DR-015d; parent DR-015. Authoritative status: [backlog](../backlog.md).
- Dependencies: completed DR-015a, DR-015b, and DR-015c.
- Design rules: [design refresh](../README.md).
- Mounted consumer: `/competition/pbo-competitie-2026-2027`, confirmed on 2026-10-23 with 12 Cards.
- Nx project: `frontend-pages-competition`; consuming application: `app`.
- Sources: [template][template], [tests][tests], [feature routes][routes].

## Scope

- Replace only the sub-event metadata chips: maximum level, index range, and event type.
- Preserve displayed values, ordering, existing truthy conditionals (including zero suppression),
  the translated maximum-level label, and the index separator only when both bounds are truthy.
- Exclude hero, headings, draw links/empty state, sync controls, permissions, loading/error logic,
  translations, services, shared components, global styling, and other routes.
- No dependencies, data mutations, or new abstractions.

## Baseline and proposed approach

- Live data has three metadata chips in each of 12 Cards, with both index bounds populated.
- Existing spans each use six appearance utilities for typography, text/background color, padding, and rounding.
  The row has five layout/typography utilities.
- Use native secondary Tags with existing TagModule and projected text for the conditional index range.
  Keep only row layout utilities. Do not add CSS or change global tokens.
- PrimeNG Tag documentation confirms `severity="secondary"`, `value`, and projected content support.
- Local before evidence: `tmp/design-refresh/DR-015d-before-{light,dark}-{390,1280}.png`.
  Metadata text and ordered destinations are saved temporarily in browser session storage for comparison.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, baseline, and bounded scope.
- [x] Preserve data, conditionals, translations, and interactions.
- [x] Use native PrimeNG presentation without new styles or shared changes.
- [x] Add focused metadata regression tests.
- [x] Record validation, evidence, review limits, and follow-up work.

## Acceptance and verification

- [x] Native secondary Tags replace all three custom chip variants.
- [x] Populated, one-sided, absent, and zero-valued metadata retain existing visibility and text (component tests).
- [x] Existing maximum-level translation updates when the locale changes (component test).
- [x] All 12 live Cards retain ordered metadata and draw destinations.
- [x] Light/dark at 390px/1280px: metadata fits Cards without document overflow; text contrast passes.
- [x] Tags remain static text; existing keyboard navigation/focus is preserved.
- [x] No new SCSS, inline styles, authored colors, dependencies, or global/shared changes.
- [x] Relevant Nx test/lint/build tasks pass.
- [x] SSR markup is checked; hydration and locale coverage are described accurately.
- [ ] Mounted alternate locale, live absent/zero metadata, exhaustive hydration, and screen-reader output.
- [x] User approved completion and the scoped commit on 2026-10-23 with disclosed verification limits.

## Evidence and handoff

- Three native secondary Tag variants use existing TagModule; maximum level/type use `value`, while
  conditional index text projects a single span. No TypeScript application logic changed.
- Per-chip authored utility tokens drop from six to zero; the metadata row drops from five to four
  necessary flex/wrapping/alignment/spacing utilities. Native Tag styling supplies typography and appearance.
  Projected index text is grouped in one span rather than split across anonymous flex items.
- Eight added cases bring the component suite to 19 passing tests. Coverage includes populated ordering,
  native static semantics, locale updates, both one-sided bounds, zero lower/upper bounds, all zeros,
  null and undefined metadata, and retained draw destinations. Sync children remain stubs and no mutation runs.
- Commands:

  ```powershell
  npm exec -- prettier --write "libs\frontend\pages\competition\src\pages\detail\page-detail.component.html" `
    "libs\frontend\pages\competition\src\pages\detail\page-detail.component.spec.ts"
  $env:NX_DAEMON='false'
  npm exec -- nx run-many -t test,lint -p frontend-pages-competition --output-style=static
  npm exec -- nx run app:build --output-style=static
  git diff --check
  ```

- Results on 2026-10-23: 19/19 tests pass; lint passes with 41 existing warnings; app build and all 29
  prerequisites pass. Existing Nx executor deprecation and TypeScript decorator-metadata advisories remain.
  Whitespace check passes; Git reports existing checkout line-ending conversion warnings.
- Browser comparison: all 12 normalized metadata rows and all 52 ordered internal/external draw destinations
  equal their pre-edit values. There are 36 native secondary Tags, with zero interactive descendants/tabindex.
- Four-case geometry: light/dark at 390px/1280px has no document overflow, Tags outside Cards, or Tag text
  scroll overflow. First metadata row is 22px high in all cases, within 310px/359px available width.
- Rendered sRGB contrast uses Canvas conversion of computed colors and composited ancestor backgrounds:
  minimum 7.74:1 light and 9.50:1 dark across all 36 Tags.
- All four final screenshots inspected:
  `tmp/design-refresh/DR-015d-after-{light,dark}-{390,1280}.png`.
  Corresponding `before` images were captured locally. Images are local evidence only, not staged/committed.
- Keyboard: Tab from the final group shortcut reaches the existing first sync button with visible native
  1px focus outline in all four cases; it was not activated. At desktop in each theme, Tab from the first
  internal draw link reaches its named external companion with visible native focus; Shift+Tab returns.
  No operational/admin action or external navigation was performed.
- Same-origin server HTML fetch returns HTTP 200, 12 Cards and 36 metadata Tags with all normalized metadata
  equal to baseline. This establishes SSR markup only, not exhaustive hydration.
- The mounted route uses Dutch copy; an actual alternate-locale browser switch was not run. Live data has
  both index bounds and maximum levels, so absent/zero/one-sided variants have component-test coverage only.
  Screen-reader output and operational sync workflows were not tested.
- Original dark theme and 1251x1221 viewport restored; temporary comparison session storage removed.
- Reusable pattern: static categorical/constraint metadata uses native secondary Tags without custom chip classes.
- Exceptions: none. No dependencies, shared/global styling, services, or translation files changed.
- Parent DR-015 remains open. No unrelated discovery or new implementation slice was started.
- User approval on 2026-10-23: "Approve completion and commit", with "Nothing else" requested.
  Accepted limits: mounted alternate locale, live absent/zero metadata, exhaustive hydration, screen-reader
  output, and operational sync actions were not verified. Unchecked criteria remain unverified; approval
  does not claim that these checks passed. The implementation/tests/handoff commit is authorized, not a push.
- Exact next action: inspect and scope remaining competition hero external-link/action presentation as
  the next DR-015 candidate, confirming mounted consumers and preserving behavior. Do not start it here.

[template]: ../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.html
[tests]: ../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.spec.ts
[routes]: ../../../libs/frontend/pages/competition/src/lib.routes.ts
