---
title: 'DR-015e: Competition hero external link'
description: 'Native PrimeNG presentation for the mounted competition hero external destination.'
---

## Identity

- ID: DR-015e; parent DR-015. Authoritative status: [backlog](../backlog.md).
- Dependencies: completed DR-015b and DR-015d.
- Design rules: [design refresh](../README.md).
- Mounted consumer: `/competition/pbo-competitie-2026-2027`, confirmed on 2026-10-28.
- Nx project: `frontend-pages-competition`; consuming application: `app`.
- Sources: [template][template], [tests][tests], [feature routes][routes].

## Scope

- Refresh only the competition hero's toernooi.nl anchor using native PrimeNG Button styling.
- Preserve the visual-code visibility condition, exact destination, new-tab behavior, safe rel attributes,
  visible domain label, action ordering, and existing wrapping action row.
- Give the link a competition-specific accessible name containing its visible domain label.
- User-requested review correction: remove underlining from all 27 mounted toernooi.nl anchors on this page,
  including draw icons; remove the hero outline while retaining an accessible keyboard-only focus ring.
- Exclude edit/sync controls, permissions, shared hero, statistics, sub-events, translations, services,
  global styles, backend, and other routes. No dependencies or operational mutations.

## Baseline and proposed approach

- The mounted hero has the external anchor followed by sync status and sync controls; edit is permission-gated.
- The anchor has 12 custom utility tokens and a three-token icon, including manual hover styling.
  Its English title is hard-coded. The action row already wraps.
- Use `a pButton`, secondary severity, text variant, small size, `pButtonIcon` and `pButtonLabel`.
  Reuse ButtonModule and the adjacent draw-link pattern; add no wrapper, component, or CSS.
- PrimeNG Button Link documentation confirms native anchor support, including target and safe rel attributes.
- Native defaults measured 4.46:1 active text in light mode and 1.40:1 focus ring in dark mode.
  A local token override was initially implemented, but removed at the user's explicit request on 2026-10-28.
  Do not use `[dt]` for this slice. No substitute CSS, inline styles, or global theme change was introduced. A subsequent user request removes
  underlining across this page and replaces the hero outline with a semantic keyboard-only ring, described below.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, and bounded scope.
- [x] Preserve visibility, destinations, ordering, permissions, and translations.
- [x] Use native PrimeNG styling without custom styles or shared changes.
- [x] Add focused link/permission regression tests.
- [x] Record validation, evidence, and remaining review.

## Acceptance and verification

- [x] Native secondary text Button styles the real anchor without overriding link semantics.
- [x] Present/absent visual-code, edit permission, and accessible-name behavior have component coverage.
- [x] Destination, new-tab behavior, safe rel attributes, and action ordering remain unchanged.
- [x] Light/dark at 390px/1280px fit with no document or action-row overflow.
- [x] Keyboard access and safe Enter activation retain native link behavior.
- [x] All 27 mounted external anchors have no underline; hero has no outline/resting border or ring.
- [x] Hero keyboard-only focus ring passes contrast in light/dark at both widths.
- [ ] All interaction-state text contrast passes: native light active text remains 4.46:1, below 4.5:1.
- [x] No new colors, numbered palette utilities, SCSS, inline styles, dependencies, or shared/global changes.
- [x] Relevant Nx test/lint/build checks pass.
- [x] SSR markup is verified; mounted hydration/locale limits are recorded honestly.
- [ ] Mounted alternate locale, authenticated edit interaction, live missing-code data, exhaustive hydration,
      screen-reader output, and operational sync workflows.
- [x] User approved completion and scoped commit on 2026-10-28 with disclosed limits.

## Evidence and handoff

- Changed scope: hero anchor, user-requested `no-underline` on draw external anchors,
  five added component cases, and this handoff.
  No application TypeScript, services, translation files, shared components, or global tokens changed.
- Utility comparison: hero anchor utilities drop from 12 to four; the icon loses `text-xs`, retaining only its
  two PrimeIcon classes. Existing action-row utilities and edit/sync controls are unchanged.
  Native Button styling supplies layout, size, padding, hover/active states, and focus geometry.
  Draw external anchors gain one `no-underline` utility, retaining `shrink-0`.
- Five new cases bring the suite from 19 to 24 tests. They cover native classes, safe destination/target/rel,
  a competition-specific accessible name and its update, hidden icon semantics, absence of local `dt`,
  action ordering, edit permission/route, and null/undefined/empty visual codes.
  Existing loading/error, groups, draw-link, metadata, and translated-label regressions still pass.
- Missing-code tests replace only the existing throwing sync-status selector with a null signal.
  They test anchor visibility, not the unrelated missing-code sync validation contract or a working live route.
- Commands on 2026-10-28:

  ```powershell
  npm exec -- prettier --write "libs\frontend\pages\competition\src\pages\detail\page-detail.component.html" `
    "libs\frontend\pages\competition\src\pages\detail\page-detail.component.spec.ts" `
    "docs\design-refresh\work-items\DR-015e-competition-hero-link.md" "docs\design-refresh\backlog.md"
  $env:NX_DAEMON='false'
  npm exec -- nx run-many -t test,lint -p frontend-pages-competition --output-style=static
  npm exec -- nx run app:build --output-style=static
  git diff --check
  ```

