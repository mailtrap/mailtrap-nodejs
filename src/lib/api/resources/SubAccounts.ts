import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  CreateSubAccountParams,
  DeleteSubAccountResponse,
  SubAccount,
} from "../../../types/api/sub-accounts";

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

  /**
   * Create a new sub account under the organization. Requires sub-account
   * management permissions.
   */
  public async create(params: CreateSubAccountParams) {
    const url = this.subAccountsURL;
    const data = { account: params };

    return this.client.post<SubAccount, SubAccount>(url, data);
  }

  /**
   * Delete a sub account by ID. Requires sub-account management permissions
   * for the organization. The deletion is permanent and removes all sub-account
   * data; deleting the organization's last sub account deletes the organization
   * as well. A repeated call for the same ID fails with `404`. Rate limited to
   * 10 requests per minute per organization. Returns nothing (204 No Content).
   */
  public async delete(subAccountId: number) {
    const url = `${this.subAccountsURL}/${subAccountId}`;

    return this.client.delete<
      DeleteSubAccountResponse,
      DeleteSubAccountResponse
    >(url);
  }
}
