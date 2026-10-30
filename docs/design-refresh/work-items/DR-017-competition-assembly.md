---
title: 'DR-017: Competition assembly'
description: 'Incremental refresh of the mounted competition assembly workflow.'
---

## Identity and scope

- ID: DR-017. Authoritative status: [backlog](../backlog.md).
- Design rules: [design refresh](../README.md).
- Confirmed consumer on 2026-10-30: `/competition/assembly` mounts
  [PageAssemblyComponent](../../../libs/frontend/pages/competition/src/pages/assembly/page-assembly.component.ts)
  through the [competition routes](../../../libs/frontend/pages/competition/src/lib.routes.ts).
  The local browser displays the Dutch heading, season/club/team/encounter controls, and Download action.
- Project: `frontend-pages-competition`.
- Preserve URL restoration, team/encounter selection, lineup validation, player drag/drop, generator statistics,
  permissions, translations, and save/download contracts.
- Split this broad workflow into independently reviewable children; do not migrate everything together.

## Children and remaining scope

- [DR-017a: Page heading and filter chrome](DR-017a-assembly-page-chrome.md): the first implementation child.
- [DR-017b: Reusable player row](DR-017b-assembly-player-row.md): the existing presentational component mounted in
  the regular player pool and reused by backup, doubles, singles, and substitute lists.
- Scope later children only after confirming their mounted state: player pools/slots, generation controls,
  validation presentation, and partner combinations.
- Existing populated lineup emits NG01354 warnings about child controls not registering with the parent FormGroup.
  Investigate that functional concern separately before claiming lineup form regression coverage.
- Existing PDF download is still a logged request with an integration TODO, not document generation.
  Preserve that contract during visual work; scope functional completion separately.
- FloatLabel focused-label contrast outside this page is deferred to DR-031, not a hidden parent/theme change.
- Shared components, global theme, backend, and translations are not implicitly part of this parent.

## Acceptance and handoff

- [x] Confirm a mounted application consumer rather than an export or preview.
- [x] Scope the first child.
- [x] Complete and review DR-017a with explicit user approval and recorded verification limits.
- [x] Complete and review DR-017b with explicit user approval and recorded verification limits.
- [ ] Confirm and scope remaining mounted assembly surfaces.
- [ ] Complete all required children and reconcile parent acceptance.

DR-017a is complete with explicit user approval on 2026-10-30 after a requested desktop time-range translation fix.
All 112 competition tests, repository-wide lint, app build, and the scoped browser checks pass.
Its unchecked verification limits remain recorded; approval does not establish that they passed.
The parent remains open until its required children are complete. No shared smart/presentational split is introduced
without evidence of meaningful repeated structure or behavior across real consumers.

DR-017b refreshes the existing input-only player row for its five pool/slot call sites, without a new abstraction.
It is complete with explicit user approval on 2026-10-30 after removing host styling; see its brief for exact
evidence and unchecked limits. Approval is not evidence that unperformed checks passed.
Player-pool/slot containers and the other remaining surfaces are not implicitly complete.
Exact next action in a fresh invocation: confirm and scope one mounted player-pool/slot container child.
Do not reopen DR-017b or begin another implementation slice here.
