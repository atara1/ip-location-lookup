export type IpValidationResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

const ipv4Regex =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

export function validateIpv4(input: string): IpValidationResult {
  const value = input.trim();
  if (!value) return { ok: false, error: 'IP is required' };

  if (!ipv4Regex.test(value)) {
    return { ok: false, error: 'Invalid IPv4 address' };
  }

  return { ok: true, value };
}
