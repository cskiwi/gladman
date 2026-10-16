---
title: 'DR-004: Shared headings and hero'
description: 'A responsive, theme-aware identity and heading system reviewed with the homepage and shell.'
---

## Identity and outcome

- ID: DR-004; owner unassigned; status tracked in the [backlog](../backlog.md).
- Dependency: [DR-001](DR-001-design-baseline.md).
- Review context: [DR-002](DR-002-home-pilot.md) and [DR-003](DR-003-app-shell.md), both still in review.
- Projects: `frontend-components`, `frontend-pages-home`, and application integration through `app`.
- Rules: [design refresh plan](../README.md).

On 2026-10-16 the user approved the combined heading, hero, and shell layout as the new direction. They explicitly
requested the same treatment for the homepage table and a neutral background that preserves content separation.
The layout is approved; final canvas/table styling awaits confirmation. Do not reopen the agreed layout during the
next continuation or mistake styling approval for completion of outstanding functional checks.

## Scope and approach

- Refresh [hero][hero], its shared title/avatar, [page header][page-header], and [section header][section-header].
- Integrate the homepage with these shared patterns to make the combined direction visible on `/`.
- Replace the decorative gradient/scanline hero and parallelogram avatar with native styled PrimeNG containers/avatar.
- Use readable title sizes, wrapping identity, and actions below identity on narrow screens.
- Preserve all projection slots, avatar variants, conditional controls, routes, localization, and ranking values.
- Inspect [breadcrumb][breadcrumb]; retain its existing native PrimeNG behavior unless a concrete defect needs fixing.
- Apply the same native card surface to the homepage reference section while retaining `p-table` and native spacing.
- At the user's explicit request, replace only the global page background with a semantic canvas token in the preset.
  Light uses the existing pale surface; dark uses the existing deepest surface. Preserve the inverted scale and all
  other component theme mappings.
- Exclude feature-page bodies, ranking/statistic semantics (DR-005), shell behavior, backend processes, and routes.

## Consumers and baseline

Hero consumers: player detail and ranking breakdown; club detail and team detail; competition detail and draw detail;
tournament detail, draw detail, and club detail. Several consumers own custom crests/headings; those page-specific
decorations remain for their feature slices.

Page-header consumers: player editing/head-to-head, competition sub-events, and admin. The homepage now consumes
section-header; there were no production consumers before this slice. Breadcrumb remains native across player, club,
competition, and tournament routes.

Baseline: the hero has a fixed three-column grid, two radial gradients and a scanline pseudo-element. Its avatar uses
gradient text, a clipped crest and a pseudo-element. Page-header has a highlighted tile and reserves avatar space even
when no avatar is projected. Section-header renders a span rather than a heading. The live homepage is anonymous and
loaded, but the existing API process still serves stale translations.

## Implementation checklist

- [x] Inspect consumer projection contracts and scope the shared concern.
- [x] Preserve slots, variants, translations, conditional content, and data.
- [x] Replace custom hero/avatar appearance with native PrimeNG.
- [x] Align page/section/title typography and responsive layout.
- [x] Compose the homepage with the shared patterns, including the native table in a bordered card.
- [x] Remove obsolete hero/avatar styles and record affected consumers.
- [x] Replace ambient page gradients with a preset-owned semantic canvas.

## Acceptance and verification

- [x] Shared projection tests cover avatar, identity/title, metadata, working actions, stats, and default content.
- [x] Homepage tests retain ascending rows, zero/null behavior, anonymous/authenticated conditions, and native table.
- [x] Light/dark and 390px/1280px homepage layouts retain titles without page-level overflow.
- [x] Native components and semantic utilities supply appearance; no new SCSS or authored palette colors.
- [x] Homepage headings/contrast, keyboard drawer opening/Escape/focus return, and breadcrumb unit tests pass.
- [x] Relevant Nx lint, focused tests, and application build pass; broader pre-existing test failures are recorded below.
- [x] Live SSR markup contains both cards, translated headings, and hydration state; browser has no hydration errors.
- [x] The user approves the shared heading/hero/shell layout direction.
- [ ] The user confirms the final neutral canvas and table treatment.
- [ ] Complete route-level visual regression of all shared hero consumers, including narrow-screen actions.

