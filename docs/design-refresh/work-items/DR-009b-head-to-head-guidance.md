---
title: 'DR-009b: Head-to-head guidance and page states'
description: 'Restore native guidance content and explicit page loading and error feedback.'
---

## Identity and scope

- ID: DR-009b. Status: see the [backlog](../backlog.md).
- Parent: [DR-009](DR-009-player-head-to-head.md). DR-009a is approved Done.
- Design rules: [refresh plan](../README.md).
- Mounted consumer: `/players/glenn-latomme/head-to-head`, confirmed hydrated on 2026-11-25.
- Project: `frontend-pages-player`; existing `main`, clean worktree at start.
- Sources: [template][template], [component][component], [service][service] and existing component tests.
- Scope: guidance Card title/dismissal, page loading/error presentation, safe resource access and error normalization.
- Preserve guidance copy, dismissal storage key, filters, routes, data calculations and grid inputs.
- Exclude grid internals/empty-state redesign (DR-009c), shared/global styling, dependencies and operational mutations.

## Baseline and approach

- Real mounted route renders fifteen partner rows. Dark 1288px guidance crop inspected.
- Legacy Card header template renders neither title nor dismiss button; dismiss name is hard-coded English.
- Guidance uses redundant padding/wrappers and gray palette/important button overrides.
- Error is a hand-styled red row; reading a failed resource's value can throw before error UI renders.
- Use native Card title template, translated native Button, ProgressBar and error Message.
- Guard the existing resource value with `hasValue`; preserve non-HTTP error messages and provide the existing
  load-failure text when a failure has no message. Do not change requests or calculations.
- Keep existing container/grid separation. No second consumer justifies a new presentational wrapper.
- Existing page SCSS is unchanged; remove no shared styling and add no styling exceptions.

## Implementation checklist

- [x] Confirm mounted consumer, prerequisites and bounded scope.
- [x] Restore native guidance title and translated dismiss action, preserving stored dismissal.
- [x] Provide mutually exclusive native loading/error/results presentation.
- [x] Preserve filters and grid behavior without shared/global edits.
- [x] Add focused dismissal and state-transition tests.

## Acceptance and verification

- [x] Guidance title, description and four list items render; keyboard dismissal persists across remount.
- [x] Loading exposes a translated named progress indicator; failure exposes a native error alert, not results.
- [x] Failed resource access does not prevent rendering the error state.
- [x] Recovery renders the unchanged populated grid; filters remain available.
- [x] Light/dark at 390px/1440px have contained guidance and page feedback with correct native theme colors.
- [x] No new palette classes, SCSS, inline styles or shared-component changes.
- [x] Focused Nx lint/build/tests pass.
- [x] User explicitly approves completion with disclosed verification limits; no unperformed check is claimed.
- [ ] Full screen-reader, contrast, locale-switching and SSR/hydration verification.

## Evidence and handoff

- Implemented only page guidance/state markup, native Message import, service failure handling and focused tests.
  Existing page/grid separation is retained; no additional smart/presentational component earns its place here.
- Guidance uses the native Card title template, semantic heading/region and native translated secondary text Button.
  Native indeterminate ProgressBar and Message replace loading/error results; the existing grid is unchanged.
- Service guard prevents reading a resource value in its error state. Error normalization previously discarded
  non-HTTP errors into an empty message, hiding failures as empty results; preserve meaningful Error messages and
  use the existing `Failed to load player` fallback for an empty/unknown failure. HTTP status-text behavior is retained.
- Scope utility metrics, from guidance through the end of the page: eleven to five class attributes,
  36 to twelve utility tokens; three palette tokens to zero. Remaining classes provide title alignment,
  heading/list spacing and loading-copy spacing. No SCSS/global changes or styling exceptions.

### Validation commands

- `npx nx run frontend-pages-player:test --runInBand --testPathPatterns=page-head-to-head.component.spec.ts
--output-style=static`: pass, eight tests after final application changes.
  Includes the three existing filter tests, persistent guidance dismissal, query loading/success, HTTP
  failure/recovery, non-HTTP failure and empty-message fallback. Existing ts-jest metadata warnings remain.
