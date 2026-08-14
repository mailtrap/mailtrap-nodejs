import { AxiosInstance } from "axios";

import EmailCampaignsApi from "./resources/EmailCampaigns";

export default class EmailCampaignsBaseAPI {
  private client: AxiosInstance;

  public getList: EmailCampaignsApi["getList"];

  public create: EmailCampaignsApi["create"];

  public get: EmailCampaignsApi["get"];

  public update: EmailCampaignsApi["update"];

  public delete: EmailCampaignsApi["delete"];

  public start: EmailCampaignsApi["start"];

  public schedule: EmailCampaignsApi["schedule"];

  public cancel: EmailCampaignsApi["cancel"];

  public terminate: EmailCampaignsApi["terminate"];

  public reset: EmailCampaignsApi["reset"];

  public getStats: EmailCampaignsApi["getStats"];

  constructor(client: AxiosInstance) {
    this.client = client;
    const emailCampaigns = new EmailCampaignsApi(this.client);
    this.getList = emailCampaigns.getList.bind(emailCampaigns);
    this.create = emailCampaigns.create.bind(emailCampaigns);
    this.get = emailCampaigns.get.bind(emailCampaigns);
    this.update = emailCampaigns.update.bind(emailCampaigns);
    this.delete = emailCampaigns.delete.bind(emailCampaigns);
    this.start = emailCampaigns.start.bind(emailCampaigns);
    this.schedule = emailCampaigns.schedule.bind(emailCampaigns);
    this.cancel = emailCampaigns.cancel.bind(emailCampaigns);
    this.terminate = emailCampaigns.terminate.bind(emailCampaigns);
    this.reset = emailCampaigns.reset.bind(emailCampaigns);
    this.getStats = emailCampaigns.getStats.bind(emailCampaigns);
  }
}
