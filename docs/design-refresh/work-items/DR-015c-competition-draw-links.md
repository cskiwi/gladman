---
title: 'DR-015c: Competition draw links'
description: 'Native link buttons and readable draw metadata within mounted competition detail Cards.'
---

## Identity

- ID: DR-015c; parent DR-015. Status is authoritative in the [backlog](../backlog.md).
- Dependencies: completed DR-015a Cards and DR-015b navigation/local-style retirement.
- Design rules: [design refresh](../README.md).
- Mounted consumer: `/competition/pbo-competitie-2026-2027`, inspected on 2026-10-23.
- Project: `frontend-pages-competition`; consuming application: `app`.
- Sources: [template][template], [tests][tests], and [mounted feature routes][routes].

## Scope

- Refresh only internal draw links, associated external links, and the no-draws presentation inside event Cards.
- Preserve draw ordering, all destinations, type/size metadata, missing-name fallback, and translated empty copy.
- Use native anchor semantics with PrimeNG Button styling; do not make navigation into button-only handlers.
- Keep long names readable and give icon-only external links a draw-specific accessible name.
- Exclude hero, metadata chips, group navigation, Cards, sync controls, permissions, loading/error logic,
  translations, services, shared components, global styles, and all other routes.
- No dependencies or operational mutations.

## Baseline and proposed approach

- Live route has three groups, 12 Cards, 26 internal links, and 26 external draw companions.
- Current draw anchors manually recreate borders, backgrounds, padding, rounded corners, hover, and typography.
  Each internal anchor has 14 utility tokens, its name has three (including truncation), and the external anchor
  has 12. Long names are hidden by truncation; external links use only a hard-coded English title.
- Existing empty presentation is a custom dashed box with an icon and translated text.
- Use existing ButtonModule/MessageModule, outlined secondary internal anchors with semantic labels,
  text secondary external anchors, a semantic list, and native secondary Message.
- Only layout/wrapping utilities should remain; no custom CSS, colors, shared abstraction, or theme changes.
- Before light desktop Card screenshot inspected:
  `tmp/design-refresh/DR-015c-before-light-desktop.png` (local evidence, not committed).

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, and the smallest independently reviewable slice.
- [x] Preserve draw behavior and translations while replacing custom presentation.
- [x] Use native PrimeNG options and remove only obsolete draw-list utilities.
- [x] Keep shared consumers/global styling unchanged.
- [x] Record focused tests, browser evidence, and any discoveries outside scope.

## Acceptance and verification

- [x] All 26 internal and external live destinations remain unchanged and ordered.
- [x] Type, size, missing-name fallback, and absent-external-code behavior have focused test coverage.
- [x] Empty draws show the existing translated text in a native Message (component test).
- [x] Long names remain readable and links/Cards fit at 390px/1280px in light/dark.
- [x] Named links, keyboard activation, visible focus, and text contrast pass.
- [x] There are no new authored colors, numbered palette utilities, SCSS, or inline-style workarounds.
- [x] Focused Nx tests/lint and consuming app build pass.
- [x] Locale and SSR/hydration coverage are recorded without overstating checks.
- [ ] Mounted alternate locale, live empty data, exhaustive hydration, and screen-reader checks.
- [x] User approved completion and the scoped commit on 2026-10-23 with disclosed verification limits.

## Evidence and handoff

- Native outlined secondary anchor Buttons replace the manually styled internal links; metadata moves below the
  name to keep both readable. Native text secondary anchor Buttons replace external-link styling. Their
  accessible names use the existing draw name/fallback plus the destination brand, with decorative icons hidden.
- Internal anchor utilities drop from 14 to three, external anchors from 12 to one. The label retains four
  layout/semantic utilities, and its name retains three wrapping/layout utilities rather than truncation.
  The semantic `ul`/`li` list adds necessary list reset/layout; metadata retains simple flex wrapping.
  `no-underline` is necessary because the global anchor decoration otherwise underlines the whole Button.
  No inline CSS, SCSS, dependencies, shared components, or global theme settings changed.
