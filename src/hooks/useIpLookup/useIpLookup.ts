import { useQueryClient } from "@tanstack/react-query";
import { fetchIpLocation } from "../../api/ipApi/ipApi";
import type { IpLookupResult } from "../../types";

type UseIpLookupReturn = {
  lookup: (ip: string) => Promise<IpLookupResult>;
};

export function useIpLookup(): UseIpLookupReturn {
  const queryClient = useQueryClient();

  const lookup = async (ip: string): Promise<IpLookupResult> => {
    const key = ip.trim();

    return queryClient.fetchQuery({
      queryKey: ["ipLocation", key],
      queryFn: () => fetchIpLocation(key),
       staleTime: Infinity,
      retry: false,
    });
  };

  return { lookup };
}
