import { validateIpv4 } from "./ipValidation";

describe("validateIpv4", () => {
  it("returns error when input is empty", () => {
    const result = validateIpv4("");

    expect(result).toEqual({
      ok: false,
      error: "IP is required",
    });
  });

  it("trims whitespace before validation", () => {
    const result = validateIpv4("  8.8.8.8  ");

    expect(result).toEqual({
      ok: true,
      value: "8.8.8.8",
    });
  });

  it("returns error for invalid IPv4 format", () => {
    const invalidIps = "999.1.1.1";

    const result = validateIpv4(invalidIps);
    expect(result).toEqual({
      ok: false,
      error: "Invalid IPv4 address",
    });
  });

  it("accepts valid IPv4 addresses", () => {
    const validIps = "1.1.1.1";

    const result = validateIpv4(validIps);
    expect(result).toEqual({
      ok: true,
      value: validIps,
    });
  });
});
