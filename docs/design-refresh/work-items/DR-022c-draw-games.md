---
title: 'DR-022c: Mounted draw games'
description: 'Native match cards with player-profile-aligned teams and set results on the mounted tournament draw.'
---

## Identity

- ID: DR-022c; parent DR-022 stays open. Authoritative status: [backlog](../backlog.md).
- Dependencies: completed DR-022a/b and DR-006j bracket sizing.
- Design rules: [rollout](../README.md).

## Scope

- Project: `frontend-pages-tournament`.
- Confirmed mounted consumer on 2026-11-07:
  `/tournament/internationaal-tornooi-lokerse-bc-2023/sub-events/`
  `755f536f-7d16-46ba-93c8-49d07123ce6c/draws/68b472cb-2940-47ec-ac17-eff7a15cab6a`.
- Real hydrated route has one `app-draw-games` containing 15 games.
- Source: [presentation child][component], [template][template], [mounted parent][parent], [tests][tests].
- Preserve membership order, player destinations/fallbacks, tier semantics, date, round, type, winner, bye and scores.
- Exclude bracket/standings, page feedback/identity/actions, requests, services, backend, translation assets and theme.
- Keep existing smart page and dumb games child. Both teams and both score sides each use one loop.
- Real reference: `/players/glenn-latomme` mounts [recent player games][reference].
  Desktop uses a date rail, paired teams separated by `vs` and paired vertical score columns;
  mobile places each team next to its horizontal scores. Winning sets use native success Tags.
- Reuse this meaningful layout, not the reference's legacy `[pt]`, SCSS or extra card-padding overrides.
  The shared match-row is still a custom styled `g-match` with a distinct model; it is not a native replacement.
  No shared/player component change or new one-to-one wrapper belongs in this page-only slice.

## Baseline and review direction

- Clean worktree at selection; original child has 244 static class tokens and 264 template lines.
- Original four light/dark 390/1440px cases: 15 games; document scroll/client widths match at 375/1425px.
- Initial native two-row table implementation passed 14 suites / 173 tests and browser layout/contrast/SSR checks.
- On 2026-11-07 the user requested: "Make the game results more in sync on how we show them on the player profile".
  That request is not completion or commit approval. The table presentation and its final measurements are superseded.
- Revised design: native Cards, metadata/result/bye Tags and secondary empty Message; profile-aligned result grid.
- Dates show weekday/day/month and retain the exact short date/time as an accessible label.
- Original set numbers remain available in named score labels even when earlier sets are missing.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, bounded scope and real player-profile reference.
- [x] Preserve existing smart/presentation split and avoid shared changes.
- [x] Use native surfaces and the profile's winning-set Tag presentation.
- [x] Render team membership and score sides without duplicating their templates.
- [x] Verify revised behavior, layout and accessibility; persist fresh evidence.

## Acceptance and verification

- [x] Desktop teams and paired vertical score columns match the profile's meaningful composition.
- [x] Mobile pairs each team with its horizontal scores; long names and three sets fit.
- [x] Populated/empty/bye/pending/singles/doubles/mixed/partial-set cases preserve meaning.
- [x] Player links/fallbacks, tiers, dates, metadata, order and result labels remain intact.
- [x] Zero new styles, palette utilities, inline-style workarounds or shared/theme changes.
- [x] Light/dark narrow/wide, keyboard/focus and relevant text contrast verified.
- [x] Existing localized labels and populated SSR preserved.
- [x] Focused existing Nx lint/test/build tasks pass after revision.
- [ ] Screen-reader, exhaustive accessibility/contrast and hydration verified.
- [x] User review or explicit approval with disclosed limits.

## Evidence and handoff

- Original before: first dark desktop match screenshot showed custom color band, tiny metadata/date,
  side-by-side players and custom score colors.
- Initial proposal: native Tables, then revised following user feedback. Do not reuse its passing evidence
  to claim revised grid verification. No commit was made.
- Revised source: child template/imports, played-set helper, updated regressions and this brief/backlog.
  Native Card padding is preserved; no pass-through or design-token bindings are authored.
- Revised utility comparison: 244 to 117 static class tokens; 264 to 121 template lines.
  More utilities than the superseded table are needed for the explicitly requested responsive team/score composition.
  Structural grids match the profile's meaningful arrangement; no custom surfaces/colors or padding overrides.
- Actual reference: source and hydrated first match inspected at `/players/glenn-latomme`.
  Profile uses native success Tags and mobile horizontal scores; its existing desktop template uses stacked scores.
  Date rail and paired team/score semantics are reused, not player-relative ordering or ranking-point data.
