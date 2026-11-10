import type { Aircraft, PublicSnapshot } from "./types.ts";

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
  const items = snapshot.aircraft
    .map((aircraft, index) => {
      const cls = index === 0 ? ' class="nearest"' : "";
      return `<li${cls} data-id="${escapeHtml(aircraft.id)}">${escapeHtml(aircraftLine(aircraft))}</li>`;
    })
    .join("");
  const list = snapshot.aircraft.length ? `<ol>${items}</ol>` : "";
  const age = snapshot.ageSeconds == null ? "" : `<p class="age">Age ${snapshot.ageSeconds} seconds</p>`;
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
  .credits, .navigation { font-size: 16px; }
</style>
</head>
<body data-state="${escapeHtml(snapshot.state)}">
<main>
  <p class="message">${escapeHtml(snapshot.message)}</p>
  ${age}
  ${list}
  <p class="navigation">${escapeHtml(snapshot.navigation)}</p>
  <ul class="credits">${credits}</ul>
</main>
</body>
</html>`;
}
