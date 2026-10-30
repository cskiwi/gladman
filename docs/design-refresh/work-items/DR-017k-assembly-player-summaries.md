---
title: 'DR-017k: Assembly base and titular summaries'
description: 'One native summary presentation for the two mounted assembly information panels.'
---

## Identity and scope

- ID: DR-017k. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Completed DR-017a-j remain unchanged.
- Design rules: [design refresh](../README.md). No incomplete prerequisites.
- Confirmed mounted consumer on 2026-10-30: `/competition/assembly`, season 2026, Smash For Fun 1H,
  through [competition routes](../../../libs/frontend/pages/competition/src/lib.routes.ts) and
  [AssemblyComponent](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html).
- Project: `frontend-pages-competition`.
- Scope: the adjacent base-player and titular information summaries, one repeated domain presentation.
  Reuse one named template rather than styling these identical structures twice or adding a primitive wrapper.
- Preserve validation-derived player order, names, index, single/double/mixed rankings and sums,
  exemption lookup, localization, responsive visibility and loading behavior.
- Exclude completed children, validation Messages, lineup selectors, services, shared components,
  theme, stylesheets, backend, translation assets and operational/admin mutations.

## Baseline and approach

- Both servers initially refused connections. The user started the usual servers; mounted selection now works.
- Both native non-collapsible Fieldsets duplicate names, index, rankings and exemption markup.
  Exemption icons use `text-orange-500` and have no keyboard target or accessible description.
- A safe browser-memory-only validation result supplies synthetic names for baseline evidence.
  Screenshots: `.playwright-mcp/dr-017k-before-dark-wide.png` and
  `.playwright-mcp/dr-017k-before-light-narrow.png` (local ignored evidence).
- Replace both Fieldsets with named native Cards matching the adjacent validation Card.
  Share one named template using explicit summary/title/heading-ID context.
- Preserve the compact ranking notation, with wrapping names and native warn Tags using the completed row's
  accessible exemption pattern. Do not reuse the completed row itself: it reads ranking history rather than
  these validation-derived rankings and has unrelated competition-status behavior.
- Keep presentation and smart/service ownership in the existing component; no new component API is necessary.

## Implementation checklist

- [x] Confirm mounted consumer, bounded scope and dependencies.
- [x] Preserve data, translations and responsive behavior through one summary template.
- [x] Use native options, semantic colors and no custom styling.
- [x] Verify both consumers without changing adjacent surfaces.
- [x] Record unrelated discoveries and the exact next action.

## Acceptance and verification

- [x] Two uniquely named native regions retain localized headings and their own index/player data.
- [x] Male/female show single/double; mixed shows all three; sums, zeroes and updates remain correct.
- [x] Exemptions are named, keyboard reachable and use native severity/Tooltips.
- [x] Empty, loading and unloaded states preserve existing behavior.
- [x] Light/dark and narrow/wide layouts preserve information, including long names.
- [ ] Keyboard, focus, contrast and overlay behavior are checked.
- [ ] Relevant localization and SSR/hydration are checked.
- [x] Focused Nx tests, lint and library build pass.
- [x] User visual review/approval is recorded.

## Evidence and handoff

- Worktree was clean before selection.
- Changed scope: assembly HTML, one focused spec, this brief, parent/backlog handoff and the previous child's
  now-resolved final Dutch SSR availability note. No production TypeScript/service/translation changes.
- One named template supplies both Cards, headings, lists, index/rankings and exemption Tags.
  Context passes each summary, translation key and unique heading ID. This is meaningful domain reuse without
  a new component API or a one-to-one PrimeNG wrapper; data ownership stays in the existing smart component.
- Static layout/color class tokens drop from 26 across two old panels to 25 in one authored template,
  excluding PrimeIcon classes in both counts. Remove two palette-color occurrences, two arbitrary minimum widths,
  and the redundant monospace ranking style. Remaining utilities support native heading/list resets,
  wrapping names, aligned rankings and responsive layout, not component skinning.
- Screenshot inspection exposed a mobile height regression from an unconditional flex basis.
  It is corrected to `md:basis-64`: mobile Cards now size to content, while desktop information panels wrap.
  Final light narrow/dark wide screenshots were inspected after the correction.
- No dependencies, SCSS, inline styles, token overrides, PassThrough, new colors or styling exceptions.

