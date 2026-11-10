# US-01M73FSQ: Show route and airline facts without storing a route database

> **Status:** Draft
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73FH0
> **Points:** 5
> **Persona:** Samir Rahman

## User Story

**As an** aviation enthusiast in the house (Samir Rahman)
**I want** the airline, flight number, origin, and destination when a lookup has them
**So that** I can read the flight without Flyover becoming a copy of someone else's route database

## Acceptance Criteria

- **AC1:** Given a lookup hit, when the detail renders, then airline, flight number, origin, and destination come from that lookup.
  - **Verify:** manual Enrich a fixture callsign that hits and read the four fields.
- **AC2:** Given a lookup miss, when the detail renders, then those fields say unknown.
  - **Verify:** manual Enrich a fixture callsign that misses and confirm unknown.
- **AC3:** Given enrichment is enabled, when the server is inspected, then route rows are not offered as an export and are not written as a durable published database.
  - **Verify:** manual Confirm there is no route-export endpoint and no committed route dump.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
