---
title: 'DR-007a: Compact semantic sync-status presentation'
description: 'Native PrimeNG status Tags and translated accessible names for mounted shared sync indicators.'
---

## Identity

- ID: DR-007a. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-007](DR-007-shared-controls.md). No incomplete implementation prerequisite.
- Rules: [design refresh](../README.md).
- Selected 2026-11-23 on existing `main`, starting with a clean worktree.

## Scope

- Confirmed mounted `/competition/pbo-competitie-2026-2027`: thirteen indicators, including synced and never-synced.
- Other current consumer: tournament detail event and sub-event headers. Check both supplied tournament routes.
- Projects: `frontend-components`, `frontend-pages-competition`, `frontend-pages-tournament`.
- Sources: [component](../../../libs/frontend/components/sync/src/sync-status-indicator.component.ts) and
  [template](../../../libs/frontend/components/sync/src/sync-status-indicator.component.html).
- Preserve configuration, status inference, translated tooltips, icons, permissions and consumer layout.
- Exclude sync/cache mutations, action SplitButtons, dialogs, status inference fixes, country/state, and theme.
- Keep the existing smart page / presentational shared indicator split; no additional wrapper is needed.

## Baseline and proposed approach

- Baseline: icon-only `i`, no accessible name or text; tooltip is pointer-dependent.
- Five hard-coded palette utilities provide status color; syncing adds an unnecessary pulse beside its spinner.
- Replace with compact icon-only native Tag severities and an explicit translated image name.
  Keep the tooltip as supplementary information, not the sole accessible description.
- Native Tag owns its surface, padding and status appearance. No custom CSS, inline styles or theme changes.
- Baseline template has three utility tokens, plus six status-class tokens and host `inline-block`.
- Existing country/state integration is already Done under DR-018b1; no redesign restart.

## Implementation checklist

- [x] Confirm mounted consumer and bounded shared scope.
- [x] Use native Tag severity and translated accessible name, retaining the existing compact icon contract.
- [x] Preserve statuses, tooltip translation and consumer configuration.
- [x] Check both mounted consumer routes and record unrelated discoveries without expanding scope.

## Acceptance and verification

- [x] All five statuses retain their icons and translated status names independent of color/tooltip.
- [x] Status inference and parent-controlled status changes remain unchanged.
- [x] Light/dark at 390px/1440px fit the existing competition/tournament headers.
- [x] Native appearance, accessible names, icon contrast and supplementary pointer tooltip are checked.
- [x] No new palette utilities, custom styles, dependencies, operational mutations or hidden global changes.
- [x] Focused existing Nx test/lint/build checks pass.
- [x] Visual review is approved.
- [ ] Full screen-reader, alternate locale and SSR/hydration checks pass.

## Evidence and handoff

- Changed only the shared indicator component/template, six focused presentation tests and this repository handoff.
  Status inference, configuration interface and tooltip keys are unchanged.
- Native Tag maps synced/syncing/queued/failed/never-synced to success/info/warn/danger/secondary.
  `role="img"` and translated `aria-label` provide meaning without color or opening a tooltip.
  Existing distinct icons and syncing spinner remain; the duplicate pulse is removed.
- Template layout utility tokens: three -> one scoped `gap-0!`; six status-color/pulse tokens -> zero.
  Host `inline-block` remains. No stylesheet, inline style, theme/preset or consumer-template change.
- Existing page/container and shared presentational indicator separation is sufficient; no new extraction.
- Before: mounted competition has thirteen unnamed icons; first event is synced, first sub-event never-synced.
  Original dark synced-icon screenshot inspected. Baseline viewport was 1069px by 1272px.
- Before and after read-only mounted matrix: competition thirteen, new tournament 36, imported tournament 37
  indicators, at 390px/1440px in light/dark. Twelve cases per phase; all indicators stay within viewport.
  After: zero unnamed indicators and zero overflowing sub-event headers. Real states remain synced/never-synced.
  All twelve after cases expose Dutch names `Gesynchroniseerd` and `Niet gesynchroniseerd`.
- Narrow document overflow was present before and remains after, independently of indicator bounds.
  After: scroll width 424px versus client width 375px; desktop 1425px/1425px, no document overflow.
  Existing shared topbar overflow remains DR-066; no hidden page/shell correction.
- Browser-only input-signal fixtures exercise all five statuses on the mounted imported tournament hero in
  light/dark at 390px/1440px. Twenty cases preserve distinct icons, translated image names, compact native
  Tags and zero keyboard stops. Original input is restored in `finally`; no server/account changes.
  These are explicitly synthetic presentation states, not evidence of queued/running/failed live operations.
