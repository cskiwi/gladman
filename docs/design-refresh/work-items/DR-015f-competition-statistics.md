---
title: 'DR-015f: Competition hero statistics'
description: 'Consistent, localized totals and date windows in the mounted competition hero.'
---

## Identity

- ID: DR-015f; parent DR-015. Authoritative status: [backlog](../backlog.md).
- Dependencies: completed DR-015b and DR-015e.
- Design rules: [design refresh](../README.md).
- Mounted consumer: `/competition/pbo-competitie-2026-2027`, confirmed on 2026-10-28.
- Nx projects: `frontend-pages-competition`, `backend-translate`; consuming application: `app`.
  The running API also regenerated the existing [translation types][types] with the eight new keys.
- Sources: [template][template], [tests][tests], [routes][routes], [translation assets][translations].

## Scope

- Refresh only the four hero statistics: sub-event total/type count, draw total, registration, and team changes.
- Preserve computed totals, grouping, zero counts, date formats, order, truthy visibility, and dash fallbacks.
  A period-one closing date remains hidden without a team-change opening date.
- Replace hard-coded English labels with translation keys in all three existing locales.
  Keep DatePipe's existing locale behavior; this is not a global date-localization change.
- User-confirmed review corrections retain existing same-page edits: info metadata Tags, removal of `Idx`,
  redundant Event/draw-count labels, ASCII separators/fallbacks, and competition terminology translations.
  Corresponding metadata and date-fallback test expectations were updated with permission.
- Exclude identity, actions, sync behavior, permissions, other routes, shared components,
  theme configuration, services, and backend behavior. No dependencies or operational mutations.

## Baseline and proposed approach

- Mounted baseline: 12 sub-events, three types, 26 draws; registration 1/22 May 2026,
  team changes from 27 July through period-one end 25 August.
- Four custom statistic groups use generic div/span markup, oversized `text-3xl` totals,
  tiny monospace dates, and hard-coded English labels even in the mounted Dutch interface.
- Retain the existing div/span statistic groups and the shared hero's projection.
  The user rejected the initial description-list proposal on 2026-10-28 for codebase consistency.
  Do not introduce `dl`, `dt`, `dd`, `ul`, or `ol` in this statistics subtree.
- Keep the responsive two/four-column layout and semantic colors, reduce total size, allow type context to wrap,
  and use normal readable date text. No custom CSS or theme overrides.
- Before evidence: `tmp/design-refresh/DR-015f-before-{light,dark}-{390,1280}.png`.
  Initial cookie-only light captures remained dark; these were replaced using the actual header theme control.
  The light/mobile baseline was inspected; other baseline screenshots are not claimed as reviewed evidence.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, and bounded scope.
- [x] Preserve totals, date branches, ordering, and existing surrounding behavior.
- [x] Preserve the existing div/span pattern and translation infrastructure without shared changes.
- [x] Add regression coverage for zero/one/multiple types, missing dates, and locale updates.
- [x] Record validation, evidence, and remaining review.

## Acceptance and verification

- [x] Four existing-style div/span groups expose labels, totals, and date information without list markup.
- [x] All summary copy is translated; singular/plural keys and interpolation placeholders exist in all locales.
      English zero/one/multiple copy is component-tested; mounted three-type labels pass in all locales.
- [x] Empty sub-events/draws render zero; partial/missing date windows retain existing visibility/fallbacks
      in component tests, not live mutated data.
- [x] Corrected light/dark at 390px/1280px fit with no document or summary overflow.
- [x] Corrected static labels, text contrast, and unchanged adjacent keyboard access are checked.
- [x] No new colors, numbered palette utilities, SCSS, inline styles, dependencies, or global theme changes.
- [x] Corrected focused Nx tests/lint and consuming app build pass.
- [x] Corrected SSR markup and mounted Dutch translation loading are checked.
- [ ] Live absent-date/zero-count data, screen-reader output, and exhaustive hydration.
- [ ] Corrected-version mounted English/French checks and cross-consumer visuals for shared terminology edits.
- [x] User approved completion and scoped commit on 2026-10-28; unperformed checks remain unchecked.

## Evidence and handoff

- Final correction on 2026-10-28: replaced `dl`/`dt`/`dd` with the original div/span vocabulary,
  removed list-only margin resets, and added a regression assertion prohibiting list markup in statistics.
  Final subtree: 53 utility tokens and 21 HTML elements, down from 70 tokens and 22 elements.
- Concurrent user edits initially caused five metadata failures and then four date-fallback failures.
  The user selected "Keep those edits and update the affected tests"; expectations now retain info Tags,
  no `Idx`, and ASCII hyphens. No source changes were reverted. The unrelated staged `gladman.babel`
  is excluded from this commit; existing staging is preserved.
- Final validation after those updates: 34/34 tests pass; focused competition/translation lint passes
  (41 existing competition warnings); app build and all 29 prerequisites pass.
  The translation test target still has no tests. Formatting and `git diff --check` pass.
  Repository-required `npm exec -- nx run-many --target=lint --output-style=static` passes for all 34 projects
  with existing warnings. No full repository test suite was run.
- Corrected evidence: `tmp/design-refresh/DR-015f-corrected-{light,dark}-{390,1280}.png`;
  all four images were inspected. Both widths/themes have no document or summary overflow.
  Summary heights remain 172.5/92 CSS pixels; minimum summary contrast is 4.87:1 light / 6.65:1 dark.
  Dutch now displays the retained wording `Poules`.
- Statistics contain zero list elements or interactive controls. Adjacent Tab reaches full sync;
  Shift+Tab returns to the hero anchor with focus-visible. No operational control was activated.
