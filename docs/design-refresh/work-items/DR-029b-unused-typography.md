---
title: 'DR-029b: Unused typography retirement'
description: 'Remove four proven-unused global typography helpers without changing active presentation.'
---

## Scope and dependencies

- Parent: DR-029; prerequisite: completed [DR-029a inventory](DR-029a-legacy-typography.md).
- Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Project: `app`. Only application edit: [theme stylesheet](../../../apps/app/src/styles/theme.scss).
- The mounted home page consumes [global styles](../../../apps/app/src/styles.scss), whose second line imports
  this stylesheet; resolved `app:build` also lists these global styles.
- Remove `.t-stat-lg`, `.t-mono`, `.t-body`, `.t-muted` and `--t-stat-lg`, `--t-mono`, `--t-body`.
- Keep `.t-eyebrow` and its token: the [draw template](../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.html)
  still renders `Qualification` conditionally. Do not treat unavailable qualification data as absence of a consumer.
- Exclude all other tokens, chip/tag rules, global overrides, components, routes, translations and dependencies.
  Do not redesign unused components or extract a wrapper for dead CSS.

## Baseline and approach

- Fresh exact tracked searches on 2026-11-27 found only the four definitions and their own token reads.
  Two tournament-detail negative assertions mention `.t-mono`; neither is an application consumer.
- Search all tracked files outside documentation and workflow instructions, including TypeScript and styles,
  rather than relying only on static templates. Runtime-generated/external content is not exhaustively proven.
- Shared browser home is mounted at `http://localhost:3000/`, dark, 1571 x 1272; zero matching helper nodes.
- Delete only unmatched definitions. No replacement, new abstraction, palette, SCSS rule or utility is needed.

## Implementation checklist

- [x] Confirm the mounted global stylesheet and fresh selector/token references.
- [x] Remove only the four unused rules and three size tokens.
- [x] Preserve the conditional qualification helper and all other global styling.
- [x] Record bounded before/after consumer checks and validation.
- [x] Persist status, exclusions and exact next action in the backlog.

## Acceptance and verification

- [x] Exact searches leave only negative test assertions, with no production helper/token reference.
- [x] App lint/build pass; emitted CSS has no retired definitions and retains qualification typography.
- [x] Sampled mounted content preserves typography and geometry in light/dark at 390px/1440px.
- [x] Supplied feature routes receive a bounded read-only consumer smoke check.
- [x] Keyboard focus and existing theme controls still work in the sampled app shell.
- [ ] Full cross-route visual/accessibility, workflow, locale and SSR/hydration regression.
- [x] User reviews retirement with verification limits disclosed.

## Evidence and handoff

Initial searches:

```powershell
git --no-pager grep -n -P -e '(?<![\w-])(?:t-stat-lg|t-mono|t-body|t-muted)(?![\w-])' -- . ':!docs' ':!.github'
git --no-pager grep -n -P -e '--t-(?:stat-lg|mono|body)(?![\w-])' -- . ':!docs' ':!.github'
```

### Application checks

- `npx prettier --write apps\app\src\styles\theme.scss docs\design-refresh\backlog.md
docs\design-refresh\work-items\DR-029b-unused-typography.md`: pass.
  Preserve unrelated original formatting after the formatter's table/gradient reflow; no semantic change there.
- `npx nx run-many -t lint build -p app`: pass, exit 0; 31 tasks succeed, 27 cached.
  The app development build executes and compiles the changed global stylesheet.
  Repeated after preserving unrelated original formatting: pass, 31 successful tasks, 29 cached.
- Required pre-commit `npx nx run-many --target=lint --output-style=static`: fails, exit 1.
  22 of 34 targets pass; twelve reproduce existing `@nx/dependency-checks` failures:
  `backend-seo`, `shared`, `backend-health`, `backend-ranking`, `backend-authorization`, `i18n`,
  `backend-translate`, `utils`, `backend-search`, `backend-database`, `frontend-modules-translation`,
  `backend-graphql`. Dependency manifests are unchanged; do not fix these outside this slice.
