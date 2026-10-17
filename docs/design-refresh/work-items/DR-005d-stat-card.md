---
title: 'DR-005d: Stat card'
description: 'Use native PrimeNG card and delta severities while preserving the shared statistic contract.'
---

## Identity and scope

- ID: DR-005d; authoritative status in the [backlog](../backlog.md). Parent: DR-005.
- Dependencies: completed DR-001 theme baseline. Rules: [design refresh plan](../README.md).
- Project: `frontend-components`. No production caller found by source search across `apps` and `libs`.
- Source: [component](../../../libs/frontend/components/stat-card/src/stat-card.component.ts),
  [template](../../../libs/frontend/components/stat-card/src/stat-card.component.html), and focused tests.
- Preserve selector, required string label/string-or-number value, optional delta/direction, and content projection.
- Exclude ranking progress, feature pages, global tokens/theme, routes, dependencies, and backend data.
- Leave pre-existing untracked `2026-10-14_render.sql` untouched. No commits requested.

## Baseline and approach

- Source baseline on 2026-10-17: custom `bg-emphasis` surface with border, rounded-xl and padding; `t-eyebrow`
  label, `t-stat-lg` value, and `g-stat-delta` stylesheet mapping up/down to legacy win/loss tokens.
- Template has 11 utility tokens plus three bespoke classes; SCSS has 11 lines. No mounted before view exists.
- Hypothesis: native Card content and Tag success/danger/secondary severities preserve the public rendering
  contract without local styles. Tests for zero, string values, all delta directions, empty delta, updates,
  and projection can falsify it cheaply.
- Use normal sentence-case label and compact value typography. Wrap long values/deltas instead of clipping them.
- Keep this existing shared component; do not invent a caller or add a new wrapper abstraction.
- PrimeNG MCP Card documentation confirms default content projection, subtitle templates, and no built-in keyboard
  controls. Installed APIs and focused compilation will verify compatibility.

## Implementation checklist

- [x] Confirm scope, consumers, dependencies, and resolved Nx test/lint/build targets.
- [x] Preserve input behavior, content projection, and noninteractive semantics with focused tests.
- [x] Replace custom primitives with native Card/Tag and remove only stat-card SCSS.
- [x] Check isolated themes/viewports and document unavailable consumer/SSR checks.
- [x] Record exact validation, review outcome, and next action in the backlog.

## Acceptance and verification

- [x] Label, numeric zero/string values, all delta directions, default direction, updates, and projection pass tests.
- [x] Native components own appearance; no new palette utilities, CSS rules, or styling exception.
- [x] Isolated DOM geometry in light/dark at 390px/1280px preserves normal and long text without overflow.
- [x] Computed text contrast, noninteractive semantics, and absence of keyboard stops checked.
- [x] Relevant Nx test/lint/build pass; editor diagnostics are clean.
- [x] User explicitly accepts unavailable mobile/light screenshot review as a retained coverage limit, not a pass.
- [x] User approval and the exact screenshot/consumer limits are recorded before marking Done.

## Evidence and handoff

- Before evidence is source only; no production caller exists. No before visual comparison is claimed.
- Integrated player tab started and ended at `http://localhost:3000/players/glenn-latomme`, dark, 1487x1252.
- Resolved config: `NX_DAEMON=false npm exec nx show project frontend-components -- --json`.
  Targets: `@nx/jest:jest`, `@nx/eslint:lint`, and `@nx/angular:package`.
- Changed scope: component/template, new
  [tests](../../../libs/frontend/components/stat-card/src/stat-card.component.spec.ts), and deletion of its SCSS.
  No caller, dependency, route, backend, global theme, or shared token changed.
- Native Card owns the surface and subtitle; native Tags map up/down/neutral-or-absent to success/danger/secondary.
  Up/down PrimeIcons reinforce direction independently of color. Delta strings remain caller-owned, as before;
  no translated UI strings were added or removed. Falsy delta still renders no tag. Projection remains in content.
