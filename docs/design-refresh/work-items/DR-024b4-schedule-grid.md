---
title: 'DR-024b4: Scheduling grid and game panel'
description: 'Native table grid, presentational slot/game components and localized grid copy.'
---

## Identity and scope

- ID: DR-024b4. Status is authoritative in the [backlog](../backlog.md).
- Parent: [DR-024b Scheduling](DR-024b-admin-scheduling.md).
- Dependencies: approved DR-024b1, DR-024b2 and DR-024b3.
- Consumer: the authorized `/tournament/:id/admin?tab=schedule` tab (`app-schedule-tab`), confirmed mounted in DR-024b3.
  This invocation's browser pane was not signed in, so the consumer could not be re-observed.
- Change only the grid, slot cells, unscheduled-games panel, their consumed locale keys and focused tests.
- Exclude summary, controls, Generate/Auto-schedule dialogs, confirm() workflows, backend/schema, shared/global styling.
- Preserve drag-and-drop (`cdkDropListGroup`, per-slot `cdkDropList`, `cdkDrag`), handlers, gates and read states.

## Approach

- Hand-built flex grid becomes a native `p-table` inside a `p-card`: native header, row separators and scrolling.
- Smart/dumb split (requested): `app-schedule-slot` renders one slot per status and
  `app-schedule-game-card` renders one unscheduled game. Both are presentational (inputs/outputs only).
  The smart tab keeps drag-and-drop, mutations and the service, so slot/game styling lives in one place each.
- Tailwind palette colors (blue/orange/green/red/purple) and `dark:` pairs are replaced by native Tag
  severities (warn/success/danger), `bg-highlight`, `text-color`, `text-muted-color`, `border-surface`.
- Unscheduled panel uses a native `p-panel`; the empty state uses a Card and muted text.
- New keys (en/nl_BE/fr_BE): dropHere, blockSlot, unblockSlot, removeFromSlot, live, completed, gamesCount,
  defaultCourt; blank `time` filled in nl/fr. Icon buttons now have localized accessible names/tooltips.

## Checklist

- [x] Native table/Card/Panel/Tag replace custom surfaces and palette colors.
- [x] Presentational slot and game-card components extracted; handlers/drag stay in the smart tab.
- [x] Hard-coded English grid copy localized in three locales.
- [x] Existing 20 focused tests still pass.
- [x] Populated grid/game panel browser check on the authorized consumer (client-only fixture): Dutch dark wide and light 390px.
- [ ] Drag-and-drop assign, block/unblock, remove checked in a browser with safe data.
- [ ] Keyboard/focus, contrast and tooltip checks on the new markup.
- [ ] New component tests for slot/game-card status rendering.
- [ ] User review.

## Evidence

- `npx prettier --write` on all changed files: passed.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=schedule-tab --runInBand --output-style=static`:
  20/20 pass. First run failed 1 test (a `p-message` empty state broke the "no message on success" assertion);
  the empty state became plain muted text.
- `npx nx run-many -t lint build -p frontend-pages-tournament --output-style=static`: passed (10/12 cache replays).
- Not run: browser/visual checks (browser pane signed out), drag/drop and mutations, new component tests,
  full suite, SSR/hydration. No operational writes were made.
- Known remaining English in TS: `getGameDisplayName` ("TBD", "vs"), `strategyOptions`, `confirm()` texts,
  dialog copy. They stay with the dialog child.
- Exceptions: none.

## Court-count scaling (user requirement: 6 to 48 courts)

- Table is vertically scrollable (`scrollHeight="70vh"`, native sticky header) and the Time column is a native
  `pFrozenColumn` made opaque with `bg-emphasis`, so many courts scroll horizontally under a fixed time column.
- Minimum width scales with the court count (6rem + 10rem per court, `gridMinWidth`); courts sort numerically
  ("Court 2" before "Court 10"). The unscheduled panel stacks below the grid under `lg`.
- Fixture checks: 48 courts (dark) and 6 courts (light) scroll correctly with a readable frozen column and no
  document overflow; 24 courts not separately run. jsdom needs a `ResizeObserver` stub in the spec.
- Not decided: a court filter/pagination for 48 courts; horizontal scrolling is the only navigation.

## Browser verification (signed in)

- Client-only `fetch` fixture for `TournamentScheduleData` (six slots covering every status, two unscheduled games,
  synthetic names); no server writes; fetch and theme restored afterwards.
- Dutch/dark/wide: native table with localized court/time headers, status Tags (Live, Afgelopen, Geblokkeerd),
  highlighted scheduled cell, game cards with draw and round Tag, localized counts; tooltips localized.
- Light/390px: no document overflow; the table scrolls horizontally inside its Card.
- Not checked: drag-and-drop, block/unblock/remove clicks, keyboard/contrast measurements, light/wide, dark/narrow.

## Approval

The user approves completion and commit on 2026-11-11 with disclosed limits. Unchecked items above
(drag-and-drop/mutation clicks, keyboard/contrast, component tests, user review checkbox as a formal review)
were not performed and are not claimed as passed.

## Next action

Add slot/game-card component tests, optionally check drag-and-drop/keyboard/contrast, then request review. Do not start the dialogs child before that.
