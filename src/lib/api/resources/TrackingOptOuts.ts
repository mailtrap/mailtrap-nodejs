import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  CreateTrackingOptOutParams,
  CreateTrackingOptOutResponse,
  ListTrackingOptOutsParams,
  ListTrackingOptOutsResponse,
  TrackingOptOut,
} from "../../../types/api/tracking-opt-outs";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class TrackingOptOutsApi {
  private client: AxiosInstance;

  private trackingOptOutsURL: string;

  constructor(client: AxiosInstance) {
    this.client = client;
    this.trackingOptOutsURL = `${GENERAL_ENDPOINT}/api/tracking_opt_outs`;
  }

  /**
   * List email addresses that have opted out of open and click tracking.
   * The endpoint returns up to 1000 records per request; pass the previous
   * response's `last_id` to fetch the next page.
   */
  public async getList(params?: ListTrackingOptOutsParams) {
    const query = {
      ...(params?.email && { email: params.email }),
      ...(params?.start_time && { start_time: params.start_time }),
      ...(params?.end_time && { end_time: params.end_time }),
      ...(params?.last_id && { last_id: params.last_id }),
    };

    return this.client.get<
      ListTrackingOptOutsResponse,
      ListTrackingOptOutsResponse
    >(this.trackingOptOutsURL, { params: query });
  }

  /**
   * Add an email address to the tracking opt-out list for a sending domain.
   */
  public async create(params: CreateTrackingOptOutParams) {
    return this.client.post<
      CreateTrackingOptOutResponse,
      CreateTrackingOptOutResponse
    >(this.trackingOptOutsURL, params);
  }

  /**
   * Remove an email address from the tracking opt-out list so open and click
   * tracking can apply again.
   */
  public async delete(id: string) {
    return this.client.delete<TrackingOptOut, TrackingOptOut>(
      `${this.trackingOptOutsURL}/${id}`
    );
  }
}
