---
title: 'DR-024b3: Scheduling filters and actions'
description: 'Native Scheduling controls with localized labels and preserved action gates.'
---

## Identity and scope

- ID: DR-024b3. Status is authoritative in the [backlog](../backlog.md).
- Parent: [DR-024b Scheduling](DR-024b-admin-scheduling.md).
- Dependencies: approved [read/error prerequisite](DR-024b1-schedule-read.md) and
  [summary](DR-024b2-schedule-summary.md).
- Rules: [design refresh](../README.md).
- Confirmed consumer on 2026-11-10: authorized
  `/tournament/759e0526-8440-4108-bba3-55a7d8b94e72/admin?tab=schedule`,
  one normally mounted `app-schedule-tab`, visible document, Dutch/dark/1355x1249, genuine empty data.
- Project: `frontend-pages-tournament`.
- Sources: [template][template], [smart tab][component], [read service][service], [tests][tests].
- Change only the date filter/action bar, its consumed locale copy and focused regression tests.
- Preserve date selection/clear/refetch, action handlers, updating and count-based disabled states,
  panel visibility and existing permission/phase/read-state gates.
- Exclude summary, grid/game-panel presentation, operational dialogs/confirmation workflows,
  backend/schema, global/shared styling and operational browser writes.

## Baseline and approach

- Before screenshot on the real consumer shows a custom bordered/emphasized action surface,
  a blank Dutch date label, icon-only unnamed publish/refresh/panel buttons and English tooltips.
- Replace that surface with a native styled Toolbar and necessary responsive layout only.
- Use Select `inputId` and a localized accessible name, existing nonempty `filterByDate` and
  `publishSchedule` copy, and localized refresh/panel-toggle names.
- Fill the existing consumed `hideUnscheduled`/`showUnscheduled` keys in Dutch/French.
  Do not add translation aliases or repair unrelated blank grid/dialog strings.
- Keep the smart tab/service split. No second mounted domain consumer shares these controls;
  extracting a dumb wrapper would only relocate native markup, not remove meaningful duplication.
- Before: controls have 21 static class/styleClass tokens; whole template has 521.
- Native named Select templates replace ignored legacy `pTemplate` attributes: populated options previously
  exposed raw JavaScript Date strings instead of the existing intended `EEE, MMM d` format.
- No new styling layer, dependency or exception is proposed.

## Implementation checklist

- [x] Confirm mounted consumer, prerequisites and bounded scope.
- [x] Simplify the action surface using native PrimeNG and preserve handlers/gates.
- [x] Localize consumed labels and associate the filter label with its actual control.
- [x] Cover locale, filtering/clear/refetch, panel toggle, disabled and pending/error states.
- [x] Record validation, review limits and accurate next action in repository handoffs.

## Acceptance and verification

- [x] A named native Toolbar contains a labeled date Select and named actions.
- [x] Filter selection/clear/refetch and panel toggling preserve behavior without mutations.
- [x] Count-based and updating gates preserve the existing action behavior.
- [x] English/Dutch/French consumed control labels are nonempty.
- [x] Light/dark at 390px/1440px retain usable controls without action-bar overflow.
- [x] Tab sequence, focus-visible, toggle Enter, Delete clear, accessible names and contrast are checked.
- [ ] Complete keyboard-only date selection and exhaustive overlay/screen-reader checks pass.
- [x] No new palette classes, SCSS, inline styles or global/shared changes.
- [x] Relevant Nx lint/build/focused tests pass.
- [ ] Applicable full workflow and SSR/hydration checks pass.
- [x] User review/approval is recorded.

## Evidence and handoff

- Initial worktree is clean. Before screenshot and DOM confirm the real mounted consumer.
- Changed scope: Toolbar/date templates, Toolbar import, focused component tests, two existing locale keys
  in Dutch/French, this brief, backlog and parent handoff. No service/schema/global changes or generated keys.
- Static utility tokens fall 21 to 14 in controls and 521 to 514 in the whole template.
  Dynamic icon classes are not counted as static layout tokens. No new wrapper component or stylesheet.
- Passed commands:
  - `npx prettier --write` with every changed path, before validation.
  - `npx nx run frontend-pages-tournament:test --testPathPatterns=schedule-tab.component.spec.ts
--runInBand --output-style=static`: all 20 tests pass, fresh execution.
  - Three new locale cases cover real dictionaries, native names/label associations and both toggle states.
    Action cases cover empty/populated/updating gates, exactly-once handler dispatch without writes,
    current-date refresh, formatted selected date and native clear. Existing pending/error cases hide controls.
  - `npx nx run-many -t lint build -p frontend-pages-tournament --output-style=static`:
    all 12 tasks pass, ten cache replays; tournament lint/build execute after the final date-template change.
  - `git diff --check` passes, with existing configured future-CRLF warnings.
  - After approval, `npx nx run-many --target=lint --output-style=static` passes all 34 projects
    with existing warnings and zero errors; 29 cache replays and five executions, not a fully fresh run.
  - Focused Node handoff assertions pass: all eight changed files use LF, 309 local document links resolve,
    and the authoritative DR-024b3 registry row is Review before approval; approval later changes it to Done.
