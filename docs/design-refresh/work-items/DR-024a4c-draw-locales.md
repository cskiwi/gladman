---
title: 'DR-024a4c: Mounted draw locale completeness'
description: 'Complete draw descriptions, identity, confirmations and local operation diagnostics.'
---

## Identity and scope

- ID: DR-024a4c; parent [DR-024a4](DR-024a4-draw-dialogs-locales.md).
- Authoritative status: [backlog](../backlog.md). Rules: [design refresh](../README.md).
- Dependencies: approved DR-024a1/a2/a3 and DR-024a4a/b.
- Authorized mounted consumer reconfirmed on 2026-11-09:
  `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=draws`.
  Actual Dutch/dark 1355x1249 view selects HE 8-9 with two genuine unassigned entries and no draws.
- Projects: frontend-pages-tournament and backend-translate (dictionary assets only).
- Sources: [smart tab][component], [service][service], [locale assets][assets] and [locale regressions][tests].
- Scope: four summary descriptions; consumed French terminology; draw type/unknown identity labels;
  regenerate/delete/clear confirmations; five consumed local non-Error mutation failure messages.
- Preserve native presentation, data, payloads, permissions, selection, confirmation decisions and server Error text.
- Exclude unused dictionary blanks and service methods, other tabs, backend/schema rules, global/shared styling,
  dependencies and browser operational writes.

## Baseline and approach

- Worktree clean. Dutch/French summary descriptions are blank; English ones are already populated.
- Three native confirmations and five mounted operation fallbacks are hard-coded English.
- Draw Tags display API type codes; missing player identity is hard-coded Unknown.
- French mounted copy includes lottery/subscription/tender terminology instead of badminton draws/entries.
- Keep the existing smart tab/service boundary; no repeated live consumer warrants a dumb wrapper.
- Existing creation/seeding option labels are already localized by the approved children; verify, do not redesign.
- Keep utility/style usage unchanged. No new PrimeNG API, wrapper, styling layer or exception is needed.
- Missing/partial mutation responses remain DR-053; unmounted setEntrySeed stays outside this locale-only slice.

## Implementation checklist

- [x] Confirm mounted consumer, prerequisites and bounded scope.
- [x] Complete consumed dictionary copy and wire local labels/diagnostics.
- [x] Add asset-backed regressions for locale switching, confirmations and operation failures.
- [x] Format, validate and persist evidence and exact next action.

## Acceptance and verification

- [x] Mounted descriptions, identity/type labels, confirmations and local failures are nonblank in all three locales.
- [x] Locale switching retains selection/form/payload values without extra data queries.
- [x] Confirmation cancellation sends no mutation; accepted payloads and server diagnostics remain unchanged.
- [x] Light/dark at 390/1440px preserve descriptions, translated options and safe feedback.
- [x] Native labels, keyboard selection and modal dismissal remain usable.
- [x] No new styles, palette colors, dependencies, other-tab changes or backend operational writes.
- [x] Focused existing Nx test/lint/build checks pass.
- [ ] Shared native Button and Message normal text contrast meets 4.5:1.
- [ ] Exhaustive accessibility, live operations/permissions and SSR/hydration verified.
- [x] User review or explicit approval with disclosed limits.

## Evidence and handoff

- Before: mounted real Dutch view inspected; all four description definitions are empty.
- Four Dutch/French descriptions are now meaningful. Consumed French draw/entry/sub-event terminology is corrected;
  unused dictionary blanks remain untouched.
- Three native confirmations use the active language, with draw names and existing consequences retained.
  Five consumed non-Error failure fallbacks are localized; server/network Error messages remain unchanged.
  Displayed errors retain the language in which they were raised until retry, matching adjacent services.
- Known draw types use existing localized option labels and preserve native severity. Unknown future codes stay
  visible verbatim; missing type/player uses the existing common unknown label.
- Existing creation/seeding option labels and payloads remain intact. No new presentation extraction is justified:
  the existing smart tab/service is still the only live consumer.
- Static template class/styleClass tokens remain 124 before and after. No SCSS, inline/global styles, palette,
  shared component, theme, dependency or backend business-rule changes. No styling exceptions.
- API watcher generated precisely seven added translation-path declarations; repository formatter preserves their
  existing four-space/double-quote form.

### Validation

- Repository Prettier ran on every changed file; generated types use
  `--tab-width 4 --quote-props preserve --single-quote false`.
