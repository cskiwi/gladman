---
title: 'DR-018: Competition editing'
description: 'Bounded rollout for the mounted competition editing page.'
---

## Identity and scope

- ID: DR-018. Status is authoritative in the [backlog](../backlog.md).
- Rules: [design refresh](../README.md). Dependency: completed DR-015.
- Confirmed consumer: `/competition/pbo-competitie-2026-2027/edit`, mounted on 2026-11-14.
- Project: `frontend-pages-competition`.
- [Routes](../../../libs/frontend/pages/competition/src/lib.routes.ts) mount the
  [editor](../../../libs/frontend/pages/competition/src/pages/edit/page-edit.component.ts).
- Preserve permissions, six information controls, dates/settings, mutation payloads and navigation.
- Exclude shared theme/components, operational saves, synchronization and dependency upgrades.

## Children

- DR-018a: basic information (name, season and type); first implementation slice.
- DR-018b: location/contact information and information-tab feedback; split into b1/b2.
  [DR-018b1](DR-018b1-country-state-selectors.md) handles the shared selector prerequisite;
  [DR-018b2](DR-018b2-location-contact-presentation.md) handles page presentation/feedback after b1.
- [DR-018c](DR-018c-competition-dates.md): dates tab.
- [DR-018d](DR-018d-competition-settings.md): settings tab.
- [DR-018e](DR-018e-competition-editor-chrome.md): page chrome, tab selection and save feedback.
- Keep the parent open until all required children and integrated review are complete.

## Baseline and decisions

- Clean worktree at selection. Mounted Dutch information tab contains real populated data.
- At the 2026-11-14 baseline the account lacked information-edit permission; all six controls were disabled.
  The 2026-11-16 integrated review has editable forms. Do not grant or change account permissions.
- Existing information/dates/settings components already separate form responsibilities from page orchestration.
  No repeated basic-information structure warrants an additional smart/presentational extraction.
- At baseline the basic heading used paired numbered primary colors and season/type labels targeted hosts.
  DR-018a replaced the colors and associated labels with native controls.
- At baseline country/state wrappers lacked label-input APIs and produced NG01354 warnings.
  DR-018b1 addressed that explicit shared prerequisite; it was not a hidden change in DR-018a.
- At baseline the page listened for `activeIndexChange` rather than native Tabs `valueChange`; fixed in DR-018e.
- Existing type option names and save/load feedback contain English literals; follow-up is DR-068.
  No translation or backend change was required for these presentation children.

## Parent acceptance

- [x] Confirm mounted consumer and split into independently reviewable children.
- [x] Complete all required children.
- [x] Review integrated page, permissions, navigation and non-mutating interaction checks.
- [x] Record remaining operational, localization, accessibility and SSR verification limits.
- [ ] Complete the full screenshot matrix, keyboard/pointer, navigator/calendar/overlay and accessibility checks.
- [ ] Verify alternate locales, operational save-all/persistence and full SSR/hydration.
- [x] Obtain parent approval.

## Handoff

