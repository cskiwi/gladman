---
title: 'DR-017p: Assembly loading feedback'
description: 'Readable localized feedback and an accessible name for the mounted assembly loading indicator.'
---

## Identity and scope

- ID: DR-017p. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Completed DR-017a-o remain unchanged.
- Design rules: [design refresh](../README.md). Owner: unassigned.
- Project: `frontend-pages-competition`.
- Confirmed real consumer on 2026-10-31: the supplied `/competition/assembly` URL naturally rendered an unnamed
  ProgressBar while its team/encounter data loaded. Browser page `09485711-8723-4949-a298-4c4ba2e95b61`.
- Source: [AssemblyComponent template][template], mounted by [PageAssemblyComponent][page] through
  [competition routes][routes].
- Scope: only the `dataService.loading()` branch, shared by desktop and mobile.
- Preserve indeterminate native progress, existing loading/loaded priority, data/service methods, form state,
  selection, download/save, localization and SSR/hydration.
- Exclude completed lineup/search/dialog/statistics surfaces, services, translation assets, shared/global styling,
  authentication, error/unselected presentation and the permission-only change-team block.

Mounted verification URL:

```text
http://localhost:3000/competition/assembly?encounter=265295ec-5fbe-48f0-adcf-c0ffd6af3d57&team=1161b779-2cbe-457c-b829-e0d756ff99bc&club=cb0cfc70-d93c-4e81-92e6-07b5724d40b0&season=2026
```

## Baseline and approach

- The real initial navigation snapshot exposes an unnamed `progressbar`, with no readable loading explanation.
- Browser-local signal replay on the mounted component confirms no `aria-label`, `aria-labelledby` or
  `aria-valuenow`, and no loading status element. Replay performs no backend mutations.
- Keep native styled PrimeNG ProgressBar; add existing `all.loading.players` copy as a semantic polite status
  and use `aria-labelledby` on the native progressbar host.
- PrimeNG's generated ProgressBar accessibility docs recommend `aria-label`/`aria-labelledby`.
  Installed PrimeNG 22 renders `role="progressbar"` on its host; use a native attribute, not an invented input.
- Two elements do not warrant a new smart/dumb wrapper. The one existing branch already serves both responsive
  layouts; no duplicate styling or behavior is introduced.
- Baseline: zero authored loading utility tokens. Final: five (`flex flex-col gap-2`, `m-0 text-color`).
  One flex container spaces text/progress; margin reset and semantic text improve readability. Native animation/colors
  are unchanged. The first muted-text attempt failed light contrast at 4.46:1 and was corrected to `text-color`;
  only the corrected final state is accepted as passing.
- The existing CDK stylesheet is excluded; its removal would be unrelated to loading feedback.

## Implementation

- [x] Confirm the mounted route and scope one child.
- [x] Add readable localized status and a native accessible association.
- [x] Preserve loading priority and completed consumers.
- [x] Record exact utility usage and zero new styling exceptions.
- [x] Record silent error/unselected feedback as DR-017q in the backlog.
- [x] Record the unconfirmed permission-only change-team block; do not add a consumer for it.

## Acceptance and verification

- [x] Real English/Dutch/French assets resolve the status and associated progress-bar name in component tests.
- [x] Native indeterminate mode has no misleading progress percentage.
- [x] Loading feedback appears regardless of responsive branch/previous loaded state, and disappears on completion.
- [x] Loaded layout, initial unloaded state and stored-error gates retain their pre-existing behavior in tests.
- [x] Light/dark 360/390/768/1440px feedback fits and preserves adjacent filter access.
- [x] Status naming, text contrast and keyboard focus preservation pass.
- [ ] Native progress value/track contrast passes in both themes: light 2.97:1 fails 3:1; DR-038 tracks it.
- [x] Mounted Dutch loaded SSR excludes stale loading feedback; fresh hydrated client transitions preserve naming.
- [ ] A forced loading-state server-rendered response is verified.
- [x] Relevant Nx test/lint/build checks pass.
- [ ] Actual screen-reader announcement behavior is verified.
- [x] User completion approval is recorded before commit, with disclosed verification limits retained.

