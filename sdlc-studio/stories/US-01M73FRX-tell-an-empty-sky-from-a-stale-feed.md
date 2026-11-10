# US-01M73FRX: Tell an empty sky from a stale feed

> **Status:** Done
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73F6G
> **Points:** 3
> **Persona:** Ruth Okonkwo
> **Affects:** sdlc-studio/prd.md, tests/fixtures/empty-and-stale.json, src/app.ts, src/page.ts, src/poll.ts, src/config.ts, src/lan.ts, src/geo.ts, src/credits.ts, src/store.ts, src/types.ts, src/index.ts, tests/walking-skeleton.test.ts, package.json, package-lock.json, tsconfig.json, vitest.config.ts, .github/workflows/test.yml, .gitignore
> **Depends on:** US-01M73FBE

## User Story

**As a** person living with the screen (Ruth Okonkwo)
**I want** an empty sky to look empty and a dead feed to look dead
**So that** I do not trust a picture that has stopped

## Acceptance Criteria

- **AC1:** Given a successful poll with no aircraft inside the radius, when the live view renders, then it shows an explicit empty state and no sample aircraft.
  - **Verify:** vitest "FRX-AC1"
  - **Verified:** yes (2026-11-10)
- **AC2:** Given a poll older than the configured stale threshold, when the live view renders, then the aircraft stay visible and are labelled with their age as stale.
  - **Verify:** vitest "FRX-AC2"
  - **Verified:** yes (2026-11-10)
- **AC3:** Given a poll younger than the configured stale threshold, when the live view renders, then it is not labelled stale.
  - **Verify:** vitest "FRX-AC3"
  - **Verified:** yes (2026-11-10)

The default threshold is 60 seconds and is configurable ([D0016](../decisions.md)). Tests inject the number. They do not sleep for it.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | Threshold is injected. The default number stays open. |
