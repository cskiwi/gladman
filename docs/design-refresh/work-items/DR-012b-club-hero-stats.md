---
title: 'DR-012b: Club hero stats strip'
description: 'Refresh the club detail hero stats strip with the shared hero stat pattern, native tags and localized copy.'
---

## Identity

- ID: DR-012b; parent [DR-012](../backlog.md). Status is authoritative in the [backlog](../backlog.md).
- Area: the `[stats]` slot of the hero on the mounted `/clubs/:clubId` page (`app-page-detail` in
  `frontend-pages-club`).
- Dependencies: completed [DR-012a](DR-012a-club-page-chrome.md) hero chrome and the competition/tournament hero stats
  pattern (`DR-015d`, tournament detail). No shared component change is required.
- Design rules: [design refresh plan](../README.md).

## Scope

- Project: `frontend-pages-club`; folder `pages/detail/` (`page-detail.component.*`).
- Four stats: teams active (with league count), season record (with win rate), club ranking (placeholder) and next
  home match. Replace the `t-eyebrow` labels, the gradient/oversized `app-hero-stat-value`, the hand-built win/loss
  badge and the hard-coded English copy.
- Preserve the data (`DetailService` selectors), the responsive 2/4 column grid and the hero border separator.
- Exclude the tabs and panels, the sidebar cards, shared hero components, the `DetailService` queries, and the
  team-detail hero (separate page, same legacy pattern).

## Baseline

- Labels use the all-caps `t-eyebrow` class; values use `app-hero-stat-value` (display font, gradient on `rank`).
- `Teams active`, `across N leagues`, `Season record`, `% wins`, `Club ranking`, `Next home match`, `vs` and
  `No upcoming home matches` are hard-coded English.
- The win-rate badge is hand-built with `text-win`/`bg-win-muted` page SCSS helpers; the next match uses a mini calendar
  block with arbitrary sizes (`min-w-[44px]`, `text-[10px]`, `text-[11px]`) and `t-mono`.
- The strip adds `relative z-[1]`.

## Approach

- Use the agreed hero stats pattern: `text-sm text-muted-color` label, `text-2xl font-semibold tabular-nums` value.
- Win rate becomes a native `p-tag` (`success` at or above 50%, otherwise `danger`).
- Next home match becomes teams line plus a muted localized date/time line; no mini calendar.
- Localize all copy in nl/fr/en under `all.club.detail.stats.*`.
- Remove the page SCSS (only win/loss helpers and the host layout); the host layout moves to `host: { class }`.
- `HeroStatValueComponent` loses its last application consumer; it stays exported and is recorded for DR-029.

## Checklist

- [x] Confirm the mounted consumer and smallest slice.
- [x] Replace eyebrow labels, `app-hero-stat-value` and hand-built badge with the agreed stat pattern and native Tag.
- [x] Localize the stat copy in three locales (`all.club.detail.stats.*`; `i18n.generated.ts` edited by hand to match).
- [x] No numbered palette utilities, hex colors, arbitrary values or new SCSS; page SCSS removed.
- [x] Lint and build pass.
- [x] Browser check of the loaded strip: dark wide, light wide and light 390px (dark 390px not checked).
- [ ] Keyboard/focus and contrast checks.
- [ ] French/English copy.

## Verification

- **Passed:** `NX_DAEMON=false npm exec nx -- run-many --target=lint,build --projects=frontend-pages-club` (12 tasks
  succeeded). Prettier run on all changed files.
- **Passed (browser, Dutch, `smash-for-fun`, servers restarted):** the strip shows `Actieve teams 9 / in 3 reeksen`,
  `Seizoensbalans 9 – 5` with a native Tag, `Clubranking –`, and `Volgende thuiswedstrijd` with teams and date. Dark
  at 1184px, light at 1184px and light at 390px (2x2 grid) show no horizontal overflow (`scrollWidth` equals
  `clientWidth`). Light mode was checked by removing the `dark-theme` class, not through the theme toggle.
- **Observed, not changed:** the API returns 9 wins, 5 losses and 106 draws (total 120) for this club, so the win rate
  is 7.5% and the Tag is red; the calculation is backend data, unchanged by this slice. The next-match date uses the
  default (English) date locale (`Sat 14 Nov`), as before.
- **Not verified:** dark 390px, keyboard focus order, contrast measurements, French/English copy, tests (the project
  has no spec for this page), hydration.

## Remaining action

- None. DR-012c (club tabs and sidebar cards) is the next candidate, not started.

## Approval

- The user approved completion with `commit` on 2026-11-11. Status is Done with the unchecked limits accepted (dark
  390px, keyboard/focus, contrast, French/English copy, tests).

## Discoveries

- The club ranking stat has no data source (always `–`); it is preserved as a placeholder.
- The next-match date ignores the active UI locale (default `en-US` date pipe); a backlog candidate, left unchanged.
- The club season record counts 106 draws for `smash-for-fun`, so win rate looks implausibly low; a backend data question.
