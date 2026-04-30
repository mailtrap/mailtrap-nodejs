import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import { SubAccount } from "../../../types/api/sub-accounts";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class SubAccountsApi {
  private client: AxiosInstance;

  private subAccountsURL: string;

  constructor(client: AxiosInstance, organizationId: number) {
    this.client = client;
    this.subAccountsURL = `${GENERAL_ENDPOINT}/api/organizations/${organizationId}/sub_accounts`;
  }

  /**
   * Get a list of sub accounts for the organization. Requires sub-account
   * management permissions.
   */
  public async getList() {
    const url = this.subAccountsURL;

    return this.client.get<SubAccount[], SubAccount[]>(url);
  }
}
