---
title: 'DR-011a: Player profile form'
description: 'Native grouped profile fields, semantic validation and explicitly named responsive controls.'
---

## Identity and scope

- ID: DR-011a. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-011](DR-011-player-editing.md). No incomplete prerequisites.
- Design rules: [refresh plan](../README.md).
- Mounted consumer: `/players/glenn-latomme/edit`, default Profile tab, confirmed hydrated on 2026-11-25.
- Project: `frontend-pages-player`.
- Sources: [profile template][template] and [profile component][component].
- Only profile-child presentation, associated native imports and focused tests are in scope.
- Preserve reactive fields, validators, permission disabling/visibility, deferred calendar, date limits,
  dirty/pristine state, parent save entry points and mutation payload.
- Exclude parent chrome/tabs, claims/ranking forms, save semantics, shared components and global styling.

## Baseline and approach

- Three plain groups have numbered primary light/dark headings; validation/editable copy uses red/green palettes.
- Select, deferred DatePicker and Checkbox host IDs do not label their actual focusable inputs.
  Browser baseline confirms missing calendar/checkbox input IDs and unnamed competition checkbox.
- Profile has no local stylesheet. Existing page SCSS remains out of scope.
- Use three native Panels with semantic headings and fluid native fields, semantic metadata and native Message
  validation/error feedback. Retain the single responsive form; no one-consumer presentation wrapper is warranted.
- Preserve existing gender option labels and administrative/service copy; their localization gaps are recorded
  in the parent rather than adding cross-area translation changes to this presentation slice.
- Browser baseline: populated real mounted form in dark mode. No edits or mutations submitted.
  Do not persist private field values or screenshots containing them in repository evidence.

## Implementation checklist

- [x] Confirm mounted consumer, bounded scope and no incomplete prerequisites.
- [x] Refresh only profile presentation with native grouping and feedback.
- [x] Preserve fields, validators, permissions and mutation behavior.
- [x] Remove in-scope palette/inline styling without adding SCSS, pass-through or design-token overrides.
- [x] Record focused checks, utility comparison and out-of-scope findings.

## Acceptance and verification

- [x] Three translated semantic groups render with named fluid controls.
- [x] Required-name and invalid-email feedback is associated with its field and uses native invalid state.
- [x] Calendar and checkbox have translated accessible names; date limit and permissions remain intact.
- [x] Light/dark at 390px/1440px retain usable layout without profile overflow.
- [x] Keyboard focus and Select/DatePicker/Checkbox interactions work without submitting data.
- [x] Saving/error presentation and permission variants have focused tests.
- [x] Scoped Nx lint/build/tests pass.
- [x] Zero new authored palette utilities, SCSS or equivalent inline styling.
- [x] User approves completion with disclosed verification limits; no unperformed check is claimed.
- [ ] Full screenshot/contrast, screen-reader/touch, locale-switching, live save workflow and SSR/hydration audit.

## Evidence and handoff

- Started on existing `main` with a clean worktree on 2026-11-25; no worktree/branch creation.
- Three native Panels now provide personal/contact/competition grouping and real level-two headings.
- Fluid native controls retain the original fields, reactive validators and permission effects.
  Calendar and checkbox IDs now name their actual inputs; Select uses its translated visible label.
- Required-name/email messages use native Message severity and invalid state, with associated descriptions and
  explicit `aria-invalid`. Phone uses native `type="tel"`. Saving uses a named native ProgressBar/status and
  the form's busy state. Removed unused Card/Button imports; no form/service/mutation logic changed.
- Class attributes: 38 to 20; utility tokens: 84 to 65; authored palette tokens: eleven to zero.
  Inline style bindings: one to zero. Remaining utilities provide responsive field grids, spacing, headings and
  minimum-width containment. No SCSS, inline/global CSS, pass-through or token overrides added.
- Existing page/form-child boundary retained. There is no confirmed repeated presentation structure requiring
  a new smart/presentational extraction or a one-to-one native component wrapper.
- Exceptions: none.
- Parent findings and remaining forms are recorded in [DR-011](DR-011-player-editing.md).

### Nx and repository validation

- `npx nx run frontend-pages-player:test --runInBand --testPathPatterns=player-profile.component.spec.ts
--output-style=static`: pass, seven tests, repeated after the final test guard change.
- Tests cover native label associations and deferred calendar date limit; required first/last-name and invalid-email
  feedback/recovery; own-contact versus other-player disabling and hidden admin identifiers; named saving feedback
  and explicit failed-save feedback while retaining dirty fields. Apollo is mocked; no backend save is performed.
- Initial three validation tests failed: native InputText `invalid` adds styling but not `aria-invalid`.
  Explicit semantic attributes fixed that actual accessibility gap; all seven tests then pass.
