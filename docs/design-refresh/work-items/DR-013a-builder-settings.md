---
title: 'DR-013a: Team-builder settings dialog'
description: 'Native responsive settings fields with accessible labels and existing localized copy.'
---

## Identity and scope

- ID: DR-013a. Status: see the [backlog](../backlog.md).
- Parent: [DR-013](DR-013-club-team-builder.md). Dependencies: DR-012 (Done).
- Design rules: [design refresh](../README.md).
- Consumer: `/clubs/:clubId` → permission-gated team-builder tab → Settings button →
  `SettingsDialogComponent`. Confirmed on `/clubs/smash-for-fun`, 2026-11-13.
- Nx project: `frontend-pages-club`.
- Sources: [settings template][template], [settings component][component] and the Settings dialog
  configuration in [builder tab][builder].
- Preserve all six config values, numeric limits, percentage suffixes, spinner behavior, save/cancel output
  and permission gating. No backend or translation-file changes.
- Exclude builder toolbar/pools, team cards, player chips, other dialogs, validation policy and save notifications.

## Baseline and approach

- Existing dialog is a fixed 500px wide single-column form with six native InputNumbers.
  Labels are not associated with their inputs; four help texts have no description relationship.
  Browser snapshot confirms all six spinbuttons have no accessible name.
- Existing field labels/help/buttons already have nl/fr/en keys; the dialog title is hard-coded English.
- Use native `fluid`, `inputId` and `ariaDescribedBy`, a responsive DynamicDialog breakpoint,
  and existing translations. Keep one column and allow action wrapping; no custom styles or new components.
- Baseline: 44 whitespace-separated class tokens in the settings template; no stylesheet.
- Before screenshot: `.playwright-mcp/DR-013a-before-wide.png` (local, not committed).

## Implementation checklist

- [x] Confirm mounted consumer, prerequisites and bounded scope.
- [x] Associate labels/help and use native fluid controls.
- [x] Localize the dialog title and configure responsive sizing.
- [x] Preserve settings bindings, numeric options and excluded areas; save/cancel implementation unchanged.
- [x] Record validation, evidence and remaining actions.

## Acceptance and verification

- [x] All six fields have accessible localized labels; all four help texts describe their fields.
- [x] Native input values, bounds and suffixes match baseline; cancel discards an edited value.
- [ ] Saving settings in the mounted builder is verified (not performed to avoid draft/config mutations).
- [x] Light/dark, wide/390px dialog layouts fit and remain readable.
- [x] Keyboard focus, input adjustment, tab order, cancel and dialog focus containment are checked.
- [x] Label, input and help-text contrast exceeds 4.5:1 in both themes.
- [ ] All enabled button/icon contrast passes (inherited DR-033/DR-058 failures below).
- [x] No new palette utilities, SCSS or equivalent appearance overrides.
- [x] Focused Nx lint/build checks pass.
- [x] Accessibility regression passes with the existing zoneless setup override.
- [ ] Default club test setup runs successfully (DR-059).
- [x] User approves completion with the disclosed limits (2026-11-13; not a claim that unchecked checks pass).

## Evidence and handoff

- Implemented 2026-11-13. Native `fluid`, `inputId`, `ariaDescribedBy` and Divider; title uses the existing
  `all.club.teamBuilder.settings.title` key. DynamicDialog remains 500px wide, with its documented breakpoint
  option setting 95vw below 640px. Actions wrap. No new strings or translation-file changes.
- Settings template class tokens: 44 → 35 (whitespace-separated tokens in `class` attributes).
  Removed repeated label/help spacing utilities; retained necessary field/action layout and semantic muted text.
- No shared component/global theme changes, dependencies or operational mutations. Scoped commit approved below.
- No new presentational abstraction: this dialog is already a focused component with config in/out;
  native PrimeNG fields avoid duplicated styling.
- Exceptions: none.

### Validation commands

- PASS: repository Prettier `--write` on every changed source, test and Markdown file.
- PASS: `npx nx run-many -t lint build -p frontend-pages-club` after final source/test changes
  (12 tasks succeed, 10 dependency tasks cached).
