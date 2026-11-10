# US-01M73FRX: Tell an empty sky from a stale feed

> **Status:** Ready
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73F6G
> **Points:** 3
> **Persona:** Ruth Okonkwo
> **Affects:** sdlc-studio/prd.md, tests/fixtures/empty-and-stale.json
> **Depends on:** US-01M73FBE

## User Story

**As a** person living with the screen (Ruth Okonkwo)
**I want** an empty sky to look empty and a dead feed to look dead
**So that** I do not trust a picture that has stopped

## Acceptance Criteria

- **AC1:** Given a successful poll with no aircraft inside the radius, when the live view renders, then it shows an explicit empty state and no sample aircraft.
  - **Verify:** manual Feed an empty in-radius result and confirm the empty copy, not a blank panel.
- **AC2:** Given a poll older than the configured stale threshold, when the live view renders, then the aircraft stay visible and are labelled with their age as stale.
  - **Verify:** manual Set the fixture clock past the injected threshold and confirm the stale label and the old aircraft.
- **AC3:** Given a poll younger than the configured stale threshold, when the live view renders, then it is not labelled stale.
  - **Verify:** manual Set the fixture clock inside the injected threshold and confirm the stale label is absent.

The product default for that threshold is still [PRD-OQ5](../prd.md#14-open-questions). This story injects the number. It does not choose the default.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | Threshold is injected. The default number stays open. |
