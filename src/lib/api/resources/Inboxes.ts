import SandboxesApi from "./Sandboxes";
import warnDeprecated from "../../deprecation";

import { UpdateSandboxParams } from "../../../types/api/sandboxes";

/** @deprecated Use `SandboxesApi` (`client.sandbox.sandboxes`) instead. */
export default class InboxesApi extends SandboxesApi {
  /** @deprecated Use `getSandboxAttributes` instead. */
  public async getInboxAttributes(inboxId: number) {
    warnDeprecated(
      "client.testing.inboxes.getInboxAttributes",
      "client.sandbox.sandboxes.getSandboxAttributes"
    );

    return this.getSandboxAttributes(inboxId);
  }

  /** @deprecated Use `updateSandbox` instead. */
  public async updateInbox(inboxId: number, params: UpdateSandboxParams) {
    warnDeprecated(
      "client.testing.inboxes.updateInbox",
      "client.sandbox.sandboxes.updateSandbox"
    );

    return this.updateSandbox(inboxId, params);
  }

  /** @deprecated Use `cleanSandbox` instead. */
  public async cleanInbox(inboxId: number) {
    warnDeprecated(
      "client.testing.inboxes.cleanInbox",
      "client.sandbox.sandboxes.cleanSandbox"
    );

    return this.cleanSandbox(inboxId);
  }
}
