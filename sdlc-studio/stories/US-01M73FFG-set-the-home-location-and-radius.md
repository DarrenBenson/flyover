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
  - **Verify:** vitest "FFG-AC1"
- **AC2:** Given a postcode and a radius, and a stubbed postcodes.io response, when the live view loads, then distance is measured from that centre.
  - **Verify:** vitest "FFG-AC2"
- **AC3:** Given a failed lookup and no centre already in the environment, when the server starts, then it does not invent a centre.
  - **Verify:** vitest "FFG-AC3"
- **AC4:** Given a configured postcode and centre, when the git index is searched, then neither value is tracked, and `.env` is ignored.
  - **Verify:** vitest "FFG-AC4"
- **AC5:** Given a successful lookup, when the credits render, then the postcodes.io attribution lines are visible.
  - **Verify:** vitest "FFG-AC5"

## Still decided

One house, one profile ([D0006](../decisions.md), [D0007](../decisions.md), [D0008](../decisions.md)). The radius is statute miles. The default is 15 and is configurable ([D0014](../decisions.md)). The filter compares a positive radius with a great-circle distance.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | UK postcode, postcodes.io, git prohibition. Points 3 to 5. |
