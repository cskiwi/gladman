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
- [x] Homepage and shell are visually reviewed together at wide and narrow widths in light and dark themes.
- [x] Keyboard/focus behavior and contrast are checked in the combined view.
- [x] Relevant Nx lint and application build checks pass; exact results are recorded below.
- [x] Available test coverage and outcomes are recorded; no shell/layout unit specs exist, and unrelated shared-suite
  failures are documented below.
- [x] SSR/hydration and localized live output are checked after an application restart.

## Evidence and handoff

The user approved the combined heading/hero/shell layout on 2026-10-16. See
[DR-004](DR-004-shared-headings.md) for subsequent native-table/canvas styling and final review. After the user restarted
the server, live Dutch output and SSR hydration checks passed without translation interception. Light/dark 1280px/390px
checks show no page overflow; keyboard Enter/Escape and focus return on the Drawer pass, and theme persists on reload.
Application build and relevant lint pass. The broader shared test target exposes failures outside this slice. The user
requested final closure on 2026-10-16; current test results and limitations are recorded below. The combined view
review and approved layout are complete.

The shell work originally left the staged DR-002 homepage content unchanged. A follow-up comparison now composes that
page with the shared rank avatar and display heading. On 2026-10-16, the combined anonymous route was reviewed at
1130x1275 and 390x844. Both viewports had no page-level horizontal overflow; the mobile table retained its native
horizontal scroll area, and the shared hero remained readable at the narrow width.

types were updated, and the application build includes the new assets. Restart the API before the final localized
An earlier browser pass used a stale API translation bundle. After the API restart, live Dutch labels and SSR hydration
passed as noted above. The combined shell/homepage review covers authenticated navigation, loading and empty states,
long-name behavior, and keyboard/focus interactions.

### Nx verification: 2026-10-16

- **Passed:** `NX_DAEMON=false npx nx run-many -t lint -p frontend-components frontend-modules-translation app
  --outputStyle=summary`; all three lint tasks passed.
- **Passed:** `NX_DAEMON=false npx nx build app --configuration=development --output-style=summary`; 30 tasks passed,
  24 from cache.
- **Passed with no tests found:**
  `NX_DAEMON=false npm exec nx run frontend-modules-translation:test -- --runInBand --output-style=static`.
- **Failed, outside this slice:**
  `NX_DAEMON=false npm exec nx run frontend-components:test -- --runInBand --output-style=static`; one suite passed,
  while player-ranking-progress failed for a missing translation provider and bracket-tree had five existing failures
  in team-name extraction and sorting. There are no shell/layout unit-spec files in the component project.
- DR-003 was closed at the user's direction. The aggregate shared-component test target is not claimed as passing.
