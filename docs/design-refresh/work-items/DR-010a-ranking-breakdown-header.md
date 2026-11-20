---
title: 'DR-010a: Player ranking breakdown header'
description: 'Refresh ranking-system context and game-type labeling without changing the breakdown workflow.'
---

## Scope and baseline

- Parent: DR-010. Status: [backlog](../backlog.md). Design rules: [plan](../README.md).
- [DR-029a](DR-029a-legacy-typography.md) identified this mounted consumer; no blocking dependency.
- Project: `frontend-pages-player`. The [player routes][routes] mount the [ranking breakdown][template]
  at `/players/:playerId/ranking/:type`. Confirmed before editing at `/players/glenn-latomme/ranking/single`.
- Dutch dark header screenshot: a tiny all-caps `BBF Rating` above `Punten per wedstrijd`, with the existing
  game-type select and period controls on the right. The select exposes the selected value but no field label.
- Keep the shared hero, breadcrumb, control behavior and loading branch. Exclude period internals, filters,
  game table, simulation, services, player detail, shared components and global styling.

## Acceptance

- [x] One translated page heading precedes normal, theme-aware ranking-system context; no legacy eyebrow.
- [x] The native game-type select has a translated name and still navigates to the selected discipline.
- [x] Header content fits at narrow and wide widths in light and dark.
- [ ] Keyboard focus visibility and text contrast pass in both themes.
- [x] The scope uses existing components, with no new stylesheet, palette colors or unnecessary extraction.
- [x] Relevant Nx lint/build/test results and browser evidence are recorded.
- [ ] User visual review is recorded.

## Evidence and handoff

- The existing hero slots already separate presentation from route logic. The only application edit is
  the ranking template. One legacy helper was replaced by `text-sm text-muted-color`; other header classes
  are unchanged. No new stylesheet, color exception, shared changes, or component extraction.
- Dark-wide before/after header captures show the title first and `BBF Rating` below in normal case.
  The after capture clips the right edge; the responsive checks used DOM bounds, not screenshots.
- At viewport settings of 390px and 1440px (375px and 1440px document widths), the Dutch heading, ranking
  context, select, and period group fit the header in light and dark. Theme class and viewport were restored.
- `Speltype` is exposed in the Dutch accessibility tree. The existing `all.games.gameType` key was confirmed
  in Dutch, English and French assets; English and French were not exercised in the browser.
- Programmatic focus reached the combobox; Space opened the three-option list, Escape closed it, and
  Space/ArrowDown/Enter selected Double and navigated to `/ranking/double`. Restored the Single route.
  No writes or admin actions were performed. Visual focus, full tab order, contrast, other disciplines,
  loading/empty/error scenarios and SSR/hydration were not verified. The browser logged a route-transition
  `InvalidStateError` before and after the edit, but the tested route still rendered.
- The unnamed period icon buttons are pre-existing and recorded under DR-010 for future scoping.
  Keep the global typography helper for the deferred competition qualification branch.

## Validation and resume

With `NX_DAEMON=false` and `NX_NO_CLOUD=true`, the final command passed:

```powershell
npx nx run-many -t lint build test -p frontend-pages-player --output-style=static
```

Player lint reported 17 warnings and zero errors. Build passed. Jest exited zero with `No tests found`;
this is not unit-test coverage. Prettier and `git diff --check` passed.

Precommit `npx nx run-many --target=lint` (same environment) passed 24 targets and failed 10 outside
the player slice. Nx dependency checks report NestJS package specifiers that do not match installed versions.
No dependency manifests were changed in this slice.

On 2026-11-20 the user selected `Approve DR-010a with the documented limits and commit`. This closes the slice
without marking visual review, focus visibility, contrast, or the other documented coverage limits as passed.

Next action: confirm the mounted period controls and scope a separate DR-010 child for period selection.
Do not reopen the header or begin global typography removal as part of period selection.

[routes]: ../../../libs/frontend/pages/player/src/lib.routes.ts
[template]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/page-ranking-breakdown.component.html
