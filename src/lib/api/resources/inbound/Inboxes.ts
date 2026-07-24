import { AxiosInstance } from "axios";

import CONFIG from "../../../../config";
import {
  Inbox,
  CreateInboxParams,
  UpdateInboxParams,
} from "../../../../types/api/inbound/inboxes";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class InboxesApi {
  private client: AxiosInstance;

  private foldersURL: string;

  constructor(client: AxiosInstance) {
    this.client = client;
    this.foldersURL = `${GENERAL_ENDPOINT}/api/inbound/folders`;
  }

  private inboxesURL(folderId: number) {
    return `${this.foldersURL}/${folderId}/inboxes`;
  }

  /**
   * Get all inboxes in a folder.
   */
  public async getList(folderId: number) {
    return this.client.get<Inbox[], Inbox[]>(this.inboxesURL(folderId));
  }

  /**
   * Get a single inbox by ID.
   */
  public async get(folderId: number, inboxId: number) {
    const url = `${this.inboxesURL(folderId)}/${inboxId}`;

    return this.client.get<Inbox, Inbox>(url);
  }

  /**
   * Create a new inbox in a folder.
   */
  public async create(folderId: number, params: CreateInboxParams) {
    return this.client.post<Inbox, Inbox>(this.inboxesURL(folderId), params);
  }

  /**
   * Update an inbox by ID.
   */
  public async update(
    folderId: number,
    inboxId: number,
    params: UpdateInboxParams
  ) {
    const url = `${this.inboxesURL(folderId)}/${inboxId}`;

    return this.client.patch<Inbox, Inbox>(url, params);
  }

  /**
   * Delete an inbox by ID.
   */
  public async delete(folderId: number, inboxId: number) {
    const url = `${this.inboxesURL(folderId)}/${inboxId}`;

    return this.client.delete(url);
  }
}
