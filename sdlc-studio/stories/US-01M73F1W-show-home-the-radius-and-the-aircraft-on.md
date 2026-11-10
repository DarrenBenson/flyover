# US-01M73F1W: Show home, the radius, and the aircraft on a map

> **Status:** Done
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73FGP
> **Points:** 5
> **Persona:** Ruth Okonkwo
> **Affects:** sdlc-studio/prd.md, sdlc-studio/trd.md, src/map.ts, src/app.ts, src/page.ts, tests/map.test.ts
> **Depends on:** US-01M73FBE

## User Story

**As a** person living with the screen (Ruth Okonkwo)
**I want** a map of this house and the aircraft
**So that** over there is obvious from across the room

## Acceptance Criteria

- **AC1:** Given a profile and a current list, when the map renders, then the centre, the radius, and each listed aircraft are marked.
  - **Verify:** vitest "F1W-AC1"
  - **Verified:** yes (2026-11-10)
- **AC2:** Given the map configuration, when the style or tiles are loaded, then the host is MapTiler Cloud, the key is not in the repository, and the host is not tile.openstreetmap.org.
  - **Verify:** vitest "F1W-AC2"
  - **Verified:** yes (2026-11-10)
- **AC3:** Given no aircraft inside the radius, when the map renders, then the centre and the radius remain and no sample aircraft is drawn.
  - **Verify:** vitest "F1W-AC3"
  - **Verified:** yes (2026-11-10)

## Notes

The tile host is the MapTiler Cloud free plan ([D0021](../decisions.md)). The key is `MAPTILER_API_KEY` in the host environment. A paused quota degrades the map and does not fall back to a public OpenStreetMap tile server. This story is not part of the walking skeleton.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | Centre is the postcode centre. Stays Draft on the tile host. |
