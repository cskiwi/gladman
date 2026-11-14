---
title: 'DR-014a: Team-detail page chrome'
description: 'Refresh team identity, contact links and main loading/error presentation without changing page datasets.'
---

## Identity

- ID: DR-014a; parent [DR-014](DR-014-club-team-detail.md).
- Status: authoritative in the [backlog](../backlog.md).
- Dependencies: completed DR-004 shared hero; no shared component changes.
- Rules: [design refresh plan](../README.md).
- Selected on 2026-11-14 from the next action after completed DR-013; clean worktree.

## Scope

- Mounted `/clubs/:clubId/teams/:teamId`, confirmed from the club Teams tab at
  `/clubs/smash-for-fun/teams/1161b779-2cbe-457c-b829-e0d756ff99bc`.
- Project `frontend-pages-club`; [page template](../../../libs/frontend/pages/club/src/pages/team-detail/page-team-detail.component.html),
  [component](../../../libs/frontend/pages/club/src/pages/team-detail/page-team-detail.component.ts) and directly
  coupled main-resource guards in its [service](../../../libs/frontend/pages/club/src/pages/team-detail/page-team-detail.service.ts).
- Identity: existing team code/name, draw label, level range and captain link.
- Actions: native styled email/telephone anchors, retaining exact URI construction and conditional visibility.
- Loading/error: native responsive progress indicator and localized error Message; keep backend error logging.
- Related assets: `all.team.detail.loadError` / `loading` in nl_BE/fr_BE/en translation JSON;
  no backend source/query/persistence changes.
- After the user's API refresh, generated `libs/utils/i18n/src/lib/i18n.generated.ts` includes only four related
  type lines for those keys. Preserve the generated output; its existing formatter-ignore declarations remain.
- Preserve all data, routing, permissions, date/score calculations, SEO and membership operations.
- Exclude hero stats, roster/empty state, encounter sections/empty state, unused team-encounters component,
  fallback-draw behavior, shared hero/theme, backend algorithms and persistence.

## Baseline and approach

- At 390px the real team name truncates; both contact links have no accessible name. At wide width the hero fits.
- Replace clip-path crest with existing `app-hero-avatar`, title with `app-hero-title`, level chip with native
  secondary Tag (retain zero/min/max range semantics). Captain label uses normal sentence-case text.
- Contact anchors use native `pButton`, icons hidden from accessibility, existing localized email/phone labels
  and visible names. Keep tooltip values without copying real contact data into evidence.
- Replace fixed-width Skeletons with indeterminate ProgressBar and native Message with nl/fr/en error copy.
- Guard all main-resource reads using one private computed value; error reads must not throw while SEO/effects run.
- Existing smart service/shared presentational components are sufficient; no additional wrapper/extraction.
- Keep captain text semantic normal text: a primary-text trial measured 3.65:1 in light mode, so it was removed
  before completion. Underlining preserves link affordance without a shared palette change.
- No new CSS, numbered colors, inline styling or theme changes. Legacy classes outside scope remain for children.
- Safe evidence uses synthetic contact/captain data when capturing visuals; no contact dispatch or mutations.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies and smallest reviewable child.
- [x] Reuse native/shared identity rendering and preserve metadata.
- [x] Native named contact anchors retain href and conditional visibility.
- [x] Native loading/error renders responsively, including failed resource reads.
- [x] Verify translated loading/error from the actual served assets (Dutch browser; all three endpoint copies).
- [x] Record before/after utility usage and unrelated discoveries.
- [x] Keep excluded consumers/global settings unchanged.

## Acceptance and verification

