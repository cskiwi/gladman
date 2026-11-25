---
title: 'DR-011b: Player editor chrome and feedback'
description: 'Responsive editor actions, native tab state and visible load/save feedback.'
---

## Identity and scope

- ID: DR-011b. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-011](DR-011-player-editing.md). DR-011a is approved and complete.
- Design rules: [refresh plan](../README.md).
- Mounted consumer: `/players/glenn-latomme/edit`, confirmed hydrated on 2026-11-25.
- Project: `frontend-pages-player`; only [page component][component], [template][template],
  unused page stylesheet and focused page tests.
- Preserve route, player query, translations, child instances/forms, permissions, mutation payloads and navigation.
- Exclude profile/claims/ranking presentation, shared components, global theme and dependencies.

## Baseline and approach

- Started on existing `main` with a clean worktree; no branch/worktree creation.
- Browser confirms three mounted tabs, populated Profile, pristine Save all disabled, Save current enabled.
- The legacy `activeIndexChange` listener cannot synchronize native Tabs `valueChange`; saves can target Profile
  while Claims is selected.
- Unsaved/error markup uses orange/red palettes; loading uses inline height.
- Local MessageService has no Toast outlet, hiding child and orchestration notifications.
- Existing shared page header and page/form boundary already provide meaningful reuse.
  Keep them; no additional one-consumer smart/presentational wrapper.
- Use wrapping actions, native Tabs model change, native Message/ProgressBar/Toast and semantic loading text.
- Remove only the unused page `.claims-section .claim-item` rules; preserve block host layout with a host class.
- Verify invalid profile Save all cannot report success/navigate and pending saves cannot be dispatched twice.
  These checks are directly coupled to restoring visible save feedback.
- Do not submit a real profile, claims or ranking mutation for browser verification.

## Implementation checklist

- [x] Confirm mounted consumer, scope and prerequisites.
- [x] Simplify chrome and feedback with native styled components.
- [x] Preserve child forms and wire saves to the actual selected tab.
- [x] Record focused checks and before/after utility/style comparison.
- [x] Persist review status and exact next action.

## Acceptance and verification

- [x] Tabs selection and Save current agree for Profile/Claims; Ranking has no parent save action.
- [x] Unsaved, named loading and load-error states are explicit and semantic.
- [x] Local save notifications render in fixtures; invalid/rejected saves cannot report all-save success or navigate.
- [x] Pending saves prevent duplicate dispatch and recover after success/failure.
- [x] Light/dark and narrow/wide chrome geometry and native tab keyboard/focus behavior remain usable.
- [x] Relevant Nx lint/build/focused tests pass.
- [x] No new palette utilities, SCSS, inline CSS, pass-through or global/shared changes.
- [ ] All relevant contrast checks pass: inherited light failures remain DR-033/034/076.
- [x] User approves completion with disclosed verification limits; no unperformed check is claimed.
- [ ] Full contrast/screenshot, screen-reader/touch, locale-switching, live save and SSR/hydration audit.

## Evidence and handoff

- Before: mounted dark editor, three tabs; read only, no mutation.
- Actions now wrap within the existing shared header; native tab icons are decorative, not accessible-name glyphs.
- Installed PrimeNG Tabs `value` is a `ModelSignal<string | number | undefined>`; use its `valueChange`,
  retaining the repository's undefined guard/string conversion pattern. No `any` event adapter remains.
- Save current only dispatches the selected dirty Profile/Claims child; Ranking uses its unchanged own workflow.
  Pristine current-save is disabled. Save all retains dirty-child selection and relative detail navigation.
- Parent saving state disables its actions and rejects duplicate entry until all started children settle.
  `Promise.allSettled` prevents a partial rejection from re-enabling actions while another child still saves.
- Invalid dirty Profile uses the existing child validation entry point before any all-save mutation:
  the child reports validation without rejecting, so the parent must not mistake it for success.
  Child rejection now has visible local native error feedback, rather than a silent parent catch.
- Query failure or a missing player returns explicit native error feedback, not blank content.
  Child fields, permissions, queries and mutation payloads remain unchanged.
- Removed unused Card import, obsolete event handler and unused page stylesheet.
  Retained block host layout with a host class. Class attributes: 17 to 12; class tokens: 46 to 24;
  palette tokens: four to zero; inline style bindings: one to zero.
- Existing page/form-child boundary retained. Native primitives supply reuse; no new wrapper or extraction is justified.
- Exceptions: none. Native Toast breakpoint sizing is a documented component option, not custom stylesheet/token CSS.

### Nx and repository validation

- `npx nx run frontend-pages-player:test --runInBand --testPathPatterns=edit.*component.spec.ts
--output-style=static`: pass, eighteen tests in two suites; eleven new page cases and seven unchanged profile cases.
- Page cases cover actual native tab selection/save targeting, pristine/Ranking disabling, retained inactive dirty
  state, existing permission inputs/cancel, named loading and missing/read failures, local Toast delivery,
  invalid Profile all-save prevention, pending/rejected current saves, partially rejected all-save settlement and
  successful dirty-child all-save navigation. Child saves/navigation are mocked where consequential.
- `npx nx run-many -t lint build -p frontend-pages-player --output-style=static`: pass, twelve tasks including
  ten dependency tasks. Twenty existing lint warnings remain; none in the changed files.
  Both commands repeated after the final percentage-based Toast fix.
