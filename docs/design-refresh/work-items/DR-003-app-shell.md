---
title: 'DR-003: App shell and layouts'
description: 'A bounded refresh of the shared shell, navigation, search, and routed layout containers.'
---

## Identity and outcome

- ID: DR-003.
- Status and owner tracking: [backlog](../backlog.md); owner unassigned.
- Dependency: [DR-001](DR-001-design-baseline.md); reviewed with [DR-002](DR-002-home-pilot.md).
- Scope: shared shell, mobile navigation, search presentation, account actions, and routed layout containers.
- Projects: shared frontend components and application translation assets.
- Rules: [design refresh plan](../README.md).

The purpose of this slice is to make the homepage pilot reviewable in the application chrome users actually see. The
shell should provide clear navigation and predictable controls without competing with page content.

## Scope

- Replace the custom mobile overlay with PrimeNG Drawer while preserving route links and dismissal behavior.
- Reduce shell-only gradient, blur, and decorative treatment to semantic PrimeNG theme tokens.
- Preserve desktop navigation, search selection routing, login/logout, language selection, theme persistence, and update
  notifications.
- Make centered and full-width layout containers explicit without changing route ownership or page data.
- Localize shell and search labels in all supported locales.

Feature-page components, shared hero/ranking components, authentication behavior, theme preset values, and route
configuration remain excluded.

## Acceptance and verification

- [x] Desktop and mobile navigation use semantic controls with accessible labels.
- [x] Mobile navigation uses a native PrimeNG Drawer and closes after route selection.
- [x] Search routing, loading, empty states, and result type labels remain available and localized.
- [x] Account menu, login, theme switching, language selection, and update refresh behavior remain wired.
- [x] Centered and full-width layouts retain their route-level distinction with explicit container classes.
- [ ] Homepage and shell are visually reviewed together at wide and narrow widths in light and dark themes.
- [ ] Keyboard/focus behavior and contrast are checked in the combined view.
- [ ] Relevant Nx lint, test, and application build checks pass.
- [ ] SSR/hydration and localized live output are checked after an application restart.

## Evidence and handoff

The implementation intentionally leaves the staged DR-002 homepage content unchanged. On 2026-10-16, the combined
anonymous route was reviewed at 1130x1275 and 390x844. Both viewports had no page-level horizontal overflow; the
mobile table retained its native horizontal scroll area, and the PrimeNG Drawer opened and closed correctly.

The live API process was already running with the previous translation bundle, so the browser showed raw translation
keys for the newly added shell/search labels. The locale JSON files parse with `JSON.parse`, the generated translation
types were updated, and the application build includes the new assets. Restart the API before the final localized
visual review. Authenticated, loading, error, no-ranking-system, long-name, SSR/hydration, and keyboard/focus checks
remain open from DR-002 or this slice.
