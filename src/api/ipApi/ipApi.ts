import type { IpLookupResult } from "../../types";

export async function fetchIpLocation(ip: string): Promise<IpLookupResult> {
  const res = await fetch(`/ipapi/${ip}/json/`);  
    if (res.status === 429) {
    throw new Error("Rate limit reached. Please wait a bit and try again.");
  }
  if (!res.ok) throw new Error("Network error");
  const data = await res.json()

 
  if (data.error) {
    throw new Error(data.reason || "Invalid IP");
  }

  return {
    country: data.country_name as string,
    countryCode: (data.country as string) || undefined,
    timezone: data.timezone as string,
  };
}
