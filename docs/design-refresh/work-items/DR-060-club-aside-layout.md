---
title: 'DR-060: Club aside layout rework'
description: 'Improve the club aside with player-profile patterns and season-matched discipline records.'
---

## Identity and scope

- Status is authoritative in the [backlog](../backlog.md).
- User-requested follow-up to completed [DR-012c](DR-012c-club-sidebar-cards.md), not a restart of that migration.
- Mounted consumer: `/clubs/smash-for-fun`, `app-page-detail` aside in
  `libs/frontend/pages/club/src/pages/detail/page-detail.component.html`.
- Projects: `frontend-pages-club`, plus `backend-graphql` for the user's subsequent discipline-record request.
  Keep the additive API change inside the existing top-performer aggregation; no extra per-player queries.
- Preserve query scope, filters, order, limits, navigation, translations, loading/empty states and responsive placement.
  Add only discipline-result selections to the existing performer query.
- Exclude sidebar visibility/page chrome, other routes, team builder, unrelated backend, translations and shared theme.
- Preserve the initially uncommitted page/sidebar-toggle and locale/generated-type edits; do not stage them.
  Those edits were independently committed during this work (`ae66514a`); this slice does not modify them.
- Follow the [design rules](../README.md).

## Baseline and approach

- Browser baseline: Dutch, dark, 1717px viewport; schedule Card is 320px wide.
- Oversized bold times compete with bold team names; the smaller date is subordinate to time.
  Home/away are distinguished only by muted away text. Performer names truncate and records lack labels.
- After direct player-profile browser/source comparison, use its match-card date rail and wrapping `home vs away`
  composition inside the existing fixture Card. Keep numeric dates to avoid introducing English weekday/month labels.
- Follow `app-player-strongest-matchups` and `app-player-teams`: wrapping semibold names and one trailing result Tag.
  Keep the win percentage in a native Tooltip on the result, not a visible subtitle.
- Show `S: won/played`, `D: won/played`, `MX: won/played` in a wrapping muted metadata row beneath each name,
  including `0/0` when a discipline has no qualifying games. Reuse existing localized discipline/wins/played labels.
- Add `singles`, `doubles`, `mixed` records (`wins`, `total`) to `ClubTopPerformer` through conditional sums in
  the same query. Preserve its September-to-September season window, completed-game predicates, ranking and limits.
  No migration, additional per-player query, or unrelated backend changes.
- Keep localized home/away and wins/losses labels in screen-reader text. Make result tooltips focusable,
  hoverable, Escape-dismissible, appended to body to avoid clipping, and associated with `aria-describedby`.
- Keep smart query owners intact. These two lists have different domain structure; a shared Card wrapper would
  only wrap PrimeNG and does not earn an abstraction. Do not propagate an unreviewed pattern to other pages.
- No new SCSS, palette colors, dependencies or global behavior.
- Do not add a generic sidebar wrapper solely to share Card styling; PrimeNG already owns the common surface.

## Review feedback (2026-11-13)

- The first pass used date headers and a performer Table. The user requested another pass inspired more directly
  by the mounted player profile. The Table was removed; its earlier checks are not claimed for the final revision.
- The player sidebar and first upcoming match were browser-inspected on `/players/glenn-latomme`, alongside their
  templates. This established the compact list/result Tag and date-rail matchup patterns.
- The user then said `Upcomming: perfect` and requested moving the percentage to a tooltip.
  The fixture layout is preserved unchanged from that approval; performer percentages are now tooltip-only.
- Initial Upcoming approval did not authorize the whole item; the final approval below covers the completed slice.
- Further feedback requests S/D/MX records beneath each name. The user confirmed **wins / games played**,
  not wins / losses. This explicitly expands the slice to the smallest necessary additive GraphQL data change.
  The extension is implemented and rechecked below; Upcoming stays untouched.
- The user approved the completed slice: `Approve and commit DR-060 with disclosed limits`.
  This authorizes its scoped commit, without converting unverified checks into passes.

## Implementation checklist

- [x] Confirm real consumer and scope; inspect existing worktree changes.
- [x] Implement the two card layouts using native PrimeNG and semantic utilities.
- [x] Preserve data/query scope and localized content; add real discipline records without extra per-player queries.
- [x] Format changed files.

## Acceptance and verification

- [x] Loaded dates, home/away roles, player names and records are readable without truncation.
- [x] Native PrimeNG surfaces, tags and tooltips; no new styling exceptions.
- [x] Dutch loaded state in light/dark at 1440px and 390px, without horizontal overflow.
- [x] Player links and keyboard focus remain usable.
- [x] Percentage is tooltip-only, works on hover/focus, supports Escape and has a resolving description ID.
- [x] S/D/MX show wins / played, with explicit localized accessible labels and unplayed `0/0`.
- [ ] Loading and empty states remain usable.
- [x] Focused Nx lint/build checks pass.
- [x] Backend regression tests pass, including wins/played mapping and empty-discipline records.
- [ ] Existing club tests pass (setup failure disclosed below).
- [x] Sampled loaded-text contrast in both themes meets 4.5:1.
- [ ] Full accessibility, French/English browser and SSR/hydration checks.
- [x] User visual approval with disclosed limits.

## Evidence and handoff

- Baseline screenshot inspected from the mounted schedule Card; no operational mutations.
- Changed implementation/test files: schedule HTML, performer HTML/TS, club resolver and its new focused spec.
  Additive GraphQL selection only; no filter/order/limit changes.
