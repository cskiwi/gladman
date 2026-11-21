---
title: 'DR-006k: Bracket semantic presentation'
description: 'Replace numbered palette presentation in the mounted knockout bracket without changing geometry.'
---

## Identity

- ID: DR-006k; parent [DR-006](DR-006-games-matches-brackets.md) remains open.
- Status: authoritative in the [backlog](../backlog.md).
- Dependencies: completed [DR-006j](DR-006j-bracket-tree-responsive.md).
- Rules: [design refresh](../README.md). Server blocker resolved; revised presentation approved with limits.

## Scope

- Nx projects: `frontend-components`, consumed by `frontend-pages-tournament`.
- Source: [bracket template][bracket], its [tests][tests], and the existing [KO adapter][ko].
- Confirmed mounted consumer, 2026-11-21:
  `/tournament/internationaal-tornooi-lokerse-bc-2023/sub-events/755f536f-7d16-46ba-93c8-49d07123ce6c/draws/68b472cb-2940-47ec-ac17-eff7a15cab6a`.
- Refresh round-header and completed-match-border presentation only; use semantic theme-aware styling.
- Preserve round order, team order, match sizes, connector geometry, scroll bounds, winner emphasis,
  scores, player destinations, Bye/TBD fallbacks and singles/doubles calculations.
- Exclude player/encounter cards, draw page chrome, standings, services, localization changes, global theme,
  algorithm changes and the six historically recorded stale bracket-suite failures.
- Do not reopen DR-006j's approved scrolling fix or introduce unused consumers.

## Baseline and proposed approach

- Original mounted baseline has four round headings, fifteen completed-border boxes and 28 player anchors.
- Original heading tokens: `text-primary-700`, `bg-primary-50`, `border-primary-200`.
  Completed boxes bind `border-primary-400`. These violate current semantic-only palette rules.
- User review confirmed the numbered completed-border class was overridden by `border-surface` in production.
  Preserve those quiet, neutral boundaries explicitly. Completion/winner meaning stays in the existing
  highlighted, bold winner row and score data, not in a colored outline.
- Existing scroll host and viewport retain `w-full min-w-0`; preserve this contract.
- Keep semantic headings rather than wrapping each heading in a new component solely for appearance.
  Use semantic text/surface/highlight utilities as appropriate; verify the actual preset in both themes.
- Native PrimeNG is preferred if meaningful status UI is needed, but a bracket remains a legitimate visualization.
  Do not replace it with a table, redesign the algorithm or move custom colors to CSS/TypeScript.
- Retain existing computed inline geometry solely for connector placement; no new styling exception is proposed.
- Existing input-only KO adapter and shared bracket already separate data ownership and presentation.
  No additional smart/presentational split is justified for changing these color tokens.
- Before implementation, inspect installed APIs and resolved Nx targets; capture light/dark, narrow/wide evidence.
  Baseline evidence here establishes mounted use, not complete visual/accessibility acceptance.

## Implementation checklist

- [x] Reconfirm mounted consumer and read current template/test context.
- [ ] Capture baseline utility usage and light/dark, narrow/wide views using safe existing data.
- [x] Replace numbered palette utilities with meaningful semantic presentation.
- [x] Preserve geometry, scrolling, links, scores and winner/fallback meaning.
- [x] Add only focused behavior/presentation regression coverage that fails without the change.
- [x] Format changed files and record exact targeted Nx commands and browser outcomes.

## Acceptance and verification

- [x] No numbered primary/surface utilities or manually paired palette colors remain in this bracket template.
- [ ] Round names and completed/winner states remain readable in light/dark at 390px/1440px.
- [x] Header, border and player-text contrast are measured against actual resolved surfaces.
- [x] All rounds remain reachable inside the bracket scroll container without document horizontal overflow.
- [x] Player links preserve destinations, keyboard access and visible focus.
- [ ] Scores, Bye/TBD, round/team ordering and singles/doubles geometry remain unchanged.
- [x] No new CSS/SCSS, `[pt]`/`[dt]`, global token change, dependency, algorithm change or wrapper is introduced.
- [x] Relevant existing Nx lint/build and focused tests pass; known baseline failures are distinguished.
- [x] SSR/hydration, alternate locales and unavailable checks are recorded rather than assumed.
- [x] User visual review or explicit completion approval with disclosed limits is obtained.

## Evidence and handoff

### Final neutral-border revision

- User revision request, 2026-11-21: `The borders of the bracket are a bit to much color, the original border was better`.
  Compared the linked production draw (32nd International Tournament BC De Pluimplukkers, sub-event
  `cf39f290-8e14-44f6-9d46-fdccde8df1eb`, draw `1bf74512-5eef-4459-95b4-e82c90d15cfa`).
  Its completed match borders compute to `oklch(0.93 0.008 250)` at 2px: neutral `border-surface` overrides the old
  numbered primary class. Restored that actual appearance explicitly, without conflicting border utilities.
  All match borders and round-heading outlines now use `border-surface`; winner highlights are unchanged.
  Earlier primary-border validation below describes the superseded first revision, not final acceptance evidence.
