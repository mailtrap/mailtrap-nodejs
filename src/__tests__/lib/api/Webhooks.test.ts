import axios from "axios";

import WebhooksBaseAPI from "../../../lib/api/Webhooks";

describe("lib/api/Webhooks: ", () => {
  const accountId = 100;
  const webhooksAPI = new WebhooksBaseAPI(axios, accountId);

  describe("class WebhooksBaseAPI(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(webhooksAPI).toHaveProperty("getList");
        expect(webhooksAPI).toHaveProperty("create");
        expect(webhooksAPI).toHaveProperty("get");
      });
    });
  });
});
