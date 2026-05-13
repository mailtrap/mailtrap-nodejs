import { AxiosInstance } from "axios";

import SubAccountsApi from "./resources/SubAccounts";

export default class OrganizationsBaseAPI {
  public subAccounts: SubAccountsApi;

  constructor(client: AxiosInstance, organizationId: number) {
    this.subAccounts = new SubAccountsApi(client, organizationId);
  }
}
