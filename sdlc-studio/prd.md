# Product Requirements Document

**Project:** Flyover
**Version:** 0.1
**Last Updated:** 2026-11-10
**Status:** Draft

---

## 1. Project Overview

### Product Name

Flyover

### Purpose

Flyover is a live display of aircraft currently flying over or near a configured home location. A person glances at a screen they already own and can tell which aircraft is there, where it is going, and how far away it is. The screen is a kiosk-mode browser. Version 1 gets its data from online flight-data APIs. It does not include a radio, a custom frame, or any other hardware.

The idea is in the same family as a framed Wi-Fi flight display that looks up traffic from a street address. Flyover is an independent MIT-licensed project. It does not use that product's name, branding, copy, or assets, and it is not affiliated with it. [HIGH]

### Tech Stack

Not selected. No application code exists. The TRD proposes one web application and records the choice as an open question for the owner. [MEDIUM]

### Architecture Pattern

A single web application, proposed and not yet accepted. See the TRD. [MEDIUM]

---

## 2. Problem Statement

### Problem Being Solved

People who live under a flight path can hear or see an aircraft and have no calm way to know what it is. Phone apps can answer, but they ask for a tap, a search, and attention. A display that is already on, already aimed at the home, and already limited to "what is near here" answers the glance. [HIGH]

### Target Users

The design target is the person who lives with the screen (see [Ruth Okonkwo](personas/ruth-okonkwo.md)). Two other people shape v1 without getting their own interface: the household member who wants the identity of the aircraft to be right ([Samir Rahman](personas/samir-rahman.md)), and the person who sets the location and keeps the screen running ([Alex Brennan](personas/alex-brennan.md)). Flyover is explicitly not a tool for airline operations or navigation ([Jordan Hale](personas/jordan-hale.md)). [HIGH]

### Context

The owner will build and run Flyover on their own servers: `devserver1` for development, `stagingserver` for staging, `webserver1` for production, and `webserver2` as production failover. The display itself is a browser on whatever screen the household points at the URL. Version 1 is the API-backed web app only. [HIGH]

---

## Outcomes

- **O1:** A person at home can glance at a screen and tell what is flying over, without opening another app. (Ruth Okonkwo, End goal 1)
- **O2:** Every fact on the screen is either current or marked stale, and a missing fact stays missing rather than being invented. (Ruth Okonkwo, End goal 2; Samir Rahman, End goal 1)
- **O3:** The display is configured once and then left running on an ordinary screen. (Ruth Okonkwo, End goal 3; Alex Brennan, End goal 1)
- **O4:** The software can be published under MIT without implying that the flight data, photos, or map tiles are MIT-licensed. (Alex Brennan, End goal 2)

---

## 3. Feature Inventory

| Feature | Description | Status | Priority | Location |
|---------|-------------|--------|----------|----------|
| Home and radius | One configured location and a radius around it | Not Started | Must | Setup |
| Overhead list | Aircraft inside the radius, nearest first | Not Started | Must | Display |
| Flight facts | Airline, flight number, origin, destination, type, altitude, speed, distance, direction | Not Started | Must | Display |
| Livery, narrowly | Airline name, and an optional attributed photo of the airframe. Not a copied logo | Not Started | Must | Display |
| Map | Home, radius, and the same aircraft as the list | Not Started | Must | Map |
| Honest emptiness | A clear sky, a stale feed, and a failed provider each look different | Not Started | Must | Display |
| Attribution | Provider, photographer, and map credits the terms require, on the screen | Not Started | Must | Display |
| Kiosk layout | Readable across the room, usable without a keyboard after setup | Not Started | Must | Display |
| Not for navigation | The screen says the data is not for navigation or operational decisions | Not Started | Must | Display |

### Feature Details

#### Home and radius

**User Story:** As Alex, I want to set the home location and a radius once so that the screen watches the right patch of sky.

**Serves:** Alex Brennan, Ruth Okonkwo

**Acceptance Criteria:**

