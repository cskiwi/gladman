---
title: 'DR-072: Tier badge contrast presentation'
description: 'Present important level metadata clearly in both themes without scoped token bindings or theme overrides.'
---

## Identity

- ID: DR-072; authoritative status is in the [backlog](../backlog.md).
- Dependencies: none outstanding. [DR-005a](DR-005a-tier-badge.md) remains completed historical work.
- Rules: [design refresh](../README.md).
- Intended outcome: render important ranking levels clearly in both themes, without `[pt]` or `[dt]`.

## Scope

- Shared [component][component], [template][template], and [focused tests][tests].
- Projects: `frontend-components`, `frontend-pages-player`, `frontend-pages-tournament`.
- Confirmed mounted consumer on 2026-11-21: `/players/glenn-latomme`, 31 tier badges in recent games
  and strongest matchups. `/players/glenn-latomme/ranking/single` also mounts 12 ranking-table badges.
- Other source consumers: encounter cards and tournament draw games. The unused match-row component stays unchanged;
  do not add consumers or fixtures solely to redesign it.
- Preserve `level` (number/string), optional `label`, `size` (`default`/`sm`), selector, visible content,
  non-interactive semantics, data, permissions, localization, and routes.
- Exclude page redesigns, ranking calculations, other status widgets, global theme/styles, dependencies,
  and operational mutations. No new component extraction: this is already a shared presentation-only component.

## Baseline and initial native approach

- Baseline: one native Tag, two conditional minimum-width bindings, and a computed scoped-token object
  controlling foreground, radius, weight, font size, and padding. Existing tests assert that token object.
- Mounted player detail starts in dark mode; before screenshots in dark and light show the cyan badges.
- Installed PrimeNG 22.1.2 Tag supports `severity`, `value`, and `rounded`, but has no native size input.
- Use native `contrast` severity for neutral level metadata, not win/loss status. This intentionally replaces
  primary tint with the native high-contrast treatment, avoiding scoped text-color fixes or utility overrides.
  Aura's secondary dark Tag maps to the inverted surface scale; do not assume its contrast is appropriate.
- Retain `min-w-8`/`min-w-10` as the size contract. Let PrimeNG provide typography, radius, and padding for both
  sizes rather than reproducing custom compact tokens. Exact historical pixel dimensions are not retained.
- Utility count remains two conditional width bindings; no new utilities, SCSS, inline styles, or theme edits.

## Implementation checklist

- [x] Confirm the single shared slice and a populated mounted consumer.
- [x] Preserve rendered values and the public API while removing scoped token computation and binding.
- [x] Honor the explicit custom-badge exception using semantic utilities without replacement CSS.
- [x] Update focused tests for custom treatment and both font-size variants.
- [x] Recheck shared consumers for the custom revision without modifying their source; coverage limits remain below.
- [x] Record custom-revision validation, visual evidence, and any out-of-scope discoveries.

## Acceptance and verification

- [x] Numeric/string levels and optional labels remain unchanged; font-size classes and content-sized widths work.
- [x] The mounted player detail and ranking table render the custom semantic treatment.
- [x] There are no `[pt]`/`[dt]` bindings, new colors, stylesheets, inline CSS, or global changes in this slice.
- [x] Light/dark and narrow/wide layouts preserve readable badge text without clipping on the checked player routes.
- [x] Label contrast is at least 4.5:1 in both themes for the custom revision.
- [x] Badges remain plain content without new focusable or interactive elements.
- [x] Focused Nx tests and relevant lint/build tasks pass for the custom revision.
- [ ] Alternate locales, screen-reader use, broader populated consumers, and SSR/hydration are verified.
- [x] User explicitly approved completion and commit with the disclosed verification limits.

## User-directed custom exception

- On 2026-11-21 the user rejected the native contrast Tag: unreadable on dark and too heavy on light.
  They explicitly allowed a custom badge because levels are among the most important information in the app.
  This is presentation feedback/exception approval, not completion or commit approval.
- Native contrast passes text contrast numerically but loses recognizable badge boundaries in the dark canvas
  and produces a heavy black block in light. Native primary required the original scoped-token text correction;
  native secondary uses the inverted dark surfaces. Do not introduce global token edits for this single widget.
