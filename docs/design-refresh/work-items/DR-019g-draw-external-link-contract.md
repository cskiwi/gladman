---
title: 'DR-019g: Tournament draw external-link query contract'
description: 'Read-only investigation of missing draw external actions on the mounted tournament detail page.'
---

## Identity

- ID: DR-019g.
- Outcome: establish why tournament detail omits draw external links and define the smallest safe repair.
- Status: authoritative in the [backlog](../backlog.md).
- Dependencies: DR-019d is complete; this separate discovery does not reopen DR-019.
- Design rules: [design refresh](../README.md).

## Scope

- Mounted consumer: `/tournament/8658b541-702a-408e-8114-2858a9428069`,
  titled Internationaal Tornooi Lokerse BC 2023 in the integrated browser on 2026-11-02.
- Project: `frontend-pages-tournament`.
- Trace the detail query, draw model/schema, template gates and existing tests.
- Compare read-only local GraphQL responses and mounted links using existing safe tournament data.
- Exclude implementation, backend/translation changes, operational mutations, external-site navigation,
  styling, shared components, permissions, sync, draw destinations and other tournament pages.
- No shared presentation extraction: this is a query-contract investigation, not duplicated UI.

## Investigation checklist

- [x] Confirm the mounted consumer and bounded scope.
- [x] Trace the query/schema/template contract.
- [x] Reproduce the difference using read-only local data.
- [x] Identify existing coverage and the missing regression check.
- [x] Persist evidence and the exact repair/next action.

## Acceptance and verification

- [x] Establish whether the backend exposes draw `visualCode` without a schema change.
- [x] Distinguish missing query selection from absent source data or permission gating.
- [x] Record mounted behavior and preserve the existing external URL, accessible name and link safety contract.
- [x] Define a repair that preserves missing-code behavior, local draw routes, grouping and existing presentation.
- [x] Disclose unperformed checks; do not infer visual/workflow validation from source inspection.
- [x] User review of the investigation and proposed next action.

## Evidence and handoff

- Initial worktree: clean (`git --no-pager status --short`).
- Playwright MCP navigation could not start because its profile is already in use.
  The integrated browser successfully mounted the supplied route; no browser processes were stopped.
- Application files, style/utility counts and dependencies remain unchanged. No styling exceptions.

### Contract and root cause

