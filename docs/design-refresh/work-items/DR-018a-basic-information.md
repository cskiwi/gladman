---
title: 'DR-018a: Basic competition information'
description: 'Semantic basic-information section and native labelled form controls.'
---

## Identity and scope

- ID: DR-018a. Status is authoritative in the [backlog](../backlog.md).
- Parent: [DR-018](DR-018-competition-editing.md). Dependencies: completed DR-015.
- Rules: [design refresh](../README.md).
- Confirmed consumer: `/competition/pbo-competitie-2026-2027/edit`, information tab, 2026-11-14.
- Project: `frontend-pages-competition`.
- Change only the basic-information section in the
  [information template](../../../libs/frontend/pages/competition/src/pages/edit/components/competition-info/competition-info.component.html).
- Preserve name/season/type controls, validators (required name and season, season 2000-2100), options,
  permission disabling, dirty tracking and all save payloads.
- Exclude location/contact, dates/settings, page chrome, shared selectors/theme, translations and mutations.

## Baseline and approach

- Clean worktree; real Dutch account has no edit permission and six disabled information controls.
- Dark wide before screenshot inspected: numbered primary heading, compact fields and no native label
  association for the season spinbutton or type combobox.
- Use a named semantic section, neutral heading, native fluid controls, `inputId` for composite inputs,
  native invalid styling and simple error Messages associated with required-control feedback.
- Retain the existing responsive grid and form component. No duplicated real-consumer structure merits extraction.
- No new Card inside the existing content surface; no CSS, palette or token workaround.
- Installed PrimeNG 22 declarations are the API source for fluid, invalid, inputId and ariaDescribedBy.

## Implementation checklist

- [x] Confirm mounted consumer, permissions and independently reviewable scope.
- [x] Implement basic section and native labelled controls without changing form logic.
- [x] Preserve all out-of-scope markup apart from repository formatting.
- [x] Record utility comparison, verification and discoveries in the repository handoff.

## Acceptance and verification

- [x] Basic heading uses semantic normal text; native controls and Messages own appearance.
- [x] No new authored palette colors, SCSS or inline styling workaround.
- [x] Name, season and type have associated labels; required errors have meaningful associations.
- [x] Light/dark at 390px/1440px fit the section, including invalid feedback.
- [x] Keyboard focus, type selection, dirty tracking and disabled permissions remain usable.
- [x] Required name/season feedback and native range-invalid styling are checked without saving.
- [x] Existing relevant Nx lint/build checks pass.
- [ ] Full accessibility/contrast, alternate locales and SSR/hydration are verified.
- [x] User visual review/approval is recorded.

## Evidence and handoff

- Before: mounted real Dutch values, dark wide screenshot and disabled-control snapshot.
- Browser-only editable fixtures temporarily stub this component's permission predicate and enable its form;
  account/backend permissions are never changed and no save action is activated.
- Live persistence is intentionally not run. Shared selector warnings, labels and page tab event remain parent follow-ups.
- Utility comparison: basic section class tokens 26 -> 23; whole template 67 -> 64.
  Removed two numbered primary classes and two red error classes in scope.
  Location/contact and subsequent markup compare unchanged after whitespace normalization.
- Final command: `npx nx run-many -t lint build -p frontend-pages-competition` passes:
  12 tasks succeeded, 10 cached. Repeated after the native Select label association and final guard formatting.
- Repository Prettier formats all four changed files; `git diff --check` passes.
- Tests: no existing editor/basic-information suite; unrelated competition suites not run.
  No new dependencies or test-infrastructure changes.
- Browser: mounted Dutch controls have native labels for name/season and `aria-labelledby` for type.
  Required name/season Messages are explicitly associated via descriptions; name has `aria-invalid`.
  Native InputNumber shows invalid styling but does not expose `aria-invalid` on its inner input;
  full screen-reader/invalid-state audit remains unverified, with no custom wrapper workaround.
- Light/dark x 390px/1440px: basic section fits in all four cases, including empty/long-name states.
  Narrow bounds 44.75-330.25px (client/scroll 286px); wide 110.75-1329.25px (1219px).
  These are section measurements, not a claim that the entire page/topbar is overflow-free.
- Required empty name/season yields two Dutch Messages; valid correction removes both after the native
  leave animation (350ms wait). Initial immediate DOM probes included outgoing Messages and were not
  accepted as corrected-state results; final real-input Playwright checks pass.
- Synthetic season values 1999/2101 are invalid with native invalid styling; 2000/2100 are valid.
  Existing range validators/options and mutation logic are unchanged.
- Native keyboard Tab moves name -> season -> type; ArrowDown/End/Enter selects `NATIONAL`;
  Shift+Tab returns to season in all four theme/width cases. Dirty tracking is true after edits.
- Four after screenshots (light/dark at 390/1440) inspected with long safe names and focused season.
  Screenshots reside in this session's files as `DR-018a-{light|dark}-{390|1440}.png`;
  the recorded DOM/keyboard outcomes here are the persistent evidence, not a dependency on those files.
- Final reload restores real values, `PROV`, read-only permissions, pristine state and zero Messages.
  Theme/dimensions restored; shared browser returned to its original homepage. Zero observed GraphQL mutations.
- Existing country/state NG01354 warnings remain DR-018b dependencies; shared topbar remains DR-066.
- Not run: live saves/persistence, full accessibility/contrast, alternate locales, full SSR/hydration
  and automated unit/e2e suites. Read-only and browser-only editable checks do not prove live permissioned saves.
- Visual result inspected by the assistant. User explicitly approved completion on 2026-11-14:
  `Approve DR-018a and commit with disclosed limits`. Backlog status is Done.
  Approval accepts the not-run checks and native InputNumber accessibility limit above without claiming
  unperformed checks passed; the full accessibility/localization/SSR criterion remains unchecked.
  Approval authorizes only this template and the three repository handoff documents; no push is authorized.
- Exceptions: none introduced.
- Exact next action: scope DR-018b with explicit shared-selector dependencies and create its brief
  before implementation. Keep DR-018 open; do not restart DR-018a or start another child now.
