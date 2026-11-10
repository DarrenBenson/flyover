# US-01M73F39: Keep the last good picture when the provider fails

> **Status:** Done
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73FVS
> **Points:** 5
> **Persona:** Ruth Okonkwo
> **Affects:** sdlc-studio/prd.md, tests/fixtures/provider-down.json, src/app.ts, src/page.ts, src/poll.ts, src/config.ts, src/lan.ts, src/geo.ts, src/credits.ts, src/store.ts, src/types.ts, src/index.ts, tests/walking-skeleton.test.ts, package.json, package-lock.json, tsconfig.json, vitest.config.ts, .github/workflows/test.yml, .gitignore
> **Depends on:** US-01M73F8A

## User Story

**As a** person living with the screen (Ruth Okonkwo)
**I want** the screen to keep painting when adsb.lol fails
**So that** a dead feed does not become a blank error

## Acceptance Criteria

- **AC1:** Given a previous good poll, when the next adsb.lol call fails, then the last aircraft remain visible and are labelled stale or degraded.
  - **Verify:** vitest "F39-AC1"
  - **Verified:** yes (2026-11-10)
- **AC2:** Given no previous good poll, when the provider call fails, then the screen shows an explicit degraded state rather than an endless spinner.
  - **Verify:** vitest "F39-AC2"
  - **Verified:** yes (2026-11-10)
- **AC3:** Given a provider failure, when the response is inspected, then the kiosk still receives a snapshot document rather than an unhandled server error.
  - **Verify:** vitest "F39-AC3"
  - **Verified:** yes (2026-11-10)

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | Named adsb.lol as the feed that fails. |
