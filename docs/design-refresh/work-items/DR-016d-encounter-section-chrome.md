---
title: 'DR-016d: Competition draw encounter section chrome'
description: 'Native Cards and localized headings for the mounted played and upcoming encounter panels.'
---

## Identity

- ID: DR-016d; parent DR-016. Authoritative status: [backlog](../backlog.md).
- Dependencies: agreed layout direction and completed DR-016a/DR-016b/DR-016c.
- Design rules: [design refresh](../README.md).

## Scope

- Mounted route:
  `/competition/pbo-competitie-2026-2027/sub-events/8e8ba158-859c-48a7-92ca-f2c3ce805f4f/draws/78d42486-ab43-4484-9b68-a99e46bf96ae`.
- Browser confirmed [PageDrawsComponent][component] with 20 played and 52 upcoming encounters on 2026-10-28.
- Nx project: `frontend-pages-competition`; consuming application: `app`.
- Only the played/upcoming panel surfaces and headings in [the template][template], their obsolete local heading rule,
  component imports, regression tests, and handoff.
- Preserve encounter inputs, callback, variants, ordering, counts, conditional visibility, existing empty copy,
  responsive grid, data, permissions, and routes.
- Exclude standings and its outer heading, qualification, hero, encounter-card internals, overall empty/loading/error
  handling, services, translation assets, backend, shared components, and theme.

## Baseline and approach

- Clean worktree at selection. Previous approved slices are already persistent; do not restart them.
- Live baseline: 72 encounter cards (20 played / 52 upcoming), nine standings, 158 page links.
  Ordered normalized link text/href JSON SHA-256:
  `e4e50b2dc989b786203db6db00af0e2346efe0d152fc25a5b4f42dfd7dbab568`.
- Header screenshot: `dr-016d-before-played.png` captured with Playwright MCP.
  Duplicate uppercase localized eyebrow plus hard-coded English title currently repeat each heading.
- Replace custom panel surfaces with native styled PrimeNG Card and its documented title template.
  Use one semantic localized h2 per panel, the existing count, and existing `all.competition` keys.
  Static totals remain plain semantic text rather than introducing decorative pills.
- Keep the existing responsive grid and encounter content. Use minimal wrapping/spacing utilities.
  No new component, SCSS, inline styles, palette colors, pass-through options, or shared changes.
- Baseline: five surface utilities and 17 header tokens per panel; compare authored utility tokens after implementation.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, and bounded scope.
- [x] Preserve bindings, order, empty copy, conditional visibility, and callbacks.
- [x] Use native Cards and existing localized headings; remove only unused heading CSS.
- [x] Add regression coverage for populated/partition-empty/all-empty and localized headers.
- [x] Record validation, evidence, and exact next action.

## Acceptance and verification

- [x] Native Cards replace only the two custom panel surfaces.
- [x] One localized semantic heading and matching count per panel, without duplicate eyebrows.
- [x] Utility comparison recorded; zero new styles, palette colors, or shared changes.
- [x] Light/dark at 390px/1280px fit with readable headings and counts.
- [x] Heading accessibility, text contrast, and adjacent keyboard reachability checked.
- [x] Populated ordered encounter/link data, standings, and statistics match baseline.
- [x] Tests cover both partition-empty states, all-empty conditional visibility, and three real locale assets.
- [x] Focused Nx tests/lint and app build pass after formatting.
- [x] Localized mounted rendering and populated SSR checked.
- [ ] Shared encounter expansion control's dark focus contrast passes; pre-existing limit recorded below.
- [ ] Actual screen-reader output, operational empty records, role/sync workflows, and exhaustive hydration.
- [x] User visual review or explicit completion approval with disclosed limits.

## Evidence and handoff

- Changed scope: this brief, backlog, and `page-draws.component.{html,ts,scss,spec.ts}`.
  Added CardModule only to this consumer; removed only `.encounters-title`.
  Existing host display rule remains. No shared source, translation asset, backend, or theme changed.
- Authored shell/header utility tokens decrease from 44 to 24 across both panels.
  The former panel had five surface utilities and 17 header tokens; each replacement has one shrink-safety utility
  and 11 header tokens. Body/grid utilities are unchanged and excluded from this comparison.
  Native Card owns surface/spacing. Remaining header utilities supply wrapping, alignment, semantic typography,
  muted counts, and tabular digits. No new styling, palette, pass-through, or design-token override.
- Exact validation commands:

  ```powershell
  npm exec -- prettier --write --end-of-line lf `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.component.html" `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.component.ts" `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.component.scss" `
    "libs\frontend\pages\competition\src\pages\draws\page-draws.component.spec.ts" `
    "docs\design-refresh\backlog.md" "docs\design-refresh\work-items\DR-016d-encounter-section-chrome.md"
  npm exec -- nx run-many -t test,lint -p frontend-pages-competition --output-style=static
  npm exec -- nx run app:build --output-style=static
  git diff --check
  ```

