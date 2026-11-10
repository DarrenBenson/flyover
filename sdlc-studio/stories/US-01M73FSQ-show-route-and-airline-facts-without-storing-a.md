# US-01M73FSQ: Show route and airline facts without storing a route database

> **Status:** Ready
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73FH0
> **Points:** 5
> **Persona:** Samir Rahman
> **Affects:** sdlc-studio/trd.md, tests/fixtures/route-lookup.json
> **Depends on:** US-01M73F8A

## User Story

**As an** aviation enthusiast in the house (Samir Rahman)
**I want** the airline, flight number, origin, and destination when a live lookup has them
**So that** I can read the flight without Flyover keeping someone else's route database

## Acceptance Criteria

- **AC1:** Given route lookup enabled and a lookup hit, when the detail renders, then airline, flight number, origin, and destination come from that response.
  - **Verify:** manual Enrich a fixture callsign that hits and read the four fields.
- **AC2:** Given a lookup miss, when the detail renders, then those fields say unknown.
  - **Verify:** manual Enrich a fixture callsign that misses and confirm unknown.
- **AC3:** Given a lookup hit, when the server store is inspected afterwards, then no route row was written to disk, to a database, or to an export.
  - **Verify:** manual Confirm the fixture response is gone after the render and that no route file exists.
- **AC4:** Given a route is shown, when the credits render, then David Taylor, Jim Mason, and adsbdb are named.
  - **Verify:** manual Read the credit block on a hit.

Route lookup stays off until configuration names it ([D0010](../decisions.md)).

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | Live lookup only. No cache. |
