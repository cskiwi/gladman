---
title: 'DR-019d: Tournament event and draw presentation'
description: 'Competition-aligned event Cards and draw navigation on tournament detail.'
---

## Identity and scope

- ID: DR-019d. Parent: [DR-019](DR-019-tournament-browsing.md). Status: [backlog](../backlog.md).
- Dependencies: approved DR-019a/c and competition detail presentation.
- Rules: [design refresh](../README.md). Project: `frontend-pages-tournament`.
- Confirmed loaded consumer on 2026-11-02:
  `/tournament/8658b541-702a-408e-8114-2858a9428069`, Internationaal Tornooi Lokerse BC 2023.
  Men/women/mixed tabs contain 30 sub-events and 95 draws; the first active group has six singles and six doubles.
- [Routes](../../../libs/frontend/pages/tournament/src/lib.routes.ts) mount the
  [template](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.html) and
  [component](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.ts).
- Reference: [competition detail](../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.html).
- Preserve group/game-type sorting, tab selection, counts, sub-event names, slug-based draw routes,
  external-link gates/URLs, sync authentication/configuration and empty-draw feedback.
- Exclude hero/live navigation, loading/error feedback (DR-019f), club browsing (DR-019e),
  destination pages, backend queries, permissions, shared components and global styling.

## Baseline and approach

- Loaded Dutch dark baseline at 1160px shows custom articles, repeated English Event/Events eyebrows,
  uppercase game-type labels, small custom external links and truncated draw names.
- Use competition's bordered native Cards, semantic headings and outlined secondary draw anchors;
  preserve tournament's native type Tabs and draw-heading/count information.
- Use named native text external buttons and wrapping draw names/metadata.
- Localize empty/fallback copy in tournament-owned English/Dutch/French keys.
  Unnamed draws now use localized ordinal names, matching competition, rather than a literal English ID prefix.
  Draw IDs and destinations are unchanged.
- Reuse the existing local group template for every real group. No cross-feature extraction:
  competition and tournament have different data, sync contracts, external URLs and grouping;
  changing a shared consumer would expand this page-only slice. Native PrimeNG owns their shared visual styling.
- Remove only the event-specific SCSS rules; leave other legacy rules for their separately scoped retirement.
- No new dependencies, operational mutations or styling exceptions.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and bounded scope.
- [x] Preserve data, tabs, routes, action gates and localization.
- [x] Replace custom event/draw surfaces with native PrimeNG presentation.
- [x] Remove only event-specific unused styles.
- [x] Record focused checks, evidence and handoff.

## Acceptance and verification

- [x] Native Cards, outlined draw anchors and secondary empty Message match competition's presentation.
- [x] Headings are semantic; draw and external links have meaningful names and wrap at narrow widths.
- [x] Light/dark at 390/1440px fit; all three tabs and keyboard navigation remain usable.
- [x] Focus visibility and settled text/focus contrast are measured.
- [x] Zero new non-semantic colors, numbered palettes, SCSS or equivalent styling workarounds.
- [x] Sorting, counts, zero/one/multiple groups, draw metadata/fallback/empty states and action gates pass regressions.
- [x] English/Dutch/French asset copy and loaded Dutch SSR/client content are checked.
- [x] Relevant Nx tests, lint and production library build pass.
- [x] User approved completion and commit with disclosed verification limits.
- [ ] Actual screen-reader, mounted English/French and exhaustive hydration are verified.

## Evidence and handoff

- Worktree was clean before selection.
- Startup initially returned GraphQL 502 and then frontend connection refused. Bounded readiness checks
  recovered to HTTP 200 on backend translations and the supplied tournament route; no service was restarted.
- Playwright MCP profile was in use; integrated browser confirms the loaded real consumer and dark baseline screenshot.
- Installed PrimeNG 22 docs confirm native styled Card, router/external Button anchors and Message.
- Changed scope: detail template/component/styles/tests, three tournament translation assets and automatically
  regenerated translation types. No query, shared component, theme, route or permission change.
- Event-area authored static class tokens: 137 before to 99 after; legacy tokens 11 to zero.
  Removed 33 lines of event-only SCSS; retained unrelated existing rules. No added styling exception.
- Native Card/heading/outlined draw presentation matches competition. Four paired light/dark 390/1440px
  cases compare actual Card classes, h4 font family/size/weight/line-height and native draw buttons.
  Tournament keeps its domain-specific type Tabs, draw counts and sub-event external actions.