- Repeated exact tracked searches: only two unchanged tournament-detail negative assertions remain;
  no private size-token reference. Regex inspection of `dist\apps\app\browser\styles.css`:
  zero retired selector/token matches, `.t-eyebrow` and `--t-eyebrow` both present.
- `git diff --check`: pass. Final LF checks pass for all three files; frontmatter and 453 local link targets
  pass across the backlog and this brief. Formatter-only spillover restored, leaving 27 CSS lines deleted.
- No app test target exists in resolved Nx configuration. No tests added for deletion of unused CSS constants.
  No application behavior, templates, localization, data or permission logic changed.

### Browser comparison

Used the existing shared integrated browser, safe read-only inspection, no fixture data or administrative actions.
Computed evidence is recorded here rather than committing personal screenshots or browser logs.

| Home sample                    | Before and after, identical in both themes                  |
| ------------------------------ | ----------------------------------------------------------- |
| 390px heading                  | 26.25px / 600; bounds x=102.5, y=157.5, w=240, h=32.8125    |
| 1440px heading                 | 31.5px / 600; bounds x=161, y=121, w=1173, h=39.375         |
| 390px first table cell         | 14px / 400; bounds x=32.5, y=815.8125, w=63.84375, h=39     |
| 1440px first table cell        | 14px / 400; bounds x=91, y=523.875, w=109.828125, h=39      |
| Font family                    | Inter, Space Grotesk, system-ui, -apple-system, sans-serif  |
| Heading/cell text, light/dark  | `oklch(0.14 0.02 250)` / `oklch(0.94 0.005 250)`, unchanged |
| Rows / helper nodes / overflow | 12 / 0 / none in all four settled samples                   |

- Initial 400ms resize samples were inconsistent before editing. Repeated with 1500ms after resize and
  500ms after theme changes; final before/after samples agree. The transient sample is not a layout regression.
- At dark 1440 x 1000, all six supplied routes mounted their real heading before and after:
  competition, player, club, new tournament, imported finished tournament and parameterized assembly.
  Each has zero retired-helper nodes. Heading font/color/weight/bounds and table counts match exactly.
  This is a heading/consumer smoke check, not proof that every tab, dataset or interaction settled.
- Five feature headings retain 31.5px / 600; assembly retains 21px / 600.
  Table counts remain competition 0, player 0, club 10, new tournament 0, imported tournament 0, assembly 1.
- Native theme Button receives focus and Enter changes the theme in all four theme/width cases.
  Accessible name switches appropriately; `:focus-visible` stays true with 1px `auto` outline.
- Browser navigation logs `InvalidStateError: Transition was aborted because of invalid state` and
  navigation-time GraphQL `net::ERR_ABORTED` before and after deletion. Existing transition findings in the
  backlog remain open; these checks do not claim a clean console or diagnose aborted requests.
- Restored original home URL, dark presentation and 1571 x 1272 viewport. No service started, stopped or restarted.

### Limits and next action

- Four rules and three tokens removed (27 source lines); no template utility changes or new styling exception.
- No additional component extraction: there is no live consumer of the removed rules to share or restyle.
- Qualification branch not exercised in the browser; source and emitted CSS preserve its helper.
- Full feature theme/width matrices, screenshot review, contrast, screen-reader/touch, interaction states,
  workflow mutations, locale switching and SSR/hydration remain unperformed.
  Inherited DR-033/034/076 and other accepted historical limits are unchanged.
- On 2026-11-27 the user selected `Approve with documented limits and commit` and `Nothing else`.
  Status is Done by this explicit approval; all unperformed acceptance criteria remain unchecked.
  Approval accepts the bounded browser coverage and remaining full regression limits, not a claim those checks passed.
  Existing workspace dependency-check failures remain recorded and unchanged.
- Commit only the approved child implementation and repository handoff; no push.
- Next invocation: scope one independent DR-029 cleanup child using fresh consumer evidence,
  excluding the retained qualification typography and unused components.
  DR-029 remains open; this child is not approval for broader global retirement.
