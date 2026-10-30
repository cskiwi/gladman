---
title: 'DR-016g: League standings terminology'
description: 'Clarify team positions in the competition table using appropriate Dutch and French terminology.'
---

## Identity and scope

- ID: DR-016g; parent DR-016. Authoritative status: [backlog](../backlog.md).
- Follow-up requested on 2026-10-30 after approved DR-016f commit `edea5823`.
- Design rules: [design refresh](../README.md).
- Same mounted poule route and input-only consumer as [DR-016f](DR-016f-standings-section-chrome.md).
- Correct Dutch standings/position to `Stand`/`Plaats` and French to `Classement`/`Rang`.
  Align both empty titles/descriptions with the teams' league standing.
- English `Standings`/`Position` already has the intended meaning and remains unchanged.
- Preserve existing numeric position ordering, data, accessibility naming, routes, styles, and all other copy.
  The existing qualification table also consumes the position key; no qualification markup or behavior changes.
- No new component, styles, colors, dependencies, backend logic, or translation keys.

## Implementation and verification

- [x] Confirm existing standings selector orders teams by recorded numeric position.
- [x] Update Dutch/French heading, position label, and empty copy without changing ordering.
- [x] Add explicit expected terminology assertions using real English/Dutch/French assets.
- [x] Format changed files and run relevant competition tests/lint.
- [x] Wait for translation API after reload and verify mounted Dutch heading, region, and column.
- [x] Record results and remaining limits.
- [ ] Mounted French/English locale switching verified.
- [x] User approval of this follow-up.

## Evidence and handoff

- Changed scope: two locale JSON assets, existing poule component spec, this brief, and backlog.
- Validation commands:

  ```powershell
  npm exec -- prettier --write --end-of-line lf `
    "libs\backend\translate\assets\i18n\nl_BE\all.json" `
    "libs\backend\translate\assets\i18n\fr_BE\all.json" `
    "libs\frontend\pages\competition\src\pages\draws\components\poule-draw.component.spec.ts" `
    "docs\design-refresh\backlog.md" "docs\design-refresh\work-items\DR-016g-standings-terminology.md"
  npm exec -- nx run-many -t test,lint -p frontend-pages-competition --output-style=static
  git diff --check
  ```

- Tests pass: 101/101 across three suites. Lint passes with 41 existing warnings, no errors.
  Real locale tests pin intended heading, position, and empty title; populated and empty semantics still pass.
- Initial API wait failed with 404 after using an incorrect unversioned path. The user supplied
  `http://localhost:3000/api/v1/translate/i18n/nl_BE`, which is the correct frontend proxy URL.
  Read-only Node fetches confirmed HTTP 200 and intended heading, position, and both empty strings for Dutch/French;
  English remains unchanged. No operational mutations or process restarts were performed.
- Mounted page reload: Dutch h2 and region both `Stand`, first column `Plaats`, positions 1 through 9.
  An earlier transient 502 occurred during backend reload; the corrected translation endpoint and settled page pass.
- Integrated-browser context cookie access is unsupported. Document-cookie locale switching followed by reload
  still produced Dutch for French/English attempts; these mounted locale checks did not pass.
  Original document-cookie value was restored. French/English evidence is API and component-level only.
- App build not rerun: production changes are JSON copy only; the focused component suites load those real assets.
  Full accessibility/visual matrices, actual screen-reader output, and operational empty records were not rerun.
- DR-016f remains Done; its approved implementation is not reopened.
- On 2026-10-30 the user selected "Approve and commit with the recorded verification limits".
  Status is Done by explicit approval; mounted French/English switching remains unchecked.
  Approval does not establish that unperformed checks passed. Only this slice and its handoff may be committed;
  no push authorized.
- Post-approval `npm exec -- nx run-many --target=lint --output-style=static` passes across all 34 projects
  (29 cached results, existing warnings, no errors).
- Exact next action for a fresh invocation: confirm a mounted qualification consumer before scoping another DR-016
  child; otherwise record its deferral and reconcile remaining parent acceptance.
- No exception or new reusable-pattern decision.
