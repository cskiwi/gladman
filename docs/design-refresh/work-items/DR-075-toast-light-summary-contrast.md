---
title: 'DR-075: Native Toast light summary contrast'
description: 'Correct insufficient native light Toast summary contrast using the shared PrimeNG preset.'
---

## Identity

- ID: DR-075. Authoritative status: [backlog](../backlog.md).
- Selected 2026-11-25 on existing `main`; no new branch or worktree.
- Dependencies: none. [DR-074](DR-074-toast-contrast.md) supplies the completed audit and discovery.
- Preserve the unrelated generated i18n change.
- Rules: [design refresh](../README.md).

## Scope

- Correct only native light success/warn/error Toast foreground tokens in the
  [shared preset](../../../apps/app/config/theme.preset.ts). Affected Nx project: `app`.
- Confirmed current consumer: competition detail at `/competition/pbo-competitie-2026-2027`,
  thirteen mounted `app-sync-button` controls and fourteen Toasts including the shell.
- Check shared sync consumers on competition, new/imported tournament details and both recorded draw routes,
  using [the shared controller](../../../libs/frontend/components/sync/src/sync-button.component.ts).
- Source-check all Toast templates affected by this shared preset, including the custom shell update template.
- Preserve severity distinctions, summary/detail content, announcements, close labels, focus and dismissal.
- Exclude operations, backend mutations, authentication changes, page redesign, unrelated theme tokens,
  component extraction, dependencies, global styles and dormant component redesign.

## Baseline and approach

- Fresh competition baseline confirms DR-074's light success/warn/error summary contrast:
  3.16:1 / 2.85:1 / 4.44:1. Ordinary summary text must reach 4.5:1.
- Installed Aura Toast uses each severity's `color` for the summary, severity icon and close icon.
  Use the existing preset's native `colorScheme.light` boundary, not a custom template or CSS override.
- Only light success/warn/error foregrounds change, using their existing severity palette's `700` token.
  Detail text, other severities and dark tokens remain unchanged.
- Native Toast is already the correct shared presentation boundary. No smart/presentational extraction is warranted.
- Baseline/after utility counts: no template changes; zero new utility classes, wrappers or stylesheets.
- Safe browser-only MessageService fixtures must not activate sync, cache, save or refresh commands.

## Implementation checklist

- [x] Reconcile the previous audit, worktree and a real mounted consumer.
- [x] Confirm native token API and measure the current baseline.
- [x] Correct the smallest shared token scope while preserving other tokens and content.
- [x] Check shared consumers and record out-of-scope discoveries.

## Acceptance and verification

- [x] All six native severity summaries/details reach 4.5:1 in light/dark at 390px/1440px on checked routes.
- [x] No changes to native severity, background, geometry, detail colors or dark computed appearance.
- [x] Native alert attributes, close names, keyboard dismissal and trigger focus remain usable.
- [x] GUID-bearing detail text wraps within the viewport.
- [x] Representative light before/after screenshots inspected.
- [x] Existing relevant Nx lint/build targets pass; exact results recorded.
- [x] Zero new authored palette utilities, SCSS, inline styles or wrappers.
- [x] User visual review/approval recorded.
- [ ] Full screen-reader/touch, exhaustive locale/permission/operational workflows and SSR/hydration checks.
- [ ] All other mounted Toast workflows and custom-template states verified in the browser.
- [ ] Full screenshot matrix, including a successfully captured dark after image, and pixel-precision contrast audit.

## Evidence and handoff

- Implementation complete and explicitly approved, 2026-11-25:
  `Approve DR-075 with documented limits and commit`.
  Approval accepts the unchecked limits, not a claim that unperformed checks passed.
- PrimeNG documentation lookup confirms native Toast's message/close/accessibility APIs.
  The documentation tool does not expose a `theming` section; installed
  `@primeuix/themes/dist/aura/toast/index.mjs` and `@primeuix/styles/dist/toast/index.mjs`
  confirm the actual severity `color`/`detailColor` contract.
- Three native foreground mappings change: light success `{green.700}`, warn `{yellow.700}`,
  error `{red.700}`. Severity icons and close icons inherit the improved foreground too.
  Existing background/border/detail/focus-ring tokens, fonts, geometry and all dark mappings are untouched.
- Fresh baseline: 24 competition cases, six severities in light/dark at 390px/1440px, height 900px.
  Six light summary samples fail before the correction; the other measured text passes.
- After: 120 valid cases across the five real shared sync consumers below, six severities and four
  theme/width combinations each. All summaries/details exceed 4.5:1; minimum native summary 4.77:1,
  minimum detail 6.56:1. Current mounted control counts are 13/36/37/1/1.
  - `/competition/pbo-competitie-2026-2027`.
  - `/tournament/eaff3ce2-a7de-4a89-8ca2-4110bb5fe3b8`.
  - `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72`.
  - Competition draw: sub-event `8e8ba158-859c-48a7-92ca-f2c3ce805f4f`,
    draw `78d42486-ab43-4484-9b68-a99e46bf96ae`, below that competition using
    `/sub-events/{subEventId}/draws/{drawId}`.
  - `/tournament/pk-pbo-2025` draw: sub-event `83ef864d-2e5f-4012-aa11-ea5fe0ee4627`,
    draw `ea1ac59a-1622-4e8b-823c-7a37e14e2674`, using the same nested route structure.

