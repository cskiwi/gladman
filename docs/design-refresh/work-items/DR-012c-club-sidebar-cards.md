---
title: 'DR-012c: Club sidebar cards'
description: 'Replace the three legacy club-detail sidebar cards with native PrimeNG components and localized copy.'
---

## Identity

- ID: DR-012c; parent [DR-012](../backlog.md). Status is authoritative in the [backlog](../backlog.md).
- Area: the `<aside>` of the mounted `/clubs/:clubId` page (`app-page-detail`, `page-detail.component.html`).
- Dependencies: completed [DR-012a](DR-012a-club-page-chrome.md) and [DR-012b](DR-012b-club-hero-stats.md); the
  [DR-008b](DR-008b-player-sidebar-cards.md) sidebar pattern (native `p-card`, `p-tag`, `p-progressbar`, nl/fr/en copy).
- Design rules: [design refresh plan](../README.md).

## Scope

- Project: `frontend-pages-club`; folder `components/`.
- `app-club-schedule-card` (upcoming fixtures) and `app-club-top-performers-card`. Each keeps its own data resource and
  query. `app-club-info-card` was in scope but removed at the user's request (see Review feedback).
- Exclude the tabs (DR-012d to DR-012h), `app-team-card`, `app-team-filter-bar`, team-builder components, queries,
  shared hero components and the page template (the three consumers stay unchanged).

## Consumers

- All three cards have a single mounted consumer: `page-detail.component.html` lines 193-195 (`/clubs/:clubId`).

## Baseline

- Each card is a hand-built `<section class="g-card">` with `:host`/`.g-card` SCSS; its border color equals its
  background (`var(--p-content-background)`), so there is no visible border.
- Legacy `t-eyebrow`, `t-body-sm`, `t-mono`, `g-kv`, `sched__*`, `perf-row__*` classes, Space Grotesk/Inter/JetBrains
  Mono font stacks, `--g-win` palette token and `text-transform: uppercase` micro-labels.
- All copy is hard-coded English (`Club info`, `Federation`, `Upcoming · Club`, `No upcoming fixtures.`, `Loading…`).
- The schedule card's `All ↗` link is a self `routerLink="."` with fragment `schedule`; nothing handles that fragment.
- The top-performers link targets `/player/:slug`, but the mounted route is `/players/:slug`
  (`apps/app/config/app.routes.ts`), so the link is broken.

## Approach

- Native `p-card` with a `header` for each card, `p-progressbar` (indeterminate) for loading, `p-tag` for the win rate.
- Schedule: list of fixtures with a time rail (bold time, muted `dd/MM` date) beside home over away, as in the live
  game card; drop the dead `All ↗` link.
- Top performers: list with player link, record and a success/danger Tag for the win rate; no rank numbers.
- Fix the player link to `/players/:slug`.
- Localize all copy in nl/fr/en under `all.club.detail.sidebar.*`; `i18n.generated.ts` is edited by hand to match, as in
  DR-012b.
- Remove the SCSS files and their `styleUrl`.

## Checklist

- [x] Confirm the mounted consumer and smallest slice.
- [x] Replace the legacy markup with native components and remove the local SCSS.
- [x] Localize all copy in three locales.
- [x] No numbered palette utilities, hex colors, arbitrary values or new SCSS.
- [x] Lint and build pass.
- [x] Browser check of the loaded cards (see Verification).
- [ ] Keyboard/focus and contrast checks.
- [ ] French/English copy.

## Verification

- **Passed:** `NX_DAEMON=false npm exec nx -- run-many --target=lint,build --projects=frontend-pages-club` (12 tasks
  succeeded, rerun after the review changes). Prettier run on all changed files.
- **Passed (browser, Dutch, `smash-for-fun`, after review changes):** the aside shows two native Cards (`Komende
wedstrijden`, `Beste spelers`); dark wide and light 390px have no horizontal overflow. The first round (before the
  changes) was also checked in dark/light at wide and 390px. Light mode was checked by toggling `dark-theme`.
- **Passed:** top-performer links resolve to `/players/<slug>` (previously the non-existent `/player/<slug>`).
- **Not verified:** light wide and dark 390px after the review changes, loading and empty states, long team names,
  keyboard focus order, contrast, French/English copy, tests (no specs for these cards), hydration.

## Review feedback (2026-11-11)

- Upcoming fixtures needed more work: replaced the one-line `home - away` text with a time rail and stacked
  home/away teams, matching the live game card. The date is numeric (`dd/MM`) because no Angular locale is registered,
  so `EEE`/`MMM` would show English words in the Dutch UI.
- Top performers: the leading rank numbers were removed.
- Club info card: removed from the page, component folder deleted (no other consumer) and its locale keys and generated
  types dropped, because the hero already shows state, club id, season and members. Country is no longer shown anywhere.

## Remaining action

- None. DR-012d (club teams tab) is the next candidate, not started.

## Discoveries

- The schedule card's dead `All ↗` self-link (`routerLink="."` with fragment `schedule`) was removed; no handler existed.
- The fixture date and time use the default (English) date locale (`Sat 14 Nov`), as in the hero (DR-012b).
- The country value is raw backend data (`be`); not changed.
- The remaining two cards each issue their own query, unchanged.

## Approval

- The user approved completion with `commit` on 2026-11-11 after the review changes. Status is Done with the unchecked
  limits accepted (keyboard/focus, contrast, French/English copy, tests, light wide and dark 390px after the changes,
  loading and empty states).
