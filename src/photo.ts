import QRCode from "qrcode";

export type PhotoReference = {
  photographer: string;
  link: string;
  thumbnail: string;
};

export function photoUrl(hex: string): string {
  return `https://api.planespotters.net/pub/photos/hex/${encodeURIComponent(hex)}`;
}

function exactText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

export function readPhoto(body: unknown): PhotoReference | null {
  if (!body || typeof body !== "object") return null;
  const photos = (body as { photos?: unknown }).photos;
  if (!Array.isArray(photos) || photos.length === 0) return null;
  const first = photos[0];
  if (!first || typeof first !== "object") return null;
  const record = first as Record<string, unknown>;
  const photographer = exactText(record.photographer)?.trim() ?? "";
  const link = exactText(record.link) ?? "";
  const thumbnail = record.thumbnail && typeof record.thumbnail === "object"
    ? exactText((record.thumbnail as { src?: unknown }).src)
    : null;
  if (!photographer || !link || !thumbnail) return null;
  return { photographer, link, thumbnail };
}

export async function qrSvg(payload: string): Promise<string> {
  const svg = await QRCode.toString(payload, { type: "svg", margin: 0, errorCorrectionLevel: "M" });
  return svg.replace(/^<\?xml[^>]*>\s*/, "");
}