DR-018a is Done with explicit approval (`Approve DR-018a and commit with disclosed limits`, 2026-11-14):
native semantic basic section, labels and validation feedback.
Focused competition lint/build pass; four theme/width browser checks and screenshots pass for this section.
Approval accepts the child's recorded limits without claiming unperformed checks passed.
No form logic, shared components, translations or mutations changed.
Current: DR-018b1's shared selector prerequisite is Done with explicit approval (`commit`, 2026-11-16).
Shared-components/competition lint/build and four-case field geometry pass; native DOM CVA handlers pass.
Physical keyboard/pointer, overlay visibility, full accessibility and other child-recorded limits remain unverified.
Approval accepts those disclosed limits without claiming unperformed checks passed; unchecked criteria remain.
DR-018b2 is Done with explicit approval (`Approve DR-018b2 and commit with disclosed limits`, 2026-11-16).
It implements semantic location/contact sections, native email validation and named saving feedback.
Four focused tests and competition lint/build pass; its unchecked verification limits remain recorded.
DR-018b integrated review on 2026-11-16 confirms assembled labels, responsive geometry and non-mutating form feedback.
Current account has edit permission; real enabled/pristine/untouched values restored after browser-only fixtures.
Physical keyboard/overlay, screenshot matrix, accessibility/contrast, locales, persistence and SSR limits remain.
DR-018b is Done with explicit parent approval (`Approve DR-018b and commit with disclosed limits`, 2026-11-16).
Approval accepts those limits without claiming unperformed checks passed; unchecked criteria remain.
DR-018c is Done with explicit approval (`Approve DR-018c and commit with disclosed limits`, 2026-11-16):
native fluid date/time controls, semantic sections,
associated labels/hints/icon names and named saving feedback. Competition lint/build and three focused tests pass.
Light/dark 390px/1440px DOM geometry fits; dark-wide after screenshot inspected.
Physical keyboard/clear/time selection, full screenshot matrix, contrast/accessibility, alternate locales,
live saves and full SSR/hydration remain unverified. Existing DR-043/066 and page orchestration DR-018e stay separate.
Approval accepts the child's recorded limits without claiming unperformed checks passed; unchecked criteria remain.
DR-018d implements the mounted settings tab's four semantic sections, five labelled native controls, described hints,
fluid sizing and named saving feedback. No form/persistence logic, translations or shared styling changed.
Competition lint/build and four focused tests pass. Light/dark 390px/1440px DOM geometry/feedback checks pass;
dark-wide after screenshot inspected. Native DOM toggles/matcher edits and disabled-state fixtures pass.
Physical interactions, ranking bounds/unit selection, full screenshot matrix, accessibility/contrast,
alternate locales, live saves and full SSR/hydration remain unverified. DR-058/066/068 are separate follow-ups.
DR-018d is Done with explicit approval (`Approve DR-018d and commit with disclosed limits`, 2026-11-16).
Approval accepts its recorded limits without claiming unperformed checks passed; unchecked criteria remain.
DR-018e is selected on 2026-11-16 after confirming mounted page chrome/actions and reproducing stale current-tab state.
Scope: native page chrome/feedback, native tab selection and guarded save actions; child forms/persistence stay unchanged.
DR-018e implements native chrome/feedback, correct current-tab save routing and guarded busy actions.
Competition lint/build and seven focused tests pass. Light/dark 390px/1440px DOM geometry/feedback checks pass.
Dark-wide before/after screenshots inspected; light-narrow capture is partial. Child forms and payloads are unchanged.
Physical keyboard/pointer, native navigator, full screenshot review, accessibility/contrast, animation exit,
alternate locales, operational save-all workflows, persistence and full SSR/hydration remain unverified.
No browser save/mutation method was activated. Existing DR-058/066/068 remain; source-only DR-069 is separate.
DR-018e is Done with explicit approval (`Approve DR-018e and commit with disclosed limits`, 2026-11-16).
Approval accepts its recorded limits without claiming unperformed checks passed; unchecked criteria remain.
Required precommit workspace lint passes for all 34 projects, three cached; existing warnings remain.

## Integrated parent review, 2026-11-16

- Selected from the recorded next action after reconfirming the mounted editor and clean worktree.
  All required children are Done with explicit approvals; none were restarted.
  Scope: assembled tabs, responsive layout, labels, permissions, navigation and safe non-mutating interactions.
- The page already owns orchestration while three child components own their forms and shared selectors own CVAs.
  No repeated domain presentation justifies another smart/presentational extraction.
  No application, test, translation, backend, shared component or theme files changed in this invocation.
  No markup/utility or styling exception was introduced; child before/after counts remain historical evidence.