- Eight isolated anonymous Chrome contexts: light/dark at 360/390/768/1440px.
  Every case passes viewport/content fit, one/two/three columns and all three tabs with 12/12/6 visible Cards.
  All 95 client draw destinations match a separate read-only GraphQL query's actual slug/sub-event/draw IDs.
- ArrowRight/Left move tab focus; Enter activates, preserving PrimeNG's default manual-activation behavior.
  Keyboard Tab reaches the first draw; Shift+Tab reaches its preceding sub-event external action.
  Both have `:focus-visible` and a measured 2px primary ring.
- Settled normal text/icon contrast minima: 4.87:1 light, 6.65:1 dark.
  Hover/focused text minima: 4.66:1 light, 6.28:1 dark.
  Draw/external focus-ring contrast against the native Card: 3.65:1 light, 10.22:1 dark.
  Browser canvas converts colors to sRGB; transparent ancestor backgrounds are composited.
- A presentation-only DOM stress check temporarily substitutes a long name plus an unbroken repeated word;
  wrapping and viewport/content fit pass in all eight cases. Original text is restored before screenshots.
  This is not a data mutation or evidence of a real long-named tournament record.
- Every isolated tournament SSR response is HTTP 200 and contains the events heading and first sub-event name,
  matching loaded Dutch client content. This checks loaded content, not exhaustive hydration behavior.
  Eight cases report zero page errors and zero GraphQL mutations.
- Integrated-browser keyboard Enter opens the real first draw destination; Back restores all 95 detail links.
  Full destination workflow/redesign is excluded. Its page title identifies the expected draw/standings.
- Before screenshot: loaded dark 1160px event area in the integrated browser.
  Final local screenshots: `DR-019d-{light,dark}-{360,390,768,1440}.png`;
  `DR-019d-browser-results.json` records the isolated cases in this session's files directory.
  Light 390px and dark 1440px screenshots were inspected; user review remains outstanding.
- Exact final commands, passed after formatting:
  - `npx nx run frontend-pages-tournament:test --testFile=libs/frontend/pages/tournament/src/pages/detail/page-detail.component.spec.ts --runInBand --output-style=static`
    passes 35 tests in one suite, including seven new event-area regressions.
  - `npx nx run-many --target=lint --projects=frontend-pages-tournament,backend-translate --output-style=static`
    passes both projects. Two newly introduced test non-null warnings were then removed;
    `npx nx run frontend-pages-tournament:lint --output-style=static` passes warning-free.
  - `npx nx run frontend-pages-tournament:build --configuration=production --output-style=static`
    passes the library build and ten prerequisite tasks.
  - Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
    with existing warnings and zero errors.
  - `node C:\Users\glenn\.copilot\session-state\08de42e3-f6df-4803-a498-246c6a033d8c\files\verify-dr019d.cjs`
    passes the eight-case local browser matrix described above. Temporary helper removed after verification;
    the checks/results are recorded here rather than requiring session state to resume.
  - Repository Prettier formats every changed file. Existing Nx executor/ts-jest warnings remain.
- Initial failures and corrections: the first translation edit matched competition's similarly named keys in
  English/French; corrected to tournament-only keys before final tests, leaving competition assets unchanged.
  The Message assertion was corrected for PrimeNG 22's host classes.
  An endpoint readiness probe misread JSON as a PowerShell string and its parser rejects unrelated
  case-distinct keys; Node confirms HTTP-served Dutch copy. Backend restart failures are not final passes.
  Browser assertions now account for SSR transfer state (no required client request), native manual tab
  activation and asynchronous DOM settling. All final isolated cases pass without application workarounds.
- Not run: actual screen-reader, mounted English/French, exhaustive hydration and authenticated mounted sync/admin
  workflows. Authenticated sync/config gates and absent external-code branches have unit coverage only.
  Empty/fallback browser states are not present in the supplied dataset; localized native rendering has unit coverage.
- Discovery: draw external-link rendering already depends on `draw.visualCode`, but the detail query does not request
  it. The existing branch/URL are preserved and fixture-tested, not claimed as mounted.
  Recorded as separate DR-019g investigation; no hidden query expansion in this visual slice.
- Exceptions: none.
- On 2026-11-02 the user selected "Approve DR-019d and commit with disclosed verification limits".
  This explicitly accepts completion with the unperformed checks above, not a claim that those checks passed.
  Only this slice, tests/translations/generated types and repository handoff are approved for commit; no push.
- Next candidate in a fresh invocation: DR-019f, confirm and scope detail loading/error feedback.
  Do not start it here. DR-019 remains open; DR-019g is a separate investigation.
