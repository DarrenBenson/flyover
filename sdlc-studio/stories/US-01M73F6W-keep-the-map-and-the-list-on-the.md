# US-01M73F6W: Keep the map and the list on the same aircraft

> **Status:** Draft
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73FGP
> **Points:** 3
> **Persona:** Samir Rahman
> **Affects:** sdlc-studio/prd.md
> **Depends on:** US-01M73F1W

## User Story

**As an** aviation enthusiast in the house (Samir Rahman)
**I want** the aircraft I select on the map to be the one in the detail
**So that** the dot and the facts are the same flight

## Acceptance Criteria

- **AC1:** Given several aircraft, when one is selected on the map, then the list and the detail show that aircraft.
  - **Verify:** manual Select each fixture aircraft from the map and confirm the detail identifier matches.
- **AC2:** Given several aircraft, when one is selected in the list, then the map selection moves to it.
  - **Verify:** manual Select from the list and confirm the map mark changes.
- **AC3:** Given a selection, when the next poll no longer contains that aircraft, then the selection clears and the screen does not keep facts for an aircraft that has gone.
  - **Verify:** manual Drop the selected aircraft from the next fixture poll and confirm the detail clears.

## Still needs

- [US-01M73F1W](US-01M73F1W-show-home-the-radius-and-the-aircraft-on.md), which stays Draft until [TRD-OQ6](../trd.md#12-open-technical-questions) names a tile host. This story selects on that map, so it stays Draft with it.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | Stays Draft with the map story. |
