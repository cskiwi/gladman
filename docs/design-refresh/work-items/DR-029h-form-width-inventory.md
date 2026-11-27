---
title: 'DR-029h: Global form-width override inventory'
description: 'Read-only inventory of global form sizing, native fluid options and mounted consumers.'
---

## Identity and scope

- Parent: DR-029; prerequisite: approved [DR-029g](DR-029g-radius-consumers-cascade.md).
- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Project: `app`. Inspect only the two form-width rules in
  [global styles](../../../apps/app/src/styles.scss), lines 40-58.
- Mounted entry: home `/` loads this stylesheet through resolved `app:build.options.styles`.
  Trace the header search and a mounted feature form before making retention decisions.
- Started on existing `main`, 2026-11-27, with a clean worktree; no new branch or worktree.
- Preserve all selectors, application code, native PrimeNG styling, utilities, data, routes,
  permissions, localization and behavior.
- Exclude deletion/migration, component extraction, other global rules, dependencies, operational mutations
  and final cross-route regression. This slice explicitly calls for investigation, not implementation.

## Approach

- Inventory each selector and current tracked template candidates, separating matches from mounted consumers.
- Inspect installed native fluid capabilities and served CSS cascade without injecting styles or probe nodes.
- Sample real controls in light/dark at narrow/wide widths without submitting forms or changing domain data.
- No utility/style changes or smart/presentational extraction: a global-rule investigation has no repeated UI to extract.

## Acceptance and verification

- [x] Record both rules, selector candidates and native sizing alternatives.
- [x] Confirm real mounted consumers and distinguish unused/conditional references.
- [x] Verify served cascade and bounded light/dark, narrow/wide control sizing.
- [x] Persist retention decisions, validation limits and exact next action.
- [x] Obtain user review with disclosed limits.

## Evidence and handoff

### Rules and tracked candidates

The grouped rule contains eleven selectors, all with `width: 100%`. The second rule is
`p-autoComplete > div { width: 100% }`. Neither has `!important`. Both are served unlayered
from `http://localhost:3000/styles.css`; CSSOM normalizes the custom-element names to lowercase.

Case-insensitive opening-tag aggregation over tracked `apps/**/*.html` and `libs/**/*.html`:

| Global selector                           | Opening tags | Templates | Evidence and decision                                        |
| ----------------------------------------- | ------------ | --------- | ------------------------------------------------------------ |
| `input`                                   | 41           | 22        | Roster search, header search, native control inputs. Retain. |
| `textarea`                                | 3            | 3         | Enrollment/survey dialog candidates; not opened. Retain.     |
| `.p-datepicker`                           | 29           | 12        | Counts are DatePicker tags, not authored classes. Retain.    |
| `p-inputnumber`                           | 22           | 11        | Ranking/settings/survey dialog candidates. Retain.           |
| `p-floatlabel`                            | 4            | 1         | Mounted assembly; one conditional weeks field. Retain.       |
| `p-iftalabel`                             | 8            | 1         | Mounted head-to-head; conditional filters. Retain.           |
| `p-autoComplete`                          | 11           | 9         | Mounted header/assembly plus dialog candidates. Retain.      |
| `p-dropdown`                              | 0            | 0         | Unmatched legacy host candidate; no deletion here.           |
| `p-columnfilterformelement`               | 0            | 0         | Native table internals require separate inspection. Retain.  |
| `p-multiselect`                           | 4            | 3         | Mounted roster, enrollment/schedule candidates. Retain.      |
| `p-select:not(.p-paginator-rpp-dropdown)` | 48           | 23        | Select tags counted before runtime exclusion. Retain.        |

- Counts are source candidates, not an assertion that every template is mounted or every branch exercised.
  No authored `class` containing `p-datepicker` was found. Native DatePicker supplies that class at runtime:
  head-to-head renders the matching host. Generated internal inputs are not included in the 41 authored tags.
- Zero authored `p-columnfilterformelement` tags is not proof of unused native functionality.
  Installed `node_modules/primeng/fesm2022/primeng-table.mjs:8651` declares both
  `p-column-filter-form-element` and `p-columnfilterformelement`; its current templates at 10074/10187
  use the hyphenated form, which the legacy global selector does not match.
  [Tournament sub-event settings][sub-events] has seven ColumnFilter definitions, including numeric/text filters.
  No filter overlay was opened here; distinguish installed aliases from rendered consumer evidence.
