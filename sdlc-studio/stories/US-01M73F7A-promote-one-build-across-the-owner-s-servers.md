# US-01M73F7A: Promote one build across the owner's servers

> **Status:** Ready
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73FVS
> **Points:** 5
> **Persona:** Alex Brennan
> **Affects:** sdlc-studio/trd.md

## User Story

**As a** household installer (Alex Brennan)
**I want** the same build on devserver1, stagingserver, webserver1, and webserver2
**So that** staging rehearses what production runs, and failover has a build and a postcode to run

## Acceptance Criteria

- **AC1:** Given a build, when it is promoted, then devserver1, stagingserver, and the production pair are documented as running that same build identity.
  - **Verify:** manual Compare the build identity reported on each named server after a rehearsal promotion.
- **AC2:** Given production, when webserver1 is the primary, then webserver2 has the same release and its own copy of the postcode, centre, and radius in host config.
  - **Verify:** manual Read the production note and confirm webserver2 is named as failover, with the profile described as host config and not as a file in git.
- **AC3:** Given the repository and the host notes, when they are read, then they contain no IP address, extra hostname, credential, postcode, or centre.
  - **Verify:** manual Search the repo and the committed docs for credentials, postcodes, and hostnames other than the four named servers.

## Notes

Traffic moves by the manual DNS runbook in the TRD ([D0020](../decisions.md)). The rehearsal on the owner's servers is this story's remaining work. It is not part of the walking skeleton, and the repository does not deploy.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | Profile on webserver2 is host config. Stays Draft on the cutover. |
