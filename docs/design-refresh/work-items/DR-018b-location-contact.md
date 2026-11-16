---
title: 'DR-018b: Location/contact information'
description: 'Shared selector prerequisite followed by bounded location/contact presentation and feedback.'
---

## Identity and scope

- ID: DR-018b. Status is authoritative in the [backlog](../backlog.md).
- Parent: [DR-018](DR-018-competition-editing.md). Rules: [design refresh](../README.md).
- Confirmed mounted consumer: `/competition/pbo-competitie-2026-2027/edit`, information tab, 2026-11-14.
- Preserve country/state filtering, contact-email validation, permissions, dirty tracking and mutation payloads.
- Exclude completed basic section, dates/settings, page chrome, global theme and operational mutations.

## Children and dependencies

- [DR-018b1](DR-018b1-country-state-selectors.md): shared country/state label and form integration prerequisite.
- [DR-018b2](DR-018b2-location-contact-presentation.md): location/contact semantic sections, native email validation
  and information-tab feedback. Selected on 2026-11-16; dependency: completed DR-018b1.
- Existing form component owns orchestration; selectors are existing reusable CVAs.
  No new smart/presentational abstraction is needed.

## Acceptance and handoff

- [x] Confirm mounted consumer and split shared work from page-only presentation.
- [x] Complete b1 and b2 with recorded verification and user review.
- [ ] Verify the integrated information tab without live saves.
- [ ] Obtain parent approval with any remaining limits disclosed.

The country/state wrappers had inner ngModel registration warnings
and missing label forwarding in the baseline; b1 fixes both and is Done with explicit approval
(`commit`, 2026-11-16), accepting its recorded verification limits without claiming unperformed checks passed.
Source inspection finds only the competition editor as a current consumer.
DR-018b2 implements the presentation and tab feedback; four focused tests and Nx lint/build pass.
Its brief records partial browser verification and remaining screenshot/accessibility/localization/persistence limits.
The user approved b2 with `Approve DR-018b2 and commit with disclosed limits` on 2026-11-16; its status is Done.
Both children's unchecked verification limits remain recorded, not claimed as passed.
Next: integrated parent acceptance review without live saves, then obtain separate parent approval with disclosed limits.
Keep this parent open until both children and integrated review are complete.