- `npx nx run frontend-pages-tournament:test --testPathPatterns=pages/admin/tabs/draws --runInBand --output-style=static`:
  four suites / 127 tests pass freshly; 33 new asset-backed locale cases.
  Includes all three dictionaries, nonblank descriptions/diagnostics, type/unknown names, confirmation cancellation,
  accepted regeneration, selected identities/draft/option payload preservation without extra reads,
  five local failures, preserved server diagnostics and successful recovery.
  Existing draw-list/assignment/summary/read, creation and seeding regressions remain green.
- `npx nx run-many -t lint build -p frontend-pages-tournament,backend-translate --output-style=static`:
  all 16 tasks pass; initial run replays ten tasks, final run replays fifteen and executes tournament lint.
  Existing executor/metadata warnings are not new failures.
- `git diff --check` passes; Git reports existing LF-to-CRLF configuration warnings. Authored files use LF.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all 34 projects with existing
  warnings and zero errors; 22 tasks replay cache and twelve execute. No fresh full-workspace lint run is claimed.
- Full tournament/workspace suite, app production build, live operational/permission variants,
  exhaustive accessibility/contrast and dedicated SSR/hydration checks are not run.

### Browser evidence

- Translation reload temporarily yields proxy 502 and authentication timeouts. Port 5000 subsequently recovers.
  The first dictionary probe used an incorrect endpoint and returned 404; the real
  `/api/v1/translate/i18n/{locale}` returns HTTP 200 with all required nonblank values in each locale.
- Actual authorized mounted Draws consumer is used throughout. A one-use GraphQL read fixture supplies safe
  synthetic draw/entry identities only; permissions and mutation handlers are not overridden.
  The initial fixture omits some optional selection fields and Apollo logs missing-field warnings;
  this is fixture evidence, not proof of complete live operational data.
- Twelve settled populated cases (three locales, light/dark, 390/1440px) preserve all four descriptions,
  localized type/unknown Tags and contextual action names, with no raw keys or document overflow.
  Locale switching sends zero additional draw queries and zero mutations.
- Thirty-six fresh overlays pass: three type, five size and three seeding choices are nonblank and fit
  across all twelve combinations. An initial immediate option read raced native overlay rendering and returned
  empty arrays; the repeated check waits for the first visible option and confirms actual 3/5/3 shapes.
- Native Home/ArrowDown/Enter selects POULE in twelve cases. Escape closes overlays/dialogs and restores the
  actual creation/seeding opener. Existing native labels remain bound; no full screen-reader audit is claimed.
- All nine actual native confirmation messages match their current-locale dictionaries.
  Every confirmation is dismissed; observed mutations are zero.
- Sixty local update-feedback fixtures (five diagnostics times twelve combinations) fit and retain all four
  draw Panels. They set only the client feedback signal, not operation handlers; mocked tests establish failures
  and recovery. No browser operational submissions are performed.
- Safe French dark-wide and light-narrow summary screenshots are inspected in chat, not committed.
- Existing DR-033 Button and DR-034 Message contrast failures remain unchecked; no page overrides are added.
- After cleanup/reload, original Dutch/dark/1355x1249/HE 8-9/Draws are restored. Genuine counts are
  2 total / 0 assigned / 2 unassigned / 0 draws. No synthetic IDs, errors, dialogs or selected entries remain.
- Final real keyboard refresh returns HTTP 200 without GraphQL errors and retains focus on Refresh.

### Remaining actions

- User selected "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-09.
  Authoritative child status is Done. Approval covers this child's implementation/tests/assets/generated keys and
  repository handoff, not another slice. Shared contrast failures and unperformed checks remain unchecked.
- DR-052 records adjacent French shared action/tab terminology; no shared labels are silently changed here.
- DR-053 records mounted draw operations' missing/partial-response feedback and selection/focus reliability.
- Commit only this approved child's implementation/tests/assets/generated keys and handoff without pushing.
- Exact next action in a fresh invocation: reconcile DR-024a4 aggregate evidence without restarting approved children.
- Keep DR-024a4/DR-024a/DR-024 open; no sibling implementation starts in this invocation.

[component]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/draws/draws-tab.component.ts
[service]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/draws/draws-tab.service.ts
[assets]: ../../../libs/backend/translate/assets/i18n
[tests]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/draws/draw-locales.component.spec.ts
