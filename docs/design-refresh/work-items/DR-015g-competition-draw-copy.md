---
title: 'DR-015g: Competition draw fallback and empty copy'
description: 'Localized unnamed-draw labels and empty messages on the mounted competition detail.'
---

## Identity

- ID: DR-015g; parent DR-015. Authoritative status: [backlog](../backlog.md).
- Dependencies: completed DR-015c and DR-015f.
- Design rules: [design refresh](../README.md).
- Mounted consumer: `/competition/pbo-competitie-2026-2027`, confirmed on 2026-10-28.
- Nx projects: `frontend-pages-competition`, `backend-translate`; consuming application: `app`.
- Sources: [template][template], [tests][tests], [routes][routes], [translations][translations].
  The API regenerated the two corresponding [translation types][types].

## Scope

- Localize only unnamed draw labels, their external-link accessible names, and the empty Card message.
- Preserve truthy-name selection, ordering, routes, metadata, external-link
  visibility/security attributes, native PrimeNG Buttons/Message, and responsive layout.
- User-requested correction: replace GUID fragments with the draw's one-based displayed position within
  its sub-event. Restart numbering per sub-event; real names remain unchanged. Numbers are positional,
  not persistent identifiers, and may change if draw order changes.
- Use competition-specific keys in English, Dutch, and French. Keep existing singular terminology.
- Exclude tournament pages, shared terminology, hero statistics, other Card content, services, sync,
  permissions, global styles/theme, and backend behavior. No dependencies or operational mutations.

## Baseline and proposed approach

- Live route: 12 Cards, 26 internal and 26 external draw links; no empty Cards or unnamed draws.
- Both visible and accessible unnamed-draw labels hard-code `Draw ` plus eight ID characters.
- `all.competition.noDrawsYet` is absent in all locale assets. The existing similarly named keys belong
  to tournament administration; the template's `default` interpolation parameter is not a missing-key fallback.
- Add two competition-specific keys per locale and share one template-local translated fallback value
  between visible and accessible labels. Leave the existing truthy name and ID behavior unchanged.
- Keep native PrimeNG presentation and all class lists unchanged. No new styling or abstraction.
- Capture mounted normal-state geometry/destinations and use component fixtures for missing/empty data;
  do not mutate operational records for evidence.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, and bounded scope.
- [x] Localize both fallback surfaces and the real empty-state translation path.
- [x] Cover real locale assets, name/ID edge cases, and runtime language changes.
- [x] Preserve native presentation, links, metadata, and unrelated consumers.
- [x] Record focused validation, browser evidence, and handoff.

## Acceptance and verification

- [x] Empty, null, and missing names use localized one-based displayed positions, resetting per sub-event.
- [x] Truthy names, including whitespace, remain unchanged; GUID/short-ID routes remain unchanged.
- [x] Visible fallback and external accessible name agree in all three locales; mounted language changes
      are component-tested. Browser locale checks use reloads, not the live language selector.
- [x] Empty and missing draw arrays render the localized native secondary Message without raw keys (tests).
- [x] Real locale assets contain both keys and the same interpolation placeholder.
- [x] Ordered mounted destinations and normal draw names remain unchanged.
- [x] Light/dark at measured 390px/1280px fit; keyboard/focus and accessible link labels remain usable.
- [x] No class, color, SCSS, inline-style, global-theme, dependency, or permission changes.
- [x] Relevant Nx test/lint/build checks pass; exact results are recorded.
- [x] SSR and mounted locale loading are checked without overstating edge-case/hydration evidence.
- [ ] Operational unnamed/empty records, screen-reader output, and exhaustive hydration checks.
- [x] User approved the initial version and scoped commit on 2026-10-28 with disclosed verification limits.
- [x] User approved the numbered-label correction and separate commit with the recorded limits on 2026-10-28.

## Evidence and handoff

### Numbered-label review correction

- The initial approved version was committed as `7382cbb8`.
- The user then noted that IDs are GUIDs and selected "Localized numbered label, such as Poule 1".
  This authorizes implementing the numbered correction, not amending the original commit.
- New scope: use the existing sorted loop index for fallback copy, replace `{{id}}` with `{{number}}`
  in all three locale assets, remove the now-unused SlicePipe import, and update regression coverage.
