import axios from "axios";

import InboundAPI from "../../../lib/api/Inbound";

describe("lib/api/Inbound: ", () => {
  const inbound = new InboundAPI(axios.create());

  describe("class InboundAPI(): ", () => {
    it("exposes folders with CRUD methods.", () => {
      expect(inbound.folders).toHaveProperty("getList");
      expect(inbound.folders).toHaveProperty("get");
      expect(inbound.folders).toHaveProperty("create");
      expect(inbound.folders).toHaveProperty("update");
      expect(inbound.folders).toHaveProperty("delete");
    });

    it("exposes inboxes with CRUD methods.", () => {
      expect(inbound.inboxes).toHaveProperty("getList");
      expect(inbound.inboxes).toHaveProperty("get");
      expect(inbound.inboxes).toHaveProperty("create");
      expect(inbound.inboxes).toHaveProperty("update");
      expect(inbound.inboxes).toHaveProperty("delete");
    });

    it("exposes messages with list/get/delete and send methods.", () => {
      expect(inbound.messages).toHaveProperty("getList");
      expect(inbound.messages).toHaveProperty("get");
      expect(inbound.messages).toHaveProperty("delete");
      expect(inbound.messages).toHaveProperty("reply");
      expect(inbound.messages).toHaveProperty("replyAll");
      expect(inbound.messages).toHaveProperty("forward");
    });

    it("exposes threads with list/get/delete methods.", () => {
      expect(inbound.threads).toHaveProperty("getList");
      expect(inbound.threads).toHaveProperty("get");
      expect(inbound.threads).toHaveProperty("delete");
    });
  });
});