- Final application validation passes: 24/24 tests, lint with 41 existing warnings and zero errors,
  app build with all 29 prerequisites. Existing Nx executor deprecation and decorator-metadata advisories remain.
  Whitespace check passes; Git reports existing checkout line-ending conversion warnings.
- Mounted before/after comparison: all 55 ordered page anchor destinations, complete normalized hero text,
  and hero action element order are identical. Edit is not available in the mounted anonymous session;
  its permitted route and ordering have component coverage. No sync control was activated.
- Local evidence:
  `tmp/design-refresh/DR-015e-before-{light,dark}-{390,1280}.png` and corresponding `after` files,
  plus `tmp/design-refresh/DR-015e-after-dark-1280-focus.png`.
  All five `after` screenshots were inspected before the user's no-`dt` correction; they are historical evidence of
  the overridden version, not final evidence after removal. Images are local only, not staged or committed.
  Final corrected evidence uses `DR-015e-final-{light,dark}-{390,1280}.png` and
  `DR-015e-final-dark-1280-focus.png` in the same local directory.
  Final light mobile/desktop, dark mobile, and dark desktop focus screenshots were inspected.
- Four-case geometry: link and action row fit within the hero; no horizontal document overflow at either width.
  The native link target is approximately 102 by 28 CSS pixels, replacing the baseline 84 by 21 target.
- Contrast uses Canvas conversion of computed CSS colors to sRGB and composited ancestor backgrounds.
  After removing `[dt]`, normal/hover/active text ratios are 4.87/4.66/4.46 in light
  and 6.65/6.28/5.73 in dark. Native focus rings measure 8.46:1 light / 1.40:1 dark.
  Light active text fails 4.5:1. The native dark outline failed 3:1, but is no longer used on the hero:
  the final semantic primary ring measures 3.65:1 light / 10.22:1 dark.
  Four-case browser geometry/contrast was rerun after removal; there is no horizontal document overflow,
  and keyboard focus-visible remains present. SSR HTML returns HTTP 200 with correct label and destination.
  The 24 tests, lint with 41 existing warnings, and consuming app build with 29 prerequisites also pass again.
- Keyboard: Tab from the link reaches the existing full-sync button; Shift+Tab returns to the link.
  Focus-visible is present in all four cases. Enter dispatches the native anchor click in all four cases;
  a one-shot browser-only listener prevents navigation and is removed after checking activation.
- SSR: same-origin HTML fetch returns HTTP 200 with native Button classes, correct accessible name,
  destination, target, rel, and all 55 ordered page links matching the baseline.
  The mounted page also renders the final implementation; this is not exhaustive hydration validation.
- The visible domain name is locale-neutral; the accessible name uses the current competition name.
  No new English title or translation key remains. Mounted alternate-locale switching was not run.
- Final browser checks: all 27 external anchors compute `text-decoration-line: none`; hero outline style is
  `none` in normal and keyboard focus states, with no resting shadow. Keyboard focus displays a 2px ring.
  All four theme/width cases fit with no document overflow, and all page destinations remain unchanged.
  Final tests (24), lint (41 existing warnings), and app build (29 prerequisites) pass again.
- Isolation: neighboring controls retain their original theme tokens. No `dt` or global correction remains.
- Original dark theme and 1515x1249 viewport restored; temporary browser comparison session storage removed.
- Reusable pattern: native secondary text anchor Buttons retain true link semantics; no `[dt]` for this slice.
- Styling exception: hero keyboard focus uses `focus-visible:outline-none!`, `focus-visible:ring-2!`, and
  semantic `focus-visible:ring-primary`. The user requested no outline and no `[dt]`; native Button options
  cannot replace just the outline with a ring. Ordinary layered utilities were tested but lost to the
  component's unlayered outline/box-shadow declarations, so only those two state-scoped utilities are important.
  No CSS file, inline styles, authored colors, or shared change is introduced. Remove this exception when
  native component focus options or a separately approved shared cascade/theme correction meets the requirement.
  Theme/viewport geometry, screenshots, and measured ring contrast are recorded above.
- Discovered existing secondary token contrast and missing-code sync behavior are recorded in the backlog.
- Approval history: user selected "Approve completion and commit", then requested "don't use [dt]" before
  any commit. The requested removal is complete; previously reported passing contrast no longer applies.
  Do not assume the earlier approval accepted these newly disclosed failures.
- Subsequent user request: "Don't make the button have a outline, and make the icons to toernooi.nl not
  underlined (on the full page)". This is applied only to the mounted competition page; no second route started.
- Final approval on 2026-10-28: user selected "Approve completion and commit", with "Nothing else".
  Approval followed the outline/underline corrections and explicit disclosure of light active-text contrast
  at 4.46:1. Accepted limits also include mounted alternate locale, authenticated edit interaction,
  live missing-code data, exhaustive hydration, screen-reader output, and operational sync workflows.
  Failed or unchecked criteria remain so; approval does not claim that they passed.
  The scoped implementation/tests/handoff commit is authorized; no push is authorized.
- Exact next action for a fresh invocation: inspect and scope remaining competition hero statistics
  presentation/localization, confirming mounted consumers and preserving behavior; do not start it here.
- Parent DR-015 stays open. No second implementation slice was started.

[template]: ../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.html
[tests]: ../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.spec.ts
[routes]: ../../../libs/frontend/pages/competition/src/lib.routes.ts
