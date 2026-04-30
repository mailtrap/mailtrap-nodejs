+import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import { ListWebhooksResponse } from "../../../types/api/webhooks";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class WebhooksApi {
  private client: AxiosInstance;

  private webhooksURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.webhooksURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/webhooks`;
  }

  /**
   * Returns all webhooks for the account.
   */
  public async getList() {
    const url = this.webhooksURL;

    return this.client.get<ListWebhooksResponse, ListWebhooksResponse>(url);
  }
}
