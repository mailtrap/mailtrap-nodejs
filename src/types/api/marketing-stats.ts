export type MarketingStatsSource = "campaigns" | "automations";

/**
 * Aggregated Email Marketing metrics. Rates are fractions from 0 to 1:
 * `delivery_rate` and `bounce_rate` are shares of `sent_count`, the other
 * rates are shares of `delivery_count`. Every count and rate is `0` when
 * nothing matched the filters.
 */
export type MarketingStats = {
  delivery_count: number;
  delivery_rate: number;
  bounce_count: number;
  bounce_rate: number;
  open_count: number;
  open_rate: number;
  click_count: number;
  click_rate: number;
  spam_count: number;
  spam_rate: number;
  unsubscription_count: number;
  unsubscription_rate: number;
  /** Delivered plus bounced messages. */
  sent_count: number;
};

export type MarketingStatsFilterParams = {
  /** Start of the period (inclusive), `YYYY-MM-DD`. */
  start_date: string;
  /** End of the period (inclusive), `YYYY-MM-DD`. */
  end_date: string;
  /** IDs of the sending domains to include, as returned by the Sending Domains endpoints. */
  sending_domain_ids?: number[];
  /** One source narrows the results to it; omit, or pass both, for all Email Marketing traffic. */
  sources?: MarketingStatsSource[];
  email_service_providers?: string[];
};

export type GetMarketingStatsResponse = {
  data: MarketingStats;
};
