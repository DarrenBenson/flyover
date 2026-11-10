export type AppConfig = {
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  radiusMiles: number;
  staleAfterSeconds: number;
  positionProvider: string | null;
  maptilerKey: string | null;
  databasePath: string;
};

function num(value: string | undefined): number | null {
  if (value == null || value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function readConfig(env: Record<string, string | undefined>): AppConfig {
  const radius = num(env.FLYOVER_RADIUS_MILES);
  const stale = num(env.STALE_AFTER_SECONDS);
  const provider = (env.POSITION_PROVIDER ?? "").trim();
  return {
    postcode: (env.FLYOVER_POSTCODE ?? "").trim() || null,
    latitude: num(env.FLYOVER_LAT),
    longitude: num(env.FLYOVER_LON),
    radiusMiles: radius != null && radius > 0 ? radius : 15,
    staleAfterSeconds: stale != null && stale > 0 ? stale : 60,
    positionProvider: provider || null,
    maptilerKey: (env.MAPTILER_API_KEY ?? "").trim() || null,
    databasePath: (env.FLYOVER_DB ?? "").trim() || "data/flyover.sqlite",
  };
}

export function providerKind(name: string | null): "off" | "adsb.lol" | "refused" {
  if (!name) return "off";
  if (name.toLowerCase() === "adsb.lol") return "adsb.lol";
  return "refused";
}
