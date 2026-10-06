import { AxiosInstance } from "axios";

import EmailTemplatesApi from "./resources/EmailTemplates";

export default class EmailTemplatesBaseAPI {
  public get: EmailTemplatesApi["get"];

  public getList: EmailTemplatesApi["getList"];

  public create: EmailTemplatesApi["create"];

  public update: EmailTemplatesApi["update"];

  public delete: EmailTemplatesApi["delete"];

  constructor(client: AxiosInstance, accountId: number) {
    const templates = new EmailTemplatesApi(client, accountId);
    this.get = templates.get.bind(templates);
    this.getList = templates.getList.bind(templates);
    this.create = templates.create.bind(templates);
    this.update = templates.update.bind(templates);
    this.delete = templates.delete.bind(templates);
  }
}
