---
title: 'DR-007a: Native error-message contrast prerequisite'
description: 'Correct PrimeNG error-message text contrast without page-specific styling.'
---

## Identity and outcome

- ID: DR-007a; authoritative status: [backlog](../backlog.md); owner unassigned.
- Prerequisites: none. This item unblocks the remaining feedback checks in [DR-002](DR-002-home-pilot.md) and
  [DR-002a](DR-002a-home-service-prerequisite.md).
- Intended outcome: native PrimeNG error messages meet WCAG AA normal-text contrast in both themes, with existing
  message content, semantics, and severity behavior unchanged.
- Rules: [design refresh plan](../README.md).

## Scope

- Change only the Message component's semantic color token in the shared [PrimeNG preset][preset].
- Candidate: set `components.message.colorScheme.light.error.color` to `{red.700}`. Leave the dark scheme and all
  other severity tokens inherited; record any out-of-scope contrast defect as a blocker instead of expanding this item.
- Current static usage: 22 `<p-message>` instances across 16 templates in `frontend-pages-admin`,
  `frontend-pages-club`, `frontend-pages-competition`, `frontend-pages-home`, `frontend-pages-player`, and
  `frontend-pages-tournament`: 18 error, 2 info, and 2 warn. `sync-admin` imports `MessageModule`, but no static
  `<p-message>` use was found there; do not clean up that import in this task.
- Preserve PrimeNG's native message markup, accessible alert role, content, layout, and existing `error`, `info`, and
  `warn` use. No page markup, component stylesheet, global CSS, other severity, theme palette, or application behavior
  change is in scope.

## Baseline and proposed approach

The measured failure was reproduced during DR-002a's safe browser fixtures at 390px and 1280px. Settled 14px/500
error text is `#dc2626` on `[253,242,242]` in light mode (4.41:1), below 4.5:1. The prior browser report recorded
dark text `#ef4444` on `[41,19,25]` at 4.63:1. Recomputing from those rounded RGB samples gives 4.645:1. The shared
preset has no Message component override.

The installed versions are PrimeNG 22.1.2 and `@primeuix/themes` 2.0.3. PrimeUI's [Message documentation][message]
describes native severity handling. Installed Message token declarations expose `message.error.color`; the Aura
defaults resolve that foreground to `{red.600}` in light mode and `{red.400}` in dark mode. The active browser
confirmed the corresponding live CSS variables (`#dc2626` and `#ef4444`).

The proposed light-only `{red.700}` candidate is an existing semantic theme token (`#b91c1c` in the current preset).
Calculated against the recorded settled light background, it measures 5.90:1. This is a hypothesis, not a passed
browser acceptance check: verify the rendered native component and recompute contrast after applying the token. Do not
use a page-local class, hard-coded color, numbered Tailwind palette utility, or custom stylesheet.

## Implementation checklist

- [x] Confirm the light-mode failure, passing dark-mode baseline, and absence of a preset Message override.
- [x] Verify the installed native `message.error.color` token and calculate the light-only semantic candidate.
- [x] Inventory all static `<p-message>` instances, severities, and affected Nx projects.
- [ ] Apply only the scoped light-mode error foreground token in the PrimeNG preset.
- [ ] Verify actual error contrast at 390px and 1280px in light and dark modes; confirm info/warn styling remains
  unchanged and usable in both themes.
- [ ] Check accessible message text/alert semantics, responsive layout, and representative consumers in all six
  affected page projects. Do not use operational/admin mutations as test fixtures.
- [ ] Run the focused app lint and development build checks; record exact results. Existing documented commands are
  `NX_DAEMON=false npx nx lint app --output-style=static` and
  `NX_DAEMON=false npx nx build app --configuration=development --output-style=static`.
- [ ] Return the DR-002a failure-state review to `Review` only after the actual contrast and user-facing checks pass.

## Acceptance and verification

- [ ] Rendered 14px/500 error text measures at least 4.5:1 against its actual composited message surface in both
  themes; retain a result above the threshold at both recorded widths.
- [ ] The error message remains a native PrimeNG alert with readable text; no color-only meaning or altered live-region
  behavior is introduced.
- [ ] Existing `info` and `warn` messages remain legible and visually unchanged in both themes. Confirm each current
  severity in a safe representative route or fixture; there are no static `success` Message instances to migrate.
- [ ] No message is clipped or overlaps adjacent content at narrow or wide viewports; layout utilities and page
  templates remain unchanged.
- [ ] Relevant app lint/build tasks pass; actual browser checks and any unavailable checks are recorded below.
- [ ] DR-002a's final failure/recovery review passes after this prerequisite. DR-002 and DR-002a remain blocked until
  their own outstanding acceptance and review checks pass.

## Evidence and handoff

- Scoping evidence: source inventory found 22 static `<p-message>` instances in 16 templates, with 18 error, 2 info,
  and 2 warn messages across six page projects. No static instance was found in `sync-admin`.
- Contrast evidence: DR-002a recorded settled light/dark values at 390px and 1280px. A browser-side WCAG calculation
  using those recorded sRGB values returns 4.406:1 for current light red, 5.903:1 for the proposed light `{red.700}`,
  and 4.645:1 for inherited dark red. This calculation did not change app code or browser state.
- Live theme evidence: the active homepage confirmed inherited `--p-message-error-color` values `#dc2626` in light
  mode and `#ef4444` in dark mode. It contained no rendered message, so this check does not substitute for the
  required rendered-message verification.
- Changed scope in this scoping pass: this brief, the authoritative backlog status/focus, and DR-002a's next action;
  no application code or runtime state changed.
- Documentation diagnostics found no errors in the new brief or the two updated handoffs; a targeted whitespace search
  found no trailing whitespace. `git diff --check` was attempted but the terminal returned Ctrl+C, so it is not claimed
  as passed. Application lint/build/test tasks were not run in this docs-only scoping pass.
- Utility/style comparison: no app utility or style changed. The implementation candidate adds no utility, CSS rule,
  or stylesheet.
- Reusable-pattern decision: use PrimeNG's semantic component token in the existing preset; do not add a wrapper or
  page-specific exception.
- Exceptions: none.
- Next action: implement the light-only candidate, verify rendered error/info/warn messages in the four theme/viewport
  cases, run app lint/build, and update DR-002a with actual results. Keep DR-002 and DR-002a blocked until final review.

[preset]: ../../../apps/app/config/theme.preset.ts
[message]: https://primeng.dev/message