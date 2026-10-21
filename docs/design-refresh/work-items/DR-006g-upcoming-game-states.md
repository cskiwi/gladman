---
title: 'DR-006g: Player upcoming-games presentation'
description: 'Refresh the mounted player upcoming-games heading, cards, loading, and empty presentations.'
---

## Identity

- ID: DR-006g; parent DR-006 remains open. Status is authoritative in the [backlog](../backlog.md).
- Dependencies: none. Preserve populated-card behavior established by DR-006f.
- Design rules: follow the [design refresh](../README.md).

## Scope

- Project: `frontend-components`; mounted on `/players/:playerId` through the player detail page.
- Consumer: the player detail page mounts the upcoming-games dispatcher with `type="player"`.
- Update the player upcoming-games heading, populated-card date and assembly action, loading placeholders,
  and settled empty presentation.
- Preserve translated copy, team/draw links, assembly query parameters, and expansion behavior; include the month
  in populated encounter dates and use the native `pButton` directive for the assembly action.
- Preserve the three loading-card count and service behavior.
- Exclude card data and layout changes outside the date/action, View All/View Less, services, queries, pagination,
  error handling, the team dispatcher branch, and global/shared styling.

## Baseline and proposed approach

- The mounted heading was a translated `span.t-eyebrow` inside two layout wrappers, not a semantic section heading.
- The loading branch renders three custom `.upcoming` surfaces and eighteen skeleton elements. Its surface,
  date-column styles, and accent stripe live in the player component stylesheet.
- The settled empty branch renders a calendar icon, translated heading, and translated description in a centered
  padded `div`.
- Populated cards display weekday, day, and time but omit the month. The assembly action used a `<p-button>`
  component. The user requested the month and a native `button pButton` directive after review; installed PrimeNG
  22.1.2 provides that directive and its native styling inputs. The first month layout crowded the date and time
  together on narrow screens; after user feedback, the weekday/day/month are grouped on one line and the hour sits
  beneath them.
- The existing focused component spec checks the three placeholders, eighteen skeletons, and empty translation key.
- Relevant source: [mounted consumer][consumer], [template][template], [component][component], [styles][styles],
  and [focused spec][spec].
- Use semantic heading/section structure and native styled PrimeNG components where a surface is useful. Keep the
  existing PrimeNG Skeleton behavior, translations, and number of placeholders; avoid new styling layers.
- Remove the legacy placeholder styles only if the updated template no longer uses them. Keep component and theme
  behavior local to this player branch.

## Implementation checklist

- [x] Confirm the mounted consumer and capture the existing populated player route.
- [x] Improve heading semantics while preserving its translated title.
- [x] Refresh loading and empty presentations without changing service or state behavior.
- [x] Preserve three loading cards and ensure they have no focus targets.
- [x] Display the month in populated-card dates, group date/time clearly, and use a native button with the
  `pButton` directive.
- [x] Remove the now-unused player placeholder styles.
- [x] Update focused rendering tests and record any out-of-scope discoveries in the backlog.

## Acceptance and verification

- [x] The mounted player upcoming section has an accessible semantic heading in both themes and viewport sizes.
- [x] Loading and settled-empty states remain distinct; loading retains three placeholders and its
  Skeleton content without adding focusable elements.
- [x] The empty state retains both existing translated messages and remains readable in light and dark themes.
- [x] Populated cards, expansion, routes, services, queries, and team rendering are unchanged.
- [x] Populated card dates include a month and the assembly action uses the native `button pButton` directive;
  its translated name and router destinations are preserved.
- [x] No non-semantic colors, numbered palette utilities, or custom styling rules are introduced.
- [x] Narrow and wide layouts have no horizontal overflow; focus targets and contrast are checked.
- [x] Focused component tests and `frontend-components` Nx lint/build pass; exact commands and results are recorded.
- [x] User reviewed the latest date/time layout on the existing port-3000 app and requested completion.
- [ ] SSR/hydration and alternate locales remain unverified.

