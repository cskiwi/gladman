---
title: 'DR-011c: Player claims form'
description: 'Native grouped claims selection and reliable local permission, dirty and save states.'
---

## Identity and scope

- ID: DR-011c. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-011](DR-011-player-editing.md). No incomplete prerequisites.
- Design rules: [refresh plan](../README.md).
- Mounted consumer: `/players/glenn-latomme/edit`, Claims tab, confirmed on 2026-11-25.
- Project: `frontend-pages-player`.
- Sources: [component][component] and [template][template].
- Scope: category presentation, names/descriptions, local loading/error/saving states, asynchronous permission
  initialization, bulk selection dirty tracking and safe child save lifecycle.
- Directly dependent scope: missing permission/empty-state translations in the three existing locale catalogs
  and their automatically regenerated i18n type.
- Preserve permission predicate, category/name sorting, selected IDs, GraphQL payload/refetch and parent save entry points.
- Exclude profile, ranking, parent chrome, backend authorization, shared/global styling and dependency changes.

## Baseline and approach

- Clean existing `main`; DR-011a/b approved commits present.
- Mounted baseline: 59 checkbox choices, 18 category headings, zero Panels and 59 custom bordered choice wrappers.
- Numbered primary heading colors, manually styled choice tiles, unwrapped category actions and inline progress height.
- Loading data can appear as empty; no named loading progress. Checkboxes have labels but no description association.
- Controls added after the permission effect runs can stay enabled. Bulk actions do not mark the form dirty.
- Existing page/form-child separation is appropriate; no repeated domain structure warrants another wrapper.
- Use direct native Panel headers/actions, Checkbox labels/descriptions and named progress/status feedback.
- Use only necessary responsive layout utilities and semantic text colors; add no styles or pass-through bindings.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and one bounded child.
- [x] Preserve selection, categories, permission predicate and mutation payload/refetch.
- [x] Replace custom presentation with native PrimeNG and semantic markup.
- [x] Cover delayed controls, bulk dirty state and save recovery with focused tests.
- [x] Leave shared/global code and adjacent forms unchanged.
- [x] Persist exact validation and review limits in this brief and backlog.

## Acceptance and verification

- [x] Grouped native controls have visible names; descriptions are included in their associated labels.
- [x] Bulk/category selection affects only intended controls and enables the parent dirty/save flow.
- [x] Unit checks: late-loaded controls obey permissions; blocked/busy actions cannot mutate or submit claims.
- [x] Unit checks: loading, empty, read failure, saving and rejected save remain explicit and distinguishable.
- [x] Successful mocked saves preserve payload/refetch, report success and clear dirty state.
- [x] Safe three-choice fixture: light/dark at 390px/1440px remain usable without page overflow.
- [x] Fixture keyboard focus, checkbox Space and category Enter/Space actions verified.
- [ ] Full mounted-catalog theme/width matrix, browser state matrix and sampled contrast verified.
- [x] No new palette utilities, styles, dependencies or shared/global changes.
- [x] Focused existing Nx test/lint/build checks pass.
- [ ] Full visual/accessibility, screen-reader/touch, locale, real-save and SSR/hydration checks pass.
- [x] User explicitly approved completion with the disclosed limits; unperformed checks remain unchecked.

## Evidence and handoff

- Mounted after evidence before the local service interruption: 18 native Panels/groups and 59 checkbox labels.
  The existing external-browser authenticated tab exercised native Space and enabled the parent's current-save action
  after rendering settled. An early immediate disabled-button read was superseded by a settled enabled read.
  Reload discarded edits; no Save or operational/admin action was submitted.
- Grouped presentation uses native Panels, named native buttons and Checkbox label associations.
  Descriptions are part of each checkbox's accessible name, not a separately claimed `aria-describedby` relationship:
  the installed Checkbox has no native description input, and no pass-through binding was introduced.
- Permission setup now depends on loaded claims as well as authorization/loading/saving, fixing the late-control race.
  Bulk actions mark only changed controls dirty; pending controls/actions are disabled.
  A denied/unavailable save rejects explicitly; missing/partial mutation results cannot report success.
  Confirmed successful saves mark the form pristine; rejected/unconfirmed saves retain edits.
- Missing `messages.no-claims` and `messages.no-permission` keys were observed in the anonymous integrated browser.
  Added both to English, Dutch and French catalogs; the existing generator updated only their two i18n type entries.
  JSON checks confirm both messages exist in all three catalogs. Post-change live locale rendering is not verified.
  Existing English read/save error copy and data-driven category/name text are not a complete localization pass.
- Static template metrics: class attributes 19 -> 13; utility tokens 60 -> 43; unique utilities 44 -> 25.
  Removed numbered heading colors, choice tile borders/hover/transition classes and inline progress height.
  Remaining wrapping, grid, spacing and typography utilities serve layout/readability.
  No SCSS, inline/global workaround, new wrapper, dependency or theme change.

