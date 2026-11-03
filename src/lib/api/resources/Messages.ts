import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

import {
  EmailHeaders,
  Message,
  MessageListOptions,
  MessageUpdateParams,
  Report,
  SpamReport,
} from "../../../types/api/messages";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class MessagesApi {
  private client: AxiosInstance;

  private messagesURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.messagesURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes`;
  }

  /**
   * Gets email message by given `messageId`.
   */
  public async showEmailMessage(sandboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${sandboxId}/messages/${messageId}`;

    return this.client.get<Message, Message>(url);
  }

  /**
   * Updates message attributes (right now only the is_read attribute is available for modification).
   */
  public async updateMessage(
    sandboxId: number,
    messageId: number,
    params: MessageUpdateParams
  ) {
    const url = `${this.messagesURL}/${sandboxId}/messages/${messageId}`;
    const data = { message: { is_read: params.isRead } };

    return this.client.patch<Message, Message>(url, data);
  }

  /**
   * Deletes message from sandbox.
   */
  public async deleteMessage(sandboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${sandboxId}/messages/${messageId}`;

    return this.client.delete<Message, Message>(url);
  }

  /**
   * Gets all messages in a sandbox.
   */
  public async get(sandboxId: number, options?: MessageListOptions) {
    const url = `${this.messagesURL}/${sandboxId}/messages`;

    const params = {
      ...(options?.last_id !== undefined && { last_id: options.last_id }),
      ...(options?.page !== undefined && { page: options.page }),
      ...(options?.search && { search: options.search }),
    };

    return this.client.get<Message[], Message[]>(url, { params });
  }

  /**
   * Forwards message to an email address. The email address must be confirmed by the recipient in advance.
   */
  public async forward(
    sandboxId: number,
    messageId: number,
    emailToForward: string
  ) {
    const url = `${this.messagesURL}/${sandboxId}/messages/${messageId}/forward`;
    const data = { email: emailToForward };

    return this.client.post<Message, Message>(url, data);
  }

  /**
   * Gets a brief spam report by given `messageId`.
   */
  public async getSpamScore(sandboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${sandboxId}/messages/${messageId}/spam_report`;

    return this.client.get<SpamReport, SpamReport>(url);
  }

  /**
   * Gets a brief HTML report by message ID.
   */
  public async getHtmlAnalysis(sandboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${sandboxId}/messages/${messageId}/analyze`;

    return this.client.get<Report, Report>(url);
  }

  /**
   * Gets text email body, if it exists.
   */
  public async getTextMessage(sandboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${sandboxId}/messages/${messageId}/body.txt`;

    return this.client.get<string, string>(url);
  }

  /**
   * Gets raw email body.
   */
  public async getRawMessage(sandboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${sandboxId}/messages/${messageId}/body.raw`;

    return this.client.get<string, string>(url);
  }

  /**
   * Gets HTML source of email.
   */
  public async getMessageHtmlSource(sandboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${sandboxId}/messages/${messageId}/body.htmlsource`;

    return this.client.get<string, string>(url);
  }

  /**
   * Gets formatted HTML email body. Not applicable for plain text emails.
   */
  public async getHtmlMessage(sandboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${sandboxId}/messages/${messageId}/body.html`;

    return this.client.get<string, string>(url);
  }

  /**
   * Gets email message in .eml format.
   */
  public async getMessageAsEml(sandboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${sandboxId}/messages/${messageId}/body.eml`;

    return this.client.get<string, string>(url);
  }

  /**
   * Gets mail headers of a message.
   */
  public async getMailHeaders(sandboxId: number, messageId: number) {
    const url = `${this.messagesURL}/${sandboxId}/messages/${messageId}/mail_headers`;

    return this.client.get<EmailHeaders, EmailHeaders>(url);
  }
}
