---
description: 'Resume one design refresh task, verify the outcome, and persist progress for the next fresh chat.'
argument-hint: 'Optional work-item ID, for example DR-002'
agent: 'agent'
---

Continue Gladman's incremental design refresh. Complete one small, reviewable slice and leave an accurate,
repository-backed handoff so the same prompt works again in a fresh chat.

## Load the source of truth

Read these files before selecting work or editing application code:

- [Design rules and rollout](../../docs/design-refresh/README.md).
- [Backlog, statuses, and current focus](../../docs/design-refresh/backlog.md).
- The relevant work-item brief linked from the backlog, including its recorded evidence and remaining checklist.
- [Work-item template](../../docs/design-refresh/work-item-template.md), if a brief or child task needs creating.

Follow repository instructions and load the applicable skills. Do not rely on earlier chat history, session-only notes,
or assumptions that previous work was completed. Inspect the worktree and relevant source to reconcile documented
progress with the actual implementation. Preserve unrelated or uncommitted changes; do not overwrite work you did not
make.

## Select exactly one slice

1. If this request names a work-item ID or area, use it within its recorded scope and dependencies.
2. Otherwise, resume the current focus or unfinished active slice before starting anything new. For an item in `Review`,
   finish its outstanding verification or obtain the required review. For an item in `Blocked`, check the recorded
   blocker; do not silently skip it.
3. If there is no active slice, select the next `Ready` item whose prerequisites are complete. If none is ready, scope
   the next appropriate backlog item before promoting it.
4. Read its brief. If it is missing, create one from the template and link it from the backlog. Split a multi-route,
   multi-tab, or otherwise broad area into child tasks and choose only one child.
5. State the selected ID, intended outcome, exclusions, and acceptance checks briefly. Mark it `In progress` and update
   the backlog's current focus before implementation.

Only refresh components with confirmed current application consumers. Record the mounted route or real consumer
before selection; an export, test, preview, or unused call chain is not sufficient. Skip unused components without
adding a consumer solely for redesign verification, and record the reason in the backlog.

Do not restart completed work, migrate the whole application, or begin another implementation slice in this invocation.
If everything is complete, report that accurately instead of inventing more work. If a dependency, conflicting change,
or required decision prevents safe progress, record the blocker and request input.

## Execute the selected task

Do the work, not merely another plan, unless the selected item explicitly calls for investigation or documentation.
DR-001 is a baseline investigation, not permission to rewrite the global theme.

Apply the full design rules, especially:

- Use native styled PrimeNG components and documented options before custom UI or wrappers.
- Keep templates readable with only necessary Tailwind layout utilities.
- Use PrimeNG semantic color utilities and native severities. Do not introduce numbered primary/surface utilities or
  manually paired light/dark palette colors.
- Do not add SCSS or equivalent inline/global styling workarounds unless an unavoidable exception is recorded.
- Reuse meaningful existing patterns; extract components only for genuine shared structure or behavior.
- Preserve routes, data, permissions, localization, responsive behavior, accessibility, and SSR/hydration.
- Do not change shared components or global theme behavior as a hidden side effect of a page-only task.

Capture relevant before/after evidence using safe test data. Keep changes scoped and record unrelated discoveries as
backlog items rather than expanding the task. Do not add dependencies, run operational/admin mutations for visual
testing, or create commits before user approval. The user's approval of a DR item authorizes committing that item's
implementation, tests, and repository handoff without a separate commit request. Include workflow changes only when
requested; preserve unrelated changes and never stage them in the DR commit. Do not push unless requested.

## Verify before checking off work

- Run the smallest relevant existing Nx lint/build/test tasks, following the repository's task guidance.
- Verify the actual acceptance criteria, including light/dark, narrow/wide, interaction states, and accessibility.
- Check affected consumers when a shared component or global setting changes.
- Record exact commands, results, browser checks, and evidence in the brief.
- Mark a checklist entry complete only when its outcome has actually been verified.
- Distinguish passed, failed, and not-run checks. Do not claim visual or workflow validation from a build alone.

If required visual/user review remains outstanding, use `Review`, not `Done`. If a blocker prevents completion, use
`Blocked` and describe the precise remaining action. Use `Done` only when all applicable acceptance checks and required
review have passed, or the user explicitly approves completion with disclosed verification limits. In the latter
case, preserve unchecked criteria and record exactly which limits were accepted; never turn acceptance into a
claim that an unperformed check passed.

## Persist progress before handing back control

Update the repository documents in the same change as the work:

1. Update the brief's checkboxes, evidence, changed scope, validation results, exceptions, and remaining actions.
2. Update the authoritative status row in the backlog; do not keep a conflicting status in the brief.
3. Keep a parent open until all required children are complete. Preserve completed rows, IDs, and history.
4. Update current focus with the exact next action, including a blocker or pending review when applicable. When the
   slice is done, identify the next candidate without starting it.
5. Add newly discovered work and dependencies to the backlog, and record any reusable-pattern decisions.
6. Correct outdated planning statements when implementation changes their factual status.

Do not leave the only useful handoff in chat or session storage. When pausing incomplete work, save enough detail that a
fresh chat can resume without repeating the investigation.

After user approval, record it in the brief, reconcile the backlog, run the focused checks needed for any subsequent
changes, and create a Conventional Commit containing only the approved slice and its handoff. Report the commit ID.

Finish with a concise summary of:

- The selected ID and what was completed.
- What was checked off and its resulting backlog status.
- Validation results and anything not verified.
- Remaining blockers, review, or exceptions.
- The exact next item/action for the next invocation.
