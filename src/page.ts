import type { Aircraft, Detail, MapView, PublicSnapshot } from "./types.ts";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function aircraftLine(aircraft: Aircraft): string {
  const name = aircraft.callsign ?? aircraft.id.toUpperCase();
  const altitude = aircraft.onGround
    ? "on ground"
    : aircraft.altitudeFeet == null
      ? "altitude unknown"
      : `${Math.round(aircraft.altitudeFeet)} ft`;
  const speed = aircraft.speedKnots == null ? "speed unknown" : `${Math.round(aircraft.speedKnots)} kt`;
  return `${name} ${aircraft.distanceMiles.toFixed(1)} mi ${altitude} ${speed}`;
}

export function renderPage(snapshot: PublicSnapshot): string {
  const selected = snapshot.selection === "shown" ? snapshot.detail?.id : null;
  const items = snapshot.aircraft
    .map((aircraft, index) => {
      const cls = index === 0 ? ' class="nearest"' : "";
      const mark = aircraft.id === selected ? ' data-selected="true"' : "";
      return `<li${cls} data-id="${escapeHtml(aircraft.id)}"${mark}><a href="?selected=${escapeHtml(aircraft.id)}">${escapeHtml(aircraftLine(aircraft))}</a></li>`;
    })
    .join("");
  const list = snapshot.aircraft.length ? `<ol>${items}</ol>` : "";
  const age = snapshot.ageSeconds == null ? "" : `<p class="age">Age ${snapshot.ageSeconds} seconds</p>`;
  const detail = renderDetail(snapshot);
  const map = renderMap(snapshot.map, selected ?? null);
  const credits = snapshot.credits.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<title>Flyover</title>
<meta http-equiv="refresh" content="5">
<style>
  html, body { height: 100%; margin: 0; background: #101418; color: #f4f7fb; font-family: sans-serif; }
  main { padding: 1.5rem; }
  .nearest { font-size: 48px; font-weight: 700; }
  li { margin: 0.4rem 0; }
  .credits, .navigation, .map-credit { font-size: 16px; }
  .map { position: relative; width: 640px; height: 680px; }
  .tiles img { position: absolute; width: 256px; height: 256px; }
  .radius { fill: none; stroke: #8fd3ff; stroke-width: 4; }
  .home { fill: #f4f7fb; }
  .aircraft { fill: #ffb020; }
  a[data-selected="true"] .aircraft { stroke: #8fd3ff; stroke-width: 4; }
  li[data-selected="true"] a { text-decoration: underline; }
</style>
</head>
<body data-state="${escapeHtml(snapshot.state)}">
<main>
  <p class="message">${escapeHtml(snapshot.message)}</p>
  ${age}
  ${map}
  ${list}
  ${detail}
  <p class="navigation">${escapeHtml(snapshot.navigation)}</p>
  <ul class="credits">${credits}</ul>
</main>
  </body>
</html>`;
}

function field(name: string, value: string): string {
  return `<dt>${escapeHtml(name)}</dt><dd data-field="${escapeHtml(name)}">${escapeHtml(value)}</dd>`;
}

function renderDetail(snapshot: PublicSnapshot): string {
  if (snapshot.selection === "gone") {
    return `<p class="detail" data-selection="gone">That aircraft has left the picture.</p>`;
  }
  const detail: Detail | null = snapshot.detail;
  if (!detail) return "";
  return `<dl class="detail" data-selection="shown" data-id="${escapeHtml(detail.id)}">
    ${field("airline", detail.airline)}
    ${field("flight", detail.flightNumber)}
    ${field("origin", detail.origin)}
    ${field("destination", detail.destination)}
    ${field("type", detail.typeCode)}
    ${field("altitude", detail.altitude)}
    ${field("speed", detail.speed)}
    ${field("distance", detail.distance)}
    ${field("direction", detail.direction)}
  </dl>${renderPhoto(detail)}`;
}

function renderMap(map: MapView | null, selected: string | null): string {
  if (!map) return "";
  const tiles = map.tiles
    .map((tile) => `<img src="/tiles/${tile.z}/${tile.x}/${tile.y}.png" alt="" style="left:${tile.left}px;top:${tile.top}px">`)
    .join("");
  const marks = map.marks
    .map((mark) => {
      const chosen = mark.id === selected ? ' data-selected="true"' : "";
      return `<a href="?selected=${escapeHtml(mark.id)}" data-id="${escapeHtml(mark.id)}"${chosen}><circle class="aircraft" cx="${mark.x}" cy="${mark.y}" r="10"/></a>`;
    })
    .join("");
  const note = map.tilesConfigured
    ? `<p class="map-credit"><a href="https://www.maptiler.com/">MapTiler</a> <a href="https://www.maptiler.com/copyright/">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a></p>`
    : `<p class="map-credit">Map tiles are not configured.</p>`;
  return `<section class="map" data-map="shown">
    <div class="tiles">${tiles}</div>
    <svg viewBox="0 0 ${map.width} ${map.height}" width="${map.width}" height="${map.height}">
      <circle class="radius" cx="${map.homeX}" cy="${map.homeY}" r="${map.radiusPx}"/>
      <circle class="home" cx="${map.homeX}" cy="${map.homeY}" r="6"/>
      ${marks}
    </svg>
    ${note}
  </section>`;
}

function renderPhoto(detail: Detail): string {
  const photo = detail.photo;
  if (!photo) return "";
  return `<figure class="photo">
    <img src="${escapeHtml(photo.thumbnail)}" alt="Aircraft photographed by ${escapeHtml(photo.photographer)}">
    <figcaption>${escapeHtml(photo.photographer)} <a href="${escapeHtml(photo.link)}">Open the original</a></figcaption>
    <div class="qr">${photo.qrSvg}</div>
  </figure>`;
}
