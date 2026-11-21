---
title: 'DR-071: Native simulation level stepper'
description: 'Reconcile the ranking simulation stepper report with native PrimeNG accessibility behavior.'
---

## Scope and baseline

- Status: [backlog](../backlog.md). Rules: [design plan](../README.md).
- Project: `frontend-pages-player`. Dependencies: completed
  [DR-010e dialog](DR-010e-ranking-breakdown-add-simulated-game.md); not a parent closure dependency.
- The [player route][routes] mounts the [ranking page][page], which renders the [games list][list].
  Confirmed live consumer: `/players/glenn-latomme/ranking/single`, 2026-11-21.
- Scope only the native InputNumber level controls in the simulation dialog, including the same local
  field loop used for Doubles/Mixed. Preserve level bounds, keyboard input, points preview and dismissal.
- Exclude other dialog fields, ranking calculations, toolbar/table controls, shared components, global
  styles, dependency changes and completed ranking work.
- Original report: the native arrow buttons have no accessible names. Before adding labels, inspect
  whether they are intended to be exposed as separate accessible controls.

## Native behavior and decision

The installed PrimeNG InputNumber sets `aria-hidden="true"` and `tabindex="-1"` on both arrow buttons.
Its input uses `role="spinbutton"` with value and bound attributes. The dialog already associates each
input with a translated label through `inputId`; keyboard users adjust the value on that input.
This is a native redundant-pointer-control pattern, not evidence of an exposed unnamed button.

The [PrimeNG accessibility documentation][inputnumber-docs] describes the labeled spinbutton and its
`aria-valuemin`, `aria-valuemax` and `aria-valuenow` attributes. The installed
[InputNumber source][inputnumber-source] confirms the internal arrow hiding.
The installed [public types][inputnumber-types] expose icon templates but no dedicated button-label inputs.
Icon-template text would remain under an `aria-hidden` ancestor and cannot fix that.

On 2026-11-21 the user responded `Always use primeng components` to the native-versus-separate-buttons
decision. Retain native InputNumber behavior; do not introduce DOM mutation, pass-through bindings,
custom steppers or duplicate controls solely to satisfy a raw unnamed-button inventory.
That direction alone was not approval of closure. The subsequent explicit commit approval is recorded below;
it does not establish that unperformed checks passed.

No application implementation is warranted by the confirmed report. This slice is an evidence-backed
backlog reconciliation; the user approved closure without an application change and with the disclosed limits.
The existing local field loop already styles all real consumers once. No smart/presentational extraction
is needed for unchanged structure.

## Acceptance

- [x] Confirm the mounted dialog and independently reviewable level-control scope.
- [x] Verify installed PrimeNG semantics and the supported public accessibility API.
- [x] Confirm Singles has a labeled spinbutton and two hidden, non-tab-order arrow buttons.
- [x] Verify ArrowUp/ArrowDown update Singles level and respect bounds 1 and 12.
- [x] Verify Escape returns focus to the Add simulated game trigger.
- [x] Preserve native components, existing field-loop reuse and all application behavior without changes.
- [x] Confirm Doubles/Mixed labels, bounds and native hidden-arrow semantics on mounted dialogs.
- [x] User approves documentation-only closure with the remaining verification limits disclosed.
- [ ] Verify narrow layouts, the complete light/dark matrix and touch interaction.
- [ ] Verify screen-reader use, measured contrast and complete tab traversal.
- [ ] Verify alternate locales, broader data fixtures and SSR/hydration.

## Evidence and handoff

- Dutch Singles dark-theme run: Enter opened the dialog; level changed `8 -> 9 -> 8` using arrows.
  Both internal buttons reported `aria-hidden="true"`, `tabindex="-1"` and no `aria-label`.
- At level 1, ArrowDown kept 1; at level 12, ArrowUp kept 12. Restored level 8 without adding a game.
  Escape closed the dialog and the snapshot's focus returned to the Add trigger.
- Light-theme Singles screenshot showed the native dialog, level 8 and 217-point preview at the
  existing wide browser size. Restored the original dark theme afterward.
- Mixed navigation/open verification initially timed out waiting for the dialog after a click.
  A fresh snapshot confirmed the dialog was closed on the rendered Mixed page. Retrying the open
  against that observed state passed. This is not evidence of SSR/hydration correctness.
- Mixed dark-theme dialog exposed three associated labels: `Partner · Level`, `Niveau tegenstander 1`
  and `Niveau tegenstander 2`. All three inputs reported bounds 1 and 12; all six internal arrow
  buttons had native hidden/non-tab-order semantics. Captured a wide screenshot in the session;
  no screenshots containing live player data are committed.
- A separate completed Doubles run confirmed the same three associated labels, bounds 1 and 12, and
  six hidden/non-tab-order arrow buttons. No Doubles/Mixed value changes or full workflow checks were run.
- No operational mutations, game submission, dependencies, styles or application changes.
  Utility/style counts are unchanged. No styling exceptions.
- Not run: Nx lint/build/test, because only documentation changes are needed. Resolved targets were
  inspected with `npx nx show project frontend-pages-player --json` under `NX_DAEMON=false` and
  `NX_NO_CLOUD=true`; that inspection passed but is not application validation.
- Not verified: narrow-width/theme matrix, touch, screen-reader operation, measured contrast,
  complete tab traversal, alternate locales, broader data fixtures and SSR/hydration.
- Documentation checks passed:
  `npx prettier --write docs\design-refresh\backlog.md docs\design-refresh\work-items\DR-071-simulation-level-stepper.md`
  and `git diff --check`. Formatting also normalized the existing backlog table alignment.

### Approval and next action

On 2026-11-21 the user corrected the prior `Keep DR-071 in Review; nothing else` selection with
`misclicked, commit`. This explicitly approves documentation-only closure and its scoped commit with the
disclosed limits. The unchecked layout, touch, accessibility, localization and SSR/hydration criteria remain
unverified; approval does not turn them into passed checks.

Next candidate: DR-005. No Ready rows remain in the backlog. Reconcile its completed children and mounted
consumers before scoping one remaining concern if needed. Do not reopen completed work or start that
candidate in this invocation.

[routes]: ../../../libs/frontend/pages/player/src/lib.routes.ts
[page]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/page-ranking-breakdown.component.html
[list]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/components/list-games/list-games.component.html
[inputnumber-docs]: https://primeng.dev/inputnumber#accessibility
[inputnumber-source]: ../../../node_modules/primeng/fesm2022/primeng-inputnumber.mjs
[inputnumber-types]: ../../../node_modules/primeng/types/primeng-inputnumber.d.ts
