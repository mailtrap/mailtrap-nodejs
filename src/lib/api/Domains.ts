import { AxiosInstance } from "axios";

import DomainsApi from "./resources/Domains";

export default class DomainsBaseAPI {
  public get: DomainsApi["get"];

  public getList: DomainsApi["getList"];

  public create: DomainsApi["create"];

  public update: DomainsApi["update"];

  public delete: DomainsApi["delete"];

  public sendSetupInstructions: DomainsApi["sendSetupInstructions"];

  constructor(client: AxiosInstance, accountId: number) {
    const domains = new DomainsApi(client, accountId);
    this.get = domains.get.bind(domains);
    this.getList = domains.getList.bind(domains);
    this.create = domains.create.bind(domains);
    this.update = domains.update.bind(domains);
    this.delete = domains.delete.bind(domains);
    this.sendSetupInstructions = domains.sendSetupInstructions.bind(domains);
  }
}
