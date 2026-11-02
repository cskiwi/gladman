---
title: 'DR-019: Tournament browsing'
description: 'Parent scope and child sequencing for tournament detail and club browsing.'
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
- Club browsing is a separate route, `/tournament/club/:clubId`; confirm a current consumer before selection.
- Exclude creation/editing, enrollment submissions, draw pages, live displays and admin operations (DR-020 to DR-026).

## Required children

| ID                                        | Scope                                       | Selection condition                            |
| ----------------------------------------- | ------------------------------------------- | ---------------------------------------------- |
| [DR-019a](DR-019a-tournament-identity.md) | Complete tournament hero parity             | Confirmed mounted; corrected after user review |
| DR-019c                                   | Four public live-navigation links on detail | Confirmed mounted; scope separately            |
| DR-019d                                   | Sub-event groups and draw links on detail   | Confirmed mounted; reduce further if needed    |
| DR-019e                                   | Club tournament browsing                    | Confirm actual route consumer before selection |
| DR-019f                                   | Detail loading/error feedback               | Confirm state consumers and scope separately   |

Keep this parent open until required children are complete or explicitly deferred with approval.
Do not infer that routes behind links have been reviewed.
DR-019b is retained in the backlog only as reserved history: its summary/action scope was absorbed into
DR-019a after user feedback. It is not a required child or a future implementation candidate.

## Discovery and handoff

- Initial hero summaries had literal English copy, uppercase phase and custom metric styling.
  The corrected DR-019a removes these and localizes the complete hero.
- Live links use custom surfaces and inline result/upcoming colors: DR-019c.
- Events retain custom articles, draw links, English fallback/empty text and SCSS: DR-019d.
- Loading retains rectangle skeleton/custom surface; errors retain inline loss colors: DR-019f.
- Live links, events and feedback are not changed by DR-019a.
- DR-019a includes English/Dutch/French tournament summary translations and automatically generated types.
  No backend query, shared component or global theme change.
- The Playwright MCP profile is already in use; the integrated browser successfully confirms the real consumer.
- Parent validation/review remains pending; individual child evidence must not become a parent-wide pass.
- On 2026-10-31 the user requested the same look/feel as competition detail.
  The supplied `/competition/pbo-competitie-2026-2027` reference is mounted and compared at 390/1440px.
  Initial identity-only parity was rejected as insufficient; the same review now covers the complete hero.
  Paired light/dark 390/1440px cases compare shared Card/Avatar/title, metadata, summary classes/computed typography
  and native external action. All pass, preserving different domain values and action visibility.
  Carry this direction into DR-019c-f; differences in domain data/actions remain intentional.
- The user approved corrected DR-019a completion and commit with disclosed verification limits.
  The child brief preserves unchecked criteria; the parent remains open and no second child starts here.
- Exact next candidate: scope DR-019c, the mounted detail page's four live-navigation links.
