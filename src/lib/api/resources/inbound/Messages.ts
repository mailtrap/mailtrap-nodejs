import { AxiosInstance } from "axios";

import CONFIG from "../../../../config";
import {
  MessageDetails,
  MessagesListResponse,
  MessagesListParams,
  SendMessageParams,
  ForwardMessageParams,
  SendMessageResult,
} from "../../../../types/api/inbound/messages";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class MessagesApi {
  private client: AxiosInstance;

  private inboxesURL: string;

  constructor(client: AxiosInstance) {
    this.client = client;
    this.inboxesURL = `${GENERAL_ENDPOINT}/api/inbound/inboxes`;
  }

  private messagesURL(inboxId: number) {
    return `${this.inboxesURL}/${inboxId}/messages`;
  }

  /**
   * List messages in an inbox (paginated). Pass `last_id` from the previous
   * response to fetch the next page.
   */
  public async getList(inboxId: number, params?: MessagesListParams) {
    const url = params?.last_id
      ? `${this.messagesURL(inboxId)}?last_id=${encodeURIComponent(
          params.last_id
        )}`
      : this.messagesURL(inboxId);

    return this.client.get<MessagesListResponse, MessagesListResponse>(url);
  }

  /**
   * Get a single message with its full body and attachment download URLs.
   */
  public async get(inboxId: number, messageId: string) {
    const url = `${this.messagesURL(inboxId)}/${messageId}`;

    return this.client.get<MessageDetails, MessageDetails>(url);
  }

  /**
   * Delete a message by ID.
   */
  public async delete(inboxId: number, messageId: string) {
    const url = `${this.messagesURL(inboxId)}/${messageId}`;

    return this.client.delete(url);
  }

  /**
   * Reply to a message. Sends to the original sender.
   */
  public async reply(
    inboxId: number,
    messageId: string,
    params: SendMessageParams
  ) {
    const url = `${this.messagesURL(inboxId)}/${messageId}/reply`;

    return this.client.post<SendMessageResult, SendMessageResult>(url, params);
  }

  /**
   * Reply to a message and copy the original's other recipients.
   */
  public async replyAll(
    inboxId: number,
    messageId: string,
    params: SendMessageParams
  ) {
    const url = `${this.messagesURL(inboxId)}/${messageId}/reply_all`;

    return this.client.post<SendMessageResult, SendMessageResult>(url, params);
  }

  /**
   * Forward a message to new recipients (at least one `to` is required).
   */
  public async forward(
    inboxId: number,
    messageId: string,
    params: ForwardMessageParams
  ) {
    const url = `${this.messagesURL(inboxId)}/${messageId}/forward`;

    return this.client.post<SendMessageResult, SendMessageResult>(url, params);
  }
}