- `npx nx run-many -t lint build -p frontend-pages-player --output-style=static`: pass after final application
  markup changes; twelve tasks, ten cached. No application compile errors.
- `npx nx run frontend-pages-player:lint --output-style=static`: pass after final test changes,
  24 pre-existing warnings, none in the changed profile files. One initially added test non-null warning was removed.
- Existing ts-jest isolatedModules/emitDecoratorMetadata advisory remains; no configuration/dependency changes.
- Scoped Prettier and Node assertions pass: six files use LF; three documents have valid frontmatter;
  492 local documentation links resolve; DR-011/a-e registry rows are unique with correct statuses;
  profile template has no palette/inline/pass-through regressions. `git --no-pager diff --check` passes.
  Git warns about future CRLF conversion; current file bytes are verified LF.
- Repository Markdown formatting widens the existing registry status column for the open parent's `In progress`;
  historical rows/IDs are retained. The other registry changes are DR-011 and its five newly scoped/deferred children.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: 22 of 34 targets pass;
  twelve reproduce existing `@nx/dependency-checks` failures outside this slice, matching DR-009a-d:
  backend-seo, backend-ranking, shared, backend-health, backend-authorization, i18n, backend-translate,
  backend-search, utils, backend-database, frontend-modules-translation and backend-graphql.
  No unrelated manifests or dependency findings changed.
- No dependency installs, operational mutations or full application build.

### Browser evidence

- Real mounted form confirmed before editing and after restoring fixtures. No save action submitted.
- Playwright browser data was initially server-rendered, so a GraphQL response fixture did not replace it.
  Before capture/testing, temporarily set sanitized data through the existing editor resource in the dev build;
  no DOM styling hacks or permission overrides. Preserved player identity only for existing permission checks.
  Saving/error fixtures set only existing child signals. These are presentation checks, not a live save workflow.
- Four settled normal/validation/recovery cases: light/dark at 390px/1440px.
  All retain three Panels, translated headings and named inputs, with no form/page horizontal overflow.
  Form widths: 287.5px narrow and 1220.5px wide. All non-checkbox controls are at least 100px and stay within the form.
  Each invalid case renders three alerts and three associated invalid inputs; correction removes all alerts.
- Four settled keyboard cases: gender Space opens two options and Escape returns focus;
  calendar ArrowDown opens its body-mounted dialog, which fits horizontally, and Escape returns focus.
  Clicking the competition label toggles its actual checkbox; Space restores the initial state with focus retained
  and native `:focus-visible`. No persisted player data changes.
- Four saving/error fixture cases pass named ProgressBar/status, busy true/false, explicit error alert and containment.
- Initial immediate validation sampling preceded the email render and included the native small checkbox in a
  text-field minimum-width check. Those samples are rejected; settled repeats above pass.
  The first calendar selector assumed an inline overlay; its actual body-mounted dialog is used in passing repeats.
- Sampled label/metadata/inline-validation contrast: light 19.87/4.87/4.83:1; dark 14.52/7.82/4.61:1.
  Computed colors are rendered through a one-pixel sRGB canvas before relative-luminance calculation, including
  composited ancestor backgrounds. These samples are not a full contrast audit.
- Inspected sanitized dark-wide profile and light-narrow contact/error crops in ignored `.playwright-mcp` output.
  An earlier full narrow element capture was obscured by sticky shell chrome; replaced it with the contact crop.
  No private field values or screenshots are committed; this is not a full screenshot matrix.
- Removed route fixtures, reloaded real data and confirmed three Panels, pristine state and zero alerts.
  Playwright restored its initial light preference and returned to its initially blank tab.
  Browser Task Group finalized, closing its Agent Tab and leaving the user's original tab untouched.
- Existing view-transition abort errors recur around navigation; rendered form checks pass.
- Full screenshot/contrast, screen-reader/touch, locale-switching, live success/permission/save workflow and
  SSR/hydration audit remain unperformed. Parent chrome/tabs and other forms are not validated by these checks.

### Exact next action

- Explicit approval on 2026-11-25: `Approve DR-011a with documented limits and commit`.
  This authorizes completion and the scoped commit with the disclosed full screenshot/contrast,
  screen-reader/touch, locale-switching, live save/workflow and SSR/hydration limits retained unchecked.
  Approval is not evidence that these unperformed checks passed.
- Approved profile implementation, seven tests and handoff are committed on existing `main` as `34e06bb5`.
  Required workspace lint ran with unrelated failures recorded above; no push is authorized.
- Required sibling children are also complete. [DR-011](DR-011-player-editing.md) reconciliation is now approved
  with consolidated limits; parent is Done. Do not restart this child or another completed sibling.

[template]: ../../../libs/frontend/pages/player/src/pages/edit/components/player-profile/player-profile.component.html
[component]: ../../../libs/frontend/pages/player/src/pages/edit/components/player-profile/player-profile.component.ts
