---
title: 'DR-016: Competition draw reconciliation'
description: 'Qualification consumer audit and parent acceptance handoff after the approved poule slices.'
---

## Identity and scope

- ID: DR-016. Authoritative status: [backlog](../backlog.md).
- Design rules: [design refresh](../README.md).
- This invocation completes the recorded next action: investigate a mounted qualification consumer and reconcile
  parent acceptance. It is an evidence/documentation slice, not another application redesign.
- Dependencies: DR-016a through DR-016g are Done with recorded user approval and verification limits.
- Exclusions: application code, qualification styling/calculations, shared components, translations, backend,
  theme, new routes, synthetic consumers, and operational mutations.

## Investigation checklist

- [x] Reconcile a clean worktree with the existing completed child briefs and backlog.
- [x] Trace the current draw route and qualification consumer.
- [x] Inspect real draw types on the supplied competition without changing data.
- [x] Record qualification deferral without claiming that the component is globally unused.
- [x] Reconcile remaining parent acceptance and persist the exact next action.
- [x] Obtain explicit parent approval with the qualification deferral and verification limits disclosed.

## Repository and browser evidence

- On 2026-10-30, `git --no-pager status --short` returned no changes before work began.
- [Feature routes](../../../libs/frontend/pages/competition/src/lib.routes.ts) mount
  `PageDrawsComponent` at `/competition/:competitionId/sub-events/:subEventId/draws/:drawId`.
- The [draw page](../../../libs/frontend/pages/competition/src/pages/draws/page-draws.component.html) renders
  `app-qualification-draw` only for `draw.type === 'QUALIFICATION'`. The component is imported by the actual routed
  page; it is not simply an unused export. This establishes conditional wiring, not a confirmed live qualification
  instance.
- A frontend/application search for `QualificationDrawComponent`, `app-qualification-draw`, and
  `qualification-draw` found only that routed consumer, its import, and the existing branch test.
- The integrated browser loaded
  `http://localhost:3000/competition/pbo-competitie-2026-2027` successfully.
  The mounted detail component reported 12 sub-events and 26 `competitionDraws`, all with `type: 'POULE'`.
  All 26 rendered draw links also showed `POULE`; zero links showed qualification.
  Read-only inspection used the existing Angular debug component and DOM.
- This is evidence for the supplied competition only. Other seasons/competitions and database-wide availability
  were not surveyed. No claim that qualification is globally unused or unreachable is made.
- The separate Playwright MCP browser could not launch because its profile was already in use.
  The integrated browser provided the evidence instead; no existing process was stopped or restarted.
- No fixture, route, application consumer, or record was added just to enable a redesign.
  No screenshot matrix is necessary for this documentation-only audit, and no new visual pass is claimed.

## Parent acceptance reconciliation

- [x] Poule standings: [DR-016a](DR-016a-poule-standings.md).
- [x] Hero identity/actions: [DR-016b](DR-016b-draw-hero.md).
- [x] Hero statistics: [DR-016c](DR-016c-draw-statistics.md).
- [x] Played/upcoming section chrome: [DR-016d](DR-016d-encounter-section-chrome.md).
- [x] Loading/error/overall-empty presentation: [DR-016e](DR-016e-draw-states.md).
- [x] Standings section chrome: [DR-016f](DR-016f-standings-section-chrome.md).
- [x] League standings terminology: [DR-016g](DR-016g-standings-terminology.md).
- [x] Shared encounter presentation is already covered by approved DR-006h/DR-006i;
      no duplicate redesign is required here.
- [ ] Qualification presentation: deferred until a real mounted qualification instance is confirmed.
      Existing markup, heuristics, inputs, and localization limitations remain unchanged.
- [x] Parent review/approval of the completed mounted scope and qualification deferral.
- [ ] Actual screen-reader output, operational empty/missing records, exhaustive hydration, and role/sync workflows.
- [ ] Mounted French/English switching for DR-016g; API/component evidence is not mounted locale evidence.
- [ ] Shared narrow topbar overflow and dark expansion-button focus contrast remain separate follow-ups,
      not hidden changes to this parent. DR-030 tracks the topbar issue; the shared-control discovery remains in the backlog.

Previous child approvals remain valid with their disclosed limits. They do not prove unchecked parent criteria.
On 2026-10-30 the user selected "Approve parent completion and commit with the recorded verification limits".
The parent is Done by that explicit approval, not merely because its implemented children are Done.
Qualification remains deferred and all unchecked criteria remain unverified.

## Validation and handoff

- Changed scope: this parent brief and the backlog only. No UI, utility, style, or reusable-component changes.
  A smart/presentational split is not warranted for this audit.
- Passed: `npm exec -- prettier --write --end-of-line lf "docs\design-refresh\backlog.md"
"docs\design-refresh\work-items\DR-016-competition-draws.md"` (one command).
- Passed: `git diff --check`. Git emits an existing checkout line-ending warning for the backlog;
  formatting explicitly writes LF.
- Passed: a read-only PowerShell scan of inline relative Markdown links in both changed files checked 76 existing
  targets using `Test-Path -LiteralPath`; none were missing.
- Nx lint/build/tests: not run; documentation-only changes do not require application validation.
  Earlier child results are historical evidence, not checks rerun in this invocation.
- No styling exception or dependency. User approval authorizes committing only this parent brief and backlog;
  no push is authorized.
- Exact next action: confirm and scope one mounted DR-017 assembly slice in a fresh invocation. Do not start it here.
  If a real qualification URL is later supplied, inspect it before scoping a separate small DR-016 child.
  Do not reinterpret this parent approval as a qualification implementation or verification pass.
