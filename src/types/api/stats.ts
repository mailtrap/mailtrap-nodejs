export type SendingStats = {
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
};

export type SendingStatGroup = {
  name: string;
  value: string | number;
  stats: SendingStats;
};

export type StatsFilterParams = {
  start_date: string;
  end_date: string;
  sending_domain_ids?: number[];
  sending_streams?: string[];
  categories?: string[];
  email_service_providers?: string[];
};
