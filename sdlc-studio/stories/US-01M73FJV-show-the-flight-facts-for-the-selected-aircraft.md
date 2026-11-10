# US-01M73FJV: Show the flight facts for the selected aircraft

> **Status:** Draft
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73F6G
> **Points:** 5
> **Persona:** Samir Rahman

## User Story

**As an** aviation enthusiast in the house (Samir Rahman)
**I want** the airline, flight number, origin, destination, type, altitude, speed, distance, and direction for the aircraft I select
**So that** the screen identifies it instead of only plotting a dot

## Acceptance Criteria

- **AC1:** Given a selected aircraft whose enrichment is complete, when the detail is shown, then each of those fields is visible.
  - **Verify:** manual Select a fully enriched fixture aircraft and read every required field.
- **AC2:** Given a selected aircraft whose route lookup missed, when the detail is shown, then origin and destination say unknown and no city is invented.
  - **Verify:** manual Select a fixture with no route and confirm origin and destination are unknown.
- **AC3:** Given a home and an aircraft position, when distance and direction are shown, then they are computed from those two points rather than copied from an unrelated field.
  - **Verify:** manual Compare the shown distance and bearing with a hand calculation from the fixture coordinates.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