- [x] Identity and contact actions fit in light/dark at 390px and 1440px without title truncation.
- [ ] Keyboard reaches named contact anchors; labels, focus and sampled contrast verified.
- [x] Level zero, min-only, max-only, range and absent metadata preserved.
- [x] Contact href values and missing-contact visibility preserved.
- [x] Main loading and failed-team/related-query states show native feedback, not blank/stuck UI.
- [ ] Route changes recover after a main-resource error without stale page data.
- [x] No new non-semantic colors, SCSS, inline styling, shared theme or wrapper.
- [ ] Relevant focused Nx lint/build/tests pass; failures and overrides recorded separately.
- [x] Locale copy/parameters checked; browser locale limitations and SSR/hydration recorded.
- [x] User approval received with the explicitly disclosed verification limits.

## Validation evidence (2026-11-14)

### Source and Nx

- Identity/contact literal class tokens before the Stats-strip marker: **105 -> 36**, including the new outer
  error wrapper. No stylesheet removed/added; legacy classes in excluded stats/roster/encounters remain.
- Stats strip, roster and encounter regions compare equal with whitespace removed. Whole-template changes outside
  scope are repository-formatter line wrapping/indentation only. Component queries, permissions, SEO and calculations
  remain unchanged. Service has one guarded main-resource read reused by all its dependent selectors.
- **Passed:** `NX_DAEMON=false npx nx run-many --target=lint,build --projects=frontend-pages-club`.
  Initial run: 12 tasks succeeded / 4 cached. Final run after captain contrast correction: 12 succeeded / 10 cached.
  Existing lint warnings remain; no lint errors or build failures.
- **Failed before tests executed:** `NX_DAEMON=false npx nx run frontend-pages-club:test
--testPathPatterns=page-team-detail.service.spec.ts --runInBand --output-style=static`.
  Missing `zone.js` in the existing zone setup; tracked by DR-059, not changed here.
- **Passed with temporary setup override:** same focused test command plus
  `--jestConfig=C:\Users\glenn\.copilot\session-state\d33b4813-2f0e-4837-a657-05a154cd5c05\files\dr014a-jest.config.cjs`.
  One suite / **two tests**: failed team request and failed related request; all selectors remain safe and a new
  team filter recovers. The temporary config spread the existing club config with an absolute club `rootDir`,
  replacing only `setupFilesAfterEnv` with `setupZonelessTestEnv` and unknown-element/property checks.
  Temporary files were removed; this is not a committed infrastructure fix or a claim that default tests pass.
- An initial actual-template Jest attempt also encountered the current harness's unresolved external component
  templates. It was not retained as a failing test. Final regressions cover the core resource guard; actual
  presentation/metadata are checked in the mounted browser instead.
- **Passed:** JSON parse and identical two-key/no-parameter parity in nl_BE/fr_BE/en source assets; existing email,
  phone, captain and level labels reused.
- PrimeNG native anchor example supports `a pButton href`. Metadata-only validation incorrectly flags native `href`
  as a Button input; actual template build/native anchor rendering pass. ProgressBar and Message metadata validate.
- **Passed:** `git diff --check`; all scoped files formatted with repository `npx prettier --write`.

### Browser

- Real mounted team loaded in Dutch with eight players and 16 encounter Cards. In both themes at 390px/1440px:
  document/hero have no horizontal overflow, complete team heading fits and contact actions stay within viewport.
- Synthetic read-only fixtures on the existing mounted component's main resource confirm exact
  `mailto:team@example.invalid` / `tel:+32000000000` hrefs and visible E-mail/Telefoon names.
  No dispatch, membership operation or database mutation. The four-case keyboard matrix has actual Tab focus
  captain -> E-mail -> Telefoon; first anchor matches `:focus-visible`.
- Synthetic min 0 / max 3, min-only 0, max-only 3 and absent levels render correct Tag content (absent hides it).
  Missing both contacts hides both anchors. A 132-character unbroken synthetic title wraps at 390px with no clipping.
- Screenshots viewed for synthetic dark wide and light narrow heroes; do not commit contact-bearing screenshots/logs.
  Final captain normal-color correction rechecked on the real loaded narrow hero in both themes.
