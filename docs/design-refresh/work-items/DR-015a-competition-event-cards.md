---
title: 'DR-015a: Competition event cards'
description: 'Use native PrimeNG Cards for competition sub-event presentation.'
---

## Identity

- ID: DR-015a; parent [DR-015](../backlog.md). Status is authoritative in the [backlog](../backlog.md).
- Review status: Done with explicit user approval on 2026-10-23.
- Area: the mounted competition detail route at `/competition/:competitionSlug`.
- Project: `frontend-pages-competition`.
- Dependencies: completed DR-004 shared hero and page-header work.

## Scope

- Replace the custom sub-event article surface with a native PrimeNG Card.
- Preserve sub-event grouping, quick-scroll navigation, metadata, draw links, external links, and sync controls.
- Preserve the existing responsive three-column grid and card content.
- Exclude tournament event cards, competition draw pages, services, translations, and global theme changes.

## Implementation checklist

- [x] Confirm the supplied competition route has populated sub-events and draws.
- [x] Render each sub-event in a native Card with the existing content and links.
- [x] Preserve full-height grid behavior and responsive layout.
- [x] Remove the unused competition-specific sub-event surface styling.
- [x] Run the focused library lint and consuming app build.
- [x] Inspect the mounted competition route after rebuilding.

## Acceptance and verification

- [x] Existing sub-event and draw destinations remain unchanged.
- [x] Existing sync status and sync action controls remain present.
- [x] Group counts, metadata, empty-draw state, and quick-scroll behavior remain unchanged.
- [x] Competition cards render at the supplied desktop route without a compile overlay.
- [x] `frontend-pages-competition` lint passes with its existing warnings.
- [x] The consuming `app` build passes.
- [x] `git diff --check` passes.
- [ ] Narrow viewport and light-theme pixel review are pending.
- [ ] Keyboard, SSR/hydration, alternate-locale, and screen-reader checks are pending.
- [x] User approved completion by requesting `commit` on 2026-10-23; the unchecked verification limits remain
      unverified and accepted.

## Evidence and handoff

- The supplied route `/competition/pbo-competitie-2026-2027` contains 12 sub-events across three groups
  and 26 draws.
- The mounted dark desktop view was inspected after the edit. Native Card surfaces render the event grid,
  including populated draw links and existing sync controls.
- The focused source change imports `CardModule`, wraps each existing sub-event article in `p-card`, and
  removes only the obsolete `.g-subevent` transition rule. The Card uses PrimeNG's native body padding;
  no passthrough styling or replacement body CSS is used.
- Validation commands:

  ```powershell
  $env:NX_DAEMON='false'
  npm exec -- nx run frontend-pages-competition:lint --output-style=static
  npm exec -- nx run app:build --output-style=static
  git diff --check
  ```

- The lint target passes with 41 pre-existing warnings. The app build passes. No backend data, fixtures,
  dependencies, or server processes were changed.

## Source

- [Competition detail component][component]
- [Competition detail template][template]
- [Competition detail styles][styles]

[component]: ../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.ts
[template]: ../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.html
[styles]: ../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.scss