- Tests: 88/88 across three suites pass, including eight new chrome cases.
  Tests use real locale assets, inspect native Cards without pt/dt overrides, preserve ordered encounter inputs,
  variants/callback, both partition-empty messages/zero counts, and all-empty panel hiding.
  Lint passes with 41 existing warnings and no errors. App build and all 29 prerequisites pass.
  Existing Nx executor-deprecation and TypeScript metadata advisories remain.
  No full repository lint/test run was performed before review.
- After approval, `npm exec -- nx run-many --target=lint --output-style=static` passes across all 34 projects
  (34 cached results, existing warnings, no errors). No repository-wide test suite was run.
- Initial formatter run failed because two closing tags were mismatched during editing.
  Corrected before successful formatting, tests, and build; no remaining template compilation error in those checks.
  The existing port-3000 dev watcher retained its earlier failed compilation/old DOM even after reload
  and an explicit file-timestamp retrigger. It was not terminated or restarted.
- Runtime verification therefore used the same mounted route on an isolated existing-target preview:
  `npm exec -- nx run app:serve --port=3001 --output-style=static`.
  First readiness probe ran before startup and could not connect; the later browser mount succeeded.
  Port 3001 served current native Card/h2 markup, not a synthetic fixture.
  This helper is stopped after verification; the user's port-3000 process is preserved.
- Baseline screenshot and six corrected after screenshots were inspected.
  They are session evidence, not committed images:
  `dr-016d-before-played.png`, `dr-016d-verified-{light,dark}-{390,1280}-0.png`,
  and `dr-016d-verified-{light,dark}-390-1.png`.
  An earlier screenshot attempt scrolled the headers under the sticky shell; those captures are not header evidence.
  Corrected captures put the actual headings at viewport y=135px below the shell.
- Four populated theme/width checks: no document or title overflow.
  At 390px document/client widths are 375/375 and panel widths are 347px.
  At 1280px widths are 1265/1265 and the existing grid retains 842px/360px columns.
  All six corrected screenshots show single readable headers and unchanged encounter content.
- Header/count sRGB contrast against the native Card: 19.87:1 / 4.87:1 light,
  16.00:1 / 6.65:1 dark. Browser canvas conversion includes the actual OKLCH colors.
  Accessibility snapshots expose h2 headings `Gespeeld` / `Komende wedstrijden` and counts 20/52.
  The headers introduce no controls or tab stops.
- Tab/Shift+Tab reaches the unchanged named encounter expansion Button with `:focus-visible` in all four cases.
  After transition settlement, its existing 1px outline measures 8.46:1 light but only 1.40:1 dark
  against its own encounter Card. This is an unmodified shared-control/theme limitation, not a passed
  accessibility check; recorded in the backlog for separate shared work. No expansion/sync operation was activated.
- Mounted English/French/Dutch reloads show `Played/Upcoming`, `Joue/Prochains matches`,
  and `Gespeeld/Komende wedstrijden`. All six narrow locale/theme checks fit at 375/375 without title overflow.
  Same-origin credentialed fetch/DOMParser checks under each locale return HTTP 200, the matching two SSR h2 labels,
  counts 20/52, and all 72 encounter cards. Original language cookies and dark theme were restored.
- All 158 ordered link records retain the baseline SHA-256 above; 20/52 cards, nine standings,
  and 72/20/52/9 statistics match. No backend records were written.
- Reusable pattern: native Card title template with a single localized heading and plain count.
  No new component abstraction or styling exception.
- Not verified: actual screen-reader output, operational empty records, role/sync workflows,
  exhaustive hydration, and every hover/active state. Empty-state evidence is component-test evidence only.
- Approval: on 2026-10-28 the user selected
  "Approve completion and commit with the recorded verification limits".
  This explicitly accepts completion with the stale port-3000 watcher, shared dark focus contrast limitation,
  and unperformed checks disclosed above. Unchecked criteria remain unverified; approval does not mean they passed.
  The scoped implementation, tests, and handoff commit is authorized; no push is authorized.
- Next action after this commit: scope one bounded mounted DR-016 loading/error/overall-empty child
  and create its brief before editing. Do not restart DR-016d or begin another implementation slice here.
  Restart the stale port-3000 watcher under user control if still needed for local inspection.
- Remaining DR-016 work: standings outer section chrome, loading/error/overall-empty presentation,
  and confirmed mounted qualification scope require separate selection and evidence.

[component]: ../../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.ts
[template]: ../../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.html
