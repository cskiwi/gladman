---
title: 'DR-005c: Sparkline'
description: 'Preserve the compact bar visualization using PrimeNG semantic theme colors without local SCSS.'
---

## Identity and outcome

- ID: DR-005c; authoritative status in the [backlog](../backlog.md).
- Parent: DR-005. Dependencies: none. Project: `frontend-components`.
- Rules: [design refresh plan](../README.md).
- Outcome: preserve the compact, ordered bar visualization while removing legacy result colors and local SCSS.

## Scope

- [Component](../../../libs/frontend/components/sparkline/src/sparkline.component.ts),
  [template](../../../libs/frontend/components/sparkline/src/sparkline.component.html), and focused rendering tests.
- Preserve `app-sparkline`, required `bars: SparkBar[]`, percentage heights, result order, and optional win/loss status.
- Source search in `apps` and `libs` found only the sparkline's own exports and an unused player-service comment,
  not a production import or template caller. Do not add a production caller for verification.
- Exclude player-page design, other shared components, global theme/tokens, dependencies, routes, and backend data.

## Baseline and proposed approach

- Worktree clean before selection on 2026-10-17. Baseline is source evidence because there is no mounted consumer.
- Existing template: seven layout/visual utility tokens across a 24px flex row and 3px bars, plus three custom
  `g-spark-bar` classes and a 12-line stylesheet mapping neutral/win/loss to muted and legacy result tokens.
- Hypothesis: native SVG geometry and PrimeNG Tag success/danger text tokens retain percentage height and result
  meaning without SCSS or hard-coded colors. Focused Angular rendering tests can falsify geometry/status mapping.
- Tag variables are injected lazily. Semantic primary/text fallbacks keep win/loss bars visible when those variables
  are absent; translated result names in the title preserve meaning independently of color. Green/red styling is
  intentionally not guaranteed without Tag variables. No hidden Tag instance or new theme token is added.
- Keep the existing bar visualization rather than turn it into a progress control or table. PrimeNG Chart and
  Chart.js are installed, but a canvas/chart engine is unnecessary for this passive miniature with no axes or controls.
- SVG presentation attributes are chart geometry/color, not an inline CSS substitute. Use existing semantic tokens;
  no new theme tokens, stylesheet, global rule, dependency, or arbitrary palette is needed.
- Preserve 24px height, 3px bars, 2px gaps; constrain the graphic to available width for long sequences.
- Empty input stays visually empty and has no unnamed graphic. Expose numeric height and optional status through
  the native SVG title, reusing existing won/lost translations and reacting to language changes.

## Implementation checklist

- [x] Confirm input API, consumers, baseline, and resolved Nx targets.
- [x] Preserve bar geometry/order/status and input updates with focused rendering tests.
- [x] Remove only the sparkline's local SCSS; leave global legacy tokens for other consumers.
- [x] Check isolated theme/viewport behavior and record the lack of routed consumers.
- [x] Record checks, limitations, review, and next action in the backlog.

## Acceptance and verification

- [x] Ordered/repeated bars, percentage heights, optional status, empty input, and input updates pass focused tests.
- [x] Existing PrimeNG semantic tokens replace legacy colors; no new CSS or palette utilities.
- [x] Light/dark at 390px and 1280px: geometry, long sequences, and bar contrast checked on synthetic data.
- [x] Noninteractive graphic semantics expose values/status without adding keyboard stops.
- [x] Relevant Nx test/lint/build pass with exact commands recorded.
- [x] User explicitly accepts completion with screenshot and consumer/SSR coverage limits disclosed.

## Evidence and handoff

- Before evidence: source inspection above; no before screenshot of a production consumer is available.
- Baseline routing: `git status --short` was empty. `rg` is unavailable in the bash terminal; workspace search used.
- Resolved targets: `NX_DAEMON=false npm exec nx show project frontend-components -- --json`.
  Targets use `@nx/jest:jest`, `@nx/eslint:lint`, and `@nx/angular:package`.
- Changed scope: component/template, new
  [focused tests](../../../libs/frontend/components/sparkline/src/sparkline.component.spec.ts), and deletion of its
  12-line SCSS. The `SparkBar` model and required input remain unchanged. `TranslateService` is now used for the
  accessible title; callers need the application's existing translation provider. No package dependency changed.
- Utility comparison: seven layout/visual utility tokens and three bespoke classes become one `max-w-full` utility.
  SVG attributes describe chart geometry and token-based fills; there are no component styles or inline CSS rules.
  Short sequences retain 3px bars, 2px gaps, and a 24px chart height. Long sequences compress horizontally rather
  than overflowing; percentage heights are retained. Empty input now emits no SVG rather than a blank 24px row.
