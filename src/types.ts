export type Aircraft = {
  id: string;
  callsign: string | null;
  lat: number;
  lon: number;
  distanceMiles: number;
  bearingDeg: number;
  altitudeFeet: number | null;
  onGround: boolean;
  speedKnots: number | null;
  trackDeg: number | null;
  typeCode: string | null;
};

export type Detail = {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  typeCode: string;
  altitude: string;
  speed: string;
  distance: string;
  direction: string;
  routeShown: boolean;
  photo: PhotoCredit | null;
};

export type PhotoCredit = {
  photographer: string;
  link: string;
  thumbnail: string;
  qrSvg: string;
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
  detail: Detail | null;
  selection: "shown" | "gone" | "none";
  map: MapView | null;
};

export type MapView = {
  width: number;
  height: number;
  homeX: number;
  homeY: number;
  radiusPx: number;
  tilesConfigured: boolean;
  marks: { id: string; x: number; y: number }[];
  tiles: { z: number; x: number; y: number; left: number; top: number }[];
};
