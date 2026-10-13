import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  GetMarketingStatsResponse,
  MarketingStatsFilterParams,
} from "../../../types/api/marketing-stats";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class MarketingStatsApi {
  private client: AxiosInstance;

  private marketingStatsURL: string;

  constructor(client: AxiosInstance) {
    this.client = client;
    // Token-scoped: the account is resolved from the API token server-side,
    // so the path takes no account id.
    this.marketingStatsURL = `${GENERAL_ENDPOINT}/api/marketing/stats`;
  }

  /**
   * Get aggregated Email Marketing stats (campaigns and automations) for a
   * date range, wrapped in a `{ data }` envelope. Email API/SMTP traffic is
   * reported by `stats.get` instead.
   */
  public async get(params: MarketingStatsFilterParams) {
    const query = {
      start_date: params.start_date,
      end_date: params.end_date,
      ...(params.sending_domain_ids && {
        sending_domain_ids: params.sending_domain_ids,
      }),
      ...(params.sources && { sources: params.sources }),
      ...(params.email_service_providers && {
        email_service_providers: params.email_service_providers,
      }),
    };

    return this.client.get<
      GetMarketingStatsResponse,
      GetMarketingStatsResponse
    >(this.marketingStatsURL, { params: query });
  }
}
