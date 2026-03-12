import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

import {
  SendingStatGroup,
  SendingStats,
  StatsFilterParams,
} from "../../../types/api/stats";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

const GROUP_KEYS: Record<string, string> = {
  domains: "sending_domain_id",
  categories: "category",
  email_service_providers: "email_service_provider",
  date: "date",
};

type RawGroupedStatsItem = {
  stats: SendingStats;
  [key: string]: unknown;
};

export default class StatsApi {
  private client: AxiosInstance;

  private statsURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.statsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/stats`;
  }

  /**
   * Get aggregated sending stats.
   */
  public async get(params: StatsFilterParams) {
    const url = this.statsURL;

    return this.client.get<SendingStats, SendingStats>(url, {
      params: StatsApi.buildQueryParams(params),
    });
  }

  /**
   * Get sending stats grouped by domain.
   */
  public async byDomain(params: StatsFilterParams) {
    return this.groupedStats("domains", params);
  }

  /**
   * Get sending stats grouped by category.
   */
  public async byCategory(params: StatsFilterParams) {
    return this.groupedStats("categories", params);
  }

  /**
   * Get sending stats grouped by email service provider.
   */
  public async byEmailServiceProvider(params: StatsFilterParams) {
    return this.groupedStats("email_service_providers", params);
  }

  /**
   * Get sending stats grouped by date.
   */
  public async byDate(params: StatsFilterParams) {
    return this.groupedStats("date", params);
  }

  private async groupedStats(
    group: string,
    params: StatsFilterParams
  ): Promise<SendingStatGroup[]> {
    const url = `${this.statsURL}/${group}`;
    const groupKey = GROUP_KEYS[group];

    if (!groupKey) {
      throw new Error(`Unknown stats group: ${group}`);
    }

    const response = await this.client.get<
      RawGroupedStatsItem[],
      RawGroupedStatsItem[]
    >(url, {
      params: StatsApi.buildQueryParams(params),
    });

    return response.map((item) => ({
      name: groupKey,
      value: item[groupKey] as string | number,
      stats: item.stats,
    }));
  }

  private static buildQueryParams(
    params: StatsFilterParams
  ): Record<string, unknown> {
    const query: Record<string, unknown> = {
      start_date: params.start_date,
      end_date: params.end_date,
    };

    if (params.sending_domain_ids) {
      query.sending_domain_ids = params.sending_domain_ids;
    }
    if (params.sending_streams) {
      query.sending_streams = params.sending_streams;
    }
    if (params.categories) {
      query.categories = params.categories;
    }
    if (params.email_service_providers) {
      query.email_service_providers = params.email_service_providers;
    }

    return query;
  }
}
