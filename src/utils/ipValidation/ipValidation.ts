export type IpValidationResult =
  | { ok: true; value: string; kind: "ipv4" }
  | { ok: false; error: string };

function normalizeIpInput(input: string): string {
  return input.trim().replace(/\s+/g, "");
}

function detectNonIpPatterns(value: string): string | null {
  if (value.includes("://")) return "Please enter only an IP (not a URL)";
  if (value.includes("/")) return "CIDR notation is not supported (e.g. /24)";
  if (value.includes("?") || value.includes("#"))
    return "Please enter only an IP (no query/hash)";
  if (value.includes(":")) {
    
    if (value.includes(".")) return "IP with port is not supported (remove :port)";
    return "IPv6 is not supported (yet)";
  }
  return null;
}

function isOnlyDigitsAndDots(value: string): boolean {
  return /^[0-9.]+$/.test(value);
}

function isIpv4Syntax(value: string): boolean {
  const parts = value.split(".");
  if (parts.length !== 4) return false;

  for (const part of parts) {
    if (part.length === 0) return false;
    if (!/^\d+$/.test(part)) return false;

    if (part.length > 1 && part.startsWith("0")) return false;

    const n = Number(part);
    if (!Number.isInteger(n) || n < 0 || n > 255) return false;
  }
  return true;
}

function toIpv4Int(ip: string): number {
  const [a, b, c, d] = ip.split(".").map(Number);
  return (((a << 24) >>> 0) | (b << 16) | (c << 8) | d) >>> 0;
}

function inCidr(ip: string, base: string, prefix: number): boolean {
  const ipInt = toIpv4Int(ip);
  const baseInt = toIpv4Int(base);
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  return (ipInt & mask) === (baseInt & mask);
}

function reservedReason(ip: string): string | null {
  if (inCidr(ip, "127.0.0.0", 8)) return "Loopback IP is not supported";
  if (inCidr(ip, "0.0.0.0", 8)) return "This-network IP is not supported";
  if (inCidr(ip, "169.254.0.0", 16)) return "Link-local IP is not supported";
  if (ip === "255.255.255.255") return "Broadcast IP is not supported";

  if (inCidr(ip, "10.0.0.0", 8)) return "Private IP is not supported";
  if (inCidr(ip, "172.16.0.0", 12)) return "Private IP is not supported";
  if (inCidr(ip, "192.168.0.0", 16)) return "Private IP is not supported";
  if (inCidr(ip, "100.64.0.0", 10)) return "Carrier-grade NAT IP is not supported";

  if (inCidr(ip, "224.0.0.0", 4)) return "Multicast IP is not supported";
  if (inCidr(ip, "240.0.0.0", 4)) return "Reserved IP is not supported";

  if (inCidr(ip, "192.0.2.0", 24)) return "Documentation IP is not supported";
  if (inCidr(ip, "198.51.100.0", 24)) return "Documentation IP is not supported";
  if (inCidr(ip, "203.0.113.0", 24)) return "Documentation IP is not supported";
  if (inCidr(ip, "198.18.0.0", 15)) return "Benchmark/testing IP is not supported";

  return null;
}

export function validateIp(input: string): IpValidationResult {
  const value = normalizeIpInput(input);

  if (!value) return { ok: false, error: "IP is required" };

  const nonIp = detectNonIpPatterns(value);
  if (nonIp) return { ok: false, error: nonIp };

  if (!isOnlyDigitsAndDots(value)) {
    return { ok: false, error: "Only IPv4 is supported (digits and dots)" };
  }

  if (!isIpv4Syntax(value)) {
    return { ok: false, error: "Invalid IPv4 address" };
  }

  const reason = reservedReason(value);
  if (reason) return { ok: false, error: reason };

  return { ok: true, value, kind: "ipv4" };
}
