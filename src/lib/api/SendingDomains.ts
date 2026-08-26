import { AxiosInstance } from "axios";

import SendingDomainsApi from "./resources/SendingDomains";

export default class SendingDomainsBaseAPI {
  private client: AxiosInstance;

  public get: SendingDomainsApi["get"];

  public getList: SendingDomainsApi["getList"];

  public create: SendingDomainsApi["create"];

  public update: SendingDomainsApi["update"];

  public delete: SendingDomainsApi["delete"];

  public sendSetupInstructions: SendingDomainsApi["sendSetupInstructions"];

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    const sendingDomains = new SendingDomainsApi(this.client, accountId);
    this.get = sendingDomains.get.bind(sendingDomains);
    this.getList = sendingDomains.getList.bind(sendingDomains);
    this.create = sendingDomains.create.bind(sendingDomains);
    this.update = sendingDomains.update.bind(sendingDomains);
    this.delete = sendingDomains.delete.bind(sendingDomains);
    this.sendSetupInstructions =
      sendingDomains.sendSetupInstructions.bind(sendingDomains);
  }
}