- Final utility usage: heading `text-color`, `bg-highlight`, `border-surface`; all match boxes retain their
  existing static `border-surface` and remove the historical numbered completion-border binding entirely.
  No computed status border or competing color class remains. Existing box width, 2px border and geometry are preserved.
- Final validation passes:
  `npx nx run-many -t lint build -p frontend-components frontend-pages-tournament` (13 tasks, all executed);
  `npx nx run frontend-components:test --testPathPatterns=bracket-tree.layout.spec.ts --runInBand` (three focused tests).
  Tests cover the bounded viewport and both completed winners changing to pending: one neutral border utility
  throughout, with the existing winner highlight retained only while completed.
- Repeated isolated Playwright/Chrome verification (`node -`, PowerShell here-string) passes for the final revision:
  actual 390px/1440px in both themes, exact document widths, 362px/1042px narrow viewport/canvas,
  1398px/1398px wide, all four rounds and 28 hrefs reachable by Tab with `auto`/`1px` native outlines.
  Fifteen winner highlights remain. All original reconstructed geometry/text/href comparisons pass.
  Every computed neutral match-border color exactly matches reconstructed original styling:
  `oklch(0.93 0.008 250)` light / `oklch(0.24 0.025 250)` dark.
- Final screenshots inspected: `tmp/design-refresh/DR-006k-{390,1440}-{light,dark}-neutral-after.png`.
  The user's actual production reference was also inspected and captured as
  `tmp/design-refresh/DR-006k-production-border-reference.png`; it is a different populated draw.
  The earlier `-after.png` screenshots show the rejected primary-border revision, not the final result.
- Final resolved contrast minima: heading text 15.76:1 light / 12.77:1 dark; player text 16.30:1 / 14.45:1.
  Heading outlines 1.02:1 / 1.08:1; match outlines 1.13:1 / 1.21:1. These intentionally quiet semantic
  boundaries match the requested original styling and communicate neither status nor interactivity.
  Winner meaning remains in highlighted/bold labels and unchanged scores. No new color/CSS exception is introduced.
- User explicitly approved the neutral-border revision on 2026-11-21:
  `Approve revised DR-006k with the documented limits and commit`.
  Completion approval accepts the unchanged score/connector contrast follow-up (DR-006n), populated doubles/TBD,
  original full baseline matrix, actual player-navigation workflows, screen-reader use, locales and SSR/hydration
  limits. Keep the corresponding criteria unchecked; approval does not mean those checks passed.
  DR-006 remains open. Commit only this slice and its repository handoff; DR-006l is the next unscoped candidate.
- Required pre-commit `npx nx run-many --target=lint`: 24 tasks succeed, ten fail in unchanged projects
  (`backend-authorization`, `backend-ranking`, `utils`, `backend-search`, `backend-translate`, `backend-health`,
  `backend-database`, `backend-seo`, `shared`, `backend-graphql`). This matches the existing workspace-wide limit;
  no unrelated lint fixes are included. Scoped components/tournament lint and build and focused tests pass.

### Earlier implementation and verification history

- Implementation started on the existing `main` branch, 2026-11-21; starting worktree was clean.
- Browser reconfirmation: the recorded draw mounts `app-bracket-tree` with Round of 16, Quarter Final,
  Semi Final and Final headings. Existing layout and stale component tests have been read.
- Resolved Nx targets: both components and tournament expose lint/build; components exposes Jest tests.
- Implementation, 2026-11-21: only the shared bracket template and existing layout test file changed.
  The KO adapter, algorithms, data, player anchors, score markup and geometry inputs are unchanged.
- First revision utility usage (superseded): replace heading `text-primary-700`, `bg-primary-50`, `border-primary-200` with
  `text-color`, `bg-highlight`, `border-primary`. Replace completed `border-primary-400` with `border-primary`.
  Bind `border-surface` only for pending matches, so completed borders never compete with the neutral utility.
  No extra utility-heavy markup, wrapper or styling infrastructure is introduced.
- Baseline before editing: four numbered-palette headings, fifteen completed-border boxes and 28 player anchors.
  Browser content and link fingerprints were `804063357` and `-526506865` respectively
  (signed 32-bit rolling hash, multiplier 31; normalized bracket text and pipe-separated hrefs).
  Match boxes measured 220px by 80px; rounds were Round of 16, Quarter Final, Semi Final and Final.
  One explicit narrow observation reported `innerWidth=390`, document width 375 and viewport/scroll widths
  347/1042. Repeated requested matrix captures instead measured 1454px; these are not reliable narrow evidence.
  Mislabeled temporary screenshots were discarded; the initial capture attempt is not accepted as a full baseline.
- Passed: `npx nx run-many -t lint build -p frontend-components frontend-pages-tournament`.
  All thirteen tasks including prerequisites succeeded; ten were cached.
