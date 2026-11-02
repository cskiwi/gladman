---
title: 'DR-019: Tournament browsing'
description: 'Parent scope for tournament detail and retirement of obsolete club browsing.'
---

## Identity and scope

- ID: DR-019. Status: [backlog](../backlog.md).
- Rules: [design refresh](../README.md).
- Dependencies: approved shared hero direction (DR-004); no global changes.
- Project: `frontend-pages-tournament`.
- The supplied `/tournament/8658b541-702a-408e-8114-2858a9428069` mounts
  Internationaal Tornooi Lokerse BC 2023 on 2026-10-31.
- [Feature routes](../../../libs/frontend/pages/tournament/src/lib.routes.ts) mount the
  [detail page](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.ts).
- The obsolete `/tournament/club/:clubId` page was confirmed on 2026-11-02, then explicitly retired
  by user request under DR-019e. Do not recreate it or repair its deleted data queries.
- Exclude creation/editing, enrollment submissions, draw pages, live displays and admin operations (DR-020 to DR-026).

## Required children

| ID                                               | Scope                                       | Selection condition                            |
| ------------------------------------------------ | ------------------------------------------- | ---------------------------------------------- |
| [DR-019a](DR-019a-tournament-identity.md)        | Complete tournament hero parity             | Confirmed mounted; corrected after user review |
| [DR-019c](DR-019c-tournament-live-navigation.md) | Four public live-navigation links on detail | Confirmed mounted; selected on 2026-11-02      |
| [DR-019d](DR-019d-tournament-events.md)          | Sub-event groups and draw links on detail   | Confirmed loaded; selected on 2026-11-02       |
| [DR-019e](DR-019e-club-tournament-chrome.md)     | Retire obsolete tournament club page        | Approved complete with disclosed limits        |
| DR-019h                                          | Withdrawn club tournament tab redesign      | Closed by user-directed page retirement        |
| [DR-019f](DR-019f-tournament-feedback.md)        | Detail loading/error feedback               | Approved complete with disclosed limits        |

Keep this parent open until required children are complete or explicitly deferred with approval.
Do not infer that routes behind links have been reviewed.
DR-019b is retained in the backlog only as reserved history: its summary/action scope was absorbed into
DR-019a after user feedback. It is not a required child or a future implementation candidate.

## Discovery and handoff

- Initial hero summaries had literal English copy, uppercase phase and custom metric styling.
  The corrected DR-019a removes these and localizes the complete hero.
- Live links now use a native Card/outlined anchors, wrapping copy and semantic focus rings: DR-019c.
  Eight isolated responsive/theme cases and focused Nx checks pass. The user approved completion/commit
  with disclosed verification limits on 2026-11-02; unchecked child criteria remain unchecked.
- Events now use competition-aligned native Cards, headings, outlined draw links, named external actions and
  localized fallback/empty feedback: [DR-019d](DR-019d-tournament-events.md), approved complete with disclosed limits.
  Thirty-five tests, focused lint, production library build and eight isolated theme/width cases pass.
  Keep the child's disclosed verification limits; do not infer parent-wide acceptance.
- Separate discovery DR-019g: existing draw external links require `draw.visualCode`, absent from the detail query.
  Preserve the branch/URL; investigate its data contract separately, not as a hidden visual-slice query change.
- DR-019f implements native loading/error feedback and fixes the reproduced error-state resource read.
  Forty-three tests, focused lint/build and eight responsive/theme browser cases pass.
  Native light Message/progress contrast fails the existing thresholds (DR-034/DR-038); no styling override.
  Its brief preserves exact checks and user-accepted limits; parent-wide acceptance is not implied.
- Live links, events and feedback are not changed by DR-019a.
- DR-019a includes English/Dutch/French tournament summary translations and automatically generated types.
  No backend query, shared component or global theme change.
- The Playwright MCP profile is already in use; the integrated browser successfully confirms the real consumer.
- Parent closure follows the approved required children and user-directed withdrawal of obsolete work.
  Individual child evidence and accepted limits must not become a claim of a new parent-wide validation pass.
- On 2026-10-31 the user requested the same look/feel as competition detail.
  The supplied `/competition/pbo-competitie-2026-2027` reference is mounted and compared at 390/1440px.
  Initial identity-only parity was rejected as insufficient; the same review now covers the complete hero.
  Paired light/dark 390/1440px cases compare shared Card/Avatar/title, metadata, summary classes/computed typography
  and native external action. All pass, preserving different domain values and action visibility.
  Carry this direction into DR-019c-f; differences in domain data/actions remain intentional.
- The user approved corrected DR-019a completion and commit with disclosed verification limits.
  The child brief preserves unchecked criteria; the parent remains open and no second child starts here.
- DR-019c/d are approved complete with disclosed limits. The user selected
  "Approve DR-019d and commit with disclosed verification limits"; commit only that child's implementation,
  tests/translations/generated types and handoff. Keep this parent open.
- DR-019f is approved complete with disclosed verification limits. Do not start another child here.
  Confirm a real DR-019e club-browsing consumer before scoping that next candidate in a fresh invocation.
- On the subsequent 2026-11-02 invocation, DR-019e's consumer was confirmed and scope bounded to chrome.
  `ClubTeamsDetail`, `ClubTournamentHistory` and `ClubStatistics` return HTTP 400 schema validation errors;
  resource-read exceptions and untranslated labels are also reproduced. No application styling was changed.
  The user then confirmed this page should not exist and requested removal of page/routes/links.
  DR-019e now removes the route, feature export and all five page files; no inbound application links were found.
  DR-019h and DR-041 are withdrawn, not implemented or repaired. The real club-detail tournaments tab is preserved.
  Focused lint, 45 tests, production library build and ten prerequisites pass.
  The retired URL uses existing unmatched-route behavior (NG04002, ending at `/`); no redirect/404 was added.
  Tournament detail and the real club's Toernooien tab still load.
  The user selected "Approve DR-019e and commit with disclosed limits" on 2026-11-02.
  DR-019e is complete with accepted unmatched-route behavior and unperformed checks retained in its brief.
  All required children are approved complete; DR-019h/DR-041 are withdrawn, so the parent is now complete.
  DR-019g remains a separate discovery to scope next, not an unfinished required browsing child.
