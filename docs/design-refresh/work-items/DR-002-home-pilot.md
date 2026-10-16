---
title: 'DR-002: Home page pilot'
description: 'A bounded PrimeNG-first redesign of the home ranking reference page.'
---

## Identity and outcome

- ID: DR-002.
- Status and owner tracking: [backlog](../backlog.md); owner unassigned.
- Dependency: [DR-001](DR-001-design-baseline.md).
- Route: `/`.
- Nx project: `frontend-pages-home`; application integration through `app`.
- Rules: [design refresh plan](../README.md).

Prove the direction on one page before carrying it into player, club, competition, and tournament workflows. The goal is
a clear ranking reference page, not another decorative dashboard.

## Scope

- [Home template][template] and [component][component], with only directly necessary presentation changes.
- Ranking-system identity, update metadata, level count, and the level-reference table.
- Loading/error presentation and the conditionally visible authenticated player's ranking section.
- Remove only the home page's obsolete component styling once its usage has been checked.

Keep data services, ranking formulas, authentication, routes, shell, theme preset, and shared component styling
unchanged. Do not rewrite the shared hero or ranking-progress component from this page task. Existing internals of
shared components are tracked separately under DR-004 and DR-005. If a shared change becomes necessary, make the
dependency explicit and scope it independently.

## Proposed native-component approach

- Replace the page-level decorative hero composition with a clear semantic heading and concise metadata. Use a native
  PrimeNG container or toolbar only if it provides useful structure.
- Replace the hand-styled reference table with `p-table`, using native table options and templates.
- Keep meaningful data in cells, using semantic text and only the layout utilities needed for alignment/responsiveness.
- Use `p-message` for explicit failure feedback and a native progress/skeleton treatment for loading.
- Retain the authenticated ranking-progress component and its visibility condition without restyling its other
  consumers.
- Do not add cards, tags, icons, or statistics merely to make the page appear more designed.
- Verify the installed PrimeNG APIs and the DR-001 baseline before implementation.

## Behavior to preserve

- Ranking-system name, level count, and optional last-calculation date.
- Ascending level order and all four translated column headings.
- Each row's level, promotion points, demotion points, and points won against that level.
- Distinct handling of `null` values and numeric zero; do not turn a valid zero into an empty value.
- Date formatting, localization, and the selected ranking system's updates.
- Loading and error signals, including their existing interaction with any already loaded content.
- Authenticated player's ranking section only under the existing user-ID condition.
- No new sorting/filtering/pagination behavior unless separately requested.

## Acceptance and verification

- [x] The page uses a native PrimeNG table and explicit native feedback components.
- [x] Data order, all four columns, translated headings, null placeholders, and zero values are preserved.
- [ ] Changing the selected ranking system still updates the displayed data.
- [ ] Anonymous/authenticated, loading, failure, no-data, and loaded states are all verified with safe fixtures. Anonymous
  loaded and anonymous conditional content are covered; the other states remain open.
- [ ] Long system names and narrow screens retain access to every column without page-level overflow. Narrow-screen
  access is verified; a long-name fixture remains open.
- [ ] Light and dark themes, contrast, headings, keyboard access, and interactive focus states are verified. Theme,
  contrast, headings, and the accessibility tree are checked; keyboard/focus behavior remains open.
- [x] Page-level utility usage is measured before/after and unnecessary classes/wrappers are removed.
- [x] There are zero new authored non-semantic colors or numbered palette utilities.
- [x] There is no new SCSS or inline-style workaround; the existing host layout rule remains and the unused gradient
  rule was removed.
- [x] Existing shared consumers and global styling remain unchanged.
- [x] Relevant Nx lint/build checks and focused behavior tests pass.
- [ ] SSR/hydration is checked for the route; no new browser-only rendering assumption is introduced.
- [x] The loaded route is visually reviewed before this pattern is applied elsewhere.

Inspect resolved Nx targets before running validation. Start with:

```powershell
npx nx show project frontend-pages-home --json
npx nx show project app --json
```

