import { AxiosInstance } from "axios";

import AccountAccessesApi from "./resources/AccountAccesses";
import AccountsApi from "./resources/Accounts";
import ApiTokensApi from "./resources/ApiTokens";
import BillingApi from "./resources/Billing";
import PermissionsApi from "./resources/Permissions";

export default class GeneralAPI {
  public accounts: AccountsApi;

  private client: AxiosInstance;

  private accountId: number | null = null;

  private accountAccessesInstance: AccountAccessesApi | null = null;

  private permissionsInstance: PermissionsApi | null = null;

  private billingInstance: BillingApi | null = null;

  private apiTokensInstance: ApiTokensApi | null = null;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.accountId = accountId ?? null;
    this.accounts = new AccountsApi(client);

    // Only instantiate account-specific APIs if accountId is provided
    if (this.accountId !== null) {
      this.accountAccessesInstance = new AccountAccessesApi(
        client,
        this.accountId
      );
      this.permissionsInstance = new PermissionsApi(client, this.accountId);
    }
  }

  /**
   * Checks if the account ID is present.
   */
  private checkAccountIdPresence(): number {
    if (this.accountId === null) {
      throw new Error(
        "Account ID is required for this operation. Please provide accountId when creating GeneralAPI instance."
      );
    }
    return this.accountId;
  }

  /**
   * Singleton getter for Account Accesses API.
   */
  public get accountAccesses(): AccountAccessesApi {
    if (this.accountAccessesInstance === null) {
      const accountId = this.checkAccountIdPresence();
      this.accountAccessesInstance = new AccountAccessesApi(
        this.client,
        accountId
      );
    }

    return this.accountAccessesInstance;
  }

  /**
   * Singleton getter for Permissions API.
   */
  public get permissions(): PermissionsApi {
    if (this.permissionsInstance === null) {
      const accountId = this.checkAccountIdPresence();
      this.permissionsInstance = new PermissionsApi(this.client, accountId);
    }

    return this.permissionsInstance;
  }

  /**
   * Singleton getter for Billing API.
   */
  public get billing(): BillingApi {
    if (this.billingInstance === null) {
      const accountId = this.checkAccountIdPresence();
      this.billingInstance = new BillingApi(this.client, accountId);
    }

    return this.billingInstance;
  }

  /**
   * Singleton getter for API Tokens API.
   */
  public get apiTokens(): ApiTokensApi {
    if (this.apiTokensInstance === null) {
      const accountId = this.checkAccountIdPresence();
      this.apiTokensInstance = new ApiTokensApi(this.client, accountId);
    }

    return this.apiTokensInstance;
  }
}
