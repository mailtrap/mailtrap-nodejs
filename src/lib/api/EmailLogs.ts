import { AxiosInstance } from "axios";

import EmailLogsApi from "./resources/EmailLogs";

export default class EmailLogsBaseAPI {
  public getList: EmailLogsApi["getList"];

  public get: EmailLogsApi["get"];

  constructor(client: AxiosInstance, accountId: number) {
    const emailLogs = new EmailLogsApi(client, accountId);
    this.getList = emailLogs.getList.bind(emailLogs);
    this.get = emailLogs.get.bind(emailLogs);
  }
}
