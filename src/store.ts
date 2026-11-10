import { DatabaseSync } from "node:sqlite";
import type { Aircraft } from "./types.ts";

export type StoredProfile = {
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  radiusMiles: number;
};

export type StoredSnapshot = {
  fetchedAtMs: number;
  aircraft: Aircraft[];
};

export class Store {
  private readonly db: DatabaseSync;

  constructor(path: string) {
    this.db = new DatabaseSync(path);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS kv (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);
  }

  readProfile(): StoredProfile | null {
    return this.read("profile");
  }

  writeProfile(profile: StoredProfile): void {
    this.write("profile", profile);
  }

  readSnapshot(): StoredSnapshot | null {
    return this.read("snapshot");
  }

  writeSnapshot(snapshot: StoredSnapshot): void {
    this.write("snapshot", snapshot);
  }

  private read<T>(key: string): T | null {
    const row = this.db.prepare("SELECT value FROM kv WHERE key = ?").get(key) as
      | { value: string }
      | undefined;
    if (!row) return null;
    return JSON.parse(row.value) as T;
  }

  private write(key: string, value: unknown): void {
    this.db
      .prepare("INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
      .run(key, JSON.stringify(value));
  }
}