- `npx nx show project frontend-pages-competition --json` confirms existing lint, build and Jest targets.
  `npx nx run frontend-pages-competition:test --testPathPatterns=pages.edit --output-style=static` passes:
  four suites, 18 tests, uncached. Covers the real assembled children/native tabs, routing to mocked child saves,
  permissions, dirty values, labels/hints, validation and busy/error recovery. Mutation stubs are never called.
  Existing Nx Jest executor deprecation remains. An initial pipe-separated regex command failed in Windows shell
  parsing before tests ran; the directory selector above resolves it without changing tooling.
- No new lint/build run: changes are documentation-only. Child lint/build evidence and DR-018e's workspace lint
  remain historical; the test rerun is integrated regression evidence, not proof of persistence or visual review.
  Both changed documents were formatted; focused `npx prettier --check` and `git diff --check` pass.
  Git warns that local configuration may convert LF to CRLF on a future checkout; authored files retain LF.
- Twelve real Dutch DOM cases: all three tabs in light/dark at 390px/1440px.
  Header/Card bounds are x=14..361px at 390px and x=80..1360px at 1440px.
  Sections are 279px/1212px wide with matching client/scroll widths.
  All six information, seven date and five settings controls fit their panels and have native labels or ARIA names.
  No duplicate IDs; each selected tab matches page state and has a valid two-way tab/panel ARIA association.
  This measures page sections/controls, not full-page overflow or overlay usability.
- Browser-only fixtures set empty name/season, invalid email, an optional date and a safe matcher value.
  All three forms retain dirty values across tab changes; unsaved feedback and Save All enabling appear.
  Name/season/email validation descriptions point to actual Messages.
  Each child's saving fixture disables all three page actions, sets `aria-busy=true` and names live progress.
  Stored failure and saving recovery retain form values and restore actions.
  Disabling the browser forms preserves values and disables native inputs; denied account permissions are covered
  separately by the focused tests, not by altering the real account.
- Fixture cleanup restores original raw values, enabled/pristine/untouched state and signals.
  Hidden-page Message exit nodes linger after cleanup; reload clears them. No animation workaround added.
  A subsequent clean/pristine guard confirms zero Messages before native DOM Cancel navigation;
  destination is `/competition/pbo-competitie-2026-2027`.
  This verifies the actual relative route without invoking saves, not pointer interaction.
- Dark-wide information screenshot inspected at 1693px/1272px.
  Light-narrow settings screenshot shows wrapping actions, native tab navigator and stacked sections,
  but sits in a larger blank canvas. It is partial evidence, not a passed full screenshot matrix.
  There is no visual implementation delta in this review-only invocation.
- After programmatic first-tab focus, physical ArrowRight/Enter moves focus to Data and page state to `'1'`
  while the browser reports `visibilityState: hidden`. This is one partial keyboard check, not full keyboard,
  pointer, focus-order, native navigator, calendar/time or overlay verification.
  Full contrast/accessibility, screenshot matrix and animation exit remain unverified.
- Alternate locales, operational save-all success/failure, live persistence and full SSR/hydration are not verified.
  No browser save or mutation method was activated. The recurring browser view-transition abort remains observed,
  with no source change or claim of full hydration validation.
  Existing DR-043/058/066/068/069 remain separate; no new out-of-scope implementation started.
- Original dark preference and viewport 1693px/1272px restored; browser returned to the original homepage.
- Result: Done with explicit parent approval (`Approve DR-018 and commit with disclosed limits`, 2026-11-16).
  Approval accepts the incomplete screenshot matrix, physical keyboard/pointer, navigator/calendar/overlay,
  accessibility/contrast, animation exit, alternate locales, operational save-all/persistence and full SSR/hydration
  limits above. Unchecked criteria remain; approval does not establish that they passed.
  Approval authorizes only this parent's review/handoff commit; no push.
- Exact next action: reconcile open DR-021 against its completed enrollment children and deferred DR-021i.
  Keep DR-021i and DR-069 unstarted; do not begin another implementation slice in this invocation.
