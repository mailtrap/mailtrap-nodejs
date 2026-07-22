import { AttachmentWithDownloadUrl } from "./messages";

export type MessageVisibilityStatus = "available" | "placeholder";
export type MessageDirection = "inbound" | "outbound";

export interface ThreadSummary {
  id: string;
  subject: string | null;
  message_count: number;
  size: number;
  first_message_at: string;
  last_received_at: string | null;
  last_sent_at: string | null;
  last_activity_at: string;
  last_message_id: string | null;
  senders: string[];
  recipients: string[];
  attachments: AttachmentWithDownloadUrl[];
}

/**
 * A message inside a thread. Only `visibility_status` and `direction` are
 * guaranteed; `placeholder` entries omit the rest. `available` outbound
 * entries additionally carry the delivery lifecycle fields.
 */
export interface ThreadMessage {
  visibility_status: MessageVisibilityStatus;
  direction: MessageDirection;
  id?: string;
  message_group_id?: string | null;
  subject?: string | null;
  rfc_message_id?: string | null;
  in_reply_to?: string | null;
  references?: string[];
  from?: string | null;
  to?: string[];
  cc?: string[];
  bcc?: string[];
  reply_to?: string | null;
  created_at?: string;
  email_size?: number;
  text_body?: string | null;
  html_body?: string | null;
  attachments?: AttachmentWithDownloadUrl[];
  delivery_status?: string | null;
  delivered_at?: string | null;
  bounced_at?: string | null;
}

export interface Thread extends ThreadSummary {
  messages: ThreadMessage[];
}

export interface ThreadsListResponse {
  data: ThreadSummary[];
  total_count: number;
  last_id: string | null;
}

export interface ThreadsListParams {
  last_id?: string;
}
