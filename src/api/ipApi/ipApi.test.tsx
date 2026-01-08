import { fetchIpLocation } from "./ipApi";

describe("fetchIpLocation", () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn() as any;
  });

  it("returns mapped data on success", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        country_name: "United States",
        country: "US",
        timezone: "America/Los_Angeles",
      }),
    });

    const result = await fetchIpLocation("8.8.8.8");

    expect(result).toEqual({
      country: "United States",
      countryCode: "US",
      timezone: "America/Los_Angeles",
    });

  expect(globalThis.fetch).toHaveBeenCalledWith("/ipapi/8.8.8.8/json/");

  });

  it("throws error when response is not ok", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({ ok: false });

    await expect(fetchIpLocation("8.8.8.8")).rejects.toThrow("Network error");
  });
});
