---
title: 'Design refresh'
description: 'PrimeNG-first design principles and an incremental frontend redesign plan.'
---

## Purpose

Modernize Gladman without a big-bang rewrite. The result should feel like a considered badminton application, not a
generic dashboard: clear information hierarchy, useful data density, predictable actions, and restrained decoration.

This folder is the persistent source of truth for the redesign. It contains a plan, not an implemented redesign. The
initial inventory is based on source inspection on 2026-10-16; browser baselines are still to be captured. No
application code, behavior, theme, or dependencies are changed by this planning work.

## Start here

- [Backlog](backlog.md): authoritative statuses, current focus, frontend project coverage, and deferred work.
- [DR-001: Design baseline](work-items/DR-001-design-baseline.md): the first small, ready-to-start task.
- [DR-002: Home page pilot](work-items/DR-002-home-pilot.md): the proposed first implementation slice.
- [Work-item template](work-item-template.md): copy when an area is ready to be broken into an executable task.

## Continue in a fresh chat

Open this repository in VS Code, start a fresh Copilot chat, and run:

```text
/continue-design-refresh
```

The [continuation prompt](../../.github/prompts/continue-design-refresh.prompt.md) reads this plan and the backlog,
resumes unfinished work or chooses the next ready item, and works on only one small slice. It updates checkboxes,
evidence, status, and the next action before handing back control. Unverified work stays open, and required visual
review is not treated as complete just because checks pass.

To choose a particular item, include its ID:

```text
/continue-design-refresh DR-002
```

If slash-command discovery is unavailable, use **Chat: Run Prompt...** and select `continue-design-refresh`. For a
plain-chat fallback, paste:

```text
Read .github/prompts/continue-design-refresh.prompt.md and execute its instructions.
Use the repository's design-refresh plan and backlog as the source of truth.
Resume one unfinished slice or take the next ready item, verify it, and save progress
and the exact next action in the repository documents before stopping.
```

## Design rules

### PrimeNG first

- Use native PrimeNG components in styled mode and their documented inputs, templates, and design tokens.
- Prefer component options such as severity, size, variant, fluid layout, and table features over custom styling.
- Use native semantic HTML for headings, text, lists, and simple structure. Not every section needs a component.
- Prefer a PrimeNG table, message, tag, button, menu, or drawer over a hand-built visual equivalent.
- Keep cards and panels purposeful. Do not wrap every section or statistic in another card.
- Do not switch to headless or unstyled mode just to recreate a custom component appearance.
- Verify APIs against the installed PrimeNG version before implementing; do not copy outdated examples blindly.

### Minimal Tailwind

- Use only the layout utilities that are actually needed for spacing, alignment, sizing, and responsive structure.
- Let PrimeNG own component appearance instead of rebuilding it with long class strings.
- Remove duplicated styling and unnecessary wrapper elements in the area being migrated.
- Avoid arbitrary values, complex descendant selectors, and important overrides unless there is a documented need.
- Do not hide utility-heavy markup in a new component solely to make the parent template look shorter.
- Do not move class lists into inline styles, TypeScript strings, or global `@apply` rules to satisfy this goal.
- Record before/after utility usage for each slice; assess readability rather than chase an arbitrary class quota.

### Semantic, theme-aware colors only

Use the semantic utilities from the [PrimeNG Tailwind extensions][extensions], not manually selected shades. These
utilities resolve to PrimeNG theme tokens; verify their actual light and dark results in this application's preset.

| Intent                              | Preferred approach                                                     |
| ----------------------------------- | ---------------------------------------------------------------------- |
| Normal text                         | `text-color`                                                           |
| Secondary text                      | `text-muted-color`                                                     |
| Emphasized text                     | `text-color-emphasis`, `text-muted-color-emphasis`                     |
| Primary emphasis                    | `text-primary`, `bg-primary`, `text-primary-contrast`                  |
| Borders                             | `border-surface`                                                       |
| Hover emphasis                      | `bg-emphasis`                                                          |
| Selection                           | `bg-highlight`, `bg-highlight-emphasis`                                |
| Content and form surfaces           | Let the native PrimeNG component supply its background                 |
| Success, warning, error, and status | Native component severity, with meaningful text or an accessible label |

