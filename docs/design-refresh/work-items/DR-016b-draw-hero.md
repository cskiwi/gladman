---
title: 'DR-016b: Competition draw hero identity and actions'
description: 'Native metadata Tags and external-link Button for the mounted competition draw hero.'
---

## Identity

- ID: DR-016b; parent DR-016.
- Status: authoritative in the [backlog](../backlog.md).
- Dependencies: agreed shared layout direction and DR-016a complete; no blocking dependencies.
- Design rules: [design refresh](../README.md).

## Scope

- Mounted route:
  `/competition/pbo-competitie-2026-2027/sub-events/8e8ba158-859c-48a7-92ca-f2c3ce805f4f/draws/78d42486-ab43-4484-9b68-a99e46bf96ae`.
- Consumer: [competition routes](../../../libs/frontend/pages/competition/src/lib.routes.ts) mount
  [PageDrawsComponent](../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.ts).
  Browser confirmed the populated route on 2026-10-28, with 72 encounters and nine standings.
- Nx project: `frontend-pages-competition`.
- Only the hero identity and actions in
  [the template](../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.html).
- Preserve avatar, draw heading/fallback, sub-event name, optional metadata conditions, external destination,
  new-tab safety, action order, and SyncButton configuration/permissions.
- Exclude statistics, section headings, standings, qualification, encounters, loading/error presentation,
  SEO, services, shared components, theme, translations, and backend changes.

## Baseline and approach

- Worktree was clean before selection.
- Identity/action markup has nine literal class attributes, 57 tokens, and 24 unique tokens.
  Custom mono chips duplicate native Tag presentation; the sub-event uses an uppercase eyebrow.
- Replace chips with native secondary Tags. Use the existing localized `all.competition.size` label.
- Use a normal semantic secondary-text sub-event label and preserve the existing shared hero composition.
- Replace the custom external anchor appearance with native secondary text Button, named for its draw.
  Reuse the approved competition-detail external-link keyboard focus treatment without `[pt]` or `[dt]`.
- No new wrappers, SCSS, palette colors, or shared abstractions.
- Baseline screenshot: `tmp/design-refresh/DR-016b-before-dark-wide.png` (local uncommitted evidence).
- Baseline page: 158 ordered links and nine standing rows; statistics 72 encounters / 20 played / 52 upcoming / 9 teams.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, and bounded scope.
- [x] Preserve identity, metadata visibility, destinations, and sync behavior.
- [x] Use native Tag/Button options and remove only in-scope custom styling.
- [x] Keep shared components and adjacent content unchanged.
- [x] Record parent remainder and handoff in the backlog.

## Acceptance and verification

- [x] Native secondary Tags/Button; no new SCSS, inline styles, numbered palettes, or component token overrides.
- [x] Utility comparison recorded with reasons for remaining classes.
- [x] Component coverage for optional metadata, named/fallback heading, external visibility/URL/safety, and sync config.
- [x] Mounted light/dark at 390px/1280px preserve hero information and page fit.
- [x] Keyboard focus, accessible external name, safe intercepted activation, and normal-state contrast checked.
- [x] All ordered page links, standing rows, and excluded statistics match baseline.
- [x] Relevant Nx tests/lint/build pass after formatting.
- [x] Existing locale labels and populated SSR checked.
- [ ] Actual screen-reader output, operational missing-metadata records, sync execution/permission-role workflows,
      exhaustive hydration, and every hover/active state.
- [x] User visual review or explicit completion approval with disclosed limits.

## Evidence and handoff

- Changed scope: this brief, backlog, and `page-draws.component.{html,ts,spec.ts}` only.
  The existing component stylesheet and every shared component remain unchanged.
- Utility comparison: nine to five literal class attributes, 57 to 17 tokens, 24 to 13 unique tokens.
  Remaining classes cover secondary sub-event typography, metadata/action wrapping, the external icon,
  and the previously approved no-underline/keyboard-focus behavior.
- Native secondary Tags preserve the four optional metadata conditions and their order. Size now uses the existing
  translation key: `Size`, `Grootte`, and `Taille`; no translation assets or backend code were changed.
  The existing unnamed-draw heading fallback is deliberately unchanged, and the external name matches it.
