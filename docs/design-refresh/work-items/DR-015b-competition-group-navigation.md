---
title: 'DR-015b: Competition navigation and local-style retirement'
description: 'Native group navigation and a formatted, SCSS-free competition detail template.'
---

## Identity

- ID: DR-015b; parent DR-015. Status is authoritative in the [backlog](../backlog.md).
- Dependencies: completed DR-004 shared headings and DR-015a competition Cards.
- Design rules: [design refresh](../README.md).
- Mounted consumer: `/competition/pbo-competitie-2026-2027`, inspected on 2026-10-23.
- Project: `frontend-pages-competition`; consuming application: `app`.

## Scope

- User review on 2026-10-23 explicitly expands this slice: format the whole competition detail HTML and
  delete its local SCSS, using Tailwind and PrimeNG classes/components rather than replacement custom CSS.
- Reuse existing shared hero avatar/title components, semantic text and native status Tags;
  preserve metadata, totals, links, permissions, and sync behavior.
- Replace click-only group anchors with native PrimeNG buttons.
- Keep translated group names, event counts, order, target IDs, and smooth scrolling.
- Give the section and groups semantic headings, with event names nested below groups.
- Reuse existing translations for the section heading; remove its obsolete custom typography rule.
- Exclude changes to data, draw destinations, sync behavior, services, translations,
  shared/global styles, other routes, and loading/error logic.
- Sources: [template][template] and [component][component]. The former local stylesheet is deleted.

## Baseline and proposed approach

- Live data has three groups (M: 5, F: 2, MX: 5), 12 events, and 26 internal draw links.
- The three anchors have no href and rely on click handlers; keyboard button activation is not native.
- Shortcuts use 13 custom appearance/layout classes plus inline `user-select: none`.
- The section duplicates an eyebrow and hard-coded English heading; group labels are spans, not headings.
- Use existing ButtonModule, secondary outlined `button pButton`, native wrapping navigation,
  semantic text, and h2/h3/h4 hierarchy. No shared abstraction or new dependency is necessary.
- A before screenshot of the mounted dark section was inspected through the integrated browser.

## Implementation checklist

- [x] Confirm mounted consumer, dependencies, and bounded scope.
- [x] Replace custom shortcuts with native named buttons and target associations.
- [x] Preserve scrolling, counts, ordering, cards, links, and localization.
- [x] Replace decorative section/group headings and remove only unused section typography.
- [x] Record focused tests, Nx checks, browser evidence, and unrelated discoveries.
- [x] Format the full detail template using the existing formatter.
- [x] Remove the local SCSS and all its references without adding replacement custom CSS.
- [x] Revalidate the expanded hero/metadata/Card styling scope.

## Acceptance and verification

- [x] Three native buttons expose translated names, counts, and existing group targets.
- [x] Enter and Space activate the correct group without route changes or data mutations.
- [x] Section/group/event headings form h2/h3/h4 hierarchy.
- [x] Groups, 12 event Cards, and 26 internal draw destinations are unchanged.
- [x] Light/dark at 390px/1280px wraps buttons without navigation overflow.
- [x] Keyboard focus, text contrast, and mounted screenshot review pass.
- [x] Shared hero avatar/title, totals, metadata, native status Tags, and Card content fit all four cases.
- [x] Native loading/error presentation retains its content without authored inline styles.
- [x] Empty group data omits the section and navigation.
- [x] Focused component tests and relevant Nx lint/build checks pass.
- [x] Alternate locale and SSR/hydration checks are recorded without overstating coverage.
- [ ] Mounted alternate-locale, exhaustive hydration, and screen-reader checks remain unverified.
- [x] User approved completion and the scoped commit on 2026-10-23, accepting the disclosed limits.

## Evidence and handoff

- Initial navigation implementation uses secondary outlined native buttons with `pButtonLabel`, `aria-controls`,
  and existing translated names plus counts. The section and navigation share a translated heading.
  Group headings are h3 and existing event headings become h4; event-card content is otherwise unchanged.
- Shortcut appearance moves from 13 custom classes plus inline styling to native Button options and
  one semantic `text-color` label class. The section loses a duplicate eyebrow; group headers lose
  their decorative rule and hard-coded English count suffix. The obsolete `.section-title` SCSS is removed.
  No new SCSS, inline CSS, colors, dependencies, shared abstractions, or theme overrides were introduced.
- Native secondary labels initially measured 4.46:1 on the light canvas. Reusing DR-006d's semantic-label
  pattern raises settled label/heading contrast to at least 18.20:1 light and 16.64:1 dark.
  Measurements use rendered colors converted through Canvas to sRGB; transient theme-animation samples
  were discarded. The global secondary-button preset remains unchanged.
- Native buttons fit at 390px and 1280px in both themes. All four cases retain 3 shortcuts, 12 Cards,
  and 26 internal draw links. Native focus has a visible 1px solid outline. Desktop Enter/Space
  and mobile Space activate the expected group without changing the URL. Scrolling to lower groups
  correctly clamps to the document's maximum scroll position when the viewport cannot align them at top.
