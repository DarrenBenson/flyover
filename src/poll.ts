import { bearingDegrees, milesBetween, queryNauticalMiles } from "./geo.ts";
import type { Aircraft } from "./types.ts";

export function adsbUrl(lat: number, lon: number, radiusMiles: number): string {
  const dist = queryNauticalMiles(radiusMiles);
  return `https://api.adsb.lol/v2/lat/${lat}/lon/${lon}/dist/${dist}`;
}

export function postcodeUrl(postcode: string): string {
  return `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function readAircraft(body: unknown, homeLat: number, homeLon: number, radiusMiles: number): Aircraft[] {
  if (!body || typeof body !== "object" || !Array.isArray((body as { ac?: unknown }).ac)) {
    throw new Error("adsb.lol payload has no aircraft list");
  }
  const rows = (body as { ac: unknown[] }).ac;
  const byId = new Map<string, Aircraft>();
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    const lat = numberOrNull(record.lat);
    const lon = numberOrNull(record.lon);
    const id = typeof record.hex === "string" ? record.hex.trim().toLowerCase() : "";
    if (lat == null || lon == null || !id) continue;
    const distanceMiles = milesBetween(homeLat, homeLon, lat, lon);
    if (distanceMiles > radiusMiles + 1e-6) continue;
    const callsign = typeof record.flight === "string" && record.flight.trim() ? record.flight.trim() : null;
    const onGround = record.alt_baro === "ground";
    const aircraft: Aircraft = {
      id,
      callsign,
      distanceMiles,
      bearingDeg: bearingDegrees(homeLat, homeLon, lat, lon),
      altitudeFeet: onGround ? null : numberOrNull(record.alt_baro),
      onGround,
      speedKnots: numberOrNull(record.gs),
      trackDeg: numberOrNull(record.track),
      typeCode: typeof record.t === "string" && record.t.trim() ? record.t.trim() : null,
    };
    const existing = byId.get(id);
    if (!existing || aircraft.distanceMiles < existing.distanceMiles) byId.set(id, aircraft);
  }
  return [...byId.values()].sort((a, b) => a.distanceMiles - b.distanceMiles || a.id.localeCompare(b.id));
}
