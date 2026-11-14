---
title: 'DR-015: Competition detail'
description: 'Integrated review of the mounted competition detail and its completed child slices.'
---

## Identity and scope

- ID: DR-015. Status is authoritative in the [backlog](../backlog.md).
- Design rules: [design refresh plan](../README.md).
- Project: `frontend-pages-competition`.
- Confirmed consumer: `/competition/pbo-competitie-2026-2027`, mounted by the
  [competition routes](../../../libs/frontend/pages/competition/src/lib.routes.ts).
- Review the assembled page only. Preserve the completed children, routes, data, sync permissions and localization.
  Exclude shared styling, draw detail, competition editing, operational mutations and the unmounted standalone
  sub-events page. Do not mount or redesign unused components.
- The [page](../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.ts) owns the existing
  data service and uses shared presentational hero components. No new extraction is warranted for a review-only slice.

## Required children

| ID                                                 | Scope                        |
| -------------------------------------------------- | ---------------------------- |
| [DR-015a](DR-015a-competition-event-cards.md)      | Sub-event Cards              |
| [DR-015b](DR-015b-competition-group-navigation.md) | Group navigation             |
| [DR-015c](DR-015c-competition-draw-links.md)       | Draw links and empty state   |
| [DR-015d](DR-015d-competition-metadata.md)         | Sub-event metadata           |
| [DR-015e](DR-015e-competition-hero-link.md)        | Hero external link           |
| [DR-015f](DR-015f-competition-statistics.md)       | Hero statistics              |
| [DR-015g](DR-015g-competition-draw-copy.md)        | Draw fallback and empty copy |

All children are Done with their own approvals and disclosed limits. Do not restart them.

## Acceptance and verification

- [x] Confirm the mounted consumer and reconcile completed child scopes.
- [x] Complete all required children.
- [ ] Inspect the integrated page in light/dark and narrow/wide; check relevant keyboard and interaction states.
- [ ] Verify routes, permissions, data, localization and applicable loading/error/empty states.
- [x] Record visual review and explicit parent approval, including accepted verification limits.

## Evidence and handoff

- Selection: clean worktree on 2026-11-14. Existing child briefs record their historical checks and approvals.
- Initial source review confirms native Cards, Tags, Buttons and Message, shared hero, grouped navigation and
  draw links. No application changes or new styling exception are planned.
- On 2026-11-14 the mounted Dutch page renders 12 event articles, 26 internal draw links and 26 external draw links.
  Hero counts show 12 events and 26 draws; group headings/counts are M: 5, F: 2, MX: 5. No raw `all.*` keys appear.
- In the shared browser, measured light/dark at requested widths 390px and 1440px (client 375px and 1425px):
  all Cards, articles and sections remain within client bounds. Wide document scroll width is 1425px. Narrow document
  scroll width is 424px, consistent with the previously recorded shared topbar overflow DR-066.
- Three group buttons have named labels and existing target IDs. Focusing the women's group button and pressing Enter
  scrolls the page without changing its route. One internal draw link receives focus-visible and has the expected
  competition/sub-event/draw URL. This is not exhaustive keyboard or navigation verification.
- Inspected a dark wide screenshot of the hero, groups and event Cards. Four-case visual screenshot review remains
  incomplete; the shared browser has previously reset viewport sizes between separate operations.
- The browser accessibility snapshot exposes 13 unnamed icon-only sync SplitButton dropdowns. Source and rendered DOM
  confirm the dropdown buttons lack explicit names; this shared-component follow-up is DR-067. No sync/cache action ran.
- Existing missing-visual-code sync-status exceptions remain a separate recorded discovery; DR-015e also records a
  light active-text contrast shortfall. No shared theme or behavior was changed here.
- Documentation only: no application lint/build/tests run. Child results are historical; no new application pass is
  claimed. No style, utility, locale or dependency changes, and no new exception.
- Documentation validation passed:
  `npx --no-install prettier --write --end-of-line lf docs\design-refresh\backlog.md
docs\design-refresh\work-items\DR-015-competition-detail.md` and `git --no-pager diff --check`.
  Git reported its existing LF-to-CRLF working-copy warning. Browser returned to the original homepage and dark theme.
- Not verified: complete screenshot matrix, screen-reader output, exhaustive focus/contrast, French/English browser,
  permissions and operational sync/edit flows, loading/error/empty states, external-site navigation or full
  SSR/hydration. Preserve each child's own accepted limits.
- Parent approval: `Approve DR-015 and commit with disclosed limits` (2026-11-14). This accepts the unchecked
  verification limits and DR-066/067 follow-ups without claiming they passed. Approval authorizes committing this
  parent handoff only; no push is authorized.
- Next action: investigate DR-018 competition editing, confirm a real mounted consumer and permission access, and scope
  one bounded form-section child before implementation. DR-018 remains Backlog; it was not started here.
