import { PageTokenParams, Pagination } from "./common";

export type SubscriptionTopic = {
  id: number;
  name: string;
  description: string | null;
  /**
   * ID of the domain the topic is limited to, as returned by `client.domains`;
   * `null` when the topic covers every domain.
   */
  domain_id: number | null;
  /** Set on a deleted topic, which only `get` returns; the list leaves it out. */
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ListSubscriptionTopicsParams = PageTokenParams;

export type ListSubscriptionTopicsResponse = {
  data: SubscriptionTopic[];
  pagination: Pagination;
};

export type GetSubscriptionTopicResponse = {
  data: SubscriptionTopic;
};
