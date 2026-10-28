---
title: 'DR-016a: Competition poule standings'
description: 'Native PrimeNG presentation for the mounted competition poule standings only.'
---

## Identity

- ID: DR-016a; parent DR-016.
- Status: authoritative in the [backlog](../backlog.md).
- Dependencies: baseline and shared layout direction complete; none blocking this child.
- Design rules: [design refresh](../README.md).

## Scope

- Mounted route:
  `/competition/pbo-competitie-2026-2027/sub-events/8e8ba158-859c-48a7-92ca-f2c3ce805f4f/draws/78d42486-ab43-4484-9b68-a99e46bf96ae`.
- Consumer: [draw page](../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.html)
  mounts [PouleDrawComponent](../../../libs/frontend/pages/competition/src/pages/draws/components/poule-draw.component.ts)
  for `POULE`; confirmed in the browser on 2026-10-28 with nine standings and nine club links.
- Nx project: `frontend-pages-competition`.
- Preserve input order, all eight data columns, values/fallbacks, club destinations, riser-before-faller precedence,
  translations, and the empty-state copy.
- Exclude hero, outer section label, qualification, encounters, sync, data services, translations, shared components,
  global styles, and theme.
- Parent remainder: separately scope mounted draw chrome and encounter presentation; qualification requires confirming
  an actual mounted consumer before selection.

## Baseline and approach

- The existing hand-built table uses primary header fills, green/red result text, absolute-positioned color markers,
  repeated cell utilities, and an unnamed marker column.
- Replace it with a native styled PrimeNG Table in a meaningful Card; use native success/danger Tags with the existing
  localized riser/faller copy in the position cell. No new status column or translations are needed.
- Keep horizontal scrolling local to the table and give its keyboard-focusable scroll container a localized name.
- Use a native secondary Message for the existing empty-state copy.
- Before screenshot: `tmp/design-refresh/DR-016a-before-dark-wide.png` (local, uncommitted evidence).
- Baseline populated rows: positions 1-9, teams De Mintons 3H, Dendermondse 3H, Lokerse 4H, De Mintons 2H,
  Geraardsbergen 1H, Denderleeuw 1H, Smash For Fun 1H, Pluimplukkers 5H, Gentse 1H.
- Baseline result sequence (played/won/lost; games; sets; points):
  `3/2/1;6-2;13-5;4`, `4/1/2;0-0;0-0;3`, `4/0/3;5-11;16-23;1`,
  `5/3/2;8-8;18-20;6`, `3/1/2;5-3;10-9;2`, `5/3/1;0-0;0-0;7`,
  `3/2/1;0-0;0-0;4`, `2/1/1;0-0;0-0;2`, `1/0/0;0-0;0-0;1`.

## Implementation checklist

- [x] Confirm mounted consumer and bounded scope.
- [x] Preserve data, links, ordering, status precedence, and translations.
- [x] Use native Table, Card, Tag, and Message without custom styles.
- [x] Remove only custom markup in this component.
- [x] Record remaining parent work without changing adjacent components.

## Acceptance and verification

- [x] Native PrimeNG components cover presentation; no new SCSS, inline styles, palette colors, or numbered utilities.
- [x] Remaining utilities have a necessary layout/typography purpose; compare before/after counts.
- [x] Populated rows and club links match baseline.
- [x] Zero/missing values, missing club slug, both status flags, and empty input have component coverage.
- [x] Light/dark at 390px/1280px preserve all data with local horizontal scrolling.
- [x] Keyboard focus, localized labels, status meaning beyond color, and normal-state contrast are checked.
- [x] Existing relevant Nx tests, lint, and application build pass.
- [x] Three mounted locales, populated SSR, and hydrated template/resource updates are checked.
- [x] Four populated and four final French empty screenshots are inspected.
- [ ] Actual screen-reader output, operational empty/missing records, exhaustive hydration, and all hover/active states.
- [x] User approval of completion with the recorded verification limits after the no-pass-through correction.

## Evidence and handoff

- Worktree was clean before selection on 2026-10-28. Changed scope: this brief, backlog, and
  `poule-draw.component.{ts,html,spec.ts}` only. No shared or backend changes.
- Table headers use `scope="col"`; an outer semantic scroll region has localized naming and `tabindex="0"`.
  The native table is contained within that named region, without pass-through options.
  Native Tags have `role="img"`, localized names/tooltips, and
  up/down icons, so promotion/relegation is no longer color-only. Riser still takes precedence if both flags are set.
- Existing numeric presentation is deliberately unchanged, including zero points as `-`.
  No new sorting, pagination, filtering, row selection, calculations, or navigation behavior is added.
- Literal class attributes: 29 to 7; class tokens: 96 to 16; unique tokens: 48 to 15.
  Remaining classes cover heading typography, position/icon alignment, empty text separation, and existing link behavior.
  `overflow-x-auto` and the Table's `block min-w-max` move scrolling to the named region without modifying PrimeNG
  internals. There is only one actual horizontal scrollbar; the native inner container does not overflow.
