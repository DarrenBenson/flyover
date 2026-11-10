import { mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import QRCode from "qrcode";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.ts";

const photos = JSON.parse(readFileSync("tests/fixtures/photo-credit.json", "utf8"));
const facts = JSON.parse(readFileSync("tests/fixtures/flight-facts.json", "utf8"));
const LINK = photos.hit.photos[0].link as string;
const THUMB = photos.hit.photos[0].thumbnail.src as string;

const HOME = {
  FLYOVER_POSTCODE: "TEST-POSTCODE",
  FLYOVER_LAT: "0",
  FLYOVER_LON: "-30",
  POSITION_PROVIDER: "adsb.lol",
  PHOTOS: "planespotters",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function handler(url: string): Response {
  if (url.includes("api.planespotters.net")) return jsonResponse(photos.hit);
  return jsonResponse(facts.full);
}

function harness(env: Record<string, string | undefined>, respond: (url: string) => Response = handler) {
  const calls: string[] = [];
  const app = createApp({
    env: { FLYOVER_DB: ":memory:", ...env },
    allowTestPeer: true,
    now: () => 1_700_000_000_000,
    fetch: async (input) => {
      const url = String(input);
      calls.push(url);
      return respond(url);
    },
  });
  return { app, calls };
}

describe("credited photos", () => {
  it("FFM-AC1 a credited photo names the photographer and links to the original", async () => {
    const off = harness({ ...HOME, PHOTOS: "" }, () => jsonResponse(facts.full));
    await off.app.refresh();
    await off.app.request("/");
    expect(off.calls.some((url) => url.includes("planespotters"))).toBe(false);

    const { app, calls } = harness(HOME);
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(calls.some((url) => url === "https://api.planespotters.net/pub/photos/hex/abc123")).toBe(true);
    expect(page).toContain(`src="${THUMB}"`);
    expect(page).toContain("Ada Example");
    expect(page).toContain(`href="${LINK}"`);
    expect(page).not.toContain("nofollow");
  });

  it("FFM-AC2 the QR payload is the link, not only the URL as text", async () => {
    const { app } = harness(HOME);
    await app.refresh();
    const page = await (await app.request("/")).text();
    const expected = (await QRCode.toString(LINK, { type: "svg", margin: 0, errorCorrectionLevel: "M" }))
      .replace(/^<\?xml[^>]*>\s*/, "");
    expect(page).toContain(expected);
    expect(page).toContain("<svg");
    const withoutQr = page.replace(/<div class="qr">[\s\S]*<\/div>/, "");
    expect(withoutQr).not.toContain("<svg");
  });

  it("FFM-AC3 an empty photo list shows no image and no logo", async () => {
    const { app } = harness(HOME, (url) => {
      if (url.includes("api.planespotters.net")) return jsonResponse(photos.empty);
      return jsonResponse(facts.full);
    });
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(page).not.toContain("<img");
    expect(page.toLowerCase()).not.toContain("logo");
    expect(page).not.toContain("cdn.example.test");
  });

  it("FFM-AC4 image bytes are not stored and the thumbnail URL is not rewritten", async () => {
    const dir = mkdtempSync(join(tmpdir(), "flyover-photo-"));
    const databasePath = join(dir, "flyover.sqlite");
    const calls: string[] = [];
    const app = createApp({
      env: { ...HOME, FLYOVER_DB: databasePath },
      allowTestPeer: true,
      now: () => 1_700_000_000_000,
      fetch: async (input) => {
        const url = String(input);
        calls.push(url);
        if (url.startsWith("https://cdn.example.test/")) {
          return new Response("IMAGE-BYTES-SENTINEL", { status: 200, headers: { "content-type": "image/jpeg" } });
        }
        return handler(url);
      },
    });
    await app.refresh();
    const page = await (await app.request("/")).text();
    expect(page).toContain(`src="${THUMB}"`);
    expect(calls.some((url) => url.startsWith("https://cdn.example.test/"))).toBe(false);
    expect(calls.some((url) => url.includes("api.planespotters.net"))).toBe(true);
    const db = new DatabaseSync(databasePath);
    const rows = db.prepare("SELECT value FROM kv").all() as { value: string }[];
    const stored = rows.map((row) => row.value).join("\n");
    expect(stored).not.toContain("IMAGE-BYTES-SENTINEL");
    expect(stored).not.toContain(THUMB);
    expect(stored).not.toContain("Ada Example");
    const names = readdirSync(dir);
    expect(names.some((name) => /\.(jpe?g|png|gif|webp)$/i.test(name))).toBe(false);
  });
});
