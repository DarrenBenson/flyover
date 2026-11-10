# Test Strategy Document

> **Project:** Flyover
> **Version:** 0.2
> **Last Updated:** 2026-11-10
> **Owner:** QA seat. The named seat is provisional until the owner accepts the team (see the persona index).

## Overview

Flyover has no code and no tests. This document is the strategy a later build has to satisfy. It is not a report of a run.

The product is a kiosk for one house. It must not lie about what is overhead, it must not call a flight-data provider the configuration has not enabled, and it must not commit the UK postcode or the resolved centre. Those failures are the ones the strategy is built around. A green unit suite that mocks the provider and never asserts the licence gate, or never looks at the git tree, would be a false pass. A mocked provider test proves the code on Flyover's side of the socket. It does not prove the provider, the terms, or the live sky.

Numbers below are the SDLC Studio defaults (unit 90, integration 85, end-to-end feature coverage 100). They are targets. Nothing has been measured.

## Test Objectives

- The list and the map show the same aircraft, and only aircraft inside the configured radius of the one house.
- Unknown flight facts stay unknown. A route lookup miss stays unknown, and the route response is not written to disk.
- Empty, stale, and provider-down are distinguishable on the screen.
- A provider that is not enabled is not called. The enabled position provider in the owner's configuration is adsb.lol. A test that enables OpenSky or ADS-B Exchange fails, because those sources are ineligible for this deployment.
- Credentials, the UK postcode, and the resolved coordinates do not appear in the client bundle, the git index, or the poll log.
- Credits render for every enabled source, including the postcodes.io attribution when a centre is in use.
- The screen states that the data is not for navigation.

## Scope

### In Scope

- Display profile: one UK postcode, one resolved centre, one radius.
- Radius filter, distance and direction.
- Snapshot list, selection, map agreement.
- Enrichment and photo behaviour when the fixture says present, absent, or refused.
- Stale and failure presentation.
- The enabled-provider gate.
- Kiosk layout checks that a person can do in a browser, recorded as manual verifiers until a browser harness exists.

### Out of Scope