- Corrected validation: 49/49 component tests pass. The three added cases verify sorted numbering, multiple
  unnamed draws, preserved names/destinations, matching external names, and per-sub-event resets with each
  real locale asset. Existing null/missing/empty-name cases now require numbered copy, independently of IDs.
- The same focused Nx test/lint and app build commands below pass after the correction, including all 29
  build prerequisites. Competition lint retains 41 existing warnings; translation lint passes.
  Repository-required lint was rerun after correction approval and passes across all 34 projects.
  The app build/API restart briefly prevented browser loading; ports 5000 and 3000 recovered before checks.
- Mounted browser-only cloned-resource fixtures produce Dutch `Poule 1`, `Poule 2`, and a fresh `Poule 1`
  in the other sub-event. English/French reloads produce `Draw 1`/`Draw 2` and `Calendrier 1`/`Calendrier 2`,
  including matching external accessible names. No API/database mutations were made.
- Corrected light/dark geometry at explicitly measured 390px/1280px (client 375/1265) has no document overflow
  or anchors outside Cards. Tab reaches the named external fallback anchor with native focus-visible outline.
  Styling/contrast tokens are unchanged from the initial measured values.
- Both corrected 390px Card captures were inspected:
  `tmp/design-refresh/DR-015g-numbered-{light,dark}-card.png`.
- Before synthetic changes, all 52 ordered populated article link records retain the initial fingerprint.
  Reload restores actual data, Dutch, and dark theme. Corrected populated SSR responds HTTP 200 with 12 Cards
  and 52 article anchors. Operational unnamed records, exhaustive hydration, and screen-reader output remain
  unverified; initial screenshot-size limits still apply.
- Format commands additionally include
  `libs\frontend\pages\competition\src\pages\detail\page-detail.component.ts` for the SlicePipe removal.
  No new translation keys/types, styles, or dependencies were added by the correction.
- Initial evidence below is historical where it refers to GUID-based fallback copy, not proof of numbering.
- Approval: the user selected "Approve correction and commit with the recorded verification limits"
  on 2026-10-28. The backlog is Done on this explicit approval; unchecked checks remain unverified.
  The original `7382cbb8` is not amended; this correction and its handoff are approved for a separate commit.
- Next action for a fresh invocation: scope DR-016's mounted competition draw page as one bounded child,
  confirm its real route/consumer, and create a brief before editing. Parent DR-015 remains open pending
  parent-level acceptance. No second implementation slice was started; no push is authorized.

### Initial approved GUID-version evidence

- Worktree was clean before selection.
- Playwright MCP browser was occupied; integrated VS Code browser successfully mounted the supplied route.
- Changed scope: two template-local copy surfaces and one empty Message expression, two new keys per locale,
  twelve regression cases, generated translation types, test cache inputs, and this repository handoff.
  No application TypeScript, shared component, tournament asset value, theme, or behavior changed.
- A single `@let drawName` keeps visible and accessible names synchronized without a helper/component.
  All class tokens and native PrimeNG options remain unchanged. No new styling exception is needed.
- Real assets are loaded through Node filesystem APIs only in tests. The competition test target explicitly
  includes locale asset files in its Nx inputs so translation-only edits invalidate the cached test result.
