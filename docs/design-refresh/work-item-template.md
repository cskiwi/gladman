---
title: 'Design refresh work-item template'
description: 'Reusable brief for one small redesign implementation slice.'
---

## Identity

- ID: DR-NNN or an existing parent ID with a child suffix.
- Area and intended outcome: fill in.
- Owner: unassigned.
- Status: use the [backlog](backlog.md), not a second status field here.
- Parent, dependencies, and blockers: list explicit IDs, or state none.
- Design rules: [redesign plan](README.md). These apply to every item.

Copy this template into `work-items` when an area is ready to be scoped. Adjust the relative links in the copy, link the
brief from its registry row, and keep the slice reviewable.

## Scope

- Exact route/tab/workflow: fill in.
- Affected Nx projects: fill in.
- Source files and shared consumers: link the actual locations.
- Required behavior to preserve: list data, permissions, actions, forms, and responsive interactions.
- Explicit exclusions: list adjacent areas that will not change.

## Baseline and proposed approach

- Capture relevant before views using safe data: light/dark, narrow/wide, and applicable interaction states.
- Identify the page's actual task and primary action; explain what visual clutter will be removed.
- List the native PrimeNG capabilities that replace custom UI.
- Identify necessary layout utilities and semantic colors; do not invent a new styling layer.
- Reuse an existing component, extract a genuinely repeated pattern, or explain why direct PrimeNG is preferable.
- Identify shared changes separately and enumerate their affected consumers.
- Record baseline utility usage and existing custom styles; compare the result after implementation.

## Implementation checklist

- [ ] Confirm dependencies and the smallest independently reviewable slice.
- [ ] Preserve existing behavior and translations while simplifying presentation.
- [ ] Use native PrimeNG options before adding utility classes or custom styling.
- [ ] Remove only proven-unused markup/styles in scope.
- [ ] Check shared consumers and avoid unplanned global changes.
- [ ] Record discoveries outside scope in the backlog.

## Acceptance and verification

Replace generic checks with concrete observations and test cases for this slice.

- [ ] Native PrimeNG components cover appropriate UI primitives and interaction behavior.
- [ ] Utility usage is reduced or remaining/increased usage has a concrete layout reason.
- [ ] There are zero new authored non-semantic colors or numbered palette utilities unless an exception is recorded.
- [ ] There are zero new SCSS files/rules or equivalent inline-style workarounds unless an exception is recorded.
- [ ] Light/dark and narrow/wide layouts preserve information and remain usable.
- [ ] Keyboard access, focus, labels, contrast, and relevant overlays are verified.
- [ ] Applicable loading, empty, error, success, disabled, and permission states are checked.
- [ ] Domain behavior, localization, and relevant SSR/hydration behavior are preserved.
- [ ] Existing relevant Nx lint/build/test targets pass, with exact commands and results recorded.
- [ ] Visual review passes before propagating the pattern to other areas.

## Evidence and handoff

- Before/after evidence: fill in; do not commit sensitive screenshots or logs.
- Changed scope and affected consumers: fill in.
- Utility/style comparison: fill in.
- Validation commands and results: fill in; distinguish passed, failed, and not run.
- Visual review outcome: fill in.
- Reusable-pattern decisions: fill in, or state none.
- Exceptions: state none, or record requirement, alternatives, scope, theme/accessibility proof, and removal conditions.
- Remaining work and new child/backlog IDs: fill in, or state none.
- Update the backlog status and current focus in the same change.
