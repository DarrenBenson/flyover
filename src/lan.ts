function normalise(ip: string): string {
  let s = ip.trim().toLowerCase();
  const zone = s.indexOf("%");
  if (zone >= 0) s = s.slice(0, zone);
  if (s.startsWith("[") && s.includes("]")) s = s.slice(1, s.indexOf("]"));
  if (s.startsWith("::ffff:")) s = s.slice("::ffff:".length);
  return s;
}

function ipv4Allowed(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  const nums = parts.map((part) => Number(part));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return false;
  const [a, b] = nums;
  if (a === 127) return true;
  if (a === 10) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

function isIpv6(ip: string): boolean {
  if (!ip.includes(":") || ip.split("::").length > 2) return false;
  const halves = ip.split("::");
  const groups = halves.flatMap((half) => (half === "" ? [] : half.split(":")));
  if (groups.some((group) => !/^[0-9a-f]{1,4}$/.test(group))) return false;
  if (halves.length === 1) return groups.length === 8;
  return groups.length < 8;
}

function ipv6Allowed(ip: string): boolean {
  if (!isIpv6(ip)) return false;
  if (ip === "::1") return true;
  const first = ip.split(":")[0] ?? "";
  if (!/^[0-9a-f]{1,4}$/.test(first)) return false;
  const value = Number.parseInt(first, 16);
  if (value >= 0xfc00 && value <= 0xfdff) return true;
  if (value >= 0xfe80 && value <= 0xfebf) return true;
  return false;
}

export function isHomeNetwork(ip: string): boolean {
  const s = normalise(ip);
  if (!s) return false;
  if (s.includes(".")) return ipv4Allowed(s);
  return ipv6Allowed(s);
}

export function clientAllowed(peer: string, forwardedFor: string | null): boolean {
  const peerIp = normalise(peer);
  const loopback = peerIp === "::1" || ipv4Allowed(peerIp) && peerIp.startsWith("127.");
  if (loopback && forwardedFor && forwardedFor.trim()) {
    const hops = forwardedFor.split(",").map((hop) => hop.trim()).filter(Boolean);
    const nearest = hops[hops.length - 1] ?? "";
    return isHomeNetwork(nearest);
  }
  return isHomeNetwork(peerIp);
}
