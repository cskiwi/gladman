---
title: 'Design refresh backlog'
description: 'Persistent status registry and frontend area inventory for the incremental redesign.'
---

## Current focus

DR-017i is Done with explicit user approval on 2026-10-30: the mounted desktop partner-combinations disclosure
now has responsive named controls,
native icon-only `button[pButton]` refresh with busy/disabled feedback, native Table size/striping and statistic Tags.
The existing Fieldset, data visibility, range/weeks, forced refresh, filtering, sorting and pagination remain.
All 215 competition tests in 13 suites, focused lint (41 existing warnings, no errors), library build and
10 prerequisites pass. Isolated Chrome verifies six desktop theme/width cases and two unchanged mobile cases,
synthetic long names, filtering/empty/clear, paging, initial keyboard sorting/Select, refresh/busy and zero stats.
Tag contrast passes; Dutch SSR and mounted hydration have no page errors or GraphQL mutations.
Native Fieldset expansion removes Select/header tab stops: new DR-035 records this dependency-level issue.
Actual screen-reader output, exhaustive focus/contrast/hydration, mounted English/French and authenticated/save
workflows remain unchecked. Static utility tokens increase 10 to 12 for flexible control widths/wrapping;
two palette bindings and legacy Table classes are removed. No styling exceptions or dependencies.
Completed DR-017a-h, mobile selectors, services, translations, shared components and theme remain unchanged.
User review requested restoring the baseline toolbar: icon-only refresh, one search placeholder and full-width
controls rather than visible labels and a four-column grid. That correction is implemented and reverified:
12 desktop theme/width/range cases, two unchanged mobile cases, focus Tooltip/Escape, refresh/filter/busy,
accessible names and all 215 tests/lint/build pass again.
See the [DR-017i brief](work-items/DR-017i-assembly-partner-combinations.md).
The user selected "Approve completion and commit with the disclosed verification limits".
Approval accepts those limits; it is not evidence that failed or unperformed checks passed.
Only this slice, its tests and repository handoff are approved for commit; no push.
Post-approval repository-wide lint passes across all 34 projects with existing warnings, no errors.
Exact next action in a fresh invocation: confirm/scope a remaining mounted DR-017 assembly surface, with
captain/add-player controls as the next candidate, excluding completed DR-017a-i. Do not start it here.
DR-017 remains open.

### Previous completed focus: validation overview

DR-017h is Done with explicit user approval on 2026-10-30: the mounted validation overview uses a named native Card
and error/warn/success Messages.
The existing template is reused in the confirmation dialog, without a new wrapper or duplicate heading IDs.
Repeated validation codes and refreshed parameters render correctly; rules and error-before-warning order remain.
Scoped authored class tokens drop from 14 to 9, removing three palette colors and an unnecessary wrapper.
All 197 competition tests in 12 suites, focused lint (41 existing warnings, no errors), library build and its
10 prerequisites pass. Isolated Chrome verifies 24 cases at 390/820/1280/1440px in both themes, success/mixed/warning
states, long content wrapping, diagnostic updates, dialog reuse/focus/Escape cancellation, unchanged mobile
selectors and Dutch SSR. No browser page errors or GraphQL mutations.
Native Message text fails AA: light success 3.16:1, error 4.44:1, warn 2.85:1; dark error 4.40:1.
Dark success/warn pass at 6.48:1/7.49:1. DR-034 records the separate native Message contrast audit.
Actual screen-reader output, exhaustive hydration, mounted English/French and authenticated/save workflows remain
unchecked. No styling exceptions, overrides, dependencies, backend or translation asset changes.
Completed DR-017a-g and other assembly surfaces remain unchanged.
See the [DR-017h brief](work-items/DR-017h-assembly-validation-overview.md).
The user selected "Approve completion and commit with the disclosed verification limits".
Approval accepts those limits; it is not evidence that failed or unperformed checks passed.
Only this slice, its tests and repository handoff are approved for commit; no push.
Post-approval repository-wide lint passes across all 34 projects with existing warnings, no errors.
Exact next action in a fresh invocation: confirm/scope one remaining mounted assembly surface (for example
partner combinations), excluding completed DR-017a-h. DR-017 remains open; do not start another child here.
The unrelated generated translation change is preserved.

### Previous completed focus: generation controls

DR-017g is Done with explicit user approval on 2026-10-30 after the requested native `button[pButton]` correction.
The mounted desktop assembly generation controls use a native named Card, fluid controls
and hover/focus strategy Tooltips. Strategies, time-range values, conditional weeks, loading/disabled and local
clear/form contracts are preserved; scoped static authored class tokens drop from 26 to 12.
Ten remaining tokens cover layout/typography; native icon/spinner classes replace deprecated inputs.
All 186 competition tests in 11 suites, focused lint (41 existing warnings, no errors), library build and its
10 prerequisites pass again after correction. Isolated Chrome reverifies all six 820/1280/1440px theme cases,
native Button names, busy/spinner/disabled states, keyboard Select opening,
Tooltips/Escape/Tab, local random generation/clearing, no-player disabling and Dutch SSR without mutations/errors.
Unchanged 390px mobile retains 13 Selects and no generation controls in both themes.
Preserved native light-mode Button text fails 4.5:1 at 2.28-3.76:1; focused FloatLabel fails at 2.66:1.
DR-031 retains the label audit; new DR-033 records native Button text/focus contrast and Tooltip association.
Actual screen-reader output, exhaustive hydration, mounted English/French, authenticated/save and quantitative
focus-ring painted-area checks remain unchecked. No styling exceptions, overrides or dependencies.
Completed children, mobile selectors, validation, partner combinations, services and theme remain unchanged.
The unrelated generated translation change is preserved.
See the [DR-017g brief](work-items/DR-017g-assembly-generation-controls.md).
The user selected "Approve completion and commit with the disclosed verification limits".
Approval accepts those limits; it is not evidence that failed or unperformed checks passed.
Only this slice, its tests and repository handoff are approved for commit; no push.
Post-approval repository-wide lint passes across all 34 projects with existing warnings, no errors.
Exact next action in a fresh invocation: confirm/scope one mounted validation-presentation child, excluding all
completed DR-017a-g surfaces. Do not start it here. DR-017 remains open.

### Previous completed focus: substitutes

DR-017f is Done with explicit user approval on 2026-10-30: the mounted desktop substitutes container uses a native Card,
localized named heading and explicit empty state. Completed chrome/rows/pool/doubles/singles, CDK sorting/drop
contracts, lineup restrictions and local forms are preserved. Scoped authored class tokens drop from 18 to 12.
All 175 competition tests in 10 suites, focused lint (41 existing warnings, no errors), library build and its
10 prerequisites pass. Isolated Chrome verifies empty/multiple synthetic substitutes and long names at
820/1280/1440px in both themes, warning hover/focus Tooltips, Escape, Tab, visible native focus, real pointer
pool copy/return and local form synchronization. Unchanged 390px retains 13 Selects and no desktop rows in both themes.
Minimum scoped text contrast is 19.87:1 light / 16.00:1 dark; warning icon contrast against its composited Tag
fill is 4.52:1 / 9.36:1. Dutch SSR returns the named Card; no browser page errors or GraphQL mutations.
Screen-reader output, exhaustive hydration, mounted English/French, authenticated/save workflows and quantitative
native focus-ring painted-area/contrast remain unchecked. No styling exceptions, overrides or dependencies.
The user selected "Approve completion and commit with the disclosed verification limits".
Approval is not evidence that unchecked checks passed. Only this slice, its tests and handoff are approved
for commit; no push. Post-approval repository-wide lint passes across all 34 projects with existing warnings,
no errors. See the [DR-017f brief](work-items/DR-017f-assembly-substitutes.md).
Exact next action in a fresh invocation: confirm/scope one mounted generation-controls child, excluding completed
chrome/rows/pool/doubles/singles/substitutes. Do not start it here. DR-017 remains open.

### Previous completed focus: singles

DR-017e is Done with explicit user approval on 2026-10-30: the four mounted desktop singles-slot containers now use
native Cards, localized named headings/empty states, and accessible success/danger statistic Tags.
Completed player rows, CDK contracts, singles rules, pool copy/return, scalar local forms and mobile selectors
are preserved. Only the singles loop changes; authored class tokens drop from 29 to 21 and two palette bindings
are removed. No token/PassThrough overrides, host classes, styles, dependencies or operational mutations.
All 165 competition tests in nine suites, focused lint (41 existing warnings, no errors), and library build
with 10 prerequisites pass. Isolated Chrome verifies 820/1280/1440px in both themes, synthetic empty/occupied
slots, long names, missing/present statistics, native focus, hover/focus Tooltips, Escape, Tab, real pointer
copy/return and scalar form synchronization. Unchanged 390px retains 13 Selects and no desktop rows/Cards.
Minimum scoped text contrast is 19.87:1 light / 16.00:1 dark; Tag text 4.57:1 / 10.07:1 and Tooltip text
13.61:1 / 9.95:1. Dutch SSR returns all four named Cards; browser reports no page errors or GraphQL mutations.
Screen-reader output, exhaustive hydration, mounted English/French, authenticated/save workflows and quantitative
native focus-ring painted-area/contrast verification remain unchecked. Approval is not evidence that they passed.
The user selected "Approve completion and commit with the disclosed verification limits".
Only this slice, its tests and repository handoff are approved for commit; no push.
Post-approval repository-wide lint passes across all 34 projects with existing warnings and no errors.
Exact next action in a fresh invocation: confirm/scope one mounted desktop substitute-container child,
without reopening completed rows/pool/doubles/singles. DR-017 remains open; no second slice is started here.
See the [DR-017e brief](work-items/DR-017e-assembly-singles-slots.md).

### Previous completed singles prerequisite