- Initial failures and recovery:
  - Formatter catches a misplaced closing Toolbar tag; it is corrected before tests/build.
  - First locale tests assume the Select trigger is a native button. Select uses an accessible trigger element;
    selectors now address only the five native action buttons.
  - Native clear is SVG, not HTMLElement; dispatch its real click event. Requery after refresh because
    the existing loader unmounts/remounts the success branch. Final tests pass, not detached-element proxies.
  - A formatted-date assertion first uses UTC midnight, unlike the service's local-midnight options.
    Use a real local-midnight fixture date; the final assertion passes without changing date semantics.
  - Translation changes cause temporary 502 reads and stale Vite/prebundle errors. Wait for port 5000
    `DesignRefreshReadiness { __typename }` HTTP 200, then reload; the authorized consumer recovers.
- Browser evidence:
  - Four genuine-empty Dutch cases: light/dark at 390x1000 and 1440x1000. All six controls fit within
    the Toolbar; neither Toolbar nor document has horizontal overflow.
    Before/dark, after/light-narrow and after/dark-wide screenshots are captured without committing personal data.
  - Native Toolbar is named `Planning Beheren`; label and combobox are `Filter op datum`.
    Publish has visible localized text; refresh/toggle have localized accessible names, and toggle exposes expansion.
  - Tab visits Select, Generate, Refresh, Toggle, skipping disabled Auto/Publish.
    Shift+Tab reaches the actual focus-visible Select; the screenshot shows its native focus border.
    Enter toggles the games panel twice, with expansion/name changes and no extra reads.
  - Measured enabled label/text/icon contrast passes: minimum 4.87:1 light and 5.47:1 dark.
    Convert actual OKLCH colors to canvas sRGB before WCAG luminance calculation.
    Early measurements during CSS transitions are discarded; a canceled animation rejects one probe,
    and the successful probe waits for finished/canceled transitions with `Promise.allSettled`.
  - Client-only read fixture supplies two safe slots on different local days, without server writes.
    After the named-template correction, options display `Mon, Nov 9` and `Tue, Nov 10`,
    and selected display is `Mon, Nov 9`, not raw Date strings.
    Pointer selection yields one slot; Refresh retains the same date; native keyboard Delete clears it
    and restores both slots. Request dates are null, local midnight serialized as
    `2026-11-08T23:00:00.000Z`, that same date again, then null. Service/date semantics are unchanged.
  - An earlier ArrowDown/Enter-only fixture attempt times out waiting for selection.
    Pointer selection/Delete succeeds afterward, but complete keyboard-only selection remains unverified.
    Another focus probe uses an exact name without PrimeNG's icon glyph and times out;
    the corrected native-button locator confirms actual keyboard focus.
  - Early incomplete fixture payloads produce Apollo missing-field/cache warnings; the final successful fixture
    includes the queried slot/court fields. All routes are removed in `finally` and genuine reads are restored.
  - Final original state: Dutch/dark/1355x1249/Scheduling, All Dates, six zero counts, games panel open,
    no dialog or document overflow; Planning tab focused. No assistant operational mutation or phase change.
- Not run: full tournament suite, app/backend builds, three-locale browser matrix, exhaustive accessibility,
  live operational/permission workflows, complete browser pending/error matrix and SSR/hydration.
  Existing Auth0 timeout/hot-reload hydration diagnostics are not claimed fixed by this slice.
- Discoveries: [DR-054](../backlog.md) records inherited date-option narrowing and read-remount focus loss.
  Native default Select feedback localization remains DR-037; grid/dialog blank copy stays with those children.
- Exceptions: none. Keep the existing smart tab/service boundary; no genuine shared consumer warrants extraction.
- The user selects "Approve completion and commit with disclosed limits" and "Nothing else" on 2026-11-10.
  Approval covers only this controls implementation/tests and repository handoff.
  Complete keyboard-only date selection, full workflows/accessibility, locale browser matrix, full-suite/app/backend
  builds and SSR/hydration remain unverified, not retrospectively passed. DR-054 and DR-037 remain open.
- Remaining action in a fresh invocation: scope DR-024b4 grid/game panel on its real mounted consumer.
  Keep DR-024b/DR-024 open; do not begin another implementation slice here.
- Commit only this approved slice/handoff without pushing.

[template]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/schedule/schedule-tab.component.html
[component]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/schedule/schedule-tab.component.ts
[service]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/schedule/schedule-tab.service.ts
[tests]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/schedule/schedule-tab.component.spec.ts