- [ ] A display profile stores a latitude, a longitude, and a radius, and the live view uses that profile.
- [ ] Changing the profile changes which aircraft qualify, without a code change.
- [ ] The stored location is not written into the git repository.

**Dependencies:** How the operator enters the location (coordinates, a one-shot address lookup, or both) is [PRD-OQ2](#14-open-questions).
**Status:** Not Started
**Confidence:** [HIGH] that a location and a radius are required. [LOW] on the entry method.

#### Overhead list

**User Story:** As Ruth, I want the aircraft near home listed with the closest first so that I can see what just went over.

**Serves:** Ruth Okonkwo

**Acceptance Criteria:**

- [ ] Only aircraft inside the configured radius appear.
- [ ] The list is ordered by distance from home, nearest first.
- [ ] The list updates from a successful position response without a manual refresh, and shows how old the data is.

**Dependencies:** A position provider the owner has accepted. See the TRD.
**Status:** Not Started
**Confidence:** [HIGH]

#### Flight facts

**User Story:** As Samir, I want the airline, flight number, origin, destination, aircraft type, altitude, speed, distance, and direction so that the screen identifies the aircraft instead of only plotting a dot.

**Serves:** Samir Rahman, Ruth Okonkwo

**Acceptance Criteria:**

- [ ] The selected aircraft shows each of those fields when the data exists.
- [ ] A field the providers do not know is shown as unknown. The app does not guess a route, a type, or an airline.
- [ ] Distance and direction are computed from the home location and the aircraft position.
- [ ] Altitude and speed use the units the profile selects. The default unit set is an open question ([PRD-OQ3](#14-open-questions)).

**Dependencies:** Position feed plus a route and aircraft lookup whose terms allow this use.
**Status:** Not Started
**Confidence:** [HIGH] on the field list. [MEDIUM] on which provider can legally supply each field.

#### Livery, narrowly

**User Story:** As Ruth, I want to recognise the aircraft the way I would on the ground — whose aeroplane, and a picture if one may be shown — so that the screen matches what I can see.

**Serves:** Ruth Okonkwo, Samir Rahman

**Acceptance Criteria:**

- [ ] The airline is shown as a name.
- [ ] If a photo is shown, the photographer is credited and the thumbnail links to the source page, and the image bytes are not copied onto Flyover's servers.
- [ ] Airline logos and livery artwork are not copied into the product. A decorative colour that is not a trademarked mark is allowed only if the owner accepts that treatment ([PRD-OQ4](#14-open-questions)).

**Dependencies:** A photo source with terms that allow this display. Logos are out of scope until a licence exists.
**Status:** Not Started
**Confidence:** [HIGH] that unlicensed logos are out. [MEDIUM] on the photo source.

#### Map

**User Story:** As Ruth, I want a map of home and the aircraft so that "over there" is obvious.

**Serves:** Ruth Okonkwo, Samir Rahman

**Acceptance Criteria:**

- [ ] The map marks home, the radius, and each listed aircraft.
- [ ] Selecting an aircraft on the map selects it in the list, and the reverse.
- [ ] The map uses a tile source whose terms allow a long-running display. The public OpenStreetMap tile servers are not that source.

**Dependencies:** Tile provider. Open question [TRD-OQ6](trd.md#12-open-technical-questions) in the TRD.
**Status:** Not Started
**Confidence:** [HIGH]

#### Honest emptiness

**User Story:** As Ruth, I want an empty sky to look empty, and a dead feed to look dead, so that I do not trust a picture that has stopped.

**Serves:** Ruth Okonkwo

**Acceptance Criteria:**

- [ ] Zero aircraft inside the radius shows an explicit empty state, not a blank widget and not a sample aircraft.
- [ ] Data older than the stale threshold is labelled with its age and is not presented as live.
- [ ] A failed provider keeps the last good snapshot, labelled as stale, or shows a degraded state if there is no snapshot. It does not spin forever with no explanation.

**Dependencies:** None beyond the display.
**Status:** Not Started
**Confidence:** [HIGH] on the behaviour. The stale threshold is a proposed 60 seconds and is open ([PRD-OQ5](#14-open-questions)).

#### Attribution

**User Story:** As Alex, I want the credits the data licences require to be on the screen so that running Flyover does not hide where the data came from.

**Serves:** Alex Brennan

**Acceptance Criteria:**

- [ ] The position provider, the route source, the photo credit, and the map credit are visible without reading the source code.
- [ ] Credits follow the wording the source requires when that wording is known.

**Dependencies:** The provider decision in the TRD.
**Status:** Not Started
**Confidence:** [HIGH]

#### Kiosk layout

**User Story:** As Ruth, I want type I can read from across the room, on a browser left in full screen, so that the display does not feel like a website I have to operate.

**Serves:** Ruth Okonkwo

**Acceptance Criteria:**

- [ ] The live view has no hover-only control.
- [ ] After setup, the live view does not require a keyboard.
- [ ] The layout is specified against a current Chromium in kiosk mode. Other browsers are best-effort until the owner names one ([PRD-OQ6](#14-open-questions)).

**Dependencies:** None.
**Status:** Not Started
**Confidence:** [HIGH]

#### Not for navigation

**User Story:** As Alex, I want the screen to say that this is not for navigation so that nobody treats a hobby display as an operational system.

**Serves:** Alex Brennan

**Acceptance Criteria:**

- [ ] The live view carries a short statement that the data can be incomplete or delayed and must not be used for navigation or operational decisions.
- [ ] The product does not offer alerting, dispatch, or separation functions.

**Dependencies:** None.
**Status:** Not Started
**Confidence:** [HIGH]

---

## 4. Functional Requirements

### Core Behaviours

1. One display profile: a location, a radius, and a unit preference. Version 1 does not require accounts. Whether one deployment holds one profile or several is [PRD-OQ1](#14-open-questions).
2. On a timer, the server asks a position provider for aircraft in a box around the home and keeps those inside the radius.
3. The screen lists them nearest-first and shows the flight facts for the selected one.
4. The map shows the same set. Selection is shared.
5. Enrichment (airline, flight number, origin, destination, type, photo) is best-effort and nullable. Failure of enrichment does not remove the aircraft from the list.
6. The screen always shows the age of the position data and the required credits.
7. Setup is separate from the live view. The live view is the thing left on the screen.

### Input/Output Specifications

Input is the display profile plus whatever the chosen providers return. Output is the kiosk view. There is no public write API in v1. There is no export, no history browser, and no notification channel.

A position record the screen is willing to show has: a stable aircraft identifier (ICAO 24-bit address when the feed has one), a position, an observation time, and a named source. Callsign, altitude, speed, and heading are optional on the feed and shown when present. Distance and direction are derived, not fetched.

### Business Logic Rules

- Inside the radius means great-circle distance from the configured point, less than or equal to the radius.
- Aircraft with no position are not listed.
- Duplicate identifiers in one poll collapse to one row.
- The app never fabricates an origin, destination, airline, or type.
- Position history is not a v1 feature. A dot is where the aircraft was at the last accepted poll.
- The future local-receiver idea is not a code path in v1. See Won't Have.

---

## 5. Non-Functional Requirements

### Performance

Proposed, and open under [PRD-OQ5](#14-open-questions): after a successful position response, the list and map reflect it within 15 seconds on a current Chromium running on modest hardware (a Raspberry Pi-class browser is the intended low end). The poll interval must also respect the provider's rate limit. The limit wins if the two disagree. [MEDIUM]

### Security

- Provider credentials never ship to the browser and never enter git.
- The home location is personal data. It is operator configuration, not a sample file.
- The browser talks to Flyover's server. It does not call upstream flight APIs with a key.
- No analytics and no third-party tracker in v1.
- Production transport security (TLS terminated on the owner's servers) is expected and the mechanism is an open question in the TRD.

### Scalability

Version 1 is a small deployment the owner runs, not a multi-tenant public service. The design must not assume a fleet of servers beyond `webserver1` and `webserver2`. Load is one or a few kiosk browsers polling a cached snapshot, not one request per visitor to the upstream API. [HIGH] on the constraint. Whether "a few" means one household or several displays is [PRD-OQ1](#14-open-questions).

### Availability

There is no contractual uptime target. The product requirement is degradation, not a percentage: the screen keeps painting, and a failed upstream is visible. How `webserver2` takes over from `webserver1` is an open infrastructure question in the TRD, not a product SLA. [HIGH]

---

## 6. AI/ML Specifications

Not applicable. Flyover does not classify images, predict tracks, or call a model. Missing flight facts stay unknown.

---

## 7. Data Architecture

### Data Models

- **Display profile.** Label, latitude, longitude, radius, unit set. One in v1 unless [PRD-OQ1](#14-open-questions) says otherwise.
- **Aircraft snapshot.** Identifier, callsign, latitude, longitude, altitude, speed, heading, observed-at, source name. Ephemeral.
- **Enrichment.** Airline name, flight number, origin, destination, aircraft type, registration. Each field independently present or unknown, with the source named.
- **Photo reference.** Remote thumbnail URL, photographer, link to the source page, fetched-at. Not the image bytes.

### Relationships and Constraints

A snapshot belongs to a poll of one profile. Enrichment hangs off the aircraft identifier and the callsign, and may be missing. The photo hangs off the identifier and may be missing. Deleting a profile deletes the reason to poll. Nothing in v1 is a personal dossier of a pilot or a passenger. The screen shows aircraft, not people.

### Storage Mechanisms

Proposed in the TRD: the profile and a short-lived enrichment cache on the server; positions kept in memory for the last good poll. Not a flight archive. The owner has not accepted the store.

---

## 8. Integration Map

### External Services

Evaluated in the TRD, not selected here:

- A live position feed (candidates include adsb.lol, OpenSky Network, ADS-B Exchange).
- A route and aircraft lookup (candidate: adsbdb), if the terms allow display without building a second route database.
- An aircraft photo source (candidate: Planespotters thumbnails), if the conditions can be met.
- Map tiles from a provider that allows a kiosk, not the public OpenStreetMap tile servers.
- An optional one-shot geocoder if address entry is in scope ([PRD-OQ2](#14-open-questions)).

### Authentication Methods

No end-user accounts in the proposal. Whether the setup page is open on the network or gated by something the owner already runs is [PRD-OQ7](#14-open-questions). Upstream APIs use whatever that provider requires (anonymous, API key, or a written licence). Keys stay on the server.

### Third-Party Dependencies

None are locked. The TRD lists the licence, rate-limit, attribution, and commercial-use risks for each candidate. Those risks are product risks: a provider that forbids a live product cannot be the default, however convenient the API is.

---

## 9. Configuration Reference

### Environment Variables

Names are illustrative. Nothing here is implemented, and no secret value belongs in this document.

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| Home latitude and longitude | The point the radius is measured from | Yes | None |
| Radius | How far "near home" reaches | Yes | Unset until [PRD-OQ3](#14-open-questions) |
| Position provider | Which feed is enabled | Yes | None enabled until the owner chooses |
| Provider credential | Key or token, when the chosen provider needs one | When the provider requires it | None |
| Photo and route toggles | Whether enrichment is attempted | No | Off until the terms are accepted |

### Feature Flags

- Route enrichment: off until the route source's terms are accepted.
- Photos: off until the photo source's terms are accepted.
- Local ADS-B receiver: absent in v1. Not a flag yet.

---

## 10. Quality Assessment

### Tested Functionality

Nothing. There is no application code and no test suite. The test strategy is in [tsd.md](tsd.md). Coverage figures there are targets, not measurements.

### Untested Areas

The entire product.

### Technical Debt

None yet. The debt to avoid is shipping a provider the terms do not allow, and storing a route database the route source forbids.

---

## 11. Technical Debt Register

No code, so no debt. The debt to avoid, recorded here so it is not only a test note: enabling a provider whose terms do not allow a live display, and storing route rows the route source forbids copying into another database.

---

## 12. Documentation Gaps

- No operator runbook yet. Deployment steps wait on the failover and secrets questions in the TRD.
- No user-facing help. The kiosk is supposed to need none after setup. Setup itself is not designed beyond the requirements above.
- Provider terms were read on 2026-11-10. They change. The TRD records the URLs so the next reader can check.

---

## 13. Recommendations

1. Build the glanceable display for Ruth first. Samir's extra detail is one selection away, not a second product. Alex's installer needs are setup and credits, not a separate interface.
2. Do not enable a position provider until the owner answers [PRD-OQ8](#14-open-questions) and the matching TRD question. OpenSky's published terms do not allow this live display without a written licence.
3. Keep v1 to the API web app. Do not start a receiver, a frame, or a hardware BOM.
4. Leave the stories in Draft until the provider and the stack questions are answered. They are a backlog, not a sprint commitment.

---

## 14. Open Questions

These are for the owner. Recommendations sit in the TRD. Nothing in this list is decided. A resolution is promoted into the decisions log with `decisions.py promote --from PRD-OQn`. The question stays here.

- **PRD-OQ1:** Is one deployment one household (one profile), or several displays with their own locations on the same servers?
  **Context:** It changes storage, setup, and whether failover must share a database.
  **Options:** One profile per deployment. Several profiles, still private to the owner. A public signup service (this PRD assumes that is out of v1).

- **PRD-OQ2:** How does the operator enter the location?
  **Context:** Coordinates are precise and need no extra provider. A street address is what a household expects and needs a geocoder with its own terms.
  **Options:** Coordinates only. Address lookup once at setup, result stored as coordinates. Both.

- **PRD-OQ3:** What is the default radius, and are the on-screen units aviation (feet, knots, nautical miles) or household (metres, kilometres per hour)?
  **Context:** The feeds speak in aviation units. The person glancing from the kitchen may not.
  **Options:** Aviation units. Household units. Operator choice, with a named default.

- **PRD-OQ4:** Does "livery" mean the airline name plus an optional photo, or is a colour treatment or a licensed mark required?
  **Context:** Logos are trademarks. The safe v1 is the name and a credited photo.
  **Options:** Name and credited photo only. Name plus a non-mark colour. Licensed marks, which need a source the owner has rights to.

- **PRD-OQ5:** Are the proposed timings acceptable: reflect a successful poll within 15 seconds, and label data older than 60 seconds as stale?
  **Context:** A tighter loop can break a provider's rate limit. The limit wins, but the owner should set the product bar.
  **Options:** Accept the proposal. Name different numbers.

- **PRD-OQ6:** Which browser is the kiosk the owner will actually leave running?
  **Context:** The requirement is specified against current Chromium. Smart-TV browsers vary.
  **Options:** Chromium on the display device. A named TV browser. More than one, in which case each needs a check.

- **PRD-OQ7:** Who can open the setup page and the live view?
  **Context:** A kiosk URL on a home LAN is a different exposure from a URL on the public internet that reveals a home location.
  **Options:** Reachable only on the owner's network. A secret the owner provisions outside git. Something else the owner already uses. No sign-in, and the owner accepts the exposure.

- **PRD-OQ8:** Will anyone besides the owner run this, including commercially?
  **Context:** The code is MIT. Several candidate data sources forbid commercial use or any live product without a separate licence. The answer changes which provider is even eligible. Detail is in the TRD.
  **Options:** Owner-operated, non-commercial. Anyone may run it, including commercially, so only sources that allow that are eligible. Decide per deployment.

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-11-10 | 0.1 | Initial draft from the product brief. No code to extract. |

---

> **Confidence Markers:** [HIGH] stated in the brief or checked against a persona goal | [MEDIUM] a recommendation the owner has not accepted | [LOW] a guess
>
> **Status Values:** Complete | Partial | Stubbed | Broken | Not Started
