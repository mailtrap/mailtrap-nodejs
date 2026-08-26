import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  CreateSendingDomainParams,
  SendingDomain,
  SendingDomainsResponse,
  UpdateSendingDomainParams,
} from "../../../types/api/sending-domains";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class SendingDomainsApi {
  private client: AxiosInstance;

  private sendingDomainsURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.sendingDomainsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/sending_domains`;
  }

  /**
   * Get a list of sending domains.
   * @returns Returns the list of sending domains for the account.
   */
  public async getList() {
    const url = this.sendingDomainsURL;

    return this.client.get<SendingDomainsResponse, SendingDomainsResponse>(url);
  }

  /**
   * Get a single sending domain by ID.
   * @param id Sending domain ID
   * @returns Returns a single sending domain
   */
  public async get(id: number) {
    const url = `${this.sendingDomainsURL}/${id}`;

    return this.client.get<SendingDomain, SendingDomain>(url);
  }

  /**
   * Create a new sending domain.
   */
  public async create(params: CreateSendingDomainParams) {
    const url = this.sendingDomainsURL;
    const data = { sending_domain: params };

    return this.client.post<SendingDomain, SendingDomain>(url, data);
  }

  /**
   * Update configuration settings for a sending domain.
   * @param id Sending domain ID
   * @param params Settings to update
   * @returns Returns the updated sending domain
   */
  public async update(id: number, params: UpdateSendingDomainParams) {
    const url = `${this.sendingDomainsURL}/${id}`;
    const data = { sending_domain: params };

    return this.client.patch<SendingDomain, SendingDomain>(url, data);
  }

  /**
   * Delete a sending domain by ID.
   * @param id Sending domain ID
   */
  public async delete(id: number) {
    const url = `${this.sendingDomainsURL}/${id}`;

    return this.client.delete(url);
  }

  /**
   * Send setup instructions for a sending domain to an email address.
   * @param id Sending domain ID
   * @param email Email address to send setup instructions to
   * @returns Returns a success message
   */
  public async sendSetupInstructions(id: number, email: string) {
    const url = `${this.sendingDomainsURL}/${id}/send_setup_instructions`;

    return this.client.post(url, { email });
  }
}
