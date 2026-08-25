import { AxiosInstance } from "axios";

import CompanyInfoApi from "./resources/CompanyInfo";

export default class CompanyInfoBaseAPI {
  private client: AxiosInstance;

  public get: CompanyInfoApi["get"];

  public create: CompanyInfoApi["create"];

  public update: CompanyInfoApi["update"];

  constructor(client: AxiosInstance) {
    this.client = client;
    const companyInfo = new CompanyInfoApi(this.client);
    this.get = companyInfo.get.bind(companyInfo);
    this.create = companyInfo.create.bind(companyInfo);
    this.update = companyInfo.update.bind(companyInfo);
  }
}