DR-017d is Done with explicit user approval on 2026-10-30, after the requested correction restoring native
success/danger statistic Tags (success at >=50%, danger below).
The four confirmed mounted desktop doubles-slot containers use native Cards,
localized named headings/empty states, and semantic keyboard-accessible statistics.
CDK contracts, completed player rows, pool copying/return, lineup rules, and local forms are preserved.
Authored doubles-loop class tokens drop from 43 to 33; four dynamic palette bindings are removed.
All 153 competition tests, focused lint (41 existing warnings, no errors), and library build with 10 prerequisites pass.
Isolated Chrome verifies actual 820/1280/1440px in both themes, empty/one/full synthetic slots, long names,
accessible regions, hover/focus Tooltips, Escape dismissal, Tab movement, real pointer drag/return and form sync.
Final scoped plain-text contrast is 4.87:1 light / 6.65:1 dark.
Native Tag text contrast is 4.57:1 success / 5.30:1 danger light, 10.57:1 success / 8.77:1 danger dark.
Native focus contrast is 19.03:1 / 16.47:1 against the Card and at least 15.58:1 / 12.78:1 against Tag fills.
The final Tag matrix reverifies widths, themes, keyboard Tooltips, wrapping and SSR; initial neutral captures
are superseded. No styling overrides are introduced.
The unchanged 390px branch retains 13 Selects and no player rows/Cards in both themes.
Dutch SSR returns all four named Cards; browser checks have no page errors or GraphQL mutations.
Actual screen-reader output, exhaustive hydration, mounted English/French, authenticated/save workflows and
operational populated lineup records remain unchecked; approval is not evidence that they passed.
The user selected "Approve completion and commit with the disclosed verification limits".
Only DR-017d implementation, tests and repository handoff are approved for commit; no push.
Post-approval repository-wide lint passes across all 34 projects with existing warnings and no errors.
Singles/substitutes, mobile selectors, generator, validation, shared/theme/backend/assets remain unchanged.
No token/PassThrough overrides, new host classes, SCSS, styling substitutes, dependencies, or mutations are introduced.
Exact next action in a fresh invocation: confirm and scope one mounted desktop singles-slot child,
excluding completed rows, pool and doubles. DR-017 remains open.
The [DR-017d brief](work-items/DR-017d-assembly-doubles-slots.md) preserves final Tag evidence and unchecked limits.
Do not reopen DR-017a/b/c/d or begin another implementation child here.

### Previous completed focus

DR-017c is Done with explicit user approval on 2026-10-30: the mounted desktop assembly player pool uses a native Card,
named availability Checkboxes, a keyboard-operable backup Button, and an explicit localized empty state.
The eight live names/ranks match baseline; synthetic backups verify the conditional branch without mutations.
CDK IDs/data/connections, selection behavior, pool copy/return, and local form synchronization pass.
The user requested no `[dt]`, `[pt]`, or host classes; all scoped token overrides are removed.
No styling substitute or shared/theme change is introduced. Pool template class tokens drop from 40 to 23.
All 141 competition tests, focused lint (41 existing warnings), and library build with 10 prerequisites pass.
Installed Chrome verifies actual 820/1280/1440px in both themes, keyboard selection/disclosure, full names,
accessible names, native keyboard focus, pointer drag/return, explicit empty state, and Dutch SSR again after correction.
Minimum text contrast is 4.87:1 light / 6.65:1 dark; checked Checkbox border/focus is 3.65:1 / 10.22:1;
native unchecked border fails at 1.48:1 / 1.40:1. Disclosure focus is 8.46:1 light (pass), 1.40:1 dark (fail).
Those native contrast failures remain unchecked; the user accepted them as completion limits, not passing checks.
Separately scoped DR-032 work remains open.
The unchanged 390px branch retains 13 Selects and no player rows in both themes.
Actual screen-reader output, exhaustive hydration, mounted English/French, authenticated/save workflows,
and operational backup/empty records remain unchecked. Approval is not evidence that they passed.
The user selected "Approve completion and commit with the disclosed native contrast and verification limits".
Only DR-017c implementation, tests, and repository handoff are authorized for commit; no push.
Post-approval repository-wide lint passes across all 34 projects with existing warnings and no errors.
The completed player row is reused unchanged.
Slots, mobile selectors, captain/add-player controls, summaries, generator, validation, partner statistics,
theme, backend, and translation assets are excluded.
Exact next action: confirm and scope one mounted desktop game-slot container child in a fresh invocation,
excluding the completed rows and pool. DR-017 remains open.
Native Checkbox/secondary Button contrast, including the disclosed remaining pool failures, is tracked as DR-032,
not a hidden shared/theme change. The no-override correction and subsequent explicit approval are recorded separately
in the [brief](work-items/DR-017c-assembly-player-pool.md). Do not reopen DR-017c or start another child here.

### Earlier completed focus

DR-017b is Done with explicit user approval on 2026-10-30, after removing host styling and reverifying the correction.
The existing input-only assembly player row is refreshed once for its five pool/slot call sites.
Native warning Tags replace palette-colored icons, with localized names and hover/focus Tooltips.
Names wrap without truncation; ranking rules and parent CDK bindings are preserved.
Template class tokens drop from 22 to 11; the row-only SCSS rule/file is removed without host styling.
All 130 competition tests, focused lint (41 existing warnings), and library build with 10 prerequisites pass.
Headless Chrome verifies actual 820/1280/1440px in both themes, all five synthetic row consumers,
accessible names, native focus, hover/focus Tooltips, Escape dismissal, and a real CDK pool-to-double drag/form sync.
The eight live pool names/rankings match baseline; 390px retains the unchanged mobile branch with no player rows.
Final minimum ranking/name contrast exceeds 18:1 light and 15:1 dark; warning icon contrast exceeds 4.5:1/8.6:1.
Initial muted ranking contrast was 4.46:1 on the pool, fixed locally with semantic normal text color.
Populated Dutch SSR returns eight rows; the browser matrix has no page errors.
The user selected "Approve completion and commit with the recorded verification limits".
Actual screen-reader output, mounted English/French switching, exhaustive hydration, and full lineup/save workflows
remain unchecked; approval is not evidence that they passed.
Post-approval repository-wide lint passes across all 34 projects with existing warnings, no errors.
Pool/slot containers, mobile selectors, generator, validation, partner statistics, theme, backend, and translation
assets are unchanged. DR-017a remains Done.
Only [DR-017b](work-items/DR-017b-assembly-player-row.md) and its handoff are approved for commit; no push is authorized.
Exact next action in a fresh invocation: confirm and scope one mounted DR-017 player-pool/slot container child,
excluding the completed row component. Do not reopen DR-017b or begin another implementation slice here.
DR-017 remains open.

DR-017a is Done with explicit user approval on 2026-10-30: the mounted `/competition/assembly` heading/filter chrome
and the user's requested desktop time-range translation correction.
The decorative English eyebrow and hand-built filter surface are replaced by a localized heading, native Card,
responsive fluid controls, persistent semantic labels, and explicit accessible Select names.
The authenticated save-menu trigger uses the existing localized Save name.
Authored chrome class tokens drop from 41 to 33; two local SCSS rules are retired without new styles.
All 112 competition tests, focused lint (41 existing warnings), repository-wide lint across 34 projects,
and app build with 29 prerequisites pass.
Headless Chrome verifies actual 390/1280/1440px, both themes, and unselected/populated query-restored filter Cards.
Minimum measured text contrast is 4.87:1 light and at least 5.69:1 dark; club focus border is 3.65:1/10.22:1.
Native season keyboard selection, live club/team/encounter reads, three component-tested locales, and Dutch SSR pass.
Actual authenticated workflows, operational download/save, screen-reader output, mounted English/French switching,
and exhaustive hydration remain unchecked; approval is not evidence that they passed.
The user approved commit after fixing the desktop translations.
Both mounted time-range Selects now use native named templates and localized accessible names;
three real-locale component tests and mounted Dutch 1440px light/dark option-selection checks pass.
Generation heading/buttons already use the correct translations. Translation assets and backend remain unchanged.
Only DR-017a, the requested template correction, tests and handoff are authorized for commit; no push.
The native FloatLabel focused label failed light contrast at 2.66:1 before persistent labels replaced it here;
shared consumer auditing is deferred as DR-031.
Except for that named-template correction, player pools/slots, generator and partner statistics, service logic,
validation dialog, shared components,
theme, backend, and translations are excluded.
The historical next action to scope one mounted player-pool/slot child is fulfilled by DR-017b above.
Do not reopen DR-017a.
DR-017 remains open until its required children are scoped and complete.
See the [parent](work-items/DR-017-competition-assembly.md) and [child brief](work-items/DR-017a-assembly-page-chrome.md).

DR-016 is Done with explicit user approval on 2026-10-30 after a documentation-only consumer audit.
DR-016a through DR-016g remain Done and are not reopened.
The supplied competition mounts 12 sub-events and 26 draw links, all POULE; qualification has conditional route wiring
but no confirmed live instance in that competition. Defer qualification styling without adding a consumer or fixture.
This does not establish that qualification is globally unused.
Parent reconciliation, formatting, whitespace, and 76 inline local-link checks pass.
The user selected "Approve parent completion and commit with the recorded verification limits".
Qualification deferral and all unchecked parent criteria remain unverified; approval is not evidence that they passed.
Only the parent brief and backlog are authorized for this commit; no push is authorized.
Exact next action: confirm and scope one mounted DR-017 assembly child in a fresh invocation, not here.
If a real qualification URL is later supplied, inspect it before scoping a separate child; do not restart completed work.
See the [parent brief](work-items/DR-016-competition-draws.md).

DR-016g is Done with explicit user approval on 2026-10-30: the table uses league standings terminology,
not a generic classification.
Dutch uses Stand/Plaats; French uses Classement/Rang; aligned empty copy names the teams and series.
English Standings/Position and numeric ordering remain unchanged.
All 101 competition tests and focused lint pass (41 existing warnings).
The correct API endpoint `/api/v1/translate/i18n/:locale` returns updated Dutch/French copy and unchanged English.
The mounted Dutch page exposes Stand as heading/region, Plaats as first column, and positions 1 through 9.
Mounted French/English switching via browser cookie assignment did not change the Dutch page; do not claim it passed.
The user selected "Approve and commit with the recorded verification limits".
Unchecked criteria remain unverified; approval is not evidence that they passed.
Only DR-016g and its handoff are authorized for commit; no push is authorized.
Post-approval repository-wide lint passes across all 34 projects (29 cached results, existing warnings).
DR-016f remains Done at its approved commit.
Exact next action for a fresh invocation: confirm a mounted qualification consumer before scoping another DR-016
child; otherwise record its deferral and reconcile remaining parent acceptance.
See the [brief](work-items/DR-016g-standings-terminology.md).

DR-016f is Done with explicit user approval on 2026-10-30: the mounted poule standings section has one localized h2,
without the duplicate English eyebrow or decorative rule. Outer utility tokens drop from nine to one.
All 101 competition tests, focused lint (41 existing warnings), and app build with 29 prerequisites pass.
All nine ordered rows, 158 ordered links, 72 encounter cards, and 72/20/52/9 totals match baseline.
Populated and synthetic-empty light/dark checks fit at narrow/wide widths; heading contrast, accessible names,
keyboard scrolling, three component-tested locales, and populated Dutch SSR pass.
The integrated browser's requested 1280px width sometimes resets to 1180px; actual widths are disclosed in the brief.
Actual screen-reader output, operational empty records, exhaustive hydration, and role/sync workflows remain unchecked.
The existing input-only PouleDrawComponent has one application consumer; no abstraction was added.
Qualification, shared components, theme, translations, and backend are unchanged.
The user selected "Approve completion and commit with the recorded verification limits".
Unchecked criteria remain unverified; approval is not evidence that they passed.
Post-approval repository-wide lint passes across all 34 projects (34 cached results, existing warnings).
Only DR-016f and its handoff are authorized for commit; no push is authorized.
The next invocation should confirm a mounted qualification consumer before scoping another DR-016
child; if none exists, record its deferral and reconcile remaining parent acceptance rather than adding a consumer.
See the [brief](work-items/DR-016f-standings-section-chrome.md).

