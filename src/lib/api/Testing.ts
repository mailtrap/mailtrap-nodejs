import { AxiosInstance } from "axios";

import SandboxAPI from "./Sandbox";
import InboxesApi from "./resources/Inboxes";
import warnDeprecated from "../deprecation";

/** @deprecated Use `SandboxAPI` (`client.sandbox`) instead. */
export default class TestingAPI extends SandboxAPI {
  private inboxesApi: InboxesApi;

  constructor(client: AxiosInstance, accountId: number) {
    super(client, accountId);
    this.inboxesApi = new InboxesApi(client, accountId);
  }

  /** @deprecated Use `client.sandbox.sandboxes` instead. */
  get inboxes() {
    warnDeprecated("client.testing.inboxes", "client.sandbox.sandboxes");

    return this.inboxesApi;
  }
}
