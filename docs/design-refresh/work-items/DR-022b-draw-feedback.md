---
title: 'DR-022b: Draw switching and page feedback'
description: 'Bounded native PrimeNG switching, loading, error and empty presentation on the public tournament draw.'
---

## Identity

- ID: DR-022b; parent DR-022 reconciled on 2026-11-08. Authoritative status: [backlog](../backlog.md).
- Dependencies: completed DR-022a identity and DR-006j bracket sizing.
- Design rules: [rollout](../README.md).

## Scope

- Project: `frontend-pages-tournament`.
- Confirmed mounted consumer on 2026-11-07:
  `/tournament/internationaal-tornooi-lokerse-bc-2023/sub-events/`
  `755f536f-7d16-46ba-93c8-49d07123ce6c/draws/68b472cb-2940-47ec-ac17-eff7a15cab6a`.
- The supplied public tournament detail links to this draw; hydrated page has 14 standings and 15 games.
- Source: [template][template], [component][component], [service][service], [regressions][tests].
- Preserve switch destinations/order/fallback labels, single-draw hiding, loading conditions, error and empty copy.
- Exclude approved hero/actions, games, standings/bracket internals, data ordering, backend, translations and theme.
- Only service change: guard resource selectors after failure; keep existing requests and error mapping.
- Keep smart page and existing domain children. Direct native primitives do not warrant one-to-one dumb wrappers.
  Existing shared hero is already reused; no genuinely repeated new domain structure needs extracting.

## Baseline and proposed approach

- Clean worktree at selection; DR-022a is committed. Mounted public sub-event has one draw.
- Browser-only multi-draw fixtures exercise this existing conditional consumer, not a new application consumer.
- Four light/dark 390/1440px baseline cases: loading has 28 Skeletons and no announcement; no document overflow.
  Integrated browser client widths are 375/1425px while scrollbars are present.
- Static authored class tokens: switcher 9, empty 32, loading 20, error 7 plus inline colors.
  Counts include both authored empty branches and one authored repeated row, not expanded DOM repetitions.
- Use native buttons with explicit pressed state and wrapping labels; reuse existing localized draws/loading labels.
- Native Card surfaces retain loading structure with flexible placeholder widths; native Messages own empty/error
  appearance. Preserve empty wording and distinguish KO from non-KO without changing the existing standings gate.
- The resource `value()` throws after a failed request. Guard it with the established `hasValue()` pattern so page,
  SEO and sync selectors can safely observe absent data while the explicit error remains visible.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and bounded scope.
- [x] Preserve navigation, populated children and state copy.
- [x] Use native PrimeNG options without custom styles or shared changes.
- [x] Guard failed-resource reads and add real failed-request/recovery regressions.
- [x] Persist exact validation, evidence, limits and next action.

## Acceptance and verification

- [x] Single draw hides switcher; multiple draws expose named, pressed, keyboard-operable buttons and correct routes.
- [x] Loading, error and both KO/non-KO empty states remain explicit; populated children retain data.
- [x] Native surfaces replace scoped custom styling; utility comparison and zero new styling exceptions recorded.
- [x] Light/dark 390/1440px states, long switch labels, focus and relevant text contrast checked.
- [ ] Native Button light text contrast passes; existing DR-032/033 failures remain below.
- [x] Actual failed Apollo request and recovery pass without throwing from public selectors.
- [x] Existing localized labels and populated SSR remain intact.
- [x] Focused Nx lint/test/build tasks pass.
- [ ] Screen-reader, exhaustive accessibility/hydration and operational permission/sync states verified.
- [x] User review or explicit approval with disclosed limits.

## Evidence and handoff

- Before: mounted public route and four synthetic loading/switcher measurements above.
- Playwright MCP profile was occupied; integrated browser is used without stopping another user's browser.
- Changed scope: page switcher and loading/error/empty markup, Card/Message imports, guarded service selectors,
  nine new page regressions, this brief and backlog. Approved hero and child source files are unchanged.
- Static authored class tokens: switcher 9 to 15, empty 32 to 12, loading 20 to 19, error 7 to 5.
  Switching increases for readable heading/section structure and long-label containment. Cards own loading surfaces;
  percentage widths and a five-column placeholder grid retain all 28 Skeletons without fixed-width row pressure.
  A localized visually hidden status and busy container announce loading. Inline error colors are removed.
