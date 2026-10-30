---
title: 'DR-017: Competition assembly'
description: 'Incremental refresh of the mounted competition assembly workflow.'
---

## Identity and scope

- ID: DR-017. Authoritative status: [backlog](../backlog.md).
- Design rules: [design refresh](../README.md).
- Confirmed consumer on 2026-10-30: `/competition/assembly` mounts
  [PageAssemblyComponent](../../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.component.ts)
  through the [competition routes](../../../libs/frontend/pages/competition/src/lib.routes.ts).
  The local browser displays the Dutch heading, season/club/team/encounter controls, and Download action.
- Project: `frontend-pages-competition`.
- Preserve URL restoration, team/encounter selection, lineup validation, player drag/drop, generator statistics,
  permissions, translations, and save/download contracts.
- Split this broad workflow into independently reviewable children; do not migrate everything together.

## Children and remaining scope

- [DR-017a: Page heading and filter chrome](DR-017a-assembly-page-chrome.md): the first implementation child.
- [DR-017b: Reusable player row](DR-017b-assembly-player-row.md): the existing presentational component mounted in
  the regular player pool and reused by backup, doubles, singles, and substitute lists.
- [DR-017c: Desktop player pool](DR-017c-assembly-player-pool.md): only the pool surface, availability controls,
  and backup disclosure, reusing the completed row unchanged.
- [DR-017d: Desktop doubles slots](DR-017d-assembly-doubles-slots.md): only the four mounted doubles containers
  and their statistics, preserving the completed rows and CDK behavior.
- [DR-017e: Desktop singles slots](DR-017e-assembly-singles-slots.md): only the four mounted singles containers
  and their statistics, preserving completed rows/pool/doubles and CDK behavior.
- [DR-017f: Desktop substitutes](DR-017f-assembly-substitutes.md): only the mounted substitutes container,
  preserving completed rows, CDK sorting and local forms.
- [DR-017g: Desktop generation controls](DR-017g-assembly-generation-controls.md): only the mounted generator
  surface, time-range/weeks controls and action presentation, preserving generation/service behavior.
- [DR-017h: Validation overview](DR-017h-assembly-validation-overview.md): the confirmed mounted validation
  summary and existing template reused in the confirmation dialog; exclude dialog chrome/actions and rules.
- [DR-017i: Partner combinations](DR-017i-assembly-partner-combinations.md): the confirmed mounted desktop statistics
  disclosure, responsive named controls and native table/percentage presentation; preserve services and mobile.
- Scope later children only after confirming their mounted state: remaining assembly controls.
- [DR-017j: Captain/add-player searches](DR-017j-assembly-player-searches.md): the two mounted responsive
  searches, reusing presentation across desktop/mobile without changing search services or lineup selectors.
- Existing populated lineup emits NG01354 warnings about child controls not registering with the parent FormGroup.
  Investigate that functional concern separately before claiming lineup form regression coverage.
- Existing PDF download is still a logged request with an integration TODO, not document generation.
  Preserve that contract during visual work; scope functional completion separately.
- FloatLabel focused-label contrast outside this page is deferred to DR-031, not a hidden parent/theme change.
- Native unchecked Checkbox and secondary Button focus contrast is tracked as DR-032, including the desktop
  pool's remaining failures after removing scoped tokens at the user's request.
- Native Message text contrast is tracked as DR-034 after DR-017h's light severity/dark error measurements.
- Shared components, global theme, backend, and translations are not implicitly part of this parent.

## Acceptance and handoff

- [x] Confirm a mounted application consumer rather than an export or preview.
- [x] Scope the first child.
- [x] Complete and review DR-017a with explicit user approval and recorded verification limits.
- [x] Complete and review DR-017b with explicit user approval and recorded verification limits.
- [x] Complete and review DR-017c with explicit user approval and recorded native contrast/verification limits.
- [x] Complete and review DR-017d with explicit user approval and recorded verification limits.
- [x] Complete and review DR-017e with explicit user approval and recorded verification limits.
- [x] Complete and review DR-017f with explicit user approval and recorded verification limits.
- [x] Complete and review DR-017g with explicit user approval and recorded native accessibility/verification limits.
- [x] Complete and review DR-017h with explicit user approval and recorded native Message contrast/verification limits.
- [x] Complete and review DR-017i with explicit user approval and recorded native Fieldset/verification limits.
- [x] Complete and review DR-017j with explicit user approval and recorded native label/SSR/verification limits.
- [ ] Confirm and scope remaining mounted assembly surfaces.
- [ ] Complete all required children and reconcile parent acceptance.

DR-017j refreshes only the mounted responsive captain/add-player searches. Two named templates keep each
presentation in one place; native labels, full-name option/value text and long-name wrapping are verified.
After user feedback, desktop captain has its own native Card above the player Card; add-player is within the
player Card below the unchanged list/disclosure. Mobile ordering is unchanged.
All 237 competition tests, focused lint/build and eight isolated Chrome theme/width cases pass.
Native focused FloatLabel light contrast still fails at 2.66:1, tracked in DR-031; screen-reader,
exhaustive focus/hydration, mounted English/French and authenticated/save checks remain unverified.
The final SSR recheck could not connect after port 3000 stopped responding; earlier pre-grouping SSR passed.
The user approved completion/commit with these disclosed limits on 2026-10-30, including the unperformed final
SSR recheck. Approval is not evidence that failed or unperformed checks passed. DR-017j is Done.
The next candidate is one mounted information-panel surface, starting with the base-player summary;
confirm/scope it in a fresh invocation, not here. Keep DR-017 open until all required children are complete.

