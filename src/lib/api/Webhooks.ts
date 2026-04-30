import { AxiosInstance } from "axios";

import WebhooksApi from "./resources/Webhooks";

export default class WebhooksBaseAPI {
  private client: AxiosInstance;

  public getList: WebhooksApi["getList"];

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    const webhooks = new WebhooksApi(this.client, accountId);
    this.getList = webhooks.getList.bind(webhooks);
  }
}
