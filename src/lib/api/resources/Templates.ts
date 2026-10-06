import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  Template,
  TemplateCreateParams,
  TemplateUpdateParams,
} from "../../../types/api/templates";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class TemplatesApi {
  private client: AxiosInstance;

  private templatesURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.templatesURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/email_templates`;
  }

  /**
   * Get a list of all templates.
   */
  public async getList() {
    const url = this.templatesURL;

    return this.client.get<Template[], Template[]>(url);
  }

  /**
   * Get a specific template by ID.
   */
  public async get(templateId: number) {
    const url = `${this.templatesURL}/${templateId}`;

    return this.client.get<Template, Template>(url);
  }

  /**
   * Create a new template.
   */
  public async create(params: TemplateCreateParams) {
    const url = this.templatesURL;
    const data = { email_template: params };

    return this.client.post<Template, Template>(url, data);
  }

  /**
   * Update an existing template.
   */
  public async update(templateId: number, params: TemplateUpdateParams) {
    const url = `${this.templatesURL}/${templateId}`;
    const data = { email_template: params };

    return this.client.patch<Template, Template>(url, data);
  }

  /**
   * Delete a template.
   */
  public async delete(templateId: number) {
    const url = `${this.templatesURL}/${templateId}`;

    return this.client.delete(url);
  }
}
