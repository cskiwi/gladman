---
title: 'DR-029g: Radius utility consumers and cascade'
description: 'Read-only investigation of retained global radius overrides and generated Tailwind consumers.'
---

## Identity and scope

- Parent: DR-029; prerequisite: approved [DR-029f](DR-029f-unused-spacing-radius-tokens.md).
- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Project: `app`. Investigate `--radius-sm/md/lg/xl` in the
  [theme stylesheet](../../../apps/app/src/styles/theme.scss), generated Tailwind rules and actual consumers.
- Mounted entry: home at `http://localhost:3000/` loads
  [global styles](../../../apps/app/src/styles.scss), which imports the theme stylesheet.
- Preserve all four overrides, PrimeNG preset, utilities, qualification typography, compatibility colors,
  routes, data, permissions, localization and behavior.
- Exclude application edits, radius deletion, component redesign/extraction, unused-screen activation,
  dependencies, operational mutations and final cross-route regression.
- Started on existing `main`, 2026-11-27, with a clean worktree; no branch/worktree switch.

## Baseline and approach

- Trace exact radius utility classes to mounted consumers, distinguishing conditional and unused templates.
- Inspect generated CSS and compute the browser cascade; literal custom-property searches are insufficient.
- Record app overrides against installed Tailwind defaults without changing either.
- No markup, utility or style changes. No smart/presentational extraction is justified for this token investigation.

## Acceptance and verification

- [x] Record each radius override, Tailwind default and generated reader.
- [x] Trace current utility templates to mounted consumers; distinguish unused and conditional branches.
- [x] Verify computed root values and actual utility readers without adding test consumers.
- [x] Record retention decisions and the exact next action in repository documentation.
- [x] Obtain user review with disclosed verification limits.

## Evidence and handoff

### Radius inventory and cascade

| Token         | App override | Tailwind default | Default at root 14px | Generated utility observed | Decision |
| ------------- | ------------ | ---------------- | -------------------- | -------------------------- | -------- |
| `--radius-sm` | 4px          | 0.25rem          | 3.5px                | `rounded-sm`               | Retain.  |
| `--radius-md` | 8px          | 0.375rem         | 5.25px               | None in served CSS.        | Retain.  |
| `--radius-lg` | 12px         | 0.5rem           | 7px                  | `rounded-lg`               | Retain.  |
| `--radius-xl` | 20px         | 0.75rem          | 10.5px               | `rounded-xl`               | Retain.  |

- Installed defaults: `node_modules/tailwindcss/theme.css:398-401`.
  App declarations: [theme stylesheet](../../../apps/app/src/styles/theme.scss), lines 21-24.
  The [global entry](../../../apps/app/src/styles.scss), lines 2 and 5-9, imports both systems.
  Resolved `app:build.options.styles` contains that entry; `outputPath` is `dist/apps/app`.
- Served CSSOM has `:root, :host` radius defaults inside `theme`, `rounded-lg/sm/xl` readers inside
  `utilities`, and the app's `:root` values outside any layer.
  Normal unlayered declarations win over normal layered defaults; source-token absence is not consumer absence.
  The utilities inherit the winning app values. Removing `--radius-lg` would change mounted bracket
  rounding from 12px to 7px at the current root font size; this is a cascade calculation, not a deletion experiment.
- No `rounded-sm` or `rounded-md` class appears in the bounded tracked production search.
  Generated `rounded-sm` alone does not establish a mounted consumer; no origin for its generation is asserted.
  `--radius-md` has a layered default but no served utility reader observed. Retain both in this investigation:
  lack of a reader is not authorization for an additional retirement slice.
- `--radius-xl` has generated readers in unused legacy templates. Preserve their compatibility styling;
  do not add callers to justify redesign. `--radius-lg` has both mounted and conditional consumers.
- The PrimeNG preset is unchanged. These are Tailwind-named properties, not evidence that native PrimeNG
  component radius tokens depend on them. Other rounding utilities such as `rounded-border/full` are excluded.

### Utility templates and application consumers

Fresh tracked search finds 17 utility occurrences in seven templates: fifteen `rounded-lg`, two `rounded-xl`.
The four token names appear only at their app declarations in tracked production source.

