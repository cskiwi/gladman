---
title: 'DR-008c: Player detail page chrome'
description: 'Refresh the player detail hero identity row, hero actions copy, and page-level loading and error states.'
---

## Identity

- ID: DR-008c; parent [DR-008](../backlog.md). Status is authoritative in the [backlog](../backlog.md).
- Area: the mounted `/players/:playerId` page (`app-page-detail`), outside the cards already done in
  [DR-008b](DR-008b-player-sidebar-cards.md).
- Dependencies: completed DR-004 shared hero and DR-008a hero actions. No shared component change is required.
- Design rules: [design refresh plan](../README.md).

## Scope

- Project: `frontend-pages-player`; folder `pages/detail/` (`page-detail.component.*`).
- Hero identity row: club link and member id. Hero actions: hard-coded English `Follow` and `Edit` labels,
  wrapping on narrow screens. Page-level loading indicator and error message. Remove the page-local SCSS.
- Preserve routes (`head-to-head`, `edit`), the club link, the follow toggle's UI-only behavior, SEO updates, and the
  ranking-data effect.
- Exclude the ranking progress panel (`app-player-ranking-progress`), upcoming/recent games, the sidebar cards, the
  shared hero components, `DetailService` queries and error strings, and `rank-spark`/`show-level`.

## Baseline

- Member id rendered as a hand-built chip: `t-mono bg-emphasis px-2 py-0.5 rounded-sm tracking-wider text-xs`.
- `Follow` and the menu's `Edit` label are hard-coded English; the actions row does not wrap.
- Loading used a `p-progressbar` with an inline `[style]="{ height: '6px' }"`; the error used `text-red-600` and
  hand-built spacing instead of a native message.
- `page-detail.component.scss` held a `:host` flex column and rank-number/rank-detail styles (gradient text, Google
  font stacks) with no consumer in the template.

## Proposed approach

- Member id becomes a native secondary `p-tag`, matching the competition hero. Club link keeps its icon and text.
- Localize `Follow` and the menu `Edit` entry in nl/fr/en; wrap the actions row like the competition hero.
- Loading becomes `p-progressbar mode="indeterminate" class="h-1"` and the error a native `p-message severity="error"`,
  both as on the competition detail page.
- Delete the SCSS and its `styleUrl` once its classes are confirmed unused.

## Checklist

- [x] Confirm the mounted consumer and smallest slice.
- [x] Replace the hand-built member-id chip and error/loading markup with native components.
- [x] Localize the Follow and Edit labels in three locales (Edit reuses `all.button.edit`; new `all.player.detail.follow`).
- [x] Remove the unused SCSS (file deleted, `styleUrl` removed).
- [x] No numbered palette utilities, hex colors or new SCSS.
- [x] Lint and build pass.
- [x] Browser check: dark wide, light 375px.
- [ ] Light wide and dark 375px.
- [ ] Keyboard/focus and contrast checks.
- [x] Error state checked; loading state only glimpsed in transition.
- [ ] Follow label in French/English.

## Verification

- **Passed:** `NX_DAEMON=false npm exec nx -- run-many --target=lint,build --projects=frontend-pages-player` (12 tasks).
- **Passed (browser, Dutch, `glenn-latomme`):** dark 1440px hero shows `Volgen`, club link and a secondary `#50104197`
  tag; light 375px has no horizontal overflow (`scrollWidth` 375) and the action row stays on one line; the ellipsis
  menu shows `Bewerken`; `/players/does-not-exist-xyz` shows a native error message and no progress bar.
- **Not verified:** light wide, dark 375px, keyboard focus, contrast, French/English copy, tests (the project has no
  spec files), hydration.

## Approval

- The user approved completion with `commit` on 2026-11-11. Status is Done with the unchecked limits above accepted
  (light wide, dark 375px, keyboard/focus, contrast, French/English copy, tests).

## Fix found on the way

- `DetailService.player` called `resource.value()`, which throws `ResourceValueError` in the error state, so the page
  never rendered its error (it stayed on an empty progress track). The selector now guards with `hasValue()`. Query,
  error strings and the other selectors are unchanged. The message itself remains the service's English text.

## Discoveries

- The Follow button toggles a `following` signal that nothing renders; it has no visible effect. Left unchanged.
