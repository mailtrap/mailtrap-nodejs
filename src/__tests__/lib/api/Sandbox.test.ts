import axios from "axios";

import Sandbox from "../../../lib/api/Sandbox";
import Testing from "../../../lib/api/Testing";
import InboxesApi from "../../../lib/api/resources/Inboxes";
import warnDeprecated from "../../../lib/deprecation";

jest.mock("../../../lib/deprecation");

describe("lib/api/Sandbox: ", () => {
  const accountId = 100;
  const sandboxAPI = new Sandbox(axios, accountId);

  describe("class Sandbox(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(sandboxAPI).toHaveProperty("projects");
        expect(sandboxAPI).toHaveProperty("sandboxes");
        expect(sandboxAPI).toHaveProperty("messages");
        expect(sandboxAPI).toHaveProperty("attachments");
      });
    });
  });

  describe("class Testing() (deprecated): ", () => {
    const testingAPI = new Testing(axios, accountId);

    it("keeps the Sandbox resources.", () => {
      expect(testingAPI).toBeInstanceOf(Sandbox);
    });

    it("inboxes returns the same InboxesApi and warns.", () => {
      const { inboxes } = testingAPI;

      expect(inboxes).toBeInstanceOf(InboxesApi);
      expect(testingAPI.inboxes).toBe(inboxes);
      expect(warnDeprecated).toHaveBeenCalledWith(
        "client.testing.inboxes",
        "client.sandbox.sandboxes"
      );
    });
  });
});
