---
title: 'DR-017r: Assembly guidance and search Card parity'
description: 'Native change-team guidance and desktop Card presentation for responsive assembly searches.'
---

## Identity and scope

- ID: DR-017r. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Dependencies: approved DR-017c/DR-017j.
- Design rules: [design refresh](../README.md). Owner: unassigned.
- Project: `frontend-pages-competition`.
- Confirmed consumer: user-supplied mounted element on `/competition/assembly` with the existing
  encounter/team/club/season query parameters, 2026-10-31. The attachment shows localized change-team
  guidance and the outlined Edit button below the desktop player list.
- Mobile/desktop captain/add-player are also confirmed mounted in the preceding four-case browser audit.
- Scope: [assembly template][template] and its existing [search tests][tests], plus repository handoff.
  Use the desktop native Card presentation on mobile and native Card for change-team guidance.
- Preserve search labels/full-name suggestions, dispatch, form state, responsive order, loaded-state priority,
  desktop pool membership/availability, permissions and the currently handlerless Edit button.
- Exclude Save popup (DR-017s), new navigation/Edit behavior, mutations, services, translations, shared/global
  styling, CDK styles, lineup selectors and completed unrelated children.

## Baseline and approach

- Attachment confirms custom `mt-4 bg-emphasis border border-surface rounded-border p-5` guidance container:
  six utility tokens, paragraph and native outlined secondary Button.
- Desktop captain is already in a named native Card; add-player is grouped inside the desktop player-pool Card.
  Mobile renders both search templates without Cards. Preserve mobile captain-first/add-player-last order.
- Move the existing captain Card into its named template, so both responsive consumers author its surface once.
  Mobile add-player gains the matching player Card surface/title without adding a mobile player list or behavior.
  Reuse the existing add-player search template unchanged.
- Replace custom change-team surface with a named native Card, associated existing guidance and unchanged Button.
- Existing PrimeNG Card named templates are verified against component docs; no one-to-one wrapper component,
  new smart/service split, theme override or styling exception is justified.
- Current integrated browser is anonymous (`hasEditPermission()` false), despite the user's confirmed permitted
  attachment. Do not spoof browser permissions to claim a mounted permitted check.

## Implementation checklist

- [x] Confirm real consumers, approved dependencies and bounded scope.
- [x] Use native Cards with shared captain presentation and matching mobile player grouping.
- [x] Preserve permission gates, search behavior, responsive order and existing action contract.
- [x] Add permission/presentation regression coverage to existing component tests.
- [x] Record utility comparison, verification limits and remaining functional work.

## Acceptance and verification

- [x] Both branches have one named captain Card and an add-player input inside the player Card.
- [x] Mobile still has 13 lineup Selects, no desktop pool or added player-management behavior.
- [x] Change-team uses native Card only on the existing permitted desktop branch, verified in component tests.
- [x] Existing guidance/Button translation keys and handlerless Edit behavior are unchanged.
- [x] Search selection, empty results, captain storage, add-player dispatch and responsive ordering pass.
- [x] Light/dark narrow/wide fit and search keyboard/overlay behavior are checked.
- [ ] Permitted mounted guidance pixels, focus and quantitative contrast pass after the change.
- [x] Real Dutch loaded SSR and fresh responsive client rendering pass; three locales retain search label tests.
- [ ] Actual screen-reader output, mounted English/French, quantitative new-surface contrast and exhaustive
      SSR/hydration/authenticated workflows are verified.
- [x] Existing focused Nx test/lint/build tasks pass.
- [x] User completion/commit approval is recorded with disclosed limits; unperformed checks stay unchecked.

## Evidence and handoff

- User element snapshot is read-only and remains outside the repository; do not copy personal screenshots into Git.
- Changed scope: template, existing test suite and this brief/backlog/parent handoff.
- Native captain Card moves into the existing named template, removing the former desktop-only wrapper.
  Both branches reuse that surface and unchanged AutoComplete/FloatLabel behavior.
  Mobile add-player has a named player Card with the existing desktop title and unchanged search template;
  it does not gain desktop pool controls or alter mobile captain-first/add-player-last ordering.
- Change-team is a named native Card with `aria-describedby` pointing to existing guidance.
  Six custom surface/spacing tokens are replaced by one paragraph `mt-0` token.
  The mobile player heading adds three layout/type tokens (`text-base font-semibold m-0`).
  Card appearance remains native; no new palette utility, styles, duplicate captain surface or wrapper component.