- Revised real browser: four light/dark 390/1440px cases retain 15 games, 28 links and 66 score values.
  Document scroll/client widths match at 375/1425px with scrollbars.
  Desktop team and score pairs share a row, with score direction `column`;
  mobile teams occupy separate rows and their corresponding score centers align within 2px, direction `row`.
- Revised synthetic browser: 28 light/dark 390/1440px cases cover doubles, mixed/long names, bye,
  pending, partial sets, empty list and undated matches. No document/card overflow.
  Long names include 160-character unbroken text and long spaced names; three-set and tier content fits.
  Original second-set labels remain `Set 2` for partial data. Fixtures replace only the child input in memory
  and restore it in `finally`; monitored fixtures record zero page errors or GraphQL mutation attempts.
- Revised regression tests additionally cover both bye sides, zero losing scores, tied-set non-emphasis,
  unknown unlinked names, membership/game order, singles/doubles/mixed tiers, missing dates and locale assets.
- Accessibility: named match articles and two named score groups preserve team correspondence.
  Each set exposes its original number, score and localized `Won` when applicable;
  winning-set status does not depend solely on green text or screen-reader interpretation of the Tag color.
  Real Dutch first winning score label is `Set 1: 21 (Gewonnen)`.
  Four keyboard width/theme cases Tab between the first two player links with `:focus-visible` and native 1px outline.
  Pointer and Enter navigate to the real first-player destination. Monitored interactions have zero page errors
  or GraphQL mutation attempts. Browser harness waits for a mounted, hydrated child before clicking.
- Canvas-composited sampled revised text contrast (light / dark):
  player/day 19.87 / 16.00, weekday/month/losing score 4.87 / 6.65,
  winning score/winner Tag 4.57 / 10.51, metadata Tag 7.74 / 9.51 and bye Tag 4.52 / 9.31.
  All meet 4.5:1; exhaustive contrast, shared tier internals, hover and focus-ring contrast are not claimed.
  No shared contrast audit is closed and no page palette override is added.
- Revised screenshots inspected: dark 1440px and light 390px first match.
  They show the date rail, paired desktop names/stacked score columns and mobile name/score alignment.
  Screenshots are browser evidence, not committed assets; observations above are the persistent handoff.
- Revised SSR: Node `fetch` returns HTTP 200, 15 native Cards, 66 named set scores, list heading/player content
  and unchanged bracket. Hydrated content retains the real games. Exhaustive hydration is not verified.
- Formatting: `npx prettier --write` on the three changed child files, this brief and backlog.
- Final focused command:

  ```powershell
  npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static
  ```

  Passes lint with existing warnings, production library build and ten prerequisite tasks;
  14 suites / 174 tests, including 14 new regressions and en/nl_BE/fr_BE label assets.
  Initial table test fixture/assertion failures were corrected before revision; revised checks pass.

- Not verified: screen-reader, exhaustive accessibility/contrast/focus-ring contrast/hydration,
  browser alternative locales and authenticated/operational workflows. No administrative mutations are run.
- Approval: on 2026-11-07 the user said "Close lose the underline, the approve and commit" and "Nothing else".
  Remove player-link underlines, then complete and commit only this slice/tests/handoff.
  Final links use `no-underline`, including hover; no shared link style changes.
  Approval accepts the disclosed screen-reader, exhaustive accessibility/contrast/focus-ring contrast/hydration,
  browser alternative-locale and authenticated-workflow limits. Unperformed checks stay unchecked;
  approval is not evidence they passed. Backlog status is Done with this explicit approval.
- Post-approval focused command above passes: 14 suites / 174 tests, production library build and ten prerequisites.
  `npx nx run-many --target=lint --output-style=static` passes all 34 projects with existing warnings and zero errors.
  No application code changes after these final checks.
  Browser light/dark computed text-decoration is `none` at rest and hover; native keyboard focus remains visible.
- Additional approved-slice correction: the user requested that Bye always fit its content on desktop/mobile.
  Native warning Tags use `w-fit` so the shared team layout cannot stretch them.
  Both bye-side regressions cover the class. Eight browser light/dark 390/1440px cases cover either missing team:
  actual Tag width 36.5625px exactly equals label width plus native padding/borders.
  Parent widths are approximately 299.5px mobile and 626.2px desktop; no Tag stretches or document overflow.
  Browser-only fixtures are restored afterward; no records change.
- Exact next action in a fresh invocation: confirm a real mounted round-robin consumer before scoping DR-022d.
  Parent DR-022 stays open; no second implementation slice is started here.
- Exceptions: none proposed.
- Commit only the approved slice/tests/handoff; no push is authorized.

[component]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/components/draw-games.component.ts
[template]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/components/draw-games.component.html
[parent]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/page-draw-detail.component.html
[tests]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/components/draw-games.component.spec.ts
[reference]: ../../../libs/frontend/components/games/recent/src/player/recent-games-player.component.html
