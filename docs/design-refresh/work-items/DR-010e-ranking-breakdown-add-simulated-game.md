---
title: 'DR-010e: Add simulated game dialog'
description: 'Improve the layout and accessibility of the ranking breakdown Add simulated game dialog.'
---

## Scope and baseline

- Parent: DR-010. Status: [backlog](../backlog.md). Rules: [design plan](../README.md).
- Project: `frontend-pages-player`. The [player route][routes] mounts the [ranking page][page], which renders
  the [games list][list] once the ranking system and player resolve. The list owns the dialog and its trigger.
- Refresh the dialog only: outcome, opponent search and level inputs, points preview, and Add action.
  Use the existing native PrimeNG Dialog, SelectButton, AutoComplete and InputNumber with responsive
  layout and translated labels. Preserve initial values, suggestion selection, level bounds, and the
  extra opponent and effective level for Doubles/Mixed.
- Keep simulation state and calculations with the games list. Consider a separate presentational dialog
  only if it meaningfully separates the form from table logic without duplicating style or state.
- Exclude the toolbar and settings popover, row actions and styling, completed ranking slices, shared
  styles, and changes to ranking calculations or persistence.
- Source baseline: a fixed-width dialog, side-by-side search and level inputs, and no explicit labels
  associated with the opponent fields. Count in-scope utilities and capture browser evidence once the API is back.

## Acceptance

- [x] Confirm the route and dialog consumer in source and isolate one independently reviewable slice.
- [x] Confirm the mounted dialog and record baseline and after-layout measurements.
- [x] Verify Dutch field labels, keyboard open and Escape, focus entry and return, and Singles dialog fit.
- [x] Verify Singles and Doubles/Mixed fields, Singles level bounds and selection, and the points preview.
- [x] Verify dismissal and that adding a hypothetical game updates the local list but disappears on reload.
- [x] Verify the supplied Singles example shows member ID and level, and retains the selection and level on reopen.
- [x] Verify the Doubles/Mixed partner appears alongside the viewed player and retains its level on reopen.
- [x] Run focused player Nx lint/build/test.
- [ ] Complete visual review, contrast, focus traversal, and autocomplete overlay checks.

## Evidence and handoff

On 2026-11-20 the shared preview loaded the ranking route shell but did not render `app-list-games`.
`GetRankingSystem` and `ResolvePlayer` returned HTTP 502, as did the English and Dutch translation endpoints.
The [development proxy][proxy] points to `http://localhost:5000`. Read-only checks of
`/api/v1/translate/i18n/nl_BE` could not connect directly to port 5000 and returned HTTP 502 via port 3000.

After the user restored the API, the Dutch Singles dialog mounted on the same route. In dark mode the
dialog was 390px wide at both 1368px and 390px viewports, edge to edge at the narrow width. The outcome
group, close button and level stepper buttons had no accessible name; the two inputs had no associated labels.
The default winning scenario showed level 8 and 217 points.

The revised dialog follows the period dialog's native modal pattern. Its fields stack on small screens;
one loop owns both opponent rows. Existing translations and simulation handlers are reused. The points
and effective level are exposed as a live status. Dialog class tokens decreased from 36 to 27; the fixed
width, decorative icon, and divider were removed. No SCSS, palette utilities, or shared changes were added.

- Dutch Singles DOM checks at 390px and 1440px in light and dark had no horizontal dialog overflow.
  The translated close, outcome group, and two inputs had accessible names.
- Enter opens the dialog, focus enters, and Escape from InputNumber returns focus to the trigger.
  A loss previews 0 points; stepping a winning Singles level from 8 to 9 changes 217 points to 150.
  Selecting a live Singles suggestion populated level 7; ArrowUp/ArrowDown stopped at 12 and 1.
- Double and Mix expose four numbered field labels. Changing the second level updated effective
  level and points in both. Adding a local Singles scenario changed six rows to seven; reload restored six.
  No operational save was used.

With `NX_DAEMON=false` and `NX_NO_CLOUD=true`, the following passed:

```powershell
npx nx run-many -t lint build test -p frontend-pages-player --output-style=static
```

Lint reported 19 warnings and zero errors. Build passed and both existing period tests passed;
those tests do not exercise this dialog. `git diff --check` passed.

Remaining: user visual review and screenshot matrix, full focus traversal and contrast, autocomplete
keyboard selection and overlay fit, Doubles/Mixed layout matrix and opponent selection, alternate locales,
and full SSR/hydration. Native InputNumber stepper buttons remain unnamed as in the baseline;
the labeled spinbutton itself is keyboard-operable. No styling exceptions.

### Opponent search follow-up

The existing player lookup now requests member ID. Each suggestion shows it, when present, next to the
level for the selected discipline. Both opponent fields are bound to component state, so reopening retains
the selected player and the corresponding level. Changing ranking context clears the remembered selection.
Incomplete search text is not retained when reopening. The simulation remains local.

The supplied Singles example showed its member ID and level 5, populated level 5 on selection, appeared
in the simulated row, and reopened with the same opponent and level. The focused Nx command passed again
with 19 lint warnings, zero errors, and two existing tests passing. The missing-metadata and context-switch
cases were not browser-tested.

### Partner and team follow-up

The compact member ID and level now share the name's baseline without a repeated level label. Doubles and
Mixed reuse the same search and level fields for an optional partner. The selected partner contributes to
the simulated team level comparison; the existing points preview still uses the opposing levels.
The games list reads the viewed player's identity directly from the breakdown service instead of a separate
input, and uses that name in the simulated team. This does not persist any data.

The final focused Nx command passed (19 lint warnings, zero errors, two existing tests). On both Double
and Mix, the suggestion's computed alignment was `baseline`; the simulated Team cell included the viewed
player and selected partner, and reopening retained the partner's level. The broader layout and accessibility
checks above remain open.

### Approval and next action

On 2026-11-20 the user selected `Approve DR-010e with the documented limits and commit`.
The unchecked visual, accessibility, localization, and SSR/hydration checks remain unverified.

Precommit `npx nx run-many --target=lint --output-style=static` under the same Nx environment failed in the same
ten unrelated projects as DR-010d. The focused player checks passed; no dependency changes are included.

Next: confirm the mounted simulation toolbar and settings popover and scope them as a separate DR-010 child.
Keep DR-010 open and leave row actions outside that next slice.

[routes]: ../../../libs/frontend/pages/player/src/lib.routes.ts
[page]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/page-ranking-breakdown.component.html
[list]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/components/list-games/list-games.component.html
[proxy]: ../../../apps/app/proxy.conf.json
