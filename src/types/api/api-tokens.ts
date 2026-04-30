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