DR-016e is Done with explicit user approval on 2026-10-30: the mounted competition draw loading, error,
and overall-empty states use native PrimeNG.
Guarded resource reads allow the existing load error to render; a browser-intercepted failure and recovery pass.
All 95 competition tests, focused lint (41 existing warnings), and app build with 29 prerequisites pass.
After approval, repository-wide lint passes across all 34 projects (34 cached results, existing warnings).
Synthetic states fit at 390px/1280px in both themes; error and empty text contrast, accessible names,
and populated SSR checks pass. At 320px the unchanged shared header overflows; follow-up DR-030 is in Backlog.
Actual screen-reader output, operational empty records, exhaustive hydration, and role/sync workflows remain unchecked.
The user selected "Approve completion and commit with the recorded verification limits"; unchecked criteria remain
unverified. Only this slice and its handoff are authorized for commit; no push is authorized.
The historical next action to scope standings outer-section chrome is fulfilled by DR-016f above.
Do not restart DR-016e.
See the [brief](work-items/DR-016e-draw-states.md) for precise evidence and remaining checks.

DR-016d is Done with explicit user approval on 2026-10-28: the mounted competition draw's played/upcoming chrome
uses native Cards
and single localized semantic headings/counts. Authored shell/header utilities drop from 44 to 24.
All 88 competition tests, focused lint (41 existing warnings), and app build with 29 prerequisites pass.
All 158 ordered links, nine standings, 20/52 encounter cards, and 72/20/52/9 statistics match baseline.
Light/dark at 390px/1280px, six inspected header screenshots, header/count contrast, accessible headings,
three mounted locales, and localized populated SSR pass on the isolated port-3001 app preview.
The original port-3000 watcher retained an earlier corrected template error; it was preserved, not restarted.
The validation helper is stopped after checks. No shared source, translation asset, backend, or theme changed.
Adjacent shared expansion Button keyboard reachability passes, but its unchanged dark focus outline is only 1.40:1.
Actual screen-reader output, operational empty records, role/sync workflows, and exhaustive hydration remain unverified.
The user selected "Approve completion and commit with the recorded verification limits".
Unchecked criteria remain unverified; approval is not evidence that they passed.
Repository-required lint passes across all 34 projects (34 cached results, existing warnings, no errors).
Only the scoped implementation/tests/handoff commit is authorized; no push is authorized.
The stale port-3000 watcher may still need restarting under user control for local inspection.
The historical next action to scope a mounted loading/error/overall-empty child is fulfilled by DR-016e above.
Do not restart DR-016d.
DR-016a/b/c remain Done; DR-016 remains open.
See the [brief](work-items/DR-016d-encounter-section-chrome.md) for exact evidence and remaining checks.

DR-016c is Done with explicit user approval on 2026-10-28: the four mounted competition draw hero statistics
use restrained div/span totals
and existing translations, preserving counts/order/team fallback.
All 80 competition tests, focused lint (41 existing warnings), and app build with 29 prerequisites pass.
Rendered utility tokens drop from 66 to 44. All 157 current ordered links, nine standings,
and 72/20/52/9 totals match the invocation's baseline.
Light/dark at 390px/1280px fit; all four hero screenshots were inspected.
Contrast, accessible text, adjacent keyboard focus, three mounted locales, and localized populated SSR pass.
Actual screen-reader output, operational empty records, role/sync workflows, and exhaustive hydration remain unverified.
No shared components, translation assets, backend, or theme changed.
The user selected "Approve completion and commit with the recorded verification limits".
Unchecked criteria remain unverified; approval is not evidence that they passed.
After approval, repository-required lint passes across all 34 projects with existing warnings and no errors.
Only the scoped implementation/tests/handoff commit is authorized; no push is authorized.
The historical next action to scope one mounted section-chrome child is fulfilled by DR-016d above.
Do not restart DR-016c.
See the [brief](work-items/DR-016c-draw-statistics.md) for precise commands and evidence.
Do not begin another implementation slice in this invocation; DR-016 remains open.

DR-016b is Done with explicit user approval on 2026-10-28: the mounted competition draw hero identity/actions use
native secondary Tags and an
external-link Button, preserving the title/fallback, optional metadata, destination, and sync configuration.
All 74 competition tests, focused lint (41 existing warnings), and app build with 29 prerequisites pass.
Identity/action utility tokens drop from 57 to 17. All 158 ordered page links, nine standings, and statistics
match baseline. Light/dark 390px/1280px fit, keyboard focus/intercepted Enter, accessible naming, contrast,
three localized mounted reloads, and populated SSR pass. Four screenshots were inspected.
Actual screen-reader output, operational missing metadata, sync/role workflows, exhaustive hydration, and
every hover/active state remain unverified. No backend, translation assets, shared components, or theme changed.
The user selected "Approve completion and commit with the recorded verification limits".
Unchecked criteria remain unverified; approval is not evidence that they passed.
Repository-required lint passes across all 34 projects with existing warnings and no errors.
Only the scoped implementation/tests/handoff commit is authorized; no push is authorized.
The historical next action to scope a separate draw-statistics child is fulfilled by DR-016c above.
Do not restart DR-016b.
See the [brief](work-items/DR-016b-draw-hero.md) for precise commands and evidence.
Do not restart DR-016a or begin a second implementation slice. DR-016 remains open.

DR-016a is Done with explicit user approval on 2026-10-28: the mounted competition poule standings use native Table/Card,
named success/danger direction Tags, and a neutral secondary empty Message.
All nine rows and club links match baseline. All 63 competition tests, focused lint (41 existing warnings),
and app build with 29 prerequisites pass. Utility tokens drop from 96 to 16.
The user's "don't use [pt]" correction is applied: accessible naming and keyboard scrolling live on a semantic
outer region; the native Table has no pass-through options. Corrected four-case geometry/focus, row/link equality,
screenshots, and SSR pass. Native table semantics and column headers remain inside the named region.
Light/dark at 390px/1280px fit with keyboard-scrollable local overflow; populated and French empty screenshots
were inspected. Three mounted locales and twelve synthetic empty theme/width/locale combinations pass.
The native info Message failed dark contrast (4.32:1); secondary now passes at 7.74:1 light / 9.51:1 dark.
Populated text/status contrast, named accessibility-tree content, keyboard focus, and populated SSR pass.
Actual screen-reader output, operational missing/empty records, exhaustive hydration, and every hover/active state
remain unverified. No backend records, translations, shared components, or theme were changed.
The user selected "Approve completion and commit with the recorded verification limits" after the no-[pt] correction.
Unchecked criteria remain unverified; approval is not evidence that they passed.
Repository-required lint passes across all 34 projects (34 cached results, existing warnings).
The scoped implementation/tests/handoff commit is authorized; no push is authorized.
The historical next action to scope a separate mounted draw-chrome child is fulfilled by DR-016b above.
Do not restart DR-016a.
Qualification still requires confirming a mounted live consumer.
DR-016 remains open pending remaining children and parent acceptance. No second implementation slice was started.
See the [brief](work-items/DR-016a-poule-standings.md) for precise evidence and limits.

DR-015g is Done with explicit approval of the numbered-label correction on 2026-10-28.
The originally approved localization was committed as `7382cbb8`. The user then rejected GUID fragments
and selected "Localized numbered label, such as Poule 1". Use each draw's one-based displayed position
within its sub-event for unnamed labels and matching accessible names; preserve real names and URLs.
The corrected version passes 49/49 component tests, focused competition/translation lint, and app build.
Repository-required lint after correction approval passes across all 34 projects with existing warnings.
Mounted synthetic fixtures confirm localized numbering/reset in all three locales, light/dark 390px/1280px
fit, keyboard focus, and inspected narrow screenshots. All 52 populated link records retain their fingerprint;
restored populated SSR responds HTTP 200. No backend records were changed.
The user selected "Approve correction and commit with the recorded verification limits".
Operational unnamed records, screen-reader output, exhaustive hydration, and screenshot-size limits remain
unverified/disclosed; approval is not evidence that these passed. A separate follow-up commit is authorized.
The historical next action to scope one mounted DR-016 child is now fulfilled by DR-016a above.
Do not restart DR-015g.
Parent DR-015 remains open pending parent-level acceptance. No second implementation slice was started.
See the [brief](work-items/DR-015g-competition-draw-copy.md). No push is authorized.

Historical initial-version completion: DR-015g was approved on 2026-10-28; competition detail's unnamed-draw labels,
matching external-link accessible names,
and empty Card copy now use two real competition keys in all three locales.
The supplied route retains 12 Cards, 26 internal/external pairs, and the exact ordered link/name fingerprint.
All 46 component tests, focused competition/translation lint, and app build with 29 prerequisites pass.
After approval, repository-required lint across all 34 projects passes with existing warnings.
Synthetic Angular-resource edge fixtures render the real localized fallback and Message without backend writes.
Measured light/dark 390px/1280px geometry, keyboard focus, contrast, mounted locale reloads, and populated SSR pass.
French synthetic narrow screenshots were inspected; full-page screenshot sizing limits are recorded in the brief.
Operational unnamed/empty records, screen-reader output, and exhaustive hydration remain unverified.
The user selected "Approve completion and commit with the disclosed verification limits";
unchecked criteria remain unchecked. This authorizes only the scoped implementation/tests/handoff commit.
No class, shared terminology, tournament value, permission, global theme, or application TypeScript changed.
See the [brief](work-items/DR-015g-competition-draw-copy.md).
The historical next candidate was one bounded mounted DR-016 child; DR-016a now records that scope and evidence.
Parent DR-015 remains open pending parent-level acceptance. No second implementation slice was started.
No push is authorized.

DR-015f is Done with explicit user approval on 2026-10-28: "mark as done and commit".
Statistics retain the existing div/span vocabulary, restrained totals, readable dates, and localized context.
The user confirmed keeping concurrent competition metadata edits and updating the affected tests.
Info Tags, removed redundant Card labels/`Idx`, ASCII separators/fallbacks, and competition terminology edits
are retained. The unrelated `gladman.babel` edit is excluded from the scoped commit.
Final 34/34 tests, focused competition/translation lint, app build with 29 prerequisites,
and repository-wide lint across all 34 projects pass (existing warnings remain).
Corrected light/dark at 390px/1280px fit; all four corrected screenshots were inspected.
Summary contrast remains at least 4.87:1 light / 6.65:1 dark; adjacent keyboard access and SSR markup pass.
No list markup was added to statistics. DatePipe's English month formatting remains unchanged.
Live absent-date/zero-count data, screen-reader output, exhaustive hydration, and cross-consumer visual checks
of retained shared terminology remain unverified; applicable component coverage and historical locale checks
are recorded in the brief. Unchecked criteria stay unchecked despite explicit completion approval.
See the [brief](work-items/DR-015f-competition-statistics.md) for exact evidence and limits.
Its competition draw fallback-name/empty-copy localization follow-up is now scoped as DR-015g above.
Do not restart DR-015f.
Parent DR-015 remains open. The scoped commit is approved; no push is authorized.

