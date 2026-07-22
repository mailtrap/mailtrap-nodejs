export type ContentDisposition = "attachment" | "inline";

export interface Attachment {
  attachment_id: string;
  size: number | null;
  filename: string | null;
  content_type: string | null;
  content_disposition: ContentDisposition | null;
  content_id: string | null;
}

export interface AttachmentWithDownloadUrl extends Attachment {
  download_url: string | null;
  download_url_expires_at: string | null;
}

export interface Message {
  /** Mailtrap object id (not the RFC Message-ID header). */
  id: string;
  inbox_id: number;
  from: string | null;
  to: string[];
  cc: string[];
  bcc: string[];
  reply_to: string | null;
  subject: string | null;
  /** Value of the RFC 5322 Message-ID header. */
  rfc_message_id: string | null;
  in_reply_to: string | null;
  references: string[];
  headers: Record<string, string> | null;
  size: number | null;
  html_size: number | null;
  text_size: number | null;
  received_at: string;
  /** ID of the thread this message belongs to, if any. */
  thread_id: string | null;
  attachments: Attachment[];
}

export interface MessageDetails extends Omit<Message, "attachments"> {
  attachments: AttachmentWithDownloadUrl[];
  raw_message_url: string | null;
  raw_message_expires_at: string | null;
  html_body: string | null;
  text_body: string | null;
}

export interface MessagesListResponse {
  data: Message[];
  total_count: number;
  last_id: string | null;
}

export interface MessagesListParams {
  last_id?: string;
}

export interface Address {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  content: string;
  filename: string;
  type?: string;
  disposition?: ContentDisposition;
  content_id?: string;
}

/**
 * Body for reply, reply-all, and forward. `from` is rejected for
 * Mailtrap-hosted inboxes and required for custom-domain inboxes.
 */
export interface SendMessageParams {
  from?: Address;
  to?: Address[];
  cc?: Address[];
  bcc?: Address[];
  reply_to?: Address;
  text?: string;
  html?: string;
  category?: string;
  attachments?: EmailAttachment[];
  headers?: Record<string, string>;
  custom_variables?: Record<string, string>;
}

/** Forward requires at least one recipient in `to`. */
export interface ForwardMessageParams extends Omit<SendMessageParams, "to"> {
  to: [Address, ...Address[]];
}

export interface SendMessageResult {
  message_ids: string[];
}
