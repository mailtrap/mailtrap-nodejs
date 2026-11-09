import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

import { Attachment } from "../../../types/api/attachments";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class AttachmentsApi {
  private client: AxiosInstance;

  private sandboxesURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.sandboxesURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes`;
  }

  /**
   * Get message attachments by `sandboxId` and `messageId`.
   */
  public async getList(sandboxId: number, messageId: number) {
    const url = `${this.sandboxesURL}/${sandboxId}/messages/${messageId}/attachments`;

    return this.client.get<Attachment[], Attachment[]>(url);
  }

  /**
   * Get message attachments by `sandboxId`.`messageId` and `attachmentId`.
   */
  public async get(sandboxId: number, messageId: number, attachmentId: number) {
    const url = `${this.sandboxesURL}/${sandboxId}/messages/${messageId}/attachments/${attachmentId}`;

    return this.client.get<Attachment, Attachment>(url);
  }
}