- FAIL before test execution:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=settings-dialog.component.spec.ts`.
  Existing club setup imports Zone, but `zone.js` is absent. No package install or infrastructure edits.
- PASS, one regression test:
  `npx nx run frontend-pages-club:test --runInBand --testPathPatterns=settings-dialog.component.spec.ts
--jestConfig=<temporary-config> --output-style=static`.
  The temporary CommonJS config spread the existing club Jest config, set its `rootDir` explicitly to the club
  project, and replaced only `setupFilesAfterEnv` with the existing
  `libs/frontend/pages/tournament/src/test-setup.ts` (zoneless).
  It lived in session files as `dr013a-jest.config.cjs` and was removed after the check.
  The [regression test][test] renders the real template and verifies six label associations and four descriptions.
- PASS: `git diff --check`.
- NOT RUN: full application build, full test suite, dedicated SSR/hydration, fr/en browser and live settings/team save.

### Browser evidence

Real mounted dialog, Dutch, no mocked data and no operational mutations:

| Theme | Viewport  | Dialog width | Outcome                             |
| ----- | --------- | ------------ | ----------------------------------- |
| Dark  | 1440×1000 | 500px        | Fits; all controls contained        |
| Dark  | 390×844   | 370.5px      | Fits; no horizontal dialog overflow |
| Light | 1440×1000 | 500px        | Fits; all controls contained        |
| Light | 390×844   | 370.5px      | Fits; no horizontal dialog overflow |

- Before screenshots: `.playwright-mcp/DR-013a-before-wide.png` and `DR-013a-before-narrow.png`.
- Final screenshots: `.playwright-mcp/DR-013a-after-{dark,light}-{wide,narrow}.png`.
  Local, not committed. All four final screenshots inspected.
- All six spinbuttons have translated accessible names; four descriptions resolve to visible help.
  Values remain `40%, 25%, 6, 3, 3, 8`; bounds remain `0–100, 0–100, 1–20, 0–20, 0–20, 1–30`.
- Label activation focuses its field. ArrowUp changes presence `40% → 41%`; ArrowDown restores it.
  Tab order: six fields, Cancel, Save, then wraps inside the dialog. Native focus styling visible.
  Changing presence to 41%, canceling, waiting for the dialog to close and reopening restores 40%.
- Text contrast from computed colors converted to sRGB: labels/inputs 16:1 dark; muted help 6.65:1 dark,
  4.87:1 light; light labels 19.87:1 and inputs 13.61:1. Cancel 9.51:1 dark / 7.74:1 light.
- Inherited failures: light Save text 3.65:1 (DR-033); enabled spinner icons 2.26:1 dark / 2.67:1 light
  against the field surface (DR-058). These are shared native/preset issues, not new page styles.
  They remain unresolved; this is not a full accessibility pass.
- No application console errors during final checks. Two Canvas readback-performance warnings came from
  the contrast measurement script, not application code.
- Restored the original dark document class; persisted theme preference was never changed.

### Approval and remaining action

On 2026-11-13 the user selected **"Approve and commit DR-013a with disclosed limits"** after the summary and review
request. This accepts the recorded DR-033/DR-058 contrast failures, default club test setup failure (DR-059),
temporary-zoneless-only regression pass, and unchecked live-save, fr/en, SSR, full-app-build and full-suite checks.
Unchecked criteria remain unchecked; no full accessibility or workflow pass is claimed.
The approval authorizes the scoped implementation, regression test and repository handoff commit.
Only approval/handoff documentation changed after validation; application checks need not be rerun for those edits.

DR-013a is Done by explicit approval; DR-013 stays open. Next candidate: scope DR-013b toolbar/layout/pools.
Do not start it in this invocation.

[template]: ../../../libs/frontend/pages/club/src/components/team-builder/settings-dialog.component.html
[component]: ../../../libs/frontend/pages/club/src/components/team-builder/settings-dialog.component.ts
[builder]: ../../../libs/frontend/pages/club/src/pages/detail/tabs/club-team-builder-tab.component.ts
[test]: ../../../libs/frontend/pages/club/src/components/team-builder/settings-dialog.component.spec.ts