- Four added permission regressions exercise desktop/mobile with both permission outcomes using the real
  permission computation and expected club/global permission names.
  Permitted desktop verifies native named Card, associated guidance and unchanged secondary outlined Button;
  clicking it retains the existing no-action contract and does not dispatch player/captain changes.
  Updated responsive-grouping tests check native Cards, ordering, names, no nested Cards and 13 mobile Selects.
- Initial focused run: 24 pass / 2 fail because the test wrongly searched for a descendant `.p-card`;
  PrimeNG's Card is the host. Assertions now check for no nested `p-card` elements instead.
  No production workaround was needed.
- A Windows `npm.cmd` call stripped regex quoting and treated `|` as a pipe; no tests ran in that attempt.
  The array-selector call below forwarded only the player-pool/search selectors, so the actual two-suite
  result is recorded rather than assuming all five ran. The mobile selector command covers the omitted suites.
- Passed commands after formatting all five changed files:

  ```text
  npx nx run frontend-pages-competition:test --testPathPatterns assembly-player-searches assembly-player-pool assembly-mobile-singles assembly-mobile-doubles assembly-mobile-substitutes --output-style=static
  npx nx run frontend-pages-competition:test --testFile=assembly-mobile --output-style=static
  npx nx run-many --targets=lint,build --projects=frontend-pages-competition --output-style=static
  ```

  Actual results: 37 tests in two search/pool suites, plus 37 tests in three mobile suites;
  74 tests in five suites total. Lint: 41 existing warnings, zero errors.
  Production library build and ten prerequisite tasks pass. Full competition suite is not rerun.

- Eight fresh isolated installed Chrome contexts: light/dark at 360/390/768/1440px, height 900px.
  PowerShell here-string piped to `node -` uses existing Playwright
  `chromium.launch({ channel: 'chrome', headless: true })`, with contexts/browser closed in `finally`.
  The real query-restored route waits for the Angular loaded/responsive branch, not transient SSR DOM.
  Native captain/player Card computed background, color and radius match in every case.
  Card names, viewport/text fit, one of each input, captain-before-add ordering and responsive counts pass.
  Mobile retains 13 lineup Selects/no desktop pool; desktop retains its pool and no mobile Selects.
- Both real search inputs query existing player names without selection or operational changes.
  Suggestions open; ArrowDown/Escape leaves focus on the input. Test text is cleared; each isolated context closes.
  All eight cases report zero page errors and zero GraphQL mutation requests.
  Anonymous permission gates remain false and guidance remains absent, as intended.
- Six scoped screenshots in session `files/dr017r-after-{captain|add}-...png` were inspected:
  captain at 390/1440px in both themes, plus mobile add-player at 390px in both themes.
  Native surfaces, readable labels/title and fit are confirmed. No permitted guidance screenshot is claimed.
  Durable evidence is the observations here; screenshots are not committed.
- SSR read-only `fetch` returns HTTP 200 for the supplied loaded route.
  Its actual `app-assembly` subtree contains the Dutch named captain Card and desktop player Card,
  without unresolved captain copy. Fresh mobile contexts render the new Cards after client responsiveness.
  This is not authenticated SSR, exhaustive hydration or mounted English/French evidence.
- Actual screen-reader output, quantitative new-surface text/focus contrast, permitted guidance
  pixels/keyboard/contrast, mounted English/French and operational Save/Edit/PDF remain unverified.
  Existing focused FloatLabel contrast failure stays DR-031; no page/global token workaround is introduced.
- Passed: repository Prettier (`npm exec -- prettier --write --end-of-line lf`) on all five scoped files;
  application/template tests remain unchanged by the final documentation formatting.
- Passed: `git diff --check`, and a read-only Node scan checks 185 inline/reference relative link targets
  across the three handoff documents with none missing; their actual line endings are LF.
  Git's future-checkout CRLF warnings are recorded, not worked around by changing repository configuration.
- Exceptions: none. No dependencies, service/backend/translation changes or operational mutations.
- The user selected "Approve completion and commit with disclosed verification limits" on 2026-10-31.
  Approval accepts the unavailable post-change permitted guidance pixels/focus/contrast, existing FloatLabel
  contrast issue and recorded screen-reader/locale/authenticated/exhaustive hydration limits.
  It does not establish that failed or unperformed checks passed. DR-017r is Done by explicit approval.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects with existing
  warnings and zero errors. No subsequent application change requires rerunning the passing focused tests/build.
- Only this slice's template/tests and its brief/backlog/parent handoff are approved for commit; no push.
- Exact next action in a fresh invocation: reconcile DR-017 parent completion with DR-017s Save deferral
  and preserved child limits, then obtain separate parent approval. Do not start another UI slice here.

[template]: ../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html
[tests]: ../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly-player-searches.component.spec.ts
