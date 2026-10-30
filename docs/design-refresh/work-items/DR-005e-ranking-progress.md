---
title: 'DR-005e: Shared ranking progress'
description: 'Refresh the ranking progress strip used on the homepage and player detail page.'
---

## Identity

- ID: DR-005e.
- Area and intended outcome: readable, theme-aware ranking levels and promotion/relegation points.
- Owner: GitHub Copilot.
- Status: see the authoritative [backlog](../backlog.md).
- Parent: DR-005, which stays open. Dependencies: DR-001 and DR-004 are Done. No known blocker at selection.
- Design rules: [design refresh](../README.md).

## Scope

- Shared [component](../../../libs/frontend/components/player-ranking-progress/src/player-ranking-progress.component.ts),
  its template, local stylesheet, and existing spec. Project: `frontend-components`.
- Existing consumers: [homepage](../../../libs/frontend/pages/home/src/pages/home/page-home.component.html)
  authenticated ranking content and [player detail](../../../libs/frontend/pages/player/src/pages/detail/page-detail.component.html)
  at `/players/:playerId`. Do not introduce verification-only consumers.
- Preserve query/system selection, threshold arithmetic and precedence, discipline links, translated copy,
  hidden/no-data behavior, and the three projected extension slots.
- Exclude page redesign, fetching changes, global theme/tokens, other shared components, and dependency changes.

## Baseline and proposed approach

- The worktree was clean at selection on 2026-10-17. Both production consumers import this component directly.
- Baseline template uses `t-eyebrow`/`t-mono`, 60px gradient rank text on a non-native clickable span,
  10px/11px detail text, and paired green/red light/dark palette utilities.
- Local SCSS contains only `.rank-number` gradient clipping. Remove it with its only local reference.
- Use real anchors for existing links; use native PrimeNG Tag success/danger for directional points and level limits.
  Final review revision uses native Button directive large outlined secondary links beside discipline names, a row
  of point tags, and no visible points label. Retain the responsive grid and necessary wrapping/spacing utilities.
- Hypothesis: presentation-only replacement preserves all calculated values and content while making the
  existing navigation keyboard-accessible. Focused threshold and DOM tests can disconfirm it.
- Baseline browser: mounted player strip at 1487x1252, dark; levels and point values were recorded before editing
  and matched afterward. The before screenshot timed out waiting for element stability; no before pixel pass.
- Final utility comparison: removed all ten paired green/red palette class tokens, all `t-eyebrow`/`t-mono`
  dependencies, arbitrary font sizes, custom font-family, gradient class, and its seven-line stylesheet.
  Kept layout/grid/spacing/tabular utilities; added wrapping, semantic text, screen-reader labels, and non-underlined
  minimum-width level links. Native Buttons now supply focus styling. No numerical class reduction is claimed; a script
  failed in the Windows shell. Native Tags own the status appearance; no new styling layer was introduced.

## Implementation checklist

- [x] Confirm dependencies and one independently reviewable shared component with real consumers.
- [x] Preserve calculations, inputs, translations, and projected content.
- [x] Use native PrimeNG options and remove only the component's obsolete SCSS.
- [x] Check both shared consumers without global/page changes.
- [x] Record out-of-scope discoveries and reusable decisions.

## Acceptance and verification

- [x] Three disciplines retain levels, points, threshold messages, and extension slots.
- [x] Existing relative destinations are preserved; named native links receive visible keyboard focus.
- [x] Native severities replace directional palette classes; no new custom styling or color exceptions.
- [x] Light/dark at 390px/1280px preserve readable content without component overflow.
- [x] Contrast, keyboard/focus, available interaction states, and both mounted consumers are checked.
- [x] Hidden/loading/empty/error and boundary-level behavior are covered by focused tests.
- [x] Relevant SSR/hydration and localization are checked, or limits explicitly recorded.
- [x] Smallest relevant Nx tests, lint, and build pass with commands recorded below.
- [x] User visual review passes before marking Done.

## Evidence and handoff

### Automated checks on 2026-10-17

All commands ran from the workspace root. The first two new presentation checks failed against the old template
as intended while the original threshold test passed; the final expanded suite passes.

```bash
NX_DAEMON=false npm exec nx run frontend-components:test -- --runInBand --testPathPatterns=player-ranking-progress.component.spec.ts --output-style=static
NX_DAEMON=false npm exec nx run frontend-pages-home:test -- --runInBand --testPathPatterns=page-home.component.spec.ts --output-style=static
NX_DAEMON=false npm exec nx run frontend-components:lint -- --output-style=static
NX_DAEMON=false npm exec nx run frontend-components:build -- --output-style=static
git diff --check
```

- Component tests: **9 passed**. Threshold precedence, semantic tags and values, names/destinations, three projection
  slots, zero/top/floor/missing downgrade points, missing player/system, empty/error responses, and loading covered.
- Homepage tests: **12 passed**, including authenticated projection and anonymous absence.
- Lint: **passed**, zero errors, 32 existing warnings outside this component. No source lint autofix was run.
- Build: **passed**, shared Angular package and eight dependency tasks; eight dependencies used Nx cache.
- Diff whitespace check: **passed** before the final documentation handoff, rerun afterward.
- Editor diagnostics: no template/spec errors. Existing union-type-alias advisory in unchanged calculation types
  remains out of scope. Nx executor deprecations and ts-jest metadata warnings remain unchanged.
- No whole-library test run or application production build was required for this bounded package/template change.

### Initial browser checks

