import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  ContactList,
  ContactListOptions,
  ContactListsListOptions,
} from "../../../types/api/contactlist";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class ContactListsApi {
  private client: AxiosInstance;

  private contactListsURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.contactListsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists`;
  }

  /**
   * Get all contact lists. Optionally filter by name via a case-insensitive
   * prefix match with `search`.
   */
  public async getList(options?: ContactListsListOptions) {
    const params = {
      ...(options?.search && { search: options.search }),
    };

    return this.client.get<ContactList[], ContactList[]>(this.contactListsURL, {
      params,
    });
  }

  /**
   * Get a contact list by `listId`.
   */
  public async get(listId: number) {
    const url = `${this.contactListsURL}/${listId}`;

    return this.client.get<ContactList, ContactList>(url);
  }

  /**
   * Creates a new contact list.
   */
  public async create(data: ContactListOptions) {
    return this.client.post<ContactList, ContactList>(
      this.contactListsURL,
      data
    );
  }

  /**
   * Updates an existing contact list by `listId`.
   */
  public async update(listId: number, data: ContactListOptions) {
    const url = `${this.contactListsURL}/${listId}`;

    return this.client.patch<ContactList, ContactList>(url, data);
  }

  /**
   * Deletes a contact list by ID.
   */
  public async delete(listId: number) {
    const url = `${this.contactListsURL}/${listId}`;

    return this.client.delete(url);
  }
}
