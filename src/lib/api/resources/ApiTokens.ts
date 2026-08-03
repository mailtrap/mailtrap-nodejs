import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  ApiToken,
  ApiTokenWithToken,
  CreateApiTokenRequest,
  ResetApiTokenRequest,
} from "../../../types/api/api-tokens";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class ApiTokensApi {
  private client: AxiosInstance;

  private apiTokensURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.apiTokensURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/api_tokens`;
  }

  /**
   * List all API tokens visible to the current API token.
   * The full token value is never returned here — only `last_4_digits`.
   */
  public async getList() {
    const url = this.apiTokensURL;

    return this.client.get<ApiToken[], ApiToken[]>(url);
  }

  /**
   * Create a new API token for the account with the given name and resource permissions.
   * The full token value is returned only in the response of this call — store it securely.
   * Unless `expires_at` is provided, the token expiration falls back to the server
   * default (a 1-year default is being rolled out); pass `expires_at: null` for a
   * token that never expires.
   */
  public async create(params: CreateApiTokenRequest) {
    const url = this.apiTokensURL;

    return this.client.post<ApiTokenWithToken, ApiTokenWithToken>(url, params);
  }

  /**
   * Get a single API token by ID. The full token value is not returned —
   * only `last_4_digits` is available outside of create/reset responses.
   */
  public async get(id: number) {
    const url = `${this.apiTokensURL}/${id}`;

    return this.client.get<ApiToken, ApiToken>(url);
  }

  /**
   * Reset an API token: expires the existing token and returns a new one with
   * the same permissions. The new token value is returned only in this response —
   * store it securely. Only tokens that have not already been reset can be reset.
   * Unless `expires_at` is provided, the new token expiration falls back to the
   * server default (a 1-year default is being rolled out); pass `expires_at: null`
   * for a token that never expires.
   */
  public async reset(id: number, params?: ResetApiTokenRequest) {
    const url = `${this.apiTokensURL}/${id}/reset`;

    if (params && "expires_at" in params) {
      return this.client.post<ApiTokenWithToken, ApiTokenWithToken>(
        url,
        params
      );
    }

    return this.client.post<ApiTokenWithToken, ApiTokenWithToken>(url);
  }

  /**
   * Permanently delete an API token by ID.
   */
  public async delete(id: number) {
    const url = `${this.apiTokensURL}/${id}`;

    return this.client.delete(url);
  }
}
