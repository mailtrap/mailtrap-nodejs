import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  EmailTemplate,
  EmailTemplateCreateParams,
  EmailTemplateUpdateParams,
} from "../../../types/api/email-templates";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class EmailTemplatesApi {
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

    return this.client.get<EmailTemplate[], EmailTemplate[]>(url);
  }

  /**
   * Get a specific template by ID.
   */
  public async get(templateId: number) {
    const url = `${this.templatesURL}/${templateId}`;

    return this.client.get<EmailTemplate, EmailTemplate>(url);
  }

  /**
   * Create a new template.
   */
  public async create(params: EmailTemplateCreateParams) {
    const url = this.templatesURL;
    const data = { email_template: params };

    return this.client.post<EmailTemplate, EmailTemplate>(url, data);
  }

  /**
   * Update an existing template.
   */
  public async update(templateId: number, params: EmailTemplateUpdateParams) {
    const url = `${this.templatesURL}/${templateId}`;
    const data = { email_template: params };

    return this.client.patch<EmailTemplate, EmailTemplate>(url, data);
  }

  /**
   * Delete a template.
   */
  public async delete(templateId: number) {
    const url = `${this.templatesURL}/${templateId}`;

    return this.client.delete(url);
  }
}
