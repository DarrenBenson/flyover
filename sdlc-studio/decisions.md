# Project Decisions Log

The canonical, append-only home for load-bearing decisions every later artifact and
delegated agent inherits - both **product** decisions (scope cuts, the answers to the
PRD's open questions) and **implementation conventions** (error-envelope shape, ID scheme,
token strategy, migration style, test harness). One record, two views: an open question
lives in `PRD §Open Questions`; when resolved it is promoted here with a back-link, never
duplicated as free text in both. This block is injected into the handoff context delegated
agents read, so a decision is referenced once, not pasted N times.

## Decisions

| ID | Decision | Rationale | Status | Supersedes | Date |
| --- | --- | --- | --- | --- | --- |
| D0001 | Version 1 is the API web app. No radio, no custom frame, and no other extra hardware. | The owner scoped v1 to online flight-data APIs on a screen they already have. A self-hosted dump1090 or readsb receiver is a later extension, not this version. | accepted | -- | 2026-11-10 |
| D0002 | Changes integrate on main. release_strategy is trunk. | Stated in sdlc-studio/.config.yaml. It is the SDLC Studio 6.3.0 default, written explicitly so the file shows the strategy. | accepted | -- | 2026-11-10 |
| D0003 | The software is MIT. Upstream flight data, photos, and map tiles are not. | The repository licence does not grant the provider terms. A source stays disabled until the owner enables it. | accepted | -- | 2026-11-10 |
| D0004 | This revision is discovery only. No application code ships with it. | The stack, the position provider, and production failover are still open questions. Stories stay Draft until those are answered. | accepted | -- | 2026-11-10 |

## Notes

- Decisions are numbered globally and zero-padded: `D{NNNN}`.
- Append with `scripts/decisions.py add`; list with `scripts/decisions.py list`.
- `Status`: `accepted` | `superseded` | `revisited`. A superseding decision names the one
  it replaces in `Supersedes`.
- Distinct from the sprint per-tranche ledger (`scripts/ledger.py`), which is scoped to
  a single delivery run; this is the durable project spine.
