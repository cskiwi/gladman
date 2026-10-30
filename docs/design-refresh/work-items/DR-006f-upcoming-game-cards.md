---
title: 'DR-006f: Player upcoming-game cards'
description: 'Native PrimeNG populated encounter cards in the mounted player upcoming-games list.'
---

## Identity

- ID: DR-006f; parent DR-006 remains open. Authoritative status: [backlog](../backlog.md).
- Dependencies: completed DR-006e; follow the [design rules](../README.md).

## Scope

- Project: `frontend-components`; populated upcoming games on `/players/:playerId`.
- Real consumer: [player detail][consumer] mounts the upcoming dispatcher with `type="player"`.
- Owning [template][template] and [component][component] compute presentation and assembly destinations.
- Preserve dates, draw/team destinations and fallbacks, home/away labels, assembly query parameters, and order.
- Show at most three encounters initially; an outlined translated control expands all fetched encounters
  and collapses back to the initial three.
- Exclude header, loading/empty states, services, pagination, team dispatcher branch, and global styling.
- Existing SCSS remains needed by loading placeholders; do not remove it as part of populated-card work.

## Baseline and proposed approach

- Clean worktree on 2026-10-17; preceding approved slices are present.
- Populated cards use a three-column custom `.upcoming` grid with a decorative primary stripe, fixed date column,
  custom radius, uppercase letter-spaced day, and an inline font declaration. The action cannot wrap independently.
- Hypothesis: native Card plus a responsive flex layout preserves content and navigation without narrow overflow.
- Cheap falsification: focused Angular rendering tests for populated/fallback cards and assembly destinations.
- Use native Card surface/border, semantic text, ordinary date typography, and native Button icon/label inputs.
- Keep shared component APIs and theme unchanged; no new dependencies or styling exception.

## Implementation checklist

- [x] Confirm mounted consumer, clean worktree, dependencies, and bounded scope.
- [x] Replace populated custom surfaces while preserving translated content and navigation.
- [x] Add focused rendering and destination regression tests.
- [x] Show three games by default with an outlined expand/collapse control.
- [x] Record utility comparison, browser evidence, validation, and discoveries.

## Acceptance and verification

- [x] Populated encounters use native Cards; links, fallbacks, date, and home/away content remain available.
- [x] Assembly links retain encounter/team/club/season parameters, including unmatched-team behavior.
- [x] The initial view shows at most three cards; View All and View Less expand and collapse fetched cards.
- [x] Light/dark at 390px/1280px preserve readable content without horizontal overflow.
- [x] Keyboard/focus and translated action names are verified; ordinary card text exceeds 4.5:1 contrast.
- [x] Loading and empty branches remain unchanged; focused tests cover their rendering.
- [x] Focused upcoming-games spec passes; Nx lint/build pass; SSR and hydration limits are recorded honestly.
- [ ] Full `frontend-components` test target is clean; six unrelated bracket-tree failures remain and
      were accepted as a disclosed limit.
- [x] No new CSS, non-semantic colors, dependency, or global change; utility changes are explained.
- [x] Actual dark desktop and light mobile pixels are inspected.
- [x] User visual review is obtained before completion or propagation; approval recorded 2026-10-21.
- [ ] Actual assembly navigation, alternate locales, exhaustive hydration, and screen-reader output are verified.

## Evidence and handoff

- Changed scope: populated template branch, CardModule import, and a new adjacent focused spec because no upcoming
    component test existed. No public API or service changes. The mounted dispatcher/player-detail consumers remain.
- Before: `/players/glenn-latomme` rendered ten real `.upcoming` encounter surfaces at 1487x1252 in dark mode;
    host width 962.5px, no desktop overflow. Before screenshot showed primary stripes and custom date typography.
- After: native Card surface, border, and spacing; date row becomes a column at `sm`, identity text wraps, and
    the native outlined secondary assembly action moves below the details on mobile. Button uses native icon/label
    inputs instead of styled icon content. Existing draw Tags and router destinations remain unchanged.
- Authored populated class tokens: 36 before, 43 after. Five legacy `upcoming*`/`t-mono` tokens and the inline font
    declaration are removed. The increase explicitly supplies responsive layout, shrinkable details, wrapping names,
    semantic typography, and Card separation formerly hidden in SCSS; it is not a claim of fewer utility tokens.
