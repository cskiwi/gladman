---
title: 'DR-016e: Competition draw states'
description: 'Loading, error, and overall-empty presentation for the mounted competition draw.'
---

## Identity

- ID: DR-016e; parent DR-016. Authoritative status: [backlog](../backlog.md).
- Dependencies: agreed layout direction and completed DR-016a through DR-016d.
- Design rules: [design refresh](../README.md).

## Scope

- Mounted route:
  `/competition/pbo-competitie-2026-2027/sub-events/8e8ba158-859c-48a7-92ca-f2c3ce805f4f/draws/78d42486-ab43-4484-9b68-a99e46bf96ae`.
- The route is mounted through the [application routes][app-routes] and [competition routes][routes].
  On 2026-10-30 the browser confirmed 72 encounter cards, two section headings, and 158 draw-page links.
- Nx project: `frontend-pages-competition`; consuming application: `app`.
- Only the overall loading skeleton, load-error message, no-encounters message, and necessary selectors in
  [the draw service][service]; associated regression tests and handoff.
- Preserve existing encounter data, ordering, hero, standings, routes, permissions, translated empty copy,
  error text, loading conditions, and service requests.
- Exclude standings outer chrome, encounter-card internals, qualification, shared components, theme,
  translations, and backend changes.

## Baseline and approach

- Worktree was clean at selection; previous approved slices are already committed.
- Playwright on port 3000 confirmed the mounted populated route. Synthetic browser-only signal overrides captured
  loading, empty, and error presentation without changing records; original signals and theme class were restored.
  Baseline loading has 20 Skeletons inside custom surfaces and no loading announcement. Synthetic overrides do not
  prove a real request failure works.
- Angular's installed resource implementation throws when `value()` is read after a failed load.
  The service's public selectors and SEO effect read that value, so guard the resource with `hasValue()` and test
  an actual failed Apollo request rather than hiding or replacing the error.
- Use native Card surfaces for the existing Skeleton structure and native secondary/error Messages for empty and
  error states, matching existing competition patterns. Retain the existing localized empty title and description.
  Supply a localized accessible loading status using an existing competition-loading translation.
- Keep the responsive structure and use percentage-based Skeleton widths where necessary. No new component,
  pass-through configuration, stylesheet, inline style, color, shared change, or translation asset is planned.
  A shared dumb component is not warranted for these page-specific states and direct PrimeNG primitives.
- Baseline loading wrappers have eight hero utilities and six per encounter wrapper. The empty markup has 16 utility
  tokens across its surface and content. Error has six utilities and an inline background/color override.

## Implementation checklist

- [x] Confirm mounted consumer, completed dependencies, and bounded scope.
- [x] Preserve populated data, empty copy, loading conditions, and error text.
- [x] Use native Card, Skeleton, and Message options; guard failed-resource reads.
- [x] Add regression coverage for loading, a failed request, empty, populated, and real locale assets.
- [x] Record validation, evidence, and exact next action.

## Acceptance and verification

- [x] Native PrimeNG states replace only the scoped custom surfaces and inline error colors.
- [x] Utility comparison recorded; zero new styles, palette colors, pass-through settings, or shared changes.
- [x] Synthetic loading, error, and empty states fit in light/dark at 390px/1280px.
- [x] Accessibility tree, labels, text contrast, and lack of new keyboard stops checked.
- [x] An intercepted browser request failure displays its error without a page exception; recovery works.
- [x] Populated counts, component-localized state copy, and populated SSR checked.
- [x] Focused Nx tests/lint and app build pass after formatting.
- [ ] Actual screen-reader output, operational empty records, exhaustive hydration and all role/sync workflows.
- [ ] Shared app header fits at 320px; separate pre-existing issue DR-030 recorded.
- [x] User visual review or explicit completion approval with disclosed limits.

## Evidence and handoff

- Before screenshots: session files `dr-016e-before-{loading,empty,error}-{light,dark}-390.png` and
  `dr-016e-before-{loading,empty,error}-light-1280.png`; synthetic states, not operational data changes.
- Changed scope: this brief, backlog, and `page-draws.component.{html,ts,spec.ts}` plus
  `page-draws.service.ts`. No shared source, translation asset, backend, or theme changed.