## Evidence and handoff

- Before: initial integrated-browser navigation plus local signal replay described above.
- Changed production scope: only the template's loading branch. Eight new [component tests][tests] cover real
  locale assets, native styling/indeterminate semantics, mobile/desktop priority, repeated loading, form retention,
  and existing unloaded/stored-error gates. No TypeScript application logic changed.
- After: eight fresh isolated Chrome cases, each light/dark at 360/390/768/1440px with a 900px viewport height.
  Let the real route finish loading, replay only the mounted service's loading signal, and wait for the old lineup
  DOM to disappear and theme transitions to settle before measuring. No admin or save operation is invoked.
  Each case verifies one named bar, readable status, no false `aria-valuenow`, zero lineup Cards while loading,
  no overflow, unchanged Season focus, Tab to Club and restoration of the correct loaded mobile/desktop branch.
  All eight isolated screenshots were inspected and show readable unclipped loading feedback.
- Geometry: bar widths 332/362/726/1280px at x=14/14/21/80px, respectively; document widths equal the viewport.
- Final text contrast: 18.20:1 light / 16.64:1 dark, passing 4.5:1 in all eight cases.
- Preserved native ProgressBar contrast: light value/track 2.97:1 (fails 3:1), value/canvas 3.35:1 (passes);
  dark value/track 8.81:1 and value/canvas 10.63:1 (pass).
  Browser canvas sRGB luminance calculations use the actual settled computed colors. No scoped token workaround.
- Both final integrated and isolated matrices report zero page errors, hydration diagnostics or GraphQL mutations.
  This is not actual screen-reader output or exhaustive hydration evidence.
- SSR: read-only `Invoke-WebRequest -UseBasicParsing -Uri '<mounted verification URL>'` returns HTTP 200,
  `assembly-base-title` and no `assembly-loading-status`, progress association or unresolved loading key.
  The real server response is already loaded; a forced server-loading response was not tested.
- Validation, rerun after correcting text contrast:

  ```text
  npx nx run-many --targets=test,lint,build --projects=frontend-pages-competition --output-style=static
  ```

  Passed: 305 tests in 19 suites (8 new), lint with 41 existing warnings and zero errors,
  production library build and all 10 prerequisites.
  Repository Prettier formatted all five changed slice/test/handoff files before validation.

- Browser validation command: PowerShell here-string piped to `node -`, using existing
  `require('playwright').chromium.launch({ channel: 'chrome', headless: true })` and a new isolated page.
  The bounded browser is closed in `finally`. Initial default headless-shell launch failed because that bundled
  executable was absent; installed system Chrome succeeds without any installation or dependency changes.
- The integrated screenshot path produced incorrectly clipped captures at wide sizes despite correct DOM geometry.
  Those captures are not accepted evidence; the isolated Chrome screenshots replace them.
  Retained local evidence: session `files/dr017p-isolated-{light,dark}-{360,390,768,1440}.png`.
  Repository-backed observations above are the durable handoff; screenshots are not committed.
- Styling exceptions: none introduced. Native contrast failure is recorded as DR-038, not silently corrected globally.
- Not verified: actual screen-reader announcements, forced server-loading SSR, mounted English/French,
  authenticated/save success/error workflows, interaction at every intermediate width, exhaustive hydration,
  timing/announcement under real network failures and reduced-motion/forced-colors rendering.
- Approval on 2026-10-31: the user selected
  "Approve completion and commit with the disclosed verification limits". Authoritative status is Done.
  Approval explicitly accepts the recorded native light contrast failure and unchecked verification limits;
  it does not turn failed or unperformed checks into passes.
  Only this slice/tests/handoff are approved for commit; no push.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects
  with existing warnings and zero errors. Subsequent edits record approval/results only; no application change.
- Exact next action in a fresh invocation: confirm and scope DR-017q's load-error/unselected feedback.
- DR-017 remains open; DR-017q is the separate next candidate, not an implementation started here.

[template]: ../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html
[page]: ../../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.component.ts
[routes]: ../../../libs/frontend/pages/competition/src/lib.routes.ts
[tests]: ../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly-loading-feedback.component.spec.ts
