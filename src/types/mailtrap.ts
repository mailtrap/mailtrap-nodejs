export type CustomVariables = Record<string, string | number | boolean>;

export type MailtrapHeaders = Record<string, string>;

export type Address = {
  name?: string;
  email: string;
};

export type Attachment = {
  filename: string;
  type?: string;
  content: string | Buffer;
  disposition?: string;
  content_id?: string;
};

export type CommonMail = {
  from: Address;
  to: Address[];
  cc?: Address[];
  bcc?: Address[];
  attachments?: Attachment[];
  headers?: MailtrapHeaders;
  custom_variables?: CustomVariables;
  reply_to?: Address;
};

export type TemplateValue =
  | string
  | number
  | boolean
  | TemplateValue[]
  | { [key: string]: TemplateValue };

export type TemplateVariables = Record<string, TemplateValue>;

type MailFromTemplateContent = {
  template_uuid: string;
  template_variables?: TemplateVariables;
};

type TextMailContent = {
  text?: string | Buffer;
};

type HTMLMailContent = {
  html?: string | Buffer;
};

type CommonMailParams = CommonMail & {
  subject: string;
  category?: string;
};

export type MailContent = CommonMailParams &
  (TextMailContent | HTMLMailContent);

export type Mail = CommonMail & (MailContent | MailFromTemplateContent);

export type SendResponse = {
  success: true;
  message_ids: string[];
};

export type SendError = {
  success: false;
  errors: string[];
};

export type MailtrapClientConfig = {
  token: string;
  testInboxId?: number;
  accountId?: number;
  organizationId?: number;
  bulk?: boolean;
  sandbox?: boolean;
  userAgent?: string;
};

export type BatchMail = Mail[];

export interface BatchSendResponse {
  success: boolean;
  responses: Array<{
    success: boolean;
    message_ids?: string[];
    errors?: string[];
  }>;
}

interface BaseAddress {
  email: string;
  name?: string;
}

interface InlineBatchSendBase extends Omit<Mail, "to"> {
  from: BaseAddress;
  subject: string; // Required when using inline content
  text?: string | Buffer;
  html?: string | Buffer;
  attachments?: Attachment[];
  headers?: Record<string, string>;
  custom_variables?: Record<string, string>;
  category?: string; // Allowed for inline content
  reply_to?: BaseAddress;
}

interface TemplateBatchSendBase extends Omit<Mail, "to"> {
  from: BaseAddress;
  template_uuid: string; // Required for template usage
  template_variables?: TemplateVariables;
  custom_variables?: Record<string, string>;
  reply_to?: BaseAddress;
}

export interface BatchSendRequest {
  base?: InlineBatchSendBase | TemplateBatchSendBase;
  requests: {
    to: BaseAddress[];
    cc?: BaseAddress[];
    bcc?: BaseAddress[];
    reply_to?: BaseAddress[];
    subject?: string;
    text?: string;
    html?: string;
    category?: string; // Only allowed when not using template_uuid
    template_uuid?: string;
    template_variables?: TemplateVariables;
    custom_variables?: Record<string, string>;
    attachments?: Attachment[];
    headers?: Record<string, string>;
  }[];
}

/**
 * Dynamic contact field values used when creating or updating contacts.
 * Represents the actual data stored in contact fields (e.g., first_name: "John", phone: "123-456-7890").
 */
export interface ContactFields {
  [key: string]: string | number | boolean | undefined;
}

export interface ContactData {
  email: string;
  fields?: ContactFields;
  list_ids?: number[];
}
