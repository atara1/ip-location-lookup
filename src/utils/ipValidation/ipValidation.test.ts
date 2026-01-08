import { validateIp } from "./ipValidation";

describe("validateIp", () => {
  it("returns error when input is empty", () => {
    const result = validateIp("");

    expect(result).toEqual({
      ok: false,
      error: "IP is required",
    });
  });

  it("trims whitespace before validation", () => {
    const result = validateIp("  8.8.8.8  ");

    expect(result).toEqual(
      expect.objectContaining({
        ok: true,
        kind: "ipv4",
        value: "8.8.8.8",
      })
    );
  });

  it("returns error for invalid IPv4 format", () => {
    const result = validateIp("999.1.1.1");

    expect(result).toEqual({
      ok: false,
      error: "Invalid IPv4 address",
    });
  });

  it("accepts valid IPv4 addresses", () => {
    const validIps = "1.1.1.1";
    const result = validateIp(validIps);

    expect(result).toEqual(
      expect.objectContaining({
        ok: true,
        kind: "ipv4",
        value: validIps,
      })
    );
  });

  it("rejects private/reserved IPs (example: 127.0.0.1)", () => {
    const result = validateIp("127.0.0.1");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/not supported/i);
    }
  });
});
