export type Resource = {
  id: number;
  name: string;
  type: string;
  access_level: number;
  resources: Resource[];
};

export type PermissionResourceParams = {
  resourceId: string;
  resourceType: string;
  accessLevel?: string;
  destroy?: boolean;
};