- Final light-mobile and dark-desktop shortcut screenshots were inspected through the integrated browser.
  No data screenshots or temporary fixtures were committed. Original dark theme and 1094x1272 viewport restored.
- The initial five routed Angular tests cover names/counts/targets, actual click-to-scroll binding,
  heading hierarchy/draw destinations, locale label updates, and omission with empty group data.
  Apollo is stubbed; sync children are replaced by empty test stubs so no operational actions run.
- The library's previously unused Zone.js setup prevented execution because Zone.js is absent.
  The setup now uses the existing homepage/shared-library zoneless pattern, preserving strict unknown
  element/property checks. Initial module-mock tests were replaced by routed tests using the real detail service
  and an Apollo stub; the final suite passes.
- Final validation commands:

  ```powershell
  $env:NX_DAEMON='false'
  npm exec -- nx run-many -t test,lint -p frontend-pages-competition --output-style=static
  npm exec -- nx run app:build --output-style=static
  git diff --check
  ```

- Final results after the requested revision: 8/8 tests pass, lint passes with 41 pre-existing warnings,
  app build and all 29 prerequisite
  build tasks pass, and whitespace check passes. Existing Nx executor and TypeScript metadata advisories remain.
- Same-origin HTML fetch of the supplied route returns HTTP 200, three group buttons, the section heading,
  and a semantic group heading. The integrated browser's request-context helper was unavailable;
  browser `fetch` verified the actual server response instead. This is SSR markup evidence, not exhaustive
  hydration or screen-reader verification.
- Mounted locale was Dutch. Alternate-locale switching passes in the focused test only.
  Loading/error service behavior, permissions, sync operations, other routes, and backend data are unchanged.
  Loading/error presentation is covered by a focused test, not a mounted pending/error-data pass.
- No styling exceptions. On 2026-10-23 the user corrected the earlier review-button selection:
  "we are done. mark it so and commit". This explicitly approves completion and the scoped commit
  with the disclosed limits accepted. Unchecked mounted alternate-locale, exhaustive hydration,
  and screen-reader checks remain unverified. No push is authorized.
- Keep parent DR-015 open. Remaining draw-link presentation is a separate candidate.
- Exact next action: scope a separate draw-link child in a fresh invocation; do not implement it here.

## User-requested SCSS retirement

- The user requested formatting of the full template and removal of its SCSS on 2026-10-23.
  This explicitly expands the original navigation-only scope; the initial navigation evidence above
  remains historical, not a claim that the full page was already migrated.
- Deleted the entire local stylesheet and its `styleUrl`. The component host uses Tailwind `block`.
  No component `styles`, new stylesheet, global rules, or inline-style replacement was introduced.
- Reused existing shared `HeroAvatarComponent` and `HeroTitleComponent` instead of reproducing the
  clipped gradient crest and oversized title. Totals use ordinary Tailwind typography and semantic text.
  Event headings retain their names with Tailwind typography; `t-eyebrow`/`t-mono` are replaced with
  semantic labels/`font-mono`. The unused `g-draw-row` marker is removed.
- Native Tags preserve the raw competition type and translated official/non-official status.
  Native Message replaces the old inline error-color surface, preserving the error text and condition.
  ProgressBar uses `h-1` in place of its inline height; loading/error logic is unchanged.
- Prettier formatted the entire detail template:

  ```powershell
  npm exec -- prettier --write "libs\frontend\pages\competition\src\pages\detail\page-detail.component.html"
  npm exec -- prettier --check "libs\frontend\pages\competition\src\pages\detail\page-detail.component.html"
  ```

- Three additional tests cover shared hero/metadata/totals/dates/external link/sync-child presence,
  non-official native Tag presentation, and native loading/error markup. The loading/error test
  substitutes presentation signals and explicitly marks the OnPush view for checking; it does not
  claim to validate request failure handling.
- Repeated mounted checks at 390px/1280px in light/dark: document, hero, navigation, and all 12 Cards
  have no overflow; 26 internal draw links, title, totals (12/26), initials, and official status remain.
  Final light-mobile hero/Card and dark-desktop hero screenshots were inspected.
- Newly styled avatar/title, totals and metadata labels, status Tags, event headings, and navigation labels
  all meet 4.5:1. Expanded-scope minimum is 4.57:1 light (official Tag) and 6.65:1 dark (muted labels).
  Measurements composite rendered ancestor backgrounds before comparing sRGB luminance.
- Keyboard Space/focus and HTTP-200 SSR were repeated after the revision. Server HTML contains
  the three shortcuts and shared avatar/title, without the old crest class. Earlier Enter checks
  remain applicable to the unchanged native shortcut markup.
- The detail template contains no authored inline style, old local-style classes, or stylesheet references.
  No shared components or global theme settings were changed. Browser viewport/theme restored.
- Pre-existing English hero labels and existing external-link titles remain; localization cleanup belongs
  to a separate parent DR-015 scope rather than introducing translation changes in this revision.

[template]: ../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.html
[component]: ../../../libs/frontend/pages/competition/src/pages/detail/page-detail.component.ts
