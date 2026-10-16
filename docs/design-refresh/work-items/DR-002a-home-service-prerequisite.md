---
title: 'DR-002a: Home service verification prerequisite'
description: 'Two reproduced service defects blocking the homepage design pilot acceptance checks.'
---

## Identity

- ID: DR-002a; owner unassigned; authoritative status: [backlog](../backlog.md).
- Parent: [DR-002](DR-002-home-pilot.md); service-scope approval received from the user on 2026-10-16.
- Remaining acceptance prerequisite: DR-007a's native error-message contrast work, recorded in the backlog.
- Outcome: the selected ID reaches GraphQL, and request failures reach the existing native feedback branch.
- Rules: [design refresh plan](../README.md). This is a prerequisite, not another visual implementation slice.

## Scope

- Route `/`; Nx project `frontend-pages-home`.
- [HomeService][service] query variables and safe resource-value access only, with regression coverage in the existing
  [component spec][spec]. No shared consumer or service API redesign is needed.
- Preserve table calculations, null/zero handling, selected-system signal, abort signal, translations, authentication,
  loading/no-selection/empty branches, and server/client rendering.
- Exclude backend resolvers, ranking formulas, shared styling, theme, shell, dependencies, and logged-in ranking design.
- The user explicitly approved these two HomeService fixes on 2026-10-16; all other DR-002 exclusions still apply.

## Baseline and proposed approach

The 2026-10-16 fixture continuation reproduced both defects through the actual HomeService, without production edits:

1. The operation declares `$rankingSystemId`, but its variables object contains only `id`. The selected ID is not bound
   to the query's declared input. Existing mocks returned the same fixture regardless of variables, concealing this.
2. `rankingSystemResource.value()` throws in the error state. The template evaluates `rankingSystem()` before its error
   branch, so a synthetic HTTP 503 raises `Resource is currently in an error state` instead of rendering feedback.

The approved implementation changes only the outgoing variable key and guards `value()` with `hasValue()`.
The data-fetching abstraction and all native PrimeNG feedback/table markup remain unchanged. Behavior tests now pass;
the new feedback-state check found a separate light-mode contrast failure inherited from native message styling.

## Implementation checklist

- [x] Reproduce both defects in isolated fixtures and retain exact expected behavior below.
- [x] Record the scope boundary, parent blocker, and affected route without editing production code.
- [x] Obtain explicit approval to change the excluded HomeService slice (2026-10-16).
- [x] Replace both named TODOs with failing regressions; reproduce three failures before the correction.
- [x] Correct the declared-variable binding without changing server queries or ranking calculations.
- [x] Guard error-state value reads and retain the existing native feedback components.
- [x] Verify selected-system replacement, initial/subsequent failure, and recovery; update the parent handoff.
- [x] Record the separate native message contrast discovery under DR-007a without changing shared styling.

## Historical reproduction

These probes were run before the fix; the final spec now contains real regression tests rather than TODOs.

Run from the workspace root:

```bash
NX_DAEMON=false npm exec nx run frontend-pages-home:test -- --runInBand --output-style=static
```

The selected-variable probe used the spec's `query` mock:

```typescript
expect(query).toHaveBeenCalledWith(
  expect.objectContaining({ variables: { rankingSystemId: 'test-system' } }),
);
```

Observed before any service change: expected `rankingSystemId`, received `id`; five existing tests passed and this
probe failed. Extend the regression with a second ID and a distinct fixture keyed by the declared variable, verifying
both the outgoing variables and the changed displayed name/rows. Do not let an unconditional mock hide the binding.

The failure probe used `HttpErrorResponse` from `@angular/common/http` and `throwError` from `rxjs`:

```typescript
query.mockReturnValueOnce(throwError(() => new HttpErrorResponse({
  status: 503,
  statusText: 'Fixture ranking service unavailable',
})));
systemId.set('failed-system');
fixture.detectChanges();
await fixture.whenStable();
fixture.detectChanges();
const element = fixture.nativeElement as HTMLElement;

expect(element.querySelector('.p-message-error')?.textContent)
  .toContain('Fixture ranking service unavailable');
expect(element.querySelector('.p-message-info')).toBeNull();
expect(element.querySelector('[role="status"]')).toBeNull();
```

