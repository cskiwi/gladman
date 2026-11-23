---
title: 'DR-073: Shared sync menu Escape focus restoration'
description: 'Return keyboard focus to the native sync dropdown without changing other dismissal behavior.'
---

## Identity

- ID: DR-073. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-007](DR-007-shared-controls.md); discovery: [DR-067](DR-067-sync-dropdown-name.md).
- Rules: [design refresh](../README.md).
- Selected 2026-11-23 on existing `main`, starting with a clean worktree; no new branch or worktree.
- Dependencies: DR-067 is approved Done. No unresolved prerequisite.

## Scope

- Shared [sync controller](../../../libs/frontend/components/sync/src/sync-button.component.ts),
  [template](../../../libs/frontend/components/sync/src/sync-button.component.html) and
  [focused tests](../../../libs/frontend/components/sync/src/sync-button.component.spec.ts).
- Confirmed application consumers: competition detail/draw and tournament detail/draw.
  Competition detail currently mounts thirteen controls, not merely an exported or test-only consumer.
- Projects: `frontend-components`, `frontend-pages-competition`, `frontend-pages-tournament`.
- Preserve translated names, native appearance and menu order, main/menu commands, permissions, disabled/loading,
  configuration, mutation payloads and notifications.
- Exclude sync/cache execution, unmounted game-dialog redesign, global theme, shared styling and unrelated controls.

## Baseline and approach

- Live `/competition/pbo-competitie-2026-2027`: Enter opens, settled menu receives focus, ArrowDown selects an item;
  Escape closes it with `aria-expanded=false` but leaves `document.activeElement` on `body`.
- PrimeNG 22.1.2 SplitButton passes its non-focusable wrapper as TieredMenu's target.
  TieredMenu Escape calls `hide(event, true)`, which attempts to focus that wrapper.
- Native API/source review finds no SplitButton focus-return input; `onMenuHide` does not identify dismissal reason.
  Keep native opening, navigation and dismissal; correct only focus return.
  Do not restore focus on every `onMenuHide`, which would steal focus during outside clicks and Tab dismissal.
- Application configuration appends overlays to `body`, so a host-only bubbling listener cannot see menu Escape.
  A document Escape listener checks the menu role and this instance's native `aria-controls` ownership before
  focusing its native dropdown. No private PrimeNG state, timers, pass-through or design-token binding is used.
- The existing shared component already centralizes all real consumers; no additional smart/presentational
  extraction is warranted for a keyboard correction.
- SplitButton starts with zero layout/color utility tokens. Add no utilities, SCSS or equivalent styling.

## Implementation checklist

- [x] Confirm mounted consumer, native root cause and smallest independent scope.
- [x] Correct Escape focus return without altering other menu interactions.
- [x] Add regressions covering Escape, non-menu Escape and other dismissal paths.
- [x] Check mounted consumers and record out-of-scope discoveries.

## Acceptance and verification

- [x] Escape from the open native menu closes it and restores its own enabled dropdown's focus.
- [x] Enter/Space/ArrowDown opening, arrow navigation and popup association remain usable.
- [x] Outside-click and Tab dismissal do not pull focus back to the dropdown.
- [x] Main/menu wiring, translated names and loading disablement are preserved; no operational mutation runs.
- [x] All five mounted detail/draw routes pass light/dark at 390px/1440px with stable control bounds.
- [x] Focused Nx tests and relevant lint/build pass; changed files are formatted.
- [x] Zero new utilities, styles, dependencies, wrappers or global theme changes.
- [x] User review approves this slice with disclosed verification limits, 2026-11-23.
- [ ] Full screen-reader/touch, contrast, exhaustive locale/permission variants and SSR/hydration checks pass.

## Evidence and handoff

- Before: competition detail in all four theme/width combinations closes on Escape but loses focus to `body`.
  Dropdown bounds remain 28px by 27.5px; a dark native-control crop was inspected.
- After: twenty route/theme/width cases cover these exact routes:
  - `/competition/pbo-competitie-2026-2027`.
  - `/tournament/eaff3ce2-a7de-4a89-8ca2-4110bb5fe3b8`.
  - `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72`.
  - Competition draw below that competition: sub-event `8e8ba158-859c-48a7-92ca-f2c3ce805f4f`,
    draw `78d42486-ab43-4484-9b68-a99e46bf96ae`, using `/sub-events/{subEventId}/draws/{drawId}`.
  - Tournament draw below `/tournament/pk-pbo-2025`: sub-event `83ef864d-2e5f-4012-aa11-ea5fe0ee4627`,
    draw `ea1ac59a-1622-4e8b-823c-7a37e14e2674`, using the same nested route structure.
