import type { Aircraft } from "./types.ts";

const SIZE = 640;
const TILE = 256;

export type MapTile = { z: number; x: number; y: number; left: number; top: number };
export type MapMark = { id: string; x: number; y: number };

export type MapView = {
  width: number;
  height: number;
  homeX: number;
  homeY: number;
  radiusPx: number;
  tilesConfigured: boolean;
  marks: MapMark[];
  tiles: MapTile[];
};

export function maptilerTileUrl(z: number, x: number, y: number, key: string): string {
  return `https://api.maptiler.com/maps/basic-v2/${z}/${x}/${y}.png?key=${encodeURIComponent(key)}`;
}

function zoomFor(lat: number, radiusMiles: number): number {
  const metresPerPixel = (radiusMiles * 1609.344) / 180;
  const raw = Math.log2((156543.03392 * Math.cos((lat * Math.PI) / 180)) / metresPerPixel);
  return Math.max(1, Math.min(16, Math.round(raw)));
}

function world(lat: number, lon: number, zoom: number): { x: number; y: number } {
  const scale = TILE * 2 ** zoom;
  const x = ((lon + 180) / 360) * scale;
  const clamped = Math.max(-85, Math.min(85, lat));
  const rad = (clamped * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * scale;
  return { x, y };
}

export function buildMap(
  homeLat: number,
  homeLon: number,
  radiusMiles: number,
  aircraft: Aircraft[],
  tilesConfigured: boolean,
): MapView {
  const zoom = zoomFor(homeLat, radiusMiles);
  const origin = world(homeLat, homeLon, zoom);
  const metresPerPixel = (156543.03392 * Math.cos((homeLat * Math.PI) / 180)) / 2 ** zoom;
  const radiusPx = (radiusMiles * 1609.344) / metresPerPixel;
  const marks = aircraft.map((item) => {
    const point = world(item.lat, item.lon, zoom);
    return {
      id: item.id,
      x: Math.round((SIZE / 2 + (point.x - origin.x)) * 10) / 10,
      y: Math.round((SIZE / 2 + (point.y - origin.y)) * 10) / 10,
    };
  });
  const tiles: MapTile[] = [];
  if (tilesConfigured) {
    const minX = Math.floor((origin.x - SIZE / 2) / TILE);
    const maxX = Math.floor((origin.x + SIZE / 2) / TILE);
    const minY = Math.floor((origin.y - SIZE / 2) / TILE);
    const maxY = Math.floor((origin.y + SIZE / 2) / TILE);
    const limit = 2 ** zoom;
    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) {
        if (x < 0 || y < 0 || x >= limit || y >= limit) continue;
        tiles.push({
          z: zoom,
          x,
          y,
          left: Math.round(SIZE / 2 + (x * TILE - origin.x)),
          top: Math.round(SIZE / 2 + (y * TILE - origin.y)),
        });
      }
    }
  }
  return {
    width: SIZE,
    height: SIZE,
    homeX: SIZE / 2,
    homeY: SIZE / 2,
    radiusPx: Math.round(radiusPx * 10) / 10,
    tilesConfigured,
    marks,
    tiles,
  };
}

export function pausedTileSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#1c242c"/><text x="16" y="128" fill="#f4f7fb" font-size="20">Map tiles are paused.</text></svg>`;
}
