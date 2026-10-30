---
title: 'DR-005b: Form sequence'
description: 'Replace custom W/L result dots with native PrimeNG status tags.'
---

## Identity and outcome

- ID: DR-005b; authoritative status in the [backlog](../backlog.md).
- Parent: DR-005. Dependencies: none. Project: `frontend-components`.
- Rules: [design refresh plan](../README.md).
- Outcome: native success/danger tags for a player's ordered W/L sequence, without a custom palette or stylesheet.

## Scope

- [Component](../../../libs/frontend/components/form-sequence/src/form-sequence.component.ts),
    [template](../../../libs/frontend/components/form-sequence/src/form-sequence.component.html), and
    [focused tests](../../../libs/frontend/components/form-sequence/src/form-sequence.component.spec.ts).
- Preserve `app-form-sequence`, required `results: ('W' | 'L')[]`, item order, repeated values, and empty results.
- Repository search found no production imports or template consumers; do not introduce a new caller for this task.
- Exclude player-page design, other DR-005 patterns, global tokens, dependencies, routes, and backend data.

## Baseline and proposed approach

- Baseline: flex row with `gap-1`; each span uses seven visual/layout utilities, custom `g-form-dot` classes,
  arbitrary 22px/11px sizes, and local SCSS mapping `--g-win`/`--g-loss` colors.
- Hypothesis: native Tag success/danger severities can replace all local colors while retaining visible W/L values.
- Cheap discriminating check: Angular fixture tests assert native tags, severity, order, repeated results, and empty state.
- Allow wrapping at narrow widths; retain only necessary flex/gap layout utilities.
- No live production caller is available. Isolated safe-data evidence must be distinguished from routed verification.

## Implementation checklist

- [x] Identify the API, styles, consumers, and resolved Nx targets.
- [x] Replace custom dots with native PrimeNG tags without changing the input API.
- [x] Remove only local, unused SCSS and preserve global result-color tokens.
- [x] Add focused rendering tests and check shared-library lint/build.

## Acceptance and verification

- [x] Ordered/repeated W/L values and empty/updated results render correctly in Angular fixture tests.
- [x] Native success/danger severities replace bespoke colors; no new CSS or palette utilities.
- [x] Isolated markup geometry, computed contrast, and noninteractive semantics checked in four theme/width cases.
- [x] User accepted completion after the light screenshot discrepancy and consumer limits were disclosed.
- [x] Relevant Nx test/lint/build pass, with exact commands and limits recorded.
- [x] User explicitly requested marking Done and committing as DR-005b on 2026-10-17.

## Evidence and handoff

- Worktree was clean before selection on 2026-10-17.
- Baseline evidence: source inspection; no production consumer exists for a before route screenshot.
- Installed PrimeNG 22 Tag declarations confirm `value` and `severity` inputs and native success/danger support.
- Changed scope: component TypeScript/template, new focused spec, and removal of its 14-line local SCSS file.
    The required input API is unchanged. Global result tokens and all other components remain unchanged.
- Utility comparison: nine authored layout/visual utility tokens across the old wrapper/span become three on the
    wrapping row (`flex flex-wrap gap-1`). PrimeNG now owns tag spacing, typography, shape, and severity colors.
    Native labels have natural widths rather than fixed 22px squares; this is intentional, with no size override.
- **Passed:** `NX_DAEMON=false npm exec nx run frontend-components:test --
    --runInBand --testPathPatterns=form-sequence.component.spec.ts --output-style=static`.
    Four tests passed twice, including after the final spec-only edit: order/repeats, empty input, updated input,
    native severity mapping, and noninteractive wrapping markup.
- **Passed:** `NX_DAEMON=false npm exec nx run-many -- --targets=lint,build
    --projects=frontend-components --output-style=static`. All 10 tasks passed, eight from cache.
    Lint reports 32 existing warnings in unrelated components, zero errors; the form-sequence entry point builds.
- **Passed:** editor diagnostics for component TypeScript/template/spec: no errors. `git diff --check` passes.
- Browser checks used the existing integrated player tab at `http://localhost:3000/players/glenn-latomme`.
    A temporary, browser-only dialog contained synthetic `W L W W L` tags using the native Tag DOM/classes and
    loaded application theme. This is isolated static markup, **not a mounted Angular form-sequence consumer**.
    Actual Angular binding/rendering is covered separately by the tests; no live routed integration is claimed.
- At 390px and 1280px, light and dark: all five labels fit; tags measured W 26.72x22px and L 20.94x22px.
    A 45-item stress sequence wrapped without horizontal overflow in all four cases. Results added no tab stops,
    and the accessibility snapshot exposed W/L text in order. No buttons, overlays, permissions, loading, or disabled
    states exist in this display-only component; an empty input is explicitly tested.
- Computed label/background contrast: W 4.57:1 and L 5.30:1 in light; W 10.51:1 and L 8.73:1 in dark.
    Colors were composited over the preview card after finite animations were finished. A second light check found
    settled tag and label colors `rgb(21, 128, 61)` / `rgb(185, 28, 28)` with no active animations.
- Dark and light synthetic-only screenshot crops were captured in chat, not committed. The light crop appeared
    paler than its computed colors even on recapture; screenshot pixels are not claimed as a contrast pass.
    Visible-browser reconciliation was not performed; the user subsequently requested Done after this limit was
    disclosed. This does not establish a screenshot-pixel contrast pass. The first screenshot
    attempt timed out after the fixture disappeared; recreating it allowed capture. No production source was changed
    to support the preview.
- Cleanup confirmed: preview removed; original route, dark class, and 1487x1252 viewport restored. No persisted
    preference, account data, dependency, operational state, or backend data changed.
- **Not run / unavailable:** mounted consumer visual checks and routed SSR/hydration checks, because repository
    search found no production caller. No broad test suite or application build was needed for this unused shared
    entry point; the owning library build passed. This is a coverage limit, not verified consumer behavior.
- Review outcome: on 2026-10-17, after being told DR-005b was in Review with the screenshot discrepancy and no
    production caller, the user requested: "Mark as done and commit as DR-005b". Completion is approved with those
    verification limits retained; the discrepancy is not claimed to have been fixed.
- Reusable decision: direct native success/danger Tag severity with visible W/L text, no custom result palette.
- Exceptions: no application styling exception. The temporary dialog was only a browser fixture and was removed.
- Remaining DR-005b action: none; completion approved by the user. Do not invent a production caller for coverage.
- Next invocation: scope a remaining DR-005 child, with sparkline the next candidate. Inspect its consumers and
    create a brief before implementation; no next child has been started. The DR-005 parent remains open.