---
title: 'DR-014: Club team detail'
description: 'Bounded child slices for the mounted club team-detail page.'
---

## Identity and scope

- ID: DR-014. Status is authoritative in the [backlog](../backlog.md).
- Design rules: [design refresh plan](../README.md).
- Project: `frontend-pages-club`.
- Confirmed mounted consumer: `/clubs/smash-for-fun/teams/1161b779-2cbe-457c-b829-e0d756ff99bc`,
  linked from the club Teams tab. The nested `teams/:teamId` route loads
  [PageTeamDetailComponent](../../../libs/frontend/pages/club/src/pages/team-detail/page-team-detail.component.ts).
- Selection on 2026-11-14: clean worktree; DR-013 and its children already Done. Do not reopen them.
- Preserve team/club/player routes, slug-to-UUID resolution, membership permissions and operations, encounter
  ordering, score calculations, localization and SEO. No shared theme/component changes or operational mutations.

## Required children

| ID                                         | Scope                                              | Prerequisite                                        |
| ------------------------------------------ | -------------------------------------------------- | --------------------------------------------------- |
| [DR-014a](DR-014a-team-page-chrome.md)     | Identity, contact actions, page loading/error      | Completed DR-004 shared hero                        |
| [DR-014b](DR-014b-team-hero-statistics.md) | Hero statistics and their copy                     | DR-014a complete                                    |
| DR-014c                                    | Mounted roster table, actions and empty state      | DR-014a complete; scope brief before implementation |
| DR-014d                                    | Upcoming/played encounter headings and empty state | DR-014a complete; preserve shared encounter Cards   |

DR-014a and DR-014b are complete with disclosed limits; DR-014c/d were not started.
Keep the parent open until all required children and parent review pass.

## Baseline and discoveries

- Page identity uses a clipped parallelogram crest, truncating display heading, compact bespoke level chip and
  unnamed icon-only contact links. Page error is hand-styled red text; loading uses three Skeletons.
- Hero statistics originally contained English copy, oversized metrics, `t-eyebrow` and paired palette utilities.
  DR-014b replaces these with localized compact metrics, native Tag severity and wrapping next-encounter details.
- Mounted roster has English headings/membership values, inline palette colors and tooltip-only mutation action
  names. Resolve these within DR-014c, without making membership mutations for visual verification.
- Encounter lists already consume the shared `app-encounter-card`; DR-014d is section chrome, not Card internals.
- The sibling `components/team-encounters.component.*` has no application consumer (only its declaration was
  found). Leave it unchanged; exports/tests/unused paths do not authorize refreshing or mounting it.
- The page constructs its existing smart data service; presentational shared hero and roster already separate
  rendering from data. Reuse these; do not add a one-consumer wrapper solely to hide classes.
- Service resource selectors call `value()` without `hasValue()` guards, preventing failed-load presentation.
  DR-014a includes the directly coupled main-resource guards, not service/query/mutation redesign.
- Membership mutation errors only log; defer user-facing feedback investigation to DR-014c.
- Fallback-draw resource error handling is outside the page's main loading/error chrome; scope separately if needed.

## Parent acceptance

- [x] Confirm mounted consumer and split broad page into independently reviewable children.
- [ ] Complete all required children.
- [ ] Review integrated page in light/dark, narrow/wide, with keyboard and relevant data states.
- [ ] Preserve routes, permissions, data and domain workflows.
- [ ] Record parent approval and disclosed verification limits before completion.

## Handoff

DR-014a is complete with explicit approval (`Approve and commit DR-014a with disclosed limits`, 2026-11-14).
Unchecked child verification limits remain accepted, not claimed as passed. The user refreshed the API on 2026-11-14:
both endpoints now serve the new keys in all three locales; Dutch main loading/error browser states pass.
The API regenerated only the related four type lines in the legacy generated i18n file; preserve the generated output.
DR-014b implementation is scoped to the mounted hero statistics and translations; lint/build pass.
After the user restored ports 3000/5000, Dutch light/dark/narrow/wide and synthetic stats cases pass.
DR-014b is Done with explicit approval (`Approve and commit DR-014b with disclosed limits`, 2026-11-14).
French/English browser, full accessibility, default tests and full SSR/hydration remain unverified.
Approval accepts those limits without claiming the unperformed checks passed.
Exact next action: scope DR-014c roster and create its brief before implementation.
Keep this parent open until all required children and parent review are complete.
DR-014b approval authorizes its template, locale assets, generated types and repository handoff commit only.
No push is authorized.
