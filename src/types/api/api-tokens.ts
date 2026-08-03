export type ResourceType = "account" | "project" | "inbox" | "sending_domain";

export type AccessLevel = 10 | 100;

export type ResourcePermissionInput = {
  resource_type: ResourceType;
  resource_id: number | string;
  access_level: AccessLevel;
};

export type ResourcePermission = {
  resource_type: ResourceType;
  resource_id: number | string;
  access_level: AccessLevel;
};

export type CreateApiTokenRequest = {
  name: string;
  /**
   * Optional token expiration as an ISO 8601 date-time.
   * Omit for the server default (a 1-year default is being rolled out).
   * Pass explicit `null` for a token that never expires.
   * Past or more-than-5-years-ahead values are rejected with 422.
   */
  expires_at?: string | null;
  resources?: ResourcePermissionInput[];
};

export type ApiToken = {
  id: number;
  name: string;
  last_4_digits: string;
  created_by: string;
  expires_at: string | null;
  resources: ResourcePermission[];
};

export type ApiTokenWithToken = ApiToken & {
  token: string;
};
