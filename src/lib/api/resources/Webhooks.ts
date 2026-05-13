import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  CreateWebhookParams,
  CreateWebhookResponse,
  DeleteWebhookResponse,
  GetWebhookResponse,
  ListWebhooksResponse,
  UpdateWebhookParams,
  UpdateWebhookResponse,
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

  /**
   * Get a single webhook by ID. The `signing_secret` is not returned here —
   * it is only available in the create response.
   */
  public async get(id: number) {
    const url = `${this.webhooksURL}/${id}`;

    return this.client.get<GetWebhookResponse, GetWebhookResponse>(url);
  }

  /**
   * Update an existing webhook. Only `url`, `active`, `payload_format`, and
   * `event_types` can be changed; `webhook_type`, `sending_stream`, and
   * `domain_id` are immutable after creation.
   */
  public async update(id: number, params: UpdateWebhookParams) {
    const url = `${this.webhooksURL}/${id}`;
    const data = { webhook: params };

    return this.client.patch<UpdateWebhookResponse, UpdateWebhookResponse>(
      url,
      data
    );
  }

  /**
   * Permanently delete a webhook by ID. The deleted webhook is returned in
   * the response.
   */
  public async delete(id: number) {
    const url = `${this.webhooksURL}/${id}`;

    return this.client.delete<DeleteWebhookResponse, DeleteWebhookResponse>(
      url
    );
  }
}
