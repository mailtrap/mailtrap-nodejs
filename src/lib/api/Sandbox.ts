import { AxiosInstance } from "axios";

import ProjectsApi from "./resources/Projects";
import SandboxesApi from "./resources/Sandboxes";
import MessagesApi from "./resources/Messages";
import AttachmentsApi from "./resources/Attachments";

export default class SandboxAPI {
  public projects: ProjectsApi;

  public sandboxes: SandboxesApi;

  public messages: MessagesApi;

  public attachments: AttachmentsApi;

  constructor(client: AxiosInstance, accountId: number) {
    this.projects = new ProjectsApi(client, accountId);
    this.sandboxes = new SandboxesApi(client, accountId);
    this.messages = new MessagesApi(client, accountId);
    this.attachments = new AttachmentsApi(client, accountId);
  }
}
