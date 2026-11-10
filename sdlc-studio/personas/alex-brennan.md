# Alex Brennan

## Quick Reference

| Attribute | Value |
| --- | --- |
| **Cast role** | Secondary |
| **Role** | The person who installs the display and keeps it running |
| **Context** | Puts the URL on a screen, sets the location, and does not want the house address or a provider key in git |

## Who They Are

Alex is who Flyover is handed to on the day it is installed. Alex may also be Ruth, but the job is different: choose a location, pick a radius, point a browser at the URL, and leave it. Alex cares that the credits are on the screen, that the software's MIT licence is not mistaken for a licence to the flight data, and that a failed server does not require a redesign. Alex is not asking for a control panel.

## End Goals

1. Configure the location and the radius once, and have the live view keep using them.
2. Run the display without putting a secret or the home location in the repository, and without hiding where the data came from.
3. Know which browser is the supported kiosk, and know the screen is not offering itself as a navigation tool.

## Experience Goals

- Finished. Setup ends.
- Not exposed. The location is not the first line of a log.
- Legitimate. The credits match the sources that are actually enabled.

## Behaviours & Context

- **Environment:** The owner's servers (`devserver1`, `stagingserver`, `webserver1`, `webserver2`) and one screen in the house. Alex can follow a short operator note. Alex should not need to read the TRD on a Sunday.
- **Frequency:** Rarely after the first day, and again when a provider key rotates or a host fails over.
- **Proficiency:** Can set an environment variable and a full-screen browser. Will not write an adapter.

## Frustrations

- A sample configuration that contains someone's real home, or a real key.
- A dependency that seemed free and forbids a live display.
- A failover plan that exists only as a hostname with no shared profile.

## Scenario

Alex sets the home coordinates and a radius, enables the one position provider the owner has accepted, and opens the URL in Chromium's kiosk mode. The credits name that provider. The navigation line is on the screen. The key is on the server, not in the page source. Alex stops. The screen keeps running.
