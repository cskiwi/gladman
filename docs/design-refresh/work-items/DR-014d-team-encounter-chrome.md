---
title: 'DR-014d: Team encounter section chrome'
description: 'Accessible headings and native empty feedback for the mounted team encounter lists.'
---

## Identity and scope

- ID: DR-014d. Status is authoritative in the [backlog](../backlog.md).
- Parent: [DR-014](DR-014-club-team-detail.md); prerequisite DR-014a is Done.
- Design rules: [design refresh plan](../README.md); project: `frontend-pages-club`.
- Confirmed mounted consumer: `/clubs/smash-for-fun/teams/ea2d1aa1-14f9-4f3a-83e8-0acbd43864da`,
  rendered by [the team-detail page](../../../libs/frontend/pages/club/src/pages/team-detail/page-team-detail.component.html).
- Preserve conditional visibility, ordering, counts, card inputs, team perspective, routes and translated copy.
- Exclude hero, roster, services, shared encounter Card internals, theme, translations, backend and mutations.

## Baseline and approach

- Clean worktree at selection on 2026-11-14. Mounted Dutch dark-wide baseline: seven upcoming and three played
  encounter cards, with 14 and six team links respectively. Both headings are decorative eyebrow spans.
- Replace eyebrows with semantic section headings and plain counts. Replace the decorative all-empty block with
  native Message feedback using both existing translated strings.
- Keep each existing encounter Card independent; nesting Cards in a new surface is not appropriate.
  The existing smart page and shared presentational Cards provide the useful separation; no extra wrapper.
- No shared styling, new colors, translation keys, or SCSS. Record utility usage and relevant browser evidence.

## Implementation checklist

- [x] Confirm mounted consumer, prerequisite and bounded scope.
- [x] Preserve visibility, order, counts, inputs, routes and existing localized copy in the template.
- [x] Use semantic headings and native feedback without new styling layers.
- [x] Record focused validation, evidence and next action.

## Acceptance and verification

- [x] Headings and counts are semantically exposed; empty feedback retains both Dutch strings.
- [x] No new palette utilities, SCSS or equivalent styling workarounds; utility comparison recorded.
- [ ] Light/dark and narrow/wide layouts, text contrast and keyboard access verified.
- [x] Populated and synthetic empty partitions, overall empty and existing card inputs/links checked.
- [ ] Localization and relevant SSR/hydration verified.
- [ ] Focused Nx lint/build/tests pass; exact results recorded.
- [x] Explicit approval with disclosed limits; unperformed checks remain unchecked.

## Evidence and handoff

- Before: mounted Dutch dark-wide view has seven upcoming and three played Cards, with 14 and six team links.
  After: same counts and links; the template retains each Card's original inputs, variants, track key and order.
- Heading class tokens increase from seven to eleven per section to provide semantic typography, wrapping, normal
  contrast and tabular counts; decorative typography classes and the custom empty block are removed.
  Reuse plain headings above independent shared Cards, and native Message for overall empty feedback.
- **Passed:** `NX_DAEMON=false npx nx run-many --targets=lint,build --projects=frontend-pages-club
--output-style=static` after final template correction (12 tasks including prerequisites; existing warnings).
- **Failed before execution:** `NX_DAEMON=false npx nx run frontend-pages-club:test
--testPathPatterns=team-detail --runInBand --output-style=static`: missing `zone.js`, already tracked by DR-059.
  No dependency or infrastructure changes. No new automated template tests were added.
- **Passed:** mounted Dutch page exposes h2 headings with 7/3 counts. In-memory signal fixtures separately exercise
  upcoming-only, played-only and all-empty states without backend writes. Both existing empty strings render in
  the native Message; restoring the real data restores the Cards. Message exit animation briefly retains its DOM.
- **Passed with limits:** Dutch real section headings and synthetic empty Message fit their containers in light/dark
  at 390px and 1440px. Narrow page scroll width is 424px versus client width 375px due to the shared topbar,
  not the sections; record and reproduce separately as DR-066. No whole-page narrow-fit claim.
- Sampled heading and count contrast against the canvas after theme transition: 18.20:1 light, 16.64:1 dark.
  The original muted count measured 4.46:1 in light mode, so counts now inherit semantic normal text.
  Tab from the first team link reaches the second with `:focus-visible`. Full keyboard/accessibility audit not run.
- **Not verified:** complete visual review, French/English browser, actual screen-reader output, focus-ring contrast,
  all interaction states, live empty records, default tests, SSR/hydration and exhaustive link ordering.
  Browser evidence is DOM/measurements; a screenshot attempt did not capture the encounter heading.
- No shared component, theme, translations, backend or operations changed; no new styling exception.
  Browser fixtures, original dark preference and viewport restored; no shared server restarted.
- User approval: `Approve and commit with disclosed limits` (2026-11-14). This accepts the recorded verification
  limits and DR-066 narrow-shell observation without claiming unperformed checks passed. Approval authorizes
  the scoped implementation and handoff commit; no push is authorized.
- Next action: review the integrated DR-014 team-detail page and its parent checklist before parent closure.
  Keep DR-014 open.
