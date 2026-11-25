import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  CreateSuppressionParams,
  CreateSuppressionResponse,
  ListOptions,
  Suppression,
} from "../../../types/api/suppressions";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class SuppressionsApi {
  private client: AxiosInstance;

  private suppressionsURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.suppressionsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/suppressions`;
  }

  /**
   * List suppressions, optionally filtered by email or creation time. The endpoint returns up to 1000 suppressions
   * per request.
   */
  public async getList(options?: ListOptions) {
    const params = {
      ...(options?.email && { email: options.email }),
      ...(options?.start_time && { start_time: options.start_time }),
      ...(options?.end_time && { end_time: options.end_time }),
      ...(options?.last_id && { last_id: options.last_id }),
      ...(options?.include_topic_unsubscriptions && {
        include_topic_unsubscriptions: true,
      }),
    };

    return this.client.get<Suppression[], Suppression[]>(this.suppressionsURL, {
      params,
    });
  }

  /**
   * Add an email address to the account's suppression list. `type` defaults to
   * `manual import` when omitted.
   */
  public async create(params: CreateSuppressionParams) {
    return this.client.post<
      CreateSuppressionResponse,
      CreateSuppressionResponse
    >(this.suppressionsURL, params);
  }

  /**
   * Delete a suppression by ID.
   * Mailtrap will no longer prevent sending to this email unless it's recorded in suppressions again.
   */
  public async delete(id: string) {
    return this.client.delete<Suppression, Suppression>(
      `${this.suppressionsURL}/${id}`
    );
  }
}
