---
title: 'DR-006b: Player recent-game set scores'
description: 'Native semantic set-score presentation in the existing mounted player recent-games component.'
---

## Identity

- ID: DR-006b; parent DR-006 remains open. Status is authoritative in the [backlog](../backlog.md).
- Dependencies: completed DR-001, DR-004, and DR-006a. Rules: [design refresh](../README.md).

## Scope

- Project: `frontend-components`; [player recent-games template][template] and its existing rendering tests.
- Existing consumer: recent-games dispatcher, mounted only on `/players/:playerId` in player detail.
- Replace only set-score presentation, preserving player-relative sides, set order, ties, played zero scores,
  and omission of missing/unplayed sets. No public API or calculation changes.
- Exclude result bands, article/card layout, metadata, filters, points, loading/error states, services, team games,
  and unused match-row. No global theme, dependencies, or SCSS changes.

## Baseline and proposed approach

- Clean worktree at selection on 2026-10-17. Mounted route has ten articles and 50 legacy score spans.
- Six duplicated score branches use legacy `g-win` color and muted text; six static `text-base` classes,
  twelve conditional color bindings, plus custom typography/spacing in the score wrapper.
- Hypothesis: existing `isSetPlayed`/`getSetWinner` calculations plus native success/secondary Tags preserve
  numbers and ordering while removing the score-specific legacy palette. A winning check icon avoids color-only meaning.
- Cheap falsification: rendering tests for both player sides, three sets, ties, missing/unplayed sets, and played zero.
- Reuse existing TagModule; verify documented Tag value, severity, icon, and noninteractive accessibility behavior.
- Original browser: player route, dark document class, 1487x1252 viewport. Do not persist fixture changes.

## Implementation checklist

- [x] Confirm bounded scope, dependencies, existing import, and production consumer.
- [x] Replace six score branches with a paired-set loop and native Tags.
- [x] Preserve score calculations, player orientation, and existing point Tags.
- [x] Record utility comparison and out-of-scope discoveries.

## Acceptance and verification

- [x] Focused tests cover both sides, ordered sets, ties, missing/unplayed sets, and played zero.
- [x] No new custom palette, SCSS, inline styling, dependencies, or global changes.
- [x] Mounted score Tags fit at 390px/1280px in light/dark, with contrast and non-color result meaning checked.
- [x] Existing links retain visible keyboard focus; score Tags add no tab stop.
- [x] Relevant Nx test/lint/build and SSR results are recorded separately.
- [x] User approved completion on 2026-10-17 with the light/mobile screenshot limit retained.

## Evidence and handoff

- PrimeNG Tag API verified via component metadata: value, success/secondary severity, icon; no interactive content.
- Changed only score markup and the existing component spec, alongside this brief and the backlog.
  Reused existing helpers and TagModule; no TypeScript implementation, service, route, or translation changes.
- Source utility comparison within the inner score block: 22 static utility tokens and 12 conditional color
  bindings become seven static layout/numeric tokens and zero custom color bindings. Six score branches become
  one side loop and one paired-set loop; native Tag severity and icon own appearance. No new wrapper component.
- Passed commands on 2026-10-17:

  ```bash
  NX_DAEMON=false npm exec nx run frontend-components:test -- --runInBand --testPathPatterns=recent-games-player.component.spec.ts --output-style=static
  NX_DAEMON=false npm exec nx run frontend-components:lint -- --output-style=static
  NX_DAEMON=false npm exec nx run frontend-components:build -- --output-style=static
  ```

- Nine tests pass: four existing point cases and five score cases. Both player sides preserve ordered values,
  winning success severity/check icon, and neutral secondary scores; played zero remains visible, 0-0 and
  incomplete sets remain omitted, and tied scores remain neutral. Test service is mocked, with no network request.
- Initial lint passed with 34 warnings including two new test assertions; those assertions were replaced and
  tests rerun (nine pass). Final lint has zero errors and only the 32 existing warnings outside this patch.
  Library build and eight prerequisite tasks pass (eight prerequisite cache hits). Existing Nx executor and
  ts-jest metadata deprecation warnings remain. Editor diagnostics: no errors in the template or test.
- Mounted before evidence: ten articles, 50 legacy score spans; first displayed columns were 21/10/20 and
  19/21/22. After values match; all 50 scores use native Tags, with 25 winning check icons.
- DOM checks at 390px/1280px in both themes: all 50 Tags remain inside their score panel and viewport,
  no horizontal page overflow, and zero added tab stops. Winner icons remain present in all cases.
- Settled, alpha-composited text contrast: success 4.57:1 light / 9.74:1 dark; secondary 7.74:1 light /
  9.51:1 dark. Finite transitions were completed before reading styles. Browser-memory canvas only, no CSS edits.
- Keyboard: focus an existing game link, then Tab; focus remains on a native game anchor with `:focus-visible`
  true and native `auto` outline. Score Tags remain noninteractive. No full screen-reader audit is claimed;
  numeric comparison and visible check icons supply non-color winner meaning.
- SSR: read-only fetch of the same player route returns HTTP 200 with 50 score Tags and 25 winner icons in
  parsed server HTML. No authenticated SSR or exhaustive hydration pass is claimed. The previously recorded
  transition-aborted console error recurred on reload and remains outside this slice.
- Pixel evidence: dark desktop article capture correctly showed the native score Tags and was inspected.
  The subsequent light/mobile capture showed stale dark desktop content cropped at mobile width despite correct
  DOM/theme checks. No light/mobile pixel pass is claimed; session-only images are not committed.
- Responsive list discovery: normal breakpoint handling refreshed the list to five articles during browser checks;
  returning to desktop did not restore ten within a ten-second wait (timed out). A read-only reload at the original
  desktop size restored ten articles and 50 score Tags. No service or pagination changes were made; backlog records
  this separately, and responsive pagination, load-more, loading/empty/error states were not validated here.
- Browser restored: original player route, dark class, 1487x1252 viewport, ten articles and real data. No fixtures
  were used, no preference was persisted, and no backend/account mutation was performed.
- Review outcome: user explicitly requested "Approve & commit" on 2026-10-17 after the light/mobile screenshot
  limit was disclosed. Completion is accepted with that limit, not an unperformed light/mobile pixel pass.
  Backlog status is Done. Next invocation: scope one mounted-player result-band child, not unused match-row;
  keep parent DR-006 open and do not start that implementation in this invocation.
- Exceptions: none. Do not remove global result tokens while the excluded result bands still consume them.

[template]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.html