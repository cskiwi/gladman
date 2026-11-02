---
title: 'DR-019c: Tournament live navigation'
description: 'Native, accessible live-navigation links on the mounted tournament detail page.'
---

## Identity and scope

- ID: DR-019c. Parent: [DR-019](DR-019-tournament-browsing.md). Status: [backlog](../backlog.md).
- Dependencies: approved DR-019a hero and competition presentation. No selection blocker.
- Rules: [design refresh](../README.md).
- Project: `frontend-pages-tournament`.
- Confirmed consumer on 2026-11-02: `/tournament/8658b541-702a-408e-8114-2858a9428069`,
  loaded Internationaal Tornooi Lokerse BC 2023 with four public live links.
- Sources: [template](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.html),
  [component](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.ts),
  [styles](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.scss),
  [tests](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.spec.ts).
- Preserve all four tournament-ID routes, order, translated labels/descriptions and unconditional public availability.
- Exclude hero, sub-events/draws, feedback, club browsing, live destination pages, backend and mutations.

## Baseline and approach

- Mounted baseline has a redundant literal Live eyebrow, custom section typography and four hand-styled link surfaces.
- Decorative icons enter accessible names; results/upcoming use inline custom status/palette colors.
- Descriptions truncate instead of wrapping. The grid uses one/two/four columns at existing breakpoints.
- Match competition detail's semantic h2 and native secondary outlined `pButton` anchors.
  Keep the existing responsive grid and all translated descriptions; use wrapping text.
- Group the heading and navigation in one native bordered Card, matching competition content surfaces.
  The first bare-canvas implementation measured only 4.46:1 for light-mode descriptions.
  A native content surface fixes this without text-color overrides or theme changes.
- Reuse the competition external anchor's semantic 2px primary focus ring rather than the low-contrast native
  secondary outline. This is a local accessibility treatment, not a shared/global theme change.
- Use a heading-labelled navigation landmark and hide decorative icons from assistive technology.
- One local readonly descriptor list renders the repeated links once; no new component or shared/global change.
  Competition has no identical live-navigation consumer, so a cross-feature wrapper is not justified.
- Remove only the live selector from its shared SCSS rule; retain draw transitions and adjacent custom typography.

## Implementation checklist

- [x] Confirm mounted consumer, routes and bounded scope.
- [x] Preserve link data, order, localization and public availability.
- [x] Replace custom surfaces/colors with native PrimeNG and semantic text.
- [x] Remove only unused live-specific styles.
- [x] Verify checks and persist evidence/remaining limits.

## Acceptance and verification

- [x] Four native outlined links retain exact destinations and actual English/Dutch/French translation-asset copy.
- [x] Heading-labelled navigation and decorative-icon hiding provide meaningful accessible names.
- [x] Light/dark at narrow/wide widths fit without truncating descriptions.
- [x] Keyboard focus/order, hover and text/focus-ring contrast are checked.
- [x] Hero, event content and permission gates remain unchanged, with existing regressions passing.
- [x] Relevant Nx tests, lint and production library build pass.
- [x] Loaded Dutch SSR/client rendering is checked.
- [x] User approved completion and commit with disclosed verification limits.
- [ ] Mounted English/French browser layouts are verified.
- [ ] Actual screen-reader output and exhaustive hydration are verified.

## Evidence and handoff

- Selection: worktree clean; source and mounted browser confirm the real consumer.
- PrimeNG documentation confirms styled `pButton` anchors with `routerLink`; installed version is 22.
- Browser baseline: Dutch loaded page; all four links resolve beneath the supplied tournament ID.
- Baseline dark 390px screenshot and final light/dark 360/390/768/1440px screenshots are local browser evidence,
  not committed assets. The inspected final views show one purposeful Card and readable, wrapping descriptions.
  Local names: `DR-019c-before-dark-390.png`, `DR-019c-final-{light,dark}-{360,390,768,1440}.png` and corresponding
  `DR-019c-focus-*.png`. Initial bare-canvas `after` screenshots are superseded, not final evidence.
