import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  CreateWebhookParams,
  CreateWebhookResponse,
  ListWebhooksResponse,
} from "../../../types/api/webhooks";

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

  /**
   * Create a new webhook for the account. The response includes a
   * `signing_secret` that is used to verify webhook payload signatures —
   * it is only returned on creation, store it securely.
   */
  public async create(params: CreateWebhookParams) {
    const url = this.webhooksURL;
    const data = { webhook: params };

    return this.client.post<CreateWebhookResponse, CreateWebhookResponse>(
      url,
      data
    );
  }
}