- Utility comparison: 11 utility tokens plus three bespoke classes become 15 utility tokens and zero bespoke classes.
  The additional sizing/wrapping utilities keep long labels, values, and deltas inside narrow containers; native
  components own all colors and surfaces. Legacy eyebrow/stat/delta classes and 11-line local SCSS are removed.
- **Initially failed, then fixed:** seven of eight tests passed; projection setup initially called
  `TestBed.overrideTemplate` after fixture creation. Move it before TestBed instantiation. A subsequent editor
  unused-host-import diagnostic was resolved by registering that import through TestBed metadata as well.
- **Passed, final run:** `NX_DAEMON=false npm exec nx run frontend-components:test --
  --runInBand --testPathPatterns=stat-card.component.spec.ts --output-style=static`.
  Eight tests cover label/zero, four direction cases, string value and delta updates/removal, projection,
  long-content wrapping hooks, and no added keyboard stops.
- **Passed:** `NX_DAEMON=false npm exec nx run-many -- --targets=lint,build
  --projects=frontend-components --output-style=static`. All 10 tasks pass, eight cached; stat-card builds.
- **Passed after final test change:** `NX_DAEMON=false npm exec nx run frontend-components:lint --
  --output-style=static`. Zero errors, 32 unrelated existing warnings. Nx executor deprecation and ts-jest
  metadata warnings remain unrelated. Final component/template/test editor diagnostics report no errors.
- **Passed:** `git diff --check`; a read-only Node check found no missing relative brief links, trailing whitespace,
  or brief lines over 120 characters. Final worktree scope retains the pre-existing untracked SQL file untouched.
- Browser fixture: temporarily detached the page's body children into a saved document fragment, then inserted
  five synthetic cases using native Card/Tag DOM classes and the application's already-loaded styled theme.
  This was **not a mounted Angular stat-card**. Native Tag host structure was checked against installed PrimeNG;
  Angular rendering and input changes were checked separately by Jest.
- Geometry passed all four combinations of 390px/1280px and light/dark. Native card widths were 362px/1252px.
  No descendant overflow or horizontal clipping was found, including unbroken labels, 200-digit values, and long
  deltas. Fixtures added zero keyboard stops; no controls or focus-return behavior exists in this component.
- Settled computed contrast, label/value/up/down/neutral: light 4.87/19.87/4.57/5.30/7.74:1;
  dark 6.65/16.00/10.51/8.73/9.51:1. These desktop measurements used canvas conversion of OKLCH colors and
  composited alpha backgrounds. Four-case layout checks observed the same colors at both widths; this is not
  screenshot-pixel contrast evidence or a screen-reader pass.
- Screenshot result: the first capture showed the synthetic dark desktop fixture. The second, requested after
  switching to 390px/light, returned the earlier dark desktop image despite correct current DOM measurements.
  Do not claim mobile/light screenshot review passed. No screenshots or personal player data were committed.
- Cleanup confirmed: fixture and saved fragment reference removed, original `APP-SHELL`, layout and player-detail
  roots reconnected, original route/dark class/viewport restored. No account preference or data was mutated.
- Not available: mounted/routed stat-card, routed SSR/hydration, and actual assistive-technology checks.
  No loading/error/permission/disabled controls exist. Empty delta, zero and string data states are tested.
- Review outcome: on 2026-10-17, after the passing checks, stale mobile/light screenshot, and unavailable
  production caller/SSR coverage were disclosed, the user selected: "Approve DR-005d with documented limits and
  mark Done". Completion is accepted with those limits retained; no missing visual/SSR check is claimed passed.
  No styling exception is introduced. Keep global legacy tokens for other callers. The user subsequently requested
  "complete and commit"; only this slice's six files are included, leaving the unrelated SQL file untracked.
- Remaining DR-005d action: none; completion explicitly approved. Future production use still needs real
  consumer/SSR verification; do not invent a caller solely for coverage.
- Exact next action: scope ranking progress as the next DR-005 candidate, inspect its consumers, and create its
  own brief before implementation. Keep DR-005 open; no other child has started in this invocation.