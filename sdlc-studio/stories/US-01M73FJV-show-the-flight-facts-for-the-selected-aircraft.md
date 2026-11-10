# US-01M73FJV: Show the flight facts for the selected aircraft

> **Status:** Ready
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73F6G
> **Points:** 5
> **Persona:** Samir Rahman
> **Affects:** sdlc-studio/prd.md, tests/fixtures/flight-facts.json
> **Depends on:** US-01M73FSQ

## User Story

**As an** aviation enthusiast in the house (Samir Rahman)
**I want** the airline, flight number, origin, destination, type, altitude, speed, distance, and direction for the aircraft I select
**So that** the screen identifies it instead of only plotting a dot

## Acceptance Criteria

- **AC1:** Given a selected aircraft whose route lookup hit and whose position feed includes a type, when the detail is shown, then each required field is visible, with altitude in feet, speed in knots, and distance in statute miles.
  - **Verify:** manual Select a fully populated fixture aircraft and read every required field.
- **AC2:** Given a selected aircraft whose route lookup missed, when the detail is shown, then origin and destination say unknown and no city is invented.
  - **Verify:** manual Select a fixture with no route and confirm origin and destination are unknown.
- **AC3:** Given a home centre and an aircraft position, when distance and direction are shown, then they are computed from those two points.
  - **Verify:** manual Compare the shown distance and bearing with a hand calculation from the fixture coordinates.
- **AC4:** Given a position feed with no aircraft type, when the detail is shown, then type says unknown and Planebase is not called.
  - **Verify:** manual Confirm the type line is unknown and the Planebase transport count stays zero.

## Notes

Units are feet, knots, and statute miles, and the default radius is 15 miles ([D0014](../decisions.md)). This story still sequences after [US-01M73FSQ](US-01M73FSQ-show-route-and-airline-facts-without-storing-a.md). It is not part of the walking skeleton.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | Type comes from the position feed. Stays Draft on the unit question. |
