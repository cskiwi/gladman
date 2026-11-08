---
title: 'DR-023a: Tournament administration chrome'
description: 'Bounded refresh of the mounted shared admin shell, preserving every tab and permission gate.'
---

## Identity

- ID: DR-023a; parent DR-023 remains open. Authoritative status: [backlog](../backlog.md).
- Dependencies: completed editing chrome DR-020c as presentation reference.
- Explicit shared shell prerequisite for DR-023b/c, DR-024 and DR-025; tab contents are excluded.
- Design rules: [rollout](../README.md). No global theme or shared component implementation changes.

## Scope

- Project: `frontend-pages-tournament`.
- Confirmed mounted route on 2026-11-08: `/tournament/8658b541-702a-408e-8114-2858a9428069/admin`.
- Hydrated browser renders the real tournament name, Back and all five native tabs; Settings is selected.
  Enrollment, draw, schedule and check-in are disabled on this tournament. Do not enable them for visual testing.
- Sources: [page][component], [template][template], [guarded resource selector][service], [regressions][tests].
  The former page stylesheet is removed after its two rules lose their consumers.
- Refresh only heading/context/back action, tab container and loading/error/permission feedback.
- Preserve query-param tab mappings, merged query navigation, phase gates, authorization, breadcrumb,
  back destination, SEO, service calls and all tab child inputs/outputs.
- Exclude every tab's fields, tables, dialogs, operations, query/mutation behavior, backend and translation assets.
  One tightly coupled service-selector guard is included because failed resource reads otherwise crash page feedback.
- Keep the existing smart page/tab-child separation. No new wrapper earns reuse for this unique shell;
  use native PrimeNG and the already-approved editing header pattern.

## Baseline and proposed approach

- Before: decorative `t-eyebrow`, oversized combined heading, hand-built surface and inline semantic CSS feedback.
- Existing page stylesheet only supplies host display and `.mr-2`; replace with host layout and Tailwind spacing.
- Use a compact localized heading with separate real tournament context and wrapping native Back action.
- Use native bordered Card and scrollable Tabs rather than an overflowing custom tab wrapper.
- Use native severity-based Messages and Card/Skeleton loading with a localized busy announcement.
- Keep the shared canvas/table preset and all tab child presentation unchanged.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and bounded cross-tab shell scope.
- [x] Simplify chrome using the established editing composition and native PrimeNG.
- [x] Replace feedback and remove only the now-unused page stylesheet.
- [x] Preserve data, navigation, permissions, tab consumers and localization.
- [x] Record focused regression, layout and interaction evidence.
- [x] Persist exact remaining review/verification actions.

## Acceptance and verification

- [x] One localized h1, real tournament context, named native Back action and unchanged breadcrumb links.
- [x] Native Card/Tabs and keyboard-reachable horizontal tab navigation at narrow widths.
- [x] All five tab mappings, phase disabled states, authorization and child bindings remain unchanged.
- [x] Explicit native loading, error and permission feedback; no forms exposed without authorization.
- [x] Light/dark 390/1440px shell fits; excluded child overflow is distinguished from shell behavior.
- [x] Keyboard focus, Back/query navigation and existing localized labels are verified.
- [ ] Sampled normal-text contrast passes in both themes; native light failures remain shared audits.
- [x] Existing focused Nx lint/test/build tasks pass.
- [x] No new stylesheets, inline styling, palette utilities, dependency or mutation.
- [ ] Screen-reader, exhaustive accessibility/contrast, hydration and authenticated operational workflows verified.
- [x] User review or explicit approval with disclosed limits.

## Evidence and handoff

- Worktree was clean at start; DR-022 parent reconciled against approved children and completed DR-006j bracket.
- Live baseline: authenticated browser mounts admin shell, title and five tabs without any operational mutation.
  Settings selected; all four operational tabs disabled. This is not evidence of their workflow correctness.
- Before: narrow light/dark admin host is 347px; document/client width 375px.
  Tab viewport is 310px with 617px content but no explicit native navigation buttons.
  Initial 1571px dark viewport also has no document overflow; no before 1440px capture is claimed.
- After: four actual authenticated light/dark 390/1440px cases preserve all five labels, selected Settings,
  permission/phase gates and real tournament context. Live phase is `DRAFT`; four operational tabs remain disabled.
  Admin widths 347/1280px; document/client widths 375/1425px match. Native tab viewport/content is
  310/617px narrow and 1243/1243px wide. No document overflow or child changes.
- Native Next/Previous pointer scrolling reaches 307px light and 275px dark.
  Separate Enter tests reach 275px in both themes without query navigation; controls show native 1px focus.
  Four actual Back keyboard focus cases retain `:focus-visible` with solid native 1px outline.
  Real Back navigates to the unchanged tournament-ID URL; browser Back restores the admin shell.
