---
title: 'DR-017n: Assembly mobile substitutes'
description: 'Refresh the mounted mobile substitutes picker without changing lineup semantics.'
---

## Identity and scope

- ID: DR-017n. Authoritative status: [backlog](../backlog.md).
- Parent: [DR-017](DR-017-competition-assembly.md). Dependencies: DR-017f and DR-017l (Done).
- Design rules: [design refresh](../README.md). Project: `frontend-pages-competition`.
- Confirmed mounted consumer on 2026-10-31: the supplied populated `/competition/assembly` URL at 390px
  renders the `Invallers` Fieldset and `Select substitute` combobox below mobile singles.
- Source: [assembly template][template].
- Preserve original player values, full-name templates, regular/backup filtering, append index derived
  from current substitutes length, clear event, validation/form synchronization and responsive gates.
- Exclude desktop, selected-substitutes management, completed children, services, shared components,
  global theme, backend, translation assets, dependencies and operational mutations.

## Baseline and approach

- One Fieldset contains a width-class Select with English placeholder-only accessible naming.
- Replace it with a named native Card matching mobile singles/doubles; reuse the existing translated
  select-player prompt and shared full-name option/value template.
- Use native `fluid`, `inputId`, `ariaLabelledBy` and adapter `dataKey="id"`.
- No new smart/dumb wrapper: this single picker already reuses meaningful presentational templates;
  extracting a one-to-one wrapper would not reduce genuine shared structure.
- Scoped static utility tokens before: one (`w-full`). After: three heading tokens.
- Existing mobile append/clear/duplicate limitations remain separate in DR-036.

## Implementation checklist

- [x] Confirm mounted consumer, completed dependencies and one reviewable slice.
- [x] Preserve behavior/translations while simplifying presentation.
- [x] Verify native Card/Select naming, identities, filtering and event behavior with focused tests.
- [x] Capture before/after evidence and validate theme/width/keyboard/states.
- [x] Record exact Nx results and repository handoff.

## Acceptance and verification

- [x] One named native Card and fluid, independently named substitutes Select.
- [x] Real English/Dutch/French existing headings/prompts in tests.
- [x] Original identities/full-name wrapping, append indices, clearing and form synchronization preserved.
- [x] Light/dark mobile 360/390/768px and desktop 820/1440px verified.
- [x] Keyboard selection/clearing, Escape, Tab order, focus and long-name fit verified at 390px in both themes.
- [x] Empty/loading/unloaded gates verified at 390px in both themes.
- [x] Placeholder contrast and relevant Dutch SSR/fresh responsive hydration checked.
- [x] Focused Nx test/lint/build pass after repository formatting.
- [x] No new styling exceptions, dependencies or hidden shared changes.
- [x] User review or explicit completion approval recorded.
- [ ] Actual screen-reader output, quantitative focus/option/selected-value contrast, exhaustive hydration,
      mounted English/French, authenticated/save workflows and interactions at every matrix width.

## Evidence and handoff

- Initial worktree clean: `git --no-pager status --short`.
- Playwright MCP profile was already in use; left it untouched and used the integrated browser instead.
- Baseline integrated browser confirms actual populated mobile consumer and existing full-name templates.
- Before/after integrated-browser captures in both themes show the English placeholder-only Fieldset
  replaced by the named `Invallers` Card and `Selecteer speler` prompt. Captures contain no player names.
- Changed scope: [template][template], [eight new regression tests][tests], the doubles test's now-obsolete
  Fieldset assertion, parent brief and backlog. No TypeScript implementation/service changes.
- One authored `w-full` token becomes three heading tokens (`text-base font-semibold m-0`); these provide
  the existing mobile heading hierarchy. Native fluid sizing owns width. Full-name wrapping is unchanged
  and authored once in the existing shared option/value template. No new component is needed.
- PrimeNG Card documentation confirms native title templates and region attributes; installed Select types
  and completed consumers verify `inputId`, `ariaLabelledBy`, `dataKey` and `fluid`.
- After repository Prettier formatting:

  ```powershell
  npx nx run-many -t test,lint,build -p frontend-pages-competition --output-style=static
  ```

  Pass: 286 tests in 18 suites, including 8 new substitutes cases. Focused lint: 41 existing warnings,
  zero errors. Competition library build and 10 prerequisites pass (build cache reused where valid).
  No full-app build or repository-wide lint claimed.
  Initial new test used `substitutes` instead of the existing form key `subtitudes`; corrected only the test,
  reran the command and passed. No application contract was renamed.

- Final layout matrix: fresh loads at 360/390/768px in both themes verify named region/control, Dutch
  prompt, focused combobox, native fit, 13 mobile lineup Selects and the actual eight-option baseline.
  Fresh 820/1440px loads in both themes retain desktop `substituteList` and omit the mobile picker.
  This completed matrix reports zero page errors and zero NG0955 warnings.
- Placeholder contrast uses computed native colors converted through canvas to sRGB:
  4.8689:1 light / 6.6472:1 dark. Quantitative focus/option/selected-value contrast remains unchecked.
- Separate final fresh 390px light/dark interaction checks pass keyboard Home/Enter assignment,
  Delete clearing, second append, `subtitudes` array synchronization and appended-player exclusion.
  Separate fresh 390px theme checks pass pointer selection/clear, 200-character unbroken last-name
  option/value wrapping without horizontal overflow, empty feedback, Escape, Tab to `assembly-add-player`,
  loading ProgressBar and unloaded branch removal. Actual screen-reader output remains unchecked.
- Browser-local synthetic players and a browser-local no-network validation stub isolate interaction tests;
  no application workaround or API/admin/save operation is added. A verification-only route guard rejects
  GraphQL mutations. Reload discards synthetic state; the page is restored to the real route for review.
- Earlier combined helper attempts read option counts/selected text/render gates before the DOM settled
  and assumed the adjacent autocomplete used `aria-label` rather than a native label. They are not a passed
  full interaction matrix. Final split checks wait for actual DOM text, expanded overlays and detachment.
  Interaction coverage at all widths is not claimed.
- Dutch SSR via `Invoke-WebRequest -UseBasicParsing` returns HTTP 200, includes `id="substituteList"`
  and `Invallers`, and excludes `id="assembly-mobile-substitutes-title"` as expected for server desktop.
  Fresh browser loads verify responsive hydration. Exhaustive hydration is not claimed.
- Preserve existing append-only picker semantics: clearing selected feedback does not remove an appended
  player; no selected-substitutes list/removal UI is added. DR-036 retains mobile management/parity work.
  Existing Dutch-route `No results found` feedback remains the shared DR-037 audit.
- On 2026-10-31 the user selected "Approve completion and commit with the disclosed verification limits".
  This explicitly accepts the unchecked limits above; it does not establish that unperformed checks passed.
  DR-017n is Done in the backlog. Approval covers only this slice/tests/handoff; no push.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes across all 34 projects
  with existing warnings and zero errors.
- Exact next action: confirm and scope one remaining mounted assembly surface, such as confirmation
  dialog chrome/actions, excluding completed DR-017a-n. Keep DR-017 open; no second slice started here.
  No dependencies or styling exceptions.
- Exceptions: none.

[template]: ../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html
[tests]: ../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly-mobile-substitutes.component.spec.ts
