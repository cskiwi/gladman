---
title: 'DR-027a: Admin search-indexing tab'
description: 'Refresh the /admin Indexering tab (index form and information Cards) with native PrimeNG options.'
---

## Identity

- ID: DR-027a (child of DR-027).
- Area and intended outcome: the `Indexering` tab of `/admin` shows its two Cards with native titles, a consistent
  form layout, and a default native progress bar, without changing indexing behavior.
- Parent, dependencies, and blockers: DR-027; DR-004 (page header) Done; none.
- Design rules: [redesign plan](../README.md).

## Scope

- Mounted consumer: root route `/admin` (`frontend-pages-admin`, `FullWidthLayoutComponent`), tab `0` (default).
- Files: `libs/frontend/pages/admin/src/pages/admin/page-admin.component.{ts,html}`.
- Preserve: permission check, form controls, `indexAll` mutation, Toast/Message feedback, `?tab=` query sync, lazy tabs.
- Exclusions: the Synchronisatie tab (`app-sync-dashboard`, DR-028), the disabled team-matching tab, the shared
  page header, hard-coded English copy (needs backend translation restarts; recorded as DR-055), the dead
  `@if (false)` access branch (recorded as DR-056), and running indexing (operational mutation; never run for testing).

## Baseline

- 2026-11-11, Dutch, dark, 800px wide: both Cards render their body but the `pTemplate="header"` titles
  ("Indexering", "Informatie") are not visible as titles; the progress bar used an inline `[style]` height.
- Class-bearing elements before: 18 (utilities: space-y-_, space-x-2, gap-_, pt-_, border-t border-surface, mb-_).

## Changes

- Card titles use the native `header` input instead of an unstyled header template.
- Removed the inline `[style]` height from the indeterminate `p-progressbar` (native size).
- Replaced `space-x-2` with `gap-2` and removed the manual `border-t border-surface` divider around the submit button.
- Prettier re-indented the whole template (it was stored flattened); the diff is large but behavior-neutral.

## Implementation checklist

- [x] Behavior, permissions and translation keys preserved.
- [x] Native PrimeNG options used; no new colors or SCSS.
- [x] Lint passes.
- [x] Build passes.
- [x] Browser: dark 800px, light 375px (no indexing run).

## Acceptance and verification

- [x] `npx nx lint frontend-pages-admin` passes.
- [x] `npx nx build frontend-pages-admin` passes.
- [ ] Browser: light wide, dark 375px, populated states (loading bar, error Message, Toasts) not exercised: they need an indexing run.
- [ ] Keyboard/contrast, tests (not run).

## Evidence and handoff

- Browser (Dutch, local): dark 800px shows native Card titles "Indexering"/"Informatie"; light 375px stacks the Cards with no horizontal overflow (scrollWidth 375).
- Status: Done with explicit user approval (`commit`, 2026-11-11). The unchecked criteria above (light wide, dark 375px, populated states, keyboard/contrast, tests) are accepted limits, not passed checks.
- Next: DR-028 (Synchronisatie tab, scope one child) or DR-027 parent reconciliation.
