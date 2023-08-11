export type Mail = {
  from: Address;
  to: Address[];
  cc?: Address[];
  bcc?: Address[];
  attachments?: Attachment[];
  headers?: Headers;
  custom_variables?: Record<string, string | number | boolean>;
} & (MailContent | MailFromTemplateContent);

type MailContent = {
  subject: string;
  category?: string;
} & (TextMailContent | HTMLMailContent);

type MailFromTemplateContent = {
  template_uuid: string;
  template_variables?: Record<string, string | number | boolean>;
};

type TextMailContent = {
  text: string | Buffer;
};

type HTMLMailContent = {
  html: string | Buffer;
};

export type Address = {
  name?: string;
  email: string;
};

export type Attachment = {
  filename: string;
  type: string;
  content: string | Buffer;
  disposition?: string;
  content_id?: string;
};

export type Headers = Record<string, string>;

export type SendResponse = {
  success: true;
  message_ids: string[];
};

export type SendError = {
  success: false;
  error: string[];
};
