import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  ContactData,
  ContactResponse,
  ContactUpdateData,
} from "../../../types/api/contacts";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class ContactsApi {
  private client: AxiosInstance;

  private contactsURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.contactsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts`;
  }

  /**
   * Get a contact by ID or email.
   */
  public async get(idOrEmail: string) {
    const url = `${this.contactsURL}/${idOrEmail}`;

    return this.client.get<ContactResponse, ContactResponse>(url);
  }

  /**
   * Creates a new contact. When it is saved but its `subscription_topics`
   * are not, the request fails with `503` and a message naming the contact's
   * ID: send the topics again in an `update` of that contact.
   */
  public async create(contact: ContactData) {
    return this.client.post<ContactResponse, ContactResponse>(
      this.contactsURL,
      { contact }
    );
  }

  /**
   * Updates an existing contact by ID or email. When it is saved but its
   * `subscription_topics` are not, the request fails with `503`: send them
   * again in another update.
   */
  public async update(identifier: string, contact: ContactUpdateData) {
    const url = `${this.contactsURL}/${identifier}`;
    return this.client.patch<ContactResponse, ContactResponse>(url, {
      contact,
    });
  }

  /**
   * Deletes a contact by ID or email.
   */
  public async delete(identifier: string) {
    const url = `${this.contactsURL}/${identifier}`;
    return this.client.delete<ContactResponse, ContactResponse>(url);
  }
}
