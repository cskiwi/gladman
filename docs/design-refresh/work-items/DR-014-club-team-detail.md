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

| ID                                          | Scope                                              | Prerequisite                                      |
| ------------------------------------------- | -------------------------------------------------- | ------------------------------------------------- |
| [DR-014a](DR-014a-team-page-chrome.md)      | Identity, contact actions, page loading/error      | Completed DR-004 shared hero                      |
| [DR-014b](DR-014b-team-hero-statistics.md)  | Hero statistics and their copy                     | DR-014a complete                                  |
| [DR-014c](DR-014c-team-roster.md)           | Mounted roster table, actions and empty state      | DR-014a complete                                  |
| [DR-014d](DR-014d-team-encounter-chrome.md) | Upcoming/played encounter headings and empty state | DR-014a complete; preserve shared encounter Cards |

DR-014a/b/c/d are complete with disclosed limits. Integrated parent review and explicit parent approval are
recorded below. Unperformed acceptance checks remain unchecked; approval accepts those limits.

## Baseline and discoveries

- Page identity uses a clipped parallelogram crest, truncating display heading, compact bespoke level chip and
  unnamed icon-only contact links. Page error is hand-styled red text; loading uses three Skeletons.
- Hero statistics originally contained English copy, oversized metrics, `t-eyebrow` and paired palette utilities.
  DR-014b replaces these with localized compact metrics, native Tag severity and wrapping next-encounter details.
- Mounted roster originally had English headings/membership values, inline palette colors and tooltip-only action
  names. DR-014c replaces these with localized native presentation and named actions; no live mutations.
- Encounter lists already consume the shared `app-encounter-card`; DR-014d is section chrome, not Card internals.
- The sibling `components/team-encounters.component.*` has no application consumer (only its declaration was
  found). Leave it unchanged; exports/tests/unused paths do not authorize refreshing or mounting it.
- The page constructs its existing smart data service; presentational shared hero and roster already separate
  rendering from data. Reuse these; do not add a one-consumer wrapper solely to hide classes.
- Service resource selectors call `value()` without `hasValue()` guards, preventing failed-load presentation.
  DR-014a includes the directly coupled main-resource guards, not service/query/mutation redesign.
- Membership mutation errors originally only logged; DR-014c adds translated native feedback while preserving logging.
- Fallback-draw resource error handling is outside the page's main loading/error chrome; scope separately if needed.

## Parent acceptance

- [x] Confirm mounted consumer and split broad page into independently reviewable children.
- [x] Complete all required children.
- [ ] Review integrated page in light/dark, narrow/wide, with keyboard and relevant data states.
- [ ] Preserve routes, permissions, data and domain workflows.
- [x] Record parent approval and disclosed verification limits before completion.

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
DR-014c implementation and focused lint/build/zoneless tests pass. User restored frontend 3000; Dutch mounted
theme/width, safe synthetic roster/error/permission and keyboard checks pass. Inherited native danger-icon light
contrast remains DR-033; fr/en browser, live persistence, full accessibility/default tests/SSR remain unverified.
DR-014c is Done with explicit approval (`Approve and commit DR-014c with disclosed limits`, 2026-11-14).
Approval accepts those limits and the DR-033 shortfall without claiming unperformed checks passed.
DR-014d has semantic headings and native empty feedback and is Done with explicit approval
(`Approve and commit with disclosed limits`, 2026-11-14); its unchecked verification limits remain in its brief.
Integrated parent review and explicit approval with disclosed limits are recorded below.
The parent and all completed children are Done; unperformed verification remains unchecked.
DR-014b approval authorizes its template, locale assets, generated types and repository handoff commit only.
No push is authorized.

## Integrated parent review (2026-11-14)

- Selected exactly this parent review, resuming the recorded focus with a clean worktree.
  No child was reopened and no new implementation slice was started.
- Confirmed actual consumer: `/clubs/smash-for-fun/teams/ea2d1aa1-14f9-4f3a-83e8-0acbd43864da`.
  Read the mounted page, roster template and data service against the parent/child handoffs.
  Seven roster rows, seven upcoming and three played Cards match the existing recorded data.
  Headings expose one h1 and roster/upcoming/played h2s; no raw `all.*` keys or nested Cards.
- Existing smart page/service, presentational roster and shared hero/encounter Cards provide meaningful separation.
  No new dumb/smart extraction is justified for this review. Templates, utilities and behavior are unchanged.
  The unused sibling team-encounters component remains untouched.
- **Passed, DOM measurements:** dark/light at requested 390px and 1440px, with actual document client widths
  375px and 1425px during the matrix. Hero, roster and every encounter/section remain within the client bounds.
  Native roster scroll container is 282px wide with 1002px content at narrow width, versus 1215px/1215px wide.
  Whole-page narrow fit still fails: scroll width 424px against 375px client width, tracked separately as DR-066.
- **Passed, keyboard:** captain -> email -> telephone Tab sequence; both contact links show focus-visible.
  Roster player -> named Remove action -> Shift+Tab player and first encounter's first -> second team link pass
  in the four theme/width runs. No membership action was activated.
  Follow-up settled DOM checks confirm Played Enter sorting: ascending `[0,2,3,3,5,5,6]`, descending
  `[6,5,5,3,3,2,0]`. The played Card's match-detail button opens with Enter (`aria-expanded=true`), renders
  existing game results, and closes with Enter (`false`). No operational/admin mutation was performed.
- **Passed, limited visual evidence:** inspected the light-narrow screenshot of identity/statistics and roster start,
  and a native dark-wide 1693x1272 screenshot of the integrated hero/roster/upcoming list.
  The shared browser resets requested viewports between operations, producing cropped or mismatched narrow
  screenshots; an isolated temporary tab also reset to 1024px and was closed.
  Do not treat transient DOM-fit measurements as complete four-case visual acceptance.
  Pointer theme activation timed out waiting for stability; activating the existing native button through DOM
  `click()` switched the real theme for measurements. Pointer theme interaction remains unverified here.
- **Not run:** application Nx lint/build/tests, because only repository handoff documents changed.
  Child lint/build and focused test outcomes remain recorded historical evidence in their briefs;
  default missing-`zone.js` remains DR-059, not a new test pass or a dependency change.
- **Passed, documentation:** `npx --no-install prettier --write docs\design-refresh\backlog.md
docs\design-refresh\work-items\DR-014-club-team-detail.md` and `git --no-pager diff --check`.
  Git reports its existing LF-to-CRLF working-copy warning; the edited documents retain LF.
- **Not verified:** full narrow/wide screenshot review, exhaustive keyboard/screen-reader/focus-ring/contrast audit,
  French/English browser, live membership persistence, complete loading/error/empty/long-data matrix or
  SSR/hydration. Preserve the children's accepted limits and inherited DR-033 danger-icon contrast shortfall.
- No application code, translations, shared styling or dependencies changed; no new styling exception.
  No server was stopped or restarted. Original homepage, dark preference and 1693x1272 viewport restored.
- User approval: `Approve and commit DR-014 with disclosed limits` (2026-11-14). This accepts the recorded
  verification limits and inherited DR-033/059/066 issues without claiming unperformed checks passed.
  Approval authorizes closing and committing only this parent handoff; no push is authorized.
- Result: parent is **Done** in the authoritative backlog; child completion and parent approval are checked,
  broader unperformed acceptance remains unchecked. Exact next action: scope DR-015 competition detail from
  its mounted route, split into children if needed, and select one bounded child before implementation.
  DR-015 remains Backlog and was not started here.
