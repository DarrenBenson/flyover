# US-01M73FFG: Set the home location and radius

> **Status:** Draft
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73F6G
> **Points:** 3
> **Persona:** Alex Brennan

## User Story

**As a** household installer (Alex Brennan)
**I want** to save a latitude, a longitude, and a radius once
**So that** the live view watches the right patch of sky without a code change

## Acceptance Criteria

- **AC1:** Given no profile, when the live view is opened, then it asks for a location and a radius instead of showing a sample aircraft.
  - **Verify:** manual Open the live view with no profile and confirm it asks for a location rather than showing aircraft.
- **AC2:** Given a saved profile, when the live view loads, then distance is measured from that latitude and longitude.
  - **Verify:** manual Save a fictional ocean coordinate and a radius, then confirm a fixture aircraft is inside or outside against that point.
- **AC3:** Given the repository, when it is searched, then the saved home coordinate is not in it.
  - **Verify:** manual Confirm the profile store is outside the git tree and no sample file contains a real home.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
