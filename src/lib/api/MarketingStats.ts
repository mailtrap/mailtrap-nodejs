import { AxiosInstance } from "axios";

import MarketingStatsApi from "./resources/MarketingStats";

export default class MarketingStatsBaseAPI {
  public get: MarketingStatsApi["get"];

  constructor(client: AxiosInstance) {
    const marketingStats = new MarketingStatsApi(client);
    this.get = marketingStats.get.bind(marketingStats);
  }
}
