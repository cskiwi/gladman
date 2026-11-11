---
title: 'DR-025: Tournament Settings'
description: 'Aggregate record for the tournament admin settings tab: phase stepper, general settings, sub-events and confirmations.'
---

## Identity

- ID: DR-025. Status is authoritative in the [backlog](../backlog.md).
- Parent area: tournament administration. Project: `frontend-pages-tournament`.
- Rules: [design refresh](../README.md).
- This aggregate has no application changes of its own; it records the approved children.

## Children

- [DR-025a phase stepper and general settings](DR-025a-settings-phase-general.md): Done.
- [DR-025b sub-events table and dialog](DR-025b-settings-sub-events.md): Done.
- [DR-025c confirmations and shared error feedback](DR-025c-settings-confirmations.md): Done.

## Acceptance and disclosed limits

- [x] All required children are complete and recorded in the backlog.
- [ ] Light-theme browser check of the whole Settings tab (not performed in any child).
- [ ] Keyboard and contrast review of phase stepper, sub-events table and confirmations.
- [ ] Live save, phase change, sub-event create/edit/delete and error display (no mutations run for visual testing).
- [ ] Previous-phase confirmation dialog.

The user approved completion of the children with these verification limits. They stay unchecked here and are not
claims of success. Four pre-existing `draws-tab`/`draw-locales` spec failures are unrelated.