## Evidence and handoff

- Changed scope and consumers: the player branch of the upcoming-games component, mounted by the player detail
  page; only the populated date month and assembly button API were added after review feedback. The team branch and
  shared dispatcher behavior are excluded.
- Baseline source: the current heading, empty markup, loading template, and player-only styles are linked below.
- Existing regression coverage: the focused upcoming player spec asserts loading placeholder count and empty text.
- Implementation: the heading is an `h2` with an ID derived from the player input, and its containing section uses
  `aria-labelledby` plus conditional `aria-busy`. Empty content retains both translations in a native PrimeNG Card;
  the calendar icon is decorative to assistive technology. Three native Cards keep the six original skeletons and add
  one action skeleton each to match populated-card layout. All skeletons are hidden from assistive technology.
  Populated date rows group weekday, day, and `MMM` in one semantic `time`, with the hour below in a separate
  semantic `time`. The assembly action is a native `<button pButton>` with RouterLink, query parameters, a
  decorative icon, and translated text.
- Utility/style comparison: the header removes the extra wrapper and legacy eyebrow token. Loading markup adds Card
  surfaces and a placeholder for its assembly action. Removed 50 lines of legacy `.upcoming*` custom styles; retained
  only `:host { display: block; }`.
- Validation passed:

  ```bash
  NX_DAEMON=false npm exec -- nx run frontend-components:test --runInBand \
    --testPathPatterns=upcoming-games-player.component.spec.ts --output-style=static
  NX_DAEMON=false npm exec -- nx run-many --targets=lint,build --projects=frontend-components --output-style=static
  NX_DAEMON=false npm exec -- nx run app:build --output-style=static
  git diff --check
  ```

- Seven focused tests pass, including month text, native button directive, translated name, destinations, and
  loading/empty accessibility. Component lint/build pass with 31 existing warnings and zero lint errors; consuming
  app build passes. Jest reports existing Nx executor deprecation and TypeScript metadata warnings.
- Mounted visual checks on a temporary local page covered the player route at 390px and 1280px in light/dark:
  heading is an `h2`, section width is 347px/905.5px, and document width is 375px/1265px. Current real data shows
  three populated cards without a compile overlay. In-memory component state checks (not backend fixtures) showed
  exactly three loading Cards, 21 aria-hidden skeletons, zero focus targets, and the retained empty translations.
  Empty title/description contrast was 19.87:1/4.87:1 in light and 16:1/6.65:1 in dark. Screenshots were inspected
  for real populated cards, empty state, and loading state; themes/viewport sizes were checked.
- Earlier state visuals were inspected before the month/button/date-time refinements. The temporary server used for
  those checks has been stopped at the user's request. Do not start or serve the app; use the user's existing port
  3000 for any remaining review and restore its original route/theme/viewport after inspection.
- Reusable-pattern decision: use the semantic heading and named busy section/Card/Skeleton pattern from mounted
  recent-games; no shared wrapper is proposed.
- Exceptions: none proposed.
- User review and decision: on 2026-10-21, after requesting a date/time layout refinement, the user reviewed the
  updated player upcoming-games view on their port-3000 instance and said, "mark as done." No assistant screenshot
  was captured after that final date/time refinement.
- Completion: the user approved completion with SSR/hydration and alternate locales unverified. No claim is made that
  those checks passed. DR-006 remains open for its other child areas.
- Next action: inspect mounted consumers and scope the next DR-006 child before implementation.

[consumer]: ../../../libs/frontend/pages/player/src/pages/detail/page-detail.component.html
[template]: ../../../libs/frontend/components/games/upcoming/src/player/upcoming-games-player.component.html
[component]: ../../../libs/frontend/components/games/upcoming/src/player/upcoming-games-player.component.ts
[styles]: ../../../libs/frontend/components/games/upcoming/src/player/upcoming-games-player.component.scss
[spec]: ../../../libs/frontend/components/games/upcoming/src/player/upcoming-games-player.component.spec.ts
