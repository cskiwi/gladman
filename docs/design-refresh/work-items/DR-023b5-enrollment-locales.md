---
title: 'DR-023b5: Enrollment locale completeness'
description: 'Complete the mounted administration enrollment copy without changing layout or operations.'
---

## Identity

- ID: DR-023b5; parents DR-023b and DR-023 remain open.
- Authoritative status: [backlog](../backlog.md).
- Dependencies: approved DR-023b1/b2/b3/b4 and confirmed DR-023b consumer.
- Design rules: [rollout](../README.md).

## Scope

- Confirmed mounted route: `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=enrollments`.
- Projects: frontend-pages-tournament, backend-translate; API asset build and generated i18n types as needed.
- Sources: [component][component], [service][service], [tests][tests] and enrollment dictionary entries
  in [English][en], [Dutch][nl] and [French][fr].
- Complete the five summary descriptions and translated Withdrawn status.
- Translate guest/preferred/unknown identity annotations, native confirmation prompts and local failure messages.
- Correct French enrollment terminology in the mounted heading, total and sub-event label.
- Preserve enum values, data, filters, selection, permissions, native confirmation decisions and mutation payloads.
- Exclude layout/styles, other tabs, backend business rules, global theme, dependencies and live operational writes.
- Existing manual-dialog copy is complete; verify it without redesigning it again.
- Leave unconsumed dictionary blanks and unused updateEnrollment behavior unchanged.

## Baseline and proposed approach

- Worktree clean on 2026-11-08. Approved DR-023b4 is committed as `29dd2ef1`; no pending commit remains.
- Fresh authorized browser confirms one actual `app-enrollments-tab` on the non-DRAFT route.
- Dutch summary renders five empty description definitions; Withdrawn is hard-coded English.
- Table identities and confirmation prompts use English literals; local service diagnostics/fallbacks are English.
- French heading/total incorrectly refer to subscriptions; the sub-event label says Section.
- Keep existing native Panel/Table/Dialog/Select/Message/Button components and smart tab/service separation.
  No repeated presentation structure warrants a new dumb component in this locale-only slice.
- Reuse `all.common.unknown`; add enrollment-specific keys for the remaining mounted copy.
- Retain backend/network Error messages verbatim rather than hiding diagnostics or claiming server localization.
- Utility/style counts are unchanged by intent; zero new SCSS, inline styles or palette classes.

## Implementation checklist

- [x] Confirm actual consumer, dependencies and narrow scope.
- [x] Complete mounted copy in all three locale assets and wire translated literals.
- [x] Add asset-backed regressions for summary, statuses, identities, prompts and local errors.
- [x] Verify existing dialog labels and preservation of query/mutation behavior.
- [x] Format, validate and persist evidence/handoff.

## Acceptance and verification

- [x] Five summary descriptions and six status options are meaningful in all three locales.
- [x] Guest/preferred/unknown identities and cancel/promote prompts use current locale and retain player names.
- [x] Local failures are explicit and localized; server/network diagnostics remain visible.
- [x] Locale switching updates status labels without changing enum values or refetching.
- [x] Existing dialog labels/actions remain meaningful in all three locales.
- [x] Light/dark at 390/1440px preserve restored text, labels and keyboard usability.
- [x] No styles, dependencies, backend business logic or operational visual-test writes change.
- [x] Focused existing Nx lint/build/test pass with exact results recorded.
- [ ] Exhaustive screen-reader/contrast, live operational workflows and SSR/hydration verified.
- [x] User review or explicit approval with disclosed limits.

## Evidence and handoff

- Before evidence: live Dutch route has summary counts zero, five blank descriptions, native table and empty feedback.
- English/Dutch/French assets are the only served application locales, confirmed in the translation controller.
- Unconsumed blank keys are not evidence of mounted UI; do not add consumers just to refresh them.
- Passed: repository Prettier on changed files; focused enrollment tests, 1 suite / 54 tests.
  Ten additional regressions cover the three locale assets, confirmation decisions/payloads,
  diagnostics and reactive locale switching; existing 44 regressions still pass.
- Passed: scoped tournament/translation lint/build, API development build and app browser/SSR development build.
  Exact commands:

  ```powershell
  $env:NX_DAEMON='false'
  npx nx run frontend-pages-tournament:test --testFile=enrollments-tab.component.spec.ts --runInBand --output-style=static
  npx nx run-many --projects=frontend-pages-tournament,backend-translate --targets=lint,build --output-style=static --parallel=2
  npx nx run api:build:development --output-style=static
  npx nx run app:build:development --output-style=static
  ```

