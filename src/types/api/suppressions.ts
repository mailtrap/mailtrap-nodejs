/**
 * `topic unsubscription` rows are listed only with
 * `include_topic_unsubscriptions`, and can't be created or deleted.
 */
export type SuppressionType =
  | "hard bounce"
  | "spam complaint"
  | "unsubscription"
  | "manual import"
  | "topic unsubscription";

/**
 * `any` marks an opt-out stored without a sending stream; it can't be passed
 * to `create`.
 */
export type SuppressionSendingStream = "transactional" | "bulk" | "any";

export type Suppression = {
  id: string;
  type: SuppressionType;
  created_at: string;
  email: string;
  sending_stream: SuppressionSendingStream;
  domain_name: string | null;
  message_bounce_category: string | null;
  message_category: string | null;
  message_client_ip: string | null;
  message_created_at: string | null;
  message_esp_response: string | null;
  message_esp_server_type: string | null;
  message_outgoing_ip: string | null;
  message_recipient_mx_name: string | null;
  message_sender_email: string | null;
  message_subject: string | null;
  /** The unsubscribed topic of a `topic unsubscription`, otherwise `null`. */
  subscription_topic_id?: number | null;
};

/**
 * The endpoint returns up to 1000 suppressions per request; page through
 * larger lists by passing the last returned suppression's `id` as `last_id`.
 */
export type ListOptions = {
  /** Filters by exact address (case-insensitive). */
  email?: string;
  /** Start of the `created_at` window (inclusive), ISO 8601, e.g. `2024-01-01T00:00:00Z`. */
  start_time?: string;
  /** End of the `created_at` window (inclusive), ISO 8601, e.g. `2024-01-31T23:59:59Z`. */
  end_time?: string;
  /** Returns the suppressions after the one with this `id`, for cursor-based pagination. */
  last_id?: string;
  /**
   * Adds the contacts' unsubscriptions from single subscription topics, as
   * `topic unsubscription` rows. Needs a token that can read contacts.
   */
  include_topic_unsubscriptions?: boolean;
};

export type CreateSuppressionParams = {
  email: string;
  domain_id: number;
  sending_stream: Exclude<SuppressionSendingStream, "any">;
  type?: Exclude<SuppressionType, "topic unsubscription">;
};

export type CreateSuppressionResponse = {
  data: Suppression;
};
