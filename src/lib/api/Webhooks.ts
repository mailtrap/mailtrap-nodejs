import { AxiosInstance } from "axios";

import WebhooksApi from "./resources/Webhooks";

export default class WebhooksBaseAPI {
  private client: AxiosInstance;

  public getList: WebhooksApi["getList"];

  public create: WebhooksApi["create"];

  public get: WebhooksApi["get"];

  public update: WebhooksApi["update"];

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    const webhooks = new WebhooksApi(this.client, accountId);
    this.getList = webhooks.getList.bind(webhooks);
    this.create = webhooks.create.bind(webhooks);
    this.get = webhooks.get.bind(webhooks);
    this.update = webhooks.update.bind(webhooks);
  }
}