- Initial test-suite nesting and serialized-player fixture were corrected; final focused suite passes.
- Browser blocker: rebuilt assets contain the changes, but the running translation loader has `watch` disabled.
  Fresh GET `/api/v1/translate/i18n/nl_BE` still returns HTTP 200 with an empty totalDescription
  and no withdrawn key. Port availability alone does not prove the updated dictionary is loaded.
  API restart is required before live locale/layout checks and generated i18n types can be verified.
- No live mutations, new styling, dependencies, backend business rules or other tabs changed.
- Shared primitive appearance/utility usage is unchanged; no new wrapper component.
- Existing other-tab Schedule/Check-in HTTP 400 errors remain excluded.
- User restarted the API. Actual HTTP 200 dictionary responses now contain the new descriptions,
  withdrawn and local failure keys in English/Dutch/French; generated i18n types contain the eleven new keys.
  The restart blocker is resolved, not a remaining limitation.
- Post-generation Prettier and scoped lint/build pass; focused tests again pass 1 suite / 54 tests.
  No application sources changed after these checks.
- Fresh actual browser reload renders all five Dutch descriptions.
  Twelve settled cases (three locales, light/dark, 390/1440px) have meaningful descriptions and six
  translated native status options; descriptions and overlays fit, with no document overflow or raw keys.
  Measurements explicitly wait for native theme/overlay transitions; early transient measurements are not passes.
- Keyboard End/Enter selects Withdrawn and sends the exact enum `WITHDRAWN`.
  Switching French to Dutch keeps that selection and sends zero additional enrollment queries.
  Native dialog Cancel closes and returns focus to the actual Add action.
- Three-locale populated table evidence uses a temporary browser-only SubEventEnrollments response fixture
  on the real mounted doubles consumer. Guest/preferred/unknown annotations and Withdrawn Tags render correctly.
  Both native cancel/promote prompts contain the safe player name and correct locale; all six are dismissed.
  Observed browser interactions send zero mutations. Initial sparse fixture fields cause Apollo cache warnings,
  not backend failures or evidence that populated live operations were run.
- Explicit null-list query fixtures show localized errors in all three locales; real-query refresh recovers.
  A missing-field fixture can reuse Apollo cache data, so it was not counted as live error evidence.
  Local errors are translated when raised; existing Error diagnostics are retained until retry, not retranslated.
- Safe summary-only narrow screenshots were inspected in light/dark; no clipped descriptions.
  They are optional session evidence, not the only handoff or committed personal-data screenshots.
- Sampled restored-description contrast passes: 4.87:1 light and 6.65:1 dark.
  Measured browser OKLCH colors are converted through an sRGB canvas before luminance calculation;
  the initial RGB-only parsing attempt was invalid and is not counted as contrast evidence.
- Browser interceptors are removed; Dutch, dark mode, wide viewport and original singles/all-status selection restored.
- Not run: exhaustive screen-reader/contrast, live operational enrollment workflows, full tournament suite
  and dedicated SSR/hydration verification. Native DR-034 error-message contrast remains an accepted prior limit,
  not fixed by this locale slice. App browser/SSR compilation is not hydration verification.
- Exceptions: none; existing DR-034 native error-message contrast remains outside this slice.
- User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-08.
  Approval covers this locale implementation/tests, generated types and repository handoff only.
  Exhaustive accessibility/contrast, live operations, full tournament suite and SSR/hydration limits remain unchecked;
  acceptance is not evidence that those checks passed. Native DR-034 error-message contrast remains unchanged.
- Backlog marks this approved child Done; both parents stay open for aggregate acceptance reconciliation.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 workspace lint targets
  with existing warnings. Subsequent changes are approval/handoff documentation only.
- Commit only this approved slice/handoff; do not push or begin another implementation slice.
- Exact next action in a fresh invocation: reconcile DR-023b aggregate acceptance with its approved children's
  disclosed limits, then confirm a real phase-enabled DR-023c check-in consumer before selecting implementation.

[component]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.component.ts
[service]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.service.ts
[tests]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/enrollments/enrollments-tab.component.spec.ts
[en]: ../../../libs/backend/translate/assets/i18n/en/all.json
[nl]: ../../../libs/backend/translate/assets/i18n/nl_BE/all.json
[fr]: ../../../libs/backend/translate/assets/i18n/fr_BE/all.json
