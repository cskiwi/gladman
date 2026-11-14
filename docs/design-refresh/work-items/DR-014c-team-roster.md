---
title: 'DR-014c: Team roster'
description: 'Native roster surface, localized membership labels and accessible actions on team detail.'
---

## Identity and scope

- ID: DR-014c. Status is authoritative in the [backlog](../backlog.md).
- Parent: [DR-014](DR-014-club-team-detail.md). Prerequisite: DR-014a Done.
- Design rules: [design refresh plan](../README.md).
- Project: `frontend-pages-club`.
- Confirmed mounted consumer: `/clubs/smash-for-fun/teams/ea2d1aa1-14f9-4f3a-83e8-0acbd43864da`.
  The page renders `app-team-players-table`; search found no other application consumer.
- Clean worktree at selection on 2026-11-14.
- Preserve roster inclusion, base-player flags, percentages, multiple sorting, player routes, permission-gated
  add/remove payloads and resource reload. No operational mutations for browser verification.
- Exclude hero, encounter sections/Cards, shared components/theme, service query/calculation redesign and dependencies.

## Baseline and approach

- Mounted Dutch dark-wide baseline: seven players, English headings, raw REGULAR badges, inline green/red metric
  colors, tooltip-only action names and an empty action heading. Parent owns a separate decorative empty state.
- Use one native Card with a semantic heading, native Table scrolling/sorting, localized Tag labels, named native
  Buttons and a native Message for empty/error feedback. Neutral numeric cells retain readable column context.
- Keep existing service/smart page and presentational roster separation. No one-consumer wrapper or new stylesheet.
- Distinguish ordinary membership from registered base-player status and game-only appearances.
- Surface existing logged membership failures without changing mutation payloads or accepting live operations.
- Before evidence: roster-only dark-wide screenshot inspected in chat; no sensitive screenshots committed.

## Implementation checklist

- [x] Confirm mounted consumer, prerequisite and independently reviewable slice.
- [x] Simplify presentation and localize roster headings/membership/actions.
- [x] Preserve sorting, statistics, routes and permission-gated callback payloads in source and focused tests.
- [x] Use native PrimeNG capabilities with semantic colors and no new styling layer.
- [x] Consolidate empty-state rendering in the existing presentational roster.
- [x] Surface membership failures with repository-standard logging and translated native feedback.
- [x] Record utility comparison, validation and out-of-scope discoveries.

## Acceptance and verification

- [x] Native Card/Table/Tag/Button/Message cover roster presentation and feedback.
- [x] No new numbered palettes, non-semantic colors, SCSS or equivalent styling workarounds.
- [x] Light/dark at 390px/1440px preserve content; horizontal scrolling stays inside the Table.
- [ ] Named actions, sort keyboard access, focus, labels and sampled contrast pass.
- [x] Empty, zero-stat, long-name, game-only, missing-player and permission states remain usable.
- [x] Mocked service success/failure preserves payloads and reports errors; no live mutations.
- [ ] Dutch/French/English copy, routes and relevant SSR/hydration behavior are checked.
- [ ] Focused Nx lint/build/tests pass; exact commands and unavailable checks recorded.
- [x] User approved completion with disclosed limits; unperformed checks remain unchecked.

## Evidence and handoff

- **Passed:** `NX_DAEMON=false npx nx run-many --targets=lint,build --projects=frontend-pages-club
--output-style=static` (12 tasks; initial run seven cached). Final run after test corrections also passes.
  Existing warnings remain; no lint errors or build failures.
- **Failed before tests executed:** `NX_DAEMON=false npx nx run frontend-pages-club:test
--testPathPatterns=team-detail --runInBand --output-style=static`: existing missing `zone.js` (DR-059).
- **Passed with temporary setup override:** same focused command plus
  `--jestConfig=C:\Users\glenn\.copilot\session-state\710fcde7-8ed5-454d-a8a2-91692e2403d8\files\dr014c-jest.config.cjs`.
  Two suites / seven tests: two existing failed-load recovery regressions, four mutation error/retry/result/payload
  cases and localized membership/base/game-only/unknown presentation with unchanged percentages.
  Temporary config spreads the existing club config and replaces only setup with `setupZonelessTestEnv`,
  retaining unknown-element/property checks. This is not a committed infrastructure fix or a default-suite pass.
- Actual-template Jest checks also hit the existing unresolved-external-template harness issue.
  No template overrides/infrastructure workarounds are retained; final roster regression exercises its computed model.
  Button naming, empty/error rendering and interactive sorting still require mounted browser verification.