- Eight isolated anonymous Chrome cases pass: actual theme class, page/content fit, one/two/four grid columns,
  exact four routes/order, native Card/outlined links and no legacy eyebrow, truncation or inline styles.
- Tab reaches courts, results, upcoming and kiosk in order, each with `:focus-visible` and a measured 2px primary ring.
  Settled normal/hover/focus text contrast minima: 4.66:1 light, 6.28:1 dark.
  Ring-to-surrounding-Card contrast: 3.65:1 light, 10.22:1 dark.
  Colors are converted through browser canvas to sRGB; transparent ancestor backgrounds are composited.
- Accessibility snapshot names the region/navigation Live Display; all four links contain their Dutch title
  and description without decorative icon glyphs in the accessible name.
- Anonymous keyboard Enter opens the existing courts destination; browser Back restores four detail links.
  Destination-page redesign/complete live workflows remain explicitly excluded.
- Both real Dutch loaded SSR responses are HTTP 200; heading, navigation text and link routes match fresh clients.
  Two anonymous contexts and the keyboard navigation check report zero page errors and zero GraphQL mutations.
  No backend, translation, permission or operational/admin changes were needed.
- Unit tests add real English/Dutch/French asset checks, native Card/Button presentation, route ID/order and
  public availability alongside permitted completed-tournament rendering. Existing hero/phase/gate tests still pass.
- Scoped authored static class tokens: 115 before to 31 after; custom tokens six to zero, inline colors two to zero.
  The readonly local descriptor list renders repeated domain links once; no classes are hidden in a new wrapper,
  stylesheet or styling configuration. Icons remain icon identifiers, not a second styling system.
- Only `.g-live-card` is removed from the shared SCSS selector; `.g-draw-row` and all adjacent styles remain.
- Harness corrections: initial theme setup used an unencoded cookie name; use `gladman%3Atheme`.
  Waiting for network idle avoids measuring SSR nodes replaced during client loading.
  The first ring calculation selected a transparent shadow layer and the first route assertion compared
  relative paths to an absolute URL. Corrected assertions sample the opaque ring and compare pathnames;
  all eight final cases pass. These were harness errors, not application failures.
- A screenshot attempt outside the browser's allowed roots was denied; subsequent captures succeeded locally.
- Exact final commands, all passed after formatting:
  - `npx nx run frontend-pages-tournament:test --testFile=libs/frontend/pages/tournament/src/pages/detail/page-detail.component.spec.ts --runInBand --output-style=static`
    passes 28 tests in one suite.
  - `npx nx run frontend-pages-tournament:lint --output-style=static` passes with zero errors.
  - `npx nx run frontend-pages-tournament:build --configuration=production --output-style=static`
    passes the library build and ten prerequisite tasks.
  - Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
    with existing warnings and zero errors.
  - Existing Nx executor/ts-jest warnings remain; no tooling migration is part of this slice.
- No new loading, empty, error, success or disabled state is introduced: these public anchors require a loaded
  tournament and have no submission state. Existing detail loading/error feedback remains DR-019f.
- Not run: actual screen-reader output, mounted English/French, exhaustive hydration and authenticated live
  operational workflows. Translation-asset and gate tests are not claims of mounted workflow verification.
- Exceptions: none.
- User approval on 2026-11-02: "Approve DR-019c and commit with disclosed verification limits".
  This authorizes completion and a commit containing only this implementation, tests and repository handoff, not a push.
  The unchecked actual screen-reader, mounted English/French and exhaustive hydration criteria remain unchecked;
  authenticated live operational workflows were also disclosed as unverified. Approval accepts these limits,
  not a claim that any unperformed check passed.
- Outcome: approved completion. The parent remains open.
- Commit scope: this approved implementation, tests and handoff only; no workflow changes or push.
- Exact next action in a fresh invocation: confirm and scope one mounted DR-019d sub-event/draw presentation child.
  Do not start it in this invocation.
