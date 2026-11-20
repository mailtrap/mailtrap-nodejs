import { Pagination } from "./common";

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

export type ListSubscriptionTopicsParams = {
  /**
   * Page number to retrieve (page-token pagination). Defaults to 1. Accepts
   * `pagination.next_token` as is; `null` is the same as leaving it out.
   */
  token?: number | null;
  /**
   * Number of topics per page. Maximum 100, defaults to 50. Pass the same
   * value on every page.
   */
  per_page?: number | null;
};

export type ListSubscriptionTopicsResponse = {
  data: SubscriptionTopic[];
  pagination: Pagination;
};

export type GetSubscriptionTopicResponse = {
  data: SubscriptionTopic;
};
