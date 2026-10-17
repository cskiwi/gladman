---
title: 'DR-005a: Tier badge'
description: 'Migrate the shared ranking tier badge to native PrimeNG styling.'
---

## Identity and outcome

- ID: DR-005a; status is tracked in the [backlog](../backlog.md).
- Parent: [DR-005](../backlog.md#work-registry), shared ranking and status patterns.
- Dependencies: none identified.
- Projects: `frontend-components`, `frontend-pages-player`, and
  `frontend-pages-tournament`.
- Rules: [design refresh plan](../README.md).

Replace the tier badge's custom gradient and clipped shape with an appropriate
native PrimeNG tag treatment. Preserve its content and public component API.

## Scope

- Component: [TypeScript](../../../libs/frontend/components/tier-badge/src/tier-badge.component.ts),
  [template](../../../libs/frontend/components/tier-badge/src/tier-badge.component.html),
  and [focused spec][badge-spec]. The obsolete component stylesheet was removed.
- Existing consumers:
  [encounter card](../../../libs/frontend/components/games/encounter-card/src/encounter-card.component.html),
  [recent games](../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.html),
  [match row](../../../libs/frontend/components/match-row/src/match-row.component.html),
  [player strongest matchups][strongest-matchups] (`player-strongest-matchups.component.html`),
  and [tournament draw games][draw-games] (`draw-games.component.html`).
- Preserve selector and inputs: `level` accepts a number or string, `label` is
  optional, and `size` retains `default` and `sm` behavior.
- Preserve displayed values, including the optional label before the level; do
  not change match, ranking, or tournament data.
- Exclusions: other ranking/status components, consumer-page redesigns, and
  global theme or color-token changes. Keep `--g-gradient-rank`: it has other
  consumers outside this badge.

## Baseline and proposed approach

- Source baseline: a clipped parallelogram with gradient border/text and
  `--p-content-background` inner fill. Existing small badges measured 28x22px.
  Narrow/wide dark before screenshots were inspected; a light before screenshot
  was not captured. The component had no dedicated spec.
- PrimeNG Tag's installed API has no size or `styleClass` input. It supports
  `value` and scoped `dt` tokens. Keep its theme-aware primary fill, use
  semantic `{text.color}` for the light-mode label, and retain the brighter
  cyan primary label in dark mode. Keep scoped size tokens and Tailwind widths.
- Keep the `app-tier-badge` abstraction because it preserves a real shared
  contract across the listed consumers. Remove its bespoke stylesheet only
  after confirming the old selectors are local to this component.
- The final template has one native Tag and one conditional minimum-width class;
  scoped `dt` tokens provide light-mode label contrast, 700 weight, compact
  sizing, and 4px radius without a replacement stylesheet; dark mode retains
  the cyan primary label. `min-w-10` yields 35px for `default`, one pixel below
  the former 36px minimum. The global `--g-gradient-rank` token remains for
  other consumers.

## Implementation checklist

- [x] Confirm the component, inputs, and all production consumers.
- [x] Preserve the component API and rendered label/level values.
- [x] Replace the custom visual with native PrimeNG styling and remove only
  proven-unused local styles.
- [x] Check all five consumer call sites without changing their data or behavior.
- [x] Record consumer-coverage limits and the unused match-row consumer below.

## Acceptance and verification

- [x] Native PrimeNG tag options provide the appearance; no custom gradient,
  clipping, palette color, or styling workaround is added.
- [x] Focused component tests cover numeric/string levels, optional label, and
  both `default` and `sm` sizes.
- [x] Existing call sites compile unchanged across encounter cards, recent
  games, match rows, strongest matchups, and tournament draw games.
- [x] Light/dark appearance is verified for the populated player-route
  consumers. Other live consumer groups lack badge data or a mounted caller and
  are recorded below as coverage limits, not visual passes.
- [x] The badge remains readable content, not a keyboard-focusable control; its
  visible text remains available to assistive technology.
- [x] No unrelated ranking data, permissions, translations, routes, or theme
  behavior changes; the global gradient token remains for other consumers.
- [x] Relevant Nx test, lint, and build targets pass. Available owning targets:
  `frontend-components` (test/lint/build), `frontend-pages-player`
  (test/lint/build), and `frontend-pages-tournament` (test/lint/build).
- [x] User requested marking DR-005a Done after reviewing the updated badge.

## Evidence and handoff

- Before evidence: source inspection and isolated old-badge screenshots at
  390px and 1280px in dark mode; both measured 28x22px. The old badge used the
  rank gradient and clipped shape. No personal data was captured in the crops.
- After evidence: integrated browser on `/players/glenn-latomme`; 34 recent-game
  badges rendered. In light and dark themes each measures 28x21.84px with no
  clip path; label contrast is 16.05:1 light / 8.70:1 dark against the tinted
  badge over its game-row surface. Visible text remains non-focusable. The
  preview was restored to dark mode at 1487x1252.
- Other consumer routes: player detail visibly covers recent games (34 badges)
  and strongest matchups (1). Club team detail showed 16 encounter cards but no
  badges; club schedule showed 120 encounter cards but no badges; the selected
  tournament poule had no player levels and no badges. The match-row component
  has no production import. All owning packages nevertheless build unchanged.
- Changed scope: shared tier-badge TypeScript/template/spec; removed its local
  SCSS. No consumer source, global token, dependency, or data changed.
- Utility/style comparison: replaced the clipped custom wrapper and component
  stylesheet with one native `p-tag`, one conditional `min-w-8`/`min-w-10`
  utility, and scoped Tag design tokens for theme-aware text color, font weight,
  radius, font size, and padding. The legacy default minimum width was 36px;
  standard `min-w-10` resolves to 35px here.
- **Passed:** `NX_DAEMON=false npm exec nx run frontend-components:test --
  --runInBand --testPathPatterns=tier-badge.component.spec.ts --output-style=static`;
  3 tests passed.
- **Passed:** `NX_DAEMON=false npm exec nx run-many --
  --targets=lint,build --projects=frontend-components,frontend-pages-player,frontend-pages-tournament
  --output-style=static`; all targets passed. Components/player lint reported
  existing warnings only (32 and 17 respectively); tournament lint was clean.
  11 of 15 tasks were served from cache.
- Visual review: user requested marking DR-005a Done after reviewing the
  theme-aware player-route badge. Unavailable consumer examples remain documented
  coverage limits; they are not reported as visual passes.
- Reusable-pattern decision: native PrimeNG Tag within the existing domain
  component, using its default primary palette and local `dt` tokens for light
  label contrast and sizing.
- Exceptions: unavailable populated consumer examples are recorded as coverage
  limits; no visual pass is claimed for those routes.
- Remaining work: none for DR-005a. Scope any additional consumer coverage as a
  separate future task.
- Next action: none. DR-005a is Done at the user's request.

[strongest-matchups]: ../../../libs/frontend/pages/player/src/pages/detail/components/player-strongest-matchups/
[draw-games]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/components/
[badge-spec]: ../../../libs/frontend/components/tier-badge/src/tier-badge.component.spec.ts
