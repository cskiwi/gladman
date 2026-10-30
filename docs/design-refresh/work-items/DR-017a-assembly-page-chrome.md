---
title: 'DR-017a: Assembly page heading and filters'
description: 'Replace assembly page chrome with a restrained heading and native responsive filter Card.'
---

## Identity and scope

- ID: DR-017a; parent [DR-017](DR-017-competition-assembly.md).
- Authoritative status: [backlog](../backlog.md). Rules: [design refresh](../README.md).
- Dependencies: approved layout direction and existing PrimeNG preset; no unfinished implementation dependency.
- Confirmed route: `http://localhost:3000/competition/assembly`, mounted on 2026-10-30.
- Project: `frontend-pages-competition`.
- Scope:
  [page template](../../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.component.html),
  [component](../../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.component.ts),
  its local stylesheet, and focused page tests.
- Preserve breadcrumb, localized title, all four filter bindings/IDs/options/grouping, URL changes/restoration,
  disabled dependencies, clear behavior, download/loading action, and authenticated save visibility.
- Exclude lineup internals, player slots, generator/partner statistics, validation dialog, service calculations,
  data/error contracts, save/download implementation, translations, backend, shared components, and theme.
- User feedback extended the approved scope only to the two mounted time-range Select templates in
  [assembly](../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html)
  and [partner combinations](../../../libs/frontend/pages/competition/src/pages/assembly/components/partner-combinations/partner-combinations.component.html),
  plus their translation regression test. Their remaining presentation and logic stay excluded.

## Baseline and approach

- Mounted anonymous Dutch page shows the English decorative `Team builder` eyebrow above `Ploegopstelling`.
- The filter bar hand-builds a surface and uses fixed/arbitrary widths; the season selection is truncated.
- Use a native PrimeNG Card, one localized h1, a responsive four-column layout, native fluid inputs, and explicit
  Select accessible names using existing translations. Keep download/save actions together below the filters.
- Use persistent semantic labels above the controls, as in the existing competition editing forms.
  The first implementation retained FloatLabel, but measured focused club-label contrast was only 2.66:1 in light mode.
  Replacing these four FloatLabels avoids that failure without modifying shared theme tokens or authoring styles.
- Give the authenticated icon-only save-menu trigger its existing localized Save accessible name.
- Retire the page-only title/host stylesheet; preserve host block layout without a stylesheet.
- The route is the sole page consumer. Keep orchestration here and the existing assembly child unchanged;
  no one-to-one wrapper or speculative smart/presentational extraction.
- Baseline: 41 authored class tokens before the assembly child, including non-utility title/eyebrow classes.
  The local stylesheet has two rules. No other consumer of those classes was found.
- Before screenshots are session-local `DR-017a-before-{width}-{theme}.png`; safe unselected state only.
  Integrated browser requested 1280px but reported 1193px; 390px reported correctly.
  Initial wide capture had compositor artifacts; do not use it as reliable visual evidence.

## Implementation checklist

- [x] Confirm mounted consumer, bounded scope, dependencies, and exclusions.
- [x] Preserve bindings, localized copy, permissions, and interactions.
- [x] Use native Card/fluid inputs and remove obsolete page styling.
- [x] Avoid shared/global changes and unnecessary abstractions.
- [x] Record unrelated discoveries without implementing them.

## Acceptance and verification

- [x] One localized h1; no English eyebrow or custom title stylesheet.
- [x] Native Card and fluid controls; fewer authored class tokens and no arbitrary minimum widths.
- [x] No new palette utilities, custom styles, dependencies, or backend/translation changes.
- [x] Four filters preserve selection, grouped teams, clear and disabled dependencies in component tests.
- [x] URL changes/restoration and action wiring preserve behavior in component tests and read-only browser checks.
- [x] Light/dark and narrow/wide layouts fit, with legible labels and values.
- [x] Season keyboard selection, Tab to club, accessible names, text contrast and club focus-border contrast checked.
- [x] Anonymous browser state, component-tested authenticated visibility and busy-action state checked without writes.
- [x] English/Dutch/French real assets pass component tests; mounted Dutch and initial Dutch SSR checked.
- [x] Relevant Nx test/lint/build pass; exact results recorded.
- [ ] Actual authenticated session, save popup keyboard/focus, download output, and operational save workflows.
- [ ] Mounted English/French switching, actual screen-reader output, and exhaustive hydration.
- [x] User visual review or explicit approval with disclosed limits.

