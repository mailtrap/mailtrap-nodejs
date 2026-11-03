import { Sandbox } from "./sandboxes";

type ShareLinks = {
  admin: string;
  viewer: string;
};

type Permissions = {
  can_read: boolean;
  can_update: boolean;
  can_destroy: boolean;
  can_leave: boolean;
};

export type Project = {
  id: number;
  name: string;
  share_links: ShareLinks;
  inboxes: Sandbox[];
  permissions: Permissions;
};