- Four shell-only screenshots `DR-023a-{390,1440}-{light,dark}.png` in local session files were inspected.
  Narrow header/actions stack, wide Back aligns right, Card and tab text remain readable.
  Only public tournament identity/chrome is captured; no private administrative data is committed.
- Sixteen isolated installed-Edge headless fixtures cover permission, 240-character unbroken long name,
  GraphQL error and delayed loading in both themes/widths. Every fixture fits; one h1 and native alert remain,
  unauthorized tabs never mount, three loading skeletons/busy announcement clear after the read resolves.
  Encoded theme-cookie fixtures verify actual theme preference restoration without touching the user's cookies.
  Monitored fixtures: zero page errors, mutation attempts and unexpected GraphQL operations.
- Initial browser runner lacked bundled Chromium; installed Edge channel succeeded without dependency installation.
  Initial fixture used an unencoded cookie name and correctly failed the theme assertion; corrected encoded cookie
  setup passes all 16 cases. An initial real-browser locator also matched the excluded Settings Stepper;
  subsequent checks use only `p-tabs > p-tablist`, and completed four-case results supersede that attempt.
- Initial Nx run: one new error-state test failed because `resource.value()` threw before feedback could render.
  Reuse the detail/draw page's existing `hasValue()` guard in the admin selector; errors still render explicitly,
  with unchanged query/error handling. Final run passes all 17 new shell cases and all 184 prior tournament cases.
- Exact focused command:

  ```powershell
  npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static
  ```

  Final result: lint, production library build and ten prerequisites pass; 16 suites / 201 tests pass.
  Existing lint warnings and TypeScript metadata warnings remain. No application build claimed.
  Shell tests stub tab children (no operational calls) while using the real admin resource, router, native components
  and translations. Seven phase matrices, five tab query mappings, child inputs, Settings refetch, merged query
  navigation, Back, permission/SEO identity and loading/read-error feedback pass without mutations.

- Utility comparison: 98 to 100 template lines; 59 to 43 static class tokens plus host `block`.
  Native loading announcement and readable template structure explain line count; two inline styles and both
  stylesheet rules are removed. No new shared component, theme change, translation asset or dependency.
- Settled browser canvas contrast sampling: heading/context 18.20:1 light / 16.64:1 dark.
  Native Back 4.46:1 / 6.91:1 (DR-032); selected tab 3.65:1 / 10.22:1 (DR-044).
  Safe permission warning 2.83:1 / 7.98:1 and error 4.41:1 / 4.63:1 (DR-034).
  Light small-text values fail 4.5:1; dark passes. No color exception or global fix is introduced.
- Public administration SSR via Node `fetch`: HTTP 200 with localized title, context and permission feedback.
  Hydrated public and real authenticated browser states agree with their permission gates;
  exhaustive hydration is not verified. Public SSR does not prove authenticated SSR.
- Formatter: `npx prettier --write` on every changed application/documentation file.
  `git diff --check` passes with existing checkout warnings; formatter writes LF.
- Not verified: screen-reader, exhaustive accessibility/contrast/focus-ring contrast/hydration,
  English/French browser locales, all phase-enabled operational/admin/sync workflows and app build.
  User review was outstanding at this stage; explicit acceptance is recorded below.
- Pre-approval result: Review. No operational blocker for this shell; approval is recorded below.
- Exceptions: none.
- Parent DR-023 stays open for DR-023b/c. Do not enable tabs or change tournament state solely for redesign.

## Approval and final delivery

- On 2026-11-08 user selected "Approve completion and commit with disclosed limits" and "Nothing else".
  Approval covers the admin shell, guarded error selector, tests, handoff and DR-022 parent reconciliation.
  No unrelated files or workflow changes are authorized; no push.
- Authoritative child status is Done with accepted limits. Native light Back/selected-tab/warning/error
  contrast failures (DR-032/DR-044/DR-034) and unperformed screen-reader, exhaustive accessibility/contrast/
  focus-ring contrast/hydration, alternative browser locales, phase-enabled operational/admin/sync workflows
  and app build remain unchecked. Approval does not claim these failed or unperformed checks passed.
- No application code changed after the final passing focused lint/test/build and browser checks.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
  with existing warnings and zero errors. Only handoff documents changed after the focused checks.
- Exact next action in a fresh invocation: confirm a real phase-enabled enrollment consumer before scoping DR-023b.
  The supplied tournament remains `DRAFT`; do not change its state for redesign.
  If no appropriate consumer is available, record the precise blocker and request safe route/data.
  Parent DR-023 stays open; do not start another implementation slice in this invocation.

[component]: ../../../libs/frontend/pages/tournament/src/pages/admin/page-admin.component.ts
[template]: ../../../libs/frontend/pages/tournament/src/pages/admin/page-admin.component.html
[service]: ../../../libs/frontend/pages/tournament/src/pages/admin/page-admin.service.ts
[tests]: ../../../libs/frontend/pages/tournament/src/pages/admin/page-admin.component.spec.ts