- Passed after first-revision test fix:
  `npx nx run frontend-components:test --testPathPatterns=bracket-tree.layout.spec.ts --runInBand --output-style=static`.
  Three tests pass: existing bounded viewport plus both winners changing back to pending, checking exclusive semantic
  borders and retained winner highlights. Existing ts-jest metadata warnings remain.
- Initial focused test run failed when a new runtime `Game` constructor pulled NestJS ESM into Jest.
  Fixed within this slice by reusing the existing typed input fixture; no runtime model import or Jest config change.
- First-revision lint: `npx nx run frontend-components:lint --output-style=static` passes with 31 existing warnings
  and no errors. Repository Prettier formatted all four changed files; `git diff --check` passes.
  Formatter-only layout changes in the bracket template accompany the two scoped presentation changes.
- Not rerun: full stale bracket suite (six historical failures documented in DR-006j), locales, screen-reader use,
  populated doubles/TBD, SSR/hydration and surrounding draw workflows.
- Resolved blocker: shared-page reload failed with `ERR_CONNECTION_REFUSED`. Independent
  `curl.exe --silent --show-error --max-time 5 -I http://localhost:3000/` failed with exit 7;
  `Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue` returned no listener.
  The separate Playwright MCP browser reported an occupied profile. No shared process was killed or restarted.
- The user confirmed `The app has been restarted`. HTTP 200 from
  `curl.exe --silent --show-error --max-time 10 -I http://localhost:3000/` confirms restoration.
- Passed live browser verification using the installed `playwright` package, executed with `node -` from a
  PowerShell here-string. Launched an isolated headless Chrome (`chromium.launch({ channel: 'chrome' })`);
  the owned browser was closed in `finally`. No shared profile/process was changed.
  `page.setViewportSize` verified actual widths 390px/1440px; document widths matched exactly.
  `.dark-theme` was toggled only in the isolated DOM, with settled transitions and no preference writes.
- The deployed semantic headings and fifteen exclusive completed borders are confirmed. Four round headings,
  fifteen highlighted winners, 28 player hrefs and 220px by 80px singles boxes remain unchanged.
  Reconstructed original palette classes were temporarily applied only in the isolated DOM for comparison:
  all header/box/connector rectangles, normalized text and href order exactly match the new presentation.
  This is a reconstructed before-style comparison, not a claim of a complete original before-capture matrix.
- All 28 player links were traversed with Tab in each matrix cell, matching the unchanged href order.
  Native focus outline is `auto`/`1px` in both themes. At 390px the final link is visible after inner
  scroll reaches 680px; no document overflow. Scroll viewport/canvas: 362px/1042px narrow, 1398px/1398px wide.
- Four actual after screenshots were inspected:
  `tmp/design-refresh/DR-006k-{390,1440}-{light,dark}-after.png`.
  Four explicitly reconstructed before-style screenshots use the same prefix with `-reconstructed-before.png`.
  These local evidence files are uncommitted. Round labels, winner labels, match boundaries and Bye fallbacks remain
  visible; native horizontal scrolling exposes later rounds on narrow screens.
- Contrast method: sample browser-resolved CSS colors via an sRGB canvas, composite ancestor alpha backgrounds,
  then calculate WCAG relative luminance after transitions settle. Minimum header text: 15.52:1 light / 12.39:1 dark;
  player text: 16.04:1 / 14.01:1; completed borders: 3.29:1 / 10.45:1.
  Decorative heading outlines: 2.85:1 / 7.91:1. They convey no status or interactive boundary; heading text conveys
  the round. No global token adjustment is justified for this decorative outline.
- Existing limits discovered, not fixed here: unchanged winner-score text measures 2.90:1 light / 8.16:1 dark
  (13 scores, 12.25px bold); 28 unchanged connector lines measure 1.00:1 / 1.10:1.
  DR-006n records a separate unscoped contrast follow-up. The broad winner-readability criterion remains unchecked;
  this slice does not claim full bracket accessibility. Initial unsettled transition samples were discarded.
- First-revision remaining limits: full original before-capture matrix, populated doubles/TBD, actual player navigation workflows,
  screen-reader use, alternate locales, SSR/hydration and the full stale suite have not been verified.
  That revision was subsequently rejected for colorful borders; final revision and approval are recorded above.
- Reuse the existing shared bracket and input-only adapter; no extraction or new styling infrastructure.
- Existing exception retained: computed geometry inputs used by the legitimate bracket visualization.
- Parent reconciliation review is approved, 2026-11-21. The final neutral-border child is now explicitly approved,
  as recorded above; the primary-border revision was not approved.
- Keep DR-006 open; DR-006l is the next unscoped candidate, not work started here. No push is authorized.

[bracket]: ../../../libs/frontend/components/bracket-tree/src/bracket-tree.component.html
[tests]: ../../../libs/frontend/components/bracket-tree/src/bracket-tree.component.spec.ts
[ko]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/components/draw-ko-tree.component.html
