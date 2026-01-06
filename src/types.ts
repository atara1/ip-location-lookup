export type LookupStatus = "idle" | "loading" | "success" | "error";

export interface IpLookupRowModel {
  id: string;
  ip: string;
  status: LookupStatus;
  country?: string;
  countryCode?: string;
  timezone?: string;
  error?: string;
}

export type IpLookupResult = {
  country: string;
  countryCode?: string;
  timezone: string;
};