- Icon contrast uses computed native foreground and alpha-composited ancestor backgrounds, converted through
  a canvas for modern CSS color syntax, with WCAG relative luminance. Both widths produce:

  | State        | Light | Dark  |
  | ------------ | ----- | ----- |
  | Synced       | 4.57  | 10.51 |
  | Syncing      | 5.17  | 9.12  |
  | Queued       | 4.52  | 9.31  |
  | Failed       | 5.30  | 8.73  |
  | Never synced | 7.74  | 9.51  |

  Ratios exceed the 3:1 meaningful-icon requirement. These are icon-to-Tag-fill ratios, not full-page contrast.

- Real Playwright hover opens translated tooltip `Succesvol gesynchroniseerd`; the native image name is
  available separately. Read-only indicators intentionally add no keyboard control or focus stop.
- Imported tournament light/dark narrow hero screenshots inspected after implementation; native Tags fit
  the wrapped actions. Wide hero screenshot is cropped by the shared capture tool; isolated wide hero-indicator
  captures fail after its own five retries. Wide DOM geometry passes, but complete wide screenshot review
  is not claimed. No full before/after screenshot matrix or screen-reader/touch verification.
- `npx nx run frontend-components:test --testPathPatterns=sync-status-indicator --runInBand`
  passes: one suite, six tests. Static-output rerun passes from cache.
  Tests cover all five native severity/icon/name presentations, non-interactive compact output and an updating
  syncing-to-failed parent input, including spinner removal.
- `npx nx run-many -t lint build -p frontend-components frontend-pages-competition frontend-pages-tournament
--output-style=static` passes: fifteen tasks, eleven cached, existing warnings only.
  The shared entry point and both real page consumers compile.
- Repository Prettier formats every changed file before validation. Final handoff checks use `prettier --check`
  on the six scoped files, `git diff --check`, and local-file LF/link assertions.
  All pass; the approved DR-007a registry row is Done. Git reports existing checkout-policy CRLF
  warnings, but byte-level checks confirm every scoped working file uses LF.
- Full screen-reader/touch, alternate locale, SSR/hydration regression and actual operational transitions are
  not run. No sync/cache action was activated; mutation paths and permission predicates are unchanged.
- Shared browser original dark theme and 1069px/1272px viewport are restored at handoff.
- Spacing review feedback, 2026-11-23: extra space appears to the icon's right.
  Mounted inspection confirms PrimeNG always renders an empty label span after the icon, so the native
  3.5px flex gap produces 7px left / 10.5px right padding. Native Tag has no hide-label or gap input.
  A plain `gap-0` does not override the component layer in this application's stylesheet ordering.
- Layout exception: `class="gap-0!"` only on this icon-only Tag removes that empty-label gap.
  This is one scoped important spacing utility, not custom CSS, a token override or a global Tag change.
  Native padding, fill, severity, typography, icons and accessible naming remain unchanged.
  Remove the override if native Tag supports omitting the empty label or configuring icon-only spacing.
- After correction, all indicators on the three live routes pass the twelve-case theme/width matrix again:
  zero left/right padding difference, unnamed indicators or indicator viewport overflow.
  Measured Tag padding is exactly 7px on each side, gap 0px, width 24.5px instead of 28px.
  Fresh narrow imported-tournament light/dark screenshots inspected; broader capture limits remain.
- Same focused six tests and scoped lint/build commands pass again after the correction
  (fifteen lint/build tasks, eleven cached; existing warnings only).
- No other exceptions.
- Explicit approval, 2026-11-23: `Approve DR-007a with documented limits and commit`.
  Approval follows the equal-padding correction and accepts the unchecked wide-capture, full accessibility,
  screen-reader/touch, locale, SSR/hydration and actual operational-transition limits, without claiming they passed.
  Authoritative backlog status is Done; unchecked criteria remain unchecked.
- Required pre-commit `npx nx run-many --target=lint --output-style=static` runs all 34 projects:
  24 pass, ten untouched projects fail existing `@nx/dependency-checks` installed-version mismatches.
  Failures: backend-seo, backend-authorization, backend-health, backend-ranking, shared, backend-search,
  utils, backend-translate, backend-database and backend-graphql. No unrelated dependency fixes.
  Scoped components/competition/tournament lint/build and all six indicator tests pass as recorded above.
- Exact next action: scope the next sync action/dialog presentation slice under DR-007 against the existing
  DR-065 unnamed-dropdown discovery and real mounted consumers. Do not start it in this invocation.
  DR-007 remains open; do not restart completed country/state work or change global tokens implicitly.
  Commit only the approved indicator implementation, tests and repository handoff; no push is authorized.
