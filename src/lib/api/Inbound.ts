import { AxiosInstance } from "axios";

import FoldersApi from "./resources/inbound/Folders";
import ForwardRulesApi from "./resources/inbound/ForwardRules";
import InboxesApi from "./resources/inbound/Inboxes";
import MessagesApi from "./resources/inbound/Messages";
import ThreadsApi from "./resources/inbound/Threads";

export default class InboundAPI {
  public folders: FoldersApi;

  public forwardRules: ForwardRulesApi;

  public inboxes: InboxesApi;

  public messages: MessagesApi;

  public threads: ThreadsApi;

  constructor(client: AxiosInstance) {
    this.folders = new FoldersApi(client);
    this.forwardRules = new ForwardRulesApi(client);
    this.inboxes = new InboxesApi(client);
    this.messages = new MessagesApi(client);
    this.threads = new ThreadsApi(client);
  }
}
