import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { serve } from "@hono/node-server";
import { createApp } from "./app.ts";

const databasePath = (process.env.FLYOVER_DB ?? "").trim() || "data/flyover.sqlite";
if (databasePath !== ":memory:") mkdirSync(dirname(databasePath), { recursive: true });

const app = createApp({
  env: process.env,
  fetch: globalThis.fetch,
  now: () => Date.now(),
});

const port = Number(process.env.PORT || 8080);
await app.refresh();
setInterval(() => {
  void app.refresh();
}, 15_000);

serve({ fetch: app.fetch, port });
console.log(`Flyover listening on ${port}`);