- The smallest custom alternative is one non-interactive semantic `span` in the existing shared component.
  Use `bg-highlight`, `text-color`, and `border-primary` for theme-aware fill/text/emphasis, not separate palettes.
  Use compact padding, a rounded border, semibold text, and content-sized widths.
  `sm` uses `text-sm`; `default` uses `text-base`. No SCSS, inline styles, new tokens, or `[pt]`/`[dt]`.
- The user confirmed removing minimum widths: `I removed the min-width because it was better that way`, 2026-11-21.
  Keep that concurrent edit; `size` now controls font size, not a minimum width. The inputs/selector are unchanged.
- Utility footprint changes from two width bindings to eleven fixed utilities and two font-size bindings.
  These provide the custom primitive's geometry, readable typography, and semantic appearance; no wrapper is added.
- Consumer scope is unchanged. Validate actual light/dark foreground contrast and responsive bounds again.
  Remove this exception if a native component later supplies the approved appearance without scoped corrections.

## Rejected native attempt evidence

- **Before:** browser observed 31 badge hosts and numeric levels on player detail, 2026-11-21.
  Dark/light screenshots were inspected in chat; no screenshots or personal data are committed.
- **Passed:** source inspection of installed Tag API and Aura Tag tokens; all six source consumer groups identified.
- **Changed scope:** the shared component/template/spec and DR-072 brief/backlog only.
  Removed the computed token object and `[dt]`; kept `displayValue`, all inputs, and both minimum widths.
  No smart/dumb split needed: all real consumers already reuse the presentation-only badge.
- **Passed:** `npm exec prettier -- --write` with the five changed files explicitly selected before Nx validation.
- **Passed:** PowerShell `$env:NX_DAEMON='false'`, then
  `npm exec nx run frontend-components:test -- --runInBand --testPathPatterns=tier-badge.component.spec.ts
--output-style=static`; one suite, three tests passed (native treatment, label/string level, size widths).
- **Passed:** same environment, then `npm exec nx run-many -- --targets=lint,build
--projects=frontend-components,frontend-pages-player,frontend-pages-tournament --output-style=static`.
  All six requested tasks and nine prerequisites passed; some outputs were cached.
  Existing lint warnings: components 31, player 19, tournament 1; no lint errors.
  Non-failing ts-jest metadata and Windows native-module cache-copy warnings were reported.
- **Passed:** source search for `\[dt\]|\[pt\]|designTokens` in the badge TypeScript/templates returned no matches.
- **Passed:** browser on `/players/glenn-latomme`: 31 native contrast badges at 1440px; 15 at 390px
  in the existing responsive composition. Initial rendered values `8, 7, 6, 7, 6, 6, 5, 9` remained unchanged.
  `/players/glenn-latomme/ranking/single` renders 12 native contrast badges at both widths.
  Both routes were checked in light and dark, eight route/theme/width combinations in total.
  Every measured badge label fit its Tag bounds; document horizontal overflow was zero in each combination.
- **Passed:** WCAG relative-luminance calculation from actual computed foreground/background colors converted to
  sRGB through a detached canvas. All native badge backgrounds were opaque. Minimum label contrast across both
  routes/widths: light **20.54:1**, dark **18.82:1**; both exceed the 4.5:1 threshold.
  No scoped inline styling or new focusable descendants were present.
- **Observed geometry:** small detail badges are 28x24.5px; ranking-table badges are 28x22px with existing
  table typography. Width remains 28px; native padding/radius replace historical scoped geometry.
  The unmounted default size is covered by the focused width-class test, not a live visual fixture.
- **Visual evidence:** shared Chrome player-detail before/after screenshots in light/dark were inspected;
  isolated Chrome narrow dark ranking-table screenshot was inspected. Screenshots remain ephemeral, not committed.
  Layout/contrast measurements cover the full matrix; user visual approval is still pending.
- **Consumer limits:** encounter-card and tournament draw-game call sites build unchanged, but no fresh populated
  visual examples were checked. The unused match-row remains untouched. Screen-reader use, alternate locales,
  full surrounding workflow/keyboard regressions, and SSR/hydration were not run. These are not visual passes.
