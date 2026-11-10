import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.ts";
import { POSTCODE_CREDITS } from "../src/credits.ts";

const lookup = JSON.parse(readFileSync("tests/fixtures/postcode-lookup.json", "utf8"));
const gate = JSON.parse(readFileSync("tests/fixtures/provider-gate.json", "utf8"));
const radiusList = JSON.parse(readFileSync("tests/fixtures/radius-list.json", "utf8"));
const emptyStale = JSON.parse(readFileSync("tests/fixtures/empty-and-stale.json", "utf8"));
const providerDown = JSON.parse(readFileSync("tests/fixtures/provider-down.json", "utf8"));

const HOME = {
  FLYOVER_POSTCODE: "TEST-POSTCODE",
  FLYOVER_LAT: "0",
  FLYOVER_LON: "-30",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function harness(
  env: Record<string, string | undefined>,
  handler: (url: string) => Response | Promise<Response>,
) {
  const calls: string[] = [];
  let now = 1_700_000_000_000;
  const app = createApp({
    env: { FLYOVER_DB: ":memory:", ...env },
    allowTestPeer: true,
    now: () => now,
    fetch: async (input) => {
      const url = String(input);
      calls.push(url);
      return handler(url);
    },
  });
  return {
    app,
    calls,
    advance(ms: number) {
      now += ms;
    },
  };
}

describe("walking skeleton", () => {
  it("FFG-AC1 house is not configured without a postcode", async () => {
    const { app, calls } = harness({}, () => {
      throw new Error("no lookup should run");
    });
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(page).toContain("This house is not configured.");
    expect(page).not.toContain("<li");
    expect(calls).toEqual([]);
  });

  it("FFG-AC2 distance is measured from the stubbed centre", async () => {
    const defaults = harness(
      { FLYOVER_POSTCODE: "TEST-POSTCODE", POSITION_PROVIDER: "adsb.lol" },
      (url) => {
        if (url.includes("postcodes.io")) return jsonResponse(lookup);
        return jsonResponse(radiusList);
      },
    );
    expect(defaults.app.config.radiusMiles).toBe(15);
    await defaults.app.refresh();
    const page = await (await defaults.app.request("/")).text();
    expect(page).toContain("INSIDEA");
    expect(page).toContain("INSIDEB");
    expect(page).not.toContain("OUTSIDE");
    expect(page).not.toContain("TEST-POSTCODE");
    expect(defaults.calls.some((url) => url.startsWith("https://api.postcodes.io/postcodes/TEST-POSTCODE"))).toBe(true);

    const tight = harness(
      { ...HOME, FLYOVER_RADIUS_MILES: "5", POSITION_PROVIDER: "adsb.lol" },
      () => jsonResponse(radiusList),
    );
    await tight.app.refresh();
    const tightPage = await (await tight.app.request("/")).text();
    expect(tightPage).toContain("INSIDEA");
    expect(tightPage).not.toContain("INSIDEB");
  });

  it("FFG-AC3 a failed lookup does not invent a centre", async () => {
    const { app, calls } = harness({ FLYOVER_POSTCODE: "TEST-POSTCODE" }, () => jsonResponse({ status: 404 }, 404));
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(page).toContain("No centre was invented.");
    expect(page).not.toContain("<li");
    expect(calls.some((url) => url.includes("adsb.lol"))).toBe(false);
  });

  it("FFG-AC4 the postcode and centre are not tracked", () => {
    const tracked = execFileSync("git", ["ls-files"], { encoding: "utf8" });
    expect(tracked.split("\n")).not.toContain(".env");
    expect(tracked).not.toMatch(/\.sqlite/);
    const ignoredEnv = execFileSync("git", ["check-ignore", "--stdin"], { input: ".env\n", encoding: "utf8" });
    const ignoredDb = execFileSync("git", ["check-ignore", "--stdin"], {
      input: "data/flyover.sqlite\n",
      encoding: "utf8",
    });
    expect(ignoredEnv.trim()).toBe(".env");
    expect(ignoredDb.trim()).toBe("data/flyover.sqlite");
    const postcode = process.env.FLYOVER_POSTCODE;
    const lat = process.env.FLYOVER_LAT;
    const lon = process.env.FLYOVER_LON;
    if (!postcode && !lat && !lon) return;
    const needles = [postcode, lat, lon].filter((value): value is string => Boolean(value));
    for (const file of tracked.split("\n").filter(Boolean)) {
      const body = readFileSync(file, "utf8");
      for (const needle of needles) expect(body, file).not.toContain(needle);
    }
  });

  it("FFG-AC5 postcode attribution is on the screen", async () => {
    const { app } = harness({ ...HOME, POSITION_PROVIDER: "adsb.lol" }, () => jsonResponse(gate.empty));
    await app.refresh();
    const page = await (await app.request("/")).text();
    for (const line of POSTCODE_CREDITS) expect(page).toContain(line);
    expect(page).toContain("Not for navigation or operational decisions.");
  });

  it("F8A-AC1 a poll with no provider does not call the transport", async () => {
    const { app, calls } = harness(HOME, () => {
      throw new Error("transport called");
    });
    await app.refresh();
    expect(calls).toEqual([]);
    const page = await (await app.request("/")).text();
    expect(page).toContain("The position provider is not configured.");
  });

  it("F8A-AC2 only adsb.lol is called when it is enabled", async () => {
    const { app, calls } = harness({ ...HOME, POSITION_PROVIDER: "adsb.lol" }, () => jsonResponse(gate.empty));
    await app.refresh();
    expect(calls.length).toBeGreaterThan(0);
    expect(calls.every((url) => url.startsWith("https://api.adsb.lol/"))).toBe(true);
  });

  it("F8A-AC3 OpenSky and ADS-B Exchange are refused", async () => {
    for (const name of gate.refused as string[]) {
      const { app, calls } = harness({ ...HOME, POSITION_PROVIDER: name }, () => {
        throw new Error("refused provider was called");
      });
      await app.refresh();
      expect(calls).toEqual([]);
      const page = await (await app.request("/")).text();
      expect(page).toContain("This position provider is refused");
      expect(page).toContain(name);
    }
  });

  it("F8A-AC4 a provider credential is not in the kiosk response", async () => {
    const secret = "SENTINEL-KEY-9f3a";
    const { app } = harness(
      { ...HOME, POSITION_PROVIDER: "adsb.lol", MAPTILER_API_KEY: secret },
      () => jsonResponse(gate.empty),
    );
    await app.refresh();
    const page = await (await app.request("/")).text();
    const snapshot = await (await app.request("/api/snapshot")).text();
    expect(page).not.toContain(secret);
    expect(snapshot).not.toContain(secret);
  });

  it("FBE-AC1 only aircraft inside the radius are listed", async () => {
    const { app } = harness(
      { ...HOME, FLYOVER_RADIUS_MILES: "15", POSITION_PROVIDER: "adsb.lol" },
      () => jsonResponse(radiusList),
    );
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(page).toContain("INSIDEA");
    expect(page).toContain("INSIDEB");
    expect(page).not.toContain("OUTSIDE");
    expect(page).toContain("ft");
    expect(page).toContain("kt");
  });

  it("FBE-AC2 the nearer aircraft is first", async () => {
    const { app } = harness({ ...HOME, POSITION_PROVIDER: "adsb.lol" }, () => jsonResponse(radiusList));
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(page.indexOf("INSIDEA")).toBeGreaterThan(-1);
    expect(page.indexOf("INSIDEA")).toBeLessThan(page.indexOf("INSIDEB"));
    expect(page).toContain('class="nearest"');
  });

  it("FBE-AC3 the list shows its age and updates without a reload button", async () => {
    let body: unknown = {
      ac: [radiusList.ac[0]],
      msg: "No error",
      now: 1700000000000,
    };
    const box = harness({ ...HOME, POSITION_PROVIDER: "adsb.lol" }, () => jsonResponse(body));
    await box.app.refresh();
    const first = await (await box.app.request("/")).text();
    expect(first).toContain("Age 0 seconds");
    expect(first).toContain("INSIDEA");
    expect(first).not.toContain("<button");
    expect(first).toContain('http-equiv="refresh"');
    body = { ac: [radiusList.ac[1]], msg: "No error", now: 1700000000000 };
    box.advance(5_000);
    await box.app.refresh();
    const second = await (await box.app.request("/")).text();
    expect(second).toContain("INSIDEB");
    expect(second).not.toContain("INSIDEA");
    expect(second).toContain("Age 0 seconds");
  });

  it("FRX-AC1 an empty radius shows an empty state", async () => {
    const { app } = harness({ ...HOME, POSITION_PROVIDER: "adsb.lol" }, () => jsonResponse(emptyStale.empty));
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(page).toContain('data-state="empty"');
    expect(page).toContain("Nothing is inside the radius.");
    expect(page).not.toContain("data-id=");
    expect(page.toLowerCase()).not.toContain("stale");
  });

  it("FRX-AC2 an old poll is labelled stale and keeps the aircraft", async () => {
    const box = harness(
      { ...HOME, POSITION_PROVIDER: "adsb.lol", STALE_AFTER_SECONDS: String(emptyStale.staleSeconds) },
      () => jsonResponse(emptyStale.one),
    );
    await box.app.refresh();
    box.advance(emptyStale.staleSeconds * 1000);
    const page = await (await box.app.request("/")).text();
    expect(page).toContain('data-state="stale"');
    expect(page.toLowerCase()).toContain("stale");
    expect(page).toContain("AGED1");
    expect(page).toContain(`Age ${emptyStale.staleSeconds} seconds`);
  });

  it("FRX-AC3 a fresh poll is not labelled stale", async () => {
    const defaults = harness({ ...HOME, POSITION_PROVIDER: "adsb.lol" }, () => jsonResponse(emptyStale.one));
    expect(defaults.app.config.staleAfterSeconds).toBe(60);
    const box = harness(
      { ...HOME, POSITION_PROVIDER: "adsb.lol", STALE_AFTER_SECONDS: "60" },
      () => jsonResponse(emptyStale.one),
    );
    await box.app.refresh();
    box.advance(59_000);
    const page = await (await box.app.request("/")).text();
    expect(page).toContain('data-state="live"');
    expect(page).not.toMatch(/data-state="stale"|This picture is stale/);
    expect(page).toContain("AGED1");
  });

  it("F39-AC1 a failed poll keeps the last aircraft and says so", async () => {
    let fail = false;
    const box = harness({ ...HOME, POSITION_PROVIDER: "adsb.lol" }, () => {
      if (fail) return jsonResponse({ message: "down" }, 503);
      return jsonResponse(providerDown.good);
    });
    await box.app.refresh();
    fail = true;
    box.advance(5_000);
    await box.app.refresh();
    const page = await (await box.app.request("/")).text();
    expect(page).toContain("KEEP1");
    expect(page).toContain('data-state="degraded"');
    expect(page).toContain("Showing the last picture");
  });

  it("F39-AC2 the first failure is an explicit degraded state", async () => {
    const { app } = harness({ ...HOME, POSITION_PROVIDER: "adsb.lol" }, () => jsonResponse({ message: "down" }, 503));
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(page).toContain('data-state="degraded"');
    expect(page).toContain("There is no earlier picture.");
    expect(page).not.toContain("data-id=");
  });

  it("F39-AC3 provider failure still returns a snapshot document", async () => {
    const { app } = harness({ ...HOME, POSITION_PROVIDER: "adsb.lol" }, () => {
      throw new Error("socket closed");
    });
    await app.refresh();
    const response = await app.request("/api/snapshot");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.state).toBe("degraded");
    expect(body.aircraft).toEqual([]);
  });

  it("FSE-AC1 the live view has no hover-only control", async () => {
    const { app } = harness({ ...HOME, POSITION_PROVIDER: "adsb.lol" }, () => jsonResponse(radiusList));
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(page).not.toContain(":hover");
  });

  it("FSE-AC2 the live view keeps updating without a keyboard", async () => {
    let body: unknown = { ac: [radiusList.ac[0]], msg: "No error", now: 1 };
    const box = harness({ ...HOME, POSITION_PROVIDER: "adsb.lol" }, () => jsonResponse(body));
    await box.app.refresh();
    body = { ac: [radiusList.ac[1]], msg: "No error", now: 1 };
    await box.app.refresh();
    const page = await (await box.app.request("/")).text();
    expect(page).not.toMatch(/<(input|textarea|button)\b/i);
    expect(page).not.toContain("contenteditable");
    expect(page).toContain('http-equiv="refresh"');
    expect(page).toContain("INSIDEB");
  });

  it("FSE-AC3 the nearest identity is at least 32px", async () => {
    const { app } = harness({ ...HOME, POSITION_PROVIDER: "adsb.lol" }, () => jsonResponse(radiusList));
    await app.refresh();
    const page = await (await app.request("/")).text();
    const match = page.match(/\.nearest\s*\{[^}]*font-size:\s*(\d+)px/);
    expect(match).not.toBeNull();
    expect(Number(match?.[1])).toBeGreaterThanOrEqual(32);
    expect(page).toContain('class="nearest"');
  });

  it("FSE-AC4 the live view admits only the home LAN", async () => {
    const { app } = harness({ ...HOME, POSITION_PROVIDER: "adsb.lol" }, () => jsonResponse(gate.empty));
    await app.refresh();
    const local = await app.request("/");
    expect(local.status).toBe(200);
    const lan = await app.request("/", { headers: { "x-flyover-test-peer": "192.168.1.20" } });
    expect(lan.status).toBe(200);
    const loopback = await app.request("/", {
      headers: { "x-forwarded-for": "10.1.2.3" },
    });
    expect(loopback.status).toBe(200);
    const publicViaProxy = await app.request("/", { headers: { "x-forwarded-for": "203.0.113.5" } });
    expect(publicViaProxy.status).toBe(403);
    const forgedFirstHop = await app.request("/", {
      headers: { "x-forwarded-for": "10.1.2.3, 203.0.113.5" },
    });
    expect(forgedFirstHop.status).toBe(403);
    const proxySawLan = await app.request("/", {
      headers: { "x-forwarded-for": "203.0.113.5, 192.168.0.5" },
    });
    expect(proxySawLan.status).toBe(200);
    const notAnAddress = await app.request("/", { headers: { "x-flyover-test-peer": "fe80:nope" } });
    expect(notAnAddress.status).toBe(403);
    const publicPeer = await app.request("/", { headers: { "x-flyover-test-peer": "8.8.8.8" } });
    expect(publicPeer.status).toBe(403);
    const spoofed = await app.request("/", {
      headers: { "x-flyover-test-peer": "203.0.113.9", "x-forwarded-for": "10.0.0.1" },
    });
    expect(spoofed.status).toBe(403);
    const ula = await app.request("/", { headers: { "x-flyover-test-peer": "fd12:3456::1" } });
    expect(ula.status).toBe(200);
    const closed = createApp({
      env: { ...HOME, FLYOVER_DB: ":memory:", POSITION_PROVIDER: "adsb.lol" },
      fetch: async () => jsonResponse(gate.empty),
      now: () => 1_700_000_000_000,
    });
    await closed.refresh();
    const spoofedHeader = await closed.request("/", {
      headers: { "x-flyover-test-peer": "192.168.1.20" },
    });
    expect(spoofedHeader.status).toBe(403);
  });
});
