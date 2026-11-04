---
title: 'DR-021h: Enrollment ranking summary visual polish'
description: 'Deferred user-requested visual improvement of the Jouw Rankings summary.'
---

## Identity

- ID: DR-021h. Parent: [DR-021](DR-021-tournament-enrollment.md).
- Dependency: complete DR-021b review first. Status: [backlog](../backlog.md).
- Design rules: [plan](../README.md).
- Added at the user's explicit request on 2026-11-04; DR-021b approval must not close this follow-up.

## Scope

- Confirmed consumer: `/tournament/8658b541-702a-408e-8114-2858a9428069/enroll`.
- Project: `frontend-pages-tournament`.
- Existing [filter template](../../../libs/frontend/pages/tournament/src/pages/general-enrollment/components/enrollment-filters/enrollment-filters.component.html).
- Improve the visual hierarchy, grouping and responsive presentation of `Jouw Rankings`.
  The current semantic heading/list is a baseline, not an accepted final ranking design.
- Preserve partial/absent rankings, translated disciplines/levels, associated checkbox and filtering behavior.
- Exclude filter fields, event tiles, cart, permissions, theme, backend, translations and enrollment mutations.

## Baseline and proposed approach

- DR-021b removes the legacy palette banner but the user explicitly requests further visual improvement.
- When selected, capture safe ranked/partial/unranked light/dark narrow/wide views and agree a bounded
  PrimeNG-first improvement. No proposed implementation is approved or started in this invocation.
- Keep the meaningful smart-page/filter-child split. Extract presentation only for genuine reusable structure,
  not solely to hide utility classes.

## Implementation checklist

- [ ] Confirm dependency and mounted consumer when selected.
- [ ] Capture baseline and refine native semantic ranking presentation.
- [ ] Preserve ranking data, checkbox behavior, labels and translations.
- [ ] Record class comparison, affected consumers and any discoveries.

## Acceptance and verification

- [ ] Rank disciplines/values and checkbox remain complete and associated.
- [ ] Light/dark 360/390/768/1440px and partial/absent rankings remain usable.
- [ ] Keyboard, focus, labels and contrast are checked with shared issues disclosed.
- [ ] No new palette classes, SCSS or equivalent styling workaround.
- [ ] Relevant Nx lint/test/build pass, with exact commands and browser evidence.
- [ ] User explicitly reviews the improved ranking presentation.

## Evidence and handoff

- Source: DR-021b user review on 2026-11-04: keep `Jouw Rankings` visual improvement on the backlog.
- No implementation, validation or styling exception claimed for this follow-up.
- Exact next action: leave open until selected after DR-021b review; do not close with DR-021b.
