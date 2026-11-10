# EP-01M73FVS: Run the display as a kiosk on the owner's servers

> **Status:** Draft
> **Created:** 2026-11-10
> **Created-by:** sdlc-studio new
> **Raised-by:** sdlc-studio; agent; v1
> **Size:** M

## Summary

The live view is something a household can leave full screen. One build is what devserver1, stagingserver, webserver1, and webserver2 run. A failed provider does not blank the screen. How traffic fails over is still an open question.

## Story Breakdown

- [ ] [US-01M73FSE: Leave the live view running full screen](../stories/US-01M73FSE-leave-the-live-view-running-full-screen.md)
- [ ] [US-01M73F39: Keep the last good picture when the provider fails](../stories/US-01M73F39-keep-the-last-good-picture-when-the-provider.md)
- [ ] [US-01M73F7A: Promote one build across the owner's servers](../stories/US-01M73F7A-promote-one-build-across-the-owner-s-servers.md)

## Acceptance Criteria

- [ ] After setup, the live view needs no keyboard and has no hover-only control.
- [ ] The screen states that the data is not for navigation, and shows the credits for enabled sources.
- [ ] A failed position provider keeps a labelled last snapshot or an explicit degraded state.

## Revision History

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-10 | sdlc-studio | Created via `new` (deterministic) |