These describe the first presentation before user visual feedback. Final typography, focus treatment, and screenshots
are superseded by the review revision below; data/route findings and coverage limits remain applicable.

- Existing server: `http://localhost:3000`. Used the user-shared player page and the existing homepage only.
- Mounted player strip: all four 390px/1280px light/dark cases passed component containment and no local overflow.
  It retained the same three levels, six point displays, and threshold messages as the baseline.
- Homepage: anonymous strip absence confirmed. A disposable browser-memory override of `PageHomeComponent.user`
  and its Apollo ranking-progress response mounted the existing authenticated branch with synthetic top/floor/zero
  data. No account, storage, backend, or production-source mutation was made. All four cases passed containment.
- Both consumers: ordinary text/native tags measured at least **4.57:1** contrast in light and **6.65:1** in dark.
  Large 26.25px rank links measured **3.65:1** light and **10.22:1** dark, passing large-text contrast.
  Colors were settled before measuring, converted through canvas, and composited over ancestor backgrounds.
- Focus: first link was active and `:focus-visible`, with a solid 1px semantic outline. Tab reached doubles with
  a visible outline. Enter on singles opened the existing player ranking-breakdown route successfully.
- Existing Dutch promotion/relegation translations supply screen-reader-only direction labels; anchors are named
  by discipline and level. No translation files changed. Other locales and an actual assistive-technology session
  were not run; no full screen-reader certification is claimed.
- Player SSR fetch: **HTTP 200**, ranking-progress host with three anchors and six tags, plus hydration markers.
  The client-mounted component was checked again after navigation. Authenticated homepage SSR and exhaustive
  hydration-diagnostic testing were not run; the homepage fixture is client-only.
- Actual screenshots inspected: mounted dark desktop player strip, mounted light mobile player strip, and safe
  synthetic homepage dark desktop strip. All showed the expected current theme/layout rather than stale frames.
  No sensitive screenshots or logs are committed. Four-case geometry/contrast evidence is not four screenshot passes.
- Navigation emitted an `InvalidStateError` view-transition console message while pages loaded successfully.
  Record for route/shell follow-up; no transition or global theme behavior was changed.
- Fixture cleanup verified: original Apollo method and homepage user reference restored, fixture global removed,
  anonymous homepage strip absent. Returned to the original player route, dark class, and **1487x1252** viewport.

### Review revision on 2026-10-17

- The user rejected the initial bare large underlined level and asked to remove the visible word `Punten`.
  A compact native outlined button-link beside each discipline and horizontally grouped point tags replaced it.
  The user said this was already much better, requesting only larger numbers with no underline afterward.
- Final level links use the documented `pButton` router-anchor pattern, `size="large"`, outlined secondary severity,
  `min-w-12`, `tabular-nums`, and `no-underline`. No tier-badge changes or new styling exceptions were introduced.
- Final computed level font: **15.75px**, up from **12.25px** in the interim button revision. Native link height:
  **42px**. One-digit width: **42px**; two-digit width: **46.92px**. Text decoration: **none** in every case.
- Repeated component suite: **9 passed**, including native large button classes, names/destinations, no underline,
  no points label, thresholds, projection, boundaries, and hidden states. Shared lint/build repeated and passed
  with the same unrelated warnings. The homepage's **12 passing tests** remain applicable; its source is unchanged.
- Final player layout: all four 390px/1280px light/dark cases pass containment and no local overflow. Link contrast
  is **4.87:1 light**, **6.65:1 dark**, passing normal-size text requirements. Other text/tag minimums remain
  **4.57:1 light**, **6.65:1 dark**. The `Punten` label is absent throughout.
- Final homepage authenticated-branch fixture repeated all four cases with top/floor/zero and two-digit level data:
  all pass containment, no overflow, larger native links, no underline, and no visible points label.
  This is still a browser-memory fixture, not a real authentication or authenticated SSR check.
- Final player SSR fetch: **HTTP 200**, all three large native links carry `no-underline`, points label absent.
  Final light mobile link is active, `:focus-visible`, with a native solid outline. Earlier successful Tab/Enter
  navigation evidence still applies to the unchanged anchor destinations.
- Inspected final **dark desktop** and **light mobile** screenshots after the size/underline change. Both show the
  correct revised layout and theme. Initial screenshots are historical, not evidence of the final presentation.
- Homepage user/Apollo overrides were removed immediately; anonymous absence was reconfirmed. Original player
  route, dark class, and 1487x1252 viewport are restored before handoff.
- Final user visual approval received on 2026-10-17: "Approve finish commit". This approves the final larger,
  non-underlined treatment and completion with the recorded verification limits. The backlog is Done.

### Discoveries and next action

- User visual review: **approved** on 2026-10-17 after the final desktop/mobile pass. Backlog status is Done.
  The user explicitly requested a commit of the completed slice; no additional implementation slice was started.
- Existing homepage links resolve to `/ranking/*`, but the root router has no such feature route. Player-route
  destinations and keyboard activation pass. This pre-existing destination issue is recorded under DR-008/DR-002
  in the backlog; fixing routes or adding a player input was excluded from this presentation slice.
- Reusable decision: native success/danger tags can show directional point totals and thresholds, with translated
  screen-reader direction labels. Use native button-styled anchors beside discipline names for rank navigation.
- Exceptions: **none**. Global legacy gradient tokens remain for other consumers. No dependencies or page layouts changed.
- Next candidate: scope a DR-006 child around the player route's existing recent-games presentation;
  inventory consumers first and do not migrate all games views together. DR-005 remains open.