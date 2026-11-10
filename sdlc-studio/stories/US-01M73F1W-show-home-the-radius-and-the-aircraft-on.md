# US-01M73F1W: Show home, the radius, and the aircraft on a map

> **Status:** Draft
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73FGP
> **Points:** 5
> **Persona:** Ruth Okonkwo

## User Story

**As a** person living with the screen (Ruth Okonkwo)
**I want** a map of home and the aircraft
**So that** over there is obvious from across the room

## Acceptance Criteria

- **AC1:** Given a profile and a current list, when the map renders, then home, the radius, and each listed aircraft are marked.
  - **Verify:** manual Load the map with a two-aircraft fixture and confirm home, the radius, and both marks.
- **AC2:** Given the map configuration, when the style or tiles are loaded, then the host is not tile.openstreetmap.org.
  - **Verify:** manual Inspect the tile or style requests and confirm they do not go to tile.openstreetmap.org.
- **AC3:** Given no aircraft inside the radius, when the map renders, then home and the radius remain and no sample aircraft is drawn.
  - **Verify:** manual Load an empty fixture and confirm the map has home and radius only.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
