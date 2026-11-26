import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  GetSubscriptionTopicResponse,
  ListSubscriptionTopicsParams,
  ListSubscriptionTopicsResponse,
} from "../../../types/api/subscription-topics";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

/**
 * Subscription Topics API. On an account without subscription topics, both
 * methods fail with a `MailtrapError` for the `403` response.
 */
export default class SubscriptionTopicsApi {
  private client: AxiosInstance;

  private subscriptionTopicsURL: string;

  constructor(client: AxiosInstance) {
    this.client = client;
    // Token-scoped: the account is resolved from the API token server-side,
    // so the path takes no account id.
    this.subscriptionTopicsURL = `${GENERAL_ENDPOINT}/api/subscription_topics`;
  }

  /**
   * Lists the account's subscription topics, leaving out deleted ones. The
   * result is wrapped in a `{ data, pagination }` envelope; pagination is
   * page-token based.
   */
  public async getList(params?: ListSubscriptionTopicsParams) {
    const url = this.subscriptionTopicsURL;
    const query = {
      ...(params?.per_page != null && { per_page: params.per_page }),
      ...(params?.token != null && { token: params.token }),
    };

    return this.client.get<
      ListSubscriptionTopicsResponse,
      ListSubscriptionTopicsResponse
    >(url, { params: query });
  }

  /**
   * Get a subscription topic by ID. A deleted topic is returned too, with
   * `deleted_at` set.
   */
  public async get(id: number) {
    const url = `${this.subscriptionTopicsURL}/${id}`;

    return this.client.get<
      GetSubscriptionTopicResponse,
      GetSubscriptionTopicResponse
    >(url);
  }
}
