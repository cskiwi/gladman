---
title: 'DR-006e: Player recent-game loading presentation'
description: 'Native PrimeNG loading placeholders in the mounted player recent-games list.'
---

## Identity

- ID: DR-006e; parent DR-006 remains open. Authoritative status: [backlog](../backlog.md).
- Dependencies: completed DR-006a through DR-006d. Rules: [design refresh](../README.md).

## Scope

- Project: `frontend-components`; mounted `/players/:playerId` recent-games initial/loading-more placeholders.
- Sources: [template][template], [component][component], and [existing tests][tests]; player dispatcher is the consumer.
- Preserve six initial placeholders, three loading-more placeholders, loaded games, and native load-more behavior.
- Exclude services, pagination/breakpoint logic, filters, populated cards, empty/error behavior, and global styling.
- No dependencies, stylesheet changes, or new shared components.

## Baseline and proposed approach

- Clean worktree on 2026-10-17; prior slices are implemented and recorded as approved.
- Both loading branches duplicate legacy `g-card`, `g-card__band`, and `g-card__right` markup with fixed text widths.
- Hypothesis: a local reusable native Card/Skeleton template preserves six/three counts and loading transitions
  while removing the legacy surface and fitting the mounted narrow list.
- Cheap falsification: existing component tests extended with initial/append/settled states and native Card counts.
- Use percentage Skeleton widths, minimal flex layout, native Card surface/border, and a named busy section.
- Keep the existing host stylesheet: its block display remains used and is outside this slice.

## Implementation checklist

- [x] Confirm mounted consumer, clean worktree, dependencies, and bounded scope.
- [x] Replace duplicate legacy placeholders with native PrimeNG presentation.
- [x] Preserve loading transitions, loaded results, and pagination controls in focused tests.
- [x] Record utility comparison, browser evidence, validation, and discoveries.

## Acceptance and verification

- [x] Initial loading shows six native Cards with decorative Skeletons and an accessible busy section.
- [x] Loading more keeps loaded games/controls and appends three placeholders; settled state removes them.
- [x] Light/dark at 390px/1280px fit without horizontal overflow or focusable decorative placeholders.
- [x] Existing filter, result, point, score, and empty-state tests pass.
- [x] Settled SSR output and existing Nx lint/build/test checks pass; loading SSR is not verified.
- [x] No new CSS, non-semantic colors, dependencies, or global changes.
- [ ] Actual light/mobile pixels are inspected; the screenshot tool returned a stale dark desktop frame.
- [x] User explicitly approved completion on 2026-10-17 with the disclosed verification limits retained.

## Evidence and handoff

- Changed scope: only this component's template, its `NgTemplateOutlet` import, and existing test file.
  No new public API, shared wrapper, locale key, stylesheet, dependency, or global theme change.
- Before: browser-memory loading flags on `/players/glenn-latomme` produced six legacy initial `g-card`
  placeholders and three appended placeholders with ten real articles retained. Desktop host width: 962.5px
  at the original 1487px viewport; no initial host overflow. Flags were restored before implementation.
- After: one local `ng-template` shares the meaningful placeholder structure between both states. The existing
  translated heading names the busy section; PrimeNG Skeletons provide `aria-hidden="true"` natively.
  Text placeholders use percentage widths inside a shrinking flex column; score placeholders retain native sizes.
- Utility comparison: duplicate Skeleton declarations drop from ten to five. The two legacy blocks authored ten
  class tokens total, including six legacy `g-card*` tokens. The one native template authors seventeen tokens
  (including two semantic border tokens): layout now explicitly handles section spacing, flexible text, and fixed
  scores. This is a justified layout increase, not a claim of fewer utilities. No hidden stylesheet replacement.
- Passed commands on 2026-10-17:

  ```bash
  NX_DAEMON=false npm exec -- nx show project frontend-components --json
  NX_DAEMON=false npm exec -- nx run frontend-components:test --runInBand --testPathPatterns=recent-games-player.component.spec.ts --output-style=static
  NX_DAEMON=false npm exec -- nx run-many --targets=lint,build --projects=frontend-components --output-style=static
  git diff --check
  ```

- Focused tests: 26 pass (24 retained cases plus initial-loading/settled-empty and loading-more/settled-game cases).
  Verify six/three native Cards, 30/15 hidden Skeletons, heading association, no decorative focus targets,
  no premature empty message, retained games/filter, and loading/settled native load-more button disabled state.
  Services are mocked; no test network calls.
- Library lint: zero errors, 32 existing warnings. Library build passes, with eight cached prerequisite tasks.
  Existing Nx executor/ts-jest warnings remain. Template/test editor diagnostics are clear; existing component
  readonly/Set advisories concern unchanged code and were not expanded into this slice.
- Mounted browser matrix: both initial and append states checked at 390px and 1280px in light and dark (eight cases).
  Every initial state has six Cards/30 Skeletons; every append state has three Cards/15 Skeletons and ten articles.
  Section widths are 347px mobile and 905.5px desktop. No page overflow, escaped Skeleton bounds, or focusable
  placeholder descendants. All Skeletons are hidden and all sections reference the translated heading.
- Native colors: light Cards `oklch(1 0 0)`, Skeletons `oklch(0.93 0.008 250)`; dark Cards
  `oklch(0.17 0.02 250)`, Skeletons `rgba(255, 255, 255, 0.06)`. These are observed preset outputs, not authored
  colors. Decorative placeholders carry no text or interactive meaning; no text-contrast claim is needed for them.
- Screenshot evidence: selector capture timed out waiting for stability. A subsequent viewport capture correctly
  showed all six dark desktop native loading Cards. Light/mobile capture returned that same stale desktop/dark
  frame despite the measured 390px/light DOM. No light/mobile pixel pass is claimed; obtain actual visual review.
- SSR: read-only same-origin fetch of `/players/glenn-latomme` returned HTTP 200, translated heading, ten settled
  articles, and no loading Skeletons/legacy cards. The browser request-context API failed with
  `Storage.getCookies: Method not found`; browser fetch succeeded. Loading SSR, screen-reader announcements,
  exhaustive hydration, alternate locales, and real network-delayed pagination were not verified.
- Browser checks use temporary component loading-function replacements only, leaving services/data untouched.
  They demonstrate mounted presentation, not end-to-end pagination behavior. After restoration and a read-only
  reload: original route, dark class, 1487x1252 viewport, ten articles, no busy section, no fixture globals.
  No preference writes, account operations, backend mutations, or server changes; existing server is on port 3000.
- Reusable decision: use a local template for duplicate initial/append placeholders; do not create a shared wrapper
  or change global legacy `g-card` rules still used elsewhere. PrimeNG documentation confirms native decorative
  Skeleton semantics and grouped `aria-busy` support. No new unrelated discovery or backlog expansion.
- Exceptions: none.
- Review outcome: user requested "Approve and commit" on 2026-10-17 after the light/mobile screenshot and SSR limits
  were disclosed. This accepts completion with those limits; the light/mobile pixel criterion remains unchecked.
- User also requested persistent workflow rules: refresh only components actually used by the application, and
  treat DR approval as authorization to commit it. Both the continuation prompt and design rules now record these.
- Exact next action: scope mounted player upcoming-game card presentation as a separate DR-006 child, confirming
  its real consumer and preserving data/actions/pagination. Keep DR-006 open; no second slice was started here.
- Commit authorized by explicit user request; include this slice and the requested workflow updates together.

[template]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.html
[component]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.ts
[tests]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.spec.ts