- Do not author `primary-[50-950]` or `surface-[0-950]` utility classes unless absolutely unavoidable. This includes
  prefixed forms such as `text-primary-500`, `bg-surface-900`, and their state variants.
- Do not use Tailwind palette colors such as `text-green-600`, `bg-white`, or `bg-black/60`.
- Do not author separate light/dark color-class pairs when a semantic utility or native severity covers the intent.
- Do not add hard-coded hex, RGB, OKLCH, custom brand colors, or decorative gradients in page styling.
- Palette definitions inside the PrimeNG theme preset are theme infrastructure, not forbidden template utilities. Do not
  remove them merely because they contain numbered scales.
- Charts, brackets, and unusual visualization needs must first use existing theme-aware capabilities. If an exception is
  truly required, document it rather than silently introducing another palette.

### No SCSS by default

- Do not create new `.scss` files or add component stylesheet references unless there is no suitable alternative.
- Prefer native PrimeNG styling, semantic utilities, and a small amount of layout markup.
- Keep genuinely shared theme decisions in the PrimeNG preset, not page-specific overrides.
- Do not replace SCSS with equivalent inline CSS, component `styles`, or a new global stylesheet as a workaround.
- Remove an existing stylesheet or rule only after its consumers and behavior have been checked. Unmigrated pages must
  keep working throughout the rollout.

### Reuse where it earns its place

- Search the [existing shared components][components] before introducing a new abstraction.
- Prefer direct PrimeNG usage for UI primitives; avoid one-to-one wrappers around every PrimeNG component.
- Extract a reusable component when multiple real consumers share meaningful structure, behavior, or domain semantics.
- Preserve accessibility, localization, content projection, and native component capabilities when extracting.
- Treat existing hero, heading, statistic, and match components as candidates for simplification, not a mandatory
  design.
- Change shared components in their own bounded slices and check all affected consumers. Do not restyle a widely used
  component as an unnoticed side effect of a page-only change.

### A quieter, more deliberate visual direction

- Lead with the page's actual task, a clear title, relevant context, and a recognizable primary action.
- Favor readable tables, lists, and well-grouped forms over decorative dashboard tiles.
- Reduce oversized heroes, gradient crests, glows, glass effects, excessive pills, and ornamental icon rows.
- Use consistent typography and spacing. Do not add all-caps eyebrow labels or oversized metrics without a purpose.
- Preserve domain-specific information and useful visualizations; restrained does not mean removing functionality.
- Use motion only when it communicates a state change or helps an interaction.

## Rollout

| Stage | Work                              | Exit condition                                                          |
| ----- | --------------------------------- | ----------------------------------------------------------------------- |
| 1     | DR-001: establish the baseline    | Theme behavior and the pilot's acceptance checks are recorded           |
| 2     | DR-002: migrate the home page     | One reviewed example works in both themes and at narrow widths          |
| 3     | DR-003 to DR-007: shared patterns | Migrate one shared concern at a time, checking its consumers            |
| 4     | DR-008 to DR-028: feature slices  | Pick one route, tab, or workflow from the backlog                       |
| 5     | DR-029: retire obsolete styling   | Remove only proven-unused global styling and complete regression checks |

Stages describe the recommended direction, not a requirement to rewrite every shared component before touching a
feature. A page can use PrimeNG directly while legacy shared components remain. Record genuine dependencies in its work
item and avoid turning a small page task into a cross-application rewrite.

The home page is the proposed pilot because it exercises a heading, metadata, tabular data, loading, errors, and an
authenticated ranking section without starting with the complexity of tournament operations. Its visual direction must
be reviewed before being propagated to other areas.

## Working one slice at a time

1. Choose a backlog item and reduce it to one reviewable route, tab, or shared concern.
2. Create a brief from the template when needed. Record exact scope, exclusions, dependencies, and acceptance criteria.
3. Capture the current behavior and visual baseline using safe test data.
4. Mark the item `In progress`. Keep one implementation slice active at a time.
5. Implement, validate, and review that slice before moving on.
6. Update the backlog, attach evidence, and record exceptions and follow-up work before marking it `Done`.

