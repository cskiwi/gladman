---
title: 'DR-019f: Tournament detail feedback'
description: 'Competition-aligned native loading and error feedback on the mounted tournament detail route.'
---

## Identity and scope

- ID: DR-019f. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-019](DR-019-tournament-browsing.md). Dependencies: completed DR-019a/c/d.
- Rules: [design refresh](../README.md).
- Mounted consumer confirmed on 2026-11-02:
  `/tournament/8658b541-702a-408e-8114-2858a9428069`, Internationaal Tornooi Lokerse BC 2023.
- Project: `frontend-pages-tournament`.
- Sources: [template](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.html),
  [component](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.ts),
  [resource](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.service.ts) and its existing component tests.
- Preserve request/query, error text mapping, routes, translations, loaded content, permissions and SSR.
- Exclude completed hero/live/events, club browsing, draw contracts, destinations, shared/global styling and operations.

## Baseline and approach

- Clean worktree at selection. Integrated browser confirms the supplied live consumer and loaded Dutch heading.
- Existing loading branch: fixed-width Skeletons, decorative rectangular crest, hand-built surface and metric grid.
  Four class attributes contain 16 tokens; fixed inner widths require narrow-screen verification.
- Existing error branch: custom loss-token inline background/text and an unnamed decorative icon.
  Two class attributes contain eight tokens, including the icon classes.
- Competition detail already uses an indeterminate native ProgressBar and an error Message.
  Reuse those primitives directly, with an existing localized loading accessible name, not a one-to-one wrapper.
- A new failing regression reproduces the resource value throwing on error before feedback can render.
  Guard the read with `hasValue()`, following existing competition draw service prior art.
  Preserve explicit error reporting, existing error messages and request behavior.
- No shared component extraction: only UI primitives are repeated, not meaningful domain behavior.
- No new stylesheet, theme exception, dependency, translation key or operational mutation is intended.

## Implementation checklist

- [x] Confirm mounted consumer, completed prerequisites and one independently reviewable feedback slice.
- [x] Preserve loaded content, gates, request/query, error mapping and existing localization.
- [x] Replace loading decoration/error styling with native named ProgressBar and severity Message.
- [x] Cover pending/success/error/recovery, including missing results and existing HTTP error mappings.
- [x] Avoid shared/global changes; record any out-of-scope discoveries separately.

## Acceptance and verification

- [x] Native indeterminate ProgressBar has a translated accessible name and no fabricated percentage.
- [x] Native non-dismissible error Message exposes the existing mapped error with native alert/polite semantics.
- [x] Loading hides loaded content, success removes feedback, errors render without resource-read exceptions.
- [x] Recovery clears errors; empty event lists remain a successful loaded page.
- [x] Reduced utilities, zero new palette classes, SCSS or equivalent styling overrides.
- [x] Light/dark and narrow/wide loading/error/loaded states fit the viewport.
- [x] Labels, native roles/live semantics and absence of feedback tab stops; keyboard Tab still moves after recovery.
- [ ] Native light error-text contrast reaches 4.5:1 and progress value/track reaches 3:1.
- [x] Relevant Nx lint/build/tests pass with exact commands recorded.
- [x] Loaded Dutch SSR/client content and actual missing-tournament SSR error feedback.
- [x] Existing English/Dutch/French loading assets render as accessible names in unit tests.
- [ ] Actual screen-reader, mounted English/French, authenticated workflows and exhaustive hydration.
- [x] User approval with explicitly disclosed contrast and unperformed verification limits.

## Evidence and handoff

- Changed scope: only loading/error markup/import and one guarded tournament resource selector, plus tests/handoff.
  No query, error mapping, completed loaded content, shared component, theme, translation asset or dependency changes.
  No reusable domain component is warranted; native UI primitives match competition directly.
- Utility comparison from `git show HEAD` versus the edited feedback block: six class attributes/24 tokens become
  two attributes/three tokens. One loss-token inline style and eight Skeleton instances are removed.
  Existing component SCSS is unchanged; retirement requires a separate consumer audit.
- Baseline: controlled browser-local Apollo read pending/failure reproduces Skeleton loading followed by blank failure.
  The first cookie setup used an unencoded name; both original baseline captures are dark 390px, not paired themes.
  That limitation is retained rather than relabelling them as light/dark evidence.