DR-015e is Done with explicit user approval on 2026-10-28: the mounted competition hero's toernooi.nl
anchor now uses a native PrimeNG
secondary text Button with a competition-specific accessible name. Visibility, destination, new-tab safety,
action order, and edit/sync behavior are preserved. All 55 ordered page links and hero text match the baseline.
Twenty-four component tests, library lint (41 existing warnings), and app build with 29 prerequisites pass.
Light/dark at 390px/1280px fit; keyboard access, safely intercepted Enter activation, and SSR markup pass.
The user approved completion/commit, then requested no `[dt]` on 2026-10-28 before any commit.
The local token override is removed and a regression assertion requires undefined `dt`.
The user then requested no button outline and no underlining on any toernooi.nl icons on the page.
All 27 external anchors use `no-underline`; the hero's native outline is replaced only for keyboard focus
by a semantic primary 2px ring (3.65:1 light / 10.22:1 dark). No resting border/ring is visible.
Two focused important utilities are documented in the brief because native unlayered rules otherwise win.
One native contrast limit remains: light active text 4.46:1 fails 4.5:1.
Normal/hover text passes (minimum 4.66:1 light / 6.28:1 dark); no replacement styling was introduced.
Final tests, lint, build, and four-case geometry/focus pass apart from the light active-text contrast failure.
Four final screenshots were inspected; earlier screenshots with the removed override remain historical.
Mounted alternate locale, authenticated edit interaction, live missing-code data, exhaustive hydration,
screen-reader output, and operational sync remain unverified; relevant presentation branches have component coverage.
See the [brief](work-items/DR-015e-competition-hero-link.md) for exact evidence and limits.
The user selected "Approve completion and commit" after reviewing the outline/underline corrections and
disclosed light active-text contrast failure and other verification limits. Unchecked criteria remain unverified
or failed; approval is not evidence that they passed. The scoped implementation/tests/handoff commit is authorized.
Its competition hero statistics follow-up is now scoped as DR-015f above.
Keep parent DR-015 open. No push is authorized.

DR-015d is Done with explicit user approval on 2026-10-23: the mounted competition sub-event metadata row
now uses native secondary PrimeNG Tags.
Maximum level, index bounds/separator, event type, truthy visibility conditions, translations,
ordering, and draw destinations are preserved; sync behavior is unchanged.
All 12 Cards retain identical normalized metadata and all 52 ordered draw destinations.
Nineteen component tests, library lint (41 existing warnings), and app build with 29 prerequisites pass.
Light/dark at 390px/1280px fit without overflow; all four final screenshots were inspected.
Minimum metadata contrast is 7.74:1 light / 9.50:1 dark. Static semantics, existing keyboard focus,
and SSR markup pass. Mounted alternate locale, live absent/zero metadata, exhaustive hydration,
screen-reader output, and operational sync actions remain unverified; edge cases/locale are component-tested.
See the [brief](work-items/DR-015d-competition-metadata.md).
The user selected "Approve completion and commit", accepting the disclosed verification limits;
unchecked checks remain unverified. Its scoped implementation/tests/handoff commit is authorized.
The competition hero external-link follow-up is now scoped as DR-015e above, preserving mounted behavior.
Keep parent DR-015 open. No push is authorized.

DR-015c is Done with explicit user approval on 2026-10-23: competition draw lists use native PrimeNG
anchor Buttons and a native empty Message. The user selected "Approve completion and commit",
accepting the disclosed verification limits; unchecked checks remain unverified.
Draw metadata remains visible, external links have draw-specific accessible names, and long names wrap.
One Card `min-w-0` utility prevents unbroken names from widening the mobile grid; no custom CSS was added.
All 26 internal and 26 external destinations retain the same ordered SHA-256 fingerprint.
Eleven component tests, library lint (41 existing warnings), and app build pass.
Light/dark at 390px/1280px, a browser-only 240-character name stress check, keyboard activation/focus,
SSR markup, and final screenshot inspection pass. Normal/hover text contrast is at least 4.66:1 light
and 6.28:1 dark. Mounted alternate locale, live empty data, exhaustive hydration, and screen-reader
output remain unverified; empty/fallback/locale behavior has component-test coverage.
See the [brief](work-items/DR-015c-competition-draw-links.md) for approval and verification details.
Its metadata-chip follow-up is now scoped as DR-015d above, preserving values and conditionals.
Keep parent DR-015 open. The scoped implementation/tests/handoff commit is approved; no push is authorized.

DR-015b is Done with explicit user approval on 2026-10-23 following the formatting/SCSS-removal request.
The user confirmed "we are done. mark it so and commit", accepting the disclosed verification limits.
The entire competition detail
template is formatted; its local SCSS and reference are deleted. The hero uses existing shared avatar/title
components, totals/headings use Tailwind and semantic classes, official/type statuses use native Tags,
and the existing error presentation uses a native Message. No custom CSS replacement was introduced.
The competition detail's group shortcuts use native PrimeNG buttons,
translated names/counts, associated targets, and semantic section/group/event headings.
Eight component tests, library lint (41 existing warnings), app build, and Prettier HTML check pass.
Light/dark 390px/1280px document/hero/Card/navigation geometry, keyboard activation, settled text contrast
(4.57:1 light / 6.65:1 dark minimum across the expanded styling scope), and SSR markup pass.
Final light-mobile hero/Card and dark-desktop hero screenshots were inspected.
Alternate-locale coverage is a component test, not a mounted locale pass;
exhaustive hydration and screen-reader output remain unverified. See the
[brief](work-items/DR-015b-competition-group-navigation.md).
Its draw-link follow-up is now scoped and implemented as DR-015c above.
Parent DR-015 remains open. No push is authorized.

DR-006j is Done with explicit user approval on 2026-10-23.
The routed host now shrinks to the content width while the existing bracket canvas remains horizontally scrollable.
Focused layout tests and relevant library/app lint/build checks pass. The full bracket-tree suite retains six
pre-existing failures unrelated to this change. Light/dark 390px/1280px geometry and keyboard link focus pass;
pixel contrast remains unverified. The user approved completion with this limit disclosed. See the
[brief](work-items/DR-006j-bracket-tree-responsive.md).
Parent DR-015 remains open for the remaining competition-detail presentation work.

DR-015a is Done with explicit user approval on 2026-10-23 after replacing the mounted competition detail's custom
sub-event article surface with native PrimeNG Cards. Existing grouping, draw links, metadata, sync controls, and
responsive grid behavior are preserved. The supplied competition route was inspected after the app rebuild;
narrow/light pixel review and keyboard, SSR, locale, and screen-reader checks remain pending and were accepted as
disclosed limits. See the [brief](work-items/DR-015a-competition-event-cards.md).

The mounted DR-006 consumer inventory found no production callers for the legacy `match-row` or `upcoming-match`
components. No redesign child was created for unused components; adding a consumer only for verification would
violate the consumer-first scope rule. The next mounted slice is [DR-008a](work-items/DR-008a-player-hero-actions.md),
which gives the player detail hero's icon-only actions a localized accessible name without changing its behavior.
DR-008a is Done with explicit user approval on 2026-10-23; mounted light/dark narrow/wide geometry and keyboard
menu activation pass. No pixel-contrast measurement or alternate-locale browser pass is claimed.

DR-006i is Done with explicit user approval on 2026-10-23 after the inline-style removal request.
Summaries and expanded games
use native Cards, Tailwind layout, and semantic text; all component CSS is removed, with no SCSS or inline-style
replacement. Plain encounter scores retain their large format and centered separator. Player groups, routes,
levels, game order/results, played-set pairs, loading, and expansion are preserved. Upcoming markup, services,
and global styling are unchanged. All 20 focused tests, component lint/build, and app build pass
(31 existing lint warnings). Final expanded eight-game lists fit at 390px/1280px in light/dark on team detail,
club schedule, and the user's current draw. Four expanded screenshots were inspected; final collapsed SSR passes.
Earlier keyboard checks passed; the named native button still intentionally replaces mouse-only whole-row activation.
Available live games lack player memberships/set scores: populated names, badges, result labels, and set pairs have
focused-test coverage, not mounted pixel verification. Alternate locales, exhaustive hydration, and screen-reader
output remain unverified.
The user requested "commit and push", accepting completion with the disclosed verification limits;
unchecked criteria remain unverified. The scoped commit and branch push are authorized.
Exact next action: inspect mounted shared match/bracket consumers and scope the next DR-006 child.
Do not start another implementation here. Parent DR-006 stays open.
See the [brief](work-items/DR-006i-played-encounter-cards.md).

DR-006h is Done with explicit user approval on 2026-10-21: shared upcoming encounter cards use native
PrimeNG Cards and the compact date-rail
direction from the user's `/players/axelle-de-prest` reference. Team links, home/away context, time, and
non-expandable behavior are preserved; dates include the month and an accessible full-date label. Played
cards, expanded games, services, and global styling are unchanged. Seven focused tests, component lint/build,
and app build pass (31 existing lint warnings). Team detail (11 cards), club schedule (37), and competition
draw (60) fit at 390px/1280px in light/dark without card overflow; all four team-card screenshots were inspected.
Muted-text contrast is 4.87:1 light / 6.65:1 dark. Keyboard team-link navigation and settled SSR pass.
Alternate locales, exhaustive hydration, and screen-reader output remain unverified.
The user approved completion and its scoped commit with these verification limits disclosed; unchecked
criteria are not claimed as passed. Next action: inspect and scope a separate mounted played-encounter-card
child under DR-006, preserving expansion and services. Do not start it in this invocation.
See the [brief](work-items/DR-006h-upcoming-encounter-cards.md). Parent DR-006 stays open. No push is authorized.

DR-006g is Done with explicit user approval on 2026-10-21: the mounted player upcoming heading is semantic, loading
placeholders use native Cards/Skeletons, the settled empty state uses a native Card, populated dates group
weekday/day/month separately from the hour, and the assembly action uses native `button pButton` with its translated
name and destinations preserved. Translations and service behavior remain unchanged. Three placeholder cards, 21
decorative skeletons, and no focus targets are covered by the focused spec. Seven tests, component lint/build, and app
build pass; 31 existing lint warnings remain. Earlier light/dark narrow/wide screenshots predate the final date/time
refinement; the user reviewed the latest version on their port-3000 instance and requested completion. SSR/hydration
and alternate locales remain unverified. Parent DR-006 remains open. Next action: inspect mounted consumers and scope
the next DR-006 child before implementation.
See the [brief](work-items/DR-006g-upcoming-game-states.md).

