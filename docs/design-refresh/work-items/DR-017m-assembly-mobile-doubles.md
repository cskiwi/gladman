---
title: 'DR-017m: Assembly mobile doubles'
description: 'Refresh the four mounted mobile doubles surfaces with one repeated native presentation.'
---

## Identity and scope

- ID: DR-017m. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Dependencies: DR-017d and DR-017l (Done).
- Design rules: [design refresh](../README.md). Project: `frontend-pages-competition`.
- Confirmed mounted consumer on 2026-10-31: the supplied populated `/competition/assembly` URL at 390px
  renders Heren Dubbel 1-4, each with two native Selects; 13 mobile lineup Selects total.
- Source: [assembly template](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html).
- Preserve the full-name adapter/templates completed in DR-017l, player object values, standalone ngModel,
  indexed assignment/clearing, slot filtering, validation, form synchronization and responsive branch behavior.
- Exclude completed children, desktop, mobile substitutes, services, shared components, global theme,
  backend, translation assets, dependencies and operational mutations.

## Baseline and approach

- Four repeated Fieldsets contain two duplicated Select blocks with hard-coded English placeholders
  and no explicit accessible control names. Full-name option/value wrapping is already completed.
- Replace the doubles Fieldsets with named native Cards, matching completed mobile singles.
- Repeat the two positions within each Card. After user feedback, the native translated select-player
  placeholder is the only visible prompt; omit separate Player 1/2 labels to save space.
  Native `ariaLabel` retains translated slot context and position in each distinct accessible name.
- Reuse the existing translated select-player placeholder and native fluid input sizing.
- One nested template loop styles all eight real consumers once; no one-to-one smart/dumb wrapper
  or new shared component is warranted for this page-only structure.
- Baseline scoped static utility tokens: three (`w-full` and `w-full mt-2`).
  Existing full-name template and outer layout are excluded from this comparison.
- Browser baseline confirms light/dark mobile Fieldsets and English placeholder-only combobox names
  (`Select player 1/2`), without translated visible position labels or slot context.
  Before screenshots were captured in both themes before application editing.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and one independently reviewable slice.
- [x] Preserve behavior and existing translation assets while simplifying doubles presentation.
- [x] Reuse native Card/Select capabilities and existing full-name templates without new styling.
- [x] Add focused tests for names, positions, values, filtering and unchanged branches.
- [x] Record validation, evidence, utility comparison and accurate handoff.

## Acceptance and verification

- [x] Four named native Cards and eight fluid Selects render with distinct accessible names and no extra visible labels.
- [x] Real English/Dutch/French copy and M/F/MX slot naming are verified in component tests.
- [x] Original values, indexed assignment/clearing, filtering, validation and form synchronization remain.
- [x] Light/dark 360/390/768px mobile and 820/1440px desktop layouts remain usable.
- [x] Keyboard selection/clearing, Escape, Tab order, labels and long-name overlays are verified.
- [x] Relevant empty/loading/unloaded states remain usable.
- [x] Native placeholder and selected-value text contrast pass; native focused border is visible in captures.
- [ ] Quantitative focus-ring/option contrast and actual screen-reader output.
- [x] Dutch SSR and fresh hydration remain intact.
- [ ] Exhaustive hydration, mounted English/French and authenticated/save workflows.
- [x] Focused existing Nx test/lint/build targets pass after repository formatting.
- [x] Zero new palette colors, SCSS, inline styles, theme overrides or dependencies.
- [x] User visual review or explicit completion approval recorded.

## Evidence and handoff

- Initial worktree: clean (`git --no-pager status --short`).
- Existing mobile replacement/duplicate-rule differences remain in DR-036; no functional parity fix here.
- Changed scope: mobile doubles template, [11 component tests](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly-mobile-doubles.component.spec.ts)
  and this repository handoff.
  An initial narrowed search-test selector was restored after removing the extra visible position labels.
  No TypeScript implementation, services, shared components, styles, translation assets or theme changes.
- Native Card title/region and Select `inputId`, `ariaLabel`, `fluid`, option/value templates are verified
  against MCP documentation and the installed PrimeNG types. Existing adapter/values and wrapping are unchanged.
- Final scoped authored static class tokens increase from three to six: three heading tokens and three
  tokens for spacing the two positions. The initial visible-label version used nine tokens.
  Two duplicated Select blocks become one repeated block. Remaining utilities provide necessary readable
  headings/spacing; native `fluid` replaces width classes. No styling exception.