- **Initially failed, then fixed:** the first focused run failed all five tests because Angular control-flow blocks
  inside SVG `title` were parsed as text. A computed translated description replaced that markup. The next run
  passed five tests; after adding semantic fallbacks and long-sequence coverage the final run passed six.
- **Passed:** `NX_DAEMON=false npm exec nx run frontend-components:test --
  --runInBand --testPathPatterns=sparkline.component.spec.ts --output-style=static`.
  Six tests cover order/repetition, 0/25/50/100% and fractional heights, native tokens/fallbacks, empty/updated input,
  100-bar geometry, noninteractive semantics, and English/Dutch language updates.
- **Passed twice:** `NX_DAEMON=false npm exec nx run-many -- --targets=lint,build
  --projects=frontend-components --output-style=static`. Final run used `| tail -22` to limit terminal output.
  All 10 tasks passed, eight from cache. The initial lint log reported 32 existing unrelated warnings and zero errors;
  final lint/build also passed, including the sparkline package entry point.
- **Passed:** final editor diagnostics for TypeScript/template/spec report no errors; `git diff --check` passes.
- Installed PrimeNG 22 and Aura token inspection confirmed `tag.success.color` and `tag.danger.color` paths, and
  the lack of an automatic CSS-variable fallback. The explicit fallbacks use primary/text semantic variables.
- Browser checks used the existing integrated player tab at `http://localhost:3000/players/glenn-latomme`.
  A temporary browser-only preview reproduced the old bars and the new SVG using synthetic heights 100/50/25/75/100
  and win/loss/neutral results, plus a 100-bar stress sequence. It was static DOM, **not a mounted Angular consumer**.
  Actual Angular rendering, signal changes, and translation changes are covered separately by the tests.
- Four cases passed: 390px/1280px, light/dark. Final preview charts measured 23x24px for five bars and 298x24px
  (390px viewport) / 498x24px (1280px viewport) for 100 bars. The 100/50/25% bars remained 24/12/6px high.
  The preview stayed inside the viewport; graphics added no tab stops. The accessibility snapshot exposed an image
  with ordered heights and status values. The synthetic title used raw status data; localized titles were unit-tested.
- Settled computed bar/background contrast, win/loss/neutral: light 5.02/6.47/4.87:1; dark 13.61/10.07/6.65:1.
  With Tag variables disabled locally in the preview: light 3.65/19.87/4.87:1; dark 10.22/16.00/6.65:1.
  All exceed 3:1 for graphic marks. Measurements used a native content surface, finite animations finished,
  OKLCH conversion through canvas, and alpha compositing; they do not establish screenshot-pixel contrast.
- **Not verified:** both screenshot attempts captured the underlying page rather than the preview (native dialog
  and fixed DOM overlay). The tab reported hidden visibility. No usable before/after visual capture or user visual
  approval is claimed, and no screenshots or personal page data were committed. Do not mark this slice Done from
  geometry/build results alone. The user subsequently explicitly accepted completion with this limit retained;
  this is approval of the disclosed coverage limits, not a successful screenshot or mounted-consumer visual pass.
- Cleanup confirmed: temporary previews and saved browser fixture state removed; original player URL and dark class
  preserved. The browser initially had no Playwright viewport override; after testing, 1487x1252 was set from the
  previously documented handoff size, not an independently measured initial size. No preference, account, backend,
  operational state, route, dependency, or global theme setting was changed.
- Not available: live routed consumer and routed SSR/hydration verification; do not claim them from isolated markup.
- This display-only component has no loading, error, success notifications, permissions, controls, or disabled state.
  Its empty state is an empty graphic; win/loss are data states covered by rendering checks.
- Exceptions: no application styling exception. SVG is the retained miniature visualization, not a replacement
  UI primitive; preview-only inline styles were removed with the fixture. No global styling or consumer changed.
- Review outcome: on 2026-10-17, after the Review status, passing checks, missing production caller/SSR coverage,
  and unsuccessful preview screenshots were disclosed, the user requested: "Mark as done and commit".
  Completion is accepted with those limitations retained; no unresolved technical finding is claimed fixed by approval.
- Remaining DR-005c action: none; completion approved by the user. No production caller should be invented for coverage.
- Next invocation: scope one remaining DR-005 child, with stat-card the next candidate. Inspect its consumers and
  create its brief before implementation. Keep DR-005 open; no other child has been started in this invocation.