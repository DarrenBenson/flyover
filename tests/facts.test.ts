import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.ts";

const routes = JSON.parse(readFileSync("tests/fixtures/route-lookup.json", "utf8"));
const facts = JSON.parse(readFileSync("tests/fixtures/flight-facts.json", "utf8"));

const HOME = {
  FLYOVER_POSTCODE: "TEST-POSTCODE",
  FLYOVER_LAT: "0",
  FLYOVER_LON: "-30",
  POSITION_PROVIDER: "adsb.lol",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function harness(env: Record<string, string | undefined>, handler: (url: string) => Response) {
  const calls: string[] = [];
  const app = createApp({
    env: { FLYOVER_DB: ":memory:", ...env },
    allowTestPeer: true,
    now: () => 1_700_000_000_000,
    fetch: async (input) => {
      const url = String(input);
      calls.push(url);
      return handler(url);
    },
  });
  return { app, calls };
}

function field(page: string, name: string): string {
  const match = page.match(new RegExp(`data-field="${name}">([^<]+)`));
  return match?.[1] ?? "";
}

describe("flight facts", () => {
  it("FSQ-AC1 a route hit supplies airline, flight number, origin, and destination", async () => {
    const off = harness(HOME, () => jsonResponse(facts.full));
    await off.app.refresh();
    await off.app.request("/");
    expect(off.calls.some((url) => url.includes("adsbdb.com"))).toBe(false);

    const { app, calls } = harness({ ...HOME, ROUTE_LOOKUP: "adsbdb" }, (url) => {
      if (url.includes("api.adsbdb.com")) return jsonResponse(routes.hit);
      return jsonResponse(facts.full);
    });
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(calls.some((url) => url.startsWith("https://api.adsbdb.com/v0/callsign/FACT1"))).toBe(true);
    expect(field(page, "airline")).toBe("Example Air");
    expect(field(page, "flight")).toBe("EX123");
    expect(field(page, "origin")).toBe("Example Origin");
    expect(field(page, "destination")).toBe("Example Destination");
  });

  it("FSQ-AC2 a route miss says unknown", async () => {
    const { app } = harness({ ...HOME, ROUTE_LOOKUP: "adsbdb" }, (url) => {
      if (url.includes("api.adsbdb.com")) return jsonResponse(routes.miss, 404);
      return jsonResponse(facts.full);
    });
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(field(page, "airline")).toBe("unknown");
    expect(field(page, "flight")).toBe("unknown");
    expect(field(page, "origin")).toBe("unknown");
    expect(field(page, "destination")).toBe("unknown");
    expect(page).not.toContain("Example Origin");
  });

  it("FSQ-AC3 a shown route is not written to the store", async () => {
    const dir = mkdtempSync(join(tmpdir(), "flyover-route-"));
    const databasePath = join(dir, "flyover.sqlite");
    const calls: string[] = [];
    const app = createApp({
      env: { ...HOME, ROUTE_LOOKUP: "adsbdb", FLYOVER_DB: databasePath },
      allowTestPeer: true,
      now: () => 1_700_000_000_000,
      fetch: async (input) => {
        const url = String(input);
        calls.push(url);
        if (url.includes("api.adsbdb.com")) return jsonResponse(routes.hit);
        return jsonResponse(facts.full);
      },
    });
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(page).toContain("Example Air");
    const db = new DatabaseSync(databasePath);
    const rows = db.prepare("SELECT value FROM kv").all() as { value: string }[];
    const stored = rows.map((row) => row.value).join("\n");
    expect(stored).not.toContain("Example Air");
    expect(stored).not.toContain("flightroute");
    expect(stored).not.toContain("Example Origin");
    const names = readdirSync(dir);
    expect(names.some((name) => name.endsWith(".json"))).toBe(false);
    expect(calls.some((url) => url.includes("api.adsbdb.com"))).toBe(true);
  });

  it("FSQ-AC4 a shown route credits David Taylor, Jim Mason, and adsbdb", async () => {
    const { app } = harness({ ...HOME, ROUTE_LOOKUP: "adsbdb" }, (url) => {
      if (url.includes("api.adsbdb.com")) return jsonResponse(routes.hit);
      return jsonResponse(facts.full);
    });
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(page).toContain("David Taylor");
    expect(page).toContain("Jim Mason");
    expect(page).toContain("adsbdb");
  });

  it("FJV-AC1 the selected aircraft shows every fact in feet, knots, and miles", async () => {
    const { app } = harness({ ...HOME, ROUTE_LOOKUP: "adsbdb" }, (url) => {
      if (url.includes("api.adsbdb.com")) return jsonResponse(routes.hit);
      return jsonResponse(facts.full);
    });
    await app.refresh();
    const page = await (await app.request("/?selected=abc123")).text();
    expect(page).toContain('data-selection="shown"');
    expect(field(page, "airline")).toBe("Example Air");
    expect(field(page, "flight")).toBe("EX123");
    expect(field(page, "origin")).toBe("Example Origin");
    expect(field(page, "destination")).toBe("Example Destination");
    expect(field(page, "type")).toBe("A20N");
    expect(field(page, "altitude")).toBe("32000 ft");
    expect(field(page, "speed")).toBe("450 kt");
    expect(field(page, "distance")).toContain("mi");
    expect(field(page, "direction")).toContain("°");
  });

  it("FJV-AC2 a missed route does not invent a city", async () => {
    const { app } = harness({ ...HOME, ROUTE_LOOKUP: "adsbdb" }, (url) => {
      if (url.includes("api.adsbdb.com")) return jsonResponse(routes.miss, 404);
      return jsonResponse(facts.full);
    });
    await app.refresh();
    const page = await (await app.request("/?selected=abc123")).text();
    expect(field(page, "origin")).toBe("unknown");
    expect(field(page, "destination")).toBe("unknown");
    expect(page).not.toContain("London");
    expect(page).not.toContain("Example Origin");
  });

  it("FJV-AC3 distance and direction are computed from the two points", async () => {
    const degrees = 0.029;
    const miles = degrees * 3958.7613 * (Math.PI / 180);
    expect(miles).toBeGreaterThan(1.9);
    expect(miles).toBeLessThan(2.1);
    const { app } = harness(HOME, () => jsonResponse(facts.full));
    await app.refresh();
    const page = await (await app.request("/?selected=abc123")).text();
    expect(field(page, "distance")).toBe("2.0 mi");
    expect(field(page, "direction")).toBe("90°");
  });

  it("FJV-AC4 a missing type stays unknown and Planebase is not called", async () => {
    const { app, calls } = harness({ ...HOME, ROUTE_LOOKUP: "adsbdb" }, (url) => {
      if (url.includes("api.adsbdb.com")) return jsonResponse(routes.miss, 404);
      return jsonResponse(facts.noType);
    });
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(field(page, "type")).toBe("unknown");
    expect(calls.some((url) => url.toLowerCase().includes("planebase"))).toBe(false);
    let tree = "";
    try {
      tree = execFileSync("git", ["grep", "-l", "-i", "planebase", "--", "src"], { encoding: "utf8" });
    } catch (error) {
      if ((error as { status?: number }).status !== 1) throw error;
    }
    expect(tree.trim()).toBe("");
  });
});
