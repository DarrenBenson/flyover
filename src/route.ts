export type RouteFacts = {
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
};

export function routeUrl(callsign: string): string {
  return `https://api.adsbdb.com/v0/callsign/${encodeURIComponent(callsign)}`;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function placeName(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const place = value as Record<string, unknown>;
  return text(place.name) ?? text(place.municipality) ?? text(place.iata_code) ?? text(place.icao_code);
}

export function readRoute(body: unknown): RouteFacts | null {
  if (!body || typeof body !== "object") return null;
  const route = (body as { response?: { flightroute?: unknown } }).response?.flightroute;
  if (!route || typeof route !== "object") return null;
  const record = route as Record<string, unknown>;
  const airline = record.airline && typeof record.airline === "object"
    ? text((record.airline as Record<string, unknown>).name)
    : null;
  const flightNumber = text(record.callsign_iata) ?? text(record.callsign);
  const origin = placeName(record.origin);
  const destination = placeName(record.destination);
  if (!airline && !flightNumber && !origin && !destination) return null;
  return {
    airline: airline ?? "unknown",
    flightNumber: flightNumber ?? "unknown",
    origin: origin ?? "unknown",
    destination: destination ?? "unknown",
  };
}
