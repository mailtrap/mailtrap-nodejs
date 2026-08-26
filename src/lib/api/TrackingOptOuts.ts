import { AxiosInstance } from "axios";

import TrackingOptOutsApi from "./resources/TrackingOptOuts";

export default class TrackingOptOutsBaseAPI {
  public getList: TrackingOptOutsApi["getList"];

  public create: TrackingOptOutsApi["create"];

  public delete: TrackingOptOutsApi["delete"];

  constructor(client: AxiosInstance) {
    const trackingOptOuts = new TrackingOptOutsApi(client);
    this.getList = trackingOptOuts.getList.bind(trackingOptOuts);
    this.create = trackingOptOuts.create.bind(trackingOptOuts);
    this.delete = trackingOptOuts.delete.bind(trackingOptOuts);
  }
}
