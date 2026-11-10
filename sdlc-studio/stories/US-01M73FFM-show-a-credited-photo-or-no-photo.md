# US-01M73FFM: Show a credited photo or no photo

> **Status:** Ready
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73FH0
> **Points:** 3
> **Persona:** Samir Rahman
> **Affects:** sdlc-studio/trd.md, tests/fixtures/photo-credit.json

## User Story

**As an** aviation enthusiast in the house (Samir Rahman)
**I want** a picture of the airframe only when the photographer is credited and the original is easy to open
**So that** the screen does not pretend a logo is a livery we have rights to

## Acceptance Criteria

- **AC1:** Given photos enabled and a photo reference, when the detail renders, then the photographer's name is visible beside the image and the path to the returned link URL is obvious.
  - **Verify:** manual Render a fixture photo and follow the anchor, or scan the QR, to the fixture link URL.
- **AC2:** Given a display that cannot follow a tap, when a photo is shown, then a QR code or NFC target carries that same link URL, and the URL as text alone is not the only path.
  - **Verify:** manual Render the non-clickable fixture and confirm the QR or NFC payload equals the link URL.
- **AC3:** Given no photo reference, when the detail renders, then no image and no airline logo is shown.
  - **Verify:** manual Render a fixture with an empty photos array and confirm the absence of an image and of a logo.
- **AC4:** Given a photo is shown, when the server store is inspected, then the image bytes were not saved and the thumbnail URL was not rewritten.
  - **Verify:** manual Confirm the server did not write an image file and the image request goes to the fixture thumbnail host.

Photos stay off until configuration names them ([D0011](../decisions.md)).

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | Matched to the Planespotters photo API page read on 2026-11-10. |