| Severity  | Light summary before | Light summary after | Dark summary unchanged | Light detail | Dark detail |
| --------- | -------------------- | ------------------- | ---------------------- | ------------ | ----------- |
| Info      | 4.77:1               | 4.77:1              | 8.26:1                 | 12.56:1      | 12.47:1     |
| Success   | 3.16:1               | 4.80:1              | 10.04:1                | 13.03:1      | 11.80:1     |
| Warn      | 2.85:1               | 4.77:1              | 10.43:1                | 13.18:1      | 11.51:1     |
| Error     | 4.44:1               | 5.94:1              | 8.16:1                 | 12.50:1      | 12.96:1     |
| Secondary | 7.74:1               | 7.74:1              | 12.18:1                | 12.46:1      | 6.56:1      |
| Contrast  | 19.03:1              | 19.03:1             | 18.36:1                | 19.87:1      | 18.36:1     |

- Method: computed CSS colors normalized through a one-pixel sRGB canvas, ancestor-background alpha compositing,
  then WCAG sRGB linearization and relative luminance `(lighter + 0.05) / (darker + 0.05)`.
  Light backgrounds retain 0.95 alpha. Values are rounded computed estimates, not blurred-pixel,
  gamut-precision or screenshot-derived measurements; preserve DR-074's disclosed measurement limits.
- All 120 valid cases preserve native `role=alert`, `aria-live=assertive`, `aria-atomic=true`,
  translated `Sluiten` close names, trigger focus before dismissal and Enter/Space dismissal.
  Toast/close bounds fit the viewport and GUID-bearing details wrap. No operational control was activated.
- Competition before/after computed background, border, detail and dark foreground colors match.
  Its native fixture geometry remains 262.5px by 77px at x=92.5/1142.5, y=20 for 390px/1440px.
  Screenshot crops of the narrow light warning before/after were inspected: the native presentation remains,
  with visibly darker summary/icons. Dark screenshot capture failed after five tool attempts;
  no dark screenshot or full viewport screenshot-matrix pass is claimed.
- Discarded attempts: initial imported-detail fixture preceded hydration; first tournament-draw wait passed
  a missing element to Angular's debug API. Retried only after a mounted, hydrated controller existed.
  One initial imported-detail matrix also recorded an unsettled y=-57px Toast and incorrect first narrow width.
  A full repeated matrix explicitly waits for each viewport width and uses 1500ms presentation/600ms dismissal
  settlement; all 24 imported-detail checks then pass. Other settled routes pass; no application workaround.
- Source-checked all twelve native/custom Toast declarations. Only shell supplies a custom message template;
  the rest use native rendering, with club team builder adding only a responsive width breakpoint.
- Native `p-toast` source consumers: shared sync and shell; competition edit/assembly; tournament edit/general
  enrollment; club team builder; admin; sync-admin cron jobs, ranking systems, sync plans and overview.
- All inherit the same native severity foregrounds; shell uses a custom message template inheriting the severity
  foreground rather than native summary/detail classes. Do not silently redesign that template.
- Four additional [shell](../../../libs/frontend/components/shell/src/shell.component.html) checks use its actual
  localized update-available info message via browser-only MessageService fixtures, never the refresh command.
  Light/dark at 390px/1440px pass summary/detail contrast (minimum 4.75:1), wrapping, bounds, alerts, close names,
  retained Account-button focus and Enter dismissal. An earlier synthetic shell fixture targeted a hidden mobile
  navigation button on wide screens; those focus samples are invalid and replaced by visible Account focus checks.
- Passed: `npx prettier --write apps/app/config/theme.preset.ts docs/design-refresh/backlog.md
docs/design-refresh/work-items/DR-075-toast-light-summary-contrast.md`.
- Passed: `npx nx run-many --projects=app --targets=lint,build --output-style=static`,
  including 29 dependency tasks. Existing ineffective dynamic-import warnings in admin/sync-admin only.
  The app has no resolved unit-test target; no tests that merely assert token constants were added.
  The rendered browser contrast checks validate the actual changed behavior.
- Passed: scoped `npx prettier --check`, byte-level LF/frontmatter/heading assertions, 421 local links,
  DR-075 Review-registry assertion and scoped `git diff --check`. Git warns about future CRLF conversion;
  current changed-file bytes are verified LF. No repository configuration changed.
- No new exceptions, unrelated discoveries or reuse abstractions. Pre-existing navigation view-transition
  `InvalidStateError` appeared again; no unrelated fix.
- Fixtures cleared and current measurement helper deleted. Original competition URL, dark document class and
  1024px by 768px viewport restored. No persisted theme preference, authentication or operational state changed.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 34 targets, 22 pass from cache;
  twelve reproduce existing `@nx/dependency-checks` failures outside this slice: backend-seo, backend-health,
  shared, backend-ranking, i18n, backend-translate, backend-authorization, backend-search, utils,
  backend-database, frontend-modules-translation and backend-graphql. No unrelated fixes.
- Authoritative status is Done after explicit approval with the unchecked limits preserved.
  Commit only the preset, this brief and backlog, preserving unrelated generated i18n. No push is authorized.
- Exact next candidate: reconcile DR-008's remaining mounted player-detail scope against its completed
  DR-008a-c children and the completed shared DR-005/DR-006 work before selecting a new child.
  Do not start that reconciliation or another implementation slice in this invocation.
