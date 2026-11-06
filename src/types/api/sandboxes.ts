export type UpdateSandboxParams = {
  name: string;
  emailUsername: string;
};

type Permissions = {
  can_read: boolean;
  can_update: boolean;
  can_destroy: boolean;
  can_leave: boolean;
};

export type Sandbox = {
  id: number;
  name: string;
  username: string;
  password: string;
  max_size: number;
  status: string;
  email_username: string;
  email_username_enabled: boolean;
  sent_messages_count: number;
  forwarded_messages_count: number;
  used: boolean;
  forward_from_email_address: string;
  project_id: number;
  domain: string;
  pop3_domain: string;
  email_domain: string;
  smtp_ports: number[];
  pop3_ports: number[];
  emails_count: number;
  emails_unread_count: number;
  last_message_sent_at: string | null;
  max_message_size: number;
  permissions: Permissions;
};