- Corrected SSR responds HTTP 200 with a div-based summary, translated labels/date text,
  no summary list markup, and no unresolved summary keys. Services are responsive again.
  Corrected mounted English/French and shared-terminology consumers were not rerun; historical locale checks follow.
- Approval: the user explicitly requested "mark as done and commit" on 2026-10-28 after the consistency correction
  and authorization to retain concurrent edits. The backlog is Done on that approval, with the remaining
  live-edge-case, assistive-technology, hydration, and locale/cross-consumer limits left unchecked above.
  Completion approval is not evidence that an unperformed check passed.
- Next action: scope remaining competition draw fallback-name/empty-copy localization under DR-015.
  Parent DR-015 remains open; no second implementation slice was started. No push is authorized.

### Historical initial-version evidence

The results below precede the requested div/span correction. They are not final corrected-version verification.

- Worktree was clean before selection. The initial implementation was not approved for commit at that point.
- Changed scope: statistics template, ten new component cases, eight translation keys per locale,
  regenerated translation types, and repository handoff. No application TypeScript or backend behavior changed.
- Native HTML is preferable to a PrimeNG component for these static term/value pairs.
  No new component, wrapper, styling layer, or reusable abstraction was introduced.
- Utility comparison from the source statistics subtree: 70 to 58 class tokens, 22 to 21 HTML elements.
  Totals change from `text-3xl` to `text-2xl`; dates lose monospace/tiny text styling.
  Remaining utilities provide responsive columns, spacing, semantic text/border colors, and tabular numerals.
- Commands on 2026-10-28:

  ```powershell
  npm exec -- prettier --write "libs\frontend\pages\competition\src\pages\detail\page-detail.component.html" `
    "libs\frontend\pages\competition\src\pages\detail\page-detail.component.spec.ts" `
    "libs\backend\translate\assets\i18n\en\all.json" "libs\backend\translate\assets\i18n\nl_BE\all.json" `
    "libs\backend\translate\assets\i18n\fr_BE\all.json" "libs\utils\i18n\src\lib\i18n.generated.ts" `
    "docs\design-refresh\work-items\DR-015f-competition-statistics.md" "docs\design-refresh\backlog.md"
  $env:NX_DAEMON='false'
  npm exec -- nx run-many -t test,lint -p frontend-pages-competition,backend-translate --output-style=static
  npm exec -- nx run app:build --output-style=static
  git diff --check
  ```

- Initial-version checks: 34/34 component tests pass. Competition lint passes with 41 existing warnings and no errors;
  translation lint passes. The translation test target reports no tests and exits successfully, not test coverage.
  App build and all 29 prerequisites pass. Existing Nx/decorator-metadata advisories remain.
  Formatting and whitespace checks pass; Git reports checkout line-ending conversion warnings.
- Initial test run: 33 passed, one failed because adjacent span `textContent` does not contain a separator.
  The locale assertion now verifies the individual displayed spans instead; no application fallback was added.
- API restarted after translation edits. It is back on port 5000 and serves the eight keys with HTTP 200.
  An initial readiness probe reached HTTP 200 but PowerShell's case-insensitive JSON converter rejected existing
  `other`/`Other` keys elsewhere in the payload. A Node JSON parse confirmed readiness; the probe was stopped.
  Node also verified identical eight-key sets and interpolation placeholders across English, Dutch, and French.
- Mounted before/after: 12 sub-events, three types, 26 draws, and all four displayed date values remain unchanged.
  All ordered page anchor href values match the captured baseline (including the existing anchor without an href).
  Existing component tests still cover loading/error, permissions, metadata, draw links, and empty states.
- After evidence: `tmp/design-refresh/DR-015f-after-{light,dark}-{390,1280}.png`.
  Final captures explicitly scroll to the top; all four were inspected. Earlier offscreen captures were replaced.
  Images are local only and are not staged or committed.
- Geometry: two columns at 390px, four at 1280px; summary widths 310/1186 CSS pixels and heights 172.5/92.
  No document/summary horizontal overflow. Context has its own wrapping line instead of squeezing beside the total.
- Contrast: Canvas sRGB conversion of computed text colors against composited ancestor backgrounds yields
  minimum 4.87:1 light / 6.65:1 dark at both widths. Primary statistic/date text is 19.87:1 light / 16.00:1 dark.
- Accessibility snapshot exposes four terms and four definitions in the correct order.
  Statistics add no interactive elements or tab stops. Tab from the hero anchor reaches the existing full-sync
  button; Shift+Tab returns to the anchor with focus-visible. No operational button was activated.
- Mounted locale checks: `en`, `fr_BE`, and `nl_BE` via the existing language cookie, each at 390px/1280px.
  All labels and date-context strings translate without unresolved keys or overflow; Dutch was restored afterward.
  Existing DatePipe month formatting remains English, deliberately outside this presentation slice.
- SSR: HTTP 200, native `dl` with four `dt`/`dd` pairs, correct Dutch labels, totals, and date text;
  no unresolved summary key. This is not exhaustive hydration or assistive-technology validation.
- Reusable-pattern decision, corrected by user review: preserve the existing div/span statistics vocabulary;
  do not introduce description lists or new list markup for this presentation refresh.
- Exceptions: none.
- The initial review/blocker was resolved by the corrections and approval recorded above.
  Remaining fallback-name/empty-copy localization is the next scoping candidate, not an active implementation.

[template]: ../../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.html
[tests]: ../../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.spec.ts
[routes]: ../../../../libs/frontend/pages/competition/src/lib.routes.ts
[translations]: ../../../../libs/backend/translate/assets/i18n
[types]: ../../../../libs/utils/i18n/src/lib/i18n.generated.ts
