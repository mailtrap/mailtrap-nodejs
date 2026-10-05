import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  CreateTemplateParams,
  CreateTemplateResponse,
  DeleteTemplateResponse,
  GetTemplateResponse,
  ListTemplatesParams,
  ListTemplatesResponse,
  UpdateTemplateParams,
  UpdateTemplateResponse,
} from "../../../types/api/templates";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class TemplatesApi {
  private client: AxiosInstance;

  private templatesURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.templatesURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/templates`;
  }

  /**
   * Lists the account's templates. The result is wrapped in a
   * `{ data, pagination }` envelope; pagination is page-token based.
   */
  public async getList(params?: ListTemplatesParams) {
    const url = this.templatesURL;
    const query = {
      ...(params?.per_page !== undefined && { per_page: params.per_page }),
      ...(params?.token !== undefined && { token: params.token }),
    };

    return this.client.get<ListTemplatesResponse, ListTemplatesResponse>(url, {
      params: query,
    });
  }

  /**
   * Get a specific template by ID.
   */
  public async get(templateId: number) {
    const url = `${this.templatesURL}/${templateId}`;

    return this.client.get<GetTemplateResponse, GetTemplateResponse>(url);
  }

  /**
   * Create a new template.
   */
  public async create(params: CreateTemplateParams) {
    const url = this.templatesURL;

    return this.client.post<CreateTemplateResponse, CreateTemplateResponse>(
      url,
      params
    );
  }

  /**
   * Update an existing template.
   */
  public async update(templateId: number, params: UpdateTemplateParams) {
    const url = `${this.templatesURL}/${templateId}`;

    return this.client.patch<UpdateTemplateResponse, UpdateTemplateResponse>(
      url,
      params
    );
  }

  /**
   * Delete a template.
   */
  public async delete(templateId: number) {
    const url = `${this.templatesURL}/${templateId}`;

    return this.client.delete<DeleteTemplateResponse, DeleteTemplateResponse>(
      url
    );
  }
}
