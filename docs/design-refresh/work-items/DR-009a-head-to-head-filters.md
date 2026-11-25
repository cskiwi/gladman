---
title: 'DR-009a: Head-to-head filters'
description: 'Native collapsible filters with semantic groups and fluid, named controls.'
---

## Identity and scope

- ID: DR-009a. Status: see the [backlog](../backlog.md).
- Parent: [DR-009](DR-009-player-head-to-head.md). No incomplete prerequisites.
- Design rules: [refresh plan](../README.md).
- Mounted consumer: `/players/glenn-latomme/head-to-head`, confirmed hydrated on 2026-11-25.
- Project: `frontend-pages-player`.
- Sources: [page template][template] and [page component][component].
- Only the filter area and its obsolete local toggle state are in scope.
- Preserve form controls, values, date deferral, conditional partner/opponent controls, data service and grid inputs.
- Exclude guidance Card, page states, matchup table, service/calculations, global/shared styles and new extraction.

## Baseline and approach

- Existing filter Card's legacy header template is not rendered: neither heading nor toggle is available.
- Four group headings use blue/orange/green/purple palette utilities and decorative borders.
- Selects expose selected values rather than their field labels as accessible names.
- Existing filter layout fits 390px/1440px in light and dark; dark 1288px screenshot inspected.
- Replace only the filter Card with native toggleable Panel, using its header, focus and expanded-state behavior.
- Keep four responsive groups, represented by semantic fieldsets/legends; native fluid inputs own control sizing.
- Explicitly associate Selects with translated labels and name searchable overlays with existing translations.
- Existing page/grid boundary is sufficient; a single-consumer filter wrapper would not avoid repeated styling.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and bounded scope.
- [x] Preserve filters and translations while simplifying presentation.
- [x] Use native Panel toggle and native fluid controls.
- [x] Remove only obsolete filter toggle state and in-scope palette/layout markup.
- [x] Leave shared/global code and all excluded areas unchanged.

## Acceptance and verification

- [x] Translated filter header renders with a keyboard-operable named toggle and correct expanded state.
- [x] Collapse/reopen retains filter values and conditional mode controls.
- [x] Both modes expose field names; searchable club/partner overlays have translated input names.
- [x] Light/dark at 390px and 1440px preserve usable control widths without filter overflow.
- [x] Native Select and DatePicker overlays, Escape/focus and minimum-game editing remain usable.
- [x] No new palette colors, SCSS, inline styles or shared-component changes.
- [x] Focused Nx lint/build/tests pass.
- [x] User approves completion with the disclosed verification limits; no unperformed check is claimed.
- [ ] Full screen-reader, contrast, locale-switching and SSR/hydration verification.

## Evidence and handoff

- Baseline: fifteen populated partner rows; initial mode Partners, minimum games zero, date July 2025.
- Browser baseline: light/dark narrow/wide filter geometry fits; this is not a full screenshot/accessibility pass.
- Changed only the filter markup, Panel import, obsolete filter-toggle state and three focused interaction tests.
  Existing page/grid separation remains; no extra wrapper or shared/global change.
- Filter body class attributes: 18 to 9; utility tokens: 65 to 36; authored palette tokens: nine to zero.
  Counts exclude the replaced outer Card's two class tokens. Remaining utilities provide responsive layout,
  group spacing and removal of browser-default fieldset borders/margins/padding.
- Native Panel supplies its own translated toggle name from `header`; no pass-through or custom toggle is required.
- Exceptions: none. Existing page SCSS and excluded guidance/grid markup are unchanged.

### Nx and documentation checks

- `npx nx run-many -t lint build -p frontend-pages-player --output-style=static`: pass, twelve tasks,
  ten from cache. Repeated after the final application markup change on 2026-11-25.
- `npx nx run frontend-pages-player:test --runInBand --testPathPatterns=page-head-to-head.component.spec.ts
--output-style=static`: pass, three tests, repeated after final application changes.
  Coverage: native toggle/value retention, both modes' label associations, named searchable input.