- Final browser matrix: eight isolated Chrome contexts, light/dark at 360/390/768/1440px.
  Cookie setup uses the actual encoded theme name, with an assertion on the resulting document theme class.
  Each starts from the real supplied loaded route and HTTP 200 SSR, then controls only the browser-local Apollo
  read result to hold loading, emit mapped 404 failure and restore the original loaded tournament on resource reload.
  These synthetic failure/recovery cases are not evidence of actual backend outages or a user-facing retry action.
- All eight pass: localized `Toernooi gegevens laden...` name, `role=progressbar`, no `aria-valuenow`,
  no Skeleton/loaded heading while pending, error text `Failed to load tournament`, native error severity,
  `role=alert`/`aria-live=polite`, no dismiss action/new focus stops, viewport fit in all three states.
  Recovery restores the original title and all 132 detail anchors; normal Tab movement resumes.
  Finite Message leave animations settle before asserting removal. No page errors, console errors or mutations.
- Loaded SSR responses contain the same Dutch heading as the browser.
  A separate actual GET of `/tournament/00000000-0000-4000-8000-000000000000` returns HTTP 200 with native error
  Message and existing `An error occurred` fallback, without a resource-read exception.
  HTTP status/error wording are existing behavior, not changed by this slice.
- Settled canvas sRGB contrast, identical across four widths:
  native error text 4.41:1 light (fails 4.5:1), 4.63:1 dark (passes);
  native progress value/track 2.97:1 light (fails 3:1), 8.81:1 dark (passes).
  Existing cross-consumer audits DR-034/DR-038 now include this consumer. No page-specific styling workaround.
- Local captures/results: `DR-019f-before-{light,dark}-390-{loading,error}.png` (both actually dark, as noted),
  `DR-019f-after-{light,dark}-{360,390,768,1440}-{loading,error}.png` and `DR-019f-after-results.json`
  in this session's files directory. Light 390px loading/light 360px error/dark 1440px error were inspected.
  Repository evidence here is sufficient to resume without those local files.
- Exact final commands:
  - `npx nx run frontend-pages-tournament:test --testFile=libs/frontend/pages/tournament/src/pages/detail/page-detail.component.spec.ts --runInBand --output-style=static`
    passes 43 tests, including eight new feedback/localization regressions.
  - `npx nx run-many --targets=lint,build --projects=frontend-pages-tournament --output-style=static`
    passes library lint, default production build and ten prerequisite tasks.
  - `npx nx run frontend-pages-tournament:lint --output-style=static` passes after final test corrections, no warnings.
  - Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects,
    with existing warnings and zero errors.
  - `node C:\Users\glenn\.copilot\session-state\e3d19730-874c-4a02-a17b-50e2dd34bba4\files\verify-dr019f.cjs`
    passes all eight browser cases above; temporary helper removed after use.
  - Repository Prettier formats every changed file. Existing Nx executor/ts-jest deprecation/metadata notices remain.
- Initial failures: new error regression failed before the guarded read (35 existing tests passed).
  Test assertions were corrected to installed PrimeNG 22's native polite live region and icon markup;
  no unnecessary application override was added. First browser run caught stale served code during rebuild;
  later recovery assertion needed to await the native leave animation.
- Not run/passed: real screen-reader announcements, mounted English/French, authenticated workflows,
  exhaustive hydration, real network interruption/retry and an initial SSR pending state.
  No screen-reader pass is inferred from ARIA attributes. Existing English error mapping is preserved.
- Discovery DR-040: competition detail still reads its resource value unguarded. Source inspection only;
  reproduce/investigate its error rendering separately, not as a hidden cross-page change.
- Exceptions: none. Native contrast failures remain explicit review limits, not approved styling exceptions.
- On 2026-11-02 the user selected "Approve DR-019f and commit with disclosed verification limits".
  Approval accepts completion with the failures/unperformed checks above, not proof that they passed.
  Only this child implementation/tests and repository handoff are approved for commit; no push.
- Exact next action in a fresh invocation: confirm a real DR-019e club-browsing consumer and scope that child.
  Keep DR-019 open; DR-019g and DR-040 remain separate investigations.
