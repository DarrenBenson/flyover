# Project Personas

Personas for Flyover. The Primary, Secondary, and Negative sections are the design-persona registry. The working seats below are a headless generation: provisional, not accepted.

**Last updated:** 2026-11-10

---

## Primary

- [Ruth Okonkwo](ruth-okonkwo.md) - Lives with the screen and wants a glanceable answer that admits when it has stopped.

## Secondary

- [Samir Rahman](samir-rahman.md) - Wants the selected aircraft's identity to be true, including when a field is unknown.
- [Alex Brennan](alex-brennan.md) - Installs the display, sets the location, and keeps secrets and credits honest.

## Negative

- [Jordan Hale](jordan-hale.md) - Wants alerts, navigation, or an operational picture. Flyover does not design for that.

---

## How the cast was chosen

Ruth is Primary because a screen designed for her End Goals (glance, honest freshness, set once) also covers Samir if the detail is one selection away, and covers Alex if setup finishes and the credits stay visible. Samir and Alex each need one or two additions, so they are Secondary. Jordan is satisfied by none of that design, and serving him would change the product, so he is the Negative. One interface, so one Primary. The owner has not confirmed this cast. [PRD-OQ](../prd.md#14-open-questions) does not ask it as a numbered question because the cast is editable: change a card and the registry bullet, and do not regenerate over an edited card.

## Working seats

Headless team generation from the PRD and the TRD. Nobody was asked. The stamp on each card is `provisional-unverified`. `persona review` or `persona_gen.py accept` is how the owner accepts them. The shipped Dani, Sam, and Lena cards remain the fallback until then.

Discoveries, each marked with how it was settled:

| Signal | Value | How settled |
| --- | --- | --- |
| Domain | One household, one UK postcode, a live display of nearby aircraft | Owner answer, D0006 and D0007 |
| Stack | TypeScript monolith proposed, not accepted | Defaulted. TRD-OQ1 is open |
| Risk class | The UK postcode and the resolved centre are personal data. Not money, not health, not a contractual uptime SLA | Owner answer, D0007. Mapped to the privacy side of the PII class, with no health regime |
| Compliance | No sector regime declared. Minimise the location anyway | Defaulted. TRD-OQ8 is open |
| Extra seats | Security added. A UX seat was folded into Product rather than added | Defaulted. Security is the strong signal (coordinates and provider keys). A fifth UX seat was not added |
| Quality bar | Unit 90, integration 85, feature coverage 100 | Defaulted from the skill defaults |

### Product

| Persona | Role | Summary | File |
|---------|------|---------|------|
| Helen Cho | Product | Guards the single glanceable screen | [Details](seats/helen-cho.md) |

### Engineering

| Persona | Role | Summary | File |
|---------|------|---------|------|
| Mara Ellison | Engineering | One deployable, providers off until enabled | [Details](seats/mara-ellison.md) |

### QA

| Persona | Role | Summary | File |
|---------|------|---------|------|
| Jonah Adeyemi | QA | Empty, stale, and down are different tests | [Details](seats/jonah-adeyemi.md) |

### Security

| Persona | Role | Summary | File |
|---------|------|---------|------|
| Nadia Kovacs | Security | The secret is the home location and the provider key | [Details](seats/nadia-kovacs.md) |

## Consultation Defaults

| Artefact | Team | Stakeholders |
| ---------- | ------ | -------------- |
| PRD | Product | Ruth, Alex |
| Epic | Product, Engineering | The persona the epic names |
| User Story | Product | The story's persona |
| Technical Spec | Engineering, Security | Alex, where a location or a key is involved |
| Test Strategy | QA | Alex, for the failover rehearsal |

## Persona Sources

| Source | Count | Notes |
| -------- | ------- | ------- |
| Archetypes | 0 | No shipped sample persona was copied in |
| Generated | 4 | Working seats, provisional |
| Imported | 0 | |
| Custom | 4 | Design cast written for this product |