- Mounted control counts remain 13/36/37/1/1; initial active tabs expose 13/15/16/1/1 visible controls.
  Test first and last visible controls on each detail route and the sole control on each draw:
  32 Escape checks restore the correct trigger after native leave motion, with unchanged bounds.
  Space and ArrowDown opening, settled menu focus, ArrowDown active-item navigation, popup association,
  Dutch dropdown names and menu text/order pass.
- Twenty further route/theme/width cases verify Enter opening, Tab dismissal without forced dropdown focus,
  outside clicks preserving search-input focus, subsequent unrelated Escape preserving that focus,
  and horizontally in-viewport popup bounds.
  Native menu labels remain `Sync`, `API Cache wissen`, `API Cache wissen (+ onderliggende)`.
  No sync/cache command is activated; request monitoring of the Escape matrix records zero such mutations.
- Invalid initial samples: the raw last tournament control belongs to a hidden `p-tabpanel`; focusing it fails.
  That caused unrelated-menu association/focus results, not a confirmed implementation failure.
  Early post-keydown active-descendant reads also raced Angular updates.
  Repeats use visible controls, scroll into view, and wait for the specific overlay's focus and active descendant.
  Only those settled repeats are passing evidence; hidden tabs are not individually workflow-verified.
- After screenshots inspected: dark wide native-control crop and light narrow native open-menu crop.
  The restored wide dark dropdown exposes the native solid 1px outline with 2px offset; no focus styling added.
  No complete screenshot matrix, contrast measurement, screen-reader/touch, permission/locale matrix or
  SSR/hydration regression is claimed. Existing operational action wiring is unchanged, not live-executed.
- `npx nx run frontend-components:test --testPathPatterns=sync-button --runInBand --output-style=static`:
  nine tests pass, including the six existing naming/locale/loading cases and three focus/isolation regressions.
  Before correction, the new body-appended Escape regression fails on focus returning to `body`; the other eight pass.
  After correction and after the final typing adjustment, all nine pass.
- `npx nx run-many -t lint build -p frontend-components frontend-pages-competition frontend-pages-tournament
--output-style=static`: fifteen tasks pass, eleven cached; existing lint/packaging warnings only.
  The initial build correctly caught Angular typing the document key event as `Event`, not `KeyboardEvent`.
  The handler only needs `Event.target`; using `Event` fixes the type without a cast.
  The first browser reload still served the old handler while that build failed; it is not after-fix evidence.
  Fresh reload confirms the new handler before the passing matrices.
- Repository Prettier formats every changed file; backlog table alignment changes are formatting only.
  `npx prettier --check` on the six scoped files and `git diff --check` pass.
  Byte-level LF checks pass for all six files; 415 local links resolve and the DR-073 registry is reconciled.
  Git's checkout-policy CRLF warnings do not indicate CRLF in these working files.
- Original dark theme, 1288px by 1272px viewport and home route are restored; no preference is written.
- Changed scope: shared controller, one template event binding, existing test file, parent/backlog and this brief.
  No consumer edits or new abstraction; shared presentation already centralizes the behavior.
  Utility/style comparison: SplitButton zero layout/color tokens before and after; no wrapper, SCSS or inline style.
- Exceptions: narrowly scoped DOM focus correction because the installed native SplitButton targets its wrapper.
  It uses semantic role/ARIA ownership rather than private component fields or CSS classes.
  Remove it if an upgraded native SplitButton restores its own dropdown focus, retaining regression coverage.
  No styling exception. No unrelated discovery requires another backlog item.
- Explicit approval, 2026-11-23: `Approve DR-073 with documented limits and commit`.
  This accepts completion with the unchecked screenshot/contrast/accessibility/locale/permission/SSR limits and
  the narrow native-focus workaround above; it does not claim unperformed checks passed.
  DR-073 is Done in the backlog. Commit only this approved implementation, tests and repository handoff; no push.
- Required pre-commit `npx nx run-many --target=lint --output-style=static` runs all 34 projects:
  24 pass from cache; ten reproduce existing `@nx/dependency-checks` installed-version/package-range errors in
  unchanged manifests. Failures: backend-health, backend-seo, shared, backend-ranking, backend-translate,
  backend-authorization, utils, backend-search, backend-database and backend-graphql.
  No unrelated dependency corrections are included; scoped lint/build and all nine tests remain passed.
- DR-007 stays open. Exact next action: reconcile its remaining sync-action/dialog scope against mounted consumers
  before parent closure. DR-065 is unrelated builder feedback, not a DR-007 prerequisite.
  Do not begin that reconciliation or another implementation slice in this invocation.