- Sampled normal text contrast (light/dark): heading/captain **19.87/16.00:1**, level Tag **7.74/9.51:1**,
  contact labels **4.87/6.65:1**. Full accessibility, focus-ring contrast, tooltip and hover matrix remain unchecked.
  No global workaround introduced.
- Synthetic delayed main request renders native ProgressBar within 390px; synthetic team and related errors render
  native Message with no hero/stuck ProgressBar. New team filter recovers. **Zero GraphQL mutations** in this matrix.
- **Initial failed live localization (resolved below):** loading label was `all.team.detail.loading`,
  error was `all.team.detail.loadError`.
  Both API and frontend proxy `/api/v1/translate/i18n/nl_BE` return 200, but response `all.team.detail` is absent.
  Reachability alone was not evidence that new assets were served.
- Browser interception on initial navigation does not replace server-side/transfer-cache data; final synthetic
  tests trigger only the already-mounted resource with fresh IDs inside the read-only browser test.
- The original frontend stopped during validation. `NX_DAEMON=false npx nx run app:serve` provided a temporary
  verification helper; readiness confirmed by listener/browser/proxy 200. Helper stopped before handoff.
  Browser mocks removed, real team route restored, dark preference retained and viewport reset to 1280px
  (approximately the initial width; original `viewportSize()` was null).
- **Initial limits (Dutch loading/error subsequently verified below):** French/English browser, contact dispatch,
  live membership workflows, full keyboard/contrast audit, URL navigation after errors and full SSR/hydration.

### Follow-up after the user's API refresh

- On 2026-11-14 the user responded `I refreshed the API; continue verification`. No completion/commit approval
  was implied by that request.
- **Passed:** both `/api/v1/translate/i18n/:locale` endpoints on ports 5000/3000 return 200 and the exact
  new `all.team.detail` values for nl_BE/fr_BE/en.
- **Passed (Dutch browser):** delayed request exposes `Ploeggegevens laden...` in the native status label.
  Failed team and related requests show `De ploeggegevens konden niet worden geladen. Probeer het opnieuw.`
  with no hero or stuck ProgressBar; new filter selection recovers. No raw new keys. Zero GraphQL mutations.
- Loaded synthetic contact labels/heading continue to fit in both themes at 390px/1440px.
- **Not verified (French/English browser):** an attempted locale-cookie switch remained in Dutch; it did not
  exercise French/English rendering. The endpoints/source copies pass; do not count the attempted switch as
  a successful language check or change the application's locale-selection behavior in this slice.
- Locale preference restored, intercepts removed, real route / dark mode / 1280px viewport restored.
- API refresh automatically regenerated only the four new translation-type lines; repository formatter leaves
  the generated declarations unchanged because of their existing `prettier-ignore` annotations.
- **Passed again after generated-type follow-up:** focused club lint/build (same command above), 12 tasks succeeded /
  3 cached; `git diff --check` passes and the Review handoff is formatted.
- The user's restored frontend (port 3000) and API (5000) are running; neither was stopped. The earlier
  verification-only helper remains stopped.

## Approval and handoff

- Baseline source and browser inspected on 2026-11-14. Dark 390px: title truncated, two unnamed contact anchors;
  wide hero fits. Initial browser dark, approximately 1280px; restore initial viewport/theme after checks.
- Exceptions: none.
- On 2026-11-14 the user approved completion and commit with
  `Approve and commit DR-014a with disclosed limits`. Authoritative status **Done**.
- Approval accepts the limits below without claiming unperformed checks passed; unchecked criteria remain.
- Exact next action: scope DR-014b statistics and create its brief before implementation. No operational blocker remains.
- Still unchecked: default zone-based tests, full accessibility/focus-ring checks, French/English browser,
  live operations, URL recovery after failures and full SSR/hydration.
- Keep parent DR-014 open. DR-014b/c/d were not started in this invocation; do not reopen completed DR-014a.
- Approval authorizes only this child's implementation, tests, generated keys and repository handoff commit.
  No push is authorized.
