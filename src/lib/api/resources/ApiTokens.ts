import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
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
}
