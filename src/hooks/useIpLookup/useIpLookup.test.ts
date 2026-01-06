import { renderHook } from "@testing-library/react";
import { useIpLookup } from "./useIpLookup";
import { fetchIpLocation } from "../../api/ipApi/ipApi";

const fetchQueryMock = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    fetchQuery: fetchQueryMock,
  }),
}));

jest.mock("../../api/ipApi/ipApi", () => ({
  fetchIpLocation: jest.fn(),
}));

describe("useIpLookup", () => {
  it("calls queryClient.fetchQuery with the correct key and queryFn", async () => {
    const { result } = renderHook(() => useIpLookup());

    fetchQueryMock.mockResolvedValue({
      country: "Israel",
      countryCode: "IL",
      timezone: "Asia/Jerusalem",
    });

    await result.current.lookup(" 8.8.8.8 ");

    expect(fetchQueryMock).toHaveBeenCalledTimes(1);
    const options = fetchQueryMock.mock.calls[0][0];

    expect(options.queryKey).toEqual(["ipLocation", "8.8.8.8"]);
  });

  it("queryFn calls fetchIpLocation with the trimmed ip", async () => {
    const { result } = renderHook(() => useIpLookup());

    fetchQueryMock.mockImplementation(async ({ queryFn }: any) => queryFn());

    (fetchIpLocation as jest.Mock).mockResolvedValue({
      country: "United States",
      countryCode: "US",
      timezone: "America/Los_Angeles",
    });

    const res = await result.current.lookup(" 8.8.8.8 ");

    expect(fetchIpLocation).toHaveBeenCalledTimes(1);
    expect(fetchIpLocation).toHaveBeenCalledWith("8.8.8.8");

    expect(res).toEqual({
      country: "United States",
      countryCode: "US",
      timezone: "America/Los_Angeles",
    });
  });

  it("propagates errors from fetchQuery", async () => {
    const { result } = renderHook(() => useIpLookup());

    fetchQueryMock.mockRejectedValue(new Error("Network error"));

    await expect(result.current.lookup("8.8.8.8")).rejects.toThrow(
      "Network error"
    );
  });
});
