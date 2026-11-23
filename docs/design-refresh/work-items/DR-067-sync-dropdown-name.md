---
title: 'DR-067: Shared sync dropdown accessible name'
description: 'Localized native SplitButton dropdown naming across mounted sync-control consumers.'
---

## Identity

- ID: DR-067. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-007](DR-007-shared-controls.md); DR-007a is approved Done.
- Rules: [design refresh](../README.md).
- Selected 2026-11-23 on existing `main`, starting with a clean worktree. No worktree or branch creation.
- Correct the previous handoff's mistaken DR-065 reference: the sync-dropdown discovery is DR-067.
  DR-065 concerns unrelated builder import-failure feedback and is not a dependency.

## Scope

- Confirmed mounted competition detail, new/imported tournament detail, competition draw and tournament draw.
  Shared controls appear at event, sub-event and draw levels.
- Projects: `frontend-components`, `frontend-pages-competition`, `frontend-pages-tournament`.
- Sources: [shared template](../../../libs/frontend/components/sync/src/sync-button.component.html),
  [existing controller](../../../libs/frontend/components/sync/src/sync-button.component.ts) and existing
  [translation assets](../../../libs/backend/translate/assets/i18n).
- Preserve main-action labels, icons, native appearance, menu items/order, loading disablement, permissions,
  configuration, mutation payloads and notifications.
- Exclude dialog redesign, operational mutations, notification cleanup, global theme and country/state work.
  All current application configurations use event/sub-event/draw, not game; do not redesign an unmounted game dialog.

## Baseline and approach

- Mounted competition has thirteen unnamed native dropdown buttons; main actions already have translated names.
  New/imported tournament detail has 36/37; each checked draw has one.
- Installed PrimeNG 22.1.2 exposes `expandAriaLabel`, directly bound to the native dropdown's `aria-label`.
  Use this documented input with one localized key in en/nl_BE/fr_BE, not pass-through or DOM manipulation.
- The existing shared control already centralizes all real consumers. No new smart/presentational extraction earns
  its place for a single binding, and no consumer changes are required.
- Preserve existing native keyboard and popup relationship behavior. Open/dismiss menus without activating commands.
- SplitButton currently has zero layout/color utility tokens. Add none; leave excluded legacy dialog utilities/styles.

## Implementation checklist

- [x] Confirm mounted consumers and reconcile DR-067 versus the stale DR-065 reference.
- [x] Add localized native expand-button naming without changing actions or presentation.
- [x] Add focused naming, language-update and disabled-state regressions.
- [x] Verify mounted consumers and record remaining limits and discoveries.

## Acceptance and verification

- [x] All mounted dropdowns have translated accessible names; main-action names and menu content are unchanged.
- [x] Names update with language changes and remain present while both buttons are disabled during loading.
- [x] Light/dark at 390px/1440px preserve control bounds across all mounted consumer types.
- [x] Keyboard opening, menu navigation, Escape dismissal and popup association are checked after motion settles.
- [ ] Native Escape dismissal restores focus to the dropdown trigger; follow-up DR-073 records the failure.
- [x] Focused Nx tests and relevant lint/build pass; authored files are formatted.
- [x] No new utilities, styles, dependencies, wrappers, global behavior or operational mutations.
- [x] User review approves this slice with the disclosed limits, 2026-11-23.
- [ ] Full screen-reader/touch, contrast, exhaustive locale browser matrix, permission variants and SSR checks pass.

## Evidence and handoff

- Before screenshot: imported tournament-draw native SplitButton inspected in dark mode at 1440px.
  No visible appearance change is intended.
- Baseline initial light/narrow detail samples raced hydration and returned zero controls; those are invalid.
  Settled repeats use network-idle plus actual rendered controls: all twelve detail theme/width cases preserve
  thirteen/36/37 controls, all unnamed, with zero control overflow. Both mounted draw baselines have one unnamed control.
- Existing navigation samples also emitted view-transition `InvalidStateError`; do not infer a slice regression.
- After: all twenty cases on five routes at 390px/1440px in light/dark retain expected counts, with zero missing/wrong
  dropdown names, changed main-action names or out-of-viewport controls.
- Exact mounted routes:
  - `/competition/pbo-competitie-2026-2027`.
  - `/tournament/eaff3ce2-a7de-4a89-8ca2-4110bb5fe3b8`.
  - `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72`.
  - Competition draw below the competition above: sub-event `8e8ba158-859c-48a7-92ca-f2c3ce805f4f`,
    draw `78d42486-ab43-4484-9b68-a99e46bf96ae`, using `/sub-events/{subEventId}/draws/{drawId}`.
  - Tournament draw below `/tournament/pk-pbo-2025`: sub-event `83ef864d-2e5f-4012-aa11-ea5fe0ee4627`,
    draw `ea1ac59a-1622-4e8b-823c-7a37e14e2674`, using the same nested route structure.
