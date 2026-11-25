---
title: 'DR-074: Native Toast contrast verification'
description: 'Verify the committed native Toast theme correction without repeating the redesign.'
---

## Identity

- ID: DR-074. Authoritative status: [backlog](../backlog.md).
- Selected 2026-11-25 on existing `main`; no worktree or branch creation.
- Rules: [design refresh](../README.md). Dependencies: none; DR-007 is approved Done.
- Preserve the unrelated generated i18n worktree change.

## Scope

- Investigation only: verify the already committed `8af9f4ff` native Toast theme correction.
- Sources: [preset](../../../apps/app/config/theme.preset.ts),
  [sync controller](../../../libs/frontend/components/sync/src/sync-button.component.ts),
  [native Toast](../../../libs/frontend/components/sync/src/sync-button.component.html).
- Mounted competition detail, new/imported tournament detail and their draw routes, as recorded in
  [DR-007b](DR-007b-sync-action-feedback.md). Confirm current counts before fixtures.
- Measure native summary/detail contrast against composited backgrounds, minimum 4.5:1 for ordinary text.
- Check info/success/warn/error/secondary/contrast fixtures in light/dark at 390px/1440px.
- Preserve native alert attributes, close names, dismissal and focus behavior.
- Exclude operational commands, backend mutations, page redesign, shell update-message template redesign,
  exhaustive other Toast workflows, new components, dependencies and global styling.

## Baseline and approach

- Historical dark error detail failed visually in DR-007b; do not treat that old color as current evidence.
- Current preset maps dark info/success/warn/error details to semantic text and mixes backgrounds with content.
  Secondary has separate semantic surface/text tokens. Verify actual runtime styles, not token names alone.
- Use browser-only MessageService fixtures on existing consumers; never invoke controller operations.
- Native Toast remains the shared styling boundary; no smart/presentational extraction is warranted.
- No markup, utility or stylesheet changes planned; before/after application source should be identical.

## Audit checklist

- [x] Reconcile current source with the historical correction and select a bounded audit.
- [x] Confirm current runtime token resolution and all five mounted route consumers.
- [x] Measure all six severities in both themes/widths on competition detail and both draw routes.
- [x] Repeat the matrix on authenticated new/imported tournament detail consumers.
- [x] Check bounds, labels, alert attributes, keyboard dismissal and retained trigger focus in all 120 cases.
- [x] Inspect representative light/dark screenshots.
- [x] Record results, exceptions, discoveries and precise next action in the backlog.
- [x] Required user review/approval is recorded.
- [ ] Full screen-reader/touch, exhaustive locales/permissions, other Toast templates and SSR verification.
- [ ] Full viewport screenshot matrix and pixel-precision contrast audit.

## Evidence and handoff

- `git log -1 --format="%h %s" -- apps/app/config/theme.preset.ts` confirms `8af9f4ff`.
- `npx nx show project app --json` confirms resolved lint/build/serve/extract-i18n targets.
- Application changes: none. Utility/style count delta: zero. New exceptions: none.
- Application builds/unit tests: not run; documentation-only investigation does not change application code.
  Required pre-commit workspace lint is recorded below.
- Browser inventory after settled reload: competition detail thirteen controls; each draw route one.
  Initially new/imported tournament detail each had zero in the logged-out browser, not the historical 36/37.
  [Tournament controller](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.ts)
  explicitly returns null sync configurations when `auth.loggedIn()` is false.
  A ten-second visible-control wait on the new tournament timed out; subsequent settled inventory confirms absence.
  No auth state, permission or production consumer was fabricated for verification.
- Resolved blocker: user confirmed `I logged in; finish the remaining checks`.
  Fresh authenticated reload confirms 36/37 controls on new/imported tournament details.
  All remaining 48 severity/theme/width cases pass detail contrast, dark summary contrast, bounds, wrapping,
  alert attributes, close names, trigger focus and keyboard dismissal. Twelve light-summary samples fail as expected.
  Total completed matrix: 120 cases across all five routes; thirty light summary failures are tracked in DR-075.
  The same ratio table applies to these authenticated consumer samples; minimum detail 6.56:1,
  minimum dark summary 8.16:1. Login was performed by the user, not a fixture or permission override.
