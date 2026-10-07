import { AxiosInstance } from "axios";

import CONFIG from "../../../../config";
import {
  Thread,
  ThreadsListResponse,
  ThreadsListParams,
} from "../../../../types/api/inbound/threads";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class ThreadsApi {
  private client: AxiosInstance;

  private inboxesURL: string;

  constructor(client: AxiosInstance) {
    this.client = client;
    this.inboxesURL = `${GENERAL_ENDPOINT}/api/inbound/inboxes`;
  }

  private threadsURL(inboxId: number) {
    return `${this.inboxesURL}/${inboxId}/threads`;
  }

  /**
   * List threads in an inbox (paginated), optionally filtered by `search`.
   * Pass `last_id` from the previous response to fetch the next page.
   */
  public async getList(inboxId: number, options?: ThreadsListParams) {
    const params = {
      ...(options?.last_id && { last_id: options.last_id }),
      ...(options?.search && { search: options.search }),
    };

    return this.client.get<ThreadsListResponse, ThreadsListResponse>(
      this.threadsURL(inboxId),
      { params }
    );
  }

  /**
   * Get a single thread with its messages embedded (oldest first).
   */
  public async get(inboxId: number, threadId: string) {
    const url = `${this.threadsURL(inboxId)}/${threadId}`;

    return this.client.get<Thread, Thread>(url);
  }

  /**
   * Delete a thread by ID.
   */
  public async delete(inboxId: number, threadId: string) {
    const url = `${this.threadsURL(inboxId)}/${threadId}`;

    return this.client.delete(url);
  }
}