- `npx nx run-many -t lint build -p frontend-pages-player --output-style=static`: pass, twelve tasks,
  ten from cache, repeated after the final service/test change. Existing lint warnings remain.
- Scoped `npx prettier --write`: pass on every changed file.
- Node assertions: pass for seven files' LF endings, three documents' frontmatter, 483 local links,
  unique DR-009b registry row and zero scoped palette/inline-style/legacy-template regressions.
- `git --no-pager diff --check`: pass. Git warns about future CRLF conversion; current file bytes are verified LF.
- No dependency installs, workspace-wide tests, full application build, operations or backend mutations.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 22 targets pass from cache;
  twelve other targets fail, matching the failing target list recorded for DR-009a: backend-health, backend-seo,
  shared, backend-ranking, backend-authorization, i18n, backend-search, backend-translate, utils, backend-database,
  frontend-modules-translation and backend-graphql. No unrelated fixes or manifests are included.

### Browser evidence

- Hydrated route before/after retains fifteen populated partner rows and existing filters.
- Four settled guidance cases: light/dark at 390px/1440px. Translated title, four list items and `Sluiten` button
  name are present; Card widths 347px/1280px, zero guidance overflow, button contained.
- Computed native guidance text/background: light `oklch(0.14 0.02 250)` / `oklch(1 0 0)`;
  dark `oklch(0.94 0.005 250)` / `oklch(0.22 0.018 250)`. This is not a contrast audit.
- Eight settled safe browser-only fixtures: loading/error x both themes x both widths.
  Native progressbar has translated `Tabel laden...` name; error has alert role and visible safe test text.
  Feedback fits each viewport with zero overflow; filters remain and results are absent.
- Initial fixture samples included leaving Message elements and are not accepted as settled state evidence.
  Repeats wait for exact progressbar/alert/grid counts before measuring; all eight pass.
  Original component selectors are restored; fifteen rows and zero alerts return after native leave animation.
- Enter and Space dismiss guidance; the existing storage key becomes `true`. Tab continues to the first
  sortable table header. Reload keeps guidance hidden; original storage preference is restored afterward.
  Keyboard-origin focus shows the native solid outline; pointer-origin programmatic focus does not force it.
- Inspected baseline and updated dark guidance crops, including the complete narrow Card and close button.
  The shared-browser wide crop clips the right edge; do not treat it as full-width screenshot evidence.
  A crop requested after temporary light switching was dark after a reload; it is dark-only evidence.
- Existing navigation view-transition abort errors recur before/after; route/data render.
- No full screenshot matrix, screen-reader/touch, measured contrast, locale/permission workflow or
  SSR/hydration pass is claimed. Browser state fixtures do not substitute for real backend outage testing;
  focused tests cover the actual query/resource failure path.

### Exact next action

- Explicit approval on 2026-11-25: `Approve DR-009b with documented limits and commit`.
  This authorizes completion and the scoped commit while retaining unchecked full screenshot-matrix, contrast,
  screen-reader/touch, locale/workflow and SSR/hydration criteria. It is not evidence those checks passed.
- DR-009b is Done by that approval. Commit only its implementation, eight focused tests and repository handoff.
  No push is authorized; the required workspace lint results are recorded above.
- Keep DR-009 open. Exact next candidate: scope DR-009c grid/states in the next invocation, not this one.
- Existing English service fallback/status errors, one-time option translations and native Select locale
  feedback remain follow-up work; no translation-system redesign is included.

[template]: ../../../libs/frontend/pages/player/src/pages/head-to-head/page-head-to-head.component.html
[component]: ../../../libs/frontend/pages/player/src/pages/head-to-head/page-head-to-head.component.ts
[service]: ../../../libs/frontend/pages/player/src/pages/head-to-head/page-head-to-head.service.ts