- Real mounted Dutch menu labels/order remain `Sync`, `API Cache wissen`, `API Cache wissen (+ onderliggende)`.
  Enter opens and Escape closes the first menu on all five routes in the twenty-case matrix.
- Initial immediate keyboard/association probes were invalid: focus transfers only after native enter motion,
  and `aria-controls` targets the overlay wrapper, not the inner menu list.
  Settled tournament-draw repeats in all four theme/width cases confirm wrapper/menu association, ArrowDown's
  `aria-activedescendant` and focused `Sync` item, and overlay bounds inside the viewport.
  Escape closes the overlay but focus ends on `body`, not the dropdown. Record DR-073; do not claim keyboard
  focus restoration passes or expand this name-only fix into an operational-control rewrite.
- Browser locale changes on the mounted tournament draw verify English `More sync actions`, French
  `Autres actions de synchronisation` and Dutch `Meer synchronisatieacties`.
  Browser-only loading-signal fixture retains names and disables both native buttons.
  Original locale/loading are restored in `finally`; this is not live sync-progress verification.
- After screenshots inspected: narrow light native SplitButton and narrow dark open menu. Native styling is unchanged.
  No full screenshot matrix, contrast measurement, screen-reader/touch, permission matrix or SSR regression is claimed.
  The original dark theme and 1069px/1272px viewport are restored. No account preference is written.
- App availability initially blocked after checks (`ERR_CONNECTION_REFUSED`, no port-3000 listener).
  User restarted it; the mounted Dutch translated name and all after checks then passed. Blocker resolved.
- `npx nx run frontend-components:test --testPathPatterns=sync-button --runInBand --output-style=static`:
  six tests pass. Actual three-locale assets drive the tests; all four supported levels retain the name.
  Tests first needed the repository-standard local `matchMedia` shim for native menu initialization;
  after that, all six failed specifically on the missing name before adding the binding, then passed.
- `npx nx run-many -t lint build -p frontend-components frontend-pages-competition frontend-pages-tournament
--output-style=static`: fifteen tasks pass, eleven cached; existing warnings only.
  JSON assets parse in the focused tests; no backend runtime behavior changed.
- Changed scope: one template binding, three localized asset entries, six tests and this handoff.
  API restart regenerated the corresponding single `moreActions` type entry in
  [generator-owned translations](../../../libs/utils/i18n/src/lib/i18n.generated.ts); retain that dependent entry.
  No manual controller, consumer, mutation, payload or notification changes.
- Utility/style comparison: SplitButton zero layout/color tokens before and after; no wrapper, SCSS or inline style.
  Existing excluded game-dialog styles remain unchanged. No additional component extraction is warranted.
- Formatter: repository Prettier covers all authored changed files. Registry table alignment changes are formatting only.
  Generated type keeps the generator's formatting: even a one-property Prettier range reformats 2,330 unrelated lines.
  Preserve generator ownership rather than include that unrelated rewrite.
- Final `prettier --check` on the eight authored files and `git diff --check` pass.
  Byte-level LF checks pass for all nine scoped files; 411 local documentation links and Done/DR-073 registry
  assertions pass. Git's checkout-policy CRLF warnings do not indicate CRLF in the scoped working files.
- Exceptions: no application styling exception. Generated-file formatting deviation is disclosed above.
- Explicit approval, 2026-11-23: `Approve DR-067 with documented limits and commit`.
  This accepts completion with the unchecked focus/accessibility/contrast/permission/SSR limits and generated-file
  formatting deviation above; it does not claim unperformed checks passed. DR-067 is Done in the backlog.
- Required pre-commit `npx nx run-many --target=lint --output-style=static` runs all 34 projects:
  24 pass; ten reproduce existing `@nx/dependency-checks` installed-version/package-range errors in unchanged manifests.
  Failures: backend-seo, backend-health, shared, utils, backend-translate, backend-ranking, backend-authorization,
  backend-search, backend-database and backend-graphql. No unrelated dependency corrections are included.
  Scoped components/competition/tournament checks and all six naming tests remain passed.
- DR-007 remains open. Exact next action: scope DR-073's native menu Escape focus restoration against the mounted
  consumers; do not implement it in this invocation. Commit only this approved implementation, tests and handoff;
  no push is authorized.
