---
title: 'DR-006c: Player recent-game results'
description: 'Compact accessible results and native card surfaces for mounted player recent games.'
---

## Identity

- ID: DR-006c; parent DR-006 remains open. Authoritative status: [backlog](../backlog.md).
- Dependencies: completed DR-006a and DR-006b. Rules: [design refresh](../README.md).

## Scope

- Project: `frontend-components`; mounted `/players/:playerId` recent-games result indicator and card surface.
- Source: [template][template], [component][component], and [existing tests][tests]. Existing recent-games
	dispatcher mounts this presentation in player detail; unused match-row is unchanged.
- Preserve `didCurrentPlayerWin`, player orientation, translations, links, scores, and compact points-column width.
- User review on 2026-10-17 explicitly added the light card/canvas surface distinction to this same slice.
- Exclude further card/grid redesign, filters, services, pagination, loading skeletons, and unused match-row.
- No global styling, dependency, or API changes.

## Baseline and proposed approach

- Clean worktree on 2026-10-17; mounted player has ten articles with legacy win/loss/primary color-only bands.
- Initial result Tags were rejected: the user disliked their effect on the points-column width.
- Final approach: a compact PrimeIcons result mark in metadata, translated hidden text and native title tooltip;
	retain point Tags alone in their original column. No result color is needed for the explicit check/times/question.
- Existing `bg-emphasis` equals the app canvas in light mode. Native styled Card supplies the correct content
	surface in both themes; documented body passthrough removes extra padding to preserve the existing grid spacing.
- Hypothesis: existing winner calculation preserves win/loss/unknown meaning for either player side.
- Cheap falsification: focused rendering tests for both teams, missing winner, and missing membership.
- Keep grid content placement stable while removing the decorative four-pixel grid track.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, and bounded scope.
- [x] Replace legacy band with compact accessible result icons; preserve points width and adjacent indicators.
- [x] Use native Card surfaces to distinguish light/dark content from the canvas, as requested in review.
- [x] Record utility comparison and discoveries.

## Acceptance and verification

- [x] Focused result and existing point/score tests pass.
- [x] Nx lint/build pass; no new palette, SCSS, dependency, or global changes.
- [x] Mounted light/dark and 390px/1280px result layout and contrast checked.
- [x] Non-color result meaning, keyboard focus, and SSR checked.
- [x] User approved the revised presentation on 2026-10-17 with the recorded verification limits retained.

## Evidence and handoff

- Before DOM: ten mounted articles with three conditional legacy band colors. First before screenshot selector
	matched ten articles; corrected selector timed out waiting for stability. No before pixel baseline was obtained.
- Review history: initial translated success/danger/secondary result Tags passed tests and DOM checks but were
	rejected on 2026-10-17 for widening the points column. The user also requested distinct light card surfaces.
	Initial Tag contrast/SSR evidence is superseded, not proof of the final icon/Card implementation.
- Final source: remove decorative band/track and NgClass; add CardModule and native styled Card per article.
	No new wrapper component or custom style. Card passthrough API/usage validates without issues.
- Utility comparison: remove band `row-span-2`, three conditional palette bindings, and `bg-emphasis`.
	Move existing border/overflow/spacing utilities to Card; native radius/surface replace manual appearance.
	Result adds only `inline-flex`, `shrink-0`, `sr-only`, and PrimeIcons classes. Rejected points-container wrapping
	and gap utilities are removed. One native Card wrapper is justified by the requested theme-aware surface.
	Body `p-0` is a layout passthrough, not a color/style workaround; original article padding remains intact.
- Final passed commands on 2026-10-17:

	```bash
	NX_DAEMON=false npm exec nx show project frontend-components -- --json
	NX_DAEMON=false npm exec nx run frontend-components:test -- --runInBand --testPathPatterns=recent-games-player.component.spec.ts --output-style=static
	NX_DAEMON=false npm exec -- nx run-many --targets=lint,build --projects=frontend-components --output-style=static
	git diff --check
	```

- Tests: six initial red cases exposed the missing explicit result. Final 15 tests pass after the revision:
	win/loss on either team, missing winner/membership, translated hidden result text/title, decorative icons,
	native Card, no result Tag in the points column, and nine retained point/score cases. No test network calls.
- Final lint: zero errors, 32 existing warnings. Library build and eight prerequisite tasks pass (eight cache hits).
	One earlier combined command failed because npm consumed Nx flags; explicit `npm exec -- nx` corrected forwarding.
	Existing Nx executor/ts-jest warnings remain. Final template/test editor diagnostics are clear;
	existing readonly/Set advisories in untouched component logic remain outside scope.
- Revised mounted DOM: ten articles in the initial native-Card matrix; final post-accessibility matrix had five
	after the existing responsive page-size refresh. At 390px/1280px, light/dark: zero result Tags, all icons and scores
	fit, no horizontal page overflow, no added result tab stops, and points cells contain only actual point Tags.
	Right-column widths are 117px or 131px depending on set scores; the `+452` game remains 131px in all four cases.
	This does not verify the deferred responsive pagination behavior or all existing card content.
- Native surfaces resolve to white `oklch(1 0 0)` against light canvas `oklch(0.97 0.005 250)`;
	dark content `oklch(0.17 0.02 250)` against canvas `oklch(0.14 0.02 250)`. Zero Card body padding verified.
	These are computed theme tokens, not authored colors or changes to the preset.
- Result-icon contrast: 4.87:1 light / 6.65:1 dark, alpha-composited through settled ancestor backgrounds.
	Finite animations finished before measuring. Canvas used only in browser memory.
- Check/times icons supply visible non-color meaning; native title and hidden translated `Gewonnen`/`Verloren`
	supply text. Unknown uses the existing `all.common.unknown` key/question icon, covered in tests but not present
	in safe mounted data. Other locales and a full screen-reader audit were not run.
- Keyboard: native game anchor retains `:focus-visible` and native auto outline after Tab.
- Final SSR: HTTP 200 with ten native Cards and ten translated hidden result labels; zero result Tags.
	No authenticated SSR or exhaustive hydration pass is claimed.
- Final dark desktop screenshot correctly shows the compact `+452`-only points header and metadata check icon.
	Final light/mobile attempt again shows stale desktop/dark content cropped to mobile width despite correct DOM
	state. No light/mobile pixel pass is claimed; session-only images are not committed. User approval below accepts
	completion with this limit, not a light/mobile pixel pass.
- Original route, dark class, 1487x1252 viewport, and ten games are restored by read-only reload before handoff.
	No fixture, preference persistence, account operation, or backend mutation was used.
- Filters, services, pagination, loading/empty/error states, permissions, and other consumers remain unchanged;
	no new workflow validation is claimed. Keep global result tokens/skeleton styling for unmigrated consumers.
- Reusable decision: native Card supplies actual content surfaces; `bg-emphasis` is not a card background.
	Keep results out of the points column. The revised presentation has explicit user approval.
- Review outcome: user requested "Approve & commit" on 2026-10-17 after the revised presentation and light/mobile
	screenshot limit were disclosed. Completion is accepted with the recorded coverage limits, not an unperformed pass.
- Exact next action: scope the mounted player recent-games header/filter presentation as a separate DR-006 child;
	preserve filtering, services, and pagination. Do not start that next slice here. Keep DR-006 open.
- Exceptions: none. No dependencies, custom CSS/SCSS, or global changes. Commit explicitly requested by the user.

[template]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.html
[component]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.ts
[tests]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.spec.ts