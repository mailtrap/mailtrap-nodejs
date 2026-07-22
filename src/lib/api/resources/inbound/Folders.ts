import { AxiosInstance } from "axios";

import CONFIG from "../../../../config";
import { Folder, FolderParams } from "../../../../types/api/inbound/folders";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class FoldersApi {
  private client: AxiosInstance;

  private foldersURL: string;

  constructor(client: AxiosInstance) {
    this.client = client;
    this.foldersURL = `${GENERAL_ENDPOINT}/api/inbound/folders`;
  }

  /**
   * Get all inbound folders in the account.
   */
  public async getList() {
    return this.client.get<Folder[], Folder[]>(this.foldersURL);
  }

  /**
   * Get a single inbound folder by ID.
   */
  public async get(folderId: number) {
    const url = `${this.foldersURL}/${folderId}`;

    return this.client.get<Folder, Folder>(url);
  }

  /**
   * Create a new inbound folder.
   */
  public async create(params: FolderParams) {
    return this.client.post<Folder, Folder>(this.foldersURL, params);
  }

  /**
   * Update an inbound folder by ID.
   */
  public async update(folderId: number, params: FolderParams) {
    const url = `${this.foldersURL}/${folderId}`;

    return this.client.patch<Folder, Folder>(url, params);
  }

  /**
   * Delete an inbound folder by ID, along with all of its inboxes.
   */
  public async delete(folderId: number) {
    const url = `${this.foldersURL}/${folderId}`;

    return this.client.delete(url);
  }
}
