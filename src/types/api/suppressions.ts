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

export type Suppression = {
  id: string;
  type: SuppressionType;
  created_at: string;
  email: string;
  sending_stream: "transactional" | "bulk";
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

export type ListOptions = {
  email?: string;
  /**
   * Adds the contacts' unsubscriptions from single subscription topics, as
   * `topic unsubscription` rows. Needs a token that can read contacts.
   */
  include_topic_unsubscriptions?: boolean;
};

export type CreateSuppressionParams = {
  email: string;
  domain_id: number;
  sending_stream: "transactional" | "bulk";
  type?: Exclude<SuppressionType, "topic unsubscription">;
};

export type CreateSuppressionResponse = {
  data: Suppression;
};
