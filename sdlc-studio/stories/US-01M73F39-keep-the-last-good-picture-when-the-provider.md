# US-01M73F39: Keep the last good picture when the provider fails

> **Status:** Ready
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73FVS
> **Points:** 5
> **Persona:** Ruth Okonkwo
> **Affects:** sdlc-studio/prd.md, tests/fixtures/provider-down.json
> **Depends on:** US-01M73F8A

## User Story

**As a** person living with the screen (Ruth Okonkwo)
**I want** the screen to keep painting when adsb.lol fails
**So that** a dead feed does not become a blank error

## Acceptance Criteria

- **AC1:** Given a previous good poll, when the next adsb.lol call fails, then the last aircraft remain visible and are labelled stale or degraded.
  - **Verify:** manual Fail the stub after one good poll and confirm the last aircraft and the label.
- **AC2:** Given no previous good poll, when the provider call fails, then the screen shows an explicit degraded state rather than an endless spinner.
  - **Verify:** manual Fail the stub with no prior poll and confirm the degraded copy.
- **AC3:** Given a provider failure, when the response is inspected, then the kiosk still receives a snapshot document rather than an unhandled server error.
  - **Verify:** manual Confirm the snapshot route returns a snapshot body, not a 500, on provider failure.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | Named adsb.lol as the feed that fails. |