- Native button directive preserves existing navigation handler, ordering and fallback names; `aria-pressed`
  conveys selection without color alone. The section heading reuses `all.tournament.draws`, replacing inherited
  English "Switch draw"; loading reuses `all.tournament.edit.messages.loading`. No translation assets change.
  Existing English empty copy and standings gate are preserved, including KO data behavior.
- Twenty final browser-only state combinations: loading, error, empty KO, empty non-KO and switching at
  390/1440px in light/dark. Document scroll/client widths match in all cases; client widths are 390/1440px
  without scrollbars and 375/1425px with them. Human-readable and 160-character unbroken switch names fit.
- Four keyboard layout cases focus the second native switch button via Tab with `:focus-visible` and 1px outline.
  Pointer, Enter and Space each navigate to the expected route and update pressed state using a browser-only
  `fixture-switch` response. Handlers are removed and the real route restored; zero page errors/mutation attempts.
  The real mounted sub-event has one draw, so a live multi-draw dataset is not claimed.
- Actual failure: after loading the supplied tournament detail, abort only its client `TournamentDrawDetail`
  request and click the real draw link. One native error alert shows `An error occurred`; hero is absent, all public
  selectors are safe, zero page exceptions/mutation attempts. Remove interception and reload: no error,
  14 standings and 15 games restored. Real bracket and games each mount once.
- Settled canvas-composited text contrast: empty 7.74:1 light / 9.51:1 dark; error 18.29:1 / 14.63:1.
  Native selected Button 3.65:1 light / 10.63:1 dark; native outlined secondary Button 4.46:1 / 6.91:1.
  Light Button text fails 4.5:1 and is retained under shared DR-033/DR-032, not fixed via a page palette override.
  Focus is visible, but exhaustive focus-ring/hover/border contrast is not claimed.
- Initial measurement caught newly added `text-color` overriding the dark secondary Message foreground
  (1.20:1). It was removed; native secondary severity now supplies the passing text. No shared preset changed.
- Screenshots inspected: corrected dark 390px synthetic multi-draw/empty KO page and light 1440px switcher.
  They show wrapping actions, readable native feedback and bounded buttons; excluded games retain old styling.
  Images are browser/session evidence, not committed assets; the measurements above are the repository handoff.
- SSR: Node `fetch` of the public draw returns HTTP 200, named hero, games/bracket and no switcher for one draw.
  Hydrated content preserves those mounts; exhaustive hydration is not claimed.
- Formatting: `npx prettier --write` on the four changed source files, this brief and backlog.
  Registry alignment changes preserve all existing statuses/history.
- Final command:

  ```powershell
  npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static
  ```

  Passes lint with existing warnings, production library build and ten prerequisite tasks;
  13 suites / 160 tests pass. Nine added tests cover switching/destination variables, pending loading/recovery,
  actual request failure/recovery, missing-response error, both empty types and real en/nl_BE/fr_BE label assets.
  First run: one failed assertion expected the alert inside Message instead of on its native host.
  Correcting only that selector and adding locale cases made the next run pass; final contrast correction was
  formatted and the complete focused lint/test/build command passed again.

- Not run: screen-reader, exhaustive accessibility/focus/hover contrast, operational empty/multi-draw datasets,
  all authenticated permission/sync workflows and exhaustive hydration. No operational or admin action was triggered.
- No dependency, operational mutation, backend, translation-asset, shared-component or global-theme change.
- Review: on 2026-11-07 the user selected "Approve DR-022b and commit with disclosed limits" and "Nothing else".
  Approval accepts native light Button contrast failures under DR-032/033 and the unperformed screen-reader,
  exhaustive accessibility/focus/hover contrast/hydration and live multi-draw/permission/sync checks.
  Unchecked criteria remain unchecked; accepted limits do not mean failed or unperformed checks passed.
  Only this slice, its tests and repository handoff are approved for commit; no push.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects with existing warnings
  and zero errors. No application code changed after the final focused lint/test/build run.
- `git diff --check` passes. Git reports its existing LF-to-CRLF checkout warnings; changed files retain LF
  formatter output. No Git configuration or attributes are changed.
- Exceptions: none.
- Original next action was DR-022c mounted games; it is now completed.
  DR-022 parent reconciliation on 2026-11-08 preserves all previously approved limits; see backlog current focus.

[template]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/page-draw-detail.component.html
[component]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/page-draw-detail.component.ts
[service]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/page-draw-detail.service.ts
[tests]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/page-draw-detail.component.spec.ts
