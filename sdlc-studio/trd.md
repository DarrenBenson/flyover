# Technical Requirements Document

**Project:** Flyover
**Version:** 0.2
**Status:** Draft
**Last Updated:** 2026-11-10
**PRD Reference:** [PRD](prd.md)

Terms below were read on 2026-11-10. They are not a legal opinion. The owner confirms them before any provider is enabled. Where a page could not be fetched, the gap is named.

---

## 1. Executive Summary

### Purpose

Describe a v1 Flyover that one household runs as a personal, non-commercial kiosk, fed by the providers the decisions log now allows, without pretending the stack or the failover mechanism has been accepted.

### Scope

In scope: the shape of the web app, which providers this personal non-commercial deployment may use, the data the server may keep, the UK postcode profile, and the environment and failover requirements for `devserver1`, `stagingserver`, `webserver1`, and `webserver2`.

Out of scope: application code, a second household, host addresses beyond those four names, credentials, a radio receiver, and the traffic cutover the owner has not described.

### Key Decisions

Only the decisions in [decisions.md](decisions.md) are accepted. An ADR below is accepted only when a decision id says so.

- v1 is the API web app for one house. No extra hardware. ([D0001](decisions.md), [D0006](decisions.md).)
- The owner's use is personal and non-commercial. The software licence is MIT. Upstream data terms are not. A commercial fork re-clears every provider. ([D0003](decisions.md), [D0005](decisions.md).)
- The default position provider for this deployment is adsb.lol. OpenSky and the ADS-B Exchange community and RapidAPI plans are ineligible. ([D0009](decisions.md).)
- The profile is a UK postcode and a radius in host config on every serving machine, resolved through postcodes.io, never committed. ([D0007](decisions.md), [D0008](decisions.md), [D0012](decisions.md).)
- One deployable web application and TypeScript remain **proposals**. [TRD-OQ1](#12-open-technical-questions). SQLite is not the profile store.

---

## 2. Project Classification

**Project Type:** web_application

**Classification Rationale:** Flyover serves a browser UI. The browser is the product. A small server exists so that provider credentials and polling stay off the kiosk. That server is part of the same application, not a separate API product. Q1 of the SDLC Studio decision tree (does this serve a web frontend?) is yes.

**Architecture Implications:**

- **Default Pattern:** Monolith, from the web-application row of the pattern matrix. The start-simple rule applies: one owner, one deployment topology, a shared data model, no independent scaling need.
- **Pattern Used:** Monolith (proposed).
- **Deviation Rationale:** None. Microservices, a separate frontend deploy, and serverless are worse fits. A kiosk that polls every few seconds is a long-lived client of one process, not a function with a cold start. Two deployables would double the failover story across `webserver1` and `webserver2` for no current requirement.

---

## 3. Architecture Overview

### System Context

```mermaid
flowchart LR
  kiosk[Kiosk browser]
  flyover[Flyover server]
  pos[Position provider]
  route[Route and aircraft lookup]
  photo[Photo source]
  tiles[Map tiles]
  kiosk -->|same origin| flyover
  flyover --> pos
  flyover --> route
  flyover --> photo
  kiosk --> tiles
```

The kiosk never holds an upstream flight-data credential. Map tiles are requested by the browser from a tile host whose terms allow it. Which host is [TRD-OQ6](#12-open-technical-questions).

### Architecture Pattern

Monolith. One process serves the built UI and the Flyover API.

**Rationale:** The owner runs one application on `webserver1`, with `webserver2` holding the same application for failover. Splitting the UI and the poller would make failover two things that must move together. Internal modules still have boundaries: display, polling, enrichment, photos. Those are packages, not services.

### Component Overview

No paths exist yet. The names are the modules a later story would create.

| Component | Responsibility | Technology | Constraints |
|-----------|---------------|------------|-------------|
| Kiosk UI | List, detail, map, credits, empty and stale states | Browser, current Chromium as the named target | No upstream key. No hover-only control on the live view. Data age visible. Not-for-navigation statement visible. |
| Application server | Profile, poll, cache, same-origin API | Proposed TypeScript, one process | Rate-limit before the provider does. Refuse a provider the configuration has not explicitly enabled. |
| Position adapter | One interface, one enabled implementation | Proposed | Record the source name on every snapshot. Do not call a second provider to fill gaps unless that provider is also explicitly enabled. |
| Enrichment adapter | Airline, flight number, origin, destination, type | Proposed | A cache is not a republished route database. Unknown stays unknown. |
| Photo adapter | Thumbnail URL, credit, link | Proposed | Do not store image bytes. Do not show a photo without the credit and the link. |
| Operator config | UK postcode, resolved centre, radius, secrets | Runtime config or environment on each serving host, outside git | No secret, no postcode, and no home coordinate in the repository. |

---

## 4. Technology Stack

### Core Technologies

| Category | Technology | Version | Rationale |
| ---------- | ----------- | --------- | ----------- |
| Language | TypeScript | Not pinned | The UI is the product, and the server must share types with it for the snapshot and the profile. Proposed, not accepted. [TRD-OQ1](#12-open-technical-questions). |
| Framework | Not chosen | — | A Vite-built UI served by one small HTTP server (Hono or Fastify are the candidates) keeps a kiosk from taking on a document-site framework. Next.js is the other web-app default in the architecture guide and remains an option. |
| Database | None for the profile | — | The profile is host config on each server ([D0012](decisions.md)). Route rows are not stored ([D0010](decisions.md)). A database, if a later story needs one, waits on the stack question. |

Python with FastAPI is the other recommended web-app server. It was not proposed as the default because the kiosk UI would then be a second language and a second build. That trade is the owner's if they prefer Python. Familiarity alone is not the reason for TypeScript. The reason is one language across the only two parts v1 has.

### Build & Development

| Tool | Purpose |
|------|---------|
| Not chosen | No toolchain is selected while the stack question is open. The test strategy names the kinds of check, not the commands. |

### Infrastructure Services

| Service | Provider | Purpose |
|---------|----------|---------|
| Development | `devserver1` | Where the owner builds and runs the app |
| Staging | `stagingserver` | The same build, rehearsed before production |
| Production | `webserver1` | The live display |
| Production failover | `webserver2` | The same release, used when `webserver1` is unavailable |

No other provider is assumed. No container platform, no DNS host, and no secret store is named, because the owner has not named one.

---

## 5. API Contracts

### API Style

REST with JSON, between the kiosk and the Flyover server only. Upstream providers stay behind the server. OpenAPI is the documentation form when the server exists. Not built.

### Authentication

No end-user account in the proposal. The kiosk calls same-origin routes. Upstream credentials are server configuration. Whether setup itself is protected is [PRD-OQ7](prd.md#14-open-questions).

### Endpoints Overview

Illustrative. Not a commitment to paths.

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/snapshot` | Last accepted poll for the active profile: aircraft, ages, source names, credits | Unspecified. See PRD-OQ7 |
| GET | `/api/profile` | The non-secret profile the screen needs | Unspecified |
| PUT | `/api/profile` | Set location, radius, units | Unspecified. Must not be an open write on the public internet by accident |

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

Provider failures are not this error. A dead upstream is a successful snapshot response with a stale or degraded flag, so the kiosk can keep painting. This envelope is for Flyover's own refusal (bad profile, provider not enabled).

---

## 6. Data Architecture

### Data Models

#### Display profile

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| postcode | text | One UK postcode | The house. Personal data. Host config only |
| latitude | number | -90 to 90 | Centre from postcodes.io. Not invented if the lookup fails |
| longitude | number | -180 to 180 | Centre from postcodes.io |
| radius_m | number | Greater than 0 | Great-circle radius. The on-screen unit is PRD-OQ3. The filter can compare metres without that label |
| units | text | An allowed set | Open which set. PRD-OQ3 |

#### Aircraft snapshot

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| icao24 | text | From the feed | Stable aircraft id when present |
| callsign | text | Nullable | As broadcast |
| latitude, longitude | number | Required to be listed | Last accepted position |
| altitude | number | Nullable | As the feed defines it. Unit recorded |
| ground_speed | number | Nullable | As the feed defines it. Unit recorded |
| heading | number | Nullable | Track, if the feed has it |
| observed_at | timestamp | Required | When the source observed it |
| source | text | Required | Which provider |

Not stored as history. The server keeps the latest poll.

#### Enrichment cache

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| key | text | Identifier or callsign | Lookup key |
| airline, flight_number, origin, destination, aircraft_type | text | Each nullable | Absent means unknown |
| fetched_at | timestamp | Required | So a stale row can be dropped |
| source | text | Required | Which lookup |

Route rows are not this cache. [D0010](decisions.md) discards the adsbdb response after the screen has used it. A Planespotters JSON body may be kept in memory for at most 24 hours ([D0011](decisions.md)) and is not a photo file. Planebase aircraft rows are not cached because those terms were not read.

### Storage Strategy

| Data Type | Storage | Rationale |
|-----------|---------|-----------|
| Profile | Runtime config or environment on each serving host | [D0012](decisions.md). `webserver2` has its own copy. Not in git |
| Latest poll | Process memory | A history is a different product and a different licence question |
| Route lookup | Not stored | [D0010](decisions.md). Shown, then discarded |
| Photo JSON | Memory, at most 24 hours | [D0011](decisions.md). Not the image bytes |
| Photo bytes | Not stored | The display loads the thumbnail URL itself |
| Secrets | Host environment or a file outside the repo | Never in git |

### Migrations

None until there is a schema. When there is one, migrations ship with the same build that reads them, and a migration runs before the process serves traffic. No migration tool is chosen.

---

## 7. Integration Patterns

### External Services

Re-read on 2026-11-10 against a personal, non-commercial, one-house deployment ([D0005](decisions.md)). "Eligible" means the published terms allow that use. It is not a grant to a commercial fork. A fork used commercially re-clears every row itself.

| Service | Purpose | Protocol | Auth | What the terms say for this use | Verdict for the owner's deployment | Attribution |
|---------|---------|----------|------|--------------------------------|------------------------------------|-------------|
| [adsb.lol API](https://www.adsb.lol/docs/open-data/api) | Live positions | HTTPS JSON, base `https://api.adsb.lol` | Optional key. A key may later be required and is obtained by feeding | ODbL 1.0, stated on the docs page. ODbL allows the screen to show a produced work. Share-alike applies to a publicly used derivative database, not to the kiosk picture. Rate limits are dynamic. No fixed number is published. Production users are asked to make contact | **Eligible. This is the default position provider** ([D0009](decisions.md)). Configuration must still name it before a call. It is a volunteer service and can change or go away | ODbL attribution. Credit adsb.lol and keep the licence notice |
| [OpenSky Network](https://opensky-network.org/about/terms-of-use) | Live positions | REST, documented at the [REST API manual](https://openskynetwork.github.io/opensky-api/rest.html) | Anonymous by IP, or an account. Anonymous is current data only, 10-second resolution | The terms grant non-profit research and non-profit education only. They require a previous written licence for operational REST API use in any live product, service, or automated system, even for a non-profit. Anonymous quota remains 400 credits per day for `/states`. A small box costs 1 credit | **Ineligible, including for this non-commercial live display.** A kiosk that polls OpenSky is the operational use the terms name. Non-commercial does not remove the written-licence requirement. Do not enable it | Not used. If a written licence is later obtained, cite Schäfer et al., IPSN 2014, and opensky-network.org |
| [ADS-B Exchange](https://www.adsbexchange.com/community/developer-hub/) community / RapidAPI | Live positions | REST via RapidAPI | API key. The developer hub describes a personal-use plan at a price that was not re-copied here | The RapidAPI licence grant, retrieved 2026-11-10, is personal non-commercial research, non-profit education, or commercial internal testing that is non-production, time-limited, and not customer-facing. Redistribution, resale, and sublicensing are prohibited. Marketing on the developer hub calls the same API suitable for hobby projects. That sentence is not the grant | **Ineligible for an always-on display.** A household kiosk is not research, not education, and not time-limited non-production testing. The marketing line does not widen the grant. Enterprise would be a separate contract this project does not hold | Not used |
| [adsbdb](https://www.adsbdb.com/) | Airline, flight number, origin, destination | HTTPS JSON `https://api.adsbdb.com/v0/` | None for reads | Route data is the work of David Taylor and Jim Mason and may not be copied, published, or incorporated into other databases without David J Taylor's permission. Non-commercial use does not lift that notice. In a rolling 60 seconds, 512 or more requests are blocked for 60 seconds, and 1,024 or more for 300 seconds. Aircraft data on the same site is credited to Planebase. Those terms were not read. airport-data photos were not read | **Eligible only as a live lookup that is shown and discarded** ([D0010](decisions.md)). **Ineligible as a cache or a route database.** Planebase and airport-data are not sources | Credit David Taylor, Jim Mason, and adsbdb on the screen when a route is shown |
| [Planespotters photo API](https://www.planespotters.net/photo/api) | Airframe photo | HTTPS JSON `https://api.planespotters.net/pub/photos/hex/{hex}` or `/reg/{registration}` | None. Free and keyless | The API page loaded on the second read, 2026-11-10. Visible photographer credit. An obvious path to the returned `link` URL: a plain anchor without `rel="nofollow"` on a clickable browser, or a QR code or NFC tag on a display that cannot be clicked. The URL as text does not qualify. The display fetches thumbnail URLs unchanged. No storing, re-hosting, or proxying of image bytes. JSON cache at most 24 hours. Server-side calls need a descriptive User-Agent with a contact URL or email. Not for training models. Not for resale as an API | **Eligible when those conditions are met, and off until configuration enables it** ([D0011](decisions.md)). Personal non-commercial use adds no extra right. A commercial fork must meet the same page itself | Photographer name beside the image, and the path back to the photo page |
| [postcodes.io](https://postcodes.io/docs/licences/) | UK postcode to a centre, once when the postcode is loaded | HTTPS JSON | None | Software is MIT. Great Britain postcode data is OS OpenData. The licences page requires the Ordnance Survey, Royal Mail, National Statistics, and NRS attribution statements (copyright year 2025 on the page read). Northern Ireland postcodes beginning BT are free for non-commercial use under the ONSPD terms. Commercial use of BT data needs a licence from NI Land & Property Services | **Eligible for this deployment**, including a BT postcode, because the owner's use is non-commercial ([D0008](decisions.md)). Do not download the postcode directory into the repo. A commercial fork that resolves BT postcodes needs the LPS licence. One lookup, not a poll | The four attribution lines from the licences page, on the screen |
| Map tiles | Basemap | HTTPS tiles or a vector style | Depends on the host | The OpenStreetMap Foundation's public tile servers are for light, human use of the project, not for a kiosk that loads tiles all day. Flyover must not point a kiosk at `tile.openstreetmap.org` | **No host selected.** [TRD-OQ6](#12-open-technical-questions) | Whatever that host requires. OpenStreetMap data itself is ODbL |
| Local `dump1090` / `readsb` | Positions from a receiver in the house | Not in v1 | — | Future adapter only | Out of scope for this version | Not applicable in v1 |

No other flight API is a candidate. A contracted feed would be a new decision.

### Event Architecture

None. The server polls. The kiosk polls the server, or the server pushes over one connection later if polling the server proves noisy. Polling is enough for v1 and is easier to test. A push channel is not a requirement.

### Risks, called out together

1. **OpenSky stays ineligible.** Operational use of the REST API in a live product needs a written licence even when the operator is non-commercial. Using it here is a licence breach.
2. **ADS-B Exchange's community grant is research, education, or time-limited testing.** An always-on hobby screen does not fit that grant, however non-commercial it is. The developer-hub hobby sentence is not the licence.
3. **adsb.lol is the default and it is still one volunteer service** with dynamic limits. The owner should tell the project before a production kiosk depends on it. It can go away.
4. **ODbL share-alike is about a database, not about the screen.** Publishing derived positions would obligate that database's licence. v1 does not publish one.
5. **adsbdb routes cannot be cached.** Personal use does not create permission to copy them into another database. The allowed shape is show, then discard.
6. **Photos are other people's copyright.** The API page allows a credited thumbnail with an obvious path back. Re-hosting, dropping the credit, or hiding the link fails the terms.
7. **The postcode is the household.** It and the centre stay in host config. A tight bounding box sent upstream is close to the house. Do not log the postcode or the centre on the poll path. Do not commit either.
8. **MIT does not flow upstream, and this eligibility set does not flow to a fork.** README and the credits on the screen have to say so. A commercial fork is the forker's responsibility ([D0005](decisions.md)).
9. **postcodes.io is a lookup, not a directory we own.** Vendor the centre for this one house in host config after a successful lookup. Do not vendor the national file.


---

## 8. Infrastructure

### Deployment Topology

One build. The owner runs that build on each server. Production traffic uses `webserver1`. `webserver2` runs the same release and is the failover. Nothing in this document invents an IP, a DNS name, a port, or a credential.

The kiosk is not deployed by Flyover. It is a browser the household points at the URL.

### Environment Strategy

| Environment | Purpose | Characteristics |
| ------------- | --------- | ----------------- |
| Development | Build and try the app | Host `devserver1`. Disposable data. No production provider key unless the owner deliberately uses one |
| Staging | Rehearse the release | Host `stagingserver`. Same artefact as production. Not the live screen |
| Production | The display the household watches | Host `webserver1` |
| Production failover | Stand-in when `webserver1` is down | Host `webserver2`. Same release as `webserver1` |

Promotion is dev, then staging, then the production pair. The owner triggers production. The skill's deploy step is not authorised to do it, and this TRD does not give it a command.

### Failover

Requirements, not a design:

- `webserver2` can serve the same Flyover build `webserver1` serves.
- When `webserver1` is unavailable, the display is reachable via `webserver2` without a code change.
- Failover does not require a position archive. Losing the in-memory poll means the next poll refills the screen.
- The profile is runtime config on the host that serves traffic ([D0012](decisions.md)). `webserver2` has the postcode, the centre, and the radius in its own environment. It does not read a database on `webserver1`.
- How traffic moves (DNS, a proxy the owner already has, or a manual change) is [TRD-OQ3](#12-open-technical-questions). This document does not pick one.

### Scaling Strategy

Vertical, in the trivial sense: one process on one host is enough for a handful of kiosks reading one cached poll. Do not add a second service to scale. The upstream rate limit is the scaling constraint that matters, and caching the poll is how one kiosk and three kiosks cost the same upstream calls.

---

## 9. Security Considerations

### Threat Model

| Threat | Likelihood | Impact | Mitigation |
|--------|-----------|--------|------------|
| Provider key committed or sent to the browser | Medium if someone is careless | High. The key is the quota, and sometimes the licence | Keys only in host config. Browser talks to Flyover. Review any client bundle for the key |
| Home postcode or centre in git, logs, or a too-tight upstream box | Medium | High. It is the household | Do not log the postcode or the centre on the poll path. Query a box, not the postcode. No postcode and no coordinate in git |
| Unauthenticated live view on the public internet | Unknown until PRD-OQ7 | High. The map shows where the house is | The postcode is not a web form. Who may open the live view is still open |
| Stale or empty feed shown as live | High, because feeds fail | Medium. The household trusts a lie | Age on screen. Distinct empty, stale, and down states. PRD feature "Honest emptiness" |
| Photo or route used outside its terms | Medium | High, legally | Routes are not stored ([D0010](decisions.md)). Photo bytes are not stored ([D0011](decisions.md)). OpenSky and ADS-B Exchange are not enabled |
| Treating the screen as navigation | Low technically, high if the copy is casual | High | The not-for-navigation statement is a requirement, not a footer afterthought |

### Security Controls

| Control | Implementation |
| --------- | ---------------- |
| Authentication | No end-user account proposed. Upstream auth stays on the server. Setup exposure is an open question |
| Authorisation | One operator, one house. No roles and no second profile |
| Encryption at rest | Not specified. The profile is a location. Disk encryption of the host, if any, is the owner's existing practice and is not invented here |
| Encryption in transit | The kiosk should reach Flyover over HTTPS in production. Where TLS terminates is [TRD-OQ9](#12-open-technical-questions). Upstream calls are HTTPS |

No sector compliance regime is declared. Home location is personal data. Whether UK GDPR or another regime applies is [TRD-OQ8](#12-open-technical-questions). The engineering consequence that does not wait for that answer: collect only the location the display needs, do not send it to a provider as a street address, and do not keep a history of who looked at the screen. There is no "who looked" record in v1.

---

## 10. Performance Requirements

### Targets

Proposed. The owner can replace the numbers via PRD-OQ5. They are not a benchmark result.

| Metric | Target | Measurement |
| -------- | -------- | ------------- |
| Snapshot freshness on screen | Within 15 seconds of a successful poll | Time from the server accepting a poll to the kiosk showing it, on the named browser |
| Stale label | Older than 60 seconds | The age shown on the screen, from `observed_at` |
| Poll cost | Inside the enabled provider's published limit, with margin | Count of upstream calls per minute against that provider's documented threshold |
| Availability | No percentage | A failed upstream still paints empty, stale, or degraded. Failover is a hosting requirement, not this number |

---

## 11. Architecture Decision Records

Proposed. Not accepted. Accepting one is an owner decision, recorded with `decisions.py add`, not by editing the status word here and nowhere else.

### ADR-001: One deployable web application

**Status:** Proposed

**Context:** The architecture guide's default for a web application on a small team is a monolith. Flyover has one UI, one poller, and two hosts that must run the same thing.

**Decision:** One process serves the UI and the API. Modules communicate in-process.

**Consequences:**

- Positive: Failover copies one build. One test suite. Credentials stay in one place.
- Negative: The UI and the poller ship together even when only one changed.

### ADR-002: adsb.lol is the position provider, and nothing calls until config names it

**Status:** Accepted ([D0009](decisions.md), [D0003](decisions.md))

**Context:** Re-assessed for personal non-commercial use. OpenSky still needs a written licence for a live poll. The ADS-B Exchange community grant does not cover an always-on display. adsb.lol is ODbL.

**Decision:** The owner's deployment enables adsb.lol. The configuration must name it before any call. OpenSky and the ADS-B Exchange community and RapidAPI plans are not enabled. A fresh checkout with no config calls nobody.

**Consequences:**

- Positive: The default is a source the terms allow for this use. The app cannot boot into OpenSky.
- Negative: adsb.lol is a volunteer service. A commercial fork must make its own choice.

### ADR-003: Do not store a position history in v1

**Status:** Proposed

**Context:** A trail is attractive and turns the server into a database of movements. ODbL share-alike and retention both get sharper once that database is kept or published. Route rows are already forbidden as a store by [D0010](decisions.md).

**Decision:** Keep the latest poll in memory. Do not write route rows at all. A Planespotters JSON body may sit in memory for at most 24 hours and is not an export.

**Consequences:**

- Positive: Failover loses nothing that matters. The licence surface stays small.
- Negative: No "where was it a minute ago" unless a later version reopens the decision.

### ADR-004: The browser does not call flight-data APIs

**Status:** Proposed

**Context:** A key in the kiosk is a key on every screen, and a browser cannot be trusted to keep a home coordinate out of a third-party URL.

**Decision:** The kiosk calls Flyover. Flyover calls the providers.

**Consequences:**

- Positive: Keys and the tightest query stay on the server.
- Negative: The server must be up for the screen to be up. That is already true of the hosting plan.

### ADR-005: The profile is host config, not a database

**Status:** Accepted ([D0012](decisions.md)). Supersedes the SQLite-profile proposal.

**Context:** One house, one postcode. `webserver2` must serve that same house when `webserver1` cannot. A SQLite file on one disk does not do that. The owner required the postcode and the coordinates to live in runtime config.

**Decision:** The postcode, the resolved centre, and the radius are environment or runtime config on every serving host. They are not in git and not in SQLite. Do not add PostgreSQL for the profile.

**Consequences:**

- Positive: Failover of the profile is "the same env exists on `webserver2`". No database service.
- Negative: Someone must place that env on each host. How the browser's traffic moves is still [TRD-OQ3](#12-open-technical-questions).

---

## 12. Open Technical Questions

- [ ] **TRD-OQ1:** Accept TypeScript as one process (UI plus server), or name another stack?
  **Context:** The proposal is one language because the UI and the poller share a snapshot type. Python plus a separate UI is the main alternative. No application code is written until this is answered ([D0013](decisions.md)).

- [x] **TRD-OQ2:** Where does the display profile live so that `webserver2` can serve it when `webserver1` cannot?
  **Resolved by [D0012](decisions.md).** Runtime config or environment variables on each serving host, including `webserver2`. Not in git. Not only on `webserver1`.

- [ ] **TRD-OQ3:** How does traffic move from `webserver1` to `webserver2`?
  **Context:** DNS, an existing proxy, or a manual step are all possible. None is documented by the owner. No IP or hostname beyond the four server names is known. The profile location is decided. The cutover is not.

- [x] **TRD-OQ4:** Which position provider will this deployment enable?
  **Resolved by [D0009](decisions.md).** adsb.lol. OpenSky remains ineligible without a written licence, including for a non-commercial live display. The ADS-B Exchange community and RapidAPI plans remain ineligible for an always-on display.

- [x] **TRD-OQ5:** May Flyover cache adsbdb route rows?
  **Resolved by [D0010](decisions.md).** No. A live lookup may be shown and then discarded. A cache needs David J Taylor's permission first. Personal non-commercial use does not grant it.

- [ ] **TRD-OQ6:** Which map tile or style host may a kiosk load all day?
  **Context:** The public OpenStreetMap tile servers are not that host.

- [x] **TRD-OQ7:** What does the Planespotters photo API require?
  **Resolved by [D0011](decisions.md).** The API page was read on 2026-11-10. Credit, an obvious path to the photo page, no stored or proxied images, JSON cached at most 24 hours, descriptive User-Agent on server-side calls. airport-data, credited by adsbdb for photos, was not read and is not a candidate.

- [ ] **TRD-OQ8:** Does a home postcode stored on the owner's server bring a privacy regime (for example UK GDPR) into scope?
  **Context:** No regime was declared. The postcode and the centre are personal data either way. Minimisation in the security section stands.

- [ ] **TRD-OQ9:** Where does TLS for the kiosk terminate, and how are provider secrets provided on each server?
  **Context:** Required behaviour is HTTPS in production and secrets outside git. The mechanism is the owner's. Do not invent a secret manager. The profile itself is already host config ([D0012](decisions.md)).

- [ ] **TRD-OQ10:** Is there a CI system that should run the future test gate, or does the owner run it on `devserver1`?
  **Context:** The test strategy describes the stages. It does not add a workflow file.

---

## 13. Implementation Constraints

### Must Have

- No application code while the stack question is open ([D0013](decisions.md)).
- No provider calls until that provider is explicitly enabled. The one this deployment should enable for positions is adsb.lol.
- No credentials, UK postcode, home coordinates, or extra hostnames in the repository.
- Credits on the screen for every source that is enabled, including the postcode attribution when a centre is shown.
- A local ADS-B receiver is not required and is not implemented in v1.

### Won't Have (This Version)

- Radio hardware, `dump1090`, `readsb`, or a custom frame.
- A second household or a second profile.
- A position archive, a route database, alerts, dispatch, or anything a crew would use operationally.
- OpenSky, and the ADS-B Exchange community and RapidAPI plans, as position sources for this deployment.
- Copied airline logos.
- User accounts, unless PRD-OQ7 is answered by adding one.
- A second deployed service.

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-11-10 | 0.1 | Initial draft. Provider terms cited from pages retrieved that day. Stack and provider are proposed, not accepted. |
| 2026-11-10 | 0.2 | Re-assessed providers for personal non-commercial use. Default position provider is adsb.lol. Profile is a UK postcode in host config. |