- Initial Windows command with a pipe in `--testPathPatterns` was interpreted as a shell pipeline; no test ran.
  The final single `edit.*component.spec.ts` pattern selects both suites without shell metacharacters.
- Initial page tests caught an incorrect asymmetric `toBe` assertion and the existing asynchronous claims-control
  permission initialization behavior. Corrected the assertion and limited the chrome test to the actual permission
  predicate; the claims behavior is recorded for DR-011c, not silently fixed or claimed to pass.
- Existing ts-jest isolatedModules/emitDecoratorMetadata advisory remains. No dependencies or tooling added.
- No full application build or live backend mutation.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 22 of 34 targets pass from cache;
  twelve reproduce existing `@nx/dependency-checks` failures outside this slice, matching DR-011a:
  backend-seo, backend-health, i18n, shared, backend-authorization, backend-search, backend-ranking, utils,
  backend-translate, backend-database, frontend-modules-translation and backend-graphql.
  No unrelated dependency manifests or findings were changed.
- Scoped Prettier, LF/frontmatter/local-link/registry and whitespace checks run for the final handoff.

### Browser evidence

- Browser Task Group confirmed the real mounted editor and missing local Toast outlet before editing.
  Final group cleanup closed its Agent Tab. The user's original Chrome tab was not changed.
- Integrated-browser Playwright was used for viewport, geometry, runtime fixtures and screenshot crops because
  Browser Code Mode does not provide viewport sizing or arbitrary DOM/runtime evaluation.
- Four settled normal cases: light/dark at 390px/1440px.
  No document overflow or clipped heading/actions/tablist/warning; actions retain usable wrapping.
  ArrowRight/Enter selects Claims and disables its pristine current-save; ArrowRight/Space selects Ranking,
  where current-save stays disabled. Returning to Profile restores enabled current-save and retains the edited phone.
  Focus remains on the Claims tab with native `:focus-visible`. No save action was submitted.
- Loading/error runtime fixtures show translated named ProgressBar/status and native error alert with no forms.
  These change existing component/resource signals only; they are not real network-failure workflow evidence.
- Four busy/Toast iterations verify disabled actions/busy state, recovery, three native alert severities,
  named closes and Enter/Space dismissal. No persisted data or operational action is changed.
- Initial native Toast `95vw`/`2.5vw` sizing clips its leading edge at -5.25px with a narrow vertical scrollbar.
  Native `95%`/`2.5%` breakpoint sizing fixes it: front toast bounds 9.38px to 365.63px inside 375px client width.
  Final narrow/wide iterations in both themes pass Toast bounds and all twelve keyboard dismissals.
- Early samples taken before tab rendering, leave transitions or body color transitions settled are rejected.
  Final tab checks wait for actual selected attributes and save-button state; contrast samples wait beyond the
  observed 0.3-second body background transition. No failed preliminary sample is counted as a pass.
- Settled sampled contrast, dark/light: heading 16.23/18.20:1; subtitle 8.74/4.46:1;
  primary Button label 10.10/3.65:1; unsaved warn Message 7.65/2.83:1.
  Colors converted through a one-pixel sRGB canvas and composited over actual ancestor backgrounds.
  Light subtitle, Button and warn Message fail 4.5:1; these remain DR-076, DR-033 and DR-034 respectively.
  No shared/theme patch or page-local override was added.
- Inspected sanitized dark-wide and light-narrow header crops; no private field screenshots are committed.
  This is not a full screenshot or contrast audit.
- During checks, the pre-existing frontend stopped responding and an HMR sequence produced transient injection/
  view-transition errors. Backend translation endpoint remained HTTP 200.
  Started a temporary `npx nx run app:serve --output-style=static` helper and verified frontend HTTP 200;
  a fresh reload restored the mounted checks. Stopped only that helper's process tree after verification.
  No cache deletion, dependency change or unrelated server termination.
- All fixtures were ephemeral; returning to `/` removes editor state. Restored initial home URL,
  dark preference and measured 1571x1272 viewport geometry. Browser Task Group finalized successfully.
- Full screenshot/contrast, screen-reader/touch, locale-switching, real save success/permission/navigation and
  SSR/hydration checks remain unperformed. Page-local Toast survival after real all-save navigation is not verified;
  unit checks establish message emission and navigation, not a destination-page success notification.

### Exact next action

- Explicit approval on 2026-11-25: `Approve DR-011b with documented limits and commit`.
  This authorizes completion and the scoped commit with inherited DR-033/034/076 contrast failures and the disclosed
  full screenshot/contrast, screen-reader/touch, locale, live-save/permission/navigation and SSR/hydration limits.
  Keep those criteria unchecked; approval is not evidence that an unperformed or failed check passed.
- DR-011b is Done by that approval. Commit only its page implementation/tests and DR-011/b handoff; no push.
- DR-011 stays open. Exact next candidate: scope DR-011c, including the recorded asynchronous claims
  permission-control initialization finding.
- DR-076 is a deferred shared-header subtitle contrast audit; no implementation is started.
- Do not begin another child or shared contrast correction in this invocation.

[component]: ../../../libs/frontend/pages/player/src/pages/edit/page-edit.component.ts
[template]: ../../../libs/frontend/pages/player/src/pages/edit/page-edit.component.html
