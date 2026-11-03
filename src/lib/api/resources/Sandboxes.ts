import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

import { Sandbox, UpdateSandboxParams } from "../../../types/api/sandboxes";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class SandboxesApi {
  private client: AxiosInstance;

  private accountId: number;

  private sandboxesURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.accountId = accountId;
    this.sandboxesURL = `${GENERAL_ENDPOINT}/api/accounts/${this.accountId}/inboxes`;
  }

  /**
   * Creates a sandbox in a project.
   */
  public async create(projectId: number, sandboxName: string) {
    const url = `${GENERAL_ENDPOINT}/api/accounts/${this.accountId}/projects/${projectId}/inboxes`;
    const data = { inbox: { name: sandboxName } };

    return this.client.post<Sandbox, Sandbox>(url, data);
  }

  /**
   * Gets sandbox attributes by sandbox id.
   */
  public async getSandboxAttributes(sandboxId: number) {
    const url = `${this.sandboxesURL}/${sandboxId}`;

    return this.client.get<Sandbox, Sandbox>(url);
  }

  /**
   * Deletes a sandbox with all its emails.
   */
  public async delete(sandboxId: number) {
    const url = `${this.sandboxesURL}/${sandboxId}`;

    return this.client.delete<Sandbox, Sandbox>(url);
  }

  /**
   * Updates sandbox name, sandbox email username.
   */
  public async updateSandbox(sandboxId: number, params: UpdateSandboxParams) {
    const url = `${this.sandboxesURL}/${sandboxId}`;
    const data = {
      inbox: {
        name: params.name,
        email_username: params.emailUsername,
      },
    };

    return this.client.patch<Sandbox, Sandbox>(url, data);
  }

  /**
   * Deletes all messages (emails) from sandbox.
   */
  public async cleanSandbox(sandboxId: number) {
    const url = `${this.sandboxesURL}/${sandboxId}/clean`;

    return this.client.patch<Sandbox, Sandbox>(url);
  }

  /**
   * Marks all messages in the sandbox as read.
   */
  public async markAsRead(sandboxId: number) {
    const url = `${this.sandboxesURL}/${sandboxId}/all_read`;

    return this.client.patch<Sandbox, Sandbox>(url);
  }

  /**
   * Resets SMTP credentials of the sandbox.
   */
  public async resetCredentials(sandboxId: number) {
    const url = `${this.sandboxesURL}/${sandboxId}/reset_credentials`;

    return this.client.patch<Sandbox, Sandbox>(url);
  }

  /**
   * Turns the email address of the sandbox on/off.
   */
  public async enableEmailAddress(sandboxId: number) {
    const url = `${this.sandboxesURL}/${sandboxId}/toggle_email_username`;

    return this.client.patch<Sandbox, Sandbox>(url);
  }

  /**
   * Resets username of email address per sandbox.
   */
  public async resetEmailAddress(sandboxId: number) {
    const url = `${this.sandboxesURL}/${sandboxId}/reset_email_username`;

    return this.client.patch<Sandbox, Sandbox>(url);
  }

  /**
   * Gets a list of sandboxes.
   */
  public async getList() {
    return this.client.get<Sandbox[], Sandbox[]>(this.sandboxesURL);
  }
}
