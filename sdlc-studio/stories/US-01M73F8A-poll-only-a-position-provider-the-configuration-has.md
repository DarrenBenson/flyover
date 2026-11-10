# US-01M73F8A: Poll only a position provider the configuration has enabled

> **Status:** Ready
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73FH0
> **Points:** 5
> **Persona:** Alex Brennan
> **Affects:** sdlc-studio/trd.md, tests/fixtures/provider-gate.json

## User Story

**As a** household installer (Alex Brennan)
**I want** no position call to leave the server unless I have enabled that provider
**So that** the display cannot boot into OpenSky or ADS-B Exchange

## Acceptance Criteria

- **AC1:** Given no position provider enabled, when a poll runs, then the transport is not called and the screen shows the not-configured or empty state.
  - **Verify:** manual Run a poll with every provider off and confirm the stub transport count stays zero.
- **AC2:** Given adsb.lol enabled, when a poll runs, then only the adsb.lol transport is called.
  - **Verify:** manual Enable the adsb.lol stub and confirm the OpenSky and ADS-B Exchange stubs are not called.
- **AC3:** Given configuration that names OpenSky or ADS-B Exchange, when the server starts, then it refuses that provider and makes no call.
  - **Verify:** manual Name each ineligible provider and confirm the call count stays zero and the refusal is visible.
- **AC4:** Given a provider credential, when the kiosk bundle is inspected, then the credential is not in it.
  - **Verify:** manual Build the client and confirm a sentinel credential string is absent from the output.

The default this deployment names is adsb.lol ([D0009](../decisions.md)). A checkout with no config still calls nobody ([D0003](../decisions.md)).

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | Default is adsb.lol. OpenSky and ADS-B Exchange are refused. |
