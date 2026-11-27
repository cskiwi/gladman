---
title: 'DR-011d2: Ranking dialog, validation and mutation feedback'
description: 'Responsive native ranking fields and explicit independently saved dialog states.'
---

## Identity and scope

- ID: DR-011d2. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-011d](DR-011d-player-ranking.md). Prerequisite DR-011d1 is Done.
- Design rules: [refresh plan](../README.md).
- Mounted consumer: `/players/glenn-latomme/edit`, Ranking tab, confirmed 2026-11-27.
- Project: `frontend-pages-player`; [component][component] and [template][template].
- Scope: create/edit/delete dialog layout, field names/validation, busy/error/success feedback and mutation lifecycle.
- Preserve date conversion, required ranks/minimum one, optional points/minimum zero, update toggle, mutation operations,
  player/system context, history refresh and backend authorization. No live mutation is authorized for visual testing.
- Exclude history styling/grouping/read behavior, permissions, page chrome, adjacent forms, shared/global styles,
  dependency changes and new delete-confirmation semantics.
- Directly related localization: new dialog-state keys in existing English/Dutch/French catalogs and generated types.

## Baseline and approach

- Clean existing `main`; no worktree, branch, service or operational changes.
- Mounted history: 41 groups/313 rows. Existing edit targets populate ranks 8/7/9 and points 68/234/31.
- Dialog has a fixed inline 480px width, six unnamed numeric fields and an unnamed date input.
  Legacy `pTemplate` footer does not render in the mounted installed PrimeNG version, leaving actions unavailable.
- Numeric ranks have no visible validation; points have UI minimum zero but no corresponding form validator.
  Mutations have no pending guard and treat error/partial/missing or false results as success.
- Dialog-only baseline: 31 class/styleClass attributes, 66 utility tokens. Host-only SCSS is legacy display:block.
- Use the existing responsive native Dialog pattern, fluid named controls, semantic validation Messages,
  native footer templates and loading Buttons. Retain native calendar and focus-trap behavior.
- Keep existing page/form orchestration boundary; no second real consumer justifies a new smart/dumb wrapper.
- Explicitly construct the supported mutation fields rather than spreading Apollo response metadata.
  Keep pending forms stable and prevent duplicate or stale-context actions.

## Implementation checklist

- [x] Confirm mounted consumer, dependency and one bounded slice.
- [x] Preserve payload values, optional points, edit/add targets and history refresh.
- [x] Use native responsive dialog, labels, validation and pending/error feedback.
- [x] Leave history/adjacent/shared/global behavior unchanged.
- [x] Record exact checks, exceptions and remaining review.

## Acceptance and verification

- [x] Date, toggle and six numeric controls have accessible names; invalid fields show associated feedback.
- [x] Blank/rank-minimum/point-minimum validation prevents invalid submissions; optional/zero points are preserved.
- [x] Pending create/update/delete disables editing/dismissal and duplicate/conflicting actions.
- [x] Rejected, partial, missing and false mutation results retain the editor and report failure; only confirmed success
      closes it and refreshes the matching history context.
- [x] Existing/create payloads contain only supported fields and preserve player/system/date/rank/point values.
- [x] Light/dark 390px/1440px dialog and calendar layouts are contained; keyboard/focus and labels verified.
- [x] No new palette utilities, pass-through, SCSS, inline styling workaround, dependencies or shared/global edits.
- [x] Relevant Nx tests/lint/build pass.
- [ ] Full visual/accessibility, screen-reader/touch, locale, live-save and SSR/hydration checks pass.
- [x] Required user review/approval obtained with documented verification limits.

## Evidence and handoff

- Before: real mounted DOM counts, edit values, unnamed inputs and missing footer confirmed.
  Baseline narrow screenshots were not captured; source confirms the fixed 480px width.
- Replaced the inline width with the existing native `w-full max-w-lg m-2` Dialog pattern.
  Fluid date/numeric fields are named; repeated discipline/point structure uses the existing discipline list once.
  Native footer now renders. Save is a native PrimeNG-styled submit button associated with the form;
  the component Button's installed `ButtonProps` does not support a `form` attribute.
- Required date/rank errors and point/rank minimum errors are explicit native Messages.
  DatePicker lacks `ariaDescribedBy`; its documented `ariaLabelledBy` includes the date label and visible error.
  InputNumber uses its native description input. Reopening resets touched/error state.
- Typed form controls preserve required ranks, nullable/zero points and date conversion.
  Explicit mutation fields omit response metadata and non-editable model fields.
  Pending requests disable all fields/actions and dismissal; duplicate/conflicting dispatch is guarded.
  Only confirmed create/update IDs or deletion true close the editor and refresh its matching history.
  Rejected/partial/missing/wrong-ID/false results keep values/dirty state and show translated errors.
  Changed context closes the stale editor and prevents stale mutation success/failure leaking into another context.
- The history markup/data/read implementation is unchanged except passing the opener event for focus restoration.
  Native Dialog did not restore opener focus in the baseline interaction check; local `onHide` restoration now does.
  No shared/global, permission or adjacent form changes. Existing host-only SCSS remains.
