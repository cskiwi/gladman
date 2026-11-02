---
title: 'DR-042: Tournament draw external-link repair'
description: 'Restore the missing detail-query field and verify the existing native draw external actions.'
---

## Identity

- ID: DR-042.
- Outcome: restore existing tournament detail draw external links without changing their presentation or gates.
- Status: authoritative in the [backlog](../backlog.md).
- Dependencies: approved [DR-019g investigation](DR-019g-draw-external-link-contract.md).
- Separate repair, not a required child reopening completed DR-019.
- Design rules: [design refresh](../README.md).

## Scope

- Mounted route: `/tournament/8658b541-702a-408e-8114-2858a9428069`,
  Internationaal Tornooi Lokerse BC 2023.
- Project: `frontend-pages-tournament`.
- Add `visualCode` only to `tournamentEvent.tournamentSubEvents.drawTournaments` in the
  [detail query](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.service.ts).
- Extend the existing [component tests](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.spec.ts)
  to inspect the executed query AST and assert missing-code gates and localized fallback names.
- Preserve internal slug/ID routes, order, counts, native buttons, URL composition, names, safe link attributes,
  permissions, sync, feedback and all existing localization.
- Exclude backend, translations, shared/global styling, other routes, draw destinations and external-site navigation.

## Baseline and approach

- Clean initial worktree: `git --no-pager status --short`.
- Integrated browser mounts the supplied route on 2026-11-02: 95 internal draw anchors, zero external draw anchors,
  and Heren/Dames/Gemengd tabs. Browser preference initially dark.
- DR-019g established that all 95 draws have anonymous API codes and the backend already exposes the field.
- Use the existing native secondary text anchors; no new component or styling is required.
- No shared smart/presentational extraction: the fault is one missing data selection, not duplicated UI.
- Template utility usage, SCSS and native competition-aligned presentation remain unchanged.
- No dependencies or operational/admin mutations.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and bounded scope.
- [x] Select the existing draw field without altering other selections or variables.
- [x] Assert the exact nested path in the executed query, not a document-wide string match.
- [x] Assert missing tournament/draw-code gates, internal routes and localized fallback link names.
- [x] Preserve presentation, translations and all excluded surfaces.
- [x] Record discoveries outside scope if any arise: none.

## Acceptance and verification

- [x] Focused existing Nx lint, test and production library build pass.
- [x] Real detail response supplies 95 draw codes; other data remains unchanged.
- [x] Mounted page exposes 95 correctly composed external draw anchors with named, safe native links.
- [x] All three type tabs work in light/dark at narrow/wide widths without horizontal page overflow.
- [x] Newly reachable actions have usable keyboard access, focus and text/focus contrast.
- [x] Relevant loaded SSR/client content and link destinations agree.
- [x] User visual/functional review with explicit acceptance of disclosed verification limits.
- [ ] Screen-reader and authenticated workflows, mounted English/French and exhaustive hydration checks.

## Evidence and handoff

### Implementation and automated checks, 2026-11-02

- Production change: one added `visualCode` selection in the detail service. No template or component changes.
- Eight new cases cover exact nested executed-query AST selection, all four code-presence combinations,
  internal slug/ID routes, native/safe external contracts and actual en/nl_BE/fr_BE unnamed-draw labels.
- `npx prettier --write` was run on the service, spec, backlog and this brief before validation.
- `npx nx run frontend-pages-tournament:test --runInBand --output-style=static` before the repair:
  the new AST test fails because only draw `visualCode` is absent; the other 52 tests pass.
- `npx nx run-many --targets=lint,test,build --projects=frontend-pages-tournament --output-style=static`:
  passes all three targets and ten prerequisite build tasks; two test suites, 53 tests pass.
  Existing Nx Jest deprecation and ts-jest metadata warnings remain; no application validation errors.
- Anonymous API comparison: PowerShell here-string piped to `node -`, using installed `graphql` parse/visit/print,
  native fetch and strict assertions. Execute the exact service query and a copy removing only the draw code field,
  with the supplied tournament ID and existing minLevel ASC variables.
  Both return 30 sub-events and 95 draws; all 95 repaired draws have codes.
  Deleting only those nested code properties yields identical response data. Two queries, zero mutations.

### Mounted after-evidence

- Integrated browser reload of the supplied real route now returns 95 internal and 95 external draw anchors.
  All external anchors have correctly shaped HTTPS tournament/draw URLs, nonempty localized accessible names,
  `target="_blank"` and `rel="noopener noreferrer"`. No external site was opened.
- Eight configurations: light/dark at 360, 390, 768 and 1440px, each with Heren/Dames/Gemengd tab activation.
  Visible panel external counts remain 33/33/29. No horizontal document overflow; sampled actions fit the viewport.
- For each of the 24 settled tab/viewport/theme cases, focus the first internal draw anchor and press Tab:
  focus reaches its adjacent external action with `:focus-visible` and a 2px semantic primary ring.
  First-action dimensions are 28 by 27.5px (above the 24px minimum).
- Initial immediate post-tab sampling raced panel focus settling, producing intermittent unfocused measurements.
  Repeating with a 500ms panel-settle wait before keyboard movement and 400ms before measurement passes all 24 cases.
  Unfocused `none` rings from the first attempt are not treated as contrast measurements or product failures.
- Settled light/dark contrast, measured from rendered colors using a canvas sRGB conversion:
  external icon against Card 4.87:1 / 6.65:1; adjacent draw-name text 19.87:1 / 16.00:1;
  focus ring against Card 3.65:1 / 10.22:1. Hover icon against native hover surface 4.66:1 / 6.28:1.
  Icon-only action checks use 3:1; draw text uses 4.5:1.
- Captured and inspected narrow light/dark first-Card screenshots and wide light/dark page screenshots.
  Existing native Card/Button appearance and responsive columns remain unchanged except the restored actions.
- Browser listeners during the interaction sweep record zero page errors, console errors or GraphQL mutations.
- Read-only same-origin SSR GET returns HTTP 200: heading, all 95 internal hrefs and all 95 external
  href/name/target/rel tuples match the mounted Dutch client exactly.
  Integrated `page.request.get` first failed with unsupported `Storage.getCookies`; browser `fetch` plus inert
  DOMParser completed the comparison. No application workaround was added.
- Theme was toggled only on the document for these checks and restored to the initial dark preference;
  persisted user preference was not written.

### Limits and next action

- Not run: actual screen-reader, mounted English/French, authenticated/admin workflows, exhaustive hydration
  and third-party availability/navigation. Locale asset fixtures are not mounted-locale evidence.
- Missing-code and unnamed-draw states pass component fixtures, not a mutation of real tournament data.
  Existing loading/error/empty/sync tests pass; no new live failure or authenticated operation is claimed.
- No shared/global consumers changed; no new abstraction, dependency, utility class, SCSS or styling exception.
- No new out-of-scope discovery. Existing DR-034/DR-038 global contrast audits remain separate.
- The user selected "Approve DR-042 and commit with disclosed verification limits" on 2026-11-02.
  Approval accepts the listed unperformed checks; it does not turn them into passed verification.
  The combined unchecked criterion above is intentionally retained.
- Approved commit scope: one-field query repair, regression tests, this brief and backlog handoff. No push.
- Post-approval `npx nx run-many --target=lint --output-style=static`: all 34 projects pass, existing warnings,
  zero errors. No application changes were made after the focused build/test pass.
- Exact next action in a fresh invocation: confirm a real DR-020 creation/editing consumer, split its broad
  route/form scope into children and select one mounted route/tab. Do not start it in this invocation.
