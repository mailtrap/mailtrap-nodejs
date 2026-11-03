import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  CreateDomainParams,
  Domain,
  DomainsResponse,
  UpdateDomainParams,
} from "../../../types/api/domains";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class DomainsApi {
  private client: AxiosInstance;

  private domainsURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.domainsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/sending_domains`;
  }

  /**
   * Get a list of domains.
   * @returns Returns the list of domains for the account.
   */
  public async getList() {
    const url = this.domainsURL;

    return this.client.get<DomainsResponse, DomainsResponse>(url);
  }

  /**
   * Get a single domain by ID.
   * @param id Domain ID
   * @returns Returns a single domain
   */
  public async get(id: number) {
    const url = `${this.domainsURL}/${id}`;

    return this.client.get<Domain, Domain>(url);
  }

  /**
   * Create a new domain.
   */
  public async create(params: CreateDomainParams) {
    const url = this.domainsURL;
    const data = { sending_domain: params };

    return this.client.post<Domain, Domain>(url, data);
  }

  /**
   * Update configuration settings for a domain.
   * @param id Domain ID
   * @param params Settings to update
   * @returns Returns the updated domain
   */
  public async update(id: number, params: UpdateDomainParams) {
    const url = `${this.domainsURL}/${id}`;
    const data = { sending_domain: params };

    return this.client.patch<Domain, Domain>(url, data);
  }

  /**
   * Delete a domain by ID.
   * @param id Domain ID
   */
  public async delete(id: number) {
    const url = `${this.domainsURL}/${id}`;

    return this.client.delete(url);
  }

  /**
   * Send setup instructions for a domain to an email address.
   * @param id Domain ID
   * @param email Email address to send setup instructions to
   * @returns Returns a success message
   */
  public async sendSetupInstructions(id: number, email: string) {
    const url = `${this.domainsURL}/${id}/send_setup_instructions`;

    return this.client.post(url, { email });
  }
}