- Installed `node_modules/primeng/fesm2022/primeng-paginator.mjs:35` defines the excluded
  `p-paginator-rpp-dropdown` class. No such host rendered in the sampled roster; the exception is preserved,
  not verified by an absent dropdown. The table has no rows-per-page options in this template.
- Dialog candidates and any unmounted sources remain unchanged. No consumer is added for testing.

### Mounted consumers, native sizing and cascade

- [Root routes][root-routes] mount club/player/competition. [Club routes][club-routes] mount `/clubs/:clubId`,
  and [club detail][club-detail] renders [roster][roster] in its deferred players tab.
  Verified at `/clubs/smash-for-fun?tab=players`; search, conditional team MultiSelect and season Select render.
- [Shell][shell] renders [search][search] in desktop/mobile branches. The native AutoComplete host and input
  are full width, without a native fluid class. Search's responsive wrapper controls its width;
  `styleClass="w-full"` already applies to the native root.
- Roster search has `w-full`. Its MultiSelect has no `fluid` input or host width utility;
  the `w-full sm:w-64` parent bounds the global full-width host. Do not delete this rule as dead styling.
- [Player routes][player-routes] mount `/players/:playerId/head-to-head`.
  Its [filter template][head-to-head] already uses native `fluid` on Select, DatePicker and InputText.
  IftaLabel wraps the controls; eight authored wrappers include conditional opponent/partner branches.
- [Competition routes][competition-routes] mount `/competition/assembly`; the [page][assembly-page]
  renders the [assembly component][assembly] and native fluid filter controls.
  The supplied encounter/team/club/season URL rendered three FloatLabels in the default time-range state;
  the fourth weeks wrapper is conditional and was not activated.
