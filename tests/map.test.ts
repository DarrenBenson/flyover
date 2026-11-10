import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.ts";

const listed = JSON.parse(readFileSync("tests/fixtures/radius-list.json", "utf8"));
const empty = JSON.parse(readFileSync("tests/fixtures/empty-and-stale.json", "utf8")).empty;

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

function mentioned(path: string, needle: string): boolean {
  try {
    execFileSync("git", ["grep", "-n", needle, "--", path], { encoding: "utf8" });
    return true;
  } catch (error) {
    if ((error as { status?: number }).status === 1) return false;
    throw error;
  }
}

describe("map and selection", () => {
  it("F1W-AC1 marks the centre, the radius, and each listed aircraft", async () => {
    const { app } = harness({ ...HOME, MAPTILER_API_KEY: "configured-for-this-process" }, () => jsonResponse(listed));
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(page).toContain('class="home"');
    expect(page).toContain('class="radius"');
    expect(page).toContain('data-id="aaa111"');
    expect(page).toContain('data-id="bbb222"');
    expect(page).not.toContain("ccc333");
    expect(page).not.toContain("OUTSIDE");
    const marks = [...page.matchAll(/<circle class="aircraft" cx="([0-9.]+)"/g)].map((match) => Number(match[1]));
    expect(marks).toHaveLength(2);
    expect(new Set(marks).size).toBe(2);
  });

  it("F1W-AC2 loads tiles from MapTiler and keeps the key out of the page", async () => {
    const key = `mt-test-${Date.now()}`;
    const { app, calls } = harness({ ...HOME, MAPTILER_API_KEY: key }, (url) => {
      if (url.includes("api.maptiler.com")) return new Response("PNG", { status: 200, headers: { "content-type": "image/png" } });
      return jsonResponse(listed);
    });
    await app.refresh();
    const page = await (await app.request("/")).text();
    const src = page.match(/src="(\/tiles\/\d+\/\d+\/\d+\.png)"/)?.[1] ?? "";
    expect(src.startsWith("/tiles/")).toBe(true);
    expect(page).not.toContain(key);
    expect(page).not.toContain("tile.openstreetmap.org");
    expect(page).toContain("https://www.maptiler.com/");
    const tile = await app.request(src);
    expect(await tile.text()).toBe("PNG");
    expect(calls.some((url) => url.startsWith("https://api.maptiler.com/maps/basic-v2/") && url.includes(key))).toBe(true);
    expect(calls.some((url) => url.includes("openstreetmap.org"))).toBe(false);
    expect(mentioned("src", "tile.openstreetmap.org")).toBe(false);
    expect(mentioned(".", key)).toBe(false);

    const paused = harness({ ...HOME, MAPTILER_API_KEY: key }, (url) => {
      if (url.includes("api.maptiler.com")) return new Response("no", { status: 429 });
      return jsonResponse(empty);
    });
    const denied = await paused.app.request("/tiles/2/1/1.png");
    expect(await denied.text()).toContain("Map tiles are paused.");
    expect(denied.headers.get("content-type")).toContain("image/svg+xml");
    expect(paused.calls.some((url) => url.includes("openstreetmap.org"))).toBe(false);
    expect(paused.calls.every((url) => url.startsWith("https://api.maptiler.com/"))).toBe(true);
  });

  it("F1W-AC3 an empty sky keeps the centre and the radius only", async () => {
    const { app } = harness(HOME, () => jsonResponse(empty));
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(page).toContain('class="home"');
    expect(page).toContain('class="radius"');
    expect(page).not.toContain('class="aircraft"');
    expect(page).not.toContain("INSIDEA");
    expect(page).not.toContain("SAMPLE");
  });

  it("F6W-AC1 selecting a map mark selects that aircraft in the detail", async () => {
    const { app } = harness(HOME, () => jsonResponse(listed));
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(page).toContain('href="?selected=bbb222"');
    const selected = await (await app.request("/?selected=bbb222")).text();
    expect(selected).toContain('<dl class="detail" data-selection="shown" data-id="bbb222">');
    expect(selected).toContain('data-id="bbb222" data-selected="true"');
  });

  it("F6W-AC2 selecting the list moves the map selection", async () => {
    const { app } = harness(HOME, () => jsonResponse(listed));
    await app.refresh();
    const page = await (await app.request("/?selected=aaa111")).text();
    expect(page).toContain('href="?selected=aaa111"');
    expect(page).toContain('data-id="aaa111" data-selected="true"');
    expect(page).not.toContain('data-id="bbb222" data-selected="true"');
  });

  it("F6W-AC3 a departed aircraft clears the selection", async () => {
    let body = listed;
    const { app } = harness(HOME, () => jsonResponse(body));
    await app.refresh();
    const shown = await (await app.request("/?selected=bbb222")).text();
    expect(shown).toContain('data-id="bbb222"');
    body = {
      ...listed,
      ac: listed.ac.filter((row: { hex: string }) => row.hex !== "bbb222"),
    };
    await app.refresh();
    const gone = await (await app.request("/?selected=bbb222")).text();
    expect(gone).toContain('data-selection="gone"');
    expect(gone).toContain("That aircraft has left the picture.");
    expect(gone).not.toContain("bbb222");
    expect(gone).not.toContain("INSIDEB");
  });
});
