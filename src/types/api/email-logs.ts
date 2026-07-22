export type EmailLogMessageStatus =
  | "delivered"
  | "not_delivered"
  | "enqueued"
  | "opted_out";

export type EmailLogMessage = {
  message_id: string;
  status: EmailLogMessageStatus;
  subject: string | null;
  rfc_message_id: string | null;
  in_reply_to: string | null;
  references: string[];
  thread_id: string | null;
  from: string;
  to: string;
  sent_at: string;
  client_ip: string | null;
  category: string | null;
  custom_variables: Record<string, unknown>;
  sending_stream: "transactional" | "bulk";
  sending_domain_id: number;
  template_id: number | null;
  template_variables: Record<string, unknown>;
  opens_count: number;
  clicks_count: number;
};

export type EmailLogsList = {
  messages: EmailLogMessage[];
  total_count: number;
  next_page_cursor: string | null;
};

export type EmailLogMessageDetails = EmailLogMessage & {
  raw_message_url?: string;
  events?: EmailLogMessageEvent[];
};

/** Discriminated union: use event_type to narrow. */
export type EmailLogMessageEvent =
  | EmailLogMessageEventDelivery
  | EmailLogMessageEventOpen
  | EmailLogMessageEventClick
  | EmailLogMessageEventBounce
  | EmailLogMessageEventSpam
  | EmailLogMessageEventUnsubscribe
  | EmailLogMessageEventReject;

export type EmailLogMessageEventDeliveryDetails = {
  sending_ip: string | null;
  recipient_mx: string | null;
  email_service_provider: string | null;
};

export type EmailLogMessageEventDelivery = {
  event_type: "delivery";
  created_at: string;
  details: EmailLogMessageEventDeliveryDetails;
};

export type EmailLogMessageEventOpenDetails = {
  web_ip_address: string | null;
};

export type EmailLogMessageEventOpen = {
  event_type: "open";
  created_at: string;
  details: EmailLogMessageEventOpenDetails;
};

export type EmailLogMessageEventClickDetails = {
  click_url: string | null;
  web_ip_address: string | null;
};

export type EmailLogMessageEventClick = {
  event_type: "click";
  created_at: string;
  details: EmailLogMessageEventClickDetails;
};

export type EmailLogMessageEventBounceDetails = {
  sending_ip: string | null;
  recipient_mx: string | null;
  email_service_provider: string | null;
  email_service_provider_status: string | null;
  email_service_provider_response: string | null;
  bounce_category: string | null;
};

export type EmailLogMessageEventBounce = {
  event_type: "soft_bounce" | "bounce";
  created_at: string;
  details: EmailLogMessageEventBounceDetails;
};

export type EmailLogMessageEventSpamDetails = {
  spam_feedback_type: string | null;
};

export type EmailLogMessageEventSpam = {
  event_type: "spam";
  created_at: string;
  details: EmailLogMessageEventSpamDetails;
};

export type EmailLogMessageEventUnsubscribeDetails = {
  web_ip_address: string | null;
};

export type EmailLogMessageEventUnsubscribe = {
  event_type: "unsubscribe";
  created_at: string;
  details: EmailLogMessageEventUnsubscribeDetails;
};

export type EmailLogMessageEventRejectDetails = {
  reject_reason: string | null;
};

export type EmailLogMessageEventReject = {
  event_type: "suspension" | "reject";
  created_at: string;
  details: EmailLogMessageEventRejectDetails;
};

/** Filter types for list params (deepObject query). */

export type FilterTo = {
  operator: "ci_contain" | "ci_not_contain" | "ci_equal" | "ci_not_equal";
  value: string | string[];
};

export type FilterFrom = {
  operator: "ci_contain" | "ci_not_contain" | "ci_equal" | "ci_not_equal";
  value: string | string[];
};

export type FilterSubject = {
  operator:
    | "ci_contain"
    | "ci_not_contain"
    | "ci_equal"
    | "ci_not_equal"
    | "empty"
    | "not_empty";
  value?: string | string[];
};

export type FilterStatus = {
  operator: "equal" | "not_equal";
  value: EmailLogMessageStatus | EmailLogMessageStatus[];
};

export type EmailLogEventType =
  | "delivery"
  | "open"
  | "click"
  | "bounce"
  | "spam"
  | "unsubscribe"
  | "soft_bounce"
  | "reject"
  | "suspension";

export type FilterEvents = {
  operator: "include_event" | "not_include_event";
  value: EmailLogEventType | EmailLogEventType[];
};

export type FilterNumber = {
  operator: "equal" | "greater_than" | "less_than";
  value: number;
};

export type FilterClientIp = {
  operator: "equal" | "not_equal" | "contain" | "not_contain";
  value: string | string[];
};

export type FilterSendingIp = {
  operator: "equal" | "not_equal" | "contain" | "not_contain";
  value: string | string[];
};

export type FilterMandatoryText = {
  operator: "ci_contain" | "ci_not_contain" | "ci_equal" | "ci_not_equal";
  value: string | string[];
};

export type FilterExact = {
  operator: "equal" | "not_equal";
  value: string | string[];
};

export type FilterSendingDomainId = {
  operator: "equal" | "not_equal";
  value: number | number[];
};

export type FilterSendingStream = {
  operator: "equal" | "not_equal";
  value: ("transactional" | "bulk") | ("transactional" | "bulk")[];
};

export type EmailLogsListFilters = {
  sent_after?: string;
  sent_before?: string;
  to?: FilterTo;
  from?: FilterFrom;
  subject?: FilterSubject;
  status?: FilterStatus;
  events?: FilterEvents;
  clicks_count?: FilterNumber;
  opens_count?: FilterNumber;
  client_ip?: FilterClientIp;
  sending_ip?: FilterSendingIp;
  email_service_provider_response?: FilterMandatoryText;
  email_service_provider?: FilterExact;
  recipient_mx?: FilterMandatoryText;
  category?: FilterExact;
  sending_domain_id?: FilterSendingDomainId;
  sending_stream?: FilterSendingStream;
};

export type EmailLogsListParams = {
  search_after?: string;
  filters?: EmailLogsListFilters;
};