DR-006f is Done with explicit user approval on 2026-10-21: populated player upcoming-game cards use native
PrimeNG Cards and a wrapping layout. Three upcoming cards are shown initially; outlined View All/View Less
buttons expand and collapse the fetched encounters. Dates, draw/team destinations, home/away labels, and
assembly query parameters are preserved. Seven focused component tests and library lint/build pass (32 existing
lint warnings); the broader library test target still reports six unrelated bracket-tree failures. The earlier
layout check showed ten real encounters fitting at 390px/1280px in light/dark; ordinary card text contrast is at
least 4.87:1 and keyboard focus is visible. The earlier settled SSR check returned ten Cards before the
three-card initial display limit was added. Dark desktop and light mobile screenshots were inspected, and the
user reviewed the current player route and approved completion with the limits disclosed. Loading/empty markup,
header, services, and global styling are unchanged; real assembly navigation, alternate locales, exhaustive
hydration, and screen-reader output remain unverified. The six unrelated bracket-tree test failures also remain
an accepted limit, not a passing check. The original player route, dark class, and 1487x1252 viewport were restored;
no fixtures or backend mutations were needed. The next child is scoped as DR-006g; its implementation has not started.
Keep DR-006 open.
See the [brief](work-items/DR-006f-upcoming-game-cards.md).

DR-006e is Done with explicit user approval on 2026-10-17: mounted player recent-games initial/loading-more
placeholders now share a local native
PrimeNG Card/Skeleton template with a named busy section. Six initial/three appended placeholders and existing
services, filters, and pagination are preserved. All 26 focused tests and library lint/build pass (32 existing
lint warnings). Both states fit at 390px/1280px in light/dark, without overflow or focusable placeholders.
Dark desktop pixels were inspected; light/mobile capture returned the stale dark desktop frame, so that pixel
check remains unverified. Settled player SSR returns HTTP 200 with ten games; loading SSR and exhaustive hydration
were not verified. Browser fixtures are removed and the original player route, dark class, 1487x1252 viewport,
and ten games restored. The user requested "Approve and commit" with these limits disclosed; acceptance is not
a light/mobile pixel pass. The workflow now limits redesign to components with real application consumers and
treats DR approval as authorization for a scoped commit. Its proposed populated upcoming-game follow-up is now
DR-006f above; DR-006e remains complete and is not reopened. Keep DR-006 open.
See the [brief](work-items/DR-006e-recent-game-loading.md).

DR-006d is Done with explicit user approval on 2026-10-17: the mounted player recent-games header is a semantic
heading and labels its native compact,
wrapping SelectButton. Native item templating with semantic text fixes measured inactive light-label contrast
from 4.46:1 to 18.2:1, without global changes. All 24 focused tests, library lint (32 existing warnings), and
library build pass. Final 390px/1280px light/dark geometry and contrast pass; SSR returns 200 with all four named
options. Programmatic native clicks preserve filtering, but browser key attempts did not activate options, and
the screenshot showed unrelated chrome. No keyboard-selection or visual/pixel pass is claimed.
The user requested "Approved, commit" after these limits were disclosed; approval accepts completion with those
limits, not an unperformed keyboard or pixel pass. See the [brief](work-items/DR-006d-recent-game-filters.md).
Keep DR-006 open and prioritize used components. Its proposed mounted initial/loading-more skeleton follow-up
is now DR-006e above, preserving services and pagination; DR-006d's completed scope remains unchanged.

DR-006c is Done with explicit user approval on 2026-10-17 after revision: the user rejected won/lost Tags
widening the points column and requested
distinct light card surfaces. Results now use compact metadata icons with translated hidden text/title;
the points column contains only points again. Native PrimeNG Cards are white against the light canvas and
distinct from the dark canvas; no global theme changes. Fifteen focused tests, final library lint
(32 existing warnings), and build pass. Icons/scores fit at 390px/1280px in light/dark; result-icon contrast is
4.87:1 light / 6.65:1 dark. Keyboard focus and HTTP 200 SSR with ten Cards/result labels pass.
Dark desktop pixels show the compact `+452` column correctly. Light/mobile screenshot capture remains stale;
no light/mobile pixel pass or mounted unknown-state pass is claimed. The original player route, dark class,
1487x1252 viewport, and ten games are restored; no fixtures, persistence, or backend mutations.
The user explicitly requested "Approve & commit" with those verification limits disclosed; this is not a
light/mobile pixel pass. Next candidate: scope the mounted player recent-games header/filter presentation as
a separate DR-006 child, preserving filtering, services, and pagination. Do not start that next slice here.
See the [brief](work-items/DR-006c-recent-game-results.md); keep DR-006 open and prioritize used components.

DR-006b is Done with explicit user approval on 2026-10-17: mounted player recent-game set scores use success/secondary Tags,
with a check icon for winning scores. Nine focused tests, shared-library lint (32 existing warnings), and build pass.
All 50 score Tags fit at 390px/1280px in light/dark; contrast is at least 4.57:1. Keyboard link focus and HTTP 200
SSR with 50 scores/25 winner icons pass. The dark desktop screenshot was inspected; the light/mobile capture was
stale, so no light/mobile pixel pass is claimed. Cards, result bands, filters, points, and services are unchanged.
Original route, dark class, 1487x1252 viewport, and ten articles are restored after a read-only reload; no fixtures,
persistence changes, or backend mutations. The user approved completion and requested a commit with the screenshot
limit disclosed; this is not an unperformed light/mobile pixel pass. Its result-band follow-up is now DR-006c above,
keeping the parent open and preferring production consumers over unused match-row.
See the [brief](work-items/DR-006b-recent-game-scores.md).

DR-006a is Done with explicit user approval on 2026-10-17 and the screenshot limit retained:
the mounted player recent-games ranking-point chips now use native PrimeNG success/danger Tags.
Four focused tests, shared-library lint (32 existing warnings), and shared-library build pass. Positive and temporary
negative values fit at 390px/1280px in light/dark, with contrast at least 4.57:1. SSR returns 200 with the native Tag;
keyboard link focus remains visible. Dark desktop Tag pixels were inspected, but the light/mobile screenshot captured
unrelated content, so no light/mobile pixel pass is claimed. The temporary method fixture is removed; real points,
the original player route, dark class, and 1487x1252 viewport are restored. No persistence or backend mutation occurred.
The user approved completion with the light/mobile screenshot coverage limit disclosed, not a light/mobile pixel pass.
The subsequent score slice is now DR-006b above; the completed point scope is unchanged.
Keep DR-006 open. Cards, filters, and services remain unmigrated.
See the [brief](work-items/DR-006a-recent-game-points.md) for exact commands and coverage limits.

DR-005e (shared ranking progress) is Done with explicit user visual approval on 2026-10-17. The user preferred the
revised header layout, then requested bigger level numbers with no underline. Native large outlined secondary
PrimeNG button-links now show the level beside its discipline; point tags share a row and the visible points label
is removed. Actual level font is 15.75px instead of the interim 12.25px, with a 42px-high native target and no underline.
Its two existing consumers are the homepage and player detail route. Calculations, relative destinations, inputs,
translations, and projection are preserved; no tier-badge or global theme changes were made.
Nine focused component tests, 12 homepage tests, shared-library lint, and shared-library build pass. Both mounted
consumers pass 390px/1280px light/dark geometry and contrast checks; homepage authenticated presentation uses a
disposable browser-memory fixture, not a real login. Player SSR HTML returns 200 with all three links and six tags.
Final dark desktop and light mobile screenshots were inspected; no authenticated SSR or exhaustive hydration pass
is claimed. The fixture is removed and the original player route, dark class, and 1487x1252 viewport are restored.
The next component slice is now scoped as DR-006a above, without reopening completed DR-005 children.
See the [brief](work-items/DR-005e-ranking-progress.md) for evidence and limits. Keep DR-005 open.

DR-005d (shared stat-card) is Done at the user's explicit request on 2026-10-17 with coverage limits retained.
Native PrimeNG Card/Tag replace its custom surface, oversized typography,
and legacy delta colors; inputs and projected content are preserved, and local SCSS is removed. Eight focused
tests and shared-library lint/build pass. Synthetic layout checks pass at 390px/1280px in light/dark; text
contrast is at least 4.57:1. One dark desktop fixture screenshot captured correctly, but the mobile/light
attempt returned that stale dark desktop frame. No mobile/light pixel pass or mounted-consumer/SSR pass is claimed.
The user approved completion with those limits, not a successful mobile/light pixel or routed/SSR pass; see the
[brief](work-items/DR-005d-stat-card.md). The temporary fixture is removed; the original player route, dark class,
and 1487x1252 viewport are restored. Keep DR-005 open.
Ranking progress is now scoped separately as DR-005e; the completed stat-card scope remains unchanged.

DR-005c (shared sparkline) is Done at the user's explicit request on 2026-10-17 after the verification limits
were presented. The component now uses SVG geometry, native semantic result colors with
semantic fallbacks, and a translated accessible description; its local SCSS was removed. Six focused tests and
shared-library lint/build pass. Synthetic geometry/contrast checks pass at 390px/1280px in light/dark, including
without Tag variables. There is no production caller, so routed/SSR verification is unavailable. Screenshot
attempts captured the underlying page instead of the temporary preview; no visual/pixel pass is claimed.
The user accepted completion with those limits retained; see the [brief](work-items/DR-005c-sparkline.md).
The fixture is removed, the player route and dark class are unchanged, and the viewport is 1487x1252.
The next child is now scoped as DR-005d below. DR-005 remains open.

DR-005b is Done at the user's explicit request on 2026-10-17 after the verification limits were presented.
The shared form sequence uses native success/danger tags; four focused tests and shared-library lint/build pass.
There is no production caller, so no routed/SSR visual pass is claimed. The light screenshot/computed-color
discrepancy remains a documented coverage limit, not a resolved technical finding. The temporary preview was removed
and the original player route, dark theme, and 1487x1252 viewport restored.
DR-005c and DR-005d are also complete. DR-005 remains open for its other components;
shared stat-card also has no production caller.

DR-001 through DR-005a are Done. The shared badge's theme-aware styling, focused tests, lint/build, player-route
contrast checks, and user-requested completion are recorded in its brief. Some consumer routes lack populated badge
data or a production caller; those remain documented coverage limits, not verified visual passes. Do not reopen
completed work or expand DR-005 without separately scoping the next child.
DR-004's long-name, keyboard, theme/viewport, SSR, and user-review evidence is reconciled in its brief. Browser
fixtures were removed and the homepage's original selection and dark preference restored; no dependency or backend
data changed. DR-008/DR-014/DR-022/DR-006 discoveries remain deferred.

