# EP-01M73FH0: Obtain flight facts within the data licences

> **Status:** Draft
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Size:** L

## Summary

Position data for this deployment comes from adsb.lol, and only when configuration names it. Route facts come from a live adsbdb lookup that is not stored. Photos come from Planespotters when configuration names them, with the credit and the path back. A disabled provider is not called.

## Story Breakdown

- [ ] [US-01M73F8A: Poll only a position provider the configuration has enabled](../stories/US-01M73F8A-poll-only-a-position-provider-the-configuration-has.md)
- [ ] [US-01M73FSQ: Show route and airline facts without storing a route database](../stories/US-01M73FSQ-show-route-and-airline-facts-without-storing-a.md)
- [ ] [US-01M73FFM: Show a credited photo or no photo](../stories/US-01M73FFM-show-a-credited-photo-or-no-photo.md)

## Acceptance Criteria

- [ ] No upstream position call is made unless that provider is enabled in configuration.
- [ ] Route and airline enrichment never invents a missing field, and does not export a route database.
- [ ] A photo is shown only with its credit and link, and the image bytes are not stored on the Flyover server.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | adsb.lol, live routes, credited photos. |