Use the available lint/build targets and smallest relevant existing test runner. Add focused regression tests for table
values/order and conditional content where current coverage is insufficient. Do not treat the existing application title
smoke test as proof of those behaviors.

## Evidence and handoff

### Approved shared-layout follow-up

On 2026-10-16 the user approved the combined shared heading/hero/shell layout and requested matching table treatment.
[DR-004](DR-004-shared-headings.md) now owns that integration and the explicitly requested global neutral canvas.
The homepage retains native `p-table` inside a rounded, semantic-bordered `p-card` with its shared section heading.
Five homepage tests pass, including a native-table/card/scrollability assertion and authenticated strip projection.
Live restarted-API translations, 1280px/390px light/dark layouts, long-name wrapping, keyboard drawer/focus return,
theme persistence, and SSR markup/hydration checks pass. Final canvas/table styling awaits user confirmation.
Loading/error/no-system and selected-system switching coverage remain open; this does not mark the entire pilot done.

- Implementation: complete for the selected page structure and native loading/error/table presentation. The DR-001
  baseline is the only prerequisite. Service and shared component behavior remain excluded.
- Changed scope: [home component][component], its template/style, focused component regression test, and the page test
  setup. The test setup uses the installed zoneless Jest environment because `zone.js` is not installed; production
  dependencies were not changed.
- Before browser evidence: captured on 2026-10-16 from the anonymous loaded route at 1280x900 and 390x844 in both
  themes. Wide and narrow layouts had no page-level horizontal overflow. Native autocomplete overlay behavior and theme
  persistence were also checked.
- Safe state evidence: anonymous and loaded success are available live. Authenticated, loading, error, and
  no-ranking-system states require focused fixtures or component tests; do not use operational mutations or a real
  account for visual testing.
- Utility/style comparison: baseline is 22 class-bearing elements in the home template plus a page stylesheet with a
  host flex/gap rule and an unused `.rank-number` rule. The pilot now has 12 class-bearing elements, uses no authored
  numbered palette or light/dark color pairs, and retains only the host layout rule.
- Validation results: `NX_DAEMON=false npx nx lint frontend-pages-home --output-style=static`, `NX_DAEMON=false npx nx
  lint app --output-style=static`, `NX_DAEMON=false npx nx test frontend-pages-home --runInBand --output-style=static`,
  and `NX_DAEMON=false npx nx build app --configuration=development --output-style=static` passed. The focused test
  suite contains two passing regression tests. Nx daemon startup stalled during concurrent initial runs; rerunning
  without the daemon produced the final results.
- Browser review: the live route was checked at 1280x900 and 390x844 in light and dark themes. The document had no
  page-level horizontal overflow in either viewport. At 390px the native table scroll container exposed all four
  columns (`scrollWidth` 672px, `clientWidth` 347px); computed heading and cell text remained readable in both themes.
  The accessibility tree exposed the `h1`, `h2`, table headers, rows, and login controls. The browser reported no
  console errors; the existing PrimeUI license warning remains. The browser session used the already-running API
  process, so it displayed the new translation keys until that process is restarted; the API build below verifies the
  deployed translation assets instead.
- Translation validation: the three source locale JSON files parse successfully. `NX_DAEMON=false npx nx build api
  --configuration=development --output-style=static` passed and generated the new English, Dutch, and French keys in
  `dist/apps/api/assets/i18n` and the generated i18n type. Restart the local API before the next live visual review.
- Remaining verification: authenticated, loading, failure, and no-ranking-system fixture states; selected-system
  switching; long-name fixture; keyboard/focus behavior; localized live output after an API restart; and independent
  SSR/hydration verification. These are the next review actions and are not claimed by the current implementation
  evidence.
- Visual review: complete for the loaded anonymous route; broader user review is still pending.
- Styling exceptions: none.
- Reusable-pattern decision: keep the result page-local until the pilot review; do not alter shared hero,
  section-header, ranking-progress, theme, or shell components in this slice.

[template]: ../../../libs/frontend/pages/home/src/pages/home/page-home.component.html
[component]: ../../../libs/frontend/pages/home/src/pages/home/page-home.component.ts