- Initial browser Playwright matrix: six severities, two themes, two widths (390px/1440px, height 900px),
  three available routes, 72 synthetic notifications. Each uses the existing component MessageService,
  a safe summary and GUID-bearing detail, with 1100ms settlement before measurement and 450ms after dismissal.
  Error dismissal uses Space; the other severities use Enter. All 72 dismissals pass.
- Contrast method: normalize computed CSS colors to sRGB using a one-pixel canvas; composite ancestor backgrounds
  and foreground alpha; apply WCAG sRGB linearization and relative luminance weights 0.2126/0.7152/0.0722.
  Ratio is `(lighter + 0.05) / (darker + 0.05)`. Values below are rounded, not screenshot-derived.
  Light colored backgrounds have 0.95 alpha; ratios use ancestor surfaces rather than sampling blurred pixels.
  They are estimates of rendered contrast, not a full screenshot/pixel or gamut-precision audit.
  Dark backgrounds are opaque; dark error detail now resolves to `oklch(0.94 0.005 250)`.

| Severity  | Light detail | Dark detail | Light summary | Dark summary |
| --------- | ------------ | ----------- | ------------- | ------------ |
| Info      | 12.56:1      | 12.47:1     | 4.77:1        | 8.26:1       |
| Success   | 13.03:1      | 11.80:1     | 3.16:1        | 10.04:1      |
| Warn      | 13.18:1      | 11.51:1     | 2.85:1        | 10.43:1      |
| Error     | 12.50:1      | 12.96:1     | 4.44:1        | 8.16:1       |
| Secondary | 12.46:1      | 6.56:1      | 7.74:1        | 12.18:1      |
| Contrast  | 19.87:1      | 18.36:1     | 19.03:1       | 18.36:1      |

- Pass: all measured detail text and dark summaries exceed 4.5:1. The committed dark detail correction works.
  Fail: thirty light summary samples (success/warn/error, two widths, five routes) fall below 4.5:1.
  Native summaries on draw routes are 14px, weight 500; the ordinary-text threshold applies.
  Record the separate light-summary correction as DR-075; do not claim all Toast text passes or restyle here.
- Pass in all 120 cases: Toast and close-button bounds fit viewport; GUID details do not overflow; native
  `role=alert`, `aria-live=assertive`, `aria-atomic=true`, translated `Sluiten` close name and main-button
  focus before dismissal remain intact. This is not proof of a real queued/cache operation or screen-reader output.
- Cropped light error Toast and settled dark error Toast screenshots inspected: details are readable.
  Integrated screenshot capture failed; the first locator dark image was blank and is discarded.
  A 2500ms-settled clipped page screenshot succeeds. No full screenshot matrix is claimed.
  Safe crops remain session evidence; all useful measured findings and the handoff are recorded here.
- Fixture messages cleared, temporary helper removed by navigation; original competition URL, dark theme and
  1024px by 768px viewport restored. The audit did not change theme preference persistence,
  authentication or operational state; the user separately logged in to unblock verification.
- Previously recorded navigation view-transition `InvalidStateError` appeared again; no unrelated fix.
- Full screen-reader/touch, exhaustive locales/permissions, other Toast templates and SSR remain unverified.
- Passed: `npx prettier --write` and `npx prettier --check` on this brief and the backlog;
  `git diff --check -- docs/design-refresh/backlog.md docs/design-refresh/work-items/DR-074-toast-contrast.md`.
  Node assertions pass byte-level LF, frontmatter/no H1, 419 local links and DR-074/DR-075 registry consistency.
  Git warns of future CRLF conversion for the backlog; its current bytes are verified LF, with no config change.
- Explicit approval, 2026-11-25: `Approve DR-074 with documented limits and commit`.
  Completion accepts the unchecked screen-reader/touch, locale/permission, other-template, SSR and
  screenshot/pixel-measurement limits, plus the separate light-summary failure DR-075; none are claimed passed.
  The login blocker is resolved and the five-route matrix is complete.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 34 targets, 22 pass from cache;
  twelve fail existing `@nx/dependency-checks` outside this documentation slice: backend-health, backend-seo,
  shared, backend-authorization, i18n, backend-ranking, backend-translate, utils, backend-search,
  backend-database, frontend-modules-translation and backend-graphql. No unrelated fixes.
- Authoritative status is Done after this approval. Commit only this brief/backlog; preserve unrelated i18n work.
  Exact next candidate: scope DR-075's native light-summary token correction against real consumers.
  Do not implement DR-075 or another slice in this invocation. No push is authorized.
