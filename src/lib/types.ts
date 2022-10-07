export type MailtrapClientConfig = {
  endpoint?: string;
  token: string;
};

export type Mail = {
  subject: string;
  from: Address;
  to: Address[];
  cc?: Address[];
  bcc?: Address[];
  attachments?: Attachment[];
  headers?: Record<string, string>;
  category?: string;
  custom_variables?: Record<string, string | number | boolean>;
  text?: string | Buffer;
  html?: string | Buffer;
};

export type Address = {
  name?: string;
  email: string;
};

export type Attachment = {
  filename: string;
  content: string | Buffer;
  type?: string;
  disposition?: string;
  content_id?: string;
};

export type SendResponse = {
  success: true;
  message_ids: string[];
};

export type SendError = {
  success: false;
  errors: string[];
};
