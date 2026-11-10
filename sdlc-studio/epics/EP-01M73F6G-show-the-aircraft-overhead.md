# EP-01M73F6G: Show the aircraft overhead

> **Status:** Draft
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Size:** L

## Summary

The live list for one house: which aircraft are inside the radius of the postcode centre, what is known about the selected one, and an honest empty or stale screen. Serves Ruth Okonkwo's glance and Samir Rahman's demand that unknown stays unknown.

## Story Breakdown

- [x] [US-01M73FFG: Set the home location and radius](../stories/US-01M73FFG-set-the-home-location-and-radius.md)
- [x] [US-01M73FBE: List aircraft inside the radius](../stories/US-01M73FBE-list-aircraft-inside-the-radius.md)
- [ ] [US-01M73FJV: Show the flight facts for the selected aircraft](../stories/US-01M73FJV-show-the-flight-facts-for-the-selected-aircraft.md)
- [x] [US-01M73FRX: Tell an empty sky from a stale feed](../stories/US-01M73FRX-tell-an-empty-sky-from-a-stale-feed.md)

## Acceptance Criteria

- [ ] The list includes only aircraft within the configured radius, nearest first.
- [ ] Each flight fact is shown when known and shown as unknown when it is not. The app does not invent a route, a type, or an airline.
- [ ] An empty sky and a stale feed are visibly different, and neither looks like a live aircraft.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
| 2026-11-10 | sdlc-studio | One house, postcode centre. |