- Existing local SCSS remains for excluded loading markup; populated cards no longer consume its custom surface.
- Passed commands on 2026-10-17:

    ```bash
    NX_DAEMON=false npm exec -- nx show project frontend-components --json
    NX_DAEMON=false npm exec -- nx run frontend-components:test --runInBand --testPathPatterns=upcoming-games-player.component.spec.ts --output-style=static
    NX_DAEMON=false npm exec -- nx run-many --targets=lint,build --projects=frontend-components --output-style=static
    git diff --check
    ```

- Six tests pass: native Card/date/team/draw rendering and destination trees; home/away assembly parameters and
    labels; missing metadata/abbreviation fallbacks; unmatched teams; unchanged three loading placeholders with
    eighteen Skeletons transitioning to the existing empty message. Services are mocked; no test network calls.
- Library lint: zero errors, 32 pre-existing warnings, including existing unused imports in this component.
    Library build passes, with eight cached prerequisite tasks. Existing Nx executor and ts-jest warnings remain.
    Template/test editor diagnostics are clear. No unrelated warnings were repaired.
- Mounted matrix: ten real Cards and zero legacy populated surfaces at 390px/1280px in light/dark (four cases).
    Host widths 347px/905.5px; no host/page overflow and no links/buttons outside host bounds. All ten assembly
    buttons retain their translated accessible text. Card backgrounds are observed preset white in light and
    `oklch(0.17 0.02 250)` in dark, not authored colors.
- Settled ordinary card text contrast: minimum 4.87:1 light, 6.65:1 dark (canvas conversion of computed colors).
    This measurement excludes native draw-Tag contrast against its own background; its appearance is unchanged.
- Keyboard: Tab from the draw reaches the home-team link with a visible browser outline. Tab from the away-team
    link reaches the existing focusable `p-button` host with a visible outline; the inner native button is also
    programmatically focusable and named. No real assembly navigation or full keyboard-activation pass is claimed.
    The pre-existing host/inner-button tab-stop behavior is deferred in the backlog, not introduced by Card styling.
- Screenshots: dark desktop native Cards and current light mobile white Cards were inspected. Mobile shows wrapped
    content and action below, without clipped names; the sticky shell occludes part of the first card in the capture.
    Unlike earlier slices, the light/mobile capture is current. Opposite theme/viewport pairs have geometry evidence,
    not independently inspected screenshots. No screenshot fixture or test account was needed.
- Settled same-origin SSR fetch: HTTP 200 with ten native Cards, ten assembly actions, date text, and no legacy
    populated surfaces. This is not an exhaustive hydration, loading SSR, alternate-locale, or screen-reader pass.
- Browser restoration: read-only reload on the original player route with dark class and 1487x1252 viewport;
    ten populated upcoming Cards. No component replacements, fixtures, preference writes, or backend mutations.
    The existing server remains available at `http://localhost:3000/players/glenn-latomme`.
- Reusable decision: direct native Card and a local responsive layout; no shared wrapper or global styling changes.
    PrimeNG generated Card metadata was consulted; installed APIs are also validated by the package build.
- Exceptions: none. Deferred existing loading styles are not a new styling exception.
- User decision: on 2026-10-21, the user confirmed DR-006f was finished and approved completion after the
    remaining limits were disclosed: six unrelated bracket-tree test failures, real assembly navigation,
    alternate locales, exhaustive hydration, and screen-reader output remain unverified. The unchecked criteria
    above remain unchecked; approval does not claim those checks passed.
- Exact next action: no follow-on implementation in this invocation. On the next invocation, scope the mounted
    upcoming header/loading/empty presentation as a separate child item before implementation.
- Subsequent candidate, not started: scope the mounted upcoming header/loading/empty presentation separately,
    preserving services and addressing native assembly-link semantics only in its own explicitly bounded scope.

[consumer]: ../../../libs/frontend/pages/player/src/pages/detail/page-detail.component.html
[template]: ../../../libs/frontend/components/games/upcoming/src/player/upcoming-games-player.component.html
[component]: ../../../libs/frontend/components/games/upcoming/src/player/upcoming-games-player.component.ts