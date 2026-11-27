---
title: 'DR-029e: Spacing and radius consumer inventory'
description: 'Read-only consumer inventory before separately scoped global spacing/radius token retirement.'
---

## Scope and dependencies

- Parent: DR-029. Authoritative status: [backlog](../backlog.md); design rules: [plan](../README.md).
- Resume the next action recorded by completed [DR-029d](DR-029d-unused-palette-tokens.md).
- Project: `app`. Inventory only `--space-1` through `--space-8` and
  `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl` in the
  [theme stylesheet](../../../apps/app/src/styles/theme.scss).
- The mounted home at `http://localhost:3000/` loads
  [global styles](../../../apps/app/src/styles.scss), which imports the theme stylesheet.
  Resolved `app:build` confirms the global entry. No consumer is added for verification.
- Exclude application edits, deletion, components, theme preset, compatibility colors/gradients,
  qualification typography, other global overrides and the final cross-route regression matrix.
- Started on existing `main`, 2026-11-27, with a clean worktree; no branch/worktree switch.

## Baseline and approach

- Enumerate exact tracked references, then check fragments and runtime custom-property access.
- Distinguish definitions from reads; an obsolete stylesheet comment is not consumer evidence.
- Native PrimeNG spacing/radius tokens and Tailwind layout classes are not these custom properties.
  Do not change either system or redesign unmounted components.
- No markup, utility usage, style rules or behavior changes. No smart/presentational extraction is
  justified for a token inventory; shared component extraction requires actual repeated consumers.

## Acceptance

- [x] Record all exact tracked references and token values.
- [x] Check name fragments and runtime custom-property access for indirect readers.
- [x] Confirm a mounted stylesheet consumer and distinguish baseline from visual regression.
- [x] Persist retention decisions, follow-up scope and validation in the backlog.
- [x] Obtain user review of the inventory and disclosed limits.

## Evidence and handoff

### Inventory and decisions

| Token         | Value | Tracked evidence and decision                   |
| ------------- | ----- | ----------------------------------------------- |
| `--space-1`   | 4px   | Definition only; separate retirement candidate. |
| `--space-2`   | 8px   | Definition only; separate retirement candidate. |
| `--space-3`   | 12px  | Definition only; separate retirement candidate. |
| `--space-4`   | 16px  | Definition only; separate retirement candidate. |
| `--space-5`   | 24px  | Definition only; separate retirement candidate. |
| `--space-6`   | 32px  | Definition only; separate retirement candidate. |
| `--space-7`   | 48px  | Definition only; separate retirement candidate. |
| `--space-8`   | 64px  | Definition only; separate retirement candidate. |
| `--radius-sm` | 4px   | Definition only; separate retirement candidate. |
| `--radius-md` | 8px   | Definition only; separate retirement candidate. |
| `--radius-lg` | 12px  | Definition only; separate retirement candidate. |
| `--radius-xl` | 20px  | Definition only; separate retirement candidate. |

- Exact tracked search returns twelve declarations, all in the theme stylesheet, and no external readers.
  The comments claiming component SCSS consumers are not supported by current tracked source.
  Leave these comments and declarations unchanged until a separately approved implementation slice.
- Broader tracked search finds Tailwind `space-y-*` and `whitespace-*` classes, not custom-property reads.
  Focused non-template source search for name fragments, `getPropertyValue`, `setProperty`, and `@property`
  returns only the same twelve declarations. No indirect reader found in this bounded source inspection.
- This is evidence about tracked repository source, not a guarantee about external integrations or all
  possible runtime-generated names. A fresh exact/fragment search must precede actual deletion.
- On 2026-11-27, a read-only browser check of the supplied home confirms `BBF Rating` in `main h1`,
  `dark-theme`, 1571 x 1272 geometry and all twelve computed root values matching the table.
  This proves the stylesheet is mounted; inherited token availability is not proof of a component reader.
  No navigation, theme/viewport changes, clicks or mutations were performed.
- Retain all twelve properties in this slice. Record DR-029f as a separate bounded retirement candidate,
  gated by completed review of this inventory and fresh consumer checks. Preserve win/loss/rank-gradient tokens,
  qualification typography, PrimeNG/Tailwind infrastructure and every other global rule.

### Validation and next action

```powershell
git --no-pager grep -n -P -e '(?<![\w-])(?:--space-[1-8]|--radius-(?:sm|md|lg|xl))(?![\w-])' -- . ':!docs' ':!.github' ':!.claude' ':!package-lock.json'
git --no-pager grep -n -E -e 'space-' -e 'radius-' -e 'getPropertyValue' -e 'setProperty' -e '@property' -- apps libs tools ':!*.md' ':!*.html' ':!*.spec.ts'
npx nx show project app --json
```

- All three commands pass, exit 0; exact and focused source searches each return twelve definitions.
  An additional broader tracked search including templates/tests finds unrelated Tailwind classes,
  but no candidate token reader. Resolved app targets are lint/build/serve/extract-i18n, with no test target.
- Scoped `npx prettier --write` on this brief and backlog: pass.
  `git diff --check`: pass. Node validation: LF/frontmatter, 458 local link targets, authoritative
  initial Review/candidate rows and no tracked application changes pass. Only this brief and backlog changed.
  Git warns about future CRLF conversion; actual edited files contain LF, confirmed independently.
- Nx lint/build/tests not run: documentation-only investigation, no application edits or new behavior tests.
  No light/dark or width matrix, accessibility, workflow, locale or SSR/hydration regression pass claimed.
  Inherited DR-033/034/076 findings and historical workspace lint failures are not revalidated or resolved.
- On 2026-11-27 the user selected `Approve inventory and commit` and `Nothing else`.
  Resulting status: Done by explicit approval of the inventory with its disclosed limits.
  Application and regression checks remain unperformed; approval does not claim they passed.
  DR-029 parent remains open. Commit only this inventory/handoff; do not push.
- Exceptions: none. No dependencies, operational mutations or service changes.
- Exact next invocation: scope DR-029f separately using fresh consumer checks; do not delete referenced
  properties or start final regression in this invocation.
