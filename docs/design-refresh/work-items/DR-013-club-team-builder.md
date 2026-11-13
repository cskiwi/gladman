---
title: 'DR-013: Club team builder'
description: 'Incremental refresh of the mounted club team-builder tab and its dialogs.'
---

## Identity and scope

- ID: DR-013. Status: see the [backlog](../backlog.md).
- Dependencies: DR-012 (Done). Design rules: [design refresh](../README.md).
- Mounted consumer: `/clubs/:clubId`, permission-gated Ploegopstelling tab in
  [club detail](../../../libs/frontend/pages/club/src/pages/detail/page-detail.component.html).
- Project: `frontend-pages-club`.
- Preserve permissions, draft persistence, survey processing, player matching, ranking calculations,
  drag/drop, membership changes and explicit team saves.
- Do not change global styling, backend behavior or dependencies.

## Children

- DR-013a: settings dialog, selected first as a small independently reviewable surface.
- DR-013b: builder toolbar, responsive layout and player pools.
- DR-013c: presentational builder team cards.
- DR-013d: presentational player chips (pool and team-card consumers).
- DR-013e: survey import dialog.
- DR-013f: survey edit dialog.
- DR-013g: sub-event dialog.
- DR-013h: builder validation, notifications and confirmation copy (discovered English service output).

[DR-013a](DR-013a-builder-settings.md) is implemented and approved with disclosed limits.
[DR-013b](DR-013b-builder-layout-pools.md) implements the toolbar/layout/pools and is approved with disclosed limits.
Scope each remaining child and create its brief before implementation.
Keep this parent open until all required children are complete.

## Baseline and handoff

Source and browser confirmed the tab and Settings action are mounted on `/clubs/smash-for-fun`
on 2026-11-13. The existing builder already separates its service from presentational team cards/player chips.
Reuse that separation; do not extract one-to-one wrappers for native PrimeNG fields.
DR-013b localized the toolbar/pools. DR-013c localizes card-owned labels and removes card-owned palette colors.
Player chips and dialogs still contain English and palette colors; those remain in their respective children.
Service-generated validation and notification text is separate follow-up DR-013h.

DR-013a implements native fluid fields, label/help associations, Divider, responsive dialog sizing and the existing
localized title. Lint/build and an isolated accessibility regression (temporary zoneless setup override) pass.
Light/dark wide/narrow browser checks pass for layout; inherited contrast failures, default club test infrastructure
and unchecked live-save/locale/SSR checks remain disclosed in its brief.
The user approved completion and a scoped commit on 2026-11-13 with those limits accepted.
DR-013b adds native Toolbar/Panel surfaces, responsive stacking/sticky pools and localized accessible controls.
Focused lint/build and two regressions with the temporary zoneless override pass; Dutch light/dark wide/narrow
browser checks pass for layout. Default tests (DR-059), light Save contrast (DR-033), live mutation workflows,
fr/en browser and SSR remain disclosed limits. No team-card/player-chip internals or algorithms changed.
The user explicitly approved completion and a scoped commit on 2026-11-13, preserving all unchecked criteria.
[DR-013c](DR-013c-builder-team-cards.md) implements native card titles, index/status Tags, Messages,
keyboard-accessible sub-event actions, localized labels and one rendering path for every player group.
It preserves the existing service/presentational separation without adding another component.
Lint/build pass; eight related tests pass with the existing temporary zoneless override, while the default setup
still fails on DR-059. Dutch light/dark wide/narrow views fit without horizontal overflow.
Native Message contrast failures remain DR-034; remaining verification limits are recorded in the child.
The user explicitly approved completion and a scoped commit on 2026-11-13, preserving all unchecked criteria.
Next candidate/action: scope DR-013d player chips before implementation; not started.
DR-013g must check dialog dismissal: Enter opens it from the new keyboard-accessible action, but Escape does not
dismiss the existing dialog; Cancel closes it without applying a change. Do not repair this in the card slice.

- [ ] Complete and review all required children.
- [ ] Verify the integrated builder without operational mutations.
- [ ] Record any accepted verification limits before closing this parent.