- An initial combined test selector was misparsed by the Windows npm shell; the final `team-detail` selector
  covers exactly the two relevant suites.
- **Passed:** eight-key/interpolation parity in nl_BE/fr_BE/en assets; live API port 5000 serves all eight keys
  in all three locales (HTTP 200). API generated only ten related roster type lines; preserve this output.
- **Passed:** `git diff --check`; all changed files formatted with repository `npx prettier --write`.
- Roster template literal class tokens: 56 -> 57; two inline palette styles removed. Additional native heading/error
  layout replaces the eyebrow/count styling. Parent decorative empty markup and redundant section wrappers removed.
  Host gains `block min-w-0` for flex containment. Existing native Table `tableStyle` minimum width is retained;
  native `scrollable` owns horizontal overflow. No new styling exception.
- Browser before: mounted Dutch dark-wide roster screenshot inspected; at 390px the original page overflowed.
- Initial server blocker resolved after `Frontend restored; continue DR-014c verification` on 2026-11-14.
  Both ports serve translations (HTTP 200); no shared server was stopped, started or restarted by this task.
- **Passed:** mounted Dutch loaded roster in light/dark at 390px/1440px: seven rows, zero unnamed actions,
  zero raw keys and zero page overflow. Narrow Table scroll container is 282px with about 1002px content;
  wide container is 1215px and fits the real data.
- **Passed:** synthetic long unbroken identity, game-only backup, missing game-only player and zero stats fit in
  both themes/widths; long content scrolls inside the Table without page overflow. Ordinary membership and base
  registration remain separate, with 67% wins/25% presence matching the fixture.
- **Passed:** local callback recorders receive `synthetic-backup` for keyboard Enter Add and `synthetic-member`
  for keyboard Space Remove, once each. Zero GraphQL mutation requests observed during this action check.
  Permission-off fixture removes both actions and their column header; missing game-only player has no Add button.
  All original selectors/callbacks and real data were restored; no live persistence was attempted.
- **Passed:** empty roster and both translated errors in all four theme/width combinations: empty has one native
  Message/no table; error+empty has two Messages; no raw keys or overflow. Feedback clears and real rows return.
  Native Message exit animations retain departing DOM briefly; final checks wait for detachment rather than
  treating the animation as stale feedback. Initial resize measurements also waited for responsive shell rendering.
- **Passed:** native sortable headers expose eight keyboard stops; Enter changes `aria-sort` ascending -> descending.
  Named native action has a visible 1px outline. Narrow Tab moves from the player link to its Remove action,
  scrolls the Table to 720px and shows `:focus-visible`; Shift+Tab returns the original player link.
- Sampled theme contrast uses canvas-resolved CSS colors (including OKLCH), composited backgrounds and WCAG luminance.
  Heading/normal metrics: 19.87 light / 16 dark; muted count: 4.87 / 6.65; info Tag: 5.17 / 9.12;
  base Tag: 4.57 / 10.51. Existing primary player links were 3.65 in light mode, so this slice changes them to
  semantic `text-color`; final light/dark links match the passing normal text colors.
- **Inherited failure:** unchanged native danger text-button icon is 2.77 in light mode (below 3:1), 6.74 dark.
  Keep the shared Button contrast/Tooltip audit in DR-033; no page override or hidden theme change.
  Full accessibility/focus-ring contrast is not claimed as passed.
- Final roster-only dark-narrow/light-wide screenshots inspected in chat; no sensitive screenshots committed.
  Homepage, original 1693px/1272px viewport and dark preference restored. Synthetic browser state removed.
- **Not verified:** live membership persistence, fr/en browser, full accessibility, default tests, full SSR/hydration.
- Exceptions: none planned.
- Existing default test setup missing `zone.js` is tracked by DR-059; do not change test infrastructure here.
- User approval: `Approve and commit DR-014c with disclosed limits` (2026-11-14).
  Approval accepts live persistence, fr/en browser, full accessibility/default tests/SSR verification limits and
  the inherited DR-033 native danger-icon light-contrast shortfall. These are accepted limits, not passed checks.
  Approval authorizes only this slice's implementation, tests, related generated types and repository handoff commit.
- Temporary test setup/config removed after verification. No dependency/infrastructure changes or push authorized.
- Exact next action: scope DR-014d encounter section chrome and create its brief before implementation.
  Keep DR-014 open and DR-014d unstarted in this invocation.
