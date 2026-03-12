import { AxiosInstance } from "axios";

import StatsApi from "./resources/Stats";

export default class StatsBaseAPI {
  public get: StatsApi["get"];

  public byDomain: StatsApi["byDomain"];

  public byCategory: StatsApi["byCategory"];

  public byEmailServiceProvider: StatsApi["byEmailServiceProvider"];

  public byDate: StatsApi["byDate"];

  constructor(client: AxiosInstance, accountId: number) {
    const stats = new StatsApi(client, accountId);
    this.get = stats.get.bind(stats);
    this.byDomain = stats.byDomain.bind(stats);
    this.byCategory = stats.byCategory.bind(stats);
    this.byEmailServiceProvider = stats.byEmailServiceProvider.bind(stats);
    this.byDate = stats.byDate.bind(stats);
  }
}