Follow the [design rules and workflow](README.md) for every item. This file is the authoritative status registry. Keep
it updated in the same change as the implementation.

## Work registry

Each row is a trackable area, not a promise to migrate that entire area in one change. Split multi-route or multi-tab
areas into child items before starting them. Briefs are created on demand from the [template](work-item-template.md)
and linked from their registry rows.

| ID                                                            | Area                                                    | Status  |
| ------------------------------------------------------------- | ------------------------------------------------------- | ------- |
| [DR-001][baseline]                                            | Theme and design baseline                               | Done    |
| [DR-002][pilot]                                               | Home page pilot                                         | Done    |
| [DR-003][shell-work-item]                                     | App shell, navigation, search, and layouts              | Done    |
| [DR-004][heading-work-item]                                   | Shared headings, hero, and breadcrumb                   | Done    |
| DR-005                                                        | Shared ranking, statistics, and status patterns         | Backlog |
| [DR-005a][tier-badge-work-item]                               | Shared tier badge                                       | Done    |
| [DR-005b][form-sequence-work-item]                            | Shared form sequence                                    | Done    |
| [DR-005c](work-items/DR-005c-sparkline.md)                    | Shared sparkline                                        | Done    |
| [DR-005d](work-items/DR-005d-stat-card.md)                    | Shared stat-card                                        | Done    |
| [DR-005e](work-items/DR-005e-ranking-progress.md)             | Shared ranking progress                                 | Done    |
| DR-006                                                        | Shared games, matches, and brackets                     | Backlog |
| [DR-006a](work-items/DR-006a-recent-game-points.md)           | Mounted player recent-game point indicators             | Done    |
| [DR-006b](work-items/DR-006b-recent-game-scores.md)           | Mounted player recent-game set scores                   | Done    |
| [DR-006c](work-items/DR-006c-recent-game-results.md)          | Mounted player recent-game result indicator             | Done    |
| [DR-006d](work-items/DR-006d-recent-game-filters.md)          | Mounted player recent-game heading and filters          | Done    |
| [DR-006e](work-items/DR-006e-recent-game-loading.md)          | Mounted player recent-game loading presentation         | Done    |
| [DR-006f](work-items/DR-006f-upcoming-game-cards.md)          | Mounted player populated upcoming-game cards            | Done    |
| [DR-006g](work-items/DR-006g-upcoming-game-states.md)         | Mounted player upcoming-games presentation              | Done    |
| [DR-006h](work-items/DR-006h-upcoming-encounter-cards.md)     | Shared upcoming encounter cards                         | Done    |
| [DR-006i](work-items/DR-006i-played-encounter-cards.md)       | Shared played encounter cards and expanded presentation | Done    |
| [DR-006j](work-items/DR-006j-bracket-tree-responsive.md)      | Shared bracket responsive layout                        | Done    |
| DR-007                                                        | Shared form controls and sync feedback                  | Backlog |
| DR-008                                                        | Player detail                                           | Backlog |
| [DR-008a](work-items/DR-008a-player-hero-actions.md)          | Player hero actions                                     | Done    |
| DR-009                                                        | Player head-to-head                                     | Backlog |
| DR-010                                                        | Player ranking breakdown                                | Backlog |
| DR-011                                                        | Player editing                                          | Backlog |
| DR-012                                                        | Club detail and browsing tabs                           | Backlog |
| DR-013                                                        | Club team builder                                       | Backlog |
| DR-014                                                        | Club team detail                                        | Backlog |
| DR-015                                                        | Competition detail and sub-event presentation           | Backlog |
| [DR-015a](work-items/DR-015a-competition-event-cards.md)      | Competition sub-event Cards                             | Done    |
| [DR-015b](work-items/DR-015b-competition-group-navigation.md) | Competition navigation and local-style retirement       | Done    |
| [DR-015c](work-items/DR-015c-competition-draw-links.md)       | Competition draw links and empty presentation           | Done    |
| [DR-015d](work-items/DR-015d-competition-metadata.md)         | Competition sub-event metadata Tags                     | Done    |
| [DR-015e](work-items/DR-015e-competition-hero-link.md)        | Competition hero external link                          | Done    |
| [DR-015f](work-items/DR-015f-competition-statistics.md)       | Competition hero statistics and localization            | Done    |
| [DR-015g](work-items/DR-015g-competition-draw-copy.md)        | Competition draw fallback and empty copy                | Done    |
| [DR-016](work-items/DR-016-competition-draws.md)              | Competition draws                                       | Done    |
| [DR-016a](work-items/DR-016a-poule-standings.md)              | Competition poule standings                             | Done    |
| [DR-016b](work-items/DR-016b-draw-hero.md)                    | Competition draw hero identity and actions              | Done    |
| [DR-016c](work-items/DR-016c-draw-statistics.md)              | Competition draw hero statistics                        | Done    |
| [DR-016d](work-items/DR-016d-encounter-section-chrome.md)     | Competition draw encounter section chrome               | Done    |
| [DR-016e](work-items/DR-016e-draw-states.md)                  | Competition draw loading, error, and overall-empty      | Done    |
| [DR-016f](work-items/DR-016f-standings-section-chrome.md)     | Competition poule standings section chrome              | Done    |
| [DR-016g](work-items/DR-016g-standings-terminology.md)        | Competition league standings terminology                | Done    |
| [DR-017](work-items/DR-017-competition-assembly.md)           | Competition assembly                                    | Backlog |
| [DR-017a](work-items/DR-017a-assembly-page-chrome.md)         | Assembly page heading and filter chrome                 | Done    |
| [DR-017b](work-items/DR-017b-assembly-player-row.md)          | Reusable assembly player row                            | Done    |
| [DR-017c](work-items/DR-017c-assembly-player-pool.md)         | Desktop assembly player-pool container                  | Done    |
| [DR-017d](work-items/DR-017d-assembly-doubles-slots.md)       | Desktop assembly doubles-slot containers                | Done    |
| [DR-017e](work-items/DR-017e-assembly-singles-slots.md)       | Desktop assembly singles-slot containers                | Done    |
| [DR-017f](work-items/DR-017f-assembly-substitutes.md)         | Desktop assembly substitutes container                  | Done    |
| [DR-017g](work-items/DR-017g-assembly-generation-controls.md) | Desktop assembly generation controls                    | Done    |
| [DR-017h](work-items/DR-017h-assembly-validation-overview.md) | Assembly validation overview and reused message content | Done    |
| [DR-017i][dr-017i]                                            | Desktop assembly partner combinations                   | Done    |
| DR-018                                                        | Competition editing                                     | Backlog |
| DR-019                                                        | Tournament detail and club tournaments                  | Backlog |
| DR-020                                                        | Tournament creation and editing                         | Backlog |
| DR-021                                                        | Tournament enrollment workflows                         | Backlog |
| DR-022                                                        | Tournament draw detail                                  | Backlog |
| DR-023                                                        | Tournament admin: enrollments and check-in              | Backlog |
| DR-024                                                        | Tournament admin: draws and scheduling                  | Backlog |
| DR-025                                                        | Tournament admin: settings and phase controls           | Backlog |
| DR-026                                                        | Tournament live displays and kiosk                      | Backlog |
| DR-027                                                        | Global admin and search indexing                        | Backlog |
| DR-028                                                        | Sync administration and team matching                   | Backlog |
| DR-029                                                        | Legacy styling retirement and final regression          | Backlog |
| DR-030                                                        | Shared header overflow at 320px                         | Backlog |
| DR-031                                                        | Native FloatLabel focused-label contrast audit          | Backlog |
| DR-032                                                        | Native Checkbox and secondary Button contrast audit     | Backlog |
| DR-033                                                        | Native Button contrast and Tooltip association audit    | Backlog |
| DR-034                                                        | Native Message severity text contrast audit             | Backlog |
| DR-035                                                        | Native Fieldset descendant tab-stop restoration audit   | Backlog |

[dr-017i]: work-items/DR-017i-assembly-partner-combinations.md

## App and shared surfaces

### DR-001 and DR-002: establish the direction

- DR-001 covers the [preset][preset], [PrimeNG configuration][app-config], [global styles][styles], [theme
  styles][theme-styles], and [theme service][theme-service]. Capture and verify; do not reset the theme.
- DR-002 covers `/`, implemented by the [home page][home]. Preserve ranking data and authenticated content.
- DR-002 covers the homepage query, loading, failure, and recovery behavior with focused tests.
- DR-002 editor advisory discovered during DR-004: the existing loading wrapper's `role="status"` is flagged in favor
  of native `output`. Homepage Nx lint passes; review loading announcements in the remaining functional checks.
- DR-002 depends on DR-001. Other items should record their concrete dependencies when promoted to `Ready`.
- DR-029 is the final cleanup, after relevant legacy consumers have migrated and shared/global regression checks pass.

### DR-003: app chrome and layouts

- [Shell][shell]: desktop/mobile navigation, search, account menu, login, theme switch, and update notification.
- [Layouts][layouts]: centered and full-width content, page width, and responsive spacing.
- [Language selection][language-selection]: preserve the existing locale selection component and behavior.
- Consider native menus, buttons, avatars, toolbar, and drawer before retaining custom navigation mechanics.
- Check all routed pages, popup overlays, anonymous/authenticated states, and theme preference persistence.
- Split navigation, search, and notification changes if they cannot be reviewed together.

### DR-004 to DR-007: shared patterns

- DR-004: [hero][hero], [page header][page-header], [section header][section-header], and [breadcrumb][breadcrumb].
  Simplify hierarchy and decoration without forcing every page into a hero.
- DR-005: [stat card][stat-card], [tier badge][tier-badge], [form sequence][form-sequence], [sparkline][sparkline], and
  [ranking progress][ranking-progress]. Keep useful domain meaning; prefer native severity and semantic text over a
  custom color system.
- DR-005a scopes only the shared tier badge and its five consumer groups; other patterns have separate child scopes.
  Keep the global rank-gradient token because other components still consume it. Its `match-row` call site has no
  production import; the inspected club/team and tournament poule routes did not render level badges with available
  safe data. See the [DR-005a brief][tier-badge-work-item] for exact test, browser, and review status.
- DR-005b scopes the form sequence only. It has no production caller; focused Angular tests cover its rendering
  contract and isolated native-tag markup supplies limited theme/viewport evidence. See its
  [brief][form-sequence-work-item] for user approval and the retained screenshot limitation. Stat-card
  is complete as DR-005d; ranking progress is scoped as DR-005e. Do not add a consumer solely for verification.
- DR-005c retains the miniature chart using SVG attributes and PrimeNG semantic tokens, with primary/text fallbacks
  when Tag-specific variables have not been injected. Its accessible title exposes translated outcomes as well as
  numeric heights. Six tests and isolated four-case geometry/contrast checks pass; no production caller exists.
  Screenshot capture did not include the fixture; the user accepted completion with that limit recorded in its
  [brief](work-items/DR-005c-sparkline.md). Global legacy result tokens remain for unmigrated consumers.
