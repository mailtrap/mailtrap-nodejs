export type SubscriptionTopicStatus = "subscribed" | "unsubscribed";

/** A contact's status for one subscription topic on one domain. */
export interface ContactSubscriptionTopic {
  /** ID of the topic, as returned by `client.subscriptionTopics`. */
  subscription_topic_id: number;
  /** ID of the domain, as returned by `client.domains`. */
  domain_id: number;
  status: SubscriptionTopicStatus;
}

export interface Contact {
  id: string;
  email: string;
  created_at: number;
  updated_at: number;
  list_ids: number[];
  status: "subscribed" | "unsubscribed";
  fields: Record<string, string | number | boolean>;
  /**
   * One entry per topic and domain. Absent on an account without
   * subscription topics; `null` when they couldn't be read, so retry later.
   */
  subscription_topics?: ContactSubscriptionTopic[] | null;
}

export interface ContactData {
  email: string;
  fields?: Record<string, string | number | boolean>;
  list_ids?: number[];
  unsubscribed?: boolean;
  /**
   * Topic and domain pairs to set; the pairs left out keep their status. The
   * request fails with `422` on an account without subscription topics.
   */
  subscription_topics?: ContactSubscriptionTopic[];
}

export interface ContactUpdateData extends ContactData {
  list_ids_included?: number[];
  list_ids_excluded?: number[];
}

export interface ContactResponse {
  data: Contact;
}
