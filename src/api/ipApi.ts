export async function fetchIpLocation(ip: string) {
  const res = await fetch(`https://ipapi.co/${ip}/json/`);
  if (!res.ok) throw new Error("Network error");
  const data = await res.json();

  if (data.error) {
    throw new Error(data.reason || "Invalid IP");
  }

  return {
    country: data.country_name as string,
    countryCode: (data.country as string) || undefined,
    timezone: data.timezone as string,
  };
}
