import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  CreateEmailCampaignParams,
  CreateEmailCampaignResponse,
  DeleteEmailCampaignResponse,
  EmailCampaignActionResponse,
  GetEmailCampaignResponse,
  GetEmailCampaignStatsParams,
  GetEmailCampaignStatsResponse,
  ListEmailCampaignsParams,
  ListEmailCampaignsResponse,
  ScheduleEmailCampaignParams,
  UpdateEmailCampaignParams,
  UpdateEmailCampaignResponse,
} from "../../../types/api/email-campaigns";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class EmailCampaignsApi {
  private client: AxiosInstance;

  private emailCampaignsURL: string;

  constructor(client: AxiosInstance) {
    this.client = client;
    // The Email Campaigns API is token-scoped, not account-scoped: the account
    // is resolved from the API token server-side, so the path is bare.
    this.emailCampaignsURL = `${GENERAL_ENDPOINT}/api/email_campaigns`;
  }

  /**
   * Lists the account's email campaigns, newest first. The result is wrapped in
   * a `{ data, pagination }` envelope; pagination is page-token based.
   */
  public async getList(params?: ListEmailCampaignsParams) {
    const url = this.emailCampaignsURL;
    const query = {
      ...(params?.per_page !== undefined && { per_page: params.per_page }),
      ...(params?.search !== undefined && { search: params.search }),
      ...(params?.token !== undefined && { token: params.token }),
    };

    return this.client.get<
      ListEmailCampaignsResponse,
      ListEmailCampaignsResponse
    >(url, { params: query });
  }

  /**
   * Create a new email campaign in the `draft` state. The campaign must
   * reference an existing sending domain via `domain_id` and include
   * a template `subject` within `template_attributes`.
   */
  public async create(params: CreateEmailCampaignParams) {
    const url = this.emailCampaignsURL;

    return this.client.post<
      CreateEmailCampaignResponse,
      CreateEmailCampaignResponse
    >(url, params);
  }

  /**
   * Get a single email campaign by ID.
   */
  public async get(id: number) {
    const url = `${this.emailCampaignsURL}/${id}`;

    return this.client.get<GetEmailCampaignResponse, GetEmailCampaignResponse>(
      url
    );
  }

  /**
   * Update an existing `draft` email campaign. Only the provided attributes
   * are changed (PATCH semantics).
   */
  public async update(id: number, params: UpdateEmailCampaignParams) {
    const url = `${this.emailCampaignsURL}/${id}`;

    return this.client.patch<
      UpdateEmailCampaignResponse,
      UpdateEmailCampaignResponse
    >(url, params);
  }

  /**
   * Delete an email campaign by ID. The campaign must not be in a sending
   * state. Returns nothing (204 No Content).
   */
  public async delete(id: number) {
    const url = `${this.emailCampaignsURL}/${id}`;

    return this.client.delete<
      DeleteEmailCampaignResponse,
      DeleteEmailCampaignResponse
    >(url);
  }

  /**
   * Start sending a `draft` campaign immediately. Runs full sending validation;
   * on failure the request fails with `422` and the campaign stays a `draft`.
   */
  public async start(id: number) {
    const url = `${this.emailCampaignsURL}/${id}/start`;

    return this.client.post<
      EmailCampaignActionResponse,
      EmailCampaignActionResponse
    >(url);
  }

  /**
   * Schedule a `draft` campaign to start sending at a future time. After
   * scheduling, the time is reported back in
   * `current_state_metadata.scheduled_at`.
   */
  public async schedule(id: number, params: ScheduleEmailCampaignParams) {
    const url = `${this.emailCampaignsURL}/${id}/schedule`;

    return this.client.post<
      EmailCampaignActionResponse,
      EmailCampaignActionResponse
    >(url, params);
  }

  /**
   * Cancel a `scheduled` campaign, removing the pending send job and returning
   * the campaign to the `draft` state.
   */
  public async cancel(id: number) {
    const url = `${this.emailCampaignsURL}/${id}/cancel`;

    return this.client.post<
      EmailCampaignActionResponse,
      EmailCampaignActionResponse
    >(url);
  }

  /**
   * Terminate a campaign that is currently sending (`started`, `queued`, or
   * `paused`), aborting the in-flight send.
   */
  public async terminate(id: number) {
    const url = `${this.emailCampaignsURL}/${id}/terminate`;

    return this.client.post<
      EmailCampaignActionResponse,
      EmailCampaignActionResponse
    >(url);
  }

  /**
   * Reset a `scheduled` campaign back to the `draft` state.
   */
  public async reset(id: number) {
    const url = `${this.emailCampaignsURL}/${id}/reset`;

    return this.client.post<
      EmailCampaignActionResponse,
      EmailCampaignActionResponse
    >(url);
  }

  /**
   * Get aggregated performance statistics for a single campaign. If the
   * campaign has never been started, all counts and rates are returned as `0`.
   * Use `start_date`/`end_date` (`YYYY-MM-DD`) to narrow the aggregation window.
   */
  public async getStats(id: number, params?: GetEmailCampaignStatsParams) {
    const url = `${this.emailCampaignsURL}/${id}/stats`;
    const query = {
      ...(params?.start_date !== undefined && {
        start_date: params.start_date,
      }),
      ...(params?.end_date !== undefined && { end_date: params.end_date }),
    };

    return this.client.get<
      GetEmailCampaignStatsResponse,
      GetEmailCampaignStatsResponse
    >(url, { params: query });
  }
}