- **Other states:** the badge has no loading/error/disabled/action state of its own; parent workflow states and
  permissions were not re-exercised. No administrative or data-changing browser actions were taken.
- **Reusable decision:** native contrast severity for neutral tier metadata in the existing shared badge.
  Historical DR-005a scoped-token decisions are superseded only for this component; its approval history is retained.
- New backlog discoveries: none. Known secondary-Tag inversion informed selection of native contrast severity,
  without changing shared theme behavior.
- The numerical passes above describe the rejected native attempt, not the current custom revision.

## Current revision evidence and handoff

- Changed scope: same shared badge TypeScript/template/spec and brief/backlog; no page/global changes.
- Exception: the explicitly user-approved semantic custom badge described above.
- **Passed, final content-sized revision:** all five changed files formatted with
  `npm exec prettier -- --write` before validation. With PowerShell `$env:NX_DAEMON='false'`,
  `npm exec nx run frontend-components:test -- --runInBand --testPathPatterns=tier-badge.component.spec.ts
--output-style=static` passed one suite and three tests (non-interactive semantic content, label/string level,
  and both font-size variants). Obsolete minimum-width assertions were removed at the user's direction.
- **Passed, final content-sized revision:** `npm exec nx run-many -- --targets=lint,build
--projects=frontend-components,frontend-pages-player,frontend-pages-tournament --output-style=static`.
  All six requested tasks and nine prerequisites passed; some outputs were cached. Existing lint warnings only,
  with no lint errors; the non-failing metadata/cache-copy warnings noted above remain.
- **Resolved blocker, 2026-11-21:** the minimum-width bindings disappeared from the template during validation, outside
  the recorded edits, while the focused spec still retained width-class assertions. Browser confirmed `min-width: 0px`.
  The user confirmed intentionally removing them; preserve content-sized widths and align tests/documentation.
- The earlier custom test/lint/build run passed before this discrepancy was found; it is not validation of the
  current template/spec pair. A browser theme-control timeout was inspected and the matrix rerun successfully.
  Current content-sized badges have no label clipping or document overflow at 390px/1440px on both player routes.
  Text contrast is at least 17.10:1 light / 11.98:1 dark after compositing translucent highlight fills over actual
  ancestor surfaces; border-to-fill contrast is at least 3.15:1 / 7.65:1. These passes do not resolve the size contract.
- **Final size contract:** the user's confirmed content-sized widths resolve that discrepancy. The observed small
  detail badge is approximately 23.84x23px; the ranking-table sample is 23.94x23px. No minimum width is imposed.
  Default typography is covered by the focused class-switch test; no production default-size consumer was invented.
- **Passed browser matrix:** custom player detail has 31 badges at 1440px and 15 at 390px; Singles ranking has
  12 at both widths. All eight light/dark/route/width combinations have zero label clipping, zero document overflow,
  and zero new focusable badge elements. Both text and border contrast results above exceed 4.5:1 and 3:1 respectively.
- **Visual evidence:** narrow light/dark ranking-table screenshots were inspected after the final reconciliation.
  The shared player-detail review tab remains available and updates with the application. No images/logs are committed.
- **Not verified:** screen-reader use, alternate locales, surrounding workflow regressions,
  SSR/hydration, and fresh populated encounter/tournament examples. These limits are not checked off by a build.
- **Completion approval, 2026-11-21:** `Approve DR-072 with the documented limits and commit`.
  This accepts the custom content-sized presentation and the explicitly recorded verification limits.
  Unperformed checks remain unchecked; approval does not establish them as passed.
- Next action: commit only DR-072 and this handoff. DR-006 parent reconciliation is the next candidate for a fresh
  invocation; no second implementation slice was started.

[component]: ../../../libs/frontend/components/tier-badge/src/tier-badge.component.ts
[template]: ../../../libs/frontend/components/tier-badge/src/tier-badge.component.html
[tests]: ../../../libs/frontend/components/tier-badge/src/tier-badge.component.spec.ts