- Validation on 2026-10-28:

  ```powershell
  npm exec -- prettier --write "libs\frontend\pages\competition\src\pages\detail\page-detail.component.html" `
    "libs\frontend\pages\competition\src\pages\detail\page-detail.component.spec.ts" `
    "libs\frontend\pages\competition\project.json" `
    "libs\backend\translate\assets\i18n\en\all.json" `
    "libs\backend\translate\assets\i18n\nl_BE\all.json" `
    "libs\backend\translate\assets\i18n\fr_BE\all.json" `
    "libs\utils\i18n\src\lib\i18n.generated.ts" `
    "docs\design-refresh\backlog.md" "docs\design-refresh\work-items\DR-015g-competition-draw-copy.md"
  $env:NX_DAEMON='false'
  npm exec -- nx run-many -t test,lint -p frontend-pages-competition,backend-translate --output-style=static
  npm exec -- nx run app:build --output-style=static
  npm exec -- nx run-many --target=lint --output-style=static
  git diff --check
  ```

- Competition tests: 46/46 pass. Competition lint passes with 41 existing warnings; translation lint passes.
  Translation test target exits successfully with no tests. App build and all 29 prerequisites pass.
  Focused tests/lint were rerun successfully after adding the final test cache inputs.
  After approval, repository-required lint passes across all 34 projects with existing warnings.
  Existing Nx executor deprecation and TypeScript metadata advisories remain. No full repository suite was run.
- Translation changes restarted the API and briefly produced 502 responses in the browser. The initial port-5000
  probe omitted `/api/v1` and therefore returned 404 after recovery; that bounded helper was stopped.
  Subsequent real endpoint fetches for all three locales return HTTP 200 and the exact new copy.
  PowerShell's legacy JSON parser rejected unrelated case-only duplicate keys; browser JSON parsing succeeds.
- Populated before/after: 12 Cards and all 52 ordered article link href/text/accessible-name records retain SHA-256
  `e7378a335d7d3d024db3293afb1a59728fd5b8df6486e793dd01e3941d5f2a20`.
- Browser-only edge fixtures use the existing Angular resource setter on a cloned competition value:
  one blank draw name and one empty draw array. These exercise actual Angular templates/translations;
  they do not write to the API/database. Reload restores real data and removes the temporary snapshot property.
- Synthetic Dutch result: `Poule 78d42486`, matching external accessible name, `Nog geen poules ingesteld`.
  Measured light/dark at 390px and 1280px (client widths 375/1265) have no document overflow or links/Messages
  outside Cards. The 1280px media query is explicitly confirmed; no proxy width is claimed.
- Browser locale reloads also render English `Draw 78d42486` / `No draws configured yet` and French
  `Calendrier 78d42486` / `Aucun calendrier configuré pour le moment`.
  French at 390px has no document/Message overflow. Original Dutch cookie and dark theme were restored.
- Keyboard Tab reaches the fallback's named external anchor; Shift+Tab returns to the internal link.
  Both are focus-visible; the external anchor retains its native solid 1px outline. No operational control
  or third-party destination was activated.
- Composited sRGB text contrast in the synthetic state: fallback 19.87:1 light / 16.00:1 dark;
  empty Message 7.74:1 light / 9.51:1 dark. Accessible names are also component-tested.
- Evidence is local-only under `tmp/design-refresh/DR-015g-*`:
  two light baseline captures, four populated after captures, and four French synthetic Card captures.
  All four `synthetic-fr-{light,dark}-{fallback,empty}.png` images were inspected at 390px;
  the light narrow and dark wide populated captures were inspected.
  Integrated full-page screenshot capture can reset emulated width to the embedded browser's 1066px width;
  requested `1280` filenames are not proof of actual screenshot width. Exact 390/1280 layout claims above
  use explicit CDP measurements taken separately from screenshots.
- Final same-origin SSR fetch: HTTP 200, 12 Cards, 52 article anchors, no unresolved empty-copy key.
  Final hydrated real data matches the original ordered link fingerprint. This is not exhaustive hydration
  or live operational empty-state evidence; the real route has no unnamed/empty records.
- Exceptions: none.
- Approval on 2026-10-28: the user selected "Approve completion and commit with the disclosed verification limits".
  The backlog is Done on this explicit approval. Operational edge records, assistive-technology output,
  exhaustive hydration, and screenshot-sizing limits remain disclosed; approval does not mean they passed.
- Next action for a fresh invocation: scope DR-016's mounted competition draw page as one bounded child,
  confirm the actual route/consumer, and create its brief before editing. Do not restart DR-015g.
  Parent DR-015 remains open pending parent-level acceptance. No second implementation slice was started.
- Only this slice's implementation, tests, and handoff are approved for commit. No push is authorized.

[template]: ../../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.html
[tests]: ../../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.spec.ts
[routes]: ../../../../libs/frontend/pages/competition/src/lib.routes.ts
[translations]: ../../../../libs/backend/translate/assets/i18n
[types]: ../../../../libs/utils/i18n/src/lib/i18n.generated.ts
