---
title: 'DR-014b: Team hero statistics'
description: 'Readable, localized team statistics within the existing shared hero.'
---

## Identity and scope

- ID: DR-014b; parent [DR-014](DR-014-club-team-detail.md).
- Status: authoritative in the [backlog](../backlog.md).
- Dependency: DR-014a Done. Rules: [design refresh plan](../README.md).
- Selected on 2026-11-14 with a clean worktree.
- Confirmed mounted consumer: `/clubs/smash-for-fun/teams/ea2d1aa1-14f9-4f3a-83e8-0acbd43864da`.
  [Nested route](../../../libs/frontend/pages/club/src/lib.routes.ts) mounts the page from the club Teams tab.
- Project: `frontend-pages-club`;
  [template](../../../libs/frontend/pages/club/src/pages/team-detail/page-team-detail.component.html)
  stats slot and nl_BE/fr_BE/en translation assets only.
- Preserve roster/encounter counts, W/L perspective, ties excluded from the win-rate denominator, integer percentage,
  > = 50% success threshold, next-encounter ordering and local date/time semantics.
- Exclude identity/contact/loading chrome, roster, encounter sections/Cards, permissions, SEO, services,
  queries, membership operations, global theme/shared components and unused team-encounters.

## Baseline and approach

- Mounted Dutch page still shows English Roster, Season record, Matches, Next match and wins.
- Oversized custom font metrics, `t-eyebrow`, six manually paired green/red classes and a truncated opponent name.
- Follow the completed club hero's compact metrics/native Tag pattern; use a semantic description list for
  label/value associations. Render both W/L counts equally and a readable wrapping next encounter/date.
- Existing smart service and shared presentational hero provide meaningful separation already.
  Do not create a one-consumer component or change the shared legacy statistic renderer just to hide classes.
- Add team-specific translated labels, explicit W/L accessible copy and no-upcoming copy.
- No new styling, palette utilities, dependencies or operational mutations.

## Implementation checklist

- [x] Confirm mounted consumer, dependency and one reviewable slice.
- [x] Simplify and localize statistics using semantic markup/native severity.
- [x] Preserve counts, calculation and next-encounter selection (source comparison).
- [x] Record before/after utility usage and validation.
- [x] Keep excluded areas and shared consumers unchanged.

## Acceptance and verification

- [x] Loaded statistics fit light/dark at 390px/1440px without clipping.
- [x] Zero counts/no upcoming encounter, ties, both win-rate severities and long names remain usable.
- [x] Labels/value associations and sampled text contrast pass; no new interactive focus stops.
- [ ] Dutch/French/English copy and parameters are served and render without raw keys.
- [x] No new CSS, non-semantic colors, shared changes or service/calculation changes.
- [x] Focused Nx lint/build pass; tests and SSR/hydration limitations recorded separately.
- [x] Visual/user review received with disclosed verification limits.

## Evidence and handoff

- Baseline: mounted dark wide shows roster 7, W/L 0–1, 0% wins, encounters 10 and next date 5 December at 19:00.
  Two tied/zero-score played encounters are excluded from the existing win-rate denominator; preserve this behavior.
- Implemented semantic `dl`/`dt`/`dd` label/value associations, equal-size W/L metrics, screen-reader W/L copy,
  native success/danger Tag, wrapping opponent names, machine-readable local date/time and explicit no-upcoming copy.
- Existing smart service/shared presentational hero retained. The completed club hero is the source pattern;
  no shared wrapper, legacy statistic styling change or new component was necessary.
- Utility comparison: stats literal class tokens **87 -> 62**, dynamic palette bindings **6 -> 0**.
  Four `m-0` utilities reset native definition-list indentation in this app (no shared preflight assumption).
  Outside-stats template content compares equal after whitespace removal. No TypeScript/service edits.
- Seven new translation keys have identical names/parameters across nl_BE/fr_BE/en; JSON parse passes.
  Existing `all.game.upcoming.noGamesFound` reused for the no-upcoming state.
- API automatically regenerated only the nine related stats type lines in
  `libs/utils/i18n/src/lib/i18n.generated.ts`; preserve this directly related generated output.