- DR-005d scopes stat-card only: native Card/Tag, wrapping text, directional icons, and preserved projection/inputs.
  Eight focused tests and shared-library lint/build pass. It has no production caller; isolated markup checks are
  not mounted Angular/SSR checks. The user explicitly approved completion with the stale mobile/light screenshot
  and consumer coverage limits retained in its [brief](work-items/DR-005d-stat-card.md).
  Ranking progress is scoped separately as DR-005e with two existing production consumers.
- DR-005e replaces ranking-progress decoration only, with focused and mounted-consumer evidence in its
  [brief](work-items/DR-005e-ranking-progress.md). Its calculations and relative links remain unchanged.
- DR-006: [games][games], [match row][match-row], [upcoming match][upcoming-match], and [bracket tree][bracket-tree].
  Keep score readability, result meaning, and responsive draw behavior.
- DR-006i started with the shared played summary. At the user's request it also removes all inline component CSS,
  migrating expanded games to native Cards with wrapping player names, semantic winner emphasis, translated
  perspective results, and paired plain-text set scores. Native Button replaces mouse-only expansion.
  Populated expanded-game pixels remain unverified because the available live games omit membership/set data.
- DR-006b discovery: resizing the mounted player list to mobile refreshes its page size; returning to desktop
  retained five articles for at least ten seconds. Reloading at desktop restores ten. Investigate breakpoint/page-size
  behavior separately before claiming responsive pagination coverage; score-only tests do not validate that workflow.
  Services, breakpoint logic, and pagination were unchanged in DR-006b.
- DR-007: [country/state controls][country-state] and [sync controls][sync-controls]. Preserve validation,
  disabled/loading states, and operation feedback. The [club-search area][club-search] currently contains service logic,
  not a visual component to redesign.
- DR-015e discovery for shared-control/theme follow-up: native secondary text Button active text measured
  4.46:1 in light mode, and its default dark focus ring measured 1.40:1 against the content surface.
  At the user's request DR-015e uses no `[dt]`. Its hero-only keyboard ring addresses focus without an outline;
  the light active-text contrast limit remains.
  Scope and check any shared correction separately; sync controls and draw links remain unchanged.
- DR-016d discovery for shared-control/theme follow-up: the unchanged played encounter expansion Button is
  keyboard-reachable with a named focus-visible state, but its settled native 1px outline is 1.40:1
  against its own dark encounter Card (8.46:1 light). Scope any correction with the shared encounter consumers
  and theme checks; no shared-control CSS or token was changed by the page-chrome slice.
- DR-006d discovery for later shared-control work: native inactive SelectButton labels measured 4.46:1 in light
  mode against this preset's canvas. DR-006d fixes only its own label template with semantic `text-color`.
  Check other mounted SelectButton consumers when scoped; do not alter global theme tokens implicitly.
- DR-006g completed the player upcoming-list header/loading/empty follow-up, removed legacy `.upcoming*` SCSS,
  and replaced the assembly `p-button` host with native `button pButton`. Its approved scope stays complete.
- DR-006h refreshes only the shared encounter card's upcoming variant across club schedule, team detail, and
  competition draw. Played encounter surfaces and expanded game rows remain candidates for separate DR-006
  children after DR-006h approval; do not fold their palette/keyboard/legacy styling work into this slice.
- Each shared component can become its own child task. Inventory consumers before changing an API or appearance.
- Preserve legitimate visualization behavior; do not replace charts or brackets with a table solely to avoid styling.

## Feature areas and routes

Routes below are based on the [root route configuration][root-routes] and each linked feature route file. Tabs and
embedded workflows are tracked even where they do not have their own URL.

### Players

Project: `frontend-pages-player`. Source: [player feature][players]; [routes][player-routes].

- DR-008: `/players/:playerId`. Include current form, season record, strongest matchups, teams, and ranking summaries.
- DR-008 discovery from DR-004 verification: the player hero's existing icon-only overflow menu lacks an accessible
  name. Add a localized label and verify keyboard/menu behavior in the player slice; no shared API change is needed.
- The user explicitly deferred the logged-in homepage ranking header to player/profile work; leave it unchanged in
  DR-004's table-surface correction.
- DR-005e discovery for DR-008/DR-002 follow-up: the shared ranking strip's existing relative links resolve to
  `/ranking/single`, `/ranking/double`, and `/ranking/mix` on the homepage. Root routes do not mount `ranking`;
  player-detail links resolve correctly and keyboard activation passes. Scope a separate destination fix using the
  player identity; do not treat preserving these existing links as a passing homepage navigation check.
- DR-009: `/players/:playerId/head-to-head`. Include comparison selection and the matchup grid.
- DR-010: `/players/:playerId/ranking/:type`. Include period selection, game lists, and ranking explanations.
- DR-011: `/players/:playerId/edit`. Include profile, claims, and ranking forms; split by form when needed.
- Preserve player identity links, filters, calculations, permissions, and translated labels.

### Clubs

Project: `frontend-pages-club`. Source: [club feature][clubs]; [routes][club-routes].

- DR-012: `/clubs/:clubId`. Cover club information, players, teams, schedule, tournaments, and their filters/cards.
  Start with one tab; do not migrate every tab in a single patch.
- DR-013: the team-builder tab and its dialogs, survey import/editing, player chips, settings, and sub-event selection.
  Include relevant team-edit interactions; split the builder and individual dialogs into child tasks.
- DR-014: `/clubs/:clubId/teams/:teamId`. Cover team information, players table, encounters, and relevant edit actions.
- DR-014 discovery from DR-004 verification: the consumer's existing `text-4xl`/`truncate` team title clips at 390px
  in both themes. Shared hero and action bounds pass. Address title wrapping when migrating the team page.
- Preserve team selection, survey handling, drag/drop or equivalent interactions, and data-editing behavior.

### Competition

Project: `frontend-pages-competition`. Source: [competition feature][competitions]; [routes][competition-routes].

- DR-015: `/competition/:competitionId`. Cover metadata, actions, grouped sub-events, and draw links. The [standalone
  sub-events page][sub-events] exists in source but is not mounted by the current feature routes. Verify whether it has
  consumers before including migration or retirement; do not add a new route.
- DR-016: `/competition/:competitionId/sub-events/:subEventId/draws/:drawId`. Cover poule/qualification presentations
  and encounter cards.
  DR-016a covers standings; DR-016b covers only hero identity/actions; DR-016c covers hero statistics.
  DR-016d covers only played/upcoming panel surfaces and localized headings/counts.
  DR-016e covers loading, error, and overall-empty states. DR-016f covers poule standings outer section chrome.
  DR-016g covers league standings terminology. The 2026-10-30 parent audit found 26 POULE links and no qualification
  instance in the supplied competition; qualification is deferred, not declared globally unused.
  Its routed conditional consumer remains unchanged. See the [parent reconciliation](work-items/DR-016-competition-draws.md)
  for remaining acceptance and review; no new consumer may be added solely for redesign verification.
- DR-017: `/competition/assembly`. Cover player assembly and partner combinations.
  DR-017a completes the mounted heading/filter chrome and the approved desktop time-range template correction.
  DR-017b covers only the existing player row reused in regular/backup pools and doubles/singles/substitutes.
  DR-017c covers only the desktop pool surface, availability controls, and disclosure, without token overrides.
  DR-017d completes only the four desktop doubles containers and accessible native statistic Tags,
  with explicit user approval and recorded verification limits.
  DR-017e covers only the four desktop singles containers, reusing the completed rows and native statistic pattern.
  DR-017f covers only the desktop substitutes container, reusing completed rows and preserving CDK sorting.
  DR-017g covers only the desktop generation-controls Card, fluid controls and hover/focus Tooltips.
  DR-017h covers only the validation overview Card and existing template reused in the confirmation dialog.
  DR-017i covers only the desktop partner-combinations disclosure, responsive named controls and native
  table/statistic presentation; completion is explicitly approved with native Fieldset restoration tracked in DR-035.
  DR-031 retains focused FloatLabel contrast; DR-033 records native outlined Button accessibility:
  generation-control light text 2.28-3.76:1, strategy focus below 3:1 and missing native Button
  `aria-describedby` while Tooltips display. Audit affected consumers separately; no page-level token workaround.
  DR-032 tracks unchecked Checkbox/secondary Button focus contrast, including the pool's disclosed native failures.
  The parent records pre-existing populated-lineup NG01354 form-registration warnings and unimplemented PDF
  generation as functional follow-up, not completed visual scope.
- DR-018: `/competition/:competitionId/edit`. Cover information, dates, and settings; split by form section.
- Preserve calculations, draw/encounter navigation, synchronization controls, and permission-dependent actions.
- DR-015e confirms an existing missing-visual-code sync-status exception in the detail component.
  Its external-link visibility tests isolate that unrelated validation; a missing-code live route is not claimed
  to work. Review missing-code sync behavior separately before changing its contract.

### Tournament browsing and editing

Project: `frontend-pages-tournament`. Source: [tournament feature][tournaments]; [routes][tournament-routes].

- DR-019: `/tournament/:tournamentId` and `/tournament/club/:clubId`. Cover tournament information and club tournament
  browsing as separate child tasks.
- DR-020: `/tournament/create` and `/tournament/:tournamentId/edit`. Cover information and settings forms; do not change
  creation or save semantics.

### Tournament enrollment

Parent: DR-021. Project: `frontend-pages-tournament`. Split into child tasks before implementation:

- `/tournament/:tournamentId/enroll`: filters, sub-event selection, cart, and partner-selection dialog.
- `/tournament/:tournamentId/sub-events/:subEventId/enroll`: sub-event-specific enrollment.
- `/tournament/:tournamentId/my-enrollments`: existing registrations and available actions.
- Preserve eligibility, validation, selections/cart state, partner handling, and submission/cancellation behavior.
- Existing [enrollment documentation][enrollment-docs] is context, not a reason to change the workflow during styling.

### Tournament draws

Parent: DR-022. Project: `frontend-pages-tournament`.

- `/tournament/:tournamentId/sub-events/:subEventId/draws/:drawId`.
- Cover the draw page, games, knockout tree, and standings table, splitting each view if needed.
- Preserve the full-width layout, score/result meaning, navigation, and any pan/zoom interaction.
- DR-022 discovery from DR-004: the existing bracket-tree body overflows at 390px and 1280px while the shared hero
  and its actions fit. At 1280px the bracket host is 1302px wide and extends to x=1284. Investigate bracket sizing
  with DR-006; do not hide this by clipping the page or changing shared headings.

### Tournament administration

Projects: `frontend-pages-tournament`, with shared controls where already used. All three areas live under
`/tournament/:tournamentId/admin`.