- The [lazy route](../../../libs/frontend/pages/tournament/src/lib.routes.ts#L13) mounts the existing detail component.
- The [detail service](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.service.ts#L55)
  requests only `id`, `name`, `type`, `size` inside `drawTournaments`. Its encompassing `TournamentEvent` TypeScript
  model does not guarantee that optional model fields are selected by GraphQL.
- The [template](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.html#L285)
  renders a draw external action only when both `tournament.visualCode` and `draw.visualCode` are truthy.
  There is no authentication gate on this action. Preserve that missing-code condition.
- The [model](../../../libs/models/models/src/models/event/tournament/tournament-draw.model.ts#L41)
  already declares nullable `visualCode`; the [schema](../../../schema.graphql#L2922) exposes it as `String`.
  The [sub-event resolver](../../../libs/backend/graphql/src/resolvers/event/tournament/tournament-sub-event.resolver.ts#L36)
  returns draws without a permission guard on that relation. The live anonymous comparison confirms availability.
- Existing prior art: the [draw-detail query](../../../libs/frontend/pages/tournament/src/pages/draw-detail/page-draw-detail.service.ts#L49)
  already selects `visualCode` on the same nested relation. No schema, migration or sync change is required.
- Root cause is the missing frontend selection, not absent codes in this dataset, failed backend access,
  missing localization or incorrect conditional presentation. Other routes may warm Apollo's normalized cache;
  that must not substitute for a complete detail query.

### Read-only reproduction, 2026-11-02

- Integrated browser DOM inspection at the supplied mounted route returns:
  - 95 internal draw anchors across the three rendered tab panels.
  - Zero external draw anchors (`www.toernooi.nl` and `/draw/`).
  - 30 external sub-event anchors and one external tournament anchor.
  - Tabs Heren, Dames, Gemengd. Counts include inactive panels, not 95 simultaneously visible links.
  - Tournament anchor keeps `target="_blank"` and `rel="noopener noreferrer"`.
- Two anonymous GraphQL `query` operations to `http://localhost:5000/graphql` pass:
  1. Execute the exact `gql` document extracted from the current detail service with the supplied tournament ID
     and `{ order: { minLevel: 'ASC' } }`.
  2. Execute that same document with only `drawTournaments.visualCode` added through a GraphQL AST visitor.
- Both return 30 sub-events and 95 draws with 95 unique draw IDs. Original draw keys are exactly
  `id,name,type,size`; no draw has a `visualCode` response property.
- Expanded query returns all 95 draw codes plus the existing tournament code. Removing `visualCode` keys
  during JSON serialization yields identical original/expanded responses, including names, ordering and counts.
- First existing template URL would be
  `https://www.toernooi.nl/tournament/E079D079-5F4F-435D-ADD2-7260425D8DF0/draw/1`.
  No external site was opened; this verifies URL composition, not third-party availability.
- Comparison ran as a PowerShell here-string piped to `node -`, using installed `graphql` `parse`, `visit`,
  `print` and `Kind`, and native `fetch` with a 30-second timeout. Exit code 0; no GraphQL errors.
  Only the two query operations were sent. No mutations, database/admin operations or application edits.

### Coverage gap and bounded repair

- The [component test setup](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.spec.ts#L65)
  mocks `Apollo.query` with a full fixture, regardless of the executed selection set.
- The [draw rendering test](../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.spec.ts#L386)
  supplies `visualCode: 'draw-code'` itself, then asserts the external URL, accessible name, native classes and safe
  link attributes. It checks presentation with supplied data, not whether the real query requests that data.
- Existing code-free draw fixtures exercise absence of the action, but the missing tournament-code gate should also
  be asserted with a coded draw. Do not treat source review as a new passing test run.
- Proposed DR-042 scope:
  1. Add only `visualCode` to the detail query's `drawTournaments` selection.
  2. Inspect the executed query AST in a regression test and assert that exact nested path. A document-wide string
     check is insufficient because tournament and sub-event `visualCode` selections already exist.
  3. Preserve/assert both missing-code gates, internal slug/ID routes, existing URLs, safe attributes and accessible
     localized fallback names. Existing presentation tests remain useful; a full query/model refactor is unnecessary.
  4. Run existing focused Nx lint/test/build targets. Check all mounted type tabs and newly reachable external
     anchors at narrow/wide widths in light/dark, keyboard/focus, fit, contrast and SSR/client agreement.
- No shared smart/presentational component extraction is warranted by this one-field query change.
  Keep the completed competition-aligned native Card/Button presentation unchanged.

### Validation limits and handoff

- Passed: mounted real consumer; original/expanded anonymous query comparison; source/schema/prior-art/coverage trace.
- Not run: application Nx lint/build/tests (documentation-only investigation), new-action visual/keyboard/contrast
  checks, authenticated workflows, screen-reader, locale switching, SSR/hydration comparison and external-site navigation.
  Earlier DR-019d evidence is historical and does not verify actions still absent from the mounted page.
- Passed: repository Prettier write/check for both changed documents, exit code 0:

  ```powershell
  npx prettier --write "docs\design-refresh\backlog.md" `
    "docs\design-refresh\work-items\DR-019g-draw-external-link-contract.md"
  npx prettier --check "docs\design-refresh\backlog.md" `
    "docs\design-refresh\work-items\DR-019g-draw-external-link-contract.md"
  ```

- Passed: `git --no-pager diff --check`, exit code 0; only the backlog and this new brief are changed.
  Git reports an existing checkout conversion warning for the backlog; formatting writes LF.
- Passed: `node -` local-link verification resolves all 11 Markdown evidence targets in this brief; zero missing files.
- On 2026-11-02 the user selected "Approve DR-019g and commit the investigation".
  This approves this documentation-only investigation and its next action with the disclosed unperformed checks.
  DR-019g is Done; approval does not mean the user-visible bug is fixed or application checks passed.
- Next action: scope DR-042 from the work-item template using the bounded repair above.
  Do not start DR-042 in this invocation or reopen the approved DR-019 parent.
- The investigation and backlog handoff are approved for commit. No application implementation or push is authorized.