- **Passed:** `NX_DAEMON=false npx nx run-many --target=lint,build --projects=frontend-pages-club`:
  12 tasks succeeded / 10 cached. Scoped files formatted with repository `npx prettier --write`.
  Follow-up after generated-type formatting: same command passes, 12 tasks succeeded / 8 cached.
- **Failed before execution:** `NX_DAEMON=false npx nx run frontend-pages-club:test
--testPathPatterns=page-team-detail.service.spec.ts --runInBand --output-style=static`:
  missing `zone.js`, zero tests executed (existing DR-059). No test/dependency infrastructure changed.
- **Passed:** `git diff --check`; source locale key/parameter parity and outside-scope comparison.
- **Initial browser blocker, now resolved:** frontend navigation reset, then ports 3000 and 5000 refused connections.
  A bounded 180-second listener wait did not restore both servers. No shared server/process was stopped or restarted.
- User responded `Servers restored; continue DR-014b verification` on 2026-11-14; not completion/commit approval.
- **Passed after recovery:** both ports serve all seven stats keys in nl_BE/fr_BE/en (six HTTP 200 responses).
  Mounted Dutch hero shows translated copy with no raw new keys.
- **Passed:** loaded Dutch light/dark at 390px/1440px with no stats/document overflow, four term/definition pairs,
  zero interactive descendants and local machine-readable date `2026-12-05T19:00:00+01:00`.
- **Passed:** six synthetic cases in all four theme/width combinations, using the mounted component's in-memory
  encounter signal and restoring it in `finally`. No queries/mutations or database operations for these fixtures.
  Empty roster/encounters show zero metrics, no rate Tag and explicit no-upcoming text. Ties retain 0–0/0% danger.
  One home win / one away loss / one tie gives 1–1/50% success (tie excluded from denominator).
  An away win gives 1–0/100% success. Long unbroken synthetic home/away names wrap without cell/strip overflow.
  Two future encounters select the earlier date; an undated encounter retains names without a bogus date.
  The request observer recorded **zero GraphQL mutations** in this matrix.
- **Passed:** safe stats-only screenshots reviewed for final dark narrow and light wide.
  Initial screenshot exposed native 40px `dd` indentation; four `m-0` utilities fix it, and all 24 synthetic
  cases plus final loaded wide confirm computed 0px indentation.
- **Passed:** sampled text contrast using canvas conversion of the actual OKLCH colors to sRGB and background
  compositing. Light/dark ratios: label/date **4.87/6.65:1**, metric **19.87/16.00:1**,
  danger Tag **5.30/8.73:1**, success Tag **4.57/10.51:1**. An initial RGB-only sampler could not interpret
  OKLCH correctly; those intermediate values were discarded, with no palette workaround.
- Screen-reader W/L copy is visually hidden at 1px; numeric visual counterpart has `aria-hidden`.
  Native description-list relationships and zero added focus stops checked. Full assistive-technology audit not run.
- **Passed after alignment correction:** same focused Nx lint/build command, 12 tasks succeeded / 10 cached.
- No new tests: calculations/services are unchanged; browser fixtures verify the introduced template behavior.
  Default existing tests remain blocked by DR-059, not claimed as passed.
- **Not verified:** French/English browser rendering (endpoint/source parity only), full accessibility and SSR/hydration.
  Angular date day/month remains the existing English DatePipe locale; no locale-selection change in this slice.
- Real route/data restored after fixtures. Initial dark preference and 1693x1272 browser dimensions restored
  (initial Playwright viewport was null). User-owned servers remain running.
- Exceptions: none.
- User approved completion/commit on 2026-11-14:
  `Approve and commit DR-014b with disclosed limits`. Authoritative status **Done**.
- Approval accepts default tests blocked by DR-059, French/English browser, full accessibility and SSR/hydration
  limits without claiming those checks passed. The remaining locale acceptance checkbox stays unchecked.
- Exact next action: scope DR-014c roster from the same mounted team route and create its brief before implementation.
  DR-014c/d were not started; parent DR-014 stays open.
- Commit authorization covers this child's template, three locale assets, generated types and repository handoff only.
  No push authorized.
