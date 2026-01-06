import { useQueryClient } from "@tanstack/react-query";
import { fetchIpLocation } from "../api/ipApi";

type IpLookupResult = {
  country: string;
  countryCode?: string;
  timezone: string;
};

export function useIpLookup() {
  const queryClient = useQueryClient();

  const lookup = async (ip: string): Promise<IpLookupResult> => {
    const key = ip.trim();

    return queryClient.fetchQuery({
      queryKey: ["ipLocation", key],
      queryFn: () => fetchIpLocation(key),
    });
  };

  return { lookup };
}