Observed before any service change: Angular raises the resource error during rendering, with the fixture status text
as its cause; nine other tests passed. Also check a failed initial request and successful subsequent selection after
the fix; do not merely suppress the thrown error in the test environment.

## Acceptance and verification

- [x] Both regressions fail before and pass after the bounded corrections, with no pending service TODOs.
- [x] Two selected IDs produce distinct matching names/rows, including the correct outgoing declared variable.
- [x] Initial/subsequent request failures render the native message without uncaught resource errors and recover.
- [x] Loading, no selection, empty table, null/zero values, authentication conditions, and recovery still pass.
- [x] Resolved Nx homepage test/lint/build tasks pass; exact commands and cache/fresh results are recorded below.
- [x] Safe browser fixtures verify static failure/switching states, narrow table access, and loading labels in all four
  theme/viewport cases. No real account or backend mutation was used; hidden-tab motion is not verified.
- [ ] Native error feedback meets normal-text contrast in both themes: light fails at 4.41:1; DR-007a is required.
- [x] No production styling changes, new colors, SCSS, dependencies, or shared/global side effects are introduced.
- [x] Parent status and remaining browser/review requirements are reconciled after verification.
- [ ] Required affected-state review passes after the contrast prerequisite is resolved.

## Evidence and handoff

- Approved production implementation: complete, with only the two HomeService expressions changed. No template/style
  or shared component was edited. Service correctness is verified; feedback contrast is the remaining blocker.
- **Passed, fresh:**
  `NX_DAEMON=false npm exec nx run frontend-pages-home:test -- --runInBand --output-style=static`:
  12 tests, no TODOs/skips, versus three failures/nine passes immediately before the service correction.
- **Passed:** `NX_DAEMON=false npm exec nx run frontend-pages-home:lint -- --output-style=static` and
  `NX_DAEMON=false npm exec nx build frontend-pages-home -- --configuration=development --output-style=static`.
  Homepage compilation was fresh; nine of ten build tasks used cache. No full application build was rerun.
- Final spec editor diagnostics: clear. Existing service readonly/statusText advisories remain outside the two changes.
- Browser safe-fixture matrix: all four 390px/1280px light/dark static cases pass switching, failure, recovery, loading,
  empty, and no-selection checks. Error feedback has `role="alert"`/`aria-live="polite"`; loading has a translated label.
  Native table widths are 672px/325px narrow and 1201px/1201px wide, without page overflow.
- **Failed:** settled native error-text contrast is 4.41:1 light and 4.63:1 dark, at both widths, for 14px/500 text.
  Text/background sRGB: light `[220,38,38]` / `[253,242,242]`; dark `[239,68,68]` / `[41,19,25]`.
  The existing application preset has no message-specific override. Scope inherited native tokens under DR-007a,
  not a page-only style or another service patch.
- Browser method/limitations and safe screenshot review are recorded in the parent brief. The hidden integrated tab
  required finite-animation completion for static checks; theme motion, immediate leave-node removal, actual
  screen-reader output, and real-server multi-system workflows are not claimed.
- Fixture cleanup: original Apollo query/selection restored, temporary globals removed, original dark preference
  restored through the native control, and the real homepage successfully reloaded at 1280px.
- Reusable-pattern decision: use the existing HomeService/resource and existing native feedback, not a new wrapper.
- Styling exceptions: none. Next action: scope DR-007a's native error-message contrast correction and consumer checks;
  return for final feedback-state review afterward. Do not repeat the implemented service fixes or approval request.

[service]: ../../../libs/frontend/pages/home/src/pages/home/page-home.service.ts
[spec]: ../../../libs/frontend/pages/home/src/pages/home/page-home.component.spec.ts