---
title: 'DR-006a: Player recent-game point indicators'
description: 'Use native PrimeNG ranking-point tags in the mounted player recent-games presentation.'
---

## Identity

- ID: DR-006a; parent: DR-006, which remains open.
- Status: authoritative in the [backlog](../backlog.md).
- Dependencies: completed DR-001 and DR-004; no dependency or global theme changes.
- Design rules: [refresh plan](../README.md).

## Scope

- Project: `frontend-components`.
- Owner: [player recent-games template][template].
- Consumer inventory: `app-recent-games-player` is used only by the recent-games dispatcher, which is mounted only
  on `/players/:playerId` in the player detail template. Workspace template search found no other caller.
- Replace the current player's nonzero ranking-point chip with a native styled PrimeNG Tag.
- Preserve signed formatting, current-player lookup, zero omission, inputs, translations, routes, and pagination.
- Exclude scores, result bands, cards, filters, loading/error states, services, team games, and unused match-row.

## Baseline and proposed approach

- Clean worktree at selection. Source inspection on 2026-10-17 found custom `g-win`/`g-loss` foreground/background
  utilities and nine static chip utility tokens, with no native status component for points.
- Hypothesis: native success/danger Tags can express positive/negative points without custom palette classes,
  while retaining `formatPoints` and the existing nonzero conditional.
- Discriminating check: focused rendering tests for positive, negative, and zero current-player points.
- `TagModule` is already imported; no dependency, wrapper, new SCSS, or public API change is needed.
- Record mounted light/dark and 390px/1280px evidence before completing verification.

## Implementation checklist

- [x] Confirm dependencies, production consumer, and bounded scope.
- [x] Preserve signed values and zero omission using native Tag severity.
- [x] Remove only point-chip custom palette and appearance utilities.
- [x] Check mounted consumer and record out-of-scope discoveries.

## Acceptance and verification

- [x] Positive points render with `+` and success severity; negative points use danger; zero renders no point Tag.
- [x] No new numbered colors, palette pairs, SCSS, inline styling, dependencies, or global changes.
- [x] Mounted Tags fit at 390px/1280px in light/dark; contrast is checked.
- [x] Existing game/player links remain keyboard accessible; Tags introduce no focusable control.
- [x] Focused Nx tests, shared-library lint/build, and relevant SSR check are recorded distinctly.
- [x] User explicitly approved completion on 2026-10-17 with the screenshot coverage limit retained.

## Evidence and handoff

- Before: mounted list had ten articles and one `+452` chip using legacy win tokens. Dark computed foreground was
  `oklch(0.85 0.18 135)` with the same color at 0.16 alpha as background. No player identities/screenshots committed.
- After: the same value uses native `p-tag-success`; a temporary browser-memory method override supplied `-25`
  only where the real value was nonzero, exercising the actual template's `p-tag-danger` branch. Restored immediately
  after the eight theme/width/sign checks; no query, database, account, or stored preference was changed.
- Chip-only utility comparison: nine static classes and four conditional color utilities become zero custom classes.
  Existing `TagModule`, `formatPoints`, player lookup, and the zero conditional are reused unchanged.
- Passed commands, run on 2026-10-17:

  ```bash
  NX_DAEMON=false npm exec nx run frontend-components:test -- --runInBand --testPathPatterns=recent-games-player.component.spec.ts --output-style=static
  NX_DAEMON=false npm exec nx run frontend-components:lint -- --output-style=static
  NX_DAEMON=false npm exec nx run frontend-components:build -- --output-style=static
  git diff --check
  ```

- Focused suite: four tests pass, covering positive/negative severity and sign, zero with nonzero opponent points,
  missing ranking data, and nonfocusable point Tags. Tests mock the existing service; no network requests are required.
  Rerun after making zero/missing cases explicit for editor test discovery: four pass; editor diagnostics clear.
- Lint: zero errors, 32 existing warnings outside the patch. Build: shared package and eight prerequisites pass
  (eight prerequisite cache hits). Existing Nx executor/ts-jest metadata deprecation warnings remain unchanged.
- Mounted consumer: `+452` and temporary `-25` Tags fit their parent and viewport in all eight checks.
  Alpha-composited text contrast: success 4.57:1 light / 9.74:1 dark; danger 5.30:1 light / 8.18:1 dark.
  These are point-Tag checks, not approval of the whole legacy game card or page's mobile layout.
- Keyboard: existing links retain native anchors/hrefs; programmatic focus followed by Tab reaches another game link,
  with `:focus-visible` true and a 1px native outline. Tags are noninteractive, with no added tab stop or overlay.
- SSR: same player URL fetched from the browser returns HTTP 200 and `+452` with `p-tag-success` in server HTML.
  No authenticated SSR or exhaustive hydration check is claimed. Existing transition-aborted console error recurred;
  it is already recorded in the backlog and was not changed in this component-only slice.
- Pixel evidence: initial before screenshot selector matched multiple articles and failed; a later scroll-based
  capture timed out. A no-scroll dark desktop close-up correctly captured `+452` and was inspected.
  The light/mobile close-up captured unrelated content despite correct DOM checks; no light/mobile pixel pass
  or negative-Tag screenshot pass is claimed. Images are session-only and not committed.
- Existing loading/empty/error behavior is outside this presentation-only conditional and will remain unchanged.
- Browser restored to the original player route, dark class, 1487x1252 viewport, and real `+452`; method fixture deleted.
- Exceptions: none. No dependencies, shared theme changes, or SCSS edits. Existing result-band and score legacy
  colors remain deferred to a separately scoped DR-006 child; do not remove their global tokens in this slice.
- Review outcome: user requested "Approve & commit" on 2026-10-17 after the light/mobile screenshot limit was
  disclosed. This accepts completion with that limit, not an unperformed light/mobile pixel pass.
- Next action: scope one further mounted recent-game concern, not the unused match-row. Do not start it here.
  DR-006a is complete; keep DR-006 open for its remaining children.

[template]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.html