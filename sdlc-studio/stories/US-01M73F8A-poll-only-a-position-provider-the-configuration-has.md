# US-01M73F8A: Poll only a position provider the configuration has enabled

> **Status:** Draft
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73FH0
> **Points:** 5
> **Persona:** Alex Brennan

## User Story

**As a** household installer (Alex Brennan)
**I want** no position call to leave the server unless I have enabled that provider
**So that** the display cannot boot into a source the terms do not allow

## Acceptance Criteria

- **AC1:** Given no position provider enabled, when a poll runs, then the transport is not called and the screen shows the disabled or empty state.
  - **Verify:** manual Run a poll with every provider off and confirm the stub transport count stays zero.
- **AC2:** Given one provider enabled, when a poll runs, then only that provider's transport is called.
  - **Verify:** manual Enable one stub provider and confirm the other stub is not called.
- **AC3:** Given a provider credential, when the kiosk bundle is inspected, then the credential is not in it.
  - **Verify:** manual Build the client and confirm a sentinel credential string is absent from the output.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
