import { AxiosInstance } from "axios";

import PaginatedTemplatesApi from "./resources/PaginatedTemplates";

export default class PaginatedTemplatesBaseAPI {
  public get: PaginatedTemplatesApi["get"];

  public getList: PaginatedTemplatesApi["getList"];

  public create: PaginatedTemplatesApi["create"];

  public update: PaginatedTemplatesApi["update"];

  public delete: PaginatedTemplatesApi["delete"];

  constructor(client: AxiosInstance, accountId: number) {
    const templates = new PaginatedTemplatesApi(client, accountId);
    this.get = templates.get.bind(templates);
    this.getList = templates.getList.bind(templates);
    this.create = templates.create.bind(templates);
    this.update = templates.update.bind(templates);
    this.delete = templates.delete.bind(templates);
  }
}