## Evidence and handoff

### Implementation and automated checks

- Changed the page chrome, its component imports/host, focused tests, and repository handoff.
  The page-only stylesheet is deleted. Host block layout remains explicit.
  The approved follow-up also fixes named Select templates and accessible names in the two existing children;
  their services, calculations, styles, and other presentation are unchanged.
- Authored chrome class tokens drop from 41 to 33; the host adds one `block` token replacing `:host { display: block }`.
  The new label containers use only flex direction, gap and minimum-width layout utilities.
  Two local SCSS rules are removed; there are no new styles or styling exceptions.
- PrimeNG documentation confirms Card as a form container, Select/AutoComplete `fluid`, and Select `ariaLabel`.
- Commands run from the repository root:

  ```powershell
  npm exec -- prettier --write --end-of-line lf `
    "libs\frontend\pages\competition\src\pages\assembly\page-assembly.component.html" `
    "libs\frontend\pages\competition\src\pages\assembly\page-assembly.component.ts" `
    "libs\frontend\pages\competition\src\pages\assembly\page-assembly.component.spec.ts" `
    "docs\design-refresh\backlog.md" `
    "docs\design-refresh\work-items\DR-017-competition-assembly.md" `
    "docs\design-refresh\work-items\DR-017a-assembly-page-chrome.md"
  npm exec -- nx run frontend-pages-competition:test --testPathPatterns=page-assembly.component.spec.ts `
    --output-style=static
  npm exec -- nx run-many -t test,lint -p frontend-pages-competition --output-style=static
  npm exec -- nx run app:build --output-style=static
  git diff --check
  ```

- Final tests pass: 112/112 across five suites, including eight new page tests and three time-range locale tests.
  Focused lint passes with the same 41 existing warnings and no errors.
  Repository-required lint passes across all 34 projects with existing warnings, no errors.
  App build and all 29 prerequisites pass after the translation follow-up.
- Formatting and whitespace checks cover all nine surviving changed files.
  Local links across the backlog and two new briefs are checked before commit.
- The first new test run failed because Angular disallows combining `set` and `add/remove` in one metadata override.
  Splitting the test setup into two overrides fixed it; focused and full competition reruns pass.
- Tests cover three real locale assets, persistent label order, native fluid controls/Card, disabled dependencies,
  unique season options, club search, grouped teams, encounter selection/clearing, season changes,
  URL restoration/updates, child form identity, download busy state, and authenticated save-menu visibility/wiring.
  Action spies prevent download/save execution. No backend mutations were made.

### Browser evidence

- Integrated browser confirms the real club search, F/M/MX grouped team options, and 16 encounter choices for
  Smash For Fun 1H in season 2026. A keyboard-selected encounter updates the URL and preserves the full label.
  Reloading the populated query URL restores all four control values.
- Native Select keeps long encounter values visually ellipsized without losing their text in the DOM or options.
- Integrated browser verifies the intermediate two-column layout at actual 1180px and one column at 390px.
  It clamps larger requested widths and once misdirected a theme-button pointer click into shared search.
  That is not treated as an application regression or as successful wide verification.
- Independent headless Chrome using the existing `@playwright/test` package verifies actual 390/1280/1440px widths.
  The ad-hoc session-local check was run with:

  ```powershell
  node "$env:USERPROFILE\.copilot\session-state\b5ae211e-4ec1-4639-9c64-1bab087f3461\files\verify-dr017a.cjs"
  ```

  The temporary helper is removed after verification; no dependency or repository tooling was added.

- Final matrix: both themes at all three widths, unselected and populated query-restored state.
  Actual width and dark-class assertions pass; 390px has one column and 1280/1440px have four.
  Unselected page and filter Card have no horizontal overflow; populated filter Cards also fit.
  The populated lineup's own page overflow is outside this chrome slice and was not claimed to pass.
- Season selection via Enter/ArrowDown/Enter changes the query to season 2025 in all six matrix cases.
  Tab reaches Club after Season. Measured club focus-border contrast is 3.65:1 light and 10.22:1 dark.
  The existing native border supplies focus visibility; no custom ring is added.
- Text targets: h1, all four persistent labels, season value, club input and Download label.
  Minimum final measured contrast is 4.87:1 light and at least 5.69:1 dark.
  Disabled input text is exempt and is not included as a successful active-text contrast check.
- Initial dark-cookie-only attempts actually rendered light mode; those mislabeled captures were rejected.
  The final helper uses the native theme toggle as needed and asserts the actual dark class before checking.
- Twelve final screenshots are session-local `DR-017a-headless-{width}-{theme}.png` and
  `DR-017a-headless-populated-{width}-{theme}.png`.
  Inspected final unselected 390/1280px in both themes and populated 390px dark/1280px light screenshots.
  These are not committed; the repository handoff records the observations independently.
- Read-only HTTP fetch returns 200 with server-rendered Dutch h1, native Card markup, and localized Select names;
  no Team builder eyebrow. Component tests cover English/French, not mounted locale switching.

### Remaining actions and discoveries

- On 2026-10-30 the user requested the desktop translation fix and said
  "might as well fix these and then it's approved for commit".
  That condition is fulfilled by the verified follow-up below.
  DR-017a is Done by explicit approval with the already disclosed verification limits.
  Only this slice, the requested translation fix, tests, and repository handoff are approved for commit; no push.
- Keep the listed unchecked verification limits. No screen-reader, authenticated browser, operational save/download,
  exhaustive hydration, or full lineup workflow validation is claimed from a build or mocks.
- Existing populated lineup warnings include NG01354 (child controls cannot register with the parent FormGroup).
  Existing PDF download still logs the request rather than generating a document. Neither implementation was changed.
  Parent follow-up notes record these separately from visual acceptance.
- Focused FloatLabel text contrast needs a separate shared consumer audit, recorded as DR-031 in the backlog.
  This page no longer uses FloatLabel; no shared preset change is hidden in this slice.
- No new shared pattern is extracted. Keep the existing assembly child; revisit smart/presentational separation only
  when a later bounded child has genuine repeated structure or behavior.
- Exact next action for a fresh invocation: confirm and scope one mounted DR-017 player-pool/slot child.
  Do not reopen DR-017a or begin that next implementation in this invocation.

### Approved desktop translation follow-up

- Both actual desktop consumers were confirmed on the populated assembly route, including the partner table.
  The existing translation API returns all auto-generation keys for English, Dutch and French.
  The generation heading/buttons already translate; the two Selects showed raw `both-seasons` keys.
- PrimeNG 22's documented `#selectedItem` and `#item` content templates replace the ignored `pTemplate` slots.
  Both Selects also use the existing time-range key as their accessible name.
  No translation asset or backend change was needed.