| Template                            | Utility occurrences | Current application evidence                               |
| ----------------------------------- | ------------------- | ---------------------------------------------------------- |
| [Bracket tree][bracket]             | Three `rounded-lg`  | Mounted KO draw; 20 rendered utility nodes observed.       |
| [Qualification draw][qualification] | Two `rounded-lg`    | Conditional mounted competition draw route; not exercised. |
| [Recent games team][recent-team]    | Five `rounded-lg`   | Dispatcher team branch has no mounted caller found.        |
| [Team encounters][team-encounters]  | Three `rounded-lg`  | No caller; current team detail uses encounter Cards.       |
| [Team matching][team-matching]      | Two `rounded-lg`    | Admin tab commented out; exported sync routes not mounted. |
| [Match row][match-row]              | One `rounded-xl`    | No production caller found; leave unchanged.               |
| [Upcoming match][upcoming-match]    | One `rounded-xl`    | No production caller found; leave unchanged.               |

- [Root routes][root-routes] mount tournament, competition, player, club and admin, not `syncRoutes`.
  [Sync routes][sync-routes] contain `team-matching`, but have no application import/caller in the tracked search.
  [Admin template][admin-template] lines 110-112 contain only a commented-out team-matching tab.
- [Tournament routes][tournament-routes] mount
  `/tournament/:tournamentId/sub-events/:subEventId/draws/:drawId`.
  [Draw page][draw-page] lines 83-85 render `app-draw-ko-tree` for KO draws with standings;
  its [existing adapter][draw-adapter] uses the shared bracket. This is a real consumer, not an export or preview.
- [Competition routes][competition-routes] mount
  `/competition/:competitionId/sub-events/:subEventId/draws/:drawId`.
  [Competition draw template][competition-draw] lines 87-93 render qualification only for `QUALIFICATION`.
  Its table/cards also require data; no qualification data or live branch validation is claimed here.
- [Player detail][player-detail] line 69 passes `type="player"` to the [dispatcher][dispatcher].
  Its team branch is unused in the current mounted call chain; an internal dispatcher reference is insufficient.
- [Team detail][team-detail] renders `app-encounter-card`, not `app-team-encounters`.
  No unused component is restyled, removed or mounted. Existing smart/presentational separation remains sufficient;
  extraction would not help a read-only global-token inventory.

### Browser checks

- Baseline home: URL `/`, dark presentation, 1571 x 1272, computed root font 14px;
  values `4px`, `8px`, `12px`, `20px`. Zero nodes for all four investigated utility classes on home.
- Use the existing populated KO draw recorded by [DR-006j](DR-006j-bracket-tree-responsive.md):
  `/tournament/internationaal-tornooi-lokerse-bc-2023/sub-events/755f536f-7d16-46ba-93c8-49d07123ce6c/draws/68b472cb-2940-47ec-ac17-eff7a15cab6a`.
  It mounts `app-bracket-tree`; no fixture or test consumer is added.
- Four samples: light/dark at 390px and 1440px, height 1000px.
  Every sample has 20 bracket `rounded-lg` nodes; scroll viewport, first round heading and first match box
  each compute `border-radius: 12px` and inherited `--radius-lg: 12px`.
  Root values stay `4px`, `8px`, `12px`, `20px`; `rounded-sm/md/xl` node counts are zero.
  No page-level horizontal overflow in these samples. This is a bounded cascade check, not final visual regression.
- Native theme Button clicks switch light/dark; restore original dark preference and 1571 x 1272,
  then return to home. No CSS mutation, added probe node, operational/admin action or dependency change.
- First two CSSOM walkers incorrectly skipped style rules with empty nested `cssRules`; discard those
  empty rule inventories and rerun a walker that inspects style declarations before recursing.
  Final CSSOM inventory returns both defaults and overrides plus all three served utility readers.
  The external Google Fonts sheet is unreadable (`SecurityError`); not used as radius evidence.
- Supplied imported-tournament overview was inspected before the existing KO fixture; not a full route review.
  Existing navigation-transition `InvalidStateError` and an aborted navigation-time GraphQL request occur.
  No clean-console, authentication-lifecycle or all-route workflow claim; no screenshots/private logs committed.

### Validation and next action