- Loading wrapper utility tokens drop from 20 to 11: the three native Cards own their surfaces while nested
  utilities retain layout. Empty surface/content tokens drop from 16 to seven. Error tokens drop from six to three
  and the inline background/color declarations are removed. A semantic `text-color` span keeps error text readable
  while the native error severity and icon retain their visual meaning. No SCSS or pass-through configuration.
- Native Message's documented icon template hides decorative icons from the accessibility tree. Loading has a
  localized `role="status"` and 20 aria-hidden Skeletons; its existing three placeholder sections remain.
  The loading label reuses `all.competition.edit.messages.loading` without changing translation assets.
- Exact final validation commands:

  ```powershell
  npm exec -- prettier --write --end-of-line lf `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.component.html" `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.component.ts" `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.service.ts" `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.component.spec.ts" `
    "docs\design-refresh\backlog.md" "docs\design-refresh\work-items\DR-016e-draw-states.md"
  npm exec -- nx run-many -t test,lint -p frontend-pages-competition --output-style=static
  npm exec -- nx run app:build --output-style=static
  git diff --check
  ```

- Tests: 95/95 across three suites pass; seven added cases cover real English, Dutch, and French loading/empty
  translation assets and an Apollo failure followed by successful recovery. The existing populated tests pass.
  Lint passes with 41 existing warnings; app build and 29 prerequisites pass. Nx executor-deprecation and
  TypeScript metadata advisories remain. No repository-wide test suite was run.
- After approval, `npm exec -- nx run-many --target=lint --output-style=static` passes across all 34 projects
  (34 cached results, existing warnings, no errors).
- Browser: the existing port-3000 app served the changed route. Playwright aborted only the client-side
  `CompetitionDrawDetail` request while navigating from the real competition page: one accessible error alert
  showed `An error occurred`, the hero was absent, and no page exception occurred. The route and request handler
  were restored; the populated route loaded again. No records or server processes were changed.
- Browser-only state overrides checked 12 combinations: loading, overall empty, and error at 390px/1280px in both
  themes. Settled document client/scroll widths match in all cases. Status/alerts have no focusable children;
  Tab in the error state reaches the existing shell link with `:focus-visible`. The accessibility snapshots expose
  the localized loading status, the empty h2 and description, and the error alert without decorative icon glyphs.
- Canvas-composited text contrast: empty 7.74:1 light / 9.51:1 dark; error 18.14:1 light / 14.63:1 dark.
  Native red error text alone originally measured 4.41:1 light; the semantic text utility fixes that without
  modifying the global preset. Four final screenshots were inspected; all 12 are session evidence named
  `dr-016e-verified-{loading,empty,error}-{light,dark}-{390,1280}.png`, not committed images.
- Populated mounted route: 72 encounter cards, nine standings rows, 158 links, and 72/20/52/9 hero totals.
  A same-origin SSR fetch returned HTTP 200 with 72 cards, nine rows, and both localized encounter headings.
  This is not exhaustive hydration or ordered-link verification.
- At 320px the unchanged shared topbar overflows: the document is 305px wide and the tools end at x=338px.
  The same populated route fits at 390px; DR-030 tracks the independent shared-shell follow-up.
- Reusable pattern: page-local native Card/Skeleton and Message primitives, not a new shared dumb component.
  The page-specific states do not establish another meaningful repeated structure. No styling exception.
- Not verified: actual screen-reader output, real operational empty records, exhaustive hydration,
  all roles/sync workflows, and shared-shell 320px overflow. These remain unchecked.
- Approval: on 2026-10-30 the user selected "Approve completion and commit with the recorded verification limits".
  This accepts completion despite the unchecked limits above; approval does not mean those checks passed.
  The scoped implementation, tests, and handoff commit is authorized; no push is authorized.
- Next action after this commit: scope a separate mounted standings outer-section chrome child;
  do not start it during this invocation.

[app-routes]: ../../../../apps/app/config/app.routes.ts
[routes]: ../../../../libs/frontend/pages/competition/src/lib.routes.ts
[service]: ../../../../libs/frontend/pages/competition/src/pages/draws/page-draws.service.ts
