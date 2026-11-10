import { Hono } from "hono";
import { getConnInfo } from "@hono/node-server/conninfo";
import { ADSB_CREDIT, NAVIGATION, POSTCODE_CREDITS, ROUTE_CREDIT } from "./credits.ts";
import { providerKind, readConfig, type AppConfig } from "./config.ts";
import { clientAllowed } from "./lan.ts";
import { adsbUrl, postcodeUrl, readAircraft } from "./poll.ts";
import { photoUrl, qrSvg, readPhoto } from "./photo.ts";
import { readRoute, routeUrl } from "./route.ts";
import { renderPage } from "./page.ts";
import { Store } from "./store.ts";
import type { Aircraft, Detail, FeedState, PublicSnapshot } from "./types.ts";

const USER_AGENT = "flyover/0.1 (personal non-commercial kiosk)";

export type AppDeps = {
  env: Record<string, string | undefined>;
  fetch: typeof fetch;
  now: () => number;
  allowTestPeer?: boolean;
};

export type FlyoverApp = {
  request: (input: string, init?: RequestInit) => Promise<Response>;
  refresh: () => Promise<void>;
  config: AppConfig;
  fetch: (request: Request, env?: unknown, ctx?: unknown) => Response | Promise<Response>;
};

export function createApp(deps: AppDeps): FlyoverApp {
  const config = readConfig(deps.env);
  const store = new Store(config.databasePath);
  let centre: { lat: number; lon: number } | null = null;
  let aircraft: Aircraft[] = [];
  let fetchedAt: number | null = null;
  let base: FeedState = "unconfigured";
  let refusalName: string | null = null;

  const saved = store.readSnapshot();
  if (saved) {
    aircraft = saved.aircraft;
    fetchedAt = saved.fetchedAtMs;
    base = aircraft.length ? "live" : "empty";
  }

  function ageSeconds(): number | null {
    if (fetchedAt == null) return null;
    return Math.max(0, Math.floor((deps.now() - fetchedAt) / 1000));
  }

  function snapshot(): PublicSnapshot {
    const age = ageSeconds();
    let state = base;
    if ((state === "live" || state === "empty") && age != null && age >= config.staleAfterSeconds) {
      state = "stale";
    }
    const credits: string[] = [];
    if (centre) credits.push(...POSTCODE_CREDITS);
    if (providerKind(config.positionProvider) === "adsb.lol") credits.push(ADSB_CREDIT);
    return {
      state,
      ageSeconds: age,
      staleAfterSeconds: config.staleAfterSeconds,
      radiusMiles: config.radiusMiles,
      aircraft: state === "unconfigured" || state === "lookup-failed" || state === "provider-off" || state === "refused"
        ? []
        : aircraft,
      message: messageFor(state, age),
      credits,
      navigation: NAVIGATION,
      source: providerKind(config.positionProvider) === "adsb.lol" ? "adsb.lol" : null,
      detail: null,
      selection: "none",
    };
  }

  async function factsFor(chosen: Aircraft): Promise<Detail> {
    const unknown: Detail = {
      id: chosen.id,
      airline: "unknown",
      flightNumber: "unknown",
      origin: "unknown",
      destination: "unknown",
      typeCode: chosen.typeCode ?? "unknown",
      altitude: chosen.onGround
        ? "on ground"
        : chosen.altitudeFeet == null
          ? "unknown"
          : `${Math.round(chosen.altitudeFeet)} ft`,
      speed: chosen.speedKnots == null ? "unknown" : `${Math.round(chosen.speedKnots)} kt`,
      distance: `${chosen.distanceMiles.toFixed(1)} mi`,
      direction: `${Math.round(chosen.bearingDeg)}°`,
      routeShown: false,
      photo: null,
    };
    if (config.routeLookup && chosen.callsign) {
      try {
        const response = await deps.fetch(routeUrl(chosen.callsign), {
          headers: { accept: "application/json", "user-agent": USER_AGENT },
        });
        if (response.ok) {
          const route = readRoute(await response.json());
          if (route) Object.assign(unknown, route, { routeShown: true });
        }
      } catch {
        // A missed route stays unknown. The aircraft itself remains.
      }
    }
    if (config.photos) {
      try {
        const response = await deps.fetch(photoUrl(chosen.id), {
          headers: { accept: "application/json", "user-agent": USER_AGENT },
        });
        if (response.ok) {
          const photo = readPhoto(await response.json());
          if (photo) {
            unknown.photo = { ...photo, qrSvg: await qrSvg(photo.link) };
          }
        }
      } catch {
        // No credited photo is the honest result of a failed lookup.
      }
    }
    return unknown;
  }

  async function present(selectedId: string | null): Promise<PublicSnapshot> {
    const view = snapshot();
    if (selectedId && !view.aircraft.some((item) => item.id === selectedId)) {
      return { ...view, selection: "gone" };
    }
    const chosen = view.aircraft.find((item) => item.id === selectedId) ?? view.aircraft[0];
    if (!chosen) return view;
    const detail = await factsFor(chosen);
    return {
      ...view,
      detail,
      selection: "shown",
      credits: detail.routeShown ? [...view.credits, ROUTE_CREDIT] : view.credits,
    };
  }

  function messageFor(state: FeedState, age: number | null): string {
    switch (state) {
      case "unconfigured":
        return "This house is not configured.";
      case "lookup-failed":
        return "The postcode could not be resolved. No centre was invented.";
      case "provider-off":
        return "The position provider is not configured.";
      case "refused":
        return `This position provider is refused: ${refusalName ?? "unknown"}.`;
      case "empty":
        return "Nothing is inside the radius.";
      case "live":
        return "Live.";
      case "stale":
        return aircraft.length
          ? `This picture is stale. Age ${age ?? 0} seconds.`
          : "This picture is stale. Nothing was inside the radius.";
      case "degraded":
        return aircraft.length
          ? `Feed unavailable. Showing the last picture from ${age ?? 0} seconds ago.`
          : "The position feed is unavailable. There is no earlier picture.";
    }
  }

  async function ensureCentre(): Promise<"ready" | "unconfigured" | "lookup-failed"> {
    if (config.latitude != null && config.longitude != null) {
      centre = { lat: config.latitude, lon: config.longitude };
      store.writeProfile({
        postcode: config.postcode,
        latitude: centre.lat,
        longitude: centre.lon,
        radiusMiles: config.radiusMiles,
      });
      return "ready";
    }
    const stored = store.readProfile();
    if (stored && stored.postcode === config.postcode && stored.latitude != null && stored.longitude != null) {
      centre = { lat: stored.latitude, lon: stored.longitude };
      return "ready";
    }
    if (!config.postcode) return "unconfigured";
    const response = await deps.fetch(postcodeUrl(config.postcode), {
      headers: { accept: "application/json", "user-agent": USER_AGENT },
    });
    if (!response.ok) return "lookup-failed";
    const body = (await response.json()) as { result?: { latitude?: unknown; longitude?: unknown } };
    const lat = body.result?.latitude;
    const lon = body.result?.longitude;
    if (typeof lat !== "number" || typeof lon !== "number") return "lookup-failed";
    centre = { lat, lon };
    store.writeProfile({
      postcode: config.postcode,
      latitude: lat,
      longitude: lon,
      radiusMiles: config.radiusMiles,
    });
    return "ready";
  }

  async function refresh(): Promise<void> {
    const place = await ensureCentre();
    if (place !== "ready" || !centre) {
      base = place === "lookup-failed" ? "lookup-failed" : "unconfigured";
      aircraft = [];
      fetchedAt = null;
      return;
    }
    const kind = providerKind(config.positionProvider);
    if (kind === "off") {
      base = "provider-off";
      aircraft = [];
      fetchedAt = null;
      return;
    }
    if (kind === "refused") {
      base = "refused";
      refusalName = config.positionProvider;
      aircraft = [];
      fetchedAt = null;
      return;
    }
    try {
      const response = await deps.fetch(adsbUrl(centre.lat, centre.lon, config.radiusMiles), {
        headers: { accept: "application/json", "user-agent": USER_AGENT },
      });
      if (!response.ok) throw new Error(`adsb.lol returned ${response.status}`);
      const body: unknown = await response.json();
      aircraft = readAircraft(body, centre.lat, centre.lon, config.radiusMiles);
      fetchedAt = deps.now();
      base = aircraft.length ? "live" : "empty";
      store.writeSnapshot({ fetchedAtMs: fetchedAt, aircraft });
    } catch {
      const previous = store.readSnapshot();
      if (previous) {
        aircraft = previous.aircraft;
        fetchedAt = previous.fetchedAtMs;
        base = "degraded";
      } else {
        aircraft = [];
        fetchedAt = null;
        base = "degraded";
      }
    }
  }

  const app = new Hono();
  app.use("*", async (c, next) => {
    const injected = deps.allowTestPeer ? c.req.header("x-flyover-test-peer") : undefined;
    let peer = injected || "";
    if (!peer) {
      try {
        peer = getConnInfo(c).remote.address ?? "";
      } catch {
        // A test request has no socket. Production has one; a missing peer is refused.
        peer = deps.allowTestPeer ? "127.0.0.1" : "";
      }
    }
    const forwarded = c.req.header("x-forwarded-for") ?? null;
    if (!clientAllowed(peer, forwarded)) {
      return c.text("This display is only available on the home network.", 403);
    }
    await next();
  });
  app.get("/api/snapshot", async (c) => c.json(await present(c.req.query("selected") ?? null)));
  app.get("/", async (c) =>
    c.body(renderPage(await present(c.req.query("selected") ?? null)), 200, {
      "content-type": "text/html; charset=utf-8",
    }),
  );

  return {
    request: (input, init) => Promise.resolve(app.request(input, init)),
    refresh,
    config,
    fetch: (request, env, ctx) => app.fetch(request, env as never, ctx as never),
  };
}