```powershell
git --no-pager grep -n -P -e '(?<![\w-])--radius-(?:sm|md|lg|xl)(?![\w-])' -- apps libs tools
git --no-pager grep -n -E -e 'rounded-(sm|md|lg|xl)' -- apps libs tools
git --no-pager grep -n -E -e 'getPropertyValue' -e 'setProperty' -e '@property' -e 'rounded-' -- apps libs tools ':!*.html' ':!*.spec.ts' ':!*.scss' ':!*.md'
git --no-pager grep -n -E 'app-(bracket-tree|recent-games|team-encounters|qualification-draw|match-row|upcoming-match|team-matching-dashboard)|syncRoutes' -- apps libs ':!*.spec.ts' ':!*.md'
npx nx show project app --json
```

- All commands pass, exit 0. Exact token search: four declarations; utility search: 17 occurrences.
  Focused non-template indirect-reader search returns only an unrelated `rounded-border` schedule host.
  Call-chain searches include selector declarations and a commented tab; distinguish these from live consumers above.
- Nx targets: lint/build/serve/extract-i18n; no app test target.
  Lint/build/tests not run because only documentation changes; no new behavior test introduced.
  Do not reuse DR-029f's application passes as this slice's validation.
- `npx prettier --write` on this brief and backlog: pass; historical backlog formatting remains unchanged.
  `git diff --check`: pass. Node validation: LF/frontmatter, 533 local link targets,
  authoritative initial Review/candidate/parent rows and exactly two changed documents pass.
  Git's future-CRLF warning does not reflect the verified LF file bytes.
  No application source changed; no new SCSS, colors, utility classes or exception.
- Full cross-route visual/accessibility, keyboard/focus/contrast, workflow/state/permission,
  localization and SSR/hydration regression remain unperformed.
  Inherited DR-033/034/076 findings, historical twelve workspace dependency-check failures and
  DR-006j's six bracket-test failures are not revalidated or resolved.
- On 2026-11-27 the user selected `Approve inventory with documented limits and commit` and `Nothing else`.
  Resulting status: Done by explicit approval of the inventory and disclosed limits.
  Application and full regression checks remain unperformed; acceptance does not claim they passed.
  Retain all four tokens; no global radius migration or future deletion authorized.
  Parent DR-029 stays open. Approved commit scope is only this brief/backlog; no push.
- Exact next invocation: separately scope DR-029h, an inventory of the remaining global form-width
  overrides; it is not started. Do not restart completed styling or redesign unused components.

[bracket]: ../../../libs/frontend/components/bracket-tree/src/bracket-tree.component.html
[qualification]: ../../../libs/frontend/pages/competition/src/pages/draws/components/qualification-draw.component.html
[recent-team]: ../../../libs/frontend/components/games/recent/src/team/recent-games-team.component.html
[team-encounters]: ../../../libs/frontend/pages/club/src/pages/team-detail/components/team-encounters.component.html
[team-matching]: ../../../libs/frontend/pages/sync-admin/src/lib/components/team-matching/team-matching-dashboard.component.html
[match-row]: ../../../libs/frontend/components/match-row/src/match-row.component.html
[upcoming-match]: ../../../libs/frontend/components/upcoming-match/src/upcoming-match.component.html
[root-routes]: ../../../apps/app/config/app.routes.ts
[sync-routes]: ../../../libs/frontend/pages/sync-admin/src/lib/lib.routes.ts
[admin-template]: ../../../libs/frontend/pages/admin/src/pages/admin/page-admin.component.html
[tournament-routes]: ../../../libs/frontend/pages/tournament/src/lib.routes.ts
[draw-page]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/page-draw-detail.component.html
[draw-adapter]: ../../../libs/frontend/pages/tournament/src/pages/draw-detail/components/draw-ko-tree.component.ts
[competition-routes]: ../../../libs/frontend/pages/competition/src/lib.routes.ts
[competition-draw]: ../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.html
[player-detail]: ../../../libs/frontend/pages/player/src/pages/detail/page-detail.component.html
[dispatcher]: ../../../libs/frontend/components/games/recent/src/recent-games.component.html
[team-detail]: ../../../libs/frontend/pages/club/src/pages/team-detail/page-team-detail.component.html
