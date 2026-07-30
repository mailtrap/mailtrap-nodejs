export type DeliveryMode = "rapid" | "gradual";

export type CampaignState =
  | "draft"
  | "scheduled"
  | "started"
  | "queued"
  | "paused"
  | "terminating"
  | "under_review"
  | "finished"
  | "failed"
  | "failed_immediately";

export type ReplyTo = {
  display_name?: string;
  local_part?: string;
  domain?: string;
};

export type DeliveryOptions = {
  /** Applies when `delivery_mode` is `gradual`. */
  emails_per_hour?: number | null;
};

/**
 * Inline email template — the campaign's subject and design. The campaign's
 * template is always edited in place (there is no template `id` to pass);
 * updates are partial — only the provided sub-fields change.
 */
export type TemplateAttributes = {
  /** Email subject line. Required when creating a campaign. */
  subject?: string;
  /**
   * HTML body (the design). Optional for a draft; required before the campaign
   * can be scheduled or started. Include an unsubscribe link via an anchor
   * whose `href` contains the `__unsubscribe_url__` placeholder.
   */
  body_html?: string;
  body_text?: string | null;
  /** Bare names of the merge tags used in the subject/body, e.g. `["first_name"]`. */
  merge_tags?: string[];
};

export type CampaignStateError = {
  message: string;
  rcpt_index: number;
};

export type CurrentStateMetadata = {
  reason?: string;
  /** Last error message recorded for a failed campaign. */
  error?: string;
  /** Per-recipient errors recorded when sending failed. */
  errors?: CampaignStateError[];
  /** When the campaign is scheduled to send. Present in the `scheduled` state. */
  scheduled_at?: string;
};

/**
 * Aggregated campaign performance metrics. Counts and rates are `0` when the
 * campaign has not been started.
 */
export type EmailCampaignStats = {
  delivery_count: number;
  open_count: number;
  click_count: number;
  bounce_count: number;
  unsubscription_count: number;
  sent_count: number;
  spam_count: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  spam_rate: number;
  unsubscription_rate: number;
};

export type CampaignTemplate = {
  id: number;
  subject: string;
  merge_tags: string[];
  /** Returned only on single-campaign responses; the list endpoint omits it. */
  body_html?: string | null;
  /** Returned only on single-campaign responses; the list endpoint omits it. */
  body_text?: string | null;
};

export type EmailCampaign = {
  id: number;
  /** ID of the sending domain, as returned by the Sending Domains endpoints. */
  domain_id: number;
  domain_name: string;
  name: string;
  from_local_part: string;
  from_display_name: string;
  reply_to: ReplyTo;
  current_state: CampaignState;
  current_state_metadata: CurrentStateMetadata;
  created_at: string;
  updated_at: string;
  last_started_at: string | null;
  /** Present only when the campaign has been started. */
  last_started_at_date?: string;
  /** `null` until the audience is resolved. */
  recipient_total_count: number | null;
  contact_list_ids: number[];
  contact_segment_ids: number[];
  delivery_mode: DeliveryMode;
  delivery_options: DeliveryOptions;
  template: CampaignTemplate;
};

export type Pagination = {
  token: number;
  prev_token: number | null;
  next_token: number | null;
  first_url: string;
  prev_url: string | null;
  current_url: string;
  next_url: string | null;
};

export type ListEmailCampaignsParams = {
  /** Number of campaigns per page. Maximum 100, defaults to 50. */
  per_page?: number;
  /** Filter campaigns by name. */
  search?: string;
  /** Page number to retrieve (page-token pagination). Defaults to 1. */
  token?: number;
};

export type CreateEmailCampaignParams = {
  name: string;
  /** ID of the verified sending domain, as returned by the Sending Domains endpoints. */
  domain_id: number;
  from_local_part: string;
  from_display_name?: string;
  reply_to?: ReplyTo;
  template_attributes: TemplateAttributes & { subject: string };
  delivery_mode?: DeliveryMode;
  delivery_options?: DeliveryOptions;
  contact_list_ids?: number[];
  contact_segment_ids?: number[];
};

export type UpdateEmailCampaignParams = {
  name?: string;
  /** ID of the verified sending domain, as returned by the Sending Domains endpoints. */
  domain_id?: number;
  from_local_part?: string;
  from_display_name?: string;
  reply_to?: ReplyTo;
  template_attributes?: TemplateAttributes;
  delivery_mode?: DeliveryMode;
  delivery_options?: DeliveryOptions;
  contact_list_ids?: number[];
  contact_segment_ids?: number[];
};

export type ScheduleEmailCampaignParams = {
  /**
   * When to send the campaign (ISO 8601). Must be in the future and no more
   * than 1 month ahead.
   */
  datetime: string;
};

export type GetEmailCampaignStatsParams = {
  /** Start of the aggregation window (inclusive), `YYYY-MM-DD`. */
  start_date?: string;
  /** End of the aggregation window (inclusive), `YYYY-MM-DD`. */
  end_date?: string;
};

export type ListEmailCampaignsResponse = {
  data: EmailCampaign[];
  pagination: Pagination;
};

export type GetEmailCampaignResponse = {
  data: EmailCampaign;
};

export type CreateEmailCampaignResponse = {
  data: EmailCampaign;
};

export type UpdateEmailCampaignResponse = {
  data: EmailCampaign;
};

/** Delete returns `204 No Content` — there is no response body. */
export type DeleteEmailCampaignResponse = void;

/** Lifecycle actions (start/schedule/cancel/terminate/reset) return the updated campaign. */
export type EmailCampaignActionResponse = {
  data: EmailCampaign;
};

export type GetEmailCampaignStatsResponse = {
  data: EmailCampaignStats;
};
