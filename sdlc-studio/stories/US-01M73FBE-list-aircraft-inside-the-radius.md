# US-01M73FBE: List aircraft inside the radius

> **Status:** Done
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73F6G
> **Points:** 5
> **Persona:** Ruth Okonkwo
> **Affects:** sdlc-studio/prd.md, tests/fixtures/radius-list.json, src/app.ts, src/page.ts, src/poll.ts, src/config.ts, src/lan.ts, src/geo.ts, src/credits.ts, src/store.ts, src/types.ts, src/index.ts, tests/walking-skeleton.test.ts, package.json, package-lock.json, tsconfig.json, vitest.config.ts, .github/workflows/test.yml, .gitignore
> **Depends on:** US-01M73FFG

## User Story

**As a** person living with the screen (Ruth Okonkwo)
**I want** the aircraft near this house listed with the closest first
**So that** I can see what just went over without searching

## Acceptance Criteria

- **AC1:** Given one profile and a poll containing aircraft inside and outside the radius, when the list renders, then only the inside ones appear.
  - **Verify:** vitest "FBE-AC1"
  - **Verified:** yes (2026-11-10)
- **AC2:** Given two aircraft inside the radius, when the list renders, then the nearer one is first.
  - **Verify:** vitest "FBE-AC2"
  - **Verified:** yes (2026-11-10)
- **AC3:** Given a successful poll, when the list renders, then it shows the age of that poll and does not wait for a manual refresh.
  - **Verify:** vitest "FBE-AC3"
  - **Verified:** yes (2026-11-10)

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | Bound to the one-house centre. Depends on the postcode story. |