DR-017a is complete with explicit user approval on 2026-10-30 after a requested desktop time-range translation fix.
All 112 competition tests, repository-wide lint, app build, and the scoped browser checks pass.
Its unchecked verification limits remain recorded; approval does not establish that they passed.
The parent remains open until its required children are complete. No shared smart/presentational split is introduced
without evidence of meaningful repeated structure or behavior across real consumers.

DR-017h refreshes the mounted validation summary and existing template reused in the confirmation dialog.
Native error/warn/success Messages replace palette-colored text, while object tracking preserves repeated-code
diagnostics and refreshed interpolation. All 197 competition tests, focused lint/build and recorded browser
behavior checks pass. Native Message text fails AA in several severity/theme combinations; DR-034 records the audit.
The user approved completion/commit with those disclosed limits on 2026-10-30.
Approval is not evidence that failed or unperformed checks passed. DR-017h is Done; the parent remains open.

DR-017b refreshes the existing input-only player row for its five pool/slot call sites, without a new abstraction.
It is complete with explicit user approval on 2026-10-30 after removing host styling; see its brief for exact
evidence and unchecked limits. Approval is not evidence that unperformed checks passed.
Player-pool/slot containers and the other remaining surfaces are not implicitly complete.
The next pool child is now scoped as DR-017c with a confirmed mounted consumer.
DR-017c implements the native desktop player-pool Card, named controls, and keyboard disclosure without
`[dt]`, `[pt]`, or authored host classes, as requested in user review.
Focused tests/lint/build and browser behavior pass; native unchecked-border and dark disclosure-focus contrast
failures remain disclosed and unchecked. The user approved completion/commit with those native contrast and
verification limits on 2026-10-30; approval does not establish that failed or unperformed checks passed.
DR-017d implements native Cards and accessible success/danger statistic Tags for the desktop doubles loop only.
User review requested restoring the existing win-rate color signal; the native-Tag correction is reverified.
All 153 competition tests, focused lint/build and browser checks pass; exact evidence and unchecked verification
limits are recorded in its brief. The user approved completion/commit with those limits on 2026-10-30;
approval does not establish that unperformed checks passed.
DR-017e is now scoped after confirming all four mounted singles slots in isolated Chrome on 2026-10-30.
It refreshes only the singles loop with native Cards and accessible native Tags. All 165 competition tests,
focused lint/build and the recorded responsive/theme/browser checks pass. Its brief preserves exact evidence
and unchecked screen-reader, hydration, mounted-locale, authenticated/save and quantitative focus-ring limits.
The user approved completion/commit with those disclosed limits on 2026-10-30. Approval is not evidence that
unperformed checks passed. DR-017e is Done; no further production changes follow approval.
The historical next action to scope substitutes is fulfilled by DR-017f, confirmed mounted on 2026-10-30.
DR-017f implements the native substitutes Card, localized heading and explicit empty state, preserving
CDK sorting/drop contracts and completed rows. All 175 competition tests, focused lint/build and the recorded
browser checks pass. Its brief preserves exact evidence and unchecked verification limits.
The user approved completion/commit with its disclosed verification limits on 2026-10-30.
Approval is not evidence that unperformed checks passed. DR-017f is Done; no further production changes follow approval.
Post-approval repository-wide lint passes across all 34 projects with existing warnings, no errors.
The historical next action to scope generation controls is fulfilled by DR-017g, confirmed mounted on 2026-10-30.
DR-017g implements only the native generation-controls Card, fluid controls and hover/focus Tooltips.
The user's review correction replaces the four deprecated component Buttons with native `button[pButton]`,
direct translated text, hidden icons and child-spinner/native-disabled loading, without changing adjacent controls.
All 186 competition tests, focused lint/build and recorded browser behavior checks pass.
Preserved native light-mode Button text/focus and focused-label contrast failures remain disclosed;
DR-031 and DR-033 track the separate audits. Screen-reader/Tooltip association and other unchecked limits
remain in its brief. The user approved completion/commit with those disclosed limits on 2026-10-30.
Approval is not evidence that failed or unperformed checks passed. DR-017g is Done; no production changes follow.
The historical next action to scope validation presentation is fulfilled by DR-017h.
The historical next action to scope partner combinations is fulfilled by DR-017i.
DR-017i refreshes only the mounted desktop partner-combinations disclosure and controls.
All 215 competition tests, focused lint/build and recorded responsive/interaction checks pass.
Native Fieldset re-expansion removes Select/header tab stops; DR-035 records the separate dependency-level audit.
Full keyboard/focus, screen-reader, mounted-locale, authenticated/save and exhaustive hydration checks remain open.
The user approved completion/commit with those disclosed limits on 2026-10-30.
Approval is not evidence that failed or unperformed checks passed. DR-017i is Done; the parent remains open.
Exact next action in a fresh invocation: confirm/scope remaining mounted captain/add-player controls,
excluding completed DR-017a-i. Do not start another child here.
Do not reopen completed children. The parent remains open.