Use `Backlog`, `Ready`, `In progress`, `Blocked`, `Review`, and `Done` as the only statuses. Keep status in the backlog
rather than maintaining conflicting copies in individual briefs.

- `Ready`: scope, dependencies, and acceptance checks are clear.
- `Blocked`: record the specific blocker and the work needed to unblock it.
- `Review`: implementation and checks are complete, but visual or functional review is pending.
- `Done`: acceptance checks and review have passed, with evidence linked.

When an area is too large, retain its original ID as a parent and add child IDs such as `DR-021a`. Track children
independently and finish the parent only when all required children are done. Keep completed rows and briefs as history.
Do not delete them or renumber existing items. Record unrelated discoveries in the backlog, not speculative comments in
production code.

## Definition of done for implementation slices

- [ ] The task's exact route, tab, or shared-component scope is complete; excluded areas remain unchanged.
- [ ] Native PrimeNG capabilities are used wherever appropriate, without unnecessary wrappers.
- [ ] Templates are readable, with unnecessary utility classes and markup removed.
- [ ] No new non-semantic colors, numbered palette utilities, or SCSS are introduced without a recorded exception.
- [ ] Removed styling is genuinely unused; changes to shared code are checked across its consumers.
- [ ] Light/dark, mobile/desktop, keyboard/focus, labels, and contrast checks pass.
- [ ] Relevant loading, empty, error, success, and disabled states remain explicit and usable.
- [ ] Data, permissions, routes, forms, sorting/filtering, selection, and notifications preserve their behavior.
- [ ] Existing localization, theme preference persistence, and SSR/hydration behavior are preserved where relevant.
- [ ] Relevant Nx lint/build/test checks pass; browser evidence and any unavailable checks are recorded honestly.
- [ ] The visual result has been reviewed, and the backlog and reusable-pattern decisions are updated.

Documentation-only planning does not require application builds or tests. For implementation, inspect actual Nx targets
and use the smallest existing task covering the change. Do not add new tooling or dependencies just for this redesign.

## Exceptions

An exception is a last resort, not a second styling system. Record it in the work item before marking the task done:

- The exact file/component and unmet requirement.
- Why native PrimeNG, semantic utilities, and existing shared capabilities cannot meet it.
- The smallest necessary styling or color change and any alternative considered.
- Light/dark and accessibility evidence, affected consumers, and conditions for later removal.

No styling exceptions have been approved by this plan.

## Existing constraints to preserve

- [Dependencies][packages] already declare Angular 22, PrimeNG 22, Tailwind 4, and `tailwindcss-primeui`. This is not a
  framework or dependency-upgrade project.
- [The active preset][preset] extends Aura and inverts its dark surface palette. Component-specific dark overrides
  compensate for that inversion; do not reset it during a page task.
- [PrimeNG configuration][app-config] uses `.dark-theme`. [ThemeService][theme-service] manages the document class and a
  persisted preference.
- [Global styles][global-styles] load the PrimeUI plugin and apply gradients and broad component overrides. [Additional
  theme styles][theme-styles] define custom visual tokens and typography. Their eventual retirement needs consumer
  checks, not a wholesale deletion at the start.
- Root routes and feature routes are inventoried in the backlog. Existing unmounted/disabled screens are recorded, but
  redesign work must not enable or remove them implicitly.
- The current [end-to-end example][e2e-example] is only a title smoke test, not full workflow regression coverage. Add
  focused checks when implementing the relevant slices.

[extensions]: https://primeng.dev/tailwind#extensions
[components]: ../../libs/frontend/components
[packages]: ../../package.json
[preset]: ../../apps/app/config/theme.preset.ts
[app-config]: ../../apps/app/config/app.config.ts
[theme-service]: ../../libs/frontend/modules/theme/src/theme.service.ts
[global-styles]: ../../apps/app/src/styles.scss
[theme-styles]: ../../apps/app/src/styles/theme.scss
[e2e-example]: ../../apps/app-e2e/src/example.spec.ts
