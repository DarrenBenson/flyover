# Flyover

Flyover is a live display of aircraft flying over or near a place you configure. It is meant to sit on a screen you already have — a tablet, a spare monitor, a Raspberry Pi with a display, or a smart-TV browser — and show what is overhead now: airline, flight number, origin and destination, aircraft type, altitude, speed, distance and direction, plus a map.

Version 1 is a web app. It uses public online flight-data APIs. It does not need extra hardware or a radio receiver. An optional self-hosted ADS-B receiver (`dump1090` or `readsb` on a Pi) is a possible later extension, not part of this version.

Flyover is independent and open source (MIT). It is not affiliated with any framed-display product, airline, or flight-tracking network. The MIT licence covers this software. It does not license the flight data, photographs, or map tiles the app may show. Those stay under their own terms. See the technical requirements before wiring any provider into a running display.

There is no application code in the repository yet. This revision is the discovery set: what the product is, how it should be built and tested, and who it is for.

## Documents

SDLC Studio 6.3.0 owns the lifecycle. The skill is vendored for this repository at [`.agents/skills/sdlc-studio`](.agents/skills/sdlc-studio) (the project-local install Cursor, Codex, Gemini CLI, and Copilot read).

| Document | What it decides |
| --- | --- |
| [Product requirements](sdlc-studio/prd.md) | Who it is for, what v1 shows, what it refuses, and the open product questions |
| [Technical requirements](sdlc-studio/trd.md) | Shape of the system, provider options and their terms, and how `devserver1`, `stagingserver`, `webserver1`, and `webserver2` fit |
| [Test strategy](sdlc-studio/tsd.md) | How a later build will prove the display, the provider boundary, and a failed upstream |
| [Personas](sdlc-studio/personas/index.md) | The people the screen is designed for, and the working seats that will build and review it |
| [Epics](sdlc-studio/epics/_index.md) and [stories](sdlc-studio/stories/_index.md) | The first backlog decomposed from the PRD. Stories are Draft. Nothing is scheduled to build |
| [Decisions](sdlc-studio/decisions.md) | The few choices already fixed |

## Status

Discovery only. The provider, the stack, and how production fails over from `webserver1` to `webserver2` are open questions for the owner. They are listed in the PRD and the TRD. Do not treat the recommendations in those documents as a build instruction.

## Licence

[MIT](LICENSE). Copyright (c) 2026 Darren Benson.
