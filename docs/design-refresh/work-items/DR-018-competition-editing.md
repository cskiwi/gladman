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
- DR-018e: page chrome, tab selection and save feedback.
- Keep the parent open until all required children and integrated review are complete.

## Baseline and decisions

- Clean worktree at selection. Mounted Dutch information tab contains real populated data.
- Current account lacks information-edit permission; all six controls are disabled. Do not grant permissions.
- Existing information/dates/settings components already separate form responsibilities from page orchestration.
  No repeated basic-information structure warrants an additional smart/presentational extraction.
- Basic heading uses paired numbered primary colors; season/type labels target hosts, not inner controls.
- Country/state wrappers have no label-input API and produce existing NG01354 warnings.
  Handle these as explicit dependencies of DR-018b, not hidden shared changes in DR-018a.
- Existing page listens for `activeIndexChange` rather than native Tabs `valueChange`; inspect in DR-018e.
- Existing type option names and save/load feedback contain English literals; localization belongs to their
  respective child scopes. No translation or backend change is required for DR-018a.

## Parent acceptance

- [x] Confirm mounted consumer and split into independently reviewable children.
- [ ] Complete all required children.
- [ ] Review integrated page, permissions, navigation and non-mutating interaction checks.
- [ ] Record remaining operational, localization, accessibility and SSR verification limits.
- [ ] Obtain parent approval.

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
Next: confirm mounted page chrome/actions, scope DR-018e and create its brief before implementation.
Keep DR-018 open and DR-018e unstarted. Approval authorizes only DR-018d and its handoff commit; no push.