## Evidence and handoff

### Implementation and validation

- Hero uses a native bordered `p-card`; avatar uses `p-avatar`. Removed both obsolete gradient/crest SCSS files.
  Page-header no longer reserves an empty avatar tile. Section-header now renders a semantic `h2`.
- Home uses the shared hero/title/avatar and section heading. Its reference section is a second bordered `p-card`
  containing native `p-table`, default row spacing, tabular numerals, and horizontal scrolling.
- Utility comparison (class-bearing elements): hero 3 to 5; page-header 8 to 6; section-header 3 to 3; home 12 to 13.
  The added wrappers provide responsive action layout and a coherent table surface, not decorative tiles.
- `NX_DAEMON=false npm exec nx run frontend-components:test -- --runInBand
--testPathPatterns=hero.component.spec.ts --output-style=static`: 7 passing tests.
- `NX_DAEMON=false npm exec nx run frontend-pages-home:test -- --runInBand --output-style=static`: 5 passing tests.
- `NX_DAEMON=false npm exec nx run-many -- --targets=lint
--projects=app,frontend-pages-home,frontend-components --output-style=static`: passed; 32 existing shared-library
  warnings, none in the changed heading/home files.
- `NX_DAEMON=false npm exec nx build app -- --configuration=development --output-style=static`: passed, including
  application browser/server and dependent library compilation.
- Shared test setup now uses the installed zoneless environment, matching the homepage; no dependency added.
  A full two-library test run exposed existing failures: ranking-progress lacks a TranslateService test provider,
  and bracket-tree tests reference removed methods/old ordering expectations (7 failures in those two suites).
  Those unrelated tests were not modified. The new shared-heading suite and all homepage tests pass independently.

### Browser evidence

- After the user restarted the server, checked live Dutch output without translation interception at 1280x900 and
  390x900 in both themes. No page-level horizontal overflow. At 390px the table container is 325px wide and scrolls
  its 672px table; all four columns remain reachable.
- Canvas has no background image. It differs from card surfaces in both themes; semantic card borders remain distinct.
  Light title/metadata contrast: 19.87:1 / 4.87:1. Dark: 16:1 / 6.65:1.
- Keyboard: native drawer opens with Enter, closes with Escape, returns focus to the trigger, and shows focus feedback.
  Theme choice survives reload. A browser-only long-name fixture wraps without horizontal overflow.
- Read-only `/admin` check confirms the page-header consumer renders on the new canvas without overflow. No indexing,
  sync, or operational mutations were executed. Other feature-page visual checks remain open.
- SSR response includes both native cards, translated section heading, canvas token, and hydration metadata. A fresh
  isolated browser reports no console/page errors. The existing PrimeUI license warning/watermark remains unrelated.
- Four theme/viewport screenshots and the long-name fixture are stored in session evidence, not committed. The combined
  homepage is open at `http://localhost:3000/` for the final canvas/table review.

### Scope decision and next action

The existing global body rule now consumes `--p-app-canvas`; colors are defined only in the PrimeNG preset extension
using existing surface tokens. This is an explicitly requested theme-infrastructure change, not a page-level styling
workaround. No new stylesheet, palette, dependency, or styling exception was introduced. Legacy feature-specific
gradient tokens remain until their consumers migrate.

Next: confirm the final canvas/table appearance, then finish remaining shared-consumer and DR-002/DR-003 functional
verification. Keep the backlog in `Review` until those checks pass; do not start DR-005 in this invocation.

[hero]: ../../../libs/frontend/components/hero
[page-header]: ../../../libs/frontend/components/page-header
[section-header]: ../../../libs/frontend/components/section-header
[breadcrumb]: ../../../libs/frontend/components/breadcrumb
