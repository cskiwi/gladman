---
title: 'DR-022a: Draw identity and actions'
description: 'Bounded public draw hero refresh using approved shared identity primitives and native PrimeNG.'
---

## Identity

- ID: DR-022a; parent DR-022 reconciled on 2026-11-08. Authoritative status: [backlog](../backlog.md).
- Dependencies: approved shared hero primitives; DR-006j bracket sizing is already Done.
- Design rules: [rollout](../README.md). No new shared-component or theme changes.

## Scope

- Project: `frontend-pages-tournament`.
- Confirmed consumer: clicked the first draw link from the supplied public tournament detail on 2026-11-07.
- Mounted URL: `/tournament/internationaal-tornooi-lokerse-bc-2023/sub-events/`
  `755f536f-7d16-46ba-93c8-49d07123ce6c/draws/68b472cb-2940-47ec-ac17-eff7a15cab6a`.
- Source: [draw template][template], [component][component], [regressions][tests].
- The former page stylesheet is deleted; no remaining selector consumers exist in the updated page.
- Preserve draw-name fallback, initials, sub-event name, type/size, breadcrumb, safe external URL and sync configuration.
- Exclude switching, games, standings, bracket, loading/error/empty states, services, translations and theme.
- Keep the existing smart page and meaningful games/standings/bracket children. A hero-only wrapper would not
  share domain behavior; reuse the already-shared hero/avatar/title rather than creating another component.

## Baseline and proposed approach

- Live KO draw has populated games and bracket. Hero says `MS 1-2`, `KO`, `Size 16`, with external and sync actions.
- Before: four light/dark 390/1440px DOM measurements; hero width 347/1383px, gradient crest 88/112px.
- Replace decorative clipped gradient crest and oversized custom heading with approved shared avatar/title.
- Replace hand-styled metadata badges and external anchor appearance with native secondary Tags and button directive.
- Preserve inherited English fallback/size wording; translation coverage belongs to separately scoped follow-up work.
- Remove the page stylesheet only when all its consumers are removed; its host display becomes one layout class.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and independently reviewable scope.
- [x] Preserve draw identity, actions and translations while simplifying presentation.
- [x] Use existing shared hero primitives and native PrimeNG options.
- [x] Remove proven-unused page styling only.
- [x] Keep shared components, bracket sizing and excluded children unchanged.
- [x] Record adjacent work as DR-022b/c/d rather than expanding this slice.

## Acceptance and verification

- [x] Native Tags/button and approved hero primitives render identity and actions.
- [x] Utility changes have concrete layout/accessibility reasons; zero new palette or SCSS/inline workaround.
- [x] Light/dark 390/1440px hero retains information and actions without overflow.
- [x] External link focus, accessible name, URL, new-tab isolation and breadcrumb navigation pass.
- [x] Named/unnamed draw, missing type/size/external codes and sync configuration regressions pass.
- [x] Relevant existing Nx lint/test/build tasks pass.
- [ ] Screen-reader, exhaustive contrast, authenticated sync states and hydration are verified.
- [x] User approves completion with the disclosed verification limits retained below.

## Evidence and handoff

- Before evidence: live route DOM measurements above; no mutations or administrative actions used.
- Changed scope: only page hero markup/imports, host display and now-unused stylesheet; four component regressions.
  Services, child views, shared components, translations, theme and sync internals are unchanged.
- Hero static class tokens: 53 to 23, plus one `block` host layout class. Native components own appearance.
  Remaining classes provide responsive metadata/action wrapping, semantic text and the established accessible link ring.
  All 68 page stylesheet lines are removed; excluded page feedback's existing inline styling is unchanged.
- Before evidence: four real light/dark 390/1440px DOM cases; after avatar width is 56px at both widths.
  Hero remains 347/1383px wide; heading, Tags, external action and sync fit within it. Document fits the viewport.
  Games and bracket each remain mounted once. No data or geometry changes.
- After screenshots: local session files `DR-022a-{390,1440}-{light,dark}.png`; not committed.
  Visual inspection confirms compact circular identity, readable neutral badges and wrapping native actions.
  Repository-backed measurements above remain the handoff if local screenshots are unavailable.
- Four keyboard cases, after transitions settle, retain focus on the external anchor, `:focus-visible` and a 2px
  semantic ring. Native anchor has an accessible draw-specific name, hidden decorative icon, `_blank` and
  `noopener noreferrer`. External destination is checked without visiting the third-party site.
- Pointer breadcrumb returns to `/tournament/internationaal-tornooi-lokerse-bc-2023`; browser Back restores the draw.
- Computed color measurements converted through browser canvas: title text 19.87:1 light / 16:1 dark,
  secondary Tags 7.74:1 / 9.51:1, external label 4.87:1 / 6.65:1. These pass text thresholds; exhaustive
  accessibility and focus-ring pixel contrast are not claimed.
- Monitored public reload: zero page errors and GraphQL mutation attempts. No sync/operational action triggered.
- Public SSR checked with Node `fetch` of the mounted URL: HTTP 200, named hero and external accessible label present,
  no skeleton shell. Hydrated browser renders the same identity; exhaustive hydration is not verified.
- Formatter: `npx prettier --write` on changed template/component/spec/backlog/brief. Formatting the registry table
  aligns existing rows; their statuses/history are preserved.
- Final validation: `npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static`
  passes lint, production library build, ten prerequisite tasks and 13 suites / 151 tests.
  Initial run had one test failure: the breadcrumb assertion selected Home instead of the tournament link.
  Only the assertion was corrected; all four new regressions pass in the final full project run.
- Not run: screen-reader, exhaustive contrast/accessibility/hydration, authenticated sync permission/disabled states,
  operational sync/outages, alternate locales and long-name browser fixtures. Sync configuration is regression-tested;
  its existing permission control is unchanged. Inherited English `Size` and draw fallback wording is preserved.
- Review: on 2026-11-07 the user selected "Approve DR-022a and commit with disclosed limits" and "Nothing else".
  Approval accepts the unperformed screen-reader, exhaustive contrast/accessibility/hydration, authenticated sync,
  alternative-locale and long-name browser checks. Unchecked criteria remain unchecked; approval does not claim
  failed or unperformed checks passed. Only DR-022a implementation, tests and handoff are approved for commit; no push.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects with existing warnings
  and zero errors. No application code changed after the passing project lint/test/build run.
- Exceptions: none proposed. Existing excluded inline error styling remains for DR-022b.
- Original next action was DR-022b switching and loading/error/empty feedback; it is now completed.
  DR-022 parent reconciliation on 2026-11-08 preserves all previously approved limits; see backlog current focus.

[template]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/page-draw-detail.component.html
[component]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/page-draw-detail.component.ts
[tests]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/page-draw-detail.component.spec.ts
