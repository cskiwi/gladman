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
DR-013d has migrated player chips. Remaining dialogs are handled in their respective children.
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
[DR-013d](DR-013d-builder-player-chips.md) implements the shared player-chip presentation and is approved.
Native semantic Tags/Buttons, one combined indicator, shared common/domain translations and keyboard-accessible
details replace palette icons and hover-only access. Hover/click share one native Popover and exact positioning:
hover preserves focus; clicking pins it with focus containment and conditional autofocus. Membership is Basis (B)
or Reserve in Dutch, shared with existing team-edit/table and player-profile consumers.
Existing presentational separation, ranks, surveys and outputs remain.
Club/player lint/build pass; 13 related tests pass with the temporary zoneless override (DR-059 remains open).
Dutch light/dark wide/narrow card rows and keyboard details/edit-opening/Cancel pass; populated pools, rich/long
browser states, live mutations, fr/en browser, full accessibility and SSR remain disclosed limits in the child.
The final eight-case browser matrix preserves hover/click panel identity and geometry, including upward flipping.
The user explicitly approved completion and a scoped commit on 2026-11-13, preserving all unchecked criteria.
DR-013e [survey import](DR-013e-builder-survey-import.md) is implemented and approved with disclosed limits.
Native validated local upload, responsive Dialog/Table, named controls and localized nl/fr/en states replace
custom button styles, inline sizing and palette text. Focus follows native step/row controls and returns to the
import trigger after destruction. Native narrow suggestions use the responsive bottom chooser.
Club lint/build pass; 18 related tests pass with the temporary zoneless override. Dutch light/dark wide/narrow
layout and local interactions checked; no live confirmation/mutation. Remaining limits are in the child.
The user explicitly approved `Approve and commit DR-013e with disclosed limits` on 2026-11-13.
All unchecked verification limits remain disclosed in the child. Approval authorizes its scoped commit.
Next action after this slice's commit: scope DR-013f survey edit before implementation; not started.
DR-013g must check dialog dismissal: Enter opens it from the new keyboard-accessible action, but Escape does not
dismiss the existing dialog; Cancel closes it without applying a change. Do not repair this in the card slice.
DR-013e confirmed native Dialog requires both `closable` and `closeOnEscape`, and does not restore trigger focus.
Check these recorded findings when scoping DR-013g rather than changing the other dialogs in the import slice.

- [ ] Complete and review all required children.
- [ ] Verify the integrated builder without operational mutations.
- [ ] Record any accepted verification limits before closing this parent.