### Automated validation

- Repository Prettier run for every changed document, template, component, test, catalog and generated type.
- `npx nx run frontend-pages-player:test --runInBand`
  `--testPathPatterns=player-claims.component.spec.ts page-edit.component.spec.ts player-profile.component.spec.ts`
  `--output-style=static`: passed, three suites/28 tests (ten claims, eleven editor, seven profile).
  Existing ts-jest isolated-module/decorator metadata warning remains.
- `npx nx run-many -t lint build -p frontend-pages-player --output-style=static`: passed, twelve tasks,
  ten cached. Twenty existing lint warnings remain; no lint errors or new warnings.
- Initial fixture construction imported the server model at runtime, causing an ESM Jest failure.
  Corrected to type-only model import and plain safe fixtures; the final run above passes.
  A pipe-separated selector was rejected by the Windows command shell; the final selector uses three arguments.
- Scoped translation JSON/key checks, static no-forbidden-utility/binding check and `git diff --check`: passed.
- Final handoff: LF/frontmatter, 498 local links and whitespace checks pass across ten changed files.
  Git emits existing LF-to-CRLF index configuration warnings;
  actual changed files use LF.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 22 of 34 targets pass
  (nineteen successful targets cached); twelve fail existing `@nx/dependency-checks`, matching DR-011b:
  backend-seo, backend-authorization, backend-health, shared, backend-ranking, backend-search, i18n, utils,
  backend-translate, frontend-modules-translation, backend-database and backend-graphql.
  Failures concern unchanged dependency manifests/version ranges, unused dependencies and missing peer declarations.
  No unrelated manifest fixes, package installation or dependency changes were made.

### Browser evidence and limits

- External Browser Task Group confirmed the real mounted catalog and settled checkbox/current-save behavior.
  Its Agent Tab was closed and Task Group finalized successfully; the user's existing tab was not changed.
- Integrated browser supports viewport sizing and DOM/runtime fixture inspection unavailable in Browser Code Mode.
  Its unauthenticated editor initially showed the existing untranslated permission state.
  A child-only runtime permission predicate and synthetic three-choice/two-category catalog exercised presentation;
  no authentication state, network authorization or persisted permissions were modified.
- Four settled fixture cases: dark/light at 390px/1440px, height 900px.
  Client/document widths match (375px at narrow due to scrollbar, 1440px wide).
  Panels, buttons, labels and groups remain within the client width.
  Category Enter selects exactly two example choices, leaves the other category unselected;
  category Space clears them. Checkbox Space selects exactly one and retains native `:focus-visible`.
- These fixture checks do not establish full mounted-catalog visual or workflow coverage.
  Before screenshots, state fixtures and measured contrast could finish, the local app/API became unavailable.
  Browser observed aborted reads, GraphQL 502 and an SSR 500 timeout; localhost 5000 had no listener.
  This interruption was not counted as a claims error-state verification or a passing SSR test.
- Attempted a temporary `npx nx run app:serve --output-style=static` helper.
  It did not reach responsive readiness; bounded frontend/backend HTTP probes returned code 000.
  Stopped only that helper's tool-owned process tree. Did not restart or terminate other users' services,
  clear caches, install packages or start backend jobs for visual testing.
- Removed runtime fixtures by document replacement; integrated viewport restored to its initial 1024x768.
  Temporary dark/light changes were document-only; no stored theme preference was changed.
  Integrated test page left at `about:blank`, without a private-data screenshot.
- No screenshot/contrast audit, complete browser state matrix, screen-reader/touch, locale-switching,
  real permission save/navigation or SSR/hydration pass is claimed.
  Shared light Button/warn Message/subtitle findings remain DR-033/034/076; no shared fix was attempted.

### Exact next action

- Explicit approval on 2026-11-25: `Approve DR-011c with documented limits and commit`.
  This authorizes completion and the scoped commit with the service-interrupted mounted-catalog, screenshot/contrast,
  browser-state and translated-label checks plus the disclosed full accessibility, locale, real-save/navigation
  and SSR/hydration limits. Inherited DR-033/034/076 findings remain open.
  Keep those criteria unchecked: acceptance is not evidence that an unperformed or failed check passed.
- DR-011c is Done by that approval. Commit only its implementation, tests, locale/generated entries and handoff;
  no push or workflow changes.
- Remaining checks can resume after the local frontend/API recover outside this slice's operational scope,
  without submitting a real permission mutation solely for visual validation.
- DR-011 remains open. Exact next candidate: scope DR-011d ranking form and confirm its mounted consumer
  in a subsequent invocation; do not start it here.
- Exceptions: none introduced.

[component]: ../../../libs/frontend/pages/player/src/pages/edit/components/player-claims/player-claims.component.ts
[template]: ../../../libs/frontend/pages/player/src/pages/edit/components/player-claims/player-claims.component.html
