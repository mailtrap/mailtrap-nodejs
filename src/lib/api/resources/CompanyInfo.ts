import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  CompanyInfoResponse,
  CreateCompanyInfoParams,
  UpdateCompanyInfoParams,
} from "../../../types/api/company-info";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class CompanyInfoApi {
  private client: AxiosInstance;

  private domainsURL: string;

  constructor(client: AxiosInstance) {
    this.client = client;
    this.domainsURL = `${GENERAL_ENDPOINT}/api/domains`;
  }

  /**
   * Get the company info associated with a sending domain.
   * @param domainId Sending domain ID
   * @returns Returns the company info of the sending domain
   */
  public async get(domainId: number) {
    const url = this.companyInfoURL(domainId);

    return this.client.get<CompanyInfoResponse, CompanyInfoResponse>(url);
  }

  /**
   * Create the company info for a sending domain. Company info is required for
   * domain compliance verification.
   * @param domainId Sending domain ID
   * @param params Company info attributes
   * @returns Returns the created company info
   */
  public async create(domainId: number, params: CreateCompanyInfoParams) {
    const url = this.companyInfoURL(domainId);
    const data = { company_info: params };

    return this.client.post<CompanyInfoResponse, CompanyInfoResponse>(
      url,
      data
    );
  }

  /**
   * Update the company info for a sending domain. Only the fields provided are
   * updated.
   * @param domainId Sending domain ID
   * @param params Company info attributes to update
   * @returns Returns the updated company info
   */
  public async update(domainId: number, params: UpdateCompanyInfoParams) {
    const url = this.companyInfoURL(domainId);
    const data = { company_info: params };

    return this.client.patch<CompanyInfoResponse, CompanyInfoResponse>(
      url,
      data
    );
  }

  private companyInfoURL(domainId: number) {
    return `${this.domainsURL}/${domainId}/company_info`;
  }
}
