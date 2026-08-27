import { AxiosInstance } from "axios";

import SuppressionsApi from "./resources/Suppressions";

export default class SuppressionsBaseAPI {
  public getList: SuppressionsApi["getList"];

  public create: SuppressionsApi["create"];

  public delete: SuppressionsApi["delete"];

  constructor(client: AxiosInstance, accountId: number) {
    const suppressions = new SuppressionsApi(client, accountId);
    this.getList = suppressions.getList.bind(suppressions);
    this.create = suppressions.create.bind(suppressions);
    this.delete = suppressions.delete.bind(suppressions);
  }
}
