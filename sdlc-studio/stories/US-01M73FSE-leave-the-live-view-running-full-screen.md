# US-01M73FSE: Leave the live view running full screen

> **Status:** Ready
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73FVS
> **Points:** 3
> **Persona:** Ruth Okonkwo
> **Affects:** sdlc-studio/prd.md

## User Story

**As a** person living with the screen (Ruth Okonkwo)
**I want** type I can read from across the room, with no keyboard after the postcode is set
**So that** the display can be left on

## Acceptance Criteria

- **AC1:** Given the environment is configured, when the live view is shown, then no control depends on hover.
  - **Verify:** vitest "FSE-AC1"
- **AC2:** Given the environment is configured, when the live view is shown, then a keyboard is not required to keep it updating.
  - **Verify:** vitest "FSE-AC2"
- **AC3:** Given the view in current Chromium, when an aircraft is overhead, then the nearest identity is set in type of at least 32px so it can be read without approaching the screen.
  - **Verify:** vitest "FSE-AC3"
- **AC4:** Given a client that is not on the home LAN, when it requests the live view, then the server refuses it. A loopback or private-LAN client is admitted.
  - **Verify:** vitest "FSE-AC4"

Version 1 is Chromium only ([D0017](../decisions.md)). The live view is home-LAN only ([D0018](../decisions.md)). The 32px check is the executable stand-in for reading it from the seat. The owner still looks at the real screen.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | Setup is the host environment, not a page. |