- Eleven new state/validation/notification keys exist in all three catalogs and generated types.
  Dialog disciplines/point names reuse canonical translated labels, avoiding existing editor-specific copy gaps.
- Dialog-only metrics: class/styleClass attributes 31 -> 10; utility tokens 66 -> 26.
- Exceptions: none. No dependencies, service changes or live operational mutations.
- Reuse: existing page/form separation plus direct native components.

### Automated checks

- Scoped repository Prettier run for all changed files.
- `npx nx run frontend-pages-player:test --runInBand`
  `--testPathPatterns=player-ranking.component.spec.ts page-edit.component.spec.ts --output-style=static`:
  passed, two suites/39 tests (28 ranking, eleven parent).
  Cases cover associated submit/validation, reset, payload whitelisting, pending guards,
  create/update/delete confirmation and failure, stale context, focus restoration and existing history regressions.
  Existing ts-jest isolated-module/decorator-metadata warning remains.
- `npx nx run-many -t lint build -p frontend-pages-player --output-style=static`:
  passed, twelve tasks/ten cached. Sixteen existing lint warnings remain; four old non-null assertions were
  removed with the obsolete mutation reload code. No new warning or error.
- Node case-sensitive JSON check: all eleven dialog keys resolve in English/Dutch/French.
  Catalog presence is not a locale-switching browser pass.
- `git diff --check`: passed. All eleven changed files use LF; Markdown frontmatter and 512 local links pass.
  Scoped comparison confirms identical history markup except opener-event focus wiring.
  Added-template guard finds no palette utilities, pass-through, inline style binding or styling workaround.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 22 of 34 targets pass
  (eighteen successful targets cached); twelve reproduce existing `@nx/dependency-checks` failures from DR-011d1:
  backend-health, i18n, backend-seo, shared, backend-ranking, backend-authorization, backend-translate,
  backend-search, utils, backend-database, frontend-modules-translation and backend-graphql.
  Failures concern unchanged dependency versions, unused declarations and missing peers.
  Player lint passes; no unrelated manifest changes or dependency installations.

### Browser checks and limits

- Hydrated real history still has 41 groups/313 rows and first-row ranks 8/7/9, points 68/234/31.
- Normal light/dark at 1440px/390px, height 900px: dialog width 448px/376px with contained fields/footer.
  Narrow normal dialog bounds are x=7..383, y=121..779; no horizontal content overflow.
  All eight controls have associated labels. Calendar stays within both viewports, including narrow x=25.5..364.5.
- Blank add-form submission exercises actual native form association/validation without a mutation.
  Five explicit errors (summary/date/three ranks) appear in every theme/width case.
  Narrow error dialog stays within the viewport, approximately y=54.5..845.5.
- Read-only component-state fixtures exercise saving/deleting and save-error presentation in all four cases.
  Pending fields/footer buttons are disabled, header close absent and Escape cannot dismiss.
  Failed presentation retains all six numeric values and explicit Dutch error copy without horizontal overflow.
  These are presentation fixtures, not live API failure/success claims. Real mutation outcomes are unit-tested only.
- Native keyboard Enter opens the real dated edit action; Escape first dismisses the calendar, then the dialog.
  Space toggles the ranking-update switch and restores it. Tab wraps within the modal with a visible close-button
  outline; settled numeric focus uses native primary border feedback. Opener focus restores in all four final cases.
- Sampled settled label contrast: dark 14.52:1/light 19.87:1.
  Dark Save/Delete/Close text passes at 10.10/6.27/14.52:1; light Close passes at 4.87:1.
  Light Save/Delete fail text AA at 3.65/3.76:1 under existing DR-033.
  Early theme-transition color readings were discarded; no contrast pass is inferred from those readings.
  Inherited DR-034/076 and full contrast/accessibility work remain open; no page/global workaround added.
- Light-narrow and dark-wide dialog screenshots inspected; no private screenshots/logs committed.
  No full screenshot/contrast audit, screen-reader/touch, locale switching, live save/delete or SSR/hydration pass.
  Existing view-transition `InvalidStateError` was observed during HMR; no SSR/hydration claim is made.
- Temporary dialog fixtures are reset before restoring the original home URL, dark presentation and
  1571x1272 geometry. No authentication/storage or shared service changes.

### Exact next action

- Explicit approval on 2026-11-27: `Approve with documented limits and commit`.
  DR-011d2 is Done by that approval, retaining the unchecked full visual/accessibility, screen-reader/touch,
  locale, live-save/delete and SSR/hydration criteria and disclosed DR-033 contrast failures.
  Approval does not claim those checks passed.
- Commit only this approved child and handoff on existing `main`; no push.
- Exact next candidate: reconcile DR-011d against its two completed children in a subsequent invocation,
  then reconcile DR-011 separately, preserving all accepted child verification limits.
  Both parents remain open; do not start another implementation slice here.

[component]: ../../../libs/frontend/pages/player/src/pages/edit/components/player-ranking/player-ranking.component.ts
[template]: ../../../libs/frontend/pages/player/src/pages/edit/components/player-ranking/player-ranking.component.html
