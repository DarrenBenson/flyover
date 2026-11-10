export type Aircraft = {
  id: string;
  callsign: string | null;
  distanceMiles: number;
  bearingDeg: number;
  altitudeFeet: number | null;
  onGround: boolean;
  speedKnots: number | null;
  trackDeg: number | null;
};

export type FeedState =
  | "unconfigured"
  | "lookup-failed"
  | "provider-off"
  | "refused"
  | "empty"
  | "live"
  | "stale"
  | "degraded";

export type PublicSnapshot = {
  state: FeedState;
  ageSeconds: number | null;
  staleAfterSeconds: number;
  radiusMiles: number;
  aircraft: Aircraft[];
  message: string;
  credits: string[];
  navigation: string;
  source: string | null;
};
