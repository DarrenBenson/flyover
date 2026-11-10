# US-01M73FFG: Set the home location and radius

> **Status:** Ready
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73F6G
> **Points:** 5
> **Persona:** Alex Brennan
> **Affects:** sdlc-studio/prd.md, sdlc-studio/tsd.md, .gitignore, tests/fixtures/postcode-lookup.json

## User Story

**As a** household installer (Alex Brennan)
**I want** to put one UK postcode and a radius in the server environment
**So that** the live view watches this one house, and the postcode never enters git

## Acceptance Criteria

- **AC1:** Given no UK postcode in the server environment, when the live view is opened, then it shows that the house is not configured and shows no sample aircraft.
  - **Verify:** manual Start with an empty environment and confirm the not-configured state rather than aircraft.
- **AC2:** Given a postcode and a radius, and a stubbed postcodes.io response, when the live view loads, then distance is measured from that centre.
  - **Verify:** manual Stub `TEST-POSTCODE` to an ocean centre and confirm a fixture aircraft is inside or outside against that point.
- **AC3:** Given a failed lookup and no centre already in the environment, when the server starts, then it does not invent a centre.
  - **Verify:** manual Fail the stub lookup and confirm the not-configured state.
- **AC4:** Given a configured postcode and centre, when the git index is searched, then neither value is tracked, and `.env` is ignored.
  - **Verify:** manual Run the git absence test in the TSD against a tracked tree that does not contain the owner values.
- **AC5:** Given a successful lookup, when the credits render, then the postcodes.io attribution lines are visible.
  - **Verify:** manual Read the credit block and match it to the statements on the postcodes.io licences page.

## Still decided

One house, one profile ([D0006](../decisions.md), [D0007](../decisions.md), [D0008](../decisions.md)). The on-screen unit of the radius remains [PRD-OQ3](../prd.md#14-open-questions) and is not this story. The filter compares a positive radius with a great-circle distance.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | UK postcode, postcodes.io, git prohibition. Points 3 to 5. |