- DR-023: enrollment management and check-in tabs, one child task per tab.
- DR-024: draw management and scheduling tabs, one child task per tab.
- DR-025: settings, general settings, sub-events, and phase controls.
- Treat any shared admin tab shell change as an explicit cross-tab dependency.
- Preserve permissions, confirmations, validation, live state, and destructive-action safeguards.

### Tournament live displays

Parent: DR-026. Project: `frontend-pages-tournament`. Use one child task per display:

- `/tournament/:tournamentId/live/courts`.
- `/tournament/:tournamentId/live/results`.
- `/tournament/:tournamentId/live/upcoming`.
- `/tournament/:tournamentId/live/kiosk`.
- `/tournament/:tournamentId/live` currently redirects to `courts`; keep that behavior.
- Preserve public access, refresh/update behavior, kiosk cycling, and readability at display distances. Check
  large-screen use as well as mobile/desktop layouts.

### Global administration and synchronization

Projects: `frontend-pages-admin` and `sync-admin`. Source: [admin feature][admin], [sync feature][sync-admin]; [admin
routes][admin-routes] and [sync routes][sync-routes].

- DR-027: `/admin`, its search-indexing form, operation feedback, information, and the parent tab layout.
- DR-028: the sync dashboard embedded in `/admin`, including overview, cron jobs, sync plans, and ranking systems.
- Team matching exists in the sync library. Its own `dashboard` and `team-matching` routes are not mounted in the
  current root routes, and the admin team-matching tab is commented out. Record this as a deferred surface, not
  permission to expose it.
- Split sync tabs and team matching into child tasks. Preserve operational controls and live progress feedback.
- Do not run indexing, sync, cron, or other administrative mutations as part of visual verification.

## Remaining project coverage

- `app`: bootstrap, global theming, and route integration; covered by DR-001, DR-003, and DR-029.
- `frontend-components`: all existing visual areas are assigned to DR-003 through DR-007.
- `frontend-modules-theme`: covered by DR-001 and DR-029, with switching checked in each relevant slice.
- `frontend-modules-translation`: selection UI is covered by DR-003; preserve localization throughout.
- `frontend-modules-auth`: no standalone redesign screen identified; preserve login and permission behavior.
- `frontend-modules-graphql`, `frontend-modules-seo`, and `frontend-utils`: no independent visual redesign target.
  Preserve their data, metadata, SSR, and utility behavior; do not refactor them for visual cleanup.
- `app-e2e`: grow focused regression checks alongside implementation; final cross-area coverage is part of DR-029.
- Shared models, translations, backend/API/worker projects, and infrastructure are outside this visual redesign, except
  directly necessary localized UI copy or a separately scoped prerequisite.

## DR-029: final cleanup

- Search all consumers before removing old gradients, `g-*`/`t-*` styling, custom tokens, or component overrides.
- Revisit the inverted dark palette only as an explicit, separately reviewable theme change with consumer coverage.
- Remove only unused global rules and stylesheets. Do not delete compatibility styling still used by deferred screens.
- Check all migrated routes, shared overlays, translations, theme persistence, and SSR/hydration.
- Record any remaining justified styling exceptions and remaining unmigrated surfaces.

## Progress, evidence, and discoveries

- DR-035 (discovered during DR-017i): native Fieldset collapse/re-expansion removes the existing Select span
  and sortable-header `tabindex="0"`, preventing their subsequent keyboard access. Reproduced in isolated Chrome;
  installed PrimeNG `Fieldset.updateTabIndex()` removes rather than restores descendant tabindex on expansion.
  Audit confirmed Fieldset consumers and a native/upstream fix separately; do not add page-local focus hacks,
  silently remove disclosure behavior or broaden a page slice into a dependency upgrade.
  DR-017i preserves the existing native Fieldset and leaves full keyboard/focus acceptance unchecked.
- DR-034 (discovered during DR-017h): native styled Messages on the mounted assembly Card fail 4.5:1 text
  contrast in light success (3.16:1), error (4.44:1), warn (2.85:1), and dark error (4.40:1).
  Dark success/warn pass (6.48:1/7.49:1). Measurements composite native translucent fills over the actual Card.
  Audit the shared preset and confirmed Message consumers separately; do not add page-local styling overrides.
  DR-017h preserves the native presentation and leaves contrast checks unchecked with explicit completion approval.
- DR-030 (discovered during DR-016e): at a 320px viewport, the unchanged shared topbar tools and login Button
  extend to x=338px while the document client width is 305px. At 390px they fit. Investigate the mounted shared
  shell and all affected consumers in a separate slice; no header, theme, or global changes were made in DR-016e.
- DR-015c (2026-10-23): native anchor Buttons are appropriate for draw navigation; retain anchor semantics,
  semantic label colors, wrapping text, and a shrinking Card/grid item. No shared abstraction is needed.
- DR-003 follow-up observation during DR-015c keyboard navigation: immediate return navigation emitted
  `AbortError: Transition was skipped. New ViewTransition started`. The intended route and return both succeeded;
  the detail page had no errors after reload. Recheck rapid route transitions in a separate shell/router slice;
  no router/theme changes were made here.

DR-005e navigation also logged `InvalidStateError: Transition was aborted because of invalid state` while routes
still loaded. No global transition change was made; investigate only if reproducible in the relevant route/shell
follow-up. This is not a claimed clean-console or exhaustive hydration pass.

DR-001 established the baseline; DR-002 and DR-003 implemented the homepage and shell. [DR-004][heading-work-item]
records the approved shared layout, native homepage table composition, and explicitly requested neutral canvas.
Its implementation evidence records passing focused tests, lint, application build, and live light/dark narrow/wide
checks. This continuation reproduced the focused tests (Nx cache hit), the homepage's four theme/viewport cases,
and seven hero consumers' four-case geometry checks in the integrated browser. Homepage contrast, table scrolling,
drawer keyboard/focus return, and dark preference after reload pass. Two safe homepage screenshots were reviewed;
no feature-data screenshots were committed. A later SSR timeout/HTTP 500 was resolved before this resume; the three
mounted page-header consumers now pass all 12 theme/viewport cases. The user then supplied a tournament URL, and its
detail and linked draw heroes passed eight more shared-boundary checks. A homepage-local row token resolves the
requested table/card background mismatch; five homepage tests, homepage lint, and the library build pass. The user
approved the final canvas/table treatment on 2026-10-16; whole feature bodies are not claimed as migrated. Broader
shared-library ranking-progress/bracket-tree test failures remain outside this slice.

### DR-004 verification prerequisites discovered on 2026-10-16

- Resolved: the user enabled integrated-browser tools. Successful checks followed the shared player route and its
  existing links; do not repeat anonymous broad collection discovery or resume terminal-driven browser automation.
- Resolved: the earlier SSR timeout/HTTP 500 did not recur during resumed player, editing, head-to-head, admin, and
  homepage navigation. Its cause remains uninvestigated; no server or backend changes were needed for this pass.
- Resolved: the user supplied an approved tournament detail URL. Its existing links supplied a draw URL, and both
  heroes passed their four-case checks. No collection discovery or operational mutations were needed.

The homepage template and existing test now contain the scoped row-token correction and its assertion. The global
table preset, logged-in ranking header, feature bodies, dependencies, and operational state remain unchanged.
No styling exception was introduced. DR-004's final user visual approval remains recorded independently.

That statement completes DR-004 only. DR-002 is also complete; its focused tests and visual review are recorded in
the [home pilot brief][pilot].

Reuse rounded native card surfaces with semantic borders, readable shared headings, and a flat preset-owned canvas.
Do not reintroduce ambient gradients or custom table styling. Keep sensitive data out of committed screenshots/logs.

When splitting an item, add child rows to the registry with their own status and brief. Keep the parent row and mark it
done only after its required children pass review. Add new routes or newly discovered UI surfaces here rather than
silently expanding the active task.

[baseline]: work-items/DR-001-design-baseline.md
[pilot]: work-items/DR-002-home-pilot.md
[shell-work-item]: work-items/DR-003-app-shell.md
[heading-work-item]: work-items/DR-004-shared-headings.md
[tier-badge-work-item]: work-items/DR-005a-tier-badge.md
[form-sequence-work-item]: work-items/DR-005b-form-sequence.md
[preset]: ../../apps/app/config/theme.preset.ts
[app-config]: ../../apps/app/config/app.config.ts
[styles]: ../../apps/app/src/styles.scss
[theme-styles]: ../../apps/app/src/styles/theme.scss
[theme-service]: ../../libs/frontend/modules/theme/src/theme.service.ts
[root-routes]: ../../apps/app/config/app.routes.ts
[home]: ../../libs/frontend/pages/home/src/pages/home
[shell]: ../../libs/frontend/components/shell
[layouts]: ../../libs/frontend/components/layout
[language-selection]: ../../libs/frontend/modules/translation/selection
[hero]: ../../libs/frontend/components/hero
[page-header]: ../../libs/frontend/components/page-header
[section-header]: ../../libs/frontend/components/section-header
[breadcrumb]: ../../libs/frontend/components/breadcrumb
[stat-card]: ../../libs/frontend/components/stat-card
[tier-badge]: ../../libs/frontend/components/tier-badge
[form-sequence]: ../../libs/frontend/components/form-sequence
[sparkline]: ../../libs/frontend/components/sparkline
[ranking-progress]: ../../libs/frontend/components/player-ranking-progress
[games]: ../../libs/frontend/components/games
[match-row]: ../../libs/frontend/components/match-row
[upcoming-match]: ../../libs/frontend/components/upcoming-match
[bracket-tree]: ../../libs/frontend/components/bracket-tree
[country-state]: ../../libs/frontend/components/country-state
[sync-controls]: ../../libs/frontend/components/sync
[club-search]: ../../libs/frontend/components/club-search
[players]: ../../libs/frontend/pages/player/src
[player-routes]: ../../libs/frontend/pages/player/src/lib.routes.ts
[clubs]: ../../libs/frontend/pages/club/src
[club-routes]: ../../libs/frontend/pages/club/src/lib.routes.ts
[competitions]: ../../libs/frontend/pages/competition/src
[competition-routes]: ../../libs/frontend/pages/competition/src/lib.routes.ts
[sub-events]: ../../libs/frontend/pages/competition/src/pages/sub-events
[tournaments]: ../../libs/frontend/pages/tournament/src
[tournament-routes]: ../../libs/frontend/pages/tournament/src/lib.routes.ts
[enrollment-docs]: ../enrollment-frontend-architecture.md
[admin]: ../../libs/frontend/pages/admin/src
[admin-routes]: ../../libs/frontend/pages/admin/src/lib.routes.ts
[sync-admin]: ../../libs/frontend/pages/sync-admin/src/lib
[sync-routes]: ../../libs/frontend/pages/sync-admin/src/lib/lib.routes.ts
