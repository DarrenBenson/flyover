# US-01M73FSE: Leave the live view running full screen

> **Status:** Draft
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73FVS
> **Points:** 3
> **Persona:** Ruth Okonkwo

## User Story

**As a** person living with the screen (Ruth Okonkwo)
**I want** type I can read from across the room, with no keyboard after setup
**So that** the display can be left on

## Acceptance Criteria

- **AC1:** Given setup is complete, when the live view is shown, then no control depends on hover.
  - **Verify:** manual Walk the live view with a pointer and confirm no hover-only control.
- **AC2:** Given setup is complete, when the live view is shown, then a keyboard is not required to keep it updating.
  - **Verify:** manual Hide the keyboard and confirm the view keeps updating.
- **AC3:** Given the view is in a full-screen Chromium window, when an aircraft is overhead, then the nearest identity is readable without approaching the screen.
  - **Verify:** manual Read the nearest aircraft from the intended seating distance in Chromium kiosk mode.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
