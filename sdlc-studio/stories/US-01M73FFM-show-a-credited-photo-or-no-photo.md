# US-01M73FFM: Show a credited photo or no photo

> **Status:** Draft
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Epic:** EP-01M73FH0
> **Points:** 3
> **Persona:** Samir Rahman

## User Story

**As an** aviation enthusiast in the house (Samir Rahman)
**I want** a picture of the airframe only when it can be credited
**So that** the screen does not pretend a logo is a livery we have rights to

## Acceptance Criteria

- **AC1:** Given a photo reference with a photographer and a link, when the detail renders, then the thumbnail is credited and the credit links to the source page.
  - **Verify:** manual Render a fixture photo reference and follow the credit link.
- **AC2:** Given no photo reference, when the detail renders, then no image and no airline logo is shown.
  - **Verify:** manual Render a fixture with no photo and confirm the absence of an image and of a logo.
- **AC3:** Given a photo is shown, when the server store is inspected, then the image bytes were not saved.
  - **Verify:** manual Confirm the server did not write an image file for that aircraft.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
