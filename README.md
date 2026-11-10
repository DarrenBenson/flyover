# Flyover

Flyover is a live display of aircraft flying over or near one house. It is meant to sit on a screen you already have — a tablet, a spare monitor, a Raspberry Pi with a display, or a smart-TV browser — and show what is overhead now: airline, flight number, origin and destination, aircraft type, altitude, speed, distance and direction, plus a map.

The house is a UK postcode and a radius, kept in the server environment. The postcode is turned into a map centre. Neither the postcode nor the centre belongs in git.

Version 1 is a web app. It uses online flight-data APIs. It does not need extra hardware or a radio receiver. An optional self-hosted ADS-B receiver (`dump1090` or `readsb` on a Pi) is a possible later extension, not part of this version.

The owner's deployment is a personal, non-commercial hobby. Flyover is independent and open source (MIT). It is not affiliated with any framed-display product, airline, or flight-tracking network. The MIT licence covers this software. It does not license the flight data, photographs, map tiles, or postcode data the app may show. A fork that is used commercially has to re-clear every one of those sources. The findings in the technical requirements are for this deployment, not a grant that travels with the code.

For this deployment the default position feed is [adsb.lol](https://www.adsb.lol/docs/open-data/api). OpenSky still needs a written licence before a live display may poll it, commercial or not. The ADS-B Exchange community and RapidAPI plans do not cover an always-on screen. See the technical requirements before enabling anything.

There is no application code in the repository yet. This revision is the discovery set: what the product is, how it should be built and tested, and who it is for.

## Documents

SDLC Studio 6.3.0 owns the lifecycle. The skill is vendored for this repository at [`.agents/skills/sdlc-studio`](.agents/skills/sdlc-studio) (the project-local install Cursor, Codex, Gemini CLI, and Copilot read).

| Document | What it decides |
| --- | --- |
| [Product requirements](sdlc-studio/prd.md) | Who it is for, what v1 shows, what it refuses, and the open product questions |
| [Technical requirements](sdlc-studio/trd.md) | Shape of the system, provider options and their terms, and how `devserver1`, `stagingserver`, `webserver1`, and `webserver2` fit |
| [Test strategy](sdlc-studio/tsd.md) | How a later build will prove the display, the provider boundary, and a failed upstream |
| [Personas](sdlc-studio/personas/index.md) | The people the screen is designed for, and the working seats that will build and review it |
| [Epics](sdlc-studio/epics/_index.md) and [stories](sdlc-studio/stories/_index.md) | The backlog. Some stories are Ready. The ones that still need a decision stay Draft |
| [Decisions](sdlc-studio/decisions.md) | What the owner has already fixed, including the provider and the one house |

## Status

Discovery, with the household and the data sources decided for this deployment. There is still no application code. The stack, the on-screen units, who may open the live view, the map tile host, and how traffic moves from `webserver1` to `webserver2` are open. They are listed in the PRD and the TRD.

The position feed to enable is adsb.lol. OpenSky is not eligible for this live display without a written licence. The ADS-B Exchange community and RapidAPI plans are not eligible for an always-on screen. Do not treat a commercial fork as covered by those findings.

## Licence

[MIT](LICENSE). Copyright (c) 2026 Darren Benson.
