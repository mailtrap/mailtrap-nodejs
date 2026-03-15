import { AxiosInstance } from "axios";
import qs from "qs";

import CONFIG from "../../../config";
import {
  EmailLogsList,
  EmailLogsListParams,
  EmailLogMessageDetails,
} from "../../../types/api/email-logs";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

/**
 * Serialize query params for email logs list. Uses qs for deepObject-style
 * bracket notation (e.g. filters[sent_after]=..., filters[to][operator]=...)
 * with bracket notation for arrays (Rails-style, e.g. filters[category][value][]=foo).
 */
function serializeEmailLogsParams(params: EmailLogsListParams): string {
  const query: Record<string, unknown> = {};
  if (params.search_after != null) {
    query.search_after = params.search_after;
  }
  if (params.filters && typeof params.filters === "object") {
    query.filters = params.filters;
  }
  return qs.stringify(query, {
    arrayFormat: "brackets",
    encode: true,
    encodeValuesOnly: true,
  });
}

export default class EmailLogsApi {
  private client: AxiosInstance;

  private emailLogsURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.emailLogsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/email_logs`;
  }

  /**
   * List email logs (paginated). Results are ordered by sent_at descending.
   * Use search_after with next_page_cursor from the previous response for the next page.
   */
  public async getList(params?: EmailLogsListParams) {
    const url =
      params && (params.search_after || params.filters)
        ? `${this.emailLogsURL}?${serializeEmailLogsParams(params)}`
        : this.emailLogsURL;

    return this.client.get<EmailLogsList, EmailLogsList>(url);
  }

  /**
   * Get a single email log message by message ID.
   */
  public async get(sendingMessageId: string) {
    const url = `${this.emailLogsURL}/${sendingMessageId}`;

    return this.client.get<EmailLogMessageDetails, EmailLogMessageDetails>(url);
  }
}