- Installed [BaseInput types][baseinput], lines 4-11/68-72, provide `fluid` and inherited `hasFluid`
  for Select, AutoComplete, DatePicker and InputNumber.
  Installed InputText/Textarea/MultiSelect types declare their own fluid inputs.
  [Native Fluid documentation](https://primeng.dev/fluid) confirms per-control fluid or a meaningful
  `p-fluid` group; a child's explicit fluid input takes precedence over that container.
  FloatLabel/IftaLabel do not declare fluid inputs; retain their normal layout and size the contained controls.
- CSSOM confirms native unlayered `.p-select-fluid` and `.p-multiselect-fluid` full-width rules.
  The global grouped rule is also unlayered. Its host widths override normal layered Tailwind widths;
  inline widths, important rules and more-specific unlayered rules must be evaluated separately.
  Native fluid and this global rule can both supply `100%`; equal computed width alone does not prove redundancy.
  Disabling native fluid does not cancel a separate matching global width rule.
- `p-autoComplete > div` matches zero nodes in the sampled header, roster, head-to-head and assembly.
  Installed AutoComplete template at `node_modules/primeng/fesm2022/primeng-autocomplete.mjs:1657`
  renders the single input or multiple-selection list directly; overlay markup starts under `p-overlay`
  at 1832, not an unconditional direct-child div.
  Treat the child rule as a candidate for separately verified retirement, not permission to remove it now.
  Popup/multiple/dropdown/loading variants and projected content were not exercised.

### Browser sizing evidence

Original state: home `/`, dark, 1571 x 1272. Matrices use height 1000px.
All measured controls equal their parent border-box width; every matrix sample has no page horizontal overflow.

| Route/control                                      | 390px light/dark | 1440px light/dark |
| -------------------------------------------------- | ---------------- | ----------------- |
| Club header AutoComplete                           | 347px            | 336px             |
| Club roster search and team MultiSelect            | 315.5px          | 224px             |
| Club season Select                                 | 310px            | 270.86px          |
| Head-to-head IftaLabel/Select/DatePicker/InputText | 313.5px          | 301.13px          |

- Assembly light/1440px only: first FloatLabel and contained fluid Select are 389.66px;
  club fluid AutoComplete is 300.25px. Both equal their parent width; no assembly theme/width matrix claimed.
- First roster matrix sampled before asynchronous theme changes settled; discard its theme labels.
  Rerun with `page.waitForFunction` confirming the requested document theme after each native theme-button click.
  Corrected roster and head-to-head matrices above verify all four combinations.
- No styles, DOM probes, selections, save/generate/admin actions or operational data were mutated.
  Only navigation, roster-tab activation, viewport changes and native theme toggles were used.
  Restore home, original dark theme and viewport. Auth UI briefly reloads during navigation;
  existing `InvalidStateError: Transition was aborted because of invalid state` appears on transitions.
  No clean-console or authentication-lifecycle claim.
- These are read-only sizing baselines, not before/after deletion, full visual review, contrast or workflow regression.
  No private browser snapshots/logs are committed.

### Validation, limits and next action

```powershell
npx nx show project app --json
$files=git ls-files -- 'apps/**/*.html' 'libs/**/*.html'
$rx='<(?<tag>input|textarea|p-datepicker|p-inputnumber|p-floatlabel|p-iftalabel|p-autocomplete|p-dropdown|p-columnfilterformelement|p-multiselect|p-select)(?=[\s>])'
$rows=foreach($file in $files) {
  foreach($m in [regex]::Matches([IO.File]::ReadAllText((Join-Path $PWD $file)),$rx,'IgnoreCase')) {
    [pscustomobject]@{Tag=$m.Groups['tag'].Value.ToLower();File=$file}
  }
}
$rows | Group-Object Tag | ForEach-Object {
  [pscustomobject]@{Tag=$_.Name;Occurrences=$_.Count;Templates=($_.Group.File | Select-Object -Unique).Count}
}
```

- Nx discovery and aggregation pass. No app test target; lint/build exist but are not run for documentation only.
  Earlier broad grep counted 209 matching lines, not opening tags; use the aggregation table instead.
  A combined probe exited 1 for no TypeScript selector matches; no absence-based retirement claim.
  A later shell grep had quote/regex parsing failure; corrected bounded searches and tracked class aggregation
  confirm no legacy direct tags or authored DatePicker class. An unsupported rg lookaround was not used as evidence.
  PrimeNG batch lookup failed its argument validation; single Fluid docs and installed types supply native API evidence.
- `npx prettier --write` and `npx prettier --check` on this brief and backlog pass;
  `git diff --check` passes. Node validation via PowerShell here-string passes LF/frontmatter,
  526 local link targets, initial Review and approved Done/candidate/parent rows, and exactly two changed documents.
  Git's future-CRLF warning does not reflect the verified LF file bytes.
  Final browser check confirms home, dark, 1571 x 1272 and the restored Account control after auth reload.
- No application code, utilities, colors, SCSS, dependency or reusable component changes; no new styling exception.
  Existing wrappers, smart/page separation and native fluid inputs are sufficient; no extraction needed for this audit.
- Not run: lint/build/tests, popup and dialog variant regression, keyboard/focus/contrast, state/permission checks,
  complete route/locale/accessibility review or SSR/hydration. Inherited DR-033/034/076 and historical workspace
  dependency-check failures remain unresolved and are not revalidated here.
- On 2026-11-27 the user selected `Approve inventory with documented limits and commit` and `Nothing else`.
  Resulting status: Done by explicit approval of this inventory and its disclosed limits.
  Unperformed application, visual/accessibility and workflow checks remain unperformed.
  Approval authorizes only this brief/backlog commit, not width migration or deletion; no push.
- Exact next invocation: separately scope DR-029i to verify all current
  AutoComplete template variants/consumers before retiring only `p-autoComplete > div`.
  That candidate is not started; preserve the entire grouped width rule and all other global styles.
  DR-029 remains open; full cross-route regression stays separate.

[root-routes]: ../../../apps/app/config/app.routes.ts
[club-routes]: ../../../libs/frontend/pages/club/src/lib.routes.ts
[club-detail]: ../../../libs/frontend/pages/club/src/pages/detail/page-detail.component.html
[roster]: ../../../libs/frontend/pages/club/src/pages/detail/tabs/club-players-tab.component.html
[shell]: ../../../libs/frontend/components/shell/src/shell.component.html
[search]: ../../../libs/frontend/components/shell/src/components/search/search.component.html
[player-routes]: ../../../libs/frontend/pages/player/src/lib.routes.ts
[head-to-head]: ../../../libs/frontend/pages/player/src/pages/head-to-head/page-head-to-head.component.html
[competition-routes]: ../../../libs/frontend/pages/competition/src/lib.routes.ts
[assembly-page]: ../../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.component.html
[assembly]: ../../../libs/frontend/pages/competition/src/pages/assembly/components/assembly/assembly.component.html
[sub-events]: ../../../libs/frontend/pages/tournament/src/pages/admin/tabs/settings/components/sub-events/sub-events.component.html
[baseinput]: ../../../node_modules/primeng/types/primeng-baseinput.d.ts
