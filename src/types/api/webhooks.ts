export type WebhookType = "email_sending" | "audit_log";

export type PayloadFormat = "json" | "jsonlines";

export type SendingStream = "transactional" | "bulk";

export type WebhookEventType =
  | "delivery"
  | "soft_bounce"
  | "bounce"
  | "suspension"
  | "unsubscribe"
  | "open"
  | "spam_complaint"
  | "click"
  | "reject";

export type Webhook = {
  id: number;
  url: string;
  active: boolean;
  webhook_type: WebhookType;
  payload_format: PayloadFormat;
  sending_stream?: SendingStream | null;
  domain_id?: number | null;
  event_types?: WebhookEventType[];
};

export type ListWebhooksResponse = {
  data: Webhook[];
};

export type CreateWebhookParams = {
  url: string;
  webhook_type: WebhookType;
  active?: boolean;
  payload_format?: PayloadFormat;
  sending_stream?: SendingStream;
  event_types?: WebhookEventType[];
  domain_id?: number;
};

export type WebhookWithSigningSecret = Webhook & {
  signing_secret: string;
};

export type CreateWebhookResponse = {
  data: WebhookWithSigningSecret;
};