- The new test mounts the real desktop assembly and partner components with synthetic pair data and real
  English/Dutch/French assets. It checks both selected labels, all four popup options, selection updates,
  accessible names, generation heading and all four generation button labels.
  A restored test-local `matchMedia` mock supplies jsdom's missing browser API; no production polyfill was added.
- Additional commands after formatting the two child HTML templates and new spec:

  ```powershell
  npm exec -- nx run frontend-pages-competition:test --testPathPatterns=assembly-time-range.component.spec.ts `
    --output-style=static
  npm exec -- nx run frontend-pages-competition:test --output-style=static
  npm exec -- nx run-many --target=lint --output-style=static
  npm exec -- nx run app:build --output-style=static
  ```

- All three targeted tests and all 112 competition tests pass. Workspace lint and app build pass as recorded above.
  Tests caught and corrected a transient misplaced accessible-name binding before commit.
- Headless Chrome verifies the hydrated mounted Dutch route at actual 1440px in both themes:
  both Selects show `Dit + vorig seizoen`, the four options are `Dit + vorig seizoen`, `Dit seizoen`,
  `Vorig seizoen`, and `Laatste X weken`; choosing `Dit seizoen` and restoring the original value both pass.
  Both accessible names are `Tijdsbereik`. Variaties, Beste resultaten, Willekeurig and Opstelling wissen are visible.
- Early browser attempts interacted with SSR markup before hydration, or searched within a Select for a portaled
  popup, or matched a button name without its existing icon glyph. Those automation attempts did not pass.
  The final successful check waits for hydration, follows the native `aria-controls` relationship, and checks
  the button-label text. It performs no generation, clear, save or operational/admin mutation.
- The original visual matrix remains evidence for page chrome. English/French follow-up evidence is component/API
  only; actual mounted switching, screen-reader output, and exhaustive hydration remain unchecked.
