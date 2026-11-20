import { AxiosInstance } from "axios";

import SubscriptionTopicsApi from "./resources/SubscriptionTopics";

export default class SubscriptionTopicsBaseAPI {
  public getList: SubscriptionTopicsApi["getList"];

  public get: SubscriptionTopicsApi["get"];

  constructor(client: AxiosInstance) {
    const subscriptionTopics = new SubscriptionTopicsApi(client);
    this.getList = subscriptionTopics.getList.bind(subscriptionTopics);
    this.get = subscriptionTopics.get.bind(subscriptionTopics);
  }
}
