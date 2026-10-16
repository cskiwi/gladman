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

- [ ] The page uses a native PrimeNG table and explicit native feedback components.
- [ ] Data order, all four columns, translated headings, null placeholders, and zero values are preserved.
- [ ] Changing the selected ranking system still updates the displayed data.
- [ ] Anonymous/authenticated, loading, failure, no-data, and loaded states are verified with safe fixtures.
- [ ] Long system names and narrow screens retain access to every column without page-level overflow.
- [ ] Light and dark themes, contrast, headings, keyboard access, and any interactive focus states are verified.
- [ ] Page-level utility usage is measured before/after and unnecessary classes/wrappers are removed.
- [ ] There are zero new authored non-semantic colors or numbered palette utilities.
- [ ] There is no new SCSS or inline-style workaround; any unavoidable exception is documented and reviewed.
- [ ] Existing shared consumers and global styling remain unchanged.
- [ ] Relevant Nx lint/build checks and focused behavior tests pass.
- [ ] SSR/hydration is checked for the route; no new browser-only rendering assumption is introduced.
- [ ] The visual result is reviewed before this pattern is applied elsewhere.

Inspect resolved Nx targets before running validation. Start with:

```powershell
npx nx show project frontend-pages-home --json
npx nx show project app --json
```

Use the available lint/build targets and smallest relevant existing test runner. Add focused regression tests for table
values/order and conditional content where current coverage is insufficient. Do not treat the existing application title
smoke test as proof of those behaviors.

## Evidence and handoff

- Implementation: not started.
- Before/after browser evidence: not captured.
- Utility/style comparison: not measured.
- Validation results: not run.
- Visual review: pending implementation.
- Styling exceptions: none.
- Reusable-pattern decision: record what worked before promoting shared-pattern backlog items.

[template]: ../../../libs/frontend/pages/home/src/pages/home/page-home.component.html
[component]: ../../../libs/frontend/pages/home/src/pages/home/page-home.component.ts
