import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  ApiToken,
  ApiTokenWithToken,
  CreateApiTokenRequest,
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
   * Create a new API token for the account with the given name and resource permissions.
   * The full token value is returned only in the response of this call — store it securely.
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
   */
  public async reset(id: number) {
    const url = `${this.apiTokensURL}/${id}/reset`;

    return this.client.post<ApiTokenWithToken, ApiTokenWithToken>(url);
  }
}