- Validation commands, all run after formatting the changed application files:

  ```powershell
  npm exec -- prettier --write "libs\frontend\pages\competition\src\pages\draws\components\poule-draw.component.ts" `
    "libs\frontend\pages\competition\src\pages\draws\components\poule-draw.component.html" `
    "libs\frontend\pages\competition\src\pages\draws\components\poule-draw.component.spec.ts" `
    "docs\design-refresh\backlog.md" "docs\design-refresh\work-items\DR-016a-poule-standings.md"
  npx nx run-many -t test,lint -p frontend-pages-competition --output-style=static
  npx nx run app:build --output-style=static
  git diff --check
  ```

- Final competition tests: 63/63 pass (49 existing detail cases and 14 new standings cases).
  Lint: pass with 41 existing warnings. App build and all 29 prerequisites: pass.
  Existing Nx executor deprecation/TypeScript metadata advisories remain. Full repository tests not run.
  After approval, `npx nx run-many --target=lint --output-style=static` passes across all 34 projects:
  34 cached results, existing warnings, no errors.
- Initial tests had four incorrect severity-class assertions against children rather than native component hosts;
  corrected assertions pass. Browser checks caught concatenated empty text; a small vertical layout now separates it.
- Mounted populated baseline and final normalized eight-cell rows and ordered nine club destinations match exactly.
  Both themes at 1280px have document/client widths 1265/1265 and a 1188px table viewport with no local overflow.
  Both themes at 390px have document/client widths 375/375 and a 312px region viewport over 767px of content.
  The native inner container has equal client/scroll widths of 767px.
- Keyboard checks at both widths/themes: Shift+Tab then Tab reaches the named scroll region, with a visible native
  1px outline. At 390px, ArrowRight scrolls 40px (maximum 455px); at 1280px no horizontal scroll is needed.
  The next Tab reaches `/clubs/de-mintons` with visible native focus. No link or operational action was activated.
- Accessibility snapshot originally exposed a named region/table, eight column headers, and localized rise/fall names.
  After the no-pass-through correction, the localized name is on the outer region, not the table itself;
  native table/column-header semantics remain unchanged.
  This is static browser accessibility-tree evidence, not actual screen-reader output.
- Measured composited sRGB normal-state contrast: heading 19.87:1 light / 16.00:1 dark;
  cells/links 19.87:1 light / 16.64:1 dark; up/down icons 4.57/5.30:1 light and 11.18/9.18:1 dark.
- Initial info Message dark text failed 4.5:1 at 4.32:1. Native secondary severity replaces it without token overrides;
  final empty text contrast is 7.74:1 light / 9.51:1 dark. No styling exception is required.
- Browser locale reloads confirm real English, Dutch, and French heading/status labels. Empty-state fixtures use the
  mounted Angular resource setter with a cloned value and `entries: []`, never an API/database write.
  All twelve locale/light-dark/390-1280 combinations preserve separated translated text and have zero document overflow.
  Final reload restores nine real entries, original locale cookies, 1280px viewport, and persisted theme.
- The first fixture attempt reached SSR markup before Angular hydration and could not obtain the component.
  Subsequent fixtures explicitly wait for the mounted resource before updates; no application fallback was added.
- Populated same-origin SSR fetch after the correction: HTTP 200, named keyboard-focusable region,
  native Table, nine rows, two named status images. Runtime Table `pt()` is undefined.
  Mounted hydration/resource updates work; exhaustive hydration, operational edge records, and assistive technology
  are not claimed. Loading/error/disabled/permission behavior outside the child was not exercised.
- Local evidence (not committed): `tmp/design-refresh/DR-016a-before-{light,dark}-{narrow,wide}.png`,
  `DR-016a-after-{light,dark}-{390,1280}.png`, and
  `DR-016a-empty-secondary-fr-{light,dark}-{390,1280}.png`.
  Corrected populated evidence is `DR-016a-no-pt-{light,dark}-{390,1280}.png`;
  earlier populated captures remain historical.
  Dark-wide baseline was captured at 1646px; light-wide at 1280px; narrow captures at 390px.
  All four original and all four corrected populated images, and all four final secondary empty images, were inspected.
- User correction on 2026-10-28: "Just don't use [pt] please". Removed `[pt]` entirely rather than replacing it with
  imperative internal DOM changes or custom styling. Added an assertion that Table `pt()` is undefined and retained
  locale assertions on the outer region. All 63 tests, focused lint, and app build with 29 prerequisites pass again.
  Corrected light/dark 390px/1280px checks confirm row/link equality, no document overflow, native focus visibility,
  keyboard scrolling on the outer region, and focus on the next club link.
  Empty presentation was unchanged; its twelve-case verification remains the evidence above.
  The correction request alone was not approval; the slice stayed in Review until the explicit approval below.
- Reusable decision: use native neutral Message severity for informational empty states when the preset's info
  severity fails text contrast; use named directional Tags rather than absolute color-only table-cell markers.
- Approval on 2026-10-28: the user selected "Approve completion and commit with the recorded verification limits".
  This authorizes only this child's implementation, tests, and handoff commit, not a push or another implementation slice.
  Operational empty/missing records, actual screen-reader output, exhaustive hydration, and every hover/active state
  remain unverified. Their checkbox remains unchecked; completion approval is not a claim that those checks passed.
- Exceptions: none. No dependencies, operational mutations, or pushes.
- Loading/error/permissions remain owned by the unchanged draw page; the child has only entries/empty states.
- Next action for a fresh invocation: scope a separate DR-016 draw-chrome child, confirm its mounted consumer,
  and create its brief before editing. Do not restart DR-016a or begin a second implementation slice here.
