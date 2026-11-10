# US-01M73FRX: Tell an empty sky from a stale feed

> **Status:** Draft
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73F6G
> **Points:** 3
> **Persona:** Ruth Okonkwo

## User Story

**As a** person living with the screen (Ruth Okonkwo)
**I want** an empty sky to look empty and a dead feed to look dead
**So that** I do not trust a picture that has stopped

## Acceptance Criteria

- **AC1:** Given a successful poll with no aircraft inside the radius, when the live view renders, then it shows an explicit empty state and no sample aircraft.
  - **Verify:** manual Feed an empty in-radius result and confirm the empty copy, not a blank panel.
- **AC2:** Given a poll older than the stale threshold, when the live view renders, then the aircraft stay visible and are labelled with their age as stale.
  - **Verify:** manual Set the fixture clock past the stale threshold and confirm the stale label and the old aircraft.
- **AC3:** Given a poll younger than the stale threshold, when the live view renders, then it is not labelled stale.
  - **Verify:** manual Set the fixture clock inside the threshold and confirm the stale label is absent.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
