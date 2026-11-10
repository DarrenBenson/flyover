# Alex Brennan

## Quick Reference

| Attribute | Value |
| --- | --- |
| **Cast role** | Secondary |
| **Role** | The person who installs the display and keeps it running |
| **Context** | Puts the URL on a screen in the one house, sets the UK postcode and the radius in the server environment, and does not want that postcode or a provider key in git |

## Who They Are

Alex is who Flyover is handed to on the day it is installed, for this one house. Alex may also be Ruth, but the job is different: put the UK postcode and a radius in the server environment, point a browser at the URL, and leave it. Alex cares that the credits are on the screen, that the software's MIT licence is not mistaken for a licence to the flight data, and that a failed server does not require a redesign. Alex is not asking for a control panel, and not for a second house.

## End Goals

1. Configure the one UK postcode and the radius once, in host config, and have the live view keep using the resolved centre.
2. Run the display without putting a secret, the postcode, or the centre in the repository, and without hiding where the data came from.
3. Know which browser is the supported kiosk, and know the screen is not offering itself as a navigation tool.

## Experience Goals

- Finished. Setup ends.
- Not exposed. The postcode is not the first line of a log, and it is not in git.
- Legitimate. The credits match the sources that are actually enabled.

## Behaviours & Context

- **Environment:** The owner's servers (`devserver1`, `stagingserver`, `webserver1`, `webserver2`) and one screen in the house. Alex can follow a short operator note. Alex should not need to read the TRD on a Sunday.
- **Frequency:** Rarely after the first day, and again when a provider key rotates or a host fails over.
- **Proficiency:** Can set an environment variable and a full-screen browser. Will not write an adapter.

## Frustrations

- A sample configuration that contains a real postcode, a real centre, or a real key.
- A dependency that seemed free and still forbids this live display. OpenSky is that case even though the project is non-commercial.
- A failover plan that moves traffic and forgets to put the same postcode on `webserver2`.

## Scenario

Alex sets the UK postcode and a radius in the server environment, enables adsb.lol, and opens the URL in Chromium's kiosk mode. The screen resolves the postcode through postcodes.io and shows that attribution. The credits name adsb.lol. The navigation line is on the screen. The postcode is on the server, not in the page source and not in git. Alex stops. The screen keeps running.