- Initial test run failed because jsdom lacks `matchMedia`; use the existing repository's scoped mock/restore pattern.
  The repeated focused run passes. Initial native Panel option typing error was corrected before the successful build.
- Scoped `npx prettier --write` passes on all six changed files.
- Node assertions pass for all six files' LF endings, three documents' frontmatter, 479 local documentation links,
  unique/correct DR-009/a/b/c registry rows, and zero filter palette/inline-style regressions.
- `git --no-pager diff --check`: pass. Git warns about future CRLF conversion; current file bytes are verified LF.
- Registry formatting also aligns its existing rows to the longer `In progress` status; no historical rows removed.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 22 targets pass from cache;
  twelve fail existing `@nx/dependency-checks` outside this slice: backend-health, backend-seo, backend-search,
  backend-ranking, i18n, shared, backend-authorization, backend-translate, utils, backend-database,
  frontend-modules-translation and backend-graphql. No unrelated manifests or dependency findings changed.
- No dependency installs, backend mutations, full application build or exhaustive test suite.

### Browser evidence

- Preview initially retained an old compilation error and old template. Triggering the existing watcher via the
  component's modification time and reloading resolved it; no server/process restart or file-content workaround.
- Early shared-browser mode samples were unsettled and are not accepted as mode evidence.
  The separate Playwright browser then loaded the same real public route and verified settled state.
- Eight settled cases: light/dark x 390px/1440px x Partners/Tegenstanders.
  All retain four named groups, correctly named four/five Selects, zero filter overflow and no control outside
  the Panel or narrower than 100px. Panel widths: 347px narrow, 1280px wide.
- All eight native-toggle cases: Enter collapses, Space reopens, `aria-expanded` false/true, focus retained.
- A settled light-wide collapse has `aria-hidden="true"`, `display:none`, zero height; Tab skips the filters to
  the table header. An earlier animation-time visibility count is invalid, not a collapsed-state regression.
- Minimum games five reduces partner rows from fifteen to two; collapse/reopen preserves five.
  Resetting zero restores fifteen rows. No data-service or grid changes were needed.
- Dark-narrow opponent partner/club searches expose translated searchbox names and usable no-match feedback;
  Escape returns focus to their Selects. Initial test used the wrong `textbox` role; the native role is `searchbox`.
- Partner-mode club search also exposes its translated name. Light-wide keyboard Space opens its overlay;
  Escape closes it. Native DatePicker ArrowDown opens and Escape restores input focus in dark-narrow/light-wide.
  Measured overlays fit horizontally within their viewports; date selection and every filter combination are not audited.
- Inspected settled filter-only PNGs: dark narrow opponents and light wide partners, saved locally in ignored
  `.playwright-mcp` output, not committed. These contain filter labels, not table/player records.
  The initial shared-browser wide crops were clipped; they are not full-viewport screenshot evidence.
- Existing navigation view-transition abort errors recur before/after; route and data render.
- Native no-match/status copy remains English beside Dutch field labels. Record shared PrimeNG locale feedback
  separately; this slice removes only the authored English search placeholders and names.
- No full screenshot matrix, contrast measurement, screen-reader/touch audit, locale-switching, operational workflow,
  disabled/error/loading fixture matrix or SSR/hydration verification is claimed.

### Exact next action

- Explicit approval on 2026-11-25: `Approve DR-009a with documented limits and commit`.
  This authorizes completion and the scoped commit while retaining unchecked screenshot-matrix, contrast,
  screen-reader/touch, locale/state/workflow and SSR/hydration criteria. It is not evidence those checks passed.
- DR-009a is Done by that approval; only its implementation, three tests and repository handoff belong in the commit.
  No push is authorized. Required workspace lint ran with the unrelated failures recorded above.
- DR-009 remains open. Exact next candidate: scope DR-009b guidance/page states from current source.
  Do not begin it or DR-009c in this invocation.

[template]: ../../../libs/frontend/pages/player/src/pages/head-to-head/page-head-to-head.component.html
[component]: ../../../libs/frontend/pages/player/src/pages/head-to-head/page-head-to-head.component.ts
