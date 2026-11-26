export type WebhookType =
  | "email_sending"
  | "campaigns"
  | "audit_log"
  | "inbound_receiving";

export type PayloadFormat = "json" | "jsonlines";

export type SendingStream = "transactional" | "bulk";

/**
 * `subscription_preferences_update` (a contact changed their subscription
 * topic preferences) applies only to `email_sending` webhooks on the `bulk`
 * stream and to `campaigns` webhooks.
 */
export type WebhookEventType =
  | "delivery"
  | "soft_bounce"
  | "bounce"
  | "suspension"
  | "unsubscribe"
  | "open"
  | "spam_complaint"
  | "click"
  | "reject"
  | "subscription_preferences_update";

export type Webhook = {
  id: number;
  url: string;
  active: boolean;
  webhook_type: WebhookType;
  payload_format: PayloadFormat;
  sending_stream?: SendingStream | null;
  domain_id?: number | null;
  inbound_inbox_id?: number | null;
  event_types?: WebhookEventType[];
};

export type ListWebhooksResponse = {
  data: Webhook[];
};

export type GetWebhookResponse = {
  data: Webhook;
};

export type CreateWebhookParams = {
  url: string;
  webhook_type: WebhookType;
  active?: boolean;
  payload_format?: PayloadFormat;
  sending_stream?: SendingStream;
  event_types?: WebhookEventType[];
  domain_id?: number;
  inbound_inbox_id?: number;
};

export type WebhookWithSigningSecret = Webhook & {
  signing_secret: string;
};

export type CreateWebhookResponse = {
  data: WebhookWithSigningSecret;
};

export type UpdateWebhookParams = {
  url?: string;
  active?: boolean;
  payload_format?: PayloadFormat;
  event_types?: WebhookEventType[];
  inbound_inbox_id?: number;
};

export type UpdateWebhookResponse = {
  data: Webhook;
};

export type DeleteWebhookResponse = {
  data: Webhook;
};
