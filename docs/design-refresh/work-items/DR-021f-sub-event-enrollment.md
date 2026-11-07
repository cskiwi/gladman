---
title: 'DR-021f: Retire obsolete enrollment pages'
description: 'User-directed retirement of sub-event enrollment and the incomplete my-enrollments page.'
---

## Identity and approved scope

- Parent: [DR-021](DR-021-tournament-enrollment.md). Status: [backlog](../backlog.md).
- Prerequisite: DR-021e Done. Design rules: [plan](../README.md).
- Historical investigation confirmed on 2026-11-07 that the existing
  `/tournament/8658b541-702a-408e-8114-2858a9428069/sub-events/755f536f-7d16-46ba-93c8-49d07123ce6c/enroll`
  route mounts `PageEnrollmentComponent`, loads public MS 1-2 and reports phase DRAFT without a read error.
- The former my-enrollments template linked this route for available events when enrollment was open.
- The user then corrected the scope: general `/tournament/:tournamentId/enroll` is the only enrollment page;
  other enrollment pages can be removed as incomplete/not working. A my-enrollments overview will be made later.
- This replaces the unapproved DR-021f1 styling implementation; none of that implementation or its new tests remain.
- Remove both obsolete components, templates, stylesheets, page-only services, barrel exports and route entries.
- Remove the tournament-detail my-enrollments action; preserve its general enrollment-open action and other gates.
- Exclude general enrollment and children/services, admin enrollments, backend APIs/models, translations,
  stored registrations, shared theme and any new overview/redirect.
- Project: `frontend-pages-tournament`. [Routes][routes], [page exports][exports] and [detail template][detail].

## Withdrawn presentation work

| ID                                        | Scope                                | Dependency |
| ----------------------------------------- | ------------------------------------ | ---------- |
| [DR-021f1](DR-021f1-enrollment-chrome.md) | Withdrawn chrome investigation       | None       |
| DR-021f2                                  | Withdrawn player/status/info styling | None       |
| DR-021f3                                  | Withdrawn enrollment-list styling    | None       |
| DR-021f4                                  | Withdrawn guest-dialog styling       | None       |

Their Done backlog rows mean withdrawn, not migrated. DR-021g's incomplete my-enrollments route is retired
in this same bounded removal. DR-021i separately retains the future overview; no replacement is started here.

## Acceptance and verification

- [x] Remove both pages and all frontend imports/exports/consumer links.
- [x] Keep general enrollment and admin/backend APIs/data unchanged.
- [x] Preserve general enrollment-open and permission gates on tournament detail.
- [x] Direct Router regressions reject old URLs; focused Nx lint/test/build pass.
- [x] General enrollment mounts 30 events and filters/grid/cart after detail navigation.
- [x] Detail no longer presents the retired overview action.
- [x] Final whitespace/documentation consistency checks pass.
- [x] Record final review/completion approval and any accepted verification limits.

## Evidence and handoff

- Both obsolete folders contained only their page, template, stylesheet, barrel and exclusively used frontend service.
  Searches found no external consumers of the removed classes/services. Backend `EnrollmentService` is retained.
- Removed ten pre-existing files; discarded the newly written DR-021f1 spec with its removed implementation.
- Route-contract/detail regressions assert the retired routes/action are absent and general enrollment survives.
  Two direct Router navigation tests reject obsolete URLs with `Cannot match any routes`.
- Final command:

```shell
npx nx run-many --projects=frontend-pages-tournament --targets=lint,test,build --output-style=static
```

- Pass: lint, production library build/ten prerequisites and **12 suites / 145 tests**.
  Initial retirement run passed 143 tests; the final run includes the two direct Router rejection cases.
- Four pointer cases, light/dark 390/1440px, use only a local enrollment-open phase:
  detail Enroll navigates to the same general route, mounting **30 events** and its three existing children.
  Historical DRAFT detail has no retired button/link and retains four live links.
  Monitored checks have zero page errors or GraphQL mutation attempts.
- Dev-server HTTP requests to old URLs return **200 SPA shells without either retired component**.
  This is not a claim of HTTP 404; route matching is tested separately. No redirect is requested or added.
- Existing user-owned port 3000 is available for final checks; no backend/translation restart is required.
- General public SSR returns HTTP 200 with the existing Dutch heading and no retired component selectors.
  Browser fixture state/interception/listeners are cleaned up; the user's existing server is left running.
- All changed surviving files are formatted. `git --no-pager diff --check` passes.
  Scope review confirms no general-enrollment, backend, translations or theme files changed.
- Post-approval `npx nx run-many --target=lint --output-style=static` passes all **34 projects**,
  with existing warnings and zero errors.
- No styling exception, dependencies, backend/translation changes, operational mutations or registration-data changes.
- Exhaustive screen-reader/contrast/hydration and live authenticated registration workflows are not revalidated by removal.
  General enrollment is unchanged; its previous disclosed verification limits remain in DR-021a-e.
- On 2026-11-07 the user selected **"Approve retirement and commit with disclosed limits"** and **"Nothing else"**.
  Approval accepts the removal, dev-server SPA-shell behavior and unchanged general-enrollment verification limits.
  Unperformed screen-reader/contrast/hydration and live authenticated workflow checks remain unperformed,
  not retroactively passed. Only retirement, regression tests and repository handoff are approved; no push.
- Commit authorization applies only to this retirement/tests/handoff, without push.
  Exact next action in a fresh invocation: scope DR-021h ranking polish from its brief and real general-page consumer.
  DR-021i overview stays Backlog until separately requested/scoped.

[routes]: ../../../libs/frontend/pages/tournament/src/lib.routes.ts
[exports]: ../../../libs/frontend/pages/tournament/src/pages/index.ts
[detail]: ../../../libs/frontend/pages/tournament/src/pages/detail/page-detail.component.html