- Final validation after repository Prettier formatting:

  ```powershell
  npx nx run-many -t test,lint,build -p frontend-pages-competition --output-style=static
  ```

  Pass: 278 tests in 17 suites, including 11 new doubles tests; lint reports 41 existing warnings and zero errors.
  Competition library build and 10 prerequisites pass. No full-app build or repository-wide validation claimed.
  Initial failures were incorrect new test assumptions about empty MX prefixes and existing filtering,
  plus the coupled search-label count. Corrected without changing application/service behavior.
  An attempted comma-separated `--testFile` selector found zero tests despite exit 0; it is not validation.
  The complete competition suite above was subsequently executed and passed.

- Browser validation used the existing Playwright MCP browser and `browser_run_code_unsafe` for the matrix.
  Six fresh 360/390/768px light/dark mobile cases verify all eight doubles control names, keyboard assignment,
  Delete clearing, partner exclusion, Escape, position Tab order, long options/selected values and no overflow.
  Each case first verifies the actual mounted eight-option/full-name baseline before browser-local safe players.
  Four fresh 820/1440px theme cases retain desktop doubles/CDK and exclude mobile Cards.
  The complete matrix reports zero page errors, zero NG0955 warnings and zero GraphQL mutations;
  a verification-only route guard rejects mutations.
- Additional fresh light/dark 390px cases pass pointer selection/clear in both positions and explicitly check
  empty/loading/unloaded gates. The existing native empty message is English `No results found` on the Dutch
  route; record the cross-cutting locale audit as DR-037 rather than hiding a global change here.
  Browser-local data is discarded on reload. No save/download/admin mutations are performed.
- Helper attempts initially used an unencoded theme cookie, read overlays/render gates before settling,
  and assumed the disabled native empty row had no option role. Final checks wait for actual observable states
  and use the library's encoded `gladman%3Atheme` cookie. No application workaround was needed.
- Final computed-color contrast converted to sRGB via browser canvas passes: all eight native placeholder
  prompts 4.87:1 light / 6.65:1 dark; both selected values 13.61:1 light / 16.00:1 dark.
  Initial visible labels passed at 19.87:1 / 16.00:1; they are now removed and not part of final evidence.
  Focused-border captures are inspected; quantitative focus/option contrast remains unverified.
- Dutch SSR check with PowerShell `Invoke-WebRequest -UseBasicParsing` returns HTTP 200,
  includes `id="double1"` and `Heren Dubbel 1`, and excludes the mobile title as expected.
  Fresh browser hydration covers both responsive branches; exhaustive hydration remains unchecked.
- Before/after theme captures and ordinary/long safe names are inspected. Screenshots remain session-local,
  not committed, under session `ac4cd8b3-241c-4b9a-8cde-eaf5ebc6e40f/files`; key filenames:
  `dr017m-before-light.png`, `dr017m-before-dark.png`, `dr017m-normal-light.png`, `dr017m-normal-dark.png`
  and `dr017m-after-{360,390,768}-{light,dark}.png`.
  These earlier captures are historical; final compact versions use
  `dr017m-compact-{360,390,768}-{light,dark}.png` and `dr017m-compact-normal-{light,dark}.png`.
- User feedback on 2026-10-31 requests removing separate Speler 1/2 labels and using the select-player prompt
  to save space. The final repeated block removes those labels/wrappers and retains native distinct accessible names.
  This is adjustment feedback, not completion/commit approval.
  After the correction, all 278 competition tests in 17 suites, focused lint/build and 10 prerequisites pass again.
  Ten fresh browser theme/width cases explicitly verify zero visible position labels, localized placeholder
  prompts and eight distinct accessible names, plus both-position interactions, long-name fit and unchanged desktop.
  The final matrix again reports zero page errors, NG0955 warnings or mutations.
  Additional final light/dark pointer, empty/loading/unloaded, placeholder/selected contrast and Dutch SSR checks pass.
- Prettier formatting of all five final changed files and `git diff --check` pass. Formatting normalizes existing
  backlog table alignment only; Git's LF-to-CRLF checkout warnings do not indicate whitespace errors.
- Remaining limits: actual screen reader, quantitative focus/option contrast, exhaustive
  hydration, mounted English/French and authenticated/save workflows. These criteria remain unchecked.
- On 2026-10-31 the user selected "Approve completion and commit with the disclosed verification limits"
  after the compact-prompt correction. Approval accepts these limits; it does not mean unperformed checks passed.
  Only this slice, its tests and repository handoff are approved for commit; no push.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects,
  with existing warnings and zero errors. No application changes occurred after the final focused/browser checks.
- Authoritative status: Done in the backlog following explicit approval.
  Next invocation: confirm and scope one mounted mobile substitutes surface child, excluding completed DR-017a-m.
  Keep DR-017 open; no second implementation slice in this invocation.