- Validation commands:

  ```powershell
  npm exec -- prettier --write --end-of-line lf `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.component.ts" `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.component.html" `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.component.spec.ts" `
    "docs\design-refresh\backlog.md" "docs\design-refresh\work-items\DR-016b-draw-hero.md"
  npx nx run-many -t test,lint -p frontend-pages-competition --output-style=static
  npx nx run app:build --output-style=static
  git diff --check
  ```

- Tests: 74/74 pass across three suites, including 11 new hero cases.
  Lint: pass with 41 pre-existing warnings; no new warnings.
  App build and all 29 prerequisites: pass. Existing executor deprecation/TypeScript metadata advisories remain.
  Repository-wide tests were not run.
  After approval, `npx nx run-many --target=lint --output-style=static` passes across all 34 projects,
  with existing warnings and no errors.
- The initial test run had one incorrect ButtonDirective assertion: `componentInstance` returns the owning component,
  not the directive. The corrected test obtains the directive from the element injector and reads its input signals.
  Six new non-null assertion warnings were removed using an explicit throwing test guard.
- Browser baseline/final comparison: all 158 ordered link text/destination records are identical.
  Nine standings and all numeric cells match the recorded DR-016a baseline.
  Excluded statistics remain exactly 72 encounters / 20 played / 52 upcoming / 9 teams.
  The initial in-page baseline object was cleared by live reload; the full saved pre-edit link output was used instead.
- Light/dark at 1280px: document/client widths 1265/1265, hero width 1223px.
  At 390px: document/client widths 375/375, hero width 347px; action controls wrap below identity.
  All four after screenshots were inspected:
  `tmp/design-refresh/DR-016b-after-{light,dark}-{390,1280}.png` (local uncommitted evidence).
- Mounted English, Dutch, and French reloads show the real localized size/level labels.
  Initial immediate post-reload geometry sampled transient widths of 378px/390px in Dutch/French.
  After awaiting fonts and layout settlement, all three narrow locales measure 375/375 with no page overflow.
  The standings retain intentional contained table scrolling; no styling change was needed.
  Original language cookie and 1280px viewport were restored.
- Keyboard Shift+Tab/Tab reaches the external anchor in all four theme/width cases.
  After transitions settle, the semantic 2px primary focus ring is visible.
  Enter activation was intercepted with `preventDefault`; no external navigation or operational mutation was performed.
  The accessibility snapshot exposes one H1, all metadata, and the draw-specific external-link name.
- Composited sRGB normal-state contrast: sub-event/external text 4.87:1 light / 6.65:1 dark;
  heading 19.87:1 / 16.00:1; Tags 7.74:1 / 9.51:1; focus ring 3.65:1 / 10.22:1.
- All three localized populated SSR requests return HTTP 200 and include the named anchor/native Tags.
  Hydrated browser rendering and locale reloads work; console inspection reports zero errors.
  This does not establish exhaustive hydration or actual screen-reader behavior.
- Reusable pattern: reuse competition-detail native external Button and secondary metadata Tags.
- Exceptions: no new styling exception. Reused `focus-visible:outline-none!` and `focus-visible:ring-2!` replace
  the native unlayered outline/ring only for keyboard focus, as approved in DR-015e; `focus-visible:ring-primary`
  supplies its semantic color. No `[pt]`, `[dt]`, inline styles, or new stylesheet rules.
- Visual review: four screenshots inspected by the implementing assistant.
  On 2026-10-28, the user selected "Approve completion and commit with the recorded verification limits".
  This authorizes completion and the scoped implementation/tests/handoff commit, not a push.
  The unchecked limits above remain unverified; approval is not evidence that these checks passed.
- Exact next action after the scoped commit: scope a separate DR-016 draw-statistics child on the recorded mounted
  route, confirm its current consumer, and create its brief before editing. Do not restart DR-016b.
- Remaining parent work: statistics, section chrome, loading/error presentation, and encounters need separate children.
  Qualification still needs a confirmed mounted consumer. Do not select any of these in this invocation.