- A second household, a second postcode, or a profile picker.
- Certifying the upstream data. Flyover does not claim the feed is complete or correct.
- Performance of adsb.lol, OpenSky, or anyone else. Their limits are constraints, not numbers Flyover's tests invent.
- Radio reception, `dump1090`, and `readsb`.
- A load test of a public service. Do not point a stress tool at a flight-data API.
- Failover of `webserver1` to `webserver2` as an automated test, until [TRD-OQ3](trd.md#12-open-technical-questions) says how traffic moves. Until then it is a manual rehearsal on staging.

---

## Test Levels

### Coverage Targets

| Level | Target | Rationale |
| ------- | -------- | ----------- |
| Unit | 90% | Radius, ordering, stale rules, and the provider gate are pure enough to test without a network |
| Integration | 85% | The server's snapshot route, the profile store, and the adapter against fixtures |
| E2E | 100% feature coverage | Every feature in the PRD inventory has at least one end-to-end or manual check. 100% means features, not lines |

> **Why these targets?** The SDLC Studio default. See the skill's `reference-tsd.md`. Lower them only with an owner decision. Do not lower them to make a missing test look finished.

### Unit Testing

| Attribute | Value |
|-----------|-------|
| Coverage Target | 90% |
| Framework | Not chosen. Follows TRD-OQ1. If the stack is TypeScript, the runner is the one that stack already uses. Do not add a second |
| Execution | On every change, locally, before a commit that claims the story |

### Integration Testing

| Attribute | Value |
|-----------|-------|
| Scope | Profile persistence, snapshot assembly from a fixture payload, enrichment TTL, error envelope |
| Framework | Same language as the server, against fixtures in the repo |
| Execution | With the unit run. No live network |

### End-to-End Testing

| Attribute | Value |
|-----------|-------|
| Scope | The kiosk against a Flyover server whose providers are fixtures: aircraft inside and outside the radius, selection shared with the map, empty sky, stale banner |
| Framework | Not chosen. A browser driver is justified once the UI exists. Until then the story verifiers are `manual` |
| Execution | Against the fixture server, not against adsb.lol |

### E2E Feature Coverage Matrix

No spec files exist. The matrix is the obligation, not a result.

| Feature Area | Spec File | Test Count | Status |
|--------------|-----------|------------|--------|
| Home and radius | Not created | 0 | Not Started |
| Postcode absent from git | Not created | 0 | Not Started |
| Overhead list | Not created | 0 | Not Started |
| Flight facts | Not created | 0 | Not Started |
| Livery and photo credit | Not created | 0 | Not Started |
| Map selection | Not created | 0 | Not Started |
| Empty, stale, down | Not created | 0 | Not Started |
| Attribution and navigation disclaimer | Not created | 0 | Not Started |
| Kiosk layout | Not created | 0 | Not Started |

### API Contract Testing

The contract that matters is Flyover's snapshot, not a third-party schema Flyover does not own.

- Record fixture payloads for each enabled provider shape once the provider is chosen. A fixture is a file in the repo with no home coordinate and no key.
- The adapter test feeds the fixture and asserts the snapshot fields. When the fixture changes shape, the test fails.
- A live call is a separate smoke, run by the owner, not by the unit suite. It counts as a smoke only when the owner has enabled that provider and the terms allow the call. It is never required for a commit.

### Performance Testing

| Attribute | Value |
|-----------|-------|
| Scope | The 15-second reflection target and the poll budget, after a UI exists |
| Framework | Not chosen. A single-kiosk timing check is enough. No distributed load generator |

Do not load-test an upstream API.

### Security Testing

| Attribute | Value |
|-----------|-------|
| Scope | Secrets, the UK postcode, and the resolved centre stay out of the client and the git index. The live view's exposure is not asserted until PRD-OQ7 says who may open it. Dependencies are reviewed when they exist |
| Tools | Repository search in CI or in the pre-commit gate for known key patterns. A test that builds the client and fails if a configured secret string appears in the output. No secret value is stored in the test |

---

## Test Environments

| Environment | Purpose | URL | Data |
|-------------|---------|-----|------|
| Local | The author's machine | Not specified | Fixtures only |
| Development | `devserver1` | Not specified by the owner | Fixtures, or a provider key the owner has chosen to use there |
| Staging | `stagingserver` | Not specified by the owner | Same build as production. A real provider only if the terms allow a rehearsal |
| Production | `webserver1`, with `webserver2` as failover | Not specified by the owner | The one household profile, in host config on that machine, not in git. `webserver2` carries the same class of config |

No URL is invented here. When the owner names one, it is recorded in the decisions log, not guessed.

## Test Data Strategy

### Approach

- Synthetic aircraft in fixtures: positions relative to a fictional centre that is not anyone's house. A fixed point in the ocean is the fixture origin. The fixture postcode is the token `TEST-POSTCODE`, which is not a real UK postcode, and the stubbed lookup returns that ocean point. Do not use the owner's postcode, a real residential postcode, or the owner's coordinates.
- One fixture with an aircraft inside the radius, one outside, one with no route, one with a photo credit, one with a provider error.
- Clocks are injected. A stale test does not sleep for 60 seconds.
- The route-lookup fixture returns a body and the test asserts no route file or route table was written.
- Live smoke, if the owner runs it, uses the real profile on a server and is not committed as a cassette that contains that profile.

### The postcode and the centre are not in git

This is a required test, not a review note. [D0007](decisions.md).

- `git ls-files` must not list `.env`, `.env.*`, or a tracked file whose path is host config for the house.
- The repository `.gitignore` ignores `.env` and `.env.*`. The test fails if a later change stops ignoring them.
- The test does not embed the owner's postcode or coordinates in source so that it knows what to search for. It fails if `git ls-files` lists `.env`, `.env.*`, or any tracked file under a host-config path. Documentation may discuss postcodes. The synthetic token `TEST-POSTCODE` may appear in a tracked fixture, because it is not a real postcode.
- When the owner's real postcode and centre are present in the environment of a local run, the test also asserts those exact strings are absent from every tracked file. When they are absent, that extra assertion is skipped. A missing owner value does not fail the suite, and it is not replaced with a value written into the repo.
- A poll-log test asserts the postcode and the centre are not on the info line. The log may carry a count and an age.

### Sensitive Data

The home postcode and the resolved centre are personal data. Tests use `TEST-POSTCODE` and the ocean fixture. Logs from a failed test must not dump the real profile. Provider keys are read from the environment on the owner's machine and are absent in CI until [TRD-OQ10](trd.md#12-open-technical-questions) says there is CI and how it gets a secret. A missing key skips the live smoke. It does not fail the fixture suite, and it does not get replaced with a key checked into the repo.

---

## Automation Strategy

### Automation Candidates

- Radius inclusion and ordering, measured from the stubbed centre.
- "The git index contains no `.env` and no host-config profile."
- Distance and bearing against known points.
- Stale threshold.
- "Provider disabled means zero outbound calls" using a stub transport.
- Snapshot JSON shape.
- Credit strings present in the rendered view once a renderer exists.

### Manual Testing

- Readability from across a room on the owner's actual screen.
- Chromium kiosk mode, and any other browser named in PRD-OQ6.
- A real poll on staging, watched by a person, after a provider is enabled.
- Failover rehearsal: stop the app on `webserver1` and confirm the display comes back on `webserver2`, once TRD-OQ3 has a mechanism.
- The navigation disclaimer is visible without scrolling on the kiosk viewport.

### Automation Framework Stack

| Layer | Tool | Language |
| ------- | ------ | ---------- |
| E2E/UI | Not chosen | Follows the UI language |
| API | The server's test runner against fixtures | Follows TRD-OQ1 |
| Unit | The same runner | Follows TRD-OQ1 |

---

## CI/CD Integration

`release_strategy` is `trunk`. A pull request is not the gate. The gate is the checks that run before a commit is treated as done, and again on the branch that is `main`.

### Pipeline Stages

No pipeline is installed. The intended order, when the owner has a place to run it:

1. **Before commit:** Lint, typecheck if the language has one, unit tests, fixture integration tests.
2. **On `main`:** The same, plus the end-to-end fixture suite once it exists.
3. **Nightly, optional:** The live smoke, only for a provider the owner has enabled and only within its rate limit. One call, not a loop.
4. **Before a production deploy:** The fixture suite green, plus the owner's look at staging. Deploy stays manual.

[TRD-OQ10](trd.md#12-open-technical-questions) asks whether this runs on a CI service or on `devserver1`. This strategy does not add a workflow file.

### Quality Gates

| Gate | Criteria | Blocking |
| ------ | ---------- | ---------- |
| Unit coverage | At least 90% once there is a suite | Yes, once the suite exists. A discovery commit with no code is not this gate |
| Integration tests | All fixture tests pass | Yes, once they exist |
| E2E critical path | Empty, one aircraft, stale, provider disabled | Yes, once they exist |
| Live smoke | Owner-run, terms-permitting | No. A failed upstream does not fail the build. It fails the smoke, and the screen must show that |
| Story Done | Every `Verify:` line passes, and an independent reviewer approves | Yes, per SDLC Studio. Current story verifiers are `manual` because there is nothing to execute |

---

## Defect Management

### Severity Definitions

| Severity | Definition | SLA |
| ---------- | ------------ | ----- |
| Critical | The screen shows invented flight facts, hides a dead feed, calls OpenSky or ADS-B Exchange, stores a route row or a photo file, or leaks a credential, the postcode, or the centre | Stop the production display until fixed. No numeric response time is promised |
| High | A must-have feature is wrong and there is no obvious way for the household to see that it is wrong | Next fix on `main` before the next production deploy |
| Medium | A feature is impaired and the screen makes the impairment obvious | Backlog, ordered with the other stories |
| Low | Copy, spacing, a credit wrapped awkwardly | Backlog |

There is no on-call rota and no contractual SLA. "Stop the production display" means the owner takes the kiosk off the bad build. It does not create a paging service.

---

## Tools & Infrastructure

| Purpose | Tool |
| --------- | ------ |
| Test Management | Story `Verify:` lines and, later, test specs under `sdlc-studio/test-specs/` |
| CI/CD | Not chosen. TRD-OQ10 |
| Browser Automation | Not chosen |
| Coverage | The runner's coverage tool, when the language is chosen |

---

## Test Organisation

When code exists, tests live beside that choice. The intended shape:

```text
tests/
  unit/
  integration/
  fixtures/
  e2e/
```

Fixtures contain no secrets and no real postcode. End-to-end tests start the server with the fixture transport and the stubbed postcode lookup. They do not read `webserver1`.

---

## Related Specifications

- [Product Requirements Document](prd.md)
- [Technical Requirements Document](trd.md)
- [Personas](personas/index.md)

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-11-10 | Discovery draft | Initial strategy. No tests exist, so every count is zero. |
| 2026-11-10 | Discovery draft | Added the git test for the UK postcode and the resolved centre. Named adsb.lol as the only position provider a fixture may enable for this deployment. |