### Validation on 2026-10-30

- Passed formatting: `npx prettier --write` on every changed file before validation; handoff updates formatted too.
- Initial `npx nx run frontend-pages-competition:test --runInBand --testPathPatterns=assembly-player-summaries`
  failed three assertions that treated native Tooltip signal inputs as ordinary properties.
  Corrected test access to the installed PrimeNG 22 API; no production workaround.
- Passed final `npx nx run-many -p frontend-pages-competition -t test lint build --output-style=static`:
  all 247 tests in 15 suites, including 10 new summary tests; lint has 41 pre-existing warnings, no errors
  and no new warnings; library build and 10 prerequisites pass.
  Existing Jest-executor and decorator-metadata warnings remain.
- Tests cover English/Dutch/French real assets, associated unique headings, native Cards/Tags/Tooltips,
  separate base/titular indices and data, player ordering, M/F/MX ranking/sums, zeroes, reactive updates,
  disappearing exemptions, null validation, loading/unloaded gates and unchanged 13 mobile lineup Selects.
- Mounted browser: eight final cases at 390/820/1280/1440px in light/dark, with synthetic validation data.
  Both Cards, long unbroken names, rankings and zeroes fit. Mobile retains 13 lineup Selects.
  A fixed desktop flex basis is deliberately absent on mobile; final mobile Card heights are 197/129px
  with the long-name fixture rather than a forced 256px minimum content height.
- Exemption Tags are reached by actual Shift+Tab/Tab, have localized accessible names and browser focus-visible
  outlines, and show native Tooltips on focus and hover. Escape dismisses them; inspected Tooltip fits the viewport.
  Native Tooltip has no ID/`aria-describedby` association, as already observed on Buttons in DR-033.
  The Tag itself has the complete translated exemption as its `aria-label`; no information depends on the Tooltip.
  Extend the separate DR-033 audit to this confirmed Tag consumer, without hidden shared fixes.
- Measured heading/index/player/ranking text contrast: 19.87:1 light, 16.00:1 dark.
  Native exemption icon contrast over its actual composited Tag fill: 4.52:1 light, 9.31:1 dark.
  Both pass their text/icon thresholds. Native keyboard outline is visible; exhaustive painted-area/ring
  contrast and actual screen-reader output remain unverified.
- Mounted M/F/MX values match the existing notation and sums. Null validation preserves the named empty lists
  and index zero. Loading hides summaries and shows the top-level progress bar; unloaded hides both.
  An initial loading probe raced change detection; the settled check waits for both exact outcomes and passes.
- Safe after screenshots: `.playwright-mcp/dr-017k-after-{light,dark}-{390,1440}.png`, local ignored evidence.
  Browser-only synthetic validation/type/exemption changes were restored; final reload uses actual application data.
- Passed final Dutch SSR: HTTP 200 for the selected assembly URL, with both summary heading IDs and captain input
  in server HTML. Mounted hydration after a fresh reload has both unique summary headings, no page errors
  and no GraphQL mutations. This also resolves DR-017j's unavailable final grouping SSR recheck.
- Existing populated-lineup NG01354 child-control warnings recur and remain the parent's separate functional concern.
- Not run: actual screen-reader output, exhaustive focus/hover/hydration, mounted English/French,
  authenticated/save/operational workflows. No global setting or shared component changed.

### Review and next action

- Implementation and recorded checks are complete with explicit user approval below. No push is authorized.
- Exact next action in a fresh invocation: confirm/scope the remaining mounted mobile lineup controls as one repeated
  selector group (for example singles), excluding completed DR-017a-k. Confirm its scope before implementation.
  Keep the parent open; do not start a second implementation slice here.

### Completion approval

- On 2026-10-30 the user selected "Approve completion and commit with the disclosed verification limits"
  and "Nothing else".
- Mark only DR-017k Done. Approval accepts native Tooltip association, actual screen-reader output,
  exhaustive focus-ring/hover/hydration, mounted English/French and authenticated/save/operational limits.
  Broad acceptance criteria remain unchecked; approval is not evidence that unperformed checks passed.
- Only this child's implementation, tests and repository handoff are approved for commit. No push.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects
  with existing warnings and no errors. Approval/handoff additions are formatted before committing.