- Literal static class tokens: schedule 39 → 45; performers 23 → 33 (combined 62 → 78).
  The small increase supports date-rail alignment, equal readable home/away names, wrapping rather than truncation,
  localized screen-reader labels and per-discipline metadata. No arbitrary grid values, custom styles or exceptions.
- **Passed:** Prettier on all seven scoped files.
- **Passed:** `NX_DAEMON=false npm exec nx -- run-many --target=lint,build --projects=backend-graphql,frontend-pages-club`.
  Final run: 19 tasks succeeded, 17 cached, after formatting the final templates.
- **Passed:** `NX_DAEMON=false npm exec nx -- run backend-graphql:test --runInBand
--runTestsByPath=src\resolvers\club.resolver.spec.ts --output-style=static`.
  The runner reported all four backend suites / 42 tests passing, including both new club regressions:
  S `3/5`, D `0/3`, MX `1/5` are wins / played, and missing disciplines return integer `0/0`.
  The tests also check preserved season bounds and a single aggregate query. Existing ts-jest TS151002 warnings remain.
- **Verified API/source:** installed PrimeNG 22 Tooltip supports `tooltipEvent="both"`, `autoHide`, body append and
  `pTooltipPT.root`. The MCP validator incorrectly treats native `tabindex` as a Tooltip input; lint/build pass.
- **Failed before test execution:** `NX_DAEMON=false npm exec nx -- run frontend-pages-club:test --runInBand`.
  All three existing suites fail on missing `zone.js` via `src/test-setup.ts`; zero tests ran (existing DR-059).
  No new test dependency or setup workaround. Presentation/Tooltip behavior is checked in the browser.
- **Passed, browser (Dutch):** loaded five fixtures and five performers in both themes at 1440px and 390px.
  Page and aside have no horizontal overflow. Before the discipline addition, screenshots were inspected individually
  in all four combinations. Afterward, exact ratios, `0/0` and no-overflow were rechecked in all four combinations;
  final performer screenshots were inspected in light wide and dark narrow.
  Scripted screenshot batches were unreliable and not used as final visual evidence.
  Names wrap without ellipsis; date/time rail and matchup text adapt to narrow/wide available widths.
- **Passed, live read-only API:** waited for port 5000 and checked the new fields via `/graphql`;
  both port 5000 and the port 3000 proxy respond successfully after the restart.
  Live first-player records are S `2/2`, D `3/3`, MX `2/2`; an unplayed MX returns `0/0`.
  These exact ratios render in the browser in all four theme/width combinations.
- **Passed, browser:** all five performer URLs retain `/players/:slug`; Tab moves from the first player link to
  its result Tag, then to the second player link, with native `auto 1px` focus outlines.
  Result text exposes localized wins/losses labels to the accessibility tree.
- **Passed, browser:** hover and keyboard focus show `100% gewonnen`, moving onto the tooltip keeps it open,
  Escape dismisses it, and the target's description ID resolves to the actual Tooltip text.
  The fourth player's tooltip shows `86% gewonnen` within the 390px viewport in both themes.
  No percentage remains in the visible Card text.
- **Passed after discipline addition:** keyboard focus still reveals `86% gewonnen`, the description ID resolves,
  and Escape dismisses it; the added metadata exposes full localized discipline and wins/played meanings.
- **Passed, sampled computed-color contrast (before discipline addition; colors unchanged):**
  time 6.65:1 dark / 4.87:1 light;
  date and player link 16:1 dark / 19.87:1 light; success Tag 10.51:1 dark / 4.57:1 light;
  Tooltip text 9.95:1 dark / 13.61:1 light. Canvas sRGB samples composite ancestor backgrounds.
  This is not a full accessibility audit or a test of the unobserved danger Tag state.
- **Not verified:** loading/empty/error states, unusually long unbroken names, missing date/team data,
  danger Tag state, full accessibility, fr/en browser, dedicated SSR/hydration, full application build/suite.
  Attempted browser-only GraphQL interception for synthetic/loading/empty checks timed out waiting for the
  synthetic player; a second attempt using player-to-club client navigation timed out waiting for the empty state.
  Neither is evidence of those states. Interception was removed and live data restored.
  Viewport and dark theme were restored; no persisted preference or application data was changed.
- Existing locale keys for home/away, win rate, wins/losses, played and discipline labels are reused;
  no translation files were edited.
- Existing query failures log warnings and return an empty array (DR-012c behavior); error-state redesign is excluded.
- Inherited wide sticky/header overlap recorded separately as DR-061; page chrome remains unchanged.
- The installed native Tooltip did not create an ID/description association in browser checks.
  Its documented root pass-through supplies an explicit per-player ID, referenced by the target.
  The description was verified after the change; wider consumer audit is DR-062, not part of this slice.
- Reuse decision: two different domain lists do not justify a shared dumb Card wrapper; query owners stay smart
  and native PrimeNG owns common appearance. Reconsider extraction only for repeated real domain consumers.
- Upcoming and the final performer discipline-record revision are approved with the disclosed limits.
  DR-060 is Done; approval authorizes committing its five implementation/test files and two handoff documents.
- Next candidate/action: scope DR-013c team cards before implementation; not started.
  Do not start DR-013c, DR-061 or DR-062 in this invocation.
