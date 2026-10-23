---
title: 'DR-008a: Player hero actions'
description: 'Give the player detail hero overflow action a localized accessible name.'
---

## Identity

- ID: DR-008a; parent [DR-008](../backlog.md). Status is authoritative in the [backlog](../backlog.md).
- Area: the mounted player detail hero on `/players/:playerId`.
- Dependencies: completed DR-004 shared hero work. No shared API change is required.
- Design rules: [design refresh plan](../README.md).

## Scope

- Project: `frontend-pages-player`.
- Source: [player detail template][player-detail].
- Add a localized accessible name and matching tooltip to the icon-only overflow action.
- Preserve the existing edit menu, click behavior, routing, translations, and responsive layout.
- Exclude the player detail content cards, ranking data, follow behavior, and shared menu APIs.

## Baseline and proposed approach

- The player hero renders an icon-only ellipsis button that opens the existing PrimeNG menu.
- The button has no accessible name, although the surrounding named actions use translated labels.
- Reuse the existing `all.common.actions` translation and PrimeNG button `ariaLabel` input.
- Add the same translation to `title` so the action remains discoverable for mouse and touch users.
- No new style, color, component, or translation key is needed.

## Implementation checklist

- [x] Confirm the mounted consumer and smallest independently reviewable slice.
- [x] Preserve the existing menu model and click interaction.
- [x] Add a localized accessible name without adding authored styling.
- [x] Record the unused legacy DR-006 consumer discovery in the backlog.
- [x] Verify light/dark and narrow/wide visual states and keyboard menu access.

## Acceptance and verification

- [x] The overflow control exposes the localized `Actions` accessible name.
- [x] The tooltip uses the same localized label.
- [x] The menu still opens from the overflow control and retains the existing Edit action.
- [x] Mounted light/dark and narrow/wide visual review is complete.
- [x] Keyboard focus and menu activation are confirmed in the browser.
- [x] Relevant Nx lint/build checks are recorded after implementation.

## Evidence and handoff

- Before evidence: the player route showed an unlabeled icon-only overflow button.
- After evidence: the same button now receives `aria-label` and `title` from `all.common.actions`.
- Browser checks: the localized `Acties` name is present at desktop and 390px widths in light/dark
  media states; the existing `Edit` menu opens by click and by focused Enter activation.
- Nx checks: `npm exec nx run frontend-pages-player:lint`, `npm exec nx run frontend-pages-player:test -- --runInBand`,
  and `npm exec nx run frontend-pages-player:build` all pass.
- No production consumer of `match-row` or `upcoming-match` was found; those unused components remain unchanged.
- The user explicitly approved completion on 2026-10-23. No pixel-contrast measurement or alternate-locale browser
  pass is claimed.

[player-detail]: ../../../libs/frontend/pages/player/src/pages/detail/page-detail.component.html
