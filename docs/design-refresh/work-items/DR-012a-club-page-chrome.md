---
title: 'DR-012a: Club detail page chrome'
description: 'Refresh the club detail hero identity row, hero actions copy, and page-level loading and error states.'
---

## Identity

- ID: DR-012a; parent [DR-012](../backlog.md). Status is authoritative in the [backlog](../backlog.md).
- Area: the mounted `/clubs/:clubId` page (`app-page-detail` in `frontend-pages-club`), outside the tabs and the
  sidebar cards.
- Dependencies: completed DR-004 shared hero. Mirrors [DR-008c](DR-008c-player-page-chrome.md). No shared component
  change is required.
- Design rules: [design refresh plan](../README.md).

## Scope

- Project: `frontend-pages-club`; folder `pages/detail/` (`page-detail.component.*`, `page-detail.service.ts`).
- Hero identity row: federation id, state, season and member count. Hero actions: season select, `Share`, `Follow`
  (hard-coded English), wrapping on narrow screens. Page-level loading indicator and error message.
- Preserve the season control and its form binding, tab permissions, SEO update, deferred tab loading, and route params.
- Exclude the hero stats strip (teams active, season record, club ranking, next home match; still uses the page SCSS
  win/loss helpers and `t-eyebrow`), the tabs and their panels, the sidebar cards, shared hero components, and the
  `DetailService` queries and error strings.

## Baseline

- Federation id rendered as a hand-built chip: `t-mono bg-emphasis px-2 py-0.5 rounded-sm tracking-wider text-xs`.
- `Season {{ n }}`, `{{ n }} members`, `Share` and `Follow` were hard-coded English; the actions row did not wrap and
  the season select used an inline `min-width` style and had no accessible name.
- Loading used a `p-progressbar` with an inline `[style]="{ height: '6px' }"`; the error used `text-red-600` and
  hand-built spacing instead of a native message.
- `DetailService.club` called `resource.value()`, which throws in the error state.

## Approach

- Federation id becomes a native secondary `p-tag`, as in the player and competition heroes.
- Localize season, members, Share and Follow in nl/fr/en (`all.club.detail.*`); wrap the actions row; replace the inline
  select width with `min-w-30` and give the select a localized accessible name.
- Loading becomes `p-progressbar mode="indeterminate" class="h-1"`; error a native `p-message severity="error"`.
- Guard `DetailService.club` with `hasValue()` so the error state can render.
- The page SCSS stays: the unchanged stats strip still uses its win/loss helpers.

## Checklist

- [x] Confirm the mounted consumer and smallest slice.
- [x] Replace the hand-built id chip and error/loading markup with native components.
- [x] Localize season, members, Share and Follow in three locales.
- [x] Season select: native width utility, accessible name.
- [x] No numbered palette utilities, hex colors or new SCSS.
- [x] Lint and build pass.
- [x] Browser check of the loaded hero: dark and light, wide (1280px) and 390px.
- [x] Error state checked (dark, narrow; native message renders).
- [ ] Keyboard/focus and contrast checks.
- [ ] French/English copy.

## Verification

- **Passed:** `NX_DAEMON=false npm exec nx -- run-many --target=lint,build --projects=frontend-pages-club`
  (12 tasks succeeded).
- **Passed (browser, dark, narrow pane):** with the API unreachable the page now shows a native `p-message` error
  (`An error occurred`) and no stuck progress bar. Before the `hasValue()` guard this state could not render.
- **Passed (browser, Dutch, `smash-for-fun`, after the API returned):** dark and light at 1280px and 390px show a
  secondary `#30076` tag, `BE-VOV`, `Seizoen 2026`, `140 leden`, and `Delen`/`Volgen`. At 390px the metadata wraps to
  a second line, the season select sits full width above the buttons, and `scrollWidth` equals `clientWidth` (390).
  The season select exposes `aria-label="Selecteer seizoen"`. Light mode was checked by removing the `dark-theme`
  class (not through the theme toggle). The baseline (before) screenshot showed the old chip and English
  `Share`/`Follow`.
- **Not verified:** keyboard focus order, contrast measurements, French/English copy, season-change behavior,
  tests (the project has no spec for this page), hydration.

## Remaining action

- None. DR-012b (hero stats strip) is the next candidate, not started.

## Approval

- The user approved completion with `commit` on 2026-11-11. Status is Done with the unchecked limits accepted
  (keyboard/focus, contrast, French/English copy, tests).

## Discoveries

- `Share` and `Follow` have no click handlers; they are inert buttons. Left unchanged.
- The whole page is replaced by the progress bar whenever the club resource reloads (e.g. a route change), because
  `loading()` gates the template. Not changed here.