- Scope clarification: one `min-w-0` utility was added to the existing Card host. A 240-character unbroken-name
  browser stress check initially widened the mobile grid despite wrapping on the label. Letting the grid item
  shrink fixes the intrinsic-size constraint without changing Card appearance or adding CSS.
- Final focused tests: 11/11 pass. The three new cases cover native link/list semantics, metadata, external
  destination/security attributes and accessible names, missing external code, sorted fallback/long names,
  and translated empty Message content. Apollo is stubbed and sync children remain test stubs; no mutations run.
- Commands (run after final application edits):

  ```powershell
  npm exec -- prettier --write "libs\frontend\pages\competition\src\pages\detail\page-detail.component.html" `
    "libs\frontend\pages\competition\src\pages\detail\page-detail.component.spec.ts"
  $env:NX_DAEMON='false'
  npm exec -- nx run-many -t test,lint -p frontend-pages-competition --output-style=static
  npm exec -- nx run app:build --output-style=static
  git diff --check
  ```

- Results: tests pass; lint passes with 41 pre-existing warnings; app build and all 29 prerequisites pass.
  Existing Nx executor deprecation and TypeScript metadata advisories remain. Changed handoff documents are
  formatted with the same repository Prettier command.
- Browser on the supplied competition route: 12 Cards, 26 internal and 26 external draw links remain.
  Ordered destination fingerprint before and after:
  `edddb1068e3e8ccd2db7ea41e89f3e804cb143c649e088b81c90bc2c61ecc8d6`.
- Light/dark at 390px/1280px: no document overflow, links outside Cards, labels/icons outside links,
  or internal-anchor content overflow. Native icon-only external Buttons report two pixels of scroll extent
  from their padding, but their actual icons remain fully inside button bounds; no styling override was added.
- Browser-only stress check temporarily replaced one label with a 240-character unbroken name and restored it
  immediately. In both themes it wraps to 120px height at 390px and 90px at 1280px without document overflow.
  This is synthetic DOM layout evidence, not changed backend data; actual Angular long-name rendering has
  focused test coverage as well.
- Tab reaches each external companion after its internal link; Shift+Tab returns to the internal link.
  Both show settled native 1px focus outlines. Enter activates the first internal draw destination and browser
  Back returns to competition detail. External navigation was not opened against the third-party site.
- Rendered sRGB text contrast, using Canvas conversion and composited ancestor surfaces:
  light name 19.87:1 normal / 19.03:1 hover, metadata 4.87:1 / 4.66:1;
  dark name 16.00:1 / 15.12:1, metadata 6.65:1 / 6.28:1.
- All four final Card screenshots were inspected:
  `tmp/design-refresh/DR-015c-after-{light,dark}-{390,1280}.png`.
  Before screenshots use the corresponding `before` prefix. Local-only images are not staged or committed.
  Original light theme and 1251x1221 viewport restored.
- Same-origin server HTML fetch: HTTP 200, 12 semantic lists, 26 internal anchors, 52 native Button anchors,
  and accessible names on every external companion. This confirms SSR markup, not exhaustive hydration.
  Mounted data has no empty Cards; native empty and alternate-locale text are component-tested only.
- A rapid return navigation produced the existing router's skipped-ViewTransition AbortError; intended navigation
  succeeded and a reload cleared it. The separate DR-003 follow-up is recorded in the backlog, not fixed here.
- Exceptions: none.
- User approval on 2026-10-23: "Approve completion and commit". This accepts the disclosed limits:
  mounted alternate locale, live empty data, exhaustive hydration, and screen-reader output remain
  unverified. The unchecked criterion above is deliberately retained; approval is not a claim those checks ran.
  Approval authorizes only this slice's implementation, tests, and repository handoff, not a push.
- Parent DR-015 remains open; do not start another slice in this invocation.
- Exact next action: in a fresh invocation, inspect and scope the remaining mounted sub-event metadata-chip
  presentation as a separate DR-015 child. Preserve values/conditionals and do not start it here.

[template]: ../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.html
[tests]: ../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.spec.ts
[routes]: ../../../libs/frontend/pages/competition/src/lib.routes.ts
