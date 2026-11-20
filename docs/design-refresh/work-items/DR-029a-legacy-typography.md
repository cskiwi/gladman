---
title: 'DR-029a: Legacy typography consumer inventory'
description: 'Read-only inventory of five global typography helpers before any stylesheet retirement.'
---

## Scope and dependencies

- Parent: DR-029. Status: [backlog](../backlog.md). Design rules: [plan](../README.md).
- Audit only `.t-eyebrow`, `.t-stat-lg`, `.t-mono`, `.t-body`, `.t-muted` and their font-size tokens in
  the [theme stylesheet](../../../apps/app/src/styles/theme.scss).
- The `app` loads the stylesheet via [global styles](../../../apps/app/src/styles.scss).
  The player ranking breakdown route mounted in the shared browser before selection.
- No migration prerequisite for read-only inspection. Actual retirement requires a fresh consumer check.
  Leave the broader DR-029 parent open.
- Exclude application edits, component extraction, palette/spacing/radius tokens, chips, tags, global
  form/toolbar/card overrides and the cross-route regression matrix.

## Acceptance

- [x] Record all exact tracked frontend selector and font-size token references.
- [x] Separate confirmed mounted use from conditional wiring and unmatched candidates.
- [x] Record retention and follow-up decisions in the backlog without modifying application code.
- [x] Obtain review of the inventory and retention decisions.

## Evidence and decisions

| Helper and token            | Current evidence and decision                                                |
| --------------------------- | ---------------------------------------------------------------------------- |
| `.t-eyebrow`, `--t-eyebrow` | Mounted ranking breakdown and conditional qualification header. Retain both. |
| `.t-stat-lg`, `--t-stat-lg` | Definition and its own token read only. Candidate for separate retirement.   |
| `.t-mono`, `--t-mono`       | Definition, own token read, and negative test assertions only. Candidate.    |
| `.t-body`, `--t-body`       | Definition and its own token read only. Candidate for separate retirement.   |
| `.t-muted`                  | Definition only; uses a PrimeNG token, not a removable local size token.     |

- Confirmed on 2026-11-20 at `/players/glenn-latomme/ranking/single` on `localhost:3000`.
  The [player routes](../../../libs/frontend/pages/player/src/lib.routes.ts) mount the
  [ranking breakdown template][ranking]. In the shared browser, the page rendered `Punten per wedstrijd`
  and the current match table. A read-only check of `app-page-ranking-breakdown .t-eyebrow` found one
  `BBF Rating` node, with computed `text-transform: uppercase` and `font-size: 9.625px`.
  No controls were activated or data changed. DR-010 already tracks this page.
- The [competition draw template][draw] uses the helper for `Qualification` only in the qualification branch.
  The draw spec asserts that markup, but a real qualification instance was not confirmed. The
  [DR-016 investigation](DR-016-competition-draws.md) found only poule draws on the supplied competition.
  That is historical evidence for one competition, not proof the qualification branch cannot render.
- The exact search excludes longer names such as `--t-body-sm`. It covers literal references in tracked `apps`
  and `libs`, not every possible runtime-generated class. Recheck before any actual deletion.
- No components, utility classes or styles changed. No smart/presentational extraction or style exception is needed.

## Validation and handoff

The following searches passed and returned the references summarized above:

```powershell
git --no-pager grep -n -P -e '(?<![\w-])(?:t-eyebrow|t-stat-lg|t-mono|t-body|t-muted)(?![\w-])' -- apps libs
git --no-pager grep -n -P -e 'var\(--t-(?:eyebrow|stat-lg|mono|body)(?=[\s,)])' -- apps libs
```

Nx lint, build and tests were not run for this documentation-only slice. No light/dark or width matrix,
accessibility, workflow or hydration pass is claimed. The mounted check is a baseline, not a before/after comparison.

On 2026-11-20 the user selected `Approve DR-029a and commit` after the inventory and validation limits were
disclosed. Approval closes only the inventory; it does not verify qualification or approve any retirement.

Next action: scope the ranking breakdown header under DR-010 without
changing the table, period controls, simulation or global stylesheet. Keep `.t-eyebrow` while the qualification
reference remains. Scope retirement of the unmatched helpers and the remaining DR-029 work separately.

[ranking]: ../../../libs/frontend/pages/player/src/pages/ranking-breakdown/page-ranking-breakdown.component.html
[draw]: ../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.html
