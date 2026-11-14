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
- DR-018b: location/contact information and information-tab feedback. Scope shared selector dependencies separately.
- DR-018c: dates tab.
- DR-018d: settings tab.
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
Next: scope DR-018b with its shared-selector dependencies and create the brief before implementation.
Keep the parent open; do not begin another child in this invocation.
